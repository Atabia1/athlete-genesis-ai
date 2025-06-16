
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
  const { hasAccess } = useFeatureAccess();

  if (hasAccess(feature)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default FeatureFlagComponent;
