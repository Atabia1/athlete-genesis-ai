
# Remove Unused Imports Utility

This utility provides tools to help clean up unused imports and variables in your TypeScript React files.

## Available Tools

1. **Manual Utility**: `src/utils/cleanImports.ts`
   - Contains methods to identify unused imports and variables in specific files
   - Can be used programmatically or via console logs

2. **Automated Script**: `src/scripts/cleanUnusedImports.ts` 
   - Automatically removes unused imports and variables from dashboard component files
   - Run with: `npx ts-node src/scripts/cleanUnusedImports.ts`

## How to Use

### Option 1: Use the cleanImports utility manually

```typescript
import { fixImportsInFile } from './utils/cleanImports';

// Get a report of what needs to be cleaned in a specific file
fixImportsInFile('BodyCompositionChart');
```

### Option 2: Run the automated cleanup script

```bash
# Navigate to your project root
cd your-project-root

# Run the script
npx ts-node src/scripts/cleanUnusedImports.ts
```

### Option 3: Add a package.json script

Add this to your package.json:

```json
"scripts": {
  "clean-imports": "ts-node src/scripts/cleanUnusedImports.ts"
}
```

Then run:

```bash
npm run clean-imports
```

## Important Notes

1. The automated script performs basic string replacements and may not handle complex cases correctly
2. Always review changes after running the automated script
3. Consider using ESLint with the `no-unused-vars` and `no-unused-imports` rules for ongoing prevention

## Files in Need of Cleaning

The following dashboard component files have unused imports or variables:

- BodyCompositionChart.tsx
- CoachDashboard.tsx
- EliteDashboard.tsx
- ExportHealthDataCard.tsx
- GoalTrackingCard.tsx
- HealthDataVisualization.tsx
- HealthInsights.tsx
- HealthTrends.tsx
- NutritionAnalysisChart.tsx
