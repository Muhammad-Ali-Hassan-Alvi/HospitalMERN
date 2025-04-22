import React, { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Tooltiphome from "../Common/Tooltiphome";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import * as AllRedux from "../store/slice/admindataSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const [getFilter, setFilter] = useState("");

  const DashData = useSelector((state) => state.admindata);

  useEffect(() => {
    dispatch(AllRedux.dashboard({ filter: getFilter }));
  }, [dispatch, getFilter]);

  const LoginType = useSelector((state) => state.admindata);

  const LoginData = useSelector((state) => state.admindata);
  

  const [getAccess, setAccess] = useState({
    add: "",
    update: "",
    view: "",
    delete: "",
  });
 
  useEffect(() => {
    if (
      LoginData?.adminData?.data?.rights !== undefined &&
      LoginType?.adminData?.data?.role === "Sub Admin"
    ) {
      for (const element of LoginData?.adminData?.data?.rights) {
        if (element.module_name === "DASHBOARD") {
          setAccess({
            add: element.can_add,
            update: element.can_update,
            view: element.can_view,
            delete: element.can_delete,
          });
        }
      }
    } else if (LoginType?.adminData?.data?.role === "Admin") {
      setAccess({
        add: 1,
        update: 1,
        view: 1,
        delete: 1,
      });
    }
  }, [LoginData, LoginType?.adminData?.data?.role]);

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
          {/* {getAccess.view === 1 ?} */}
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Complaint Management System</h4>
                  </div>{" "}
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      {/* <li className="breadcrumb-item active">Dashboard</li> */}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {getAccess.view === 1 ? (
              <>
                <div className="container-fluid mb-3">
                  <div className="row">
                    <div className="col-sm-12">
                      {/* <div className="card"> */}
                      <div className="card-body" style={{ cursor: "pointer" }}>
                        <div className="col-md-2 position-relative float-end">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip04"
                          >
                            Filter Details
                          </label>
                          <select
                            className="form-select"
                            id="validationTooltip04"
                            onChange={(e) => setFilter(e.target.value)}
                          >
                            <option selected="" disabled="" value="">
                              Choose...
                            </option>
                            <option value={"Daily"}>Daily </option>
                            <option value={"Weekly"}>Weekly </option>
                            <option value={"Monthly"}>Monthly </option>
                            <option value={"Yearly"}>Yearly </option>
                          </select>
                          <div className="invalid-tooltip">
                            Please select a valid state.
                          </div>
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container-fluid">
                  <div className="row widget-grid">
                    <div className="col-xxl-auto col-xl-3 col-sm-6 box-col-6">
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card widget-1">
                            <div
                              className="card-body"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="widget-content">
                                <div className="widget-round secondary">
                                  <div className="bg-round">
                                    <svg className="svg-fill">
                                      <use
                                        href={
                                          process.env.PUBLIC_URL +
                                          "/assets/svg/icon-sprite.svg#customers"
                                        }
                                      >
                                        {" "}
                                      </use>
                                    </svg>
                                    <svg className="half-circle svg-fill">
                                      <use
                                        href={
                                          process.env.PUBLIC_URL +
                                          "/assets/svg/icon-sprite.svg#halfcircle"
                                        }
                                      ></use>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h4>
                                    {
                                      DashData?.dashBoardAdmin?.data?.data
                                        ?.total_customers
                                    }
                                  </h4>
                                  <span className="f-light">
                                    Total Customers
                                  </span>
                                </div>
                              </div>
                              {/* <div className="font-secondary f-w-500"><i className="icon-arrow-up icon-rotate me-1"></i><span>+50%</span></div> */}
                            </div>
                          </div>
                          <div className="col-xl-12">
                            <div className="card widget-1">
                              <div
                                className="card-body"
                                style={{ cursor: "pointer" }}
                              >
                                <div className="widget-content">
                                  <div className="widget-round primary">
                                    <div className="bg-round">
                                      <svg className="svg-fill">
                                        <use
                                          href={
                                            process.env.PUBLIC_URL +
                                            "/assets/svg/icon-sprite.svg#medical"
                                          }
                                        >
                                          {" "}
                                        </use>
                                      </svg>
                                      <svg className="half-circle svg-fill">
                                        <use
                                          href={
                                            process.env.PUBLIC_URL +
                                            "/assets/svg/icon-sprite.svg#halfcircle"
                                          }
                                        ></use>
                                      </svg>
                                    </div>
                                  </div>
                                  <div>
                                    <h4>
                                      {
                                        DashData?.dashBoardAdmin?.data?.data
                                          ?.total_medical_facilities
                                      }
                                    </h4>
                                    <span className="f-light">
                                      Total Medical Facilities
                                    </span>
                                  </div>
                                </div>
                                {/* <div className="font-primary f-w-500"><i className="icon-arrow-up icon-rotate me-1"></i><span>+70%</span></div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-auto col-xl-3 col-sm-6 box-col-6">
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card widget-1">
                            <div
                              className="card-body"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="widget-content">
                                <div className="widget-round warning">
                                  <div className="bg-round">
                                    <svg className="svg-fill">
                                      <use
                                        href={
                                          process.env.PUBLIC_URL +
                                          "/assets/svg/icon-sprite.svg#user-visitor"
                                        }
                                      >
                                        {" "}
                                      </use>
                                    </svg>
                                    <svg className="half-circle svg-fill">
                                      <use
                                        href={
                                          process.env.PUBLIC_URL +
                                          "/assets/svg/icon-sprite.svg#halfcircle"
                                        }
                                      ></use>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h4>
                                    {
                                      DashData?.dashBoardAdmin?.data?.data
                                        ?.total_attorneys
                                    }
                                  </h4>
                                  <span className="f-light">
                                    Total Attorneys
                                  </span>
                                </div>
                              </div>
                              {/* <div className="font-warning f-w-500"><i className="icon-arrow-down icon-rotate me-1"></i><span>-20%</span></div> */}
                            </div>
                          </div>
                          <div className="col-xl-12">
                            <div className="card widget-1">
                              <div
                                className="card-body"
                                style={{ cursor: "pointer" }}
                              >
                                <div className="widget-content">
                                  <div className="widget-round success">
                                    <div className="bg-round">
                                      <svg className="svg-fill">
                                        <use
                                          href={
                                            process.env.PUBLIC_URL +
                                            "/assets/svg/icon-sprite.svg#user-visitor"
                                          }
                                        >
                                          {" "}
                                        </use>
                                      </svg>
                                      <svg className="half-circle svg-fill">
                                        <use
                                          href={
                                            process.env.PUBLIC_URL +
                                            "/assets/svg/icon-sprite.svg#halfcircle"
                                          }
                                        ></use>
                                      </svg>
                                    </div>
                                  </div>
                                  <div>
                                    <h4>
                                      {
                                        DashData?.dashBoardAdmin?.data?.data
                                          ?.total_sub_admins
                                      }
                                    </h4>
                                    <span className="f-light">
                                      Total Sub Admins
                                    </span>
                                  </div>
                                </div>
                                {/* <div className="font-success f-w-500"><i className="icon-arrow-up icon-rotate me-1"></i><span>+70%</span></div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-auto col-xl-3 col-sm-6 box-col-6">
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card widget-1">
                            <div
                              className="card-body"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="widget-content">
                                <div className="widget-round secondary">
                                  <div className="bg-round">
                                    <svg className="svg-fill">
                                      <use
                                        href={
                                          process.env.PUBLIC_URL +
                                          "/assets/svg/icon-sprite.svg#phone"
                                        }
                                      >
                                        {" "}
                                      </use>
                                    </svg>
                                    <svg className="half-circle svg-fill">
                                      <use
                                        href={
                                          process.env.PUBLIC_URL +
                                          "/assets/svg/icon-sprite.svg#halfcircle"
                                        }
                                      ></use>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h4>
                                    {
                                      DashData?.dashBoardAdmin?.data?.data
                                        ?.total_calls
                                    }
                                  </h4>
                                  <span className="f-light">Total Calls</span>
                                </div>
                              </div>
                              {/* <div className="font-secondary f-w-500"><i className="icon-arrow-up icon-rotate me-1"></i><span>+50%</span></div> */}
                            </div>
                          </div>
                          <div className="col-xl-12">
                            <div className="card widget-1">
                              <div
                                className="card-body"
                                style={{ cursor: "pointer" }}
                              >
                                <div className="widget-content">
                                  <div className="widget-round primary">
                                    <div className="bg-round">
                                      <svg className="svg-fill">
                                        <use
                                          href={
                                            process.env.PUBLIC_URL +
                                            "/assets/svg/icon-sprite.svg#uber"
                                          }
                                        >
                                          {" "}
                                        </use>
                                      </svg>
                                      <svg className="half-circle svg-fill">
                                        <use
                                          href={
                                            process.env.PUBLIC_URL +
                                            "/assets/svg/icon-sprite.svg#halfcircle"
                                          }
                                        ></use>
                                      </svg>
                                    </div>
                                  </div>
                                  <div>
                                    <h4>
                                      {
                                        DashData?.dashBoardAdmin?.data?.data
                                          ?.total_uber_bookings
                                      }
                                    </h4>
                                    <span className="f-light">
                                      Total Uber Bookings
                                    </span>
                                  </div>
                                </div>
                                {/* <div className="font-primary f-w-500"><i className="icon-arrow-up icon-rotate me-1"></i><span>+70%</span></div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-auto col-xl-3 col-sm-6 box-col-6">
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card widget-1">
                            <div
                              className="card-body"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="widget-content">
                                <div className="widget-round warning">
                                  <div className="bg-round">
                                    <svg className="svg-fill">
                                      <use
                                        href={
                                          process.env.PUBLIC_URL +
                                          "/assets/svg/icon-sprite.svg#lyft"
                                        }
                                      >
                                        {" "}
                                      </use>
                                    </svg>
                                    <svg className="half-circle svg-fill">
                                      <use
                                        href={
                                          process.env.PUBLIC_URL +
                                          "/assets/svg/icon-sprite.svg#halfcircle"
                                        }
                                      ></use>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h4>
                                    {
                                      DashData?.dashBoardAdmin?.data?.data
                                        ?.total_lyft_bookings
                                    }
                                  </h4>
                                  <span className="f-light">
                                    Total Lyft Bookings
                                  </span>
                                </div>
                              </div>
                              {/* <div className="font-warning f-w-500"><i className="icon-arrow-down icon-rotate me-1"></i><span>-20%</span></div> */}
                            </div>
                          </div>
                          <div className="col-xl-12">
                            <div className="card widget-1">
                              <div
                                className="card-body"
                                style={{ cursor: "pointer" }}
                              >
                                <div className="widget-content">
                                  <div className="widget-round success">
                                    <div className="bg-round">
                                      <svg className="svg-fill">
                                        <use
                                          href={
                                            process.env.PUBLIC_URL +
                                            "/assets/svg/icon-sprite.svg#course-1"
                                          }
                                        >
                                          {" "}
                                        </use>
                                      </svg>
                                      <svg className="half-circle svg-fill">
                                        <use
                                          href={
                                            process.env.PUBLIC_URL +
                                            "/assets/svg/icon-sprite.svg#halfcircle"
                                          }
                                        ></use>
                                      </svg>
                                    </div>
                                  </div>
                                  <div>
                                    <h4>
                                      {
                                        DashData?.dashBoardAdmin?.data?.data
                                          ?.total_voucher_bookings
                                      }
                                    </h4>
                                    <span className="f-light">
                                      Total Voucher Bookings
                                    </span>
                                  </div>
                                </div>
                                {/* <div className="font-success f-w-500"><i className="icon-arrow-up icon-rotate me-1"></i><span>+70%</span></div> */}
                              </div>
                            </div>
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
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
