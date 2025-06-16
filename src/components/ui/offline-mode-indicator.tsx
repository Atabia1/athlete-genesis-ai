
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/use-network-status';

interface OfflineModeIndicatorProps {
  variant?: 'banner' | 'compact' | 'minimal';
  showRetryButton?: boolean;
  showOfflineMessage?: boolean;
  className?: string;
}

const OfflineModeIndicator: React.FC<OfflineModeIndicatorProps> = ({
  variant = 'banner',
  showRetryButton = true,
  showOfflineMessage = true,
  className = '',
}) => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  const handleRetry = () => {
    // Try to reconnect
    window.location.reload();
  };

  if (variant === 'minimal') {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 p-2 bg-orange-50 rounded-md ${className}`}>
        <WifiOff className="h-4 w-4 text-orange-600" />
        <span className="text-sm text-orange-800">Offline</span>
        {showRetryButton && (
          <Button size="sm" variant="ghost" onClick={handleRetry}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  // Banner variant
  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium text-orange-800">You're currently offline</span>
          {showOfflineMessage && (
            <p className="text-sm text-orange-700 mt-1">
              You can still access some features, but new data won't sync until you're back online.
            </p>
          )}
        </div>
        {showRetryButton && (
          <Button size="sm" variant="outline" onClick={handleRetry}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default OfflineModeIndicator;
