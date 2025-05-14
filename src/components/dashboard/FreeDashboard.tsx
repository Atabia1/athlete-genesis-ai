
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeWidget from "./widgets/WelcomeWidget";
import WorkoutWidget from "./widgets/WorkoutWidget";
import ProgressWidget from "./widgets/ProgressWidget";
import NutritionWidget from "./widgets/NutritionWidget";
import HealthDataDisplay from "./HealthDataDisplay";

/**
 * FreeDashboard: Dashboard for fitness enthusiasts
 *
 * This component displays a dashboard for users who identified as fitness
 * enthusiasts during onboarding. It provides a simplified interface focused
 * on general fitness goals, workout tracking, nutrition, and progress monitoring.
 *
 * Features:
 * - Welcome widget with personalized greeting
 * - Current workout summary and quick access
 * - Progress tracking with visual indicators
 * - Nutrition guidance and meal planning
 *
 * The layout is designed to be user-friendly and focused on the core elements
 * of fitness without the specialized features of the athlete dashboard.
 */

const FreeDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Top row: Welcome and Workout widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WelcomeWidget />
        <WorkoutWidget />
      </div>

      {/* Middle row: Health Data Display */}
      <div>
        <HealthDataDisplay />
      </div>

      {/* Bottom row: Progress and Nutrition widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressWidget />
        <NutritionWidget />
      </div>
    </div>
  );
};

export default FreeDashboard;
