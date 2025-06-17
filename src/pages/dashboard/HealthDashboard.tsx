
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Heart,
  RefreshCw,
  Info,
  Settings,
  ArrowRight,
  Dumbbell,
  Calendar
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

// Mock health data type
interface HealthData {
  steps?: number;
  heartRate?: {
    average: number;
    resting: number;
  };
  sleep?: {
    duration: number; // in minutes
    quality: string;
  };
  workouts?: Array<{
    type: string;
    duration: number;
    calories: number;
    distance?: number;
    startDate: Date;
  }>;
}

const HealthDashboard = () => {
  const { toast } = useToast();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    lastSync: string | null;
    syncInProgress: boolean;
    connectedDevices: number;
  }>({
    lastSync: null,
    syncInProgress: false,
    connectedDevices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock health data
      const mockData: HealthData = {
        steps: 8542,
        heartRate: {
          average: 75,
          resting: 62
        },
        sleep: {
          duration: 450, // 7.5 hours in minutes
          quality: 'Good'
        },
        workouts: [
          {
            type: 'Running',
            duration: 1800, // 30 minutes
            calories: 280,
            distance: 5000,
            startDate: new Date()
          },
          {
            type: 'Strength Training',
            duration: 2700, // 45 minutes
            calories: 220,
            startDate: new Date(Date.now() - 86400000) // yesterday
          }
        ]
      };
      
      setHealthData(mockData);
      setSyncStatus({
        lastSync: new Date().toISOString(),
        syncInProgress: false,
        connectedDevices: 2
      });
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format workout date
  const formatWorkoutDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  // Format workout duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Handle manual sync
  const handleManualSync = async () => {
    try {
      setSyncStatus(prev => ({ ...prev, syncInProgress: true }));
      
      toast({
        title: "Syncing Health Data",
        description: "Please wait while we sync your health data...",
      });

      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Sync Completed",
        description: "Your health data has been synced successfully.",
      });

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Failed to sync health data:', error);
      toast({
        title: "Sync Failed",
        description: "An error occurred while syncing health data.",
        variant: "destructive",
      });
    } finally {
      setSyncStatus(prev => ({ ...prev, syncInProgress: false }));
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Health Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Track your health metrics and get personalized insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => window.location.href = '/settings/health-apps'}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Health Data Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Health Data Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Last Sync</div>
                  <div className="font-semibold">
                    {formatDate(syncStatus.lastSync)}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Connected Devices</div>
                  <div className="font-semibold flex items-center">
                    <span>{syncStatus.connectedDevices}</span>
                    {syncStatus.connectedDevices === 0 && (
                      <Button
                        variant="link"
                        className="text-xs p-0 h-auto ml-2"
                        onClick={() => window.location.href = '/settings/health-apps/connect'}
                      >
                        Connect Now
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Actions</div>
                  <div className="font-semibold">
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={handleManualSync}
                      disabled={syncStatus.syncInProgress}
                    >
                      {syncStatus.syncInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Sync Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            // Loading state
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : !healthData ? (
            // No health data
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No Health Data Available</AlertTitle>
              <AlertDescription>
                Connect a health app to start tracking your health metrics.
                <Button
                  variant="link"
                  className="p-0 h-auto block mt-2"
                  onClick={() => window.location.href = '/settings/health-apps/connect'}
                >
                  Connect Health App
                  <ArrowRight className="h-3 w-3 ml-1 inline" />
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            // Health dashboard
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Health Overview */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Activity</CardTitle>
                    <CardDescription>Your health metrics for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{healthData.steps?.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Steps</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{healthData.heartRate?.average} bpm</div>
                        <div className="text-sm text-gray-600">Avg Heart Rate</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{Math.round((healthData.sleep?.duration || 0) / 60)}h</div>
                        <div className="text-sm text-gray-600">Sleep</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5" />
                    Recent Workouts
                  </CardTitle>
                  <CardDescription>
                    Your latest workout activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {healthData.workouts && healthData.workouts.length > 0 ? (
                    <div className="space-y-3">
                      {healthData.workouts.slice(0, 5).map((workout, index) => (
                        <div key={index} className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{workout.type}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatWorkoutDate(workout.startDate.toString())} • {formatDuration(workout.duration)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{workout.calories} cal</div>
                            {workout.distance && (
                              <div className="text-xs text-gray-500">
                                {(workout.distance / 1000).toFixed(2)} km
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => window.location.href = '/workouts/history'}
                      >
                        View All Workouts
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>No workout data available</p>
                      <Button
                        variant="link"
                        className="mt-2"
                        onClick={() => window.location.href = '/workouts'}
                      >
                        Browse Workout Plans
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HealthDashboard;
