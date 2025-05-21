
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';

const TestApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default TestApp;
