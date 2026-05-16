import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/startup/Register';
import Dashboard from './pages/admin/Dashboard';
import Applicants from './pages/admin/Applicants';
import ApplicantDetails from './pages/admin/ApplicantDetails';
import Relationships from './pages/admin/Relationships';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/startup/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/applicants" element={<Applicants />} />
        <Route path="/admin/applicants/:id" element={<ApplicantDetails />} />
        <Route path="/admin/relationships" element={<Relationships />} />
      </Routes>
    </HashRouter>
  );
}