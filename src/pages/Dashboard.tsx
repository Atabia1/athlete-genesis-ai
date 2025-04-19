
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FreeDashboard from "@/components/dashboard/FreeDashboard";
import ProAthleteDashboard from "@/components/dashboard/ProAthleteDashboard";
import CoachDashboard from "@/components/dashboard/CoachDashboard";
import { usePlan } from "@/context/PlanContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { userType, workoutPlan, mealPlan } = usePlan();
  const navigate = useNavigate();

  useEffect(() => {
    if (!workoutPlan && !mealPlan) {
      navigate('/onboarding');
    }
  }, [workoutPlan, mealPlan, navigate]);

  const getDashboardContent = () => {
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

  return (
    <DashboardLayout title="Dashboard">
      {getDashboardContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
