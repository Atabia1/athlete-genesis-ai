
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";
import OfflineContentBadge from "@/components/ui/offline-content-badge";

/**
 * NutritionDashboard: Dashboard for tracking nutrition and meal planning
 */
const NutritionDashboard = () => {
  const { isOnline } = useNetworkStatus();

  return (
    <DashboardLayout title="Nutrition Dashboard">
      {!isOnline && <OfflineContentBadge className="absolute top-2 right-2" />}
      
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              Nutrition Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Track your nutrition and optimize your performance
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
        <p className="text-gray-500">Nutrition dashboard content will be implemented.</p>
      </div>
    </DashboardLayout>
  );
};

export default NutritionDashboard;
