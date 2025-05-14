/**
 * Form Hook
 * 
 * This hook provides a standardized way to handle forms with validation and submission.
 * It includes error handling, field management, and form state.
 */

import { useState, useCallback, useEffect } from 'react';
import { useForm as useFormHandling, FormField, UseFormOptions, UseFormResult } from '@/shared/utils/form-handling';
import { useApiMutation } from './use-api';
import { toast } from '@/components/ui/use-toast';

/**
 * Options for useForm
 */
export interface UseFormOptions<T, R> extends Omit<UseFormOptions<T>, 'onSubmit'> {
  /**
   * Function to submit the form
   */
  onSubmit: (values: T) => Promise<R>;
  
  /**
   * Function to handle successful submission
   */
  onSuccess?: (result: R, values: T) => void;
  
  /**
   * Function to handle submission error
   */
  onError?: (error: Error, values: T) => void;
  
  /**
   * Whether to reset the form after successful submission
   * @default false
   */
  resetOnSuccess?: boolean;
  
  /**
   * Whether to show a success toast after successful submission
   * @default true
   */
  showSuccessToast?: boolean;
  
  /**
   * Success toast message
   */
  successToastMessage?: string;
  
  /**
   * Whether to show an error toast after submission error
   * @default true
   */
  showErrorToast?: boolean;
  
  /**
   * Error toast message
   */
  errorToastMessage?: string;
}

/**
 * Form hook result
 */
export interface UseFormResult<T, R> extends UseFormResult<T> {
  /**
   * Form submission result
   */
  result: R | null;
  
  /**
   * Form submission error
   */
  submitError: Error | null;
  
  /**
   * Whether the form is submitting
   */
  isSubmitting: boolean;
  
  /**
   * Whether the form has been submitted
   */
  isSubmitted: boolean;
  
  /**
   * Whether the form submission was successful
   */
  isSuccess: boolean;
  
  /**
   * Whether the form submission failed
   */
  isError: boolean;
  
  /**
   * Submit the form programmatically
   */
  submit: () => Promise<void>;
}

/**
 * Hook for handling forms with validation and submission
 */
export function useForm<T extends Record<string, any>, R = any>(
  options: UseFormOptions<T, R>
): UseFormResult<T, R> {
  const {
    initialValues,
    validate,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    fields,
    onSubmit,
    onSuccess,
    onError,
    resetOnSuccess = false,
    showSuccessToast = true,
    successToastMessage = 'Form submitted successfully',
    showErrorToast = true,
    errorToastMessage = 'An error occurred while submitting the form',
  } = options;
  
  // Form state
  const [result, setResult] = useState<R | null>(null);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  
  // Use the form handling hook
  const { formState, formHandlers } = useFormHandling<T>({
    initialValues,
    validate,
    validateOnChange,
    validateOnBlur,
    validateOnSubmit,
    fields,
    onSubmit: async (values) => {
      // Reset submission state
      setResult(null);
      setSubmitError(null);
      setIsSubmitting(true);
      setIsSuccess(false);
      setIsError(false);
      
      try {
        // Submit the form
        const result = await onSubmit(values);
        
        // Update state
        setResult(result);
        setIsSuccess(true);
        setIsSubmitted(true);
        
        // Show success toast
        if (showSuccessToast) {
          toast({
            title: 'Success',
            description: successToastMessage,
            variant: 'default',
          });
        }
        
        // Call onSuccess callback
        if (onSuccess) {
          onSuccess(result, values);
        }
        
        // Reset form if needed
        if (resetOnSuccess) {
          formHandlers.resetForm();
        }
        
        return result;
      } catch (error) {
        // Update state
        setSubmitError(error instanceof Error ? error : new Error(String(error)));
        setIsError(true);
        
        // Show error toast
        if (showErrorToast) {
          toast({
            title: 'Error',
            description: errorToastMessage,
            variant: 'destructive',
          });
        }
        
        // Call onError callback
        if (onError) {
          onError(
            error instanceof Error ? error : new Error(String(error)),
            values
          );
        }
        
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  
  // Submit the form programmatically
  const submit = useCallback(async () => {
    if (formState.isValid) {
      await formHandlers.handleSubmit({
        preventDefault: () => {},
      } as any);
    } else {
      // Validate the form
      const result = formHandlers.validateForm();
      
      if (!result.isValid) {
        // Show error toast
        if (showErrorToast) {
          toast({
            title: 'Validation Error',
            description: 'Please fix the errors in the form',
            variant: 'destructive',
          });
        }
      }
    }
  }, [formState.isValid, formHandlers, showErrorToast]);
  
  return {
    formState,
    formHandlers,
    result,
    submitError,
    isSubmitting,
    isSubmitted,
    isSuccess,
    isError,
    submit,
  };
}

/**
 * Hook for handling forms with API mutation
 */
export function useApiForm<T extends Record<string, any>, R = any>(
  options: Omit<UseFormOptions<T, R>, 'onSubmit'> & {
    /**
     * Function to submit the form
     */
    mutationFn: (values: T) => Promise<R>;
    
    /**
     * Mutation options
     */
    mutationOptions?: Parameters<typeof useApiMutation>[1];
  }
): UseFormResult<T, R> {
  const {
    mutationFn,
    mutationOptions,
    ...formOptions
  } = options;
  
  // Use API mutation
  const mutation = useApiMutation<R, T>(mutationFn, {
    ...mutationOptions,
    // Disable default toasts since we'll handle them in the form hook
    showErrorToast: false,
    showSuccessToast: false,
  });
  
  // Use form hook
  return useForm<T, R>({
    ...formOptions,
    onSubmit: async (values) => {
      return mutation.mutateAsync(values);
    },
  });
}
