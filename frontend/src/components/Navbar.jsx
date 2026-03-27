import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function generateMeetingCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const getBlock = () => {
      let block = "";
      for (let i = 0; i < 3; i++) {
        block += chars[Math.floor(Math.random() * chars.length)];
      }
      return block;
    };

    return `${getBlock()}-${getBlock()}-${getBlock()}`;
  }

  const handleJoin = async () => {
    console.log("connecting");
    const randomCode = generateMeetingCode();
    console.log(localStorage.getItem("token"));
    navigate(`/${randomCode}`);
  };

  return (
    <div className="relative w-full py-4 md:py-7 px-6 md:px-12 text-white flex justify-between items-center z-50">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
        <Link to={"/"}>NexMeet</Link>
      </h1>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:flex gap-8 items-center text-[17px]">
        <button
          onClick={() => handleJoin()}
          className="hover:text-yellow-500 transition-colors"
        >
          Join as Guest
        </button>

        <Link
          to={"/auth?mode=signup"}
          className="hover:text-yellow-500 transition-colors"
        >
          Register
        </Link>

        <Link
          to={"/auth?mode=signin"}
          className="bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-100 ease-in-out px-6 py-2 rounded-md font-semibold cursor-pointer"
        >
          Login
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-white focus:outline-none cursor-pointer"
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <CloseIcon fontSize="large" />
        ) : (
          <MenuIcon fontSize="large" />
        )}
      </button>

      {/* Mobile Dropdown Menu (Glassmorphism) */}
      {isMenuOpen && (
        <div className="absolute top-16 right-6 w-48 md:hidden flex flex-col gap-4 p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl z-50 animate-in fade-in zoom-in duration-200">
          <button
            to={"#"}
            className="text-white hover:text-yellow-500 transition-colors font-medium text-center"
            onClick={() => {
              setIsMenuOpen(false);
              handleJoin();
            }}
          >
            Join as Guest
          </button>
          <hr className="border-white/10" />
          <Link
            to={"/auth?mode=signup"}
            className="text-white hover:text-yellow-500 transition-colors font-medium text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Link>
          <hr className="border-white/10" />
          <Link
            to={"/auth?mode=signin"}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-semibold text-center transition-all shadow-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
