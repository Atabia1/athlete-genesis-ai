/**
 * Community Leaderboard Component
 * 
 * This component displays a leaderboard of community members based on
 * various health and fitness metrics.
 */

import React, { useState, useEffect } from 'react';
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
import { 
  Trophy, 
  Medal, 
  Award, 
  Users, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Filter, 
  Calendar, 
  Footprints, 
  Heart, 
  Dumbbell, 
  Clock 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

// Props interface
interface CommunityLeaderboardProps {
  /** Community ID */
  communityId?: string;
  /** Leaderboard type */
  type?: 'steps' | 'workouts' | 'streak' | 'points';
  /** Time period */
  period?: 'day' | 'week' | 'month' | 'all';
  /** Maximum number of entries to show */
  maxEntries?: number;
  /** Whether to highlight the current user */
  highlightCurrentUser?: boolean;
  /** Whether to show rank changes */
  showRankChanges?: boolean;
  /** Whether to allow joining challenges */
  allowJoinChallenge?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Leaderboard entry interface
 */
interface LeaderboardEntry {
  /** User ID */
  id: string;
  /** User name */
  name: string;
  /** User avatar URL */
  avatar?: string;
  /** User rank */
  rank: number;
  /** Previous rank */
  previousRank?: number;
  /** Score value */
  value: number;
  /** Whether this is the current user */
  isCurrentUser: boolean;
  /** User's streak */
  streak?: number;
  /** User's badges */
  badges?: string[];
}

/**
 * Challenge interface
 */
interface Challenge {
  /** Challenge ID */
  id: string;
  /** Challenge name */
  name: string;
  /** Challenge description */
  description: string;
  /** Challenge start date */
  startDate: Date;
  /** Challenge end date */
  endDate: Date;
  /** Number of participants */
  participants: number;
  /** Whether the current user has joined */
  joined: boolean;
  /** Challenge type */
  type: 'steps' | 'workouts' | 'streak' | 'points';
  /** Challenge goal */
  goal: number;
}

/**
 * Format a value based on the leaderboard type
 * @param value Value to format
 * @param type Leaderboard type
 * @returns Formatted string
 */
const formatValue = (value: number, type: string): string => {
  switch (type) {
    case 'steps':
      return value.toLocaleString();
    case 'workouts':
      return `${value} workouts`;
    case 'streak':
      return `${value} day${value !== 1 ? 's' : ''}`;
    case 'points':
      return `${value} pts`;
    default:
      return value.toString();
  }
};

/**
 * Get icon for leaderboard type
 * @param type Leaderboard type
 * @returns React element with the appropriate icon
 */
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'steps':
      return <Footprints className="h-4 w-4" />;
    case 'workouts':
      return <Dumbbell className="h-4 w-4" />;
    case 'streak':
      return <Calendar className="h-4 w-4" />;
    case 'points':
      return <Award className="h-4 w-4" />;
    default:
      return <Trophy className="h-4 w-4" />;
  }
};

/**
 * Community Leaderboard Component
 */
const CommunityLeaderboard: React.FC<CommunityLeaderboardProps> = ({
  communityId,
  type = 'steps',
  period = 'week',
  maxEntries = 10,
  highlightCurrentUser = true,
  showRankChanges = true,
  allowJoinChallenge = true,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboardType, setLeaderboardType] = useState(type);
  const [timePeriod, setTimePeriod] = useState(period);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      
      // In a real app, this would fetch data from an API
      // For now, we'll generate mock data
      setTimeout(() => {
        const mockEntries = generateMockLeaderboardEntries(leaderboardType, timePeriod);
        setEntries(mockEntries);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchLeaderboard();
  }, [leaderboardType, timePeriod]);
  
  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      // In a real app, this would fetch data from an API
      // For now, we'll generate mock data
      const mockChallenges = generateMockChallenges();
      setChallenges(mockChallenges);
    };
    
    fetchChallenges();
  }, []);
  
  // Generate mock leaderboard entries
  const generateMockLeaderboardEntries = (
    entryType: string,
    entryPeriod: string
  ): LeaderboardEntry[] => {
    const mockEntries: LeaderboardEntry[] = [];
    
    for (let i = 1; i <= 15; i++) {
      const isCurrentUser = i === 5;
      
      let value: number;
      switch (entryType) {
        case 'steps':
          value = Math.floor(20000 / i) + Math.floor(Math.random() * 2000);
          break;
        case 'workouts':
          value = Math.floor(15 / i) + Math.floor(Math.random() * 3);
          break;
        case 'streak':
          value = Math.floor(30 / i) + Math.floor(Math.random() * 5);
          break;
        case 'points':
          value = Math.floor(1000 / i) + Math.floor(Math.random() * 100);
          break;
        default:
          value = Math.floor(1000 / i);
      }
      
      mockEntries.push({
        id: `user${i}`,
        name: isCurrentUser ? 'You' : `User ${i}`,
        avatar: isCurrentUser ? '/avatars/you.png' : `/avatars/user${i}.png`,
        rank: i,
        previousRank: i + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0) * (Math.random() > 0.5 ? 1 : -1),
        value,
        isCurrentUser,
        streak: Math.floor(Math.random() * 30),
        badges: i <= 3 ? ['top3'] : [],
      });
    }
    
    return mockEntries;
  };
  
  // Generate mock challenges
  const generateMockChallenges = (): Challenge[] => {
    return [
      {
        id: 'challenge1',
        name: '10K Steps Challenge',
        description: 'Complete 10,000 steps every day for a week',
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        participants: 128,
        joined: true,
        type: 'steps',
        goal: 10000,
      },
      {
        id: 'challenge2',
        name: 'Workout Warrior',
        description: 'Complete 15 workouts in 30 days',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        participants: 87,
        joined: false,
        type: 'workouts',
        goal: 15,
      },
      {
        id: 'challenge3',
        name: 'Consistency King',
        description: 'Maintain a 14-day activity streak',
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        participants: 56,
        joined: false,
        type: 'streak',
        goal: 14,
      },
    ];
  };
  
  // Handle joining a challenge
  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, joined: true, participants: challenge.participants + 1 } 
          : challenge
      )
    );
  };
  
  // Get rank change icon
  const getRankChangeIcon = (current: number, previous?: number) => {
    if (!previous || current === previous) {
      return <Minus className="h-3 w-3 text-gray-400" />;
    }
    
    if (current < previous) {
      return <ArrowUp className="h-3 w-3 text-green-500" />;
    }
    
    return <ArrowDown className="h-3 w-3 text-red-500" />;
  };
  
  // Get rank change text
  const getRankChangeText = (current: number, previous?: number) => {
    if (!previous || current === previous) {
      return 'No change';
    }
    
    if (current < previous) {
      return `Up ${previous - current}`;
    }
    
    return `Down ${current - previous}`;
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Community Leaderboard
            </CardTitle>
            <CardDescription>
              See how you stack up against the community
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {entries.length} Participants
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard" className="mt-4 space-y-4">
            <div className="flex justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    {getTypeIcon(leaderboardType)}
                    <span className="ml-2 capitalize">{leaderboardType}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLeaderboardType('steps')}>
                    <Footprints className="mr-2 h-4 w-4" />
                    Steps
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLeaderboardType('workouts')}>
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Workouts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLeaderboardType('streak')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Streak
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLeaderboardType('points')}>
                    <Award className="mr-2 h-4 w-4" />
                    Points
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="capitalize">{timePeriod}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTimePeriod('day')}>
                    Today
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimePeriod('week')}>
                    This Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimePeriod('month')}>
                    This Month
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimePeriod('all')}>
                    All Time
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center p-2 rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="ml-4 space-y-1 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {entries.slice(0, maxEntries).map((entry) => (
                  <div 
                    key={entry.id} 
                    className={cn(
                      "flex items-center p-2 rounded-lg",
                      entry.isCurrentUser && highlightCurrentUser ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center justify-center w-8">
                      {entry.rank <= 3 ? (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full">
                          {entry.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                          {entry.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                          {entry.rank === 3 && <Medal className="h-5 w-5 text-amber-700" />}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">{entry.rank}</span>
                      )}
                    </div>
                    
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {entry.name}
                        </span>
                        {entry.isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{formatValue(entry.value, leaderboardType)}</span>
                        
                        {showRankChanges && entry.previousRank && (
                          <div className="flex items-center ml-2" title={getRankChangeText(entry.rank, entry.previousRank)}>
                            {getRankChangeIcon(entry.rank, entry.previousRank)}
                            <span className="ml-1">
                              {Math.abs(entry.rank - entry.previousRank)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {entry.badges && entry.badges.includes('top3') && (
                      <Badge variant="secondary" className="ml-2">Top 3</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="challenges" className="mt-4 space-y-4">
            {challenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className="p-4 rounded-lg border hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium flex items-center">
                      {getTypeIcon(challenge.type)}
                      <span className="ml-2">{challenge.name}</span>
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {challenge.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {challenge.participants}
                  </Badge>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Goal: {formatValue(challenge.goal, challenge.type)}
                  </div>
                  
                  {allowJoinChallenge && (
                    challenge.joined ? (
                      <Badge variant="success">Joined</Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleJoinChallenge(challenge.id)}
                      >
                        Join Challenge
                      </Button>
                    )
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto text-blue-500">
          View All
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityLeaderboard;
