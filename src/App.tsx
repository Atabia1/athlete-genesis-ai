
/**
 * Athlete GPT - Main Application
 */
import { Routes, Route } from "react-router-dom";
import { Fragment } from "react";

// Landing and marketing pages
import Index from "./pages/Index";

// Test page
import TestPage from "./pages/TestPage";

/**
 * Main App component that sets up application routing
 */
const App = () => (
  <Fragment>
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Index />} />
      
      {/* Test Page */}
      <Route path="/test" element={<TestPage />} />
      
      {/* All other routes will be added as we implement them */}
    </Routes>
  </Fragment>
);

export default App;
