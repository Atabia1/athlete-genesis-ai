/**
 * OfflineWorkouts: Page for managing and accessing offline workouts
 *
 * This page provides a dedicated interface for:
 * 1. Viewing and selecting pre-defined workout templates
 * 2. Managing saved workout plans for offline use
 * 3. Viewing the currently selected offline workout
 *
 * It's designed to ensure users always have access to workout content,
 * even when they have no internet connection.
 */

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OfflineWorkoutsDisplay from "@/components/dashboard/OfflineWorkoutsDisplay";
import { useNetworkStatus, ConnectionQuality } from "@/hooks/use-network-status";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff, Info, Wifi, WifiLow, Zap, AlertTriangle, RefreshCw, Lock, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const OfflineWorkouts = () => {
  const { isOnline, connectionQuality, checkConnection } = useNetworkStatus();

  /**
   * Get the appropriate alert based on connection quality
   */
  const getConnectionAlert = () => {
    switch (connectionQuality) {
      case 'captive-portal':
        return (
          <Alert variant="warning" className="bg-purple-50 border-purple-200">
            <Lock className="h-4 w-4 text-purple-600" />
            <AlertTitle className="text-purple-800">WiFi Login Required</AlertTitle>
            <AlertDescription className="text-purple-700">
              <div className="flex flex-col space-y-2">
                <p>You're connected to a network that requires authentication.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start flex items-center text-purple-700 border-purple-300 hover:bg-purple-100"
                  onClick={() => window.open('http://captive.apple.com', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open Login Page
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );
      case 'offline':
        return (
          <Alert variant="warning" className="bg-orange-50 border-orange-200">
            <WifiOff className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">You're currently offline</AlertTitle>
            <AlertDescription className="text-orange-700">
              You can access your saved workouts and pre-defined templates while offline.
            </AlertDescription>
          </Alert>
        );
      case 'poor':
        return (
          <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
            <WifiLow className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Poor connection detected</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Your internet connection is slow. Some features may be limited, but offline workouts will still be available.
            </AlertDescription>
          </Alert>
        );
      case 'good':
      case 'excellent':
        return (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Offline Workouts</AlertTitle>
            <AlertDescription className="text-blue-700">
              Save your current workout plan or select from pre-defined templates to access when you're offline.
            </AlertDescription>
          </Alert>
        );
      default:
        return (
          <Alert variant="default" className="bg-gray-50 border-gray-200">
            <AlertTriangle className="h-4 w-4 text-gray-600" />
            <AlertTitle className="text-gray-800">Checking connection status</AlertTitle>
            <AlertDescription className="text-gray-700">
              Determining your network status. Offline workouts are always available regardless of connection.
            </AlertDescription>
          </Alert>
        );
    }
  };

  // State for connection check button
  const [isChecking, setIsChecking] = useState(false);

  /**
   * Handle manual connection check
   */
  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      await checkConnection();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <DashboardLayout title="Offline Workouts">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {getConnectionAlert()}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-4 mt-2 flex items-center"
            onClick={handleCheckConnection}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Connection
          </Button>
        </div>

        <OfflineWorkoutsDisplay />
      </div>
    </DashboardLayout>
  );
};

export default OfflineWorkouts;
