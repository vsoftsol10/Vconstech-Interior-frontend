import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import FileManagement from "./pages/FileManagement";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path='/file-management' element={<FileManagement/>}/>
    </Routes>
  );
}

export default App;
