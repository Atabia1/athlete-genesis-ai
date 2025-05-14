import { SubscriptionTier } from '@/context/PlanContext';

/**
 * Feature Access Control System
 *
 * This utility provides functions to check if a user has access to specific features
 * based on their subscription tier. It also defines the feature requirements for
 * different parts of the application.
 */

/**
 * Feature categories in the application
 */
export type FeatureCategory =
  | 'workout'
  | 'nutrition'
  | 'analytics'
  | 'ai'
  | 'team'
  | 'wellbeing'
  | 'customization'
  | 'offline';

/**
 * Specific features within each category
 */
export type Feature =
  // Workout features
  | 'workout_basic'
  | 'workout_advanced'
  | 'workout_sport_specific'
  | 'workout_equipment_aware'
  | 'workout_ai_adaptation'

  // Nutrition features
  | 'nutrition_basic'
  | 'nutrition_advanced'
  | 'nutrition_personalized'
  | 'nutrition_ai_recommendations'

  // Analytics features
  | 'analytics_basic'
  | 'analytics_advanced'
  | 'analytics_predictive'
  | 'analytics_team'

  // AI features
  | 'ai_basic_chat'
  | 'ai_advanced_chat'
  | 'ai_form_check'
  | 'ai_recovery_optimization'

  // Team management features
  | 'team_basic'
  | 'team_advanced'
  | 'team_analytics'

  // Wellbeing features
  | 'wellbeing_basic'
  | 'wellbeing_advanced'
  | 'wellbeing_sleep_analysis'

  // Customization features
  | 'customization_basic'
  | 'customization_advanced'
  | 'customization_dashboard'

  // Offline features
  | 'offline_workouts'
  | 'offline_nutrition'
  | 'offline_sync';

/**
 * Feature access requirements by subscription tier
 */
export const featureRequirements: Record<Feature, SubscriptionTier[]> = {
  // Workout features
  workout_basic: ['free', 'pro', 'coach', 'elite'],
  workout_advanced: ['pro', 'coach', 'elite'],
  workout_sport_specific: ['pro', 'coach', 'elite'],
  workout_equipment_aware: ['pro', 'coach', 'elite'],
  workout_ai_adaptation: ['elite'],

  // Nutrition features
  nutrition_basic: ['free', 'pro', 'coach', 'elite'],
  nutrition_advanced: ['pro', 'coach', 'elite'],
  nutrition_personalized: ['pro', 'coach', 'elite'],
  nutrition_ai_recommendations: ['elite'],

  // Analytics features
  analytics_basic: ['free', 'pro', 'coach', 'elite'],
  analytics_advanced: ['pro', 'coach', 'elite'],
  analytics_predictive: ['elite'],
  analytics_team: ['coach', 'elite'],

  // AI features
  ai_basic_chat: ['pro', 'coach', 'elite'],
  ai_advanced_chat: ['elite'],
  ai_form_check: ['elite'],
  ai_recovery_optimization: ['elite'],

  // Team management features
  team_basic: ['coach', 'elite'],
  team_advanced: ['coach', 'elite'],
  team_analytics: ['coach', 'elite'],

  // Wellbeing features
  wellbeing_basic: ['free', 'pro', 'coach', 'elite'],
  wellbeing_advanced: ['pro', 'coach', 'elite'],
  wellbeing_sleep_analysis: ['pro', 'coach', 'elite'],

  // Customization features
  customization_basic: ['free', 'pro', 'coach', 'elite'],
  customization_advanced: ['pro', 'coach', 'elite'],
  customization_dashboard: ['elite'],

  // Offline features
  offline_workouts: ['free', 'pro', 'coach', 'elite'],
  offline_nutrition: ['pro', 'coach', 'elite'],
  offline_sync: ['pro', 'coach', 'elite']
};

/**
 * Feature descriptions for upgrade prompts
 */
export const featureDescriptions: Record<Feature, string> = {
  // Workout features
  workout_basic: 'Basic workout plans',
  workout_advanced: 'Advanced workout plans with periodization',
  workout_sport_specific: 'Sport-specific training plans',
  workout_equipment_aware: 'Equipment-aware workout customization',
  workout_ai_adaptation: 'AI-powered dynamic workout adaptation',

  // Nutrition features
  nutrition_basic: 'Basic meal plans',
  nutrition_advanced: 'Advanced nutrition tracking and macros',
  nutrition_personalized: 'Personalized nutrition recommendations',
  nutrition_ai_recommendations: 'AI-powered nutrition optimization',

  // Analytics features
  analytics_basic: 'Basic progress tracking',
  analytics_advanced: 'Advanced performance analytics',
  analytics_predictive: 'Predictive performance modeling',
  analytics_team: 'Team performance analytics',

  // AI features
  ai_basic_chat: 'Basic AI chat with pre-set queries',
  ai_advanced_chat: 'Advanced AI coaching chat',
  ai_form_check: 'AI-powered form check analysis',
  ai_recovery_optimization: '24/7 AI recovery optimization',

  // Team management features
  team_basic: 'Basic team management',
  team_advanced: 'Advanced team management and scheduling',
  team_analytics: 'Team analytics and benchmarking',

  // Wellbeing features
  wellbeing_basic: 'Basic wellbeing tracking',
  wellbeing_advanced: 'Advanced recovery metrics',
  wellbeing_sleep_analysis: 'Sleep quality analysis',

  // Customization features
  customization_basic: 'Basic app customization',
  customization_advanced: 'Advanced preference settings',
  customization_dashboard: 'Fully customizable dashboard',

  // Offline features
  offline_workouts: 'Offline workout access',
  offline_nutrition: 'Offline nutrition plans',
  offline_sync: 'Automatic background syncing'
};

/**
 * Check if a user has access to a specific feature based on their subscription tier
 * or owner status
 *
 * @param feature - The feature to check access for
 * @param userTier - The user's subscription tier
 * @param isOwner - Whether the user is the app owner (default: false)
 * @param trackUsage - Whether to track the access attempt (default: true)
 * @returns True if the user has access to the feature, false otherwise
 */
export const hasFeatureAccess = (
  feature: Feature,
  userTier: SubscriptionTier | null,
  isOwner: boolean = false,
  trackUsage: boolean = true
): boolean => {
  // Owner always has access to all features
  if (isOwner) return true;

  // Otherwise check subscription tier
  if (!userTier) return false;

  const hasAccess = featureRequirements[feature].includes(userTier);

  // Track feature access attempt if tracking is enabled
  if (trackUsage) {
    try {
      // Import analytics dynamically to avoid circular dependencies
      import('./analytics').then(analytics => {
        analytics.trackFeatureAccess(
          feature,
          hasAccess,
          getMinimumTierForFeature(feature)
        );
      });
    } catch (error) {
      console.error('Failed to track feature access:', error);
    }
  }

  return hasAccess;
};

/**
 * Get the minimum subscription tier required for a feature
 *
 * @param feature - The feature to check
 * @returns The minimum subscription tier required
 */
export const getMinimumTierForFeature = (feature: Feature): SubscriptionTier => {
  const tiers = featureRequirements[feature];
  if (tiers.includes('free')) return 'free';
  if (tiers.includes('pro')) return 'pro';
  if (tiers.includes('coach')) return 'coach';
  return 'elite';
};

/**
 * Get all features available for a specific subscription tier or owner
 *
 * @param tier - The subscription tier
 * @param isOwner - Whether the user is the app owner (default: false)
 * @returns Array of features available for the tier or owner
 */
export const getAvailableFeatures = (
  tier: SubscriptionTier | null,
  isOwner: boolean = false
): Feature[] => {
  // Owner has access to all features
  if (isOwner) {
    return Object.keys(featureRequirements) as Feature[];
  }

  // Otherwise check subscription tier
  if (!tier) return [];

  return Object.entries(featureRequirements)
    .filter(([_, tiers]) => tiers.includes(tier))
    .map(([feature, _]) => feature as Feature);
};

/**
 * Get features that would be unlocked by upgrading to a specific tier
 *
 * @param currentTier - The user's current subscription tier
 * @param targetTier - The tier the user would upgrade to
 * @returns Array of features that would be unlocked
 */
export const getUpgradeFeatures = (
  currentTier: SubscriptionTier | null,
  targetTier: SubscriptionTier
): Feature[] => {
  if (!currentTier) currentTier = 'free';

  const currentFeatures = getAvailableFeatures(currentTier);
  const targetFeatures = getAvailableFeatures(targetTier);

  return targetFeatures.filter(feature => !currentFeatures.includes(feature));
};

/**
 * Get the next recommended subscription tier for a user
 *
 * @param currentTier - The user's current subscription tier
 * @returns The next recommended tier, or null if already at the highest tier
 */
export const getNextRecommendedTier = (currentTier: SubscriptionTier | null): SubscriptionTier | null => {
  if (!currentTier) return 'pro';

  switch (currentTier) {
    case 'free':
      return 'pro';
    case 'pro':
      return 'elite';
    case 'coach':
      return 'elite';
    case 'elite':
      return null; // Already at highest tier
    default:
      return 'pro';
  }
};
