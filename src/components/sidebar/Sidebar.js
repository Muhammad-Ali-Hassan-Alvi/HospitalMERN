import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Alert from "../../Common/Alert";
import { useDispatch, useSelector } from "react-redux";
import * as AllRedux from "../../store/slice/admindataSlice";
import * as API from "../../api/apiHandler";
import Swal from "sweetalert2";
// var languages = require('language-list')();
export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const LoginData = useSelector((state) => state.admindata);

  const clearData = () => {
    try {
      dispatch(AllRedux.logout({})).then((res) => {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      });
    } catch (error) {
      Alert.ErrorAlert(error);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("UserToken")) {
      navigate("/");
    }
  }, [LoginData]);
  const location = useLocation();

  return (
    <div
      className="sidebar-wrapper" 
      sidebar-layout="stroke-svg"
    >
      <div style={{ height: "100vh", overflowY: "auto" }}>
        <div className="logo-wrapper">
          <Link
            to="/dashboard"
            onClick={() => sessionStorage.removeItem("path")}
          >
            <h1>IHCMS</h1>
          </Link>
        </div>

        <nav className="sidebar-main"  >
          <div className="left-arrow disabled" id="left-arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-arrow-left"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <div id="sidebar-menu">
            <ul
              className="sidebar-links"
              id="simple-bar"
              data-simplebar="init"
              style={{ display: "block" }}
            >
              <div className="simplebar-wrapper" style={{ margin: "0px" }}>
                <div className="simplebar-height-auto-observer-wrapper">
                  <div className="simplebar-height-auto-observer"></div>
                </div>
                <div className="simplebar-mask">
                  <div
                    className="simplebar-offset"
                    style={{ right: "0px", bottom: "0px" }}
                  >
                    <div
                      className="simplebar-content-wrapper"
                      style={{ height: "100%", overflow: "hidden scroll" }}
                    >
                      <div
                        className="simplebar-content"
                        style={{ padding: "0px" }}
                      >
                        <li className="back-btn">
                          <a href="index.html" className="active">
                            <img
                              className="img-fluid"
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/images/logo/logo-icon.png"
                              }
                              alt=""
                            />
                          </a>
                          <div className="mobile-back text-end">
                            <span>Back</span>
                            <i
                              className="fa fa-angle-right ps-2"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </li>
                        <li className="pin-title sidebar-main-title">
                          <div>
                            <h6>Pinned</h6>
                          </div>
                        </li>

                        {LoginData?.adminData?.data?.rights?.map(
                          (item, index) => {
                            return (
                              <li key={index} className="sidebar-list">
                                <Link
                                  className={
                                    sessionStorage.getItem("path") === "" &&
                                    sessionStorage.path === undefined
                                      ? location.pathname === `${item?.url}`
                                        ? "sidebar-link sidebar-title link-nav active"
                                        : "sidebar-link sidebar-title link-nav"
                                      : location.pathname === `${item?.url}`
                                      ? "sidebar-link sidebar-title link-nav active"
                                      : sessionStorage.getItem("path") ===
                                        `${item?.url}`
                                      ? "sidebar-link sidebar-title link-nav active"
                                      : "sidebar-link sidebar-title link-nav"
                                  }
                                  to={item.url}
                                  onClick={() =>
                                    sessionStorage.removeItem("path")
                                  }
                                >
                                  <svg className="stroke-icon">
                                    <use
                                      href={
                                        process.env.PUBLIC_URL +
                                        `/assets/svg/${item.icon}`
                                      }
                                    ></use>
                                  </svg>

                                  <span className="mt-1">{item.module_name}</span>
                                  <div className="according-menu">
                                    <i className="fa fa-angle-right"></i>
                                  </div>
                                </Link>
                              </li>
                            );
                          }
                        )}

                        {/* <li
                          className="sidebar-list"
                          onClick={() => clearData()}
                        >
                          <Link
                            className="sidebar-link sidebar-title link-nav"
                            to="/"
                          >
                            <svg className="stroke-icon">
                              <use
                                href={
                                  process.env.PUBLIC_URL +
                                  "/assets/svg/icon-sprite.svg#stroke-file"
                                }
                              ></use>
                            </svg>
                            <svg className="fill-icon">
                              <use
                                href={
                                  process.env.PUBLIC_URL +
                                  "/assets/svg/icon-sprite.svg#fill-file"
                                }
                              ></use>
                            </svg>
                            <span>Logout</span>
                            <div className="according-menu">
                              <i className="fa fa-angle-right"></i>
                            </div>
                          </Link>
                        </li> */}
                        
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="simplebar-placeholder"
                  style={{ width: "auto", height: "2431px" }}
                ></div>
              </div>
              <div
                className="simplebar-track simplebar-horizontal"
                style={{ visibility: "hidden" }}
              >
                <div
                  className="simplebar-scrollbar"
                  style={{ width: "0px", display: "none" }}
                ></div>
              </div>
              <div
                className="simplebar-track simplebar-vertical"
                style={{ visibility: "visible" }}
              >
                <div
                  className="simplebar-scrollbar"
                  style={{
                    height: "145px",
                    transform: "translate3d(0px, 0px, 0px)",
                    display: "block",
                  }}
                ></div>
              </div>
            </ul>
          </div>
          <div className="right-arrow" id="right-arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-arrow-right"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </nav>
      </div>
    </div>
  );
}