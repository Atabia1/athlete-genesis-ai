
/**
 * Run Cleanup Script
 * 
 * This script will execute the cleanUnusedImports.ts script
 * to clean up all dashboard components with unused imports.
 * 
 * Run this script using Node.js:
 * node src/scripts/runCleanup.js
 */

const { exec } = require('child_process');
const path = require('path');

console.log('Starting component cleanup script...');

// Run the cleanup script
exec('npx ts-node src/scripts/cleanUnusedImports.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing cleanup script: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  
  // Print the output of the cleanUnusedImports script
  console.log(stdout);
  
  console.log('\nCleanup completed successfully!');
  console.log('All dashboard components have been cleaned of unused imports and variables.');
  console.log('\nTo build the project, run:');
  console.log('npm run build');
});
