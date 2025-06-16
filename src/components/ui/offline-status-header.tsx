
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/use-network-status';

interface OfflineStatusHeaderProps {
  showRetryButton?: boolean;
  className?: string;
}

const OfflineStatusHeader: React.FC<OfflineStatusHeaderProps> = ({
  showRetryButton = true,
  className = '',
}) => {
  const { isOnline } = useNetworkStatus();

  const handleRetry = async () => {
    // Simple retry by reloading
    window.location.reload();
  };

  return (
    <div className={`flex items-center justify-between p-3 border-b bg-gray-50 ${className}`}>
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-orange-600" />
        )}
        
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
        
        <Badge variant={isOnline ? 'secondary' : 'outline'}>
          {isOnline ? 'Connected' : 'No Connection'}
        </Badge>
      </div>
      
      {!isOnline && showRetryButton && (
        <Button size="sm" variant="ghost" onClick={handleRetry}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default OfflineStatusHeader;
