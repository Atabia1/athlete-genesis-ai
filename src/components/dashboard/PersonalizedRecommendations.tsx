/**
 * Personalized Recommendations Component
 * 
 * This component displays personalized health recommendations based on
 * the user's health data, detected anomalies, and predicted trends.
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Heart, 
  Activity, 
  Dumbbell, 
  Utensils, 
  Moon, 
  Brain, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles 
} from 'lucide-react';
import { HealthData } from '@/integrations/health-apps/types';
import { Anomaly } from '@/utils/anomaly-detection';
import { TrendDirection } from '@/utils/trend-prediction';

// Props interface
interface PersonalizedRecommendationsProps {
  /** User's health data */
  healthData: HealthData;
  /** Detected anomalies */
  anomalies?: Anomaly[];
  /** Predicted trends */
  trends?: Record<string, { direction: TrendDirection; confidence: number }>;
  /** Additional CSS class */
  className?: string;
}

/**
 * Recommendation interface
 */
interface Recommendation {
  /** Unique ID */
  id: string;
  /** Recommendation title */
  title: string;
  /** Recommendation description */
  description: string;
  /** Recommendation category */
  category: 'activity' | 'nutrition' | 'sleep' | 'recovery' | 'general';
  /** Recommendation priority (1-10) */
  priority: number;
  /** Whether the recommendation has been implemented */
  implemented: boolean;
  /** Whether the recommendation has been dismissed */
  dismissed: boolean;
  /** Icon for the recommendation */
  icon: React.ReactNode;
}

/**
 * Generate activity recommendations based on health data
 * @param healthData Health data
 * @param anomalies Detected anomalies
 * @param trends Predicted trends
 * @returns Array of activity recommendations
 */
const generateActivityRecommendations = (
  healthData: HealthData,
  anomalies?: Anomaly[],
  trends?: Record<string, { direction: TrendDirection; confidence: number }>
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Check step count
  if (healthData.steps !== undefined) {
    if (healthData.steps < 5000) {
      recommendations.push({
        id: 'activity-steps-low',
        title: 'Increase daily steps',
        description: 'Your average step count is below the recommended 7,500-10,000 steps per day. Try to add short walks throughout your day.',
        category: 'activity',
        priority: 8,
        implemented: false,
        dismissed: false,
        icon: <Footprints className="h-5 w-5 text-blue-500" />,
      });
    }
  }
  
  // Check for activity trends
  if (trends?.activity?.direction === TrendDirection.DOWN) {
    recommendations.push({
      id: 'activity-trend-down',
      title: 'Declining activity detected',
      description: 'Your activity level has been decreasing. Consider setting a reminder to move more throughout the day.',
      category: 'activity',
      priority: 7,
      implemented: false,
      dismissed: false,
      icon: <Activity className="h-5 w-5 text-orange-500" />,
    });
  }
  
  // Check heart rate during activity
  if (healthData.heartRate?.max !== undefined && healthData.heartRate.max > 180) {
    recommendations.push({
      id: 'activity-heart-rate-high',
      title: 'High exercise intensity detected',
      description: 'Your maximum heart rate during exercise is very high. Consider including more moderate-intensity workouts in your routine.',
      category: 'activity',
      priority: 6,
      implemented: false,
      dismissed: false,
      icon: <Heart className="h-5 w-5 text-red-500" />,
    });
  }
  
  return recommendations;
};

/**
 * Generate nutrition recommendations based on health data
 * @param healthData Health data
 * @returns Array of nutrition recommendations
 */
const generateNutritionRecommendations = (healthData: HealthData): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Add some sample nutrition recommendations
  recommendations.push({
    id: 'nutrition-protein',
    title: 'Optimize protein intake',
    description: 'Based on your activity level and goals, aim for 1.6-2.0g of protein per kg of body weight to support muscle recovery and growth.',
    category: 'nutrition',
    priority: 7,
    implemented: false,
    dismissed: false,
    icon: <Utensils className="h-5 w-5 text-green-500" />,
  });
  
  // Check hydration (placeholder - would use actual data in a real implementation)
  recommendations.push({
    id: 'nutrition-hydration',
    title: 'Increase hydration',
    description: 'Your activity level suggests you may need to increase water intake. Aim for at least 3 liters of water daily.',
    category: 'nutrition',
    priority: 8,
    implemented: false,
    dismissed: false,
    icon: <Droplet className="h-5 w-5 text-blue-500" />,
  });
  
  return recommendations;
};

/**
 * Generate sleep recommendations based on health data
 * @param healthData Health data
 * @returns Array of sleep recommendations
 */
const generateSleepRecommendations = (healthData: HealthData): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Check sleep duration
  if (healthData.sleep?.duration !== undefined) {
    const sleepHours = healthData.sleep.duration / 60; // Convert minutes to hours
    
    if (sleepHours < 7) {
      recommendations.push({
        id: 'sleep-duration-low',
        title: 'Increase sleep duration',
        description: `Your average sleep duration is ${sleepHours.toFixed(1)} hours, which is below the recommended 7-9 hours. Try to establish a consistent sleep schedule.`,
        category: 'sleep',
        priority: 9,
        implemented: false,
        dismissed: false,
        icon: <Moon className="h-5 w-5 text-purple-500" />,
      });
    }
  }
  
  // Check sleep quality
  if (healthData.sleep?.quality === 'poor' || healthData.sleep?.quality === 'fair') {
    recommendations.push({
      id: 'sleep-quality-low',
      title: 'Improve sleep quality',
      description: 'Your sleep quality is below optimal. Consider limiting screen time before bed and optimizing your sleep environment.',
      category: 'sleep',
      priority: 8,
      implemented: false,
      dismissed: false,
      icon: <Moon className="h-5 w-5 text-indigo-500" />,
    });
  }
  
  return recommendations;
};

/**
 * Generate recovery recommendations based on health data
 * @param healthData Health data
 * @returns Array of recovery recommendations
 */
const generateRecoveryRecommendations = (healthData: HealthData): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Check resting heart rate
  if (healthData.heartRate?.resting !== undefined && healthData.heartRate.resting > 70) {
    recommendations.push({
      id: 'recovery-rhr-high',
      title: 'Elevated resting heart rate',
      description: 'Your resting heart rate is elevated, which may indicate insufficient recovery. Consider adding more rest days or light activity days to your routine.',
      category: 'recovery',
      priority: 7,
      implemented: false,
      dismissed: false,
      icon: <Heart className="h-5 w-5 text-red-500" />,
    });
  }
  
  // Add general recovery recommendation
  recommendations.push({
    id: 'recovery-general',
    title: 'Implement active recovery',
    description: 'Include active recovery activities like light walking, swimming, or yoga on rest days to promote blood flow and recovery.',
    category: 'recovery',
    priority: 6,
    implemented: false,
    dismissed: false,
    icon: <Activity className="h-5 w-5 text-green-500" />,
  });
  
  return recommendations;
};

/**
 * Personalized Recommendations Component
 */
const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  healthData,
  anomalies = [],
  trends = {},
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [implementedCount, setImplementedCount] = useState(0);
  
  // Generate recommendations when health data changes
  useEffect(() => {
    const activityRecs = generateActivityRecommendations(healthData, anomalies, trends);
    const nutritionRecs = generateNutritionRecommendations(healthData);
    const sleepRecs = generateSleepRecommendations(healthData);
    const recoveryRecs = generateRecoveryRecommendations(healthData);
    
    const allRecs = [
      ...activityRecs,
      ...nutritionRecs,
      ...sleepRecs,
      ...recoveryRecs,
    ].sort((a, b) => b.priority - a.priority);
    
    setRecommendations(allRecs);
    setImplementedCount(allRecs.filter(rec => rec.implemented).length);
  }, [healthData, anomalies, trends]);
  
  // Handle implementing a recommendation
  const handleImplement = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, implemented: true, dismissed: false } 
          : rec
      )
    );
    setImplementedCount(prev => prev + 1);
  };
  
  // Handle dismissing a recommendation
  const handleDismiss = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, dismissed: true, implemented: false } 
          : rec
      )
    );
  };
  
  // Filter recommendations based on active tab
  const filteredRecommendations = recommendations.filter(rec => {
    if (rec.dismissed) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'implemented') return rec.implemented;
    return rec.category === activeTab && !rec.implemented;
  });
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>
              Tailored suggestions based on your health data
            </CardDescription>
          </div>
          {implementedCount > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              {implementedCount} Implemented
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
            <TabsTrigger value="implemented">Implemented</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {filteredRecommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                <Sparkles className="h-12 w-12 mb-2 text-gray-300" />
                <p className="text-lg font-medium">No recommendations available</p>
                <p className="text-sm">
                  {activeTab === 'implemented' 
                    ? "You haven't implemented any recommendations yet." 
                    : "We don't have any recommendations for this category right now."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecommendations.map(rec => (
                  <div 
                    key={rec.id} 
                    className={cn(
                      "p-4 rounded-lg border",
                      rec.implemented ? "bg-green-50 border-green-200" : "bg-white"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium flex items-center">
                          {rec.title}
                          {rec.implemented && (
                            <Badge variant="success" className="ml-2 text-xs">
                              Implemented
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {rec.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!rec.implemented ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => handleImplement(rec.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Implement
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDismiss(rec.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Refresh Recommendations
        </Button>
        <Button variant="ghost" size="sm" className="text-blue-500">
          View All
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Add missing components
const Footprints = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 2.28-5 5-5 2.72 0 4.97 2.28 5 5 .03 2.5-1 3.5-1 5.62V16h-8Z" />
    <path d="M20 20v-2.38c0-2.12-1.03-3.12-1-5.62.03-2.72 2.28-5 5-5 2.72 0 4.97 2.28 5 5 .03 2.5-1 3.5-1 5.62V20h-8Z" />
  </svg>
);

const Droplet = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

export default PersonalizedRecommendations;
