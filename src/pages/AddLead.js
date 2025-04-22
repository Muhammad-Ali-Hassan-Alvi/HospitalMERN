import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { useForm } from "react-hook-form";
import Papa from "papaparse";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Tooltiphome from "../Common/Tooltiphome";
import * as AllRedux from "../store/slice/leadSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import Swal from "sweetalert2";
import { Tooltip } from "@material-ui/core";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import { ErrorAlert, SuccessAlert } from "../Common/Alert";

export default function AddLead() {
  // const [getNevigate, setNevigate] = useState(false);

  const pdfref = useRef(null);
  const [selectedValue, setSelectedValue] = useState({});
  const data = useSelector((state) => state.lead.leadDataListing.data.data);

  const removeLeadItem = (rid) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(AllRedux.removeLead({ lead_id: rid })).then((res) => {
          dispatch(AllRedux.leadList({}));
        });
      }
    });
  };

  useLayoutEffect(() => {
    dispatch(AllRedux.leadList({}));
  }, []);

  const LoginData = useSelector(
    (state) => state.admindata.adminData.data.rights
  );

  useEffect(() => {
    if (LoginData !== undefined && LoginType === "Sub Admin") {
      for (const element of LoginData) {
        if (element.module_name === "CLIENT") {
          setAccess({
            add: element.can_add,
            update: element.can_update,
            view: element.can_view,
            delete: element.can_delete,
          });
        }
      }
    } else if (LoginType === "Admin") {
      setAccess({
        add: 1,
        update: 1,
        view: 1,
        delete: 1,
      });
    }
  }, [LoginData]);

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      footer: "ID",
    },
    {
      header: "First name",
      accessorKey: "first_name",
      footer: "First name",
    },
    {
      header: "Last name",
      accessorKey: "last_name",
      footer: "Last name",
    },
    {
      header: "Disposition",
      accessorKey: "disposition",
      footer: "Disposition",
    },
  ];

  const [sorting, setsorting] = useState([]);
  const [filtering, setfiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setsorting,
    onGlobalFilterChange: setfiltering,
  });

  const goToUser = (id) => {
    sessionStorage.setItem("path", "/user-list");
    navigate("/user-details", { state: id });
  };

  // const exportToPDF = () => {
  //   const doc = new jsPDF("p", "mm", "a4");

  //   // Set the title
  //   doc.setFontSize(20);
  //   doc.text("Client List - Page " + (table.getState().pagination.pageIndex + 1), 14, 22);

  //   // Prepare the data for the table
  //   const currentPageRows = table.getRowModel().rows; // Get current page rows
  //   const tableData = currentPageRows.map((row) => [
  //       row.original.id, // ID
  //       row.original.first_name, // First Name
  //       row.original.last_name, // Last Name
  //       row.original.disposition // Disposition
  //   ]);

  //   // Define the columns
  //   const columns = [
  //       { header: "ID", dataKey: "id" },
  //       { header: "First Name", dataKey: "first_name" },
  //       { header: "Last Name", dataKey: "last_name" },
  //       { header: "Disposition", dataKey: "disposition" }
  //   ];

  //   // Add the table to the PDF
  //   doc.autoTable({
  //       head: [columns.map(col => col.header)],
  //       body: tableData,
  //       startY: 30, // Start below the title
  //       theme: 'grid', // Optional: you can change the theme
  //       headStyles: {
  //           fillColor: [40, 127, 186], // Header background color (RGB format)
  //           textColor: [255, 255, 255], // Header text color (white)
  //           fontSize: 12, // Optional: set font size for header
  //       },
  //       styles: {
  //           cellPadding: 5, // Padding for cells
  //           fontSize: 10, // Font size for body text
  //           overflow: 'linebreak', // Handle text overflow
  //           halign: 'left', // Horizontal alignment
  //           valign: 'middle', // Vertical alignment
  //       },
  //       alternateRowStyles: {
  //           fillColor: [240, 240, 240], // Alternate row background color (light gray)
  //       },
  //   });

  //   // Save the PDF
  //   doc.save("Client-list-page-" + (table.getState().pagination.pageIndex + 1) + ".pdf");
  // };

  // const exportCSVData = () => {
  //   if (!data || data.length === 0) {
  //     console.log("No data available to export");
  //     return [];
  //   }

  //   return data.map((client, index) => ({
  //     Id: index + 1,
  //     FirstName: client.first_name,
  //     LastName: client.last_name,
  //     Disposition: client.disposition,
  //   }));
  // };
  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);
  const exportPrint = useReactToPrint({
    contentRef: pdfref,
    documentTitle: "Client-list",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });
  const sendDataToEmail = () => {
    try {
      const tableData = table.getRowModel().rows.map((row) => row.original);
      const clientListingData = {
        tableData: tableData,
        listName: "Client",
      };
      if (clientListingData) {
        dispatch(
          AllRedux.sendClinetListsEmail({
            data: clientListingData,
          })
        ).then((res) => {
          SuccessAlert("Email Sent Successfully");
        });
      } else {
        ErrorAlert("Something went wrong.");
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };
  const [phone, setPhone] = useState(null);

  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const dispatch = useDispatch();
  const [getID, setID] = useState();
  const [disp, setDisp] = useState("");
  const [middeleName, setMiddleName] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [rangeInput, setRangeInput] = useState("");

  const ALLOWED_COLUMNS = ["id", "first_name", "last_name", "disposition"];

  //
  const validationLead = Yup.object().shape({
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .matches("^[A-Za-z]{2,20}$", "Only alphabets are allowed for this field"),
    middle_name:
      middeleName !== "" && middeleName !== undefined
        ? Yup.string()
            .required("Middle name is required")
            .min(1, "Name must be at least 1 characters")
            .max(20, "Name must be at most 20 characters")
            .matches(
              "^[A-Za-z]{1,20}$",
              "Only alphabets are allowed for this field"
            )
        : Yup.string(),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .matches("^[A-Za-z]{2,20}$", "Only alphabets are allowed for this field"),
    localPhoneNumber:
      phone !== null
        ? Yup.string()
            .required("Phone number is required")
            .matches(/^[0-9()\s\-]+$/, "Invalid phone number")
            .min(9, "Number must be at least 9 characters")
            .max(11, "Number must be at most 11 characters")
        : Yup.string(),
    // disposition: Yup.string().required("Disposition is required"),
    // comment: Yup.string().required("Comment is required"),
  });

  const formOptions = { resolver: yupResolver(validationLead) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  const LoginType = useSelector((state) => state.admindata.adminData.data.role);

  const [getAccess, setAccess] = useState({
    add: "",
    update: "",
    view: "",
    delete: "",
  });

  useEffect(() => {
    if (LoginData !== undefined && LoginType === "Sub Admin") {
      for (const element of LoginData) {
        if (element.module_name === "POTENTIAL CLIENT") {
          setAccess({
            add: element.can_add,
            update: element.can_update,
            view: element.can_view,
            delete: element.can_delete,
          });
        }
      }
    } else if (LoginType === "Admin") {
      setAccess({
        add: 1,
        update: 1,
        view: 1,
        delete: 1,
      });
    }
  }, [LoginData]);

  const DataSubmit = (data) => {
    try {
      if (data) {
        if (disp === "Injured") {
          dispatch(
            AllRedux.addLead({
              first_name: data.first_name,
              middle_name: data.middle_name,
              last_name: data.last_name,
              comment: data.comment,
              phone: data.localPhoneNumber,
            })
          ).then((res) => {
            if (res.payload.code == 1) {
              setID(res.payload.data[0].id);
              sessionStorage.setItem("path", "/add-lead");
              navigate("/qualifying", {
                state: { ID: res.payload.data[0].id },
              });
            }
          });
        } else {
          dispatch(
            AllRedux.addLead({
              first_name: data.first_name,
              middle_name: data.middle_name,
              last_name: data.last_name,
              comment: data.comment,
              phone: data.localPhoneNumber,
            })
          ).then((res) => {
            if (res.payload.code == 1) {
              setID(res.payload.data[0].id);
              dispatch(AllRedux.leadList({}));
              // navigate(-1);
              reset();
            }
          });
        }

        // setNevigate(true);
      }
    } catch (error) {}
  };

  const handleSelectChange = (e, id) => {
    const status = e.target.value;
    if (status === "Yes") {
      moveToArchive(id, status);
    } else {
      setSelectedValue((prevValues) => ({
        ...prevValues,
        [id]: "No",
      }));
    }
  };

  const moveToArchive = (rid, status) => {
    Swal.fire({
      title: "Are you sure you want to move to the archive section?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Move it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(AllRedux.moveClientToArchive({ lead_id: rid, status })).then(
          (res) => {
            dispatch(AllRedux.leadList({}));
          }
        );
        setSelectedValue((prevValues) => ({
          ...prevValues,
          [rid]: "Yes",
        }));
      } else {
        setSelectedValue((prevValues) => ({
          ...prevValues,
          [rid]: "No",
        }));
      }
    });
  };

  const parseRangeInput = (input) => {
    const ranges = input.split(",").map((r) => r.trim());
    const indexes = [];

    for (const range of ranges) {
      if (range.includes("-")) {
        const [start, end] = range.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start - 1; i < end; i++) {
            indexes.push(i);
          }
        }
      } else {
        const single = Number(range);
        if (!isNaN(single)) {
          indexes.push(single - 1);
        }
      }
    }
    return indexes;
  };

  const exportToPDF = (dataToExport, columnsToExport) => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text("Client List", 14, 20);

    const columnHeaders = columnsToExport.map((col) =>
      col.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );

    const tableData = dataToExport.map((row) =>
      columnsToExport.map((col) => row[col] || "")
    );

    doc.autoTable({
      head: [columnHeaders],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 127, 186] },
    });

    doc.save("client-list.pdf");
  };

  const exportCSV = (dataToExport, columnsToExport) => {
    const csvData = dataToExport.map((row, index) => {
      const csvRow = { "#": index + 1 };
      columnsToExport.forEach((col) => {
        const displayName = col
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        csvRow[displayName] = row[col] || "";
      });
      return csvRow;
    });

    const csvContent = Papa.unparse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "billing-list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportConfirm = () => {
    if (selectedColumns.length === 0) {
      ErrorAlert("Select at least one column");
      return;
    }

    const allRows = table.getRowModel().rows;
    let rowsToExport = [];

    if (rangeInput.trim() !== "") {
      const rowIndexes = parseRangeInput(rangeInput);
      rowsToExport = rowIndexes
        .filter((i) => i >= 0 && i < allRows.length)
        .map((i) => allRows[i]);
    } else if (selectedRows.length > 0) {
      rowsToExport = allRows.filter((row) => selectedRows.includes(row.id));
    }

    if (rowsToExport.length === 0) {
      ErrorAlert("No rows selected to export.");
      return;
    }

    const filteredData = rowsToExport.map((row) => {
      const filteredRow = {};
      selectedColumns.forEach((col) => {
        filteredRow[col] = row.original[col];
      });
      return filteredRow;
    });

    switch (selectedExportType) {
      case "pdf":
        exportToPDF(filteredData, selectedColumns);
        break;
      case "csv":
        exportCSV(filteredData, selectedColumns);
        break;
      case "print":
        exportPrint(filteredData, selectedColumns);
        break;
      case "email":
        sendDataToEmail(filteredData, selectedColumns);
        break;
      default:
        break;
    }

    setShowExportModal(false);
  };

  return (
    <>
      {isLoading && <Loader />}

      {showExportModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Data to Export</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowExportModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Left: Rows */}
                  <div className="col-md-6">
                    <h6>Select Rows</h6>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {table.getRowModel().rows.map((row) => (
                        <div key={row.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRows([...selectedRows, row.id]);
                              } else {
                                setSelectedRows(
                                  selectedRows.filter((id) => id !== row.id)
                                );
                              }
                            }}
                            id={`row-${row.id}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`row-${row.id}`}
                          >
                            {row.original.first_name} {row.original.last_name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {/* Range Input */}
                    <div className="mt-4">
                      <h6>Or Enter Row Ranges</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 1-2,5-10,11-15"
                        value={rangeInput}
                        onChange={(e) => setRangeInput(e.target.value)}
                      />
                      <small className="text-muted">
                        Format: <strong>1-2,5,8-10</strong>
                      </small>
                    </div>
                  </div>
                  {/* Right: Columns */}
                  <div className="col-md-6">
                    <h6>Select Columns</h6>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {ALLOWED_COLUMNS.map((col) => (
                        <div key={col} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedColumns.includes(col)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedColumns([...selectedColumns, col]);
                              } else {
                                setSelectedColumns(
                                  selectedColumns.filter((c) => c !== col)
                                );
                              }
                            }}
                            id={`col-${col}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`col-${col}`}
                          >
                            {col
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleExportConfirm}
                  disabled={selectedColumns.length === 0}
                >
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="tap-top">
        <i data-feather="chevrons-up"></i>
      </div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          {/* client changes new cr */}
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Client</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">Client</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {getAccess.add === 1 ? (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>Create New Client</h4>
                      </div>
                      <div className="card-body">
                        <form
                          onSubmit={handleSubmit(DataSubmit)}
                          className="row g-3 needs-validation custom-input"
                        >
                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip01"
                            >
                              First Name
                            </label>
                            <input
                              className="form-control"
                              id="validationTooltip01"
                              type="text"
                              placeholder="First Name"
                              // disabled={getNevigate === true}
                              {...register("first_name")}
                            />
                            <div className="invalid-feedback">
                              {errors.first_name?.message}
                            </div>
                          </div>
                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip02"
                            >
                              Middle Name
                            </label>
                            <input
                              className="form-control"
                              id="validationTooltip02"
                              type="text"
                              placeholder="Middle Name"
                              {...register("middle_name")}
                              onChange={(e) => setMiddleName(e.target.value)}
                              // disabled={getNevigate === true}
                            />
                            <div className="invalid-feedback">
                              {errors.middle_name?.message}
                            </div>
                          </div>
                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip02"
                            >
                              Last Name
                            </label>
                            <input
                              className="form-control"
                              id="validationTooltip02"
                              type="text"
                              placeholder="Last Name"
                              {...register("last_name")}
                              // disabled={getNevigate === true}
                            />
                            <div className="invalid-feedback">
                              {errors.last_name?.message}
                            </div>
                          </div>
                          <div className="col-md-6 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip03"
                            >
                              Comment
                            </label>
                            <input
                              className="form-control"
                              id="validationTooltip03"
                              type="text"
                              required=""
                              {...register("comment")}
                              placeholder="Add your Comments here"
                              // disabled={getNevigate === true}
                            />
                            <div className="invalid-feedback">
                              {errors.comment?.message}
                            </div>
                          </div>
                          <div className="col-md-6 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip02"
                            >
                              Phone Number
                            </label>
                            <input
                              className="form-control"
                              id="validationTooltip02"
                              type="text"
                              placeholder="Phone Number"
                              {...register("localPhoneNumber")}
                              onChange={(e) => setPhone(e.target.value)}
                              // disabled={getNevigate === true}
                            />
                            <div className="invalid-feedback">
                              {errors.localPhoneNumber?.message}
                            </div>
                          </div>
                          {/* <div className="col-md-6 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip04"
                            >
                              Select Disposition
                            </label>
                            <select
                              className="form-select"
                              id="validationTooltip04"
                              required=""
                              {...register("disposition")}
                              onChange={(e) => {
                                setDisp(e.target.value);
                              }}
                              disabled={getNevigate === true}
                            >
                              <option selected="" disabled="" value="">
                                Choose...
                              </option>
                              <option value={"Customer Already Signed"}>
                                Customer Already Signed{" "}
                              </option>
                              <option value={"Answering Machine"}>
                                Answering Machine
                              </option>
                              <option value={"Callback"}>Callback </option>
                              <option value={"No Contact"}>No Contact</option>
                              <option value={"Does Not Qualify"}>
                                Does Not Qualify
                              </option>
                              <option value={"Follow Up"}>Follow Up</option>
                              <option value={"Medical Facility"}>
                                Medical Facility
                              </option>
                              <option value={"Attorney"}>Attorney</option>
                              <option value={"Injured"}>Injured</option>
                            </select>
                            <div className="invalid-feedback">
                              {errors.disposition?.message}
                            </div>
                          </div> */}
                          {/* <div className="d-flex justify-content-center gap-4">
                            <p className="text-secondary">
                             OR 
                            </p>
                          </div> */}
                          <div className="d-flex justify-content-center gap-4">
                            <button className="btn btn-primary" type="submit">
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            <style>
              {`@media print {
          .action-column {
            display: none !important;
          }
        }`}
            </style>
            {isLoading && <Loader />}
            <div className="tap-top">
              <i data-feather="chevrons-up"></i>
            </div>

            {getAccess.view === 1 ? (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="page-title">
                          <div className="row">
                            <div className="col-6">
                              <h4>Client List</h4>
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive">
                          <button
                            className="btn btn-success me-3"
                            onClick={() => {
                              setSelectedExportType("pdf");
                              setShowExportModal(true);
                            }}
                          >
                            Download PDF
                          </button>
                          <button
                            className="btn btn-info me-3"
                            onClick={() => {
                              setSelectedExportType("csv");
                              setShowExportModal(true);
                            }}
                          >
                            Download CSV
                          </button>

                          <button
                            className="btn btn-primary me-3"
                            onClick={exportPrint}
                          >
                            Print
                          </button>
                          <button
                            className="btn btn-secondary me-3"
                            onClick={sendDataToEmail}
                          >
                            Send Email
                          </button>
                          <div className="d-flex float-end mb-3 mt-3 ">
                            {/* <label className="form-label">Search</label> */}
                            <input
                              className="form-control"
                              type="text"
                              value={filtering}
                              onChange={(e) => setfiltering(e.target.value)}
                              placeholder="Search"
                            />
                          </div>

                          {data === undefined ? (
                            <h2 className="d-flex justify-content-center">
                              {" "}
                              No Data Found
                            </h2>
                          ) : (
                            <>
                              <table
                                className="table table-striped border"
                                ref={pdfref}
                              >
                                <thead>
                                  {table
                                    .getHeaderGroups()
                                    .map((headerGroup) => (
                                      <tr
                                        key={headerGroup.id}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {headerGroup.headers.map((header) => (
                                          <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                          >
                                            {flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                            )}
                                          </th>
                                        ))}

                                        <th className="action-column">
                                          Move To Archive
                                        </th>
                                        <th className="action-column">
                                          Action
                                        </th>
                                      </tr>
                                    ))}
                                </thead>
                                <tbody>
                                  {table.getRowModel().rows.map((row) => (
                                    <tr
                                      key={row.id}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {row.getVisibleCells().map((cell) => (
                                        <>
                                          <td key={cell.id}>
                                            {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext()
                                            )}
                                          </td>
                                        </>
                                      ))}

                                      <td>
                                        <select
                                          className="custom-select me-3 action-column"
                                          value={
                                            selectedValue[row.original.id] ||
                                            "No"
                                          }
                                          onChange={(e) =>
                                            handleSelectChange(
                                              e,
                                              row.original.id
                                            )
                                          }
                                        >
                                          <option value="No">No</option>
                                          <option value="Yes">Yes</option>
                                        </select>
                                      </td>

                                      <td>
                                        <ul className="action">
                                          {getAccess.update === 1 ? (
                                            <li className="edit action-column">
                                              <Tooltip title="Edit">
                                                <Link
                                                  to={"/qualifying"}
                                                  state={{
                                                    ID: row.original.id,
                                                  }}
                                                  onClick={() =>
                                                    sessionStorage.setItem(
                                                      "path",
                                                      "/user-list"
                                                    )
                                                  }
                                                >
                                                  <i className="icon-pencil-alt"></i>
                                                </Link>
                                              </Tooltip>
                                            </li>
                                          ) : (
                                            <></>
                                          )}
                                          {/* <li className="view">
                                            <Tooltip title="View">
                                              <a
                                                onClick={() => {
                                                  goToUser(row.original.id);
                                                }}
                                              >
                                                <i className="icon-eye"></i>
                                              </a>
                                            </Tooltip>
                                          </li> */}

                                          {getAccess.delete === 1 ? (
                                            <li className="delete action-column">
                                              <Tooltip title="Delete">
                                                <span
                                                  style={{
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() =>
                                                    removeLeadItem(
                                                      row.original.id
                                                    )
                                                  }
                                                >
                                                  <i className="icon-trash"></i>
                                                </span>
                                              </Tooltip>
                                            </li>
                                          ) : (
                                            <></>
                                          )}
                                        </ul>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  {table
                                    .getFooterGroups()
                                    .map((footerGroup) => (
                                      <tr key={footerGroup.id}>
                                        {footerGroup.headers.map((header) => (
                                          <th key={header.id}>
                                            {flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                            )}
                                          </th>
                                        ))}
                                        <th className="action-column">
                                          Action
                                        </th>
                                      </tr>
                                    ))}
                                </tfoot>
                              </table>

                              <div className="d-flex justify-content-end mt-3">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => table.setPageIndex(0)}
                                >
                                  First page
                                </button>
                                <button
                                  className="btn btn-primary"
                                  style={{ marginLeft: "5px" }}
                                  disabled={!table.getCanPreviousPage()}
                                  onClick={() => table.previousPage()}
                                >
                                  Previous page
                                </button>
                                <button
                                  className="btn btn-primary"
                                  style={{ marginLeft: "5px" }}
                                  disabled={!table.getCanNextPage()}
                                  onClick={() => table.nextPage()}
                                >
                                  Next page
                                </button>
                                <button
                                  className="btn btn-primary ml-5px"
                                  style={{ marginLeft: "5px" }}
                                  onClick={() =>
                                    table.setPageIndex(table.getPageCount() - 1)
                                  }
                                >
                                  Last page
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
