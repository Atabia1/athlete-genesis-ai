
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  Sparkles,
  Lock
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Simple feature access component
const FeatureCard = ({ title, description, available, children }: {
  title: string;
  description: string;
  available: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Card className={`relative ${!available ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {children}
            {title}
          </CardTitle>
          {available ? (
            <Badge className="bg-green-100 text-green-800">Available</Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center">
              <Lock className="mr-1 h-3 w-3" />
              Pro Feature
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {available ? (
          <Button className="w-full">Try Now</Button>
        ) : (
          <Button variant="outline" className="w-full">
            Upgrade to Access
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function AIFeatures() {
  // Mock user access - in real app this would come from context/props
  const hasProAccess = false;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Features</h1>
          <p className="text-gray-600 mt-2">
            Enhance your fitness journey with AI-powered insights and coaching
          </p>
        </div>

        {/* Feature status alert */}
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            {hasProAccess 
              ? "You have access to all AI features. Start exploring below!"
              : "Upgrade to Pro to unlock advanced AI features and personalized coaching."
            }
          </AlertDescription>
        </Alert>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="AI Coach Chat"
            description="Get personalized fitness advice and answers to your questions 24/7"
            available={true}
          >
            <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
          </FeatureCard>

          <FeatureCard
            title="Smart Analytics"
            description="AI-powered analysis of your workout patterns and progress"
            available={hasProAccess}
          >
            <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
          </FeatureCard>

          <FeatureCard
            title="Goal Optimization"
            description="AI recommendations to optimize your fitness goals and routines"
            available={hasProAccess}
          >
            <Target className="mr-2 h-5 w-5 text-purple-600" />
          </FeatureCard>

          <FeatureCard
            title="Workout Generation"
            description="Generate custom workouts based on your preferences and goals"
            available={hasProAccess}
          >
            <Bot className="mr-2 h-5 w-5 text-orange-600" />
          </FeatureCard>

          <FeatureCard
            title="Form Analysis"
            description="AI-powered form checking and exercise technique feedback"
            available={hasProAccess}
          >
            <Sparkles className="mr-2 h-5 w-5 text-pink-600" />
          </FeatureCard>

          <FeatureCard
            title="Nutrition Insights"
            description="Personalized nutrition recommendations based on your goals"
            available={hasProAccess}
          >
            <TrendingUp className="mr-2 h-5 w-5 text-teal-600" />
          </FeatureCard>
        </div>

        {/* Upgrade CTA */}
        {!hasProAccess && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-blue-600" />
                Unlock AI Features
              </CardTitle>
              <CardDescription>
                Get access to all AI-powered features and transform your fitness journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button>Upgrade to Pro</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
