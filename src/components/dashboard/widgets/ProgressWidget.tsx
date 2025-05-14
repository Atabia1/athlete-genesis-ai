
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Zap, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from "recharts";

const progressData = [
  { name: "Week 1", value: 65, strength: 60, cardio: 70, recovery: 65 },
  { name: "Week 2", value: 72, strength: 68, cardio: 75, recovery: 70 },
  { name: "Week 3", value: 78, strength: 75, cardio: 80, recovery: 75 },
  { name: "Week 4", value: 74, strength: 72, cardio: 76, recovery: 78 },
  { name: "Week 5", value: 80, strength: 78, cardio: 82, recovery: 80 },
  { name: "Week 6", value: 85, strength: 84, cardio: 86, recovery: 83 }
];

const weeklyGoals = [
  { name: "Workouts", completed: 4, total: 5 },
  { name: "Calories", completed: 2200, total: 2500 },
  { name: "Water", completed: 6, total: 8 }
];

const ProgressWidget = () => {
  return (
    <Card className="border-athleteBlue-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>Track your fitness journey</CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            +15% this month
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="mb-4">
          <TabsList className="grid grid-cols-3 p-1 bg-gray-100/80">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md">
              Overview
            </TabsTrigger>
            <TabsTrigger value="strength" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md">
              Strength
            </TabsTrigger>
            <TabsTrigger value="cardio" className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md">
              Cardio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      border: "none"
                    }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Overall Score"
                    stroke="#3a56ff"
                    fill="url(#colorGradient)"
                    activeDot={{ r: 6 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3a56ff" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#86e9bc" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center mt-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-2">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Current Streak</div>
                  <div className="text-lg font-bold">5 days</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full text-green-600 mr-2">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Best Performance</div>
                  <div className="text-lg font-bold">Week 6</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-full text-amber-600 mr-2">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Achievements</div>
                  <div className="text-lg font-bold">12 total</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strength" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      border: "none"
                    }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="strength"
                    name="Strength Score"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "white" }}
                    activeDot={{ r: 7, fill: "#8b5cf6", strokeWidth: 2, stroke: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="cardio" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      border: "none"
                    }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cardio"
                    name="Cardio Score"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "white" }}
                    activeDot={{ r: 7, fill: "#10b981", strokeWidth: 2, stroke: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressWidget;
