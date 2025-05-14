import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  BarChart2, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Dumbbell, 
  Flame, 
  LineChart, 
  Target, 
  TrendingUp, 
  Trophy,
  ArrowUp,
  ArrowDown,
  Zap,
  BarChart,
  PieChart
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useNetworkStatus } from "@/hooks/use-network-status";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for charts and metrics
const performanceData = [
  { week: 'Week 1', strength: 65, endurance: 50, power: 45 },
  { week: 'Week 2', strength: 68, endurance: 52, power: 48 },
  { week: 'Week 3', strength: 70, endurance: 55, power: 52 },
  { week: 'Week 4', strength: 72, endurance: 58, power: 55 },
  { week: 'Week 5', strength: 75, endurance: 62, power: 60 },
  { week: 'Week 6', strength: 78, endurance: 65, power: 64 },
  { week: 'Week 7', strength: 80, endurance: 68, power: 67 },
  { week: 'Week 8', strength: 83, endurance: 72, power: 70 },
];

const workoutTypeData = [
  { name: 'Strength', value: 42, color: '#3b82f6' },
  { name: 'Cardio', value: 28, color: '#10b981' },
  { name: 'HIIT', value: 15, color: '#f59e0b' },
  { name: 'Recovery', value: 10, color: '#8b5cf6' },
  { name: 'Flexibility', value: 5, color: '#ec4899' },
];

const weeklyVolumeData = [
  { day: 'Mon', volume: 45 },
  { day: 'Tue', volume: 60 },
  { day: 'Wed', volume: 30 },
  { day: 'Thu', volume: 75 },
  { day: 'Fri', volume: 50 },
  { day: 'Sat', volume: 90 },
  { day: 'Sun', volume: 0 },
];

const personalRecords = [
  { 
    exercise: 'Bench Press', 
    current: 185, 
    previous: 175, 
    unit: 'lbs', 
    date: '2 days ago',
    improvement: 5.7
  },
  { 
    exercise: '5K Run', 
    current: 22.5, 
    previous: 24, 
    unit: 'min', 
    date: '1 week ago',
    improvement: 6.3
  },
  { 
    exercise: 'Deadlift', 
    current: 275, 
    previous: 265, 
    unit: 'lbs', 
    date: '3 days ago',
    improvement: 3.8
  },
  { 
    exercise: 'Pull-ups', 
    current: 12, 
    previous: 10, 
    unit: 'reps', 
    date: '5 days ago',
    improvement: 20
  },
];

const strengthProgressData = [
  { exercise: 'Bench Press', value: 85 },
  { exercise: 'Squat', value: 90 },
  { exercise: 'Deadlift', value: 80 },
  { exercise: 'Shoulder Press', value: 70 },
  { exercise: 'Pull-ups', value: 75 },
];

/**
 * WorkoutAnalytics: Dashboard for tracking workout performance and progress
 * 
 * This dashboard provides detailed analytics on workout performance,
 * progress tracking, and personal records with interactive visualizations.
 */
const WorkoutAnalytics = () => {
  const { isOnline } = useNetworkStatus();
  const [timeRange, setTimeRange] = useState("8weeks");

  return (
    <DashboardLayout title="Workout Analytics">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Workout Analytics</h1>
            <p className="text-muted-foreground">
              Track your performance metrics and training progress
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4weeks">Last 4 Weeks</SelectItem>
                <SelectItem value="8weeks">Last 8 Weeks</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            {!isOnline && (
              <OfflineIndicator
                variant="badge"
                featureSpecific={true}
                featureName="Analytics data"
              />
            )}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Track your progress across key performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="strength" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Strength"
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="endurance" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Endurance"
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="power" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Power"
                    activeDot={{ r: 6 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workout Distribution and Volume */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Workout Type Distribution</CardTitle>
            <CardDescription>Breakdown of your training focus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={workoutTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {workoutTypeData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Training Volume</CardTitle>
            <CardDescription>Your workout minutes by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={weeklyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#3b82f6" name="Minutes" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">Total: </span>
                <span className="font-medium ml-1">
                  {weeklyVolumeData.reduce((acc, day) => acc + day.volume, 0)} minutes
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">Active days: </span>
                <span className="font-medium ml-1">
                  {weeklyVolumeData.filter(day => day.volume > 0).length}/7
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Records and Strength Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Records</CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {personalRecords.map((record, index) => (
                <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-full text-amber-600 mr-3">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{record.exercise}</h4>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        +{record.improvement}%
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <span className="text-muted-foreground mr-2">
                        {record.current} {record.unit}
                      </span>
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-600">from {record.previous} {record.unit}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              View All Records
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strength Progress</CardTitle>
            <CardDescription>Your progress on key strength exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={strengthProgressData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="exercise" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Strength" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <BarChart className="mr-2 h-4 w-4" />
              Detailed Analysis
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkoutAnalytics;
