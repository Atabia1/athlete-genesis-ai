
/**
 * Clean Unused Imports Script
 * 
 * This script can be used to automate the cleaning of unused imports in the project.
 * 
 * Usage:
 * 1. Run the script: npx ts-node src/scripts/cleanUnusedImports.ts
 * 2. Follow the prompts to clean specific files or all files at once
 */

import { getUnusedImportInfo, getUnusedVariables } from '../utils/cleanImports';
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
];

/**
 * Clean a single file
 */
const cleanFile = (filename: string) => {
  const filePath = path.join(dashboardComponentsPath, filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Get component name without extension
  const componentName = path.basename(filename, path.extname(filename));
  
  // Get unused imports and variables
  const unusedImports = getUnusedImportInfo(componentName);
  const unusedVariables = getUnusedVariables(componentName);
  
  if (unusedImports.length === 0 && unusedVariables.length === 0) {
    console.log(`No unused imports or variables found in ${filename}`);
    return;
  }
  
  console.log(`Cleaning ${filename}...`);
  
  // Remove unused imports
  for (const importName of unusedImports) {
    const importRegex = new RegExp(`\\b${importName}\\b\\s*,?|,\\s*\\b${importName}\\b`, 'g');
    content = content.replace(importRegex, '');
    
    // Clean up double commas or trailing commas in import statements
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/,\s*}/g, ' }');
    content = content.replace(/,\s*from/g, ' from');
    
    console.log(`Removed import: ${importName}`);
  }
  
  // Remove unused variables
  for (const variableName of unusedVariables) {
    const variableRegex = new RegExp(`\\bconst\\s+${variableName}\\b[^;]*;|\\b${variableName}\\b\\s*,?|,\\s*\\b${variableName}\\b`, 'g');
    content = content.replace(variableRegex, '');
    
    // Clean up double commas or trailing commas in variable declarations
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/,\s*}/g, ' }');
    content = content.replace(/,\s*=\s*/g, ' = ');
    
    console.log(`Removed variable: ${variableName}`);
  }
  
  // Write back the cleaned file
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Finished cleaning ${filename}`);
};

/**
 * Main function
 */
const main = () => {
  console.log('Starting cleanup of unused imports and variables...');
  
  for (const file of filesToClean) {
    cleanFile(file);
  }
  
  console.log('\nCleanup complete!');
  console.log('Note: This script performs basic cleanup. Manual review may still be needed for complex cases.');
};

// Run the script
main();
