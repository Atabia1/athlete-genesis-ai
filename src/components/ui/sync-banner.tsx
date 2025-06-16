
import { useSync } from '@/context/SyncContext';
import SyncIndicator from '@/components/ui/sync-indicator';
import { cn } from '@/lib/utils';

interface SyncBannerProps {
  className?: string;
}

export function SyncBanner({ className }: SyncBannerProps) {
  const { 
    syncStatus, 
    pendingCount, 
    syncProgress, 
    lastErrorMessage, 
    syncNow
  } = useSync();
  
  // Only show the banner when there's something to show
  if (syncStatus === 'idle' || pendingCount === 0) {
    return null;
  }
  
  return (
    <div className={cn("w-full", className)}>
      <SyncIndicator 
        status={syncStatus}
        pendingCount={pendingCount}
        onSyncClick={syncNow}
        className="w-full"
      />
    </div>
  );
}
