
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Filter, Dumbbell, Clipboard, Users, Calendar, Clock, CheckCircle, ClipboardList, Copy, Edit, Trash2, MoreHorizontal, Search, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Mock data for training plans
const trainingPlans = [
  {
    id: "1",
    title: "Pre-Season Strength & Conditioning",
    description: "A 6-week program designed to build a foundation of strength and conditioning before the competitive season begins.",
    sport: "Basketball",
    level: "intermediate",
    duration: "6 weeks",
    sessions: 4,
    type: "team",
    created: "2023-07-15",
    updated: "2023-08-02",
    assignments: 12,
    completion: 65,
    tags: ["strength", "conditioning", "pre-season"]
  },
  {
    id: "2",
    title: "In-Season Maintenance Program",
    description: "Designed to maintain strength and power while minimizing fatigue during the competitive season.",
    sport: "Soccer",
    level: "advanced",
    duration: "12 weeks",
    sessions: 3,
    type: "team",
    created: "2023-06-20",
    updated: "2023-08-10",
    assignments: 18,
    completion: 78,
    tags: ["maintenance", "in-season", "recovery"]
  },
  {
    id: "3",
    title: "Post-Injury Rehabilitation",
    description: "A progressive program for athletes returning from lower-body injuries, focusing on restoring function and strength.",
    sport: "Multiple",
    level: "beginner",
    duration: "8 weeks",
    sessions: 5,
    type: "individual",
    created: "2023-07-28",
    updated: "2023-08-15",
    assignments: 3,
    completion: 42,
    tags: ["rehabilitation", "injury-recovery", "progressive"]
  },
  {
    id: "4",
    title: "Speed & Agility Development",
    description: "Targeted program to improve linear speed, change of direction, and reactive agility.",
    sport: "Track & Field",
    level: "intermediate",
    duration: "4 weeks",
    sessions: 3,
    type: "small-group",
    created: "2023-08-01",
    updated: "2023-08-01",
    assignments: 7,
    completion: 90,
    tags: ["speed", "agility", "performance"]
  },
  {
    id: "5",
    title: "Offseason Development Program",
    description: "Comprehensive program for the offseason focusing on addressing weaknesses and building overall athleticism.",
    sport: "Swimming",
    level: "elite",
    duration: "12 weeks",
    sessions: 6,
    type: "individual",
    created: "2023-05-10",
    updated: "2023-08-05",
    assignments: 5,
    completion: 85,
    tags: ["offseason", "development", "strength"]
  },
  {
    id: "6",
    title: "Explosive Power Development",
    description: "Specialized program targeting explosive power for jumping and sprinting sports.",
    sport: "Volleyball",
    level: "advanced",
    duration: "6 weeks",
    sessions: 4,
    type: "team",
    created: "2023-07-05",
    updated: "2023-08-12",
    assignments: 14,
    completion: 72,
    tags: ["power", "explosive", "plyometrics"]
  },
];

const TrainingPlans = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [sportFilter, setSportFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  // Filter plans based on search and filters
  const filteredPlans = trainingPlans.filter(plan => {
    // Search query filter
    const matchesSearch = !searchQuery || 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Level filter
    const matchesLevel = !levelFilter || plan.level === levelFilter;
    
    // Sport filter
    const matchesSport = !sportFilter || plan.sport === sportFilter || 
      (sportFilter === "Other" && !["Basketball", "Soccer", "Volleyball", "Swimming", "Track & Field"].includes(plan.sport));
    
    // Type filter
    const matchesType = !typeFilter || plan.type === typeFilter;
    
    return matchesSearch && matchesLevel && matchesSport && matchesType;
  });
  
  const resetFilters = () => {
    setLevelFilter(null);
    setSportFilter(null);
    setTypeFilter(null);
    setSearchQuery("");
  };
  
  const handleCopyPlan = (planId: string) => {
    toast({
      title: "Plan duplicated",
      description: "The training plan has been duplicated and added to your plans.",
    });
  };
  
  const handleDeletePlan = (planId: string) => {
    toast({
      title: "Plan deleted",
      description: "The training plan has been deleted.",
    });
  };
  
  const handleAssignPlan = (planId: string) => {
    toast({
      title: "Assignment created",
      description: "Please select athletes to assign this plan to.",
    });
  };
  
  return (
    <DashboardLayout title="Training Plans">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Training Plans</h1>
          <p className="text-muted-foreground">
            Create, manage and assign training plans to your athletes
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Training Plan</DialogTitle>
              <DialogDescription>
                Define the details of your new training plan. You'll be able to add specific workouts after creation.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input id="plan-name" placeholder="e.g., Pre-Season Strength Program" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea 
                  id="plan-description" 
                  placeholder="Describe the goals and focus of this training plan"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="plan-sport">Sport/Activity</Label>
                  <Select>
                    <SelectTrigger id="plan-sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="soccer">Soccer</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="track">Track & Field</SelectItem>
                      <SelectItem value="multiple">Multiple Sports</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="plan-level">Experience Level</Label>
                  <Select>
                    <SelectTrigger id="plan-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="plan-duration">Duration</Label>
                  <div className="flex items-center gap-2">
                    <Input id="plan-duration" type="number" min="1" placeholder="4" />
                    <Select defaultValue="weeks">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="plan-sessions">Sessions Per Week</Label>
                  <Input id="plan-sessions" type="number" min="1" max="14" placeholder="3" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Plan Type</Label>
                <RadioGroup defaultValue="team">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="team" id="team" />
                      <Label htmlFor="team">Team</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small-group" id="small-group" />
                      <Label htmlFor="small-group">Small Group</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-2">
                <Label>Tags (Optional)</Label>
                <Input placeholder="e.g., strength, conditioning, recovery (comma separated)" />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">Create Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search plans..." 
                className="pl-9 w-full sm:w-auto min-w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Plans</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <Label className="text-xs">Experience Level</Label>
                  <Select value={levelFilter || ""} onValueChange={(value) => setLevelFilter(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2">
                  <Label className="text-xs">Sport/Activity</Label>
                  <Select value={sportFilter || ""} onValueChange={(value) => setSportFilter(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sports</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Swimming">Swimming</SelectItem>
                      <SelectItem value="Track & Field">Track & Field</SelectItem>
                      <SelectItem value="Multiple">Multiple Sports</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2">
                  <Label className="text-xs">Plan Type</Label>
                  <Select value={typeFilter || ""} onValueChange={(value) => setTypeFilter(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="small-group">Small Group</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {filteredPlans.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No training plans found</h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  {searchQuery || levelFilter || sportFilter || typeFilter
                    ? "No plans match your current filters. Try adjusting your search criteria."
                    : "You haven't created any training plans yet. Get started by creating your first plan."}
                </p>
                
                {searchQuery || levelFilter || sportFilter || typeFilter ? (
                  <Button variant="outline" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent>{/* Same content as above */}</DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {plan.sport} • {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCopyPlan(plan.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssignPlan(plan.id)}>
                            <Users className="mr-2 h-4 w-4" />
                            Assign to Athletes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePlan(plan.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-gray-700 line-clamp-2 h-10">
                      {plan.description}
                    </p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{plan.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{plan.sessions}x / week</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{plan.assignments} assigned</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{plan.completion}% completion</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-1">
                      {plan.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9">View Plan</Button>
                    <Button size="sm" className="flex-1 h-9" onClick={() => handleAssignPlan(plan.id)}>
                      <Zap className="mr-1 h-4 w-4" />
                      Assign
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Active Plans</h3>
              <p className="text-gray-500">This tab will show plans currently assigned to athletes</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drafts">
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Draft Plans</h3>
              <p className="text-gray-500">This tab will show your draft plans not yet published</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archive">
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Archived Plans</h3>
              <p className="text-gray-500">This tab will show plans you've archived</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TrainingPlans;
