import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function Privatecomponent() {
  const auth = sessionStorage.getItem("UserToken");

  return auth ? <Outlet /> : <Navigate to="/" />;
}
