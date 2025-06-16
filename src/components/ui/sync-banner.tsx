
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle2, AlertCircle, Wifi } from 'lucide-react';
import { useSync } from '@/context/SyncContext';

interface SyncBannerProps {
  showSyncButton?: boolean;
  autoHide?: boolean;
  className?: string;
}

const SyncBanner: React.FC<SyncBannerProps> = ({
  showSyncButton = true,
  autoHide = false,
  className = '',
}) => {
  const { syncStatus, pendingCount, syncNow, lastSyncTime } = useSync();

  // Auto-hide successful syncs after a delay
  if (autoHide && syncStatus === 'success') {
    setTimeout(() => {
      // This would trigger a state update to hide the banner
    }, 3000);
  }

  if (syncStatus === 'idle' && pendingCount === 0) {
    return null;
  }

  const getStatusInfo = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />,
          message: 'Syncing data...',
          variant: 'default' as const,
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
          message: 'Data synced successfully',
          variant: 'default' as const,
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
          message: 'Sync failed - will retry automatically',
          variant: 'destructive' as const,
        };
      default:
        return {
          icon: <Wifi className="h-4 w-4 text-gray-600" />,
          message: `${pendingCount} change${pendingCount !== 1 ? 's' : ''} pending sync`,
          variant: 'default' as const,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Alert className={`${className}`} variant={statusInfo.variant}>
      {statusInfo.icon}
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{statusInfo.message}</span>
          {pendingCount > 0 && (
            <Badge variant="secondary">{pendingCount}</Badge>
          )}
        </div>
        
        {showSyncButton && syncStatus !== 'syncing' && (
          <Button
            size="sm"
            variant="outline"
            onClick={syncNow}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Sync Now
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SyncBanner;
