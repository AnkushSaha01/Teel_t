import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col justify-center flex-1 px-6 md:px-12  text-black">
      {/* Main Heading */}
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-tighter leading-[0.9] uppercase max-w-4xl mb-8">
        Twitter
        <br />
        But Better
      </h1>

      {/* Subtext */}
      <p className="text-base md:text-xl font-regular uppercase tracking-wide leading-relaxed max-w-2xl text-black/90 mb-12">
        A social media where you don't need to fight for attention.
      </p>

      {/* Separator line */}
      <div className="w-24 md:w-32 h-px bg-black/20 mb-12"></div>

      {/* Call to Action Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/login"
          className="px-8 py-3.5 bg-black/5 text-black text-xs md:text-sm font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-black/10 hover:scale-105 transition-all duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-8 py-3.5 bg-black text-[#f0efeb] text-xs md:text-sm font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-black/80 hover:scale-105 shadow-[0_4px_20px_rgb(0,0,0,0.15)] transition-all duration-300"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
