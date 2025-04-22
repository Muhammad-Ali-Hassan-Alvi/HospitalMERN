import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";

export const login = createAsyncThunk(
  "ATTLogin",
  async (data, { dispatch }) => {
    console.log({ data });
    try {
      dispatch(setLoader(true));
      const response = await API.attLogin({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        console.log("14", { response });
        Alert.SuccessAlert("Login Successfully!!");
        sessionStorage.setItem("UserToken", response.data.token);
        localStorage.setItem("AttorneyId", response.data.id);
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
  attorneyStaffData: {
    data: [],
    error: null,
  },
  attorneyStaffPassword: {
    data: [],
    error: null,
  },
};

const attDataSlice = createSlice({
  name: "ATTORNEYSTAFFDATA",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.attorneyStaffData.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.attorneyStaffData.error = action.error.message;
      });
  },
});

export const { setLoader } = attDataSlice.actions;
export default attDataSlice.reducer;
