/**
 * OfflineIndicator Component
 * 
 * A reusable component that displays an offline status indicator with
 * contextual information about offline functionality.
 * 
 * Features:
 * - Visual indicator of offline status
 * - Optional contextual message
 * - Customizable appearance (banner, badge, etc.)
 * - Consistent styling with the application design system
 */

import React from 'react';
import { WifiOff, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type OfflineIndicatorVariant = 'badge' | 'banner' | 'inline' | 'minimal';

export interface OfflineIndicatorProps {
  /** The variant determines the visual style of the indicator */
  variant?: OfflineIndicatorVariant;
  /** Optional custom message to display */
  message?: string;
  /** Whether to show the indicator (useful for conditional rendering) */
  show?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether this is for a specific feature rather than general offline status */
  featureSpecific?: boolean;
  /** The name of the specific feature if featureSpecific is true */
  featureName?: string;
}

/**
 * OfflineIndicator component
 */
export function OfflineIndicator({
  variant = 'badge',
  message,
  show = true,
  className,
  featureSpecific = false,
  featureName = 'This content'
}: OfflineIndicatorProps) {
  if (!show) return null;

  // Default messages based on context
  const defaultMessage = featureSpecific
    ? `${featureName} is currently being viewed offline. Some features may be limited.`
    : 'You are currently offline. Some features may be limited.';

  // Use provided message or default
  const displayMessage = message || defaultMessage;

  // Render different variants
  switch (variant) {
    case 'banner':
      return (
        <Alert 
          variant="warning" 
          className={cn("border-yellow-500 bg-yellow-50 text-yellow-800", className)}
        >
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertTitle>Offline Mode</AlertTitle>
          <AlertDescription>{displayMessage}</AlertDescription>
        </Alert>
      );

    case 'inline':
      return (
        <div className={cn("flex items-center text-yellow-600 text-sm py-1 px-2", className)}>
          <WifiOff className="h-4 w-4 mr-2" />
          <span>{displayMessage}</span>
        </div>
      );

    case 'minimal':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("inline-flex items-center text-yellow-600", className)}>
                <WifiOff className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{displayMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

    case 'badge':
    default:
      return (
        <Badge 
          variant="outline" 
          className={cn(
            "bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-50 flex items-center gap-1",
            className
          )}
        >
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 ml-1 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{displayMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Badge>
      );
  }
}
