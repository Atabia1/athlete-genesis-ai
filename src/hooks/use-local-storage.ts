/**
 * useLocalStorage Hook
 * 
 * This hook provides a way to store and retrieve values from localStorage
 * with automatic serialization/deserialization and type safety.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Options for useLocalStorage
 */
export interface UseLocalStorageOptions<T> {
  /**
   * Default value to use if the key doesn't exist in localStorage
   */
  defaultValue: T;
  
  /**
   * Whether to sync the value across tabs/windows
   * @default true
   */
  sync?: boolean;
  
  /**
   * Custom serialization function
   * @default JSON.stringify
   */
  serialize?: (value: T) => string;
  
  /**
   * Custom deserialization function
   * @default JSON.parse
   */
  deserialize?: (value: string) => T;
}

/**
 * Hook for using localStorage with automatic serialization/deserialization
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void] {
  const {
    defaultValue,
    sync = true,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;
  
  // Get the initial value from localStorage or use the default value
  const getInitialValue = useCallback((): T => {
    try {
      const item = localStorage.getItem(key);
      
      // If the item exists, parse it
      if (item !== null) {
        return deserialize(item);
      }
      
      // Otherwise, use the default value
      return defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue, deserialize]);
  
  // State to store the current value
  const [storedValue, setStoredValue] = useState<T>(getInitialValue);
  
  // Update localStorage when the value changes
  const setValue = useCallback((value: T | ((prev: T) => T)): void => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      localStorage.setItem(key, serialize(valueToStore));
      
      // If sync is enabled, dispatch a storage event to notify other tabs/windows
      if (sync) {
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: serialize(valueToStore),
          storageArea: localStorage,
        }));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serialize, storedValue, sync]);
  
  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    if (!sync) {
      return;
    }
    
    const handleStorageChange = (event: StorageEvent): void => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = deserialize(event.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}" from storage event:`, error);
        }
      }
    };
    
    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, sync, deserialize]);
  
  return [storedValue, setValue];
}

/**
 * Hook for using localStorage with a simple key-value interface
 */
export function useLocalStorageValue<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  return useLocalStorage<T>(key, { defaultValue });
}

/**
 * Hook for using localStorage with a boolean value
 */
export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean = false
): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void, () => void] {
  const [value, setValue] = useLocalStorage<boolean>(key, { defaultValue });
  
  const toggle = useCallback((): void => {
    setValue(prev => !prev);
  }, [setValue]);
  
  return [value, setValue, toggle];
}

/**
 * Hook for using localStorage with a string value
 */
export function useLocalStorageString(
  key: string,
  defaultValue: string = ''
): [string, (value: string | ((prev: string) => string)) => void] {
  return useLocalStorage<string>(key, { defaultValue });
}

/**
 * Hook for using localStorage with a number value
 */
export function useLocalStorageNumber(
  key: string,
  defaultValue: number = 0
): [number, (value: number | ((prev: number) => number)) => void] {
  return useLocalStorage<number>(key, { defaultValue });
}

/**
 * Hook for using localStorage with an object value
 */
export function useLocalStorageObject<T extends object>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, (partialValue: Partial<T>) => void] {
  const [value, setValue] = useLocalStorage<T>(key, { defaultValue });
  
  const updateValue = useCallback((partialValue: Partial<T>): void => {
    setValue(prev => ({ ...prev, ...partialValue }));
  }, [setValue]);
  
  return [value, setValue, updateValue];
}

/**
 * Hook for using localStorage with an array value
 */
export function useLocalStorageArray<T>(
  key: string,
  defaultValue: T[] = []
): [
  T[],
  (value: T[] | ((prev: T[]) => T[])) => void,
  (item: T) => void,
  (index: number) => void
] {
  const [value, setValue] = useLocalStorage<T[]>(key, { defaultValue });
  
  const addItem = useCallback((item: T): void => {
    setValue(prev => [...prev, item]);
  }, [setValue]);
  
  const removeItem = useCallback((index: number): void => {
    setValue(prev => prev.filter((_, i) => i !== index));
  }, [setValue]);
  
  return [value, setValue, addItem, removeItem];
}
