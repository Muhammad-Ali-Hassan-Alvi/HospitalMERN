import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const login = createAsyncThunk(
  "MEDLogin",
  async (data, { dispatch }) => {
    console.log({ data });
    try {
      dispatch(setLoader(true));
      const response = await API.medLogin({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        console.log("14", { response });
        Alert.SuccessAlert("Login Successfully!!");
        sessionStorage.setItem("UserToken", response.data.token);
        localStorage.setItem("UserID", response.data.id);
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
const initialState = {
  medicalStaffData: {
    data: [],
    error: null,
  },
  medicalStaffPassword: {
    data: [],
    error: null,
  },
};

const medDataSlice = createSlice({
  name: "MEDICALSTAFFDATA",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.medicalStaffData.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.medicalStaffData.error = action.error.message;
      });
  },
});

export default medDataSlice.reducer;
