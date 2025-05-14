/**
 * Achievement Sharing Component
 * 
 * This component allows users to share their health and fitness achievements
 * on social media or with their coach/trainer.
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { 
  Share2, 
  Trophy, 
  Twitter, 
  Facebook, 
  Instagram, 
  Mail, 
  MessageSquare, 
  Download, 
  ChevronDown, 
  Image, 
  BarChart, 
  Calendar, 
  Check, 
  X 
} from 'lucide-react';

// Props interface
interface AchievementSharingProps {
  /** Achievement title */
  title: string;
  /** Achievement description */
  description: string;
  /** Achievement date */
  date: Date;
  /** Achievement image URL */
  imageUrl?: string;
  /** Achievement data */
  data?: Record<string, any>;
  /** Whether the achievement is shareable */
  shareable?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Achievement Sharing Component
 */
const AchievementSharing: React.FC<AchievementSharingProps> = ({
  title,
  description,
  date,
  imageUrl,
  data,
  shareable = true,
  className = '',
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('social');
  const [includeImage, setIncludeImage] = useState(true);
  const [includeStats, setIncludeStats] = useState(true);
  const [includeDate, setIncludeDate] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  
  // Format date
  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Mock coaches data
  const coaches = [
    { id: 'coach1', name: 'Coach Sarah' },
    { id: 'coach2', name: 'Coach Michael' },
  ];
  
  // Handle social media sharing
  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'instagram') => {
    // In a real app, this would open the sharing dialog for the respective platform
    let shareUrl = '';
    const shareText = `${title} - ${description}`;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a web sharing API, so we'd need to use a different approach
        toast({
          title: 'Instagram Sharing',
          description: 'Instagram sharing is available in the mobile app.',
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    setShareDialogOpen(false);
  };
  
  // Handle coach sharing
  const handleCoachShare = () => {
    if (!selectedCoach) {
      toast({
        title: 'No Coach Selected',
        description: 'Please select a coach to share with.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would send the achievement to the selected coach
    toast({
      title: 'Achievement Shared',
      description: `Your achievement has been shared with ${coaches.find(c => c.id === selectedCoach)?.name}.`,
    });
    
    setShareDialogOpen(false);
  };
  
  // Handle download
  const handleDownload = () => {
    // In a real app, this would generate and download an image of the achievement
    toast({
      title: 'Achievement Downloaded',
      description: 'Your achievement has been downloaded as an image.',
    });
    
    setShareDialogOpen(false);
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            <Calendar className="inline-block mr-1 h-4 w-4" />
            Achieved on {formattedDate}
          </div>
          
          {data && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-500">{key}</div>
                  <div className="text-sm font-medium">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" />
            Save
          </Button>
          
          {shareable && (
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Achievement</DialogTitle>
                  <DialogDescription>
                    Share your achievement with friends, coaches, or on social media.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                    <TabsTrigger value="coach">Coach/Trainer</TabsTrigger>
                    <TabsTrigger value="download">Download</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="social" className="space-y-4 mt-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 flex items-center justify-center"
                        onClick={() => handleSocialShare('twitter')}
                      >
                        <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                        Twitter
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 flex items-center justify-center"
                        onClick={() => handleSocialShare('facebook')}
                      >
                        <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                        Facebook
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 flex items-center justify-center"
                        onClick={() => handleSocialShare('instagram')}
                      >
                        <Instagram className="mr-2 h-4 w-4 text-pink-500" />
                        Instagram
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-message">Custom Message</Label>
                      <Textarea 
                        id="custom-message" 
                        placeholder="Add a custom message to your share..." 
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-image">Include Image</Label>
                        <Switch 
                          id="include-image" 
                          checked={includeImage}
                          onCheckedChange={setIncludeImage}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-stats">Include Stats</Label>
                        <Switch 
                          id="include-stats" 
                          checked={includeStats}
                          onCheckedChange={setIncludeStats}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-date">Include Date</Label>
                        <Switch 
                          id="include-date" 
                          checked={includeDate}
                          onCheckedChange={setIncludeDate}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="coach" className="space-y-4 mt-4">
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
                          {coaches.map(coach => (
                            <DropdownMenuItem 
                              key={coach.id}
                              onClick={() => setSelectedCoach(coach.id)}
                            >
                              {coach.name}
                              {selectedCoach === coach.id && (
                                <Check className="h-4 w-4 ml-2" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="coach-message">Message for Coach</Label>
                      <Textarea 
                        id="coach-message" 
                        placeholder="Add a message for your coach..." 
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-stats-coach">Include Stats</Label>
                        <Switch 
                          id="include-stats-coach" 
                          checked={includeStats}
                          onCheckedChange={setIncludeStats}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleCoachShare}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Share with Coach
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="download" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Download Format</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center"
                          onClick={handleDownload}
                        >
                          <Image className="mr-2 h-4 w-4" />
                          Image
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center"
                          onClick={handleDownload}
                        >
                          <BarChart className="mr-2 h-4 w-4" />
                          Data (CSV)
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-title">Include Title</Label>
                        <Switch 
                          id="include-title" 
                          checked={true}
                          onCheckedChange={() => {}}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-stats-download">Include Stats</Label>
                        <Switch 
                          id="include-stats-download" 
                          checked={includeStats}
                          onCheckedChange={setIncludeStats}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-date-download">Include Date</Label>
                        <Switch 
                          id="include-date-download" 
                          checked={includeDate}
                          onCheckedChange={setIncludeDate}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AchievementSharing;
