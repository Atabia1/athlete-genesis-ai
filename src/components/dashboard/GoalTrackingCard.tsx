
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Clock, Award, ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';

/**
 * GoalTrackingCard Component
 * 
 * This component displays progress towards user goals and allows setting new goals
 */
const GoalTrackingCard = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('progress');
  const [goalTimeframe, setGoalTimeframe] = useState('week');

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

  // Current progress towards goals
  const currentGoal = {
    name: 'Weekly Activity',
    target: 5,
    current: 3,
    unit: 'workouts'
  };

  // Sample goals for demo
  const activeGoals = [
    {
      id: 'g1',
      name: 'Weekly Workouts',
      target: 5,
      current: 3,
      progress: 60,
      unit: 'workouts',
      timeframe: 'week',
      end: '2023-07-01'
    },
    {
      id: 'g2',
      name: 'Weight Loss',
      target: 5,
      current: 3.5,
      progress: 70,
      unit: 'kg',
      timeframe: 'month',
      end: '2023-08-15'
    },
    {
      id: 'g3',
      name: 'Run Distance',
      target: 50,
      current: 24,
      progress: 48,
      unit: 'km',
      timeframe: 'month',
      end: '2023-07-31'
    }
  ];

  // Filter goals by timeframe
  const filteredGoals = activeGoals.filter(goal => 
    goalTimeframe === 'all' || goal.timeframe === goalTimeframe
  );

  // Handle goal removal (placeholder)
  const handleRemoveGoal = (goalId) => {
    console.log('Remove goal:', goalId);
  };

  // Handle creating a new goal (placeholder)
  const handleCreateGoal = () => {
    console.log('Create new goal');
  };

  // Format date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Goal Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="goals">Active Goals</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium">Current Goal: {currentGoal.name}</h3>
                <span className="text-sm">
                  {currentGoal.current}/{currentGoal.target} {currentGoal.unit}
                </span>
              </div>
              <Progress value={(currentGoal.current / currentGoal.target) * 100} />
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-medium">Progress by Category</h3>
              
              {categoryData.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{category.category}</span>
                    <span>{category.progress}%</span>
                  </div>
                  <Progress value={category.progress} 
                    className={`h-2 ${
                      index % 4 === 0 ? 'bg-blue-100' : 
                      index % 4 === 1 ? 'bg-green-100' : 
                      index % 4 === 2 ? 'bg-purple-100' : 
                      'bg-amber-100'
                    }`}
                  />
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Weekly Progress Trend</h3>
              <div className="relative h-20">
                <div className="absolute inset-0 flex items-end">
                  {progressData.map((item, index) => (
                    <div 
                      key={index}
                      className="flex-1 flex justify-center"
                    >
                      <div 
                        className="w-4 bg-blue-500 rounded-t"
                        style={{ height: `${item.progress}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                {progressData.map((item, index) => (
                  <div key={index} className="text-center">
                    {item.date.split('-')[2]}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="goals">
            <div className="flex justify-between items-center mb-4">
              <Select value={goalTimeframe} onValueChange={setGoalTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={handleCreateGoal}>New Goal</Button>
            </div>
            
            <div className="space-y-4">
              {filteredGoals.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>No active goals for this timeframe</p>
                  <Button variant="link" onClick={handleCreateGoal} className="mt-2">
                    Create a new goal
                  </Button>
                </div>
              ) : (
                filteredGoals.map(goal => (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{goal.name}</h3>
                          <div className="text-xs text-gray-500">
                            {goal.timeframe === 'week' ? 'Weekly' : 
                             goal.timeframe === 'month' ? 'Monthly' :
                             'Yearly'} Goal • Target: {goal.target} {goal.unit}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0" 
                          onClick={() => handleRemoveGoal(goal.id)}
                        >
                          <span className="sr-only">Remove goal</span>
                          &times;
                        </Button>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{goal.current} of {goal.target} {goal.unit}</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="space-y-1 mb-4">
              <div className="text-center text-sm text-gray-500">
                <p>You completed 12 goals in the last 6 months</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card className="overflow-hidden bg-gray-50 border-green-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        5K Run Time
                        <span className="inline-block ml-2 bg-green-100 text-green-800 text-xs py-0.5 px-2 rounded-full">
                          Completed
                        </span>
                      </h3>
                      <div className="text-xs text-gray-500">
                        Completed on June 15, 2023 • Target: 30 minutes
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Final result: 28:45 minutes</div>
                    <Progress value={100} className="h-2 mt-1 bg-green-100" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden bg-gray-50 border-green-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        Monthly Meditation
                        <span className="inline-block ml-2 bg-green-100 text-green-800 text-xs py-0.5 px-2 rounded-full">
                          Completed
                        </span>
                      </h3>
                      <div className="text-xs text-gray-500">
                        Completed on May 31, 2023 • Target: 20 sessions
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Final result: 23 sessions</div>
                    <Progress value={100} className="h-2 mt-1 bg-green-100" />
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button variant="outline" size="sm">
                  View All Completed Goals
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GoalTrackingCard;
