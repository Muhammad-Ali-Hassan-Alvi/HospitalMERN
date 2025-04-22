import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Tooltiphome from "../Common/Tooltiphome";
import * as AllRedux from "../store/slice/medicalFacilitySlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
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
import axios from "axios";

export default function Qa() {
  const dispatch = useDispatch();
  const [RecordData, setRecordData] = useState("");
  const isLoading = useSelector((state) => state.admindata.isLoading);

  const data = useSelector(
    (state) => state.medicalfacility.getCallDataList.data.data
  );

  useLayoutEffect(() => {
    dispatch(AllRedux.getCallData({}));
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
        if (element.module_name === "Q & A RECORDINGS") {
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
      header: "Client Name",
      accessorKey: "name",
      footer: "Client Name",
    },
    {
      header: "Role",
      accessorKey: "role",
      footer: "Role",
    },
    {
      header: "Number",
      accessorKey: "number",
      footer: "Number",
    },
    {
      header: "Date",
      accessorKey: "insertdate",
      footer: "Date",
    },
    {
      header: "Called By",
      accessorKey: "called_by",
      footer: "Called By",
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

  const playAPI = (link) => {
    axios({
      method: "post",
      url: "https://ihcms.hyperlinkdevteam.link:8291/api/v1/admin/get_recording",
      headers: {
        "api-key": process.env.REACT_APP_API_KEY_ENC,
        "Content-Type": process.env.REACT_APP_API_CONT_TYPE,
      },
      data: {
        recording_link: link,
      },
    }).then((res) => {
      //
      if (res.data) {
        setRecordData(res.data);
      }
    });
  };
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
                    <h4>Q&A List</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active"> Q&A List</li>
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
                            <h2 className="d-flex justify-content-center">
                              {" "}
                              No Data Found
                            </h2>
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
                                        <th>Audio</th>
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
                                      {/* {} */}
                                      <td>
                                        <audio controls>
                                          <source
                                            src={row?.original?.recording_link}
                                            type="audio/mpeg"
                                          />
                                          Your browser does not support the
                                          audio element.
                                        </audio>
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
                                        <th>Audio</th>
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
