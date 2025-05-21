import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  Egg, 
  Beef, 
  Wheat, 
  Download,
  Share2,
  Info
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Progress } from "@/components/ui/progress";

interface NutritionAnalysisChartProps {
  /** Optional className for styling */
  className?: string;
  /** Time range for data display */
  timeRange?: 'week' | 'month' | '3months' | 'year';
  /** Callback when time range changes */
  onTimeRangeChange?: (range: 'week' | 'month' | '3months' | 'year') => void;
  /** Whether to enable export functionality */
  enableExport?: boolean;
  /** Whether to enable sharing functionality */
  enableSharing?: boolean;
}

/**
 * Nutrition Analysis Chart Component
 * 
 * Provides detailed visualization of nutrition data including:
 * - Macronutrient breakdown and trends
 * - Calorie tracking
 * - Meal pattern analysis
 * - Nutrient quality scoring
 * - Hydration tracking
 */
const NutritionAnalysisChart = ({ 
  className = '',
  timeRange = 'week',
  onTimeRangeChange,
  enableExport = false,
  enableSharing = false
}: NutritionAnalysisChartProps) => {
  const [activeTab, setActiveTab] = useState('macros');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | '3months' | 'year'>(timeRange);
  const [macroData, setMacroData] = useState<any[]>([]);
  const [mealPatternData, setMealPatternData] = useState<any[]>([]);
  const [nutrientQualityData, setNutrientQualityData] = useState<any[]>([]);
  const [hydrationData, setHydrationData] = useState<any[]>([]);
  const [nutritionMetrics, setNutritionMetrics] = useState({
    calorieAverage: 0,
    proteinAverage: 0,
    carbsAverage: 0,
    fatAverage: 0,
    waterAverage: 0,
    nutrientScore: 0
  });
  
  // Handle time range change
  const handleTimeRangeChange = (range: 'week' | 'month' | '3months' | 'year') => {
    setSelectedTimeRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };
  
  // Generate mock data for visualization
  useEffect(() => {
    generateNutritionData();
  }, [selectedTimeRange]);
  
  // Generate nutrition data for visualization
  const generateNutritionData = () => {
    // In a real app, this would process actual nutrition data
    // For demo purposes, we'll generate mock data
    
    // Determine number of data points based on time range
    let dataPoints = 7; // week
    let interval = 'day';
    
    if (selectedTimeRange === 'month') {
      dataPoints = 30;
      interval = 'day';
    } else if (selectedTimeRange === '3months') {
      dataPoints = 12;
      interval = 'week';
    } else if (selectedTimeRange === 'year') {
      dataPoints = 12;
      interval = 'month';
    }
    
    // Generate macro data
    const macroTrendData = [];
    const calorieTrendData = [];
    const hydrationTrendData = [];
    
    // Target values
    const calorieTarget = 2400;
    const proteinTarget = 180;
    const carbsTarget = 240;
    const fatTarget = 80;
    const waterTarget = 3.0;
    
    // Running totals for averages
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalWater = 0;
    
    // Generate data points
    for (let i = 0; i < dataPoints; i++) {
      // Format label based on interval
      let label = '';
      if (interval === 'day') {
        label = `Day ${i + 1}`;
      } else if (interval === 'week') {
        label = `Week ${i + 1}`;
      } else {
        label = `Month ${i + 1}`;
      }
      
      // Generate protein data with slight variations
      const baseProtein = 170 + (Math.random() * 40 - 20);
      const protein = Math.max(100, Math.min(220, baseProtein));
      
      // Generate carbs data with slight variations
      const baseCarbs = 230 + (Math.random() * 60 - 30);
      const carbs = Math.max(150, Math.min(300, baseCarbs));
      
      // Generate fat data with slight variations
      const baseFat = 75 + (Math.random() * 20 - 10);
      const fat = Math.max(50, Math.min(100, baseFat));
      
      // Calculate calories
      const calories = (protein * 4) + (carbs * 4) + (fat * 9);
      
      // Generate water intake with slight variations
      const baseWater = 2.8 + (Math.random() * 0.8 - 0.4);
      const water = Math.max(1.5, Math.min(4.0, baseWater));
      
      // Add to running totals
      totalCalories += calories;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;
      totalWater += water;
      
      // Add to macro data
      macroTrendData.push({
        date: label,
        protein,
        carbs,
        fat,
        proteinTarget,
        carbsTarget,
        fatTarget
      });
      
      // Add to calorie data
      calorieTrendData.push({
        date: label,
        calories,
        target: calorieTarget
      });
      
      // Add to hydration data
      hydrationTrendData.push({
        date: label,
        water,
        target: waterTarget
      });
    }
    
    // Calculate averages
    const calorieAverage = Math.round(totalCalories / dataPoints);
    const proteinAverage = Math.round(totalProtein / dataPoints);
    const carbsAverage = Math.round(totalCarbs / dataPoints);
    const fatAverage = Math.round(totalFat / dataPoints);
    const waterAverage = parseFloat((totalWater / dataPoints).toFixed(1));
    
    // Generate meal pattern data
    const mealPatternData = [
      { name: 'Breakfast', value: 25, color: '#3b82f6' },
      { name: 'Lunch', value: 30, color: '#10b981' },
      { name: 'Dinner', value: 35, color: '#f59e0b' },
      { name: 'Snacks', value: 10, color: '#8b5cf6' }
    ];
    
    // Generate nutrient quality data
    const nutrientQualityData = [
      { nutrient: 'Protein', score: 85 },
      { nutrient: 'Fiber', score: 70 },
      { nutrient: 'Vitamins', score: 75 },
      { nutrient: 'Minerals', score: 80 },
      { nutrient: 'Healthy Fats', score: 65 },
      { nutrient: 'Antioxidants', score: 60 }
    ];
    
    // Set data
    setMacroData(macroTrendData);
    setCalorieData(calorieTrendData);
    setMealPatternData(mealPatternData);
    setNutrientQualityData(nutrientQualityData);
    setHydrationData(hydrationTrendData);
    
    // Calculate nutrition metrics
    setNutritionMetrics({
      calorieAverage,
      proteinAverage,
      carbsAverage,
      fatAverage,
      waterAverage,
      nutrientScore: 75
    });
  };
  
  return (
    <Card className={className}>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-green-600" />
            <CardTitle className="text-xl">Nutrition Analysis</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant={selectedTimeRange === 'week' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => handleTimeRangeChange('week')}
            >
              Week
            </Button>
            <Button 
              variant={selectedTimeRange === 'month' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => handleTimeRangeChange('month')}
            >
              Month
            </Button>
            <Button 
              variant={selectedTimeRange === '3months' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => handleTimeRangeChange('3months')}
            >
              3M
            </Button>
            <Button 
              variant={selectedTimeRange === 'year' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => handleTimeRangeChange('year')}
            >
              Year
            </Button>
          </div>
        </div>
        <CardDescription>
          Track your nutrition metrics and dietary patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="macros" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Macros
            </TabsTrigger>
            <TabsTrigger 
              value="calories" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Calories
            </TabsTrigger>
            <TabsTrigger 
              value="meals" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Meal Patterns
            </TabsTrigger>
            <TabsTrigger 
              value="quality" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Nutrient Quality
            </TabsTrigger>
            <TabsTrigger 
              value="hydration" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Hydration
            </TabsTrigger>
          </TabsList>
          
          {/* Macros Tab */}
          <TabsContent value="macros" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Egg className="h-4 w-4 mr-1 text-blue-500" />
                  <div className="text-sm text-gray-500">Protein</div>
                </div>
                <div className="text-2xl font-bold">{nutritionMetrics.proteinAverage}g</div>
                <div className="text-xs text-gray-500 mt-1">{proteinPercentage}% of total calories</div>
                <Progress value={(nutritionMetrics.proteinAverage / 180) * 100} className="h-1.5 mt-2" />
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Wheat className="h-4 w-4 mr-1 text-green-500" />
                  <div className="text-sm text-gray-500">Carbs</div>
                </div>
                <div className="text-2xl font-bold">{nutritionMetrics.carbsAverage}g</div>
                <div className="text-xs text-gray-500 mt-1">{carbsPercentage}% of total calories</div>
                <Progress value={(nutritionMetrics.carbsAverage / 240) * 100} className="h-1.5 mt-2" />
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Beef className="h-4 w-4 mr-1 text-amber-500" />
                  <div className="text-sm text-gray-500">Fat</div>
                </div>
                <div className="text-2xl font-bold">{nutritionMetrics.fatAverage}g</div>
                <div className="text-xs text-gray-500 mt-1">{fatPercentage}% of total calories</div>
                <Progress value={(nutritionMetrics.fatAverage / 80) * 100} className="h-1.5 mt-2" />
              </div>
            </div>
            
            <div className="h-[300px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}g`, '']} />
                  <Legend />
                  <Bar dataKey="protein" name="Protein" fill="#3b82f6" />
                  <Bar dataKey="carbs" name="Carbs" fill="#10b981" />
                  <Bar dataKey="fat" name="Fat" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Macronutrient Balance</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your current macronutrient distribution is {proteinPercentage}% protein, {carbsPercentage}% carbs, and {fatPercentage}% fat. 
                    This is close to the recommended distribution for your goals. Consider slightly increasing protein intake for optimal muscle recovery.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      {(enableExport || enableSharing) && (
        <CardFooter className="bg-slate-50 dark:bg-slate-800 border-t p-4">
          <div className="flex justify-end space-x-2 w-full">
            {enableExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
            {enableSharing && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default NutritionAnalysisChart;
