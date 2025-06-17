import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Award,
  BarChart2,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  LineChart,
  Maximize2,
  Target,
  Zap,
  Loader2,
  Sliders
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/UserPreferencesContext";
import { useAccessibilitySettings } from "@/context/UserPreferencesContext";
import { DashboardCustomizer, DashboardLayout as LayoutType, WidgetVisibility } from "@/components/dashboard/DashboardCustomizer";
import { useLocalStorageValue, useLocalStorageObject } from "@/hooks/use-local-storage";

const performanceData = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 72 },
  { day: 'Wed', value: 68 },
  { day: 'Thu', value: 75 },
  { day: 'Fri', value: 80 },
  { day: 'Sat', value: 85 },
  { day: 'Sun', value: 78 },
];

const workoutDistribution = [
  { name: 'Strength', value: 40, color: '#3b82f6' },
  { name: 'Cardio', value: 30, color: '#10b981' },
  { name: 'Flexibility', value: 15, color: '#f59e0b' },
  { name: 'Recovery', value: 15, color: '#8b5cf6' },
];

const weeklyGoals = [
  { name: 'Workouts', completed: 4, total: 5, color: '#3b82f6' },
  { name: 'Protein', completed: 85, total: 100, color: '#10b981' },
  { name: 'Sleep', completed: 42, total: 56, color: '#8b5cf6' },
  { name: 'Water', completed: 2.5, total: 3, color: '#0ea5e9', unit: 'L' },
];

const upcomingWorkouts = [
  {
    day: 'Today',
    name: 'Upper Body Strength',
    time: '5:00 PM',
    duration: '45 min',
    type: 'Strength',
    color: '#3b82f6'
  },
  {
    day: 'Tomorrow',
    name: 'HIIT Cardio',
    time: '6:30 AM',
    duration: '30 min',
    type: 'Cardio',
    color: '#10b981'
  },
  {
    day: 'Wednesday',
    name: 'Recovery & Mobility',
    time: '7:00 PM',
    duration: '40 min',
    type: 'Recovery',
    color: '#8b5cf6'
  },
];

const recentAchievements = [
  {
    title: 'New Personal Best',
    description: 'Bench Press: 185 lbs',
    date: '2 days ago',
    icon: Award
  },
  {
    title: 'Workout Streak',
    description: '10 days in a row',
    date: '1 day ago',
    icon: Flame
  },
  {
    title: 'Goal Reached',
    description: 'Completed 20 workouts this month',
    date: 'Today',
    icon: Target
  },
];

const AthleteDashboard = () => {
  const { isOnline } = useNetworkStatus();
  const { resolvedTheme } = useTheme();
  const { accessibilitySettings } = useAccessibilitySettings();

  const [isLoading, setIsLoading] = useState(false);
  const [showLayoutCustomizer, setShowLayoutCustomizer] = useState(false);

  const [dashboardLayout, setDashboardLayout] = useLocalStorageValue<LayoutType>(
    'dashboard-layout',
    'default'
  );

  const defaultWidgetVisibility: WidgetVisibility = {
    performanceMetrics: true,
    workoutDistribution: true,
    weeklyGoals: true,
    upcomingWorkouts: true,
    achievements: true,
    quickStats: true
  };

  const [widgetVisibility, setWidgetVisibility] = useLocalStorageObject<WidgetVisibility>(
    'dashboard-widgets',
    defaultWidgetVisibility
  );

  const resetDashboardCustomization = useCallback(() => {
    setDashboardLayout('default');
    setWidgetVisibility(defaultWidgetVisibility);
  }, [setDashboardLayout, setWidgetVisibility]);

  const getChartColors = useCallback(() => {
    const isDark = resolvedTheme === 'dark';
    return {
      performance: {
        stroke: isDark ? '#60a5fa' : '#3b82f6',
        fill: isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        grid: isDark ? '#374151' : '#f1f5f9',
        text: isDark ? '#94a3b8' : '#64748b'
      },
      strength: {
        stroke: isDark ? '#a78bfa' : '#8b5cf6',
        fill: isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(139, 92, 246, 0.1)',
        grid: isDark ? '#374151' : '#f1f5f9',
        text: isDark ? '#94a3b8' : '#64748b'
      },
      endurance: {
        stroke: isDark ? '#34d399' : '#10b981',
        fill: isDark ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.1)',
        grid: isDark ? '#374151' : '#f1f5f9',
        text: isDark ? '#94a3b8' : '#64748b'
      }
    };
  }, [resolvedTheme]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderDashboardCustomizer = () => (
    <DashboardCustomizer
      open={showLayoutCustomizer}
      onOpenChange={setShowLayoutCustomizer}
      layout={dashboardLayout}
      onLayoutChange={setDashboardLayout}
      widgetVisibility={widgetVisibility}
      onWidgetVisibilityChange={setWidgetVisibility}
      onReset={resetDashboardCustomization}
    />
  );

  return (
    <DashboardLayout title="Athlete Dashboard">
      {renderDashboardCustomizer()}

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-athleteBlue-600 to-athleteGreen-500 bg-clip-text text-transparent">
              Athlete Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Your personalized training hub for peak performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowLayoutCustomizer(true)}
              aria-label="Customize dashboard layout"
            >
              <Sliders className="h-4 w-4" />
              <span>Customize</span>
            </Button>
            {!isOnline && (
              <OfflineIndicator
                showRetryButton={false}
                className="ml-2"
              />
            )}
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ${!widgetVisibility.quickStats ? 'hidden' : ''}`}>
        <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="pt-6 pb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Weekly Training Load</p>
                <h3 className="text-3xl font-bold text-blue-700 mt-1">8.2</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-blue-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> Optimal zone
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-green-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="pt-6 pb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Recovery Status</p>
                <h3 className="text-3xl font-bold text-green-700 mt-1">Good</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> 85% recovered
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="pt-6 pb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Monthly Progress</p>
                <h3 className="text-3xl font-bold text-purple-700 mt-1">+12%</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <LineChart className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-purple-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> Above target
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="pt-6 pb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Workout Streak</p>
                <h3 className="text-3xl font-bold text-amber-700 mt-1">10 days</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Flame className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-amber-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> Personal best!
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Performance Chart */}
        <Card className={`md:col-span-2 shadow-lg border border-gray-200/50 overflow-hidden ${!widgetVisibility.performanceMetrics ? 'hidden' : ''}`}>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
                <BarChart2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Performance Metrics</CardTitle>
                <CardDescription>Track your key performance indicators</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-lg">Loading your personalized metrics...</span>
              </div>
            ) : (
              <Tabs
                defaultValue="performance"
                className="mb-4"
              >
                <TabsList className="grid grid-cols-3 p-1 bg-gray-100/80 dark:bg-gray-800/50">
                  <TabsTrigger
                    value="performance"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-md"
                    aria-label="Performance metrics tab"
                  >
                    Performance
                  </TabsTrigger>
                  <TabsTrigger
                    value="strength"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-md"
                    aria-label="Strength metrics tab"
                  >
                    Strength
                  </TabsTrigger>
                  <TabsTrigger
                    value="endurance"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 data-[state=active]:shadow-md"
                    aria-label="Endurance metrics tab"
                  >
                    Endurance
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="performance" className="mt-6">
                  <div className="h-[320px] p-2" aria-label="Performance metrics chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getChartColors().performance.stroke} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={getChartColors().performance.stroke} stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().performance.grid} />
                        <XAxis
                          dataKey="day"
                          stroke={getChartColors().performance.text}
                          tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                        />
                        <YAxis
                          stroke={getChartColors().performance.text}
                          tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: resolvedTheme === 'dark' ? "#1f2937" : "white",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            fontSize: accessibilitySettings.largeText ? '1.1rem' : '1rem',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={getChartColors().performance.stroke}
                          strokeWidth={accessibilitySettings.highContrast ? 4 : 3}
                          dot={{
                            r: accessibilitySettings.highContrast ? 5 : 4,
                            fill: getChartColors().performance.stroke,
                            strokeWidth: 2,
                            stroke: resolvedTheme === 'dark' ? "#1f2937" : "white"
                          }}
                          activeDot={{
                            r: accessibilitySettings.highContrast ? 8 : 7,
                            fill: getChartColors().performance.stroke,
                            strokeWidth: 2,
                            stroke: resolvedTheme === 'dark' ? "#1f2937" : "white"
                          }}
                          fillOpacity={1}
                          fill="url(#colorPerformance)"
                          animationDuration={accessibilitySettings.reduceMotion ? 0 : 1500}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="strength" className="mt-6">
                  <div className="h-[320px] p-2" aria-label="Strength metrics chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="colorStrength" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getChartColors().strength.stroke} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={getChartColors().strength.stroke} stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().strength.grid} />
                        <XAxis
                          dataKey="day"
                          stroke={getChartColors().strength.text}
                          tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                        />
                        <YAxis
                          stroke={getChartColors().strength.text}
                          tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: resolvedTheme === 'dark' ? "#1f2937" : "white",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            fontSize: accessibilitySettings.largeText ? '1.1rem' : '1rem',
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="url(#colorStrength)"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                          animationDuration={accessibilitySettings.reduceMotion ? 0 : 1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="endurance" className="mt-6">
                  <div className="h-[320px] p-2" aria-label="Endurance metrics chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="colorEndurance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getChartColors().endurance.stroke} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={getChartColors().endurance.stroke} stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().endurance.grid} />
                        <XAxis
                          dataKey="day"
                          stroke={getChartColors().endurance.text}
                          tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                        />
                        <YAxis
                          stroke={getChartColors().endurance.text}
                          tick={{ fontSize: accessibilitySettings.largeText ? 14 : 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: resolvedTheme === 'dark' ? "#1f2937" : "white",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            fontSize: accessibilitySettings.largeText ? '1.1rem' : '1rem',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={getChartColors().endurance.stroke}
                          strokeWidth={accessibilitySettings.highContrast ? 4 : 3}
                          dot={{
                            r: accessibilitySettings.highContrast ? 5 : 4,
                            fill: getChartColors().endurance.stroke,
                            strokeWidth: 2,
                            stroke: resolvedTheme === 'dark' ? "#1f2937" : "white"
                          }}
                          activeDot={{
                            r: accessibilitySettings.highContrast ? 8 : 7,
                            fill: getChartColors().endurance.stroke,
                            strokeWidth: 2,
                            stroke: resolvedTheme === 'dark' ? "#1f2937" : "white"
                          }}
                          fillOpacity={1}
                          fill="url(#colorEndurance)"
                          animationDuration={accessibilitySettings.reduceMotion ? 0 : 1500}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Workout Distribution */}
        <Card className={`shadow-lg border border-gray-200/50 overflow-hidden ${!widgetVisibility.workoutDistribution ? 'hidden' : ''}`}>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-md text-indigo-600 mr-3">
                <BarChart2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Workout Distribution</CardTitle>
                <CardDescription>Your training focus breakdown</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="ml-2 text-lg">Loading your workout data...</span>
              </div>
            ) : (
              <>
                <div className="h-[260px] flex items-center justify-center" aria-label="Workout distribution pie chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workoutDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={accessibilitySettings.highContrast ? 55 : 60}
                        outerRadius={accessibilitySettings.highContrast ? 95 : 90}
                        paddingAngle={accessibilitySettings.highContrast ? 3 : 5}
                        dataKey="value"
                        stroke={resolvedTheme === 'dark' ? "#1f2937" : "#fff"}
                        strokeWidth={accessibilitySettings.highContrast ? 3 : 2}
                        animationDuration={accessibilitySettings.reduceMotion ? 0 : 1500}
                      >
                        {workoutDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="drop-shadow-sm hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: resolvedTheme === 'dark' ? "#1f2937" : "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "none",
                          fontSize: accessibilitySettings.largeText ? '1.1rem' : '1rem',
                        }}
                        formatter={(value) => [`${value}%`, 'Percentage']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  {workoutDistribution.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center group"
                      role="group"
                      aria-label={`${item.name}: ${item.value}%`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mr-2 group-hover:scale-110 transition-transform ${accessibilitySettings.highContrast ? 'ring-2 ring-offset-2' : ''}`}
                        style={{
                          backgroundColor: item.color,
                          ...(accessibilitySettings.highContrast && {
                            '--ring-color': resolvedTheme === 'dark' ? "#f1f5f9" : "#1f2937"
                          })
                        } as React.CSSProperties}
                      ></div>
                      <div className="flex flex-col">
                        <span className={`${accessibilitySettings.largeText ? 'text-base' : 'text-sm'} font-medium`}>
                          {item.name}
                        </span>
                        <span className={`${accessibilitySettings.largeText ? 'text-sm' : 'text-xs'} ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Goals */}
        <Card className={`shadow-lg border border-gray-200/50 overflow-hidden ${!widgetVisibility.weeklyGoals ? 'hidden' : ''}`}>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md text-green-600 mr-3">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Weekly Goals</CardTitle>
                <CardDescription>Your progress toward this week's targets</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                <span className="ml-2 text-lg">Loading your goals...</span>
              </div>
            ) : (
              <div className="space-y-5">
                {weeklyGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                    role="group"
                    aria-label={`${goal.name}: ${goal.completed} of ${goal.total} ${goal.unit || ''}`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className={`${accessibilitySettings.largeText ? 'text-base' : 'text-sm'} font-medium flex items-center`}>
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${accessibilitySettings.highContrast ? 'ring-1 ring-offset-1' : ''}`}
                          style={{
                            backgroundColor: goal.color,
                            ...(accessibilitySettings.highContrast && {
                              '--ring-color': resolvedTheme === 'dark' ? "#f1f5f9" : "#1f2937"
                            })
                          } as React.CSSProperties}
                        ></div>
                        {goal.name}
                      </span>
                      <span
                        className={`${accessibilitySettings.largeText ? 'text-base' : 'text-sm'} font-medium`}
                        style={{
                          color: goal.color,
                          fontWeight: accessibilitySettings.highContrast ? 700 : 500
                        }}
                      >
                        {goal.completed}{goal.unit ? goal.unit : ''}/{goal.total}{goal.unit ? goal.unit : ''}
                      </span>
                    </div>
                    <Progress
                      value={(goal.completed / goal.total) * 100}
                      className={`${accessibilitySettings.highContrast ? 'h-3' : 'h-2'}`}
                      aria-label={`${goal.name} progress: ${Math.round((goal.completed / goal.total) * 100)}%`}
                      style={{
                        "--progress-background": goal.color
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <Button
              variant="outline"
              className={`w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${accessibilitySettings.highContrast ? 'border-2 border-green-600 dark:border-green-400 font-bold' : ''}`}
              aria-label="Set new fitness goals"
            >
              <Target className={`mr-2 ${accessibilitySettings.largeText ? 'h-5 w-5' : 'h-4 w-4'}`} />
              Set New Goals
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Workouts & Achievements */}
        <Card className={`shadow-lg border border-gray-200/50 overflow-hidden ${!widgetVisibility.upcomingWorkouts && !widgetVisibility.achievements ? 'hidden' : ''}`}>
          <Tabs defaultValue="upcoming">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Schedule & Achievements</CardTitle>
                </div>
                <TabsList className="bg-gray-100/80">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
                  >
                    Achievements
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="upcoming" className={`m-0 ${!widgetVisibility.upcomingWorkouts ? 'hidden' : ''}`}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-lg">Loading your schedule...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingWorkouts.map((workout, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        role="group"
                        aria-label={`${workout.name} workout: ${workout.type} on ${workout.day} at ${workout.time} for ${workout.duration}`}
                      >
                        <div
                          className={`w-2 h-full min-h-[50px] rounded-full mr-4 ${accessibilitySettings.highContrast ? 'w-3' : 'w-2'}`}
                          style={{ backgroundColor: workout.color }}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className={`font-medium ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
                              {workout.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-sm ${accessibilitySettings.highContrast ? 'font-bold' : 'font-medium'}`}
                              style={{
                                color: workout.color,
                                borderColor: `${workout.color}${resolvedTheme === 'dark' ? '60' : '30'}`
                              }}
                            >
                              {workout.type}
                            </Badge>
                          </div>
                          <div className={`flex flex-wrap items-center ${accessibilitySettings.largeText ? 'text-sm' : 'text-xs'} text-muted-foreground mt-2 gap-2`}>
                            <div className={`flex items-center mr-3 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} px-2 py-1 rounded`}>
                              <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                              <span>{workout.day}</span>
                            </div>
                            <div className={`flex items-center mr-3 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} px-2 py-1 rounded`}>
                              <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                              <span>{workout.time}</span>
                            </div>
                            <div className={`flex items-center ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-white'} px-2 py-1 rounded`}>
                              <Maximize2 className="h-3 w-3 mr-1" aria-hidden="true" />
                              <span>{workout.duration}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`View details for ${workout.name}`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="achievements" className={`m-0 ${!widgetVisibility.achievements ? 'hidden' : ''}`}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    <span className="ml-2 text-lg">Loading your achievements...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAchievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        role="article"
                        aria-label={`Achievement: ${achievement.title}`}
                      >
                        <div className={`p-3 rounded-full bg-gradient-to-br ${resolvedTheme === 'dark' ? 'from-amber-800 to-amber-700' : 'from-amber-100 to-amber-200'} text-amber-${resolvedTheme === 'dark' ? '300' : '600'} mr-4 shadow-sm ${accessibilitySettings.highContrast ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}>
                          <achievement.icon className={`${accessibilitySettings.largeText ? 'h-6 w-6' : 'h-5 w-5'}`} aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'} ${resolvedTheme === 'dark' ? 'text-amber-300' : 'text-amber-800'}`}>
                            {achievement.title}
                          </h4>
                          <p className={`${accessibilitySettings.largeText ? 'text-base' : 'text-sm'} ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                            {achievement.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <Badge
                              variant="outline"
                              className={`${resolvedTheme === 'dark' ? 'bg-gray-700 border-amber-700 text-amber-300' : 'bg-white text-amber-600 border-amber-200'} ${accessibilitySettings.highContrast ? 'font-bold' : ''}`}
                            >
                              {achievement.date}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <Button
                asChild
                variant="outline"
                className={`w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${accessibilitySettings.highContrast ? 'border-2 border-blue-600 dark:border-blue-400 font-bold' : ''}`}
              >
                <Link
                  to="/today"
                  className="flex items-center justify-center"
                  aria-label="View your full workout schedule"
                >
                  <Calendar className={`mr-2 ${accessibilitySettings.largeText ? 'h-5 w-5' : 'h-4 w-4'}`} />
                  View Full Schedule
                </Link>
              </Button>
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AthleteDashboard;
