/**
 * Feature Access Context
 * 
 * This context provides access to feature gating functionality throughout the application.
 * It integrates with the auth context to determine user permissions based on subscription
 * and owner status.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usePlan } from '@/context/PlanContext';
import { 
  Feature, 
  hasFeatureAccess as checkFeatureAccess, 
  getAvailableFeatures as getFeatures,
  getUpgradeFeatures,
  getNextRecommendedTier,
  getMinimumTierForFeature,
  featureDescriptions
} from '@/utils/feature-access';
import { SubscriptionTier } from '@/context/PlanContext';

interface FeatureAccessContextType {
  /**
   * Check if the current user has access to a specific feature
   */
  hasFeatureAccess: (feature: Feature) => boolean;
  
  /**
   * Get all features available to the current user
   */
  getAvailableFeatures: () => Feature[];
  
  /**
   * Get features that would be unlocked by upgrading to a specific tier
   */
  getUpgradeFeatures: (targetTier: SubscriptionTier) => Feature[];
  
  /**
   * Get the next recommended subscription tier for the current user
   */
  getNextRecommendedTier: () => SubscriptionTier | null;
  
  /**
   * Get the minimum subscription tier required for a feature
   */
  getMinimumTierForFeature: (feature: Feature) => SubscriptionTier;
  
  /**
   * Get the description for a feature
   */
  getFeatureDescription: (feature: Feature) => string;
  
  /**
   * Check if the current user is the owner
   */
  isOwner: boolean;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | undefined>(undefined);

/**
 * Feature Access Provider Component
 */
export function FeatureAccessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { currentPlan } = usePlan();
  
  // Determine if the current user is the owner
  const isOwner = !!user?.isOwner;
  
  // Get the current subscription tier
  const currentTier = currentPlan?.tier as SubscriptionTier || null;
  
  /**
   * Check if the current user has access to a specific feature
   */
  const hasFeatureAccess = (feature: Feature): boolean => {
    return checkFeatureAccess(feature, currentTier, isOwner);
  };
  
  /**
   * Get all features available to the current user
   */
  const getAvailableFeatures = (): Feature[] => {
    return getFeatures(currentTier, isOwner);
  };
  
  /**
   * Get the description for a feature
   */
  const getFeatureDescription = (feature: Feature): string => {
    return featureDescriptions[feature] || 'Feature description not available';
  };
  
  const value: FeatureAccessContextType = {
    hasFeatureAccess,
    getAvailableFeatures,
    getUpgradeFeatures: (targetTier: SubscriptionTier) => getUpgradeFeatures(currentTier, targetTier),
    getNextRecommendedTier: () => getNextRecommendedTier(currentTier),
    getMinimumTierForFeature,
    getFeatureDescription,
    isOwner
  };
  
  return (
    <FeatureAccessContext.Provider value={value}>
      {children}
    </FeatureAccessContext.Provider>
  );
}

/**
 * Hook to use the feature access context
 */
export function useFeatureAccess(): FeatureAccessContextType {
  const context = useContext(FeatureAccessContext);
  
  if (context === undefined) {
    throw new Error('useFeatureAccess must be used within a FeatureAccessProvider');
  }
  
  return context;
}
