import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import moment from "moment";
import { ErrorAlert } from "../Common/Alert";
import { useDispatch, useSelector } from "react-redux";
import * as LeadSlice from "../store/slice/leadSlice";
import { insuranceProvider, questions } from "../store/slice/admindataSlice";
import * as ManageMedical from "../store/slice/manageMedicalSlice";
import * as ManageAttorney from "../store/slice/manageAttorneySlice";
import Loader from "../components/loader/Loader";
import { nearByAttorney } from "../store/slice/attorneySlice";
import { nearByMedicalFacility } from "../store/slice/medicalFacilitySlice";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Tooltip } from "@material-ui/core";
import MapComponent from "../components/MapComponent";
import languages from "language-list";
import Select from "react-select";

export default function Qualifying() {
  const lang = languages();
  const AllLang = lang.getData();
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const [getAttorney, setAttorney] = useState("");
  const [getMedicalDetail, setMedicalDetail] = useState("");
  const [address, setAddress] = useState(null);
  const [coordinates, setCoordinates] = useState("");
  const [selectedValues, setSelectedValues] = useState(null);
  const [errmsg, setErrmsg] = useState(false);
  const [addCheck, setAddCheck] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [mapUserData, setMapUserData] = useState(null);
  const [attorneyMeet, setAttorneyMeet] = useState("");
  const [attorneyMeetStatus, setAttorneyMeetStatus] = useState(false);
  const [medicalMeet, setMedicalMeet] = useState("");

  const [medicalMeetStatus, setMedicalMeetStatus] = useState(false);
  const [middeleName, setMiddleName] = useState("");

  const AttorneyMeetFunc = (e) => {
    setAttorneyMeetStatus(true);
    setAttorneyMeet(e.target.value);
  };

  const MedicalMeetFunc = (e) => {
    setMedicalMeetStatus(true);
    setMedicalMeet(e.target.value);
  };

  const navigate = useNavigate();

  const location = useLocation();
  const dispatch = useDispatch();
  const LeadID = location.state != null ? location.state.ID : "";

  const [useDataSubmit, setDataSubmit] = useState(false);

  const LeadIData = useSelector((state) => state.lead.leadByIDGet.data.data);
  

  useEffect(() => {
    if (LeadID) {
      dispatch(LeadSlice.leadByID({ lead_id: LeadID }));
    }
    return () => dispatch(LeadSlice.setLeadID());
  }, [LeadID]);

  useEffect(() => {
    if (LeadIData?.top_involved) {
      setSelectedValues(LeadIData?.top_involved);
      setAddress(LeadIData?.address1);
      setMedicalMeet(LeadIData?.medical_appointment);
      setAttorneyMeet(LeadIData?.attorney_appointment);
    }
  }, [LeadIData]);

  useEffect(() => {
    dispatch(insuranceProvider({}));
    dispatch(questions({}));
    dispatch(LeadSlice.vehicleRegisterState({}));
  }, []);

  const insuranceData = useSelector(
    (store) => store.admindata.InsuranceData.data.data
  );
  
  const options = insuranceData?.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const QuestionData = useSelector(
    (store) => store.admindata.QuestionsData.data.data
  );

  const VehicleStateData = useSelector(
    (store) => store.lead.vehicleRegisterStateData.data.data
  );

  //
  const handleCheckboxChange = (value) => {
    if (selectedValues.includes(value)) {
      // If the value is already in the array, remove it
      setSelectedValues(selectedValues.filter((item) => item !== value));
      if (selectedValues.length === 0) {
        setErrmsg(true);
      }
    } else {
      // If the value is not in the array, add it
      setSelectedValues([...selectedValues, value]);
      if (selectedValues.length !== 0) {
        setErrmsg(false);
      }
    }
  };

  // const [getTimeDate, setTimeDate] = useState("");

  // const timeFunction = (e) => {
  //   setTimeDate(e.target.value);
  // };

  const AttorneyData = useSelector(
    (state) => state.attorney.nearAttorneyData.data.data
  );
  //
  const MedicalData = useSelector(
    (state) => state.medicalfacility.nearByMedicalFacilityData.data.data
  );
  //

  useEffect(() => {
    if (AttorneyData !== undefined && MedicalData !== undefined) {
      const mergedData = [
        ...AttorneyData.map((attorney) => ({
          ...attorney,
          label: attorney.name,
          position: {
            lat: parseFloat(attorney.latitude),
            lng: parseFloat(attorney.longitude),
          },
          icon: {
            url: "https://ihcms.s3.amazonaws.com/Public/Map_pin_icon_green.svg",
            scaledSize: new window.google.maps.Size(30, 40),
            labelOrigin: new window.google.maps.Point(15, -7),
          },
        })),
        ...MedicalData.map((medical) => ({
          ...medical,
          label: medical.name,
          position: {
            lat: parseFloat(medical.latitude),
            lng: parseFloat(medical.longitude),
          },
          icon: {
            url: "https://ihcms.s3.amazonaws.com/Public/map_pin_blue.png",
            scaledSize: new window.google.maps.Size(45, 50),
            labelOrigin: new window.google.maps.Point(22, -1),
          },
        })),
      ];

      setMapData(mergedData);
    }
  }, [AttorneyData, MedicalData]);

  // useEffect(() => {
  //   if (MedicalData !== undefined) {
  //     MedicalData.map((item) => {
  //
  //       if (item?.name === LeadIData?.assigned_medical_facility_name) {
  //         setMedicalDetail(item?.id);
  //       }
  //     });
  //   }
  // }, [MedicalData, LeadIData]);

  const FormComplete = () => {
    if (getMedicalDetail !== "" || medicalMeet !== "") {
      dispatch(
        ManageMedical.assignMedicalFacility({
          lead_id: LeadID,
          medical_id: getMedicalDetail,
          medical_appointment: medicalMeet,
        })
      ).then((res) => {
        navigate("/user-list");
      });
    }
    if (getAttorney !== "" || attorneyMeet !== "") {
      dispatch(
        ManageAttorney.assignAttorney({
          lead_id: LeadID,
          attorney_id: getAttorney,
          attorney_appointment: attorneyMeet,
        })
      ).then((res) => {
        navigate("/user-list");
      });
    }
  };

  const validationQualifying = Yup.object().shape({
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .matches("^[A-Za-z]{2,20}$", "Only alphabets are allowed for this field"),
    middle_name:
      middeleName !== "" && middeleName !== undefined
        ? Yup.string()
            .required("Middle name is required")
            .min(1, "Name must be at least 1 characters")
            .max(20, "Name must be at most 20 characters")
            .matches(
              "^[A-Za-z]{1,20}$",
              "Only alphabets are allowed for this field"
            )
        : Yup.string(),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .matches("^[A-Za-z]{2,20}$", "Only alphabets are allowed for this field"),

    // disposition: Yup.string().required("Disposition is required"),
    // comment: Yup.string().required("Comment is required"),
    gender: Yup.string().required("Gender is required"),
    language: Yup.string().required("Language is required"),
    adult: Yup.string().required("Adult is required"),
    // topinvolved: Yup.string().required(" Top Involved is required"),
    // addleadrights: Yup.array()
    //   .of(Yup.string())
    //   .min(1, "Please select at least one right"),

    typeofcase: Yup.string().required("Type of Case is required"),
    vehicleregisterstate: Yup.string().required(
      "Vehicle Register State is required"
    ),
    insuranceprovider: Yup.string().required("Insurance Provider is required"),
    other: Yup.string().required("Other is required"),
    question: Yup.string().required("Question is required"),
    // : Yup.string().required("Answer is required"),
    answer: Yup.string()
      .required("Answer is required")
      .min(2, "Answer must be at least 2 characters")
      .max(20, "Answer must be at most 20 characters")
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

    injuries: Yup.string().required("Injuries Description is required"),
    accident: Yup.string().required("Accident Description is required"),
    accidentlocation: Yup.string().required("Accident Location is required"),
    date: Yup.string()
      .required("Date of accident is required")
      .test(
        "Is date greater",
        "Date of accident cannot be greater than today's date",
        (value) => {
          if (!value) return true;
          return moment(new Date()).diff(value) > 0;
        }
      ),

    otherdetails: Yup.string().required("Other Details is required"),

    // othercomments: Yup.string().required("Other Comments is required"),
  });

  const formOptions = { resolver: yupResolver(validationQualifying) };
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  const { errors } = formState;

  useEffect(() => {
    setValue("insuranceprovider", LeadIData?.insurance_provider);
  }, [setValue, LeadIData?.insurance_provider]);

  const DataSubmit = (data) => {
    console.log(data)
    try {
      if (selectedValues.length !== 0 && address !== "") {
        if (data) {
          let adultData = data.adult === "Yes" ? 1 : 0;
          //
          dispatch(
            LeadSlice.updateLead({
              lead_id: LeadIData?.id,
              first_name: data.first_name,
              middle_name: data.middle_name,
              last_name: data.last_name,
              comment: data.comment,
              disposition: data.disposition,
              gender: data.gender,
              language: data.language,
              is_adult: adultData,
              email: data.email,
              // calling_code: data.callingCountryCode,
              phone: data.localPhoneNumber,
              top_involved: selectedValues,
              case_type: data.typeofcase,
              vehicle_register_state: data.vehicleregisterstate,
              insurance_provider: data.insuranceprovider,
              injuries_description: data.injuries,
              accident_description: data.accident,
              accident_location: data.accidentlocation,
              date_of_accident: data.date,
              other_details: data.otherdetails,
              address1: address,
              address2: data.address2,
              other: data.other,
              pic_question: data.question,
              latdata: coordinates,
              pic_answer: data.answer,
              other_comments: data.othercomments,
            })
          ).then((res) => {
            if (res.payload.code === "1") {
              //
              setMapUserData(res.payload.data);
              dispatch(nearByAttorney({ lead_id: LeadIData?.id }));
              dispatch(nearByMedicalFacility({ lead_id: LeadIData?.id }));
            }
          });
          setDataSubmit(true);
          setErrmsg(false);
          setAddCheck(false);
        }
      } else {
        if (selectedValues.length === 0) {
          setErrmsg(true);
        }
        if (address === "") {
          setAddCheck(true);
        }
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);

    const ll = await getLatLng(results[0]);

    setAddress(value);
    setCoordinates(ll);
  };

  const handleMarkerClick = (index) => {
    //
    // You can implement your custom logic here
  };

  if (LeadIData == null) return <></>;
  // if (languageData == "") return <></>;

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
                    <h4>Qualifying</h4>
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
                      <li className="breadcrumb-item active"> Qualifying</li>
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
                      <h4>Qualifying Form</h4>
                    </div>
                    <div className="card-body">
                      <form
                        className="row g-3 needs-validation custom-input"
                        noValidate=""
                        onSubmit={handleSubmit(DataSubmit)}
                      >
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            for="validationTooltip01"
                          >
                            First Name
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="First Name"
                            defaultValue={LeadIData?.first_name}
                            // readOnly
                            {...register("first_name")}
                          />
                          <div className="invalid-feedback">
                            {errors.first_name?.message}
                          </div>
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            for="validationTooltip02"
                          >
                            Middle Name
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip02"
                            type="text"
                            placeholder="Middle Name"
                            defaultValue={LeadIData?.middle_name}
                            // readOnly
                            {...register("middle_name")}
                          />
                          <div className="invalid-feedback">
                            {errors.middle_name?.message}
                          </div>
                        </div>
                        <div className="col-md-4 position-relative">
                          <label
                            className="form-label"
                            for="validationTooltip02"
                          >
                            Last Name
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip02"
                            type="text"
                            placeholder="Last Name"
                            defaultValue={LeadIData?.last_name}
                            // readOnly
                            {...register("last_name")}
                          />
                          <div className="invalid-feedback">
                            {errors.last_name?.message}
                          </div>
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
                            defaultValue={LeadIData?.comment}
                            // readOnly
                            {...register("comment")}
                          />
                          <div className="invalid-feedback">
                            {errors.comment?.message}
                          </div>
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
                            // disabled={true}
                            {...register("disposition")}
                          >
                            <option selected="">Choose...</option>
                            <option
                              selected={
                                LeadIData?.disposition ===
                                "Customer Already Signed"
                              }
                            >
                              Customer Already Signed{" "}
                            </option>
                            <option
                              selected={
                                LeadIData?.disposition === "Answering Machine"
                              }
                            >
                              Answering Machine{" "}
                            </option>
                            <option
                              selected={LeadIData?.disposition === "Callback"}
                            >
                              Callback{" "}
                            </option>
                            <option
                              selected={LeadIData?.disposition === "No Contact"}
                            >
                              No Contact
                            </option>
                            <option
                              selected={
                                LeadIData?.disposition === "Does Not Qualify"
                              }
                            >
                              Does Not Qualify
                            </option>
                            <option
                              selected={LeadIData?.disposition === "Follow Up"}
                            >
                              Follow Up
                            </option>
                            <option
                              selected={
                                LeadIData?.disposition === "Medical Facility"
                              }
                            >
                              Medical Facility
                            </option>
                            <option
                              selected={LeadIData?.disposition === "Attorney"}
                            >
                              Attorney
                            </option>
                            <option
                              selected={LeadIData?.disposition === "Injured"}
                            >
                              Injured
                            </option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.disposition?.message}
                          </div>
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
                              defaultValue={LeadIData?.id}
                              readOnly
                              {...register("id")}
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
                            {...register("gender")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option selected={LeadIData?.gender === "Male"}>
                              Male{" "}
                            </option>
                            <option selected={LeadIData?.gender === "Female"}>
                              Female{" "}
                            </option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.gender?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Language
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            {...register("language")}
                            // value={languageData}
                            defaultValue={LeadIData?.language}
                            // onChange={handleLanguageChange}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>

                            {AllLang.map((item, index) => {
                              return (
                                <option key={index} value={item.language}>
                                  {item?.language}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errors.language?.message}
                          </div>
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
                            {...register("adult")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option selected={LeadIData?.is_adult === 1}>
                              Yes{" "}
                            </option>
                            <option selected={LeadIData?.is_adult === 0}>
                              No{" "}
                            </option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.adult?.message}
                          </div>
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
                            defaultValue={LeadIData?.email}
                            {...register("email")}
                          />
                          <div className="invalid-feedback">
                            {errors.email?.message}
                          </div>
                        </div>

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
                            defaultValue={LeadIData?.phone}
                            {...register("localPhoneNumber")}
                          />
                          <div className="invalid-feedback">
                            {errors.localPhoneNumber?.message}
                          </div>
                        </div>

                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Select Top Involved
                          </label>
                          {selectedValues === null ? (
                            <></>
                          ) : (
                            <div className="row">
                              <div className="col-md-4">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    // {...register("addleadrights")}
                                    onChange={() =>
                                      handleCheckboxChange("Driver")
                                    }
                                    defaultChecked={selectedValues.includes(
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
                                    id="flexCheckDefault1"
                                    type="checkbox"
                                    // {...register("addleadrights")}
                                    onChange={() =>
                                      handleCheckboxChange("Passenger")
                                    }
                                    defaultChecked={selectedValues.includes(
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
                                    id="flexCheckDefault2"
                                    type="checkbox"
                                    value={"OPIV"}
                                    defaultChecked={selectedValues.includes(
                                      "OPIV"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange("OPIV")
                                    }
                                    // {...register("addleadrights")}
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
                          )}
                          {errmsg === true ? (
                            <div className="invalid-feedback text-center">
                              Top Involved is required
                            </div>
                          ) : (
                            <></>
                          )}
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
                            {...register("typeofcase")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option selected={LeadIData?.case_type === "WC"}>
                              WC{" "}
                            </option>
                            <option selected={LeadIData?.case_type === "TLC"}>
                              TLC{" "}
                            </option>
                            <option
                              selected={LeadIData?.case_type === "No Fault"}
                            >
                              No Fault{" "}
                            </option>
                            <option
                              selected={LeadIData?.case_type === "Slip & Fall"}
                            >
                              Slip & Fall{" "}
                            </option>
                            <option selected={LeadIData?.case_type === "Labor"}>
                              Labor{" "}
                            </option>
                            <option selected={LeadIData?.case_type === "MMP"}>
                              MMP{" "}
                            </option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.typeofcase?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Vehicle Register State
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            {...register("vehicleregisterstate")}
                            defaultValue={LeadIData?.vehicle_register_state}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            {VehicleStateData?.map((item, index) => {
                              return (
                                <option key={index} value={item?.state_name}>
                                  {item?.state_name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errors.vehicleregisterstate?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Insurance Provider
                          </label>
                          <Select
                            defaultValue={options?.find(
                              (option) =>
                                option.value === LeadIData.insurance_provider
                            )}
                            options={options}
                            onChange={(selectedOption) =>
                              setValue(
                                "insuranceprovider",
                                selectedOption.value
                              )
                            }
                            {...register("insuranceprovider")}
                          ></Select>
                          <div className="invalid-feedback">
                            {errors.insuranceprovider?.message}
                          </div>
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
                            defaultValue={LeadIData?.injuries_description}
                            {...register("injuries")}
                          />
                          <div className="invalid-feedback">
                            {errors.injuries?.message}
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
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            defaultValue={LeadIData?.accident_description}
                            {...register("accident")}
                          />
                          <div className="invalid-feedback">
                            {errors.accident?.message}
                          </div>
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
                            defaultValue={LeadIData?.accident_location}
                            {...register("accidentlocation")}
                          />

                          <div className="invalid-feedback">
                            {errors.accidentlocation?.message}
                          </div>
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
                            defaultValue={LeadIData?.date_of_accident}
                            {...register("date")}
                          />
                          <div className="invalid-feedback">
                            {errors.date?.message}
                          </div>
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
                            defaultValue={LeadIData?.other_details}
                            {...register("otherdetails")}
                          />
                          <div className="invalid-feedback">
                            {errors.otherdetails?.message}
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
                        {addCheck === true ? (
                          <div className="invalid-feedback">
                            Address is required.
                          </div>
                        ) : (
                          <></>
                        )}
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
                            defaultValue={LeadIData?.address2}
                            {...register("address2")}
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
                            {...register("other")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option selected={LeadIData?.other === "PR"}>
                              PR
                            </option>
                            <option selected={LeadIData?.other === "MV104"}>
                              MV104{" "}
                            </option>
                            <option selected={LeadIData?.other === "AMB R"}>
                              AMB R{" "}
                            </option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.other?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Pic Question
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            defaultValue={LeadIData?.pic_question}
                            {...register("question")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            {QuestionData?.map((item, index) => {
                              return (
                                <option key={index} value={item.question}>
                                  {item?.question}{" "}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errors.question?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Answer
                          </label>
                          {/* <select
                            className="form-select"
                            id="validationTooltip04"
                            required=""
                            {...register("answer")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option
                              selected={LeadIData?.pic_answer === "Question 1"}
                            >
                              Question 1{" "}
                            </option>
                            <option
                              selected={LeadIData?.pic_answer === "Question 2"}
                            >
                              Question 2{" "}
                            </option>
                            <option
                              selected={LeadIData?.pic_answer === "Question 3"}
                            >
                              Question 3{" "}
                            </option>
                          </select> */}
                          <input
                            className="form-control"
                            id="validationTooltip07"
                            type="text"
                            defaultValue={LeadIData?.pic_answer}
                            {...register("answer")}
                          />
                          <div className="invalid-feedback">
                            {errors.answer?.message}
                          </div>
                        </div>
                        <div className="col-md-5 position-relative">
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
                            defaultValue={LeadIData?.other_comments}
                            // {...register("othercomments")}
                          />
                          {/* <div className="invalid-feedback">
                            {errors.othercomments?.message}
                          </div> */}
                        </div>
                        {useDataSubmit === false ? (
                          <div className="col-12">
                            <button className="btn btn-primary" type="submit">
                              Submit Data
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* <div className="col-md-4 position-relative"></div> */}
                            <div className="col-md-3 position-relative">
                              <label
                                className="form-label"
                                htmlFor="validationTooltip04"
                              >
                                Select Medical Facility
                              </label>
                              <select
                                className="form-select"
                                id="validationTooltip04"
                                onChange={(e) => {
                                  setMedicalDetail(e.target.value);
                                }}
                              >
                                <>
                                  <option selected="" disabled="" value="">
                                    {LeadIData.assigned_medical_facility_name ===
                                    ""
                                      ? "Choose..."
                                      : LeadIData.assigned_medical_facility_name}
                                  </option>
                                  {MedicalData?.map((item, index) => {
                                    return (
                                      <>
                                        {LeadIData.assigned_medical_facility_name ===
                                        item.name ? (
                                          <></>
                                        ) : (
                                          <option value={item.id} key={index}>
                                            {item.name}
                                          </option>
                                        )}
                                      </>
                                    );
                                  })}
                                </>
                                {/* // )} */}
                              </select>
                            </div>
                            <div className="col-md-3 position-relative">
                              <label
                                className="form-label"
                                htmlFor="validationTooltip04"
                              >
                                Medical Facility Appointment
                              </label>

                              {getMedicalDetail === "" ? (
                                <input
                                  className="form-control"
                                  id="validationTooltip08"
                                  type="datetime-local"
                                  defaultValue={LeadIData?.medical_appointment}
                                  onChange={MedicalMeetFunc}
                                  disabled
                                />
                              ) : (
                                <input
                                  className="form-control"
                                  id="validationTooltip08"
                                  type="datetime-local"
                                  defaultValue={LeadIData?.medical_appointment}
                                  onChange={MedicalMeetFunc}
                                />
                              )}

                              {medicalMeetStatus === true &&
                              medicalMeet === "" ? (
                                <div className="invalid-feedback">
                                  Date of Medical Facility Appointment Require
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className="col-md-3 position-relative">
                              <label
                                className="form-label"
                                htmlFor="validationTooltip04"
                              >
                                Select Attorney
                              </label>
                              <select
                                className="form-select"
                                id="validationTooltip04"
                                onChange={(e) => setAttorney(e.target.value)}
                              >
                                <>
                                  <option selected="" disabled="" value="">
                                    {LeadIData.assigned_attorney_name === ""
                                      ? "Choose..."
                                      : LeadIData.assigned_attorney_name}
                                  </option>
                                  {AttorneyData?.map((item, index) => {
                                    return (
                                      <>
                                        {LeadIData.assigned_attorney_name ===
                                        item.name ? (
                                          <></>
                                        ) : (
                                          <option value={item.id} key={index}>
                                            {item.name}
                                          </option>
                                        )}
                                      </>
                                    );
                                  })}
                                </>
                                {/* // )} */}
                              </select>
                            </div>
                            <div className="col-md-3 position-relative">
                              <label
                                className="form-label"
                                htmlFor="validationTooltip04"
                              >
                                Attorney Appointment
                              </label>
                              {getAttorney === "" ? (
                                <input
                                  className="form-control"
                                  id="validationTooltip08"
                                  type="datetime-local"
                                  defaultValue={LeadIData?.attorney_appointment}
                                  onChange={AttorneyMeetFunc}
                                  disabled
                                />
                              ) : (
                                <input
                                  className="form-control"
                                  id="validationTooltip08"
                                  type="datetime-local"
                                  defaultValue={LeadIData?.attorney_appointment}
                                  onChange={AttorneyMeetFunc}
                                />
                              )}

                              {attorneyMeetStatus === true &&
                              attorneyMeet === "" ? (
                                <div className="invalid-feedback">
                                  Date of Attorney Appointment Require
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>

                            {mapUserData !== null ? (
                              <div className="col-md-12 position-relative">
                                <div className="row">
                                  <div className="col-md-3"></div>
                                  <div className="col-md-3">
                                    <p>
                                      <img
                                        src="https://ihcms.s3.amazonaws.com/Public/Map_pin_icon_green.svg"
                                        style={{ height: "20px" }}
                                      />
                                      &nbsp; Attorney
                                    </p>
                                  </div>
                                  <div className="col-md-6">
                                    <p>
                                      <img
                                        src="https://ihcms.s3.amazonaws.com/Public/map_pin_blue.png"
                                        style={{ height: "20px" }}
                                      />
                                      &nbsp; Medical Facility
                                    </p>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    height: "50vh",
                                    width: "100%",
                                  }}
                                >
                                  <MapComponent
                                    markers={mapData}
                                    onMarkerClick={handleMarkerClick}
                                    data={{
                                      lat: parseFloat(mapUserData.lat),
                                      lng: parseFloat(mapUserData.lng),
                                    }}
                                    containerElement={
                                      <div style={{ height: "100%" }} />
                                    }
                                    mapElement={
                                      <div style={{ height: "100%" }} />
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}

                            {getAttorney !== "" ||
                            getMedicalDetail !== "" ||
                            attorneyMeet !== "" ||
                            medicalMeet !== "" ? (
                              <div
                                className="col-12"
                                style={{ textAlign: "center" }}
                              >
                                <span
                                  className="btn btn-primary position-center"
                                  onClick={FormComplete}
                                >
                                  Submit Data
                                </span>
                              </div>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
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
