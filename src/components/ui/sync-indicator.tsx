/**
 * SyncIndicator Component
 * 
 * A reusable component that displays the current synchronization status
 * with visual indicators and actions for manual synchronization.
 * 
 * Features:
 * - Visual indicator of sync status (pending, in progress, completed, failed)
 * - Manual sync trigger button
 * - Animated sync icon during synchronization
 * - Success/failure notifications
 * - Consistent styling with the application design system
 */

import React from 'react';
import { RefreshCw, Check, AlertTriangle, Cloud, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

export type SyncStatus = 'idle' | 'pending' | 'syncing' | 'completed' | 'failed';

export interface SyncIndicatorProps {
  /** Current sync status */
  status: SyncStatus;
  /** Number of items pending synchronization */
  pendingCount?: number;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Error message if sync failed */
  errorMessage?: string;
  /** Callback for manual sync trigger */
  onSyncClick?: () => void;
  /** The variant determines the visual style of the indicator */
  variant?: 'badge' | 'banner' | 'inline' | 'minimal';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the indicator (useful for conditional rendering) */
  show?: boolean;
  /** Last successful sync time */
  lastSyncTime?: Date | null;
}

/**
 * SyncIndicator component
 */
export function SyncIndicator({
  status,
  pendingCount = 0,
  progress = 0,
  errorMessage,
  onSyncClick,
  variant = 'badge',
  className,
  show = true,
  lastSyncTime
}: SyncIndicatorProps) {
  if (!show) return null;

  // Format last sync time
  const formattedLastSyncTime = lastSyncTime 
    ? new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(lastSyncTime)
    : null;

  // Get status text and icon based on current status
  const getStatusInfo = () => {
    switch (status) {
      case 'idle':
        return {
          text: formattedLastSyncTime ? `Synced at ${formattedLastSyncTime}` : 'All synced',
          icon: Check,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverBgColor: 'hover:bg-green-50'
        };
      case 'pending':
        return {
          text: `${pendingCount} ${pendingCount === 1 ? 'item' : 'items'} pending sync`,
          icon: Cloud,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          hoverBgColor: 'hover:bg-blue-50'
        };
      case 'syncing':
        return {
          text: 'Syncing...',
          icon: RefreshCw,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          hoverBgColor: 'hover:bg-blue-50',
          animate: true
        };
      case 'completed':
        return {
          text: 'Sync completed',
          icon: Check,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverBgColor: 'hover:bg-green-50'
        };
      case 'failed':
        return {
          text: 'Sync failed',
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          hoverBgColor: 'hover:bg-red-50'
        };
      default:
        return {
          text: 'Unknown status',
          icon: Cloud,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          hoverBgColor: 'hover:bg-gray-50'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  // Render different variants
  switch (variant) {
    case 'banner':
      return (
        <Alert 
          className={cn(
            statusInfo.bgColor, 
            statusInfo.borderColor, 
            statusInfo.color,
            className
          )}
        >
          <div className="flex items-center">
            <Icon className={cn(
              "h-4 w-4 mr-2",
              statusInfo.animate && "animate-spin"
            )} />
            <AlertTitle>{statusInfo.text}</AlertTitle>
          </div>
          {status === 'syncing' && progress > 0 && (
            <Progress value={progress} className="h-1 mt-2" />
          )}
          {status === 'failed' && errorMessage && (
            <AlertDescription className="mt-2">
              {errorMessage}
            </AlertDescription>
          )}
          {(status === 'pending' || status === 'failed') && onSyncClick && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onSyncClick}
              className={cn(
                "mt-2",
                statusInfo.borderColor,
                statusInfo.color,
                statusInfo.hoverBgColor
              )}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Sync Now
            </Button>
          )}
        </Alert>
      );

    case 'inline':
      return (
        <div className={cn(
          "flex items-center text-sm py-1 px-2",
          statusInfo.color,
          className
        )}>
          <Icon className={cn(
            "h-4 w-4 mr-2",
            statusInfo.animate && "animate-spin"
          )} />
          <span>{statusInfo.text}</span>
          {(status === 'pending' || status === 'failed') && onSyncClick && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onSyncClick}
              className="ml-2 h-6 px-2"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>
      );

    case 'minimal':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "inline-flex items-center",
                  statusInfo.color,
                  className
                )}
                onClick={status !== 'syncing' && onSyncClick ? onSyncClick : undefined}
                style={{ cursor: status !== 'syncing' && onSyncClick ? 'pointer' : 'default' }}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  statusInfo.animate && "animate-spin"
                )} />
                {pendingCount > 0 && (
                  <span className="ml-1 text-xs">{pendingCount}</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p>{statusInfo.text}</p>
                {status === 'failed' && errorMessage && (
                  <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                )}
                {formattedLastSyncTime && status !== 'idle' && (
                  <p className="text-xs mt-1">Last synced: {formattedLastSyncTime}</p>
                )}
                {(status === 'pending' || status === 'failed') && onSyncClick && (
                  <p className="text-xs mt-1">Click to sync now</p>
                )}
              </div>
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
            "flex items-center gap-1",
            statusInfo.bgColor,
            statusInfo.color,
            statusInfo.borderColor,
            statusInfo.hoverBgColor,
            className
          )}
          onClick={status !== 'syncing' && onSyncClick ? onSyncClick : undefined}
          style={{ cursor: status !== 'syncing' && onSyncClick ? 'pointer' : 'default' }}
        >
          <Icon className={cn(
            "h-3 w-3",
            statusInfo.animate && "animate-spin"
          )} />
          <span>{statusInfo.text}</span>
          {(status === 'pending' || status === 'failed') && pendingCount > 0 && (
            <span className="ml-1 text-xs bg-white rounded-full px-1 py-0.5">
              {pendingCount}
            </span>
          )}
        </Badge>
      );
  }
}
