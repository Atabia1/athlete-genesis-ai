/**
 * Mobile Accessibility Utilities
 * 
 * This file provides utilities for improving accessibility on mobile devices.
 * It includes functions for detecting touch devices, handling touch gestures,
 * and ensuring proper touch target sizes.
 */

/**
 * Check if the current device is a touch device
 * @returns Whether the device supports touch events
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Check if the current device is a mobile device
 * @returns Whether the device is a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Get the minimum touch target size in pixels
 * @returns The minimum touch target size in pixels
 */
export function getMinTouchTargetSize(): number {
  // WCAG 2.1 recommends a minimum touch target size of 44x44 pixels
  return 44;
}

/**
 * Check if an element has a sufficient touch target size
 * @param element - The element to check
 * @returns Whether the element has a sufficient touch target size
 */
export function hasSufficientTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = getMinTouchTargetSize();
  
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * Ensure an element has a sufficient touch target size
 * @param element - The element to check
 * @returns The element with a sufficient touch target size
 */
export function ensureSufficientTouchTargetSize(element: HTMLElement): HTMLElement {
  const rect = element.getBoundingClientRect();
  const minSize = getMinTouchTargetSize();
  
  if (rect.width < minSize || rect.height < minSize) {
    // Create a wrapper element with sufficient size
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.minWidth = `${minSize}px`;
    wrapper.style.minHeight = `${minSize}px`;
    wrapper.style.position = 'relative';
    
    // Position the original element in the center of the wrapper
    const parent = element.parentNode;
    if (parent) {
      parent.replaceChild(wrapper, element);
      wrapper.appendChild(element);
      
      // Center the element in the wrapper
      element.style.position = 'absolute';
      element.style.top = '50%';
      element.style.left = '50%';
      element.style.transform = 'translate(-50%, -50%)';
    }
    
    return wrapper;
  }
  
  return element;
}

/**
 * Props for touch-accessible elements
 */
export interface TouchAccessibleProps {
  /** The minimum touch target size in pixels */
  minTouchTargetSize?: number;
  /** Whether to add touch feedback */
  touchFeedback?: boolean;
  /** The touch feedback color */
  touchFeedbackColor?: string;
  /** The touch feedback duration in milliseconds */
  touchFeedbackDuration?: number;
}

/**
 * Get props for a touch-accessible element
 * @param props - Additional props for the element
 * @returns Props for a touch-accessible element
 */
export function getTouchAccessibleProps(
  props: TouchAccessibleProps = {}
): React.HTMLAttributes<HTMLElement> {
  const {
    minTouchTargetSize = getMinTouchTargetSize(),
    touchFeedback = true,
    touchFeedbackColor = 'rgba(0, 0, 0, 0.1)',
    touchFeedbackDuration = 300,
  } = props;
  
  return {
    style: {
      minWidth: `${minTouchTargetSize}px`,
      minHeight: `${minTouchTargetSize}px`,
      touchAction: 'manipulation',
      WebkitTapHighlightColor: touchFeedback ? touchFeedbackColor : 'transparent',
      transition: touchFeedback ? `background-color ${touchFeedbackDuration}ms ease` : 'none',
    },
    onTouchStart: touchFeedback
      ? (event) => {
          const target = event.currentTarget as HTMLElement;
          target.style.backgroundColor = touchFeedbackColor;
        }
      : undefined,
    onTouchEnd: touchFeedback
      ? (event) => {
          const target = event.currentTarget as HTMLElement;
          target.style.backgroundColor = '';
        }
      : undefined,
    onTouchCancel: touchFeedback
      ? (event) => {
          const target = event.currentTarget as HTMLElement;
          target.style.backgroundColor = '';
        }
      : undefined,
  };
}

/**
 * Add a vibration feedback
 * @param pattern - The vibration pattern in milliseconds
 * @returns Whether the vibration was successful
 */
export function vibrate(pattern: number | number[]): boolean {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return false;
  }
  
  return navigator.vibrate(pattern);
}

/**
 * Example usage:
 * 
 * import { getTouchAccessibleProps, isTouchDevice, vibrate } from '@/shared/utils/mobile-a11y';
 * 
 * function TouchButton({ children, onClick }) {
 *   const handleClick = () => {
 *     // Add vibration feedback on touch devices
 *     if (isTouchDevice()) {
 *       vibrate(10);
 *     }
 *     
 *     onClick();
 *   };
 *   
 *   return (
 *     <button
 *       {...getTouchAccessibleProps()}
 *       onClick={handleClick}
 *     >
 *       {children}
 *     </button>
 *   );
 * }
 */
