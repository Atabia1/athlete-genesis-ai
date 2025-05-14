/**
 * OfflineStatusHeader Component
 * 
 * A component that displays a prominent offline status indicator in the header.
 * This provides a persistent visual cue that the application is in offline mode.
 * 
 * Features:
 * - Prominent visual indicator in the header
 * - Consistent styling with the application design system
 * - Clear indication of offline status
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetworkStatus } from '@/hooks/use-network-status';

interface OfflineStatusHeaderProps {
  className?: string;
}

export function OfflineStatusHeader({ className }: OfflineStatusHeaderProps) {
  const { isOnline } = useNetworkStatus();
  
  // Don't show anything when online
  if (isOnline) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "bg-orange-100 text-orange-800 px-3 py-1.5 flex items-center justify-center text-sm font-medium",
        className
      )}
    >
      <WifiOff className="h-3.5 w-3.5 mr-1.5" />
      <span>Offline Mode</span>
    </div>
  );
}
