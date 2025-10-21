import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Dashboard from "./pages/Interiors/Dashboard";
import ProjectManagement from "./pages/Interiors/ProjectManagement";
import MaterialManagement from "./pages/Interiors/MaterialManagement";
import FinancialManagement from "./pages/Interiors/FinancialManagement";
import ContractManagement from "./pages/Interiors/ContractManagement";
import FileManagement from "./pages/Interiors/FileManagement";
import EmployeeLogin from "./components/Employee/EmployeeLogin";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import EmployeeFileManagement from "./pages/Employee/EmployeeFileManagement";
import EmployeeMaterialManagement from "./pages/Employee/EmployeeMaterialManagement";
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

      <Route path="/employee-login" element={<EmployeeLogin/>} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard/>} />
      <Route path="/employee/file-management" element={<EmployeeFileManagement/>} />
      <Route path="/employee/material-management" element={<EmployeeMaterialManagement/>} />


    </Routes>
  );
}

export default App;
