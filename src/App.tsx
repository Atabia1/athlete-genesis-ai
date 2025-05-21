
/**
 * Athlete GPT - Main Application
 */
import { Routes, Route } from "react-router-dom";

// Landing and marketing pages
import Index from "./pages/Index";

// Dashboard pages
import Dashboard from "./pages/Dashboard";

// Test page
import TestPage from "./pages/TestPage";

/**
 * Main App component that sets up application routing
 */
const App = () => (
  <Routes>
    {/* Landing Page */}
    <Route path="/" element={<Index />} />
    
    {/* Dashboard */}
    <Route path="/dashboard" element={<Dashboard />} />
    
    {/* Test Page */}
    <Route path="/test" element={<TestPage />} />
    
    {/* All other routes will be added as we implement them */}
  </Routes>
);

export default App;
