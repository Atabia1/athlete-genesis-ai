
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Trash2,
  Copy,
  Edit,
  Clock,
  ChevronDown,
  ChevronUp,
  Users,
  Dumbbell,
  CheckCircle,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Sample data for training plans
const trainingPlans = [
  {
    id: 1,
    title: "Pre-Season Strength Builder",
    description: "Focus on building strength and power before the competitive season",
    category: "Strength",
    difficulty: "Intermediate",
    duration: "8 weeks",
    targetSport: "Football",
    createdAt: "2023-12-10",
    assignedTo: 8,
    workouts: [
      {
        id: 101,
        day: "Monday",
        title: "Upper Body Strength",
        exercises: [
          { id: 1001, name: "Bench Press", sets: 4, reps: "8-10", rest: "90 sec" },
          { id: 1002, name: "Pull-ups", sets: 4, reps: "8-10", rest: "90 sec" },
          { id: 1003, name: "Shoulder Press", sets: 3, reps: "10-12", rest: "60 sec" },
          { id: 1004, name: "Bent Over Rows", sets: 3, reps: "10-12", rest: "60 sec" },
          { id: 1005, name: "Tricep Extensions", sets: 3, reps: "12-15", rest: "60 sec" },
        ]
      },
      {
        id: 102,
        day: "Tuesday",
        title: "Lower Body Strength",
        exercises: [
          { id: 1006, name: "Squats", sets: 4, reps: "8-10", rest: "90 sec" },
          { id: 1007, name: "Deadlifts", sets: 4, reps: "8-10", rest: "90 sec" },
          { id: 1008, name: "Lunges", sets: 3, reps: "10-12", rest: "60 sec" },
          { id: 1009, name: "Leg Press", sets: 3, reps: "10-12", rest: "60 sec" },
          { id: 1010, name: "Calf Raises", sets: 3, reps: "15-20", rest: "60 sec" },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Speed & Agility Development",
    description: "Enhance sprint performance and directional changes",
    category: "Speed",
    difficulty: "Advanced",
    duration: "6 weeks",
    targetSport: "Soccer",
    createdAt: "2024-01-15",
    assignedTo: 5,
    workouts: []
  },
  {
    id: 3,
    title: "Endurance Base Builder",
    description: "Build aerobic capacity for endurance sports",
    category: "Endurance",
    difficulty: "Beginner",
    duration: "12 weeks",
    targetSport: "Running",
    createdAt: "2024-02-20",
    assignedTo: 3,
    workouts: []
  },
  {
    id: 4,
    title: "Injury Recovery Protocol",
    description: "Gradual return to activity after lower body injury",
    category: "Rehabilitation",
    difficulty: "Beginner",
    duration: "4 weeks",
    targetSport: "General",
    createdAt: "2024-03-05",
    assignedTo: 1,
    workouts: []
  },
];

// Sample assigned athletes data
const assignedAthletes = [
  { id: 1, name: "Alex Johnson", sport: "Football" },
  { id: 2, name: "Sam Taylor", sport: "Soccer" },
  { id: 3, name: "Jordan Lee", sport: "Running" },
  { id: 4, name: "Casey Williams", sport: "Basketball" },
  { id: 5, name: "Riley Brown", sport: "Soccer" }
];

const TrainingPlans = () => {
  const [expandedPlan, setExpandedPlan] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  
  const togglePlan = (id: number) => {
    setExpandedPlan(expandedPlan === id ? null : id);
  };
  
  const toggleWorkout = (id: number) => {
    setExpandedWorkout(expandedWorkout === id ? null : id);
  };

  return (
    <DashboardLayout title="Training Plans">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Training Plans</h1>
        <p className="text-muted-foreground">
          Create, manage, and assign training plans to your athletes
        </p>
      </div>
      
      <Tabs defaultValue="all-plans" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all-plans">All Plans</TabsTrigger>
            <TabsTrigger value="my-plans">My Plans</TabsTrigger>
            <TabsTrigger value="assigned-plans">Assigned</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <TabsContent value="all-plans" className="space-y-4">
          {trainingPlans.map((plan) => (
            <Collapsible
              key={plan.id}
              open={expandedPlan === plan.id}
              onOpenChange={() => {}}
              className="rounded-md border shadow-sm"
            >
              <div className="bg-card">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => togglePlan(plan.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-orange-100">
                      <Dumbbell className="h-5 w-5 text-orange-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2">
                      <Badge variant="outline">{plan.category}</Badge>
                      <Badge variant="outline">{plan.difficulty}</Badge>
                      <Badge className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {plan.assignedTo}
                      </Badge>
                    </div>
                    <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                        {expandedPlan === plan.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                
                <CollapsibleContent>
                  <div className="px-4 py-3 border-t bg-muted/40">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Details</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Duration: {plan.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Created: {plan.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Sport Focus</p>
                        <Badge variant="outline">{plan.targetSport}</Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Assigned Athletes</p>
                        <div className="flex -space-x-2 overflow-hidden">
                          {assignedAthletes.slice(0, 3).map((athlete) => (
                            <Avatar key={athlete.id} className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                                {athlete.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {plan.assignedTo > 3 && (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-muted text-xs font-medium">
                              +{plan.assignedTo - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Workouts</h4>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <Plus className="h-3.5 w-3.5" /> Add Workout
                        </Button>
                      </div>
                      
                      {plan.workouts.length > 0 ? (
                        <div className="space-y-2">
                          {plan.workouts.map((workout) => (
                            <Card key={workout.id} className="shadow-none">
                              <div 
                                className="flex items-center justify-between p-3 cursor-pointer"
                                onClick={() => toggleWorkout(workout.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline">{workout.day}</Badge>
                                  <span className="font-medium">{workout.title}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWorkout(workout.id);
                                  }}
                                >
                                  {expandedWorkout === workout.id ? (
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  ) : (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </div>
                              
                              {expandedWorkout === workout.id && (
                                <CardContent className="border-t pt-3">
                                  <table className="w-full text-sm">
                                    <thead className="text-xs text-muted-foreground">
                                      <tr>
                                        <th className="text-left font-medium pb-2">Exercise</th>
                                        <th className="text-center font-medium pb-2">Sets</th>
                                        <th className="text-center font-medium pb-2">Reps</th>
                                        <th className="text-center font-medium pb-2">Rest</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {workout.exercises.map((exercise) => (
                                        <tr key={exercise.id} className="hover:bg-muted/50">
                                          <td className="py-2">{exercise.name}</td>
                                          <td className="text-center py-2">{exercise.sets}</td>
                                          <td className="text-center py-2">{exercise.reps}</td>
                                          <td className="text-center py-2">{exercise.rest}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card className="shadow-none bg-muted/50">
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <p className="text-muted-foreground text-center mb-2">
                              No workouts added to this plan yet
                            </p>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Plus className="h-3.5 w-3.5" /> Add First Workout
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 border-t flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Copy className="h-3.5 w-3.5" /> Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button size="sm" className="h-8 gap-1">
                      <Users className="h-3.5 w-3.5" /> Assign
                    </Button>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </TabsContent>
        
        <TabsContent value="my-plans">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <p className="text-muted-foreground text-center mb-4">
                This tab would show only plans you've created personally
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assigned-plans">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <p className="text-muted-foreground text-center mb-4">
                This tab would show plans you've assigned to athletes
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <p className="text-muted-foreground text-center mb-4">
                This tab would show reusable plan templates
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TrainingPlans;
