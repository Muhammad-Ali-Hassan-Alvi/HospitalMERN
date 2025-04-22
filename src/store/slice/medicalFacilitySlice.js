import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const addMedicalFacility = createAsyncThunk(
  "AddMedicalFacility",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.add_medical_facility({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
        dispatch(medicalFacilityList({}));
      } else {
        Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const sendMedicalFacilityEmailData = createAsyncThunk(
  "SendMedicalFacilityEmailData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.send_medical_facility_lists_email({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
        dispatch(medicalFacilityList({}));
      } else {
        Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const sendMedicalFacilityClientEmailData = createAsyncThunk(
  "SendMedicalFacilityClientEmailData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.send_medical_facility_client_lists_email({
        ...data,
      });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
        dispatch(medicalFacilityList({}));
      } else {
        Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const UpdateMedicalFacilityList = createAsyncThunk(
  "UpdateMedicalFacility",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.update_medical_facility({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        dispatch(medicalFacilityList({}));
      } else {
        Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const removeMedicalFacility = createAsyncThunk(
  "RemoveMedicalFacility",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.remove_medical_facility({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
      } else {
        Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const medicalFacilityByID = createAsyncThunk(
  "MedicalFacilityByID",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.medical_facility_by_id({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        // Alert.SuccessAlert(response.message);
      } else {
        Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const medicalFacilityList = createAsyncThunk(
  "MedicalFacilityListing",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.medical_facility_listing({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        // Alert.SuccessAlert(response.message);
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const medicalFacilityDocument = createAsyncThunk(
  "MedicalFacilityDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.medical_facility_document({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
      } else {
        Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);
export const deleteMedicalFacilityDocument = createAsyncThunk(
  "DeleteMedicalFacilityDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.delete_medical_facility_document({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
      } else {
        Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const nearByMedicalFacility = createAsyncThunk(
  "nearByMedicalFacility",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.nearby_medical_facility({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        // Alert.SuccessAlert(response.message);
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const saveCall = createAsyncThunk(
  "saveCall",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.save_call({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        // Alert.SuccessAlert(response.message);
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const getCallData = createAsyncThunk(
  "GetCallData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.get_call_data({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        // Alert.SuccessAlert(response.message);
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

const initialState = {
  addMedicalFacilityData: {
    data: [],
    error: null,
  },
  medicalFacilityEmailData: {
    data: [],
    error: null,
  },
  medicalFacilityClientEmailData: {
    data: [],
    error: null,
  },
  medicalFacilityDataListing: {
    data: [],
    error: null,
  },
  removeMedicalFacilityListing: {
    data: [],
    error: null,
  },
  medicalFacilityByIDGet: {
    data: [],
    error: null,
  },
  updateIDMedicalFacility: {
    data: [],
    error: null,
  },
  MedicalFacilityDocumentUpload: {
    data: [],
    error: null,
  },
  nearByMedicalFacilityData: {
    data: [],
    error: null,
  },
  saveCallData: {
    data: [],
    error: null,
  },
  getCallDataList: {
    data: [],
    error: null,
  },
};

const medicalFacilitySlice = createSlice({
  name: "MEDICALFACILITY",
  initialState,
  reducers: {
    setMedicalFacilityID: (state) => {
      state.medicalFacilityByIDGet.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMedicalFacility.fulfilled, (state, action) => {
        state.addMedicalFacilityData.data = action.payload;
      })
      .addCase(addMedicalFacility.rejected, (state, action) => {
        state.addMedicalFacilityData.error = action.error.message;
      })
      .addCase(sendMedicalFacilityEmailData.fulfilled, (state, action) => {
        state.medicalFacilityEmailData.data = action.payload;
      })
      .addCase(sendMedicalFacilityEmailData.rejected, (state, action) => {
        state.medicalFacilityEmailData.error = action.error.message;
      })
      .addCase(
        sendMedicalFacilityClientEmailData.fulfilled,
        (state, action) => {
          state.medicalFacilityClientEmailData.data = action.payload;
        }
      )
      .addCase(sendMedicalFacilityClientEmailData.rejected, (state, action) => {
        state.medicalFacilityClientEmailData.error = action.error.message;
      })
      .addCase(medicalFacilityList.fulfilled, (state, action) => {
        state.medicalFacilityDataListing.data = action.payload;
      })
      .addCase(medicalFacilityList.rejected, (state, action) => {
        state.medicalFacilityDataListing.error = action.error.message;
      })
      .addCase(removeMedicalFacility.fulfilled, (state, action) => {
        state.removeMedicalFacilityListing.data = action.payload;
      })
      .addCase(removeMedicalFacility.rejected, (state, action) => {
        state.removeMedicalFacilityListing.error = action.error.message;
      })
      .addCase(medicalFacilityByID.fulfilled, (state, action) => {
        state.medicalFacilityByIDGet.data = action.payload;
      })
      .addCase(medicalFacilityByID.rejected, (state, action) => {
        state.medicalFacilityByIDGet.error = action.error.message;
      })
      .addCase(UpdateMedicalFacilityList.fulfilled, (state, action) => {
        state.updateIDMedicalFacility.data = action.payload;
      })
      .addCase(UpdateMedicalFacilityList.rejected, (state, action) => {
        state.updateIDMedicalFacility.error = action.error.message;
      })
      .addCase(medicalFacilityDocument.fulfilled, (state, action) => {
        state.MedicalFacilityDocumentUpload.data = action.payload;
      })
      .addCase(medicalFacilityDocument.rejected, (state, action) => {
        state.MedicalFacilityDocumentUpload.error = action.error.message;
      })
      .addCase(nearByMedicalFacility.fulfilled, (state, action) => {
        state.nearByMedicalFacilityData.data = action.payload;
      })
      .addCase(nearByMedicalFacility.rejected, (state, action) => {
        state.nearByMedicalFacilityData.error = action.error.message;
      })
      .addCase(saveCall.fulfilled, (state, action) => {
        state.saveCallData.data = action.payload;
      })
      .addCase(saveCall.rejected, (state, action) => {
        state.saveCallData.error = action.error.message;
      })
      .addCase(getCallData.fulfilled, (state, action) => {
        state.getCallDataList.data = action.payload;
      })
      .addCase(getCallData.rejected, (state, action) => {
        state.getCallDataList.error = action.error.message;
      });
  },
});

export const { setMedicalFacilityID } = medicalFacilitySlice.actions;
export default medicalFacilitySlice.reducer;
