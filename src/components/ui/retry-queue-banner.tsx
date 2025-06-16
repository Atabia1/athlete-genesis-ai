
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  X,
} from 'lucide-react';
import { useRetryQueue } from '@/hooks/use-retry-queue';

interface RetryQueueBannerProps {
  showDetails?: boolean;
  autoRetry?: boolean;
  className?: string;
}

const RetryQueueBanner: React.FC<RetryQueueBannerProps> = ({
  showDetails = true,
  autoRetry = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    queue, 
    retryAll, 
    retryItem, 
    clearQueue, 
    isRetrying 
  } = useRetryQueue();

  if (queue.length === 0) {
    return null;
  }

  const handleRetryAll = async () => {
    await retryAll();
  };

  const handleRetryItem = async (id: string) => {
    await retryItem(id);
  };

  return (
    <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
      <Clock className="h-4 w-4 text-blue-600" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-800">
              {queue.length} action{queue.length !== 1 ? 's' : ''} pending
            </span>
            <Badge variant="secondary">{queue.length}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetryAll}
              disabled={isRetrying}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry All'}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => clearQueue()}
            >
              <X className="h-3 w-3" />
            </Button>
            
            {showDetails && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button size="sm" variant="ghost">
                    {isOpen ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-3">
                  <div className="space-y-2">
                    {queue.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.action}</p>
                          <p className="text-xs text-gray-500">
                            {item.attempts} attempt{item.attempts !== 1 ? 's' : ''} • 
                            Last tried: {new Date(item.lastAttempt).toLocaleTimeString()}
                          </p>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRetryItem(item.id)}
                          disabled={isRetrying}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default RetryQueueBanner;
