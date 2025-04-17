
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WelcomeWidget from "@/components/dashboard/widgets/WelcomeWidget";
import WorkoutWidget from "@/components/dashboard/widgets/WorkoutWidget";
import ProgressWidget from "@/components/dashboard/widgets/ProgressWidget";
import NutritionWidget from "@/components/dashboard/widgets/NutritionWidget";
import WorkoutPlanDisplay from "@/components/dashboard/WorkoutPlanDisplay";
import MealPlanDisplay from "@/components/dashboard/MealPlanDisplay";
import { usePlan } from "@/context/PlanContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { workoutPlan, mealPlan } = usePlan();
  const navigate = useNavigate();

  useEffect(() => {
    // If no plans are generated, redirect to onboarding
    if (!workoutPlan && !mealPlan) {
      navigate('/onboarding');
    }
  }, [workoutPlan, mealPlan, navigate]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <WelcomeWidget />
        <WorkoutWidget />
      </div>

      <div className="mb-6">
        <WorkoutPlanDisplay />
      </div>

      <div className="mb-6">
        <MealPlanDisplay />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressWidget />
        <NutritionWidget />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
