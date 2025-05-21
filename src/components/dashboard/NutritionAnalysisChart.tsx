
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  BarChart2,
  Download,
  Share,
  Info
} from 'lucide-react';
import { 
  BarChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend as RechartsLegend
} from 'recharts';

/**
 * Nutrition Analysis Chart Component
 * 
 * Displays various nutritional data visualizations to help users understand
 * their nutritional patterns and make informed dietary choices.
 */
const NutritionAnalysisChart = () => {
  // Define state and other necessary variables
  const [calorieData, setCalorieData] = useState([]); 
  const proteinPercentage = 30;
  const carbsPercentage = 45;
  const fatPercentage = 25;
  
  const handleExport = () => {
    console.log('Export feature not implemented yet');
  };
  
  const handleShare = () => {
    console.log('Share feature not implemented yet');
  };

  // Sample data for macro distribution
  const macroDistribution = [
    { name: 'Protein', value: proteinPercentage, color: '#3b82f6' },
    { name: 'Carbohydrates', value: carbsPercentage, color: '#10b981' },
    { name: 'Fat', value: fatPercentage, color: '#f59e0b' }
  ];

  // Sample data for daily calorie intake
  const dailyCalorieData = [
    { name: 'Mon', calories: 2100 },
    { name: 'Tue', calories: 2300 },
    { name: 'Wed', calories: 1950 },
    { name: 'Thu', calories: 2200 },
    { name: 'Fri', calories: 2400 },
    { name: 'Sat', calories: 2050 },
    { name: 'Sun', calories: 1850 }
  ];

  // Sample data for macronutrient breakdown
  const macroData = [
    { name: 'Mon', protein: 120, carbs: 220, fat: 65 },
    { name: 'Tue', protein: 135, carbs: 240, fat: 72 },
    { name: 'Wed', protein: 115, carbs: 180, fat: 62 },
    { name: 'Thu', protein: 125, carbs: 220, fat: 70 },
    { name: 'Fri', protein: 140, carbs: 250, fat: 75 },
    { name: 'Sat', protein: 110, carbs: 190, fat: 60 },
    { name: 'Sun', protein: 100, carbs: 170, fat: 55 }
  ];

  // Chart colors
  const chartColors = {
    protein: '#3b82f6',
    carbs: '#10b981',
    fat: '#f59e0b',
    calories: '#8b5cf6'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Nutrition Analysis</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
        <CardDescription>
          Analyze your nutritional patterns and macronutrient balance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="macros">Macronutrients</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="calories" className="space-y-4 pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyCalorieData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} kcal`, 'Calories']}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.375rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  {/* Use correct typing for Bar component */}
                  {BarChart && 
                    <BarChart.Bar
                      dataKey="calories"
                      fill={chartColors.calories}
                      radius={[4, 4, 0, 0]}
                    />
                  }
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm">Daily Average</h3>
                  <p className="text-2xl font-bold">2,121 kcal</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Target</h3>
                  <p className="text-2xl font-bold">2,200 kcal</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Weekly Total</h3>
                  <p className="text-2xl font-bold">14,850 kcal</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="macros" className="space-y-4 pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value}g`, name.charAt(0).toUpperCase() + name.slice(1)]}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '0.375rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <RechartsLegend />
                  {/* Use correct typing for Bar components */}
                  {BarChart && (
                    <>
                      <BarChart.Bar dataKey="protein" stackId="a" fill={chartColors.protein} name="Protein" />
                      <BarChart.Bar dataKey="carbs" stackId="a" fill={chartColors.carbs} name="Carbs" />
                      <BarChart.Bar dataKey="fat" stackId="a" fill={chartColors.fat} name="Fat" />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <h3 className="font-medium text-sm inline">Protein</h3>
                  <p className="text-xl font-bold">121g</p>
                </div>
                <div className="text-center">
                  <div className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <h3 className="font-medium text-sm inline">Carbs</h3>
                  <p className="text-xl font-bold">210g</p>
                </div>
                <div className="text-center">
                  <div className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <h3 className="font-medium text-sm inline">Fat</h3>
                  <p className="text-xl font-bold">65g</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4 pt-4">
            <div className="flex justify-center items-center h-80">
              <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Protein: {proteinPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Target: 30%</span>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${proteinPercentage}%` }}></div>
                </div>

                <div className="flex justify-between items-center mb-2 mt-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Carbs: {carbsPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Target: 45%</span>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${carbsPercentage}%` }}></div>
                </div>

                <div className="flex justify-between items-center mb-2 mt-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Fat: {fatPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Target: 25%</span>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${fatPercentage}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Macro Distribution</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your current macronutrient ratio is {proteinPercentage}/{carbsPercentage}/{fatPercentage} (protein/carbs/fat), which is aligned with your fitness goals.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysisChart;
