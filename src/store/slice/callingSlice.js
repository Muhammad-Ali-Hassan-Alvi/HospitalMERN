import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const createCall = createAsyncThunk(
  "CreateCall",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.create_call({ ...data });
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

export const hangUpCall = createAsyncThunk(
  "HangupCall",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.hangup_call({ ...data });
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

export const callStatus = createAsyncThunk(
  "CallStatus",
  async (data, { dispatch }) => {
    try {
      // dispatch(setLoader(true));
      const response = await API.check_status({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        // Alert.SuccessAlert(response.message);
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      // dispatch(setLoader(false));
      Alert.ErrorAlert(error);
    }
  }
);

const initialState = {
  createCallEvent: {
    data: [],
    error: null,
  },
  hangupCallEvent: {
    data: [],
    error: null,
  },
  checkCallEvent: {
    data: [],
    error: null,
  },
};

const callingSlice = createSlice({
  name: "CALL",
  initialState,
  reducers: {
    // setLoader: (state, action) => {
    //   state.isLoading = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCall.fulfilled, (state, action) => {
        state.createCallEvent.data = action.payload;
      })
      .addCase(createCall.rejected, (state, action) => {
        state.createCallEvent.error = action.error.message;
      })
      .addCase(hangUpCall.fulfilled, (state, action) => {
        state.hangupCallEvent.data = action.payload;
      })
      .addCase(hangUpCall.rejected, (state, action) => {
        state.hangupCallEvent.error = action.error.message;
      })
      .addCase(callStatus.fulfilled, (state, action) => {
        state.checkCallEvent.data = action.payload;
      })
      .addCase(callStatus.rejected, (state, action) => {
        state.checkCallEvent.error = action.error.message;
      });
  },
});

export const {} = callingSlice.actions;
export default callingSlice.reducer;
