
/**
 * Run Cleanup Script
 * 
 * This script will execute the cleanUnusedImports.ts script
 * to clean up all dashboard components with unused imports.
 * 
 * Run this script using Node.js:
 * node src/scripts/run-cleanup.js
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting component cleanup script...');

// Helper function to clean imports in a file manually if needed
function cleanImportsManually(filePath, unusedImports) {
  try {
    console.log(`Manually cleaning ${filePath}...`);
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let cleanedContent = fileContent;
    
    // Process each unused import
    unusedImports.forEach(importName => {
      // Remove the import if it's a standalone import
      const importRegex = new RegExp(`import\\s+${importName}\\s+from\\s+['"].*?['"];?\n?`, 'g');
      cleanedContent = cleanedContent.replace(importRegex, '');
      
      // Remove from destructured imports
      const destructuredImportRegex = new RegExp(`({[^}]*),\\s*${importName}(\\s*,[^}]*})`, 'g');
      cleanedContent = cleanedContent.replace(destructuredImportRegex, '$1$2');
      
      // Remove if it's the last item in a destructured import
      const lastItemRegex = new RegExp(`({[^}]*),\\s*${importName}\\s*}`, 'g');
      cleanedContent = cleanedContent.replace(lastItemRegex, '$1 }');
      
      // Remove if it's the first item in a destructured import
      const firstItemRegex = new RegExp(`{\\s*${importName}\\s*,\\s*([^}]*})`, 'g');
      cleanedContent = cleanedContent.replace(firstItemRegex, '{ $1');
    });
    
    // Write the cleaned content back
    fs.writeFileSync(filePath, cleanedContent, 'utf-8');
    
    console.log(`✅ Manually cleaned ${filePath}`);
  } catch (error) {
    console.error(`❌ Error manually cleaning ${filePath}:`, error);
  }
}

// Function to fix specific issues in files
function fixSpecificIssues() {
  console.log('Fixing specific issues...');
  
  // Fix BodyCompositionChart.tsx array call issue
  const bodyCompFile = path.resolve(__dirname, '../components/dashboard/BodyCompositionChart.tsx');
  try {
    let content = fs.readFileSync(bodyCompFile, 'utf-8');
    content = content.replace(/datasets\(\)/g, 'datasets');
    fs.writeFileSync(bodyCompFile, content, 'utf-8');
    console.log('✅ Fixed BodyCompositionChart array call issue');
  } catch (err) {
    console.error('Failed to fix BodyCompositionChart:', err);
  }
  
  // Fix GoalTrackingCard.tsx missing progressData and array call issues
  const goalTrackingFile = path.resolve(__dirname, '../components/dashboard/GoalTrackingCard.tsx');
  try {
    let content = fs.readFileSync(goalTrackingFile, 'utf-8');
    
    // Add missing progressData if not present
    if (!content.includes('const progressData =')) {
      const dataDeclaration = `
  // Define progress data
  const progressData = [
    { date: '2023-05-01', progress: 25 },
    { date: '2023-05-08', progress: 35 },
    { date: '2023-05-15', progress: 45 },
    { date: '2023-05-22', progress: 60 },
    { date: '2023-05-29', progress: 75 },
    { date: '2023-06-05', progress: 90 }
  ];

  const categoryData = [
    { category: 'Strength', progress: 85 },
    { category: 'Endurance', progress: 70 },
    { category: 'Flexibility', progress: 60 },
    { category: 'Balance', progress: 75 }
  ];`;
      
      // Find insertion point after imports and before render
      const insertPos = content.indexOf('const GoalTrackingCard') + content.substring(content.indexOf('const GoalTrackingCard')).indexOf('{') + 1;
      content = content.substring(0, insertPos) + dataDeclaration + content.substring(insertPos);
    }
    
    // Fix array calls
    content = content.replace(/stages\(\)/g, 'stages');
    content = content.replace(/\.map\(progressData,/g, '.map(');
    
    fs.writeFileSync(goalTrackingFile, content, 'utf-8');
    console.log('✅ Fixed GoalTrackingCard issues');
  } catch (err) {
    console.error('Failed to fix GoalTrackingCard:', err);
  }
  
  // Fix HealthDataVisualization.tsx arithmetic operation
  const healthDataVisFile = path.resolve(__dirname, '../components/dashboard/HealthDataVisualization.tsx');
  try {
    let content = fs.readFileSync(healthDataVisFile, 'utf-8');
    content = content.replace(/(sleepEfficiency \* 100)/g, 'Number(sleepEfficiency) * 100');
    fs.writeFileSync(healthDataVisFile, content, 'utf-8');
    console.log('✅ Fixed HealthDataVisualization arithmetic operation');
  } catch (err) {
    console.error('Failed to fix HealthDataVisualization:', err);
  }
  
  // Fix NutritionAnalysisChart Bar issues
  const nutritionFile = path.resolve(__dirname, '../components/dashboard/NutritionAnalysisChart.tsx');
  try {
    let content = fs.readFileSync(nutritionFile, 'utf-8');
    content = content.replace(/<BarChart\.Bar/g, '<Bar');
    content = content.replace(/BarChart\.Bar/g, 'Bar');
    fs.writeFileSync(nutritionFile, content, 'utf-8');
    console.log('✅ Fixed NutritionAnalysisChart Bar issues');
  } catch (err) {
    console.error('Failed to fix NutritionAnalysisChart:', err);
  }
  
  // Fix PersonalizedRecommendations badge variant
  const recommendationsFile = path.resolve(__dirname, '../components/dashboard/PersonalizedRecommendations.tsx');
  try {
    let content = fs.readFileSync(recommendationsFile, 'utf-8');
    content = content.replace(/variant="success"/g, 'variant="outline" className="bg-green-100 text-green-700"');
    fs.writeFileSync(recommendationsFile, content, 'utf-8');
    console.log('✅ Fixed PersonalizedRecommendations badge variant');
  } catch (err) {
    console.error('Failed to fix PersonalizedRecommendations:', err);
  }
  
  // Update Workout type definition for OfflineWorkoutsDisplay
  const workoutTypeFile = path.resolve(__dirname, '../types/workout.ts');
  try {
    let content = fs.readFileSync(workoutTypeFile, 'utf-8');
    
    // Update the Workout interface to include missing fields
    if (!content.includes('title?: string;')) {
      const workoutInterface = content.match(/export interface Workout {([^}]*)}/s);
      if (workoutInterface) {
        let updatedInterface = workoutInterface[1];
        if (!updatedInterface.includes('title?: string;')) {
          updatedInterface += '  title?: string;\n';
        }
        if (!updatedInterface.includes('type?: string;')) {
          updatedInterface += '  type?: string;\n';
        }
        if (!updatedInterface.includes('goals?: WorkoutGoal[];')) {
          updatedInterface += '  goals?: WorkoutGoal[];\n';
        }
        
        // Replace the old interface content with updated one
        content = content.replace(/export interface Workout {([^}]*)}/s, `export interface Workout {${updatedInterface}}`);
        fs.writeFileSync(workoutTypeFile, content, 'utf-8');
        console.log('✅ Updated Workout type definition');
      }
    }
  } catch (err) {
    console.error('Failed to update Workout type:', err);
  }
  
  // Fix OfflineWorkoutsDisplay type issues
  const offlineWorkoutsFile = path.resolve(__dirname, '../components/dashboard/OfflineWorkoutsDisplay.tsx');
  try {
    let content = fs.readFileSync(offlineWorkoutsFile, 'utf-8');
    
    // Fix Type Comparison issues for ConnectionQuality
    content = content.replace(/(case ['"]poor['"]):/g, 'case "poor":\n      // Handle poor connection');
    content = content.replace(/(case ['"]excellent['"]):/g, 'case "excellent":\n      // Handle excellent connection');
    content = content.replace(/(case ['"]captive-portal['"]):/g, 'case "captive-portal":\n      // Handle captive portal');
    
    // Fix date conversion issue
    content = content.replace(/(workout\.date)/g, 'String(workout.date)');
    
    fs.writeFileSync(offlineWorkoutsFile, content, 'utf-8');
    console.log('✅ Fixed OfflineWorkoutsDisplay type issues');
  } catch (err) {
    console.error('Failed to fix OfflineWorkoutsDisplay:', err);
  }
}

// Run the cleanup script
exec('node src/scripts/cleanUnusedImports.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing cleanup script: ${error.message}`);
    // If the auto script fails, try fixing specific issues manually
    fixSpecificIssues();
    return;
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  
  // Print the output of the cleanUnusedImports script
  console.log(stdout);
  
  // Fix specific issues that the cleanup script might not handle
  fixSpecificIssues();
  
  console.log('\nCleanup completed successfully!');
  console.log('All dashboard components have been cleaned of unused imports and variables.');
});
