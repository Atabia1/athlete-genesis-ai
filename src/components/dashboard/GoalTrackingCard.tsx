import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle2, 
  Plus,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  Dumbbell,
  Heart,
  Scale,
  Brain,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Goal type definition
interface Goal {
  id: string;
  name: string;
  category: 'fitness' | 'nutrition' | 'health' | 'wellness';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  startDate: Date;
  milestones: Milestone[];
  completed: boolean;
  icon: keyof typeof goalIcons;
}

// Milestone type definition
interface Milestone {
  id: string;
  name: string;
  target: number;
  completed: boolean;
}

// Goal icons mapping
const goalIcons = {
  dumbbell: <Dumbbell className="h-5 w-5" />,
  heart: <Heart className="h-5 w-5" />,
  scale: <Scale className="h-5 w-5" />,
  brain: <Brain className="h-5 w-5" />,
  zap: <Zap className="h-5 w-5" />,
  target: <Target className="h-5 w-5" />
};

// Goal category colors
const categoryColors = {
  fitness: 'bg-blue-100 text-blue-600',
  nutrition: 'bg-green-100 text-green-600',
  health: 'bg-red-100 text-red-600',
  wellness: 'bg-purple-100 text-purple-600'
};

interface GoalTrackingCardProps {
  /** Optional className for styling */
  className?: string;
  /** Initial goals (if any) */
  initialGoals?: Goal[];
  /** Whether to enable goal editing */
  enableEditing?: boolean;
  /** Callback when goals are updated */
  onGoalsUpdate?: (goals: Goal[]) => void;
}

/**
 * Goal Tracking Card Component
 * 
 * Provides a comprehensive interface for setting, tracking, and visualizing progress
 * towards health and fitness goals.
 */
const GoalTrackingCard = ({ 
  className = '',
  initialGoals,
  enableEditing = true,
  onGoalsUpdate
}: GoalTrackingCardProps) => {
  const [activeTab, setActiveTab] = useState('active');
  const [goals, setGoals] = useState<Goal[]>(initialGoals || []);
  const [ setProgressData] = useState<any[]>([]);
  const [ setCategoryData] = useState<any[]>([]);
  
  // Generate mock data for visualization
  useEffect(() => {
    if (!initialGoals || initialGoals.length === 0) {
      // Generate mock goals if none provided
      generateMockGoals();
    }
    
    generateProgressData();
    generateCategoryData();
  }, [initialGoals]);
  
  // Generate mock goals
  const generateMockGoals = () => {
    const mockGoals: Goal[] = [
      {
        id: '1',
        name: 'Increase Bench Press',
        category: 'fitness',
        target: 100,
        current: 85,
        unit: 'kg',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        milestones: [
          { id: '1-1', name: 'Milestone 1', target: 80, completed: true },
          { id: '1-2', name: 'Milestone 2', target: 90, completed: false },
          { id: '1-3', name: 'Milestone 3', target: 100, completed: false }
        ],
        completed: false,
        icon: 'dumbbell'
      },
      {
        id: '2',
        name: 'Reduce Resting Heart Rate',
        category: 'health',
        target: 60,
        current: 65,
        unit: 'bpm',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        milestones: [
          { id: '2-1', name: 'Milestone 1', target: 68, completed: true },
          { id: '2-2', name: 'Milestone 2', target: 65, completed: true },
          { id: '2-3', name: 'Milestone 3', target: 60, completed: false }
        ],
        completed: false,
        icon: 'heart'
      },
      {
        id: '3',
        name: 'Reach Target Weight',
        category: 'fitness',
        target: 75,
        current: 78,
        unit: 'kg',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        milestones: [
          { id: '3-1', name: 'Milestone 1', target: 82, completed: true },
          { id: '3-2', name: 'Milestone 2', target: 78, completed: true },
          { id: '3-3', name: 'Milestone 3', target: 75, completed: false }
        ],
        completed: false,
        icon: 'scale'
      },
      {
        id: '4',
        name: 'Increase Protein Intake',
        category: 'nutrition',
        target: 180,
        current: 150,
        unit: 'g',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        milestones: [
          { id: '4-1', name: 'Milestone 1', target: 140, completed: true },
          { id: '4-2', name: 'Milestone 2', target: 160, completed: false },
          { id: '4-3', name: 'Milestone 3', target: 180, completed: false }
        ],
        completed: false,
        icon: 'zap'
      },
      {
        id: '5',
        name: 'Complete 5K Run',
        category: 'fitness',
        target: 5,
        current: 5,
        unit: 'km',
        deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        milestones: [
          { id: '5-1', name: 'Milestone 1', target: 3, completed: true },
          { id: '5-2', name: 'Milestone 2', target: 4, completed: true },
          { id: '5-3', name: 'Milestone 3', target: 5, completed: true }
        ],
        completed: true,
        icon: 'target'
      }
    ];
    
    setGoals(mockGoals);
  };
  
  // Generate progress data for visualization
  const generateProgressData = () => {
    // In a real app, this would process actual goal progress data
    // For demo purposes, we'll generate mock data
    
    
    
    // Generate 12 weeks of data
    for (let i = 0; i < 12; i++) {
      progressData.push({
        week: `Week ${i + 1}`,
        completed: Math.floor(Math.random() * 3) + 1,
        created: Math.floor(Math.random() * 2)
      });
    }
    
    setProgressData(progressData);
  };
  
  // Generate category data for visualization
  const generateCategoryData = () => {
    // Count goals by category
    const categoryCounts = {
      fitness: 0,
      nutrition: 0,
      health: 0,
      wellness: 0
    };
    
    goals.forEach(goal => {
      categoryCounts[goal.category]++;
    });
    
    // Convert to array for chart
    const categoryData = [
      { name: 'Fitness', value: categoryCounts.fitness, color: '#3b82f6' },
      { name: 'Nutrition', value: categoryCounts.nutrition, color: '#10b981' },
      { name: 'Health', value: categoryCounts.health, color: '#ef4444' },
      { name: 'Wellness', value: categoryCounts.wellness, color: '#8b5cf6' }
    ].filter(item => item.value > 0);
    
    setCategoryData(categoryData);
  };
  
  // Calculate goal progress percentage
  const calculateProgress = (current: number, target: number) => {
    // For goals where lower is better (e.g., resting heart rate)
    if (current > target) {
      // Calculate how much progress has been made from the starting point
      // This would require knowing the starting value, which we don't have
      // For simplicity, we'll just use a fixed percentage
      return 80;
    }
    
    return Math.min(100, Math.round((current / target) * 100));
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = new Date(deadline).getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };
  
  // Get active goals
  const activeGoals = goals.filter(goal => !goal.completed);
  
  // Get completed goals
  const completedGoals = goals.filter(goal => goal.completed);
  
  // Handle adding a new goal
  const handleAddGoal = () => {
    // In a real app, this would open a modal or form to add a new goal
    console.log('Adding new goal...');
    alert('This would open a form to add a new goal');
  };
  
  // Handle editing a goal
  const handleEditGoal = (goalId: string) => {
    // In a real app, this would open a modal or form to edit the goal
    console.log('Editing goal:', goalId);
    alert(`This would open a form to edit goal ${goalId}`);
  };
  
  // Handle deleting a goal
  const handleDeleteGoal = (goalId: string) => {
    // In a real app, this would show a confirmation dialog
    if (confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      
      if (onGoalsUpdate) {
        onGoalsUpdate(updatedGoals);
      }
    }
  };
  
  // Handle marking a goal as complete
  const handleCompleteGoal = (goalId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, completed: true };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    
    if (onGoalsUpdate) {
      onGoalsUpdate(updatedGoals);
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            <CardTitle className="text-xl">Goal Tracking</CardTitle>
          </div>
          {enableEditing && (
            <Button size="sm" onClick={handleAddGoal}>
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          )}
        </div>
        <CardDescription>
          Set, track, and achieve your health and fitness goals
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="active" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Active Goals ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Completed ({completedGoals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
          
          {/* Active Goals Tab */}
          <TabsContent value="active" className="p-6">
            {activeGoals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Active Goals</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">
                  Set goals to track your progress and stay motivated
                </p>
                {enableEditing && (
                  <Button onClick={handleAddGoal}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Goal
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {activeGoals.map(goal => (
                  <div key={goal.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${categoryColors[goal.category]}`}>
                          {goalIcons[goal.icon]}
                        </div>
                        <div>
                          <h3 className="font-medium">{goal.name}</h3>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2">
                              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {calculateDaysRemaining(goal.deadline)} days left
                            </span>
                          </div>
                        </div>
                      </div>
                      {enableEditing && (
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleCompleteGoal(goal.id)}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm font-medium">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={calculateProgress(goal.current, goal.target)} className="h-2" />
                    </div>
                    {goal.milestones.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs text-gray-500">Milestones:</span>
                        <div className="flex mt-1 space-x-1">
                          {goal.milestones.map(milestone => (
                            <Badge 
                              key={milestone.id} 
                              variant={milestone.completed ? "default" : "outline"}
                              className={milestone.completed ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                            >
                              {milestone.completed && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {milestone.target} {goal.unit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GoalTrackingCard;
