import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "../../api/apiHandler";
import * as Alert from "../../Common/Alert";
import { setLoader } from "./admindataSlice";

export const createInvoice = createAsyncThunk(
  "CreateInvoice",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.create_invoice({ ...data });
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


export const sendBillingEmail = createAsyncThunk(
  "SendBillingEmail",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.send_billing_email({ ...data });
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

export const editInvoice = createAsyncThunk(
  "EditInvoice",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.edit_invoice({ ...data });
      dispatch(setLoader(false));
      if (response.code === "1") {
        dispatch(invoiceList({}));
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

export const deleteInvoice = createAsyncThunk(
  "DeleteInvoice",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.delete_invoice({ ...data });
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

export const invoiceByID = createAsyncThunk(
  "InvoiceByID",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.invoice_by_id({ ...data });
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

export const invoiceList = createAsyncThunk(
  "InvoiceList",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.invoice_list({ ...data });
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

export const generateInvoiceNumber = createAsyncThunk(
  "GenerateInvoiceNumber",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.generate_invoice_number({ ...data });
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

export const getToken = createAsyncThunk(
  "getToken",
  async (data, { dispatch }) => {
    console.log("++",data)
    try {
      dispatch(setLoader(true));
      const response = await API.getToken({ ...data });
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

export const getAllProducts = createAsyncThunk(
  "getAllProducts",
  async (data, { dispatch }) => {
    console.log("product data",data)
    try {
      dispatch(setLoader(true));
      const response = await API.getAllProducts({ ...data });
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

export const getSingleProduct = createAsyncThunk(
  "getSingleProduct",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.getSingleProduct({ ...data });
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

export const order = createAsyncThunk("order", async (data, { dispatch }) => {
  try {
    dispatch(setLoader(true));
    const response = await API.order({ ...data });
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
});

export const orderList = createAsyncThunk(
  "orderList",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.orderList({ ...data });
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

export const paralegalDate = createAsyncThunk(
  "paralegalDate",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.paralegalDate({ ...data });
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

export const uploadUberLyftDocuments = createAsyncThunk(
  "uploadUberLyftDocuments",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.uploadUberLyftDocuments({ ...data });
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

export const deleteUberLyftDocument = createAsyncThunk(
  "deleteUberLyftDocument",
  async (data, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await API.deleteUberLyftDocument({ ...data });
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
  addInvoiceData: {
    data: [],
    error: null,
  },
  sendBillingData: {
    data: [],
    error: null,
  },
  invoiceListing: {
    data: [],
    error: null,
  },
  removeInvoiceListing: {
    data: [],
    error: null,
  },
  invoiceByIDGet: {
    data: [],
    error: null,
  },
  editIDInvoice: {
    data: [],
    error: null,
  },
  generateIDInvoice: {
    data: [],
    error: null,
  },
  getTokenData: {
    data: [],
    error: null,
  },
  getAllProductsData: {
    data: [],
    error: null,
  },
  getSingleProductData: {
    data: [],
    error: null,
  },
  orderData: {
    data: [],
    error: null,
  },
  orderListData: {
    data: [],
    error: null,
  },
  paralegalDateData: {
    data: [],
    error: null,
  },
  uploadUberLyftDocumentsData: {
    data: [],
    error: null,
  },
  deleteUberLyftDocumentData: {
    data: [],
    error: null,
  },
};

const billingSlice = createSlice({
  name: "ATTORNEY",
  initialState,
  reducers: {
    setInvoiceID: (state) => {
      state.invoiceByIDGet.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.addInvoiceData.data = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.addInvoiceData.error = action.error.message;
      })
      .addCase(sendBillingEmail.fulfilled, (state, action) => {
        state.sendBillingData.data = action.payload;
      })
      .addCase(sendBillingEmail.rejected, (state, action) => {
        state.sendBillingData.error = action.error.message;
      })
      .addCase(invoiceList.fulfilled, (state, action) => {
        state.invoiceListing.data = action.payload;
      })
      .addCase(invoiceList.rejected, (state, action) => {
        state.invoiceListing.error = action.error.message;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.removeInvoiceListing.data = action.payload;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.removeInvoiceListing.error = action.error.message;
      })
      .addCase(invoiceByID.fulfilled, (state, action) => {
        state.invoiceByIDGet.data = action.payload;
      })
      .addCase(invoiceByID.rejected, (state, action) => {
        state.invoiceByIDGet.error = action.error.message;
      })
      .addCase(editInvoice.fulfilled, (state, action) => {
        state.editIDInvoice.data = action.payload;
      })
      .addCase(editInvoice.rejected, (state, action) => {
        state.editIDInvoice.error = action.error.message;
      })
      .addCase(generateInvoiceNumber.fulfilled, (state, action) => {
        state.generateIDInvoice.data = action.payload;
      })
      .addCase(generateInvoiceNumber.rejected, (state, action) => {
        state.generateIDInvoice.error = action.error.message;
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.getTokenData.data = action.payload;
      })
      .addCase(getToken.rejected, (state, action) => {
        state.getTokenData.error = action.error.message;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.getAllProductsData.data = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.getAllProductsData.error = action.error.message;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.getSingleProductData.data = action.payload;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.getSingleProductData.error = action.error.message;
      })
      .addCase(order.fulfilled, (state, action) => {
        state.orderData.data = action.payload;
      })
      .addCase(order.rejected, (state, action) => {
        state.orderData.error = action.error.message;
      })
      .addCase(orderList.fulfilled, (state, action) => {
        state.orderListData.data = action.payload;
      })
      .addCase(orderList.rejected, (state, action) => {
        state.orderListData.error = action.error.message;
      })
      .addCase(paralegalDate.fulfilled, (state, action) => {
        state.paralegalDateData.data = action.payload;
      })
      .addCase(paralegalDate.rejected, (state, action) => {
        state.paralegalDateData.error = action.error.message;
      })
      .addCase(uploadUberLyftDocuments.fulfilled, (state, action) => {
        state.uploadUberLyftDocumentsData.data = action.payload;
      })
      .addCase(uploadUberLyftDocuments.rejected, (state, action) => {
        state.uploadUberLyftDocumentsData.error = action.error.message;
      })
      .addCase(deleteUberLyftDocument.fulfilled, (state, action) => {
        state.deleteUberLyftDocumentData.data = action.payload;
      })
      .addCase(deleteUberLyftDocument.rejected, (state, action) => {
        state.deleteUberLyftDocumentData.error = action.error.message;
      });
  },
});

export const { setInvoiceID } = billingSlice.actions;
export default billingSlice.reducer;
