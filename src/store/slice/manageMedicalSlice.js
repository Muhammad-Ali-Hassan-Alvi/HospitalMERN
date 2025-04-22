import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const assignMedicalFacility = createAsyncThunk(
  "AssignMedicalFacility",
  async (data, { dispatch }) => {
    console.log("medical data",data)
    try {
      dispatch(setLoader(true));
      const response = await API.assign_medical_facility({ ...data });
      console.log("response",response)
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      console.log(error)
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const medicalClientListing = createAsyncThunk(
  "MedicalClientListing",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.medical_client_listing({ ...data });
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

export const updateMedicalClient = createAsyncThunk(
  "UpdateMedicalClient",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.update_medical_client({ ...data });
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

export const deleteMedicalClient = createAsyncThunk(
  "DeleteMedicalClient",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.delete_medical_client({ ...data });
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
export const deleteMedicalFacilityCilentDocument = createAsyncThunk(
  "DeleteMedicalFacilityClientDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.delete_medical_facility_client_document({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
      } else {
        Alert.ErrorAlert(response.message);
      }
      console.log(response);
      
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

export const medicalClientByID = createAsyncThunk(
  "medicalClientByID",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.medical_client_data_by_id({ ...data });
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

export const medicalClientDocument = createAsyncThunk(
  "MedicalClientDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.medical_client_documents({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
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

export const viewAllCommentMedical = createAsyncThunk(
  "ViewAllCommentMedical",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.view_all_medical_client_comments({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
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
  assignFacility: {
    data: [],
    error: null,
  },
  manageMedicalListing: {
    data: [],
    error: null,
  },
  updateManageMedicalListing: {
    data: [],
    error: null,
  },
  deleteManageMedicalListing: {
    data: [],
    error: null,
  },
  manageMedicalByID: {
    data: [],
    error: null,
  },
  manageMedicalClientDocument: {
    data: [],
    error: null,
  },
  viewAllMedicalClientComment: {
    data: [],
    error: null,
  },
};

const manageMedicalSlice = createSlice({
  name: "MANAGEMEDICAL",
  initialState,
  reducers: {
    setManageMedicalFacilityID: (state) => {
      state.manageMedicalByID.data = [];
    },
    setViewAllMedicalClientComment: (state) => {
      state.viewAllMedicalClientComment.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignMedicalFacility.fulfilled, (state, action) => {
        state.assignFacility.data = action.payload;
      })
      .addCase(assignMedicalFacility.rejected, (state, action) => {
        state.assignFacility.error = action.error.message;
      })
      .addCase(medicalClientListing.fulfilled, (state, action) => {
        state.manageMedicalListing.data = action.payload;
      })
      .addCase(medicalClientListing.rejected, (state, action) => {
        state.manageMedicalListing.error = action.error.message;
      })
      .addCase(updateMedicalClient.fulfilled, (state, action) => {
        state.updateManageMedicalListing.data = action.payload;
      })
      .addCase(updateMedicalClient.rejected, (state, action) => {
        state.updateManageMedicalListing.error = action.error.message;
      })
      .addCase(deleteMedicalClient.fulfilled, (state, action) => {
        state.deleteManageMedicalListing.data = action.payload;
      })
      .addCase(deleteMedicalClient.rejected, (state, action) => {
        state.deleteManageMedicalListing.error = action.error.message;
      })
      .addCase(medicalClientByID.fulfilled, (state, action) => {
        state.manageMedicalByID.data = action.payload;
      })
      .addCase(medicalClientByID.rejected, (state, action) => {
        state.manageMedicalByID.error = action.error.message;
      })
      .addCase(medicalClientDocument.fulfilled, (state, action) => {
        state.manageMedicalClientDocument.data = action.payload;
      })
      .addCase(medicalClientDocument.rejected, (state, action) => {
        state.manageMedicalClientDocument.error = action.error.message;
      })
      .addCase(viewAllCommentMedical.fulfilled, (state, action) => {
        state.viewAllMedicalClientComment.data = action.payload;
      })
      .addCase(viewAllCommentMedical.rejected, (state, action) => {
        state.viewAllMedicalClientComment.error = action.error.message;
      });
  },
});

export const { setManageMedicalFacilityID, setViewAllMedicalClientComment } =
  manageMedicalSlice.actions;
export default manageMedicalSlice.reducer;
