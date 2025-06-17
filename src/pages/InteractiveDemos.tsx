
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Brain, 
  Camera, 
  Zap, 
  Heart, 
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIChatDemo from '@/components/demos/AIChatDemo';
import AIFormCheckDemo from '@/components/demos/AIFormCheckDemo';
import { usePlan } from '@/context/PlanContext';
import { 
  trackPageView, 
  trackFeatureUsage, 
  EventAction 
} from '@/utils/analytics';

/**
 * InteractiveDemos: Page for showcasing interactive feature demos
 * 
 * This page allows users to try out premium features before subscribing.
 * It includes interactive demos for AI Coach Chat, AI Form Check, and more.
 */

const InteractiveDemos = () => {
  const [activeDemo, setActiveDemo] = useState<string>('ai-chat');
  const navigate = useNavigate();
  const { subscriptionTier } = usePlan();
  
  // Track page view
  useState(() => {
    trackPageView('Interactive Demos', undefined, {
      active_demo: activeDemo,
      subscription_tier: subscriptionTier
    });
  });
  
  // Handle demo change
  const handleDemoChange = (demo: string) => {
    setActiveDemo(demo);
    
    // Track feature usage
    trackFeatureUsage(
      demo === 'ai-chat' 
        ? 'ai_advanced_chat' 
        : demo === 'form-check' 
          ? 'ai_form_check' 
          : 'ai_recovery_optimization',
      EventAction.FEATURE_VIEWED,
      { is_demo: true }
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container px-4 py-16 mx-auto flex-grow">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            Try Elite AI Features
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Experience the power of our premium features before you subscribe
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs 
            defaultValue="ai-chat" 
            value={activeDemo} 
            onValueChange={handleDemoChange}
            className="mb-12"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger 
                  value="ai-chat"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="form-check"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Form Check
                </TabsTrigger>
                <TabsTrigger 
                  value="recovery"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Recovery
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="ai-chat" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <AIChatDemo />
                </div>
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        AI Coach Chat
                      </CardTitle>
                      <CardDescription>
                        Your personal AI training assistant
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">
                        AI Coach Chat gives you instant access to personalized training advice, 
                        nutrition guidance, and recovery strategies - 24/7.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Personalized training recommendations</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Nutrition and meal planning advice</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Recovery optimization strategies</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Injury prevention and management</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Real-time workout modifications</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700">
                          <strong>Pro Tip:</strong> Try asking about workout plans, nutrition advice, 
                          recovery strategies, or injury prevention.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate('/dashboard/subscription')}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade to Elite AI
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="form-check" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <AIFormCheckDemo />
                </div>
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-purple-600" />
                        AI Form Check
                      </CardTitle>
                      <CardDescription>
                        Get expert feedback on your technique
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">
                        AI Form Check analyzes your exercise technique and provides detailed feedback 
                        to help you improve form, reduce injury risk, and maximize results.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Detailed form analysis for 30+ exercises</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Personalized correction recommendations</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Injury risk assessment</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Progress tracking over time</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Technique comparison with ideal form</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700">
                          <strong>Pro Tip:</strong> Try uploading a video of your squat, deadlift, 
                          or bench press form to get detailed feedback.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate('/dashboard/subscription')}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade to Elite AI
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recovery" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card className="w-full">
                    <CardHeader className="pb-3 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                            <Heart className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>Recovery Optimization</CardTitle>
                            <CardDescription>24/7 recovery monitoring and recommendations</CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Elite Feature
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Recovery Demo Coming Soon</h3>
                        <p className="text-gray-600 mb-4">
                          We're working on an interactive demo of our Recovery Optimization feature.
                          Check back soon to try it out!
                        </p>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => navigate('/dashboard/subscription')}
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Upgrade to Elite AI
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-purple-600" />
                        Recovery Optimization
                      </CardTitle>
                      <CardDescription>
                        Maximize recovery and performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Recovery Optimization uses AI to analyze your training data, sleep patterns, 
                        and biometrics to provide personalized recovery recommendations.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>24/7 recovery monitoring</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Sleep quality analysis</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Personalized recovery protocols</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Training load management</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                            <span>Nutrition recommendations for recovery</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700">
                          <strong>Coming Soon:</strong> Interactive demo of our Recovery Optimization 
                          feature with real-time recommendations.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate('/dashboard/subscription')}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade to Elite AI
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Button 
              variant="outline" 
              onClick={() => navigate('/pricing')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Pricing
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/subscription')}
              className="bg-purple-600 hover:bg-purple-700 flex items-center"
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InteractiveDemos;
