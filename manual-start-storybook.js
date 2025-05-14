// Simple script to start Storybook
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Storybook...');

// Path to node_modules/.bin/storybook
const storybookBin = path.join(__dirname, 'node_modules', '.bin', 'storybook');

// Spawn the storybook process
const storybook = spawn('node', [storybookBin, 'dev', '-p', '6006'], {
  stdio: 'inherit',
  shell: true
});

storybook.on('error', (error) => {
  console.error(`Failed to start Storybook: ${error.message}`);
});

storybook.on('close', (code) => {
  console.log(`Storybook process exited with code ${code}`);
});
