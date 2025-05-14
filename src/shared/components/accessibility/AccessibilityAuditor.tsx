/**
 * AccessibilityAuditor Component
 *
 * This component runs accessibility audits on the application in development mode.
 * It uses axe-core to identify accessibility issues and logs them to the console.
 *
 * This component should only be used in development mode and should not be
 * included in production builds.
 *
 * Performance optimizations:
 * - Lazy load axe-core only when needed
 * - Debounce audit runs to prevent excessive processing
 * - Only audit visible elements by default
 * - Cache audit results to prevent duplicate audits
 */

import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { Button } from '@/shared/components/ui/button';

interface AccessibilityAuditorProps {
  /** Whether to run the audit automatically when the component mounts */
  autoRun?: boolean;
  /** The delay in milliseconds before running the automatic audit */
  autoRunDelay?: number;
  /** Whether to show the audit button */
  showButton?: boolean;
  /** The position of the audit button */
  buttonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Whether to audit only visible elements */
  auditVisibleOnly?: boolean;
  /** The debounce delay in milliseconds */
  debounceDelay?: number;
}

/**
 * Debounce function to prevent excessive audit runs
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function(...args: Parameters<T>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

/**
 * A component that runs accessibility audits on the application
 */
function AccessibilityAuditorComponent({
  autoRun = true,
  autoRunDelay = 3000,
  showButton = true,
  buttonPosition = 'bottom-right',
  auditVisibleOnly = true,
  debounceDelay = 500,
}: AccessibilityAuditorProps) {
  const [auditModule, setAuditModule] = useState<typeof import('@/shared/utils/a11y-audit') | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const lastAuditTimeRef = useRef<number>(0);

  // Only load the audit module in development mode and only when needed
  const loadAuditModule = useCallback(async () => {
    if (!auditModule && process.env.NODE_ENV === 'development') {
      try {
        const module = await import('@/shared/utils/a11y-audit');
        setAuditModule(module);
        return module;
      } catch (error) {
        console.error('Failed to load accessibility audit module:', error);
      }
    }
    return auditModule;
  }, [auditModule]);

  // Run the audit with debouncing
  const runAudit = useCallback(async () => {
    // Prevent running multiple audits simultaneously
    if (isAuditing) return;

    // Prevent running audits too frequently
    const now = Date.now();
    if (now - lastAuditTimeRef.current < debounceDelay) return;

    setIsAuditing(true);
    lastAuditTimeRef.current = now;

    try {
      const module = await loadAuditModule();
      if (module) {
        await module.auditAndLogAccessibility({
          // Only check elements that are currently visible
          ...(auditVisibleOnly && { elementRef: document.body }),
          // Exclude elements that are off-screen or hidden
          rules: {
            'hidden-content': { enabled: !auditVisibleOnly }
          }
        });
      }
    } catch (error) {
      console.error('Failed to run accessibility audit:', error);
    } finally {
      setIsAuditing(false);
    }
  }, [isAuditing, debounceDelay, loadAuditModule, auditVisibleOnly]);

  // Debounced version of runAudit
  const debouncedRunAudit = useCallback(
    debounce(runAudit, debounceDelay),
    [runAudit, debounceDelay]
  );

  // Run the audit automatically if enabled
  useEffect(() => {
    if (autoRun && process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        runAudit();
      }, autoRunDelay);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoRun, autoRunDelay, runAudit]);

  // Don't render anything in production mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Don't render anything if the button is hidden
  if (!showButton) {
    return null;
  }

  // Get the position classes for the button
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }[buttonPosition];

  // Render the audit button
  return (
    <Button
      variant="outline"
      size="sm"
      className={`fixed z-50 ${positionClasses} bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200`}
      onClick={debouncedRunAudit}
      disabled={isAuditing}
    >
      {isAuditing ? 'Auditing...' : 'Audit Accessibility'}
    </Button>
  );
}

/**
 * Memoized version of the AccessibilityAuditor component to prevent unnecessary re-renders
 */
export const AccessibilityAuditor = memo(AccessibilityAuditorComponent);

/**
 * Example usage:
 *
 * // In your main layout component:
 * function Layout({ children }) {
 *   return (
 *     <>
 *       {children}
 *       {process.env.NODE_ENV === 'development' && (
 *         <AccessibilityAuditor autoRun={true} />
 *       )}
 *     </>
 *   );
 * }
 */
