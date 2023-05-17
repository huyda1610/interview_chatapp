import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRouteLogin = () => {
  const { loginAccount } = useSelector((state) => state.auth);
  if (Boolean(loginAccount)) {
    localStorage.setItem("selectedMenuItem", "1");
    return <Navigate to="/users" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteLogin;
