/**
 * Health Data Visualization Component
 *
 * This component provides detailed visualizations for health data
 * imported from connected health apps.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Heart,
  Footprints,
  Moon,
  Dumbbell,
  Clock,
  Calendar,
  ArrowRight,
  BarChart3,
  LineChart,
  PieChart,
  Scale,
  Ruler,
  Droplets,
  Wind
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
  Legend
} from 'recharts';
import { HealthData, HealthWorkout } from '@/integrations/health-apps/types';

interface HealthDataVisualizationProps {
  /** Health data to visualize */
  healthData: HealthData;

  /** Optional className for styling */
  className?: string;
}

/**
 * Health Data Visualization Component
 */
const HealthDataVisualization = ({ healthData, className = '' }: HealthDataVisualizationProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Calculate step progress percentage
  const calculateStepProgress = (): number => {
    if (!healthData.steps) return 0;
    const goal = 10000; // Default step goal
    const percentage = (healthData.steps / goal) * 100;
    return Math.min(percentage, 100);
  };

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (date?: Date) => {
    if (!date) return '';

    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration in minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };

  // Get health app source name
  const getSourceName = () => {
    switch (healthData.source) {
      case 'apple_health':
        return 'Apple Health';
      case 'samsung_health':
        return 'Samsung Health';
      case 'google_fit':
        return 'Google Fit';
      default:
        return 'Connected Health App';
    }
  };

  // Generate mock step data for visualization
  const generateStepData = () => {
    const data = [];
    const now = new Date();

    if (timeRange === 'day') {
      // Hourly data for the current day
      for (let i = 0; i < 24; i++) {
        const hour = i;
        const value = Math.floor(Math.random() * 1000) + 100;
        data.push({
          time: `${hour}:00`,
          steps: value,
        });
      }
    } else if (timeRange === 'week') {
      // Daily data for the current week
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dayName = dayNames[date.getDay()];
        const value = i === 0 ? (healthData.steps || 0) : Math.floor(Math.random() * 5000) + 3000;
        data.push({
          day: dayName,
          steps: value,
        });
      }
    } else if (timeRange === 'month') {
      // Weekly data for the current month
      for (let i = 4; i >= 0; i--) {
        const weekNum = 5 - i;
        const value = i === 0 ? (healthData.steps || 0) : Math.floor(Math.random() * 30000) + 20000;
        data.push({
          week: `Week ${weekNum}`,
          steps: value,
        });
      }
    }

    return data;
  };

  // Generate mock heart rate data for visualization
  const generateHeartRateData = () => {
    const data = [];
    const now = new Date();

    if (timeRange === 'day') {
      // Hourly data for the current day
      for (let i = 0; i < 24; i++) {
        const hour = i;
        const value = Math.floor(Math.random() * 30) + 60;
        data.push({
          time: `${hour}:00`,
          heartRate: value,
        });
      }
    } else if (timeRange === 'week') {
      // Daily data for the current week
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dayName = dayNames[date.getDay()];
        const value = i === 0 && healthData.heartRate?.average
          ? healthData.heartRate.average
          : Math.floor(Math.random() * 20) + 65;
        data.push({
          day: dayName,
          heartRate: value,
        });
      }
    } else if (timeRange === 'month') {
      // Weekly data for the current month
      for (let i = 4; i >= 0; i--) {
        const weekNum = 5 - i;
        const value = i === 0 && healthData.heartRate?.average
          ? healthData.heartRate.average
          : Math.floor(Math.random() * 15) + 70;
        data.push({
          week: `Week ${weekNum}`,
          heartRate: value,
        });
      }
    }

    return data;
  };

  // Generate workout distribution data
  const generateWorkoutDistribution = () => {
    if (!healthData.workouts || healthData.workouts.length === 0) {
      return [
        { name: 'No Data', value: 1 }
      ];
    }

    const workoutTypes: Record<string, number> = {};

    // Count workouts by type
    healthData.workouts.forEach(workout => {
      const type = workout.type;
      if (workoutTypes[type]) {
        workoutTypes[type]++;
      } else {
        workoutTypes[type] = 1;
      }
    });

    // Convert to array format for chart
    return Object.entries(workoutTypes).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Sort workouts by date (most recent first)
  const sortedWorkouts = healthData.workouts
    ? [...healthData.workouts].sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateB - dateA;
      })
    : [];

  // Generate step data
  const stepData = generateStepData();

  // Generate heart rate data
  const heartRateData = generateHeartRateData();

  // Generate workout distribution data
  const workoutDistributionData = generateWorkoutDistribution();

  // Colors for pie chart
  const COLORS = ['#3F51B5', '#4CAF50', '#F44336', '#FF9800', '#9C27B0', '#00BCD4', '#FFEB3B', '#795548'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5" />
          Health Insights
        </CardTitle>
        <CardDescription>
          Detailed health metrics from {getSourceName()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Steps */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Footprints className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium">Steps</span>
                </div>
                <span className="text-xl font-semibold">
                  {healthData.steps?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <Progress value={calculateStepProgress()} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0</span>
                <span>Goal: 10,000</span>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  <span className="font-medium">Heart Rate</span>
                </div>
                <div className="flex space-x-3">
                  {healthData.heartRate?.resting && (
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Resting</div>
                      <div className="text-lg font-semibold">{healthData.heartRate.resting}</div>
                    </div>
                  )}
                  {healthData.heartRate?.average && (
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Average</div>
                      <div className="text-lg font-semibold">{healthData.heartRate.average}</div>
                    </div>
                  )}
                  {healthData.heartRate?.max && (
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Max</div>
                      <div className="text-lg font-semibold">{healthData.heartRate.max}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sleep */}
            {healthData.sleep && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Moon className="h-5 w-5 mr-2 text-purple-500" />
                    <span className="font-medium">Sleep</span>
                  </div>
                  <div className="flex space-x-3">
                    {healthData.sleep.duration && (
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="text-lg font-semibold">{formatDuration(healthData.sleep.duration)}</div>
                      </div>
                    )}
                    {healthData.sleep.quality && (
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Quality</div>
                        <div className="text-lg font-semibold capitalize">{healthData.sleep.quality}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Workouts */}
            {sortedWorkouts.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-green-500" />
                    <span className="font-medium">Recent Workouts</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setActiveTab('workouts')}>
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>

                {sortedWorkouts.slice(0, 2).map((workout, index) => (
                  <div key={index} className="flex items-center p-2 rounded-md mb-2 hover:bg-slate-100">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{workout.type}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(workout.startDate)} • {formatDuration(workout.duration / 60)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{workout.calories} cal</div>
                      {workout.distance && (
                        <div className="text-xs text-gray-500">
                          {(workout.distance / 1000).toFixed(2)} km
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Body Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {/* Weight */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Scale className="h-4 w-4 mr-1 text-gray-500" />
                  <div className="text-xs text-gray-500">Weight</div>
                </div>
                <div className="font-semibold">
                  {healthData.weight
                    ? `${healthData.weight.toFixed(1)} kg`
                    : 'N/A'
                  }
                </div>
              </div>

              {/* Height */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Ruler className="h-4 w-4 mr-1 text-gray-500" />
                  <div className="text-xs text-gray-500">Height</div>
                </div>
                <div className="font-semibold">
                  {healthData.height
                    ? `${healthData.height} cm`
                    : 'N/A'
                  }
                </div>
              </div>

              {/* Blood Pressure */}
              {healthData.bloodPressure && (
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Activity className="h-4 w-4 mr-1 text-gray-500" />
                    <div className="text-xs text-gray-500">Blood Pressure</div>
                  </div>
                  <div className="font-semibold">
                    {healthData.bloodPressure.systolic && healthData.bloodPressure.diastolic
                      ? `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg`
                      : 'N/A'
                    }
                  </div>
                </div>
              )}

              {/* Oxygen Saturation */}
              {healthData.oxygenSaturation && (
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Wind className="h-4 w-4 mr-1 text-gray-500" />
                    <div className="text-xs text-gray-500">Oxygen</div>
                  </div>
                  <div className="font-semibold">
                    {`${healthData.oxygenSaturation}%`}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Step Count</h3>
              <div className="flex space-x-2">
                <Button
                  variant={timeRange === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('day')}
                >
                  Day
                </Button>
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
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={stepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={
                      timeRange === 'day' ? 'time' :
                      timeRange === 'week' ? 'day' : 'week'
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="steps" fill="#3F51B5" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Total Steps</div>
                <div className="text-xl font-bold">{healthData.steps?.toLocaleString() || 'N/A'}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Distance</div>
                <div className="text-xl font-bold">
                  {healthData.distance
                    ? `${(healthData.distance / 1000).toFixed(2)} km`
                    : 'N/A'
                  }
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Calories</div>
                <div className="text-xl font-bold">{healthData.calories?.toLocaleString() || 'N/A'}</div>
              </div>
            </div>
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Workout History</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {sortedWorkouts.length} Workouts
              </Badge>
            </div>

            {sortedWorkouts.length > 0 ? (
              <div className="space-y-3">
                {sortedWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{workout.type}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(workout.startDate)} • {formatDuration(workout.duration / 60)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{workout.calories} cal</div>
                      {workout.distance && (
                        <div className="text-sm text-gray-500">
                          {(workout.distance / 1000).toFixed(2)} km
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No workout data available</p>
              </div>
            )}

            {sortedWorkouts.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3">Workout Distribution</h4>
                <div className="bg-white p-4 rounded-lg border">
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={workoutDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {workoutDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Heart Rate</h3>
              <div className="flex space-x-2">
                <Button
                  variant={timeRange === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('day')}
                >
                  Day
                </Button>
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
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsLineChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={
                      timeRange === 'day' ? 'time' :
                      timeRange === 'week' ? 'day' : 'week'
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#F44336"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {healthData.heartRate?.resting && (
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Resting HR</div>
                  <div className="text-xl font-bold">{healthData.heartRate.resting} bpm</div>
                </div>
              )}

              {healthData.heartRate?.average && (
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Average HR</div>
                  <div className="text-xl font-bold">{healthData.heartRate.average} bpm</div>
                </div>
              )}

              {healthData.heartRate?.max && (
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500">Max HR</div>
                  <div className="text-xl font-bold">{healthData.heartRate.max} bpm</div>
                </div>
              )}
            </div>

            {/* Other Vitals */}
            <h3 className="text-lg font-semibold mt-6">Other Vitals</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Blood Pressure */}
              {healthData.bloodPressure && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Activity className="h-5 w-5 mr-2 text-red-500" />
                    <span className="font-medium">Blood Pressure</span>
                  </div>
                  <div className="text-xl font-bold">
                    {healthData.bloodPressure.systolic && healthData.bloodPressure.diastolic
                      ? `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg`
                      : 'N/A'
                    }
                  </div>
                </div>
              )}

              {/* Blood Glucose */}
              {healthData.bloodGlucose && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium">Blood Glucose</span>
                  </div>
                  <div className="text-xl font-bold">
                    {`${healthData.bloodGlucose} mg/dL`}
                  </div>
                </div>
              )}

              {/* Oxygen Saturation */}
              {healthData.oxygenSaturation && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Wind className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium">Oxygen Saturation</span>
                  </div>
                  <div className="text-xl font-bold">
                    {`${healthData.oxygenSaturation}%`}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HealthDataVisualization;
