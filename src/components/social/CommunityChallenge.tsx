
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Trophy,
  Target,
  Timer,
  Medal,
  Star,
  TrendingUp
} from 'lucide-react';

const CommunityChallenge = () => {
  const challenges = [
    {
      id: 1,
      title: '30-Day Consistency Challenge',
      description: 'Complete at least 20 minutes of exercise every day for 30 days',
      participants: 245,
      progress: 73,
      daysLeft: 12,
      reward: '100 pts + Badge',
      difficulty: 'Medium',
      category: 'Consistency',
      userProgress: 22,
      totalDays: 30,
      status: 'active'
    },
    {
      id: 2,
      title: 'January Step Challenge',
      description: 'Walk 300,000 steps this month',
      participants: 189,
      progress: 85,
      daysLeft: 5,
      reward: '150 pts + Trophy',
      difficulty: 'Easy',
      category: 'Cardio',
      userProgress: 255000,
      target: 300000,
      status: 'active'
    },
    {
      id: 3,
      title: 'Strength Building Week',
      description: 'Complete 5 strength training sessions this week',
      participants: 156,
      progress: 60,
      daysLeft: 3,
      reward: '80 pts + Medal',
      difficulty: 'Hard',
      category: 'Strength',
      userProgress: 3,
      target: 5,
      status: 'active'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah M.', points: 2450, avatar: '/placeholder-avatar.jpg' },
    { rank: 2, name: 'Mike R.', points: 2380, avatar: '/placeholder-avatar.jpg' },
    { rank: 3, name: 'You', points: 2210, avatar: '/placeholder-avatar.jpg', isUser: true },
    { rank: 4, name: 'Lisa K.', points: 2150, avatar: '/placeholder-avatar.jpg' },
    { rank: 5, name: 'Tom H.', points: 2100, avatar: '/placeholder-avatar.jpg' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatProgress = (challenge: any) => {
    if (challenge.id === 2) {
      return `${(challenge.userProgress / 1000).toFixed(0)}k / ${(challenge.target / 1000).toFixed(0)}k steps`;
    }
    return `${challenge.userProgress} / ${challenge.target || challenge.totalDays}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Challenges */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Community Challenges
              </CardTitle>
              <CardDescription>
                Join fitness challenges and compete with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty}
                            </Badge>
                            <Badge variant="outline">{challenge.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-600">
                            <Timer className="h-4 w-4 mr-1" />
                            {challenge.daysLeft} days left
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {challenge.participants} participants
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Your Progress</span>
                          <span>{formatProgress(challenge)}</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{challenge.reward}</span>
                        </div>
                        <Button size="sm">
                          {challenge.progress > 0 ? 'Continue' : 'Join Challenge'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">View All Challenges</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Medal className="h-5 w-5 mr-2" />
                Leaderboard
              </CardTitle>
              <CardDescription>
                Top performers this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      user.isUser ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      {user.rank <= 3 ? (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          user.rank === 1 ? 'bg-yellow-500' :
                          user.rank === 2 ? 'bg-gray-400' :
                          'bg-amber-600'
                        }`}>
                          {user.rank}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">#{user.rank}</span>
                      )}
                    </div>
                    
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${user.isUser ? 'text-blue-700' : ''}`}>
                        {user.name}
                      </p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs text-gray-600">{user.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">View Full Leaderboard</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Challenges Completed</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Points</span>
                  <span className="font-medium">2,210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Current Rank</span>
                  <span className="font-medium">#3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Badges Earned</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityChallenge;
