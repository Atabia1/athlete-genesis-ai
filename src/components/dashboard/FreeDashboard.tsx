
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeWidget from "./widgets/WelcomeWidget";
import WorkoutWidget from "./widgets/WorkoutWidget";
import ProgressWidget from "./widgets/ProgressWidget";
import NutritionWidget from "./widgets/NutritionWidget";

const FreeDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WelcomeWidget />
        <WorkoutWidget />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressWidget />
        <NutritionWidget />
      </div>
    </div>
  );
};

export default FreeDashboard;
