import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorAlert, SuccessAlert } from "../../Common/Alert";
import { useDispatch, useSelector } from "react-redux";
import * as ALLRedux from "../../store/slice/admindataSlice";

export default function ChangePassword() {
  const [showButton, setShowButton] = useState("password");
  const [showButton1, setShowButton1] = useState("password");
  const [showButton2, setShowButton2] = useState("password");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const passwordData = useSelector(
    (state) => state.admindata.adminPassword.data
  );
 

  useEffect(() => {
    if (!sessionStorage.getItem("UserToken")) {
      navigate("/");
    }
  });
  const changeFun = () => {
    if (showButton === "password") {
      setShowButton("text");
    } else {
      setShowButton("password");
    }
  };
  const changeFun1 = () => {
    if (showButton1 === "password") {
      setShowButton1("text");
    } else {
      setShowButton1("password");
    }
  };
  const changeFun2 = () => {
    if (showButton2 === "password") {
      setShowButton2("text");
    } else {
      setShowButton2("password");
    }
  };

  
  const passwordValidation = Yup.object().shape(
    {
      old_password: Yup.string()
        .required("Old Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[a-zA-Z\\d|#@$!%*?&.]{6,}$",
          "Password must contain an alphabet,number and special character"
        )
        .trim()
        .strict(true),
      new_password: Yup.string()
        .required("New Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[a-zA-Z\\d|#@$!%*?&.]{6,}$",
          "Password must contain an alphabet,number and special character"
        )
        .trim()
        .strict(true),

      confirm_password: Yup.string()
        .required("Confirm password is required")
        .min(6, "Password must be at least 6 characters")
        .oneOf([Yup.ref("new_password"), null], "Password must match")
        .matches(
          "^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$",
          "Password must contain an alphabet,number and special character"
        ),
    },
    
  );

  const formOptions = { resolver: yupResolver(passwordValidation) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const passwordSubmit = async (data) => {
    try {
      if (data) {
        dispatch(
          ALLRedux.changeAdminPassword({
            old_password: data.old_password,
            new_password: data.new_password,
          })
        );
       
        
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong");
    }
  };

  return (
    <>
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
                    <h4>Change Password</h4>
                  </div>

                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/dashboard">
                          <svg className="stroke-icon">
                            <use
                              href={
                                process.env.PUBLIC_URL +
                                "/assets/svg/icon-sprite.svg#stroke-home"
                              }
                            ></use>
                          </svg>
                        </Link>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="login-card login-dark" id="changepassword">
              <div>
                <div className="login-main">
                  <form
                    className="theme-form"
                    onSubmit={handleSubmit(passwordSubmit)}
                  >
                    <h4>Change Password</h4>

                    <div className="form-group">
                      <label className="col-form-label">Old password</label>
                      <div className="form-input position-relative">
                        <input
                          style={{ color: "slateblue" }}
                          className="form-control"
                          type={showButton}
                          name="password"
                          placeholder="*********"
                          autocomplete="off"
                          {...register("old_password")}
                        />
                        <div className="show-hide">
                          <span
                            className={
                              showButton === "password" ? "show" : "hide"
                            }
                            onClick={() => changeFun()}
                          ></span>
                        </div>
                      </div>
                      <div className="invalid-feedback">
                        {errors.old_password?.message}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-form-label">New password</label>
                      <div className="form-input position-relative">
                        <input
                          style={{ color: "slateblue" }}
                          className="form-control"
                          type={showButton1}
                          name="password"
                          placeholder="*********"
                          autocomplete="off"
                          {...register("new_password")}
                        />
                        <div className="show-hide">
                          <span
                            className={
                              showButton1 === "password" ? "show" : "hide"
                            }
                            onClick={() => changeFun1()}
                          ></span>
                        </div>
                      </div>
                      <div className="invalid-feedback">
                        {errors.new_password?.message}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-form-label">Confirm password</label>
                      <div className="form-input position-relative">
                        <input
                          style={{ color: "slateblue" }}
                          className="form-control"
                          type={showButton2}
                          name="password"
                          placeholder="*********"
                          autocomplete="off"
                          {...register("confirm_password")}
                        />
                        <div className="show-hide">
                          <span
                            className={
                              showButton2 === "password" ? "show" : "hide"
                            }
                            onClick={() => changeFun2()}
                          ></span>
                        </div>
                      </div>
                      <div className="invalid-feedback">
                        {errors.confirm_password?.message}
                      </div>
                    </div>

                    <div className="form-group mb-0">
                      <div className="text-end mt-3">
                        <button
                          className="btn btn-primary btn-block w-100"
                          type="submit"
                        >
                          Regenerate Password
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
