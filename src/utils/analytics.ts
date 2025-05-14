/**
 * Analytics Utilities
 * 
 * This module provides utilities for tracking user behavior, feature usage,
 * and subscription conversions. It can be integrated with analytics services
 * like Google Analytics, Mixpanel, or Amplitude.
 */

import { SubscriptionTier } from '@/context/PlanContext';
import { Feature } from './feature-access';

// Analytics event categories
export enum EventCategory {
  SUBSCRIPTION = 'subscription',
  FEATURE_USAGE = 'feature_usage',
  USER_ENGAGEMENT = 'user_engagement',
  PAYMENT = 'payment',
  ONBOARDING = 'onboarding',
  ERROR = 'error'
}

// Analytics event actions
export enum EventAction {
  // Subscription events
  SUBSCRIPTION_VIEWED = 'subscription_viewed',
  SUBSCRIPTION_STARTED = 'subscription_started',
  SUBSCRIPTION_COMPLETED = 'subscription_completed',
  SUBSCRIPTION_CANCELED = 'subscription_canceled',
  SUBSCRIPTION_CHANGED = 'subscription_changed',
  
  // Feature usage events
  FEATURE_VIEWED = 'feature_viewed',
  FEATURE_USED = 'feature_used',
  FEATURE_COMPLETED = 'feature_completed',
  FEATURE_ABANDONED = 'feature_abandoned',
  FEATURE_LOCKED = 'feature_locked',
  
  // User engagement events
  PAGE_VIEWED = 'page_viewed',
  BUTTON_CLICKED = 'button_clicked',
  FORM_SUBMITTED = 'form_submitted',
  SEARCH_PERFORMED = 'search_performed',
  
  // Payment events
  PAYMENT_STARTED = 'payment_started',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  
  // Onboarding events
  ONBOARDING_STARTED = 'onboarding_started',
  ONBOARDING_STEP_COMPLETED = 'onboarding_step_completed',
  ONBOARDING_COMPLETED = 'onboarding_completed',
  
  // Error events
  ERROR_OCCURRED = 'error_occurred'
}

/**
 * Track an analytics event
 * 
 * @param category - Event category
 * @param action - Event action
 * @param label - Event label (optional)
 * @param value - Event value (optional)
 * @param properties - Additional properties (optional)
 */
export const trackEvent = (
  category: EventCategory,
  action: EventAction,
  label?: string,
  value?: number,
  properties?: Record<string, any>
): void => {
  // For now, we'll just log the event since we don't have a real analytics service
  console.log('Analytics Event:', {
    category,
    action,
    label,
    value,
    properties,
    timestamp: new Date().toISOString()
  });
  
  // In a real implementation, you would send the event to your analytics service
  // For example, with Google Analytics:
  // if (window.gtag) {
  //   window.gtag('event', action, {
  //     event_category: category,
  //     event_label: label,
  //     value,
  //     ...properties
  //   });
  // }
};

/**
 * Track a page view
 * 
 * @param pageName - Name of the page
 * @param pageUrl - URL of the page (optional, defaults to current URL)
 * @param properties - Additional properties (optional)
 */
export const trackPageView = (
  pageName: string,
  pageUrl?: string,
  properties?: Record<string, any>
): void => {
  const url = pageUrl || window.location.pathname + window.location.search;
  
  trackEvent(
    EventCategory.USER_ENGAGEMENT,
    EventAction.PAGE_VIEWED,
    pageName,
    undefined,
    {
      page_url: url,
      ...properties
    }
  );
};

/**
 * Track a feature usage event
 * 
 * @param feature - Feature being used
 * @param action - Event action
 * @param properties - Additional properties (optional)
 */
export const trackFeatureUsage = (
  feature: Feature,
  action: EventAction,
  properties?: Record<string, any>
): void => {
  trackEvent(
    EventCategory.FEATURE_USAGE,
    action,
    feature,
    undefined,
    properties
  );
};

/**
 * Track a subscription event
 * 
 * @param tier - Subscription tier
 * @param action - Event action
 * @param properties - Additional properties (optional)
 */
export const trackSubscription = (
  tier: SubscriptionTier,
  action: EventAction,
  properties?: Record<string, any>
): void => {
  trackEvent(
    EventCategory.SUBSCRIPTION,
    action,
    tier,
    undefined,
    properties
  );
};

/**
 * Track a payment event
 * 
 * @param amount - Payment amount
 * @param action - Event action
 * @param properties - Additional properties (optional)
 */
export const trackPayment = (
  amount: number,
  action: EventAction,
  properties?: Record<string, any>
): void => {
  trackEvent(
    EventCategory.PAYMENT,
    action,
    undefined,
    amount,
    properties
  );
};

/**
 * Track an error event
 * 
 * @param errorMessage - Error message
 * @param errorCode - Error code (optional)
 * @param properties - Additional properties (optional)
 */
export const trackError = (
  errorMessage: string,
  errorCode?: string,
  properties?: Record<string, any>
): void => {
  trackEvent(
    EventCategory.ERROR,
    EventAction.ERROR_OCCURRED,
    errorMessage,
    undefined,
    {
      error_code: errorCode,
      ...properties
    }
  );
};

/**
 * Track a feature access attempt
 * 
 * @param feature - Feature being accessed
 * @param hasAccess - Whether the user has access to the feature
 * @param requiredTier - Required subscription tier for the feature
 */
export const trackFeatureAccess = (
  feature: Feature,
  hasAccess: boolean,
  requiredTier: SubscriptionTier
): void => {
  trackEvent(
    EventCategory.FEATURE_USAGE,
    hasAccess ? EventAction.FEATURE_USED : EventAction.FEATURE_LOCKED,
    feature,
    undefined,
    {
      has_access: hasAccess,
      required_tier: requiredTier
    }
  );
};

/**
 * Track a subscription conversion
 * 
 * @param fromTier - Original subscription tier
 * @param toTier - New subscription tier
 * @param amount - Payment amount
 * @param properties - Additional properties (optional)
 */
export const trackSubscriptionConversion = (
  fromTier: SubscriptionTier | null,
  toTier: SubscriptionTier,
  amount: number,
  properties?: Record<string, any>
): void => {
  trackEvent(
    EventCategory.SUBSCRIPTION,
    EventAction.SUBSCRIPTION_COMPLETED,
    `${fromTier || 'none'}_to_${toTier}`,
    amount,
    {
      from_tier: fromTier || 'none',
      to_tier: toTier,
      ...properties
    }
  );
};

/**
 * Initialize analytics
 * 
 * @param userId - User ID (optional)
 * @param userProperties - User properties (optional)
 */
export const initAnalytics = (
  userId?: string,
  userProperties?: Record<string, any>
): void => {
  // For now, we'll just log the initialization since we don't have a real analytics service
  console.log('Analytics Initialized:', {
    userId,
    userProperties,
    timestamp: new Date().toISOString()
  });
  
  // In a real implementation, you would initialize your analytics service
  // For example, with Google Analytics:
  // if (window.gtag) {
  //   window.gtag('config', 'GA-MEASUREMENT-ID', {
  //     user_id: userId,
  //     ...userProperties
  //   });
  // }
};

export default {
  trackEvent,
  trackPageView,
  trackFeatureUsage,
  trackSubscription,
  trackPayment,
  trackError,
  trackFeatureAccess,
  trackSubscriptionConversion,
  initAnalytics,
  EventCategory,
  EventAction
};
