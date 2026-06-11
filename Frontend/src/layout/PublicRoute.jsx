import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { GlobalContext } from "../context/Context";

export default function PublicRoute() {
  const { accessToken } = useContext(GlobalContext);

  // If user token exists, redirect them to the app feed
  return accessToken ? <Navigate to="/app/feed" replace /> : <Outlet />;
}
