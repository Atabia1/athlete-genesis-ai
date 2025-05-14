/**
 * Health Data Display Component
 * 
 * This component displays health data from connected health apps on the dashboard.
 * It shows key metrics like steps, heart rate, sleep, and recent workouts.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Footprints, Moon, Dumbbell, Clock, Calendar, ArrowRight } from 'lucide-react';
import { healthSyncService } from '@/services/health-sync-service';
import { HealthData, HealthWorkout } from '@/integrations/health-apps/types';
import HealthAppConnect from '@/components/features/HealthAppConnect';

interface HealthDataDisplayProps {
  /** Optional className for styling */
  className?: string;
}

/**
 * Health Data Display Component
 */
const HealthDataDisplay = ({ className = '' }: HealthDataDisplayProps) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch health data
  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      const data = await healthSyncService.getHealthData();
      setHealthData(data);
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch health data on mount
  useEffect(() => {
    fetchHealthData();
  }, []);
  
  // Handle health data sync from HealthAppConnect
  const handleHealthDataSync = (data: HealthData) => {
    setHealthData(data);
  };
  
  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format time for display
  const formatTime = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Format duration in minutes to hours and minutes
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    }
    
    return `${hours}h ${mins}m`;
  };
  
  // Calculate step goal progress
  const calculateStepProgress = () => {
    if (!healthData?.steps) return 0;
    const stepGoal = 10000; // Default step goal
    return Math.min(100, (healthData.steps / stepGoal) * 100);
  };
  
  // Get sleep quality color
  const getSleepQualityColor = (quality?: 'poor' | 'fair' | 'good' | 'excellent') => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-emerald-500';
      case 'fair': return 'text-amber-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  // Render recent workouts
  const renderRecentWorkouts = () => {
    if (!healthData?.workouts || healthData.workouts.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>No recent workouts found</p>
        </div>
      );
    }
    
    // Sort workouts by date (most recent first)
    const sortedWorkouts = [...healthData.workouts]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 5); // Show only the 5 most recent workouts
    
    return (
      <div className="space-y-3">
        {sortedWorkouts.map((workout, index) => (
          <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{workout.type}</div>
              <div className="text-sm text-gray-500">
                {formatDate(workout.startDate)} • {formatDuration(workout.duration / 60)}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{workout.calories} cal</div>
              {workout.distance && (
                <div className="text-sm text-gray-500">
                  {(workout.distance / 1000).toFixed(2)} km
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // If no health data is available, show the connect component
  if (!healthData && !isLoading) {
    return <HealthAppConnect onHealthDataSync={handleHealthDataSync} className={className} />;
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5" />
          Health Data
        </CardTitle>
        <CardDescription>
          Health metrics from your connected health app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Steps */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Footprints className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="font-medium">Steps</span>
                </div>
                <span className="text-xl font-semibold">
                  {healthData?.steps?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <Progress value={calculateStepProgress()} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0</span>
                <span>Goal: 10,000</span>
              </div>
            </div>
            
            {/* Heart Rate */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                <span className="font-medium">Heart Rate</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Resting</div>
                  <div className="font-semibold">
                    {healthData?.heartRate?.resting || 'N/A'}
                    {healthData?.heartRate?.resting && ' bpm'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Average</div>
                  <div className="font-semibold">
                    {healthData?.heartRate?.average || 'N/A'}
                    {healthData?.heartRate?.average && ' bpm'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Max</div>
                  <div className="font-semibold">
                    {healthData?.heartRate?.max || 'N/A'}
                    {healthData?.heartRate?.max && ' bpm'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sleep */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                <span className="font-medium">Sleep</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="font-semibold">
                    {healthData?.sleep?.duration 
                      ? formatDuration(healthData.sleep.duration)
                      : 'N/A'
                    }
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Quality</div>
                  <div className={`font-semibold ${getSleepQualityColor(healthData?.sleep?.quality)}`}>
                    {healthData?.sleep?.quality 
                      ? healthData.sleep.quality.charAt(0).toUpperCase() + healthData.sleep.quality.slice(1)
                      : 'N/A'
                    }
                  </div>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => setActiveTab('metrics')}>
              View All Metrics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>
          
          <TabsContent value="workouts" className="space-y-4 mt-4">
            {renderRecentWorkouts()}
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Weight */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Weight</div>
                <div className="font-semibold">
                  {healthData?.weight 
                    ? `${healthData.weight.toFixed(1)} kg`
                    : 'N/A'
                  }
                </div>
              </div>
              
              {/* Height */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Height</div>
                <div className="font-semibold">
                  {healthData?.height 
                    ? `${healthData.height} cm`
                    : 'N/A'
                  }
                </div>
              </div>
              
              {/* Blood Pressure */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Blood Pressure</div>
                <div className="font-semibold">
                  {healthData?.bloodPressure?.systolic && healthData?.bloodPressure?.diastolic
                    ? `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`
                    : 'N/A'
                  }
                </div>
              </div>
              
              {/* Blood Glucose */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Blood Glucose</div>
                <div className="font-semibold">
                  {healthData?.bloodGlucose 
                    ? `${healthData.bloodGlucose} mg/dL`
                    : 'N/A'
                  }
                </div>
              </div>
              
              {/* Oxygen Saturation */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Oxygen Saturation</div>
                <div className="font-semibold">
                  {healthData?.oxygenSaturation 
                    ? `${healthData.oxygenSaturation}%`
                    : 'N/A'
                  }
                </div>
              </div>
              
              {/* Last Sync */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Last Synced</div>
                <div className="font-semibold">
                  {healthData?.lastSyncDate 
                    ? formatDate(healthData.lastSyncDate) + ' ' + formatTime(healthData.lastSyncDate)
                    : 'Never'
                  }
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HealthDataDisplay;
