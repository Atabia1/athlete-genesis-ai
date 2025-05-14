/**
 * Coach Sharing Component
 * 
 * This component allows users to share their health data and workouts
 * with their coaches or trainers.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Share2, 
  Users, 
  UserCheck, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Check, 
  X, 
  Heart, 
  Activity, 
  Dumbbell, 
  Footprints, 
  Moon, 
  Scale, 
  BarChart 
} from 'lucide-react';
import { HealthData } from '@/integrations/health-apps/types';

// Props interface
interface CoachSharingProps {
  /** User's health data */
  healthData?: HealthData;
  /** User's workouts */
  workouts?: any[];
  /** Whether the user has a coach */
  hasCoach?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Coach interface
 */
interface Coach {
  /** Coach ID */
  id: string;
  /** Coach name */
  name: string;
  /** Coach avatar URL */
  avatar?: string;
  /** Coach role */
  role: string;
  /** Whether the coach is connected */
  connected: boolean;
  /** Last shared date */
  lastShared?: Date;
}

/**
 * Sharing permission interface
 */
interface SharingPermission {
  /** Permission key */
  key: string;
  /** Permission name */
  name: string;
  /** Permission description */
  description: string;
  /** Whether the permission is enabled */
  enabled: boolean;
  /** Permission icon */
  icon: React.ReactNode;
}

/**
 * Coach Sharing Component
 */
const CoachSharing: React.FC<CoachSharingProps> = ({
  healthData,
  workouts = [],
  hasCoach = false,
  className = '',
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('coaches');
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [permissions, setPermissions] = useState<SharingPermission[]>([
    {
      key: 'activity',
      name: 'Activity Data',
      description: 'Steps, distance, calories burned',
      enabled: true,
      icon: <Footprints className="h-4 w-4 text-blue-500" />,
    },
    {
      key: 'heart',
      name: 'Heart Rate Data',
      description: 'Resting, average, and max heart rate',
      enabled: true,
      icon: <Heart className="h-4 w-4 text-red-500" />,
    },
    {
      key: 'sleep',
      name: 'Sleep Data',
      description: 'Sleep duration and quality',
      enabled: true,
      icon: <Moon className="h-4 w-4 text-purple-500" />,
    },
    {
      key: 'workouts',
      name: 'Workout History',
      description: 'Past workouts and performance',
      enabled: true,
      icon: <Dumbbell className="h-4 w-4 text-green-500" />,
    },
    {
      key: 'weight',
      name: 'Weight & Body Composition',
      description: 'Weight, BMI, body fat percentage',
      enabled: false,
      icon: <Scale className="h-4 w-4 text-orange-500" />,
    },
  ]);
  
  // Mock coaches data
  const [coaches, setCoaches] = useState<Coach[]>([
    {
      id: 'coach1',
      name: 'Coach Sarah',
      avatar: '/avatars/coach1.png',
      role: 'Personal Trainer',
      connected: true,
      lastShared: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'coach2',
      name: 'Coach Michael',
      avatar: '/avatars/coach2.png',
      role: 'Nutrition Specialist',
      connected: true,
    },
    {
      id: 'coach3',
      name: 'Coach Emma',
      avatar: '/avatars/coach3.png',
      role: 'Team Coach',
      connected: false,
    },
  ]);
  
  // Toggle permission
  const togglePermission = (key: string) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.key === key 
          ? { ...permission, enabled: !permission.enabled } 
          : permission
      )
    );
  };
  
  // Handle coach sharing
  const handleShareWithCoach = () => {
    if (!selectedCoach) {
      toast({
        title: 'No Coach Selected',
        description: 'Please select a coach to share with.',
        variant: 'destructive',
      });
      return;
    }
    
    // Get enabled permissions
    const enabledPermissions = permissions
      .filter(permission => permission.enabled)
      .map(permission => permission.name);
    
    // In a real app, this would send the data to the selected coach
    toast({
      title: 'Data Shared',
      description: `Your data has been shared with ${coaches.find(c => c.id === selectedCoach)?.name}.`,
    });
    
    // Update last shared date
    setCoaches(prev => 
      prev.map(coach => 
        coach.id === selectedCoach 
          ? { ...coach, lastShared: new Date() } 
          : coach
      )
    );
    
    setShareDialogOpen(false);
  };
  
  // Handle connect with coach
  const handleConnectCoach = (coachId: string) => {
    setCoaches(prev => 
      prev.map(coach => 
        coach.id === coachId 
          ? { ...coach, connected: true } 
          : coach
      )
    );
    
    toast({
      title: 'Coach Connected',
      description: `You are now connected with ${coaches.find(c => c.id === coachId)?.name}.`,
    });
  };
  
  // Handle disconnect from coach
  const handleDisconnectCoach = (coachId: string) => {
    setCoaches(prev => 
      prev.map(coach => 
        coach.id === coachId 
          ? { ...coach, connected: false } 
          : coach
      )
    );
    
    toast({
      title: 'Coach Disconnected',
      description: `You are no longer connected with ${coaches.find(c => c.id === coachId)?.name}.`,
    });
  };
  
  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="mr-2 h-5 w-5 text-blue-500" />
          Coach Sharing
        </CardTitle>
        <CardDescription>
          Share your health data and workouts with your coaches
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="coaches">My Coaches</TabsTrigger>
            <TabsTrigger value="permissions">Sharing Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coaches" className="mt-4 space-y-4">
            {coaches.length === 0 ? (
              <div className="text-center py-6">
                <Users className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">No Coaches Yet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Connect with a coach to get personalized guidance
                </p>
                <Button className="mt-4">Find a Coach</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {coaches.map((coach) => (
                  <div 
                    key={coach.id} 
                    className="p-4 rounded-lg border hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={coach.avatar} alt={coach.name} />
                        <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium">{coach.name}</h4>
                          {coach.connected ? (
                            <Badge variant="outline" className="ml-2 text-xs">Connected</Badge>
                          ) : (
                            <Badge variant="outline" className="ml-2 text-xs bg-gray-100">Not Connected</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{coach.role}</p>
                        
                        {coach.lastShared && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Last shared: {formatDate(coach.lastShared)}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {coach.connected ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedCoach(coach.id);
                                  setShareDialogOpen(true);
                                }}
                              >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Data
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-500"
                                onClick={() => handleDisconnectCoach(coach.id)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Disconnect
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleConnectCoach(coach.id)}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="permissions" className="mt-4 space-y-4">
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div 
                  key={permission.key} 
                  className="flex items-start justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-start">
                    <div className="mt-0.5">
                      {permission.icon}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium">{permission.name}</h4>
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    </div>
                  </div>
                  
                  <Switch 
                    checked={permission.enabled}
                    onCheckedChange={() => togglePermission(permission.key)}
                  />
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium flex items-center text-blue-700">
                <Info className="h-4 w-4 mr-2" />
                Privacy Information
              </h4>
              <p className="text-xs text-blue-600 mt-1">
                You control what data is shared with your coaches. You can change these settings at any time.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => setShareDialogOpen(true)}
          disabled={!coaches.some(coach => coach.connected)}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share with Coach
        </Button>
      </CardFooter>
      
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share with Coach</DialogTitle>
            <DialogDescription>
              Share your health data and workouts with your coach.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Select Coach</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedCoach 
                      ? coaches.find(c => c.id === selectedCoach)?.name 
                      : 'Select a coach'}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {coaches
                    .filter(coach => coach.connected)
                    .map(coach => (
                      <DropdownMenuItem 
                        key={coach.id}
                        onClick={() => setSelectedCoach(coach.id)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={coach.avatar} alt={coach.name} />
                            <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {coach.name}
                        </div>
                        {selectedCoach === coach.id && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="space-y-2">
              <Label>Data to Share</Label>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div 
                    key={permission.key} 
                    className="flex items-center justify-between"
                  >
                    <Label 
                      htmlFor={`share-${permission.key}`}
                      className="flex items-center text-sm"
                    >
                      {permission.icon}
                      <span className="ml-2">{permission.name}</span>
                    </Label>
                    <Switch 
                      id={`share-${permission.key}`}
                      checked={permission.enabled}
                      onCheckedChange={() => togglePermission(permission.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coach-message">Message (Optional)</Label>
              <Textarea 
                id="coach-message" 
                placeholder="Add a message for your coach..." 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShareWithCoach}>
              Share with Coach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Add missing components
const Info = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default CoachSharing;
