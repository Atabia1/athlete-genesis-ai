
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell,
  Download,
  Play,
  Clock,
  Users
} from 'lucide-react';

const mockWorkouts = [
  {
    id: '1',
    title: 'Full Body Strength',
    description: 'Complete strength training workout',
    duration: '45 min',
    difficulty: 'Intermediate',
    exercises: 8,
    saved: true
  },
  {
    id: '2',
    title: 'Cardio HIIT',
    description: 'High-intensity interval training',
    duration: '30 min',
    difficulty: 'Advanced',
    exercises: 6,
    saved: false
  }
];

export default function OfflineWorkoutsDisplay() {
  return (
    <div className="space-y-6">
      {/* Saved Workouts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="mr-2 h-5 w-5" />
            Offline Workouts
          </CardTitle>
          <CardDescription>
            Workouts available when you're offline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockWorkouts.map((workout) => (
              <Card key={workout.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{workout.title}</h3>
                    {workout.saved && (
                      <Badge variant="secondary">Saved</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {workout.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {workout.exercises} exercises
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Play className="mr-1 h-3 w-3" />
                      Start
                    </Button>
                    {!workout.saved && (
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        Save
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
