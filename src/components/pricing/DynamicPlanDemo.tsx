
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Activity, Clock, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DynamicPlanDemo = () => {
  const [demoState, setDemoState] = useState<'initial' | 'modified'>('initial');
  
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">Dynamic Plan Adaptation</h3>
          <p className="text-muted-foreground">AI-powered training adjustments based on your real-time data</p>
        </div>
        <Badge className="bg-athleteBlue-600">Elite Feature</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-athleteBlue-600" />
                Your Logged Data
              </CardTitle>
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
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-athleteBlue-600" />
                {demoState === 'initial' ? 'Original Workout Plan' : 'AI-Adjusted Workout'}
              </CardTitle>
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
                    className="w-full bg-athleteBlue-600 hover:bg-athleteBlue-700"
                  >
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
                  
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="text-sm text-blue-700">
                      <strong>AI Note:</strong> Your workout has been modified based on your recovery data. 
                      Focus on restoration today to prevent injury and improve long-term performance.
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setDemoState('initial')} 
                    variant="outline" 
                    className="w-full"
                  >
                    View Original Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DynamicPlanDemo;
