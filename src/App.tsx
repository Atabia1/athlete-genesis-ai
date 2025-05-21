
/**
 * Athlete GPT - Main Application
 */
import { Routes, Route, Navigate } from "react-router-dom";

// Landing and marketing pages
import Index from "./pages/Index";

// Dashboard pages
import Dashboard from "./pages/Dashboard";

// Test page
import TestPage from "./pages/TestPage";

// Onboarding pages
import Onboarding from "./pages/Onboarding";
import FitnessGoals from "./pages/onboarding/FitnessGoals";
import SportActivity from "./pages/onboarding/SportActivity";
import ExperienceLevel from "./pages/onboarding/ExperienceLevel";
import TimeAndEquipment from "./pages/onboarding/TimeAndEquipment";
import MedicalStatus from "./pages/onboarding/MedicalStatus";
import PlanGeneration from "./pages/onboarding/PlanGeneration";
import PaymentPage from "./pages/onboarding/PaymentPage";

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
    
    {/* Onboarding Flow */}
    <Route path="/onboarding" element={<Onboarding />} />
    <Route path="/onboarding/fitness-goals" element={<FitnessGoals />} />
    <Route path="/onboarding/sport-activity" element={<SportActivity />} />
    <Route path="/onboarding/experience-level" element={<ExperienceLevel />} />
    <Route path="/onboarding/time-equipment" element={<TimeAndEquipment />} />
    <Route path="/onboarding/medical-status" element={<MedicalStatus />} />
    <Route path="/onboarding/plan-generation" element={<PlanGeneration />} />
    <Route path="/onboarding/payment" element={<PaymentPage />} />
    
    {/* Redirect any unknown routes to home page */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
