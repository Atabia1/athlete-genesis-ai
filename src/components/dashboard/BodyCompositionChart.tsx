import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Ruler, 
  Activity, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Area
} from 'recharts';
import { HealthData } from '@/integrations/health-apps/types';

interface BodyCompositionChartProps {
  /** Health data to visualize */
  healthData: HealthData;
  /** Optional className for styling */
  className?: string;
}

/**
 * Body Composition Chart Component
 * 
 * Visualizes body composition metrics including weight, BMI, and body fat percentage
 */
const BodyCompositionChart = ({ healthData, className = '' }: BodyCompositionChartProps) => {
  const [activeTab, setActiveTab] = useState('weight');
  const [timeRange, setTimeRange] = useState<'month' | '3months' | 'year'>('month');
  const [weightData, setWeightData] = useState<any[]>([]);
  const [bmiData, setBmiData] = useState<any[]>([]);
  const [bodyFatData, setBodyFatData] = useState<any[]>([]);
  const [ setBodyCompositionData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate body composition data for visualization
    generateBodyCompositionData();
  }, [healthData, timeRange]);
  
  // Generate mock body composition data for visualization
  const generateBodyCompositionData = () => {
    // Get date ranges based on selected time range
    const today = new Date();
    let days = 30;
    let interval = 1;
    
    if (timeRange === '3months') {
      days = 90;
      interval = 3;
    } else if (timeRange === 'year') {
      days = 365;
      interval = 7;
    }
    
    // Generate weight data
    const weightHistory = [];
    const bmiHistory = [];
    const bodyFatHistory = [];
    const compositionHistory = [];
    
    // Current weight from health data or default
    const currentWeight = healthData.weight || 70;
    
    // Calculate BMI if height is available
    const height = healthData.height || 170;
    const heightInMeters = height / 100;
    const currentBmi = currentWeight / (heightInMeters * heightInMeters);
    
    // Generate random body fat percentage (for demo)
    const currentBodyFat = Math.floor(Math.random() * 10) + 15; // 15-25%
    
    // Generate data points
    for (let i = Math.floor(days / interval); i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - (i * interval));
      
      // Format date label
      let dateLabel = '';
      if (timeRange === 'month') {
        dateLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else if (timeRange === '3months') {
        dateLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        dateLabel = date.toLocaleDateString([], { month: 'short' });
      }
      
      // Generate weight with small variations
      // Use actual data for the most recent point if available
      let weight = 0;
      let bmi = 0;
      let bodyFat = 0;
      
      if (i === 0 && healthData.weight) {
        weight = healthData.weight;
        bmi = currentBmi;
        bodyFat = currentBodyFat;
      } else {
        // Generate random variations for historical data
        const variation = (Math.random() * 2 - 1) * 0.5; // -0.5 to +0.5 kg
        weight = currentWeight - (i * 0.1) + variation; // Slight downward trend
        
        // Calculate BMI
        bmi = weight / (heightInMeters * heightInMeters);
        
        // Generate body fat with small variations
        const fatVariation = (Math.random() * 2 - 1) * 0.3; // -0.3 to +0.3 %
        bodyFat = currentBodyFat - (i * 0.05) + fatVariation; // Slight downward trend
      }
      
      // Add to weight data
      weightHistory.push({
        date: dateLabel,
        weight: parseFloat(weight.toFixed(1)) });
      
      // Add to BMI data
      bmiHistory.push({
        date: dateLabel,
        bmi: parseFloat(bmi.toFixed(1)) });
      
      // Add to body fat data
      bodyFatHistory.push({
        date: dateLabel,
        bodyFat: parseFloat(bodyFat.toFixed(1)) });
      
      // Add to composition data (only for selected points to avoid overcrowding)
      if (i % 3 === 0 || i === 0) {
        compositionHistory.push({
          date: dateLabel,
          weight: parseFloat(weight.toFixed(1)),
          bmi: parseFloat(bmi.toFixed(1)),
          bodyFat: parseFloat(bodyFat.toFixed(1)) });
      }
    }
    
    setWeightData(weightHistory);
    setBmiData(bmiHistory);
    setBodyFatData(bodyFatHistory);
    setBodyCompositionData(compositionHistory);
  };
  
  // Calculate BMI category
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
  };
  
  // Calculate current BMI
  const calculateBmi = () => {
    if (!healthData.weight || !healthData.height) return null;
    
    const heightInMeters = healthData.height / 100;
    return healthData.weight / (heightInMeters * heightInMeters);
  };
  
  // Get current BMI
  const currentBmi = calculateBmi();
  
  // Get BMI category
  const bmiCategory = currentBmi ? getBmiCategory(currentBmi) : null;
  
  // Generate body composition pie chart data
  const generateBodyCompositionPieData = () => {
    // This would normally use real data, but for demo we'll use estimates
    const bodyFatPercentage = 20; // Example value
    const muscleMassPercentage = 45; // Example value
    const waterPercentage = 30; // Example value
    const bonePercentage = 5; // Example value
    
    return [
      { name: 'Body Fat', value: bodyFatPercentage, color: '#FF8A65' },
      { name: 'Muscle Mass', value: muscleMassPercentage, color: '#5C6BC0' },
      { name: 'Water', value: waterPercentage, color: '#4FC3F7' },
      { name: 'Bone', value: bonePercentage, color: '#AED581' },
    ];
  };
  
  const bodyCompositionPieData = generateBodyCompositionPieData();
  
  // Colors for pie chart
  
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Scale className="h-5 w-5 mr-2 text-blue-500" />
            Body Composition
          </CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant={timeRange === 'month' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              1M
            </Button>
            <Button 
              variant={timeRange === '3months' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('3months')}
            >
              3M
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              1Y
            </Button>
          </div>
        </div>
        <CardDescription>
          Track your weight, BMI, and body composition metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="weight" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Weight
            </TabsTrigger>
            <TabsTrigger 
              value="bmi" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              BMI
            </TabsTrigger>
            <TabsTrigger 
              value="composition" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Composition
            </TabsTrigger>
          </TabsList>
          
          {/* Weight Tab */}
          <TabsContent value="weight" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Current Weight</div>
                <div className="text-2xl font-bold">
                  {healthData.weight ? `${healthData.weight.toFixed(1)} kg` : 'N/A'}
                </div>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-xs text-green-500">
                    0.5 kg less than last month
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Height</div>
                <div className="text-2xl font-bold">
                  {healthData.height ? `${healthData.height} cm` : 'N/A'}
                </div>
                <div className="flex items-center mt-1">
                  <Ruler className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {healthData.height ? `${(healthData.height / 100).toFixed(2)} m` : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">BMI</div>
                <div className="text-2xl font-bold">
                  {currentBmi ? currentBmi.toFixed(1) : 'N/A'}
                </div>
                <div className="flex items-center mt-1">
                  {bmiCategory && (
                    <>
                      <div className={`h-2 w-2 rounded-full ${bmiCategory.color.replace('text-', 'bg-')} mr-1`}></div>
                      <span className={`text-xs ${bmiCategory.color}`}>
                        {bmiCategory.category}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Weight']} />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3F51B5" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Weight Insight</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {currentBmi && currentBmi < 18.5 && 
                      "You're currently underweight. Consider consulting with a nutritionist to develop a healthy weight gain plan."}
                    {currentBmi && currentBmi >= 18.5 && currentBmi < 25 && 
                      "Your weight is in the healthy range. Keep maintaining your balanced diet and exercise routine."}
                    {currentBmi && currentBmi >= 25 && currentBmi < 30 && 
                      "You're slightly overweight. Consider increasing physical activity and reviewing your nutrition."}
                    {currentBmi && currentBmi >= 30 && 
                      "Your BMI indicates obesity. Consider consulting with a healthcare provider for a personalized weight management plan."}
                    {!currentBmi && 
                      "Add your weight and height measurements to get personalized insights."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* BMI Tab */}
          <TabsContent value="bmi" className="p-6">
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={bmiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip formatter={(value) => [`${value}`, 'BMI']} />
                  <Line 
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="#FF5722" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  {/* BMI category reference lines */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 18.5} 
                    stroke="#2196F3" 
                    strokeDasharray="3 3"
                    dot={false}
                    name="Underweight Threshold"
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 25} 
                    stroke="#4CAF50" 
                    strokeDasharray="3 3"
                    dot={false}
                    name="Overweight Threshold"
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 30} 
                    stroke="#F44336" 
                    strokeDasharray="3 3"
                    dot={false}
                    name="Obesity Threshold"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-center">
                <div className="text-xs text-blue-500 font-medium">Underweight</div>
                <div className="text-xs text-gray-500">&lt; 18.5</div>
              </div>
              
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-center">
                <div className="text-xs text-green-500 font-medium">Normal</div>
                <div className="text-xs text-gray-500">18.5 - 24.9</div>
              </div>
              
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-center">
                <div className="text-xs text-yellow-500 font-medium">Overweight</div>
                <div className="text-xs text-gray-500">25 - 29.9</div>
              </div>
              
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-center">
                <div className="text-xs text-red-500 font-medium">Obese</div>
                <div className="text-xs text-gray-500">&gt; 30</div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">What is BMI?</h4>
              <p className="text-xs text-gray-500">
                Body Mass Index (BMI) is a value derived from the mass (weight) and height of a person. 
                It is defined as the body mass divided by the square of the body height, and is expressed in units of kg/m².
                While BMI is a useful screening tool, it does not directly measure body fat or account for muscle mass.
              </p>
            </div>
          </TabsContent>
          
          {/* Composition Tab */}
          <TabsContent value="composition" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Body Composition Breakdown</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={bodyCompositionPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bodyCompositionPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Body Fat Percentage</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={bodyFatData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Body Fat']} />
                      <Line 
                        type="monotone" 
                        dataKey="bodyFat" 
                        stroke="#FF8A65" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium mb-2">Body Composition Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div>
                  <div className="text-xs text-gray-500">Body Fat</div>
                  <div className="text-lg font-bold">20%</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500">Muscle Mass</div>
                  <div className="text-lg font-bold">45%</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500">Water</div>
                  <div className="text-lg font-bold">30%</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500">Bone Mass</div>
                  <div className="text-lg font-bold">5%</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Composition Insight</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Body composition is more important than weight alone. Focus on maintaining or increasing muscle mass while reducing body fat for optimal health.
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

export default BodyCompositionChart;
