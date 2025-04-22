import { axiosClient } from "./apiClient";
import { ErrorAlert } from "../Common/Alert";

export function login(data) {
  try {
    return axiosClient.post("login", data).then((res) => {
      return res;
    });
  } catch (err) {
    ErrorAlert(err);
  }
}
export function medLogin(data) {
  try {
    console.log("medLogin", { data });
    return axiosClient.post("medicalStaffLogin", data).then((res) => {
      console.log({ res });
      return res;
    });
  } catch (err) {
    ErrorAlert(err);
  }
}

export function attLogin(data) {
  try {
    console.log("attLogin", { data });
    return axiosClient.post("attorneyStaffLogin", data).then((res) => {
      console.log({ res });
      return res;
    });
  } catch (err) {
    ErrorAlert(err);
  }
}

export function hello(data) {
  try {
    console.log("Fetching data with params:", data);
    return axiosClient.get("simpleRoute", { params: data }).then((res) => {
      console.log("Server response:", res.data);
      return res.data;
    });
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
}

export function forgotPassword(data) {
  try {
    return axiosClient.post("forgot_password", data).then((res) => {
      return res;
    });
  } catch (err) {
    ErrorAlert(err);
  }
}

export function change_password(data) {
  try {
    return axiosClient.post("change_password", data).then((res) => {
      return res;
    });
  } catch (err) {
    ErrorAlert(err);
  }
}

// Create Medical Staff Table
export function createMedicalStaffTable(data) {
  return axiosClient
    .post("createMedicalStaffTable", data)
    .then((res) => res.data)
    .catch((err) => {
      ErrorAlert(err);
      throw err;
    });
}

export function createAttorneyTable(data) {
  return axiosClient
    .post("createAttorneyTable", data)
    .then((res) => res.data)
    .catch((err) => {
      ErrorAlert(err);
      throw err;
    });
}

// Insert Medical Staff Data
export function insertMedicalStaffData(data) {
  return axiosClient
    .post("insertMedicalStaffData", data)
    .then((res) => res.data)
    .catch((err) => {
      ErrorAlert(err);
      throw err;
    });
}


export function insertAttorneyData(data) {
  return axiosClient
    .post("insertAttorneyData", data)
    .then((res) => res.data)
    .catch((err) => {
      ErrorAlert(err);
      throw err;
    });
}

// Get All Medical Staff Data
export function getAllMedicalStaff() {
  console.log("1 - Function entered");
  return axiosClient
    .get("getAllMedicalStaff")
    .then((res) => {
      console.log("3 - API response", res);
      return res.data;
    })
    .catch((err) => {
      console.log("4 - API error", err);
      ErrorAlert(err);
      throw err;
    });
}


export function getAllAttorneyData() {
  console.log("1 - Function entered");
  return axiosClient
    .get("getAllAttorneyData")
    .then((res) => {
      console.log("3 - API response", res);
      return res.data;
    })
    .catch((err) => {
      console.log("4 - API error", err);
      ErrorAlert(err);
      throw err;
    });
}

export function logout(data) {
  try {
    return axiosClient.post("logout", data).then((res) => {
      return res;
    });
  } catch (err) {
    ErrorAlert(err);
  }
}

export function update_profile(data) {
  try {
    return axiosClient.post("update_profile", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function get_admin_details(data) {
  try {
    return axiosClient.post("get_admin_details", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function add_subadmin(data) {
  try {
    return axiosClient.post("add_subadmin", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function add_lead(data) {
  try {
    return axiosClient.post("add_lead", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function lead_listing(data) {
  try {
    return axiosClient.post("lead_listing", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function lead_listing_by_dispositions(data) {
  try {
    return axiosClient.post("lead_listing_by_disposition", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function lead_archive_users_listing(data) {
  try {
    return axiosClient.post("lead_archive_users_listing", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function remove_lead(data) {
  try {
    return axiosClient.post("remove_lead", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function move_client_to_archive(data) {
  try {
    return axiosClient.post("move_client_to_archive", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function lead_by_id(data) {
  try {
    return axiosClient.post("lead_by_id", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function update_lead(data) {
  try {
    return axiosClient.post("update_lead", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function add_attorney(data) {
  try {
    return axiosClient.post("add_attorney", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function update_attorney(data) {
  try {
    return axiosClient.post("update_attorney", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function remove_attorney(data) {
  try {
    return axiosClient.post("remove_attorney", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function attorney_listing(data) {
  try {
    return axiosClient.post("attorney_listing", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function attorney_by_id(data) {
  try {
    return axiosClient.post("attorney_by_id", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function edit_subadmin(data) {
  try {
    return axiosClient.post("edit_subadmin", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function subadmin_listing(data) {
  try {
    return axiosClient.post("subadmin_listing", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function remove_subadmin(data) {
  try {
    return axiosClient.post("remove_subadmin", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function subadmin_data_by_id(data) {
  try {
    return axiosClient.post("subadmin_data_by_id", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function modules_list(data) {
  try {
    return axiosClient.post("modules_list", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function dashboard(data) {
  try {
    return axiosClient.post("dashboard", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function add_medical_facility(data) {
  try {
    return axiosClient.post("add_medical_facility", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function update_medical_facility(data) {
  try {
    return axiosClient.post("update_medical_facility", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function remove_medical_facility(data) {
  try {
    return axiosClient.post("remove_medical_facility", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function medical_facility_listing(data) {
  try {
    return axiosClient.post("medical_facility_listing", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function medical_facility_by_id(data) {
  try {
    return axiosClient.post("medical_facility_by_id", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function create_invoice(data) {
  try {
    return axiosClient.post("create_invoice", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function send_billing_email(data) {
  try {
    return axiosClient.post("send_billing_email", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function send_client_lists_email(data) {
  try {
    return axiosClient.post("send_client_lists_email", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function send_medical_facility_lists_email(data) {
  try {
    return axiosClient
      .post("send_medical_facility_lists_email", data)
      .then((res) => {
        return res;
      });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function send_medical_facility_client_lists_email(data) {
  try {
    return axiosClient
      .post("send_medical_facility_client_lists_email", data)
      .then((res) => {
        return res;
      });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function send_attorney_lists_email(data) {
  try {
    return axiosClient.post("send_attorney_lists_email", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function send_attorney_client_lists_email(data) {
  try {
    return axiosClient
      .post("send_attorney_client_lists_email", data)
      .then((res) => {
        return res;
      });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function invoice_list(data) {
  try {
    return axiosClient.post("invoice_list", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function edit_invoice(data) {
  try {
    return axiosClient.post("edit_invoice", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function delete_invoice(data) {
  try {
    return axiosClient.post("delete_invoice", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function invoice_by_id(data) {
  try {
    return axiosClient.post("invoice_by_id", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function generate_invoice_number(data) {
  try {
    return axiosClient.post("generate_invoice_number", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function assign_medical_facility(data) {
  try {
    return axiosClient.post("assign_medical_facility", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function medical_client_listing(data) {
  try {
    return axiosClient.post("medical_client_listing", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function update_medical_client(data) {
  try {
    return axiosClient.post("update_medical_client", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function delete_medical_client(data) {
  try {
    return axiosClient.post("delete_medical_client", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function medical_client_data_by_id(data) {
  try {
    return axiosClient.post("medical_client_data_by_id", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function medical_facility_document(data) {
  try {
    return axiosClient.post("medical_facility_documents", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function delete_medical_facility_document(data) {
  try {
    return axiosClient
      .post("delete_medical_facility_document", data)
      .then((res) => {
        return res;
      });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function delete_medical_facility_client_document(data) {
  try {
    return axiosClient
      .post("delete_medical_client_document", data)
      .then((res) => {
        return res;
      });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function medical_client_documents(data) {
  try {
    return axiosClient.post("medical_client_documents", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function assign_attorney(data) {
  try {
    return axiosClient.post("assign_attorney", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function attorney_client_listing(data) {
  try {
    return axiosClient.post("attorney_client_listing", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function update_attorney_client(data) {
  try {
    return axiosClient.post("update_attorney_client", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function delete_attorney_client(data) {
  try {
    return axiosClient.post("delete_attorney_client", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function delete_attorney_client_document(data) {
  try {
    return axiosClient
      .post("delete_attorney_client_document", data)
      .then((res) => {
        return res;
      });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function attorney_client_data_by_id(data) {
  try {
    return axiosClient.post("attorney_client_data_by_id", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function view_all_medical_client_comments(data) {
  try {
    return axiosClient
      .post("view_all_medical_client_comments", data)
      .then((res) => {
        return res;
      });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function attorney_client_documents(data) {
  try {
    return axiosClient.post("attorney_client_documents", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function attorney_documents(data) {
  try {
    return axiosClient.post("attorney_documents", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function delete_attorney_documents(data) {
  try {
    return axiosClient
      .post("delete_attorney_facility_document", data)
      .then((res) => {
        return res;
      });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function nearby_attorney(data) {
  try {
    return axiosClient.post("nearby_attorney", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
export function nearby_medical_facility(data) {
  try {
    return axiosClient.post("nearby_medical_facility", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function check_attendance(data) {
  try {
    return axiosClient.post("check_attendance", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function calendar(data) {
  try {
    return axiosClient.post("calendar", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function create_call(data) {
  try {
    return axiosClient.post("create_call", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function hangup_call(data) {
  try {
    return axiosClient.post("hangup_call", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function check_status(data) {
  try {
    return axiosClient.post("check_status", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function update_xml_content(data) {
  try {
    return axiosClient.post("update-xml-content", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function save_call(data) {
  try {
    return axiosClient.post("save_call", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function get_call_data(data) {
  try {
    return axiosClient.post("get_call_data", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function user_data(data) {
  try {
    return axiosClient.post("user_data", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function logs_data(data) {
  try {
    return axiosClient.post("logs_data", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function insurance_provider(data) {
  try {
    return axiosClient.post("insurance_provider", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function questions(data) {
  try {
    return axiosClient.post("questions", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function vehicleRegisterState(data) {
  try {
    return axiosClient.post("vehicle_register_state", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function updateLatLong(data) {
  try {
    return axiosClient.post("update_lat_long", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function getToken(data) {
  try {
    return axiosClient.post("get_token", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function getAllProducts(data) {
  try {
    return axiosClient.post("get_all_products", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function getSingleProduct(data) {
  try {
    return axiosClient.post("get_single_product", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function order(data) {
  try {
    return axiosClient.post("order", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function orderList(data) {
  try {
    return axiosClient.post("order_list", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function paralegalDate(data) {
  try {
    return axiosClient.post("paralegal_date", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function addLeadDocument(data) {
  try {
    return axiosClient.post("add_lead_document", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function deleteLeadDocument(data) {
  try {
    return axiosClient.post("delete_lead_document", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function uploadUberLyftDocuments(data) {
  try {
    return axiosClient.post("upload_uber_lyft_documents", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}

export function deleteUberLyftDocument(data) {
  try {
    return axiosClient.post("delete_uber_lyft_document", data).then((res) => {
      return res;
    });
  } catch (error) {
    ErrorAlert(error);
  }
}
