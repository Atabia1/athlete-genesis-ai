
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, Utensils, ChevronRight, ArrowUpRight, Flame, Salad } from 'lucide-react';
import { useNetworkStatus } from "@/hooks/use-network-status";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { OfflineContentBadge } from "@/components/ui/offline-content-badge";
import {
  ResponsiveContainer, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  TooltipProps
} from 'recharts';

/**
 * Nutrition Analysis Chart Component
 * 
 * This component visualizes nutrition data using various chart types
 * and provides insights about the user's nutritional intake.
 */
const NutritionAnalysisChart = () => {
  const { isOnline } = useNetworkStatus();
  const [activeTab, setActiveTab] = useState('calories');

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

  // Sample nutritional data for demos
  const nutrientData = [
    { name: 'Mon', calories: 1850, protein: 98, carbs: 220, fat: 55 },
    { name: 'Tue', calories: 2100, protein: 120, carbs: 180, fat: 62 },
    { name: 'Wed', calories: 1920, protein: 105, carbs: 195, fat: 58 },
    { name: 'Thu', calories: 2350, protein: 135, carbs: 230, fat: 70 },
    { name: 'Fri', calories: 2000, protein: 115, carbs: 200, fat: 60 },
    { name: 'Sat', calories: 2200, protein: 125, carbs: 210, fat: 65 },
    { name: 'Sun', calories: 1800, protein: 95, carbs: 175, fat: 53 },
  ];
  
  const macroDistribution = [
    { name: 'Protein', value: proteinPercentage, color: '#3b82f6' },
    { name: 'Carbs', value: carbsPercentage, color: '#10b981' },
    { name: 'Fat', value: fatPercentage, color: '#f59e0b' }
  ];
  
  // Format tooltip for charts
  const formatTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center text-sm">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span>
                {entry.name}: {entry.value}
                {entry.name.toString().toLowerCase() === 'calories' ? '' : 'g'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="relative overflow-hidden">
      {!isOnline && <OfflineContentBadge contentType="nutrition data" position="top-right" />}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-blue-600" />
            Nutrition Analysis
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={handleShare}
            >
              Share
            </Button>
            {!isOnline && (
              <OfflineIndicator
                variant="badge"
                featureSpecific={true}
                featureName="Nutrition data"
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="macros">Macronutrients</TabsTrigger>
            <TabsTrigger value="meals">Meal Pattern</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calories" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutrientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={formatTooltip} />
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <BarChart.Bar
                    dataKey="calories"
                    name="Calories"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm text-gray-500">Daily Average</div>
                <div className="text-2xl font-bold flex items-center">
                  2,031
                  <span className="text-xs text-green-600 ml-2 font-normal flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +3%
                  </span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm text-gray-500">Weekly Target</div>
                <div className="text-2xl font-bold flex items-center">
                  14,000
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm text-gray-500">Weekly Total</div>
                <div className="text-2xl font-bold flex items-center">
                  14,220
                  <span className="text-xs text-blue-600 ml-2 font-normal flex items-center">
                    On track
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="macros" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-blue-800">Protein</div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">
                    {proteinPercentage}%
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${proteinPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  Building and repairing tissues
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-green-800">Carbs</div>
                  <div className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded">
                    {carbsPercentage}%
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${carbsPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  Primary energy source
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-amber-800">Fat</div>
                  <div className="bg-amber-100 text-amber-800 text-xs font-medium py-1 px-2 rounded">
                    {fatPercentage}%
                  </div>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2.5">
                  <div
                    className="bg-amber-600 h-2.5 rounded-full"
                    style={{ width: `${fatPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-amber-600 mt-2">
                  Hormone function and nutrient absorption
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">Current Macronutrient Balance</div>
              <div className="flex h-5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600"
                  style={{ width: `${proteinPercentage}%` }}
                ></div>
                <div
                  className="bg-green-600"
                  style={{ width: `${carbsPercentage}%` }}
                ></div>
                <div
                  className="bg-amber-600"
                  style={{ width: `${fatPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                  <span>Protein</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                  <span>Carbs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-1"></div>
                  <span>Fat</span>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {nutrientData.slice(-3).map((day, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border">
                  <div className="text-sm font-medium mb-1">{day.name}</div>
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    <div className="text-xs text-blue-600">{day.protein}g</div>
                    <div className="text-xs text-green-600">{day.carbs}g</div>
                    <div className="text-xs text-amber-600">{day.fat}g</div>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600"
                      style={{
                        width: `${Math.round(
                          (day.protein / (day.protein + day.carbs + day.fat)) * 100
                        )}%`,
                      }}
                    ></div>
                    <div
                      className="bg-green-600"
                      style={{
                        width: `${Math.round(
                          (day.carbs / (day.protein + day.carbs + day.fat)) * 100
                        )}%`,
                      }}
                    ></div>
                    <div
                      className="bg-amber-600"
                      style={{
                        width: `${Math.round(
                          (day.fat / (day.protein + day.carbs + day.fat)) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="meals" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-3">Meal Frequency</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full mr-2">
                        <Flame className="h-4 w-4" />
                      </span>
                      <span className="text-sm">Breakfast</span>
                    </div>
                    <div className="text-sm font-medium">95%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full mr-2">
                        <Utensils className="h-4 w-4" />
                      </span>
                      <span className="text-sm">Lunch</span>
                    </div>
                    <div className="text-sm font-medium">100%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2">
                        <Heart className="h-4 w-4" />
                      </span>
                      <span className="text-sm">Snacks</span>
                    </div>
                    <div className="text-sm font-medium">80%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full mr-2">
                        <Salad className="h-4 w-4" />
                      </span>
                      <span className="text-sm">Dinner</span>
                    </div>
                    <div className="text-sm font-medium">100%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-3">Meal Distribution</div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Breakfast</span>
                      <span className="text-xs font-medium text-amber-600">25%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Avg. 530 kcal</span>
                      <span>•</span>
                      <span>32g protein</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Lunch</span>
                      <span className="text-xs font-medium text-green-600">35%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Avg. 720 kcal</span>
                      <span>•</span>
                      <span>45g protein</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Snacks</span>
                      <span className="text-xs font-medium text-blue-600">10%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Avg. 210 kcal</span>
                      <span>•</span>
                      <span>8g protein</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Dinner</span>
                      <span className="text-xs font-medium text-purple-600">30%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Avg. 650 kcal</span>
                      <span>•</span>
                      <span>40g protein</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <div className="text-sm font-medium mb-2">Nutritionist's Insight</div>
          <p className="text-sm text-gray-600">
            Your macronutrient distribution is well-balanced for an active individual. Consider increasing protein intake slightly on training days to support muscle recovery and maintaining hydration throughout the day.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysisChart;
