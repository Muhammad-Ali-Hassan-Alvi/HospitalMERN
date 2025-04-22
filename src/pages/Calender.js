import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import moment from "moment";
import { Calendar, Modal, Tooltip } from "antd";
import "antd/dist/reset.css";
import Tooltiphome from "../Common/Tooltiphome";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import * as AllRedux from "../store/slice/subadminSlice";
import { calendar } from "../store/slice/admindataSlice";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

function Calender() {
  const [clickedEvent, setClickedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.subadmin.listingSubadminData.data.data
  );

  const events = useSelector((store) => store.admindata.calendarData.data.data);
  const formatEventDate = (dateString) =>
    moment(dateString).format("YYYY-MM-DD");

  const handleEventClick = (event) => {
    setClickedEvent(event); 
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false); 
  };


  const dateCellRender = (value) => {
    const dayEvents = events.filter(
      (event) => formatEventDate(event.from) === value.format("YYYY-MM-DD")
    );

    return dayEvents.length ? (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {dayEvents.map((event, index) => (
          
          <li key={index} style={{ marginBottom: "5px" }}>
          <>
          
          </>
            <Tooltip
              title={
                <div
                  style={{
                    maxWidth: "250px",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <div>
                    <strong>Title:</strong> {event.title}
                  </div>
                  <div>
                    <strong>From:</strong>{" "}
                    {moment(event.from).format("YYYY-MM-DD HH:mm")}
                  </div>
                  <div>
                    <strong>To:</strong>{" "}
                    {moment(event.to).format("YYYY-MM-DD HH:mm")}
                  </div>
                </div>
              }
              overlayInnerStyle={{
                backgroundColor: "white",
                color: "black",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <div
               onClick={() => handleEventClick(event)} 
                style={{
                  backgroundColor: event.color,
                  color: event.color == "#ADD8E6" ? "black" : "white",
                  borderRadius: "10px",
                  padding: "2px 6px",
                }}
              >
                {event.title}
              </div>
              
            </Tooltip>
          </li>
        ))}
      </ul>
    ) : null;
  };

  useEffect(() => {
    dispatch(AllRedux.SubadminListing({}));
    dispatch(calendar({}));
  }, []);

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      footer: "ID",
    },
    {
      header: "Subadmin name",
      accessorKey: "name",
      footer: "Subadmin name",
    },
    {
      header: "Subadmin email",
      accessorKey: "email",
      footer: "Subadmin email",
    },
    {
      header: "Designation",
      accessorKey: "designation",
      footer: "Designation",
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
        if (element.module_name === "CALENDAR") {
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
                    <h3>Calender Basic</h3>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">Calender</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {getAccess.view === 1 ? (
              <>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
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

                            {data === undefined ? (
                              <>
                                <h2 className="d-flex justify-content-center">
                                  {" "}
                                  No Data Found
                                </h2>
                              </>
                            ) : (
                              <>
                                <table className="table table-striped border">
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
                                          <th>Action</th>
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
                                            <li className="edit">
                                              <Tooltip title="Calender">
                                                <Link
                                                  onClick={() =>
                                                    dispatch(
                                                      calendar({
                                                        admin_id:
                                                          row.original.id,
                                                      })
                                                    )
                                                  }
                                                >
                                                  <i className="icon-calendar"></i>
                                                </Link>
                                              </Tooltip>
                                            </li>
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
                                          <th>Action</th>
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
                                      table.setPageIndex(
                                        table.getPageCount() - 1
                                      )
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
              </>
            ) : (
              <></>
            )}

            <div className="container-fluid">
              {events === undefined ? (
                <> </>
              ) : (
                  <Calendar cellRender={dateCellRender} fullscreen={true} />
              )}
            </div>
          </div>

          <Footer />
        </div>
      </div>
      {clickedEvent && (
        <Modal
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          bodyStyle={{ backgroundColor: "white", color: "black" }}
          centered
        >
          <div style={{ padding: "10px" }}>
            <div>
              <strong>Title:</strong> {clickedEvent.title}
            </div>
            <div>
              <strong>From:</strong>{" "}
              {moment(clickedEvent.from).format("YYYY-MM-DD HH:mm")}
            </div>
            <div>
              <strong>To:</strong>{" "}
              {moment(clickedEvent.to).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
        </Modal>
      )}

    </>
  );
}

export default Calender;
