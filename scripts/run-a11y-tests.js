/**
 * Script to run accessibility tests
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the root directory of the project
const rootDir = path.resolve(__dirname, '..');

// Check if Jest is installed
try {
  require.resolve('jest');
} catch (e) {
  console.error('Jest is not installed. Please run `npm install --save-dev jest`');
  process.exit(1);
}

// Check if the accessibility test config exists
const configPath = path.join(rootDir, 'jest.config.accessibility.js');
if (!fs.existsSync(configPath)) {
  console.error(`Accessibility test config not found at ${configPath}`);
  process.exit(1);
}

// Run the tests
try {
  console.log('Running accessibility tests...');
  execSync(`npx jest --config=${configPath}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Accessibility tests failed');
  process.exit(1);
}

console.log('Accessibility tests passed!');
