
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Share2,
  Eye,
  EyeOff,
  Settings,
  Shield,
  Clock,
  TrendingUp,
  Heart,
  Dumbbell
} from 'lucide-react';

const CoachSharing = () => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [permissions, setPermissions] = useState({
    workouts: true,
    nutrition: true,
    progress: true,
    wellbeing: false,
    realTimeData: false
  });

  const coaches = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Certified Personal Trainer',
      specialization: 'Strength Training',
      avatar: '/placeholder-avatar.jpg',
      status: 'connected',
      permissions: ['workouts', 'nutrition', 'progress']
    },
    {
      id: 2,
      name: 'Mike Chen',
      title: 'Sports Performance Coach',
      specialization: 'Endurance Training',
      avatar: '/placeholder-avatar.jpg',
      status: 'pending',
      permissions: []
    }
  ];

  const dataTypes = [
    {
      key: 'workouts',
      label: 'Workout Data',
      description: 'Exercise history, sets, reps, weights',
      icon: Dumbbell,
      enabled: permissions.workouts
    },
    {
      key: 'nutrition',
      label: 'Nutrition Data',
      description: 'Meal logs, calorie intake, macros',
      icon: Heart,
      enabled: permissions.nutrition
    },
    {
      key: 'progress',
      label: 'Progress Metrics',
      description: 'Body measurements, strength gains',
      icon: TrendingUp,
      enabled: permissions.progress
    },
    {
      key: 'wellbeing',
      label: 'Wellbeing Data',
      description: 'Sleep, stress, recovery metrics',
      icon: Heart,
      enabled: permissions.wellbeing
    },
    {
      key: 'realTimeData',
      label: 'Real-time Updates',
      description: 'Live workout tracking and notifications',
      icon: Clock,
      enabled: permissions.realTimeData
    }
  ];

  const togglePermission = (key: string) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Coach Access & Data Sharing
          </CardTitle>
          <CardDescription>
            Manage how you share your fitness data with coaches and trainers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connected Coaches */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connected Coaches</h3>
            <div className="space-y-3">
              {coaches.map((coach) => (
                <Card key={coach.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{coach.name}</h4>
                        <p className="text-sm text-gray-600">{coach.title}</p>
                        <Badge variant="outline" className="mt-1">
                          {coach.specialization}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={coach.status === 'connected' ? 'default' : 'secondary'}>
                        {coach.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShareDialogOpen(true)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Data Sharing Permissions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Sharing Permissions</h3>
            <div className="space-y-4">
              {dataTypes.map((dataType) => (
                <div key={dataType.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <dataType.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <Label htmlFor={dataType.key} className="font-medium cursor-pointer">
                        {dataType.label}
                      </Label>
                      <p className="text-sm text-gray-600">{dataType.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {dataType.enabled ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch
                      id={dataType.key}
                      checked={dataType.enabled}
                      onCheckedChange={() => togglePermission(dataType.key)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Privacy & Security</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your data is encrypted and only shared with coaches you explicitly approve. 
                  You can revoke access at any time.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-share" className="text-sm">
                      Automatically share new workouts
                    </Label>
                    <Switch id="auto-share" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anonymous" className="text-sm">
                      Allow anonymous performance comparisons
                    </Label>
                    <Switch id="anonymous" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Share with New Coach */}
          <div className="text-center">
            <Button onClick={() => setShareDialogOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Connect with New Coach
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Data with Coach</DialogTitle>
            <DialogDescription>
              Configure what data to share and for how long
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Coach Email or Username</Label>
              <input 
                type="text" 
                placeholder="coach@example.com"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <Label>Access Duration</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">1 Week</SelectItem>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShareDialogOpen(false)}>
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachSharing;
