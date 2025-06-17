import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Utensils, Apple, Plus, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";
import OfflineContentBadge from "@/components/ui/offline-content-badge";
import { Input } from "@/components/ui/input";

// Mock data for charts and metrics
const macroData = [
  { day: 'Mon', protein: 150, carbs: 200, fat: 65 },
  { day: 'Tue', protein: 160, carbs: 180, fat: 70 },
  { day: 'Wed', protein: 145, carbs: 190, fat: 60 },
  { day: 'Thu', protein: 155, carbs: 210, fat: 55 },
  { day: 'Fri', protein: 165, carbs: 195, fat: 65 },
  { day: 'Sat', protein: 140, carbs: 220, fat: 75 },
  { day: 'Sun', protein: 130, carbs: 170, fat: 60 },
];

const calorieData = [
  { day: 'Mon', calories: 2200, target: 2400 },
  { day: 'Tue', calories: 2350, target: 2400 },
  { day: 'Wed', calories: 2150, target: 2400 },
  { day: 'Thu', calories: 2450, target: 2400 },
  { day: 'Fri', calories: 2300, target: 2400 },
  { day: 'Sat', calories: 2600, target: 2400 },
  { day: 'Sun', calories: 2100, target: 2400 },
];

const macroDistribution = [
  { name: 'Protein', value: 30, color: '#3b82f6', target: 30 },
  { name: 'Carbs', value: 45, color: '#10b981', target: 50 },
  { name: 'Fat', value: 25, color: '#f59e0b', target: 20 },
];

const hydrationData = [
  { day: 'Mon', amount: 2.2 },
  { day: 'Tue', amount: 2.5 },
  { day: 'Wed', amount: 2.0 },
  { day: 'Thu', amount: 2.8 },
  { day: 'Fri', amount: 2.4 },
  { day: 'Sat', amount: 3.0 },
  { day: 'Sun', amount: 2.3 },
];

const mealPlan = [
  {
    time: '7:30 AM',
    meal: 'Breakfast',
    description: 'Greek yogurt with berries and granola',
    macros: { protein: 25, carbs: 35, fat: 10, calories: 330 },
    icon: Coffee
  },
  {
    time: '10:30 AM',
    meal: 'Snack',
    description: 'Protein shake with banana',
    macros: { protein: 30, carbs: 25, fat: 5, calories: 265 },
    icon: Apple
  },
  {
    time: '1:00 PM',
    meal: 'Lunch',
    description: 'Grilled chicken salad with avocado',
    macros: { protein: 35, carbs: 20, fat: 15, calories: 350 },
    icon: Utensils
  },
  {
    time: '4:00 PM',
    meal: 'Snack',
    description: 'Mixed nuts and dried fruit',
    macros: { protein: 10, carbs: 15, fat: 15, calories: 235 },
    icon: Apple
  },
  {
    time: '7:00 PM',
    meal: 'Dinner',
    description: 'Salmon with quinoa and roasted vegetables',
    macros: { protein: 40, carbs: 45, fat: 20, calories: 520 },
    icon: Utensils
  }
];

/**
 * NutritionDashboard: Dashboard for tracking nutrition and meal planning
 */
const NutritionDashboard = () => {
  const { isOnline } = useNetworkStatus();

  return (
    <DashboardLayout title="Nutrition Dashboard">
      {!isOnline && <OfflineContentBadge className="absolute top-2 right-2" />}
      
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              Nutrition Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Track your nutrition and optimize your performance
            </p>
          </div>
          {!isOnline && (
            <OfflineIndicator
              showRetryButton={false}
              className="ml-2"
            />
          )}
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-gray-500">Nutrition dashboard content will be implemented.</p>
      </div>
    </DashboardLayout>
  );
};

export default NutritionDashboard;
