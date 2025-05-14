/**
 * Paystack Integration Utilities
 * 
 * This module provides utilities for integrating with the Paystack payment gateway.
 * It includes functions for initializing payments, verifying transactions, and
 * managing subscriptions.
 * 
 * Paystack API documentation: https://paystack.com/docs/api/
 */

import axios from 'axios';
import { SubscriptionTier } from '@/context/PlanContext';

// Replace with your actual Paystack public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// API endpoints
const PAYSTACK_API_BASE = 'https://api.paystack.co';
const INITIALIZE_ENDPOINT = '/transaction/initialize';
const VERIFY_ENDPOINT = '/transaction/verify';

// Subscription plan IDs (replace with your actual plan IDs from Paystack dashboard)
export const SUBSCRIPTION_PLAN_IDS = {
  pro: 'PLN_xxxxxxxxxx',
  coach: 'PLN_xxxxxxxxxx',
  elite: 'PLN_xxxxxxxxxx'
};

// Subscription prices (in cents)
export const SUBSCRIPTION_PRICES = {
  pro: {
    monthly: 999, // $9.99
    yearly: 9900  // $99.00
  },
  coach: {
    monthly: 1999, // $19.99
    yearly: 19900  // $199.00
  },
  elite: {
    monthly: 4999, // $49.99
    yearly: 49900  // $499.00
  }
};

// Subscription periods
export type SubscriptionPeriod = 'monthly' | 'yearly';

/**
 * Initialize a Paystack payment
 * 
 * @param email - Customer email address
 * @param amount - Amount to charge (in cents)
 * @param tier - Subscription tier
 * @param period - Subscription period (monthly or yearly)
 * @param metadata - Additional metadata for the transaction
 * @returns Promise with the authorization URL and reference
 */
export const initializePayment = async (
  email: string,
  tier: SubscriptionTier,
  period: SubscriptionPeriod,
  metadata: Record<string, any> = {}
): Promise<{ authorizationUrl: string; reference: string }> => {
  if (tier === 'free' || !tier) {
    throw new Error('Cannot process payment for free tier');
  }
  
  const amount = period === 'yearly' 
    ? SUBSCRIPTION_PRICES[tier].yearly 
    : SUBSCRIPTION_PRICES[tier].monthly;
  
  try {
    const response = await axios.post(
      PAYSTACK_API_BASE + INITIALIZE_ENDPOINT,
      {
        email,
        amount,
        metadata: {
          subscription_tier: tier,
          subscription_period: period,
          ...metadata
        },
        callback_url: `${window.location.origin}/payment/callback`,
        plan: SUBSCRIPTION_PLAN_IDS[tier]
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference
    };
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw new Error('Failed to initialize payment. Please try again.');
  }
};

/**
 * Verify a Paystack transaction
 * 
 * @param reference - Transaction reference
 * @returns Promise with the transaction details
 */
export const verifyTransaction = async (reference: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${PAYSTACK_API_BASE}${VERIFY_ENDPOINT}/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw new Error('Failed to verify transaction. Please contact support.');
  }
};

/**
 * Get the subscription details for a tier and period
 * 
 * @param tier - Subscription tier
 * @param period - Subscription period (monthly or yearly)
 * @returns Subscription details
 */
export const getSubscriptionDetails = (
  tier: SubscriptionTier,
  period: SubscriptionPeriod
): { name: string; price: number; interval: string } => {
  if (tier === 'free' || !tier) {
    return {
      name: 'Free',
      price: 0,
      interval: 'N/A'
    };
  }
  
  const price = period === 'yearly' 
    ? SUBSCRIPTION_PRICES[tier].yearly / 100 
    : SUBSCRIPTION_PRICES[tier].monthly / 100;
  
  const tierNames = {
    pro: 'Pro Athlete',
    coach: 'Coach Pro',
    elite: 'Elite AI'
  };
  
  return {
    name: tierNames[tier],
    price,
    interval: period === 'yearly' ? 'year' : 'month'
  };
};

/**
 * Format a price for display
 * 
 * @param price - Price in cents
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return `$${(price / 100).toFixed(2)}`;
};

/**
 * Calculate savings between monthly and yearly plans
 * 
 * @param tier - Subscription tier
 * @returns Savings amount and percentage
 */
export const calculateYearlySavings = (
  tier: SubscriptionTier
): { amount: number; percentage: number } => {
  if (tier === 'free' || !tier) {
    return { amount: 0, percentage: 0 };
  }
  
  const monthlyAnnual = SUBSCRIPTION_PRICES[tier].monthly * 12;
  const yearly = SUBSCRIPTION_PRICES[tier].yearly;
  const savings = monthlyAnnual - yearly;
  const percentage = Math.round((savings / monthlyAnnual) * 100);
  
  return {
    amount: savings / 100, // Convert to dollars
    percentage
  };
};

/**
 * Initialize the Paystack inline widget
 * 
 * @param email - Customer email address
 * @param amount - Amount to charge (in cents)
 * @param metadata - Additional metadata for the transaction
 * @param onSuccess - Callback function on successful payment
 * @param onCancel - Callback function on cancelled payment
 */
export const initializePaystackInline = (
  email: string,
  amount: number,
  metadata: Record<string, any> = {},
  onSuccess: (reference: string) => void,
  onCancel: () => void
): void => {
  // @ts-ignore - Paystack is loaded via script tag
  const paystack = window.PaystackPop;
  if (!paystack) {
    console.error('Paystack not loaded');
    return;
  }
  
  const handler = paystack.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount,
    metadata,
    callback: (response: { reference: string }) => {
      onSuccess(response.reference);
    },
    onClose: () => {
      onCancel();
    }
  });
  
  handler.openIframe();
};

export default {
  initializePayment,
  verifyTransaction,
  getSubscriptionDetails,
  formatPrice,
  calculateYearlySavings,
  initializePaystackInline,
  SUBSCRIPTION_PRICES,
  SUBSCRIPTION_PLAN_IDS
};
