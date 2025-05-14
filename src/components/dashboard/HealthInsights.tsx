/**
 * Health Insights Component
 * 
 * This component provides personalized insights based on health data.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Activity, 
  Moon, 
  Dumbbell, 
  Zap, 
  Award,
  AlertTriangle,
  ThumbsUp,
  Info,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { HealthData, HealthWorkout } from '@/integrations/health-apps/types';

interface HealthInsightsProps {
  /** Health data to analyze */
  healthData: HealthData;
  
  /** Optional className for styling */
  className?: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  metric?: string;
  action?: {
    label: string;
    href: string;
  };
}

/**
 * Health Insights Component
 */
const HealthInsights = ({ healthData, className = '' }: HealthInsightsProps) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate insights based on health data
  useEffect(() => {
    if (!healthData) return;
    
    setIsLoading(true);
    
    // Generate insights
    const generatedInsights = generateInsights(healthData);
    setInsights(generatedInsights);
    
    setIsLoading(false);
  }, [healthData]);
  
  // Generate insights based on health data
  const generateInsights = (data: HealthData): Insight[] => {
    const insights: Insight[] = [];
    
    // Step count insights
    if (data.steps !== undefined) {
      if (data.steps >= 10000) {
        insights.push({
          id: 'steps-goal-achieved',
          title: 'Daily Step Goal Achieved',
          description: 'Great job! You\'ve reached your daily step goal of 10,000 steps.',
          icon: <Award className="h-5 w-5 text-green-500" />,
          type: 'positive',
          metric: `${data.steps.toLocaleString()} steps`,
        });
      } else if (data.steps < 5000) {
        insights.push({
          id: 'low-step-count',
          title: 'Low Step Count',
          description: 'You\'re below the recommended daily step count. Try to aim for at least 10,000 steps per day.',
          icon: <TrendingDown className="h-5 w-5 text-red-500" />,
          type: 'negative',
          metric: `${data.steps.toLocaleString()} steps`,
          action: {
            label: 'View Step Tracking Tips',
            href: '/resources/step-tracking',
          },
        });
      }
    }
    
    // Heart rate insights
    if (data.heartRate) {
      if (data.heartRate.resting && data.heartRate.resting < 60) {
        insights.push({
          id: 'low-resting-heart-rate',
          title: 'Low Resting Heart Rate',
          description: 'Your resting heart rate is below 60 BPM, which is often associated with good cardiovascular fitness.',
          icon: <Heart className="h-5 w-5 text-green-500" />,
          type: 'positive',
          metric: `${data.heartRate.resting} BPM`,
        });
      } else if (data.heartRate.resting && data.heartRate.resting > 100) {
        insights.push({
          id: 'high-resting-heart-rate',
          title: 'High Resting Heart Rate',
          description: 'Your resting heart rate is above 100 BPM. This could be due to stress, caffeine, or other factors.',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          type: 'warning',
          metric: `${data.heartRate.resting} BPM`,
          action: {
            label: 'Learn About Heart Rate',
            href: '/resources/heart-rate',
          },
        });
      }
    }
    
    // Sleep insights
    if (data.sleep && data.sleep.duration) {
      const sleepHours = data.sleep.duration / 60; // Convert minutes to hours
      
      if (sleepHours >= 7 && sleepHours <= 9) {
        insights.push({
          id: 'optimal-sleep',
          title: 'Optimal Sleep Duration',
          description: 'You\'re getting the recommended 7-9 hours of sleep, which is great for recovery and overall health.',
          icon: <Moon className="h-5 w-5 text-purple-500" />,
          type: 'positive',
          metric: `${sleepHours.toFixed(1)} hours`,
        });
      } else if (sleepHours < 7) {
        insights.push({
          id: 'insufficient-sleep',
          title: 'Insufficient Sleep',
          description: 'You\'re getting less than the recommended 7 hours of sleep. This can affect recovery and performance.',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          type: 'warning',
          metric: `${sleepHours.toFixed(1)} hours`,
          action: {
            label: 'Sleep Improvement Tips',
            href: '/resources/sleep',
          },
        });
      }
    }
    
    // Workout insights
    if (data.workouts && data.workouts.length > 0) {
      // Count workouts in the last 7 days
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const recentWorkouts = data.workouts.filter(workout => {
        const workoutDate = new Date(workout.startDate);
        return workoutDate >= sevenDaysAgo;
      });
      
      if (recentWorkouts.length >= 3) {
        insights.push({
          id: 'active-week',
          title: 'Active Week',
          description: `You've completed ${recentWorkouts.length} workouts in the last 7 days. Great job staying active!`,
          icon: <Dumbbell className="h-5 w-5 text-green-500" />,
          type: 'positive',
          metric: `${recentWorkouts.length} workouts`,
        });
      }
      
      // Check for workout variety
      const workoutTypes = new Set(recentWorkouts.map(workout => workout.type.toLowerCase()));
      
      if (workoutTypes.size >= 3) {
        insights.push({
          id: 'workout-variety',
          title: 'Good Workout Variety',
          description: 'You\'re mixing up your workouts with different types of activities, which is great for overall fitness.',
          icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
          type: 'positive',
          metric: `${workoutTypes.size} different types`,
        });
      }
    } else {
      insights.push({
        id: 'no-recent-workouts',
        title: 'No Recent Workouts',
        description: 'We haven\'t detected any workouts recently. Regular exercise is important for overall health.',
        icon: <Info className="h-5 w-5 text-blue-500" />,
        type: 'neutral',
        action: {
          label: 'Browse Workout Plans',
          href: '/workouts',
        },
      });
    }
    
    // Weight insights
    if (data.weight) {
      // This would typically compare to previous weight measurements
      // For now, just provide a neutral insight
      insights.push({
        id: 'weight-tracking',
        title: 'Weight Tracking Active',
        description: 'You\'re successfully tracking your weight, which is helpful for monitoring progress over time.',
        icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
        type: 'neutral',
        metric: `${data.weight.toFixed(1)} kg`,
      });
    }
    
    return insights;
  };
  
  // Get background color based on insight type
  const getInsightBackground = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'neutral':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  // Get icon background color based on insight type
  const getIconBackground = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-green-100';
      case 'negative':
        return 'bg-red-100';
      case 'warning':
        return 'bg-amber-100';
      case 'neutral':
      default:
        return 'bg-blue-100';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="mr-2 h-5 w-5" />
          Health Insights
        </CardTitle>
        <CardDescription>
          Personalized insights based on your health data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="mr-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : insights.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Insights Available</AlertTitle>
            <AlertDescription>
              We need more health data to generate personalized insights. Connect a health app to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`flex p-4 rounded-lg border ${getInsightBackground(insight.type)}`}
              >
                <div className={`${getIconBackground(insight.type)} p-2 rounded-full mr-4 self-start`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{insight.title}</h3>
                    {insight.metric && (
                      <Badge variant="outline" className="ml-2">
                        {insight.metric}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mt-1">{insight.description}</p>
                  {insight.action && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm mt-2"
                      onClick={() => window.location.href = insight.action!.href}
                    >
                      {insight.action.label}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthInsights;
