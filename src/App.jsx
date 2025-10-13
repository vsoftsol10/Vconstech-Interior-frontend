import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import ProjectManagement from "./pages/ProjectManagement";
import MaterialManagement from "./pages/MaterialManagement";
import FinancialManagement from "./pages/FinancialManagement";
import ContractManagement from "./pages/ContractManagement";
import FileManagement from "./pages/FileManagement";
function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/project" element={<ProjectManagement/>} />
      <Route path="/material" element={<MaterialManagement/>} />
      <Route path="/contract" element={<ContractManagement/>} />
      <Route path="/financial" element={<FinancialManagement/>} />
      <Route path="/file-managememt" element={<FileManagement/>} />
      <Route path="/financial-management" element={<FinancialManagement/>} />

    </Routes>
  );
}

export default App;
