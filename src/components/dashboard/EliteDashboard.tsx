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
  Flame,
  Brain,
  MessageSquare,
  Sparkles,
  Lightbulb,
  Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import WelcomeWidget from "./widgets/WelcomeWidget";
import WorkoutWidget from "./widgets/WorkoutWidget";

/**
 * EliteDashboard: Premium dashboard for Elite AI subscribers
 *
 * This component displays an advanced dashboard for users with the Elite AI
 * subscription. It provides AI-powered insights, real-time analytics,
 * and premium features exclusive to the Elite tier.
 *
 * Features:
 * - AI-powered performance insights
 * - Advanced analytics with predictive modeling
 * - Real-time recovery optimization
 * - Personalized training recommendations
 * - Elite-exclusive visualizations and metrics
 */

// Mock data for performance metrics
const performanceData = [
  { day: 'Mon', strength: 80, endurance: 65, recovery: 90, predicted: 85 },
  { day: 'Tue', strength: 75, endurance: 70, recovery: 85, predicted: 80 },
  { day: 'Wed', strength: 85, endurance: 75, recovery: 75, predicted: 78 },
  { day: 'Thu', strength: 70, endurance: 80, recovery: 80, predicted: 82 },
  { day: 'Fri', strength: 90, endurance: 85, recovery: 85, predicted: 88 },
  { day: 'Sat', strength: 95, endurance: 90, recovery: 90, predicted: 92 },
  { day: 'Sun', strength: 85, endurance: 75, recovery: 95, predicted: 90 },
];

// Mock data for AI insights
const aiInsights = [
  {
    id: 1,
    title: "Recovery Optimization",
    description: "Your sleep quality has improved by 15%. Consider increasing training intensity by 10% this week.",
    impact: "high",
    icon: <Zap className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 2,
    title: "Performance Prediction",
    description: "Based on your recent metrics, you're on track for a 5% performance increase in your next competition.",
    impact: "medium",
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
  },
  {
    id: 3,
    title: "Nutrition Recommendation",
    description: "Increasing protein intake by 10g on training days could improve your recovery rate.",
    impact: "medium",
    icon: <Flame className="h-5 w-5 text-orange-500" />,
  }
];

// Mock data for athlete radar chart
const athleteRadarData = [
  { attribute: 'Strength', value: 85 },
  { attribute: 'Speed', value: 75 },
  { attribute: 'Endurance', value: 80 },
  { attribute: 'Recovery', value: 90 },
  { attribute: 'Technique', value: 85 },
  { attribute: 'Mental', value: 70 },
];

// Mock data for upcoming workouts
const upcomingWorkouts = [
  {
    day: 'Today',
    name: 'High-Intensity Interval Training',
    time: '5:00 PM',
    duration: '45 min',
    type: 'Cardio',
    aiOptimized: true
  },
  {
    day: 'Tomorrow',
    name: 'Strength & Power',
    time: '6:30 AM',
    duration: '60 min',
    type: 'Strength',
    aiOptimized: true
  },
  {
    day: 'Wednesday',
    name: 'Active Recovery & Mobility',
    time: '7:00 PM',
    duration: '40 min',
    type: 'Recovery',
    aiOptimized: true
  }
];

const EliteDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Top row widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WelcomeWidget userName="Elite Athlete" tier="Elite AI" />
        <WorkoutWidget premium={true} />
      </div>

      {/* AI Insights row */}
      <Card className="border-purple-200 shadow-md hover:shadow-lg transition-all">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Performance Insights
            </CardTitle>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Elite Feature</Badge>
          </div>
          <CardDescription>Personalized recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight) => (
              <div 
                key={insight.id} 
                className={`p-4 rounded-lg border ${
                  insight.impact === 'high' 
                    ? 'bg-purple-50 border-purple-200' 
                    : insight.impact === 'medium'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    insight.impact === 'high' 
                      ? 'bg-purple-100' 
                      : insight.impact === 'medium'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                  }`}>
                    {insight.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/dashboard/ai-insights">
              View All AI Insights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Performance metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Advanced Performance Analytics
                </CardTitle>
                <CardDescription>Your performance with AI-powered predictions</CardDescription>
              </div>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Elite Analytics
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="strength" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Strength"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="endurance" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Endurance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recovery" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Recovery"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#ff8042" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    activeDot={{ r: 8 }}
                    name="AI Prediction"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/workouts">
                View Detailed Analytics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-purple-600" />
              Athlete Profile
            </CardTitle>
            <CardDescription>Your performance attributes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={athleteRadarData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="attribute" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Athlete"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              AI Coach Chat
            </CardTitle>
            <CardDescription>Get instant answers from your AI coach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 h-40 flex flex-col justify-center items-center">
              <Lightbulb className="h-8 w-8 text-purple-500 mb-2" />
              <p className="text-center text-gray-600">Ask your AI coach about training, nutrition, or recovery</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/dashboard/coach-chat">
                  Start Chatting
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI-Optimized Workouts
            </CardTitle>
            <CardDescription>Your upcoming AI-tailored sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingWorkouts.map((workout, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{workout.name}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {workout.day} • {workout.time}
                      </div>
                    </div>
                    {workout.aiOptimized && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Optimized
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-gray-100">
                      <Clock className="h-3 w-3 mr-1" />
                      {workout.duration}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-100">
                      {workout.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EliteDashboard;
