
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Smile, Brain, Shield } from "lucide-react";
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";
import OfflineContentBadge from "@/components/ui/offline-content-badge";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const WellbeingDashboard = () => {
  const { isOnline } = useNetworkStatus();

  return (
    <DashboardLayout title="Wellbeing Dashboard">
      {!isOnline && <OfflineContentBadge className="absolute top-2 right-2" />}
      
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Wellbeing Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Monitor your mental and physical wellbeing
            </p>
          </div>
          {!isOnline && (
            <OfflineIndicator
              showRetryButton={false}
              className="ml-2"
            />
          )}
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-gray-500">Wellbeing dashboard content will be implemented.</p>
      </div>
    </DashboardLayout>
  );
};

export default WellbeingDashboard;
