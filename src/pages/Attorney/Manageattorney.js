import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Tooltiphome from "../../Common/Tooltiphome";
import * as AllRedux from "../../store/slice/attorneySlice";
import Papa from "papaparse";
import { useSelector, useDispatch } from "react-redux";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { Tooltip } from "@material-ui/core";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import { ErrorAlert, SuccessAlert } from "../../Common/Alert";
import EmailForm from "../../Common/Email/EmailSer";
import EmailModal from "../../Common/Email/EmailSer";

export default function Manageattorney() {
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const data = useSelector(
    (state) => state.attorney.attorneyDataListing.data.data
  );
  const pdfref = useRef(null);
  const LoginType = useSelector((state) => state.admindata.adminData.data.role);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [addCheck, setAddCheck] = useState(false);

  const LoginData = useSelector(
    (state) => state.admindata.adminData.data.rights
  );

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [rangeInput, setRangeInput] = useState("");

  const ALLOWED_COLUMNS = [
    "id",
    "name",
    "manager_name",
    "email",
    "phone_number",
    "address",
    "location",
  ];

  useEffect(() => {
    setAllColumns(ALLOWED_COLUMNS);
    setSelectedColumns(ALLOWED_COLUMNS);
  }, [data]);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);

    setAddress(value);
    setCoordinates(ll);
  };

  const [getAccess, setAccess] = useState({
    add: "",
    update: "",
    view: "",
    delete: "",
  });

  useEffect(() => {
    if (LoginData !== undefined && LoginType === "Sub Admin") {
      for (const element of LoginData) {
        if (element.module_name === "ATTORNEY") {
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

  const dispatch = useDispatch();

  const validationSubAdmin = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name must be at most 30 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,30}$",
        "Only alphabets are allowed for this field"
      ),
    designation: Yup.string()
      .required("Designation is required")
      .min(2, "Designation must be at least 2 characters")
      .max(20, "Designation must be at most 20 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,20}$",
        "Only alphabets are allowed for this field"
      ),
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .test("Email is invalid", "Email is invalid", (value) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(value) !== false;
      })
      .strict(true),
    localPhoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9()\s\-]+$/, "Invalid phone number")
      .min(9, "Number must be at least 9 characters")
      .max(11, "Number must be at most 11 characters"),
    // callingCountryCode: Yup.string()
    //   .required("Calling country code is required")
    //   .matches(/^\+\d{1,4}$/, "Invalid calling country code"),

    // address1: Yup.string().required("Address is required"),
    mfstatus: Yup.string().required("Type is required"),
    // latitude: Yup.string()
    //   .required("Latitude is required")
    //   .matches(/^-?(90(\.\d{1,7})?|[0-8]?\d(\.\d{1,7})?)$/, "Invalid latitude"),
    // longitude: Yup.string()
    //   .required("Longitude is required")
    //   .matches(
    //     /^-?(180(\.\d{1,7})?|(1[0-7]\d|\d{1,2})(\.\d{1,7})?)$/,
    //     "Invalid longitude"
    //   ),

    location: Yup.string()
      .required("Location is required")
      .min(2, "Location must be at least 2 characters")
      .max(20, "Location must be at most 20 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,20}$",
        "Only alphabets are allowed for this field"
      ),
    description: Yup.string().required("Description is required"),
  });

  const formOptions = { resolver: yupResolver(validationSubAdmin) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  const DataSubmit = (data) => {
    try {
      if (address !== "") {
        if (data) {
          dispatch(
            AllRedux.addAttorney({
              name: data.name,
              manager_name: data.designation,
              email: data.email,
              // calling_code: data.callingCountryCode,
              phone_number: data.localPhoneNumber,
              address: address,
              latdata: coordinates,
              location: data.location,
              description: data.description,
              attorney_type: data.mfstatus,
              // latdata: coordinates,
            })
          ).then((res) => {
            reset();
            setAddress("");
            setAddCheck(false);
            dispatch(AllRedux.attorneyList({}));
          });
        }
        setAddCheck(false);
      }
      setAddCheck(true);
    } catch (error) {}
  };

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
        dispatch(AllRedux.removeAttorney({ attorney_id: rid })).then((res) => {
          dispatch(AllRedux.attorneyList({}));
        });
      }
    });
  };

  useLayoutEffect(() => {
    dispatch(AllRedux.attorneyList({}));
  }, []);

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      footer: "ID",
    },
    {
      header: "Name",
      accessorKey: "name",
      footer: "Name",
    },
    {
      header: "Manager name",
      accessorKey: "manager_name",
      footer: "Manager name",
    },
    {
      header: "Email",
      accessorKey: "email",
      footer: "Email",
    },
    {
      header: "Phone number",
      accessorKey: "phone_number",
      footer: "Phone number",
    },
    {
      header: "Address",
      accessorKey: "address",
      footer: "Address",
    },
    {
      header: "Location",
      accessorKey: "location",
      footer: "Location",
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

  const exportToPDF = (dataToExport, columnsToExport) => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(20);
    doc.text(`Attorney List`, 14, 22);

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

    doc.save(`attorney-list.pdf`);
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
    link.setAttribute("download", "attorneys.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleExportClick = (exportType) => {
    setSelectedExportType(exportType);
    setSelectedRows(table.getRowModel().rows.map((row) => row.id));
    setShowExportModal(true);
  };

  const handleExportConfirm = () => {
    if (selectedColumns.length === 0) {
      ErrorAlert("Please select at least one column");
      return;
    }

    const allRows = table.getRowModel().rows;
    let rowsToExport = [];

    // If rangeInput is filled, prioritize that
    if (rangeInput.trim() !== "") {
      const rowIndexes = parseRangeInput(rangeInput);
      rowsToExport = rowIndexes
        .filter((i) => i >= 0 && i < allRows.length)
        .map((i) => allRows[i]);
    } else if (selectedRows.length > 0) {
      // Otherwise use selected checkboxes
      rowsToExport = allRows.filter((row) => selectedRows.includes(row.id));
    }

    if (rowsToExport.length === 0) {
      ErrorAlert("No valid rows selected to export.");
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

  const sendDataToEmail = (dataToExport, columnsToExport) => {
    try {
      const attorneyData = {
        tableData: dataToExport,
        listName: "Attorney List",
        columns: columnsToExport.map((col) =>
          col.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        ),
      };

      dispatch(AllRedux.sendAttorneyEmail({ data: attorneyData })).then(() =>
        SuccessAlert("Email Sent Successfully")
      );
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };

  const exportCSVData = () => {
    if (!data || data.length === 0) {
      console.log("No data available to export");
      return [];
    }

    // Return data in an array of objects format
    return data.map((attroney, index) => ({
      Id: index + 1,
      Name: attroney.name,
      ManagerName: attroney.manager_name,
      Email: attroney.email,
      PhoneNumber: attroney.phone_number,
      Address: attroney.address,
      Location: attroney.location,
    }));
  };
  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);
  const exportPrint = useReactToPrint({
    contentRef: pdfref,
    documentTitle: "Attorney-list",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  //   const sendDataToEmail = () => {
  //     try {
  //       const tableData = table.getRowModel().rows.map((row) => row.original);
  //       const AttorneyData = {
  //         tableData: tableData,
  //         listName: "Attorney List",
  //       };
  //       if (AttorneyData) {
  //         dispatch(
  //           AllRedux.sendAttorneyEmail({
  //             data: AttorneyData,
  //           })
  //         ).then((res) => {
  //           SuccessAlert("Email Sent Successfully");
  //         });
  //       }
  //     } catch (error) {
  //       ErrorAlert(error, "Something went wrong.");
  //     }
  //   };
  const handleShowEmailModal = async () => {
    const doc = new jsPDF();
    // Generate your PDF content here
    doc.text("Attorney List", 10, 10);
    const blob = doc.output("blob");
    setPdfBlob(blob);
    setShowEmailModal(true);
  };
  return (
    <>
      {/* <style>
        {`@media print {
          .action-column {
            display: none !important;
          }
        }`}
      </style> */}
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
                            {row.original.name || `Attorney ${row.id}`}
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Row Range Input */}
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
                        Use format like <strong>1-2,5-10,11-15</strong> to
                        export specific ranges.
                      </small>
                    </div>
                  </div>

                  {/* Right: Columns */}
                  <div className="col-md-6">
                    <h6>Select Columns</h6>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {ALLOWED_COLUMNS.map((column) => (
                        <div key={column} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedColumns.includes(column)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedColumns([
                                  ...selectedColumns,
                                  column,
                                ]);
                              } else {
                                setSelectedColumns(
                                  selectedColumns.filter(
                                    (col) => col !== column
                                  )
                                );
                              }
                            }}
                            id={`col-${column}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`col-${column}`}
                          >
                            {column
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
                  onClick={() => {
                    setSelectedRows([]);
                    setSelectedColumns(ALLOWED_COLUMNS);
                    setShowExportModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleExportConfirm}
                  disabled={
                    selectedRows.length === 0 || selectedColumns.length === 0
                  }
                >
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6 mt-4">
                    <h4>Add Attorney</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">Add Attorney</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {/* Container-fluid starts*/}

            {getAccess.add === 1 ? (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>Create New Attorney</h4>
                      </div>
                      <div className="card-body">
                        <form
                          className="row g-3 needs-validation custom-input"
                          onSubmit={handleSubmit(DataSubmit)}
                        >
                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip01"
                            >
                              Firm Name
                            </label>
                            <input
                              className="form-control"
                              id="validationTooltip01"
                              type="text"
                              placeholder="Name"
                              {...register("name")}
                            />
                            <div className="invalid-feedback">
                              {errors.name?.message}
                            </div>
                          </div>
                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip02"
                            >
                              Manager Name
                            </label>
                            <input
                              className="form-control"
                              id="validationTooltip02"
                              type="text"
                              placeholder="Manager Name"
                              {...register("designation")}
                            />
                            <div className="invalid-feedback">
                              {errors.designation?.message}
                            </div>
                          </div>
                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Email
                            </label>
                            <div className="input-group has-validation">
                              <input
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                placeholder="Email"
                                aria-describedby="validationTooltipUsernamePrepend"
                                {...register("email")}
                              />
                              <div className="invalid-feedback">
                                {errors.email?.message}
                              </div>
                              <div className="invalid-tooltip">
                                Please choose a unique and valid username.
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Phone Number
                            </label>
                            <div className="input-group has-validation">
                              <input
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                aria-describedby="validationTooltipUsernamePrepend"
                                placeholder="Phone Number"
                                {...register("localPhoneNumber")}
                              />
                              <div className="invalid-feedback">
                                {errors.localPhoneNumber?.message}
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Location
                            </label>
                            <div className="input-group has-validation">
                              <input
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                placeholder="Location"
                                aria-describedby="validationTooltipUsernamePrepend"
                                {...register("location")}
                              />
                              <div className="invalid-feedback">
                                {errors.location?.message}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Attorney Type
                            </label>
                            <select
                              {...register("mfstatus")}
                              className="form-select"
                              id="validationTooltip04"
                            >
                              <option selected="" disabled="" value="">
                                Choose...
                              </option>
                              <option>WC Attorney</option>
                              <option>No Fault Attorney</option>
                              <option>Slip & Fall Attorney</option>
                              <option>Labor Attorney</option>
                              <option>MMP Attorney</option>
                            </select>
                            <div className="invalid-feedback">
                              {errors.mfstatus?.message}
                            </div>
                          </div>
                          <PlacesAutocomplete
                            value={address}
                            onChange={setAddress}
                            onSelect={handleSelect}
                            googleCallbackName="initPlaces"
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading,
                            }) => (
                              <div>
                                <div className="input_box">
                                  <label
                                    htmlFor="exampleInputEmail1"
                                    className="form-label"
                                  >
                                    Address
                                  </label>
                                  <input
                                    className="form-control"
                                    id="address"
                                    defaultValue={address}
                                    {...register("address1")}
                                    {...getInputProps()}
                                  />
                                </div>
                                <div>
                                  {loading ? (
                                    <div className="text-secondary">
                                      loading...
                                    </div>
                                  ) : null}

                                  {suggestions.map((suggestion) => {
                                    const style = {
                                      backgroundColor: suggestion.active
                                        ? "#f1f0ff"
                                        : "#fff",
                                      textAlign: "left",
                                    };

                                    return (
                                      <div
                                        className="form-control"
                                        {...getSuggestionItemProps(suggestion, {
                                          style,
                                        })}
                                      >
                                        {suggestion.description}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>

                          {addCheck === true && address === "" ? (
                            <div className="invalid-feedback">
                              Address is required.
                            </div>
                          ) : (
                            <></>
                          )}

                          <div className="col-md-12 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip04"
                            >
                              Description
                            </label>
                            <textarea
                              className="form-control"
                              id="validationTooltip010"
                              type="text"
                              placeholder="Description"
                              {...register("description")}
                            />
                            <div className="invalid-feedback">
                              {errors.description?.message}
                            </div>
                          </div>

                          <div className="col-12">
                            <button className="btn btn-primary" type="submit">
                              Add Attorney
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

            {/* Container-fluid Ends*/}

            {getAccess.view === 1 ? (
              <>
                {data === undefined ? (
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card">
                          <div className="card-header">
                            <h4>Attorney List</h4>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <button
                                className="btn btn-success me-3"
                                onClick={exportToPDF}
                              >
                                Download PDF
                              </button>
                              <button
                                className="btn btn-info me-3"
                                onClick={() => handleExportClick("csv")}
                              >
                                Download CSV
                              </button>

                              <button
                                className="btn btn-primary me-3"
                                onClick={exportPrint}
                              >
                                Print
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
                            </div>
                            <h2 className="d-flex justify-content-center">
                              {" "}
                              No Data Found
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card">
                          <div className="card-header">
                            <h4>Attorney List</h4>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <button
                                className="btn btn-success me-3"
                                onClick={() => handleExportClick("pdf")}
                              >
                                Download PDF
                              </button>
                              <button
                                onClick={() => handleExportClick("csv")}
                                className="btn btn-info me-3"
                              >
                                {/* <CSVLink
                                  data={exportCSVData()}
                                  filename="Attorney-list.csv"
                                  className="text-dark"
                                  target="_blank"
                                > */}
                                Download CSV
                                {/* </CSVLink> */}
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
                              <button
                                className="btn btn-info me-3"
                                onClick={handleShowEmailModal}
                              >
                                Email Data
                              </button>
                              <EmailModal
                                open={showEmailModal}
                                onClose={() => setShowEmailModal(false)}
                                pdfBlob={pdfBlob}
                              />
                              <div className="d-flex float-end mb-3 mt-3 ">
                                <input
                                  className="form-control"
                                  type="text"
                                  value={filtering}
                                  onChange={(e) => setfiltering(e.target.value)}
                                  placeholder="Search"
                                />
                              </div>

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
                                          Action
                                        </th>
                                      </tr>
                                    ))}
                                </thead>
                                <tbody>
                                  {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                      {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                          {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                          )}
                                        </td>
                                      ))}
                                      <td>
                                        <ul className="action">
                                          {getAccess.update === 1 ? (
                                            <>
                                              {" "}
                                              <li className="edit action-column">
                                                <Tooltip title="Edit">
                                                  <Link
                                                    to={`/manage-attorney/${row.original.id}`}
                                                    onClick={() =>
                                                      sessionStorage.setItem(
                                                        "path",
                                                        "/attorney-details"
                                                      )
                                                    }
                                                  >
                                                    <i className="icon-pencil-alt"></i>
                                                  </Link>
                                                </Tooltip>
                                              </li>
                                              <li className="view action-column">
                                                <Tooltip title="View">
                                                  <Link
                                                    to="/attorney-client-list"
                                                    state={row.original.id}
                                                    onClick={() =>
                                                      sessionStorage.setItem(
                                                        "path",
                                                        "/attorney-details"
                                                      )
                                                    }
                                                  >
                                                    <i className="icon-eye"></i>
                                                  </Link>
                                                </Tooltip>
                                              </li>
                                            </>
                                          ) : (
                                            <></>
                                          )}
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
