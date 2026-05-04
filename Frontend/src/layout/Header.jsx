import React from "react";
import { useProfile } from "../pages/profile/hooks/useProfile";
import { useContext } from "react";
import { GlobalContext } from "../context/Context";

const Header = () => {
  const { backURI } = useContext(GlobalContext);
  const { data } = useProfile({ backURI });
  return (
    <div className="w-[90%] mx-auto mt-5 flex bg-[white] justify-between items-center text-[10px] md:text-xs font-semibold tracking-[0.2em] py-6 px-8 rounded-4xl shadow-md shadow-[] ">
        <div className="flex items-center gap-3">
          <img className="w-10 h-10 rounded-full" src={data?.profilePic} alt="" />
          <div className="flex flex-col">
            <span className="text-lg uppercase tracking-tight">{data?.username}</span>
            <span className="text-xs text-gray-700 leading-none tracking-tight">{data?.email}</span>
          </div>
        </div>
        <div>
        <span className="uppercase">Menu</span>
        </div>
      </div>
  );
};

export default Header;
