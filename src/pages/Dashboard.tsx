
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FreeDashboard from "@/components/dashboard/FreeDashboard";
import ProAthleteDashboard from "@/components/dashboard/ProAthleteDashboard";
import CoachDashboard from "@/components/dashboard/CoachDashboard";
import EliteDashboard from "@/components/dashboard/EliteDashboard";
import { usePlan } from "@/context/PlanContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Dashboard: Main entry point after onboarding
 *
 * This component serves as a router that displays the appropriate dashboard
 * based on the user type (athlete, individual, or coach). It also ensures
 * that users have completed the onboarding process by checking for the
 * existence of workout and meal plans.
 */

const Dashboard = () => {
  const { userType, workoutPlan, mealPlan } = usePlan();
  const navigate = useNavigate();

  // Redirect to onboarding if no plans exist
  useEffect(() => {
    if (!workoutPlan && !mealPlan) {
      navigate('/onboarding');
    }
  }, [workoutPlan, mealPlan, navigate]);

  /**
   * Renders the appropriate dashboard component based on user type and subscription tier
   * - Coach: Team management dashboard
   * - Individual: General fitness dashboard
   * - Athlete: Sport-specific performance dashboard
   * - Elite: Advanced AI-powered dashboard
   */
  const getDashboardContent = () => {
    // Get subscription tier from context
    const { subscriptionTier } = usePlan();
    const isEliteTier = subscriptionTier === 'elite';

    // If user has Elite subscription, show Elite dashboard regardless of user type
    if (isEliteTier) {
      return <EliteDashboard />;
    }

    // Otherwise, show dashboard based on user type
    switch (userType) {
      case 'coach':
        return <CoachDashboard />;
      case 'individual':
        return <FreeDashboard />;
      case 'athlete':
        return <ProAthleteDashboard />;
      default:
        return <FreeDashboard />;
    }
  };

  // Get subscription tier for title
  const { subscriptionTier } = usePlan();

  // Generate dashboard title based on subscription tier
  const getDashboardTitle = () => {
    switch (subscriptionTier) {
      case 'elite':
        return "Elite AI Dashboard";
      case 'coach':
        return "Coach Pro Dashboard";
      case 'pro':
        return "Pro Athlete Dashboard";
      default:
        return "Dashboard";
    }
  };

  return (
    <DashboardLayout title={getDashboardTitle()}>
      {getDashboardContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
