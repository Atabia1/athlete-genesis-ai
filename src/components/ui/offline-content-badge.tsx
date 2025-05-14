/**
 * OfflineContentBadge Component
 * 
 * A small badge that indicates content is being viewed in offline mode.
 * This component is designed to be placed directly on content cards
 * to provide clear visual feedback about offline content.
 * 
 * Features:
 * - Small, unobtrusive badge for content cards
 * - Clear visual indication of offline content
 * - Consistent styling with the application design system
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface OfflineContentBadgeProps {
  className?: string;
  contentType?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function OfflineContentBadge({ 
  className,
  contentType = 'content',
  position = 'top-right'
}: OfflineContentBadgeProps) {
  // Position classes
  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2'
  };
  
  return (
    <div 
      className={cn(
        "absolute z-10",
        positionClasses[position],
        className
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-orange-100 text-orange-700 rounded-full p-1.5 shadow-sm">
              <WifiOff className="h-3 w-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">This {contentType} is being viewed offline</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
