
# Dashboard Components Cleanup Instructions

This document provides instructions for fixing TypeScript errors related to unused imports and variables across dashboard components.

## Fixing the TypeScript Errors

The TypeScript errors in your dashboard components fall into several categories:
1. Unused imports (TS6133)
2. Unused variables (TS6133)
3. Type errors in specific components (TS2339, TS7006, etc.)

### Steps to Fix All Errors

1. **Run the cleanup script:**

```bash
node src/scripts/runCleanup.js
```

This script will automatically remove unused imports and variables from all dashboard components.

2. **For specific components with type issues:**

We've already fixed:
- `NutritionAnalysisChart.tsx` - Fixed Bar property access and type casting for string methods
- `OfflineWorkoutsDisplay.tsx` - Added ConnectionQuality type and fixed related errors
- `EliteDashboard.tsx` - Cleaned unused imports
- `MealPlanDisplay.tsx` - Cleaned unused imports

3. **Remaining issues:**

After running the cleanup script, you may want to review the following files for any remaining issues:
- `HealthInsights.tsx`
- `HealthTrends.tsx`
- `BodyCompositionChart.tsx`
- `GoalTrackingCard.tsx`
- `HealthDataVisualization.tsx`

## Understanding the Cleanup Process

The cleanup is performed by the `cleanUnusedImports.ts` script, which:
1. Identifies unused imports and variables in each component
2. Removes them from the source files
3. Ensures type safety and fixes basic typing issues

## Manual Cleanup (if needed)

If you prefer to clean the files manually, you can follow this pattern:

```typescript
// Remove unused imports
import { OnlyKeep, WhatYouNeed } from 'some-package';

// Remove unused variables
const component = () => {
  // Only declare variables you actually use
  const usedVariable = 'value';
  
  return (
    // Component JSX
  );
};
```

## Additional Resources

- TypeScript handbook: https://www.typescriptlang.org/docs/handbook/
- ESLint configuration for auto-fixing: Add a script to package.json:
  ```
  "lint:fix": "eslint --fix --ext .ts,.tsx src/"
  ```

For any issues with the cleanup process, check the console output for detailed error messages.
