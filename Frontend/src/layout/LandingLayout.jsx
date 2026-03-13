import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const LandingLayout = () => {
  return (
    <div className="bg-[#f0efeb] min-h-dvh flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
};

export default LandingLayout;
