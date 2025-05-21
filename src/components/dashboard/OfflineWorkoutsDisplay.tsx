
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OfflineWorkoutsProvider } from '@/context/OfflineWorkoutsContext';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { Workout, WorkoutGoal } from '@/types/workout';
import { RefreshCw } from 'lucide-react';

// Type definitions
type ConnectionQuality = 'offline' | 'poor' | 'good' | 'excellent' | 'captive-portal';

interface OfflineWorkoutDisplayProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * OfflineWorkoutsDisplay Component
 * 
 * Displays workouts that are available offline and provides synchronization functionality
 */
const OfflineWorkoutsDisplay: React.FC<OfflineWorkoutDisplayProps> = ({
  title = "Offline Workouts",
  description = "Access your workouts even when offline",
  className = ""
}) => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [displayConnectionQuality, setDisplayConnectionQuality] = useState<ConnectionQuality>('good');
  const { isOnline } = useNetworkStatus();

  // Load workouts from local storage on mount
  useEffect(() => {
    loadOfflineWorkouts();
    // Simulate connection quality check
    checkConnectionQuality();
  }, []);

  // Load workouts from local storage
  const loadOfflineWorkouts = () => {
    try {
      // In a real app, we would load from IndexedDB here
      // For now, we'll simulate with some example data
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Full Body Strength',
          title: 'Full Body Strength',
          description: 'Complete strength training workout for all major muscle groups',
          exercises: [],
          duration: 60,
          date: new Date().toISOString(),
          userId: 'user1',
          type: 'strength',
          goals: [
            { name: 'Strength', progress: 75 },
            { name: 'Muscle', progress: 60 }
          ] as unknown as WorkoutGoal[]
        },
        {
          id: '2',
          name: 'HIIT Cardio',
          title: 'HIIT Cardio',
          description: 'High-intensity interval training session',
          exercises: [],
          duration: 30,
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          userId: 'user1',
          type: 'cardio',
          goals: [
            { name: 'Endurance', progress: 85 },
            { name: 'Fat Loss', progress: 65 }
          ] as unknown as WorkoutGoal[]
        },
        {
          id: '3',
          name: 'Yoga Flow',
          title: 'Yoga Flow',
          description: 'Relaxing yoga session focusing on flexibility',
          exercises: [],
          duration: 45,
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          userId: 'user1',
          type: 'flexibility',
          goals: [
            { name: 'Flexibility', progress: 90 },
            { name: 'Recovery', progress: 80 }
          ] as unknown as WorkoutGoal[]
        }
      ];
      
      setWorkouts(mockWorkouts);
      
      // Set last synced time (mock data)
      const mockLastSynced = new Date(Date.now() - 3600000); // 1 hour ago
      setLastSynced(mockLastSynced);
    } catch (error) {
      console.error('Error loading offline workouts:', error);
    }
  };

  // Simulate syncing workouts to server
  const handleSync = async () => {
    if (!isOnline) {
      console.log('Cannot sync workouts while offline');
      return;
    }
    
    try {
      console.log('Syncing workouts...');
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would send the data to the server here
      // For now, just update the last synced time
      setLastSynced(new Date());
      
      console.log('Workouts synced successfully');
    } catch (error) {
      console.error('Error syncing workouts:', error);
    }
  };
  
  // Navigate to workout details
  const handleViewWorkout = (workoutId: string) => {
    navigate(`/workouts/${workoutId}`);
  };
  
  // Format the last synced date
  const formatLastSynced = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };
  
  // Simulate checking connection quality
  const checkConnectionQuality = async () => {
    // In a real app, we would check the connection quality here
    // For now, we'll just simulate different connection qualities
    
    const qualities: ConnectionQuality[] = ['offline', 'poor', 'good', 'excellent', 'captive-portal'];
    const randomIndex = Math.floor(Math.random() * qualities.length);
    const quality = isOnline ? qualities[randomIndex] : 'offline';
    
    setDisplayConnectionQuality(quality);
  };
  
  // Get connection quality display
  const getConnectionQualityDisplay = () => {
    switch (displayConnectionQuality) {
      case "poor":
      // Handle poor connection
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Poor Connection
          </Badge>
        );
      
      case "excellent":
      // Handle excellent connection
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Excellent Connection
          </Badge>
        );
      
      case "captive-portal":
      // Handle captive portal
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Captive Portal
          </Badge>
        );
      
      case "offline":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Offline
          </Badge>
        );
      
      case "good":
      default:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Good Connection
          </Badge>
        );
    }
  };
  
  return (
    <OfflineWorkoutsProvider>
      <Card className={className}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getConnectionQualityDisplay()}
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSync}
                disabled={!isOnline}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500 mb-4">
            Last synced: {formatLastSynced(lastSynced)}
          </div>
          
          {workouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No offline workouts available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map(workout => (
                <Card key={workout.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-lg">{String(workout.title)}</h3>
                        <Badge variant="outline">{String(workout.date)}</Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {workout.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="bg-gray-100">
                            {workout.duration} min
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {String(workout.type)}
                          </Badge>
                        </div>
                        
                        <Button 
                          size="sm" 
                          onClick={() => handleViewWorkout(workout.id)}
                        >
                          View
                        </Button>
                      </div>
                      
                      {workout.goals && workout.goals.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Goal Progress</p>
                          <div className="space-y-1">
                            {(workout.goals as unknown as Array<{name: string, progress: number}>).map((goal, index) => (
                              <div key={index} className="flex items-center">
                                <span className="text-xs w-20">{goal.name}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full" 
                                    style={{ width: `${goal.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs ml-2">{goal.progress}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {workouts.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline">View All Offline Workouts</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </OfflineWorkoutsProvider>
  );
};

export default OfflineWorkoutsDisplay;
