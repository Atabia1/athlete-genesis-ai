
/**
 * Offline Workouts Display Component
 * 
 * This component displays workouts that are available offline
 * and provides functionality to sync them when back online.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Dumbbell
} from 'lucide-react';
import { useNetworkStatus } from "@/hooks/use-network-status";
import { Skeleton } from "@/components/ui/skeleton";
import { Workout, WorkoutGoal } from '@/types/workout';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// Define ConnectionQuality type 
type ConnectionQuality = 'offline' | 'poor' | 'good' | 'excellent' | 'captive-portal' | 'unknown';

interface OfflineWorkoutsDisplayProps {
  /** Cached workouts available offline */
  offlineWorkouts: Workout[];
  
  /** Whether the component is loading data */
  isLoading?: boolean;
  
  /** Optional custom height for the component */
  maxHeight?: string;
  
  /** Function to sync workouts when back online */
  syncWorkouts?: () => Promise<void>;
  
  /** Function to remove a workout from offline storage */
  removeOfflineWorkout?: (id: string) => void;
}

/**
 * OfflineWorkoutsDisplay Component
 */
const OfflineWorkoutsDisplay = ({
  offlineWorkouts = [],
  isLoading = false,
  maxHeight = "500px",
  syncWorkouts,
  removeOfflineWorkout
}: OfflineWorkoutsDisplayProps) => {
  const { isOnline } = useNetworkStatus();
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [syncSuccess, setSyncSuccess] = useState<Record<string, boolean>>({});
  const [syncError, setSyncError] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  
  // For UI display - simulate connection quality
  const displayConnectionQuality: ConnectionQuality = isOnline ? 'good' : 'offline';
  
  // Handle sync of a single workout
  const handleSyncWorkout = async (workoutId: string) => {
    if (!isOnline) return;
    
    try {
      setSyncing(prev => ({ ...prev, [workoutId]: true }));
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If we have a syncWorkouts function from props, call it
      if (syncWorkouts) {
        await syncWorkouts();
      }
      
      setSyncSuccess(prev => ({ ...prev, [workoutId]: true }));
      setSyncing(prev => ({ ...prev, [workoutId]: false }));
      
      // Remove from local storage after successful sync
      if (removeOfflineWorkout) {
        setTimeout(() => {
          removeOfflineWorkout(workoutId);
          setSyncSuccess(prev => ({ ...prev, [workoutId]: false }));
        }, 2000);
      }
    } catch (error) {
      console.error('Error syncing workout:', error);
      setSyncError(prev => ({ ...prev, [workoutId]: true }));
      setSyncing(prev => ({ ...prev, [workoutId]: false }));
      
      // Clear error after timeout
      setTimeout(() => {
        setSyncError(prev => ({ ...prev, [workoutId]: false }));
      }, 3000);
    }
  };
  
  // Get display status for a workout
  const getWorkoutStatus = (workout: Workout) => {
    if (syncSuccess[workout.id]) {
      return "Synced successfully";
    }
    if (syncError[workout.id]) {
      return "Sync failed";
    }
    if (syncing[workout.id]) {
      return "Syncing...";
    }
    return "Stored offline";
  };
  
  // Get badge variant based on workout status
  const getStatusBadgeVariant = (workout: Workout): "outline" | "secondary" | "destructive" => {
    if (syncSuccess[workout.id]) {
      return "outline"; // success
    }
    if (syncError[workout.id]) {
      return "destructive"; // error
    }
    return "secondary"; // default
  };
  
  // Get icon based on workout status
  const getStatusIcon = (workout: Workout) => {
    if (syncSuccess[workout.id]) {
      return <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-1" />;
    }
    if (syncError[workout.id]) {
      return <AlertTriangle className="h-3.5 w-3.5 text-red-500 ml-1" />;
    }
    if (syncing[workout.id]) {
      return <Clock className="h-3.5 w-3.5 text-blue-500 animate-pulse ml-1" />;
    }
    return <Download className="h-3.5 w-3.5 ml-1" />;
  };
  
  // Format date string for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get connection status text and color
  const getConnectionInfo = () => {
    // Handle connection quality display
    switch (displayConnectionQuality) {
      case 'offline':
        return {
          text: 'You are offline',
          description: 'Workouts will sync automatically when your connection is restored',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100',
          icon: <WifiOff className="h-5 w-5 text-red-500" />
        };
      case 'poor':
        return {
          text: 'Poor connection',
          description: 'Syncing may be slower than usual',
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100',
          icon: <Wifi className="h-5 w-5 text-amber-500" />
        };
      case 'good':
      case 'excellent':
        return {
          text: 'Connected',
          description: 'Your workouts can be synced to the cloud',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100',
          icon: <Wifi className="h-5 w-5 text-green-500" />
        };
      case 'captive-portal':
        return {
          text: 'Captive portal detected',
          description: 'You need to sign in to this network before syncing',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100',
          icon: <AlertTriangle className="h-5 w-5 text-blue-500" />
        };
      default:
        return {
          text: 'Connection status unknown',
          description: 'Check your network connection',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-100',
          icon: <Wifi className="h-5 w-5 text-gray-500" />
        };
    }
  };
  
  const connectionInfo = getConnectionInfo();
  const displayedWorkouts = showAll ? offlineWorkouts : offlineWorkouts.slice(0, 3);
  
  // Format workout goals for display
  const formatGoals = (goals: WorkoutGoal[]) => {
    if (!goals || goals.length === 0) return null;
    
    return (
      <div className="mt-3 space-y-2">
        <h4 className="text-xs font-medium text-gray-500">Workout Goals:</h4>
        <div className="space-y-2">
          {goals.map((goal: any, index: number) => (
            <div key={index} className="flex items-center">
              <div className="w-full">
                <div className="flex justify-between items-center text-xs">
                  <span>{goal.name}</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-1 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Offline Workouts</CardTitle>
          <CardDescription>Workouts available when offline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-primary" />
            <div>
              <CardTitle>Offline Workouts</CardTitle>
              <CardDescription>Workouts available when offline</CardDescription>
            </div>
          </div>
          <Badge variant={isOnline ? "outline" : "secondary"} className="ml-2">
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={`${connectionInfo.bgColor} border ${connectionInfo.borderColor}`}>
          <div className="flex items-center">
            {connectionInfo.icon}
            <div className="ml-3">
              <AlertTitle className={connectionInfo.color}>{connectionInfo.text}</AlertTitle>
              <AlertDescription>{connectionInfo.description}</AlertDescription>
            </div>
          </div>
        </Alert>
        
        {offlineWorkouts.length === 0 ? (
          <div className="text-center py-8">
            <Download className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-600">No Offline Workouts</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
              When you save workouts for offline use, they will appear here
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className={`h-[${maxHeight}]`} type="always">
              <div className="space-y-4 pr-4">
                {displayedWorkouts.map(workout => (
                  <div 
                    key={workout.id} 
                    className={`border rounded-lg p-4 ${
                      syncSuccess[workout.id] ? 'bg-green-50 border-green-100' : 
                      syncError[workout.id] ? 'bg-red-50 border-red-100' : 
                      'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{workout.title}</h3>
                        <p className="text-gray-500 text-sm mt-0.5">{formatDate(workout.date)}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(workout)} className="flex items-center">
                        <span>{getWorkoutStatus(workout)}</span>
                        {getStatusIcon(workout)}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <p><span className="font-medium">Duration:</span> {workout.duration}</p>
                      <p><span className="font-medium">Type:</span> {workout.type}</p>
                    </div>
                    
                    {formatGoals(workout.goals)}
                    
                    {!syncSuccess[workout.id] && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSyncWorkout(workout.id)}
                          disabled={!isOnline || syncing[workout.id]}
                          className={syncing[workout.id] ? 'opacity-70' : ''}
                        >
                          {syncing[workout.id] ? (
                            <>
                              <Clock className="mr-1 h-4 w-4 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <Download className="mr-1 h-4 w-4" />
                              Sync Now
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {offlineWorkouts.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `Show All (${offlineWorkouts.length})`}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineWorkoutsDisplay;
