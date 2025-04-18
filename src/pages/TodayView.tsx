
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { usePlan } from "@/context/PlanContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Dumbbell, Utensils, Moon } from "lucide-react";
import TodayWorkout from "@/components/dashboard/today/TodayWorkout";
import TodayMeal from "@/components/dashboard/today/TodayMeal";
import WellbeingCheck from "@/components/dashboard/today/WellbeingCheck";

const TodayView = () => {
  const { workoutPlan, mealPlan } = usePlan();
  const today = new Date();
  const currentDayName = format(today, 'EEEE');

  return (
    <DashboardLayout title="Today's Activities">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{format(today, 'MMMM d, yyyy')}</h2>
          <p className="text-muted-foreground">{currentDayName}</p>
        </div>
        <Card className="bg-muted/50 w-auto">
          <CardContent className="flex items-center py-2 px-4">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Today</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <TodayWorkout />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <TodayMeal />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <WellbeingCheck />
      </div>
    </DashboardLayout>
  );
};

export default TodayView;
