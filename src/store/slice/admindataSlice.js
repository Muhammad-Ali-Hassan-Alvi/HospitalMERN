import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";

export const getAdminData = createAsyncThunk(
  "adminData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const { data: adminData } = await API.get_admin_details(data);
      dispatch(setLoader(false));
      return adminData;
    } catch (err) {
      dispatch(setLoader(false));
      // Alert.ErrorAlert(err);
    }
  }
);

export const changeAdminPassword = createAsyncThunk(
  "AdminPassword",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.change_password({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
        sessionStorage.removeItem("UserToken");
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

export const login = createAsyncThunk(
  "AdminLogin",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.login({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert("Login Successfully!!");
        sessionStorage.setItem("UserToken", response.data.token);
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

export const logout = createAsyncThunk(
  "AdminLogout",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.logout({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      // Alert.ErrorAlert(error);
    }
  }
);

export const changeAdminData = createAsyncThunk(
  "AdminSetData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.update_profile({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        Alert.SuccessAlert(response.message);
        dispatch(getAdminData({}));
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      // Alert.ErrorAlert(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "ForgetPassword",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.forgotPassword({ ...data });
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

export const dashboard = createAsyncThunk(
  "Dashboard",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.dashboard({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        // Alert.SuccessAlert(response.message);
      } else {
        // Alert.ErrorAlert(response.message);
      }
      return response;
    } catch (error) {
      dispatch(setLoader(false));
      // Alert.ErrorAlert(error);
    }
  }
);

export const attendance = createAsyncThunk(
  "Attendance",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.check_attendance({ ...data });
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

export const calendar = createAsyncThunk(
  "Calender",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.calendar({ ...data });
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

export const update_xml = createAsyncThunk(
  "UpdateXml",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.update_xml_content({ ...data });
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

export const logsData = createAsyncThunk(
  "LogsData",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.logs_data({ ...data });
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

export const insuranceProvider = createAsyncThunk(
  "InsuranceProvider",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.insurance_provider({ ...data });
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

export const questions = createAsyncThunk(
  "Questions",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.questions({ ...data });
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

const initialState = {
  adminData: {
    data: [],
    error: null,
  },
  adminPassword: {
    data: [],
    error: null,
  },
  adminSetData: {
    data: [],
    error: null,
  },
  addSubadminData: {
    data: [],
    error: null,
  },
  adminLogin: {
    data: [],
    error: null,
  },
  adminLogout: {
    data: [],
    error: null,
  },
  forgetPasswordAdmin: {
    data: [],
    error: null,
  },
  dashBoardAdmin: {
    data: [],
    error: null,
  },
  attendanceData: {
    data: [],
    error: null,
  },
  calendarData: {
    data: [],
    error: null,
  },
  UpdatedXML: {
    data: [],
    error: null,
  },
  LogsGetData: {
    data: [],
    error: null,
  },
  InsuranceData: {
    data: [],
    error: null,
  },
  QuestionsData: {
    data: [],
    error: null,
  },
};

const admindataSlice = createSlice({
  name: "ADMINDATA",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminData.fulfilled, (state, action) => {
        state.adminData.data = action.payload;
      })
      .addCase(getAdminData.rejected, (state, action) => {
        state.adminData.error = action.error.message;
      })
      .addCase(changeAdminPassword.fulfilled, (state, action) => {
        state.adminPassword.data = action.payload;
      })
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.adminPassword.error = action.error.message;
      })
      .addCase(changeAdminData.fulfilled, (state, action) => {
        state.adminSetData.data = action.payload;
      })
      .addCase(changeAdminData.rejected, (state, action) => {
        state.adminSetData.error = action.error.message;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.adminLogin.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.adminLogin.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.adminLogout.data = action.payload;
      })
      .addCase(logout.rejected, (state, action) => {
        state.adminLogout.error = action.error.message;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgetPasswordAdmin.data = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgetPasswordAdmin.error = action.error.message;
      })
      .addCase(dashboard.fulfilled, (state, action) => {
        state.dashBoardAdmin.data = action.payload;
      })
      .addCase(dashboard.rejected, (state, action) => {
        state.dashBoardAdmin.error = action.error.message;
      })
      .addCase(attendance.fulfilled, (state, action) => {
        state.attendanceData.data = action.payload;
      })
      .addCase(attendance.rejected, (state, action) => {
        state.attendanceData.error = action.error.message;
      })
      .addCase(calendar.fulfilled, (state, action) => {
        state.calendarData.data = action.payload;
      })
      .addCase(calendar.rejected, (state, action) => {
        state.calendarData.error = action.error.message;
      })
      .addCase(update_xml.fulfilled, (state, action) => {
        state.UpdatedXML.data = action.payload;
      })
      .addCase(update_xml.rejected, (state, action) => {
        state.UpdatedXML.error = action.error.message;
      })
      .addCase(logsData.fulfilled, (state, action) => {
        state.LogsGetData.data = action.payload;
      })
      .addCase(logsData.rejected, (state, action) => {
        state.LogsGetData.error = action.error.message;
      })
      .addCase(insuranceProvider.fulfilled, (state, action) => {
        state.InsuranceData.data = action.payload;
      })
      .addCase(insuranceProvider.rejected, (state, action) => {
        state.InsuranceData.error = action.error.message;
      })
      .addCase(questions.fulfilled, (state, action) => {
        state.QuestionsData.data = action.payload;
      })
      .addCase(questions.rejected, (state, action) => {
        state.QuestionsData.error = action.error.message;
      });
  },
});

export const { setLoader } = admindataSlice.actions;
export default admindataSlice.reducer;
