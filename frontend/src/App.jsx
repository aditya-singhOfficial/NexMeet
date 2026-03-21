import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* <Route path="/home" element={""} /> */}
      {/* <Route path="/" element={""} /> */}
    </Routes>
  )
}

export default App

