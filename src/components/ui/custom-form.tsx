/**
 * Custom Form Components
 * 
 * This module provides enhanced form components that extend the base form components
 * with additional functionality like error handling, loading states, and validation.
 */

import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { Form as BaseForm, FormField as BaseFormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './form';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { createComponent } from '@/shared/utils/component-factory';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, FieldValues, DefaultValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Custom form props
 */
export interface CustomFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * Whether the form is loading
   */
  isLoading?: boolean;
  
  /**
   * Whether the form has errors
   */
  hasErrors?: boolean;
  
  /**
   * Form error message
   */
  errorMessage?: string;
  
  /**
   * Form success message
   */
  successMessage?: string;
  
  /**
   * Form methods from react-hook-form
   */
  form?: any;
}

/**
 * Custom form component
 */
const CustomFormComponent = forwardRef<HTMLFormElement, CustomFormProps>(
  ({ className, isLoading, hasErrors, errorMessage, successMessage, children, form, ...props }, ref) => {
    // If form methods are provided, use BaseForm with FormProvider
    if (form) {
      return (
        <BaseForm {...form}>
          <form
            ref={ref}
            className={cn(
              'space-y-6',
              {
                'opacity-70 pointer-events-none': isLoading,
              },
              className
            )}
            {...props}
          >
            {children}
            
            {hasErrors && errorMessage && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800">
                {errorMessage}
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-800">
                {successMessage}
              </div>
            )}
          </form>
        </BaseForm>
      );
    }
    
    // Otherwise, use a regular form
    return (
      <form
        ref={ref}
        className={cn(
          'space-y-6',
          {
            'opacity-70 pointer-events-none': isLoading,
          },
          className
        )}
        {...props}
      >
        {children}
        
        {hasErrors && errorMessage && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-800">
            {successMessage}
          </div>
        )}
      </form>
    );
  }
);

CustomFormComponent.displayName = 'CustomForm';

/**
 * Custom form component with error handling
 */
export const CustomForm = createComponent(CustomFormComponent, {
  displayName: 'CustomForm',
  withErrorHandling: true,
});

/**
 * Custom form field props
 */
export interface CustomFormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Field name
   */
  name: string;
  
  /**
   * Field label
   */
  label?: string;
  
  /**
   * Field description
   */
  description?: string;
  
  /**
   * Field error message
   */
  error?: string;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
  
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the field is loading
   */
  loading?: boolean;
  
  /**
   * Form control component
   */
  control?: any;
}

/**
 * Custom form field component
 */
const CustomFormFieldComponent = forwardRef<HTMLDivElement, CustomFormFieldProps>(
  ({ className, name, label, description, error, required, disabled, loading, control, children, ...props }, ref) => {
    // If control is provided, use BaseFormField
    if (control) {
      return (
        <BaseFormField
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <FormItem
              ref={ref}
              className={cn(
                'space-y-2',
                {
                  'opacity-70 pointer-events-none': disabled || loading,
                },
                className
              )}
              {...props}
            >
              {label && (
                <FormLabel className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
                  {label}
                </FormLabel>
              )}
              
              <FormControl>
                {React.cloneElement(children as React.ReactElement, {
                  ...field,
                  disabled: disabled || loading,
                })}
              </FormControl>
              
              {description && (
                <FormDescription>
                  {description}
                </FormDescription>
              )}
              
              {(fieldState.error || error) && (
                <FormMessage>
                  {fieldState.error?.message || error}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
      );
    }
    
    // Otherwise, use a regular div
    return (
      <div
        ref={ref}
        className={cn(
          'space-y-2',
          {
            'opacity-70 pointer-events-none': disabled || loading,
          },
          className
        )}
        {...props}
      >
        {label && (
          <label
            htmlFor={name}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''
            )}
          >
            {label}
          </label>
        )}
        
        {children}
        
        {description && (
          <p className="text-sm text-gray-500">
            {description}
          </p>
        )}
        
        {error && (
          <p className="text-sm font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

CustomFormFieldComponent.displayName = 'CustomFormField';

/**
 * Custom form field component with error handling
 */
export const CustomFormField = createComponent(CustomFormFieldComponent, {
  displayName: 'CustomFormField',
  withErrorHandling: true,
});

/**
 * Custom form submit props
 */
export interface CustomFormSubmitProps {
  onSubmit: SubmitHandler<FieldValues>;
  submitText?: string;
  isSubmitting?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Custom form submit component
 */
const CustomFormSubmit: React.FC<CustomFormSubmitProps> = ({
  onSubmit,
  submitText = 'Submit',
  isSubmitting = false,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <Button 
      type="submit" 
      disabled={disabled || isSubmitting || isLoading}
      className="w-full"
    >
      {isSubmitting || isLoading ? 'Loading...' : submitText}
    </Button>
  );
};

CustomFormSubmit.displayName = 'CustomFormSubmit';

// Re-export base form components
export {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};

export default CustomForm;
