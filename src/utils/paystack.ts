/**
 * Paystack Payment Utilities
 *
 * This module provides utilities for integrating Paystack payments into the application.
 */

// Constants
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
const API_BASE = 'https://api.paystack.co';

// Types
export interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  reference: string;
  plan?: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  transaction: any;
}

/**
 * Initialize a Paystack payment
 */
export async function initializePayment(config: PaystackConfig): Promise<PaystackResponse> {
  const {
    amount,
    currency = 'NGN',
    reference,
    plan,
  } = config;

  const url = `${API_BASE}/transaction/initialize`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${PUBLIC_KEY}`,
  };
  const body = JSON.stringify({
    amount: amount * 100, // Amount in kobo/cents
    currency,
    reference,
    plan,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    throw new Error(`Paystack initialization failed: ${error.message}`);
  }
}

/**
 * Verify a Paystack payment
 */
export async function verifyPayment(reference: string): Promise<PaystackResponse> {
  const url = `${API_BASE}/transaction/verify/${reference}`;
  const headers = {
    'Authorization': `Bearer ${PUBLIC_KEY}`,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    throw new Error(`Paystack verification failed: ${error.message}`);
  }
}

/**
 * Get Paystack transaction details
 */
export async function getTransactionDetails(transactionId: string): Promise<any> {
  const url = `${API_BASE}/transaction/${transactionId}`;
  const headers = {
    'Authorization': `Bearer ${PUBLIC_KEY}`,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Paystack transaction details error:', error);
    throw new Error(`Failed to fetch transaction details: ${error.message}`);
  }
}

/**
 * List Paystack transactions
 */
export async function listTransactions(params?: Record<string, any>): Promise<any> {
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_BASE}/transaction?${queryParams}`;
  const headers = {
    'Authorization': `Bearer ${PUBLIC_KEY}`,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Paystack list transactions error:', error);
    throw new Error(`Failed to list transactions: ${error.message}`);
  }
}

/**
 * Charge authorization
 */
export async function chargeAuthorization(
  authorizationCode: string,
  email: string,
  amount: number,
  currency: string = 'NGN'
): Promise<PaystackResponse> {
  const url = `${API_BASE}/transaction/charge_authorization`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${PUBLIC_KEY}`,
  };
  const body = JSON.stringify({
    authorization_code: authorizationCode,
    email,
    amount: amount * 100, // Amount in kobo/cents
    currency,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Paystack charge authorization error:', error);
    throw new Error(`Paystack charge authorization failed: ${error.message}`);
  }
}

/**
 * Open Paystack checkout popup
 */
export function openPaystackPopup(config: PaystackConfig): void {
  const paystackConfig = {
    key: config.key,
    email: config.email,
    amount: config.amount,
    currency: config.currency,
    ref: config.reference,
    plan: config.plan,
    callback: config.callback,
    onClose: config.onClose,
  };

  const handler = (window as any).PaystackPop;
  if (handler) {
    handler.setup(paystackConfig);
    handler.openIframe();
  } else {
    console.error('PaystackPop not found. Ensure the Paystack script is loaded.');
  }
}
