/**
 * Data Sync Indicator Component
 * 
 * This component displays the current synchronization status of data.
 * It shows different indicators based on the sync status and provides
 * accessibility features for screen readers.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Sync status enum
export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SUCCESS = 'success',
  ERROR = 'error',
  OFFLINE = 'offline',
  REALTIME = 'realtime',
}

// Props interface
interface DataSyncIndicatorProps {
  /** Current sync status */
  status: SyncStatus;
  /** Last sync time */
  lastSyncTime?: Date | null;
  /** Whether to show the last sync time */
  showLastSync?: boolean;
  /** Whether to show a manual sync button */
  showSyncButton?: boolean;
  /** Callback for manual sync */
  onSyncClick?: () => void;
  /** Additional CSS class */
  className?: string;
  /** Variant style */
  variant?: 'default' | 'compact' | 'badge' | 'icon-only';
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Format a date as a relative time string
 * @param date Date to format
 * @returns Formatted string
 */
const formatRelativeTime = (date: Date | null): string => {
  if (!date) return 'Never';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  
  return date.toLocaleDateString();
};

/**
 * Data Sync Indicator Component
 */
const DataSyncIndicator: React.FC<DataSyncIndicatorProps> = ({
  status,
  lastSyncTime = null,
  showLastSync = true,
  showSyncButton = false,
  onSyncClick,
  className = '',
  variant = 'default',
  ariaLabel,
}) => {
  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case SyncStatus.SYNCING:
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case SyncStatus.SUCCESS:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case SyncStatus.ERROR:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case SyncStatus.OFFLINE:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case SyncStatus.REALTIME:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get status text
  const getStatusText = () => {
    switch (status) {
      case SyncStatus.SYNCING:
        return 'Syncing...';
      case SyncStatus.SUCCESS:
        return 'Synced';
      case SyncStatus.ERROR:
        return 'Sync failed';
      case SyncStatus.OFFLINE:
        return 'Offline';
      case SyncStatus.REALTIME:
        return 'Real-time';
      default:
        return 'Not synced';
    }
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case SyncStatus.SYNCING:
        return 'text-blue-500';
      case SyncStatus.SUCCESS:
        return 'text-green-500';
      case SyncStatus.ERROR:
        return 'text-red-500';
      case SyncStatus.OFFLINE:
        return 'text-yellow-500';
      case SyncStatus.REALTIME:
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get badge variant
  const getBadgeVariant = () => {
    switch (status) {
      case SyncStatus.SYNCING:
        return 'secondary';
      case SyncStatus.SUCCESS:
        return 'success';
      case SyncStatus.ERROR:
        return 'destructive';
      case SyncStatus.OFFLINE:
        return 'warning';
      case SyncStatus.REALTIME:
        return 'info';
      default:
        return 'outline';
    }
  };
  
  // Get ARIA label
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    
    let label = `Data synchronization status: ${getStatusText()}`;
    if (showLastSync && lastSyncTime) {
      label += `. Last synced ${formatRelativeTime(lastSyncTime)}`;
    }
    
    return label;
  };
  
  // Render based on variant
  if (variant === 'badge') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={getBadgeVariant() as any} 
              className={cn("flex items-center gap-1", className)}
              aria-label={getAriaLabel()}
            >
              {getStatusIcon()}
              <span>{getStatusText()}</span>
              {showSyncButton && status !== SyncStatus.SYNCING && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={onSyncClick}
                  aria-label="Sync now"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {showLastSync && lastSyncTime ? (
              <p>Last synced: {formatRelativeTime(lastSyncTime)}</p>
            ) : (
              <p>{getStatusText()}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (variant === 'icon-only') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={cn("flex items-center justify-center", className)}
              aria-label={getAriaLabel()}
            >
              {getStatusIcon()}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getStatusText()}</p>
            {showLastSync && lastSyncTime && (
              <p className="text-xs text-gray-500">Last synced: {formatRelativeTime(lastSyncTime)}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div 
        className={cn("flex items-center gap-1", className)}
        aria-label={getAriaLabel()}
      >
        {getStatusIcon()}
        <span className={cn("text-sm", getStatusColor())}>{getStatusText()}</span>
        {showSyncButton && status !== SyncStatus.SYNCING && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 p-0" 
            onClick={onSyncClick}
            aria-label="Sync now"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }
  
  // Default variant
  return (
    <div 
      className={cn("flex flex-col", className)}
      aria-label={getAriaLabel()}
    >
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={cn("text-sm font-medium", getStatusColor())}>{getStatusText()}</span>
        {showSyncButton && status !== SyncStatus.SYNCING && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 p-0" 
            onClick={onSyncClick}
            aria-label="Sync now"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
      {showLastSync && lastSyncTime && (
        <span className="text-xs text-gray-500 mt-1">
          Last synced: {formatRelativeTime(lastSyncTime)}
        </span>
      )}
    </div>
  );
};

export default DataSyncIndicator;
