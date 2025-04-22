import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

// 👉 Create Medical Staff Table
export const createMedicalStaffTable = createAsyncThunk(
  "medicalStaff/createTable",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.createMedicalStaffTable();
      dispatch(setLoader(false));

      if (response.code === "1") {
        Alert.SuccessAlert("Medical Staff Table Created Successfully!");
      } else {
        Alert.ErrorAlert(response.message);
      }

      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error.message);
      throw error;
    }
  }
);

// 👉 Insert Medical Staff Data
export const insertMedicalStaffData = createAsyncThunk(
  "medicalStaff/insertData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.insertMedicalStaffData(data);
      dispatch(setLoader(false));

      if (response.code === "1") {
        Alert.SuccessAlert("Medical Staff Data Inserted!");
      } else {
        Alert.ErrorAlert(response.message);
      }

      return response;
    } catch (error) {
      dispatch(setLoader(false));
      Alert.ErrorAlert(error.message);
      throw error;
    }
  }
);

// 👉 Get All Medical Staff Data
export const getAllMedicalStaff = createAsyncThunk(
    "medicalStaff/getAll",
    async () => {
      const response = await API.getAllMedicalStaff();
  
      if (response.status === "1") {
        return response.data;
      } else {
        Alert.ErrorAlert(response.message);
        return [];
      }
    }
  );
  
  // Initial State
  const initialState = {
    isLoading: false,
    medicalStaffList: [],
    error: null,
  };

// Slice
const medicalStaffSlice = createSlice({
    name: "medicalStaff",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getAllMedicalStaff.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllMedicalStaff.fulfilled, (state, action) => {
          state.isLoading = false;
          state.medicalStaffList = action.payload;
          state.error = null;
        })
        .addCase(getAllMedicalStaff.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
        });
    },
  });
  

export default medicalStaffSlice.reducer;
