/**
 * Community Challenge Component
 * 
 * This component displays a community challenge with progress tracking,
 * leaderboard, and social sharing features.
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
import { 
  Trophy, 
  Users, 
  Calendar, 
  Clock, 
  Share2, 
  ChevronDown, 
  Check, 
  X, 
  Award, 
  Target, 
  Flame, 
  Flag, 
  ArrowRight, 
  Twitter, 
  Facebook, 
  Instagram, 
  Mail 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Props interface
interface CommunityChallengeProps {
  /** Challenge ID */
  id: string;
  /** Challenge title */
  title: string;
  /** Challenge description */
  description: string;
  /** Challenge start date */
  startDate: Date;
  /** Challenge end date */
  endDate: Date;
  /** Challenge goal */
  goal: number;
  /** Challenge goal unit */
  goalUnit: string;
  /** Current progress */
  progress: number;
  /** Number of participants */
  participantCount: number;
  /** Whether the user has joined the challenge */
  joined: boolean;
  /** Challenge type */
  type: 'steps' | 'workouts' | 'distance' | 'calories' | 'custom';
  /** Challenge difficulty */
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  /** Challenge creator */
  creator?: {
    id: string;
    name: string;
    avatar?: string;
  };
  /** Top participants */
  topParticipants?: Array<{
    id: string;
    name: string;
    avatar?: string;
    progress: number;
    rank: number;
  }>;
  /** User's rank */
  userRank?: number;
  /** Callback when user joins the challenge */
  onJoin?: () => void;
  /** Callback when user leaves the challenge */
  onLeave?: () => void;
  /** Callback when user shares the challenge */
  onShare?: (platform: string) => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * Format a date range
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted date range string
 */
const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  
  const end = endDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  return `${start} - ${end}`;
};

/**
 * Calculate days remaining
 * @param endDate End date
 * @returns Days remaining
 */
const getDaysRemaining = (endDate: Date): number => {
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Get difficulty badge variant
 * @param difficulty Challenge difficulty
 * @returns Badge variant
 */
const getDifficultyBadgeVariant = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'advanced':
      return 'bg-purple-100 text-purple-800';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Community Challenge Component
 */
const CommunityChallenge: React.FC<CommunityChallengeProps> = ({
  id,
  title,
  description,
  startDate,
  endDate,
  goal,
  goalUnit,
  progress,
  participantCount,
  joined,
  type,
  difficulty,
  creator,
  topParticipants = [],
  userRank,
  onJoin,
  onLeave,
  onShare,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((progress / goal) * 100));
  
  // Calculate days remaining
  const daysRemaining = getDaysRemaining(endDate);
  
  // Check if challenge is active
  const isActive = new Date() >= startDate && new Date() <= endDate;
  
  // Check if challenge is completed
  const isCompleted = progress >= goal;
  
  // Handle join button click
  const handleJoin = () => {
    if (onJoin) {
      onJoin();
    } else {
      toast({
        title: 'Challenge Joined',
        description: `You have joined the ${title} challenge.`,
      });
    }
  };
  
  // Handle leave button click
  const handleLeave = () => {
    if (onLeave) {
      onLeave();
    } else {
      toast({
        title: 'Challenge Left',
        description: `You have left the ${title} challenge.`,
      });
    }
  };
  
  // Handle share button click
  const handleShare = (platform: string) => {
    if (onShare) {
      onShare(platform);
    } else {
      toast({
        title: 'Challenge Shared',
        description: `You have shared the challenge on ${platform}.`,
      });
    }
    
    setShareDialogOpen(false);
  };
  
  // Get challenge icon
  const getChallengeIcon = () => {
    switch (type) {
      case 'steps':
        return <Footprints className="h-5 w-5 text-blue-500" />;
      case 'workouts':
        return <Dumbbell className="h-5 w-5 text-purple-500" />;
      case 'distance':
        return <Map className="h-5 w-5 text-green-500" />;
      case 'calories':
        return <Flame className="h-5 w-5 text-orange-500" />;
      default:
        return <Target className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getChallengeIcon()}
            <CardTitle className="ml-2">{title}</CardTitle>
          </div>
          <Badge className={cn("capitalize", getDifficultyBadgeVariant(difficulty))}>
            {difficulty}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Goal</div>
                <div className="text-lg font-medium">
                  {goal.toLocaleString()} {goalUnit}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Participants</div>
                <div className="text-lg font-medium">
                  {participantCount.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Duration</div>
                <div className="text-sm font-medium">
                  {formatDateRange(startDate, endDate)}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">
                  {daysRemaining > 0 ? 'Days Remaining' : 'Status'}
                </div>
                <div className="text-sm font-medium">
                  {daysRemaining > 0 ? (
                    <span>{daysRemaining} days</span>
                  ) : (
                    <span className="text-gray-500">Ended</span>
                  )}
                </div>
              </div>
            </div>
            
            {creator && (
              <div className="flex items-center mt-4">
                <div className="text-xs text-gray-500 mr-2">Created by:</div>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm ml-2">{creator.name}</span>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="progress" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Your Progress</span>
                <span>
                  {progress.toLocaleString()} / {goal.toLocaleString()} {goalUnit}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-right text-gray-500">
                {progressPercentage}% Complete
              </div>
            </div>
            
            {isCompleted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <Award className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <div className="font-medium text-green-800">Challenge Completed!</div>
                  <div className="text-sm text-green-600">
                    Congratulations on completing this challenge.
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-medium text-blue-800">
                  {isActive ? 'Challenge in Progress' : 'Challenge Not Started'}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {isActive
                    ? `You need ${(goal - progress).toLocaleString()} more ${goalUnit} to complete this challenge.`
                    : `This challenge will start on ${startDate.toLocaleDateString()}.`}
                </div>
              </div>
            )}
            
            {userRank && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Your Rank</div>
                <div className="text-lg font-medium flex items-center">
                  #{userRank}
                  {userRank <= 3 && (
                    <Trophy className="ml-2 h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-4 space-y-4">
            {topParticipants.length > 0 ? (
              <div className="space-y-2">
                {topParticipants.map((participant) => (
                  <div 
                    key={participant.id} 
                    className={cn(
                      "flex items-center p-2 rounded-lg",
                      participant.id === 'current-user' ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center justify-center w-8">
                      {participant.rank <= 3 ? (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full">
                          {participant.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                          {participant.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                          {participant.rank === 3 && <Medal className="h-5 w-5 text-amber-700" />}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">{participant.rank}</span>
                      )}
                    </div>
                    
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="ml-3 flex-1">
                      <span className="text-sm font-medium">
                        {participant.name}
                      </span>
                      <div className="flex items-center mt-1">
                        <Progress 
                          value={(participant.progress / goal) * 100} 
                          className="h-1 w-24" 
                        />
                        <span className="text-xs text-gray-500 ml-2">
                          {participant.progress.toLocaleString()} {goalUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No participants yet</p>
              </div>
            )}
            
            <Button variant="outline" size="sm" className="w-full">
              View Full Leaderboard
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {joined ? (
          <Button variant="outline" onClick={handleLeave}>
            <X className="mr-2 h-4 w-4" />
            Leave Challenge
          </Button>
        ) : (
          <Button onClick={handleJoin} disabled={!isActive}>
            <Flag className="mr-2 h-4 w-4" />
            Join Challenge
          </Button>
        )}
        
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Challenge</DialogTitle>
              <DialogDescription>
                Share this challenge with your friends and followers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex space-x-2 mt-4">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
                onClick={() => handleShare('Twitter')}
              >
                <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
                onClick={() => handleShare('Facebook')}
              >
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
                onClick={() => handleShare('Instagram')}
              >
                <Instagram className="mr-2 h-4 w-4 text-pink-500" />
                Instagram
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => handleShare('Email')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

// Add missing components
const Footprints = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 2.28-5 5-5 2.72 0 4.97 2.28 5 5 .03 2.5-1 3.5-1 5.62V16h-8Z" />
    <path d="M20 20v-2.38c0-2.12-1.03-3.12-1-5.62.03-2.72 2.28-5 5-5 2.72 0 4.97 2.28 5 5 .03 2.5-1 3.5-1 5.62V20h-8Z" />
  </svg>
);

const Dumbbell = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="m14 21 7-7" />
  </svg>
);

const Map = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" x2="9" y1="3" y2="18" />
    <line x1="15" x2="15" y1="6" y2="21" />
  </svg>
);

const Medal = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 5.12 2H2a2 2 0 0 0-2 2v18h7" />
    <path d="m13 12 5.88-10H22a2 2 0 0 1 2 2v18h-7" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 18v-2h-.5" />
  </svg>
);

export default CommunityChallenge;
