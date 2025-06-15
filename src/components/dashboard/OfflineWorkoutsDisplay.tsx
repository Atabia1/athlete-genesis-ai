
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Upload,
  Wifi,
  WifiOff,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface OfflineWorkout {
  id: string;
  name: string;
  duration: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }>;
  completed: boolean;
  dateDownloaded: string;
  size: string;
}

const OfflineWorkoutsDisplay = () => {
  const [offlineWorkouts] = useState<OfflineWorkout[]>([
    {
      id: '1',
      name: 'Upper Body Strength',
      duration: 45,
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 12 },
        { name: 'Pull-ups', sets: 3, reps: 8 },
        { name: 'Dumbbell Press', sets: 3, reps: 10, weight: 25 },
      ],
      completed: false,
      dateDownloaded: '2024-01-15',
      size: '2.3 MB',
    },
    {
      id: '2',
      name: 'Lower Body Power',
      duration: 50,
      exercises: [
        { name: 'Squats', sets: 4, reps: 10, weight: 60 },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: 80 },
        { name: 'Lunges', sets: 3, reps: 12, weight: 20 },
      ],
      completed: true,
      dateDownloaded: '2024-01-10',
      size: '2.1 MB',
    },
    {
      id: '3',
      name: 'Core Stability',
      duration: 30,
      exercises: [
        { name: 'Planks', sets: 3, reps: 60 },
        { name: 'Russian Twists', sets: 3, reps: 20 },
        { name: 'Mountain Climbers', sets: 3, reps: 30 },
      ],
      completed: false,
      dateDownloaded: '2024-01-18',
      size: '1.8 MB',
    },
  ]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSyncWorkouts = () => {
    console.log('Syncing workouts...');
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                Offline Workouts
              </CardTitle>
              <CardDescription>
                {isOnline ? 'Connected' : 'Offline'} - Download workouts for offline access
              </CardDescription>
            </div>
            <Button
              onClick={handleSyncWorkouts}
              disabled={!isOnline}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Sync Data
            </Button>
          </div>
        </CardHeader>

        {syncProgress > 0 && syncProgress < 100 && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Syncing workouts...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} />
            </div>
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Offline</TabsTrigger>
          <TabsTrigger value="download">Download More</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {offlineWorkouts.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No offline workouts</AlertTitle>
              <AlertDescription>
                Download workouts to access them when you're offline.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {offlineWorkouts.map((workout) => (
                <Card key={workout.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{workout.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {workout.duration} min
                          </span>
                          <span>{workout.exercises.length} exercises</span>
                          <Badge variant={workout.completed ? 'default' : 'secondary'}>
                            {workout.completed ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            {workout.completed ? 'Completed' : 'Ready'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant={workout.completed ? 'outline' : 'default'}
                        size="sm"
                      >
                        {workout.completed ? 'View' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Alert>
            <Download className="h-4 w-4" />
            <AlertTitle>Download for Offline Access</AlertTitle>
            <AlertDescription>
              Select workouts to download and access without an internet connection.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Download interface coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfflineWorkoutsDisplay;
