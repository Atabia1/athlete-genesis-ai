/**
 * Utility for combining class names
 * 
 * This utility combines class names using clsx and tailwind-merge.
 * It's used for conditionally applying classes to components.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
