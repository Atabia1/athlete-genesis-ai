
import { useState } from 'react';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Users, Calendar, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const CoachDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('COACH123');
  
  // Mock data for testing
  const athleteCount = 12;
  const upcomingEvents = 3;
  const pendingRequests = 2;

  const generateNewCode = () => {
    // In a real app, this would generate a unique code and save it to the database
    const newCode = 'TEAM' + Math.floor(1000 + Math.random() * 9000);
    setInviteCode(newCode);
    toast({
      title: "New code generated",
      description: "Share this code with your athletes to connect.",
    });
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Code copied",
      description: "Team code copied to clipboard.",
    });
  };

  return (
    <DashboardLayout title="Coach Dashboard">
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/coach/roster')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                {athleteCount}
              </CardTitle>
              <CardDescription>Athletes</CardDescription>
            </CardHeader>
            <CardContent>
              <Users className="h-6 w-6 text-gray-400" />
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/coach/calendar')}>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                {upcomingEvents}
              </CardTitle>
              <CardDescription>Upcoming Events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar className="h-6 w-6 text-gray-400" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                {pendingRequests}
              </CardTitle>
              <CardDescription>Pending Requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Bell className="h-6 w-6 text-gray-400" />
            </CardContent>
          </Card>
        </div>
        
        {/* Team Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>Team Code</CardTitle>
            <CardDescription>Share this code with athletes to connect</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 py-2 px-4 rounded-md font-mono text-lg w-full">
                {inviteCode}
              </div>
              <Button variant="outline" size="icon" onClick={copyCodeToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={generateNewCode}>Generate New Code</Button>
          </CardContent>
        </Card>
        
        {/* Add Athlete Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Add New Athlete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Athlete</DialogTitle>
              <DialogDescription>
                Search for existing users or invite new ones.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="athlete@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CoachDashboard;
