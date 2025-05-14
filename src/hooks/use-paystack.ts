/**
 * Paystack Hook
 *
 * This hook provides methods for interacting with the Paystack payment gateway.
 * It wraps the Paystack service and provides React-friendly methods for:
 * - One-time payments
 * - Subscription management
 * - Payment history
 * - Discount codes
 */

import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from './use-auth';
import { toast } from '@/components/ui/use-toast';
import paystackService, {
  PaymentInitOptions,
  PaymentTransaction,
  PaymentStatus,
  PaymentCurrency,
  PaymentPlan,
  Subscription,
  DiscountCode
} from '@/services/api/paystack-service';

/**
 * Paystack hook options
 */
interface UsePaystackOptions {
  onSuccess?: (transaction: PaymentTransaction) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

/**
 * Paystack payment config
 */
interface PaystackPaymentConfig {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
  currency?: string;
  plan?: string;
  metadata?: Record<string, any>;
}

/**
 * Hook for using Paystack payment gateway
 */
export function usePaystack(options?: UsePaystackOptions) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize a payment
   */
  const initializePayment = async (
    amount: number,
    email: string = user?.id || '',
    currency: PaymentCurrency = PaymentCurrency.NGN,
    planId?: string,
    metadata?: Record<string, any>,
    discountCode?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate a reference
      const reference = `ATHLETE_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

      // Apply discount code if provided
      let finalAmount = amount * 100; // Convert to smallest currency unit
      let discountAmount = 0;

      if (discountCode) {
        try {
          // Validate and apply the discount code
          const discountResult = await paystackService.applyDiscountCode(
            discountCode,
            finalAmount,
            planId
          );

          finalAmount = discountResult.amount;
          discountAmount = discountResult.discountAmount;

          // Show discount applied toast
          if (discountAmount > 0) {
            toast({
              title: "Discount applied!",
              description: `Discount of ${discountAmount / 100} ${currency} applied to your payment.`,
              variant: "default",
            });
          }
        } catch (discountError) {
          // Show invalid discount code toast
          toast({
            title: "Invalid discount code",
            description: discountError instanceof Error ? discountError.message : "The discount code could not be applied.",
            variant: "destructive",
          });
        }
      }

      // Create payment config
      const config: PaystackPaymentConfig = {
        reference,
        email,
        amount: finalAmount,
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        currency,
        metadata: {
          ...metadata,
          userId: user?.id,
          discountCode: discountCode,
          discountAmount: discountAmount
        }
      };

      // Add plan if provided
      if (planId) {
        config.plan = planId;
      }

      // Initialize Paystack payment
      const initializePaystack = usePaystackPayment(config);

      // Define callbacks
      const onSuccess = async (response: any) => {
        try {
          // Verify the transaction
          const verifiedTransaction = await paystackService.verifyTransaction(reference);

          // Update state
          setTransaction(verifiedTransaction);

          // Call success callback
          if (options?.onSuccess) {
            options.onSuccess(verifiedTransaction);
          }

          // Show success toast
          toast({
            title: "Payment successful!",
            description: `Your payment of ${amount} ${currency} was successful.`,
            variant: "default",
          });
        } catch (error) {
          console.error('Error verifying transaction:', error);
          setError(error as Error);

          // Call error callback
          if (options?.onError) {
            options.onError(error as Error);
          }

          // Show error toast
          toast({
            title: "Payment verification failed",
            description: "We couldn't verify your payment. Please contact support.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      const onClose = () => {
        setIsLoading(false);

        // Call cancel callback
        if (options?.onCancel) {
          options.onCancel();
        }

        // Show cancel toast
        toast({
          title: "Payment cancelled",
          description: "You cancelled the payment process.",
          variant: "default",
        });
      };

      // Open Paystack payment modal
      initializePaystack({
        callback: onSuccess,
        onClose
      });

      return reference;
    } catch (error) {
      console.error('Error initializing payment:', error);
      setError(error as Error);
      setIsLoading(false);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      // Show error toast
      toast({
        title: "Payment initialization failed",
        description: "We couldn't initialize the payment. Please try again.",
        variant: "destructive",
      });

      throw error;
    }
  };

  /**
   * Verify a transaction
   */
  const verifyTransaction = async (reference: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const verifiedTransaction = await paystackService.verifyTransaction(reference);
      setTransaction(verifiedTransaction);

      return verifiedTransaction;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a subscription
   */
  const createSubscription = async (
    planId: string,
    email: string = user?.email || '',
    metadata?: Record<string, any>
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const subscription = await paystackService.createSubscription(email, planId, metadata);

      // Show success toast
      toast({
        title: "Subscription created!",
        description: `You've successfully subscribed to ${subscription.planName}.`,
        variant: "default",
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      // Show error toast
      toast({
        title: "Subscription failed",
        description: "We couldn't create your subscription. Please try again.",
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get customer subscriptions
   */
  const getSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      return await paystackService.listCustomerSubscriptions(user.id);
    } catch (error) {
      console.error('Error getting subscriptions:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancel a subscription
   */
  const cancelSubscription = async (subscriptionCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await paystackService.cancelSubscription(subscriptionCode);

      if (result) {
        // Show success toast
        toast({
          title: "Subscription cancelled",
          description: "Your subscription has been cancelled successfully.",
          variant: "default",
        });
      }

      return result;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      // Show error toast
      toast({
        title: "Cancellation failed",
        description: "We couldn't cancel your subscription. Please try again.",
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Pause a subscription
   */
  const pauseSubscription = async (subscriptionCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await paystackService.pauseSubscription(subscriptionCode);

      if (result) {
        // Show success toast
        toast({
          title: "Subscription paused",
          description: "Your subscription has been paused successfully.",
          variant: "default",
        });
      }

      return result;
    } catch (error) {
      console.error('Error pausing subscription:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      // Show error toast
      toast({
        title: "Pause failed",
        description: "We couldn't pause your subscription. Please try again.",
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resume a subscription
   */
  const resumeSubscription = async (subscriptionCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await paystackService.resumeSubscription(subscriptionCode);

      if (result) {
        // Show success toast
        toast({
          title: "Subscription resumed",
          description: "Your subscription has been resumed successfully.",
          variant: "default",
        });
      }

      return result;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      // Show error toast
      toast({
        title: "Resume failed",
        description: "We couldn't resume your subscription. Please try again.",
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get transaction history
   */
  const getTransactionHistory = async (page: number = 1, perPage: number = 20) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      return await paystackService.getTransactionHistory(user.id, page, perPage);
    } catch (error) {
      console.error('Error getting transaction history:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate a receipt for a transaction
   */
  const generateReceipt = async (transactionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      return await paystackService.generateReceipt(transactionId);
    } catch (error) {
      console.error('Error generating receipt:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Validate a discount code
   */
  const validateDiscountCode = async (code: string, amount: number, planId?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      return await paystackService.validateDiscountCode(code, amount, planId);
    } catch (error) {
      console.error('Error validating discount code:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get available subscription plans
   */
  const getSubscriptionPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);

      return await paystackService.listPlans();
    } catch (error) {
      console.error('Error getting subscription plans:', error);
      setError(error as Error);

      // Call error callback
      if (options?.onError) {
        options.onError(error as Error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Payment methods
    initializePayment,
    verifyTransaction,

    // Subscription methods
    createSubscription,
    getSubscriptions,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
    getSubscriptionPlans,

    // Transaction history methods
    getTransactionHistory,
    generateReceipt,

    // Discount code methods
    validateDiscountCode,

    // State
    isLoading,
    transaction,
    error
  };
}

export default usePaystack;
