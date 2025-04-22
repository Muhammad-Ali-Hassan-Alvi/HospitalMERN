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
import AWS from "../../AWS/aws-config";
import * as Attorneydata from "../../store/slice/manageAttorneySlice";

function AttorneyClientManage() {
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const dispatch = useDispatch();
  const location = useLocation();
  const productData = location.state;
  const [files, setFiles] = useState([]);
  const s3 = new AWS.S3();
  const [getLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [randomName, setRandomName] = useState([]);

  useEffect(() => {
    if (productData !== null) {
      dispatch(
        Attorneydata.attorneyClientByID({ attorney_client_id: productData })
      );
    }
    return () => dispatch(Attorneydata.setManageAttorneyID());
  }, [productData]);
  const IDData = useSelector(
    (state) => state.manageattorney.manageAttorneyByID.data.data
  );

  console.log(IDData);

  const validationQualifying = Yup.object().shape({
    precinctcode: Yup.string()
      .required("Precinct code is required")
      .min(2, "Precinct code must be at least 2 characters")
      .max(20, "Precinct code must be at most 20 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,20}$",
        "Only alphabets are allowed for this field"
      ),

    injurydescription: Yup.string().required("Injury description is required"),
    attorneyname: Yup.string()
      .required("Attorney name is required")
      .min(2, "Attorney name must be at least 2 characters")
      .max(30, "Attorney name must be at most 30 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,30}$",
        "Only alphabets are allowed for this field"
      ),
    paralegalname: Yup.string().required("Paralegal name is required"),

    accidentlocation: Yup.string()
      .required("Accident location is required")
      .min(2, "Accident location must be at least 2 characters")
      .max(20, "Accident location must be at most 20 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,20}$",
        "Only alphabets are allowed for this field"
      ),
    accidentdesc: Yup.string().required("Accident description is required"),
    finaltermination: Yup.string().required("Final termination is required"),
    drcode: Yup.string()
      .required("DR code is required")
      .min(2, "DR code must be at least 2 characters")
      .max(20, "DR code must be at most 20 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,20}$",
        "Only alphabets are allowed for this field"
      ),
    othercomment: Yup.string().required("Other comment is required"),
    date: Yup.string()
      .required("DOA is required")
      .test(
        "Is date greater",
        "DOA cannot be greater than today's date",
        (value) => {
          if (!value) return true;
          return moment(new Date()).diff(value) > 0;
        }
      ),
  });

  const formOptions = { resolver: yupResolver(validationQualifying) };
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;

  const onSubmit = (data) => {
    try {
      if (data) {
        dispatch(
          Attorneydata.updateAttorneyClient({
            lead_id: IDData.lead_id,
            attorney_client_id: productData,
            precint_code: data.precinctcode,
            doa_date: data.date,
            injury_description: data.injurydescription,
            paralegal_name_number: data.paralegalname,
            accident_location: data.accidentlocation,
            accident_description: data.accidentdesc,
            final_termination: data.finaltermination,
            dr_code_att: data.drcode,
            other_comments: data.othercomment,
          })
        ).then((res) => {
          UploadData();
        });

        reset();
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
          Bucket: "ihcms/Attorney_client",
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
        Attorneydata.attorneyClientDocument({
          lead_id: IDData.lead_id,
          attorney_client_id: productData,
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
  if (IDData === undefined) return <></>;
  const removeFile = (indexToRemove) => {
    // Create a copy of the files array
    const updatedFiles = [...files];

    // Remove the element at the specified index
    updatedFiles.splice(indexToRemove, 1);

    // Update the state with the new array
    setFiles(updatedFiles);
  };
  return (
    <>
      {isLoading && <Loader />}

      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />

          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Attorney Client Details</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">
                        {" "}
                        Attorney Client Details
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
                      <h4>Add Attorney Details</h4>
                    </div>
                    <div className="card-body">
                      <form
                        className="row g-3 needs-validation custom-input"
                        noValidate=""
                        onSubmit={handleSubmit(onSubmit)}
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
                            readOnly
                            defaultValue={IDData?.first_name}
                          />
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
                        </div>

                        {/* <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Enter RON
                          </label>
                          <input
                            {...register("ron")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="RON"
                            required=""
                          />
                          <div className="invalid-feedback">
                            {errors.ron?.message}
                          </div>
                        </div> */}
                        {/* <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Enter DOF
                          </label>
                          <input
                            {...register("dof")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="DOF"
                            required=""
                          />
                          <div className="invalid-feedback">
                            {errors.dof?.message}
                          </div>
                        </div> */}
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Precinct Code
                          </label>
                          <input
                            {...register("precinctcode")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Precinct Code"
                            required=""
                          />
                          <div className="invalid-feedback">
                            {errors.precinctcode?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            DOA Date
                          </label>
                          <input
                            {...register("date")}
                            className="form-control"
                            id="validationTooltip01"
                            type="date"
                            defaultValue={IDData?.date_of_accident}
                            readOnly
                          />
                          <div className="invalid-feedback">
                            {errors.date?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Assigned Attorney Name
                          </label>
                          <input
                            {...register("attorneyname")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Name"
                            readOnly
                            defaultValue={IDData?.assigned_attorney_name}
                          /> 
                          <div className="invalid-feedback">
                            {errors.attorneyname?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Paralegal Name & Number
                          </label>

                          <input
                            {...register("paralegalname")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Name"
                          />
                          <div className="invalid-feedback">
                            {errors.paralegalname?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Accident Location
                          </label>
                          <input
                            {...register("accidentlocation")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Location"
                            defaultValue={IDData?.accident_location}
                            readOnly
                          />
                          <div className="invalid-feedback">
                            {errors.accidentlocation?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Enter DR Code-ATT
                          </label>
                          <input
                            {...register("drcode")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="DR Code-ATT"
                            required=""
                          />
                          <div className="invalid-feedback">
                            {errors.drcode?.message}
                          </div>
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Enter Injury Description
                          </label>
                          <textarea
                            {...register("injurydescription")}
                            className="form-control"
                            id="validationTooltip010"
                            type="text"
                            readOnly
                            defaultValue={IDData?.injuries_description}
                          />
                          <div className="invalid-feedback">
                            {errors.injurydescription?.message}
                          </div>
                        </div>

                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Accident Description
                          </label>
                          <textarea
                            {...register("accidentdesc")}
                            className="form-control"
                            id="validationTooltip010"
                            type="text"
                            readOnly
                            defaultValue={IDData?.accident_description}
                          />
                          <div className="invalid-feedback">
                            {errors.accidentdesc?.message}
                          </div>
                        </div>
                        <div className="col-md-6 position-relative">
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
                            required=""
                          />
                          <div className="invalid-feedback">
                            {errors.finaltermination?.message}
                          </div>
                        </div>

                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Other Comments
                          </label>
                          <textarea
                            {...register("othercomment")}
                            className="form-control"
                            id="validationTooltip010"
                            type="text"
                            required=""
                          />
                          <div className="invalid-feedback">
                            {errors.othercomment?.message}
                          </div>
                        </div>

                        {/* Container-fluid starts*/}

                        <div className="customdrop">
                          {/* <h1>Multiple File Uploader</h1> */}
                          <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} />
                            <p>
                              Drag and drop some files here, or click to select
                              files
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
                                        Attorneydata.deleteAttorneyClientDocument(
                                          {
                                            id: data?.id,
                                            attorney_client_id:
                                              data?.attorney_client_id,
                                          }
                                        )
                                      ).then((res) => {
                                        console.log("res", res);
                                        if (res.payload.code == 1) {
                                          dispatch(
                                            Attorneydata.attorneyClientByID({
                                              attorney_client_id:
                                                data?.attorney_client_id,
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
                          <button className="btn btn-primary" type="submit">
                            Add Attorney Details
                          </button>
                          <Link className="btn btn-primary pl-3" to={-1}>
                            Back
                          </Link>
                        </div>
                      </form>
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

export default AttorneyClientManage;
