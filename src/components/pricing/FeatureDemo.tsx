import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Users, 
  Activity, 
  MessageSquare, 
  BarChart2, 
  Dumbbell, 
  Utensils,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Heart,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePlan, SubscriptionTier } from '@/context/PlanContext';
import { cn } from '@/lib/utils';

/**
 * FeatureDemo: Interactive demo component for premium features
 * 
 * This component allows users to "test drive" premium features
 * without actually subscribing. It showcases the key features
 * of each subscription tier.
 */

interface FeatureDemoProps {
  /** The subscription tier to showcase */
  tier: SubscriptionTier;
}

export const FeatureDemo = ({ tier }: FeatureDemoProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { subscriptionTier } = usePlan();
  
  // Check if the user already has this tier
  const hasTier = subscriptionTier === tier || 
    (tier === 'pro' && subscriptionTier === 'coach') || 
    (tier === 'pro' && subscriptionTier === 'elite') || 
    (tier === 'coach' && subscriptionTier === 'elite');
  
  // Get tier-specific colors and icons
  const getTierColor = () => {
    switch (tier) {
      case 'pro':
        return 'blue';
      case 'coach':
        return 'orange';
      case 'elite':
        return 'purple';
      default:
        return 'gray';
    }
  };
  
  const getTierIcon = () => {
    switch (tier) {
      case 'pro':
        return <Zap className="h-5 w-5" />;
      case 'coach':
        return <Users className="h-5 w-5" />;
      case 'elite':
        return <Brain className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };
  
  // Get tier-specific demo content
  const getDemoContent = () => {
    switch (tier) {
      case 'pro':
        return <ProTierDemo />;
      case 'coach':
        return <CoachTierDemo />;
      case 'elite':
        return <EliteTierDemo />;
      default:
        return <FreeTierDemo />;
    }
  };
  
  const color = getTierColor();
  const icon = getTierIcon();
  
  return (
    <Card className={`border-${color}-200 shadow-md`}>
      <CardHeader className={`bg-${color}-50 border-b border-${color}-100`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
              {icon}
            </div>
            {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier Demo
          </CardTitle>
          <Badge className={`bg-${color}-100 text-${color}-800 hover:bg-${color}-100`}>
            Try Before You Buy
          </Badge>
        </div>
        <CardDescription>
          Experience the key features of the {tier.charAt(0).toUpperCase() + tier.slice(1)} subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="overview" className={`data-[state=active]:bg-${color}-50 data-[state=active]:text-${color}-800`}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="demo" className={`data-[state=active]:bg-${color}-50 data-[state=active]:text-${color}-800`}>
              Interactive Demo
            </TabsTrigger>
            <TabsTrigger value="features" className={`data-[state=active]:bg-${color}-50 data-[state=active]:text-${color}-800`}>
              Features
            </TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-4">
                <div className={`p-4 bg-${color}-50 rounded-lg border border-${color}-100`}>
                  <h3 className={`text-lg font-medium text-${color}-800 mb-2 flex items-center gap-2`}>
                    {icon}
                    About {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
                  </h3>
                  <p className="text-gray-600">
                    {tier === 'pro' && "The Pro Athlete tier is designed for serious athletes who want structured, sport-specific training plans and advanced analytics."}
                    {tier === 'coach' && "The Coach Pro tier is designed for coaches managing multiple athletes, with team analytics and collaboration tools."}
                    {tier === 'elite' && "The Elite AI tier offers our most advanced features, including real-time AI coaching, dynamic plan adaptation, and personalized recommendations."}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {tier === 'pro' && (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Sport-specific plans for 50+ sports</p>
                            <p className="text-sm text-gray-500">Tailored to your specific sport</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Equipment-aware workout customization</p>
                            <p className="text-sm text-gray-500">Workouts adapted to available equipment</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Advanced analytics dashboard</p>
                            <p className="text-sm text-gray-500">Detailed performance tracking</p>
                          </div>
                        </li>
                      </>
                    )}
                    
                    {tier === 'coach' && (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Team management for up to 20 athletes</p>
                            <p className="text-sm text-gray-500">Manage your entire team</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Team analytics and benchmarks</p>
                            <p className="text-sm text-gray-500">Compare performance across your team</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">AI-Generated Drill Libraries</p>
                            <p className="text-sm text-gray-500">Access sport-specific drills</p>
                          </div>
                        </li>
                      </>
                    )}
                    
                    {tier === 'elite' && (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Instant AI Chat (Athlete GPT)</p>
                            <p className="text-sm text-gray-500">Get answers to any training question</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Dynamic plan editing via chat</p>
                            <p className="text-sm text-gray-500">Modify your plans on the fly</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">AI-Powered Form Check</p>
                            <p className="text-sm text-gray-500">Get feedback on your technique</p>
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="demo" className="mt-0">
              {getDemoContent()}
            </TabsContent>
            
            <TabsContent value="features" className="mt-0">
              <div className="space-y-4">
                <h3 className="font-medium">Complete Feature List:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tier === 'pro' && (
                    <>
                      <FeatureItem icon={Dumbbell} title="Sport-specific plans" description="For 50+ sports" />
                      <FeatureItem icon={Activity} title="Equipment-aware customization" description="Adapt to your gear" />
                      <FeatureItem icon={BarChart2} title="Advanced analytics" description="Detailed performance tracking" />
                      <FeatureItem icon={Utensils} title="Personalized nutrition" description="Tailored meal plans" />
                      <FeatureItem icon={Heart} title="Advanced recovery metrics" description="Track 10+ wellbeing metrics" />
                      <FeatureItem icon={MessageSquare} title="Basic AI Chat" description="Pre-set queries" />
                    </>
                  )}
                  
                  {tier === 'coach' && (
                    <>
                      <FeatureItem icon={Users} title="Team management" description="Up to 20 athletes" />
                      <FeatureItem icon={BarChart2} title="Team analytics" description="Performance benchmarks" />
                      <FeatureItem icon={Dumbbell} title="AI-Generated Drills" description="Sport-specific libraries" />
                      <FeatureItem icon={Clock} title="Team scheduling" description="Calendar management" />
                      <FeatureItem icon={MessageSquare} title="Team messaging" description="Group and individual chats" />
                      <FeatureItem icon={Activity} title="Priority support" description="24-hour response time" />
                    </>
                  )}
                  
                  {tier === 'elite' && (
                    <>
                      <FeatureItem icon={Brain} title="AI Coach Chat" description="Instant answers" />
                      <FeatureItem icon={Sparkles} title="Dynamic plan editing" description="Modify plans via chat" />
                      <FeatureItem icon={Activity} title="AI Form Check" description="Technique analysis" />
                      <FeatureItem icon={Heart} title="Recovery Optimization" description="24/7 monitoring" />
                      <FeatureItem icon={BarChart2} title="Predictive analytics" description="Performance forecasting" />
                      <FeatureItem icon={Utensils} title="AI Nutrition Optimization" description="Real-time adjustments" />
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className={`bg-${color}-50 border-t border-${color}-100 p-4`}>
        {hasTier ? (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => navigate('/dashboard')}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            You Already Have Access
          </Button>
        ) : (
          <Button 
            className={`w-full bg-${color}-600 hover:bg-${color}-700`}
            onClick={() => navigate('/dashboard/subscription')}
          >
            <Zap className="mr-2 h-4 w-4" />
            Upgrade to {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Feature item component
const FeatureItem = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any; 
  title: string; 
  description: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
    <div className="p-2 rounded-full bg-gray-100">
      <Icon className="h-4 w-4 text-gray-600" />
    </div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

// Demo components for each tier
const FreeTierDemo = () => (
  <div className="space-y-4">
    <div className="p-4 bg-gray-50 rounded-lg border">
      <h3 className="font-medium mb-2">Basic Workout Plan</h3>
      <p className="text-sm text-gray-600 mb-3">
        Free tier includes basic workout plans with limited customization.
      </p>
      <div className="space-y-2">
        <div className="p-2 bg-white rounded border">
          <div className="flex justify-between items-center">
            <span className="font-medium">Monday</span>
            <Badge variant="outline">30 min</Badge>
          </div>
          <p className="text-sm text-gray-500">Basic Strength Training</p>
        </div>
        <div className="p-2 bg-white rounded border">
          <div className="flex justify-between items-center">
            <span className="font-medium">Wednesday</span>
            <Badge variant="outline">30 min</Badge>
          </div>
          <p className="text-sm text-gray-500">Cardio Session</p>
        </div>
        <div className="p-2 bg-white rounded border">
          <div className="flex justify-between items-center">
            <span className="font-medium">Friday</span>
            <Badge variant="outline">30 min</Badge>
          </div>
          <p className="text-sm text-gray-500">Full Body Workout</p>
        </div>
      </div>
    </div>
    <div className="text-center">
      <p className="text-sm text-gray-500 mb-2">
        Upgrade to Pro, Coach, or Elite for more advanced features
      </p>
      <Button variant="outline" onClick={() => {}}>
        See Premium Features
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
);

const ProTierDemo = () => (
  <div className="space-y-4">
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="font-medium mb-2 text-blue-800">Sport-Specific Training</h3>
      <div className="space-y-3">
        <div className="p-3 bg-white rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Running Program</span>
            <Badge className="bg-blue-100 text-blue-800">Pro Feature</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Personalized 10K training plan based on your current fitness level.
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progress: Week 3 of 8</span>
            <span className="text-blue-600 font-medium">38% Complete</span>
          </div>
          <Progress value={38} className="h-2 mt-1" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Advanced Analytics</span>
            </div>
            <p className="text-xs text-gray-500">
              Track pace, distance, heart rate zones, and more
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Dumbbell className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Equipment-Aware</span>
            </div>
            <p className="text-xs text-gray-500">
              Workouts adapted to your available gear
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <Button className="w-full bg-blue-600 hover:bg-blue-700">
      Try Pro Features Now
    </Button>
  </div>
);

const CoachTierDemo = () => (
  <div className="space-y-4">
    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
      <h3 className="font-medium mb-2 text-orange-800">Team Management</h3>
      <div className="space-y-3">
        <div className="p-3 bg-white rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Team Overview</span>
            <Badge className="bg-orange-100 text-orange-800">Coach Feature</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xl font-bold text-orange-600">12</div>
              <div className="text-xs text-gray-500">Athletes</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xl font-bold text-orange-600">8</div>
              <div className="text-xs text-gray-500">Workouts</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xl font-bold text-orange-600">85%</div>
              <div className="text-xs text-gray-500">Completion</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Manage your entire team from a single dashboard
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Team Analytics</span>
            </div>
            <p className="text-xs text-gray-500">
              Compare performance across athletes
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Athlete Management</span>
            </div>
            <p className="text-xs text-gray-500">
              Individual training plans for each athlete
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <Button className="w-full bg-orange-600 hover:bg-orange-700">
      Try Coach Features Now
    </Button>
  </div>
);

const EliteTierDemo = () => (
  <div className="space-y-4">
    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
      <h3 className="font-medium mb-2 text-purple-800">AI Coach Chat</h3>
      <div className="space-y-3">
        <div className="p-3 bg-white rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Chat with Athlete GPT</span>
            <Badge className="bg-purple-100 text-purple-800">Elite Feature</Badge>
          </div>
          <div className="space-y-2 mb-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-sm">How should I adjust my training if I'm feeling fatigued?</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-1 mb-1">
                <Brain className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">AI Coach</span>
              </div>
              <p className="text-sm text-purple-700">
                Based on your recent training data, I recommend reducing intensity by 20% today and focusing on recovery. Your sleep metrics show you've been averaging only 6 hours, which may contribute to fatigue.
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Get personalized advice based on your data
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Dynamic Plans</span>
            </div>
            <p className="text-xs text-gray-500">
              Modify workouts on the fly via chat
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Recovery Optimization</span>
            </div>
            <p className="text-xs text-gray-500">
              24/7 monitoring and recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <Button className="w-full bg-purple-600 hover:bg-purple-700">
      Try Elite Features Now
    </Button>
  </div>
);

export default FeatureDemo;
