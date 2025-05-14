/**
 * Email Notification Utilities
 * 
 * This module provides utilities for sending email notifications
 * related to subscription changes, billing events, and other
 * important notifications.
 */

import axios from 'axios';
import { SubscriptionTier } from '@/context/PlanContext';
import { SubscriptionPeriod } from './paystack';

// Replace with your actual email API endpoint
const EMAIL_API_ENDPOINT = 'https://api.example.com/send-email';

// Email templates
export enum EmailTemplate {
  SUBSCRIPTION_CONFIRMATION = 'subscription_confirmation',
  PAYMENT_RECEIPT = 'payment_receipt',
  SUBSCRIPTION_CANCELED = 'subscription_canceled',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  SUBSCRIPTION_CHANGED = 'subscription_changed',
  PAYMENT_FAILED = 'payment_failed',
  WELCOME = 'welcome'
}

/**
 * Send an email using the specified template
 * 
 * @param template - Email template to use
 * @param data - Data to populate the template
 * @returns Promise with the email sending result
 */
export const sendEmail = async (
  template: EmailTemplate,
  data: Record<string, any>
): Promise<any> => {
  try {
    const response = await axios.post(
      EMAIL_API_ENDPOINT,
      {
        template,
        data
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email. Please try again.');
  }
};

/**
 * Send a subscription confirmation email
 * 
 * @param data - Subscription data
 * @returns Promise with the email sending result
 */
export const sendSubscriptionEmail = async (data: {
  email: string;
  name: string;
  tier: SubscriptionTier;
  period: SubscriptionPeriod;
  amount: number;
  reference: string;
  date: string;
}): Promise<any> => {
  // For now, we'll just log the email data since we don't have a real email API
  console.log('Sending subscription confirmation email:', data);
  
  // In a real implementation, you would call sendEmail here
  // return sendEmail(EmailTemplate.SUBSCRIPTION_CONFIRMATION, data);
  
  // Mock successful response
  return {
    success: true,
    message: 'Email sent successfully'
  };
};

/**
 * Send a payment receipt email
 * 
 * @param data - Payment data
 * @returns Promise with the email sending result
 */
export const sendPaymentReceiptEmail = async (data: {
  email: string;
  name: string;
  amount: number;
  reference: string;
  date: string;
  items: Array<{ name: string; price: number }>;
}): Promise<any> => {
  // For now, we'll just log the email data since we don't have a real email API
  console.log('Sending payment receipt email:', data);
  
  // In a real implementation, you would call sendEmail here
  // return sendEmail(EmailTemplate.PAYMENT_RECEIPT, data);
  
  // Mock successful response
  return {
    success: true,
    message: 'Email sent successfully'
  };
};

/**
 * Send a subscription canceled email
 * 
 * @param data - Cancellation data
 * @returns Promise with the email sending result
 */
export const sendSubscriptionCanceledEmail = async (data: {
  email: string;
  name: string;
  tier: SubscriptionTier;
  endDate: string;
}): Promise<any> => {
  // For now, we'll just log the email data since we don't have a real email API
  console.log('Sending subscription canceled email:', data);
  
  // In a real implementation, you would call sendEmail here
  // return sendEmail(EmailTemplate.SUBSCRIPTION_CANCELED, data);
  
  // Mock successful response
  return {
    success: true,
    message: 'Email sent successfully'
  };
};

/**
 * Send a subscription renewed email
 * 
 * @param data - Renewal data
 * @returns Promise with the email sending result
 */
export const sendSubscriptionRenewedEmail = async (data: {
  email: string;
  name: string;
  tier: SubscriptionTier;
  period: SubscriptionPeriod;
  amount: number;
  nextRenewalDate: string;
}): Promise<any> => {
  // For now, we'll just log the email data since we don't have a real email API
  console.log('Sending subscription renewed email:', data);
  
  // In a real implementation, you would call sendEmail here
  // return sendEmail(EmailTemplate.SUBSCRIPTION_RENEWED, data);
  
  // Mock successful response
  return {
    success: true,
    message: 'Email sent successfully'
  };
};

/**
 * Send a subscription changed email
 * 
 * @param data - Change data
 * @returns Promise with the email sending result
 */
export const sendSubscriptionChangedEmail = async (data: {
  email: string;
  name: string;
  oldTier: SubscriptionTier;
  newTier: SubscriptionTier;
  effectiveDate: string;
}): Promise<any> => {
  // For now, we'll just log the email data since we don't have a real email API
  console.log('Sending subscription changed email:', data);
  
  // In a real implementation, you would call sendEmail here
  // return sendEmail(EmailTemplate.SUBSCRIPTION_CHANGED, data);
  
  // Mock successful response
  return {
    success: true,
    message: 'Email sent successfully'
  };
};

/**
 * Send a payment failed email
 * 
 * @param data - Failure data
 * @returns Promise with the email sending result
 */
export const sendPaymentFailedEmail = async (data: {
  email: string;
  name: string;
  tier: SubscriptionTier;
  amount: number;
  reason: string;
  retryLink: string;
}): Promise<any> => {
  // For now, we'll just log the email data since we don't have a real email API
  console.log('Sending payment failed email:', data);
  
  // In a real implementation, you would call sendEmail here
  // return sendEmail(EmailTemplate.PAYMENT_FAILED, data);
  
  // Mock successful response
  return {
    success: true,
    message: 'Email sent successfully'
  };
};

/**
 * Send a welcome email
 * 
 * @param data - Welcome data
 * @returns Promise with the email sending result
 */
export const sendWelcomeEmail = async (data: {
  email: string;
  name: string;
}): Promise<any> => {
  // For now, we'll just log the email data since we don't have a real email API
  console.log('Sending welcome email:', data);
  
  // In a real implementation, you would call sendEmail here
  // return sendEmail(EmailTemplate.WELCOME, data);
  
  // Mock successful response
  return {
    success: true,
    message: 'Email sent successfully'
  };
};

export default {
  sendEmail,
  sendSubscriptionEmail,
  sendPaymentReceiptEmail,
  sendSubscriptionCanceledEmail,
  sendSubscriptionRenewedEmail,
  sendSubscriptionChangedEmail,
  sendPaymentFailedEmail,
  sendWelcomeEmail,
  EmailTemplate
};
