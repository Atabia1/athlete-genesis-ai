
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AlertTriangle, ArrowUp, ArrowDown, Users, TrendingUp, Activity } from "lucide-react";

// Sample performance data
const performanceData = [
  { name: 'Sprint', athlete1: 85, athlete2: 70, athlete3: 90, athlete4: 65, athlete5: 75, average: 77 },
  { name: 'Endurance', athlete1: 70, athlete2: 80, athlete3: 65, athlete4: 90, athlete5: 75, average: 76 },
  { name: 'Strength', athlete1: 90, athlete2: 75, athlete3: 65, athlete4: 80, athlete5: 60, average: 74 },
  { name: 'Agility', athlete1: 80, athlete2: 85, athlete3: 75, athlete4: 60, athlete5: 90, average: 78 },
  { name: 'Recovery', athlete1: 75, athlete2: 90, athlete3: 80, athlete4: 85, athlete5: 70, average: 80 },
];

// Sample wellness data over time
const wellnessData = [
  { month: 'Jan', team: 82, benchmark: 78 },
  { month: 'Feb', team: 85, benchmark: 79 },
  { month: 'Mar', team: 80, benchmark: 80 },
  { month: 'Apr', team: 83, benchmark: 80 },
  { month: 'May', team: 87, benchmark: 81 },
  { month: 'Jun', team: 85, benchmark: 81 },
  { month: 'Jul', team: 88, benchmark: 82 },
];

// Sample training distribution data
const trainingDistributionData = [
  { name: 'High Intensity', value: 30, color: '#ef4444' },
  { name: 'Medium Intensity', value: 45, color: '#3b82f6' },
  { name: 'Low Intensity', value: 25, color: '#22c55e' },
];

// Sample athlete risk assessment
const riskAssessmentData = [
  { id: 1, name: 'Alex Johnson', risk: 'Low', score: 85, change: 3, indicator: 'up' },
  { id: 2, name: 'Sam Taylor', risk: 'Medium', score: 68, change: -4, indicator: 'down' },
  { id: 3, name: 'Jordan Lee', risk: 'Low', score: 92, change: 5, indicator: 'up' },
  { id: 4, name: 'Casey Williams', risk: 'High', score: 51, change: -8, indicator: 'down' },
  { id: 5, name: 'Riley Brown', risk: 'Medium', score: 72, change: 0, indicator: 'neutral' },
];

const TeamAnalytics = () => {
  return (
    <DashboardLayout title="Team Analytics">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Team Performance Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics to track your team's performance, wellness, and training
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-orange-500" />
              Team Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Active Athletes</p>
              <Badge className="mt-2" variant="outline">2 new this month</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-green-500">+12%</p>
              <p className="text-sm text-muted-foreground">vs Last Quarter</p>
              <Badge className="mt-2" variant="outline">Above Target</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              Team Wellness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold">87</p>
              <p className="text-sm text-muted-foreground">Avg Score (0-100)</p>
              <Badge className="mt-2" variant="outline">Top 10%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>
              Compare performance metrics across different athletes and team average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}/100`, '']} />
                  <Legend />
                  <Bar dataKey="athlete1" name="Alex J." fill="#8884d8" />
                  <Bar dataKey="athlete2" name="Sam T." fill="#82ca9d" />
                  <Bar dataKey="athlete3" name="Jordan L." fill="#ffc658" />
                  <Bar dataKey="athlete4" name="Casey W." fill="#ff8042" />
                  <Bar dataKey="athlete5" name="Riley B." fill="#0088fe" />
                  <Bar dataKey="average" name="Team Average" fill="#ff0000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="wellness" className="mb-8">
        <TabsList className="w-full bg-muted mb-4">
          <TabsTrigger value="wellness">Team Wellness Trends</TabsTrigger>
          <TabsTrigger value="training">Training Distribution</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wellness">
          <Card>
            <CardHeader>
              <CardTitle>Team Wellness Over Time</CardTitle>
              <CardDescription>
                Average wellness scores compared to benchmark
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={wellnessData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="team"
                      name="Team Score"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="Industry Benchmark"
                      stroke="#387908"
                      strokeDasharray="3 3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training Intensity Distribution</CardTitle>
              <CardDescription>
                Breakdown of training sessions by intensity level
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center">
              <div className="h-[300px] w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trainingDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {trainingDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 pl-0 md:pl-8">
                <h4 className="font-semibold mb-4">Training Distribution Analysis</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-red-500 mt-1 mr-3"></div>
                    <div>
                      <p className="font-medium">High Intensity (30%)</p>
                      <p className="text-sm text-muted-foreground">Training at 80-100% of max capacity, focused on performance peaks</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-500 mt-1 mr-3"></div>
                    <div>
                      <p className="font-medium">Medium Intensity (45%)</p>
                      <p className="text-sm text-muted-foreground">Training at 60-80% of max capacity, balanced for endurance and strength</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-500 mt-1 mr-3"></div>
                    <div>
                      <p className="font-medium">Low Intensity (25%)</p>
                      <p className="text-sm text-muted-foreground">Training at 40-60% of max capacity, focused on recovery and technique</p>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Athlete Injury Risk Assessment</CardTitle>
              <CardDescription>
                AI-powered risk analysis based on training load, recovery, and movement patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted">
                    <tr>
                      <th className="px-6 py-3">Athlete</th>
                      <th className="px-6 py-3">Risk Level</th>
                      <th className="px-6 py-3">Readiness Score</th>
                      <th className="px-6 py-3">Weekly Change</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskAssessmentData.map(athlete => (
                      <tr key={athlete.id} className="bg-white border-b hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback className="bg-orange-100 text-orange-700">
                              {athlete.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {athlete.name}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={
                            athlete.risk === 'Low' ? 'bg-green-500' :
                            athlete.risk === 'Medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }>
                            {athlete.risk}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <HoverCard>
                            <HoverCardTrigger>
                              <span className={
                                athlete.score > 80 ? 'text-green-600 font-medium' :
                                athlete.score > 60 ? 'text-yellow-600 font-medium' :
                                'text-red-600 font-medium'
                              }>
                                {athlete.score}/100
                              </span>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-semibold">Score Breakdown</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm">Sleep Quality: <span className="font-medium">82/100</span></div>
                                  <div className="text-sm">Nutrition: <span className="font-medium">78/100</span></div>
                                  <div className="text-sm">Recovery: <span className="font-medium">75/100</span></div>
                                  <div className="text-sm">Training Load: <span className="font-medium">85/100</span></div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {athlete.indicator === 'up' && (
                              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                            )}
                            {athlete.indicator === 'down' && (
                              <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                            )}
                            <span className={
                              athlete.change > 0 ? 'text-green-600' :
                              athlete.change < 0 ? 'text-red-600' :
                              'text-gray-600'
                            }>
                              {athlete.change > 0 ? '+' : ''}{athlete.change}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {athlete.risk === 'High' ? (
                            <Badge variant="outline" className="flex items-center gap-1 text-red-600 border-red-200">
                              <AlertTriangle className="h-3 w-3" />
                              Modify Training
                            </Badge>
                          ) : athlete.risk === 'Medium' ? (
                            <Badge variant="outline" className="flex items-center gap-1 text-yellow-600 border-yellow-200">
                              Monitor Closely
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200">
                              Proceed as Planned
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TeamAnalytics;
