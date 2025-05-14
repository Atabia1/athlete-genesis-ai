/**
 * Paystack Service
 *
 * This service provides methods for interacting with the Paystack payment gateway.
 * It handles payment initialization, verification, subscription management,
 * recurring payments, payment history, and discount codes.
 */

import { PaystackOptions } from '@paystack/inline-js';

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Payment type enum
 */
export enum PaymentType {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription'
}

/**
 * Payment currency enum
 */
export enum PaymentCurrency {
  NGN = 'NGN',
  USD = 'USD',
  GHS = 'GHS',
  ZAR = 'ZAR',
  KES = 'KES'
}

/**
 * Payment plan interface
 */
export interface PaymentPlan {
  id: string;
  name: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'monthly' | 'annually';
  description?: string;
}

/**
 * Payment transaction interface
 */
export interface PaymentTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  type: PaymentType;
  planId?: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  discountCode?: string;
  discountAmount?: number;
}

/**
 * Subscription interface
 */
export interface Subscription {
  id: string;
  code: string;
  planId: string;
  planName: string;
  customerId: string;
  customerEmail: string;
  amount: number;
  status: 'active' | 'cancelled' | 'paused' | 'expired';
  nextPaymentDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Discount code interface
 */
export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // Percentage or fixed amount
  maxUses: number;
  usedCount: number;
  expiryDate?: string;
  planIds?: string[]; // Specific plans this code applies to (empty means all)
  isActive: boolean;
  createdAt: string;
}

/**
 * Payment initialization options
 */
export interface PaymentInitOptions {
  email: string;
  amount: number; // Amount in smallest currency unit (e.g., kobo for NGN, cents for USD)
  currency?: PaymentCurrency;
  reference?: string;
  planId?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
  discountCode?: string;
  onSuccess?: (transaction: PaymentTransaction) => void;
  onCancel?: () => void;
}

/**
 * Paystack service interface
 */
export interface PaystackService {
  /**
   * Initialize a payment
   */
  initializePayment(options: PaymentInitOptions): Promise<string>;

  /**
   * Verify a payment transaction
   */
  verifyTransaction(reference: string): Promise<PaymentTransaction>;

  /**
   * Create a subscription plan
   */
  createPlan(plan: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan>;

  /**
   * Get a subscription plan
   */
  getPlan(planId: string): Promise<PaymentPlan>;

  /**
   * List all subscription plans
   */
  listPlans(): Promise<PaymentPlan[]>;

  /**
   * Create a subscription
   */
  createSubscription(email: string, planId: string, metadata?: Record<string, any>): Promise<Subscription>;

  /**
   * Get a subscription
   */
  getSubscription(subscriptionId: string): Promise<Subscription>;

  /**
   * List subscriptions for a customer
   */
  listCustomerSubscriptions(customerId: string): Promise<Subscription[]>;

  /**
   * Cancel a subscription
   */
  cancelSubscription(subscriptionCode: string): Promise<boolean>;

  /**
   * Pause a subscription
   */
  pauseSubscription(subscriptionCode: string): Promise<boolean>;

  /**
   * Resume a subscription
   */
  resumeSubscription(subscriptionCode: string): Promise<boolean>;

  /**
   * Get transaction history for a customer
   */
  getTransactionHistory(customerId: string, page?: number, perPage?: number): Promise<PaymentTransaction[]>;

  /**
   * Generate a receipt for a transaction
   */
  generateReceipt(transactionId: string): Promise<string>;

  /**
   * Create a discount code
   */
  createDiscountCode(code: Omit<DiscountCode, 'id' | 'usedCount' | 'createdAt'>): Promise<DiscountCode>;

  /**
   * Validate a discount code
   */
  validateDiscountCode(code: string, amount: number, planId?: string): Promise<{ valid: boolean; discountAmount: number }>;

  /**
   * Apply a discount code to a payment
   */
  applyDiscountCode(code: string, amount: number, planId?: string): Promise<{ amount: number; discountAmount: number }>;

  /**
   * List all discount codes
   */
  listDiscountCodes(active?: boolean): Promise<DiscountCode[]>;

  /**
   * Deactivate a discount code
   */
  deactivateDiscountCode(codeId: string): Promise<boolean>;
}

/**
 * Paystack service implementation
 */
export class PaystackServiceImpl implements PaystackService {
  private readonly publicKey: string;
  private readonly secretKey: string;
  private readonly apiUrl: string = 'https://api.paystack.co';

  constructor() {
    // Get Paystack keys from environment variables
    this.publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    this.secretKey = import.meta.env.VITE_PAYSTACK_SECRET_KEY;

    if (!this.publicKey || !this.secretKey) {
      console.error('Paystack environment variables are not set');
      throw new Error('Paystack environment variables are not set');
    }
  }

  /**
   * Initialize a payment
   */
  async initializePayment(options: PaymentInitOptions): Promise<string> {
    try {
      // Generate a reference if not provided
      const reference = options.reference || this.generateReference();

      // Prepare the request payload
      const payload = {
        email: options.email,
        amount: options.amount,
        currency: options.currency || PaymentCurrency.NGN,
        reference,
        plan: options.planId,
        callback_url: options.callbackUrl,
        metadata: options.metadata
      };

      // Make API request to initialize transaction
      const response = await fetch(`${this.apiUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize payment');
      }

      return data.data.authorization_url;
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyTransaction(reference: string): Promise<PaymentTransaction> {
    try {
      const response = await fetch(`${this.apiUrl}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify transaction');
      }

      // Map Paystack response to our PaymentTransaction interface
      const transaction: PaymentTransaction = {
        id: data.data.id,
        reference: data.data.reference,
        amount: data.data.amount,
        currency: data.data.currency as PaymentCurrency,
        status: this.mapPaystackStatus(data.data.status),
        type: data.data.plan ? PaymentType.SUBSCRIPTION : PaymentType.ONE_TIME,
        planId: data.data.plan?.id,
        customerId: data.data.customer.id,
        customerEmail: data.data.customer.email,
        customerName: `${data.data.customer.first_name} ${data.data.customer.last_name}`,
        metadata: data.data.metadata,
        createdAt: data.data.created_at,
        updatedAt: data.data.updated_at
      };

      return transaction;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      throw error;
    }
  }

  /**
   * Create a subscription plan
   */
  async createPlan(plan: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan> {
    try {
      const response = await fetch(`${this.apiUrl}/plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: plan.name,
          amount: plan.amount,
          interval: plan.interval,
          description: plan.description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create plan');
      }

      return {
        id: data.data.id,
        name: data.data.name,
        amount: data.data.amount,
        interval: data.data.interval,
        description: data.data.description
      };
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }

  /**
   * Get a subscription plan
   */
  async getPlan(planId: string): Promise<PaymentPlan> {
    try {
      const response = await fetch(`${this.apiUrl}/plan/${planId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get plan');
      }

      return {
        id: data.data.id,
        name: data.data.name,
        amount: data.data.amount,
        interval: data.data.interval as 'daily' | 'weekly' | 'monthly' | 'annually',
        description: data.data.description
      };
    } catch (error) {
      console.error('Error getting plan:', error);
      throw error;
    }
  }

  /**
   * List all subscription plans
   */
  async listPlans(): Promise<PaymentPlan[]> {
    try {
      const response = await fetch(`${this.apiUrl}/plan`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to list plans');
      }

      return data.data.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        amount: plan.amount,
        interval: plan.interval as 'daily' | 'weekly' | 'monthly' | 'annually',
        description: plan.description
      }));
    } catch (error) {
      console.error('Error listing plans:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/subscription/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: subscriptionCode,
          token: 'token' // This should be the email token sent to the user
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }

      return data.status;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(email: string, planId: string, metadata?: Record<string, any>): Promise<Subscription> {
    try {
      const response = await fetch(`${this.apiUrl}/subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: email,
          plan: planId,
          metadata
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }

      return this.mapPaystackSubscription(data.data);
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Get a subscription
   */
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await fetch(`${this.apiUrl}/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get subscription');
      }

      return this.mapPaystackSubscription(data.data);
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  /**
   * List subscriptions for a customer
   */
  async listCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const response = await fetch(`${this.apiUrl}/subscription?customer=${customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to list customer subscriptions');
      }

      return data.data.map((sub: any) => this.mapPaystackSubscription(sub));
    } catch (error) {
      console.error('Error listing customer subscriptions:', error);
      throw error;
    }
  }

  /**
   * Pause a subscription
   */
  async pauseSubscription(subscriptionCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/subscription/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: subscriptionCode,
          token: 'token' // This should be the email token sent to the user
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to pause subscription');
      }

      return data.status;
    } catch (error) {
      console.error('Error pausing subscription:', error);
      throw error;
    }
  }

  /**
   * Resume a subscription
   */
  async resumeSubscription(subscriptionCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/subscription/enable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: subscriptionCode,
          token: 'token' // This should be the email token sent to the user
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resume subscription');
      }

      return data.status;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw error;
    }
  }

  /**
   * Get transaction history for a customer
   */
  async getTransactionHistory(customerId: string, page: number = 1, perPage: number = 20): Promise<PaymentTransaction[]> {
    try {
      const response = await fetch(`${this.apiUrl}/transaction?customer=${customerId}&perPage=${perPage}&page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get transaction history');
      }

      return data.data.map((transaction: any) => ({
        id: transaction.id,
        reference: transaction.reference,
        amount: transaction.amount,
        currency: transaction.currency as PaymentCurrency,
        status: this.mapPaystackStatus(transaction.status),
        type: transaction.plan ? PaymentType.SUBSCRIPTION : PaymentType.ONE_TIME,
        planId: transaction.plan?.id,
        customerId: transaction.customer.id,
        customerEmail: transaction.customer.email,
        customerName: `${transaction.customer.first_name} ${transaction.customer.last_name}`,
        metadata: transaction.metadata,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
        discountCode: transaction.metadata?.discountCode,
        discountAmount: transaction.metadata?.discountAmount
      }));
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  /**
   * Generate a receipt for a transaction
   */
  async generateReceipt(transactionId: string): Promise<string> {
    try {
      // Get transaction details
      const transaction = await this.verifyTransaction(transactionId);

      // In a real implementation, you would generate a PDF receipt
      // For this example, we'll return a URL to a receipt page
      return `/receipts/${transactionId}`;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  }

  /**
   * Create a discount code
   *
   * Note: Paystack doesn't have built-in discount codes, so we'll implement this
   * in our own database. This is a mock implementation.
   */
  async createDiscountCode(code: Omit<DiscountCode, 'id' | 'usedCount' | 'createdAt'>): Promise<DiscountCode> {
    try {
      // In a real implementation, you would save this to your database
      // For this example, we'll mock the response
      return {
        id: this.generateReference(),
        code: code.code,
        type: code.type,
        value: code.value,
        maxUses: code.maxUses,
        usedCount: 0,
        expiryDate: code.expiryDate,
        planIds: code.planIds,
        isActive: code.isActive,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating discount code:', error);
      throw error;
    }
  }

  /**
   * Validate a discount code
   *
   * Note: This is a mock implementation since Paystack doesn't have built-in discount codes.
   */
  async validateDiscountCode(code: string, amount: number, planId?: string): Promise<{ valid: boolean; discountAmount: number }> {
    try {
      // In a real implementation, you would check your database
      // For this example, we'll mock some validation logic

      // Mock discount codes
      const discountCodes: Record<string, DiscountCode> = {
        'WELCOME10': {
          id: '1',
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          maxUses: 100,
          usedCount: 5,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        'FIXED20': {
          id: '2',
          code: 'FIXED20',
          type: 'fixed',
          value: 2000, // 20 in the smallest currency unit
          maxUses: 50,
          usedCount: 10,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      };

      const discountCode = discountCodes[code.toUpperCase()];

      if (!discountCode) {
        return { valid: false, discountAmount: 0 };
      }

      if (!discountCode.isActive) {
        return { valid: false, discountAmount: 0 };
      }

      if (discountCode.usedCount >= discountCode.maxUses) {
        return { valid: false, discountAmount: 0 };
      }

      if (discountCode.expiryDate && new Date(discountCode.expiryDate) < new Date()) {
        return { valid: false, discountAmount: 0 };
      }

      if (discountCode.planIds && discountCode.planIds.length > 0 && planId && !discountCode.planIds.includes(planId)) {
        return { valid: false, discountAmount: 0 };
      }

      let discountAmount = 0;

      if (discountCode.type === 'percentage') {
        discountAmount = Math.floor(amount * (discountCode.value / 100));
      } else {
        discountAmount = Math.min(discountCode.value, amount);
      }

      return { valid: true, discountAmount };
    } catch (error) {
      console.error('Error validating discount code:', error);
      throw error;
    }
  }

  /**
   * Apply a discount code to a payment
   */
  async applyDiscountCode(code: string, amount: number, planId?: string): Promise<{ amount: number; discountAmount: number }> {
    try {
      const validation = await this.validateDiscountCode(code, amount, planId);

      if (!validation.valid) {
        throw new Error('Invalid discount code');
      }

      return {
        amount: amount - validation.discountAmount,
        discountAmount: validation.discountAmount
      };
    } catch (error) {
      console.error('Error applying discount code:', error);
      throw error;
    }
  }

  /**
   * List all discount codes
   *
   * Note: This is a mock implementation since Paystack doesn't have built-in discount codes.
   */
  async listDiscountCodes(active?: boolean): Promise<DiscountCode[]> {
    try {
      // In a real implementation, you would fetch from your database
      // For this example, we'll mock some discount codes

      const discountCodes: DiscountCode[] = [
        {
          id: '1',
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          maxUses: 100,
          usedCount: 5,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          code: 'FIXED20',
          type: 'fixed',
          value: 2000, // 20 in the smallest currency unit
          maxUses: 50,
          usedCount: 10,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          code: 'EXPIRED50',
          type: 'percentage',
          value: 50,
          maxUses: 10,
          usedCount: 5,
          expiryDate: '2023-01-01T00:00:00Z',
          isActive: false,
          createdAt: new Date().toISOString()
        }
      ];

      if (active !== undefined) {
        return discountCodes.filter(code => code.isActive === active);
      }

      return discountCodes;
    } catch (error) {
      console.error('Error listing discount codes:', error);
      throw error;
    }
  }

  /**
   * Deactivate a discount code
   */
  async deactivateDiscountCode(codeId: string): Promise<boolean> {
    try {
      // In a real implementation, you would update your database
      // For this example, we'll mock the response
      return true;
    } catch (error) {
      console.error('Error deactivating discount code:', error);
      throw error;
    }
  }

  /**
   * Generate a unique reference
   */
  private generateReference(): string {
    return `ATHLETE_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  }

  /**
   * Map Paystack status to our PaymentStatus enum
   */
  private mapPaystackStatus(status: string): PaymentStatus {
    switch (status.toLowerCase()) {
      case 'success':
        return PaymentStatus.SUCCESS;
      case 'failed':
        return PaymentStatus.FAILED;
      case 'abandoned':
        return PaymentStatus.CANCELLED;
      default:
        return PaymentStatus.PENDING;
    }
  }

  /**
   * Map Paystack subscription to our Subscription interface
   */
  private mapPaystackSubscription(data: any): Subscription {
    return {
      id: data.id,
      code: data.subscription_code,
      planId: data.plan.id,
      planName: data.plan.name,
      customerId: data.customer.id,
      customerEmail: data.customer.email,
      amount: data.amount,
      status: data.status,
      nextPaymentDate: data.next_payment_date,
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at
    };
  }
}

// Create singleton instance
export const paystackService = new PaystackServiceImpl();

export default paystackService;
