import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { GlobalContext } from "../context/Context";

export default function ProtectedRoute() {
  const { accessToken } = useContext(GlobalContext);

  // If no user token exists, redirect to login
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
