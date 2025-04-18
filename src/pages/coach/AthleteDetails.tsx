
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Utensils, LineChart, MessageSquare, Phone, Mail } from "lucide-react";

// Mock athlete data
const getAthleteById = (id: string) => ({
  id,
  name: 'Alex Johnson',
  sport: 'Basketball',
  position: 'Point Guard',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  profileImage: null,
  status: 'active',
  joinDate: '2023-10-15',
  workoutAdherence: 85,
  nutritionAdherence: 70,
  recentWorkouts: [
    { date: '2023-12-15', name: 'Full Body Strength', completed: true },
    { date: '2023-12-13', name: 'Cardio Session', completed: true },
    { date: '2023-12-11', name: 'Lower Body Focus', completed: false },
  ],
  wellbeingData: {
    sleep: { average: 7.5, trend: 'stable' },
    stress: { level: 'moderate', trend: 'decreasing' },
    soreness: { level: 'mild', areas: ['shoulders', 'lower back'] },
    energy: { level: 'good', trend: 'increasing' },
  }
});

const AthleteDetails = () => {
  const { athleteId } = useParams<{ athleteId: string }>();
  const athlete = getAthleteById(athleteId || '1');
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <DashboardLayout title="Athlete Details">
      <div className="grid gap-6">
        {/* Athlete Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-athleteBlue-100 text-athleteBlue-700">
                  {athlete.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold">{athlete.name}</h2>
                    <p className="text-gray-500">{athlete.sport} • {athlete.position}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                    <Mail className="h-3 w-3" />
                    {athlete.email}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                    <Phone className="h-3 w-3" />
                    {athlete.phone}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for different views */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-6 grid grid-cols-4 md:grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="wellbeing">Well-being</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Adherence Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold">{athlete.workoutAdherence}%</CardTitle>
                  <CardDescription>Workout Adherence</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dumbbell className="h-6 w-6 text-gray-400" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold">{athlete.nutritionAdherence}%</CardTitle>
                  <CardDescription>Nutrition Adherence</CardDescription>
                </CardHeader>
                <CardContent>
                  <Utensils className="h-6 w-6 text-gray-400" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold">{athlete.wellbeingData.energy.level}</CardTitle>
                  <CardDescription>Energy Level</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart className="h-6 w-6 text-gray-400" />
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Workouts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {athlete.recentWorkouts.map((workout, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${workout.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Dumbbell className={`h-4 w-4 ${workout.completed ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-gray-500">{workout.date}</p>
                        </div>
                      </div>
                      <Badge variant={workout.completed ? "outline" : "secondary"}>
                        {workout.completed ? 'Completed' : 'Missed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Well-being Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Well-being Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Sleep Quality</p>
                    <p className="text-lg font-medium">{athlete.wellbeingData.sleep.average} hours</p>
                    <p className="text-xs text-gray-400">Trend: {athlete.wellbeingData.sleep.trend}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Stress Level</p>
                    <p className="text-lg font-medium capitalize">{athlete.wellbeingData.stress.level}</p>
                    <p className="text-xs text-gray-400">Trend: {athlete.wellbeingData.stress.trend}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Muscle Soreness</p>
                    <p className="text-lg font-medium capitalize">{athlete.wellbeingData.soreness.level}</p>
                    <p className="text-xs text-gray-400">Areas: {athlete.wellbeingData.soreness.areas.join(', ')}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Energy Level</p>
                    <p className="text-lg font-medium capitalize">{athlete.wellbeingData.energy.level}</p>
                    <p className="text-xs text-gray-400">Trend: {athlete.wellbeingData.energy.trend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workout History</CardTitle>
                <CardDescription>Complete workout log for this athlete</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Detailed workout history would be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Logs</CardTitle>
                <CardDescription>Meal tracking and adherence</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Detailed nutrition logs would be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wellbeing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Well-being Trends</CardTitle>
                <CardDescription>Sleep, stress, mood, and recovery metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Detailed well-being data would be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Charts</CardTitle>
                <CardDescription>Performance metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Progress charts and graphs would be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AthleteDetails;
