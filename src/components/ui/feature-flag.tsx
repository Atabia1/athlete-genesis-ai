
import { useFeatureAccess } from '@/hooks/use-feature-access';

interface FeatureFlagComponentProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureFlagComponent: React.FC<FeatureFlagComponentProps> = ({
  feature,
  children,
  fallback = null,
}) => {
  const { canAccess } = useFeatureAccess();

  if (canAccess(feature as any)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default FeatureFlagComponent;
