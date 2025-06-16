
import { useSync } from '@/features/offline/context/SyncContext';
import { SyncIndicator } from '@/features/offline/components/SyncIndicator';
import { cn } from '@/shared/utils/cn';

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
        progress={syncProgress}
        errorMessage={lastErrorMessage || undefined}
        onSyncClick={syncNow}
        variant="banner"
      />
    </div>
  );
}
