import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorAlert } from "../Common/Alert"; // Adjust if necessary
import { useSelector, useDispatch } from "react-redux"; // Import useSelector and useDispatch to access Redux state and dispatch actions
import * as AllRedux from "../store/slice/medDataSlice"; // Adjust the import path if necessary
const MedLogin = () => {
  const [showButton, setShowButton] = useState("password");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  // Access the attorney list from Redux store
  const attorneyList = useSelector(
    (state) => state.attorney.attorneyDataListing.data.data || []
  );

  // Log the attorney list to see if it's being fetched correctly
  useEffect(() => {
    console.log("Attorney List:", attorneyList); // Log the entire attorney list
  }, [attorneyList]); // Log whenever attorneyList changes

  const changeFun = () => {
    setShowButton(showButton === "password" ? "text" : "password");
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
      // .matches(
      //   "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[a-zA-Z\\d|#@$!%*?&.]{6,}$",
      //   "Password must contain an alphabet, number, and special character"
      // )
      .trim()
      .strict(true),
  });

  const formOptions = { resolver: yupResolver(loginValidation) };
  const { register, handleSubmit, formState, clearErrors } =
    useForm(formOptions);
  const { errors } = formState;

  // Dummy email and password for testing
  const DUMMY_EMAIL = "test@example.com";
  const DUMMY_PASSWORD = "DummyPassword123!";

  const dummyApiLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      // Check if the email and password match the dummy credentials
      if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
        resolve("Login successful");
      } else {
        // Check if the email exists in the attorney list
        const attorneyExists = attorneyList.some(
          (attorney) => attorney.email === email
        );
        if (attorneyExists && password === "dummyPassword") {
          // Use a dummy password for attorneys
          resolve("Login successful");
        } else {
          reject("Invalid email or password");
        }
      }
    });
  };

  // const onSubmit = async (data) => {
  //   try {
  //     const response = await dummyApiLogin(data.email, data.password);
  //     console.log(response); // Log the response from the dummy API
  //     sessionStorage.setItem("User      Token", "dummyToken");
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.log(error);
  //     ErrorAlert(error); // Show error alert
  //   }
  // };

  // Function to clear errors on input change
  const handleInputChange = (field) => {
    clearErrors(field);
  };
  useEffect(() => {
    if (sessionStorage.getItem("UserToken") != undefined) {
      navigate("/med/dashboard");
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
      console.log(error);
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
                    <h4>Medical Sign in to account</h4>
                    <p>
                      Enter your email & password to login to the medical portal
                    </p>
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
                        onChange={() => handleInputChange("email")} // Clear error on change
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
                          autoComplete="off"
                          onChange={() => handleInputChange("password")} // Clear error on change
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

      {/* Display the list of attorney emails */}
      <div className="container mt-4">
        <h5>Attorney Emails:</h5>
        <ul>
          {attorneyList.map((attorney, index) => (
            <li key={index}>{attorney.email}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MedLogin;
