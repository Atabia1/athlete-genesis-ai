
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Cloud, AlertCircle } from 'lucide-react';

interface SyncIndicatorProps {
  status?: 'idle' | 'syncing' | 'error';
  pendingCount?: number;
  onSyncClick?: () => void;
  className?: string;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  status = 'idle',
  pendingCount = 0,
  onSyncClick,
  className = '',
}) => {
  const getSyncIcon = () => {
    switch (status) {
      case 'syncing':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Cloud className="h-3 w-3" />;
    }
  };

  const getSyncText = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync Error';
      default:
        return pendingCount > 0 ? `${pendingCount} pending` : 'Synced';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {pendingCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {pendingCount}
        </Badge>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onSyncClick}
        className="text-xs px-2 py-1 h-auto"
        disabled={status === 'syncing'}
      >
        {getSyncIcon()}
        <span className="ml-1">{getSyncText()}</span>
      </Button>
    </div>
  );
};

export default SyncIndicator;
