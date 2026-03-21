import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <div className="w-full py-7 px-12 text-white flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide">
          <Link to={"/"}>NexMeet</Link>
        </h1>
        <ul className="flex gap-8 items-center text-[17px]">
          <li>
            <Link className="hover:text-yellow-500" to={"#"}>
              Join as Guest
            </Link>{" "}
          </li>
          <li>
            <Link className="hover:text-yellow-500" to={"#"}>
              Register
            </Link>
          </li>
          <li className="bg-yellow-500 hover:bg-yellow-600 transition-all duration-100 ease-in-out px-6 py-2 rounded-md font-medium cursor-pointer">
            <Link to={"#"}>Login</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
