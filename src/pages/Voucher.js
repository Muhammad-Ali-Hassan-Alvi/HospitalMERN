import React, { useEffect, useLayoutEffect, useState } from "react";
import Select from "react-select";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorAlert, SuccessAlert } from "../Common/Alert";
import Tooltiphome from "../Common/Tooltiphome";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader/Loader";

import {
  getAllProducts,
  getSingleProduct,
  getToken,
  order,
  orderList,
} from "../store/slice/billingSlice";
import { leadList } from "../store/slice/leadSlice";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

function Voucher() {
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const dispatch = useDispatch();
  const tempToken = useSelector(
    (state) => state?.billing?.getTokenData?.data?.data
  );
  const ProductList = useSelector(
    (state) => state?.billing?.getAllProductsData?.data?.data
  );
  const data = useSelector(
    (state) => state?.billing?.orderListData?.data?.data
  );

  const [quantity, setQuantity] = useState(null);

  useLayoutEffect(() => {
    dispatch(getToken({}));
    dispatch(leadList({}));
    dispatch(orderList({}));
  }, []);


  const CustomerList = useSelector(
    (state) => state.lead.leadDataListing.data.data
  );

  useEffect(() => {
    if (tempToken) {
      dispatch(getAllProducts({ token: tempToken }));
    }
  }, [tempToken]);

  const validationQualifying = Yup.object().shape({
    voucherAmount: Yup.string().required("Voucher's amount is required"),
    customerName: Yup.string().required("Customer's Name is required"),
    productName: Yup.string().required("Product selection required"),
  });

  const formOptions = { resolver: yupResolver(validationQualifying) };
  const { register, setValue, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = (data) => {
    try {
      if (data) {
        dispatch(
          order({
            token: tempToken,
            product_id: data?.productName,
            lead_id: data?.customerName,
            product_value: data?.voucherAmount,
            product_name: quantity?.name,
          })
        ).then((res) => {
          if (res?.payload?.code == 1) {
            SuccessAlert(res?.payload?.message);
            dispatch(orderList({}));
            reset();
          } else if (res?.payload?.code == 2) {
            ErrorAlert(res?.payload?.data?.errors[0]);
            reset();
          } else {
            ErrorAlert(res?.payload?.message);
            reset();
          }
        });
      }
    } catch (error) {
      console.log(error);
      ErrorAlert(error, "Something went wrong.");
    }
  };

  const loadScript = (src) => {
    return new Promise(function (resolve, reject) {
      let script = document.createElement("script");
      script.src = src;
      script.addEventListener("load", function () {
        resolve();
      });
      script.addEventListener("error", function (e) {
        reject(e);
      });
      document.body.appendChild(script);
      document.body.removeChild(script);
    });
  };

  useEffect(() => {
    loadScript(
      `${process.env.PUBLIC_URL +
      "/assets/js/datatable/datatables/jquery.dataTables.min.js"
      }`
    );
    setTimeout(() => {
      setTimeout(() => { }, 500);
      loadScript(
        `${process.env.PUBLIC_URL +
        "/assets/js/datatable/datatables/datatable.custom.js"
        }`
      );
    }, 200);
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
        if (element.module_name === "VOUCHER REQUEST") {
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
      header: "Purchase Number",
      accessorKey: "voucher_id",
      footer: "Purchase Number",
    },
    {
      header: "Client Name",
      accessorKey: "client_name",
      footer: "Client Name",
    },

    {
      header: "Voucher Name",
      accessorKey: "product_name",
      footer: "Voucher Name",
    },
    {
      header: "Amount",
      accessorKey: "cost",
      footer: "Amount",
    },

    {
      header: "Total Amount",
      accessorKey: "total_cost",
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

  const customerOptions = CustomerList?.map((item) => ({
    value: item?.id,
    label: `${item?.first_name} ${item?.last_name}`,
  }));
  const handleCustomerChange = (selectedOption) => {
    // Set the selected value in react-hook-form
    setValue("customerName", selectedOption?.value);
  };
  return (
    <>
      {isLoading && <Loader />}
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href={process.env.PUBLIC_URL + "/assets/css/vendors/datatables.css"}
        />
      </Helmet>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Voucher Request</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active">
                        Voucher Request
                      </li>
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
                        <h4>Create Voucher Request</h4>
                      </div>
                      <div className="card-body">
                        <form
                          className="row g-3 needs-validation custom-input"
                          noValidate=""
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div className="col-md-5 position-relative">
                            <label
                              className="form-label"
                              htmlFor="validationTooltip02"
                            >
                              Product List
                            </label>
                            <select
                              className="form-select"
                              id="validationTooltip04"
                              {...register("productName")}
                              onChange={(e) => {
                                dispatch(
                                  getSingleProduct({
                                    token: tempToken,
                                    product_id: e.target.value,
                                  })
                                ).then((res) => {
                                  if (res.payload.data) {
                                    setQuantity(res.payload.data);
                                  }
                                });
                              }}
                            >
                              <option selected="" disabled="" value="">
                                Choose...
                              </option>
                              {ProductList?.map((item, index) => {
                                return (
                                  <option key={index} value={item?.id}>
                                    {item?.name}{" "}
                                  </option>
                                );
                              })}
                            </select>
                            <div className="invalid-feedback">
                              {errors.productName?.message}
                            </div>
                          </div>
                          <div className="col-md-1 position-relative"></div>
                          <div className="col-md-5 position-relative">
                            <label
                              className="form-label"
                              htmlFor="customer-select"
                            >
                              Customer's Name
                            </label>
                            <Select
                              id="customer-select"
                              options={customerOptions}
                              {...register("customerName")}
                              classNamePrefix="select"
                              placeholder="Choose..."
                              onChange={handleCustomerChange}
                            />
                            <div className="invalid-feedback">
                              {errors.customerName?.message}
                            </div>
                          </div>
                          {quantity ? (
                            <>
                              {quantity?.denominationType === "Variable" ? (
                                <div className="col-md-5 position-relative">
                                  <label
                                    className="form-label"
                                    htmlFor="validationTooltip02"
                                  >
                                    Voucher Amount
                                  </label>
                                  <input
                                    {...register("voucherAmount")}
                                    className="form-control"
                                    id="validationTooltip02"
                                    type="text"
                                    placeholder="Amount"
                                    required=""
                                  />

                                  <div className="invalid-feedback">
                                    <p>Please select amount $25</p>
                                  </div>
                                  <div className="invalid-feedback">
                                    {errors.voucherAmount?.message}
                                  </div>
                                </div>
                              ) : (
                                <div className="col-md-5 position-relative">
                                  <label
                                    className="form-label"
                                    htmlFor="validationTooltip02"
                                  >
                                    Voucher Amount
                                  </label>
                                  <select
                                    className="form-select"
                                    id="validationTooltip04"
                                    {...register("voucherAmount")}
                                  >
                                    <option selected="" disabled="" value="">
                                      Choose...
                                    </option>
                                    {quantity?.denominations?.map(
                                      (item, index) => {
                                        return (
                                          <option key={index} value={item}>
                                            ${item}{" "}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                  <div className="invalid-feedback">
                                    {errors.voucherAmount?.message}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <></>
                          )}

                          <div className="col-md-12 position-relative"></div>
                          <div className="col-md-5 position-relative"></div>
                          <div className="col-2">
                            <button className="btn btn-primary" type="submit">
                              Voucher Request
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
            {getAccess.view === 1 ? (
              <>
                {data === undefined ? (
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card">
                          <div className="card-header">
                            <h4>Vouchers List</h4>
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

export default Voucher;
