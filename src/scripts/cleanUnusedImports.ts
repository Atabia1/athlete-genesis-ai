/**
 * Clean Unused Imports Script
 * 
 * This script automates the cleaning of unused imports and variables in dashboard components.
 * It fixes TypeScript errors and removes unnecessary code.
 * 
 * Usage:
 * 1. Run the script: npx ts-node src/scripts/cleanUnusedImports.ts
 * 2. Follow the prompts or use arguments to clean specific files
 */

import { cleanComponentContent } from '../utils/cleanImports';
import * as fs from 'fs';
import * as path from 'path';

const dashboardComponentsPath = path.resolve(__dirname, '../components/dashboard');

// Files that need cleaning
const filesToClean = [
  'BodyCompositionChart.tsx',
  'CoachDashboard.tsx',
  'EliteDashboard.tsx',
  'ExportHealthDataCard.tsx',
  'GoalTrackingCard.tsx',
  'HealthDataDisplay.tsx',
  'HealthDataVisualization.tsx',
  'HealthInsights.tsx',
  'HealthTrends.tsx',
  'NutritionAnalysisChart.tsx',
  'MealPlanDisplay.tsx',
  'OfflineWorkoutsDisplay.tsx'
];

/**
 * Clean a single file
 */
const cleanFile = (filename: string): boolean => {
  const filePath = path.join(dashboardComponentsPath, filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }
  
  // Get component name without extension
  const componentName = path.basename(filename, path.extname(filename));
  
  try {
    console.log(`Cleaning ${filename}...`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Clean the content using our utility
    const cleanedContent = cleanComponentContent(content, componentName);
    
    // Only write if changes were made
    if (cleanedContent !== content) {
      fs.writeFileSync(filePath, cleanedContent, 'utf-8');
      console.log(`✅ Cleaned ${filename}`);
      return true;
    } else {
      console.log(`ℹ️ No changes needed for ${filename}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error cleaning ${filename}:`, error);
    return false;
  }
};

/**
 * Clean a specific file based on TypeScript errors
 */
const cleanComponentWithErrors = (componentName: string): boolean => {
  const filename = `${componentName}.tsx`;
  return cleanFile(filename);
};

/**
 * Run the cleaning on all files with known issues
 */
const cleanAllFiles = (): boolean => {
  let allSuccess = true;
  let successCount = 0;
  
  console.log('Starting cleanup of unused imports and variables for all files...');
  
  for (const file of filesToClean) {
    const success = cleanFile(file);
    if (success) successCount++;
    allSuccess = allSuccess && success;
  }
  
  console.log(`\nCleanup complete! Successfully cleaned ${successCount}/${filesToClean.length} files.`);
  
  if (successCount < filesToClean.length) {
    console.log(`⚠️ ${filesToClean.length - successCount} files could not be cleaned. Check the errors above.`);
  }
  
  return allSuccess;
};

/**
 * Main function
 */
const main = () => {
  console.log('=== TypeScript Unused Imports and Variables Cleaner ===');
  
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // If component name was provided, clean just that component
    const componentName = args[0];
    cleanComponentWithErrors(componentName);
  } else {
    // Otherwise clean all files
    cleanAllFiles();
  }
  
  console.log('\nNote: Manual review is recommended to ensure all changes are correct.');
  console.log('Run ESLint or TypeScript compilation to verify all issues are resolved.');
};

// Run the script
main();
