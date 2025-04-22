import React, { useState, useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Tooltiphome from "../../Common/Tooltiphome";
import Loader from "../../components/loader/Loader";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const getCurrentWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startDate = new Date(today);
  // Adjust to start from Monday (if Sunday, go back 6 days, otherwise go to previous Monday)
  startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });
};

const DummyComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [weekData, setWeekData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formInputs, setFormInputs] = useState({ PT: "", ACC: "", CH: "" });
  const [formStatus, setFormStatus] = useState({ message: "", type: "" });
  const [currentWeekDates, setCurrentWeekDates] = useState(
    getCurrentWeekDates()
  );

  // Check if we need to move to the next week
  useEffect(() => {
    const checkWeekProgression = () => {
      const today = new Date();
      const lastDateOfWeek = new Date(currentWeekDates[6]); // Get last day of current week
      lastDateOfWeek.setHours(23, 59, 59, 999); // Set to end of day

      if (today > lastDateOfWeek) {
        setCurrentWeekDates(getCurrentWeekDates());
        setWeekData({}); // Clear previous week's data
      }
    };

    // Set up a daily check at midnight
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) -
      now;

    const timer = setTimeout(() => {
      checkWeekProgression();
      // Set up interval for daily checks
      const intervalId = setInterval(checkWeekProgression, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [currentWeekDates]);

  const validationSchema = Yup.object().shape({
    leadId: Yup.string().required("Lead ID is required"),
    firstName: Yup.string().required("First Name is required").min(2),
    lastName: Yup.string().required("Last Name is required").min(2),
    doa: Yup.date().required("Date of Admission is required"),
    initialDate: Yup.date().required("Initial Date is required"),
    surgery: Yup.string().required("Surgery status is required"),
    comments: Yup.string().optional(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(formOptions);

  const fetchMedicalRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://final-server-production-3f9e.up.railway.app/api/getmedicalrecord"
      );
      const data = await response.json();
      if (response.ok) {
        // Debug: Check what's actually in localStorage
        console.log("All localStorage entries:");
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          console.log(key, "=>", localStorage.getItem(key));
        }

        // Try both common key variations
        const storedUserId =
          localStorage.getItem("userId") || localStorage.getItem("UserID");

        if (!storedUserId) {
          console.error("No user ID found in localStorage");
          return;
        }

        console.log(
          "Stored User ID:",
          storedUserId,
          "Type:",
          typeof storedUserId
        );
        console.log("All records:", data);

        // Filter records - comparing as strings to be safe
        const filteredRecords = data.filter(
          (record) =>
            record.userId &&
            record.userId.toString() === storedUserId.toString()
        );

        console.log("Filtered records:", filteredRecords);
        setLeads(filteredRecords);
      } else {
        console.error("Error fetching medical records:", data);
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const handleDateClick = (date) => {
    const key = date.toDateString();
    if (weekData[key]) return;
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleSaveData = () => {
    const key = selectedDate.toDateString();
    const weekNumber = Math.ceil(selectedDate.getDate() / 7).toString();

    setWeekData({
      ...weekData,
      [key]: {
        ...formInputs,
        week: weekNumber,
      },
    });
    setFormInputs({ PT: "", ACC: "", CH: "" });
    setShowModal(false);
  };

  const onSubmit = async (data) => {
    if (Object.keys(weekData).length < 1) {
      setFormStatus({
        message: "Please fill out at least one day of weekly data.",
        type: "error",
      });
      return;
    }

    const weekDataArray = Object.entries(weekData)
      .filter(([_, values]) => values.PT && values.ACC && values.CH)
      .map(([date, values]) => ({
        date,
        week: values.week,
        pt: values.PT,
        acc: values.ACC,
        ch: values.CH,
      }));

    const userId = localStorage.getItem("UserID");

    const finalData = {
      ...data,
      userId,
      weekData: weekDataArray,
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://final-server-production-3f9e.up.railway.app/api/addmedicalrecord",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setLeads([...leads, finalData]);
        setFormStatus({ message: "Lead added successfully.", type: "success" });
        reset();
        setWeekData({});
      } else {
        setFormStatus({
          message: result.message || "Error adding lead.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error posting medical record:", error);
      setFormStatus({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userId = localStorage.getItem("userId");
  console.log("AaAAAAA", userId);

  return (
    <>
      {isLoading && <Loader />}
      <div className="tap-top">
        <i data-feather="chevrons-up"></i>
      </div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>
                      Medical Staff Dashboard - Week{" "}
                      {Math.ceil(new Date().getDate() / 7)}
                    </h4>
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

            {/* Create New Lead */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>Create New Lead</h4>
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
                            Date of Admission (DOA)
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
                          <label className="form-label">Initial Date</label>
                          <input
                            type="date"
                            className="form-control"
                            {...register("initialDate")}
                          />
                          <div className="invalid-feedback d-block">
                            {errors.initialDate?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Surgery (Y/N)</label>
                          <select
                            className="form-select"
                            {...register("surgery")}
                          >
                            <option value="">Select...</option>
                            <option value="Y">Yes</option>
                            <option value="N">No</option>
                          </select>
                          <div className="invalid-feedback d-block">
                            {errors.surgery?.message}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Comments</label>
                          <textarea
                            className="form-control"
                            {...register("comments")}
                          />
                        </div>

                        {/* Weekly Data Section */}
                        <div className="mb-3">
                          <label className="form-label d-block">
                            Current Week Data Entry (Required)
                          </label>
                          <div className="d-flex gap-2 flex-wrap">
                            {currentWeekDates.map((date, idx) => {
                              const isPastDate =
                                date <
                                new Date(new Date().setHours(0, 0, 0, 0));
                              const isCompleted = weekData[date.toDateString()];

                              return (
                                <button
                                  type="button"
                                  key={idx}
                                  className={`btn ${
                                    isCompleted
                                      ? "btn-success"
                                      : isPastDate
                                      ? "btn-secondary"
                                      : "btn-primary"
                                  }`}
                                  onClick={() =>
                                    !isPastDate && handleDateClick(date)
                                  }
                                  disabled={isPastDate || isCompleted}
                                >
                                  {date.toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                  {isCompleted && " ✓"}
                                </button>
                              );
                            })}
                          </div>
                          {Object.keys(weekData).length < 1 && (
                            <div className="text-danger mt-2">
                              Please fill out at least one day in the weekly
                              data.
                            </div>
                          )}
                        </div>

                        <button className="btn btn-primary" type="submit">
                          Add Lead
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            {formStatus.message && (
              <div
                className={`alert ${
                  formStatus.type === "success"
                    ? "alert-success"
                    : "alert-danger"
                }`}
                role="alert"
              >
                {formStatus.message}
              </div>
            )}

            {/* Modal for Weekly Data */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Enter Data for{" "}
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <label>Week Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      selectedDate
                        ? Math.ceil(selectedDate.getDate() / 7).toString()
                        : ""
                    }
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>PT</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formInputs.PT}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, PT: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>ACC</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formInputs.ACC}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, ACC: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>CH</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formInputs.CH}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, CH: e.target.value })
                    }
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSaveData}>
                  Save Data
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Lead List */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>Lead List</h4>
                    </div>
                    <div className="card-body">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Lead ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>DOA</th>
                            <th>Surgery</th>
                            <th>Comments</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((lead, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{lead.leadId}</td>
                              <td>{lead.firstName}</td>
                              <td>{lead.lastName}</td>
                              <td>{new Date(lead.doa).toLocaleDateString()}</td>
                              <td>{lead.surgery}</td>
                              <td>{lead.comments}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DummyComponent;
