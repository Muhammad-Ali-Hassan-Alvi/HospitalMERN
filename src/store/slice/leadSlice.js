import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const addLead = createAsyncThunk(
  "AddLead",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.add_lead({ ...data });
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

export const sendClinetListsEmail = createAsyncThunk(
  "sendClinetListsEmail",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.send_client_lists_email({ ...data });
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

export const leadList = createAsyncThunk(
  "LeadList",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.lead_listing({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
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

export const leadListByDisposition = createAsyncThunk(
  "LeadListByDisposition",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.lead_listing_by_dispositions({ ...data });
      console.log(response)
      dispatch(setLoader(false));
      if (response.code === "1") {
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

export const leadArchiveUserListing = createAsyncThunk(
  "LeadArchiveUserListing",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.lead_archive_users_listing({ ...data });
      
      dispatch(setLoader(false));
      if (response.code === "1") {
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

export const removeLead = createAsyncThunk(
  "RemoveLead",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.remove_lead({ ...data });
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


export const moveClientToArchive = createAsyncThunk(
  "MoveClientToArchive",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.move_client_to_archive({ ...data });
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

export const leadByID = createAsyncThunk(
  "LeadByID",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.lead_by_id({ ...data });
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

export const updateLead = createAsyncThunk(
  "updateIDLead",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.update_lead({ ...data });
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

export const userData = createAsyncThunk(
  "UserData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.user_data({ ...data });
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

export const vehicleRegisterState = createAsyncThunk(
  "VehicleRegisterState",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.vehicleRegisterState({ ...data });
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

export const updateLatLong = createAsyncThunk(
  "updateLatLong",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.updateLatLong({ ...data });
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

export const addLeadDocument = createAsyncThunk(
  "addLeadDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.addLeadDocument({ ...data });
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

export const deleteLeadDocument = createAsyncThunk(
  "deleteLeadDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.deleteLeadDocument({ ...data });
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
  addLeadData: {
    data: [],
    error: null,
  },
  addClinetEmailData: {
    data: [],
    error: null,
  },
  leadDataListing: {
    data: [],
    error: null,
  },
  leadDataListingByDisposition: {
    data: [],
    error: null,
  },
  moveClientToArchiveManually : {
    data : [],
    error : null
  },
  leadDataListingByArchive: {
    data: [],
    error: null,
  },
  removeLeadListing: {
    data: [],
    error: null,
  },
  leadByIDGet: {
    data: [],
    error: null,
  },
  updateIDLead: {
    data: [],
    error: null,
  },
  userLeadData: {
    data: [],
    error: null,
  },
  vehicleRegisterStateData: {
    data: [],
    error: null,
  },
  updateLatLongData: {
    data: [],
    error: null,
  },
  addLeadDocumentData: {
    data: [],
    error: null,
  },
  deleteLeadDocumentData: {
    data: [],
    error: null,
  },
};

const leadSlice = createSlice({
  name: "LEAD",
  initialState,
  reducers: {
    setLeadID: (state) => {
      state.leadByIDGet.data = [];
    },
    setUserID: (state) => {
      state.userLeadData.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLead.fulfilled, (state, action) => {
        state.addLeadData.data = action.payload;
      })
      .addCase(addLead.rejected, (state, action) => {
        state.addLeadData.error = action.error.message;
      })
      .addCase(sendClinetListsEmail.fulfilled, (state, action) => {
        state.addClinetEmailData.data = action.payload;
      })
      .addCase(sendClinetListsEmail.rejected, (state, action) => {
        state.addClinetEmailData.error = action.error.message;
      })
      .addCase(leadList.fulfilled, (state, action) => {
        state.leadDataListing.data = action.payload;
      })
      .addCase(leadList.rejected, (state, action) => {
        state.leadDataListing.error = action.error.message;
      })
      .addCase(leadListByDisposition.fulfilled, (state, action) => {
        state.leadDataListingByDisposition.data = action.payload;
      })
      .addCase(leadListByDisposition.rejected, (state, action) => {
        state.leadDataListingByDisposition.error = action.error.message;
      })
      .addCase(leadArchiveUserListing.fulfilled, (state, action) => {
        state.leadDataListingByArchive.data = action.payload;
      })
      .addCase(leadArchiveUserListing.rejected, (state, action) => {
        state.leadDataListingByArchive.error = action.error.message;
      })
      .addCase(removeLead.fulfilled, (state, action) => {
        state.removeLeadListing.data = action.payload;
      })
      .addCase(removeLead.rejected, (state, action) => {
        state.removeLeadListing.error = action.error.message;
      })
      .addCase(moveClientToArchive.fulfilled, (state, action) => {
        state.moveClientToArchiveManually.data = action.payload;
      })
      .addCase(moveClientToArchive.rejected, (state, action) => {
        state.moveClientToArchiveManually.error = action.error.message;
      })
      .addCase(leadByID.fulfilled, (state, action) => {
        state.leadByIDGet.data = action.payload;
      })
      .addCase(leadByID.rejected, (state, action) => {
        state.leadByIDGet.error = action.error.message;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.updateIDLead.data = action.payload;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.updateIDLead.error = action.error.message;
      })
      .addCase(userData.fulfilled, (state, action) => {
        state.userLeadData.data = action.payload;
      })
      .addCase(userData.rejected, (state, action) => {
        state.userLeadData.error = action.error.message;
      })
      .addCase(vehicleRegisterState.fulfilled, (state, action) => {
        state.vehicleRegisterStateData.data = action.payload;
      })
      .addCase(vehicleRegisterState.rejected, (state, action) => {
        state.vehicleRegisterStateData.error = action.error.message;
      })
      .addCase(updateLatLong.fulfilled, (state, action) => {
        state.updateLatLongData.data = action.payload;
      })
      .addCase(updateLatLong.rejected, (state, action) => {
        state.updateLatLongData.error = action.error.message;
      })
      .addCase(addLeadDocument.fulfilled, (state, action) => {
        state.addLeadDocumentData.data = action.payload;
      })
      .addCase(addLeadDocument.rejected, (state, action) => {
        state.addLeadDocumentData.error = action.error.message;
      })
      .addCase(deleteLeadDocument.fulfilled, (state, action) => {
        state.deleteLeadDocumentData.data = action.payload;
      })
      .addCase(deleteLeadDocument.rejected, (state, action) => {
        state.deleteLeadDocumentData.error = action.error.message;
      });
  },
});

export const { setLeadID, setUserID } = leadSlice.actions;
export default leadSlice.reducer;
