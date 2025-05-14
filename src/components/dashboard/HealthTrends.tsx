/**
 * Health Trends Component
 * 
 * This component displays health data trends over time.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  BarChart, 
  Activity, 
  Heart, 
  Footprints, 
  Moon, 
  Scale,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
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
  Legend
} from 'recharts';
import { HealthData } from '@/integrations/health-apps/types';
import { healthSyncService } from '@/services/health-sync-service';

interface HealthTrendsProps {
  /** Initial health data */
  initialHealthData: HealthData;
  
  /** Optional className for styling */
  className?: string;
}

interface TrendData {
  date: string;
  steps?: number;
  distance?: number;
  calories?: number;
  heartRate?: number;
  sleep?: number;
  weight?: number;
}

/**
 * Health Trends Component
 */
const HealthTrends = ({ initialHealthData, className = '' }: HealthTrendsProps) => {
  const [activeTab, setActiveTab] = useState('steps');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonStats, setComparisonStats] = useState<{
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }>({
    current: 0,
    previous: 0,
    change: 0,
    trend: 'neutral'
  });
  
  // Fetch trend data on mount and when time range changes
  useEffect(() => {
    fetchTrendData();
  }, [timeRange]);
  
  // Update comparison stats when active tab or trend data changes
  useEffect(() => {
    if (trendData.length > 0) {
      calculateComparisonStats();
    }
  }, [activeTab, trendData]);
  
  // Fetch trend data from the API
  const fetchTrendData = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would fetch historical data from the API
      // For now, we'll generate mock data based on the initial health data
      const mockData = generateMockTrendData();
      setTrendData(mockData);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching trend data:', error);
      setIsLoading(false);
    }
  };
  
  // Generate mock trend data based on the initial health data
  const generateMockTrendData = (): TrendData[] => {
    const data: TrendData[] = [];
    const now = new Date();
    
    let daysToGenerate = 7;
    let dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    if (timeRange === 'month') {
      daysToGenerate = 30;
      dateFormat = { month: 'short', day: 'numeric' };
    } else if (timeRange === 'year') {
      daysToGenerate = 12;
      dateFormat = { month: 'short' };
    }
    
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const date = new Date();
      
      if (timeRange === 'year') {
        // For year view, generate monthly data
        date.setMonth(now.getMonth() - i);
        date.setDate(1);
      } else {
        // For week and month view, generate daily data
        date.setDate(now.getDate() - i);
      }
      
      const dateStr = date.toLocaleDateString(undefined, dateFormat);
      
      // Generate random data based on the initial health data
      const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
      
      const entry: TrendData = {
        date: dateStr,
      };
      
      // Add steps data
      if (initialHealthData.steps !== undefined) {
        entry.steps = Math.round(initialHealthData.steps * randomFactor);
      }
      
      // Add distance data
      if (initialHealthData.distance !== undefined) {
        entry.distance = Math.round(initialHealthData.distance * randomFactor) / 1000; // Convert to km
      }
      
      // Add calories data
      if (initialHealthData.calories !== undefined) {
        entry.calories = Math.round(initialHealthData.calories * randomFactor);
      }
      
      // Add heart rate data
      if (initialHealthData.heartRate?.average !== undefined) {
        entry.heartRate = Math.round(initialHealthData.heartRate.average * randomFactor);
      }
      
      // Add sleep data
      if (initialHealthData.sleep?.duration !== undefined) {
        entry.sleep = Math.round(initialHealthData.sleep.duration * randomFactor) / 60; // Convert to hours
      }
      
      // Add weight data
      if (initialHealthData.weight !== undefined) {
        // Weight doesn't fluctuate as much as other metrics
        const weightRandomFactor = 0.98 + Math.random() * 0.04; // Random factor between 0.98 and 1.02
        entry.weight = Math.round(initialHealthData.weight * weightRandomFactor * 10) / 10;
      }
      
      data.push(entry);
    }
    
    return data;
  };
  
  // Calculate comparison stats for the active metric
  const calculateComparisonStats = () => {
    if (trendData.length === 0) return;
    
    const metric = activeTab as keyof TrendData;
    if (metric === 'date') return;
    
    // Split the data into current and previous periods
    const halfLength = Math.floor(trendData.length / 2);
    const currentPeriod = trendData.slice(halfLength);
    const previousPeriod = trendData.slice(0, halfLength);
    
    // Calculate averages
    const currentValues = currentPeriod.map(d => d[metric] as number).filter(Boolean);
    const previousValues = previousPeriod.map(d => d[metric] as number).filter(Boolean);
    
    const currentAvg = currentValues.length > 0 
      ? currentValues.reduce((sum, val) => sum + val, 0) / currentValues.length 
      : 0;
    
    const previousAvg = previousValues.length > 0 
      ? previousValues.reduce((sum, val) => sum + val, 0) / previousValues.length 
      : 0;
    
    // Calculate change percentage
    const change = previousAvg === 0 
      ? 0 
      : ((currentAvg - previousAvg) / previousAvg) * 100;
    
    // Determine trend
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    
    if (change > 5) {
      trend = 'up';
    } else if (change < -5) {
      trend = 'down';
    }
    
    // For some metrics, down is good (e.g., resting heart rate)
    if (metric === 'heartRate' && trend !== 'neutral') {
      trend = trend === 'up' ? 'down' : 'up';
    }
    
    setComparisonStats({
      current: currentAvg,
      previous: previousAvg,
      change: Math.abs(change),
      trend,
    });
  };
  
  // Format value based on the active metric
  const formatValue = (value: number) => {
    switch (activeTab) {
      case 'steps':
        return value.toLocaleString();
      case 'distance':
        return `${value.toFixed(2)} km`;
      case 'calories':
        return value.toLocaleString();
      case 'heartRate':
        return `${Math.round(value)} bpm`;
      case 'sleep':
        return `${value.toFixed(1)} hrs`;
      case 'weight':
        return `${value.toFixed(1)} kg`;
      default:
        return value.toString();
    }
  };
  
  // Get trend icon based on trend direction
  const getTrendIcon = () => {
    switch (comparisonStats.trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case 'neutral':
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get trend color based on trend direction
  const getTrendColor = () => {
    switch (comparisonStats.trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'neutral':
      default:
        return 'text-gray-500';
    }
  };
  
  // Get chart color based on active tab
  const getChartColor = () => {
    switch (activeTab) {
      case 'steps':
        return '#3F51B5';
      case 'distance':
        return '#4CAF50';
      case 'calories':
        return '#FF9800';
      case 'heartRate':
        return '#F44336';
      case 'sleep':
        return '#9C27B0';
      case 'weight':
        return '#795548';
      default:
        return '#3F51B5';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Health Trends
        </CardTitle>
        <CardDescription>
          Track your health metrics over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="steps" className="flex items-center">
              <Footprints className="h-4 w-4 mr-2" />
              Steps
            </TabsTrigger>
            <TabsTrigger value="distance">Distance</TabsTrigger>
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="heartRate">
              <Heart className="h-4 w-4 mr-2" />
              Heart Rate
            </TabsTrigger>
            <TabsTrigger value="sleep">
              <Moon className="h-4 w-4 mr-2" />
              Sleep
            </TabsTrigger>
            <TabsTrigger value="weight">
              <Scale className="h-4 w-4 mr-2" />
              Weight
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Time Range:</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={timeRange === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[250px] w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg border h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatValue(value as number), activeTab]} />
                  <Line 
                    type="monotone" 
                    dataKey={activeTab} 
                    stroke={getChartColor()} 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Current Average</div>
                <div className="text-xl font-bold">
                  {formatValue(comparisonStats.current)}
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Previous Average</div>
                <div className="text-xl font-bold">
                  {formatValue(comparisonStats.previous)}
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Change</div>
                <div className={`text-xl font-bold flex items-center ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="ml-1">{comparisonStats.change.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthTrends;
