import React, { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Tooltiphome from "../../Common/Tooltiphome";
import { useDispatch, useSelector } from "react-redux";
import { ErrorAlert } from "../../Common/Alert";
import * as AllRedux from "../../store/slice/subadminSlice";
import Loader from "../../components/loader/Loader";

export default function SubAdminID() {
  const permissionsByDesignation = {
    Manager: {
      BILLING: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "CLIENT POTENTIAL": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      "ARCHIVE" :{
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      "MEDICAL FACILITY": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      ATTORNEY: { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      DASHBOARD: { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "CLIENT ACTIVE": { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      CALENDAR: { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "TRANS UBER": { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "TRANS LYFT": { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "VOUCHER REQUEST": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      "Q & A RECORDINGS": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
    },
    QA: {
      BILLING: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      ARCHIVE: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },

      "CLIENT POTENTIAL": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      "MEDICAL FACILITY": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      ATTORNEY: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      DASHBOARD: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "CLIENT ACTIVE": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      CALENDAR: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "TRANS UBER": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "TRANS LYFT": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "VOUCHER REQUEST": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      "Q & A RECORDINGS": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
    },
    Supervisor: {
      BILLING: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      ARCHIVE: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },

      "CLIENT POTENTIAL": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      "MEDICAL FACILITY": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      ATTORNEY: { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      DASHBOARD: { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "CLIENT ACTIVE": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      CALENDAR: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "TRANS UBER": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "TRANS LYFT": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "VOUCHER REQUEST": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      "Q & A RECORDINGS": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
    },
    AS: {
      BILLING: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      ARCHIVE: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },

      "CLIENT POTENTIAL": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      "MEDICAL FACILITY": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      ATTORNEY: { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      DASHBOARD: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "CLIENT ACTIVE": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      CALENDAR: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "TRANS UBER": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "TRANS LYFT": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "VOUCHER REQUEST": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      "Q & A RECORDINGS": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
    },
    AGENT: {
      BILLING: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      ARCHIVE: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },

      "CLIENT POTENTIAL": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      "MEDICAL FACILITY": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      ATTORNEY: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      DASHBOARD: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "CLIENT ACTIVE": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      CALENDAR: { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "TRANS UBER": { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "TRANS LYFT": { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "VOUCHER REQUEST": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      "Q & A RECORDINGS": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
    },
    G2G: {
      BILLING: { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      ARCHIVE: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },

      "CLIENT POTENTIAL": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      "MEDICAL FACILITY": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
      ATTORNEY: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      DASHBOARD: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "CLIENT ACTIVE": { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      CALENDAR: { can_add: 0, can_update: 0, can_delete: 0, can_view: 0 },
      "TRANS UBER": { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "TRANS LYFT": { can_add: 1, can_update: 1, can_delete: 1, can_view: 1 },
      "VOUCHER REQUEST": {
        can_add: 1,
        can_update: 1,
        can_delete: 1,
        can_view: 1,
      },
      "Q & A RECORDINGS": {
        can_add: 0,
        can_update: 0,
        can_delete: 0,
        can_view: 0,
      },
    },
    Other: {},
  };

  const navigate = useNavigate();
  const [adminDesignation, setAdminDesignation] = useState();
  const [dataArray, getDataArray] = useState();
  const isLoading = useSelector((state) => state.admindata.isLoading);

  const { id } = useParams();

  const [useDegName, setDegName] = useState({ name: "", error: "" });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(AllRedux.SubadminDataID({ subadmin_id: id }));
    return () => dispatch(AllRedux.setSubadminID());
  }, [id]);

  const SubAdminIDData = useSelector(
    (state) => state.subadmin.getSubadminDataID.data.data
  );

  const handleOnChange = (moduleId, rightType) => {
    getDataArray((prevData) =>
      prevData.map((item) =>
        item.id === moduleId
          ? { ...item, [rightType]: item[rightType] ? 0 : 1 }
          : item
      )
    );
  };
  useEffect(() => {
    if (adminDesignation) {
      const designationPermissions =
        permissionsByDesignation[adminDesignation] || {};

      getDataArray((prevData) =>
        prevData.map((item) => {
          const modulePermissions = designationPermissions[
            item.module_name
          ] || {
            can_add: 0,
            can_update: 0,
            can_delete: 0,
            can_view: 0,
          };

          return {
            ...item,
            can_add: modulePermissions.can_add || 0,
            can_update: modulePermissions.can_update || 0,
            can_delete: modulePermissions.can_delete || 0,
            can_view: modulePermissions.can_view || 0,
          };
        })
      );
    }
  }, [adminDesignation]);

  useEffect(() => {
    if (SubAdminIDData !== undefined) {
      setAdminDesignation(SubAdminIDData.subadminData.designation);
      getDataArray(SubAdminIDData?.moduleRights);
    }
    if (SubAdminIDData?.subadminData?.other_designation !== "") {
      setDegName({
        ...useDegName,
        name: SubAdminIDData?.subadminData?.other_designation,
      });
    }
  }, [SubAdminIDData]);

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

  const DataSubmit = (data) => {
    try {
      if (data) {
        data.ModuleRights = dataArray;
        data.DesignationName = useDegName.name;

        dispatch(
          AllRedux.EditSubadminData({
            subadmin_id: id,
            name: data.name,
            email: data.email,
            designation: data.designation,
            ModuleRights: dataArray,
            other_designation: useDegName.name,
          })
        );
        reset();
        setDegName({ name: "", error: "" });
        navigate("/sub-admin");
      }
    } catch (error) {
      ErrorAlert(error);
    }
  };

  if (SubAdminIDData === undefined) return <Loader />;

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
            {/* Container-fluid starts*/}

            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4>Edit Sub Admin</h4>
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
                        <div className="col-md-8 position-relative"></div>
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
                            defaultValue={SubAdminIDData?.subadminData?.name}
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
                            defaultValue={SubAdminIDData?.subadminData?.email}
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
                        {dataArray?.map((item, index) => (
                          <div
                            key={index}
                            className="col-md-12 position-relative"
                          >
                            <div className="row">
                              <div className="col-md-3">
                                <label
                                  className="form-label"
                                  htmlFor={`module_${item.id}`}
                                >
                                  {item.module_name}
                                </label>
                              </div>
                              <div className="col-md-2">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id={`module_${item.id}_add`}
                                    type="checkbox"
                                    checked={item.can_add === 1}
                                    onChange={() =>
                                      handleOnChange(item.id, "can_add")
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`module_${item.id}_add`}
                                  >
                                    Add
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id={`module_${item.id}_update`}
                                    type="checkbox"
                                    checked={item.can_update === 1}
                                    onChange={() =>
                                      handleOnChange(item.id, "can_update")
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`module_${item.id}_update`}
                                  >
                                    Update
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id={`module_${item.id}_delete`}
                                    type="checkbox"
                                    checked={item.can_delete === 1}
                                    onChange={() =>
                                      handleOnChange(item.id, "can_delete")
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`module_${item.id}_delete`}
                                  >
                                    Delete
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    id={`module_${item.id}_view`}
                                    type="checkbox"
                                    checked={item.can_view === 1}
                                    onChange={() =>
                                      handleOnChange(item.id, "can_view")
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`module_${item.id}_view`}
                                  >
                                    View
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {adminDesignation === "Other" ||
                        adminDesignation === "other" ? (
                          <div className="col-md-5 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip01"
                            >
                              Sub Admin Designation Name
                            </label>
                            <input
                              className="form-control"
                              id="validationTooltip01"
                              type="text"
                              onChange={(e) =>
                                setDegName({
                                  name: e.target.value,
                                  error: e.target.validationMessage,
                                })
                              }
                              placeholder="Designation Name"
                              required="Designation name is required"
                              defaultValue={
                                SubAdminIDData?.subadminData?.other_designation
                                  ? SubAdminIDData?.subadminData
                                      ?.other_designation
                                  : useDegName.name
                              }
                              pattern="[A-Z a-z]{2,20}"
                            />

                            <div className="invalid-feedback d-block">
                              {useDegName.error}
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}

                        <div className="col-12">
                          <button className="btn btn-primary" type="submit">
                            Edit Sub Admin
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Container-fluid Ends*/}
            {/* {data === undefined ? (
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
                                <tr key={headerGroup.id}>
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
                                        <Link
                                          to={`/sub-admin/${row.original.id}`}
                                        >
                                          <i className="icon-pencil-alt"></i>
                                        </Link>
                                      </li>
                                      <li className="delete">
                                        <span
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            removeLeadItem(row.original.id)
                                          }
                                        >
                                          <i className="icon-trash"></i>
                                        </span>
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
                          {useLoading === true ? (
                            <div
                              style={{
                                position: "fixed",
                                left: "50%",
                                top: "54%",
                                zIndex: "9999",
                                transform: "translate(-70%,-70%)",
                              }}
                            >
                              <ThreeCircles
                                height="40"
                                width="40"
                                color="#7366ff"
                                wrapperStyle={{}}
                                wrapperclassName=""
                                visible={true}
                                ariaLabel="three-circles-rotating"
                                outerCircleColor=""
                                innerCircleColor=""
                                middleCircleColor=""
                              />
                            </div>
                          ) : (
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
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
