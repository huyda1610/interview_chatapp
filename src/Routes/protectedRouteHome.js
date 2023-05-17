import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRouteHome = () => {
  const { loginAccount } = useSelector((state) => state.auth);
  if (!loginAccount) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};

export default ProtectedRouteHome;
