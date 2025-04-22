import React, { useEffect, useLayoutEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Tooltiphome from "../../Common/Tooltiphome";
import * as AllRedux from "../../store/slice/attorneySlice";
import { useSelector, useDispatch } from "react-redux";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";

export default function ManageattorneyID() {
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [addCheck, setAddCheck] = useState(false);

  const { id } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AllRedux.attorneyList({}));
    if (id !== null) {
      dispatch(AllRedux.attorneyByID({ attorney_id: id }));
    }
    return () => dispatch(AllRedux.setAttorneyID());
  }, [id]);

  const AttorneyIDData = useSelector(
    (state) => state.attorney.attorneyByIDGet.data.data
  );

  useEffect(() => {
    if (AttorneyIDData?.address) {
      setAddress(AttorneyIDData?.address);
    }
  }, [AttorneyIDData]);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);

    setAddress(value);
    setCoordinates(ll);
  };

  const validationSubAdmin = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name must be at most 30 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,30}$",
        "Only alphabets are allowed for this field"
      ),
    designation: Yup.string()
      .required("Designation is required")
      .min(2, "Designation must be at least 2 characters")
      .max(20, "Designation must be at most 20 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,20}$",
        "Only alphabets are allowed for this field"
      ),
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .test("Email is invalid", "Email is invalid", (value) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(value) !== false;
      })
      .strict(true),
    localPhoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9()\s\-]+$/, "Invalid phone number")
      .min(9, "Number must be at least 9 characters")
      .max(11, "Number must be at most 11 characters"),
    // callingCountryCode: Yup.string()
    //   .required("Calling country code is required")
    //   .matches(/^\+\d{1,4}$/, "Invalid calling country code"),

    // address1: Yup.string().required("Address is required"),
    mfstatus: Yup.string().required("Type is required"),
    // latitude: Yup.string()
    //   .required("Latitude is required")
    //   .matches(/^-?(90(\.\d{1,7})?|[0-8]?\d(\.\d{1,7})?)$/, "Invalid latitude"),
    // longitude: Yup.string()
    //   .required("Latitude is required")
    //   .matches(
    //     /^-?(180(\.\d{1,7})?|(1[0-7]\d|\d{1,2})(\.\d{1,7})?)$/,
    //     "Invalid longitude"
    //   ),
    location: Yup.string()
      .required("Location is required")
      .min(2, "Location must be at least 2 characters")
      .max(20, "Location must be at most 20 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,20}$",
        "Only alphabets are allowed for this field"
      ),
    description: Yup.string().required("Description is required"),
  });

  const formOptions = { resolver: yupResolver(validationSubAdmin) };
  const { register, handleSubmit, formState, reset, setValue } =
    useForm(formOptions);
  const { errors } = formState;
  const DataSubmit = (data) => {
    try {
      if (address !== "") {
        if (data) {
          dispatch(
            AllRedux.UpdateAttorneyList({
              attorney_id: AttorneyIDData?.id,
              name: data.name,
              manager_name: data.designation,
              email: data.email,
              // calling_code: data.callingCountryCode,
              phone_number: data.localPhoneNumber,
              address: address,
              latdata: coordinates,
              location: data.location,
              description: data.description,
              attorney_type: data.mfstatus,
            })
          ).then((res) => {
            navigate(-1);
          });
        }
        setAddCheck(false);
      }
      setAddCheck(true);
    } catch (error) {}
  };

  if (AttorneyIDData === undefined) return <Loader />;
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
                    <h4>Add Attorney</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li
                        className="breadcrumb-item"
                        onClick={() => sessionStorage.removeItem("path")}
                      >
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">Add Attorney</li>
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
                      <h4>Edit Attorney</h4>
                    </div>
                    <div className="card-body">
                      <form
                        className="row g-3 needs-validation custom-input"
                        onSubmit={handleSubmit(DataSubmit)}
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
                            defaultValue={AttorneyIDData?.name}
                            {...register("name")}
                          />
                          <div className="invalid-feedback">
                            {errors.name?.message}
                          </div>
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
                            defaultValue={AttorneyIDData?.manager_name}
                            {...register("designation")}
                          />
                          <div className="invalid-feedback">
                            {errors.designation?.message}
                          </div>
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
                              placeholder="Email"
                              aria-describedby="validationTooltipUsernamePrepend"
                              defaultValue={AttorneyIDData?.email}
                              {...register("email")}
                            />
                            <div className="invalid-feedback">
                              {errors.email?.message}
                            </div>
                            <div className="invalid-tooltip">
                              Please choose a unique and valid username.
                            </div>
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
                              defaultValue={AttorneyIDData?.calling_code}
                              placeholder="Phone Code"
                              {...register("callingCountryCode")}
                            />
                            <div className="invalid-feedback">
                              {errors.callingCountryCode?.message}
                            </div>
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
                              defaultValue={AttorneyIDData?.phone_number}
                              placeholder="Phone Number"
                              {...register("localPhoneNumber")}
                            />
                            <div className="invalid-feedback">
                              {errors.localPhoneNumber?.message}
                            </div>
                          </div>
                        </div>

                        {/* <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Address
                          </label>
                          <div className="input-group has-validation">
                            <input
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              defaultValue={AttorneyIDData?.address}
                              {...register("address1")}
                            />
                            <div className="invalid-feedback">
                              {" "}
                              {errors.address1?.message}
                            </div>
                          </div>
                        </div> */}
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Location
                          </label>
                          <div className="input-group has-validation">
                            <input
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              defaultValue={
                                AttorneyIDData && AttorneyIDData?.location
                              }
                              {...register("location")}
                            />
                            <div className="invalid-feedback">
                              {errors.location?.message}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Attorney Type
                          </label>
                          <select
                            {...register("mfstatus")}
                            className="form-select"
                            id="validationTooltip04"
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option
                              selected={
                                AttorneyIDData?.attorney_type === "WC Attorney"
                              }
                            >
                              WC Attorney
                            </option>
                            <option
                              selected={
                                AttorneyIDData?.attorney_type ===
                                "No Fault Attorney"
                              }
                            >
                              No Fault Attorney
                            </option>
                            <option
                              selected={
                                AttorneyIDData?.attorney_type ===
                                "Slip & Fall Attorney"
                              }
                            >
                              Slip & Fall Attorney
                            </option>
                            <option
                              selected={
                                AttorneyIDData?.attorney_type ===
                                "Labor Attorney"
                              }
                            >
                              Labor Attorney
                            </option>
                            <option
                              selected={
                                AttorneyIDData?.attorney_type === "MMP Attorney"
                              }
                            >
                              MMP Attorney
                            </option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.mfstatus?.message}
                          </div>
                        </div>
                        <PlacesAutocomplete
                          value={address}
                          onChange={setAddress}
                          onSelect={handleSelect}
                          googleCallbackName="initPlaces"
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <div>
                              <div className="input_box">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  className="form-label"
                                >
                                  Address
                                </label>
                                <input
                                  className="form-control"
                                  id="address"
                                  defaultValue={address}
                                  {...register("address1")}
                                  {...getInputProps()}
                                />
                              </div>
                              <div>
                                {loading ? (
                                  <div className="text-secondary">
                                    loading...
                                  </div>
                                ) : null}

                                {suggestions.map((suggestion) => {
                                  const style = {
                                    backgroundColor: suggestion.active
                                      ? "#f1f0ff"
                                      : "#fff",
                                    textAlign: "left",
                                  };

                                  return (
                                    <div
                                      className="form-control"
                                      {...getSuggestionItemProps(suggestion, {
                                        style,
                                      })}
                                    >
                                      {suggestion.description}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>

                        {address === "" ? (
                          <div className="invalid-feedback">
                            Address is required.
                          </div>
                        ) : (
                          <></>
                        )}
                        {/* <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Longitude
                          </label>
                          <div className="input-group has-validation">
                            <input
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              defaultValue={AttorneyIDData?.longitude}
                              {...register("longitude")}
                            />
                            <div className="invalid-feedback">
                              {errors.longitude?.message}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Latitude
                          </label>
                          <div className="input-group has-validation">
                            <input
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              defaultValue={AttorneyIDData?.latitude}
                              {...register("latitude")}
                            />
                            <div className="invalid-feedback">
                              {errors.latitude?.message}
                            </div>
                            <div className="invalid-tooltip">
                              Please choose a unique and valid username.
                            </div>
                          </div>
                        </div> */}

                        <div className="col-md-12 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Description
                          </label>
                          <textarea
                            className="form-control"
                            id="validationTooltip010"
                            type="text"
                            defaultValue={
                              AttorneyIDData?.description
                                ? AttorneyIDData?.description
                                : ""
                            }
                            {...register("description")}
                          />
                          <div className="invalid-feedback">
                            {errors.description?.message}
                          </div>
                        </div>

                        <div className="col-12">
                          <button className="btn btn-primary" type="submit">
                            Edit Attorney
                          </button>
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
