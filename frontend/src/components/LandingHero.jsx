import React from "react";
import { Link } from "react-router-dom";
import mobileImg from "../assets/mobile.png";
const LandingHero = () => {
  return (
    <>
      <div className="w-full flex py-7 px-12 text-white justify-between">
        <div className="w-[47%] flex flex-col gap-8 h-[75vh] justify-center">
          <div className="w-full flex flex-col gap-12">
            <div className="w-full flex flex-col gap-1">
              <h1 className="text-7xl tracking-wide font-medium leading-tight">
                <span className="text-yellow-500">Connect</span> with your Loved
                Ones
              </h1>
              <h2 className="text-3xl text-gray-400">
                Cover a distance by NexMeet video call
              </h2>
            </div>
            <Link
              to={"/login"}
              className="w-fit bg-yellow-500 hover:bg-yellow-600 transition-all duration-100 ease-in-out px-6 py-2 rounded-md font-medium cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="w-[44%] flex justify-center">
            <img className="" src={mobileImg} alt="" />
        </div>
      </div>
    </>
  );
};

export default LandingHero;
