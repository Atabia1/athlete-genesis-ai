
import { useState, useCallback } from 'react';

export interface UseFormOptions<T> {
  defaultValues?: Partial<T>;
  validate?: (values: T) => Record<string, string>;
}

export interface UseFormResult<T> {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  setValue: (name: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (name: keyof T, error: string) => void;
  clearErrors: () => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T> = {}
): UseFormResult<T> {
  const { defaultValues = {} as Partial<T>, validate } = options;
  
  const [values, setValuesState] = useState<T>(defaultValues as T);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name as string]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);
      clearErrors();

      try {
        // Run validation if provided
        if (validate) {
          const validationErrors = validate(values);
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
          }
        }

        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        if (error instanceof Error) {
          setError('root' as keyof T, error.message);
        }
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validate, clearErrors]);

  const reset = useCallback(() => {
    setValuesState(defaultValues as T);
    clearErrors();
  }, [defaultValues, clearErrors]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setValues,
    setError,
    clearErrors,
    handleSubmit,
    reset,
  };
}
