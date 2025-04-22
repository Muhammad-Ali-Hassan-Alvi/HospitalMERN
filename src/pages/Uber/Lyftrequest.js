import React, { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorAlert } from "../../Common/Alert";
import Tooltiphome from "../../Common/Tooltiphome";
import Loader from "../../components/loader/Loader";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Sorting,
  getFilteredRowModel,
} from "@tanstack/react-table";
import * as AllAPI from "../../store/slice/leadSlice";
import { useSelector, useDispatch } from "react-redux";

export default function Lyftrequest() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const data = useSelector((state) => state.lead.leadDataListing.data.data);
  function openInNewTab(url) {
    window.open(url, "_blank");
  }
  // const [data, setData] = useState([]);
  

  useEffect(() => {
    dispatch(AllAPI.leadList({}));
  }, []);

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
    {
      header: "Address",
      accessorKey: "address1",
      footer: "Address",
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

  const validationQualifying = Yup.object().shape({
    destination: Yup.string()
      .required("Designation is required")
      .min(2, "Designation must be at least 2 characters")
      // .max(20, "Designation must be at most 20 characters")
      
  });

  const formOptions = { resolver: yupResolver(validationQualifying) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  

  const onSubmit = (data) => {
    try {
      if (data) {
        // 
        openInNewTab("https://www.lyft.com");
        reset();
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };

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
        if (element.module_name === "LYFT REQUEST") {
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
                    <h4>Lyft Request</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active"> Lyft Request</li>
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
                        <h4>Create Lyft Request</h4>
                      </div>
                      {getAccess.view === 1 ? (
                        <div className="container">
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
                              <table className="table table-striped border">
                                <thead>
                                  {table
                                    .getHeaderGroups()
                                    .map((headerGroup) => (
                                      <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                          <th
                                            key={header.id}
                                            onClick={header.column.getToggleGroupingHandler()}
                                          >
                                            {flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                            )}
                                          </th>
                                        ))}
                                        {/* <th>Action</th> */}
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
                                        {/* <th>Action</th> */}
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
                      ) : (
                        <></>
                      )}
                      <div className="card-body">
                        <form
                          className="row g-3 needs-validation custom-input"
                          noValidate=""
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div className="col-md-4 position-relative"></div>
                          <div className="col-md-4 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip02"
                            >
                              Destination Location
                            </label>
                            <input
                              {...register("destination")}
                              className="form-control"
                              id="validationTooltip02"
                              type="text"
                              placeholder="Destination"
                              required=""
                            />
                            <div className="invalid-feedback">
                              {errors.destination?.message}
                            </div>
                          </div>
                          <div className="col-md-12 position-relative"></div>
                          <div className="col-md-5 position-relative"></div>
                          <div className="col-2">
                            <button className="btn btn-primary" type="submit">
                              Add Request
                            </button>
                          </div>
                          <div className="col-md-5 position-relative"></div>
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
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
