
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import {
  Activity,
  BarChart2,
  Dumbbell,
  ArrowRight,
  Heart,
  Zap,
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
  LineChart,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import WelcomeWidget from "./widgets/WelcomeWidget";
import WorkoutWidget from "./widgets/WorkoutWidget";
import HealthDataDisplay from "./HealthDataDisplay";

/**
 * ProAthleteDashboard: Dashboard for professional and serious athletes
 *
 * This component displays a specialized dashboard for users who identified
 * as athletes during onboarding. It provides sport-specific analytics,
 * equipment tracking, and advanced performance metrics tailored to athletes
 * focused on competitive performance.
 *
 * Features:
 * - Welcome widget with personalized greeting
 * - Current workout summary and quick access
 * - Sport-specific analytics cards
 * - Equipment tracking for specialized training
 * - Advanced performance metrics and trends
 */

// Mock data for performance metrics
const performanceData = [
  { day: 'Mon', value: 65, recovery: 80 },
  { day: 'Tue', value: 72, recovery: 75 },
  { day: 'Wed', value: 68, recovery: 70 },
  { day: 'Thu', value: 75, recovery: 85 },
  { day: 'Fri', value: 80, recovery: 80 },
  { day: 'Sat', value: 85, recovery: 75 },
  { day: 'Sun', value: 78, recovery: 90 },
];

// Mock data for training distribution
const trainingDistribution = [
  { name: 'Strength', value: 40, color: '#3b82f6' },
  { name: 'Cardio', value: 30, color: '#10b981' },
  { name: 'Recovery', value: 20, color: '#8b5cf6' },
  { name: 'Flexibility', value: 10, color: '#f59e0b' },
];

// Mock data for upcoming workouts
const upcomingWorkouts = [
  {
    day: 'Today',
    name: 'Upper Body Strength',
    time: '5:00 PM',
    duration: '45 min',
    type: 'Strength'
  },
  {
    day: 'Tomorrow',
    name: 'HIIT Cardio',
    time: '6:30 AM',
    duration: '30 min',
    type: 'Cardio'
  },
  {
    day: 'Wednesday',
    name: 'Recovery & Mobility',
    time: '7:00 PM',
    duration: '40 min',
    type: 'Recovery'
  }
];

const ProAthleteDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Top row widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WelcomeWidget userName="Pro Athlete" />
        <WorkoutWidget />
      </div>

      {/* Performance metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-athleteBlue-600" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Your weekly performance and recovery trends</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% this week
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      border: "none"
                    }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Performance"
                    stroke="#3b82f6"
                    fill="url(#colorPerformance)"
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="recovery"
                    name="Recovery"
                    stroke="#10b981"
                    fill="url(#colorRecovery)"
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg flex items-center">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-3">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-blue-600">Avg. Performance</div>
                  <div className="text-lg font-bold text-blue-700">74.7%</div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg flex items-center">
                <div className="p-2 bg-green-100 rounded-full text-green-600 mr-3">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-green-600">Avg. Recovery</div>
                  <div className="text-lg font-bold text-green-700">79.3%</div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg flex items-center">
                <div className="p-2 bg-amber-100 rounded-full text-amber-600 mr-3">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-amber-600">Training Load</div>
                  <div className="text-lg font-bold text-amber-700">8.2</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/athlete" className="flex items-center justify-between">
                <span>View Detailed Analytics</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-athleteBlue-600" />
              Training Distribution
            </CardTitle>
            <CardDescription>Your training focus breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trainingDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trainingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      border: "none"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {trainingDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/workouts" className="flex items-center justify-between">
                <span>View Workout Analytics</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Health Data Display */}
      <div className="mb-6">
        <HealthDataDisplay />
      </div>

      {/* Upcoming workouts and nutrition cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-athleteBlue-600" />
              Upcoming Workouts
            </CardTitle>
            <CardDescription>Your scheduled training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingWorkouts.map((workout, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{workout.name}</h4>
                      <Badge
                        variant="outline"
                        className={`
                          ${workout.type === 'Strength' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${workout.type === 'Cardio' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${workout.type === 'Recovery' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                        `}
                      >
                        {workout.type}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <div className="flex items-center mr-3">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{workout.day}</span>
                      </div>
                      <div className="flex items-center mr-3">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{workout.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Dumbbell className="h-3 w-3 mr-1" />
                        <span>{workout.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/today" className="flex items-center justify-between">
                <span>View Full Schedule</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-athleteBlue-600" />
              Nutrition Tracking
            </CardTitle>
            <CardDescription>Monitor your nutrition and macros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm">1,850 / 2,200 kcal</span>
                </div>
                <Progress
                  value={84}
                  className="h-2"
                  // Fix for the indicatorClassName issue
                  style={{
                    "--progress-background": "#3b82f6"
                  } as React.CSSProperties}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm">135 / 150 g</span>
                </div>
                <Progress
                  value={90}
                  className="h-2"
                  // Fix for the indicatorClassName issue
                  style={{
                    "--progress-background": "#10b981"
                  } as React.CSSProperties}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Carbs</span>
                  <span className="text-sm">210 / 250 g</span>
                </div>
                <Progress
                  value={84}
                  className="h-2"
                  // Fix for the indicatorClassName issue
                  style={{
                    "--progress-background": "#f59e0b"
                  } as React.CSSProperties}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Fat</span>
                  <span className="text-sm">55 / 70 g</span>
                </div>
                <Progress
                  value={78}
                  className="h-2"
                  // Fix for the indicatorClassName issue
                  style={{
                    "--progress-background": "#8b5cf6"
                  } as React.CSSProperties}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-3">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-700">Hydration Status</div>
                    <div className="text-xs text-blue-600">1.8L / 2.5L water consumed</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/nutrition" className="flex items-center justify-between">
                <span>Track Nutrition</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProAthleteDashboard;
