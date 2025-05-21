
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Button,
  Badge,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Alert,
  AlertTitle,
  AlertDescription
} from '@/components/ui/card';
import { Workout, WorkoutGoal } from '@/types/workout';
import { 
  Clock, 
  Calendar, 
  ArrowUpFromLine, 
  Download, 
  Wifi, 
  WifiOff, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';

// Connection quality type
type ConnectionQuality = 'offline' | 'poor' | 'good' | 'excellent' | 'captive-portal';

// Sample offline workouts (would normally come from IndexedDB or similar)
const sampleOfflineWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    title: 'Full Body Strength Session',
    type: 'strength',
    description: 'Complete full body workout targeting all major muscle groups',
    exercises: [
      {
        id: 'e1',
        name: 'Squats',
        description: 'Bodyweight squats',
        sets: 3,
        reps: 15
      },
      {
        id: 'e2',
        name: 'Push-ups',
        description: 'Standard push-ups',
        sets: 3,
        reps: 12
      }
    ],
    duration: 45,
    caloriesBurned: 320,
    date: '2023-06-01',
    userId: 'user123',
    goals: [WorkoutGoal.STRENGTH, WorkoutGoal.HYPERTROPHY]
  },
  {
    id: '2',
    name: 'Morning Run',
    title: 'Morning Cardio Run',
    type: 'cardio',
    description: '5K morning run at moderate pace',
    exercises: [
      {
        id: 'e3',
        name: 'Running',
        description: '5K run',
        duration: 30
      }
    ],
    duration: 30,
    caloriesBurned: 250,
    date: '2023-06-02',
    userId: 'user123',
    goals: [WorkoutGoal.ENDURANCE]
  },
  {
    id: '3',
    name: 'HIIT Session',
    title: 'High Intensity Circuit',
    type: 'hiit',
    description: 'High intensity interval training with minimal rest',
    exercises: [
      {
        id: 'e4',
        name: 'Burpees',
        description: 'Full burpees',
        sets: 4,
        reps: 10
      },
      {
        id: 'e5',
        name: 'Mountain Climbers',
        description: 'Mountain climbers',
        duration: 45,
        sets: 4
      }
    ],
    duration: 25,
    caloriesBurned: 280,
    date: '2023-06-03',
    userId: 'user123',
    goals: [WorkoutGoal.WEIGHT_LOSS, WorkoutGoal.ENDURANCE]
  }
];

/**
 * OfflineWorkoutsDisplay Component
 * 
 * Displays workouts that have been stored offline and manages their sync status
 */
const OfflineWorkoutsDisplay = ({ className = '' }) => {
  const [offlineWorkouts, setOfflineWorkouts] = useState<Workout[]>(sampleOfflineWorkouts);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncProgress, setSyncProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionQuality>('good');
  const [activeTab, setActiveTab] = useState('workouts');
  
  // Simulate checking connection status
  useEffect(() => {
    checkConnectionStatus();
    
    // Set up periodic connection check
    const intervalId = setInterval(checkConnectionStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Simulate checking connection status
  const checkConnectionStatus = () => {
    // In a real app, this would use the Network Information API or similar
    if (!navigator.onLine) {
      setConnectionStatus('offline');
      return;
    }
    
    // Simulate different connection qualities
    const qualities: ConnectionQuality[] = ['poor', 'good', 'excellent', 'captive-portal'];
    const randomQuality = qualities[Math.floor(Math.random() * 3)]; // Skip captive-portal most times
    setConnectionStatus(randomQuality);
  };
  
  // Handle connection status changes
  const handleConnectionChange = () => {
    checkConnectionStatus();
  };
  
  // Calculate sync eligibility based on connection
  const canSync = () => {
    switch (connectionStatus) {
      case "poor":
      // Handle poor connection
        return true; // Allow sync but warn user
      case "offline":
        return false;
      case "excellent":
      // Handle excellent connection
        return true;
      case "captive-portal":
      // Handle captive portal
        return false; // Captive portal might cause sync issues
      default:
        return true;
    }
  };
  
  // Start sync process
  const startSync = () => {
    if (!canSync()) {
      return;
    }
    
    setSyncStatus('syncing');
    setSyncProgress(0);
    
    // Simulate sync process with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate potential errors
        if (Math.random() > 0.9) {
          setSyncStatus('error');
        } else {
          setSyncStatus('success');
          // In a real app, we'd clear the synced workouts or mark them as synced
        }
      }
      setSyncProgress(progress);
    }, 300);
  };
  
  // Retry failed sync
  const retrySync = () => {
    setSyncStatus('idle');
    setTimeout(() => startSync(), 500);
  };
  
  // Get connection status display
  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case 'offline':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          label: 'Offline',
          color: 'text-red-500 bg-red-50'
        };
      case 'poor':
        return {
          icon: <Wifi className="h-4 w-4" />,
          label: 'Poor Connection',
          color: 'text-orange-500 bg-orange-50'
        };
      case 'good':
        return {
          icon: <Wifi className="h-4 w-4" />,
          label: 'Connected',
          color: 'text-green-500 bg-green-50'
        };
      case 'excellent':
        return {
          icon: <Wifi className="h-4 w-4" />,
          label: 'Excellent',
          color: 'text-green-600 bg-green-50'
        };
      case 'captive-portal':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Captive Portal',
          color: 'text-amber-500 bg-amber-50'
        };
      default:
        return {
          icon: <Wifi className="h-4 w-4" />,
          label: 'Unknown',
          color: 'text-gray-500 bg-gray-50'
        };
    }
  };
  
  // Get sync status display
  const getSyncStatusDisplay = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: <Loader2 className="h-5 w-5 animate-spin" />,
          label: 'Syncing...',
          color: 'text-blue-500'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          label: 'Sync Complete',
          color: 'text-green-500'
        };
      case 'error':
        return {
          icon: <XCircle className="h-5 w-5" />,
          label: 'Sync Failed',
          color: 'text-red-500'
        };
      default:
        return {
          icon: <ArrowUpFromLine className="h-5 w-5" />,
          label: 'Ready to Sync',
          color: 'text-gray-500'
        };
    }
  };
  
  // Format date for display
  const formatDate = (date: string | Date) => {
    return new Date(String(date)).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get badge color for workout type
  const getWorkoutTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-blue-100 text-blue-800';
      case 'cardio':
        return 'bg-green-100 text-green-800';
      case 'hiit':
        return 'bg-purple-100 text-purple-800';
      case 'flexibility':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get badge for workout goal
  const getGoalBadge = (goal: WorkoutGoal) => {
    switch (goal) {
      case WorkoutGoal.STRENGTH:
        return 'bg-blue-100 text-blue-800';
      case WorkoutGoal.HYPERTROPHY:
        return 'bg-indigo-100 text-indigo-800';
      case WorkoutGoal.ENDURANCE:
        return 'bg-green-100 text-green-800';
      case WorkoutGoal.WEIGHT_LOSS:
        return 'bg-orange-100 text-orange-800';
      case WorkoutGoal.GENERAL_FITNESS:
        return 'bg-cyan-100 text-cyan-800';
      case WorkoutGoal.SPORT_SPECIFIC:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 text-blue-500 mr-2" />
              Offline Workouts
            </CardTitle>
            <CardDescription>Manage your offline workout data</CardDescription>
          </div>
          
          <Badge
            variant="outline"
            className={`${getConnectionStatusDisplay().color} flex items-center gap-1`}
          >
            {getConnectionStatusDisplay().icon}
            <span>{getConnectionStatusDisplay().label}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workouts">Stored Workouts</TabsTrigger>
            <TabsTrigger value="sync">Sync Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workouts" className="space-y-4 pt-4">
            {offlineWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">No offline workouts</h3>
                <p className="text-gray-500 mt-1">
                  You don't have any workouts stored for offline access.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {offlineWorkouts.map(workout => (
                  <Card key={workout.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="border-l-4 border-blue-500 p-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{workout.title}</h3>
                          <Badge variant="outline" className={getWorkoutTypeBadgeColor(workout.type || '')}>
                            {workout.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(workout.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {workout.duration} min
                          </div>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-1">
                          {workout.goals && workout.goals.map((goal, index) => (
                            <Badge key={index} variant="outline" className={getGoalBadge(goal)}>
                              {goal.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              {offlineWorkouts.length} workouts stored offline
            </div>
          </TabsContent>
          
          <TabsContent value="sync" className="space-y-4 pt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Sync Status</div>
                <div className={`text-sm font-medium ${getSyncStatusDisplay().color}`}>
                  {getSyncStatusDisplay().label}
                </div>
              </div>
              
              {syncStatus === 'syncing' && (
                <div className="space-y-1">
                  <Progress value={syncProgress} className="h-2" />
                  <div className="text-xs text-gray-500 text-right">{Math.round(syncProgress)}%</div>
                </div>
              )}
              
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Workouts</span>
                  <span className="text-sm font-medium">{offlineWorkouts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Connection</span>
                  <span className={`text-sm font-medium ${getConnectionStatusDisplay().color.split(' ')[0]}`}>
                    {getConnectionStatusDisplay().label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Synced</span>
                  <span className="text-sm font-medium">1 hour ago</span>
                </div>
              </div>
            </div>
            
            {connectionStatus === 'offline' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No Connection</AlertTitle>
                <AlertDescription>
                  You're currently offline. Please reconnect to the internet to sync your workout data.
                </AlertDescription>
              </Alert>
            )}
            
            {syncStatus === 'error' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Sync Failed</AlertTitle>
                <AlertDescription>
                  There was an issue syncing your workout data. Please try again.
                </AlertDescription>
              </Alert>
            )}
            
            {syncStatus === 'success' && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Sync Complete</AlertTitle>
                <AlertDescription>
                  All your offline workouts have been successfully synchronized.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 border-t pt-4">
        <Button 
          variant="outline" 
          onClick={handleConnectionChange}
        >
          Check Connection
        </Button>
        <Button
          onClick={syncStatus === 'error' ? retrySync : startSync}
          disabled={!canSync() || syncStatus === 'syncing' || syncStatus === 'success' || offlineWorkouts.length === 0}
          className="flex items-center gap-2"
        >
          {syncStatus === 'error' ? (
            <>Retry Sync</>
          ) : syncStatus === 'syncing' ? (
            <>Syncing...</>
          ) : syncStatus === 'success' ? (
            <>Synced</>
          ) : (
            <>Sync Now</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfflineWorkoutsDisplay;
