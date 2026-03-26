import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import withAuth from "../utils/withAuth";
import { IconButton, Button, Snackbar, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const MeetingHistory = () => {
  const navigate = useNavigate();
  const { getHistoryOfUser } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistoryOfUser();
        setHistory(data.reverse() || []);
      } catch (err) {
        setError("Failed to load meeting history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setSnackbarMessage("Meeting code copied to clipboard!");
    setOpenSnackbar(true);
  };

  const handleRejoin = (code) => {
    navigate(`/${code}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-[#0A0514] bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-[#2A1158] via-[#0A0514] to-black flex flex-col font-sans text-white">
      {/* HEADER */}
      <header className="w-full px-6 md:px-12 py-6 flex items-center gap-4 z-10 border-b border-[rgba(255,255,255,0.05)] bg-[#0A0514]/50 backdrop-blur-md sticky top-0">
        <IconButton
          onClick={() => navigate("/home")}
          className="text-gray-300! hover:text-[#FFC107]! transition-colors"
        >
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Meeting <span className="text-[#FFC107]">History</span>
        </h1>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 md:px-12 py-10 z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <CircularProgress style={{ color: "#FFC107" }} />
            <p className="text-gray-400 animate-pulse">
              Loading your cosmic history...
            </p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-red-400 bg-red-400/10 px-6 py-4 rounded-xl border border-red-500/20">
              {error}
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
            <div className="w-24 h-24 bg-[rgba(255,255,255,0.02)] rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.05)] shadow-[0_0_30px_rgba(255,193,7,0.05)]">
              <CalendarTodayIcon
                sx={{ fontSize: 40, color: "rgba(255,255,255,0.2)" }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-200 mb-2">
                No past meetings found
              </h2>
              <p className="text-gray-400 max-w-md">
                You haven't joined any meetings yet. Your history will appear
                here once you start collaborating.
              </p>
            </div>
            <Button
              variant="contained"
              onClick={() => navigate("/home")}
              className="bg-[#FFC107]! text-[#0A0514]! normal-case! font-bold! px-8! py-2.5! rounded-lg! hover:bg-[#FFD54F]!"
            >
              Go to Home
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((meeting, index) => (
              <div
                key={index}
                className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-6 rounded-2xl flex flex-col gap-4 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,193,7,0.3)] transition-all duration-300 group shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarTodayIcon sx={{ fontSize: 14 }} />
                      {/* Assuming your Mongoose schema has createdAt. If not, this falls back to "Recently" */}
                      {formatDate(meeting.date)}
                    </p>
                    <h3 className="text-xl font-bold text-white tracking-wide mt-1">
                      {meeting.meetingCode}
                    </h3>
                  </div>

                  <div className="bg-[rgba(255,193,7,0.1)] p-2 rounded-lg group-hover:bg-[#FFC107] transition-colors duration-300">
                    <VideoCallIcon className="text-[#FFC107] group-hover:text-[#0A0514]" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                  <Button
                    variant="text"
                    startIcon={<ContentCopyIcon fontSize="small" />}
                    onClick={() => handleCopyCode(meeting.meetingCode)}
                    className="text-gray-300! hover:text-white! normal-case! flex-1! justify-start! min-w-0!"
                  >
                    Copy
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => handleRejoin(meeting.meetingCode)}
                    className="bg-[rgba(255,193,7,0.15)]! text-[#FFC107]! hover:bg-[#FFC107]! hover:text-[#0A0514]! normal-case! font-semibold! shadow-none! px-6! rounded-lg! transition-all"
                  >
                    Rejoin
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            background: "#FFC107",
            color: "#0A0514",
            fontWeight: "bold",
            borderRadius: "8px",
          },
        }}
      />
    </div>
  );
};

export default withAuth(MeetingHistory);
