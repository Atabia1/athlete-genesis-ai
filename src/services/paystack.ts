/**
 * Paystack Service
 * 
 * This module provides a Paystack service for payment processing
 * using environment variables from the env-config utility.
 */

import { getPaystackPublicKey } from '@/utils/env-config';

// Get Paystack public key from environment
const PAYSTACK_PUBLIC_KEY = getPaystackPublicKey();

/**
 * Initialize Paystack popup
 */
export function initializePaystack(options: {
  email: string;
  amount: number;
  ref?: string;
  currency?: string;
  plan?: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}) {
  // Check if Paystack is available
  if (typeof window.PaystackPop === 'undefined') {
    throw new Error('Paystack is not loaded. Make sure to include the Paystack script in your HTML.');
  }

  // Create a reference if not provided
  const reference = options.ref || generateReference();

  // Initialize Paystack popup
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: options.email,
    amount: options.amount * 100, // Convert to kobo (Paystack uses the smallest currency unit)
    currency: options.currency || 'NGN',
    ref: reference,
    plan: options.plan,
    callback: options.callback,
    onClose: options.onClose,
  });

  // Open the popup
  handler.openIframe();

  return reference;
}

/**
 * Generate a unique reference
 */
function generateReference(): string {
  return `ref_${Math.floor(Math.random() * 1000000000)}_${Date.now()}`;
}

/**
 * Paystack response interface
 */
export interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
  trxref: string;
}

/**
 * Paystack service
 */
export const paystackService = {
  /**
   * Initialize a payment
   */
  initializePayment: (options: {
    email: string;
    amount: number;
    ref?: string;
    currency?: string;
    plan?: string;
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
  }) => {
    return initializePaystack(options);
  },

  /**
   * Verify a payment
   * Note: This should be done on the server side for security reasons
   */
  verifyPayment: async (reference: string) => {
    // This is a client-side mock. In a real application, this should be done on the server.
    console.warn('Payment verification should be done on the server side for security reasons.');
    
    // Mock a successful verification
    return {
      status: true,
      message: 'Verification successful',
      data: {
        reference,
        status: 'success',
        amount: 0,
        currency: 'NGN',
        transaction_date: new Date().toISOString(),
        customer: {
          email: '',
          name: '',
        },
      },
    };
  },

  /**
   * Get Paystack public key
   */
  getPublicKey: () => {
    return PAYSTACK_PUBLIC_KEY;
  },
};

// Add Paystack types to the global window object
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref: string;
        plan?: string;
        callback: (response: PaystackResponse) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export default paystackService;
