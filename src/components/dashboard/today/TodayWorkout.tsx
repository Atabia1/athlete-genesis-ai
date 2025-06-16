import { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Check, PenLine, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import WorkoutLogger from "./WorkoutLogger";
import { useNavigate } from "react-router-dom";
import { Exercise } from "@/types/workout";
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";
import OfflineContentBadge from "@/components/ui/offline-content-badge";

const TodayWorkout = () => {
  const { workoutPlan } = usePlan();
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  if (!workoutPlan) {
    return (
      <Card className="border-athleteBlue-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-athleteBlue-600" />
            Today's Workout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Dumbbell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Workout Scheduled</h3>
            <p className="text-gray-500 mt-2">Complete the onboarding process to generate your personalized workout plan.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get today's day of week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = `Day ${dayOfWeek + 1}`; // Convert to 1-indexed for "Day 1", "Day 2", etc.

  // Find today's workout - use type assertion for workout plan structure
  const weeklyPlan = (workoutPlan as any).weeklyPlan || [];
  const todayWorkout = weeklyPlan.find((day: any) =>
    (day.day && day.day.includes(dayName)) || (day.day && day.day.includes(dayNames[dayOfWeek]))
  );

  if (!todayWorkout) {
    return (
      <Card className="border-athleteBlue-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-athleteBlue-600" />
            Today's Workout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Rest Day</Badge>
            <h3 className="text-lg font-medium text-gray-700">No Workout Scheduled for Today</h3>
            <p className="text-gray-500 mt-2">Enjoy your recovery day! Rest is an important part of your training plan.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/dashboard")}
            >
              View Full Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toggleExerciseCompletion = (exerciseName: string) => {
    setCompletedExercises(prev => {
      if (prev.includes(exerciseName)) {
        return prev.filter(name => name !== exerciseName);
      } else {
        return [...prev, exerciseName];
      }
    });
  };

  return (
    <Card className="border-athleteBlue-200 shadow-sm relative">
      {!isOnline && <OfflineContentBadge contentType="workout" position="top-right" />}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-athleteBlue-600" />
            Today's Workout
          </CardTitle>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <OfflineIndicator
                variant="badge"
                featureSpecific={true}
                featureName="This workout"
              />
            )}
            <Badge className="bg-athleteBlue-100 text-athleteBlue-800 hover:bg-athleteBlue-100">
              {todayWorkout.focus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium text-sm mb-2">Warm-up (5-10 mins)</h3>
          <p className="text-sm text-gray-600">{todayWorkout.warmup}</p>
        </div>

        <Separator className="my-4" />

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Exercises</h3>
            <span className="text-xs text-gray-500">
              {completedExercises.length} of {todayWorkout.exercises?.length || 0} completed
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {(todayWorkout.exercises || []).map((exercise: Exercise, index: number) => (
              <div
                key={index}
                className={`flex items-start p-3 rounded-md border ${
                  completedExercises.includes(exercise.name)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full mr-3 p-1 ${
                    completedExercises.includes(exercise.name)
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                      : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => toggleExerciseCompletion(exercise.name)}
                >
                  <Check className="h-4 w-4" />
                </Button>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium">{exercise.name}</h5>
                    <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {exercise.sets} × {exercise.reps}
                    </div>
                  </div>

                  <div className="mt-1 text-xs text-gray-600">
                    Rest: {(exercise as any).rest || '60s'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="font-medium text-sm mb-2">Cool-down (5-10 mins)</h3>
          <p className="text-sm text-gray-600">{todayWorkout.cooldown}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="border-athleteBlue-200 text-athleteBlue-700 hover:bg-athleteBlue-50 hover:text-athleteBlue-800"
            >
              <PenLine className="mr-2 h-4 w-4" />
              Log Workout
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Log Your Workout</SheetTitle>
            </SheetHeader>
            <WorkoutLogger workout={todayWorkout} />
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          className="text-gray-500"
          onClick={() => navigate("/dashboard")}
        >
          View Full Plan
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TodayWorkout;
