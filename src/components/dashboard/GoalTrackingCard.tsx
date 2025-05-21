
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  CheckCircle,
  Calendar,
  Target, 
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Historical stages data for tracking progress
const stages = [
  { name: 'Start', value: 0, date: '2023-04-15' },
  { name: 'Week 2', value: 25, date: '2023-05-01' },
  { name: 'Week 4', value: 45, date: '2023-05-15' },
  { name: 'Week 6', value: 60, date: '2023-05-29' },
  { name: 'Current', value: 75, date: '2023-06-12' },
  { name: 'Goal', value: 100, date: '2023-07-01' }
];

/**
 * GoalTrackingCard Component
 * 
 * Displays and tracks user's fitness goals
 */
const GoalTrackingCard = ({ className = "" }) => {
  // Define progress data
  const progressData = [
    { date: '2023-05-01', progress: 25 },
    { date: '2023-05-08', progress: 35 },
    { date: '2023-05-15', progress: 45 },
    { date: '2023-05-22', progress: 60 },
    { date: '2023-05-29', progress: 75 },
    { date: '2023-06-05', progress: 90 }
  ];

  const categoryData = [
    { category: 'Strength', progress: 85 },
    { category: 'Endurance', progress: 70 },
    { category: 'Flexibility', progress: 60 },
    { category: 'Balance', progress: 75 }
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const goalDate = new Date(stages[stages.length - 1].date);
    const today = new Date();
    const diffTime = goalDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    return stages[stages.length - 2].value; // Current value
  };

  // Get color based on progress value
  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 50) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 text-indigo-500 mr-2" />
              Goal Tracking
            </CardTitle>
            <CardDescription>Track your fitness progress</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {calculateDaysRemaining()} days left
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Goal Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">10K Run Preparation</h3>
            <span className="text-sm font-medium">{calculateOverallProgress()}%</span>
          </div>
          <Progress value={calculateOverallProgress()} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Started {formatDate(stages[0].date)}</span>
            <span>Goal: {formatDate(stages[stages.length - 1].date)}</span>
          </div>
        </div>

        <Tabs defaultValue="progress">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="pt-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => formatDate(date)}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Progress']}
                    labelFormatter={(label) => formatDate(String(label))}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <div className="text-xl font-bold">{stages[stages.length - 2].value}%</div>
              <div className="text-sm text-gray-500">Overall progress towards your goal</div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="pt-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                  <Bar dataKey="progress" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map(item => (
                <div key={item.category} className="flex items-center">
                  <span className="text-sm w-24">{item.category}</span>
                  <div className="flex-1">
                    <Progress 
                      value={item.progress} 
                      className={`h-2 ${getProgressColor(item.progress)}`} 
                    />
                  </div>
                  <span className="text-sm font-medium ml-2 w-8">{item.progress}%</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="milestones" className="pt-4">
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div key={index} className="flex items-center">
                  {index < stages.length - 2 ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : index === stages.length - 2 ? (
                    <div className="h-5 w-5 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-2"></div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{stage.name}</span>
                      <span className="text-sm">{stage.value}%</span>
                    </div>
                    <Progress value={stage.value} max={100} className="h-1" />
                  </div>
                  
                  <span className="text-xs text-gray-500 ml-2 w-16">
                    {formatDate(stage.date)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pace</span>
                <span className="text-sm font-medium">On track</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                You're making consistent progress and are on track to reach your goal
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm">View Goal Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTrackingCard;
