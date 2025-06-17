
import { useFeatureFlag } from '@/shared/utils/feature-flags';

interface FeatureFlagComponentProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlagComponent({
  flag,
  children,
  fallback = null,
}: FeatureFlagComponentProps) {
  const isEnabled = useFeatureFlag(flag as any);
  
  if (isEnabled) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
