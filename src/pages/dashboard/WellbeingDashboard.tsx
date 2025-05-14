
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Moon, Sun, Brain, Zap, Battery, BatteryMedium, BatteryLow, Clock, Calendar, Plus, ArrowRight, Dumbbell, Flame, Sparkles, Waves, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, Legend } from "recharts";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { OfflineContentBadge } from "@/components/ui/offline-content-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample data for charts
const sleepData = [
  { day: 'Mon', hours: 7.5, quality: 8, deepSleep: 2.1, remSleep: 1.8, lightSleep: 3.6 },
  { day: 'Tue', hours: 8, quality: 9, deepSleep: 2.4, remSleep: 2.0, lightSleep: 3.6 },
  { day: 'Wed', hours: 6.5, quality: 6, deepSleep: 1.5, remSleep: 1.5, lightSleep: 3.5 },
  { day: 'Thu', hours: 7, quality: 7, deepSleep: 1.8, remSleep: 1.7, lightSleep: 3.5 },
  { day: 'Fri', hours: 8.5, quality: 9, deepSleep: 2.5, remSleep: 2.2, lightSleep: 3.8 },
  { day: 'Sat', hours: 9, quality: 10, deepSleep: 2.8, remSleep: 2.4, lightSleep: 3.8 },
  { day: 'Sun', hours: 8, quality: 8, deepSleep: 2.2, remSleep: 2.0, lightSleep: 3.8 },
];

const stressData = [
  { day: 'Mon', level: 6, hrv: 45, restingHr: 62 },
  { day: 'Tue', level: 4, hrv: 52, restingHr: 60 },
  { day: 'Wed', level: 7, hrv: 38, restingHr: 65 },
  { day: 'Thu', level: 5, hrv: 48, restingHr: 61 },
  { day: 'Fri', level: 3, hrv: 55, restingHr: 58 },
  { day: 'Sat', level: 2, hrv: 60, restingHr: 56 },
  { day: 'Sun', level: 4, hrv: 50, restingHr: 59 },
];

const moodData = [
  { day: 'Mon', score: 7, energy: 6, focus: 7 },
  { day: 'Tue', score: 8, energy: 8, focus: 7 },
  { day: 'Wed', score: 6, energy: 5, focus: 6 },
  { day: 'Thu', score: 7, energy: 7, focus: 8 },
  { day: 'Fri', score: 9, energy: 8, focus: 9 },
  { day: 'Sat', score: 9, energy: 9, focus: 8 },
  { day: 'Sun', score: 8, energy: 7, focus: 7 },
];

const recoveryData = [
  { day: 'Mon', score: 82, readiness: 78, strain: 65 },
  { day: 'Tue', score: 85, readiness: 82, strain: 58 },
  { day: 'Wed', score: 76, readiness: 70, strain: 82 },
  { day: 'Thu', score: 80, readiness: 75, strain: 70 },
  { day: 'Fri', score: 88, readiness: 85, strain: 62 },
  { day: 'Sat', score: 92, readiness: 90, strain: 45 },
  { day: 'Sun', score: 87, readiness: 84, strain: 55 },
];

const wellbeingRadarData = [
  { metric: 'Sleep', value: 85 },
  { metric: 'Stress', value: 70 },
  { metric: 'Mood', value: 80 },
  { metric: 'Energy', value: 75 },
  { metric: 'Recovery', value: 85 },
  { metric: 'Nutrition', value: 65 },
];

const meditationData = [
  { day: 'Mon', minutes: 10 },
  { day: 'Tue', minutes: 15 },
  { day: 'Wed', minutes: 0 },
  { day: 'Thu', minutes: 10 },
  { day: 'Fri', minutes: 20 },
  { day: 'Sat', minutes: 15 },
  { day: 'Sun', minutes: 10 },
];

const WellbeingDashboard = () => {
  const { isOnline } = useNetworkStatus();
  const [activeTab, setActiveTab] = useState("sleep");

  // Calculate recovery status based on the latest recovery score
  const getRecoveryStatus = () => {
    const latestScore = recoveryData[recoveryData.length - 1].score;
    if (latestScore >= 85) return { status: "Excellent", color: "green" };
    if (latestScore >= 75) return { status: "Good", color: "blue" };
    if (latestScore >= 65) return { status: "Moderate", color: "amber" };
    return { status: "Needs Attention", color: "red" };
  };

  const recoveryStatus = getRecoveryStatus();

  return (
    <DashboardLayout title="Wellbeing Dashboard">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Recovery & Wellbeing
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Track your recovery metrics and wellbeing factors to optimize training and prevent burnout
            </p>
          </div>
          {!isOnline && (
            <OfflineIndicator
              variant="badge"
              featureSpecific={true}
              featureName="Wellbeing data"
            />
          )}
        </div>
      </div>

      {/* Recovery Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-green-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="pt-6 pb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Recovery Status</p>
                <h3 className="text-3xl font-bold text-green-700 mt-1">{recoveryStatus.status}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> Score: {recoveryData[recoveryData.length - 1].score}/100
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="pt-6 pb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Sleep Quality</p>
                <h3 className="text-3xl font-bold text-blue-700 mt-1">{sleepData[sleepData.length - 1].quality}/10</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Moon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-blue-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> {sleepData[sleepData.length - 1].hours} hours
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="pt-6 pb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Stress Level</p>
                <h3 className="text-3xl font-bold text-purple-700 mt-1">{stressData[stressData.length - 1].level}/10</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-purple-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> HRV: {stressData[stressData.length - 1].hrv} ms
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="pt-6 pb-4 relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Mood Today</p>
                <h3 className="text-3xl font-bold text-amber-700 mt-1">{moodData[moodData.length - 1].score}/10</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <Sun className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-amber-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> Energy: {moodData[moodData.length - 1].energy}/10
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wellbeing Radar Chart */}
      <div className="mb-8">
        <Card className="shadow-lg border border-gray-200/50 overflow-hidden">
          {!isOnline && <OfflineContentBadge contentType="recovery data" position="top-right" />}
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md text-green-600 mr-3">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Wellbeing Overview</CardTitle>
                <CardDescription>Your holistic wellbeing profile across key metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-8 pt-6">
            <div className="h-[320px] w-full md:w-1/2 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-green-500" />
                Wellbeing Balance
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={wellbeingRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} axisLine={false} />
                  <Radar
                    name="Wellbeing"
                    dataKey="value"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "none"
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Recovery Trends
              </h3>
              <div className="h-[280px] bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={recoveryData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        border: "none"
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Recovery Score"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "white" }}
                      activeDot={{ r: 7, fill: "#22c55e", strokeWidth: 2, stroke: "white" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="readiness"
                      name="Readiness"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#3b82f6", strokeWidth: 2, stroke: "white" }}
                      activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "white" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="strain"
                      name="Training Strain"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#ef4444", strokeWidth: 2, stroke: "white" }}
                      activeDot={{ r: 6, fill: "#ef4444", strokeWidth: 2, stroke: "white" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sleep" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="w-full bg-muted mb-4">
          <TabsTrigger value="sleep" className="flex items-center">
            <Moon className="mr-2 h-4 w-4" /> Sleep Analysis
          </TabsTrigger>
          <TabsTrigger value="stress" className="flex items-center">
            <Brain className="mr-2 h-4 w-4" /> Stress Management
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center">
            <Sun className="mr-2 h-4 w-4" /> Mood Tracking
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center">
            <Waves className="mr-2 h-4 w-4" /> Mindfulness
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Analysis</CardTitle>
              <CardDescription>Track your sleep duration, quality, and sleep stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-blue-600 mb-1">Average Sleep</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {(sleepData.reduce((acc, day) => acc + day.hours, 0) / sleepData.length).toFixed(1)}h
                  </p>
                  <p className="text-xs text-blue-500 mt-1">Last 7 days</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-indigo-600 mb-1">Deep Sleep</p>
                  <p className="text-3xl font-bold text-indigo-700">
                    {sleepData[sleepData.length - 1].deepSleep}h
                  </p>
                  <p className="text-xs text-indigo-500 mt-1">Last night</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-purple-600 mb-1">REM Sleep</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {sleepData[sleepData.length - 1].remSleep}h
                  </p>
                  <p className="text-xs text-purple-500 mt-1">Last night</p>
                </div>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sleepData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="deepSleep" stackId="1" stroke="#4f46e5" fill="#4f46e5" name="Deep Sleep" />
                    <Area type="monotone" dataKey="remSleep" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="REM Sleep" />
                    <Area type="monotone" dataKey="lightSleep" stackId="1" stroke="#93c5fd" fill="#93c5fd" name="Light Sleep" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Log Sleep Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="stress">
          <Card>
            <CardHeader>
              <CardTitle>Stress & Recovery</CardTitle>
              <CardDescription>Monitor your stress levels, HRV, and resting heart rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Heart Rate Variability</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={stressData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[30, 70]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="hrv"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Stress Level</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={stressData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="level"
                          stroke="#ef4444"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Stress Management Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full text-green-600 mr-2 mt-0.5">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <span>Practice deep breathing for 5 minutes when stress levels rise</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full text-blue-600 mr-2 mt-0.5">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <span>Take short breaks during high-intensity work periods</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 p-1 rounded-full text-purple-600 mr-2 mt-0.5">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <span>Consider a 10-minute meditation session before bed</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Mood & Energy Tracking</CardTitle>
              <CardDescription>Monitor your daily mood, energy levels, and focus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-amber-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-amber-600 mb-1">Average Mood</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {(moodData.reduce((acc, day) => acc + day.score, 0) / moodData.length).toFixed(1)}/10
                  </p>
                  <p className="text-xs text-amber-500 mt-1">Last 7 days</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-orange-600 mb-1">Energy Level</p>
                  <p className="text-3xl font-bold text-orange-700">
                    {moodData[moodData.length - 1].energy}/10
                  </p>
                  <p className="text-xs text-orange-500 mt-1">Today</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-emerald-600 mb-1">Focus</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {moodData[moodData.length - 1].focus}/10
                  </p>
                  <p className="text-xs text-emerald-500 mt-1">Today</p>
                </div>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={moodData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#eab308"
                      strokeWidth={2}
                      name="Mood"
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#f97316"
                      strokeWidth={2}
                      name="Energy"
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="focus"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Focus"
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Log Today's Mood
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="meditation">
          <Card>
            <CardHeader>
              <CardTitle>Meditation Practice</CardTitle>
              <CardDescription>Track your meditation sessions and mindfulness practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Weekly Meditation</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={meditationData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="minutes" fill="#8b5cf6" name="Minutes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Meditation Stats</h3>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-purple-600">Total This Week</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {meditationData.reduce((acc, day) => acc + day.minutes, 0)} min
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <Waves className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-purple-700">Weekly Goal</span>
                          <span className="text-sm text-purple-600">
                            {meditationData.reduce((acc, day) => acc + day.minutes, 0)}/90 min
                          </span>
                        </div>
                        <Progress
                          value={(meditationData.reduce((acc, day) => acc + day.minutes, 0) / 90) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-purple-700">Streak</span>
                          <span className="text-sm text-purple-600">5 days</span>
                        </div>
                        <Progress value={5 / 7 * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Recommended Sessions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                            <Waves className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Stress Relief</p>
                            <p className="text-xs text-muted-foreground">10 min</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3">
                            <Waves className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Deep Focus</p>
                            <p className="text-xs text-muted-foreground">15 min</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Log Meditation Session
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>AI-powered wellbeing insights based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-lg">
                <div className="flex items-start">
                  <div className="p-2 bg-green-100 rounded-full text-green-600 mr-3">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Recovery Optimization</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your recovery scores are trending upward. To maintain this momentum, consider adding an extra
                      30 minutes of sleep on nights before intense training sessions.
                    </p>
                    <div className="mt-2 flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">Recovery</Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sleep</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg">
                <div className="flex items-start">
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600 mr-3">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Stress Management</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Your HRV readings indicate elevated stress on Wednesdays. Consider scheduling a 15-minute
                      meditation session midweek to help manage stress levels.
                    </p>
                    <div className="mt-2 flex items-center">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mr-2">Stress</Badge>
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Meditation</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg">
                <div className="flex items-start">
                  <div className="p-2 bg-amber-100 rounded-full text-amber-600 mr-3">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800">Training Readiness</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Based on your current recovery metrics, you're in an optimal state for a high-intensity
                      workout today. Your body is showing excellent adaptation to your training load.
                    </p>
                    <div className="mt-2 flex items-center">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-2">Performance</Badge>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Training</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              View All Recommendations
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>Your wellbeing trends this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-green-500" />
                    Recovery Score
                  </h4>
                  <span className="text-sm text-green-600 font-medium">↑ 3%</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">85</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium flex items-center">
                    <Moon className="h-4 w-4 mr-1 text-blue-500" />
                    Avg. Sleep
                  </h4>
                  <span className="text-sm text-blue-600 font-medium">↑ 0.3 hrs</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">7.8</span>
                  <span className="text-sm text-muted-foreground">hrs/night</span>
                </div>
                <Progress value={7.8 / 9 * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium flex items-center">
                    <Brain className="h-4 w-4 mr-1 text-purple-500" />
                    Stress Level
                  </h4>
                  <span className="text-sm text-purple-600 font-medium">↓ 12%</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">4.2</span>
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
                <Progress value={(10 - 4.2) / 10 * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium flex items-center">
                    <Flame className="h-4 w-4 mr-1 text-red-500" />
                    Training Load
                  </h4>
                  <span className="text-sm text-amber-600 font-medium">Optimal</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">7.2</span>
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WellbeingDashboard;
