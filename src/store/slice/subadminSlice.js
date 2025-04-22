import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const AddSubadminData = createAsyncThunk(
  "AddSubadminData",
  async (data, { dispatch }) => {
    console.log("==",data)
    try {
      dispatch(setLoader(true));
      const response = await API.add_subadmin({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
        dispatch(SubadminListing({}));
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

export const EditSubadminData = createAsyncThunk(
  "EditSubadminData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.edit_subadmin({ ...data });
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

export const SubadminListing = createAsyncThunk(
  "SubadminListing",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.subadmin_listing({ ...data });
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

export const RemoveSubadmin = createAsyncThunk(
  "RemoveSubadmin",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.remove_subadmin({ ...data });
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

export const SubadminDataID = createAsyncThunk(
  "SubadminDataID",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.subadmin_data_by_id({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        dispatch(SubadminListing({}));
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

export const ModuleList = createAsyncThunk(
  "ModuleList",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.modules_list({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        dispatch(SubadminListing({}));
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
  addSubadminData: {
    data: [],
    error: null,
  },
  editSubadminData: {
    data: [],
    error: null,
  },
  listingSubadminData: {
    data: [],
    error: null,
  },
  removeSubadminData: {
    data: [],
    error: null,
  },
  getSubadminDataID: {
    data: [],
    error: null,
  },
  getModuleList: {
    data: [],
    error: null,
  },
};

const subadminSlice = createSlice({
  name: "SUBADMIN",
  initialState,
  reducers: {
    setSubadminID: (state) => {
      state.getSubadminDataID.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddSubadminData.fulfilled, (state, action) => {
        state.addSubadminData.data = action.payload;
      })
      .addCase(AddSubadminData.rejected, (state, action) => {
        state.addSubadminData.error = action.error.message;
      })
      .addCase(EditSubadminData.fulfilled, (state, action) => {
        state.editSubadminData.data = action.payload;
      })
      .addCase(EditSubadminData.rejected, (state, action) => {
        state.editSubadminData.error = action.error.message;
      })
      .addCase(SubadminListing.fulfilled, (state, action) => {
        state.listingSubadminData.data = action.payload;
      })
      .addCase(SubadminListing.rejected, (state, action) => {
        state.listingSubadminData.error = action.error.message;
      })
      .addCase(RemoveSubadmin.fulfilled, (state, action) => {
        state.removeSubadminData.data = action.payload;
      })
      .addCase(RemoveSubadmin.rejected, (state, action) => {
        state.removeSubadminData.error = action.error.message;
      })
      .addCase(SubadminDataID.fulfilled, (state, action) => {
        state.getSubadminDataID.data = action.payload;
      })
      .addCase(SubadminDataID.rejected, (state, action) => {
        state.getSubadminDataID.error = action.error.message;
      })
      .addCase(ModuleList.fulfilled, (state, action) => {
        state.getModuleList.data = action.payload;
      })
      .addCase(ModuleList.rejected, (state, action) => {
        state.getModuleList.error = action.error.message;
      });
  },
});

export const { setSubadminID } = subadminSlice.actions;

export default subadminSlice.reducer;
