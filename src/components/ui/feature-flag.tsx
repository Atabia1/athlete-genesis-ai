/**
 * Feature Flag Component
 * 
 * This component conditionally renders content based on feature flags.
 * It's used to enable or disable features based on environment variables.
 */

import React, { ReactNode } from 'react';
import { FeatureFlag, isFeatureEnabled } from '@/utils/feature-flags';

interface FeatureFlagProps {
  /** The feature flag to check */
  feature: FeatureFlag;
  
  /** Content to render when the feature is enabled */
  children: ReactNode;
  
  /** Optional content to render when the feature is disabled */
  fallback?: ReactNode;
  
  /** Whether to render nothing when the feature is disabled (default: false) */
  renderNothing?: boolean;
}

/**
 * Conditionally renders content based on a feature flag
 */
export function FeatureFlag({
  feature,
  children,
  fallback,
  renderNothing = false,
}: FeatureFlagProps) {
  const isEnabled = isFeatureEnabled(feature);
  
  if (isEnabled) {
    return <>{children}</>;
  }
  
  if (renderNothing) {
    return null;
  }
  
  return <>{fallback}</>;
}

/**
 * Example usage:
 * 
 * <FeatureFlag feature={FeatureFlag.DARK_MODE}>
 *   <DarkModeToggle />
 * </FeatureFlag>
 * 
 * <FeatureFlag 
 *   feature={FeatureFlag.ANALYTICS} 
 *   fallback={<DisabledFeatureMessage name="Analytics" />}
 * >
 *   <AnalyticsDashboard />
 * </FeatureFlag>
 */
