
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Plus,
  Clock,
  Users,
  MapPin
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const mockEvents = [
  {
    id: '1',
    title: 'Team Practice',
    date: '2024-01-15',
    time: '09:00',
    duration: '2 hours',
    location: 'Main Gym',
    participants: 12,
    type: 'practice'
  },
  {
    id: '2',
    title: 'Strength Training',
    date: '2024-01-15',
    time: '14:00',
    duration: '1.5 hours',
    location: 'Weight Room',
    participants: 8,
    type: 'training'
  },
  {
    id: '3',
    title: 'Game vs Eagles',
    date: '2024-01-16',
    time: '19:00',
    duration: '2.5 hours',
    location: 'Home Arena',
    participants: 15,
    type: 'game'
  }
];

export default function TeamCalendar() {
  const [events] = useState(mockEvents);
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'practice': return 'bg-blue-100 text-blue-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'game': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="Team Calendar">
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">January 2024</h2>
            <p className="text-gray-600">Manage your team's schedule and events</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Today's Events
            </CardTitle>
            <CardDescription>
              Events scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {event.time} ({event.duration})
                          </span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.location}
                          </span>
                          <span className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {event.participants} participants
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No events scheduled for today</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Events scheduled for this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {event.date} at {event.time} • {event.location}
                    </p>
                  </div>
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
