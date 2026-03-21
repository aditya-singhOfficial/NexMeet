import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <div className="w-full py-7 px-12 text-white flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide">
          <Link to={"/"}>NexMeet</Link>
        </h1>
        <div className="flex gap-8 items-center text-[17px]">
          <Link to={"#"} className="hover:text-yellow-500">
            Join as Guest
          </Link>

          <Link to={"/auth?mode=signup"} className="hover:text-yellow-500">
            Register
          </Link>

          <Link
            to={"/auth?mode=signin"}
            className="bg-yellow-500 hover:bg-yellow-600 transition-all duration-100 ease-in-out px-6 py-2 rounded-md font-medium cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
