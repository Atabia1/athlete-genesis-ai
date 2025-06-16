
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/use-network-status';

interface OfflineIndicatorProps {
  showRetryButton?: boolean;
  onRetry?: () => void;
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showRetryButton = true,
  onRetry,
  className = '',
}) => {
  const { isOnline, checkConnection } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  const handleRetry = async () => {
    if (onRetry) {
      onRetry();
    } else {
      await checkConnection();
    }
  };

  return (
    <div className={`flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg ${className}`}>
      <WifiOff className="h-4 w-4 text-orange-600" />
      
      <div className="flex-1">
        <span className="text-sm font-medium text-orange-800">You're offline</span>
        <p className="text-xs text-orange-600">
          Some features may be limited. Check your connection.
        </p>
      </div>
      
      {showRetryButton && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleRetry}
          className="shrink-0"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
      
      <Badge variant="secondary" className="shrink-0">
        Offline
      </Badge>
    </div>
  );
};

export default OfflineIndicator;
