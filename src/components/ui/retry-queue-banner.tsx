
/**
 * RetryQueueBanner: Component for displaying the status of pending retry operations
 */

import React, { useState } from 'react';
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
    queueItems: pendingOperations, 
    isProcessing, 
    retryAll: processQueue, 
    clearQueue,
  } = useRetryQueueContext();
  
  const { isOnline } = useNetworkStatus();
  const [isOpen, setIsOpen] = useState(false);
  const pendingCount = pendingOperations?.length || 0;
  const showRetryBanner = pendingCount > 0;
  
  // If there are no pending operations or the banner is hidden, don't render
  if (pendingCount === 0 || !showRetryBanner) {
    return null;
  }
  
  // Calculate progress (simplified for now)
  const completedCount = 0;
  const failedCount = 0;
  const totalCount = pendingCount + completedCount + failedCount;
  const progressPercentage = totalCount > 0 ? ((completedCount / totalCount) * 100) : 0;
  
  // Get operation type counts (simplified)
  const getTypeCount = (type: string) => {
    return pendingOperations.filter(op => op.description.includes(type)).length;
  };
  
  // Handle retry button click
  const handleRetry = async () => {
    if (!isOnline) {
      toast("You're offline", {
        description: "Please connect to the internet to retry operations.",
      });
      return;
    }
    
    await processQueue();
  };
  
  // Handle clear button click
  const handleClear = async () => {
    await clearQueue();
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden pointer-events-auto">
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => {}}
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
                {/* Operation type summary - simplified */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pending operations</span>
                  <span className="font-medium">{pendingCount}</span>
                </div>
              </div>
              
              {/* Operation list */}
              <div className="max-h-40 overflow-y-auto mb-3 space-y-1">
                {pendingOperations.slice(0, 5).map(operation => (
                  <div key={operation.id} className="flex items-center text-xs py-1">
                    <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {operation.description}
                    </span>
                  </div>
                ))}
                {pendingOperations.length > 5 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
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
