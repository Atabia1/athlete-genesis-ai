/**
 * NetworkStatus: Enhanced component for displaying network connectivity status
 *
 * This component provides a comprehensive visual indicator of the user's network status,
 * showing not only whether they are online or offline but also the quality of the connection.
 * It also displays toast notifications when the network status changes.
 *
 * Features:
 * - Visual indicator in the UI for current network status and quality
 * - Toast notifications for status changes
 * - Connection quality indicator (excellent, good, poor, offline)
 * - Manual connection check functionality
 * - Detailed connection information on hover
 */

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, WifiLow, Zap, AlertTriangle, RefreshCw, Lock } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { SyncIndicator } from '@/components/ui/sync-indicator';
import { useSync } from '@/context/SyncContext';

interface NetworkStatusProps {
  className?: string;
  showQuality?: boolean;
  showRefreshButton?: boolean;
  showSyncStatus?: boolean;
}

const NetworkStatus = ({
  className = '',
  showQuality = true,
  showRefreshButton = false,
  showSyncStatus = true
}: NetworkStatusProps) => {
  const {
    isOnline,
    wasOffline,
    connectionQuality,
    lastChecked,
    checkConnection
  } = useNetworkStatus();

  const {
    syncStatus,
    pendingCount,
    syncNow,
    lastSyncTime
  } = useSync();

  const [isChecking, setIsChecking] = useState(false);

  // Show toast notifications when network status changes
  useEffect(() => {
    if (wasOffline) {
      toast({
        title: "You're back online",
        description: pendingCount > 0
          ? `Your connection has been restored. Syncing ${pendingCount} pending ${pendingCount === 1 ? 'item' : 'items'}...`
          : "Your connection has been restored.",
        variant: "default",
      });
    }
  }, [wasOffline, pendingCount]);

  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Don't worry, you can still access saved workouts.",
        variant: "destructive",
      });
    }
  }, [isOnline]);

  // Show toast notifications when connection quality changes significantly
  useEffect(() => {
    if (connectionQuality === 'poor' && isOnline) {
      toast({
        title: "Poor connection detected",
        description: "Your internet connection is slow. Some features may be limited.",
        variant: "destructive",
      });
    } else if (connectionQuality === 'captive-portal') {
      toast({
        title: "WiFi login required",
        description: "You're connected to a network that requires authentication. Please open your browser to log in.",
        variant: "destructive",
      });
    }
  }, [connectionQuality, isOnline]);

  // Handle manual connection check
  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      await checkConnection();
    } finally {
      setIsChecking(false);
    }
  };

  // Get icon and color based on connection quality
  const getConnectionInfo = () => {
    switch (connectionQuality) {
      case 'excellent':
        return {
          icon: <Zap className="h-4 w-4 mr-1" />,
          text: 'Excellent',
          colorClass: 'text-green-600'
        };
      case 'good':
        return {
          icon: <Wifi className="h-4 w-4 mr-1" />,
          text: 'Good',
          colorClass: 'text-green-600'
        };
      case 'poor':
        return {
          icon: <WifiLow className="h-4 w-4 mr-1" />,
          text: 'Poor',
          colorClass: 'text-yellow-600'
        };
      case 'captive-portal':
        return {
          icon: <Lock className="h-4 w-4 mr-1" />,
          text: 'Login Required',
          colorClass: 'text-purple-600'
        };
      case 'offline':
        return {
          icon: <WifiOff className="h-4 w-4 mr-1" />,
          text: 'Offline',
          colorClass: 'text-orange-600'
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          text: 'Unknown',
          colorClass: 'text-gray-600'
        };
    }
  };

  const connectionInfo = getConnectionInfo();
  const formattedLastChecked = lastChecked.toLocaleTimeString();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center ${connectionInfo.colorClass} cursor-help ${!isOnline ? 'bg-orange-100 px-2 py-1 rounded-full animate-pulse font-medium' : ''}`}>
              {connectionInfo.icon}
              <span className={`text-xs font-medium ${!isOnline ? 'ml-1' : ''}`}>
                {showQuality ? connectionInfo.text : (isOnline ? 'Online' : 'Offline')}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-sm">
              <p><strong>Status:</strong> {isOnline ? 'Online' : 'Offline'}</p>
              <p><strong>Quality:</strong> {connectionInfo.text}</p>
              <p><strong>Last checked:</strong> {formattedLastChecked}</p>
              {connectionQuality === 'captive-portal' && (
                <p className="text-purple-600 mt-1">
                  <strong>Action needed:</strong> Open your browser to complete WiFi login
                </p>
              )}
              {!isOnline && (
                <p className="text-orange-600 mt-1">
                  <strong>Offline mode:</strong> You can still access saved workouts and templates
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showSyncStatus && isOnline && (
        <SyncIndicator
          status={syncStatus}
          pendingCount={pendingCount}
          onSyncClick={syncNow}
          variant="minimal"
          lastSyncTime={lastSyncTime}
        />
      )}

      {showRefreshButton && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 p-1 h-6 w-6"
          onClick={handleCheckConnection}
          disabled={isChecking}
        >
          <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
};

export default NetworkStatus;
