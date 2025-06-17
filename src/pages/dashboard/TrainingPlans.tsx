
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";

const TrainingPlans = () => {
  const { isOnline } = useNetworkStatus();

  return (
    <DashboardLayout title="Training Plans">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Training Plans
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Create and manage your training programs
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
        <p className="text-gray-500">Training plans content will be implemented.</p>
      </div>
    </DashboardLayout>
  );
};

export default TrainingPlans;
