
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { 
  Heart, 
  Activity, 
  Footprints,
  Scale,
  Moon
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

// Define health metric types
type HealthMetric = 'steps' | 'heartRate' | 'sleep' | 'weight' | 'calories';

// Define health data interface
interface HealthData {
  date: string;
  steps: number;
  distance: number;
  calories: number;
  heartRate: {
    resting: number;
    average: number;
    max: number;
  };
  sleep: {
    duration: number; // in minutes
    quality: number; // 0-100
    deepSleep: number; // in minutes
    remSleep: number; // in minutes
    lightSleep: number; // in minutes
    awake: number; // in minutes
  };
  weight: number; // in kg
  bodyFat: number; // in percentage
  hydration: number; // in ml
  oxygenSaturation: number; // in percentage
}

// Sample data - 7 days of health metrics
const sampleHealthData: HealthData[] = [
  {
    date: '2023-07-01',
    steps: 8756,
    distance: 6.5,
    calories: 2340,
    heartRate: { resting: 62, average: 72, max: 142 },
    sleep: { duration: 440, quality: 85, deepSleep: 120, remSleep: 100, lightSleep: 180, awake: 40 },
    weight: 72.5,
    bodyFat: 18.2,
    hydration: 2100,
    oxygenSaturation: 98
  },
  {
    date: '2023-07-02',
    steps: 10243,
    distance: 7.8,
    calories: 2450,
    heartRate: { resting: 60, average: 74, max: 156 },
    sleep: { duration: 420, quality: 80, deepSleep: 115, remSleep: 95, lightSleep: 170, awake: 40 },
    weight: 72.3,
    bodyFat: 18.1,
    hydration: 2300,
    oxygenSaturation: 97
  },
  {
    date: '2023-07-03',
    steps: 7890,
    distance: 5.9,
    calories: 2280,
    heartRate: { resting: 63, average: 71, max: 135 },
    sleep: { duration: 460, quality: 90, deepSleep: 130, remSleep: 110, lightSleep: 190, awake: 30 },
    weight: 72.4,
    bodyFat: 18.0,
    hydration: 2200,
    oxygenSaturation: 98
  },
  {
    date: '2023-07-04',
    steps: 9120,
    distance: 6.8,
    calories: 2380,
    heartRate: { resting: 61, average: 73, max: 148 },
    sleep: { duration: 430, quality: 82, deepSleep: 125, remSleep: 105, lightSleep: 175, awake: 25 },
    weight: 72.2,
    bodyFat: 17.9,
    hydration: 2350,
    oxygenSaturation: 98
  },
  {
    date: '2023-07-05',
    steps: 11325,
    distance: 8.5,
    calories: 2520,
    heartRate: { resting: 59, average: 75, max: 162 },
    sleep: { duration: 400, quality: 75, deepSleep: 110, remSleep: 90, lightSleep: 160, awake: 40 },
    weight: 72.1,
    bodyFat: 17.8,
    hydration: 2450,
    oxygenSaturation: 99
  },
  {
    date: '2023-07-06',
    steps: 8432,
    distance: 6.3,
    calories: 2290,
    heartRate: { resting: 62, average: 70, max: 140 },
    sleep: { duration: 450, quality: 88, deepSleep: 128, remSleep: 107, lightSleep: 185, awake: 30 },
    weight: 72.0,
    bodyFat: 17.7,
    hydration: 2250,
    oxygenSaturation: 98
  },
  {
    date: '2023-07-07',
    steps: 9765,
    distance: 7.2,
    calories: 2410,
    heartRate: { resting: 60, average: 72, max: 154 },
    sleep: { duration: 435, quality: 84, deepSleep: 122, remSleep: 103, lightSleep: 180, awake: 30 },
    weight: 71.9,
    bodyFat: 17.6,
    hydration: 2400,
    oxygenSaturation: 98
  }
];

/**
 * HealthDataVisualization Component
 * 
 * Visualizes health data from connected devices or apps.
 */
const HealthDataVisualization = ({ className = '' }) => {
  const [activeMetric, setActiveMetric] = useState<HealthMetric>('steps');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [healthData, setHealthData] = useState<HealthData[]>(sampleHealthData);

  // Format time from minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Get the latest health data entry
  const getLatestData = (): HealthData => {
    return healthData[healthData.length - 1];
  };
  
  // Calculate daily average for a metric
  const calculateAverage = (metric: HealthMetric): number => {
    switch (metric) {
      case 'steps':
        return Math.round(healthData.reduce((sum, day) => sum + day.steps, 0) / healthData.length);
      case 'heartRate':
        return Math.round(healthData.reduce((sum, day) => sum + day.heartRate.average, 0) / healthData.length);
      case 'sleep':
        return Math.round(healthData.reduce((sum, day) => sum + day.sleep.duration, 0) / healthData.length);
      case 'weight':
        return healthData.reduce((sum, day) => sum + day.weight, 0) / healthData.length;
      case 'calories':
        return Math.round(healthData.reduce((sum, day) => sum + day.calories, 0) / healthData.length);
      default:
        return 0;
    }
  };
  
  // Calculate latest data entry value for selected metric
  const getLatestMetricValue = (metric: HealthMetric): number | string => {
    const latest = getLatestData();
    switch (metric) {
      case 'steps':
        return latest.steps.toLocaleString();
      case 'heartRate':
        return latest.heartRate.average;
      case 'sleep': 
        return (latest.sleep.duration / 60).toFixed(1); // Convert to hours
      case 'weight':
        return latest.weight.toFixed(1);
      case 'calories':
        return latest.calories.toLocaleString();
      default:
        return 0;
    }
  };

  // Get data for the selected metric chart
  const getChartData = () => {
    const formatSleepHours = (minutes: number) => (minutes / 60).toFixed(1);
    
    return healthData.map((day) => {
      const baseData = {
        date: formatDate(day.date)
      };
      
      switch (activeMetric) {
        case 'steps':
          return {
            ...baseData,
            value: day.steps,
            goal: 10000
          };
        case 'heartRate':
          return {
            ...baseData,
            resting: day.heartRate.resting,
            average: day.heartRate.average,
            max: day.heartRate.max
          };
        case 'sleep':
          return {
            ...baseData,
            hours: formatSleepHours(day.sleep.duration),
            deep: formatSleepHours(day.sleep.deepSleep),
            rem: formatSleepHours(day.sleep.remSleep),
            light: formatSleepHours(day.sleep.lightSleep),
            quality: day.sleep.quality
          };
        case 'weight':
          return {
            ...baseData,
            weight: day.weight,
            bodyFat: day.bodyFat
          };
        case 'calories':
          return {
            ...baseData,
            intake: day.calories,
            burned: Math.round(day.steps * 0.04)
          };
        default:
          return baseData;
      }
    });
  };
  
  // Get unit label for the selected metric
  const getUnitLabel = (metric: HealthMetric): string => {
    switch (metric) {
      case 'steps':
        return 'steps';
      case 'heartRate':
        return 'bpm';
      case 'sleep':
        return 'hours';
      case 'weight':
        return 'kg';
      case 'calories':
        return 'kcal';
      default:
        return '';
    }
  };
  
  // Get chart color based on metric
  const getChartColor = (metric: HealthMetric): string => {
    switch (metric) {
      case 'steps':
        return '#4f46e5'; // indigo
      case 'heartRate':
        return '#ef4444'; // red
      case 'sleep':
        return '#8b5cf6'; // purple
      case 'weight':
        return '#10b981'; // emerald
      case 'calories':
        return '#f97316'; // orange
      default:
        return '#6b7280'; // gray
    }
  };
  
  // Get chart configuration for the selected metric
  const getChartConfig = (metric: HealthMetric) => {
    switch (metric) {
      case 'heartRate':
        return {
          dataKeys: ['resting', 'average', 'max'],
          colors: ['#22c55e', '#3b82f6', '#ef4444']
        };
      case 'sleep':
        return {
          dataKeys: ['deep', 'rem', 'light'],
          colors: ['#4f46e5', '#8b5cf6', '#93c5fd']
        };
      case 'calories':
        return {
          dataKeys: ['intake', 'burned'],
          colors: ['#f97316', '#84cc16']
        };
      case 'weight':
        return {
          dataKeys: ['weight'],
          colors: ['#10b981']
        };
      case 'steps':
      default:
        return {
          dataKeys: ['value'],
          colors: ['#4f46e5']
        };
    }
  };
  
  // Generate insights based on the data
  const generateInsights = (metric: HealthMetric): string[] => {
    const insights: string[] = [];
    
    switch (metric) {
      case 'steps':
        const avgSteps = calculateAverage('steps');
        if (avgSteps > 10000) {
          insights.push('Great job! You're exceeding the recommended 10,000 steps per day.');
        } else if (avgSteps > 7500) {
          insights.push('You're on the right track with your daily steps. Aim for 10,000 for optimal health benefits.');
        } else {
          insights.push('Try to increase your daily steps to at least 7,500-10,000 for better health outcomes.');
        }
        break;
        
      case 'heartRate':
        const avgHeartRate = calculateAverage('heartRate');
        if (avgHeartRate < 65) {
          insights.push('Your resting heart rate indicates excellent cardiovascular fitness.');
        } else if (avgHeartRate < 72) {
          insights.push('Your average heart rate is within a healthy range.');
        } else {
          insights.push('Consider more cardio exercise to improve your resting heart rate over time.');
        }
        break;
        
      case 'sleep':
        const avgSleep = calculateAverage('sleep') / 60; // Convert to hours
        if (avgSleep >= 7.5) {
          insights.push('You're getting the recommended amount of sleep. Keep it up!');
        } else if (avgSleep >= 6.5) {
          insights.push('You're slightly below the recommended 7-9 hours of sleep. Try to get to bed earlier.');
        } else {
          insights.push('Your sleep duration is below recommendations. Aim for 7-9 hours for optimal recovery and health.');
        }
        
        // Sleep quality insight
        const latestSleep = getLatestData().sleep;
        const sleepEfficiency = (latestSleep.duration - latestSleep.awake) / latestSleep.duration;
        insights.push(`Your sleep efficiency is ${Math.round(Number(sleepEfficiency) * 100)}%, with ${Math.round(latestSleep.deepSleep / latestSleep.duration * 100)}% deep sleep.`);
        break;
        
      case 'weight':
        // Weight trend
        const weightChange = healthData[healthData.length - 1].weight - healthData[0].weight;
        if (Math.abs(weightChange) < 0.5) {
          insights.push('Your weight has been stable over this period.');
        } else if (weightChange < 0) {
          insights.push(`You've lost ${Math.abs(weightChange).toFixed(1)}kg over this period.`);
        } else {
          insights.push(`You've gained ${weightChange.toFixed(1)}kg over this period.`);
        }
        break;
        
      case 'calories':
        const avgCalories = calculateAverage('calories');
        const avgStepsCalories = calculateAverage('steps') * 0.04;
        if (avgCalories > avgStepsCalories + 500) {
          insights.push('Your caloric intake appears to exceed your activity level. Consider adjusting for your goals.');
        } else if (avgCalories < avgStepsCalories - 500) {
          insights.push('Your caloric intake may be too low for your activity level. Ensure adequate nutrition for recovery.');
        } else {
          insights.push('Your caloric balance seems appropriate for your activity level.');
        }
        break;
    }
    
    return insights;
  };
  
  // Generate chart for current metric
  const renderMetricChart = () => {
    const chartData = getChartData();
    const config = getChartConfig(activeMetric);
    
    switch (activeMetric) {
      case 'heartRate':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.dataKeys.map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={config.colors[index]} 
                  activeDot={{ r: 8 }} 
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        );
        
      case 'sleep':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.dataKeys.map((key, index) => (
                <Area 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stackId="1"
                  stroke={config.colors[index]} 
                  fill={config.colors[index]} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'calories':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.dataKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={config.colors[index]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'weight':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" domain={['dataMin - 1', 'dataMax + 1']} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 40]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke={config.colors[0]} 
                yAxisId="left"
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="bodyFat" 
                stroke="#6b7280" 
                yAxisId="right"
                activeDot={{ r: 8 }} 
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
        
      case 'steps':
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toLocaleString(), 'Steps']} />
              <Legend />
              <Bar dataKey="value" name="Steps" fill={config.colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };
  
  // Render metric icon
  const renderMetricIcon = (metric: HealthMetric) => {
    switch (metric) {
      case 'steps':
        return <Footprints className="h-5 w-5" />;
      case 'heartRate':
        return <Heart className="h-5 w-5" />;
      case 'sleep':
        return <Moon className="h-5 w-5" />;
      case 'weight':
        return <Scale className="h-5 w-5" />;
      case 'calories':
        return <Activity className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };
  
  // Get health score based on all metrics
  const calculateHealthScore = (): number => {
    // This would be a complex algorithm in a real app
    // Here's a simplified version
    const avgSteps = calculateAverage('steps');
    const avgSleep = calculateAverage('sleep');
    const avgHeartRate = calculateAverage('heartRate');
    
    let score = 0;
    
    // Steps score (max 25 points)
    if (avgSteps >= 10000) score += 25;
    else if (avgSteps >= 7500) score += 20;
    else if (avgSteps >= 5000) score += 15;
    else score += 10;
    
    // Sleep score (max 25 points)
    if (avgSleep >= 480) score += 25; // 8 hours
    else if (avgSleep >= 420) score += 20; // 7 hours
    else if (avgSleep >= 360) score += 15; // 6 hours
    else score += 10;
    
    // Heart rate score (max 25 points)
    if (avgHeartRate < 60) score += 25;
    else if (avgHeartRate < 70) score += 20;
    else if (avgHeartRate < 80) score += 15;
    else score += 10;
    
    // Add 25 more points as baseline
    score += 25;
    
    return score;
  };

  return (
    <Card className={`bg-gradient-to-b from-athleteBlue-50 to-white dark:from-athleteBlue-900 dark:to-gray-900 shadow-lg ${className}`}>
      <CardHeader className="border-b border-athleteBlue-100 dark:border-athleteBlue-800">
        <CardTitle className="flex items-center text-athleteBlue-600 dark:text-athleteBlue-300">
          <Activity className="mr-2 h-6 w-6" />
          Health Data Visualization
        </CardTitle>
        <CardDescription className="text-athleteBlue-500 dark:text-athleteBlue-400">Track and visualize your health metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Health Score */}
        <div className="flex items-center justify-between bg-gradient-to-r from-athleteBlue-100 to-athleteBlue-50 dark:from-athleteBlue-800 dark:to-athleteBlue-900 p-4 rounded-lg">
          <div>
            <h3 className="text-lg font-medium text-athleteBlue-700 dark:text-athleteBlue-200">Health Score</h3>
            <p className="text-sm text-athleteBlue-600 dark:text-athleteBlue-300">
              Based on your activity, sleep, and heart rate
            </p>
          </div>
          <div className="text-3xl font-bold text-athleteBlue-600 dark:text-athleteBlue-300 animate-pulse">{calculateHealthScore()}</div>
        </div>
        
        {/* Health Score Progress */}
        <Progress value={calculateHealthScore()} className="h-3 bg-gray-200 dark:bg-gray-700" />
        
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Last updated</div>
            <div className="text-lg text-athleteBlue-600 dark:text-athleteBlue-300">{formatDate(healthData[healthData.length - 1].date)}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Data source</div>
            <div className="text-lg text-athleteBlue-600 dark:text-athleteBlue-300">Health App</div>
          </div>
        </div>
        
        {/* Metric Selector */}
        <Tabs value={activeMetric} onValueChange={(value) => setActiveMetric(value as HealthMetric)}>
          <TabsList className="grid grid-cols-5 bg-athleteBlue-50 dark:bg-athleteBlue-900/50">
            <TabsTrigger 
              value="steps" 
              className="data-[state=active]:bg-athleteBlue-100 data-[state=active]:text-athleteBlue-800 dark:data-[state=active]:bg-athleteBlue-800 dark:data-[state=active]:text-athleteBlue-100 flex items-center justify-center"
            >
              <Footprints className="h-4 w-4 mr-1 md:mr-2" /> 
              <span className="hidden md:inline">Steps</span>
            </TabsTrigger>
            <TabsTrigger 
              value="heartRate" 
              className="data-[state=active]:bg-athleteBlue-100 data-[state=active]:text-athleteBlue-800 dark:data-[state=active]:bg-athleteBlue-800 dark:data-[state=active]:text-athleteBlue-100 flex items-center justify-center"
            >
              <Heart className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Heart Rate</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sleep" 
              className="data-[state=active]:bg-athleteBlue-100 data-[state=active]:text-athleteBlue-800 dark:data-[state=active]:bg-athleteBlue-800 dark:data-[state=active]:text-athleteBlue-100 flex items-center justify-center"
            >
              <Moon className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Sleep</span>
            </TabsTrigger>
            <TabsTrigger 
              value="weight" 
              className="data-[state=active]:bg-athleteBlue-100 data-[state=active]:text-athleteBlue-800 dark:data-[state=active]:bg-athleteBlue-800 dark:data-[state=active]:text-athleteBlue-100 flex items-center justify-center"
            >
              <Scale className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Weight</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calories" 
              className="data-[state=active]:bg-athleteBlue-100 data-[state=active]:text-athleteBlue-800 dark:data-[state=active]:bg-athleteBlue-800 dark:data-[state=active]:text-athleteBlue-100 flex items-center justify-center"
            >
              <Activity className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Calories</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Time Range Selector */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-athleteBlue-700 dark:text-athleteBlue-200 flex items-center">
            {renderMetricIcon(activeMetric)}
            <span className="ml-2">{activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}</span>
          </h3>
          
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as 'day' | 'week' | 'month')}>
            <SelectTrigger className="w-32 border-athleteBlue-200 dark:border-athleteBlue-700">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Current Value */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-athleteBlue-50 to-white dark:from-athleteBlue-900 dark:to-gray-800 border-none shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-athleteBlue-500 dark:text-athleteBlue-400">Current</div>
              <div className="text-2xl font-bold text-athleteBlue-700 dark:text-athleteBlue-200">
                {getLatestMetricValue(activeMetric)} <span className="text-sm font-normal text-athleteBlue-500 dark:text-athleteBlue-400">{getUnitLabel(activeMetric)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-athleteBlue-50 to-white dark:from-athleteBlue-900 dark:to-gray-800 border-none shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-athleteBlue-500 dark:text-athleteBlue-400">Average</div>
              <div className="text-2xl font-bold text-athleteBlue-700 dark:text-athleteBlue-200">
                {
                  activeMetric === 'sleep' 
                    ? (calculateAverage(activeMetric) / 60).toFixed(1)
                    : activeMetric === 'weight'
                      ? calculateAverage(activeMetric).toFixed(1)
                      : calculateAverage(activeMetric).toLocaleString()
                } <span className="text-sm font-normal text-athleteBlue-500 dark:text-athleteBlue-400">{getUnitLabel(activeMetric)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-athleteBlue-50 to-white dark:from-athleteBlue-900 dark:to-gray-800 border-none shadow-md">
            <CardContent className="p-4">
              <div className="text-sm text-athleteBlue-500 dark:text-athleteBlue-400">Goal</div>
              <div className="text-2xl font-bold text-athleteBlue-700 dark:text-athleteBlue-200">
                {activeMetric === 'steps' ? '10,000' : 
                 activeMetric === 'sleep' ? '8.0' :
                 activeMetric === 'weight' ? '70.0' :
                 activeMetric === 'heartRate' ? '65' :
                 '2,200'} <span className="text-sm font-normal text-athleteBlue-500 dark:text-athleteBlue-400">{getUnitLabel(activeMetric)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          {renderMetricChart()}
        </div>
        
        {/* Insights */}
        <div className="mt-6 bg-gradient-to-r from-athleteBlue-50 to-athleteBlue-100 dark:from-athleteBlue-900 dark:to-athleteBlue-800 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-athleteBlue-800 dark:text-athleteBlue-200 mb-2">Insights</h3>
          <ul className="space-y-2">
            {generateInsights(activeMetric).map((insight, index) => (
              <li key={index} className="text-sm text-athleteBlue-700 dark:text-athleteBlue-300 flex">
                <span className="mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm" className="border-athleteBlue-200 text-athleteBlue-600 hover:bg-athleteBlue-50 dark:border-athleteBlue-700 dark:text-athleteBlue-300 dark:hover:bg-athleteBlue-900/50">Export Data</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthDataVisualization;
