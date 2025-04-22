import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import moment from "moment";
import { ErrorAlert } from "../../Common/Alert";
import Tooltiphome from "../../Common/Tooltiphome";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import * as MedicalData from "../../store/slice/manageMedicalSlice";
import * as AllRedux from "../../store/slice/medicalFacilitySlice";
import AWS from "../../AWS/aws-config";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Sorting,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import { Device } from "@twilio/voice-sdk";
import * as Calling from "../../store/slice/admindataSlice";

function MedicalClientManage() {
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const dispatch = useDispatch();
  const location = useLocation();
  const productData = location.state;
  const s3 = new AWS.S3();
  const [getLoading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [device, setDevice] = useState(null);
  const [callButton, setCallButton] = useState("null");
  const navigate = useNavigate();
  const [logMessages, setLogMessages] = useState([]);
  const [call, setCall] = useState(null);

  const [files, setFiles] = useState([]);
  const [randomName, setRandomName] = useState([]);

  useEffect(() => {
    setCallButton(sessionStorage.getItem("setCallButton"));
  }, [sessionStorage.getItem("setCallButton")]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          "https://denim-iguana-5356.twil.io/capability-token"
        );
        const data = await response.json();
        setToken(data.token);
        sessionStorage.setItem("twilio_token", data.token);
        sessionStorage.setItem("setCallButton", true);
      } catch (error) {
        //
        addLogMessage(
          "An error occurred. See your browser console for more information."
        );
      }
    };
    if (!sessionStorage.getItem("twilio_token")) {
      fetchToken();
    } else {
      setToken(sessionStorage.getItem("twilio_token"));
    }
  }, []);

  useEffect(() => {
    if (token) {
      initializeDevice();
    }
  }, [token]);

  useEffect(() => {
    if (device) {
      addDeviceListeners(device);
    }
  }, [device]);

  const initializeDevice = () => {
    //   logDiv.current.classList.remove("hide"); // Assuming you have a ref for logDiv

    addLogMessage("Initializing device");

    const newDevice = new Device(token, {
      logLevel: 1,
      codecPreferences: ["opus", "pcmu"],
    });

    // Device must be registered in order to receive incoming calls
    newDevice.register();
    setDevice(newDevice); // Update the device state
  };

  const addDeviceListeners = (device) => {
    device.on("registered", function () {
      addLogMessage("Twilio.Device Ready to make calls!");
    });

    device.on("error", function (error) {
      addLogMessage("Twilio.Device Error: " + error.message);
      Swal.fire({
        title: "Your twilio token has expired.",
        text: "Please confirm for reload!",
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#7366ff",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Reload!",
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.removeItem("twilio_token");
          window.location.reload();
        }
      });
    });
  };

  // Add a log message to the UI
  const addLogMessage = (message) => {
    setLogMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateUIAcceptedOutgoingCall = () => {
    addLogMessage("Call in progress ...");
    sessionStorage.setItem("setCallButton", false);

    // setCallButton(false)
  };
  const updateUIDisconnectedOutgoingCall = () => {
    sessionStorage.setItem("setCallButton", true);
    addLogMessage("Call disconnected.");
    setLogMessages([]);
    initializeDevice();
  };

  const startCall = async () => {
    // let params = {
    //   // get the phone number to call from the DOM
    //   To: "+18495067769",
    // };

    if (device) {
      addLogMessage(`Attempting to call ...`);
      // setCallButton(null);
      sessionStorage.setItem("setCallButton", null);

      // Twilio.Device.connect() returns a Call object
      const newCall = await device.connect().then((res) => {
        setCall(res);
        //
        res.on("accept", updateUIAcceptedOutgoingCall);
        res.on("disconnect", updateUIDisconnectedOutgoingCall);
        res.on("cancel", updateUIDisconnectedOutgoingCall);
        setTimeout(() => {
          //
          sessionStorage.setItem("SID", res?.parameters?.CallSid);
        }, 2000);
      });
    } else {
      addLogMessage("Unable to make call.");
    }
  };

  const callingChanges = () => {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "Do not refresh the page during the call!",
      toast: true,
      showConfirmButton: true,
    });
    dispatch(
      Calling.update_xml({
        number: "+18495067769",
        caller_id: process.env.REACT_APP_CALLER_ID,
      })
    ).then((res) => {
      if (res?.payload?.code === "1") {
        startCall();
      }
    });
  };

  const outgoingCallHangupButton = async () => {
    addLogMessage("Hanging up ...");
    const numbers = IDData?.calling_code + IDData?.phone_number;
    if (call) {
      await call.disconnect();
      dispatch(
        AllRedux.saveCall({
          name: IDData?.name,
          number: numbers,
          role: "Client",
          call_sid: sessionStorage.getItem("SID"),
        })
      ).then((res) => {
        //
        sessionStorage.removeItem("SID");
      });
    } else {
      dispatch(
        AllRedux.saveCall({
          name: IDData?.name,
          number: numbers,
          role: "Client",
          call_sid: sessionStorage.getItem("SID"),
        })
      ).then((res) => {
        sessionStorage.removeItem("SID");
        window.location.reload();
      });
    }
  };
  useEffect(() => {
    if (productData !== null) {
      dispatch(
        MedicalData.medicalClientByID({ medical_client_id: productData })
      );
      dispatch(MedicalData.setViewAllMedicalClientComment());
    }
    return () => dispatch(MedicalData.setManageMedicalFacilityID());
  }, [productData]);
  const IDData = useSelector(
    (state) => state.managemedical?.manageMedicalByID?.data?.data
  );
  //
  const validationQualifying = Yup.object().shape({
    mfstatus: Yup.string().required("Status is required"),
    nf2: Yup.string().required("Date of NF2 is required"),

    initial: Yup.string()
      .required("Initial date is required")
      .test(
        "Is date greater",
        "Initial date cannot be greater than today's date",
        (value) => {
          if (!value) return true;
          return moment(new Date()).diff(value) > 0;
        }
      ),
    lastvisited: Yup.string()
      .required("Last visit date is required")
      .test(
        "Is date greater",
        "Last visit date cannot be greater than today's date",
        (value) => {
          if (!value) return true;
          return moment(new Date()).diff(value) > 0;
        }
      ),
    facility: Yup.string()
      .required("Facility detail is required")
      .min(2, "Facility detail must be at least 2 characters")
      .max(20, "Facility detail must be at most 20 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-,]{2,20}$",
        "Only alphabets are allowed for this field"
      ),
    visitcount: Yup.string()
      .required("Visits number is required")
      .typeError("You must specify a number")
      .min(1, "Visits number must be at least 1 characters")
      .max(4, "Visits number must be at most 4 characters"),
    finaltermination: Yup.string().required("Final termination data required"),
    drcode: Yup.string().required("DR Code required"),
    othercomment: Yup.string().required("Other comment required"),
  });

  const formOptions = { resolver: yupResolver(validationQualifying) };
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;

  const DataSubmit = (data) => {
    console.log("my data",data)
    try {
      if (data) {
        dispatch(
          MedicalData.updateMedicalClient({
            lead_id: IDData.lead_id,
            medical_client_id: productData,
            mf_status: data.mfstatus,
            nf2: data.nf2,
            facility_details: data.facility,
            initial_date: data.initial,
            last_visited_date: data.lastvisited,
            total_visits: data.visitcount,
            final_termination: data.finaltermination,
            dr_code_mf_details: data.drcode,
            other_comments: data.othercomment,
          })
        ).then((res) => {
          UploadData();
        });
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };

  const onDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter(
      (file) =>
        file.type === "application/msword" || // for .doc
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // for .docx
        file.type === "application/pdf"
    );
    setFiles([...files, ...filteredFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".doc, .docx, .pdf", // Allow only specified file types
  });

  const UploadData = async () => {
    try {
      setLoading(true);
      const uploadPromises = files.map((file) => {
        let a = file.name.split(".");
        a = a[a.length - 1];
        // const newFileName = new Date().getTime() + "." + a;
        setRandomName(file.name);

        const params = {
          Bucket: "ihcms/MedicalClient",
          Key: file.name,
          Body: file,
          ACL: "public-read",
        };

        return new Promise((resolve, reject) => {
          s3.putObject(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              randomName.push(file.name);

              resolve(file.name);
            }
          });
        });
      });

      await Promise.all(uploadPromises);

      const res = await dispatch(
        MedicalData.medicalClientDocument({
          lead_id: IDData.lead_id,
          medical_client_id: productData,
          documents: randomName,
        })
      );

      setRandomName([]);
      setFiles([]);
      setLoading(false);
      reset();
      navigate(-1);
    } catch (error) {}
  };

  const AllCommentCall = () => {
    dispatch(
      MedicalData.viewAllCommentMedical({ medical_client_id: productData })
    );
  };

  const data = useSelector(
    (state) => state.managemedical.viewAllMedicalClientComment.data.data
  );

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      footer: "ID",
    },
    {
      header: "Visited Date",
      accessorKey: "last_visited_date",
      footer: "Visited Date",
    },
    {
      header: "Comment",
      accessorKey: "other_comments",
      footer: "Comment",
    },
  ];

  const [sorting, setsorting] = useState([]);
  const [filtering, setfiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setsorting,
    onGlobalFilterChange: setfiltering,
  });
  const removeFile = (indexToRemove) => {
    // Create a copy of the files array
    const updatedFiles = [...files];

    // Remove the element at the specified index
    updatedFiles.splice(indexToRemove, 1);

    // Update the state with the new array
    setFiles(updatedFiles);
  };

  if (IDData === undefined) return <></>;
  return (
    <>
      {(isLoading && <Loader />) || (getLoading && <Loader />)}

      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Manage Medical Facility Clients</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">
                        Manage Medical Facility Clients
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {/* Container-fluid starts*/}
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>Add Madical Facility Client Data</h4>
                    </div>
                    <div className="card-body">
                      <form
                        className="row g-3 needs-validation custom-input"
                        noValidate=""
                        onSubmit={handleSubmit(DataSubmit)}
                      >

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Lead Id
                          </label>
                          <div className="input-group has-validation">
                            <input
                              className="form-control"
                              id="validationTooltip01"
                              type="text"
                              defaultValue={IDData?.lead_id}
                              readOnly
                            />

                            <div className="invalid-tooltip">
                              Please choose a unique and valid username.
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            First name
                          </label>

                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            defaultValue={IDData?.first_name}
                            readOnly
                          />

                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip02"
                          >
                            Last name
                          </label>

                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            defaultValue={IDData?.last_name}
                            readOnly
                          />

                          <div className="valid-tooltip">Looks good!</div>
                        </div>

                        {!device && (
                          <div className="col-md-2 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Device
                            </label>
                            <br />
                            <button
                              className="btn btn-lg btn-success"
                              onClick={initializeDevice}
                            >
                              Create Device
                            </button>
                          </div>
                        )}
                        {device && (
                          <>
                            {callButton === "true" || callButton === "null" ? (
                              <div className="col-md-2 position-relative">
                                <label
                                  className="form-label"
                                  htmlFor="validationTooltipUsername"
                                >
                                  Call
                                </label>
                                <br />
                                <input
                                  className="btn btn-lg btn-success"
                                  id="validationTooltip02"
                                  type="button"
                                  value="Call"
                                  onClick={callingChanges}
                                  disabled={callButton === "null"}
                                />
                              </div>
                            ) : (
                              <div className="col-md-2 position-relative">
                                <label
                                  className="form-label"
                                  htmlFor="validationTooltipUsername"
                                >
                                  Hangup
                                </label>
                                <br />
                                <input
                                  className="btn btn-lg btn-danger"
                                  id="validationTooltip02"
                                  type="button"
                                  value="Hangup"
                                  onClick={outgoingCallHangupButton}
                                />
                              </div>
                            )}
                          </>
                        )}

                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Call Logs:
                          </label>
                          <br />
                          <ul
                            style={{
                              overflowY: "scroll",
                              maxHeight: "150px",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#000",
                            }}
                          >
                            {logMessages.map((item, index) => {
                              return <li id={index}>{item}</li>;
                            })}
                          </ul>
                        </div>
                       

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            MF Status
                          </label>
                          <select
                            {...register("mfstatus")}
                            className="form-select"
                            id="validationTooltip04"
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option selected={IDData?.mf_status === "Active"}>
                              Active
                            </option>
                            <option selected={IDData?.mf_status === "Inactive"}>
                              Inactive
                            </option>
                          </select>
                          {/* <div className="invalid-feedback">
                            {errors.mfstatus?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            NF2
                          </label>
                          <input
                            {...register("nf2")}
                            className="form-control"
                            id="validationTooltip01"
                            type="date"
                            defaultValue={IDData?.nf2}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.nf2?.message}
                          </div> */}
                        </div>

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Facility Details
                          </label>
                          <input
                            {...register("facility")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            defaultValue={IDData?.facility_details}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.facility?.message}
                          </div> */}
                        </div>
                        {/* <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Call
                          </label>
                          <br />
                          <input
                            className="btn btn-lg btn-success"
                            id="validationTooltip02"
                            type="button"
                            value="Call"
                            required=""
                          />
                        </div> */}
                        
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Initial Date
                          </label>
                          <input
                            {...register("initial")}
                            className="form-control"
                            id="validationTooltip01"
                            type="date"
                            defaultValue={IDData?.initial_date}
                            readOnly
                          />
                          {/* <div className="invalid-feedback">
                            {errors.initial?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Last Visited Date
                          </label>
                          <input
                            {...register("lastvisited")}
                            className="form-control"
                            id="validationTooltip01"
                            type="date"
                            defaultValue={IDData?.last_visited_date}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.lastvisited?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Total Visits
                          </label>
                          <input
                            {...register("visitcount")}
                            className="form-control"
                            id="validationTooltip01"
                            // placeholder="5"
                            type="text"
                            defaultValue={IDData?.total_visits}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.visitcount?.message}
                          </div> */}
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Final Termination/Cancel Comment
                          </label>
                          <textarea
                            {...register("finaltermination")}
                            className="form-control"
                            id="validationTooltip11"
                            type="text"
                            defaultValue={IDData?.final_termination}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.finaltermination?.message}
                          </div> */}
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            DR Code MF Details
                          </label>
                          <textarea
                            {...register("drcode")}
                            className="form-control"
                            id="validationTooltip11"
                            type="text"
                            defaultValue={IDData?.dr_code_mf_details}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.drcode?.message}
                          </div> */}
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Other Comments
                          </label>
                          <div className="row">
                            <div className="col-md-9">
                              <textarea
                                {...register("othercomment")}
                                className="form-control"
                                id="validationTooltip11"
                                type="text"
                                defaultValue={IDData?.other_comments}
                              />
                              {/* <div className="invalid-feedback">
                                {errors.othercomment?.message}
                              </div> */}
                            </div>
                            <div className="col-md-3">
                              <button
                                type="button"
                                className="btn btn-info"
                                onClick={AllCommentCall}
                              >
                                <span className="d-flex">View All Comment</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="customdrop">
                          {/* <h1>Multiple File Uploader</h1> */}
                          <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} />
                            <p>
                              Drag and drop Word (.doc, .docx) or PDF (.pdf)
                              files here, or click to select files
                            </p>
                          </div>
                          <div className="file-list">
                            <p>Uploaded Files:</p>
                            <ul>
                            {files?.map((file, index) => (
                              <li key={index}>
                                {file?.name}{" "}
                                <button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={() => {
                                    removeFile(index);
                                  }}
                                ></button>
                              </li>
                            ))}
                            {IDData?.documentData?.map((data, index) => (
                              <li>
                                <a
                                  href={data?.document}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {
                                    data?.document.split("/")[
                                      data?.document.split("/").length - 1
                                    ]
                                  }{" "}
                                </a>
                                <button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={() => {
                                    dispatch(
                                      MedicalData.deleteMedicalFacilityCilentDocument({
                                        id: data?.id,
                                        medical_client_id: data?.medical_client_id,
                                      })
                                    ).then((res) => {
                                      console.log("res", res);
                                      if (res.payload.code == 1) {
                                        dispatch(
                                          MedicalData.medicalClientByID({
                                            medical_client_id: data?.medical_client_id,
                                          })
                                        );
                                      }
                                    });
                                  }}
                                ></button>
                              </li>
                            ))}
                            </ul>
                          </div>
                        </div>
                        {/* <div className="col-12">
                          <button className="btn btn-primary" type="submit">
                            Add
                          </button>
                        </div> */}
                        <div className="d-flex justify-content-center gap-4">
                          <button className="btn btn-primary" type="submit">
                            Add Details
                          </button>
                          <Link className="btn btn-primary pl-3" to={-1}>
                            Back
                          </Link>
                        </div>
                      </form>
                      {data === undefined ? (
                        <></>
                      ) : (
                        <>
                          <div className="container-fluid">
                            <div className="row">
                              <div className="col-sm-12">
                                <div className="card">
                                  <div className="card-header">
                                    <h4>Comments</h4>
                                  </div>
                                  <div className="card-body">
                                    <div className="table-responsive">
                                      {/* <div className="d-flex float-end mb-3 mt-3 ">
                                <input
                                  className="form-control"
                                  type="text"
                                  value={filtering}
                                  onChange={(e) => setfiltering(e.target.value)}
                                  placeholder="Search"
                                />
                              </div> */}

                                      <table className="table table-striped border">
                                        <thead>
                                          {table
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                              <tr
                                                key={headerGroup.id}
                                                style={{ cursor: "pointer" }}
                                              >
                                                {headerGroup.headers.map(
                                                  (header) => (
                                                    <th
                                                      key={header.id}
                                                      onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                      {flexRender(
                                                        header.column.columnDef
                                                          .header,
                                                        header.getContext()
                                                      )}
                                                    </th>
                                                  )
                                                )}
                                              </tr>
                                            ))}
                                        </thead>
                                        <tbody>
                                          {table
                                            .getRowModel()
                                            .rows.map((row) => (
                                              <tr key={row.id}>
                                                {row
                                                  .getVisibleCells()
                                                  .map((cell) => (
                                                    <td key={cell.id}>
                                                      {flexRender(
                                                        cell.column.columnDef
                                                          .cell,
                                                        cell.getContext()
                                                      )}
                                                    </td>
                                                  ))}
                                              </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                          {table
                                            .getFooterGroups()
                                            .map((footerGroup) => (
                                              <tr key={footerGroup.id}>
                                                {footerGroup.headers.map(
                                                  (header) => (
                                                    <th key={header.id}>
                                                      {flexRender(
                                                        header.column.columnDef
                                                          .header,
                                                        header.getContext()
                                                      )}
                                                    </th>
                                                  )
                                                )}
                                              </tr>
                                            ))}
                                        </tfoot>
                                      </table>
                                      <div className="d-flex justify-content-end mt-3">
                                        <button
                                          className="btn btn-primary"
                                          onClick={() => table.setPageIndex(0)}
                                        >
                                          First page
                                        </button>
                                        <button
                                          className="btn btn-primary"
                                          style={{ marginLeft: "5px" }}
                                          disabled={!table.getCanPreviousPage()}
                                          onClick={() => table.previousPage()}
                                        >
                                          Previous page
                                        </button>
                                        <button
                                          className="btn btn-primary"
                                          style={{ marginLeft: "5px" }}
                                          disabled={!table.getCanNextPage()}
                                          onClick={() => table.nextPage()}
                                        >
                                          Next page
                                        </button>
                                        <button
                                          className="btn btn-primary ml-5px"
                                          style={{ marginLeft: "5px" }}
                                          onClick={() =>
                                            table.setPageIndex(
                                              table.getPageCount() - 1
                                            )
                                          }
                                        >
                                          Last page
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Container-fluid Ends*/}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default MedicalClientManage;
