
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import FitnessGoals from "./pages/onboarding/FitnessGoals";
import SportActivity from "./pages/onboarding/SportActivity";
import ExperienceLevel from "./pages/onboarding/ExperienceLevel";
import TimeAndEquipment from "./pages/onboarding/TimeAndEquipment";
import PlanGeneration from "./pages/onboarding/PlanGeneration";
import Dashboard from "./pages/Dashboard";
import TodayView from "./pages/TodayView";
import CoachDashboard from "./pages/coach/CoachDashboard";
import AthleteRoster from "./pages/coach/AthleteRoster";
import AthleteDetails from "./pages/coach/AthleteDetails";
import TeamCalendar from "./pages/coach/TeamCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/fitness-goals" element={<FitnessGoals />} />
          <Route path="/onboarding/sport-activity" element={<SportActivity />} />
          <Route path="/onboarding/experience-level" element={<ExperienceLevel />} />
          <Route path="/onboarding/time-and-equipment" element={<TimeAndEquipment />} />
          <Route path="/onboarding/plan-generation" element={<PlanGeneration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/today" element={<TodayView />} />
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/coach/roster" element={<AthleteRoster />} />
          <Route path="/coach/athlete/:athleteId" element={<AthleteDetails />} />
          <Route path="/coach/calendar" element={<TeamCalendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
