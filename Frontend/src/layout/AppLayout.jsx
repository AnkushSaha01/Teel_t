import React from "react";
import Form from "../pages/form/pages/Form";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

const AppLayout = () => {
  const location = useLocation();
  const isChatRoom = /^\/app\/messages\/.+/.test(location.pathname);

  return (
    <div className="bg-[#f0efeb] min-h-dvh flex flex-col">
      {!isChatRoom && <Header />}
      <Outlet />
      {!isChatRoom && <Footer />}
    </div>
  );
};

export default AppLayout;
