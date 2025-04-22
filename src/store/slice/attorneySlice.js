import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const addAttorney = createAsyncThunk(
  "AddAttorney",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.add_attorney({ ...data });
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

export const sendAttorneyEmail = createAsyncThunk(
  "SendAttorneyEmail",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.send_attorney_lists_email({ ...data });
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

export const sendAttorneyClientEmail = createAsyncThunk(
  "SendAttorneyClientEmail",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.send_attorney_client_lists_email({ ...data });
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

export const UpdateAttorneyList = createAsyncThunk(
  "UpdateAttorney",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.update_attorney({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        dispatch(attorneyList({}));
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

export const removeAttorney = createAsyncThunk(
  "RemoveAttorney",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.remove_attorney({ ...data });
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

export const attorneyByID = createAsyncThunk(
  "AttorneyByID",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.attorney_by_id({ ...data });
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

export const attorneyList = createAsyncThunk(
  "AttorneyListing",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.attorney_listing({ ...data });
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
export const attorneyDocument = createAsyncThunk(
  "AttorneyDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.attorney_documents({ ...data });
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
export const DeleteAttorneyDocument = createAsyncThunk(
  "DeleteAttorneyDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.delete_attorney_documents({ ...data });
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
export const nearByAttorney = createAsyncThunk(
  "NearByAttorney",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.nearby_attorney({ ...data });
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
  addAttorneyData: {
    data: [],
    error: null,
  },
  attorneyDataListing: {
    data: [],
    error: null,
  },
  sendAttorneyData: {
    data: [],
    error: null,
  },
  sendAttorneyClientData: {
    data: [],
    error: null,
  },
  removeAttorneyListing: {
    data: [],
    error: null,
  },
  attorneyByIDGet: {
    data: [],
    error: null,
  },
  updateIDAttorney: {
    data: [],
    error: null,
  },
  AttorneyDocumentUpload: {
    data: [],
    error: null,
  },
  nearAttorneyData: {
    data: [],
    error: null,
  },
};

const attorneySlice = createSlice({
  name: "ATTORNEY",
  initialState,
  reducers: {
    setAttorneyID: (state) => {
      state.attorneyByIDGet.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAttorney.fulfilled, (state, action) => {
        state.addAttorneyData.data = action.payload;
      })
      .addCase(addAttorney.rejected, (state, action) => {
        state.addAttorneyData.error = action.error.message;
      })
      .addCase(sendAttorneyEmail.fulfilled, (state, action) => {
        state.sendAttorneyData.data = action.payload;
      })
      .addCase(sendAttorneyEmail.rejected, (state, action) => {
        state.sendAttorneyData.error = action.error.message;
      })
      .addCase(sendAttorneyClientEmail.fulfilled, (state, action) => {
        state.sendAttorneyClientData.data = action.payload;
      })
      .addCase(sendAttorneyClientEmail.rejected, (state, action) => {
        state.sendAttorneyClientData.error = action.error.message;
      })
      .addCase(attorneyList.fulfilled, (state, action) => {
        state.attorneyDataListing.data = action.payload;
      })
      .addCase(attorneyList.rejected, (state, action) => {
        state.attorneyDataListing.error = action.error.message;
      })
      .addCase(removeAttorney.fulfilled, (state, action) => {
        state.removeAttorneyListing.data = action.payload;
      })
      .addCase(removeAttorney.rejected, (state, action) => {
        state.removeAttorneyListing.error = action.error.message;
      })
      .addCase(attorneyByID.fulfilled, (state, action) => {
        state.attorneyByIDGet.data = action.payload;
      })
      .addCase(attorneyByID.rejected, (state, action) => {
        state.attorneyByIDGet.error = action.error.message;
      })
      .addCase(UpdateAttorneyList.fulfilled, (state, action) => {
        state.updateIDAttorney.data = action.payload;
      })
      .addCase(UpdateAttorneyList.rejected, (state, action) => {
        state.updateIDAttorney.error = action.error.message;
      })
      .addCase(attorneyDocument.fulfilled, (state, action) => {
        state.AttorneyDocumentUpload.data = action.payload;
      })
      .addCase(attorneyDocument.rejected, (state, action) => {
        state.AttorneyDocumentUpload.error = action.error.message;
      })
      .addCase(nearByAttorney.fulfilled, (state, action) => {
        state.nearAttorneyData.data = action.payload;
      })
      .addCase(nearByAttorney.rejected, (state, action) => {
        state.nearAttorneyData.error = action.error.message;
      });
  },
});

export const { setAttorneyID } = attorneySlice.actions;
export default attorneySlice.reducer;
