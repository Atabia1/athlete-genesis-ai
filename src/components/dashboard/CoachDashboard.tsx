
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  MessageSquare,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

/**
 * CoachDashboard: Dashboard for coaches and team managers
 *
 * This component displays a specialized dashboard for users who identified
 * as coaches during onboarding. It provides team management tools, scheduling
 * features, and analytics for monitoring athlete performance.
 *
 * Features:
 * - Team overview with roster management
 * - Team calendar and scheduling tools
 * - Performance analytics for team and individual athletes
 *
 * Each card links to a dedicated page for that specific feature, allowing
 * coaches to drill down into detailed views of their team's data.
 */

// Mock data for team performance
const teamPerformanceData = [
  { month: 'Jan', performance: 65, attendance: 80 },
  { month: 'Feb', performance: 68, attendance: 82 },
  { month: 'Mar', performance: 72, attendance: 85 },
  { month: 'Apr', performance: 75, attendance: 88 },
  { month: 'May', performance: 80, attendance: 90 },
  { month: 'Jun', performance: 85, attendance: 92 },
];

// Mock data for athlete performance
const athletePerformanceData = [
  { name: 'John D.', performance: 85, improvement: 12 },
  { name: 'Sarah M.', performance: 92, improvement: 8 },
  { name: 'Mike T.', performance: 78, improvement: 15 },
  { name: 'Emma R.', performance: 88, improvement: 10 },
  { name: 'David K.', performance: 75, improvement: 18 },
];

// Mock data for upcoming sessions
const upcomingSessions = [
  {
    title: 'Team Training',
    time: 'Today, 4:00 PM',
    duration: '90 min',
    location: 'Main Field',
    attendees: 12,
    total: 15
  },
  {
    title: 'Strength & Conditioning',
    time: 'Tomorrow, 9:00 AM',
    duration: '60 min',
    location: 'Gym',
    attendees: 8,
    total: 10
  },
  {
    title: 'Recovery Session',
    time: 'Wed, 5:30 PM',
    duration: '45 min',
    location: 'Recovery Room',
    attendees: 15,
    total: 15
  }
];

// Mock data for team composition
const teamCompositionData = [
  { name: 'Forwards', value: 35, color: '#3b82f6' },
  { name: 'Midfielders', value: 40, color: '#10b981' },
  { name: 'Defenders', value: 20, color: '#8b5cf6' },
  { name: 'Goalkeepers', value: 5, color: '#f59e0b' },
];

// Mock data for recent notifications
const recentNotifications = [
  {
    type: 'message',
    content: 'Sarah M. sent you a message about tomorrow\'s training',
    time: '10 min ago',
    icon: MessageSquare,
    color: 'blue'
  },
  {
    type: 'alert',
    content: 'Mike T. reported an injury during yesterday\'s session',
    time: '1 hour ago',
    icon: AlertCircle,
    color: 'red'
  },
  {
    type: 'join',
    content: 'New athlete David K. joined your team',
    time: '3 hours ago',
    icon: UserPlus,
    color: 'green'
  }
];

const CoachDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Top row: Team Performance and Athlete Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-athleteBlue-600" />
                  Team Performance
                </CardTitle>
                <CardDescription>6-month performance and attendance trends</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% this quarter
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={teamPerformanceData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} />
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    name="Performance"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "white" }}
                    activeDot={{ r: 7, fill: "#3b82f6", strokeWidth: 2, stroke: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    name="Attendance"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "white" }}
                    activeDot={{ r: 7, fill: "#10b981", strokeWidth: 2, stroke: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/coach/analytics" className="flex items-center justify-between">
                <span>View Detailed Analytics</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-athleteBlue-600" />
              Top Performers
            </CardTitle>
            <CardDescription>Athletes with highest performance scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {athletePerformanceData.map((athlete, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{athlete.name}</div>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+{athlete.improvement}% improvement</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold mr-2">{athlete.performance}%</span>
                    <div className="w-2 h-2 rounded-full" style={{
                      backgroundColor: athlete.performance >= 90 ? '#10b981' :
                                      athlete.performance >= 80 ? '#3b82f6' :
                                      athlete.performance >= 70 ? '#f59e0b' : '#ef4444'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/coach/athletes" className="flex items-center justify-between">
                <span>View All Athletes</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Middle row: Upcoming Sessions and Team Composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-athleteBlue-600" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your scheduled training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{session.title}</h4>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {session.location}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <div className="flex items-center mr-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{session.duration}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Attendance: {session.attendees}/{session.total}</span>
                    <div className="flex items-center">
                      {session.attendees === session.total ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Full attendance
                        </span>
                      ) : (
                        <span className="text-amber-600">
                          {session.total - session.attendees} pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/coach/calendar" className="flex items-center justify-between">
                <span>View Full Schedule</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-athleteBlue-600" />
              Team Composition
            </CardTitle>
            <CardDescription>Breakdown of your team by position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teamCompositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {teamCompositionData.map((entry, index) => (
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
              {teamCompositionData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/coach/roster" className="flex items-center justify-between">
                <span>Manage Team</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Bottom row: Recent Notifications */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-athleteBlue-600" />
              Recent Notifications
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              3 new
            </Badge>
          </div>
          <CardDescription>Latest updates from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.map((notification, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-full mr-3 text-${notification.color}-600 bg-${notification.color}-100`}>
                  <notification.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/coach/notifications" className="flex items-center justify-between">
              <span>View All Notifications</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CoachDashboard;
