import React, { useEffect } from "react";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import moment from "moment";
import { ErrorAlert } from "../Common/Alert";
import Tooltiphome from "../Common/Tooltiphome";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import * as AllRedux from "../store/slice/billingSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function BillingID() {
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const IDData = useSelector((state) => state.billing.invoiceByIDGet.data.data);
  
  useEffect(() => {
    if (id !== null) {
      dispatch(AllRedux.invoiceByID({ invoice_id: id }));
    }
    return () => dispatch(AllRedux.setInvoiceID());
  }, [id]);

  const validationQualifying = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .test("Email is invalid", "Email is invalid", (value) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(value) !== false;
      })
      .strict(true),
    invoice: Yup.string()
      .required("Invoice value is required")
      .typeError("You must specify a number")
      .matches(/^[0-9]+$/, "Invoice must contain only digits")
      .min(1, "Invoice value must be at least 1 characters")
      .max(15, "Invoice value must be at most 8 characters"),
    localPhoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9()\s\-]+$/, "Invalid phone number")
      .min(9, "Number must be at least 9 characters")
      .max(11, "Number must be at most 11 characters"),
    // callingCountryCode: Yup.string()
    //   .required("Calling country code is required")
    //   .matches(/^\+\d{1,4}$/, "Invalid calling country code"),
    amount: Yup.string()
      .required("Amount value is required")
      .typeError("You must specify a number")
      .matches(/^[0-9]+$/, "Amount must contain only digits")
      .min(1, "Amount value must be at least 1 characters")
      .max(4, "Amount value must be at most 4 characters"),
    tax: Yup.string()
      .typeError("You must specify a number")
      .required("TAX value is required")
      .matches(
        /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)%?$/,
        "Invalid tax percentage"
      ),
    // .min(1, "TAX value must be at least 1 characters")
    // .max(2, "TAX value must be at most 2 characters")
    totalamount: Yup.string()
      .required("Total amount value is required")
      .typeError("You must specify a number")
      .matches(/^[0-9]+$/, "Amount must contain only digits")
      .min(1, "Total amount value must be at least 1 characters")
      .max(4, "Total amount value must be at most 4 characters"),
    doa: Yup.string()
      .required("DOA is required")
      .test(
        "Is date greater",
        "DOA cannot be greater than today's date",
        (value) => {
          if (!value) return true;
          return moment(new Date()).diff(value) > 0;
        }
      ),
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .matches("^[A-Za-z]{2,20}$", "Only alphabets are allowed for this field"),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .matches("^[A-Za-z]{2,20}$", "Only alphabets are allowed for this field"),
  });

  const formOptions = { resolver: yupResolver(validationQualifying) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;


  const onSubmit = (data) => {
    try {
      if (data) {
        
        dispatch(
          AllRedux.editInvoice({
            invoice_id: id,
            invoice_number: data.invoice,
            billing_date: data.doa,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            // calling_code: data.callingCountryCode,
            phone_number: data.localPhoneNumber,
            amount: data.amount,
            tax: data.tax,
            total_amount: data.totalamount,
          })
        ).then((res) => {
          reset();
          sessionStorage.removeItem("path");

          navigate("/billing");
        });
      }
    } catch (error) {
      ErrorAlert(error, "Something went wrong.");
    }
  };

  if (IDData === undefined) return <Loader />;

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
                    <h4>Billing</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Tooltiphome />
                      </li>
                      <li className="breadcrumb-item active"> Billing</li>
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
                      <h4>Edit Bill</h4>
                    </div>
                    <div className="card-body">
                      <form
                        className="row g-3 needs-validation custom-input"
                        noValidate=""
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            Invoice Number
                          </label>
                          <input
                            {...register("invoice")}
                            className="form-control"
                            id="validationTooltip01"
                            type="text"
                            placeholder="Number"
                            defaultValue={IDData?.invoice_number}
                            readOnly
                          />
                          <div className="invalid-feedback">
                            {errors.invoice?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip01"
                          >
                            DOA Date
                          </label>
                          <input
                            {...register("doa")}
                            className="form-control"
                            id="validationTooltip01"
                            type="date"
                            defaultValue={IDData?.billing_date}
                          />
                          <div className="invalid-feedback">
                            {errors.doa?.message}
                          </div>
                        </div>

                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip02"
                          >
                            First Name
                          </label>
                          <input
                            {...register("first_name")}
                            className="form-control"
                            id="validationTooltip02"
                            type="text"
                            placeholder="First Name"
                            defaultValue={IDData?.first_name}
                          />
                          <div className="invalid-feedback">
                            {errors.first_name?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltip02"
                          >
                            Last Name
                          </label>
                          <input
                            {...register("last_name")}
                            className="form-control"
                            id="validationTooltip02"
                            type="text"
                            placeholder="Last Name"
                            defaultValue={IDData?.last_name}
                          />
                          <div className="invalid-feedback">
                            {errors.last_name?.message}
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Email
                          </label>
                          <div className="input-group has-validation">
                            <input
                              {...register("email")}
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              placeholder="Email"
                              defaultValue={IDData?.email}
                            />
                            <div className="invalid-feedback">
                              {errors.email?.message}
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-md-1 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Code
                          </label>
                          <div className="input-group has-validation">
                            <input
                              {...register("callingCountryCode")}
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              placeholder="Code"
                              defaultValue={IDData?.calling_code}
                            />
                            <div className="invalid-feedback">
                              {errors.callingCountryCode?.message}
                            </div>
                          </div>
                        </div> */}
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Phone Number
                          </label>
                          <div className="input-group has-validation">
                            <input
                              {...register("localPhoneNumber")}
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              placeholder="Number"
                              defaultValue={IDData?.phone_number}
                            />
                            <div className="invalid-feedback">
                              {errors.localPhoneNumber?.message}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Amount
                          </label>
                          <div className="input-group has-validation">
                            <input
                              {...register("amount")}
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              placeholder="Amount"
                              defaultValue={IDData?.amount}
                            />
                            <div className="invalid-feedback">
                              {errors.amount?.message}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Tax in Percentage
                          </label>
                          <div className="input-group has-validation">
                            <input
                              {...register("tax")}
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              placeholder="Tax"
                              defaultValue={IDData?.tax}
                            />
                            <div className="invalid-feedback">
                              {errors.tax?.message}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 position-relative">
                          <label
                            className="form-label"
                            htmlFor="validationTooltipUsername"
                          >
                            Total Amount
                          </label>
                          <div className="input-group has-validation">
                            <input
                              {...register("totalamount")}
                              className="form-control"
                              id="validationTooltipUsername"
                              type="text"
                              aria-describedby="validationTooltipUsernamePrepend"
                              placeholder="Total Amount"
                              defaultValue={IDData?.total_amount}
                            />
                            <div className="invalid-feedback">
                              {errors.totalamount?.message}
                            </div>
                          </div>
                        </div>

                        <div className="container-fluid"></div>

                        <div className="col-12">
                          <button className="btn btn-primary" type="submit">
                            Edit Invoice
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Container-fluid Ends*/}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
