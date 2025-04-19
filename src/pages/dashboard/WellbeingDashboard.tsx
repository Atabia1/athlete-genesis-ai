
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Moon, Sun } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Sample data for charts
const sleepData = [
  { day: 'Mon', hours: 7.5, quality: 8 },
  { day: 'Tue', hours: 8, quality: 9 },
  { day: 'Wed', hours: 6.5, quality: 6 },
  { day: 'Thu', hours: 7, quality: 7 },
  { day: 'Fri', hours: 8.5, quality: 9 },
  { day: 'Sat', hours: 9, quality: 10 },
  { day: 'Sun', hours: 8, quality: 8 },
];

const stressData = [
  { day: 'Mon', level: 6 },
  { day: 'Tue', level: 4 },
  { day: 'Wed', level: 7 },
  { day: 'Thu', level: 5 },
  { day: 'Fri', level: 3 },
  { day: 'Sat', level: 2 },
  { day: 'Sun', level: 4 },
];

const moodData = [
  { day: 'Mon', score: 7 },
  { day: 'Tue', score: 8 },
  { day: 'Wed', score: 6 },
  { day: 'Thu', score: 7 },
  { day: 'Fri', score: 9 },
  { day: 'Sat', score: 9 },
  { day: 'Sun', score: 8 },
];

const recoveryData = [
  { day: 'Mon', score: 82 },
  { day: 'Tue', score: 85 },
  { day: 'Wed', score: 76 },
  { day: 'Thu', score: 80 },
  { day: 'Fri', score: 88 },
  { day: 'Sat', score: 92 },
  { day: 'Sun', score: 87 },
];

const WellbeingDashboard = () => {
  return (
    <DashboardLayout title="Wellbeing Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Recovery & Wellbeing</h1>
        <p className="text-muted-foreground">
          Track your recovery metrics and wellbeing factors to optimize training and prevent burnout
        </p>
      </div>
      
      <div className="mb-8">
        <Card className="shadow-sm border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-6 w-6 text-green-500" />
              Recovery Overview
            </CardTitle>
            <CardDescription>Your overall recovery score based on multiple factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sleep" className="mb-8">
        <TabsList className="w-full bg-muted mb-4">
          <TabsTrigger value="sleep" className="flex items-center">
            <Moon className="mr-2 h-4 w-4" /> Sleep
          </TabsTrigger>
          <TabsTrigger value="stress" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" /> Stress
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center">
            <Sun className="mr-2 h-4 w-4" /> Mood
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Analysis</CardTitle>
              <CardDescription>Track your sleep duration and quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
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
                    <Bar dataKey="hours" fill="#3b82f6" name="Hours" />
                    <Bar dataKey="quality" fill="#8b5cf6" name="Quality" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stress">
          <Card>
            <CardHeader>
              <CardTitle>Stress Levels</CardTitle>
              <CardDescription>Monitor your stress levels (1-10 scale)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
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
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracking</CardTitle>
              <CardDescription>Track your daily mood (1-10 scale)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
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
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#eab308"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>AI-powered wellbeing recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-3 bg-green-50 border border-green-100 rounded-md text-green-700">
                <strong>Great recovery trend!</strong> Your consistency is paying off.
              </li>
              <li className="p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-700">
                <strong>Sleep improvement:</strong> Try to maintain your weekend sleep schedule during weekdays.
              </li>
              <li className="p-3 bg-amber-50 border border-amber-100 rounded-md text-amber-700">
                <strong>Stress management:</strong> Consider adding 10 minutes of meditation on high-stress days.
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Insights</CardTitle>
            <CardDescription>Analysis of your wellbeing data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="text-sm text-muted-foreground">Recovery Score</p>
                <p className="text-2xl font-bold">85/100</p>
                <p className="text-xs text-green-600">↑ 3% from last week</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-muted-foreground">Avg. Sleep</p>
                <p className="text-2xl font-bold">7.8 hrs</p>
                <p className="text-xs text-blue-600">↑ 0.3 hrs from last week</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <p className="text-sm text-muted-foreground">Readiness to Train</p>
                <p className="text-2xl font-bold">High</p>
                <p className="text-xs text-purple-600">Ready for high-intensity workout</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WellbeingDashboard;
