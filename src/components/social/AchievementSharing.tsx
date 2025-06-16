
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Trophy,
  Target,
  Zap,
  Award,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  CheckCircle
} from 'lucide-react';

const AchievementSharing = () => {
  const [shareMessage, setShareMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const achievements = [
    {
      id: 1,
      title: 'First 5K Complete',
      description: 'Completed your first 5K run',
      icon: Trophy,
      date: '2024-01-15',
      type: 'milestone',
      shareCount: 12
    },
    {
      id: 2,
      title: 'Consistency Champion',
      description: '30 days workout streak',
      icon: Target,
      date: '2024-01-20',
      type: 'streak',
      shareCount: 8
    },
    {
      id: 3,
      title: 'Power Lifter',
      description: 'Deadlifted 2x body weight',
      icon: Zap,
      date: '2024-01-25',
      type: 'strength',
      shareCount: 15
    },
    {
      id: 4,
      title: 'Marathon Ready',
      description: 'Completed 20-mile long run',
      icon: Award,
      date: '2024-02-01',
      type: 'endurance',
      shareCount: 20
    }
  ];

  const handleCopyLink = async (achievement: any) => {
    const shareText = `🏆 Just unlocked "${achievement.title}" on AthleteGPT! ${achievement.description} #fitness #achievement`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSocialShare = (platform: string, achievement: any) => {
    const shareText = `🏆 Just unlocked "${achievement.title}" on AthleteGPT! ${achievement.description} #fitness #achievement`;
    const shareUrl = `https://athletegpt.com/achievement/${achievement.id}`;
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        handleCopyLink(achievement);
        return;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
          <CardDescription>
            Share your fitness milestones with friends and the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-full mr-3">
                        <achievement.icon className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {achievement.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Unlocked: {achievement.date}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Share2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{achievement.shareCount}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Achievement
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Share Achievement</DialogTitle>
                          <DialogDescription>
                            Share your "{achievement.title}" achievement with the world!
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Add a personal message</label>
                            <Textarea
                              placeholder="Add your thoughts about this achievement..."
                              value={shareMessage}
                              onChange={(e) => setShareMessage(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              onClick={() => handleSocialShare('facebook', achievement)}
                              className="flex items-center justify-center"
                            >
                              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                              Facebook
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => handleSocialShare('twitter', achievement)}
                              className="flex items-center justify-center"
                            >
                              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                              Twitter
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => handleSocialShare('instagram', achievement)}
                              className="flex items-center justify-center"
                            >
                              <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                              Instagram
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => handleCopyLink(achievement)}
                              className="flex items-center justify-center"
                            >
                              {copied ? (
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 mr-2" />
                              )}
                              {copied ? 'Copied!' : 'Copy Link'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Keep working towards your goals to unlock more achievements!
            </p>
            <Button variant="outline">View All Achievements</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementSharing;
