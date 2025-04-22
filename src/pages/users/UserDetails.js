import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Loader from "../../components/loader/Loader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import moment from "moment";
import { ErrorAlert } from "../../Common/Alert";
import { useDispatch, useSelector } from "react-redux";
import * as AllRedux from "../../store/slice/leadSlice";
import { Tooltip, colors } from "@material-ui/core";

export default function UserDetails() {
  const [useDataSubmit, setDataSubmit] = useState(false);
  const isLoading = useSelector((state) => state.admindata.isLoading);

  const location = useLocation();
  const userID = location.state;
  const dispatch = useDispatch();
  const userIDData = useSelector((state) => state.lead.userLeadData.data.data);
  
  useEffect(() => {
    if (userID) {
      dispatch(AllRedux.userData({ lead_id: userID }));
    }
    // return(
    //   setUserID
    // )
    return () => dispatch(AllRedux.setUserID());

  }, []);

  return (
    <>
      {isLoading && <Loader />}

      <div className="tap-top">
        <i data-feather="chevrons-up"></i>
      </div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />

          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>User Detail</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li
                        className="breadcrumb-item"
                        onClick={() => sessionStorage.removeItem("path")}
                      >
                        <Tooltip title="Home">
                          <Link to="/dashboard">
                            <svg className="stroke-icon">
                              <use
                                href={
                                  process.env.PUBLIC_URL +
                                  "/assets/svg/icon-sprite.svg#stroke-home"
                                }
                              ></use>
                            </svg>
                          </Link>
                        </Tooltip>
                      </li>
                      <li className="breadcrumb-item active"> User Detail</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>User Detail</h4>
                    </div>
                    <div className="card-body">
                      <form
                        className="row g-3 needs-validation custom-input"
                        noValidate=""
                        // onSubmit={handleSubmit(DataSubmit)}
                      >
                        <div className="col-md-4 position-relative">
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
                            value={userIDData?.leadData?.first_name}
                            disabled
                          />

                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Middle name
                          </label>

                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            value={userIDData?.leadData?.middle_name}
                            disabled
                          />

                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                        <div className="col-md-4 position-relative">
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
                            value={userIDData?.leadData?.last_name}
                            disabled
                          />

                          <div className="valid-tooltip">Looks good!</div>
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            for="validationTooltip03"
                          >
                            Comment
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip03"
                            type="text"
                            required=""
                            placeholder="Add your Comments here"
                            value={userIDData?.leadData?.comment}
                            disabled
                          />
                          {/* <div className="invalid-feedback">
                            {errors.comment?.message}
                          </div> */}
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            for="validationTooltip04"
                          >
                            Select Disposition
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            disabled
                            // {...register("disposition")}
                          >
                            <option selected="">Choose...</option>
                            <option
                              selected={
                                userIDData?.leadData?.disposition ===
                                "Customer Already Signed"
                              }
                            >
                              Customer Already Signed{" "}
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.disposition ===
                                "Answering Machine"
                              }
                            >
                              Answering Machine{" "}
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.disposition === "Callback"
                              }
                            >
                              Callback{" "}
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.disposition ===
                                "No Contact"
                              }
                            >
                              No Contact
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.disposition ===
                                "Does Not Qualify"
                              }
                            >
                              Does Not Qualify
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.disposition ===
                                "Follow Up"
                              }
                            >
                              Follow Up
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.disposition ===
                                "Medical Facility"
                              }
                            >
                              Medical Facility
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.disposition === "Attorney"
                              }
                            >
                              Attorney
                            </option>
                          </select>
                          {/* <div className="invalid-feedback">
                            {errors.disposition?.message}
                          </div> */}
                        </div>
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
                              disabled
                              value={userIDData?.leadData?.id}
                            />

                            <div className="invalid-tooltip">
                              Please choose a unique and valid username.
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Gender
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            disabled
                          >
                            <option selected="" disabled value="">
                              Choose...
                            </option>
                            <option
                              selected={userIDData?.leadData?.gender === "Male"}
                            >
                              Male{" "}
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.gender === "Female"
                              }
                            >
                              Female{" "}
                            </option>
                          </select>
                          {/* <div className="invalid-feedback">
                            {errors.gender?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Language
                          </label>
                          <input
                            className="form-select"
                            id="validationTooltip04"
                            // defaultValue={userIDData?.leadData?.language}
                            defaultValue={userIDData?.leadData?.language}
                            disabled
                            // {...register("language")}
                          ></input>
                          {/* <div className="invalid-feedback">
                            {errors.language?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Adult
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            disabled
                            // {...register("adult")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option
                              selected={userIDData?.leadData?.is_adult === 1}
                            >
                              Yes{" "}
                            </option>
                            <option
                              selected={userIDData?.leadData?.is_adult === 0}
                            >
                              No{" "}
                            </option>
                          </select>
                          {/* <div className="invalid-feedback">
                            {errors.adult?.message}
                          </div> */}
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Email
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Email"
                            required=""
                            value={userIDData?.leadData?.email}
                            readOnly
                            // {...register("email")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.email?.message}
                          </div> */}
                        </div>
                        {/* <div className="col-md-1 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Code
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Code"
                            required=""
                            value={userIDData?.leadData?.calling_code}
                            readOnly
                            // {...register("callingCountryCode")}
                          />
                          <div className="invalid-feedback">
                            {errors.callingCountryCode?.message}
                          </div>
                        </div> */}
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Phone Number
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Number"
                            required=""
                            value={
                              userIDData?.leadData?.phone != undefined
                                ? userIDData?.leadData?.phone?.slice(0, 4) +
                                  "******"
                                : ""
                            }
                            readOnly
                            // {...register("localPhoneNumber")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.localPhoneNumber?.message}
                          </div> */}
                        </div>

                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Select Top Involved
                          </label>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  id="flexCheckDefault"
                                  type="checkbox"
                                  //   {...register("addleadrights")}
                                  checked={userIDData?.leadData?.top_involved.includes(
                                    "Driver"
                                  )}
                                  value={"Driver"}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  Driver
                                </label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  id="flexCheckDefault"
                                  type="checkbox"
                                  checked={userIDData?.leadData?.top_involved.includes(
                                    "Passenger"
                                  )}
                                  value={"Passenger"}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  Passenger
                                </label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  id="flexCheckDefault"
                                  type="checkbox"
                                  value={"OPIV"}
                                  checked={userIDData?.leadData?.top_involved.includes(
                                    "OPIV"
                                  )}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  OPIV
                                </label>
                              </div>
                            </div>
                          </div>
                          {/* <div className="invalid-feedback text-center">
                            {errors.addleadrights?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Type of Case
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            disabled
                            // {...register("typeofcase")}
                          >
                            <option selected="" disabled="" value="">
                              {" "}
                              Choose...
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.case_type === "WC"
                              }
                            >
                              WC{" "}
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.case_type === "TLC"
                              }
                            >
                              TLC{" "}
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.case_type === "No Fault"
                              }
                            >
                              No Fault{" "}
                            </option>
                            <option
                              selected={
                                userIDData?.leadData?.case_type ===
                                "Slip & Fall"
                              }
                            >
                              Slip & Fall{" "}
                            </option>
                          </select>
                          {/* <div className="invalid-feedback">
                            {errors.typeofcase?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Vehicle Register State
                          </label>
                          <input
                            className="form-select"
                            id="validationTooltip04"
                            defaultValue={
                              userIDData?.leadData?.vehicle_register_state
                            }
                            disabled
                            // {...register("insuranceprovider")}
                          ></input>
                          
                          {/* <div className="invalid-feedback">
                            {errors.vehicleregisterstate?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Insurance Provider
                          </label>
                          <input
                            className="form-select"
                            id="validationTooltip04"
                            defaultValue={
                              userIDData?.leadData?.insurance_provider
                            }
                            disabled
                            // {...register("insuranceprovider")}
                          ></input>
                          {/* <div className="invalid-feedback">
                            {errors.insuranceprovider?.message}
                          </div> */}
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Injuries Description
                          </label>
                          <textarea
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            required=""
                            value={userIDData?.leadData?.injuries_description}
                            readOnly
                            // {...register("injuries")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.injuries?.message}
                          </div> */}
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Accident Description
                          </label>
                          <textarea
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            required=""
                            value={userIDData?.leadData?.accident_description}
                            readOnly
                            // {...register("accident")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.accident?.message}
                          </div> */}
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Accident Location
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip09"
                            placeholder="Location"
                            type="text"
                            required=""
                            value={userIDData?.leadData?.accident_location}
                            readOnly
                            // {...register("accidentlocation")}
                          />

                          {/* <div className="invalid-feedback">
                            {errors.accidentlocation?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Date of Accident
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip08"
                            type="date"
                            required=""
                            value={userIDData?.leadData?.date_of_accident}
                            readOnly
                            // {...register("date")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.date?.message}
                          </div> */}
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Other Details
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip07"
                            type="text"
                            required=""
                            value={userIDData?.leadData?.other_details}
                            readOnly
                            // {...register("otherdetails")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.otherdetails?.message}
                          </div> */}
                        </div>
                        <div className="col-md-12 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Address
                          </label>
                          <textarea
                            className="form-control"
                            id="validationTooltip11"
                            type="text"
                            required=""
                            value={userIDData?.leadData?.address1}
                            readOnly
                            // {...register("address1")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.address1?.message}
                          </div> */}
                        </div>

                        <div className="col-md-12 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Address2
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip09"
                            placeholder="Address2"
                            type="text"
                            defaultValue={userIDData?.leadData?.address2}
                            readOnly
                          />
                          {/* <div className="invalid-feedback">
                            {errors.accidentlocation?.message}
                          </div> */}
                        </div>

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Other
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            disabled
                            // {...register("other")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option
                              selected={userIDData?.leadData?.other === "PR"}
                            >
                              PR{" "}
                            </option>
                            <option
                              selected={userIDData?.leadData?.other === "MV104"}
                            >
                              MV104{" "}
                            </option>
                            <option
                              selected={userIDData?.leadData?.other === "AMB R"}
                            >
                              AMB R{" "}
                            </option>
                          </select>
                          {/* <div className="invalid-feedback">
                            {errors.other?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Pic Question
                          </label>
                          <input
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            disabled
                            defaultValue={userIDData?.leadData?.pic_question}
                            // {...register("question")}
                          ></input>
                          {/* <div className="invalid-feedback">
                            {errors.question?.message}
                          </div> */}
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Pic Answer
                          </label>
                          <input
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            disabled
                            defaultValue={userIDData?.leadData?.pic_answer}
                            // {...register("answer")}
                          ></input>
                          {/* <div className="invalid-feedback">
                            {errors.answer?.message}
                          </div> */}
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Other Comments
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip07"
                            type="text"
                            required=""
                            value={userIDData?.leadData?.other_comments}
                            readOnly
                            // {...register("othercomments")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.othercomments?.message}
                          </div> */}
                        </div>

                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Assigned Attorney
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip07"
                            type="text"
                            required=""
                            value={userIDData?.assignedData?.assigned_attorney}
                            readOnly
                          />
                        </div>
                        {/* <div className="col-md-2 position-relative"></div> */}
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Assigned Medical Facility
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip07"
                            type="text"
                            required=""
                            value={
                              userIDData?.assignedData
                                ?.assigned_medical_facility
                            }
                            readOnly
                          />
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Attorney Comments
                          </label>
                          <br />
                          <ul
                            style={{
                              overflowY: "scroll",
                              maxHeight: "150px",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#ced4da",
                              backgroundColor: "#e9ecef",
                              borderRadius: "4px",
                              padding: "6px 12px",
                            }}
                          >
                            {userIDData?.attorneyCommentsData?.map(
                              (item, index) => {
                                return (
                                  <li id={index}>
                                    {item.last_visited_date +
                                      "  :  " +
                                      item.other_comments}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                        {/* <div className="col-md-2 position-relative"></div> */}

                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Medical Facility Comments
                          </label>
                          <br />
                          <ul
                            style={{
                              overflowY: "scroll",
                              maxHeight: "150px",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#ced4da",
                              backgroundColor: "#e9ecef",
                              borderRadius: "4px",
                              padding: "6px 12px",
                            }}
                          >
                            {userIDData?.medicalCommentsData?.map(
                              (item, index) => {
                                return (
                                  <li id={index}>
                                    {item.last_visited_date +
                                      "  :  " +
                                      item.other_comments}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                        <div className="col-md-12 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Attorney Attach Document List
                          </label>
                          <br />
                          <ul
                            style={{
                              overflowY: "scroll",
                              maxHeight: "150px",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#ced4da",
                              backgroundColor: "#e9ecef",
                              borderRadius: "4px",
                              padding: "6px 12px",
                            }}
                          >
                            {userIDData?.attorneyDocuments?.map(
                              (item, index) => {
                                return (
                                  <li id={index}>
                                    <Link
                                      to={item.document}
                                      style={{ color: "blue" }}
                                    >
                                      Document {index + 1} : {item.document}
                                    </Link>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                        {/* <div className="col-md-2 position-relative"></div> */}

                        <div className="col-md-12 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Medical Facility Attach Document List
                          </label>
                          <br />
                          <ul
                            style={{
                              overflowY: "scroll",
                              maxHeight: "150px",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#ced4da",
                              backgroundColor: "#e9ecef",
                              borderRadius: "4px",
                              padding: "6px 12px",
                            }}
                          >
                            {userIDData?.medicalDocuments?.map(
                              (item, index) => {
                                return (
                                  <li id={index}>
                                    <Link
                                      to={item.document}
                                      style={{ color: "blue" }}
                                    >
                                      Document {index + 1} : {item.document}
                                    </Link>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
