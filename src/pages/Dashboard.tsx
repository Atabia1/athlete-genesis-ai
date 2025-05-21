
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Utensils, ChevronRight, Dumbbell, LineChart, Award } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-blue-800 text-white p-4 shadow-md dark:bg-blue-900">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Athlete GPT Dashboard</h1>
          <Button variant="outline" className="text-white border-white hover:bg-blue-700">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl">
                    <Dumbbell className="w-5 h-5 mr-2 text-blue-600" /> Workout Plans
                  </CardTitle>
                  <CardDescription>View and manage your personalized workout plans</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You have 3 active workout plans configured for your goals
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <span>View Plans</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl">
                    <Utensils className="w-5 h-5 mr-2 text-green-600" /> Nutrition
                  </CardTitle>
                  <CardDescription>Track your meal plans and nutrition goals</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stay on track with your personalized nutrition plan
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <span>View Nutrition</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl">
                    <LineChart className="w-5 h-5 mr-2 text-purple-600" /> Progress
                  </CardTitle>
                  <CardDescription>Track your fitness progress and achievements</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View your progress over time with detailed analytics
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    <span>View Progress</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="workouts">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Workout Plans</h2>
              <p>This section will contain your personalized workout plans.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Nutrition Planning</h2>
              <p>This section will contain your personalized nutrition plans.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Progress Tracking</h2>
              <p>This section will contain your progress analytics and charts.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
