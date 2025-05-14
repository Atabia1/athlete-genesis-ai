/**
 * Form Handling Utilities
 * 
 * This module provides utilities for form handling, including:
 * - Form validation
 * - Form submission
 * - Error handling
 * - Field management
 */

import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { logError, showErrorToast } from './error-handling';

/**
 * Form field configuration
 */
export interface FormField<T> {
  name: keyof T;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'checkbox' | 'radio' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  options?: Array<{ value: string; label: string }>;
  validate?: (value: any, formValues: T) => string | null;
}

/**
 * Form validation result
 */
export interface FormValidationResult<T> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Form state
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

/**
 * Form handlers
 */
export interface FormHandlers<T> {
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, touched: boolean) => void;
  resetForm: () => void;
  validateForm: () => FormValidationResult<T>;
  validateField: (name: keyof T) => string | null;
}

/**
 * Form hook result
 */
export interface UseFormResult<T> {
  formState: FormState<T>;
  formHandlers: FormHandlers<T>;
}

/**
 * Form hook options
 */
export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  fields?: FormField<T>[];
}

/**
 * Validate a form field
 */
function validateField<T>(
  name: keyof T,
  value: any,
  formValues: T,
  fields?: FormField<T>[]
): string | null {
  // Find the field configuration
  const field = fields?.find(f => f.name === name);
  
  if (!field) {
    return null;
  }
  
  // Check required
  if (field.required && (value === undefined || value === null || value === '')) {
    return `${field.label} is required`;
  }
  
  // Check min length
  if (field.minLength !== undefined && typeof value === 'string' && value.length < field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters`;
  }
  
  // Check max length
  if (field.maxLength !== undefined && typeof value === 'string' && value.length > field.maxLength) {
    return `${field.label} must be at most ${field.maxLength} characters`;
  }
  
  // Check min value
  if (field.min !== undefined && typeof value === 'number' && value < field.min) {
    return `${field.label} must be at least ${field.min}`;
  }
  
  // Check max value
  if (field.max !== undefined && typeof value === 'number' && value > field.max) {
    return `${field.label} must be at most ${field.max}`;
  }
  
  // Check pattern
  if (field.pattern !== undefined && typeof value === 'string' && !new RegExp(field.pattern).test(value)) {
    return `${field.label} is not valid`;
  }
  
  // Check email
  if (field.type === 'email' && typeof value === 'string' && value !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${field.label} must be a valid email address`;
    }
  }
  
  // Check custom validation
  if (field.validate) {
    return field.validate(value, formValues);
  }
  
  return null;
}

/**
 * Validate a form
 */
function validateForm<T>(
  values: T,
  fields?: FormField<T>[],
  customValidate?: (values: T) => Partial<Record<keyof T, string>>
): FormValidationResult<T> {
  const errors: Partial<Record<keyof T, string>> = {};
  
  // Validate each field
  if (fields) {
    for (const field of fields) {
      const error = validateField(field.name, values[field.name], values, fields);
      if (error) {
        errors[field.name] = error;
      }
    }
  }
  
  // Apply custom validation
  if (customValidate) {
    const customErrors = customValidate(values);
    Object.assign(errors, customErrors);
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Form hook
 */
export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormResult<T> {
  const {
    initialValues,
    onSubmit,
    validate,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    fields,
  } = options;
  
  // Form state
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false,
    isSubmitted: false,
  });
  
  // Validate the form
  const validateFormValues = useCallback((): FormValidationResult<T> => {
    const result = validateForm(formState.values, fields, validate);
    
    setFormState(prev => ({
      ...prev,
      errors: result.errors,
      isValid: result.isValid,
    }));
    
    return result;
  }, [formState.values, fields, validate]);
  
  // Validate a field
  const validateFieldValue = useCallback((name: keyof T): string | null => {
    const value = formState.values[name];
    const error = validateField(name, value, formState.values, fields);
    
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error,
      },
      isValid: Object.values({ ...prev.errors, [name]: error }).every(e => !e),
    }));
    
    return error;
  }, [formState.values, fields]);
  
  // Handle input change
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value;
    
    setFormState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: newValue,
      },
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));
    
    if (validateOnChange) {
      setTimeout(() => {
        validateFieldValue(name as keyof T);
      }, 0);
    }
  }, [validateOnChange, validateFieldValue]);
  
  // Handle input blur
  const handleBlur = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name } = e.target;
    
    setFormState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));
    
    if (validateOnBlur) {
      validateFieldValue(name as keyof T);
    }
  }, [validateOnBlur, validateFieldValue]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    
    // Mark all fields as touched
    const touched = Object.keys(formState.values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    
    setFormState(prev => ({
      ...prev,
      touched,
      isSubmitting: true,
    }));
    
    // Validate the form
    let isValid = true;
    if (validateOnSubmit) {
      const result = validateFormValues();
      isValid = result.isValid;
    }
    
    if (isValid) {
      try {
        await onSubmit(formState.values);
        
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
        }));
      } catch (error) {
        logError(error, 'FormSubmission');
        showErrorToast(error, 'Form Submission Error');
        
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
        }));
      }
    } else {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [formState.values, validateOnSubmit, validateFormValues, onSubmit]);
  
  // Set field value
  const setFieldValue = useCallback((name: keyof T, value: any): void => {
    setFormState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));
    
    if (validateOnChange) {
      setTimeout(() => {
        validateFieldValue(name);
      }, 0);
    }
  }, [validateOnChange, validateFieldValue]);
  
  // Set field error
  const setFieldError = useCallback((name: keyof T, error: string): void => {
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error,
      },
      isValid: false,
    }));
  }, []);
  
  // Set field touched
  const setFieldTouched = useCallback((name: keyof T, touched: boolean): void => {
    setFormState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: touched,
      },
    }));
    
    if (touched && validateOnBlur) {
      validateFieldValue(name);
    }
  }, [validateOnBlur, validateFieldValue]);
  
  // Reset form
  const resetForm = useCallback((): void => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
      isSubmitted: false,
    });
  }, [initialValues]);
  
  // Validate form on mount
  useEffect(() => {
    validateFormValues();
  }, [validateFormValues]);
  
  return {
    formState,
    formHandlers: {
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldError,
      setFieldTouched,
      resetForm,
      validateForm: validateFormValues,
      validateField: validateFieldValue,
    },
  };
}
