
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Activity, 
  Target, 
  TrendingUp,
  Award
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const mockAthlete = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  sport: 'Basketball',
  position: 'Point Guard',
  level: 'Professional',
  joinDate: '2023-01-15',
  stats: {
    trainingHours: 120,
    completedWorkouts: 45,
    avgPerformance: 85,
    improvements: 12
  }
};

export default function AthleteDetails() {
  const athlete = mockAthlete;

  return (
    <DashboardLayout title="Athlete Details">
      <div className="space-y-6">
        {/* Athlete Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{athlete.name}</CardTitle>
                <CardDescription className="flex items-center space-x-4 mt-2">
                  <Badge>{athlete.sport}</Badge>
                  <span>•</span>
                  <span>{athlete.position}</span>
                  <span>•</span>
                  <Badge variant="outline">{athlete.level}</Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{athlete.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{athlete.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{athlete.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Training Hours</p>
                  <p className="text-2xl font-bold">{athlete.stats.trainingHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Workouts</p>
                  <p className="text-2xl font-bold">{athlete.stats.completedWorkouts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold">{athlete.stats.avgPerformance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Improvements</p>
                  <p className="text-2xl font-bold">{athlete.stats.improvements}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button>Assign Workout</Button>
              <Button variant="outline">Send Message</Button>
              <Button variant="outline">View Progress</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
