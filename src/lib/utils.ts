import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { safeForwardRef } from "@/shared/utils/react-utils"

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Re-export safe forwardRef to ensure it's available throughout the application
 */
export { safeForwardRef as forwardRef }

/**
 * Re-export types from react-utils
 */
export type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ReactNode,
  ReactElement,
  FC,
  ComponentType
} from "@/shared/utils/react-utils"
