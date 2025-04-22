import React, { useState, useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Tooltiphome from "../../Common/Tooltiphome";
import { useDispatch, useSelector } from "react-redux"; // Added import for useDispatch and useSelector
import Loader from "../../components/loader/Loader";
import * as Yup from "yup"; // Added import for Yup
import { useForm } from "react-hook-form"; // Added import for useForm
import { yupResolver } from "@hookform/resolvers/yup";
import { jsPDF } from "jspdf"; // Import jsPDF
const DummyComponent = () => {
  useEffect(() => {
    console.log("Fetching existing attorney data...");
    fetchAttorneyData();
  }, []);

  const fetchAttorneyData = async () => {
    try {
      const response = await fetch(
        "https://final-server-production-3f9e.up.railway.app/api/attorney"
      );
      const res = await response.json();
      if (response.ok) {
        console.log("All attorney data fetched:", res);
        
        // Get AttorneyId from localStorage (try different case variations)
        const storedAttorneyId = localStorage.getItem("AttorneyId") || 
                               localStorage.getItem("attorneyId") ||
                               localStorage.getItem("attorneyID");
        
        if (!storedAttorneyId) {
          console.error("No AttorneyId found in localStorage");
          setErrorMessage("Attorney ID not found");
          return;
        }
  
        console.log("Stored Attorney ID:", storedAttorneyId, "Type:", typeof storedAttorneyId);
  
        // Filter records - compare as strings to avoid type issues
        const filteredData = Array.isArray(res) 
          ? res.filter(attorney => 
              attorney.userId && attorney.userId.toString() === storedAttorneyId.toString()
            )
          : [];
  
        console.log("Filtered attorney data:", filteredData);
        setAttorneyList(filteredData);
      } else {
        console.error("Failed to fetch attorney data", res);
        setErrorMessage("Failed to fetch attorney data");
      }
    } catch (error) {
      console.error("Error fetching attorney data", error);
      setErrorMessage("Error fetching attorney data");
    }
  };

  const insertAttorneyData = async (data) => {
    try {
      // Fetch AttorneyId from localStorage
      const userId = localStorage.getItem("AttorneyId");

      if (!userId) {
        console.error("No AttorneyId found in localStorage.");
        setErrorMessage("Unable to identify attorney. Please log in again.");
        return;
      }

      // Merge AttorneyId into data payload
      const payload = {
        ...data,
        userId: userId,
      };

      const response = await fetch(
        "https://final-server-production-3f9e.up.railway.app/api/attorney",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const res = await response.json();

      if (response.ok) {
        console.log("Attorney record inserted:", res);
        setAttorneyList((prevList) => [...prevList, payload]);
        reset();
        setSuccessMessage("Attorney record added successfully!");
      } else {
        console.error("Failed to insert attorney data", res);
        setErrorMessage("Failed to add attorney record.");
      }
    } catch (error) {
      console.error("Error inserting attorney data", error);
      setErrorMessage("Error adding attorney record.");
    }
  };

  const isLoading = useSelector((state) => state.admindata.isLoading);
  const dispatch = useDispatch();
  const [attorneyList, setAttorneyList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object().shape({
    leadId: Yup.string().required("Lead ID is required"),
    firstName: Yup.string().required("First Name is required").min(2),
    lastName: Yup.string().required("Last Name is required").min(2),
    doa: Yup.date().required("Date of Accident is required"),
    pr_mv104: Yup.string().required("PR / MV104 field is required"),
    degreeOfFault: Yup.string().required("Degree of Fault is required"),
    status: Yup.string().required("Status is required"),
    comments: Yup.string().optional(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(formOptions);

  const onSubmit = (data) => {
    insertAttorneyData(data);
  };

  const handleEmail = () => {
    // Add email handling logic here
  };

  const handleDownloadPDF = () => {
    // Add PDF download logic here
  };

  const handleDownloadCSV = () => {
    // Add CSV download logic here
  };

  const handleView = (lead) => {
    // Create a PDF when "View" is clicked
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Attorney Lead Details", 20, 20);

    doc.setFontSize(12);
    doc.text(`Lead ID: ${lead.leadId}`, 20, 30);
    doc.text(`Name: ${lead.firstName} ${lead.lastName}`, 20, 40);
    doc.text(`Date of Accident: ${lead.doa}`, 20, 50);
    doc.text(`PR / MV104: ${lead.pr_mv104}`, 20, 60);
    doc.text(`Degree of Fault: ${lead.degreeOfFault}`, 20, 70);
    doc.text(`Status: ${lead.status}`, 20, 80);
    doc.text(`Comments: ${lead.comments || "N/A"}`, 20, 90);

    // Save the PDF
    doc.save(`${lead.firstName}_${lead.lastName}_Lead.pdf`);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Attorney Dashboard</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Create New Attorney Record */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>Create New Attorney Record</h4>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                          <label className="form-label">Lead ID</label>
                          <input
                            className="form-control"
                            {...register("leadId")}
                          />
                          <div className="invalid-feedback d-block">
                            {errors.leadId?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">First Name</label>
                          <input
                            className="form-control"
                            {...register("firstName")}
                          />
                          <div className="invalid-feedback d-block">
                            {errors.firstName?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Last Name</label>
                          <input
                            className="form-control"
                            {...register("lastName")}
                          />
                          <div className="invalid-feedback d-block">
                            {errors.lastName?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Date of Accident (DOA)
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            {...register("doa")}
                          />
                          <div className="invalid-feedback d-block">
                            {errors.doa?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">PR / MV104</label>
                          <input
                            className="form-control"
                            {...register("pr_mv104")}
                          />
                          <div className="invalid-feedback d-block">
                            {errors.pr_mv104?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Degree of Fault</label>
                          <input
                            className="form-control"
                            {...register("degreeOfFault")}
                          />
                          <div className="invalid-feedback d-block">
                            {errors.degreeOfFault?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <select
                            className="form-select"
                            {...register("status")}
                          >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Resolved">Resolved</option>
                            <option value="In Progress">In Progress</option>
                          </select>
                          <div className="invalid-feedback d-block">
                            {errors.status?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Comments</label>
                          <textarea
                            className="form-control"
                            {...register("comments")}
                          />
                        </div>
                        <button className="btn btn-secondary" type="submit">
                          Add Record
                        </button>
                      </form>

                      {/* Show success or error message here */}
                      {successMessage && (
                        <div className="alert alert-success mt-3">
                          {successMessage}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="alert alert-danger mt-3">
                          {errorMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="d-flex justify-content-center mb-3">
                    <button
                      className="btn btn-primary me-2"
                      onClick={handleEmail}
                    >
                      Email
                    </button>
                    <button
                      className="btn btn-success me-2"
                      onClick={handleDownloadPDF}
                    >
                      Download PDF
                    </button>
                    <button
                      className="btn btn-info"
                      onClick={handleDownloadCSV}
                    >
                      Download CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Attorney List */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>Attorney Leads</h4>
                    </div>
                    <div className="card-body">
                      {attorneyList.length > 0 ? (
                        <ul className="list-group">
                          {attorneyList.map((lead, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              {`${lead.firstName} ${lead.lastName} - ${lead.leadId}`}
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => handleView(lead)}
                              >
                                View
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No records added yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default DummyComponent;
