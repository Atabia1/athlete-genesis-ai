
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Moon, Users, Activity, Zap, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";
import OfflineContentBadge from "@/components/ui/offline-content-badge";

// Mock data for charts
const stressData = [
  { day: 'Mon', level: 3.2 },
  { day: 'Tue', level: 2.8 },
  { day: 'Wed', level: 4.1 },
  { day: 'Thu', level: 2.9 },
  { day: 'Fri', level: 3.5 },
  { day: 'Sat', level: 2.1 },
  { day: 'Sun', level: 1.8 },
];

const sleepData = [
  { day: 'Mon', hours: 7.5, quality: 85 },
  { day: 'Tue', hours: 8.2, quality: 92 },
  { day: 'Wed', hours: 6.8, quality: 78 },
  { day: 'Thu', hours: 7.9, quality: 88 },
  { day: 'Fri', hours: 7.1, quality: 82 },
  { day: 'Sat', hours: 8.5, quality: 95 },
  { day: 'Sun', hours: 8.0, quality: 90 },
];

const moodData = [
  { mood: 'Happy', value: 45, color: '#10b981' },
  { mood: 'Neutral', value: 30, color: '#f59e0b' },
  { mood: 'Stressed', value: 15, color: '#ef4444' },
  { mood: 'Tired', value: 10, color: '#6b7280' },
];

/**
 * WellbeingDashboard: Dashboard for tracking mental health and wellbeing
 */
const WellbeingDashboard = () => {
  const { isOnline } = useNetworkStatus();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout title="Wellbeing Dashboard">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Wellbeing Dashboard</h1>
            <p className="text-muted-foreground">
              Track your mental health, stress levels, and overall wellbeing
            </p>
          </div>
          {!isOnline && (
            <OfflineIndicator />
          )}
        </div>
      </div>

      {/* Wellbeing Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-purple-600">Stress Level</p>
                <h3 className="text-2xl font-bold text-purple-700">2.8/5</h3>
              </div>
              <div className="p-3 bg-purple-500 rounded-full text-white">
                <Brain className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-purple-600">Low stress</span>
                <span className="text-purple-600">Target: &lt;3.0</span>
              </div>
              <Progress value={56} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-600">Sleep Quality</p>
                <h3 className="text-2xl font-bold text-blue-700">88%</h3>
              </div>
              <div className="p-3 bg-blue-500 rounded-full text-white">
                <Moon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-blue-600">Good quality</span>
                <span className="text-blue-600">Target: &gt;85%</span>
              </div>
              <Progress value={88} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600">Social Score</p>
                <h3 className="text-2xl font-bold text-green-700">7.2/10</h3>
              </div>
              <div className="p-3 bg-green-500 rounded-full text-white">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-green-600">High engagement</span>
                <span className="text-green-600">Target: &gt;7.0</span>
              </div>
              <Progress value={72} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-orange-600">Energy Level</p>
                <h3 className="text-2xl font-bold text-orange-700">85%</h3>
              </div>
              <div className="p-3 bg-orange-500 rounded-full text-white">
                <Zap className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-orange-600">High energy</span>
                <span className="text-orange-600">Target: &gt;80%</span>
              </div>
              <Progress value={85} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Wellbeing Charts */}
        <Card className="md:col-span-2 relative">
          {!isOnline && <OfflineContentBadge className="absolute top-2 right-2" />}
          <CardHeader className="pb-2">
            <Tabs defaultValue="stress" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center">
                <CardTitle>Wellbeing Trends</CardTitle>
                <TabsList>
                  <TabsTrigger value="stress">Stress</TabsTrigger>
                  <TabsTrigger value="sleep">Sleep</TabsTrigger>
                  <TabsTrigger value="mood">Mood</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="stress" className="mt-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="level"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Stress Level"
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="sleep" className="mt-0">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3b82f6" name="Sleep Hours" />
                    <Bar dataKey="quality" fill="#06b6d4" name="Quality %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="mood" className="mt-0">
              <div className="h-[350px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </CardContent>
        </Card>

        {/* Right Column - Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              Log Mood
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Moon className="mr-2 h-4 w-4" />
              Track Sleep
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Brain className="mr-2 h-4 w-4" />
              Stress Check-in
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Set Wellbeing Goal
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Wellbeing Check-ins */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Today's Check-ins</CardTitle>
              <p className="text-sm text-muted-foreground">Complete your daily wellbeing assessment</p>
            </div>
            <Badge variant="outline">3/5 Complete</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Morning Mood</h4>
                <Badge className="bg-green-500">Done</Badge>
              </div>
              <p className="text-sm text-gray-600">Feeling optimistic and energized</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Stress Level</h4>
                <Badge className="bg-green-500">Done</Badge>
              </div>
              <p className="text-sm text-gray-600">Low stress, feeling calm</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Energy Level</h4>
                <Badge className="bg-green-500">Done</Badge>
              </div>
              <p className="text-sm text-gray-600">High energy throughout day</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Social Connection</h4>
                <Button size="sm" variant="outline">
                  Check-in
                </Button>
              </div>
              <p className="text-sm text-gray-500">Rate your social interactions</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Sleep Quality</h4>
                <Button size="sm" variant="outline">
                  Log Sleep
                </Button>
              </div>
              <p className="text-sm text-gray-500">How did you sleep last night?</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default WellbeingDashboard;
