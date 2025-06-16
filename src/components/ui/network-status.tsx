import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, RefreshCw, AlertTriangle, Zap } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/use-network-status';
import SyncIndicator from '@/components/ui/sync-indicator';

interface NetworkStatusProps {
  showDetails?: boolean;
  showRetryButton?: boolean;
  className?: string;
}

interface NetworkStatus {
  isOnline: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({
  showDetails = true,
  showRetryButton = true,
  className = '',
}) => {
  const { isOnline } = useNetworkStatus() as NetworkStatus;

  const getStatusColor = () => {
    return isOnline ? 'text-green-600' : 'text-orange-600';
  };

  const getStatusIcon = () => {
    return isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />;
  };

  return (
    <div className={`flex items-center gap-2 p-2 rounded-md border ${isOnline ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} ${className}`}>
      {getStatusIcon()}
      
      <div className="flex-1">
        <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
        {showDetails && (
          <p className="text-xs text-muted-foreground">
            {isOnline ? 'All systems operational.' : 'Limited connectivity. Syncing may be delayed.'}
          </p>
        )}
      </div>
      
      {showRetryButton && !isOnline && (
        <Button size="sm" variant="outline" className="shrink-0">
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}

      <SyncIndicator />
    </div>
  );
};

export default NetworkStatus;
