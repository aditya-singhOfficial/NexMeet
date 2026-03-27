import React from "react";
import { Link } from "react-router-dom";
import mobileImg from "../assets/mobile1.png";

const LandingHero = () => {
  return (
    <>
      <div className="w-full flex flex-col-reverse md:flex-row py-7 px-6 md:px-12 text-white justify-between items-center gap-10 md:gap-0">
        <div className="w-full md:w-[50%] lg:w-[47%] flex flex-col gap-8 h-auto md:h-[75vh] justify-center text-center md:text-left">
          <div className="w-full flex flex-col gap-8 md:gap-12">
            <div className="w-full flex flex-col gap-2 md:gap-1">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl tracking-wide font-bold leading-tight">
                <span className="text-yellow-500">Connect</span> with your Loved Ones
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-400">
                Cover a distance by NexMeet video call
              </h2>
            </div>
            <Link
              to={"/auth"}
              className="w-fit mx-auto md:mx-0 bg-yellow-500 hover:bg-yellow-600 transition-all duration-100 ease-in-out px-6 py-3 md:py-2 rounded-md font-medium cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="w-full sm:w-[70%] md:w-[44%] flex justify-center items-center">
          <img className="block w-full max-h-[300px] md:max-h-[500px] object-contain" src={mobileImg} alt="Mobile App" />
        </div>
      </div>
    </>
  );
};

export default LandingHero;