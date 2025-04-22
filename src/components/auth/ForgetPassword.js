import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorAlert } from "../../Common/Alert";
import { Link } from "react-router-dom";
import * as AllRedux from "../../store/slice/admindataSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/Loader";

export default function ForgetPassword() {
  const loginValidation = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .test("Email is invalid", "Email is invalid", (value) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(value) !== false;
      })
      .strict(true),
  });
  const dispatch = useDispatch();
  const formOptions = { resolver: yupResolver(loginValidation) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const isLoading = useSelector((state) => state.admindata.isLoading);

  const onSubmit = async (data) => {
    try {
      if (data) {
      
        dispatch(AllRedux.forgotPassword({ email: data.email }));
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="col-12 p-0">
            <div className="login-card login-dark">
              <div>
                <div className="login-main">
                  <div className="mb-4">
                    <p className="link float-end">
                      Back to <Link to="/">login</Link>
                    </p>
                  </div>
                  <form
                    className="theme-form"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <h4>Forget Password</h4>
                    <p>Enter your email to regenerate password</p>
                    <div className="form-group">
                      <label className="col-form-label">Email Address</label>
                      <input
                        className="form-control"
                        type="email"
                        {...register("email")}
                        required=""
                        placeholder="Test@gmail.com"
                        // value=""
                        // onChange={(e) => setUserID(e.target.value)}
                      />
                      <div className="invalid-feedback">
                        {errors.email?.message}
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
        </div>
      </div>
    </>
  );
}
