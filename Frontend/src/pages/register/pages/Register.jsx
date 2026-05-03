import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/Context";

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
      withCredentials: true
    }).then((res) => {
      console.log(res.data);
      reset();
      navigate("/login");
    }).catch((err) => {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed");
    });
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
          <div className="w-full pt-4 flex flex-col gap-4 border-none mt-auto">
            <div className="w-full flex flex-col-reverse md:flex-row justify-between items-end md:items-center gap-6">
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

            {/* Google Login Separator */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-black/10"></div>
              <span className="text-[10px] font-semibold tracking-widest text-black/40 uppercase">OR</span>
              <div className="flex-1 h-px bg-black/10"></div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => (window.location.href = `${backURI}/api/auth/google`)}
              className="w-full flex items-center justify-center gap-3 py-3 md:py-4 border border-black/10 rounded-none bg-white hover:bg-black/5 transition-all text-black text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
