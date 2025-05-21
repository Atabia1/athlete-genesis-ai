/**
 * OfflineWorkoutsDisplay: Component for displaying and managing offline workouts
 *
 * This component provides a user interface for:
 * 1. Viewing available offline workout templates
 * 2. Accessing previously saved workout plans
 * 3. Saving the current workout plan for offline use
 * 4. Managing saved workouts (viewing, selecting, deleting)
 *
 * It's designed to work seamlessly with the OfflineWorkoutsContext to provide
 * users with workout content even when they have no internet connection.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { OfflineContentBadge } from "@/components/ui/offline-content-badge";
import {
  Wifi,
  WifiOff,
  Download,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Trash2,
  Check,
  Info,
  HardDrive,
  AlertTriangle,
  WifiLow,
  Zap,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useOfflineWorkouts, WorkoutTemplate, WorkoutDayTemplate } from '@/context/OfflineWorkoutsContext';
import { useNetworkStatus, ConnectionQuality } from '@/hooks/use-network-status';
import { usePlan } from '@/context/PlanContext';
import { toast } from '@/components/ui/use-toast';
import { dbService } from '@/services/indexeddb-service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger } from "@/components/ui/alert-dialog";

type ConnectionQuality = 'offline' | 'poor' | 'good' | 'excellent' | 'captive-portal' | 'unknown';

const OfflineWorkoutsDisplay = () => {
  const {
    offlineWorkouts,
    savedWorkouts,
    currentOfflineWorkout,
    isLoading,
    saveCurrentPlanForOffline,
    selectOfflineWorkout,
    deleteSavedWorkout,
    deleteMultipleSavedWorkouts,
    clearAllSavedWorkouts
  } = useOfflineWorkouts();

  const { isOnline, checkNetworkReachability } = useNetworkStatus();
  const { workoutPlan, setWorkoutPlan } = usePlan();

  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [storageSize, setStorageSize] = useState<number | null>(null);
  const [dbInfo, setDbInfo] = useState<{ name: string; version: number | null; objectStores: string[] } | null>(null);

  // Get database information
  useEffect(() => {
    const getDatabaseInfo = async () => {
      try {
        const info = await dbService.getDatabaseInfo();
        setStorageSize(info.size);
        setDbInfo({
          name: info.name,
          version: info.version,
          objectStores: info.objectStores
        });
      } catch (error) {
        console.error('Error getting database info:', error);
      }
    };

    getDatabaseInfo();
  }, []);

  /**
   * Toggle the expanded state of a workout day
   */
  const toggleDay = (day: string) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  /**
   * Handle saving the current workout plan for offline use
   */
  const handleSaveForOffline = async () => {
    try {
      await saveCurrentPlanForOffline();
      // Refresh database info after saving
      await refreshDatabaseInfo();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workout for offline use",
        variant: "destructive" });
    }
  };

  /**
   * Handle selecting an offline workout
   */
  const handleSelectWorkout = (workout: WorkoutTemplate) => {
    selectOfflineWorkout(workout.id);
    setWorkoutPlan(workout);
    toast({
      title: "Workout Selected",
      description: `Now using: ${workout.name}` });
  };

  /**
   * Refresh database information
   */
  const refreshDatabaseInfo = async () => {
    try {
      const info = await dbService.getDatabaseInfo();
      setStorageSize(info.size);
      setDbInfo({
        name: info.name,
        version: info.version,
        objectStores: info.objectStores
      });
    } catch (error) {
      console.error('Error refreshing database info:', error);
    }
  };

  /**
   * Handle deleting a saved workout
   */
  const handleDeleteWorkout = async () => {
    if (!workoutToDelete) return;

    await deleteSavedWorkout(workoutToDelete);
    setWorkoutToDelete(null);

    // Refresh database info after deletion
    await refreshDatabaseInfo();
  };

  /**
   * Handle clearing all saved workouts
   */
  const handleClearAllWorkouts = async () => {
    await clearAllSavedWorkouts();

    // Refresh database info after clearing
    await refreshDatabaseInfo();

    // Clear selected workouts
    setSelectedWorkouts([]);
  };

  /**
   * Handle deleting multiple selected workouts
   */
  const handleDeleteSelectedWorkouts = async () => {
    if (selectedWorkouts.length === 0) return;

    await deleteMultipleSavedWorkouts(selectedWorkouts);

    // Refresh database info after deletion
    await refreshDatabaseInfo();

    // Clear selection
    setSelectedWorkouts([]);
  };

  /**
   * Toggle workout selection
   */
  const toggleWorkoutSelection = (id: string) => {
    if (selectedWorkouts.includes(id)) {
      setSelectedWorkouts(selectedWorkouts.filter(workoutId => workoutId !== id));
    } else {
      setSelectedWorkouts([...selectedWorkouts, id]);
    }
  };

  /**
   * Toggle selection of all saved workouts
   */
  const toggleSelectAll = () => {
    if (selectedWorkouts.length === savedWorkouts.length) {
      // If all are selected, deselect all
      setSelectedWorkouts([]);
    } else {
      // Otherwise, select all
      setSelectedWorkouts(savedWorkouts.map(workout => workout.id));
    }
  };

  /**
   * Render a workout day with exercises
   */
  const renderWorkoutDay = (day: WorkoutDayTemplate) => {
    return (
      <div key={day.day} className="border rounded-lg overflow-hidden mb-4">
        <div
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
          onClick={() => toggleDay(day.day)}
        >
          <div>
            <h3 className="font-medium">{day.day}</h3>
            <p className="text-sm text-gray-600">{day.focus}</p>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-athleteBlue-100 text-athleteBlue-800 px-2 py-1 rounded-full mr-2">
              {day.duration}
            </span>
            {expandedDay === day.day ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {expandedDay === day.day && (
          <div className="p-4 border-t">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Warm-up</h4>
              <p className="text-sm">{day.warmup}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Exercises</h4>
              <div className="space-y-3">
                {day.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 rounded-md border bg-white border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">{exercise.name}</h5>
                        <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {exercise.sets} × {exercise.reps}
                        </div>
                      </div>

                      <div className="mt-1 text-sm text-gray-600">
                        Rest: {exercise.rest}
                      </div>

                      {exercise.notes && (
                        <div className="mt-2 flex items-start text-xs text-gray-500">
                          <Info className="h-3 w-3 mr-1 mt-0.5" />
                          <span>{exercise.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Cool-down</h4>
              <p className="text-sm">{day.cooldown}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Format a date string for display
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  /**
   * Get the appropriate icon based on connection quality
   */
  const getConnectionIcon = (quality: ConnectionQuality) => {
    switch (quality) {
      case 'excellent':
        return <Zap className="h-5 w-5 mr-2 text-green-600" />;
      case 'good':
        return <Wifi className="h-5 w-5 mr-2 text-green-600" />;
      case 'poor':
        return <WifiLow className="h-5 w-5 mr-2 text-yellow-600" />;
      case 'captive-portal':
        return <Lock className="h-5 w-5 mr-2 text-purple-600" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 mr-2 text-orange-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 mr-2 text-gray-600" />;
    }
  };

  /**
   * Render a workout card for selection
   */
  const renderWorkoutCard = (workout: WorkoutTemplate, isSaved: boolean = false) => {
    const isSelected = selectedWorkouts.includes(workout.id);

    return (
      <Card
        key={workout.id}
        className={`mb-4 relative ${isSelected ? 'border-athleteBlue-400 bg-athleteBlue-50' : ''}`}
      >
        {!isOnline && <OfflineContentBadge contentType="workout" position="top-right" />}
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              {isSaved && (
                <div
                  className="mr-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWorkoutSelection(workout.id);
                  }}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-athleteBlue-500 border-athleteBlue-500' : 'border-gray-300'}`}>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
              )}
              <div>
                <CardTitle>{workout.name}</CardTitle>
                <CardDescription>{workout.description}</CardDescription>
                {workout.createdAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    Saved on {formatDate(workout.createdAt)}
                  </div>
                )}
              </div>
            </div>
            <Badge className="bg-athleteBlue-100 text-athleteBlue-800">
              {workout.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {workout.goals.map((goal, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50">
                {goal}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Equipment:</strong> {workout.equipment.join(', ')}</p>
            <p><strong>Workout Days:</strong> {workout.weeklyPlan.length}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => handleSelectWorkout(workout)}
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            Use This Workout
          </Button>

          {isSaved && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setWorkoutToDelete(workout.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Saved Workout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this saved workout? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setWorkoutToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteWorkout} className="bg-red-500 hover:bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <WifiOff className="h-5 w-5 mr-2 text-athleteBlue-600" />
            Offline Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <p>Loading offline workouts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {getConnectionIcon(connectionQuality)}
              Offline Workouts
            </CardTitle>
            <CardDescription>
              {isOnline
                ? "Access these workouts when you don't have an internet connection"
                : "You're currently offline. Using locally saved workouts."}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {!isOnline && (
              <OfflineIndicator
                variant="badge"
                message="You are currently offline. All changes will be saved locally."
              />
            )}
            {isOnline && workoutPlan && connectionQuality !== 'captive-portal' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveForOffline}
                className="text-athleteBlue-600 border-athleteBlue-200 hover:bg-athleteBlue-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Save Current Plan Offline
              </Button>
            )}

            {connectionQuality === 'captive-portal' && (
              <div className="text-purple-600 text-sm flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                <span>WiFi login required</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedWorkouts.length})</TabsTrigger>
            <TabsTrigger value="templates">Templates ({offlineWorkouts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            {currentOfflineWorkout ? (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold">{currentOfflineWorkout.name}</h2>
                    {!isOnline && (
                      <OfflineIndicator
                        variant="badge"
                        featureSpecific={true}
                        featureName="This workout"
                      />
                    )}
                  </div>
                  <p className="text-gray-600">{currentOfflineWorkout.description}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-athleteBlue-100 text-athleteBlue-800">
                      {currentOfflineWorkout.level}
                    </Badge>
                    {currentOfflineWorkout.goals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Weekly Plan</h3>
                  {currentOfflineWorkout.weeklyPlan.map(renderWorkoutDay)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Dumbbell className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Workout Selected</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  Select a workout from the "Saved" or "Templates" tab to view it here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            {savedWorkouts.length > 0 ? (
              <div>
                {/* Storage usage indicator */}
                {storageSize && dbInfo && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <HardDrive className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">Storage used: {(storageSize / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Database: {dbInfo.name} (v{dbInfo.version || 'unknown'})
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleSelectAll}
                          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        >
                          {selectedWorkouts.length === savedWorkouts.length ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Deselect All
                            </>
                          ) : (
                            <>Select All</>
                          )}
                        </Button>

                        {selectedWorkouts.length > 0 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete Selected ({selectedWorkouts.length})
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Selected Workouts</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {selectedWorkouts.length} selected workout{selectedWorkouts.length !== 1 ? 's' : ''}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteSelectedWorkouts} className="bg-red-500 hover:bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Clear All
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Clear All Saved Workouts</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete all saved workouts? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleClearAllWorkouts} className="bg-red-500 hover:bg-red-600">
                                Clear All
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                )}

                {savedWorkouts.map(workout => renderWorkoutCard(workout, true))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Download className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Saved Workouts</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  {isOnline
                    ? "Save your current workout plan for offline access by clicking the 'Save Current Plan Offline' button."
                    : "You don't have any saved workouts. Connect to the internet to save workouts for offline use."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <div>
              {offlineWorkouts.map(workout => renderWorkoutCard(workout))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OfflineWorkoutsDisplay;
