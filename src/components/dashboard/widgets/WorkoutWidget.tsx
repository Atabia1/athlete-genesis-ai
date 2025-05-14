
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Clock, CheckCircle, Dumbbell, BarChart, ArrowRight, Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const workoutPlan = [
  {
    name: "Bench Press",
    sets: "4 sets of 8-10 reps",
    completed: true,
    weight: "185 lbs",
    type: "strength",
    muscles: ["chest", "triceps", "shoulders"]
  },
  {
    name: "Shoulder Press",
    sets: "3 sets of 10-12 reps",
    completed: true,
    weight: "135 lbs",
    type: "strength",
    muscles: ["shoulders", "triceps"]
  },
  {
    name: "Lat Pulldowns",
    sets: "4 sets of 10 reps",
    completed: false,
    weight: "160 lbs",
    type: "strength",
    muscles: ["back", "biceps"]
  },
  {
    name: "Tricep Extensions",
    sets: "3 sets of 12 reps",
    completed: false,
    weight: "70 lbs",
    type: "isolation",
    muscles: ["triceps"]
  },
  {
    name: "Face Pulls",
    sets: "3 sets of 15 reps",
    completed: false,
    weight: "50 lbs",
    type: "isolation",
    muscles: ["shoulders", "upper back"]
  }
];

const WorkoutWidget = () => {
  const [exercises, setExercises] = useState(workoutPlan);
  const [timerActive, setTimerActive] = useState(false);
  const [restTime, setRestTime] = useState(60); // Rest time in seconds

  // Calculate completion percentage
  const completedCount = exercises.filter(ex => ex.completed).length;
  const completionPercentage = (completedCount / exercises.length) * 100;

  // Toggle exercise completion
  const toggleExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].completed = !updatedExercises[index].completed;
    setExercises(updatedExercises);
  };

  // Format rest time as MM:SS
  const formatRestTime = () => {
    const minutes = Math.floor(restTime / 60);
    const seconds = restTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle rest timer
  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  // Reset rest timer
  const resetTimer = () => {
    setRestTime(60);
    setTimerActive(false);
  };

  return (
    <Card className="border-athleteBlue-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Dumbbell className="h-5 w-5 mr-2 text-athleteBlue-600" />
              Today's Workout
            </CardTitle>
            <CardDescription>Upper Body Strength</CardDescription>
          </div>
          <div className="flex items-center text-sm font-normal text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>45 min</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Strength
            </Badge>
            <Badge className="ml-2 bg-purple-100 text-purple-700 hover:bg-purple-100">
              Upper Body
            </Badge>
          </div>
          <div className="text-sm font-medium">
            {completedCount}/{exercises.length} completed
          </div>
        </div>

        <Progress
          value={completionPercentage}
          className="h-2 mb-4"
          // Fix for the indicatorClassName issue
          style={{
            "--progress-background": "#3b82f6"
          } as React.CSSProperties}
        />

        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg border ${
                exercise.completed
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              } transition-colors cursor-pointer`}
              onClick={() => toggleExercise(index)}
            >
              <div className={`mr-3 ${
                exercise.completed ? 'text-green-500' : 'text-gray-300'
              } transition-colors`}>
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm font-medium text-gray-500">{exercise.weight}</div>
                </div>
                <div className="text-sm text-gray-500 mt-1">{exercise.sets}</div>
                <div className="flex mt-2">
                  {exercise.muscles.map((muscle, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-1"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-2">
              <Timer className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-blue-700">Rest Timer</div>
              <div className="text-lg font-bold text-blue-800">{formatRestTime()}</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white"
              onClick={resetTimer}
            >
              <RotateCcw className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant={timerActive ? "destructive" : "default"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleTimer}
            >
              {timerActive ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full flex items-center justify-center">
          <BarChart className="h-4 w-4 mr-2" />
          <span>View Workout Details</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutWidget;
