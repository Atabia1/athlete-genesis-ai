import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import { usePlan } from '@/context/PlanContext';
import { WorkoutDay, Exercise } from '@/types/workout';
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";
import OfflineContentBadge from "@/components/ui/offline-content-badge";

const WorkoutPlanDisplay = () => {
  const { workoutPlan } = usePlan();
  const { isOnline } = useNetworkStatus();
  const [expandedDay, setExpandedDay] = useState<string | null>("Day 1");
  const [completedExercises, setCompletedExercises] = useState<Record<string, string[]>>({});

  if (!workoutPlan) {
    return (
      <Card className="border-athleteBlue-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Your Workout Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Dumbbell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Workout Plan Available</h3>
            <p className="text-gray-500 mt-2">Complete the onboarding process to generate your personalized workout plan.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const toggleExerciseCompletion = (day: string, exerciseName: string) => {
    setCompletedExercises(prev => {
      const dayExercises = prev[day] || [];
      if (dayExercises.includes(exerciseName)) {
        return {
          ...prev,
          [day]: dayExercises.filter(name => name !== exerciseName)
        };
      } else {
        return {
          ...prev,
          [day]: [...dayExercises, exerciseName]
        };
      }
    });
  };

  const isExerciseCompleted = (day: string, exerciseName: string) => {
    return (completedExercises[day] || []).includes(exerciseName);
  };

  return (
    <Card className="border-athleteBlue-200 shadow-sm relative">
      {!isOnline && <OfflineContentBadge className="absolute top-2 right-2" />}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-athleteBlue-600" />
            Your Workout Plan
          </CardTitle>
          {!isOnline && (
            <OfflineIndicator
              showRetryButton={false}
              className="ml-2"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* ... keep existing code (tabs and workout plan content) */}
        <Tabs defaultValue="weeklyPlan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weeklyPlan">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="details">Training Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="weeklyPlan" className="mt-4">
            <div className="space-y-4">
              {(workoutPlan as any).weeklyPlan.map((day: WorkoutDay) => (
                <div key={(day as any).day} className="border rounded-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                    onClick={() => toggleDay((day as any).day)}
                  >
                    <div>
                      <h3 className="font-medium">{(day as any).day}</h3>
                      <p className="text-sm text-gray-600">{(day as any).focus}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs bg-athleteBlue-100 text-athleteBlue-800 px-2 py-1 rounded-full mr-2">
                        {(day as any).duration}
                      </span>
                      {expandedDay === (day as any).day ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedDay === (day as any).day && (
                    <div className="p-4 border-t">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Warm-up</h4>
                        <p className="text-sm">{(day as any).warmup}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Exercises</h4>
                        <div className="space-y-3">
                          {(day as any).exercises.map((exercise: Exercise, index: number) => (
                            <div
                              key={index}
                              className={`flex items-start p-3 rounded-md border ${
                                isExerciseCompleted((day as any).day, exercise.name)
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full mr-3 p-1 ${
                                  isExerciseCompleted((day as any).day, exercise.name)
                                    ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                                    : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                                }`}
                                onClick={() => toggleExerciseCompletion((day as any).day, exercise.name)}
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

                                <div className="mt-1 text-sm text-gray-600">
                                  Rest: {(exercise as any).rest}
                                </div>

                                {exercise.notes && (
                                  <div className="mt-2 flex items-start text-xs text-gray-500">
                                    <Info className="h-3 w-3 mr-1 mt-0.5" />
                                    <span>{exercise.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Cool-down</h4>
                        <p className="text-sm">{(day as any).cooldown}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Periodization</h3>
                <p className="text-sm text-gray-700">{(workoutPlan as any).periodization}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Progression Strategy</h3>
                <p className="text-sm text-gray-700">{(workoutPlan as any).progressionStrategy}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WorkoutPlanDisplay;
