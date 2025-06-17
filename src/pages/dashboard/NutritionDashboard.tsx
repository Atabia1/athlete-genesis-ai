import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Apple,
  ChevronRight,
  Coffee,
  Egg,
  Fish,
  Flame,
  Plus,
  Search,
  Utensils,
  Wheat
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";
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
  const [activeTab, setActiveTab] = useState("macros");

  // Calculate today's totals
  const todaysMacros = {
    protein: mealPlan.reduce((acc, meal) => acc + meal.macros.protein, 0),
    carbs: mealPlan.reduce((acc, meal) => acc + meal.macros.carbs, 0),
    fat: mealPlan.reduce((acc, meal) => acc + meal.macros.fat, 0),
    calories: mealPlan.reduce((acc, meal) => acc + meal.macros.calories, 0)
  };

  // Target values
  const targets = {
    protein: 170,
    carbs: 240,
    fat: 80,
    calories: 2400,
    water: 3.0
  };

  return (
    <DashboardLayout title="Nutrition Dashboard">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Nutrition Dashboard</h1>
            <p className="text-muted-foreground">
              Track your nutrition, macros, and meal planning
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search foods..."
                className="pl-8 w-[200px]"
              />
            </div>
            {!isOnline && (
              <OfflineIndicator />
            )}
          </div>
        </div>
      </div>

      {/* Nutrition Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-600">Protein</p>
                <h3 className="text-2xl font-bold text-blue-700">{todaysMacros.protein}g</h3>
              </div>
              <div className="p-3 bg-blue-500 rounded-full text-white">
                <Egg className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-blue-600">{Math.round(todaysMacros.protein / targets.protein * 100)}%</span>
                <span className="text-blue-600">Target: {targets.protein}g</span>
              </div>
              <Progress value={todaysMacros.protein / targets.protein * 100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600">Carbs</p>
                <h3 className="text-2xl font-bold text-green-700">{todaysMacros.carbs}g</h3>
              </div>
              <div className="p-3 bg-green-500 rounded-full text-white">
                <Wheat className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-green-600">{Math.round(todaysMacros.carbs / targets.carbs * 100)}%</span>
                <span className="text-green-600">Target: {targets.carbs}g</span>
              </div>
              <Progress value={todaysMacros.carbs / targets.carbs * 100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-amber-600">Fat</p>
                <h3 className="text-2xl font-bold text-amber-700">{todaysMacros.fat}g</h3>
              </div>
              <div className="p-3 bg-amber-500 rounded-full text-white">
                <Fish className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-amber-600">{Math.round(todaysMacros.fat / targets.fat * 100)}%</span>
                <span className="text-amber-600">Target: {targets.fat}g</span>
              </div>
              <Progress value={todaysMacros.fat / targets.fat * 100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-red-600">Calories</p>
                <h3 className="text-2xl font-bold text-red-700">{todaysMacros.calories}</h3>
              </div>
              <div className="p-3 bg-red-500 rounded-full text-white">
                <Flame className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-red-600">{Math.round(todaysMacros.calories / targets.calories * 100)}%</span>
                <span className="text-red-600">Target: {targets.calories}</span>
              </div>
              <Progress value={todaysMacros.calories / targets.calories * 100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Nutrition Charts */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <Tabs defaultValue="macros" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center">
                <CardTitle>Nutrition Tracking</CardTitle>
                <TabsList>
                  <TabsTrigger value="macros">Macronutrients</TabsTrigger>
                  <TabsTrigger value="calories">Calorie Tracking</TabsTrigger>
                  <TabsTrigger value="hydration">Hydration Levels</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="macros" className="mt-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={macroData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="protein" fill="#3b82f6" name="Protein (g)" />
                    <Bar dataKey="carbs" fill="#10b981" name="Carbs (g)" />
                    <Bar dataKey="fat" fill="#f59e0b" name="Fat (g)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="calories" className="mt-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calorieData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1800, 3000]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Calories"
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="hydration" className="mt-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hydrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
                    <defs>
                      <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#0ea5e9"
                      fillOpacity={1}
                      fill="url(#colorWater)"
                      name="Water (L)"
                    />
                    <Line
                      type="monotone"
                      dataKey={() => 3.0}
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target (3L)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </CardContent>
        </Card>

        {/* Right Column - Macro Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
            <CardDescription>Your macronutrient breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {macroDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{item.value}%</span>
                      <span className="text-muted-foreground ml-1">/ {item.target}%</span>
                    </div>
                  </div>
                  <Progress
                    value={item.value / item.target * 100}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Meal Plan */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Today's Meal Plan</CardTitle>
              <CardDescription>Your personalized nutrition schedule</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Meal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mealPlan.map((meal, index) => (
              <div key={index} className="flex items-start p-3 bg-slate-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-3">
                  <meal.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500">{meal.time}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="font-medium">{meal.meal}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      P: {meal.macros.protein}g
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      C: {meal.macros.carbs}g
                    </Badge>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      F: {meal.macros.fat}g
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {meal.macros.calories} cal
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default NutritionDashboard;
