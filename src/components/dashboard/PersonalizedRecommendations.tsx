
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  Brain,
  Star, 
  ArrowRight,
  BarChart, 
  Heart,
  Calendar
} from 'lucide-react';

// Recommendation type definition
interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'nutrition' | 'sleep' | 'recovery';
  impact: 'high' | 'medium' | 'low';
  based_on: string[];
  action: string;
  applied: boolean;
}

// Sample data
const sampleInsights = [
  {
    id: 'ins1',
    title: 'Sleep Duration Impact',
    description: 'Your workout performance is 35% better on days following 7+ hours of sleep.',
    data_point: '7.5h avg. sleep → better performance',
    days_tracked: 32,
    type: 'correlation',
    category: 'sleep',
    source: 'sleep-workout data'
  },
  {
    id: 'ins2',
    title: 'Recovery Pattern',
    description: 'Your recovery takes 15% longer after high-intensity leg workouts.',
    data_point: '36h vs 30h recovery time',
    days_tracked: 45,
    type: 'pattern',
    category: 'recovery',
    source: 'workout history'
  },
  {
    id: 'ins3',
    title: 'Nutrition Impact',
    description: 'Higher protein intake (>120g) correlates with 20% better strength gains.',
    data_point: '120g+ protein → better gains',
    days_tracked: 60,
    type: 'correlation',
    category: 'nutrition',
    source: 'nutrition-workout data'
  }
];

/**
 * PersonalizedRecommendations Component
 * 
 * Displays personalized recommendations and insights based on user data
 */
const PersonalizedRecommendations = ({ className = '' }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 'rec1',
      title: 'Add a recovery day',
      description: 'Based on your recent training intensity, we recommend adding an extra recovery day this week.',
      category: 'recovery',
      impact: 'high',
      based_on: ['recent workout intensity', 'heart rate recovery data'],
      action: 'Modify schedule',
      applied: false
    },
    {
      id: 'rec2',
      title: 'Increase protein intake',
      description: 'To support your muscle growth goals, aim for 1.8g of protein per kg of body weight daily.',
      category: 'nutrition',
      impact: 'medium',
      based_on: ['current nutrition logs', 'workout type', 'body composition goals'],
      action: 'View meal plan',
      applied: false
    },
    {
      id: 'rec3',
      title: 'Try interval training',
      description: 'Adding 2 HIIT sessions per week could help you break through your current fitness plateau.',
      category: 'workout',
      impact: 'high',
      based_on: ['progress data', 'fitness assessment', 'goal timeline'],
      action: 'Add to plan',
      applied: false
    },
    {
      id: 'rec4',
      title: 'Improve sleep quality',
      description: 'Your sleep data shows interrupted sleep patterns. Try reducing screen time 1 hour before bed.',
      category: 'sleep',
      impact: 'medium',
      based_on: ['sleep tracking data', 'performance correlation'],
      action: 'Learn more',
      applied: false
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('recommendations');
  
  // Apply a recommendation
  const handleApplyRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, applied: true } : rec
    ));
  };
  
  // Get color for impact badge
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  // Get icon for category
  const getCategoryIcon = (category: 'workout' | 'nutrition' | 'sleep' | 'recovery') => {
    switch (category) {
      case 'workout':
        return <Star className="h-4 w-4 text-orange-500" />;
      case 'nutrition':
        return <BarChart className="h-4 w-4 text-green-500" />;
      case 'sleep':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'recovery':
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Star className="h-5 w-5 text-yellow-500 mr-2" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          AI-powered suggestions based on your data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="insights">Data Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.filter(r => !r.applied).length === 0 ? (
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-gray-500 mt-1">
                  You've applied all recommendations. Check back later for more personalized advice.
                </p>
              </div>
            ) : (
              recommendations.filter(r => !r.applied).map(recommendation => (
                <Card key={recommendation.id} className="overflow-hidden border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(recommendation.category)}
                        <h3 className="font-semibold">{recommendation.title}</h3>
                      </div>
                      <Badge variant="outline" className={getImpactColor(recommendation.impact)}>
                        {recommendation.impact} impact
                      </Badge>
                    </div>
                    
                    <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                      {recommendation.description}
                    </p>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-2">Based on: {recommendation.based_on.join(', ')}</div>
                      <div className="flex justify-end">
                        <Button 
                          size="sm"
                          onClick={() => handleApplyRecommendation(recommendation.id)}
                        >
                          {recommendation.action}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {recommendations.filter(r => r.applied).length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Applied Recommendations</h3>
                
                {recommendations.filter(r => r.applied).map(recommendation => (
                  <div key={recommendation.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(recommendation.category)}
                      <span className="text-sm text-gray-600 dark:text-gray-300">{recommendation.title}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      Applied
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-6">
              {sampleInsights.map(insight => (
                <div key={insight.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-base">{insight.title}</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      {insight.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {insight.description}
                  </p>
                  
                  <div className="flex justify-between text-xs text-gray-500 pt-1">
                    <span>Key finding: {insight.data_point}</span>
                    <span>Based on {insight.days_tracked} days of data</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg mt-6">
              <h3 className="text-sm font-medium text-blue-800">About Data Insights</h3>
              <p className="text-xs text-blue-700 mt-1">
                These insights are generated by analyzing patterns and correlations in your workout, nutrition, sleep, and recovery data. The more data you log, the more accurate these insights become.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
