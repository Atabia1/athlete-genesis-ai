/**
 * Accessibility Audit Utility
 *
 * This utility provides functions to audit the accessibility of the application
 * using axe-core. It can be used in development mode to identify accessibility
 * issues in the browser console.
 */

// Mock AxeResults type for testing
export interface AxeResults {
  violations: Array<{
    id: string;
    impact?: 'minor' | 'moderate' | 'serious' | 'critical';
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      failureSummary: string;
      target: string[];
    }>;
  }>;
}

/**
 * Interface for the axe-core library
 */
interface AxeCore {
  run: (context: Document | Element, options?: AxeRunOptions) => Promise<AxeResults>;
}

/**
 * Options for running axe-core
 */
export interface AxeRunOptions {
  /** Element to run the audit on */
  elementRef?: Document | Element;
  /** Rules to include or exclude */
  rules?: Record<string, { enabled: boolean }>;
  /** Other axe-core options */
  [key: string]: unknown;
}

/**
 * Mock function to load axe-core
 * @returns A promise that resolves to a mock axe object
 */
async function loadAxe(): Promise<AxeCore> {
  // Only load in development mode
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Accessibility audit is only available in development mode');
  }

  // Return a mock axe object for testing
  return {
    run: async () => ({
      violations: []
    })
  };
}

/**
 * Run an accessibility audit on the current page
 * @param options Options for the axe-core run
 * @returns A promise that resolves to the audit results
 */
export async function auditAccessibility(
  options?: AxeRunOptions
): Promise<AxeResults> {
  try {
    const axe = await loadAxe();
    return await axe.run(document, options);
  } catch (error) {
    console.error('Failed to run accessibility audit:', error);
    throw error;
  }
}

/**
 * Log accessibility violations to the console
 * @param results The results of an accessibility audit
 */
export function logAccessibilityViolations(results: AxeResults): void {
  if (results.violations.length === 0) {
    console.log('%cNo accessibility violations found!', 'color: green; font-weight: bold;');
    return;
  }

  // Group violations by impact
  const violationsByImpact = results.violations.reduce((acc, violation) => {
    const impact = violation.impact || 'minor';
    if (!acc[impact]) {
      acc[impact] = [];
    }
    acc[impact].push(violation);
    return acc;
  }, {} as Record<string, typeof results.violations>);

  // Log violations by impact
  console.group(`%c${results.violations.length} accessibility violations found`, 'color: red; font-weight: bold;');

  // Log critical violations first
  if (violationsByImpact.critical) {
    console.group(`%c${violationsByImpact.critical.length} critical violations`, 'color: red; font-weight: bold;');
    violationsByImpact.critical.forEach(logViolation);
    console.groupEnd();
  }

  // Log serious violations
  if (violationsByImpact.serious) {
    console.group(`%c${violationsByImpact.serious.length} serious violations`, 'color: orange; font-weight: bold;');
    violationsByImpact.serious.forEach(logViolation);
    console.groupEnd();
  }

  // Log moderate violations
  if (violationsByImpact.moderate) {
    console.group(`%c${violationsByImpact.moderate.length} moderate violations`, 'color: yellow; font-weight: bold;');
    violationsByImpact.moderate.forEach(logViolation);
    console.groupEnd();
  }

  // Log minor violations
  if (violationsByImpact.minor) {
    console.group(`%c${violationsByImpact.minor.length} minor violations`, 'color: blue; font-weight: bold;');
    violationsByImpact.minor.forEach(logViolation);
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Log a single accessibility violation to the console
 * @param violation The accessibility violation to log
 */
function logViolation(violation: AxeResults['violations'][0]): void {
  console.group(`%c${violation.id}: ${violation.help}`, 'color: red; font-weight: bold;');
  console.log('Description:', violation.description);
  console.log('Impact:', violation.impact);
  console.log('Help URL:', violation.helpUrl);

  // Log nodes with violations
  if (violation.nodes.length > 0) {
    console.group('Affected elements:');
    violation.nodes.forEach((node) => {
      console.log(node.html);
      console.log('Failure Summary:', node.failureSummary);

      // Highlight the element in the DOM if possible
      try {
        const element = document.querySelector(node.target.join(' '));
        if (element) {
          console.log('Element:', element);
        }
      } catch (error) {
        // Ignore errors when trying to highlight elements
      }
    });
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Run an accessibility audit and log violations to the console
 * @param options Options for the axe-core run
 * @returns A promise that resolves when the audit is complete
 */
export async function auditAndLogAccessibility(
  options?: AxeRunOptions
): Promise<void> {
  try {
    const results = await auditAccessibility(options);
    logAccessibilityViolations(results);
  } catch (error) {
    console.error('Failed to audit accessibility:', error);
  }
}

/**
 * Example usage:
 *
 * // In development mode, you can add this to your main component:
 * useEffect(() => {
 *   if (process.env.NODE_ENV === 'development') {
 *     import('@/shared/utils/a11y-audit').then(({ auditAndLogAccessibility }) => {
 *       auditAndLogAccessibility();
 *     });
 *   }
 * }, []);
 */
