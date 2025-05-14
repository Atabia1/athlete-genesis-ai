/**
 * Health Dashboard Page
 *
 * This page displays a comprehensive health dashboard with visualizations,
 * insights, and trends based on the user's health data.
 *
 * Features:
 * - Real-time health data updates via WebSockets
 * - Trend prediction and anomaly detection
 * - Personalized recommendations
 * - Social and community features
 * - Accessibility improvements
 */

import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Heart,
  Smartphone,
  RefreshCw,
  Info,
  Settings,
  ArrowRight,
  Dumbbell,
  Calendar,
  Moon,
  Scale,
  Target,
  BarChart2,
  Utensils,
  Download,
  Users,
  Share2,
  Zap,
  AlertTriangle
} from 'lucide-react';

// Eagerly loaded components (above the fold)
import HealthDataVisualization from '@/components/dashboard/HealthDataVisualization';
import HealthScoreCard from '@/components/dashboard/HealthScoreCard';
import GoalTrackingCard from '@/components/dashboard/GoalTrackingCard';
import DashboardCustomizationPanel from '@/components/dashboard/DashboardCustomizationPanel';
import DataSyncIndicator, { SyncStatus } from '@/components/ui/data-sync-indicator';
import AnomalyAlert from '@/components/dashboard/AnomalyAlert';

// Lazily loaded components (below the fold)
const HealthInsights = lazy(() => import('@/components/dashboard/HealthInsights'));
const HealthTrends = lazy(() => import('@/components/dashboard/HealthTrends'));
const SleepAnalysisChart = lazy(() => import('@/components/dashboard/SleepAnalysisChart'));
const BodyCompositionChart = lazy(() => import('@/components/dashboard/BodyCompositionChart'));
const WorkoutPerformanceChart = lazy(() => import('@/components/dashboard/WorkoutPerformanceChart'));
const NutritionAnalysisChart = lazy(() => import('@/components/dashboard/NutritionAnalysisChart'));
const ComparativeAnalyticsChart = lazy(() => import('@/components/dashboard/ComparativeAnalyticsChart'));
const ExportHealthDataCard = lazy(() => import('@/components/dashboard/ExportHealthDataCard'));
const PersonalizedRecommendations = lazy(() => import('@/components/dashboard/PersonalizedRecommendations'));
const AchievementSharing = lazy(() => import('@/components/social/AchievementSharing'));
const CommunityLeaderboard = lazy(() => import('@/components/social/CommunityLeaderboard'));
const CoachSharing = lazy(() => import('@/components/social/CoachSharing'));

import { healthSyncService } from '@/services/health-sync-service';
import { healthApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { HealthData } from '@/integrations/health-apps/types';
import { useAuth } from '@/hooks/use-auth';
import { DashboardCustomizationProvider, useDashboardCustomization, WidgetType } from '@/context/DashboardCustomizationContext';
import { useWebSocket, useWebSocketEvent } from '@/hooks/use-websocket';
import { WebSocketEventType, WebSocketStatus } from '@/services/websocket-service';
import { Anomaly, detectAllAnomalies } from '@/utils/anomaly-detection';
import { DataPoint, TrendDirection, predictTrend } from '@/utils/trend-prediction';

/**
 * Dashboard Content Component
 *
 * This component renders the dashboard content based on customization settings.
 * It includes real-time updates, anomaly detection, and social features.
 */
const DashboardContent = ({
  healthData,
  syncStatus,
  recentWorkouts,
  isLoading,
  handleManualSync,
  formatWorkoutDate,
  formatDuration,
  formatDate,
  anomalies,
  trends,
  webSocketStatus,
  dismissAnomaly
}: {
  healthData: HealthData | null;
  syncStatus: { lastSync: string | null; syncInProgress: boolean; connectedDevices: number; };
  recentWorkouts: any[];
  isLoading: boolean;
  handleManualSync: () => void;
  formatWorkoutDate: (dateStr?: string) => string;
  formatDuration: (seconds: number) => string;
  formatDate: (dateStr?: string | null) => string;
  anomalies: Anomaly[];
  trends: Record<string, { direction: TrendDirection; confidence: number }>;
  webSocketStatus: WebSocketStatus;
  dismissAnomaly: (anomaly: Anomaly) => void;
}) => {
  const { customization } = useDashboardCustomization();

  // Get WebSocket sync status
  const getWebSocketSyncStatus = (): SyncStatus => {
    switch (webSocketStatus) {
      case WebSocketStatus.CONNECTED:
        return SyncStatus.REALTIME;
      case WebSocketStatus.CONNECTING:
        return SyncStatus.SYNCING;
      case WebSocketStatus.ERROR:
        return SyncStatus.ERROR;
      case WebSocketStatus.DISCONNECTED:
        return syncStatus.syncInProgress ? SyncStatus.SYNCING :
               !navigator.onLine ? SyncStatus.OFFLINE : SyncStatus.IDLE;
      default:
        return SyncStatus.IDLE;
    }
  };

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;

    if (customization.theme === 'dark') {
      root.classList.add('dark');
    } else if (customization.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [customization.theme]);

  return (
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
            <DataSyncIndicator
              status={getWebSocketSyncStatus()}
              lastSyncTime={syncStatus.lastSync ? new Date(syncStatus.lastSync) : null}
              showSyncButton={true}
              onSyncClick={handleManualSync}
              variant="badge"
              ariaLabel="Data synchronization status"
            />
            <Button variant="outline" onClick={() => window.location.href = '/settings/health-apps'}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <DashboardCustomizationPanel />
          </div>
        </div>

        {/* Anomaly alerts */}
        {anomalies.length > 0 && (
          <div className="space-y-2">
            {anomalies.slice(0, 3).map((anomaly, index) => (
              <AnomalyAlert
                key={`${anomaly.type}-${anomaly.index}-${index}`}
                anomaly={anomaly}
                dismissable={true}
                onDismiss={dismissAnomaly}
                showTimestamp={true}
                showRecommendations={true}
              />
            ))}
            {anomalies.length > 3 && (
              <Button
                variant="link"
                className="text-sm"
                onClick={() => {
                  // In a real app, this would navigate to a detailed anomalies view
                  toast({
                    title: "All Anomalies",
                    description: `${anomalies.length} anomalies detected in your health data.`,
                  });
                }}
              >
                View all {anomalies.length} anomalies
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        )}

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
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
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
            {/* Render widgets based on customization.widgetOrder */}
            {customization.widgetOrder.map((widgetType) => {
              switch (widgetType) {
                case 'healthScore':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <HealthScoreCard healthData={healthData} />
                    </DashboardWidget>
                  );
                case 'goals':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <GoalTrackingCard />
                    </DashboardWidget>
                  );
                case 'activity':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-2">
                      <HealthDataVisualization healthData={healthData} />
                    </DashboardWidget>
                  );
                case 'workouts':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType}>
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
                    </DashboardWidget>
                  );
                case 'workoutPerformance':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                        <WorkoutPerformanceChart enableExport={true} />
                      </Suspense>
                    </DashboardWidget>
                  );
                case 'sleep':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                        <SleepAnalysisChart healthData={healthData} />
                      </Suspense>
                    </DashboardWidget>
                  );
                case 'bodyComposition':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                        <BodyCompositionChart healthData={healthData} />
                      </Suspense>
                    </DashboardWidget>
                  );
                case 'nutrition':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                        <NutritionAnalysisChart enableExport={true} />
                      </Suspense>
                    </DashboardWidget>
                  );
                case 'comparative':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                        <ComparativeAnalyticsChart healthData={healthData} enableExport={true} />
                      </Suspense>
                    </DashboardWidget>
                  );
                case 'insights':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                        <HealthInsights healthData={healthData} />
                      </Suspense>
                    </DashboardWidget>
                  );
                case 'trends':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                        <HealthTrends initialHealthData={healthData} />
                      </Suspense>
                    </DashboardWidget>
                  );
                case 'export':
                  return (
                    <DashboardWidget key={widgetType} widgetType={widgetType} className="lg:col-span-3">
                      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                        <ExportHealthDataCard healthData={healthData} />
                      </Suspense>
                    </DashboardWidget>
                  );
                default:
                  return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Health Dashboard Page
 */
const HealthDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [trends, setTrends] = useState<Record<string, { direction: TrendDirection; confidence: number }>>({});

  // WebSocket connection for real-time updates
  const { status: webSocketStatus } = useWebSocket({
    autoConnect: true,
    autoReconnect: true,
    authToken: user?.id,
  });

  // Listen for real-time health data updates
  const healthDataUpdate = useWebSocketEvent<HealthData | null>(
    WebSocketEventType.HEALTH_DATA_UPDATE,
    null
  );

  // Fetch health data and sync status
  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch health data
      const data = await healthSyncService.getHealthData();
      setHealthData(data);

      // Fetch sync status
      if (user) {
        try {
          const status = await healthApi.getSyncStatus();
          setSyncStatus(status);
        } catch (error) {
          console.error('Failed to fetch sync status:', error);
        }

        // Fetch recent workouts
        try {
          const workouts = await healthApi.getRecentWorkouts();
          setRecentWorkouts(workouts);
        } catch (error) {
          console.error('Failed to fetch recent workouts:', error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [user]);

  // Update health data when receiving real-time updates
  useEffect(() => {
    if (healthDataUpdate) {
      setHealthData(healthDataUpdate);

      // Detect anomalies and predict trends when health data updates
      analyzeHealthData(healthDataUpdate);
    }
  }, [healthDataUpdate]);

  // Analyze health data for anomalies and trends
  const analyzeHealthData = (data: HealthData | null) => {
    if (!data) return;

    // Convert health data to data points for analysis
    const dataPoints: Record<string, DataPoint[]> = {};

    // Add steps data if available
    if (data.steps !== undefined) {
      dataPoints.steps = [
        { value: data.steps, timestamp: new Date() }
      ];

      // Add mock historical data for demonstration
      for (let i = 1; i <= 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Generate realistic step counts with some variation
        const baseSteps = data.steps * (0.8 + Math.random() * 0.4);
        dataPoints.steps.push({
          value: Math.round(baseSteps),
          timestamp: date
        });
      }
    }

    // Add heart rate data if available
    if (data.heartRate?.average !== undefined) {
      dataPoints.heartRate = [
        { value: data.heartRate.average, timestamp: new Date() }
      ];

      // Add mock historical data
      for (let i = 1; i <= 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Generate realistic heart rate with some variation
        const baseHeartRate = data.heartRate.average * (0.9 + Math.random() * 0.2);
        dataPoints.heartRate.push({
          value: Math.round(baseHeartRate),
          timestamp: date
        });
      }
    }

    // Add sleep data if available
    if (data.sleep?.duration !== undefined) {
      const sleepHours = data.sleep.duration / 60; // Convert minutes to hours
      dataPoints.sleep = [
        { value: sleepHours, timestamp: new Date() }
      ];

      // Add mock historical data
      for (let i = 1; i <= 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Generate realistic sleep duration with some variation
        const baseSleep = sleepHours * (0.85 + Math.random() * 0.3);
        dataPoints.sleep.push({
          value: baseSleep,
          timestamp: date
        });
      }
    }

    // Detect anomalies
    const allAnomalies: Anomaly[] = [];

    Object.entries(dataPoints).forEach(([metric, points]) => {
      // Only detect anomalies if we have enough data points
      if (points.length >= 3) {
        const metricAnomalies = detectAllAnomalies(points, {
          zScoreThreshold: 2.5,
          movingAverageWindowSize: 5,
          movingAverageThreshold: 2.0,
          trendChangeWindowSize: 7,
          trendChangeThresholdAngle: 30,
        });

        allAnomalies.push(...metricAnomalies);
      }
    });

    // Sort anomalies by severity
    allAnomalies.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1, none: 0 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });

    setAnomalies(allAnomalies);

    // Predict trends
    const predictedTrends: Record<string, { direction: TrendDirection; confidence: number }> = {};

    Object.entries(dataPoints).forEach(([metric, points]) => {
      // Only predict trends if we have enough data points
      if (points.length >= 5) {
        const prediction = predictTrend(points, 7);
        predictedTrends[metric] = {
          direction: prediction.direction,
          confidence: prediction.confidence
        };
      }
    });

    setTrends(predictedTrends);
  };

  // Dismiss an anomaly
  const dismissAnomaly = (anomalyToRemove: Anomaly) => {
    setAnomalies(prev => prev.filter(anomaly =>
      anomaly.type !== anomalyToRemove.type ||
      anomaly.index !== anomalyToRemove.index ||
      anomaly.timestamp.getTime() !== anomalyToRemove.timestamp.getTime()
    ));
  };

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
      toast({
        title: "Syncing Health Data",
        description: "Please wait while we sync your health data...",
      });

      const success = await healthSyncService.syncHealthData();

      if (success) {
        toast({
          title: "Sync Completed",
          description: "Your health data has been synced successfully.",
        });

        // Refresh data
        fetchData();
      } else {
        toast({
          title: "Sync Failed",
          description: "Failed to sync health data. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to sync health data:', error);

      toast({
        title: "Sync Failed",
        description: "An error occurred while syncing health data.",
        variant: "destructive",
      });
    }
  };

  // Import DashboardWidget component
  const DashboardWidget = lazy(() => import('@/components/dashboard/DashboardWidget'));

  // Run analysis when health data is loaded
  useEffect(() => {
    if (healthData) {
      analyzeHealthData(healthData);
    }
  }, [healthData]);

  return (
    <DashboardCustomizationProvider>
      <DashboardContent
        healthData={healthData}
        syncStatus={syncStatus}
        recentWorkouts={recentWorkouts}
        isLoading={isLoading}
        handleManualSync={handleManualSync}
        formatWorkoutDate={formatWorkoutDate}
        formatDuration={formatDuration}
        formatDate={formatDate}
        anomalies={anomalies}
        trends={trends}
        webSocketStatus={webSocketStatus}
        dismissAnomaly={dismissAnomaly}
      />
    </DashboardCustomizationProvider>
  );
};

// Export the component
export default HealthDashboard;
