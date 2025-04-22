import React, { useState, useEffect, useRef } from "react";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import moment from "moment";
import Papa from "papaparse";
import { ErrorAlert, SuccessAlert } from "../Common/Alert";
import Tooltiphome from "../Common/Tooltiphome";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import * as AllRedux from "../store/slice/billingSlice";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Tooltip } from "@material-ui/core";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";

export default function Billing() {
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const dispatch = useDispatch();
  const LoginType = useSelector((state) => state.admindata.adminData.data.role);
  const pdfref = useRef(null);
  const LoginData = useSelector(
    (state) => state.admindata.adminData.data.rights
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [rangeInput, setRangeInput] = useState("");

  const ALLOWED_COLUMNS = [
    "invoice_number",
    "billing_date",
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "amount",
    "tax",
    "total_amount",
  ];

  const [getAccess, setAccess] = useState({
    add: "",
    update: "",
    view: "",
    delete: "",
  });

  useEffect(() => {
    if (LoginData !== undefined && LoginType === "Sub Admin") {
      for (const element of LoginData) {
        if (element.module_name === "BILLING") {
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

  const InvoiceNumber = useSelector(
    (state) => state.billing.generateIDInvoice.data.data
  );
  const data = useSelector((state) => state.billing.invoiceListing.data.data);

  useEffect(() => {
    dispatch(AllRedux.invoiceList({}));
    dispatch(AllRedux.generateInvoiceNumber({}));
  }, []);

  const validationQualifying = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .test("Email is invalid", "Email is invalid", (value) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(value) !== false;
      })
      .strict(true),
    invoice: Yup.string()
      .required("Invoice value is required")
      .typeError("You must specify a number")
      .matches(/^[0-9]+$/, "Invoice must contain only digits")
      .min(1, "Invoice value must be at least 1 characters")
      .max(15, "Invoice value must be at most 8 characters"),
    localPhoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9()\s\-]+$/, "Invalid phone number")
      .min(9, "Number must be at least 9 characters")
      .max(11, "Number must be at most 11 characters"),
    // callingCountryCode: Yup.string()
    //   .required("Calling country code is required")
    //   .matches(/^\+\d{1,4}$/, "Invalid calling country code"),
    amount: Yup.string()
      .required("Amount value is required")
      .typeError("You must specify a number")
      .matches(/^[0-9]+$/, "Amount must contain only digits")
      .min(1, "Amount value must be at least 1 characters")
      .max(4, "Amount value must be at most 4 characters"),
    tax: Yup.string()
      .typeError("You must specify a number")
      .required("TAX value is required")
      .matches(
        /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)%?$/,
        "Invalid tax percentage"
      ),
    // .min(1, "TAX value must be at least 1 characters")
    // .max(2, "TAX value must be at most 2 characters")
    totalamount: Yup.string()
      .required("Total amount value is required")
      .typeError("You must specify a number")
      .matches(/^[0-9]+$/, "Amount must contain only digits")
      .min(1, "Total amount value must be at least 1 characters")
      .max(4, "Total amount value must be at most 4 characters"),
    doa: Yup.string()
      .required("DOA is required")
      .test(
        "Is date greater",
        "DOA cannot be greater than today's date",
        (value) => {
          if (!value) return true;
          return moment(new Date()).diff(value) > 0;
        }
      ),
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .matches("^[A-Za-z]{2,20}$", "Only alphabets are allowed for this field"),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .matches("^[A-Za-z]{2,20}$", "Only alphabets are allowed for this field"),
  });

  const formOptions = { resolver: yupResolver(validationQualifying) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = (data) => {
    try {
      if (data) {
        dispatch(
          AllRedux.createInvoice({
            invoice_number: data.invoice,
            billing_date: data.doa,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            // calling_code: data.callingCountryCode,
            phone_number: data.localPhoneNumber,
            amount: data.amount,
            tax: data.tax,
            total_amount: data.totalamount,
          })
        ).then((res) => {
          dispatch(AllRedux.invoiceList({}));
          dispatch(AllRedux.generateInvoiceNumber({}));
          reset();
        });
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
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
        dispatch(AllRedux.deleteInvoice({ invoice_id: rid })).then((res) => {
          dispatch(AllRedux.invoiceList({}));
        });
      }
    });
  };

  const columns = [
    {
      header: "Invoice Number",
      accessorKey: "invoice_number",
      footer: "Invoice Number",
    },
    {
      header: "Date",
      accessorKey: "billing_date",
      footer: "Date",
    },
    {
      header: "First Name",
      accessorKey: "first_name",
      footer: "First Name",
    },
    {
      header: "Last Name",
      accessorKey: "last_name",
      footer: "Last Name",
    },
    {
      header: "Email",
      accessorKey: "email",
      footer: "Email",
    },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      footer: "Phone Number",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      footer: "Amount",
    },
    {
      header: "Tax",
      accessorKey: "tax",
      footer: "Tax",
    },
    {
      header: "Total Amount",
      accessorKey: "total_amount",
      footer: "Total Amount",
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

    // Set title
    doc.setFontSize(20);
    doc.text("Billing List", 14, 20);

    // Prepare table head
    const columnHeaders = columnsToExport.map((col) =>
      col.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );

    // Prepare table body
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

    doc.save("billing-list.pdf");
  };

  const exportCSVData = () => {
    if (!data || data.length === 0) {
      console.log("No data available to export");
      return [];
    }

    // Return data in an array of objects format
    return data.map((bill, index) => ({
      Id: index + 1,
      InvoiceNumber: bill.invoice_number,
      Date: bill.billing_date,
      FirstName: bill.first_name,
      LastName: bill.last_name,
      Email: bill.email,
      PhoneNumber: bill.phone_number,
      Amount: bill.amount,
      Tax: bill.tax,
      TotalAmount: bill.total_amount,
    }));
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

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);
  const exportPrint = useReactToPrint({
    contentRef: pdfref,
    documentTitle: "Billing-list",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  const sendDataToEmail = () => {
    try {
      const tableData = table.getRowModel().rows.map((row) => row.original);
      const billingData = {
        tableData: tableData,
        listName: "Billing",
      };
      if (billingData) {
        dispatch(
          AllRedux.sendBillingEmail({
            data: billingData,
          })
        ).then((res) => {
          SuccessAlert("Email Sent Successfully");
        });
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };

  if (InvoiceNumber === undefined) return <Loader />;

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

      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Billing</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active"> Billing</li>
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
                        <h4>Create New Bill</h4>
                      </div>
                      <div className="card-body">
                        <form
                          className="row g-3 needs-validation custom-input"
                          noValidate=""
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip01"
                            >
                              Invoice Number
                            </label>
                            <input
                              {...register("invoice")}
                              className="form-control"
                              id="validationTooltip01"
                              type="text"
                              placeholder="Number"
                              defaultValue={InvoiceNumber}
                              readOnly
                            />
                            <div className="invalid-feedback">
                              {errors.invoice?.message}
                            </div>
                          </div>
                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip01"
                            >
                              DOA Date
                            </label>
                            <input
                              {...register("doa")}
                              className="form-control"
                              id="validationTooltip01"
                              type="date"
                              required=""
                            />
                            <div className="invalid-feedback">
                              {errors.doa?.message}
                            </div>
                          </div>

                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip02"
                            >
                              First Name
                            </label>
                            <input
                              {...register("first_name")}
                              className="form-control"
                              id="validationTooltip02"
                              type="text"
                              placeholder="First Name"
                              required=""
                            />
                            <div className="invalid-feedback">
                              {errors.first_name?.message}
                            </div>
                          </div>
                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip02"
                            >
                              Last Name
                            </label>
                            <input
                              {...register("last_name")}
                              className="form-control"
                              id="validationTooltip02"
                              type="text"
                              placeholder="Last Name"
                              required=""
                            />
                            <div className="invalid-feedback">
                              {errors.last_name?.message}
                            </div>
                          </div>
                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Email
                            </label>
                            <div className="input-group has-validation">
                              <input
                                {...register("email")}
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                aria-describedby="validationTooltipUsernamePrepend"
                                placeholder="Email"
                              />
                              <div className="invalid-feedback">
                                {errors.email?.message}
                              </div>
                            </div>
                          </div>
                          {/* <div className="col-md-1 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Code
                            </label>
                            <div className="input-group has-validation">
                              <input
                                {...register("callingCountryCode")}
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                aria-describedby="validationTooltipUsernamePrepend"
                                placeholder="Code"
                              />
                              <div className="invalid-feedback">
                                {errors.callingCountryCode?.message}
                              </div>
                            </div>
                          </div> */}
                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Phone Number
                            </label>
                            <div className="input-group has-validation">
                              <input
                                {...register("localPhoneNumber")}
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                aria-describedby="validationTooltipUsernamePrepend"
                                placeholder="Number"
                              />
                              <div className="invalid-feedback">
                                {errors.localPhoneNumber?.message}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Amount
                            </label>
                            <div className="input-group has-validation">
                              <input
                                {...register("amount")}
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                aria-describedby="validationTooltipUsernamePrepend"
                                placeholder="Amount"
                              />
                              <div className="invalid-feedback">
                                {errors.amount?.message}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Tax in Percentage
                            </label>
                            <div className="input-group has-validation">
                              <input
                                {...register("tax")}
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                aria-describedby="validationTooltipUsernamePrepend"
                                placeholder="Tax "
                              />
                              <div className="invalid-feedback">
                                {errors.tax?.message}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltipUsername"
                            >
                              Total Amount
                            </label>
                            <div className="input-group has-validation">
                              <input
                                {...register("totalamount")}
                                className="form-control"
                                id="validationTooltipUsername"
                                type="text"
                                aria-describedby="validationTooltipUsernamePrepend"
                                placeholder="Total Amount"
                              />
                              <div className="invalid-feedback">
                                {errors.totalamount?.message}
                              </div>
                            </div>
                          </div>

                          <div className="container-fluid"></div>

                          <div className="col-12">
                            <button className="btn btn-primary" type="submit">
                              Create Invoice
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
                            <h4>Billing List</h4>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <div className="d-flex float-end mb-3 mt-3 ">
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
                            <h4>Billing List</h4>
                          </div>
                          <div className="card-body">
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
                                  {table?.getRowModel().rows.map((row) => (
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
                                            <li className="edit action-column">
                                              <Tooltip title="Edit">
                                                <Link
                                                  to={`/billing/${row.original.id}`}
                                                  onClick={() =>
                                                    sessionStorage.setItem(
                                                      "path",
                                                      "/billing"
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

                                          {getAccess.delete === 1 ? (
                                            <li className="delete action-column">
                                              <Tooltip title="Delete">
                                                <span
                                                  style={{ cursor: "pointer" }}
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
