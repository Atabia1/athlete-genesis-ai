
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Zap, Shield, Brain } from 'lucide-react';
import { usePlan } from '@/context/PlanContext';

const FeatureDemo = () => {
  const { subscriptionTier } = usePlan();
  
  const performanceData = [
    { week: 'W1', performance: 65 },
    { week: 'W2', performance: 72 },
    { week: 'W3', performance: 78 },
    { week: 'W4', performance: 85 },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Coach",
      description: "Get personalized training advice",
      tier: "pro"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Deep performance insights",
      tier: "elite"
    },
    {
      icon: Zap,
      title: "Real-time Adaptation",
      description: "Plans that evolve with you",
      tier: "elite"
    },
    {
      icon: Shield,
      title: "Injury Prevention",
      description: "AI-powered risk assessment",
      tier: "coach"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Showcase</CardTitle>
          <CardDescription>
            Experience the power of AI-driven fitness coaching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai">AI Features</TabsTrigger>
              <TabsTrigger value="features">All Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium">Performance Score</h4>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold">85</span>
                      <span className="text-sm text-green-600">+23%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium">Recovery</h4>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold">92</span>
                      <span className="text-sm text-green-600">+8%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium">Consistency</h4>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold">78</span>
                      <span className="text-sm text-blue-600">+15%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-500" />
                    AI Coaching Insights
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    "Based on your recent performance, I recommend increasing your rest periods by 15% to optimize recovery."
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h4 className="font-medium">Form Analysis</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    AI detected slight hip drop during squats. Recommended exercises added to your warm-up.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-medium">Adaptation Recommendation</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Your strength gains suggest we can progress to the next phase 1 week early.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <feature.icon className="h-5 w-5 mr-3 mt-1 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                        </div>
                      </div>
                      <Badge variant={feature.tier === 'elite' ? 'default' : 'secondary'}>
                        {feature.tier}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-center">
            <Button>Upgrade to Access All Features</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureDemo;
