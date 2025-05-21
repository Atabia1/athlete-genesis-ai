import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Utensils, Wind } from "lucide-react";

interface HealthScoreCardProps {
  healthScore: number;
  steps: number;
  workoutTime: number;
  waterIntake: number;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ healthScore, steps, workoutTime, waterIntake }) => {
  return (
    <Card className="border-theme-border shadow-md">
      <CardHeader>
        <CardTitle>Your Health Score</CardTitle>
        <CardDescription>Overall well-being based on key metrics</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-3xl font-bold">{healthScore}</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{steps} Steps</span>
          </div>
          <div className="flex items-center space-x-2">
            <Utensils className="h-4 w-4 text-orange-500" />
            <span>{workoutTime} Min Workout</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-green-500" />
            <span>{waterIntake} ml Water</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreCard;
