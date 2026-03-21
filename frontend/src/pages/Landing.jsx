import React from "react";
import Navbar from "../components/Navbar";
import background from "../assets/background.png";
const Landing = () => {
  return (
    <>
      <div
        className="w-full h-screen bg-no-repeat"
        style={{
          background: `url(${background})`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          backgroundPosition: `bottom`,
        }}
      >
        <div className="w-full h-full bg-black/50">
          <Navbar />
        </div>
      </div>
    </>
  );
};

export default Landing;
