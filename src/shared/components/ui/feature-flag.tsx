
import { useFeatureFlags } from '@/shared/utils/feature-flags';

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
  const { isEnabled } = useFeatureFlags();
  
  if (isEnabled(flag)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
