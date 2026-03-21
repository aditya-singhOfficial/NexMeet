import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Authentication from "./pages/Authentication";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Authentication />} />
    </Routes>
  );
};

export default App;
