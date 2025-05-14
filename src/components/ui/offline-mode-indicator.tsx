/**
 * OfflineModeIndicator Component
 * 
 * A persistent indicator that appears when the application is in offline mode.
 * It provides clear visual feedback about the current connection status and
 * what features are available offline.
 * 
 * Features:
 * - Persistent visual indicator of offline mode
 * - Information about available offline features
 * - Ability to manually check connection status
 * - Consistent styling with the application design system
 */

import React, { useState } from 'react';
import { WifiOff, RefreshCw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface OfflineModeIndicatorProps {
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showDetails?: boolean;
}

export function OfflineModeIndicator({ 
  className, 
  position = 'bottom', 
  showDetails = true 
}: OfflineModeIndicatorProps) {
  const { isOnline, checkConnection } = useNetworkStatus();
  const [isChecking, setIsChecking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Don't show the indicator when online
  if (isOnline) {
    return null;
  }
  
  // Handle manual connection check
  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      await checkConnection();
    } finally {
      setIsChecking(false);
    }
  };
  
  // Position classes
  const positionClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0'
  };
  
  // Determine if indicator should be horizontal or vertical
  const isHorizontal = position === 'top' || position === 'bottom';
  
  return (
    <div 
      className={cn(
        "fixed z-50 pointer-events-none",
        positionClasses[position],
        className
      )}
    >
      <div 
        className={cn(
          "pointer-events-auto",
          isHorizontal ? "mx-auto px-4 py-2" : "my-auto px-2 py-4",
          position === 'bottom' && "mb-4",
          position === 'top' && "mt-4",
          position === 'left' && "ml-4",
          position === 'right' && "mr-4",
          "max-w-md"
        )}
      >
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className={cn(
            "bg-orange-50 border border-orange-200 rounded-lg shadow-lg overflow-hidden",
            "transition-all duration-200"
          )}
        >
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center text-orange-700">
              <WifiOff className="h-5 w-5 mr-2" />
              <span className="font-medium">You're offline</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-orange-700 hover:bg-orange-100"
                onClick={handleCheckConnection}
                disabled={isChecking}
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isChecking && "animate-spin"
                )} />
                <span className="sr-only">Check connection</span>
              </Button>
              
              {showDetails && (
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-orange-700 hover:bg-orange-100"
                  >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">
                      {isOpen ? 'Hide details' : 'Show details'}
                    </span>
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
          </div>
          
          {showDetails && (
            <CollapsibleContent>
              <div className="px-3 pb-3 text-sm text-orange-700">
                <p className="mb-2">
                  You can still access:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Saved workout plans</li>
                  <li>Pre-defined workout templates</li>
                  <li>Your current workout plan</li>
                </ul>
                <p className="mt-2 text-xs">
                  Changes will be saved locally and synchronized when you're back online.
                </p>
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    </div>
  );
}
