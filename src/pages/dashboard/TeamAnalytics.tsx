
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingDown, TrendingUp, AlertTriangle, Users, Activity, Clock, CheckCircle2, UserX2, UserRoundCheck, Heart } from "lucide-react";

// Mock data for team analytics
const performanceData = [
  { month: 'Jan', team: 78, average: 72 },
  { month: 'Feb', team: 82, average: 74 },
  { month: 'Mar', team: 80, average: 75 },
  { month: 'Apr', team: 85, average: 76 },
  { month: 'May', team: 83, average: 77 },
  { month: 'Jun', team: 88, average: 78 },
  { month: 'Jul', team: 86, average: 78 },
  { month: 'Aug', team: 91, average: 79 },
];

const attendanceData = [
  { month: 'Jan', attended: 92, missed: 8 },
  { month: 'Feb', attended: 88, missed: 12 },
  { month: 'Mar', attended: 95, missed: 5 },
  { month: 'Apr', attended: 90, missed: 10 },
  { month: 'May', attended: 85, missed: 15 },
  { month: 'Jun', attended: 93, missed: 7 },
  { month: 'Jul', attended: 96, missed: 4 },
  { month: 'Aug', attended: 94, missed: 6 },
];

const wellbeingData = [
  { month: 'Jan', energy: 7.2, recovery: 6.8, sleep: 7.5 },
  { month: 'Feb', energy: 7.0, recovery: 6.5, sleep: 7.2 },
  { month: 'Mar', energy: 7.5, recovery: 7.0, sleep: 7.8 },
  { month: 'Apr', energy: 7.8, recovery: 7.2, sleep: 8.0 },
  { month: 'May', energy: 7.6, recovery: 7.1, sleep: 7.7 },
  { month: 'Jun', energy: 8.0, recovery: 7.5, sleep: 8.2 },
  { month: 'Jul', energy: 8.2, recovery: 7.8, sleep: 8.3 },
  { month: 'Aug', energy: 8.1, recovery: 7.6, sleep: 8.1 },
];

const workloadDistribution = [
  { name: 'Optimal', value: 65, color: '#22c55e' },
  { name: 'Overtraining', value: 15, color: '#ef4444' },
  { name: 'Undertraining', value: 20, color: '#3b82f6' },
];

const injuryRiskAthletes = [
  { id: '1', name: 'Alex Johnson', indicators: ['High workload', 'Low sleep quality', 'Recent soreness'] },
  { id: '2', name: 'Sarah Williams', indicators: ['Training intensity spike', 'Poor recovery metrics'] },
  { id: '3', name: 'David Miller', indicators: ['Consecutive high-intensity days', 'Reported fatigue'] },
];

const highPerformers = [
  { id: '1', name: 'Emma Davis', metrics: ['Consistent improvement', '95% attendance', 'Excellent recovery'] },
  { id: '2', name: 'James Wilson', metrics: ['Strength gains +12%', 'Endurance +15%', 'Perfect attendance'] },
];

const TeamAnalytics = () => {
  const [timeframe, setTimeframe] = useState("3months");
  
  return (
    <DashboardLayout title="Team Analytics">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Performance Insights</h1>
          <p className="text-muted-foreground">
            Analyze team trends, identify outliers, and optimize training strategies
          </p>
        </div>
        <Select defaultValue={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-green-600">94%</CardTitle>
            <CardDescription className="flex items-center">
              Attendance Rate
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2%
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">Team average</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-blue-600">87.5</CardTitle>
            <CardDescription className="flex items-center">
              Performance Score
              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.2
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-gray-500">
              <Activity className="h-4 w-4 mr-1" />
              <span className="text-sm">Across all metrics</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-amber-600">7.8</CardTitle>
            <CardDescription className="flex items-center">
              Avg. Recovery Score
              <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.3
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-gray-500">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">Scale of 1-10</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-red-600">15%</CardTitle>
            <CardDescription className="flex items-center">
              Injury Risk
              <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2%
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-gray-500">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm">3 athletes at risk</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alert section */}
      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800">Attention Required</AlertTitle>
        <AlertDescription className="text-amber-700">
          3 athletes are showing signs of potential overtraining. Review their recent wellbeing scores and consider modifying their training load.
        </AlertDescription>
      </Alert>
      
      {/* Main charts */}
      <Tabs defaultValue="performance" className="mb-8">
        <TabsList>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="wellbeing">Wellbeing Metrics</TabsTrigger>
          <TabsTrigger value="workload">Workload Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Over Time</CardTitle>
              <CardDescription>
                Comparing your team's performance against benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="team" 
                      stroke="#3b82f6" 
                      name="Your Team" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#94a3b8" 
                      name="Average" 
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Attendance Rates</CardTitle>
              <CardDescription>
                Monthly attendance statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attended" name="Sessions Attended (%)" fill="#22c55e" />
                    <Bar dataKey="missed" name="Sessions Missed (%)" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wellbeing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Wellbeing Metrics</CardTitle>
              <CardDescription>
                Average self-reported scores (scale 1-10)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wellbeingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[5, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#f59e0b" 
                      name="Energy Level" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="recovery" 
                      stroke="#10b981" 
                      name="Recovery Quality" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sleep" 
                      stroke="#6366f1" 
                      name="Sleep Quality" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workload Distribution</CardTitle>
              <CardDescription>
                Analysis of current training load across the team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workloadDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {workloadDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Athlete insights section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* At-risk athletes */}
        <Card className="border-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Athletes Requiring Attention
            </CardTitle>
            <CardDescription>
              These athletes are showing potential signs of overtraining or injury risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-4">
                {injuryRiskAthletes.map((athlete) => (
                  <div 
                    key={athlete.id}
                    className="p-4 rounded-lg border border-red-100 bg-red-50"
                  >
                    <div className="flex items-start">
                      <UserX2 className="h-5 w-5 mt-0.5 mr-3 text-red-500" />
                      <div>
                        <h4 className="font-medium">{athlete.name}</h4>
                        <ul className="mt-2 space-y-1">
                          {athlete.indicators.map((indicator, idx) => (
                            <li key={idx} className="flex items-center text-sm text-red-700">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                              {indicator}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* High performers */}
        <Card className="border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-700">
              <UserRoundCheck className="h-5 w-5 mr-2 text-green-500" />
              Top Performing Athletes
            </CardTitle>
            <CardDescription>
              Athletes showing exceptional progress and adherence to training plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-4">
                {highPerformers.map((athlete) => (
                  <div 
                    key={athlete.id}
                    className="p-4 rounded-lg border border-green-100 bg-green-50"
                  >
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mt-0.5 mr-3 text-green-500" />
                      <div>
                        <h4 className="font-medium">{athlete.name}</h4>
                        <ul className="mt-2 space-y-1">
                          {athlete.metrics.map((metric, idx) => (
                            <li key={idx} className="flex items-center text-sm text-green-700">
                              <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {/* Training program effectiveness */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Training Program Effectiveness</CardTitle>
          <CardDescription>
            Analysis of current training programs and their impact on athlete performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-1">Strength Program</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">85%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Excellent progress, especially in lower body strength gains</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-1">Endurance Program</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">72%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Good progress, but recovery metrics suggest potential modifications</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-1">Technical Program</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">80%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Strong improvement in skill execution and decision-making</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TeamAnalytics;
