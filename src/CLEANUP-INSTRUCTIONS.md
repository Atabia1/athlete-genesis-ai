
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

2. **What the script fixes:**

- Removes unused imports from all components
- Removes unused variables from components 
- Fixes type errors in NutritionAnalysisChart.tsx including:
  - Adding missing state variables and handlers
  - Fixing Bar property access in BarChart
  - Correcting type handling for string methods
- Fixes OfflineWorkoutsDisplay.tsx issues:
  - Adds missing type definitions
  - Corrects ConnectionQuality type handling
  - Properly types function parameters
- Fixes array access issues in BodyCompositionChart.tsx and GoalTrackingCard.tsx
- Adds missing data declarations in affected components
- Corrects badge variant in PersonalizedRecommendations.tsx
- Fixes arithmetic operations in HealthDataVisualization.tsx

## Understanding the Cleanup Process

The cleanup is performed by two main scripts:
1. `src/utils/cleanImports.ts` - Core utility that contains the cleaning logic
2. `src/scripts/cleanUnusedImports.ts` - Script that applies the cleaning to files
3. `src/scripts/runCleanup.js` - Node.js wrapper to easily run the TypeScript script

The process:
1. Identifies unused imports and variables based on predefined lists
2. Removes them from the source files
3. Applies component-specific fixes for type errors and other issues
4. Saves the cleaned files back to disk

## Manual Review

After running the script, it's recommended to:
1. Review the console output for any reported errors
2. Check that the components still render correctly
3. Verify that TypeScript no longer reports errors for the cleaned files

If any issues persist, you may need to manually fix specific components.

## Additional Resources

- TypeScript handbook: https://www.typescriptlang.org/docs/handbook/
- ESLint configuration for auto-fixing: Add a script to package.json:
  ```
  "lint:fix": "eslint --fix --ext .ts,.tsx src/"
  ```

For any issues with the cleanup process, check the console output for detailed error messages.
