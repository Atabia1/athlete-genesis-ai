import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Re-export React's forwardRef to ensure it's available throughout the application
 */
export const forwardRef = React.forwardRef

/**
 * Type-safe component props with ref
 */
export type ComponentPropsWithRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>

/**
 * Type-safe component props without ref
 */
export type ComponentPropsWithoutRef<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T>
