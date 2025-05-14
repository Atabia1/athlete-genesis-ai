
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Apple, Coffee, Beef, Utensils, Salad, Sandwich, PieChart as PieChartIcon, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const mealPlan = [
  {
    time: "7:30 AM",
    meal: "Breakfast",
    description: "Greek yogurt with berries and honey, 2 eggs",
    icon: Coffee,
    calories: 420,
    protein: 28
  },
  {
    time: "10:30 AM",
    meal: "Snack",
    description: "Apple with almond butter",
    icon: Apple,
    calories: 220,
    protein: 7
  },
  {
    time: "12:30 PM",
    meal: "Lunch",
    description: "Chicken salad with mixed greens and olive oil dressing",
    icon: Salad,
    calories: 450,
    protein: 35
  },
  {
    time: "3:30 PM",
    meal: "Snack",
    description: "Protein shake with banana",
    icon: Utensils,
    calories: 280,
    protein: 25
  },
  {
    time: "6:30 PM",
    meal: "Dinner",
    description: "Grilled salmon with quinoa and vegetables",
    icon: Beef,
    calories: 520,
    protein: 40
  }
];

const macroData = [
  { name: "Protein", value: 135, color: "#3b82f6", goal: 150 },
  { name: "Carbs", value: 210, color: "#10b981", goal: 225 },
  { name: "Fat", value: 65, color: "#f59e0b", goal: 70 }
];

const waterIntake = {
  current: 1.8,
  goal: 2.5,
  unit: "L"
};

const NutritionWidget = () => {
  // Calculate total calories and protein
  const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = mealPlan.reduce((sum, meal) => sum + meal.protein, 0);

  // Calculate daily calorie goal (example)
  const calorieGoal = 2200;
  const caloriePercentage = Math.min(100, Math.round((totalCalories / calorieGoal) * 100));

  return (
    <Card className="border-athleteBlue-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Nutrition Plan</CardTitle>
            <CardDescription>Your daily meal plan and macros</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meals" className="mb-4">
          <TabsList className="grid grid-cols-3 p-1 bg-gray-100/80">
            <TabsTrigger value="meals" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md">
              Meals
            </TabsTrigger>
            <TabsTrigger value="macros" className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md">
              Macros
            </TabsTrigger>
            <TabsTrigger value="water" className="data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-md">
              Water
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="mt-4">
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {mealPlan.map((meal, index) => (
                <div key={index} className="flex items-start bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="bg-athleteGreen-100 p-2 rounded-full mr-3 text-athleteGreen-600">
                    <meal.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500">{meal.time}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="font-medium">{meal.meal}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {meal.calories} cal
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span className="font-medium text-blue-600">{meal.protein}g protein</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Daily Calories</span>
                <span className="text-sm font-medium">{totalCalories} / {calorieGoal} cal</span>
              </div>
              <Progress value={caloriePercentage} className="h-2" />
            </div>
          </TabsContent>

          <TabsContent value="macros" className="mt-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}g`, name]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      border: "none"
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-4">
              {macroData.map((macro, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: macro.color }}></div>
                      <span className="text-sm font-medium">{macro.name}</span>
                    </div>
                    <span className="text-sm font-medium">{macro.value}g / {macro.goal}g</span>
                  </div>
                  <Progress
                    value={(macro.value / macro.goal) * 100}
                    className="h-2"
                    // Fix for the indicatorClassName issue
                    style={{
                      "--progress-background": macro.color
                    } as React.CSSProperties}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="water" className="mt-4">
            <div className="flex flex-col items-center justify-center p-6">
              <div className="relative w-40 h-40 mb-6">
                <div className="absolute inset-0 rounded-full border-8 border-blue-100"></div>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-full border-8 border-blue-100 transition-all duration-1000"
                  style={{
                    height: `${(waterIntake.current / waterIntake.goal) * 100}%`,
                    opacity: 0.8
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-blue-600">{waterIntake.current}{waterIntake.unit}</span>
                  <span className="text-sm text-blue-500">of {waterIntake.goal}{waterIntake.unit}</span>
                </div>
              </div>

              <div className="w-full bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Water Intake</span>
                  <span className="text-sm font-medium">{Math.round((waterIntake.current / waterIntake.goal) * 100)}%</span>
                </div>
                <Progress
                  value={(waterIntake.current / waterIntake.goal) * 100}
                  className="h-2"
                  // Fix for the indicatorClassName issue
                  style={{
                    "--progress-background": "#3b82f6"
                  } as React.CSSProperties}
                />
                <div className="mt-4 text-sm text-center text-gray-600">
                  Remember to drink water regularly throughout the day!
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full flex items-center justify-center">
          <PieChartIcon className="h-4 w-4 mr-2" />
          <span>View Full Nutrition Plan</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NutritionWidget;
