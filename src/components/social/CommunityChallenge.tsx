
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Calendar,
  Trophy,
  Target,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  CheckCircle
} from 'lucide-react';

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  goal: number;
  goalUnit: string;
  progress: number;
  participantCount: number;
  joined: boolean;
  type: 'steps' | 'workouts' | 'streak' | 'points';
  difficulty: 'easy' | 'medium' | 'hard';
  creator: {
    name: string;
    avatar?: string;
  };
  topParticipants?: Array<{
    name: string;
    avatar?: string;
    score: number;
  }>;
  userRank?: number;
  onJoin: () => void;
  onLeave: () => void;
  onShare: (platform: string) => void;
}

const CommunityChallenge: React.FC<CommunityChallenge> = ({
  title,
  description,
  startDate,
  endDate,
  goal,
  goalUnit,
  progress,
  participantCount,
  joined,
  difficulty,
  creator,
  topParticipants = [],
  userRank,
  onJoin,
  onLeave,
  onShare
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const progressPercentage = Math.min((progress / goal) * 100, 100);
  const isActive = new Date() >= startDate && new Date() <= endDate;
  const isUpcoming = new Date() < startDate;
  const isCompleted = new Date() > endDate || progress >= goal;

  const getStatusBadge = () => {
    if (isUpcoming) return <Badge variant="secondary">Upcoming</Badge>;
    if (isCompleted) return <Badge variant="default">Completed</Badge>;
    if (isActive) return <Badge variant="default">Active</Badge>;
    return null;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleShare = (platform: string) => {
    onShare(platform);
    if (platform === 'copy') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShareDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{title}</CardTitle>
              {getStatusBadge()}
            </div>
            <CardDescription>{description}</CardDescription>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{participantCount} participants</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span className={getDifficultyColor()}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Progress: {progress.toLocaleString()} / {goal.toLocaleString()} {goalUnit}
            </span>
            <span className="text-sm text-gray-500">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {joined && userRank && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Your rank: #{userRank}</span>
          </div>
        )}
        
        {topParticipants.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Top Participants</h4>
            <div className="space-y-2">
              {topParticipants.slice(0, 3).map((participant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-4">#{index + 1}</span>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback className="text-xs">{participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm flex-1">{participant.name}</span>
                  <span className="text-sm font-medium">{participant.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          {joined ? (
            <Button variant="outline" onClick={onLeave} className="flex-1">
              Leave Challenge
            </Button>
          ) : (
            <Button onClick={onJoin} className="flex-1" disabled={isCompleted}>
              {isCompleted ? 'Challenge Ended' : 'Join Challenge'}
            </Button>
          )}
          
          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Challenge</DialogTitle>
                <DialogDescription>
                  Share "{title}" with others
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center"
                >
                  <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                  Facebook
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleShare('twitter')}
                  className="flex items-center justify-center"
                >
                  <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                  Twitter
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleShare('instagram')}
                  className="flex items-center justify-center"
                >
                  <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                  Instagram
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleShare('copy')}
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
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityChallenge;
