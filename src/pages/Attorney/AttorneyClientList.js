import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { useDropzone } from "react-dropzone";
import Tooltiphome from "../../Common/Tooltiphome";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import * as AllRedux from "../../store/slice/attorneySlice";
import * as AttorneyClient from "../../store/slice/manageAttorneySlice";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  Sorting,
  getFilteredRowModel,
} from "@tanstack/react-table";
import AWS from "../../AWS/aws-config";
import { Tooltip } from "@material-ui/core";
import Swal from "sweetalert2";
import { Device } from "@twilio/voice-sdk";
import { update_xml } from "../../store/slice/admindataSlice";
import { saveCall } from "../../store/slice/medicalFacilitySlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import { ErrorAlert, SuccessAlert } from "../../Common/Alert";

function AttorneyClientList() {
  const pdfref = useRef(null);
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const location = useLocation();
  const dispatch = useDispatch();
  const productData = location.state;
  const s3 = new AWS.S3();
  const [getLoading, setLoading] = useState(false);
  const [randomName, setRandomName] = useState([]);
  const [fileName, setFileName] = useState("");

  const [token, setToken] = useState(null);
  const [device, setDevice] = useState(null);
  const [callButton, setCallButton] = useState("null");
  const [call, setCall] = useState(null);
  const [logMessages, setLogMessages] = useState([]);
  const [files, setFiles] = useState([]);

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

  useEffect(() => {
    if (productData !== null) {
      dispatch(AllRedux.attorneyByID({ attorney_id: productData }));
    }
    return () => dispatch(AllRedux.setAttorneyID());
  }, [productData]);

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

  const updateUIAcceptedOutgoingCall = (res) => {
    sessionStorage.setItem("SID", res?.parameters?.CallSid);
    addLogMessage("Call in progress ...");
    sessionStorage.setItem("setCallButton", false);
  };
  const updateUIDisconnectedOutgoingCall = () => {
    const numbers = IDData?.calling_code + IDData?.phone_number;
    dispatch(
      saveCall({
        name: IDData?.name,
        number: numbers,
        role: "Attorney",
        call_sid: sessionStorage.getItem("SID"),
      })
    ).then((res) => {
      //
      sessionStorage.removeItem("SID");
    });
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
        res.on("accept", updateUIAcceptedOutgoingCall);
        res.on("disconnect", updateUIDisconnectedOutgoingCall);
        res.on("cancel", updateUIDisconnectedOutgoingCall);
        // setTimeout(() => {}, 2500);
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
      update_xml({
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
      // dispatch(
      //   AllRedux.saveCall({
      //     name: IDData?.name,
      //     number: numbers,
      //     call_sid: sessionStorage.getItem("SID"),
      //   })
      // ).then((res) => {
      //
      //   sessionStorage.removeItem("SID");
      // });
    } else {
      dispatch(
        saveCall({
          name: IDData?.name,
          number: numbers,
          role: "Attorney",
          call_sid: sessionStorage.getItem("SID"),
        })
      ).then((res) => {
        sessionStorage.removeItem("SID");
        window.location.reload();
      });
    }
  };

  const IDData = useSelector(
    (state) => state.attorney.attorneyByIDGet.data.data
  );

  const data = useSelector(
    (state) => state.manageattorney.manageAttorneyListing.data.data
  );

  console.log("===data",data)

  const removeLeadItem = (rid) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          AttorneyClient.deleteAttorneyClient({ attorney_client_id: rid })
        ).then((res) => {
          dispatch(
            AttorneyClient.attorneyClientListing({ attorney_id: productData })
          );
        });
      }
    });
  };

  useEffect(() => {
    dispatch(
      AttorneyClient.attorneyClientListing({ attorney_id: productData })
    );
  }, []);

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      footer: "Name",
    },

    {
      header: "Email",
      accessorKey: "email",
      footer: "Email",
    },
    {
      header: "Phone number",
      accessorKey: "phone_number",
      footer: "Phone number",
    },
    {
      header: "Address",
      accessorKey: "address1",
      footer: "Address",
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
        setFileName(file.name);
        setRandomName(file.name);

        const params = {
          Bucket: "ihcms/Attorney",
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
        AllRedux.attorneyDocument({
          attorney_id: productData,
          documents: randomName,
        })
      );

      setRandomName([]);
      setFiles([]);
      setLoading(false);
    } catch (error) {}
  };
  const removeFile = (indexToRemove) => {
    const updatedFiles = [...files];
    updatedFiles.splice(indexToRemove, 1);
    setFiles(updatedFiles);
  };
  const exportToPDF = () => {
    document.body.classList.add("hide-action-column");
    const input = pdfref.current;
    if (input) {
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4", true);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 30;
          pdf.setFontSize(20);
          pdf.text("Attorney Client List", pdfWidth / 2, 20, {
            align: "center",
          });
          pdf.addImage(
            imgData,
            "PNG",
            imgX,
            imgY,
            imgWidth * ratio,
            imgHeight * ratio
          );
          pdf.save("attorney-client-list.pdf");
        })
        .catch((error) => {
          console.error("Error generating PDF", error);
        })
        .finally(() => {
          document.body.classList.remove("hide-action-column");
        });
    } else {
      console.error("PDF reference is null");
    }
  };

  const exportCSVData = () => {
    if (!data || data.length === 0) {
      console.log("No data available to export");
      return [];
    }

    return data.map((facility, index) => ({
      Id: index + 1,
      Name: facility.name,
      Email: facility.email,
      PhoneNumber: facility.phone_number,
      Address: facility.address,
    }));
  };
  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);
  const exportPrint = useReactToPrint({
    contentRef: pdfref,
    documentTitle: "medical-facility-client-list",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  const sendDataToEmail = () => {
    try {
      const tableData = table.getRowModel().rows.map((row) => row.original);
      const AttorneyClientData = {
        tableData: tableData,
        listName: "Attorney Client List",
      };
      if (AttorneyClientData) {
        dispatch(
          AllRedux.sendAttorneyClientEmail({
            data: AttorneyClientData,
          })
        ).then((res) => {
          SuccessAlert("Email Sent Successfully");
        });
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };
  return (
    <>
    <style>
        {`@media print {
          .action-column {
            display: none !important;
          }
        }`}
      </style>
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
                    <h4>Attorney Client List</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">
                        Attorney Client List
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
                      <h4>Add Attorney Reports</h4>
                    </div>
                    <div className="card-body">
                      <form
                        className="row g-3 needs-validation custom-input"
                        noValidate=""
                      >
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Name
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Name"
                            readOnly
                            defaultValue={IDData?.name}
                          />
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip02"
                          >
                            Manager Name
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip02"
                            type="text"
                            placeholder="Manager Name"
                            readOnly
                            value={IDData?.manager_name}
                          />
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Email
                          </label>
                          <div className="input-group has-validation">
                            <input
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              value={IDData?.email}
                              readOnly
                              placeholder="Email Address"
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-1 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Code
                          </label>
                          <div className="input-group has-validation">
                            <input
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              value={IDData?.calling_code}
                              readOnly
                              placeholder="Phone Code"
                            />
                          </div>
                        </div> */}
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Phone Number
                          </label>
                          <div className="input-group has-validation">
                            <input
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              value={IDData?.masked_phone_number}
                              readOnly
                              placeholder="Phone Number"
                            />
                          </div>
                        </div>
                        {!device && (
                          <div className="col-md-1 position-relative">
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
                              <div className="col-md-1 position-relative">
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
                              <div className="col-md-1 position-relative">
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

                        <div className="col-md-3 position-relative">
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
                        <div className="customdrop">
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
                                  {file.name}{" "}
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
                                    href={data.document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {
                                      data.document.split("/")[
                                        data.document.split("/").length - 1
                                      ]
                                    }{" "}
                                  </a>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => {
                                      dispatch(
                                        AllRedux.DeleteAttorneyDocument({
                                          id: data?.id,
                                          attorney_id: data?.attorney_id,
                                        })
                                      ).then((res) => {
                                        console.log("res", res);
                                        if (res.payload.code == 1) {
                                          dispatch(
                                            AllRedux.attorneyByID({
                                              attorney_id: data?.attorney_id,
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

                        <div className="d-flex justify-content-center gap-4">
                          <span
                            className="btn btn-primary"
                            onClick={UploadData}
                          >
                            Add Attorney Report
                          </span>
                          <Link
                            className="btn btn-primary pl-3"
                            to="/attorney-details"
                          >
                            Back
                          </Link>
                        </div>
                      </form>
                      <div style={{ marginTop: "2%" }}></div>
                      {data === undefined ? (
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-sm-12">
                              <div className="card">
                                <div className="card-header">
                                  <h4>Attorney Clients List</h4>
                                </div>
                                <div className="card-body">
                                  <div className="table-responsive">
                                    <div className="d-flex float-end mb-3 mt-3 ">
                                      <input
                                        className="form-control"
                                        type="text"
                                        value={filtering}
                                        onChange={(e) =>
                                          setfiltering(e.target.value)
                                        }
                                        placeholder="Search"
                                      />
                                    </div>
                                  </div>
                                  <h2 className="d-flex justify-content-center">
                                    {" "}
                                    No Data Found
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-sm-12">
                              <div className="card">
                                <div className="card-header">
                                  <h4>Attorney Clients List</h4>
                                </div>
                                <div className="card-body">
                                  <div className="table-responsive">
                                    <button
                                      className="btn btn-success me-3"
                                      onClick={exportToPDF}
                                    >
                                      Download PDF
                                    </button>
                                    <button className="btn btn-info me-3">
                                      <CSVLink
                                        data={exportCSVData()}
                                        filename="attorney-client-list.csv"
                                        className="text-dark"
                                        target="_blank"
                                      >
                                        Download CSV
                                      </CSVLink>
                                    </button>
                                    <button
                                      className="btn btn-primary me-3"
                                      onClick={exportPrint}
                                    >
                                      Print
                                    </button>
                                    <button
                                      className="btn btn-secondary me-3"
                                      onClick={sendDataToEmail}
                                    >
                                      Send Email
                                    </button>
                                    <div className="d-flex float-end mb-3 mt-3 ">
                                      <input
                                        className="form-control"
                                        type="text"
                                        value={filtering}
                                        onChange={(e) =>
                                          setfiltering(e.target.value)
                                        }
                                        placeholder="Search"
                                      />
                                    </div>
                                    <table
                                      className="table table-striped border"
                                      ref={pdfref}
                                    >
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
                                              <th className="action-column">
                                                Action
                                              </th>
                                            </tr>
                                          ))}
                                      </thead>
                                      <tbody>
                                        {table.getRowModel().rows.map((row) => (
                                          <tr key={row.id}>
                                            {row
                                              .getVisibleCells()
                                              .map((cell) => (
                                                <td key={cell.id}>
                                                  {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                  )}
                                                </td>
                                              ))}
                                            <td>
                                              <ul className="action">
                                                <li className="view action-column">
                                                  <Tooltip title="View">
                                                    <Link
                                                      to="/attorney-client-manage"
                                                      state={row.original.id}
                                                      onClick={() =>
                                                        sessionStorage.setItem(
                                                          "path",
                                                          "/attorney-details"
                                                        )
                                                      }
                                                    >
                                                      <i className="icon-eye"></i>
                                                    </Link>
                                                  </Tooltip>
                                                </li>
                                                <li className="delete action-column">
                                                  <Tooltip title="Delete">
                                                    <span
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        removeLeadItem(
                                                          row.original.id
                                                        )
                                                      }
                                                    >
                                                      <i className="icon-trash"></i>
                                                    </span>
                                                  </Tooltip>
                                                </li>
                                                <li className="edit action-column">
                                                  <Tooltip title="Go to Qualifying">
                                                    <Link
                                                      to={"/qualifying"}
                                                      state={{
                                                        ID: row.original
                                                          .lead_id,
                                                      }}
                                                      onClick={() =>
                                                        sessionStorage.setItem(
                                                          "path",
                                                          "/user-list"
                                                        )
                                                      }
                                                    >
                                                      <i className="icon-arrow-right"></i>
                                                    </Link>
                                                  </Tooltip>
                                                </li>
                                              </ul>
                                            </td>
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
                                              <th className="action-column">
                                                Action
                                              </th>
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

export default AttorneyClientList;
