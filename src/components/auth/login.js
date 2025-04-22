import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import * as API from "../../api/apiHandler";
import { ErrorAlert } from "../../Common/Alert";
import { useDispatch, useSelector } from "react-redux";
import * as AllRedux from "../../store/slice/admindataSlice";

const Login = () => {
  const [showButton, setShowButton] = useState("password");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const LoginData = useSelector((state) => state);
  

  const changeFun = () => {
    if (showButton === "password") {
      setShowButton("text");
    } else {
      setShowButton("password");
    }
  };

  const rememberFunc = () => {
    if (
      localStorage.getItem("email") != null &&
      localStorage.getItem("password") != null
    ) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    } else {
      localStorage.setItem("email", document.getElementById("email").value);
      localStorage.setItem(
        "password",
        document.getElementById("userpassword").value
      );
    }
  };

  const loginValidation = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .test("Email is invalid", "Email is invalid", (value) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(value) !== false;
      })
      .strict(true),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[a-zA-Z\\d|#@$!%*?&.]{6,}$",
        "Password must contain an alphabet,number and special character"
      )
      .trim()
      .strict(true),
  });

  const formOptions = { resolver: yupResolver(loginValidation) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  useEffect(() => {
    if (sessionStorage.getItem("UserToken") != undefined) {
      navigate("/dashboard");
    }
  }, [sessionStorage.getItem("UserToken")]);

  const onSubmit = async (data) => {
    try {
      if (data) {
       
        dispatch(
          AllRedux.login({
            email: data.email,
            password: data.password,
          })
        );
      }
    } catch (error) {
      console.log(error)
      ErrorAlert("Something went wrong.");
    }
  };

  return (
    <>
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="col-12 p-0">
            <div className="login-card login-dark">
              <div>
                <div className="login-main">
                  <form
                    className="theme-form"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <h4>Sign in to account</h4>
                    <p>Enter your email & password to login</p>
                    <div className="form-group">
                      <label className="col-form-label">Email Address</label>
                      <input
                        style={{ color: "slateblue" }}
                        className="form-control"
                        id="email"
                        type="email"
                        {...register("email")}
                        required=""
                        placeholder="Test@gmail.com"
                        defaultValue={
                          localStorage.getItem("email") !== undefined
                            ? localStorage.getItem("email")
                            : ""
                        }
                      />
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-form-label">Password</label>
                      <div className="form-input position-relative">
                        <input
                          style={{ color: "slateblue" }}
                          id="userpassword"
                          className="form-control"
                          type={showButton}
                          {...register("password")}
                          name="password"
                          defaultValue={
                            localStorage.getItem("password") !== undefined
                              ? localStorage.getItem("password")
                              : ""
                          }
                          placeholder="*********"
                          autocomplete="off"
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
                        {errors.password?.message}
                      </div>
                    </div>
                    <div className="form-group mb-0">
                      <div className="checkbox p-0">
                        {localStorage.getItem("email") != null &&
                        localStorage.getItem("password") != null ? (
                          <input
                            id="checkbox1"
                            type="checkbox"
                            onClick={rememberFunc}
                            defaultChecked="checked"
                          />
                        ) : (
                          <input
                            id="checkbox1"
                            type="checkbox"
                            onClick={rememberFunc}
                          />
                        )}
                        <label className="text-muted" htmlFor="checkbox1">
                          Remember Password
                        </label>
                      </div>
                      <Link className="link" to="/forgetpassword">
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
      </div>
    </>
  );
};

export default Login;
