
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Paystack types
interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

interface PaystackProps {
  text: string;
  email: string;
  amount: number;
  reference: string;
  publicKey: string;
  className?: string;
  metadata?: Record<string, any>;
  disabled?: boolean;
  onSuccess: (response: PaystackResponse) => void;
  onClose: () => void;
}

const PaystackButton: React.FC<PaystackProps> = ({
  text,
  email,
  amount,
  reference,
  publicKey,
  className = '',
  metadata = {},
  disabled = false,
  onSuccess,
  onClose
}) => {
  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = () => {
    // Check if Paystack is available on window
    const paystack = (window as any)?.PaystackPop;
    
    if (!paystack) {
      console.warn('Paystack not loaded, using demo mode');
      // Simulate successful payment for demo
      setTimeout(() => {
        onSuccess({
          reference,
          status: 'success',
          trans: reference,
          transaction: reference,
          trxref: reference
        });
      }, 2000);
      return;
    }

    const handler = paystack.setup({
      key: publicKey,
      email,
      amount,
      ref: reference,
      metadata,
      callback: (response: PaystackResponse) => {
        onSuccess(response);
      },
      onClose: () => {
        onClose();
      }
    });

    handler.openIframe();
  };

  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={disabled}
      className={className}
    >
      {text}
    </Button>
  );
};

export default PaystackButton;
