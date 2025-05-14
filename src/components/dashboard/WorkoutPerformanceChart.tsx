import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  TrendingUp, 
  Dumbbell, 
  Calendar, 
  Clock, 
  Activity, 
  Heart, 
  Zap, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  Share2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  ReferenceLine,
  Scatter
} from 'recharts';
import { WorkoutSession } from '@/types/workout';

interface WorkoutPerformanceChartProps {
  /** Workout sessions data */
  workoutSessions?: WorkoutSession[];
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
 * Workout Performance Chart Component
 * 
 * Provides detailed visualization of workout performance metrics including:
 * - Strength progression
 * - Volume and intensity trends
 * - Exercise-specific performance
 * - Workout consistency
 */
const WorkoutPerformanceChart = ({ 
  workoutSessions = [], 
  className = '',
  timeRange = 'month',
  onTimeRangeChange,
  enableExport = false,
  enableSharing = false
}: WorkoutPerformanceChartProps) => {
  const [activeTab, setActiveTab] = useState('strength');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | '3months' | 'year'>(timeRange);
  const [strengthData, setStrengthData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [consistencyData, setConsistencyData] = useState<any[]>([]);
  const [exerciseData, setExerciseData] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    avgIntensity: 0,
    strengthProgress: 0,
    consistencyScore: 0
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
    generatePerformanceData();
  }, [workoutSessions, selectedTimeRange]);
  
  // Generate performance data for visualization
  const generatePerformanceData = () => {
    // In a real app, this would process actual workout session data
    // For demo purposes, we'll generate mock data
    
    // Generate strength progression data
    const strengthProgressionData = [];
    const volumeProgressionData = [];
    const consistencyProgressionData = [];
    
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
      
      // Generate strength data with upward trend
      const baseStrength = 60 + (i * 1.5);
      const strengthVariation = Math.random() * 10 - 5;
      const strength = Math.max(0, Math.min(100, baseStrength + strengthVariation));
      
      // Generate volume data with slight upward trend
      const baseVolume = 2000 + (i * 50);
      const volumeVariation = Math.random() * 500 - 250;
      const volume = Math.max(0, baseVolume + volumeVariation);
      
      // Generate intensity data
      const baseIntensity = 70 + (i * 0.5);
      const intensityVariation = Math.random() * 10 - 5;
      const intensity = Math.max(0, Math.min(100, baseIntensity + intensityVariation));
      
      // Generate consistency data (workout completion rate)
      const baseConsistency = 80 + (i * 0.3);
      const consistencyVariation = Math.random() * 20 - 10;
      const consistency = Math.max(0, Math.min(100, baseConsistency + consistencyVariation));
      
      // Add to strength data
      strengthProgressionData.push({
        date: label,
        strength,
        intensity,
        target: 85,
      });
      
      // Add to volume data
      volumeProgressionData.push({
        date: label,
        volume,
        intensity,
      });
      
      // Add to consistency data
      consistencyProgressionData.push({
        date: label,
        consistency,
        target: 90,
      });
    }
    
    // Generate exercise-specific data
    const exerciseSpecificData = [
      { exercise: 'Squat', current: 85, previous: 75, improvement: 13.3 },
      { exercise: 'Bench Press', current: 80, previous: 72, improvement: 11.1 },
      { exercise: 'Deadlift', current: 90, previous: 82, improvement: 9.8 },
      { exercise: 'Shoulder Press', current: 75, previous: 65, improvement: 15.4 },
      { exercise: 'Pull-ups', current: 82, previous: 70, improvement: 17.1 },
    ];
    
    // Set data
    setStrengthData(strengthProgressionData);
    setVolumeData(volumeProgressionData);
    setConsistencyData(consistencyProgressionData);
    setExerciseData(exerciseSpecificData);
    
    // Calculate performance metrics
    setPerformanceMetrics({
      totalWorkouts: Math.floor(15 + Math.random() * 10),
      totalVolume: Math.floor(25000 + Math.random() * 10000),
      avgIntensity: Math.floor(75 + Math.random() * 10),
      strengthProgress: Math.floor(12 + Math.random() * 8),
      consistencyScore: Math.floor(85 + Math.random() * 10),
    });
  };
  
  // Format trend indicator
  const formatTrend = (value: number) => {
    if (value > 0) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span>+{value}%</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDownRight className="h-4 w-4 mr-1" />
          <span>{value}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="h-4 w-4 mr-1" />
          <span>0%</span>
        </div>
      );
    }
  };
  
  // Handle export
  const handleExport = () => {
    // In a real app, this would export the data to CSV or PDF
    console.log('Exporting workout performance data...');
    alert('Workout performance data exported!');
  };
  
  // Handle sharing
  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    console.log('Sharing workout performance data...');
    alert('Workout performance data shared!');
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
            <CardTitle className="text-xl">Workout Performance</CardTitle>
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
          Track your workout performance metrics and progress
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="strength" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Strength
            </TabsTrigger>
            <TabsTrigger 
              value="volume" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Volume
            </TabsTrigger>
            <TabsTrigger 
              value="exercises" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Exercises
            </TabsTrigger>
            <TabsTrigger 
              value="consistency" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Consistency
            </TabsTrigger>
          </TabsList>
          
          {/* Strength Tab */}
          <TabsContent value="strength" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total Workouts</div>
                <div className="text-2xl font-bold">{performanceMetrics.totalWorkouts}</div>
                <div className="flex items-center mt-1">
                  {formatTrend(15)}
                  <span className="text-xs text-gray-500 ml-1">vs. previous period</span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Strength Progress</div>
                <div className="text-2xl font-bold">+{performanceMetrics.strengthProgress}%</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-xs text-gray-500">Overall improvement</span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Avg. Intensity</div>
                <div className="text-2xl font-bold">{performanceMetrics.avgIntensity}%</div>
                <div className="flex items-center mt-1">
                  {formatTrend(8)}
                  <span className="text-xs text-gray-500 ml-1">vs. previous period</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strengthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}`, '']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="strength" 
                    name="Strength Score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intensity" 
                    name="Intensity" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target" 
                    stroke="#94a3b8" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
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

export default WorkoutPerformanceChart;
