
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Utensils } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Sample nutrition data for a week
const nutritionData = [
  {
    day: 'Mon',
    protein: 120,
    carbs: 180,
    fat: 60,
    calories: 1740,
    goal: 2000
  },
  {
    day: 'Tue',
    protein: 135,
    carbs: 160,
    fat: 55,
    calories: 1675,
    goal: 2000
  },
  {
    day: 'Wed',
    protein: 110,
    carbs: 200,
    fat: 65,
    calories: 1825,
    goal: 2000
  },
  {
    day: 'Thu',
    protein: 125,
    carbs: 190,
    fat: 60,
    calories: 1800,
    goal: 2000
  },
  {
    day: 'Fri',
    protein: 140,
    carbs: 170,
    fat: 50,
    calories: 1690,
    goal: 2000
  },
  {
    day: 'Sat',
    protein: 100,
    carbs: 220,
    fat: 70,
    calories: 1910,
    goal: 2000
  },
  {
    day: 'Sun',
    protein: 115,
    carbs: 200,
    fat: 65,
    calories: 1845,
    goal: 2000
  }
];

// Macronutrient breakdown for pie chart
const macroBreakdown = [
  { name: 'Protein', value: 122, color: '#4f46e5' },
  { name: 'Carbs', value: 189, color: '#10b981' },
  { name: 'Fat', value: 61, color: '#f97316' }
];

// Daily nutrients actual vs target data
const nutrientGoals = [
  { name: 'Protein (g)', actual: 122, goal: 150, percent: (122 / 150) * 100 },
  { name: 'Carbs (g)', actual: 189, goal: 200, percent: (189 / 200) * 100 },
  { name: 'Fat (g)', actual: 61, goal: 65, percent: (61 / 65) * 100 },
  { name: 'Fiber (g)', actual: 28, goal: 35, percent: (28 / 35) * 100 },
  { name: 'Water (L)', actual: 2.2, goal: 3, percent: (2.2 / 3) * 100 }
];

/**
 * NutritionAnalysisChart Component
 * 
 * Displays nutrition data analysis with multiple visualization options.
 */
const NutritionAnalysisChart = ({ className = '' }) => {
  // Calculate weekly averages
  const averageProtein = Math.round(nutritionData.reduce((sum, day) => sum + day.protein, 0) / nutritionData.length);
  const averageCarbs = Math.round(nutritionData.reduce((sum, day) => sum + day.carbs, 0) / nutritionData.length);
  const averageFat = Math.round(nutritionData.reduce((sum, day) => sum + day.fat, 0) / nutritionData.length);
  const averageCalories = Math.round(nutritionData.reduce((sum, day) => sum + day.calories, 0) / nutritionData.length);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Utensils className="h-5 w-5 text-emerald-500 mr-2" />
          Nutrition Analysis
        </CardTitle>
        <CardDescription>Weekly nutrition data breakdown</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="macros">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="macros" className="space-y-4">
            <div className="flex justify-between">
              <div className="text-sm font-medium">Weekly Macronutrient Breakdown</div>
              <div className="text-sm text-gray-500">7-day average</div>
            </div>
            
            {/* Macros Bar Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nutritionData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="protein" name="Protein (g)" fill="#4f46e5" />
                <Bar dataKey="carbs" name="Carbs (g)" fill="#10b981" />
                <Bar dataKey="fat" name="Fat (g)" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Macros Distribution Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-sm font-medium mb-2">Macro Distribution</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={macroBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {macroBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Weekly Averages</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Protein</span>
                    <span className="font-medium">{averageProtein}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Carbs</span>
                    <span className="font-medium">{averageCarbs}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fat</span>
                    <span className="font-medium">{averageFat}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Calories</span>
                    <span className="font-medium">{averageCalories}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calories" className="space-y-4">
            <div className="flex justify-between">
              <div className="text-sm font-medium">Daily Calorie Intake</div>
              <div className="text-sm text-gray-500">vs. Goal</div>
            </div>
            
            {/* Calories Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nutritionData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 2500]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="calories" name="Calories" fill="#8884d8" />
                <Bar dataKey="goal" name="Goal" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="bg-slate-50 p-4 rounded-lg mt-4">
              <div className="text-sm font-medium mb-2">Weekly Summary</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Daily Intake</span>
                  <span className="font-medium">{averageCalories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Goal</span>
                  <span className="font-medium">2,000 kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deficit/Surplus</span>
                  <span className={`font-medium ${averageCalories < 2000 ? 'text-amber-600' : 'text-green-600'}`}>
                    {averageCalories < 2000 ? '-' : '+'}{Math.abs(averageCalories - 2000)} kcal
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">Progress to Weekly Calorie Goal</div>
                <Progress value={(averageCalories / 2000) * 100} className="h-2" />
                <div className="text-xs text-right mt-1">{Math.round((averageCalories / 2000) * 100)}%</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-4">
            <div className="text-sm font-medium mb-4">Daily Nutrition Goals Progress</div>
            
            <div className="space-y-5">
              {nutrientGoals.map((nutrient) => (
                <div key={nutrient.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">{nutrient.name}</span>
                    <span className="text-sm font-medium">
                      {nutrient.actual} / {nutrient.goal}
                    </span>
                  </div>
                  <Progress value={nutrient.percent} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.round(nutrient.percent)}% of goal</span>
                    <span className={nutrient.percent >= 100 ? 'text-green-600' : 'text-amber-600'}>
                      {nutrient.percent >= 100 ? 'Achieved' : `${Math.round(nutrient.goal - nutrient.actual)} more needed`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <div className="text-sm font-semibold text-blue-700 mb-2">Nutrition Tips</div>
              <ul className="text-sm text-blue-600 space-y-2">
                <li className="flex">
                  <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span>Try to increase your protein intake to meet your muscle-building goals.</span>
                </li>
                <li className="flex">
                  <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span>Consider adding more fiber-rich foods to improve gut health.</span>
                </li>
                <li className="flex">
                  <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span>Your water intake is slightly below the recommended amount.</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysisChart;
