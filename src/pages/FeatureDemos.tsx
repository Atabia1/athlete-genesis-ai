
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Users, 
  ChevronRight, 
  Play 
} from 'lucide-react';
import FeatureDemo from '@/components/pricing/FeatureDemo';
import InjuryPreventionDemo from '@/components/pricing/InjuryPreventionDemo';
import DynamicPlanDemo from '@/components/pricing/DynamicPlanDemo';

export type SubscriptionTier = 'free' | 'pro' | 'elite';

export default function FeatureDemos() {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState<string>('ai-coaching');

  const demos = [
    {
      id: 'ai-coaching',
      title: 'AI Coaching Assistant',
      description: 'Experience personalized coaching powered by advanced AI',
      icon: Zap,
      tier: 'pro' as SubscriptionTier,
      component: FeatureDemo,
    },
    {
      id: 'injury-prevention',
      title: 'Injury Prevention System',
      description: 'Advanced biomechanical analysis to prevent injuries',
      icon: Shield,
      tier: 'elite' as SubscriptionTier,
      component: InjuryPreventionDemo,
    },
    {
      id: 'dynamic-plans',
      title: 'Dynamic Training Plans',
      description: 'Plans that adapt in real-time to your progress',
      icon: Users,
      tier: 'pro' as SubscriptionTier,
      component: DynamicPlanDemo,
    },
  ];

  const currentDemo = demos.find(demo => demo.id === activeDemo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Experience Our Premium Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Try our advanced AI-powered features in these interactive demonstrations. 
            See how AthleteGPT can transform your training experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Available Demos</CardTitle>
                <CardDescription>
                  Click on any demo to try it out
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demos.map((demo) => {
                  const Icon = demo.icon;
                  return (
                    <div
                      key={demo.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        activeDemo === demo.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveDemo(demo.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {demo.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {demo.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge 
                            variant={demo.tier === 'elite' ? 'default' : 'secondary'}
                          >
                            {demo.tier.toUpperCase()}
                          </Badge>
                          {activeDemo === demo.id && (
                            <Play className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ready to unlock these features?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upgrade to Pro or Elite to access all premium features and transform your training.
                </p>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="w-full"
                >
                  View Pricing Plans
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Demo Display */}
          <div className="lg:col-span-2">
            {currentDemo && (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <currentDemo.icon className="h-5 w-5" />
                        <span>{currentDemo.title}</span>
                      </CardTitle>
                      <CardDescription>
                        {currentDemo.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={currentDemo.tier === 'elite' ? 'default' : 'secondary'}
                    >
                      {currentDemo.tier.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <currentDemo.component />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Experience the Full Platform
              </h2>
              <p className="text-gray-600 mb-6">
                These demos showcase just a fraction of what AthleteGPT can do. 
                Sign up for a free account to explore all features and start your journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/signup')}
                  size="lg"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/pricing')}
                  size="lg"
                >
                  View All Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
