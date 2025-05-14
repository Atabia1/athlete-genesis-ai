/**
 * Feature Flags Utility
 * 
 * This utility provides a way to check if a feature is enabled based on environment variables.
 * It also supports overriding feature flags for testing and development.
 */

/**
 * Feature flag names
 */
export enum FeatureFlag {
  OFFLINE_MODE = 'OFFLINE_MODE',
  COACH_DASHBOARD = 'COACH_DASHBOARD',
  ANALYTICS = 'ANALYTICS',
  DARK_MODE = 'DARK_MODE',
}

/**
 * Feature flag overrides for testing and development
 */
const featureFlagOverrides: Record<string, boolean> = {};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  // Check for override
  if (feature in featureFlagOverrides) {
    return featureFlagOverrides[feature];
  }
  
  // Check environment variable
  const envVarName = `VITE_FEATURE_${feature}`;
  const envValue = import.meta.env[envVarName];
  
  // If the environment variable is not defined, default to false
  if (envValue === undefined) {
    console.warn(`Feature flag ${feature} is not defined in environment variables`);
    return false;
  }
  
  // Convert string to boolean
  return envValue === 'true' || envValue === true;
}

/**
 * Override a feature flag (for testing and development)
 */
export function overrideFeatureFlag(feature: FeatureFlag, enabled: boolean): void {
  featureFlagOverrides[feature] = enabled;
  console.log(`Feature flag ${feature} overridden to ${enabled}`);
}

/**
 * Reset all feature flag overrides
 */
export function resetFeatureFlagOverrides(): void {
  Object.keys(featureFlagOverrides).forEach(key => {
    delete featureFlagOverrides[key];
  });
  console.log('All feature flag overrides reset');
}

/**
 * Get all feature flags and their status
 */
export function getAllFeatureFlags(): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  
  // Get all feature flags
  Object.values(FeatureFlag).forEach(feature => {
    flags[feature] = isFeatureEnabled(feature as FeatureFlag);
  });
  
  return flags;
}

/**
 * React hook for checking if a feature is enabled
 */
export function useFeatureFlag(feature: FeatureFlag): boolean {
  return isFeatureEnabled(feature);
}
