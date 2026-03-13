import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/Context";

const Login = () => {
  const { backURI } = useContext(GlobalContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    axios.post(backURI + "/auth/user/login", data, { withCredentials: true }).then((res) => {
      console.log(res.data);
      navigate("/app/feed");
    }).catch((err) => {
      console.log(err);
    });
    reset();
  };

  return (
    <div className="w-full bg-[#F0EFEB] text-black  flex flex-col flex-1 items-start  px-6 py-6 md:py-8 font-[GeneralSans-Regular] relative">
      <div className="w-full max-w-5xl mx-auto flex flex-col grow justify-start mt-10">
        {/* Typographic Header */}
        <h1 className="text-[2rem] leading-none md:text-5xl lg:text-7xl lg:leading-[0.95] font-medium tracking-tighter uppercase mb-8 md:mb-12 text-black">
          WELCOME <br />
          BACK.
        </h1>

        <form
          className="w-full flex flex-col gap-6 md:gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Username or Email Input */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center border-b border-black/80 pb-1">
              <label className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
                USERNAME OR EMAIL
              </label>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40">
                01
              </span>
            </div>
            <input
              className="w-full bg-transparent py-2 text-xl md:text-3xl lg:text-4xl font-medium tracking-tight focus:outline-none placeholder-black/30 text-black "
              type="text"
              placeholder="ENTER USERNAME OR EMAIL"
              {...register("identifier", { required: "Username or email is required" })}
            />
            {errors.identifier && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center border-b border-black/80 pb-1">
              <label className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
                PASSWORD
              </label>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40">
                02
              </span>
            </div>
            <input
              className="w-full bg-transparent py-2 text-xl md:text-3xl lg:text-4xl font-medium tracking-tight focus:outline-none placeholder-black/30 text-black "
              type="password"
              placeholder="ENTER PASSWORD"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Bottom section */}
          <div className="w-full pt-4 flex flex-col-reverse md:flex-row justify-between items-end md:items-center gap-6 border-none mt-auto">
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
              READY TO LOGIN
            </span>
            <button
              className="bg-black text-[#F0EFEB] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase py-3 px-10 md:py-4 md:px-14 hover:bg-black/80 transition-colors w-full md:w-auto"
              type="submit"
            >
              Login now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;