/**
 * RetryQueueBanner: Component for displaying the status of pending retry operations
 * 
 * This component provides a visual indicator of operations that are queued for retry,
 * showing:
 * 1. The number of pending operations
 * 2. The current status of the retry process
 * 3. Controls to manually trigger retries or clear the queue
 * 
 * It's designed to be non-intrusive while providing important feedback to users
 * about operations that failed due to network issues and will be retried.
 */

import React, { useState } from 'react';
import { 
  RetryStatus, 
  RetryOperationType 
} from '@/services/retry-queue-service';
import { useRetryQueueContext } from '@/context/RetryQueueProvider';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  X, 
  ChevronUp, 
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';

/**
 * RetryQueueBanner component
 */
const RetryQueueBanner: React.FC = () => {
  const { 
    pendingOperations, 
    pendingCount, 
    isProcessing, 
    processQueue, 
    clearQueue,
    showRetryBanner,
    setShowRetryBanner
  } = useRetryQueueContext();
  
  const { isOnline } = useNetworkStatus();
  const [isOpen, setIsOpen] = useState(false);
  
  // If there are no pending operations or the banner is hidden, don't render
  if (pendingCount === 0 || !showRetryBanner) {
    return null;
  }
  
  // Calculate progress
  const completedCount = pendingOperations.filter(op => op.status === RetryStatus.COMPLETED).length;
  const failedCount = pendingOperations.filter(op => op.status === RetryStatus.FAILED).length;
  const totalCount = pendingCount + completedCount + failedCount;
  const progressPercentage = totalCount > 0 ? ((completedCount / totalCount) * 100) : 0;
  
  // Get operation type counts
  const getTypeCount = (type: RetryOperationType) => {
    return pendingOperations.filter(op => op.type === type).length;
  };
  
  // Handle retry button click
  const handleRetry = async () => {
    if (!isOnline) {
      toast("You're offline", {
        description: "Please connect to the internet to retry operations.",
        variant: "destructive",
      });
      return;
    }
    
    await processQueue();
  };
  
  // Handle clear button click
  const handleClear = async () => {
    await clearQueue();
    setShowRetryBanner(false);
  };
  
  // Get a user-friendly description of an operation type
  const getOperationDescription = (type: RetryOperationType): string => {
    switch (type) {
      case RetryOperationType.SAVE_WORKOUT:
        return "Save workout";
      case RetryOperationType.DELETE_WORKOUT:
        return "Delete workout";
      case RetryOperationType.UPDATE_WORKOUT:
        return "Update workout";
      case RetryOperationType.SYNC_DATA:
        return "Sync data";
      case RetryOperationType.API_REQUEST:
        return "API request";
      default:
        return "Operation";
    }
  };
  
  // Get icon for operation status
  const getStatusIcon = (status: RetryStatus) => {
    switch (status) {
      case RetryStatus.COMPLETED:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case RetryStatus.IN_PROGRESS:
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case RetryStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case RetryStatus.FAILED:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden pointer-events-auto">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isProcessing ? (
                  <RefreshCw className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                <div>
                  <h3 className="font-medium">
                    {isProcessing 
                      ? `Retrying operations (${completedCount}/${totalCount})` 
                      : `Pending operations (${pendingCount})`}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isOnline 
                      ? (isProcessing ? "Retrying failed operations..." : "Waiting to retry operations") 
                      : "Will retry when you're back online"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowRetryBanner(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isProcessing && (
              <Progress value={progressPercentage} className="h-1 mt-2" />
            )}
          </div>
          
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <div className="mb-3 space-y-1">
                {/* Operation type summary */}
                {Object.values(RetryOperationType).map(type => {
                  const count = getTypeCount(type);
                  if (count === 0) return null;
                  
                  return (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-gray-600">{getOperationDescription(type)}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Operation list */}
              <div className="max-h-40 overflow-y-auto mb-3 space-y-1">
                {pendingOperations.slice(0, 5).map(operation => (
                  <div key={operation.id} className="flex items-center text-xs py-1">
                    {getStatusIcon(operation.status)}
                    <span className="ml-2 text-gray-700">
                      {getOperationDescription(operation.type)}
                      {operation.attempts > 0 && ` (Attempt ${operation.attempts}/${operation.maxAttempts})`}
                    </span>
                  </div>
                ))}
                {pendingOperations.length > 5 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{pendingOperations.length - 5} more operations
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClear}
                >
                  Clear All
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleRetry}
                  disabled={!isOnline || isProcessing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? 'Retrying...' : 'Retry Now'}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default RetryQueueBanner;
