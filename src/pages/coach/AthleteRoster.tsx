
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, MoreHorizontal } from "lucide-react";

// Mock data for athletes
const athletes = [
  { id: '1', name: 'Alex Johnson', sport: 'Basketball', status: 'active', lastActive: '2 hours ago' },
  { id: '2', name: 'Sarah Williams', sport: 'Swimming', status: 'active', lastActive: '1 day ago' },
  { id: '3', name: 'Mike Thompson', sport: 'Soccer', status: 'inactive', lastActive: '5 days ago' },
  { id: '4', name: 'Emma Davis', sport: 'Tennis', status: 'active', lastActive: '3 hours ago' },
  { id: '5', name: 'James Wilson', sport: 'Baseball', status: 'inactive', lastActive: '2 weeks ago' },
  { id: '6', name: 'Lisa Brown', sport: 'Volleyball', status: 'active', lastActive: 'Just now' },
  { id: '7', name: 'David Miller', sport: 'Track', status: 'active', lastActive: '1 hour ago' },
  { id: '8', name: 'Sophia Garcia', sport: 'Gymnastics', status: 'active', lastActive: '5 hours ago' },
];

const AthleteRoster = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAthletes = athletes.filter(athlete => 
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAthleteClick = (athleteId: string) => {
    navigate(`/coach/athlete/${athleteId}`);
  };
  
  return (
    <DashboardLayout title="Athlete Roster">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Athletes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search athletes..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Athlete
                </Button>
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
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAthletes.map((athlete) => (
                  <TableRow 
                    key={athlete.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleAthleteClick(athlete.id)}
                  >
                    <TableCell className="font-medium">{athlete.name}</TableCell>
                    <TableCell>{athlete.sport}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={athlete.status === 'active' ? 'default' : 'secondary'}
                        className={athlete.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {athlete.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{athlete.lastActive}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AthleteRoster;
