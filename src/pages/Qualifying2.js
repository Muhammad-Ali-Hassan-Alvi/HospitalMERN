import React, { useEffect, useMemo, useState } from "react";
import { Link, json, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import moment from "moment";
import { ErrorAlert, SuccessAlert } from "../Common/Alert";
import { useDispatch, useSelector } from "react-redux";
import * as LeadSlice from "../store/slice/leadSlice";
import {
  insuranceProvider,
  questions,
  update_xml,
} from "../store/slice/admindataSlice";
import * as ManageMedical from "../store/slice/manageMedicalSlice";
import * as ManageAttorney from "../store/slice/manageAttorneySlice";
import Loader from "../components/loader/Loader";
import { nearByAttorney } from "../store/slice/attorneySlice";
import {
  nearByMedicalFacility,
  saveCall,
} from "../store/slice/medicalFacilitySlice";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Tooltip } from "@material-ui/core";
import MapComponent from "../components/MapComponent";
import languages from "language-list";
import Select from "react-select";
import { SubadminListing } from "../store/slice/subadminSlice";
import { paralegalDate } from "../store/slice/billingSlice";
import { useDropzone } from "react-dropzone";
import AWS from "../AWS/aws-config";
import Transport from "./Transport";
import Swal from "sweetalert2";
import { Device } from "@twilio/voice-sdk";

export default function Qualifying() {
  const lang = languages();
  const AllLang = lang.getData();
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const [getAttorney, setAttorney] = useState("");
  const [getMedicalDetail, setMedicalDetail] = useState("");
  
  const [address, setAddress] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  const [coordinates, setCoordinates] = useState("");

  const [call, setCall] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedValues, setSelectedValues] = useState(null);
  const [selectedDetailDataValues, setselectedDetailDataValues] = useState([]);
  const [device, setDevice] = useState(null);

  const [callButton, setCallButton] = useState("null");
  const [errmsg, setErrmsg] = useState(false);
  const [detailDataerrmsg, setdetailDataerrmsg] = useState(false);
  const [addCheck, setAddCheck] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [attorneyMeet, setAttorneyMeet] = useState("");
  const [attorneyMeetStatus, setAttorneyMeetStatus] = useState(false);
  const [medicalMeet, setMedicalMeet] = useState("");
  
  const [altNumber, setAltNumber] = useState("");
  const [instaID, setinstaID] = useState("");
  const [medicalMeetStatus, setMedicalMeetStatus] = useState(false);
  const [middeleName, setMiddleName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [files, setFiles] = useState([]);
  const [getLoading, setLoading] = useState(false);
  const s3 = new AWS.S3();
  const [randomName, setRandomName] = useState([]);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    setCallButton(sessionStorage.getItem("setCallButton"));
  }, [sessionStorage.getItem("setCallButton")]);

  const addLogMessage = (message) => {
    setLogMessages((prevMessages) => [...prevMessages, message]);
  };
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

  const outgoingCallHangupButton = async () => {
    addLogMessage("Hanging up ...");
    const numbers = LeadIData?.calling_code + LeadIData?.phone;
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
          name: LeadIData?.first_name,
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

  const updateUIAcceptedOutgoingCall = (res) => {
    sessionStorage.setItem("SID", res?.parameters?.CallSid);
    addLogMessage("Call in progress ...");
    sessionStorage.setItem("setCallButton", false);
  };
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

  const updateUIDisconnectedOutgoingCall = () => {
    const numbers = LeadIData?.calling_code + LeadIData?.phone;
    dispatch(
      saveCall({
        name: LeadIData?.first_name,
        number: numbers,
        role: "Client",
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
    //   To: "+918460534716",
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
        number: "+918460534716",
        caller_id: process.env.REACT_APP_CALLER_ID,
      })
    ).then((res) => {
      if (res?.payload?.code === "1") {
        startCall();
      }
    });
  };

  const AdminRole = useSelector(
    (state) => state?.admindata?.adminData?.data?.role
  );

  const UploadData = async () => {
    try {
      setLoading(true);
      const uploadPromises = files.map((file) => {
        let a = file.name.replace(" ", "_").replace("'", "");

        const newFileName = new Date().getTime() + "_" + a;

        const params = {
          Bucket: "ihcms/lead_document",
          Key: newFileName,
          Body: file,
          ACL: "public-read",
        };

        return new Promise((resolve, reject) => {
          s3.putObject(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              randomName.push(newFileName);

              resolve(newFileName);
            }
          });
        });
      });

      await Promise.all(uploadPromises);

      const res = await dispatch(
        LeadSlice.addLeadDocument({
          lead_id: LeadIData?.id,
          documents: randomName,
        })
      );
      dispatch(LeadSlice.leadByID({ lead_id: LeadID }));
      setRandomName([]);
      setFiles([]);
      setLoading(false);

      // navigate(-1);
    } catch (error) {}
  };

  const removeFile = (indexToRemove) => {
    // Create a copy of the files array
    const updatedFiles = [...files];

    // Remove the element at the specified index
    updatedFiles.splice(indexToRemove, 1);

    // Update the state with the new array
    setFiles(updatedFiles);
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

  const [getParalegalDate, setParalegalDate] = useState(null);

  useEffect(() => {
    dispatch(SubadminListing({}));
    dispatch(LeadSlice.leadList({}));
  }, []);

  const relatedCases = useSelector(
    (state) => state.lead.leadDataListing.data.data
  );

  const AllAdminData = useSelector(
    (state) => state?.subadmin?.listingSubadminData?.data?.data
  );

  const handleInputChange = (event, index, field) => {
    const { value } = event.target;
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setContacts(updatedContacts);
  };

  const handleInputChangeCase = (event, index, name) => {
    const { value } = event.target;
    setCases((prevContacts) => {
      return prevContacts.map((contact, idx) => {
        if (idx === index) {
          return { ...contact, [name]: value };
        }
        return contact;
      });
    });
  };

  const handleAddContact = () => {
    if (contacts.length == 0) {
      setContacts([...contacts, { name: "", phone: "", relationship: "" }]);
    } else {
      if (
        document.getElementById(`phone${contacts.length - 1}`).value !=
          undefined &&
        document.getElementById(`phone${contacts.length - 1}`).value != "" &&
        document.getElementById(`relationship${contacts.length - 1}`).value !=
          undefined &&
        document.getElementById(`relationship${contacts.length - 1}`).value !=
          "" &&
        document.getElementById(`contactName${contacts.length - 1}`).value !=
          undefined &&
        document.getElementById(`contactName${contacts.length - 1}`).value != ""
      ) {
        if (
          document.getElementById(`phone${contacts.length - 1}`).value.length >
            8 &&
          document.getElementById(`phone${contacts.length - 1}`).value.length <
            11 &&
          parseInt(document.getElementById(`phone${contacts.length - 1}`).value)
        ) {
          setContacts([...contacts, { name: "", phone: "", relationship: "" }]);
        } else {
          ErrorAlert("Please Enter Valid Mobile Number");
        }
      } else {
        ErrorAlert("Enter Valid values");
      }
    }
  };

  const handleAddCases = () => {
    // setSubmit(true);
    if (cases.length == 0) {
      setCases((prevContacts) => [...prevContacts, { name: "" }]);
    } else {
      if (
        document.getElementById(`RelatedCases${cases.length - 1}`).value !=
          undefined &&
        document.getElementById(`RelatedCases${cases.length - 1}`).value != ""
      ) {
        setCases((prevContacts) => [...prevContacts, { name: "" }]);
      } else {
        ErrorAlert("Please select valid related cases");
      }
    }
  };

  const handleRemoveContact = (index) => {
    setContacts((prevContacts) => prevContacts.filter((_, i) => i !== index));
  };

  const handleRemoveCases = (removeIndex) => {
    const updatedCases = cases.filter((_, index) => index !== removeIndex);
    setCases([]);
    setTimeout(() => {
      setCases(updatedCases);
    }, 200);
    // Update the state with the new array
  };

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

  // const [useDataSubmit, setDataSubmit] = useState(false);

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
    if (LeadIData) {
      setCoordinates({
        lat: parseFloat(LeadIData?.lat),
        lng: parseFloat(LeadIData?.longitude),
      });
      setContacts(LeadIData?.emergencyContactData);
      setCases(LeadIData?.realatedCaseData);
      setselectedDetailDataValues(LeadIData?.other_data);
      setParalegalDate(LeadIData?.paralegal_sign_date);
      setMedicalDetail(LeadIData?.assigned_medical_facility_name);
      setAttorney(LeadIData?.assigned_attorney_name);
    }
  }, [LeadIData]);

  useEffect(() => {
    if (coordinates !== "") {
      dispatch(
        LeadSlice?.updateLatLong({
          lead_id: LeadIData?.id,
          latdata: coordinates,
          address: address,
        })
      ).then((res) => {
        if (res.payload.code == 1) {
          dispatch(nearByAttorney({ lead_id: LeadIData?.id }));
          dispatch(nearByMedicalFacility({ lead_id: LeadIData?.id }));
        }
      });
    }
  }, [LeadIData?.id, address, coordinates]);

  useEffect(() => {
    dispatch(insuranceProvider({}));
    dispatch(questions({}));
    dispatch(LeadSlice.vehicleRegisterState({}));

    return () => {
      setCoordinates("");
    };
  }, []);

  const insuranceData = useSelector(
    (store) => store.admindata.InsuranceData.data.data
  );

  const options = insuranceData
    ? insuranceData.map((item) => ({
        value: item.name,
        label: item.name,
      }))
    : [];

  const QuestionData = useSelector(
    (store) => store.admindata.QuestionsData.data.data
  );

  const VehicleStateData = useSelector(
    (store) => store.lead.vehicleRegisterStateData.data.data
  );

  //
  const handleCheckboxChange = (value) => {
    if (selectedValues?.includes(value)) {
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

  const handleCheckboxDetailDataChange = (value) => {
    if (selectedDetailDataValues?.includes(value)) {
      // If the value is already in the array, remove it
      setselectedDetailDataValues(
        selectedDetailDataValues.filter((item) => item !== value)
      );
      if (selectedDetailDataValues?.length === 0) {
        setdetailDataerrmsg(true);
      }
    } else {
      // If the value is not in the array, add it
      setselectedDetailDataValues([...selectedDetailDataValues, value]);
      if (selectedDetailDataValues?.length !== 0) {
        setdetailDataerrmsg(false);
      }
    }
  };

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
        // Adding a marker for your current position
        {
          label: "Client Position",
          position: {
            lat: parseFloat(coordinates?.lat),
            lng: parseFloat(coordinates?.lng),
          },
          icon: {
            url: "https://ihcms.s3.amazonaws.com/Public/map_pin_red.svg",
            scaledSize: new window.google.maps.Size(60, 60),
            labelOrigin: new window.google.maps.Point(20, -7),
          },
        },
      ];

      setTimeout(() => {
        setMapData(mergedData);
      }, 1000);
    } else if (AttorneyData !== undefined) {
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

        {
          label: "Your Position",
          position: {
            lat: parseFloat(coordinates?.lat),
            lng: parseFloat(coordinates?.lng),
          },
          icon: {
            url: "https://ihcms.s3.amazonaws.com/Public/map_pin_red.svg",
            scaledSize: new window.google.maps.Size(40, 40),
            labelOrigin: new window.google.maps.Point(20, -7),
          },
        },
      ];

      setTimeout(() => {
        setMapData(mergedData);
      }, 1000);
    } else if (MedicalData !== undefined) {
      const mergedData = [
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
        // Adding a marker for your current position
        {
          label: "Your Position",
          position: {
            lat: parseFloat(coordinates?.lat),
            lng: parseFloat(coordinates?.lng),
          },
          icon: {
            url: "https://ihcms.s3.amazonaws.com/Public/map_pin_red.svg",
            scaledSize: new window.google.maps.Size(40, 40),
            labelOrigin: new window.google.maps.Point(20, -7),
          },
        },
      ];

      setTimeout(() => {
        setMapData(mergedData);
      }, 1000);
    } else if (coordinates && coordinates.lat && coordinates.lng) {
      const mergedData = [
        {
          label: "Your Position",
          position: {
            lat: parseFloat(coordinates?.lat),
            lng: parseFloat(coordinates?.lng),
          },
          icon: {
            url: "https://ihcms.s3.amazonaws.com/Public/map_pin_red.svg",
            scaledSize: new window.google.maps.Size(40, 40),
            labelOrigin: new window.google.maps.Point(20, -7),
          },
        },
      ];

      setTimeout(() => {
        setMapData(mergedData);
      }, 1000);
    }
  }, [AttorneyData, MedicalData, coordinates]);

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

    gender: Yup.string().required("Gender is required"),
    maritial: Yup.string().required("Maritial status is required"),
    language: Yup.string().required("Language is required"),
    adult: Yup.string().required("Adult is required"),
    instagramIdValidation:
      instaID !== "" && instaID !== undefined
        ? Yup.string()
            .required("Instagram ID is required")
            .matches(
              /^[a-zA-Z0-9_\.]+$/,
              "Invalid Instagram ID. Only letters, numbers, underscores, and periods are allowed."
            )
            .test(
              "no-leading-period",
              "Instagram ID cannot start with a period",
              (value) => value && !value.startsWith(".")
            )
        : Yup.string(),

    typeofcase: Yup.string().required("Type of Case is required"),
    vehicleregisterstate: Yup.string().required(
      "Vehicle Register State is required"
    ),
    // insuranceprovider: Yup.string().required("Insurance Provider is required"),
    // v_insuranceprovider: Yup.string().required(
    //   "V.Insurance Provider is required"
    // ),

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

    zip_code: Yup.string()
      .required("ZIP code is required")
      .matches(/^\d{5}(?:[-\s]\d{4})?$/, "Invalid ZIP code"),

    state_name: Yup.string().required("State name is required"),

    email: Yup.string()
      .trim()
      .required("Email address is required")
      .test("Email is invalid", "Email is invalid", (value) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(value) !== false;
      })
      .strict(true),
    localPhoneNumber:
      LeadIData?.phone === null || LeadIData?.phone === ""
        ? Yup.string()
            .required("Phone number is required")
            .matches(/^[0-9()\s\-]+$/, "Invalid phone number")
            .min(9, "Number must be at least 9 characters")
            .max(11, "Number must be at most 11 characters")
        : Yup.string(),
    localPhoneNumberAlter:
      altNumber !== "" && altNumber !== undefined
        ? Yup.string()
            .required("Phone number is required")
            .matches(/^[0-9()\s\-]+$/, "Invalid phone number")
            .min(9, "Number must be at least 9 characters")
            .max(11, "Number must be at most 11 characters")
        : Yup.string(),

    injuries: Yup.string().required("Injuries Description is required"),
    accident: Yup.string().required("Accident Description is required"),
    accidentlocation: Yup.string().required("Accident Location is required"),
    dateOfAccident: Yup.string()
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

    nf2: Yup.string(),
    rom: Yup.string(),

    paralegal: Yup.string().required("Paralegal name is required"),
    paralegalSignDate: Yup.string().required("Paralegal sign date is required"),
    paralegal_location: Yup.string()
      .required("Location is required")
      .min(2, "Location must be at least 2 characters")
      .max(30, "Location must be at most 30 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z0-9\\s-]{2,30}$",
        "Only alphabets are allowed for this field"
      ),
    referred_by: Yup.string()
      .required("Referred by is required")
      .min(2, "Referred by must be at least 2 characters")
      .max(30, "Referred by must be at most 30 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z0-9\\s-]{2,30}$",
        "Only alphabets are allowed for this field"
      ),
    supporting_staff: Yup.string().required(
      "Supporting staff name is required"
    ),

    caseData: Yup.string().required("Case data is required"),
    // caseStatus: Yup.string().required("Case status is required"),
    // claimData: Yup.string().required("Claim data is required"),
    precinctcode: Yup.string(),
  });

  const formOptions = { resolver: yupResolver(validationQualifying) };
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  const { errors } = formState;
  // console.log(
  //   LeadIData?.phone !== null && LeadIData?.phone !== "",
  //   "555555555555555555"
  // );
  useEffect(() => {
    setValue("insuranceprovider", LeadIData?.insurance_provider);
    setValue("v_insuranceprovider", LeadIData?.v_insurance_provider);
  }, [setValue, LeadIData]);

  const DataSubmit = (data) => {
    try {
      if (contacts.length == 0 && cases.length == 0) {
        if (
          selectedValues.length !== 0 &&
          address !== "" &&
          selectedDetailDataValues?.length !== 0
        ) {
          if (data) {
            let adultData = data.adult === "Yes" ? 1 : 0;

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
                phone:
                  LeadIData?.phone !== null && LeadIData?.phone !== ""
                    ? LeadIData?.phone
                    : data.localPhoneNumber,
                top_involved: selectedValues,
                other_data: selectedDetailDataValues,
                case_type: data.typeofcase,
                vehicle_register_state: data.vehicleregisterstate,
                insurance_provider: data.insuranceprovider,
                v_insurance_provider: data.v_insuranceprovider,
                injuries_description: data.injuries,
                accident_description: data.accident,
                accident_location: data.accidentlocation,
                date_of_accident: data.dateOfAccident,
                other_details: data.otherdetails,
                address1: address,
                address2: data.address2,
                other: data.other,
                pic_question: data.question,
                latdata: coordinates,
                pic_answer: data.answer,
                other_comments: data.othercomments,
                alt_number: data.localPhoneNumberAlter,
                maritial_status: data.maritial,
                instagram: data.instagramIdValidation,
                rom: data.rom,
                paralegal: data.paralegal,
                paralegal_sign_date: data?.paralegalSignDate,
                paralegal_location: data.paralegal_location,
                referred_by: data.referred_by,
                case: data.caseData,
                case_status: data.caseStatus,
                claim: data.claimData,
                supporting_staff: data.supporting_staff,
                nf2: data.nf2,
                precinct_code: data.precinctcode,
                zip_code: data.zip_code,
                state: data.state_name,
                contacts: contacts,
                relatedCase: cases,
                drListCode: data.drListCode,
              })
            ).then((res) => {
              if (res.payload.code === "1") {
                SuccessAlert(res.payload.message);
                UploadData();
                setSubmit(true);
              }
            });
            // setDataSubmit(true);
            setErrmsg(false);
            setdetailDataerrmsg(false);
            setAddCheck(false);
          }
        } else {
          if (selectedValues.length === 0) {
            setErrmsg(true);
            setdetailDataerrmsg(false);
          }
          if (address === "") {
            setAddCheck(true);
          }
        }
      } else {
        if (
          document.getElementById(`phone${contacts.length - 1}`).value !=
            undefined &&
          document.getElementById(`phone${contacts.length - 1}`).value != "" &&
          document.getElementById(`relationship${contacts.length - 1}`).value !=
            undefined &&
          document.getElementById(`relationship${contacts.length - 1}`).value !=
            "" &&
          document.getElementById(`contactName${contacts.length - 1}`).value !=
            undefined &&
          document.getElementById(`contactName${contacts.length - 1}`).value !=
            ""
        ) {
          if (
            document.getElementById(`phone${contacts.length - 1}`).value
              .length > 8 &&
            document.getElementById(`phone${contacts.length - 1}`).value
              .length < 11 &&
            parseInt(
              document.getElementById(`phone${contacts.length - 1}`).value
            )
          ) {
            if (
              document.getElementById(`RelatedCases${cases.length - 1}`)
                .value != undefined &&
              document.getElementById(`RelatedCases${cases.length - 1}`)
                .value != ""
            ) {
              if (
                selectedValues.length !== 0 &&
                address !== "" &&
                selectedDetailDataValues?.length !== 0
              ) {
                if (data) {
                  let adultData = data.adult === "Yes" ? 1 : 0;

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
                      phone:
                        LeadIData?.phone !== null && LeadIData?.phone !== ""
                          ? LeadIData?.phone
                          : data.localPhoneNumber,
                      top_involved: selectedValues,
                      other_data: selectedDetailDataValues,
                      case_type: data.typeofcase,
                      vehicle_register_state: data.vehicleregisterstate,
                      insurance_provider: data.insuranceprovider,
                      v_insurance_provider: data.v_insuranceprovider,
                      injuries_description: data.injuries,
                      accident_description: data.accident,
                      accident_location: data.accidentlocation,
                      date_of_accident: data.dateOfAccident,
                      other_details: data.otherdetails,
                      address1: address,
                      address2: data.address2,
                      other: data.other,
                      pic_question: data.question,
                      latdata: coordinates,
                      pic_answer: data.answer,
                      other_comments: data.othercomments,
                      alt_number: data.localPhoneNumberAlter,
                      maritial_status: data.maritial,
                      instagram: data.instagramIdValidation,
                      rom: data.rom,
                      paralegal: data.paralegal,
                      paralegal_sign_date: data?.paralegalSignDate,
                      paralegal_location: data.paralegal_location,
                      referred_by: data.referred_by,
                      case: data.caseData,
                      case_status: data.caseStatus,
                      claim: data.claimData,
                      supporting_staff: data.supporting_staff,
                      nf2: data.nf2,
                      precinct_code: data.precinctcode,
                      zip_code: data.zip_code,
                      state: data.state_name,
                      contacts: contacts,
                      relatedCase: cases,
                      drListCode: data.drListCode,
                    })
                  ).then((res) => {
                    if (res.payload.code === "1") {
                      SuccessAlert(res.payload.message);
                      UploadData();
                      setSubmit(true);
                    }
                  });
                  // setDataSubmit(true);
                  setErrmsg(false);
                  setdetailDataerrmsg(false);
                  setAddCheck(false);
                }
              } else {
                if (selectedValues.length === 0) {
                  setErrmsg(true);
                  setdetailDataerrmsg(false);
                }
                if (address === "") {
                  setAddCheck(true);
                }
              }
            } else {
              ErrorAlert("Please select valid related cases");
            }
          } else {
            ErrorAlert("Please Enter Valid Mobile Number");
          }
        } else {
          ErrorAlert("Enter Valid values");
        }
      }

      if (getMedicalDetail !== "" && medicalMeet !== "") {
        if (
          getMedicalDetail !== LeadIData?.assigned_medical_facility_name &&
          medicalMeet !== LeadIData?.medical_appointment
        ) {
          dispatch(
            ManageMedical.assignMedicalFacility({
              lead_id: LeadID,
              medical_id: getMedicalDetail,
              medical_appointment: medicalMeet,
            })
          );
        }

        // .then((res) => {
        //   navigate("/user-list");
        // });
      }
      if (getAttorney !== "" && attorneyMeet !== "") {
        if (
          getAttorney !== LeadIData?.assigned_attorney_name &&
          attorneyMeet !== LeadIData?.attorney_appointment
        ) {
          dispatch(
            ManageAttorney.assignAttorney({
              lead_id: LeadID,
              attorney_id: getAttorney,
              attorney_appointment: attorneyMeet,
            })
          );
        }

        // .then((res) => {
        //   navigate("/user-list");
        // });
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
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Answer
                          </label>

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
                        {/* <div className="col-md-6 position-relative"> */}
                        {LeadIData?.phone ? (
                          <>
                            {" "}
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
                                {callButton === "true" ||
                                callButton === "null" ? (
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
                            <div className="col-md-1 position-relative"></div>
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
                            {/* <div className="col-md-2 position-relative"></div> */}
                          </>
                        ) : (
                          <>
                            <div className="col-md-6 position-relative"></div>
                          </>
                        )}

                        <div className="col-md-2 position-relative">
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
                        <div className="col-md-2 position-relative">
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
                            {...register("middle_name")}
                            onChange={(e) => setMiddleName(e.target.value)}
                          />
                          <div className="invalid-feedback">
                            {errors.middle_name?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
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
                        <div className="col-md-2 position-relative">
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
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            for="validationTooltip04"
                          >
                            Select Disposition
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
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
                            Maritial Status
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            {...register("maritial")}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option
                              selected={LeadIData?.maritial_status === "Single"}
                            >
                              Single{" "}
                            </option>
                            <option
                              selected={
                                LeadIData?.maritial_status === "Married"
                              }
                            >
                              Married{" "}
                            </option>
                            <option
                              selected={
                                LeadIData?.maritial_status === "Divorced"
                              }
                            >
                              Divorced{" "}
                            </option>
                            <option
                              selected={LeadIData?.maritial_status === "Widow"}
                            >
                              Widow{" "}
                            </option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.maritial?.message}
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
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            for="validationTooltip03"
                          >
                            Instagram
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip03"
                            type="text"
                            required=""
                            placeholder="Add Instagram ID here"
                            defaultValue={LeadIData?.instagram}
                            onChange={(e) => setinstaID(e.target.value)}
                            {...register("instagramIdValidation")}
                          />
                          <div className="invalid-feedback">
                            {errors.instagramIdValidation?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
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

                        {LeadIData?.phone !== null &&
                        LeadIData?.phone !== "" ? (
                          <div className="col-md-2 position-relative">
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
                              readOnly
                              defaultValue={
                                LeadIData?.phone?.slice(0, 4) + "******"
                              }
                              // {...register("localPhoneNumber")}
                            />
                            {/* <div className="invalid-feedback">
                              {errors.localPhoneNumber?.message}
                            </div> */}
                          </div>
                        ) : (
                          <div className="col-md-2 position-relative">
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
                        )}

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            DR list code
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Code"
                            defaultValue={LeadIData?.dr_list_code}
                            {...register("drListCode")}
                          />
                          <div className="invalid-feedback">
                            {errors.drListCode?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative"></div>

                        <div className="col-md-9 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Emergency Contact
                          </label>
                          <span
                            className="btn btn-primary"
                            onClick={handleAddContact}
                          >
                            Add
                          </span>
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Contact name</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Relation</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            {contacts?.length !== 0 ? (
                              <tbody>
                                {contacts.map((contact, index) => (
                                  <tr key={index}>
                                    {" "}
                                    <td>
                                      <input
                                        type="text"
                                        value={contact?.name}
                                        defaultValue={contact?.name}
                                        id={`contactName${index}`}
                                        onChange={(event) =>
                                          handleInputChange(
                                            event,
                                            index,
                                            "name"
                                          )
                                        }
                                        // {...register(
                                        //   `contactsData.${index}.name`
                                        // )}
                                      />
                                      {/* {errors &&
                                        errors.contactsData &&
                                        errors.contactsData[index] &&
                                        errors.contactsData[index].name && (
                                          <div className="invalid-feedback">
                                            {
                                              errors.contactsData[index].name
                                                .message
                                            }
                                          </div>
                                        )} */}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={contact?.phone}
                                        defaultValue={contact?.phone}
                                        id={`phone${index}`}
                                        onChange={(event) =>
                                          handleInputChange(
                                            event,
                                            index,
                                            "phone"
                                          )
                                        }
                                        // {...register(
                                        //   `contactsData.${index}.phone`
                                        // )}
                                      />
                                      {/* {errors &&
                                        errors.contactsData &&
                                        errors.contactsData[index] &&
                                        errors.contactsData[index].phone && (
                                          <div className="invalid-feedback">
                                            {
                                              errors.contactsData[index].phone
                                                .message
                                            }
                                          </div>
                                        )} */}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={contact?.relationship}
                                        defaultValue={contact?.relationship}
                                        id={`relationship${index}`}
                                        onChange={(event) =>
                                          handleInputChange(
                                            event,
                                            index,
                                            "relationship"
                                          )
                                        }
                                        // {...register(
                                        //   `contactsData.${index}.relationship`
                                        // )}
                                      />
                                      {/* {errors &&
                                        errors.contactsData &&
                                        errors.contactsData[index] &&
                                        errors.contactsData[index]
                                          .relationship && (
                                          <div className="invalid-feedback">
                                            {
                                              errors.contactsData[index]
                                                .relationship.message
                                            }
                                          </div>
                                        )} */}
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => {
                                          handleRemoveContact(index);
                                        }}
                                      ></button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            ) : (
                              <></>
                            )}
                          </table>
                        </div>
                        <div className="col-md-2 position-relative"></div>

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Alternate Phone Number
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Number"
                            defaultValue={LeadIData?.alt_number}
                            onChange={(e) => setAltNumber(e.target.value)}
                            {...register("localPhoneNumberAlter")}
                          />
                          <div className="invalid-feedback">
                            {errors.localPhoneNumberAlter?.message}
                          </div>
                        </div>

                        <div className="col-md-4 position-relative">
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
                                    defaultChecked={selectedValues?.includes(
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
                                    defaultChecked={selectedValues?.includes(
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
                                    defaultChecked={selectedValues?.includes(
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

                        <div className="col-md-6 position-relative">
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
                        </div>
                        <div className="col-md-6 position-relative">
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
                                        {/* {} */}
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
                        </div>

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Zip Code
                          </label>
                          <input
                            {...register("zip_code")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Zip Code"
                            defaultValue={LeadIData?.zip_code}
                          />
                          <div className="invalid-feedback">
                            {errors.zip_code?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            State
                          </label>
                          <input
                            {...register("state_name")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="State name"
                            defaultValue={LeadIData?.state}
                          />
                          <div className="invalid-feedback">
                            {errors.state_name?.message}
                          </div>
                        </div>

                        <div className="col-md-2 position-relative"></div>
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
                        <div className="col-md-2 position-relative">
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

                        {/* <div className="col-md-3 position-relative"></div> */}
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
                            {...register("dateOfAccident")}
                          />
                          <div className="invalid-feedback">
                            {errors.dateOfAccident?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
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

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Initial Date
                          </label>
                          <input
                            // {...register("initial")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            defaultValue={moment(LeadIData?.insertdate).format(
                              "YYYY-MM-DD"
                            )}
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
                            // {...register("lastvisited")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            defaultValue={
                              LeadIData?.additionalData?.last_visited_date
                                ? moment(
                                    LeadIData?.additionalData?.last_visited_date
                                  ).format("YYYY-MM-DD")
                                : "Not Visited Yet"
                            }
                            readOnly
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
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            readOnly
                            defaultValue={
                              LeadIData?.additionalData?.total_visits
                            }
                          />
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
                            defaultValue={LeadIData?.nf2}
                          />
                          <div className="invalid-feedback">
                            {errors.nf2?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            ROM
                          </label>
                          <input
                            {...register("rom")}
                            className="form-control"
                            id="validationTooltip01"
                            type="date"
                            defaultValue={LeadIData?.rom}
                          />
                          <div className="invalid-feedback">
                            {errors.rom?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
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
                          ></label>
                          {selectedDetailDataValues.length === 0 ? (
                            <div className="row">
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("CL")
                                    }
                                    value={"CL"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    CL
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("C")
                                    }
                                    value={"C"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    C
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("L")
                                    }
                                    value={"L"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    L
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Shidr")
                                    }
                                    value={"Shidr"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Shidr
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Knee")
                                    }
                                    value={"Knee"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Knee
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("P.Mag")
                                    }
                                    value={"P.Mag"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    P.Mag
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("EMG")
                                    }
                                    value={"EMG"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    EMG
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Ortho")
                                    }
                                    value={"Ortho"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Ortho
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Surg")
                                    }
                                    value={"Surg"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Surg
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("MUA")
                                    }
                                    value={"MUA"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    MUA
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Fussion")
                                    }
                                    value={"Fussion"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Fussion
                                  </label>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="row">
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("CL")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes("CL")
                                    }
                                    value={"CL"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    CL
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("C")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes("C")
                                    }
                                    value={"C"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    C
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("L")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes("L")
                                    }
                                    value={"L"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    L
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Shidr")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes(
                                        "Shidr"
                                      )
                                    }
                                    value={"Shidr"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Shidr
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Knee")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes("Knee")
                                    }
                                    value={"Knee"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Knee
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("P.Mag")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes(
                                        "P.Mag"
                                      )
                                    }
                                    value={"P.Mag"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    P.Mag
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("EMG")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes("EMG")
                                    }
                                    value={"EMG"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    EMG
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Ortho")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes(
                                        "Ortho"
                                      )
                                    }
                                    value={"Ortho"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Ortho
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Surg")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes("Surg")
                                    }
                                    value={"Surg"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Surg
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("MUA")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes("MUA")
                                    }
                                    value={"MUA"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    MUA
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-1">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxDetailDataChange("Fussion")
                                    }
                                    defaultChecked={
                                      selectedDetailDataValues &&
                                      selectedDetailDataValues?.includes(
                                        "Fussion"
                                      )
                                    }
                                    value={"Fussion"}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                  >
                                    Fussion
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}

                          {detailDataerrmsg === true ? (
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

                          {medicalMeetStatus === true && medicalMeet === "" ? (
                            <div className="invalid-feedback">
                              Date of Medical Facility Appointment Require
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
                            Select Medical Facility
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            // {...register("medicalFacilityName")}
                            onChange={(e) => {
                              setMedicalDetail(e.target.value);
                            }}
                          >
                            <>
                              <option selected="" disabled="" value="">
                                {LeadIData.assigned_medical_facility_name === ""
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

                        <div className="col-md-2 position-relative"></div>

                        <div className="col-md-2 position-relative">
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
                          </select>
                        </div>
                        <div
                          className="col-md-2
                         position-relative"
                        >
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
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Report type
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
                            defaultValue={LeadIData?.precinct_code}
                          />
                          <div className="invalid-feedback">
                            {errors.precinctcode?.message}
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
                            defaultValue={options.find(
                              (option) =>
                                option.value === LeadIData.insurance_provider
                            )} // Set default value based on LeadIData.insurance_provider
                            options={options} // Set your options
                            {...register("insuranceprovider")}
                            onChange={(selectedOption) =>
                              setValue(
                                "insuranceprovider",
                                selectedOption.value
                              )
                            } // Set the selected option value to the form field using setValue from react-hook-form
                          />
                          <div className="invalid-feedback">
                            {errors.insuranceprovider?.message}
                          </div>
                        </div>

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            V.Insurance Provider
                          </label>
                          <Select
                            defaultValue={options.find(
                              (option) =>
                                option.value === LeadIData.v_insurance_provider
                            )} // Set default value based on LeadIData.insurance_provider
                            options={options} // Set your options
                            {...register("v_insuranceprovider")}
                            onChange={(selectedOption) =>
                              setValue(
                                "v_insuranceprovider",
                                selectedOption.value
                              )
                            } // Set the selected option value to the form field using setValue from react-hook-form
                          />
                          <div className="invalid-feedback">
                            {errors.v_insuranceprovider?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative"></div>
                        <div className="customdrop">
                          <h5>File Uploader</h5>
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
                              {LeadIData?.documentData?.map((file, index) => {
                                return (
                                  <div className="d-flex">
                                    <li
                                      key={index}
                                      onClick={() =>
                                        window.open(file?.document, "_blank")
                                      }
                                      style={{
                                        cursor: "pointer",
                                        color: "blue",
                                      }}
                                    >
                                      {
                                        file.document.split("/")[
                                          file.document.split("/").length - 1
                                        ]
                                      }{" "}
                                    </li>
                                    {AdminRole === "Admin" ? (
                                      <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => {
                                          dispatch(
                                            LeadSlice.deleteLeadDocument({
                                              id: file?.id,
                                              lead_id: file?.lead_id,
                                            })
                                          ).then((res) => {
                                            if (res.payload.code == 1) {
                                              dispatch(
                                                LeadSlice.leadByID({
                                                  lead_id: LeadID,
                                                })
                                              );
                                            }
                                          });
                                        }}
                                      ></button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                );
                              })}
                              {files?.map((file, index) => (
                                <li key={index}>
                                  {file.name}{" "}
                                  <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => {
                                      // handleRemoveContact(index);
                                      removeFile(index);
                                    }}
                                  ></button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Paralegal
                          </label>
                          <select
                            className="form-select"
                            defaultValue={LeadIData?.paralegal_id}
                            id="validationTooltip04"
                            {...register("paralegal")}
                            onChange={(e) => {
                              dispatch(
                                paralegalDate({ admin_id: e.target.value })
                              ).then((res) => {
                                if (res?.payload?.code == 1) {
                                  setParalegalDate(
                                    res?.payload?.data?.insertdate
                                  );
                                }
                              });
                            }}
                          >
                            <option value="">Choose...</option>
                            {AllAdminData?.map((item, index) => {
                              return (
                                <option key={index} value={item?.id}>
                                  {item?.name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errors.paralegal?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Paralegal Sign Date
                          </label>
                          {/* <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            value={
                              getParalegalDate
                                ? moment(getParalegalDate).format("YYYY-MM-DD")
                                : ""
                            }
                            // readOnly
                          /> */}
                          <input
                            {...register("paralegalSignDate")}
                            className="form-control"
                            id="validationTooltip01"
                            type="date"
                            defaultValue={LeadIData?.paralegal_sign_date}
                          />
                          <div className="invalid-feedback">
                            {errors.paralegalSignDate?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Paralegal Location
                          </label>
                          <input
                            {...register("paralegal_location")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Location"
                            defaultValue={LeadIData?.paralegal_location}
                          />
                          <div className="invalid-feedback">
                            {errors.paralegal_location?.message}
                          </div>
                        </div>

                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Referred by
                          </label>

                          <input
                            {...register("referred_by")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Name"
                            defaultValue={LeadIData?.referred_by}
                          />
                          <div className="invalid-feedback">
                            {errors.referred_by?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Supporting staff
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            {...register("supporting_staff")}
                            defaultValue={LeadIData?.supporting_staff}
                          >
                            <option value="">Choose...</option>
                            {AllAdminData?.map((item, index) => {
                              return (
                                <option key={index} value={item?.name}>
                                  {item?.name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="invalid-feedback">
                            {errors.supporting_staff?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Case
                          </label>
                          <input
                            {...register("caseData")}
                            defaultValue={LeadIData?.case}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Case"
                          />
                          <div className="invalid-feedback">
                            {errors.caseData?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Case Status
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            {...register("caseStatus")}
                            defaultValue={LeadIData?.case_status}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option selected={LeadIData?.other === "Potential"}>
                              Potential
                            </option>
                            <option selected={LeadIData?.other === "Client"}>
                              Client{" "}
                            </option>
                            <option selected={LeadIData?.other === "Closed"}>
                              Closed{" "}
                            </option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.caseStatus?.message}
                          </div>
                        </div>
                        <div className="col-md-2 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Claim
                          </label>
                          <input
                            {...register("claimData")}
                            className="form-control"
                            id="validationTooltip11"
                            type="text"
                            defaultValue={LeadIData?.claim}
                          />
                          <div className="invalid-feedback">
                            {errors.claimData?.message}
                          </div>
                        </div>

                        <div className="col-md-9 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Related Cases
                          </label>
                          <span
                            className="btn btn-primary"
                            onClick={handleAddCases}
                          >
                            Add
                          </span>
                          <table class="table">
                            <thead>
                              <tr>
                                <th scope="col">Related Case</th>

                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cases?.map((contact, index) => (
                                <tr key={`case-${index}`}>
                                  {}{" "}
                                  <td>
                                    <select
                                      className="form-select"
                                      id={`RelatedCases${index}`}
                                      defaultValue={contact?.name}
                                      onChange={(event) =>
                                        handleInputChangeCase(
                                          event,
                                          index,
                                          "name"
                                        )
                                      }
                                    >
                                      <option value="">Choose...</option>
                                      {relatedCases?.map((item, index) => {
                                        return (
                                          <option
                                            key={item?.id}
                                            value={item?.id}
                                          >
                                            {item?.first_name +
                                              " " +
                                              item?.last_name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      aria-label="Close"
                                      onClick={() => handleRemoveCases(index)}
                                    ></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <Transport data={submit} />

                        <>
                          <div className="col-md-12 position-relative">
                            <div className="row">
                              <div className="col-md-4">
                                <p>
                                  <img
                                    src="https://ihcms.s3.amazonaws.com/Public/map_pin_red.svg"
                                    style={{ height: "20px" }}
                                  />
                                  &nbsp; Client Location
                                </p>
                              </div>
                              <div className="col-md-4">
                                <p>
                                  <img
                                    src="https://ihcms.s3.amazonaws.com/Public/Map_pin_icon_green.svg"
                                    style={{ height: "20px" }}
                                  />
                                  &nbsp; Attorney
                                </p>
                              </div>
                              <div className="col-md-4">
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
                              {coordinates === "" &&
                              coordinates?.lat === NaN &&
                              coordinates?.lng === NaN ? (
                                <></>
                              ) : (
                                <MapComponent
                                  key={`${coordinates?.lat}-${coordinates?.lng}`}
                                  markers={
                                    mapData && mapData?.length !== 0
                                      ? mapData
                                      : []
                                  }
                                  data={{
                                    lat: isNaN(parseFloat(coordinates?.lat))
                                      ? 0
                                      : parseFloat(coordinates?.lat),
                                    lng: isNaN(parseFloat(coordinates?.lng))
                                      ? 0
                                      : parseFloat(coordinates?.lng),
                                  }}
                                  containerElement={
                                    <div
                                      style={{ height: "50vh", width: "100%" }}
                                    />
                                  }
                                  mapElement={
                                    <div style={{ height: "100%" }} />
                                  }
                                />
                              )}
                            </div>
                          </div>
                          <div
                            className="col-12"
                            style={{ textAlign: "center" }}
                          >
                            <button
                              type="submit"
                              className="btn btn-primary position-center"
                              // onClick={FormComplete}
                            >
                              Submit Data
                            </button>
                          </div>
                          <></>
                        </>
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
