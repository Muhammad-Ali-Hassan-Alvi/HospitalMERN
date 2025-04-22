import React, { useLayoutEffect, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import * as ALLRedux from "../../store/slice/admindataSlice";
import { useDispatch, useSelector } from "react-redux";
import * as API from "../../api/apiHandler";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ErrorAlert } from "../../Common/Alert";

export default function Profile() {
  const [getVisible, setVisible] = useState(false);
  const [getAdmin, setAdmin] = useState(null);
  const dispatch = useDispatch();

  const AdminData = useSelector((state) => state.admindata.adminData.data);
  
  useLayoutEffect(() => {
    
    API.get_admin_details({}).then((res) => {
      setVisible(false);
      setAdmin(res.data);
    });
  }, []);

  const adminValidation = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .test("Email is invalid", "Email is invalid", (value) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(value) !== false;
      })
      .strict(true),

    bio: Yup.string()
      .required("BIO is required")
      .min(2, "BIO must be at least 2 characters")
      .max(100, "BIO must be at most 100 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,100}$",
        "Only alphabets are allowed for this field"
      ),

    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name must be at most 30 characters")
      .matches(
        "^(?!^\\s)(?!.*\\s$)[A-Za-z\\s-]{2,30}$",
        "Only alphabets are allowed for this field"
      ),
  });

  const formOptions = { resolver: yupResolver(adminValidation) };

  const { register, handleSubmit, formState } = useForm(formOptions);

  const { errors } = formState;

  const profileSubmit = async (data) => {
    try {
      if (data) {
        dispatch(
          ALLRedux.changeAdminData({
            name: data.name,
            bio: data.bio,
            email: data.email,
            calling_code: data.callingCountryCode,
            phone_number: data.localPhoneNumber,
          })
        );
        setVisible(false);
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong");
    }
  };

  if (getAdmin == null) return <></>;
  return (
    <>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />

          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Profile</h4>
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
                            />
                          </svg>
                        </Link>
                      </li>
                      <li className="breadcrumb-item active"> Profile</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <div className="edit-profile">
                <div className="row">
                  <div className="col-xl-2"></div>
                  <div className="col-xl-8">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="card-title mb-0">My Profile</h4>
                        <div className="card-options">
                          <a
                            className="card-options-collapse"
                            href="#javascript"
                          >
                            <i className="fe fe-chevron-up"></i>
                          </a>
                          <a className="card-options-remove" href="#javascript">
                            <i className="fe fe-x"></i>
                          </a>
                        </div>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleSubmit(profileSubmit)}>
                          <div className="mb-2 row">
                            <div className="profile-title">
                              <div className="media">
                                <img
                                  alt=""
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/assets/images/dashboard/profile.png"
                                  }
                                  className="img-70 m-0 rounded-circle media"
                                />
                                <div className="media-body">
                                  <h5 className="mb-1">
                                    {AdminData && AdminData?.name}
                                  </h5>
                                  <p>
                                    {AdminData &&
                                      AdminData?.role?.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 mb-3">
                            <label className="form-label form-label">
                              Name
                            </label>
                            <input
                              placeholder="Name"
                              type="text"
                              className="form-control form-control"
                              defaultValue={getAdmin?.name}
                              readOnly={getVisible === false}
                              {...register("name")}
                              onChange={(e) => {}}
                            />
                            <div className="invalid-feedback">
                              {errors.name?.message}
                            </div>
                          </div>
                          <div className="mb-3 mb-3">
                            <label className="form-label">Bio</label>
                            <textarea
                              rows="5"
                              className="form-control form-control"
                              defaultValue={getAdmin?.bio}
                              readOnly={getVisible === false}
                              {...register("bio")}
                              onChange={(e) => {}}
                            ></textarea>
                            <div className="invalid-feedback">
                              {errors.bio?.message}
                            </div>
                          </div>
                          <div className="mb-3 mb-3">
                            <label className="form-label form-label">
                              Email Address
                            </label>
                            <input
                              placeholder="your-email@domain.com"
                              type="text"
                              className="form-control form-control"
                              defaultValue={getAdmin?.email}
                              readOnly={getVisible === false}
                              {...register("email")}
                              onChange={(e) => {}}
                            />
                            <div className="invalid-feedback">
                              {errors.email?.message}
                            </div>
                          </div>

                          <div className="form-footer">
                            {getVisible === false ? (
                              <a
                                className="btn-block btn btn-primary"
                                onClick={() => setVisible(true)}
                              >
                                Edit
                              </a>
                            ) : (
                              <></>
                            )}
                            {getVisible === true ? (
                              <button className="btn-block btn btn-primary">
                                Save
                              </button>
                            ) : (
                              <button className="d-none" type="hidden"></button>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
