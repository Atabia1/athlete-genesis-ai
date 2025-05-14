
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Activity, Clock, Zap, AlertTriangle, Brain, Sparkles, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DynamicPlanDemo = () => {
  const [demoState, setDemoState] = useState<'initial' | 'modified'>('initial');
  const [activeTab, setActiveTab] = useState('workout');

  return (
    <div className="rounded-lg border border-purple-200 bg-card p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Elite AI Features</h3>
          <p className="text-muted-foreground">Experience the power of AI-driven personalization</p>
        </div>
        <Badge className="bg-purple-600">Elite Exclusive</Badge>
      </div>

      <Tabs defaultValue="workout" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="workout" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
            <Zap className="h-4 w-4 mr-2" />
            Dynamic Workouts
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Coach Chat
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
            <Brain className="h-4 w-4 mr-2" />
            Performance Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card className="h-full border-purple-200">
                <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Your Logged Data
                  </CardTitle>
                  <CardDescription>Real-time metrics from your devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                      <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        Recovery Alert
                      </div>
                      <p className="text-sm text-amber-700">Your sleep quality score dropped to 65% last night.</p>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Sleep Duration</span>
                      </div>
                      <span className="font-medium">5.5 hours</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Muscle Soreness</span>
                      </div>
                      <span className="font-medium">High (7/10)</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Energy Level</span>
                      </div>
                      <span className="font-medium">Low (3/10)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full border-purple-200">
                <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    {demoState === 'initial' ? 'Original Workout Plan' : 'AI-Adjusted Workout'}
                  </CardTitle>
                  <CardDescription>
                    {demoState === 'initial' ? 'Your scheduled training' : 'Personalized based on your data'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {demoState === 'initial' ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <div className="font-medium mb-1">High-Intensity Leg Day</div>
                        <p className="text-sm text-gray-600">Heavy squats, lunges, and plyometric exercises</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-gray-100">60 min</Badge>
                          <Badge variant="outline" className="bg-gray-100">High intensity</Badge>
                        </div>
                      </div>

                      <Button
                        onClick={() => setDemoState('modified')}
                        className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        See AI Adaptation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 rounded-md border border-green-200">
                        <div className="font-medium mb-1 text-green-700">Recovery-Focused Session</div>
                        <p className="text-sm text-green-700">Light mobility work and gentle stretching</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-green-100 text-green-700">30 min</Badge>
                          <Badge variant="outline" className="bg-green-100 text-green-700">Low intensity</Badge>
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-700">AI Coach Note</span>
                        </div>
                        <div className="text-sm text-purple-700">
                          Your workout has been modified based on your recovery data.
                          Focus on restoration today to prevent injury and improve long-term performance.
                        </div>
                      </div>

                      <Button
                        onClick={() => setDemoState('initial')}
                        variant="outline"
                        className="w-full border-purple-200 text-purple-700 flex items-center justify-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        View Original Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <Card className="border-purple-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                AI Coach Chat
              </CardTitle>
              <CardDescription>Get instant answers from your personal AI coach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-sm font-medium">You</p>
                  <p className="text-sm mt-1">I'm feeling some knee pain after yesterday's run. What should I do?</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-700">AI Coach</p>
                  </div>
                  <div className="text-sm text-purple-700">
                    Based on your recent training data, I recommend:
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Rest from running for 48 hours</li>
                      <li>Apply ice for 15 minutes every 3-4 hours</li>
                      <li>Try gentle mobility exercises I've added to your recovery plan</li>
                      <li>Consider your running shoes - they may need replacement (yours have logged 450 miles)</li>
                    </ol>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-sm font-medium">You</p>
                  <p className="text-sm mt-1">Can you suggest alternative cardio that won't stress my knees?</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-700">AI Coach</p>
                  </div>
                  <div className="text-sm text-purple-700">
                    Absolutely! Here are low-impact alternatives based on your preferences and available equipment:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Swimming (you mentioned having pool access)</li>
                      <li>Cycling with proper bike fit</li>
                      <li>Elliptical training</li>
                      <li>Rowing (great for full-body conditioning)</li>
                    </ul>
                    I've created a 30-minute low-impact cardio session for tomorrow. Would you like to see it?
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-0">
          <Card className="border-purple-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Performance Insights
              </CardTitle>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-700">Performance Prediction</span>
                  </div>
                  <p className="text-sm text-purple-700 mb-2">
                    Based on your training patterns, you're on track for a 5% improvement in your 10K time by next month.
                  </p>
                  <div className="bg-white p-2 rounded border border-purple-100">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Current: 48:30</span>
                      <span>Predicted: 46:05</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full w-[95%]"></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-700">Training Balance</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your training is currently 70% cardio, 20% strength, and 10% flexibility.
                    For your goals, I recommend increasing strength work to 30% for better overall performance.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-700">Recovery Optimization</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Your recovery metrics show a pattern of insufficient sleep on Wednesdays and Thursdays.
                    Shifting your intense workouts to Monday/Tuesday could improve your overall performance by 8-12%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DynamicPlanDemo;
