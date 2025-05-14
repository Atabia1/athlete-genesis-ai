/**
 * Paystack Wrapper Component
 * 
 * This component provides a safe wrapper around the react-paystack library
 * to prevent forwardRef errors that can occur during bundling.
 */

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Define the PaystackProps interface based on the react-paystack library
interface PaystackProps {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
  text?: string;
  onSuccess?: (reference: any) => void;
  onClose?: () => void;
  className?: string;
  metadata?: Record<string, any>;
  currency?: string;
  plan?: string;
  quantity?: number;
  channels?: string[];
  label?: string;
  disabled?: boolean;
}

/**
 * Safe Paystack Button Component
 * 
 * This component safely initializes the Paystack payment without relying on
 * the react-paystack library's direct import, which can cause forwardRef errors.
 */
const PaystackButton: React.FC<PaystackProps> = ({
  reference,
  email,
  amount,
  publicKey,
  text = 'Pay Now',
  onSuccess,
  onClose,
  className = '',
  metadata = {},
  currency = 'NGN',
  plan,
  quantity,
  channels,
  label,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load the Paystack script
  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      setScriptLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    // Set up event listeners
    script.onload = () => {
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Paystack script');
    };
    
    // Add script to document
    document.body.appendChild(script);
    
    // Clean up
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle payment initialization
  const handlePayment = () => {
    if (!scriptLoaded || !window.PaystackPop) {
      console.error('Paystack script not loaded');
      return;
    }

    setIsLoading(true);

    try {
      // Initialize Paystack
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: amount * 100, // Convert to kobo
        ref: reference,
        metadata,
        currency,
        plan,
        quantity,
        channels,
        label,
        callback: (response: any) => {
          setIsLoading(false);
          if (onSuccess) onSuccess(response);
        },
        onClose: () => {
          setIsLoading(false);
          if (onClose) onClose();
        },
      });

      // Open payment modal
      handler.openIframe();
    } catch (error) {
      console.error('Error initializing Paystack:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading || !scriptLoaded}
      className={className}
      type="button"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        text
      )}
    </Button>
  );
};

/**
 * Safe Paystack Hook
 * 
 * This function provides a safe alternative to the usePaystackPayment hook
 * from the react-paystack library.
 */
export function usePaystackPayment(config: Omit<PaystackProps, 'onSuccess' | 'onClose'>) {
  return function(callbacks: { callback: (response: any) => void, onClose: () => void }) {
    if (!window.PaystackPop) {
      console.error('Paystack script not loaded');
      return;
    }

    try {
      // Initialize Paystack
      const handler = window.PaystackPop.setup({
        key: config.publicKey,
        email: config.email,
        amount: config.amount * 100, // Convert to kobo
        ref: config.reference,
        metadata: config.metadata || {},
        currency: config.currency || 'NGN',
        plan: config.plan,
        quantity: config.quantity,
        channels: config.channels,
        label: config.label,
        callback: callbacks.callback,
        onClose: callbacks.onClose,
      });

      // Open payment modal
      handler.openIframe();
    } catch (error) {
      console.error('Error initializing Paystack:', error);
    }
  };
}

// Add PaystackPop to the Window interface
declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

export default PaystackButton;
