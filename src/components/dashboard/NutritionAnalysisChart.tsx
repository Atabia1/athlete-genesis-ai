
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, PieChart, LineChart } from 'recharts';
import { 
  BarChart as RechartsBarChart,
  Bar,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart, 
  Pie
} from 'recharts';
import { Apple, Coffee, Droplets, TrendingUp, Calendar, Clock } from 'lucide-react';

/**
 * NutritionAnalysisChart Component
 * 
 * A comprehensive chart that visualizes nutrition data in various formats.
 */
const NutritionAnalysisChart = ({ className = "" }) => {
  // Define state variables
  const proteinPercentage = 30;
  const carbsPercentage = 45;
  const fatPercentage = 25;
  
  const handleExport = () => {
    console.log('Export feature not implemented yet');
  };
  
  const handleShare = () => {
    console.log('Share feature not implemented yet');
  };

  // Sample nutrition data
  const macroDistributionData = [
    { name: 'Protein', value: proteinPercentage, color: '#4f46e5' },
    { name: 'Carbs', value: carbsPercentage, color: '#06b6d4' },
    { name: 'Fat', value: fatPercentage, color: '#f97316' }
  ];

  const dailyNutrientData = [
    { name: 'Mon', calories: 2100, protein: 130, carbs: 210, fat: 70 },
    { name: 'Tue', calories: 1950, protein: 125, carbs: 190, fat: 65 },
    { name: 'Wed', calories: 2200, protein: 140, carbs: 220, fat: 75 },
    { name: 'Thu', calories: 2000, protein: 130, carbs: 200, fat: 65 },
    { name: 'Fri', calories: 2300, protein: 145, carbs: 240, fat: 80 },
    { name: 'Sat', calories: 1800, protein: 100, carbs: 190, fat: 60 },
    { name: 'Sun', calories: 1700, protein: 95, carbs: 170, fat: 55 }
  ];

  const mealTimeData = [
    { name: 'Breakfast', calories: 450, protein: 25, carbs: 50, fat: 15 },
    { name: 'Morning Snack', calories: 200, protein: 10, carbs: 25, fat: 5 },
    { name: 'Lunch', calories: 650, protein: 40, carbs: 70, fat: 20 },
    { name: 'Afternoon Snack', calories: 200, protein: 15, carbs: 20, fat: 5 },
    { name: 'Dinner', calories: 600, protein: 35, carbs: 60, fat: 20 },
    { name: 'Evening Snack', calories: 150, protein: 5, carbs: 15, fat: 5 }
  ];

  const nutrientQualityData = [
    { name: 'Fiber', value: 85, full: 100 },
    { name: 'Vitamin A', value: 70, full: 100 },
    { name: 'Vitamin C', value: 90, full: 100 },
    { name: 'Calcium', value: 65, full: 100 },
    { name: 'Iron', value: 75, full: 100 },
    { name: 'Potassium', value: 60, full: 100 }
  ];

  // Custom tooltip formatter
  const tooltipFormatter = (value, name) => {
    switch (name) {
      case 'protein':
        return [`${value}g`, 'Protein'];
      case 'carbs':
        return [`${value}g`, 'Carbohydrates'];
      case 'fat':
        return [`${value}g`, 'Fat'];
      case 'calories':
        return [`${value} kcal`, 'Calories'];
      default:
        return [`${value}g`, typeof name === "string" ? name.charAt(0).toUpperCase() + name.slice(1) : String(name)];
    }
  };

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${macroDistributionData[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Apple className="h-5 w-5 text-green-500" />
              Nutrition Analysis
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your nutritional intake and patterns
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="macros">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="daily">Daily Intake</TabsTrigger>
            <TabsTrigger value="meals">Meal Analysis</TabsTrigger>
            <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
          </TabsList>
          
          {/* Macronutrient Distribution Tab */}
          <TabsContent value="macros" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-700 font-medium">Protein</div>
                <div className="text-2xl font-bold text-blue-800">{proteinPercentage}%</div>
                <div className="text-sm text-blue-600">130g daily avg</div>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <div className="text-cyan-700 font-medium">Carbs</div>
                <div className="text-2xl font-bold text-cyan-800">{carbsPercentage}%</div>
                <div className="text-sm text-cyan-600">225g daily avg</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-orange-700 font-medium">Fat</div>
                <div className="text-2xl font-bold text-orange-800">{fatPercentage}%</div>
                <div className="text-sm text-orange-600">70g daily avg</div>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={macroDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {macroDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Recommended Split</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Protein: 25-30%</span>
                  <span className={proteinPercentage >= 25 && proteinPercentage <= 30 ? "text-green-600" : "text-amber-600"}>
                    {proteinPercentage >= 25 && proteinPercentage <= 30 ? "✓ On target" : "! Adjustment needed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Carbs: 45-55%</span>
                  <span className={carbsPercentage >= 45 && carbsPercentage <= 55 ? "text-green-600" : "text-amber-600"}>
                    {carbsPercentage >= 45 && carbsPercentage <= 55 ? "✓ On target" : "! Adjustment needed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fat: 20-35%</span>
                  <span className={fatPercentage >= 20 && fatPercentage <= 35 ? "text-green-600" : "text-amber-600"}>
                    {fatPercentage >= 20 && fatPercentage <= 35 ? "✓ On target" : "! Adjustment needed"}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Daily Nutrient Intake Tab */}
          <TabsContent value="daily">
            <div className="flex justify-between items-center mb-4">
              <Select defaultValue="week">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex space-x-2 text-sm">
                <Button variant="ghost" size="sm" className="h-8 text-blue-600">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
                  Protein
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-cyan-600">
                  <div className="w-3 h-3 bg-cyan-600 rounded-full mr-1"></div>
                  Carbs
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-orange-600">
                  <div className="w-3 h-3 bg-orange-600 rounded-full mr-1"></div>
                  Fat
                </Button>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={dailyNutrientData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={tooltipFormatter} />
                  <Bar dataKey="protein" fill="#4f46e5" />
                  <Bar dataKey="carbs" fill="#06b6d4" />
                  <Bar dataKey="fat" fill="#f97316" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-700 font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Daily Average
                </div>
                <div className="mt-1">
                  <div className="flex justify-between text-sm">
                    <span>Calories:</span>
                    <span className="font-medium">2007 kcal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Protein:</span>
                    <span className="font-medium">124g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Carbs:</span>
                    <span className="font-medium">204g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fat:</span>
                    <span className="font-medium">67g</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-700 font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Weekly Trend
                </div>
                <div className="mt-1">
                  <div className="flex justify-between text-sm">
                    <span>Calories:</span>
                    <span className="text-green-600">↑ 3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Protein:</span>
                    <span className="text-green-600">↑ 5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Carbs:</span>
                    <span className="text-amber-600">↑ 7%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fat:</span>
                    <span className="text-red-600">↓ 2%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Meal Analysis Tab */}
          <TabsContent value="meals">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={mealTimeData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={tooltipFormatter} />
                  <Legend />
                  <Bar dataKey="protein" fill="#4f46e5" />
                  <Bar dataKey="carbs" fill="#06b6d4" />
                  <Bar dataKey="fat" fill="#f97316" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Meal Distribution</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-sm">Breakfast</span>
                  </div>
                  <div className="text-sm font-medium">450 kcal (20%)</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span className="text-sm">Morning Snack</span>
                  </div>
                  <div className="text-sm font-medium">200 kcal (9%)</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                    <span className="text-sm">Lunch</span>
                  </div>
                  <div className="text-sm font-medium">650 kcal (29%)</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                    <span className="text-sm">Afternoon Snack</span>
                  </div>
                  <div className="text-sm font-medium">200 kcal (9%)</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                    <span className="text-sm">Dinner</span>
                  </div>
                  <div className="text-sm font-medium">600 kcal (27%)</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                    <span className="text-sm">Evening Snack</span>
                  </div>
                  <div className="text-sm font-medium">150 kcal (7%)</div>
                </div>
              </div>
              
              <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-800 font-medium flex items-center">
                  <Coffee className="h-4 w-4 mr-1" />
                  Meal Timing Analysis
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  Your meal timing is well distributed throughout the day. Continue having regular meals to maintain stable energy levels.
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Nutrient Quality Tab */}
          <TabsContent value="nutrients">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <div className="text-emerald-700 font-medium">Nutrient Score</div>
                <div className="text-2xl font-bold text-emerald-800">76<span className="text-base">/100</span></div>
                <div className="text-sm text-emerald-600">Good quality intake</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-700 font-medium flex items-center">
                  <Droplets className="h-4 w-4 mr-1" />
                  Hydration
                </div>
                <div className="text-2xl font-bold text-blue-800">2.1<span className="text-base">L</span></div>
                <div className="text-sm text-blue-600">85% of daily goal</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              {nutrientQualityData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 ${item.value >= 75 ? 'bg-green-500' : item.value >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-amber-800 font-medium">Improvement Areas</div>
              <ul className="list-disc list-inside text-sm text-amber-700 mt-1">
                <li>Increase calcium intake with more dairy or fortified plant milks</li>
                <li>Add more potassium-rich foods like bananas and potatoes</li>
                <li>Consider a vitamin D supplement during winter months</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NutritionAnalysisChart;
