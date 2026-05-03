import React from "react";
import Form from "../pages/form/pages/Form";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <div className="bg-[#f0efeb] min-h-dvh flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppLayout;
