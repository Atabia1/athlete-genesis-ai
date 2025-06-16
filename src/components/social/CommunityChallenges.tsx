/**
 * Community Challenges Component
 * 
 * This component displays a list of community challenges with filtering
 * and sorting options.
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Trophy, 
  Search, 
  Plus, 
  ChevronDown, 
  ArrowUpDown, 
  Calendar, 
  Users, 
  Target, 
  Flag 
} from 'lucide-react';
import CommunityChallenge from './CommunityChallenge';
import { toast } from '@/components/ui/use-toast';

// Props interface
interface CommunityChallengesProps {
  /** Initial challenges */
  initialChallenges?: any[];
  /** Whether to allow creating new challenges */
  allowCreate?: boolean;
  /** Whether to show filters */
  showFilters?: boolean;
  /** Whether to show search */
  showSearch?: boolean;
  /** Maximum number of challenges to show */
  maxChallenges?: number;
  /** Callback when a challenge is joined */
  onJoinChallenge?: (challengeId: string) => void;
  /** Callback when a challenge is left */
  onLeaveChallenge?: (challengeId: string) => void;
  /** Callback when a challenge is shared */
  onShareChallenge?: (challengeId: string, platform: string) => void;
  /** Callback when a new challenge is created */
  onCreateChallenge?: () => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * Filter type
 */
type FilterType = 'all' | 'active' | 'upcoming' | 'completed' | 'joined';

/**
 * Sort type
 */
type SortType = 'popular' | 'recent' | 'ending-soon' | 'progress';

/**
 * Community Challenges Component
 */
const CommunityChallenges: React.FC<CommunityChallengesProps> = ({
  initialChallenges = [],
  allowCreate = true,
  showFilters = true,
  showSearch = true,
  maxChallenges = 10,
  onJoinChallenge,
  onLeaveChallenge,
  onShareChallenge,
  onCreateChallenge,
  className = '',
}) => {
  const [challenges, setChallenges] = useState<any[]>(initialChallenges);
  const [filteredChallenges, setFilteredChallenges] = useState<any[]>(initialChallenges);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true);
    
    // Filter challenges
    let filtered = [...challenges];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(challenge => 
        challenge.title.toLowerCase().includes(query) || 
        challenge.description.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    switch (activeFilter) {
      case 'active':
        filtered = filtered.filter(challenge => {
          const now = new Date();
          return now >= new Date(challenge.startDate) && now <= new Date(challenge.endDate);
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(challenge => 
          new Date() < new Date(challenge.startDate)
        );
        break;
      case 'completed':
        filtered = filtered.filter(challenge => 
          challenge.progress >= challenge.goal || new Date() > new Date(challenge.endDate)
        );
        break;
      case 'joined':
        filtered = filtered.filter(challenge => 
          challenge.joined
        );
        break;
      default:
        // 'all' - no additional filtering
        break;
    }
    
    // Apply sorting
    switch (activeSort) {
      case 'popular':
        filtered.sort((a, b) => b.participantCount - a.participantCount);
        break;
      case 'recent':
        filtered.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        break;
      case 'ending-soon':
        filtered.sort((a, b) => {
          const aEndDate = new Date(a.endDate).getTime();
          const bEndDate = new Date(b.endDate).getTime();
          const now = Date.now();
          
          // Only consider challenges that haven't ended yet
          if (aEndDate < now && bEndDate < now) return 0;
          if (aEndDate < now) return 1;
          if (bEndDate < now) return -1;
          
          return aEndDate - bEndDate;
        });
        break;
      case 'progress':
        filtered.sort((a, b) => {
          const aProgress = a.progress / a.goal;
          const bProgress = b.progress / b.goal;
          return bProgress - aProgress;
        });
        break;
      default:
        break;
    }
    
    // Limit the number of challenges
    if (maxChallenges > 0) {
      filtered = filtered.slice(0, maxChallenges);
    }
    
    setFilteredChallenges(filtered);
    setIsLoading(false);
  }, [challenges, activeFilter, activeSort, searchQuery, maxChallenges]);
  
  // Handle joining a challenge
  const handleJoinChallenge = (challengeId: string) => {
    if (onJoinChallenge) {
      onJoinChallenge(challengeId);
    }
    
    // Update local state
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              joined: true, 
              participantCount: challenge.participantCount + 1 
            } 
          : challenge
      )
    );
  };
  
  // Handle leaving a challenge
  const handleLeaveChallenge = (challengeId: string) => {
    if (onLeaveChallenge) {
      onLeaveChallenge(challengeId);
    }
    
    // Update local state
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              joined: false, 
              participantCount: Math.max(0, challenge.participantCount - 1) 
            } 
          : challenge
      )
    );
  };
  
  // Handle sharing a challenge
  const handleShareChallenge = (challengeId: string, platform: string) => {
    if (onShareChallenge) {
      onShareChallenge(challengeId, platform);
    }
  };
  
  // Handle creating a new challenge
  const handleCreateChallenge = () => {
    if (onCreateChallenge) {
      onCreateChallenge();
    } else {
      toast({
        title: 'Create Challenge',
        description: 'This feature is not implemented yet.',
      });
    }
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Community Challenges
            </CardTitle>
            <CardDescription>
              Join challenges and compete with the community
            </CardDescription>
          </div>
          
          {allowCreate && (
            <Button onClick={handleCreateChallenge}>
              <Plus className="mr-2 h-4 w-4" />
              Create Challenge
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showFilters && (
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Tabs 
              value={activeFilter} 
              onValueChange={(value) => setActiveFilter(value as FilterType)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="joined">Joined</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search challenges..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem 
                    onClick={() => setActiveSort('popular')}
                    className={activeSort === 'popular' ? 'bg-gray-100' : ''}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Most Popular
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveSort('recent')}
                    className={activeSort === 'recent' ? 'bg-gray-100' : ''}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Recently Added
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveSort('ending-soon')}
                    className={activeSort === 'ending-soon' ? 'bg-gray-100' : ''}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Ending Soon
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveSort('progress')}
                    className={activeSort === 'progress' ? 'bg-gray-100' : ''}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Your Progress
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredChallenges.map((challenge) => (
              <CommunityChallenge
                key={challenge.id}
                id={challenge.id}
                title={challenge.title}
                description={challenge.description}
                startDate={new Date(challenge.startDate)}
                endDate={new Date(challenge.endDate)}
                goal={challenge.goal}
                goalUnit={challenge.goalUnit}
                progress={challenge.progress}
                participantCount={challenge.participantCount}
                joined={challenge.joined}
                type={challenge.type}
                difficulty={challenge.difficulty}
                creator={challenge.creator}
                topParticipants={challenge.topParticipants}
                userRank={challenge.userRank}
                onJoin={() => handleJoinChallenge(challenge.id)}
                onLeave={() => handleLeaveChallenge(challenge.id)}
                onShare={(platform: string) => handleShareChallenge(challenge.id, platform)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 mx-auto text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">No challenges found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery 
                ? `No challenges match your search for "${searchQuery}"`
                : `No ${activeFilter} challenges available`}
            </p>
            {allowCreate && (
              <Button className="mt-4" onClick={handleCreateChallenge}>
                <Plus className="mr-2 h-4 w-4" />
                Create a Challenge
              </Button>
            )}
          </div>
        )}
      </CardContent>
      
      {filteredChallenges.length > 0 && maxChallenges > 0 && challenges.length > maxChallenges && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Challenges
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CommunityChallenges;
