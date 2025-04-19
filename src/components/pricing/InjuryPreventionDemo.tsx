
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, TrendingDown, AlertTriangle } from "lucide-react";

const InjuryPreventionDemo = () => {
  return (
    <div className="rounded-lg border bg-card p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">Injury Prevention Intelligence</h3>
          <p className="text-muted-foreground">AI monitoring to identify training risks before injuries occur</p>
        </div>
        <Badge className="bg-athleteBlue-600">Elite Feature</Badge>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-athleteBlue-600" />
            Risk Assessment Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-amber-700 font-medium">
                  <AlertTriangle className="h-4 w-4" />
                  Overtraining Risk Alert
                </div>
                <Badge className="bg-amber-200 text-amber-700 hover:bg-amber-300">Medium Risk</Badge>
              </div>
              <p className="text-sm text-amber-700 mt-2">
                Your weekly training volume has increased by 30% while recovery metrics are declining.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-md border">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Training Intensity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs font-medium">75%</span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Recovery Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs font-medium">45%</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>AI Recommendation:</strong> Consider reducing training volume by 20% this week 
                and prioritize sleep quality to improve recovery metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InjuryPreventionDemo;
