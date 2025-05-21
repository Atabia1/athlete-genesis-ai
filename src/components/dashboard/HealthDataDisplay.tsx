/**
 * Health Data Display Component
 * 
 * Shows health metrics from connected devices and apps in a user-friendly format
 */

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// Removed unused imports: Clock, Calendar, and HealthWorkout

const HealthDataDisplay = () => {
  // Mock data for demonstration
  const steps = 8234;
  const sleepHours = 7.5;
  const waterIntake = 2.3; // liters
  const workoutCompletion = 75; // percentage

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Steps</CardTitle>
          <CardDescription>Your daily activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{steps}</div>
          <Progress value={(steps / 10000) * 100} className="mt-2" />
          <p className="text-sm text-gray-500 mt-1">
            {steps >= 10000 ? "Great job!" : "Keep moving!"}
          </p>
        </CardContent>
      </Card>

      {/* Sleep Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep Duration</CardTitle>
          <CardDescription>Hours of sleep last night</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{sleepHours} hours</div>
          <Progress value={(sleepHours / 8) * 100} className="mt-2" />
          <p className="text-sm text-gray-500 mt-1">
            {sleepHours >= 7 ? "Restful night!" : "Try to get more sleep."}
          </p>
        </CardContent>
      </Card>

      {/* Water Intake Card */}
      <Card>
        <CardHeader>
          <CardTitle>Water Intake</CardTitle>
          <CardDescription>Daily hydration level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{waterIntake} L</div>
          <Progress value={(waterIntake / 3) * 100} className="mt-2" />
          <p className="text-sm text-gray-500 mt-1">
            {waterIntake >= 3 ? "Well hydrated!" : "Drink more water."}
          </p>
        </CardContent>
      </Card>

      {/* Workout Completion Card */}
      <Card>
        <CardHeader>
          <CardTitle>Workout Completion</CardTitle>
          <CardDescription>Percentage of workouts completed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{workoutCompletion}%</div>
          <Progress value={workoutCompletion} className="mt-2" />
          <p className="text-sm text-gray-500 mt-1">
            {workoutCompletion >= 90 ? "Excellent!" : "Keep up the effort."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthDataDisplay;
