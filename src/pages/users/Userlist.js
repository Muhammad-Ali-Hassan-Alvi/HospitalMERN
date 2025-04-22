import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Tooltiphome from "../../Common/Tooltiphome";
import * as AllRedux from "../../store/slice/leadSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import { Tooltip } from "@material-ui/core";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import { ErrorAlert, SuccessAlert } from "../../Common/Alert";
import "jspdf-autotable";
import EmailModal from "./EmailModal";
export default function Userlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pdfref = useRef(null);
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const data = useSelector((state) => state.lead.leadDataListingByDisposition.data.data);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    firstName: false,
    lastName: false,
    disposition: false,
  });
  const [selectedRows, setSelectedRows] = useState([]);
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
    dispatch(AllRedux.leadListByDisposition({}));
  }, []);

  const LoginType = useSelector((state) => state.admindata.adminData.data.role);

  const LoginData = useSelector(
    (state) => state.admindata.adminData.data.rights
  );

  const [getAccess, setAccess] = useState({
    add: "",
    update: "",
    view: "",
    delete: "",
  });

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



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const exportToPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");
  
  // Set the title
  doc.setFontSize(20);
  doc.text("Client List - Page " + (table.getState().pagination.pageIndex + 1), 14, 22);
  
  // Prepare the data for the table
  const currentPageRows = table.getRowModel().rows; // Get current page rows
  const tableData = currentPageRows.map((row) => [
      row.original.id, // ID
      row.original.first_name, // First Name
      row.original.last_name, // Last Name
      row.original.disposition // Disposition
  ]);

  // Define the columns
  const columns = [
      { header: "ID", dataKey: "id" },
      { header: "First Name", dataKey: "first_name" },
      { header: "Last Name", dataKey: "last_name" },
      { header: "Disposition", dataKey: "disposition" }
  ];

  // Add the table to the PDF
  doc.autoTable({
      head: [columns.map(col => col.header)],
      body: tableData,
      startY: 30, // Start below the title
      theme: 'grid', // Optional: you can change the theme
      headStyles: {
          fillColor: [40, 127, 186], // Header background color (RGB format)
          textColor: [255, 255, 255], // Header text color (white)
          fontSize: 12, // Optional: set font size for header
      },
      styles: {
          cellPadding: 5, // Padding for cells
          fontSize: 10, // Font size for body text
          overflow: 'linebreak', // Handle text overflow
          halign: 'left', // Horizontal alignment
          valign: 'middle', // Vertical alignment
      },
      alternateRowStyles: {
          fillColor: [240, 240, 240], // Alternate row background color (light gray)
      },
  });

  // Save the PDF
  doc.save("Client-list-page-" + (table.getState().pagination.pageIndex + 1) + ".pdf");
};


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const exportCSVData = () => {
    if (!data || data.length === 0) {
      console.log("No data available to export");
      return [];
    }

    return data.map((client, index) => ({
      Id: index + 1,
      FirstName: client.first_name,
      LastName: client.last_name,
      Disposition: client.disposition,
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
    documentTitle: "Client-list",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });
  const sendDataToEmail = () => {
    try {
      const tableData = table.getRowModel().rows.map((row) => 
        row.original
      );
      const clientListingData = {
        tableData : tableData,
        listName  : "Client"
      }
      if (clientListingData) {
        dispatch(
          AllRedux.sendClinetListsEmail({
           data : clientListingData
          })
        ).then((res) => {
          SuccessAlert("Email Sent Successfully")
        });
      }else{
        ErrorAlert("Something went wrong.");
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }

  
  
    
  }
  const handleOpenEmailModal = () => {
    setEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    setEmailModalOpen(false);
    setSelectedRows([]); // Reset selected rows when closing
    setSelectedFields({
      firstName: false,
      lastName: false,
      disposition: false,
    }); // Reset selected fields when closing
  };


  return (
    <>
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
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />

          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Client List</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active"> Client List</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {getAccess.view === 1 ? (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="table-responsive">
                          <button
                            className="btn btn-success me-3"
                            onClick={exportToPDF}
                          >
                            Download PDF
                          </button>
                          <button className="btn btn-info me-3">
                            <CSVLink
                              data={exportCSVData()}
                              filename="Client-list.csv"
                              className="text-dark"
                              target="_blank"
                            >
                              Download CSV 
                            </CSVLink>
                          </button>
                          <button
                            className="btn btn-primary me-3"
                            onClick={exportPrint}
                          >
                            Print
                          </button>
                          

                          <button
        className="btn btn-secondary me-3"
        onClick={handleOpenEmailModal}
      >
        Send Email
      </button>

      <EmailModal
        open={emailModalOpen}
        onClose={handleCloseEmailModal}
        data={data}
        selectedFields={selectedFields}
        setSelectedFields={setSelectedFields}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onSend={sendDataToEmail}
      />






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
                                        <th className="action-column ">Action</th>
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
                                        <th className="action-column">Action</th>
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
