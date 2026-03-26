import React, { useContext, useEffect, useState } from "react";
import backgroundImg from "../assets/background1.png";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Snackbar from "@mui/material/Snackbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
const Authentication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(query !== "signup");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState();

  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        let result = await handleLogin(username, password);
        setMessage(result.message);
        localStorage.setItem("token", result.token);
        setOpen(true);
        navigate("/home");
        setError("");
      } else {
        let result = await handleRegister(name, username, password);
        setMessage(result);
        setOpen(true);
        navigate("/auth?mode=signin");
        setError("");
      }
    } catch (error) {
      console.log(error);
      let message = error.response.data.message;
      setError(message);
      setMessage(message);
      setOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setIsLogin(query !== "signup");
    setUsername("");
    setName("");
    setPassword("");
    setError("");
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
                  <Link
                    to={"/auth?mode=signin"}
                    className={`font-medium px-2 py-1 cursor-pointer rounded-sm ${
                      isLogin
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-blue-500"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to={"/auth?mode=signup"}
                    className={`font-medium px-2 py-1 cursor-pointer rounded-sm ${
                      !isLogin
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-blue-500"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              {isLogin ? (
                <LoginTemplate
                  error={error}
                  setPassword={setPassword}
                  setUsername={setUsername}
                  setIsLogin={setIsLogin}
                  handleAuth={handleAuth}
                />
              ) : (
                <SignUpTemplate
                  error={error}
                  setPassword={setPassword}
                  setName={setName}
                  setUsername={setUsername}
                  setIsLogin={setIsLogin}
                  handleAuth={handleAuth}
                />
              )}
            </div>
          </div>
        </div>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          message={message}
          onClose={handleSnackbarClose}
        />
      </div>
    </>
  );
};

export default Authentication;

const SignUpTemplate = ({
  setIsLogin,
  error,
  setPassword,
  setName,
  setUsername,
  handleAuth,
}) => {
  return (
    <>
      <form className="flex flex-col gap-4 px-6 pb-8 pt-2">
        <div className="flex flex-col gap-2">
          <label className="pl-1" htmlFor="email">
            Name:
          </label>
          <input
            className="outline-none border border-gray-200 px-2 py-3 rounded-md text-md"
            type="text"
            placeholder="Enter Full Name"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
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
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
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
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <p className="text-red-700">{error}</p>
        <button
          onClick={handleAuth}
          className="bg-blue-500 text-white p-1.5 rounded-sm cursor-pointer"
          type="submit"
          value={"SIGN UP"}
        >
          SIGN UP
        </button>
      </form>
      {/* <div className="flex justify-between pl-6 pr-8 pt-4 text-sm">
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
      </div> */}
    </>
  );
};

const LoginTemplate = ({
  setIsLogin,
  error,
  setPassword,
  setUsername,
  handleAuth,
}) => {
  return (
    <>
      <form className="flex flex-col gap-4 px-6 pt-4 pb-8">
        <div className="flex flex-col gap-3">
          <label className="pl-1" htmlFor="username">
            Username:
          </label>
          <input
            className="outline-none border border-gray-200 px-2 py-3 rounded-md text-md"
            type="text"
            placeholder="Enter Username"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
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
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <p className="text-red-700">{error}</p>
        <button
          onClick={handleAuth}
          className="bg-blue-500 text-white p-1.5 cursor-pointer hover:bg-blue-700 rounded-sm"
          type="submit"
        >
          SIGN IN
        </button>
      </form>
      {/* <div className="flex justify-between pl-6 pr-8 pt-4 text-sm">
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
      </div> */}
    </>
  );
};
