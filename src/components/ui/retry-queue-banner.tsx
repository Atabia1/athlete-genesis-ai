
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  WifiOff,
  RefreshCw,
  X,
  Clock,
  XCircle,
} from 'lucide-react';
import { useRetryQueue } from '@/context/RetryQueueContext';

interface RetryQueueBannerProps {
  className?: string;
}

interface RetryItem {
  id: string;
  status: string;
  message: string;
}

const RetryQueueBanner: React.FC<RetryQueueBannerProps> = ({
  className = '',
}) => {
  const { pendingOperations, isProcessing, processQueue, clearQueue } = useRetryQueue();
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert operations to items format
  const items: RetryItem[] = pendingOperations.map((op: any) => ({
    id: op.id,
    status: op.status,
    message: `${op.type} operation`,
  }));

  const isRetrying = isProcessing;

  if (!items || items.length === 0) {
    return null;
  }

  const handleRetry = () => {
    processQueue();
  };

  const handleClear = () => {
    clearQueue();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium text-orange-800">
            {items.length} items failed to sync
          </span>
          <p className="text-sm text-orange-700 mt-1">
            {isExpanded ? (
              <>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span>{item.message}</span>
                    </div>
                    <div>
                      {item.status === 'error' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRetry}
                          disabled={isRetrying}
                        >
                          {isRetrying ? (
                            <>
                              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                              Retrying...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-3 w-3" />
                              Retry
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleClear}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              'Tap to view details and retry.'
            )}
          </p>
        </div>
        <div>
          <Button size="sm" variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default RetryQueueBanner;
