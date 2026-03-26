import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeet from "./pages/VideoMeet";
import HomePage from "./pages/HomePage";
import MeetingHistory from "./pages/MeetingHistory";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/history" element={<MeetingHistory />} />
        <Route path=":url" element={<VideoMeet />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
