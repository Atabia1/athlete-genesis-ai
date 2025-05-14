import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Heart, 
  Footprints, 
  Moon, 
  Dumbbell, 
  Scale,
  Droplets,
  Lungs,
  Info,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { HealthData } from '@/integrations/health-apps/types';
import { calculateHealthScore } from '@/utils/health-score-calculator';

interface HealthScoreCardProps {
  /** Health data to visualize */
  healthData: HealthData;
  /** Optional className for styling */
  className?: string;
}

/**
 * Health Score Card Component
 * 
 * Displays a comprehensive health score based on various health metrics
 * and provides a radar chart visualization of different health dimensions.
 */
const HealthScoreCard = ({ healthData, className = '' }: HealthScoreCardProps) => {
  const [score, setScore] = useState({ total: 0, components: {} });
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [radarData, setRadarData] = useState<any[]>([]);
  
  useEffect(() => {
    // Calculate health score
    const calculatedScore = calculateHealthScore(healthData);
    setScore(calculatedScore);
    
    // Generate radar chart data
    const data = [
      { subject: 'Activity', A: calculatedScore.components.activity || 0, fullMark: 100 },
      { subject: 'Heart', A: calculatedScore.components.heart || 0, fullMark: 100 },
      { subject: 'Sleep', A: calculatedScore.components.sleep || 0, fullMark: 100 },
      { subject: 'Nutrition', A: calculatedScore.components.nutrition || 0, fullMark: 100 },
      { subject: 'Weight', A: calculatedScore.components.weight || 0, fullMark: 100 },
      { subject: 'Vitals', A: calculatedScore.components.vitals || 0, fullMark: 100 },
    ];
    setRadarData(data);
    
    // Determine trend (in a real app, this would compare to historical data)
    // For demo purposes, we'll randomly assign a trend
    const trends = ['up', 'down', 'stable'] as const;
    setTrend(trends[Math.floor(Math.random() * trends.length)]);
  }, [healthData]);
  
  // Get trend icon
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'stable':
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get score color
  const getScoreColor = () => {
    if (score.total >= 80) return 'text-green-500';
    if (score.total >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Get score description
  const getScoreDescription = () => {
    if (score.total >= 80) return 'Excellent';
    if (score.total >= 70) return 'Very Good';
    if (score.total >= 60) return 'Good';
    if (score.total >= 50) return 'Fair';
    return 'Needs Improvement';
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Health Score</CardTitle>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          A comprehensive measure of your overall health
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40 * score.total / 100} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor()}`}>{Math.round(score.total)}</span>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500 mr-1">{getScoreDescription()}</span>
                  {getTrendIcon()}
                </div>
              </div>
            </div>
            
            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="text-sm">Activity</span>
                </div>
                <span className="text-sm font-medium">{score.components.activity || 0}</span>
              </div>
              <Progress value={score.components.activity || 0} className="h-1.5" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-red-500" />
                  <span className="text-sm">Heart</span>
                </div>
                <span className="text-sm font-medium">{score.components.heart || 0}</span>
              </div>
              <Progress value={score.components.heart || 0} className="h-1.5" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Moon className="h-4 w-4 mr-1 text-purple-500" />
                  <span className="text-sm">Sleep</span>
                </div>
                <span className="text-sm font-medium">{score.components.sleep || 0}</span>
              </div>
              <Progress value={score.components.sleep || 0} className="h-1.5" />
            </div>
          </div>
          
          {/* Radar Chart */}
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Health Dimensions"
                  dataKey="A"
                  stroke="#3F51B5"
                  fill="#3F51B5"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Health Insights</h4>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <Activity className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Your activity level is above average</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Keep up the good work! Try to maintain consistency in your daily activity.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-start">
                <Moon className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Your sleep quality could be improved</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Try to establish a consistent sleep schedule and aim for 7-8 hours of sleep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreCard;
