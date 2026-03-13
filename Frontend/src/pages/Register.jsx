import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/Context";

const Register = () => {
  const { backURI } = useContext(GlobalContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    
    // Append the file if it exists
    if (data.profileImage && data.profileImage.length > 0) {
      formData.append("profile", data.profileImage[0]);
    }

    axios.post(`${backURI}/auth/user/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    }).then((res) => {
      console.log(res.data);
      navigate("/login");
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
          CREATE A NEW <br />
          ACCOUNT.
        </h1>

        <form
          className="w-full flex flex-col gap-6 md:gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Username Input */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center border-b border-black/80 pb-1">
              <label className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
                USERNAME
              </label>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40">
                01
              </span>
            </div>
            <input
              className="w-full bg-transparent py-2 text-xl md:text-3xl lg:text-4xl font-medium tracking-tight focus:outline-none placeholder-black/30 text-black "
              type="text"
              placeholder="ENTER USERNAME"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center border-b border-black/80 pb-1">
              <label className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
                EMAIL
              </label>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40">
                02
              </span>
            </div>
            <input
              className="w-full bg-transparent py-2 text-xl md:text-3xl lg:text-4xl font-medium tracking-tight focus:outline-none placeholder-black/30 text-black "
              type="email"
              placeholder="ENTER EMAIL"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase mt-1">
                {errors.email.message}
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
                03
              </span>
            </div>
            <input
              className="w-full bg-transparent py-2 text-xl md:text-3xl lg:text-4xl font-medium tracking-tight focus:outline-none placeholder-black/30 text-black "
              type="password"
              placeholder="ENTER PASSWORD"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px] tracking-widest uppercase mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Profile Picture Input */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center border-b border-black/80 pb-1">
              <label className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
                PROFILE PICTURE
              </label>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black/40">
                04
              </span>
            </div>
            <input
              className="w-full bg-transparent py-2 text-md md:text-lg lg:text-xl font-medium tracking-tight focus:outline-none placeholder-black/30 text-black file:bg-black/60 file:text-white file:border-none file:px-4 file:py-1 file:rounded-full file:cursor-pointer "
              type="file"
              accept="image/*"
              {...register("profileImage")}
            />
            
          </div>

          {/* Bottom section */}
          <div className="w-full pt-4 flex flex-col-reverse md:flex-row justify-between items-end md:items-center gap-6 border-none mt-auto">
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-black">
              READY TO JOIN
            </span>
            <button
              className="bg-black text-[#F0EFEB] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase py-3 px-10 md:py-4 md:px-14 hover:bg-black/80 transition-colors w-full md:w-auto"
              type="submit"
            >
              Register now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
