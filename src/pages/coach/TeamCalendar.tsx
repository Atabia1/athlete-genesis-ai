
import { useState } from 'react';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarIcon, Clock } from "lucide-react";

// Mock events for calendar
const events = [
  { id: 1, title: 'Team Training', date: '2025-04-19', type: 'training', time: '15:00-17:00', location: 'Main Field' },
  { id: 2, title: 'Match vs. Rivals', date: '2025-04-22', type: 'match', time: '14:00-16:00', location: 'City Stadium' },
  { id: 3, title: 'Recovery Session', date: '2025-04-25', type: 'recovery', time: '10:00-11:30', location: 'Gym' },
  { id: 4, title: 'Team Meeting', date: '2025-04-18', type: 'meeting', time: '18:00-19:00', location: 'Conference Room' },
];

// Event types with colors
const eventTypes = [
  { value: 'training', label: 'Training', color: 'bg-blue-100 text-blue-800' },
  { value: 'match', label: 'Match/Competition', color: 'bg-green-100 text-green-800' },
  { value: 'recovery', label: 'Recovery', color: 'bg-purple-100 text-purple-800' },
  { value: 'meeting', label: 'Meeting', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'offday', label: 'Off Day', color: 'bg-gray-100 text-gray-800' },
];

const getEventColorClass = (type: string) => {
  const eventType = eventTypes.find(t => t.value === type);
  return eventType ? eventType.color : 'bg-gray-100 text-gray-800';
};

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Filter events for today
const todaysEvents = events.filter(event => event.date === today);

const TeamCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(today);
  
  // Function to handle date selection in the calendar
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setSelectedDate(selectedDate.toISOString().split('T')[0]);
    }
  };
  
  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => event.date === selectedDate);
  
  return (
    <DashboardLayout title="Team Calendar">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Schedule</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Team Event</DialogTitle>
                    <DialogDescription>
                      Create a new event for your team's calendar.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input id="event-title" placeholder="Team Training" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select>
                        <SelectTrigger id="event-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Date</Label>
                        <Input id="event-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-time">Time</Label>
                        <Input id="event-time" type="time" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-location">Location</Label>
                      <Input id="event-location" placeholder="Main Field" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-notes">Notes</Label>
                      <Textarea id="event-notes" placeholder="Additional details about the event..." />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        {/* Events for selected date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              {selectedDate === today ? "Today's Events" : "Events"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge className={getEventColorClass(event.type)}>
                        {eventTypes.find(t => t.value === event.type)?.label}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {event.time}
                      </div>
                      <div>{event.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No events scheduled for this date</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>{/* Same content as above */}</DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeamCalendar;
