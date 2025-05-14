import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Clock, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sunrise,
  Sunset,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { HealthData } from '@/integrations/health-apps/types';

interface SleepAnalysisChartProps {
  /** Health data to visualize */
  healthData: HealthData;
  /** Optional className for styling */
  className?: string;
}

/**
 * Sleep Analysis Chart Component
 * 
 * Provides detailed visualization of sleep patterns, quality, and trends
 */
const SleepAnalysisChart = ({ healthData, className = '' }: SleepAnalysisChartProps) => {
  const [activeTab, setActiveTab] = useState('patterns');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [sleepQualityData, setSleepQualityData] = useState<any[]>([]);
  const [sleepStagesData, setSleepStagesData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate sleep data for visualization
    generateSleepData();
  }, [healthData, timeRange]);
  
  // Generate mock sleep data for visualization
  const generateSleepData = () => {
    // Sleep duration data
    const durationData = [];
    const qualityData = [];
    const stagesData = [];
    
    // Get date ranges based on selected time range
    const today = new Date();
    let days = 7;
    
    if (timeRange === 'month') {
      days = 30;
    } else if (timeRange === 'year') {
      days = 52; // Show weekly data for a year
    }
    
    // Generate data for each day/week
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Format date label
      let dateLabel = '';
      if (timeRange === 'week') {
        dateLabel = date.toLocaleDateString([], { weekday: 'short' });
      } else if (timeRange === 'month') {
        dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
      } else {
        // For year view, show week numbers
        dateLabel = `W${Math.ceil((days - i) / 7)}`;
      }
      
      // Generate sleep duration (in hours)
      // Use actual data for the most recent day if available
      let duration = 0;
      let quality = '';
      
      if (i === 0 && healthData.sleep?.duration) {
        duration = healthData.sleep.duration / 60; // Convert minutes to hours
        quality = healthData.sleep.quality || 'fair';
      } else {
        // Generate random sleep duration between 5 and 9 hours
        duration = 5 + (Math.random() * 4);
        
        // Generate random sleep quality
        const qualities = ['poor', 'fair', 'good', 'excellent'];
        quality = qualities[Math.floor(Math.random() * qualities.length)];
      }
      
      // Add to duration data
      durationData.push({
        date: dateLabel,
        duration: parseFloat(duration.toFixed(1)),
        target: 8, // Target sleep duration
      });
      
      // Add to quality data
      qualityData.push({
        date: dateLabel,
        quality: quality === 'excellent' ? 100 :
                quality === 'good' ? 75 :
                quality === 'fair' ? 50 : 25,
      });
      
      // Generate sleep stages data (in percentages)
      const deep = Math.floor(Math.random() * 20) + 10; // 10-30%
      const rem = Math.floor(Math.random() * 20) + 15; // 15-35%
      const light = 100 - deep - rem;
      
      stagesData.push({
        date: dateLabel,
        deep,
        rem,
        light,
      });
    }
    
    setSleepData(durationData);
    setSleepQualityData(qualityData);
    setSleepStagesData(stagesData);
  };
  
  // Get sleep quality status
  const getSleepQualityStatus = () => {
    if (!healthData.sleep?.quality) return 'Unknown';
    
    switch (healthData.sleep.quality) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'poor':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };
  
  // Get sleep quality color
  const getSleepQualityColor = () => {
    if (!healthData.sleep?.quality) return 'text-gray-500';
    
    switch (healthData.sleep.quality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Format sleep duration
  const formatSleepDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  };
  
  // Get sleep insights
  const getSleepInsights = () => {
    if (!healthData.sleep) {
      return 'No sleep data available.';
    }
    
    const { duration, quality } = healthData.sleep;
    
    if (!duration) {
      return 'Sleep duration data not available.';
    }
    
    const hours = duration / 60;
    
    if (hours < 6) {
      return 'You\'re not getting enough sleep. Aim for 7-9 hours for optimal health.';
    } else if (hours > 9) {
      return 'You\'re sleeping more than average. While extra sleep can be beneficial, consistently sleeping more than 9 hours may indicate other health issues.';
    } else if (quality === 'poor' || quality === 'fair') {
      return 'Your sleep quality could be improved. Consider establishing a consistent sleep schedule and creating a relaxing bedtime routine.';
    } else {
      return 'Your sleep patterns are healthy. Keep maintaining your good sleep habits!';
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Moon className="h-5 w-5 mr-2 text-purple-500" />
            Sleep Analysis
          </CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant={timeRange === 'week' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
        </div>
        <CardDescription>
          Track and analyze your sleep patterns and quality
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="patterns" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Sleep Patterns
            </TabsTrigger>
            <TabsTrigger 
              value="quality" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Sleep Quality
            </TabsTrigger>
            <TabsTrigger 
              value="stages" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Sleep Stages
            </TabsTrigger>
          </TabsList>
          
          {/* Sleep Patterns Tab */}
          <TabsContent value="patterns" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Last Night</div>
                <div className="text-2xl font-bold">
                  {formatSleepDuration(healthData.sleep?.duration)}
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {healthData.sleep?.duration 
                      ? `${(healthData.sleep.duration / 60).toFixed(1)} hours`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Sleep Quality</div>
                <div className={`text-2xl font-bold ${getSleepQualityColor()}`}>
                  {getSleepQualityStatus()}
                </div>
                <div className="flex items-center mt-1">
                  {healthData.sleep?.quality === 'excellent' || healthData.sleep?.quality === 'good' ? (
                    <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {healthData.sleep?.quality ? `${healthData.sleep.quality} quality` : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Weekly Average</div>
                <div className="text-2xl font-bold">
                  {sleepData.length > 0 
                    ? `${(sleepData.reduce((sum, day) => sum + day.duration, 0) / sleepData.length).toFixed(1)}h`
                    : 'N/A'
                  }
                </div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-xs text-gray-500">
                    5% above last week
                  </span>
                </div>
              </div>
            </div>
            
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 12]} />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Sleep Duration']} />
                  <defs>
                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#sleepGradient)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#82ca9d" 
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <Moon className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Sleep Insight</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getSleepInsights()}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Sleep Quality Tab */}
          <TabsContent value="quality" className="p-6">
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepQualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Sleep Quality']} />
                  <Bar dataKey="quality" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Poor</div>
                <div className="text-xl font-bold text-red-500">
                  {sleepQualityData.filter(d => d.quality <= 25).length}
                </div>
                <div className="text-xs text-gray-500">days</div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Fair</div>
                <div className="text-xl font-bold text-yellow-500">
                  {sleepQualityData.filter(d => d.quality > 25 && d.quality <= 50).length}
                </div>
                <div className="text-xs text-gray-500">days</div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Good</div>
                <div className="text-xl font-bold text-blue-500">
                  {sleepQualityData.filter(d => d.quality > 50 && d.quality <= 75).length}
                </div>
                <div className="text-xs text-gray-500">days</div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Excellent</div>
                <div className="text-xl font-bold text-green-500">
                  {sleepQualityData.filter(d => d.quality > 75).length}
                </div>
                <div className="text-xs text-gray-500">days</div>
              </div>
            </div>
          </TabsContent>
          
          {/* Sleep Stages Tab */}
          <TabsContent value="stages" className="p-6">
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepStagesData} stackOffset="expand" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Legend />
                  <Bar dataKey="deep" stackId="a" name="Deep Sleep" fill="#3F51B5" />
                  <Bar dataKey="rem" stackId="a" name="REM Sleep" fill="#9C27B0" />
                  <Bar dataKey="light" stackId="a" name="Light Sleep" fill="#03A9F4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#3F51B5] mr-2"></div>
                  <div className="text-xs text-gray-500">Deep Sleep</div>
                </div>
                <div className="text-xl font-bold">
                  {sleepStagesData.length > 0 
                    ? `${Math.round(sleepStagesData.reduce((sum, day) => sum + day.deep, 0) / sleepStagesData.length)}%`
                    : 'N/A'
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Physical recovery, immune system
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#9C27B0] mr-2"></div>
                  <div className="text-xs text-gray-500">REM Sleep</div>
                </div>
                <div className="text-xl font-bold">
                  {sleepStagesData.length > 0 
                    ? `${Math.round(sleepStagesData.reduce((sum, day) => sum + day.rem, 0) / sleepStagesData.length)}%`
                    : 'N/A'
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Mental recovery, memory, learning
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#03A9F4] mr-2"></div>
                  <div className="text-xs text-gray-500">Light Sleep</div>
                </div>
                <div className="text-xl font-bold">
                  {sleepStagesData.length > 0 
                    ? `${Math.round(sleepStagesData.reduce((sum, day) => sum + day.light, 0) / sleepStagesData.length)}%`
                    : 'N/A'
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Transition between wake and deep sleep
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SleepAnalysisChart;
