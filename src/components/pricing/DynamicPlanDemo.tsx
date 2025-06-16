
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DynamicPlanDemo = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Plan Recommendations</CardTitle>
          <CardDescription>
            Our AI analyzes your progress and adapts your plan automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workout">Workout Adaptation</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition Adjustment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workout" className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Week 1-2: Foundation</h4>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Building base strength and endurance</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Week 3-4: Intensity</h4>
                    <Badge>Recommended</Badge>
                  </div>
                  <p className="text-sm text-gray-600">AI detected good recovery - increasing intensity</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="nutrition" className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Calorie Adjustment</h4>
                  <p className="text-sm text-gray-600">Based on your activity level, we're adjusting your daily calories from 2,200 to 2,400</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-medium">Macro Optimization</h4>
                  <p className="text-sm text-gray-600">Increasing protein intake to support muscle recovery</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-center">
            <Button>View Full Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPlanDemo;
