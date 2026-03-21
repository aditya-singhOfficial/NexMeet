import React from "react";
import Navbar from "../components/Navbar";
import background from "../assets/background.png";
import LandingHero from "../components/LandingHero";
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
        <div className="w-full h-full bg-black/50 backdrop-blur-sm">
          <Navbar />
          <LandingHero />
        </div>
      </div>
    </>
  );
};

export default Landing;
