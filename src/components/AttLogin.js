import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorAlert } from "../Common/Alert";
import { useDispatch, useSelector } from "react-redux";
import * as AttRedux from "../store/slice/attorneyDataSlice"; // Use your new attorney slice

const AttLogin = () => {
  const [showPassword, setShowPassword] = useState("password");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm(formOptions);

  const togglePassword = () => {
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));
  };

  const rememberFunc = () => {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("userpassword")?.value;

    if (localStorage.getItem("att_email") && localStorage.getItem("att_password")) {
      localStorage.removeItem("att_email");
      localStorage.removeItem("att_password");
    } else {
      localStorage.setItem("att_email", email);
      localStorage.setItem("att_password", password);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("UserToken")) {
      navigate("/attorney/dashboard"); // Update route as needed
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      if (data) {
        const resultAction = await dispatch(
          AttRedux.login({
            email: data.email,
            password: data.password,
          })
        );
        if (resultAction.payload?.code === "1") {
          navigate("/attorney/dashboard"); // Redirect to attorney dashboard
        }
      }
    } catch (error) {
      console.error(error);
      ErrorAlert("Something went wrong.");
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        <div className="col-12 p-0">
          <div className="login-card login-dark">
            <div className="login-main">
              <form className="theme-form" onSubmit={handleSubmit(onSubmit)}>
                <h4>Attorney Sign in</h4>
                <p>Enter your credentials to log in</p>

                <div className="form-group">
                  <label className="col-form-label">Email Address</label>
                  <input
                    className="form-control"
                    id="email"
                    type="email"
                    placeholder="attorney@example.com"
                    defaultValue={localStorage.getItem("att_email") || ""}
                    {...register("email")}
                    onChange={() => clearErrors("email")}
                  />
                  <div className="invalid-feedback d-block">
                    {errors.email?.message}
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-form-label">Password</label>
                  <div className="form-input position-relative">
                    <input
                      className="form-control"
                      id="userpassword"
                      type={showPassword}
                      placeholder="********"
                      autoComplete="off"
                      defaultValue={localStorage.getItem("att_password") || ""}
                      {...register("password")}
                      onChange={() => clearErrors("password")}
                    />
                    <div className="show-hide">
                      <span
                        className={showPassword === "password" ? "show" : "hide"}
                        onClick={togglePassword}
                      ></span>
                    </div>
                  </div>
                  <div className="invalid-feedback d-block">
                    {errors.password?.message}
                  </div>
                </div>

                <div className="form-group mb-0">
                  <div className="checkbox p-0">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      onClick={rememberFunc}
                      defaultChecked={
                        localStorage.getItem("att_email") && localStorage.getItem("att_password")
                      }
                    />
                    <label className="text-muted" htmlFor="rememberMe">
                      Remember Password
                    </label>
                  </div>
                  <Link className="link" to="/attorney/forgotpassword">
                    Forgot Password?
                  </Link>
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-primary btn-block w-100"
                      type="submit"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttLogin;
