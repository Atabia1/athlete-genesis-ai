/**
 * AI Features Page
 *
 * This page showcases the AI-powered features available in the application.
 * It includes the AI Coach Chat and other AI-powered tools.
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Dumbbell, Utensils, AlertTriangle, Zap } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard';
import AICoachChat from '@/components/features/AICoachChat';
import { useServices } from '@/services/service-registry';

/**
 * AI Features Page
 *
 * This page showcases the AI-powered features available in the application.
 * It includes the AI Coach Chat and other AI-powered tools.
 */
const AIFeaturesPage = () => {
  const services = useServices();
  const [activeTab, setActiveTab] = useState('chat');

  // Check if OpenAI API is available
  const isOpenAIAvailable = services.openAI.isAvailable();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Features</h1>
            <p className="text-muted-foreground">
              Explore our AI-powered tools to enhance your fitness journey
            </p>
          </div>

          {!isOpenAIAvailable && (
            <Alert className="w-full md:w-auto bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle>API Key Not Configured</AlertTitle>
              <AlertDescription>
                OpenAI API key is not configured. Some features may be limited.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">AI Coach Chat</span>
              <span className="inline sm:hidden">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Workout Generator</span>
              <span className="inline sm:hidden">Workout</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <span className="hidden sm:inline">Nutrition Advisor</span>
              <span className="inline sm:hidden">Nutrition</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <AICoachChat hasAccess={true} />
          </TabsContent>

          <TabsContent value="workout" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>AI Workout Generator</CardTitle>
                    <CardDescription>Create personalized workout plans based on your goals</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Our AI can generate personalized workout plans based on your fitness goals, experience level, available equipment, and time constraints.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Personalized workout plans</li>
                      <li>• Adapts to your available equipment</li>
                      <li>• Considers your fitness level</li>
                      <li>• Targets your specific goals</li>
                      <li>• Includes warm-up and cool-down</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Benefits</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Save time planning workouts</li>
                      <li>• Get expert-level programming</li>
                      <li>• Avoid plateaus with varied routines</li>
                      <li>• Ensure proper exercise selection</li>
                      <li>• Track progress effectively</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Workout Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>AI Nutrition Advisor</CardTitle>
                    <CardDescription>Get personalized nutrition advice and meal plans</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Our AI can provide personalized nutrition advice and meal plans based on your fitness goals, dietary preferences, and restrictions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Personalized meal plans</li>
                      <li>• Macronutrient calculations</li>
                      <li>• Dietary restriction support</li>
                      <li>• Recipe suggestions</li>
                      <li>• Grocery lists</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Benefits</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Optimize nutrition for performance</li>
                      <li>• Support recovery and muscle growth</li>
                      <li>• Maintain energy levels</li>
                      <li>• Achieve body composition goals</li>
                      <li>• Simplify meal planning</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Meal Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AIFeaturesPage;
