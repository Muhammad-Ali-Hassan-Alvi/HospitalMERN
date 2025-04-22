import { configureStore } from "@reduxjs/toolkit";
import admindataSlice from "../store/slice/admindataSlice";
import subadminSlice from "./slice/subadminSlice";
import leadSlice from "./slice/leadSlice";
import attorneySlice from "./slice/attorneySlice";
import medicalFacilitySlice from "./slice/medicalFacilitySlice";
import billingSlice from "./slice/billingSlice";
import manageMedicalSlice from "./slice/manageMedicalSlice";
import manageAttorneySlice from "./slice/manageAttorneySlice";
import callingSlice from "./slice/callingSlice";
import medicalStaffData from "./slice/medDataSlice";
import attorneyStaffData from "./slice/attorneyDataSlice";
import medicalStaffReducer from "./slice/medicalStaffSlice";
const store = configureStore({
  reducer: {
    admindata: admindataSlice,
    subadmin: subadminSlice,
    lead: leadSlice,
    attorney: attorneySlice,
    medicalfacility: medicalFacilitySlice,
    billing: billingSlice,
    managemedical: manageMedicalSlice,
    manageattorney: manageAttorneySlice,
    calling: callingSlice,
    medicalstaffdata: medicalStaffData,
    attotrneystaffdata: attorneyStaffData,
    medicalStaff: medicalStaffReducer,
  },
});
export default store;
