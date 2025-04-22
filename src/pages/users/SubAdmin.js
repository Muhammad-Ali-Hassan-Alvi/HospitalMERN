import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Tooltiphome from "../../Common/Tooltiphome";
import { useDispatch, useSelector } from "react-redux";
import { ErrorAlert } from "../../Common/Alert";
import { Tooltip } from "@material-ui/core";
import * as AllRedux from "../../store/slice/subadminSlice";
import Loader from "../../components/loader/Loader";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Swal from "sweetalert2";

export default function SubAdmin() {
  const [adminDesignation, setAdminDesignation] = useState();
  const [useDegName, setDegName] = useState({ name: "", error: "" });
  const dispatch = useDispatch();
  const ModuleList = useSelector(
    (state) => state.subadmin.getModuleList.data.data
  );
  const [dataArray, getDataArray] = useState();
  useEffect(() => {
    if (ModuleList !== undefined) {
      getDataArray(ModuleList);
    }
  }, [ModuleList]);

  const isLoading = useSelector((state) => state.admindata.isLoading);

  const handleOnChange = (event, rightType, moduleId) => {
    const updatedModuleList = dataArray.map((item) => {
      if (item.id === moduleId) {
        const updatedRights = { ...item.rights };
        updatedRights[rightType] = event.target.checked ? 1 : 0;
        return {
          ...item,
          rights: updatedRights,
        };
      }
      return item;
    });

    getDataArray(updatedModuleList);
  };

  const validationSubAdmin = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name must be at most 30 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,30}$",
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

    designation: Yup.string().required("Designation is required"),
  });

  const formOptions = { resolver: yupResolver(validationSubAdmin) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;
  useEffect(() => {
    const updateRightsForModules = (modulesToUpdate, newRights) => {
      return updatedModuleList.map((item) => {
        if (modulesToUpdate.includes(item.module_name)) {
          return {
            ...item,
            rights: newRights,
          };
        }
        return item;
      });
    };
  
    let updatedModuleList = (dataArray || []).map((item) => ({
      ...item,
      rights: {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
    }));
  
    const fullAccessRights = {
      can_add: 1,
      can_update: 1,
      can_delete: 1,
      can_view: 1,
    };
  
    switch (adminDesignation) {
      case "QA":
        updatedModuleList = updateRightsForModules(["Q & A RECORDINGS"], fullAccessRights);
        break;
      case "Manager":
        updatedModuleList = updatedModuleList.map((item) => {
          if (item.module_name !== "BILLING") {
            return {
              ...item,
              rights: fullAccessRights,
            };
          }
          return item;
        });
        break;
      case "Supervisor":
        updatedModuleList = updateRightsForModules(
          ["MEDICAL FACILITY", "DASHBOARD", "CLIENT POTENTIAL", "ATTORNEY"],
          fullAccessRights
        );
        break;
      case "AS":
        updatedModuleList = updateRightsForModules(
          ["MEDICAL FACILITY", "CLIENT POTENTIAL", "ATTORNEY"],
          fullAccessRights
        );
        break;
      case "AGENT":
        updatedModuleList = updateRightsForModules(
          ["TRANS UBER", "CLIENT POTENTIAL", "CALENDAR", "TRANS LYFT"],
          fullAccessRights
        );
        break;
      case "G2G":
        updatedModuleList = updateRightsForModules(
          ["TRANS UBER", "BILLING", "VOUCHER REQUEST", "TRANS LYFT"],
          fullAccessRights
        );
        break;
      default:
        break;
    }
  
    getDataArray(updatedModuleList);
  }, [adminDesignation, dataArray]);
  
  
  

  const DataSubmit = (data) => {
    try {
      if (data) {
        data.ModuleRights = dataArray;
        data.DesignationName = useDegName.name;

        dispatch(
          AllRedux.AddSubadminData({
            name: data.name,
            email: data.email,
            designation: data.designation,
            ModuleRights: dataArray,
            other_designation: useDegName.name,
          })
        );

        reset();
        setDegName({ name: "", error: "" });
        dispatch(AllRedux.ModuleList({}));
      }
    } catch (error) {
      ErrorAlert(error);
    }
    dispatch(AllRedux.SubadminListing({}));
  };

  const [sorting, setsorting] = useState([]);
  const [filtering, setfiltering] = useState("");

  const data = useSelector(
    (state) => state.subadmin.listingSubadminData.data.data
  );
  

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
        dispatch(AllRedux.RemoveSubadmin({ subadmin_id: rid })).then(() => {
          dispatch(AllRedux.SubadminListing({}));
        });
      }
    });
  };

  useLayoutEffect(() => {
    dispatch(AllRedux.SubadminListing({}));
    dispatch(AllRedux.ModuleList({}));
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
                    <h4>Role Base Access</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">
                        {" "}
                        Role Base Access
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>Create New Sub Admin</h4>
                    </div>
                    <div className="card-body">
                      <form
                        className="row g-3 needs-validation custom-input"
                        noValidate=""
                        onSubmit={handleSubmit(DataSubmit)}
                      >
                      <div className="container-fluid"></div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Sub Admin Designation
                          </label>
                          <select
                            className="form-select"
                            {...register("designation")}
                            id="validationTooltip04"
                            required=""
                            onChange={(e) => {
                              setAdminDesignation(e.target.value);
                            }}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option value="Manager">Manager</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="AS">AS</option>
                            <option value="QA">QA</option>
                            <option value="AGENT">AGENT</option>
                            <option value="G2G">G2G</option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.designation?.message}
                          </div>
                        </div>
                        <div className="col-md-8 position-relative">
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Sub Admin Name
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Name"
                            required=""
                            {...register("name")}
                          />
                          <div className="invalid-feedback">
                            {errors.name?.message}
                          </div>
                        </div>
                        <div className="col-md-6 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip02"
                          >
                            Sub Admin Email
                          </label>
                          <input
                            className="form-control"
                            id="validationTooltip02"
                            type="text"
                            placeholder="Email"
                            required=""
                            {...register("email")}
                          />
                          <div className="invalid-feedback">
                            {errors.email?.message}
                          </div>
                        </div>

                        <label
                          className="form-label"
                          htmlFor="validationTooltip04"
                        >
                          <h4>Sub Admin Rights</h4>
                        </label>
                        {dataArray?.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="col-md-12 position-relative"
                            >
                              <div className="row">
                                <div className="col-md-3">
                                  <label
                                    className="form-label"
                                    htmlFor="validationTooltip04"
                                  >
                                    {item.module_name}
                                  </label>
                                </div>

                                <div className="col-md-2">
                                  <div className="form-check">
                                  <input
                                  className="form-check-input"
                                      id="flexCheckDefault"
                                  type="checkbox"
                                  checked={item.rights.can_add === 1}
                                  onChange={(e) => handleOnChange(e, "can_add", item.id)}
                                  defaultChecked={item.rights.can_add}

                                />

                                    <label
                                      className="form-check-label"
                                      htmlFor="flexCheckDefault"
                                    >
                                      Add
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-check">
                                  <input
                                   className="form-check-input"
                                      id="flexCheckDefault"
                                  type="checkbox"
                                  checked={item.rights.can_update === 1}
                                  onChange={(e) => handleOnChange(e, "can_update", item.id)}
                                  defaultChecked={item.rights.can_update}
                                />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexCheckDefault"
                                    >
                                      Update
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      id="flexCheckDefault"
                                      type="checkbox"
                                      checked={item.rights.can_delete === 1}
                                      defaultChecked={item.rights.can_delete}
                                      onChange={(e) => handleOnChange(e, "can_delete", item.id)}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexCheckDefault"
                                    >
                                      Delete
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      id="flexCheckDefault"
                                      type="checkbox"
                                      checked={item.rights.can_view === 1}
                                      onChange={(event) => {
                                        handleOnChange(
                                          event,
                                          "can_view",
                                          item.id
                                        );
                                      }}
                                      defaultChecked={item.rights.can_view}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexCheckDefault"
                                    >
                                      View
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div className="col-12">
                          <button className="btn btn-primary" type="submit">
                            Add Sub Admin
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {data === undefined ? (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>Sub Admin List</h4>
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
                        <h4>Sub Admin List</h4>
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

                          <table className="table table-striped border">
                            <thead>
                              {table.getHeaderGroups().map((headerGroup) => (
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
                                        <Tooltip title="Edit">
                                          <Link
                                            to={`/sub-admin/${row.original.id}`}
                                            onClick={() =>
                                              sessionStorage.setItem(
                                                "path",
                                                "/sub-admin"
                                              )
                                            }
                                          >
                                            <i className="icon-pencil-alt"></i>
                                          </Link>
                                        </Tooltip>
                                      </li>
                                      <li className="delete">
                                        <Tooltip title="Delete">
                                          <span
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              removeLeadItem(row.original.id)
                                            }
                                          >
                                            <i className="icon-trash"></i>
                                          </span>
                                        </Tooltip>
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              {table.getFooterGroups().map((footerGroup) => (
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
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}




// {adminDesignation === "Other" ? (
//   <div className="col-md-5 position-relative">
//     <label
//       className="form-label"
//       htmlFor="validationTooltip01"
//     >
//       Sub Admin Designation Name
//     </label>
//     <input
//       className="form-control"
//       id="validationTooltip01"
//       type="text"
//       onChange={(e) =>
//         setDegName({
//           name: e.target.value,
//           error: e.target.validationMessage,
//         })
//       }
//       placeholder="Designation Name"
//       required="Designation name is required"
//       value={useDegName.name}
//       pattern="[A-Z a-z]{2,20}"
//     />

//     <div className="invalid-feedback d-block">
//       {useDegName.error}
//       {/* "Please use only alphabets" */}
//     </div>
//   </div>
// ) : (
//   <></>
// )}