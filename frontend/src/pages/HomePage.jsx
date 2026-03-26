import React, { useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import remoteMeeting from "../assets/remote-meeting1.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const handleVideoCall = () => {
    if (meetingCode.trim()) {
      navigate(`/${meetingCode}`);
    }
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

  const startNewMeeting = () => {
    const randomCode = generateMeetingCode();
    navigate(`/${randomCode}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0514] bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-[#2A1158] via-[#0A0514] to-black flex flex-col font-sans text-white">
      {/* NAVBAR */}
      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center z-10 border-b-2 border-gray-800">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            NexMeet
          </h1>
        </div>

        <nav className="flex items-center gap-6 md:gap-10">
          <button
            className="flex items-center gap-2 text-gray-300 hover:text-[#FFC107] transition-colors font-medium cursor-pointer"
            onClick={() => {
              /* Navigate to history */
            }}
          >
            <RestoreIcon fontSize="small" />
            <span className="hidden sm:block">History</span>
          </button>

          <button
            className="text-gray-300 font-medium hover:text-red-400 transition-colors cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth?mode=signin");
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 max-w-7xl mx-auto w-full gap-12 md:gap-20 py-10 z-10">
        <div className="flex flex-col gap-6 w-full md:w-1/2">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight text-white tracking-wide">
            <span className="text-[#FFC107]">Connect</span> with <br />
            your Team & Loved Ones
          </h2>

          <p className="text-lg text-gray-300 max-w-lg leading-relaxed font-light">
            Cover any distance with NexMeet. Start meeting, sharing, and
            collaborating with secure, high-quality video calls.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Button
              variant="contained"
              size="large"
              startIcon={<VideoCallIcon style={{ color: "#0A0514" }} />}
              onClick={startNewMeeting}
              className="bg-[#FFC107]! text-[#0A0514]! normal-case! text-lg! rounded-lg! py-3! px-6! hover:bg-[#FFD54F]! font-bold! w-full sm:w-auto shrink-0 transition-all shadow-[0_4px_14px_0_rgba(255,193,7,0.39)]"
            >
              New meeting
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto relative">
              <div className="absolute left-3 text-gray-400 z-10 flex items-center pointer-events-none">
                <KeyboardIcon />
              </div>
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleVideoCall()}
                variant="outlined"
                placeholder="Enter a code or link"
                size="medium"
                className="w-full sm:w-64"
                inputProps={{ style: { color: "white" } }}
                by
                user
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingLeft: "32px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    backdropFilter: "blur(10px)",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#FFC107" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255, 255, 255, 0.5)",
                    opacity: 1,
                  },
                }}
              />
              <Button
                variant="text"
                onClick={handleVideoCall}
                disabled={!meetingCode.trim()}
                className={`normal-case! text-lg! font-bold ${
                  meetingCode.trim()
                    ? "text-[#FFC107]! hover:bg-[rgba(255,193,7,0.1)]!"
                    : "text-gray-500!"
                }`}
              >
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
          <div className="absolute w-75 h-75 bg-[#FFC107] opacity-10 blur-[100px] rounded-full"></div>

          <img
            className="w-full max-w-md object-contain drop-shadow-2xl rounded-2xl relative z-10"
            src={remoteMeeting}
            alt="People collaborating on a video call"
          />
        </div>
      </main>
    </div>
  );
};

export default withAuth(HomePage);
