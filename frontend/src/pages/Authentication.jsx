import React, { useEffect, useState } from "react";
import backgroundImg from "../assets/background1.png";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
const Authentication = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("mode");
  console.log(query);
  const [isLogin, setIsLogin] = useState(query !== "signup");

  useEffect(() => {
    setIsLogin(query !== "signup");
  }, [query]);

  return (
    <>
      <div
        className="flex flex-col w-full h-screen "
        style={{ background: `url(${backgroundImg})` }}
      >
        <div className="w-full h-full bg-black/50">
          <Navbar />
          <div className="flex w-full py-7 px-12">
            <div className="w-[60%] flex flex-col gap-8 h-[75vh] justify-center">
              <div className="w-full flex flex-col gap-12">
                <div className="w-full flex flex-col gap-1">
                  <h1 className="text-7xl text-white tracking-wide font-bold leading-tight">
                    <span className="text-yellow-500">Connect</span> with your
                    Loved Ones
                  </h1>
                  <h2 className="text-3xl text-gray-400">
                    Cover a distance by NexMeet video call
                  </h2>
                </div>
              </div>
            </div>
            <div className="w-[40%] h-full text-white bg-white/10 py-3 rounded-md">
              <div className="flex flex-col items-center gap-4 pt-4">
                <LockOpenIcon
                  sx={{ fontSize: 36, color: `white` }}
                  className="bg-purple-500 px-2 py-1 rounded-full font-black"
                />
                <div className="flex gap-6 items-center ">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`font-medium px-2 py-1 cursor-pointer rounded-sm ${
                      isLogin
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-blue-500"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`font-medium px-2 py-1 cursor-pointer rounded-sm ${
                      !isLogin
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-blue-500"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
              {isLogin ? (
                <LoginTemplate setIsLogin={setIsLogin} />
              ) : (
                <SignUpTemplate setIsLogin={setIsLogin} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;

const SignUpTemplate = ({ setIsLogin }) => {
  return (
    <>
      <form action="#" method="post" className="flex flex-col gap-6 px-6 pt-2">
        <div className="flex flex-col gap-3">
          <label className="pl-1" htmlFor="email">
            Name:
          </label>
          <input
            className="outline-none border border-gray-200 px-2 py-3 rounded-md text-md"
            type="email"
            placeholder="Enter Full Name"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="pl-1" htmlFor="username">
            Username:
          </label>
          <input
            className="outline-none border border-gray-200 px-2 py-3 rounded-md text-md"
            type="text"
            placeholder="Enter Username"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="pl-1" htmlFor="password">
            Password:
          </label>
          <input
            className="outline-none border border-gray-200 px-2 py-3 rounded-md text-md"
            type="password"
            placeholder="Enter Password"
          />
        </div>
        <input
          className="bg-blue-500 text-white p-1.5 rounded-sm cursor-pointer"
          type="submit"
          value={"SIGN UP"}
        />
      </form>
      <div className="flex justify-between pl-6 pr-8 pt-4 text-sm">
        <Link className="text-blue-700">Forget Password?</Link>
        <Link className="text-blue-700">
          Already have account?{" "}
          <span
            onClick={() => setIsLogin(true)}
            className="underline cursor-pointer"
          >
            Signin
          </span>
        </Link>
      </div>
    </>
  );
};

const LoginTemplate = ({ setIsLogin }) => {
  return (
    <>
      <form action="#" method="post" className="flex flex-col gap-8 px-6 pt-4">
        <div className="flex flex-col gap-3">
          <label className="pl-1" htmlFor="username">
            Username:
          </label>
          <input
            className="outline-none border border-gray-200 px-2 py-3 rounded-md text-md"
            type="text"
            placeholder="Enter Username"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="pl-1" htmlFor="password">
            Password:
          </label>
          <input
            className="outline-none border border-gray-200 px-2 py-3 rounded-md text-md"
            type="password"
            placeholder="Enter Password"
          />
        </div>
        <input
          className="bg-blue-500 text-white p-1.5 cursor-pointer hover:bg-blue-700 rounded-sm"
          type="submit"
          value={"SIGN IN"}
        />
      </form>
      <div className="flex justify-between pl-6 pr-8 pt-4 text-sm">
        <Link className="text-blue-700">Forget Password?</Link>
        <button className="text-blue-700 cursor-pointer">
          Don't have account?{" "}
          <span
            onClick={() => setIsLogin(false)}
            className="underline cursor-pointer"
          >
            Sign up
          </span>
        </button>
      </div>
    </>
  );
};
