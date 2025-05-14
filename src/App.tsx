
/**
 * Athlete GPT - Main Application
 *
 * This is the root component of the Athlete GPT application, which provides
 * personalized fitness and nutrition plans for athletes, fitness enthusiasts, and coaches.
 *
 * The application is structured around the following main sections:
 * 1. Landing page with marketing content
 * 2. Onboarding flow for collecting user preferences
 * 3. Dashboard experiences tailored to user types
 * 4. Coach-specific tools for team management
 *
 * The routing structure reflects this organization, with dedicated routes for
 * each section and user type.
 */

import { Routes, Route } from "react-router-dom";
import { Fragment } from "react";

// Landing and marketing pages
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import About from "./pages/About";
import FeatureDemos from "./pages/FeatureDemos";
import InteractiveDemos from "./pages/InteractiveDemos";
import Payment from "./pages/Payment";
import PaymentCallback from "./pages/PaymentCallback";

// Authentication pages
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

// Accessibility components
import { AccessibilityAuditor } from "@/shared/components/accessibility";

// Onboarding flow pages - Common
import Onboarding from "./pages/Onboarding";

// Athlete onboarding flow pages (standard)
import FitnessGoals from "./pages/onboarding/FitnessGoals";
import SportActivity from "./pages/onboarding/SportActivity";
import ExperienceLevel from "./pages/onboarding/ExperienceLevel";
import TimeAndEquipment from "./pages/onboarding/TimeAndEquipment";
import MedicalStatus from "./pages/onboarding/MedicalStatus";
import PlanGeneration from "./pages/onboarding/PlanGeneration";
import PaymentPage from "./pages/onboarding/PaymentPage";

// Fitness Enthusiast onboarding flow pages (custom)
import HealthAssessment from "./pages/onboarding/individual/HealthAssessment";
import LifestyleHabits from "./pages/onboarding/individual/LifestyleHabits";
import FitnessHistory from "./pages/onboarding/individual/FitnessHistory";
import WellnessGoals from "./pages/onboarding/individual/WellnessGoals";
import IndividualPlanGeneration from "./pages/onboarding/individual/PlanGeneration";
import IndividualPaymentPage from "./pages/onboarding/individual/PaymentPage";

// Coach onboarding flow pages (custom)
import CoachingPhilosophy from "./pages/onboarding/coach/CoachingPhilosophy";
import TeamSetup from "./pages/onboarding/coach/TeamSetup";
import TrainingApproach from "./pages/onboarding/coach/TrainingApproach";
import EquipmentFacilities from "./pages/onboarding/coach/EquipmentFacilities";
import CoachPlanGeneration from "./pages/onboarding/coach/PlanGeneration";
import CoachPaymentPage from "./pages/onboarding/coach/PaymentPage";

// Athlete and fitness enthusiast pages
import Dashboard from "./pages/Dashboard";
import TodayView from "./pages/TodayView";
import WellbeingDashboard from "./pages/dashboard/WellbeingDashboard";
import CoachChat from "./pages/dashboard/CoachChat";
import OfflineWorkouts from "./pages/dashboard/OfflineWorkouts";
import AthleteDashboard from "./pages/dashboard/AthleteDashboard";
import WorkoutAnalytics from "./pages/dashboard/WorkoutAnalytics";
import NutritionDashboard from "./pages/dashboard/NutritionDashboard";
import HealthDashboard from "./pages/dashboard/HealthDashboard";
import AIFeatures from "./pages/dashboard/AIFeatures";

// Coach-specific pages
import CoachDashboard from "./pages/coach/CoachDashboard";
import AthleteRoster from "./pages/coach/AthleteRoster";
import AthleteDetails from "./pages/coach/AthleteDetails";
import TeamCalendar from "./pages/coach/TeamCalendar";
import TeamAnalytics from "./pages/dashboard/TeamAnalytics";
import TrainingPlans from "./pages/dashboard/TrainingPlans";

// Utility pages
import NotFound from "./pages/NotFound";

// Admin pages
import OwnerSettings from "./components/admin/OwnerSettings";
import DiscountCodeManager from "./components/admin/DiscountCodeManager";

// Example pages
import FeatureAccessExample from "./components/examples/FeatureAccessExample";

// Subscription and Payment pages
import SubscriptionManagement from "./pages/dashboard/SubscriptionManagement";
import ReceiptPage from "./pages/receipts/[id]";
import HealthAppSettings from "./pages/settings/HealthAppSettings";
/**
 * Main App component that sets up application routing
 */
const App = () => (
  <Fragment>
    <Routes>
      {/* Landing and Marketing Pages */}
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/demos" element={<FeatureDemos />} />
      <Route path="/interactive-demos" element={<InteractiveDemos />} />

      {/* Payment Pages */}
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/callback" element={<PaymentCallback />} />

      {/* Authentication Pages */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      {/* Onboarding Flow - Initial Selection */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Athlete Onboarding Flow (Standard) */}
      <Route path="/onboarding/fitness-goals" element={<FitnessGoals />} />
      <Route path="/onboarding/sport-activity" element={<SportActivity />} />
      <Route path="/onboarding/experience-level" element={<ExperienceLevel />} />
      <Route path="/onboarding/time-and-equipment" element={<TimeAndEquipment />} />
      <Route path="/onboarding/medical-status" element={<MedicalStatus />} />
      <Route path="/onboarding/plan-generation" element={<PlanGeneration />} />
      <Route path="/onboarding/payment" element={<PaymentPage />} />

      {/* Fitness Enthusiast Onboarding Flow (Custom) */}
      <Route path="/onboarding/individual/health-assessment" element={<HealthAssessment />} />
      <Route path="/onboarding/individual/lifestyle-habits" element={<LifestyleHabits />} />
      <Route path="/onboarding/individual/fitness-history" element={<FitnessHistory />} />
      <Route path="/onboarding/individual/wellness-goals" element={<WellnessGoals />} />
      <Route path="/onboarding/individual/plan-generation" element={<IndividualPlanGeneration />} />
      <Route path="/onboarding/individual/payment" element={<IndividualPaymentPage />} />

      {/* Coach Onboarding Flow (Custom) */}
      <Route path="/onboarding/coach/philosophy" element={<CoachingPhilosophy />} />
      <Route path="/onboarding/coach/team-setup" element={<TeamSetup />} />
      <Route path="/onboarding/coach/training-approach" element={<TrainingApproach />} />
      <Route path="/onboarding/coach/equipment-facilities" element={<EquipmentFacilities />} />
      <Route path="/onboarding/coach/plan-generation" element={<CoachPlanGeneration />} />
      <Route path="/onboarding/coach/payment" element={<CoachPaymentPage />} />
      {/* Athlete and Fitness Enthusiast Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/today" element={<TodayView />} />
      {/* Coach Dashboard and Team Management */}
      <Route path="/coach" element={<CoachDashboard />} />
      <Route path="/coach/roster" element={<AthleteRoster />} />
      <Route path="/coach/athlete/:athleteId" element={<AthleteDetails />} />
      <Route path="/coach/calendar" element={<TeamCalendar />} />
      {/* Athlete Dashboards */}
      <Route path="/dashboard/athlete" element={<AthleteDashboard />} />
      <Route path="/dashboard/well-being" element={<WellbeingDashboard />} />
      <Route path="/dashboard/workouts" element={<WorkoutAnalytics />} />
      <Route path="/dashboard/nutrition" element={<NutritionDashboard />} />
      <Route path="/dashboard/health" element={<HealthDashboard />} />
      <Route path="/dashboard/coach-chat" element={<CoachChat />} />
      <Route path="/dashboard/offline-workouts" element={<OfflineWorkouts />} />
      <Route path="/dashboard/ai-features" element={<AIFeatures />} />
      <Route path="/dashboard/subscription" element={<SubscriptionManagement />} />
      {/* Coach Analytics and Planning */}
      <Route path="/coach/analytics" element={<TeamAnalytics />} />
      <Route path="/coach/plans" element={<TrainingPlans />} />

      {/* Admin Routes - Hidden from navigation */}
      <Route path="/admin/owner-settings" element={<OwnerSettings />} />
      <Route path="/admin/discount-codes" element={<DiscountCodeManager />} />

      {/* Subscription and Payment Routes */}
      <Route path="/receipts/:id" element={<ReceiptPage />} />

      {/* Settings Routes */}
      <Route path="/settings/health-apps" element={<HealthAppSettings />} />

      {/* Example Routes */}
      <Route path="/examples/feature-access" element={<FeatureAccessExample />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>

    {/* Accessibility Auditor (only in development mode) */}
    {process.env.NODE_ENV === 'development' && (
      <AccessibilityAuditor autoRun={true} buttonPosition="bottom-right" />
    )}
  </Fragment>
);

export default App;
