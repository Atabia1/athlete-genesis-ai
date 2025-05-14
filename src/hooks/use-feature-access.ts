import { useMemo, useCallback } from 'react';
import { usePlan } from '@/context/PlanContext';
import {
  Feature,
  hasFeatureAccess,
  getMinimumTierForFeature,
  getAvailableFeatures,
  getUpgradeFeatures,
  getNextRecommendedTier
} from '@/utils/feature-access';
import {
  trackFeatureUsage,
  EventAction
} from '@/utils/analytics';

/**
 * Hook for checking feature access
 *
 * This hook provides functions to check if a user has access to specific features
 * based on their subscription tier. It also provides information about available
 * features and upgrade options.
 *
 * Usage:
 * const { canAccess, requiredTier, availableFeatures } = useFeatureAccess();
 *
 * if (canAccess('ai_advanced_chat')) {
 *   // User has access to the feature
 * }
 */
export const useFeatureAccess = () => {
  const { subscriptionTier } = usePlan();

  // Memoize the available features to avoid recalculating on every render
  const availableFeatures = useMemo(() => {
    return getAvailableFeatures(subscriptionTier);
  }, [subscriptionTier]);

  // Function to check if a user has access to a specific feature
  const canAccess = useCallback((
    feature: Feature,
    trackUsage: boolean = true
  ): boolean => {
    const hasAccess = hasFeatureAccess(feature, subscriptionTier, trackUsage);

    // Track feature usage if the user has access and tracking is enabled
    if (hasAccess && trackUsage) {
      trackFeatureUsage(feature, EventAction.FEATURE_USED);
    }

    return hasAccess;
  }, [subscriptionTier]);

  // Function to get the required tier for a feature
  const requiredTier = (feature: Feature) => {
    return getMinimumTierForFeature(feature);
  };

  // Get the next recommended tier for the user
  const nextRecommendedTier = useMemo(() => {
    return getNextRecommendedTier(subscriptionTier);
  }, [subscriptionTier]);

  // Get features that would be unlocked by upgrading to the next tier
  const upgradeFeatures = useMemo(() => {
    if (!nextRecommendedTier) return [];
    return getUpgradeFeatures(subscriptionTier, nextRecommendedTier);
  }, [subscriptionTier, nextRecommendedTier]);

  return {
    canAccess,
    requiredTier,
    availableFeatures,
    nextRecommendedTier,
    upgradeFeatures,
    currentTier: subscriptionTier
  };
};

export default useFeatureAccess;
