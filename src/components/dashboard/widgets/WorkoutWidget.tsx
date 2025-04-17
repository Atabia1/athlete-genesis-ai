
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle } from "lucide-react";

const workoutPlan = [
  {
    name: "Bench Press",
    sets: "4 sets of 8-10 reps",
    completed: true
  },
  {
    name: "Shoulder Press",
    sets: "3 sets of 10-12 reps",
    completed: true
  },
  {
    name: "Lat Pulldowns",
    sets: "4 sets of 10 reps",
    completed: false
  },
  {
    name: "Tricep Extensions",
    sets: "3 sets of 12 reps",
    completed: false
  },
  {
    name: "Face Pulls",
    sets: "3 sets of 15 reps",
    completed: false
  }
];

const WorkoutWidget = () => {
  return (
    <Card className="border-athleteBlue-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Today's Workout</span>
          <div className="flex items-center text-sm font-normal text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>45 min</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {workoutPlan.map((exercise, index) => (
            <div 
              key={index} 
              className={`flex items-center p-2 rounded-md ${
                exercise.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className={`mr-3 ${
                exercise.completed ? 'text-athleteGreen-500' : 'text-gray-300'
              }`}>
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{exercise.name}</div>
                <div className="text-sm text-gray-500">{exercise.sets}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutWidget;
