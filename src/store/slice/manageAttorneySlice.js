import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const assignAttorney = createAsyncThunk(
  "assignAttorney",
  async (data, { dispatch }) => {
    console.log("attorney dataaaaaaaaaaaaa",data);
    
    try {
      dispatch(setLoader(true));
      const response = await API.assign_attorney({ ...data });
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

export const attorneyClientListing = createAsyncThunk(
  "AttorneyClientListing",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.attorney_client_listing({ ...data });
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

export const updateAttorneyClient = createAsyncThunk(
  "UpdateAttorneyClient",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.update_attorney_client({ ...data });
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

export const deleteAttorneyClient = createAsyncThunk(
  "DeleteAttorneyClient",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.delete_attorney_client({ ...data });
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
export const deleteAttorneyClientDocument = createAsyncThunk(
  "DeleteAttorneyClientDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.delete_attorney_client_document({ ...data });
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


export const attorneyClientByID = createAsyncThunk(
  "AttorneyClientByID",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.attorney_client_data_by_id({ ...data });
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

export const attorneyClientDocument = createAsyncThunk(
  "MedicalClientDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.attorney_client_documents({ ...data });
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
  assignAttorneyData: {
    data: [],
    error: null,
  },
  manageAttorneyListing: {
    data: [],
    error: null,
  },
  updateAttorneyListing: {
    data: [],
    error: null,
  },
  deleteAttorneyListing: {
    data: [],
    error: null,
  },
  manageAttorneyByID: {
    data: [],
    error: null,
  },
  manageAttorneyClientDocument: {
    data: [],
    error: null,
  },
};

const manageAttorneySlice = createSlice({
  name: "MANAGEATTORNEY",
  initialState,
  reducers: {
    setManageAttorneyID: (state) => {
      state.manageAttorneyByID.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignAttorney.fulfilled, (state, action) => {
        state.assignAttorneyData.data = action.payload;
      })
      .addCase(assignAttorney.rejected, (state, action) => {
        state.assignAttorneyData.error = action.error.message;
      })
      .addCase(attorneyClientListing.fulfilled, (state, action) => {
        state.manageAttorneyListing.data = action.payload;
      })
      .addCase(attorneyClientListing.rejected, (state, action) => {
        state.manageAttorneyListing.error = action.error.message;
      })
      .addCase(updateAttorneyClient.fulfilled, (state, action) => {
        state.updateAttorneyListing.data = action.payload;
      })
      .addCase(updateAttorneyClient.rejected, (state, action) => {
        state.updateAttorneyListing.error = action.error.message;
      })
      .addCase(deleteAttorneyClient.fulfilled, (state, action) => {
        state.deleteAttorneyListing.data = action.payload;
      })
      .addCase(deleteAttorneyClient.rejected, (state, action) => {
        state.deleteAttorneyListing.error = action.error.message;
      })
      .addCase(attorneyClientByID.fulfilled, (state, action) => {
        state.manageAttorneyByID.data = action.payload;
      })
      .addCase(attorneyClientByID.rejected, (state, action) => {
        state.manageAttorneyByID.error = action.error.message;
      })
      .addCase(attorneyClientDocument.fulfilled, (state, action) => {
        state.manageAttorneyClientDocument.data = action.payload;
      })
      .addCase(attorneyClientDocument.rejected, (state, action) => {
        state.manageAttorneyClientDocument.error = action.error.message;
      });
  },
});

export const { setManageAttorneyID } = manageAttorneySlice.actions;
export default manageAttorneySlice.reducer;
