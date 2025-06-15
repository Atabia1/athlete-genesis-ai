import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Info, Minus, Plus } from "lucide-react";

interface WorkoutSet {
  weight: string;
  reps: string;
  rpe: number;
  completed: boolean;
}

interface ExerciseLog {
  name: string;
  sets: WorkoutSet[];
  notes: string;
  skipped: boolean;
}

interface WorkoutLoggerProps {
  workout: any;
}

const WorkoutLogger = ({ workout }: WorkoutLoggerProps) => {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(
    (workout.exercises || []).map((exercise: any) => ({
      name: exercise.name,
      sets: Array(parseInt(exercise.sets?.toString() || '1')).fill({
        weight: (exercise as any).weight || "",
        reps: exercise.reps?.toString()?.split('-')?.[0] || "",
        rpe: 7,
        completed: false
      }),
      notes: "",
      skipped: false
    }))
  );

  const [duration, setDuration] = useState("60");
  const [overallNotes, setOverallNotes] = useState("");

  const updateExerciseSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: any) => {
    setExerciseLogs(prev => {
      const newLogs = [...prev];
      newLogs[exerciseIndex].sets[setIndex] = {
        ...newLogs[exerciseIndex].sets[setIndex],
        [field]: value
      };
      return newLogs;
    });
  };

  const updateExerciseNotes = (exerciseIndex: number, notes: string) => {
    setExerciseLogs(prev => {
      const newLogs = [...prev];
      newLogs[exerciseIndex].notes = notes;
      return newLogs;
    });
  };

  const toggleSkipped = (exerciseIndex: number) => {
    setExerciseLogs(prev => {
      const newLogs = [...prev];
      newLogs[exerciseIndex].skipped = !newLogs[exerciseIndex].skipped;
      return newLogs;
    });
  };

  const addSet = (exerciseIndex: number) => {
    setExerciseLogs(prev => {
      const newLogs = [...prev];
      const lastSet = newLogs[exerciseIndex].sets[newLogs[exerciseIndex].sets.length - 1];
      newLogs[exerciseIndex].sets.push({ ...lastSet });
      return newLogs;
    });
  };

  const removeSet = (exerciseIndex: number) => {
    setExerciseLogs(prev => {
      const newLogs = [...prev];
      if (newLogs[exerciseIndex].sets.length > 1) {
        newLogs[exerciseIndex].sets.pop();
      }
      return newLogs;
    });
  };

  const handleSubmit = () => {
    // Here you would send the data to your backend or context
    // For now, let's just show a toast notification
    console.log({
      workout: (workout as any).day || 'Today\'s Workout',
      exercises: exerciseLogs,
      duration,
      overallNotes,
      date: new Date().toISOString()
    });

    toast({
      title: "Workout logged successfully!",
      description: "Your workout has been saved.",
    });
  };

  return (
    <div className="py-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">{(workout as any).day || 'Today\'s Workout'} - {(workout as any).focus || 'Workout'}</h3>
          <div className="mb-4">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-6">
          {exerciseLogs.map((exercise, exerciseIndex) => (
            <Card key={exerciseIndex} className={`p-4 ${exercise.skipped ? 'bg-gray-50' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">{exercise.name}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSkipped(exerciseIndex)}
                >
                  {exercise.skipped ? 'Unskip' : 'Skip'}
                </Button>
              </div>

              {!exercise.skipped ? (
                <>
                  <div className="space-y-3 mb-3">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Weight</Label>
                          <Input
                            type="number"
                            placeholder="lb/kg"
                            value={set.weight}
                            onChange={e => updateExerciseSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Reps</Label>
                          <Input
                            type="number"
                            value={set.reps}
                            onChange={e => updateExerciseSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs flex items-center">
                            RPE
                            <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                          </Label>
                          <Select
                            value={set.rpe.toString()}
                            onValueChange={value => updateExerciseSet(exerciseIndex, setIndex, 'rpe', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="RPE" />
                            </SelectTrigger>
                            <SelectContent>
                              {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(value => (
                                <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addSet(exerciseIndex)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Set
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSet(exerciseIndex)}
                      className="w-full"
                      disabled={exercise.sets.length <= 1}
                    >
                      <Minus className="h-4 w-4 mr-1" /> Remove Set
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground italic mb-3">
                  Exercise skipped
                </div>
              )}

              <div>
                <Label htmlFor={`notes-${exerciseIndex}`}>Notes</Label>
                <Textarea
                  id={`notes-${exerciseIndex}`}
                  placeholder="How did it feel? Any adjustments?"
                  value={exercise.notes}
                  onChange={e => updateExerciseNotes(exerciseIndex, e.target.value)}
                  className="mt-1"
                />
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Label htmlFor="overall-notes">Overall Notes</Label>
          <Textarea
            id="overall-notes"
            placeholder="How was the workout overall? Energy level, etc."
            value={overallNotes}
            onChange={e => setOverallNotes(e.target.value)}
            className="mt-1"
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Save Workout Log
        </Button>
      </div>
    </div>
  );
};

export default WorkoutLogger;
