
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineIndicator from "@/components/ui/offline-indicator";

const TeamAnalytics = () => {
  const { isOnline } = useNetworkStatus();

  return (
    <DashboardLayout title="Team Analytics">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              Team Analytics
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Analyze your team's performance and progress
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
        <p className="text-gray-500">Team analytics content will be implemented.</p>
      </div>
    </DashboardLayout>
  );
};

export default TeamAnalytics;
