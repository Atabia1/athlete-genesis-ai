
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Wifi,
} from 'lucide-react';
import { useSync } from '@/context/SyncContext';

interface SyncIndicatorProps {
  variant?: 'badge' | 'button' | 'icon';
  showLabel?: boolean;
  showPendingCount?: boolean;
  className?: string;
  onSyncClick?: () => void;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  variant = 'badge',
  showLabel = true,
  showPendingCount = true,
  className = '',
  onSyncClick,
}) => {
  const { syncStatus, pendingCount, syncNow, lastSyncTime } = useSync();

  const getStatusInfo = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: <RefreshCw className="h-3 w-3 animate-spin" />,
          label: 'Syncing',
          color: 'text-blue-600',
          variant: 'secondary' as const,
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          label: 'Synced',
          color: 'text-green-600',
          variant: 'secondary' as const,
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          label: 'Error',
          color: 'text-red-600',
          variant: 'destructive' as const,
        };
      default:
        return {
          icon: <Wifi className="h-3 w-3" />,
          label: pendingCount > 0 ? 'Pending' : 'Idle',
          color: 'text-gray-600',
          variant: 'outline' as const,
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleClick = () => {
    if (onSyncClick) {
      onSyncClick();
    } else {
      syncNow();
    }
  };

  if (variant === 'icon') {
    return (
      <div className={`${statusInfo.color} ${className}`} title={statusInfo.label}>
        {statusInfo.icon}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={handleClick}
        disabled={syncStatus === 'syncing'}
        className={className}
      >
        {statusInfo.icon}
        {showLabel && <span className="ml-1">{statusInfo.label}</span>}
        {showPendingCount && pendingCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {pendingCount}
          </Badge>
        )}
      </Button>
    );
  }

  // Badge variant
  return (
    <Badge variant={statusInfo.variant} className={`flex items-center gap-1 ${className}`}>
      {statusInfo.icon}
      {showLabel && <span>{statusInfo.label}</span>}
      {showPendingCount && pendingCount > 0 && (
        <span className="ml-1">({pendingCount})</span>
      )}
    </Badge>
  );
};

export default SyncIndicator;
