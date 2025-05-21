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
    // Get Paystack keys from environment variables or config.js
    this.publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 
                     (typeof window !== 'undefined' && window.APP_CONFIG?.PAYSTACK_PUBLIC_KEY) || 
                     'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Fallback test key
    
    // For secret key, we'd typically only have this in backend code, but since we're in a demo/development environment:
    this.secretKey = import.meta.env.VITE_PAYSTACK_SECRET_KEY || 'sk_test_xxxx'; // Fallback placeholder
    
    // Only log a warning instead of throwing an error
    if (!this.publicKey || this.publicKey === 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
      console.warn('Using placeholder Paystack public key. For production, please set VITE_PAYSTACK_PUBLIC_KEY or configure window.APP_CONFIG.PAYSTACK_PUBLIC_KEY.');
    }
  }

  /**
   * Initialize a payment
   */
  async initializePayment(options: PaymentInitOptions): Promise<string> {
    try {
      // Generate a reference if not provided
      const reference = options.reference || this.generateReference();

      // For demo purposes, we'll return a mock authorization URL
      // In a real implementation, you would make an API request to Paystack
      console.log('Mock payment initialized with reference:', reference);
      
      return `https://checkout.paystack.com/demo-checkout/${reference}`;
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyTransaction(reference: string): Promise<PaymentTransaction> {
    console.log('Mock verifying transaction with reference:', reference);
    return {
      id: '123456',
      reference,
      amount: 1000,
      currency: PaymentCurrency.NGN,
      status: PaymentStatus.SUCCESS,
      type: PaymentType.ONE_TIME,
      customerId: 'customer_123',
      customerEmail: 'user@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Create a subscription plan
   */
  async createPlan(plan: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan> {
    return {
      id: `plan_${Date.now()}`,
      ...plan
    };
  }

  /**
   * Get a subscription plan
   */
  async getPlan(planId: string): Promise<PaymentPlan> {
    return {
      id: planId,
      name: 'Demo Plan',
      amount: 1000,
      interval: 'monthly'
    };
  }

  /**
   * List all subscription plans
   */
  async listPlans(): Promise<PaymentPlan[]> {
    return [
      {
        id: 'plan_1',
        name: 'Pro Athlete',
        amount: 999,
        interval: 'monthly',
        description: 'Pro athlete plan with premium features'
      },
      {
        id: 'plan_2',
        name: 'Coach Pro',
        amount: 1999,
        interval: 'monthly',
        description: 'Coach plan with team management'
      }
    ];
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(): Promise<boolean> {
    return true;
  }

  /**
   * Create a subscription
   */
  async createSubscription(email: string, planId: string, metadata?: Record<string, any>): Promise<Subscription> {
    return {
      id: `sub_${Date.now()}`,
      code: `sub_code_${Date.now()}`,
      planId: 'plan_1',
      planName: 'Pro Athlete',
      customerId: 'customer_123',
      customerEmail: 'user@example.com',
      amount: 999,
      status: 'active',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Get a subscription
   */
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    return this.createSubscription();
  }

  /**
   * List subscriptions for a customer
   */
  async listCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    return [await this.createSubscription()];
  }

  /**
   * Pause a subscription
   */
  async pauseSubscription(subscriptionCode: string): Promise<boolean> {
    return true;
  }

  /**
   * Resume a subscription
   */
  async resumeSubscription(subscriptionCode: string): Promise<boolean> {
    return true;
  }

  /**
   * Get transaction history for a customer
   */
  async getTransactionHistory(customerId: string, page: number = 1, perPage: number = 20): Promise<PaymentTransaction[]> {
    return [await this.verifyTransaction('mock_ref')];
  }

  /**
   * Generate a receipt for a transaction
   */
  async generateReceipt(transactionId: string): Promise<string> {
    return '/receipts/mock';
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
