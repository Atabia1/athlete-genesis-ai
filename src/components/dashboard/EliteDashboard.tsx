
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/context/PlanContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const EliteDashboard = () => {
  const navigate = useNavigate();
  const { workoutPlan, mealPlan } = usePlan();

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Welcome Card */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Welcome, User!
          </CardTitle>
          <Avatar>
            <AvatarFallback>AG</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Here's an overview of your progress and plans for today.
          </p>
        </CardContent>
      </Card>

      {/* Workout Plan Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Workout Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {workoutPlan ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your workout plan for today is ready.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/dashboard")}
              >
                View Full Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No workout plan available. Complete the onboarding process to generate your personalized workout plan.
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/onboarding")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Meal Plan Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {mealPlan ? (
            <>
              <p className="text-sm text-muted-foreground">
                Your meal plan for today is ready.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/dashboard")}
              >
                View Full Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No meal plan available. Complete the onboarding process to generate your personalized meal plan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Progress Chart Card */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Progress Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md">
            <p className="text-gray-500">Progress visualization will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Goals Overview Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Goals Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md">
            <p className="text-gray-500">Goals visualization will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EliteDashboard;
