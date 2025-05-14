/**
 * Fetch Secrets Script
 * 
 * This script fetches secrets from GitHub and creates a local .env file.
 * It requires the GitHub CLI (gh) to be installed and authenticated.
 * 
 * Usage:
 * node scripts/fetch-secrets.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const REPO = 'athlete-genesis-ai'; // Your repository name
const OWNER = process.env.GITHUB_REPOSITORY_OWNER || ''; // Your GitHub username or organization
const ENV_FILE_PATH = path.join(__dirname, '..', '.env');
const SECRETS_TO_FETCH = [
  'VITE_API_BASE_URL',
  'VITE_PAYSTACK_PUBLIC_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_OPENAI_API_KEY',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
];

/**
 * Check if GitHub CLI is installed
 */
function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('GitHub CLI (gh) is not installed or not in PATH.');
    console.error('Please install it from https://cli.github.com/');
    return false;
  }
}

/**
 * Check if user is authenticated with GitHub CLI
 */
function checkGitHubAuth() {
  try {
    const status = execSync('gh auth status', { stdio: 'pipe' }).toString();
    return status.includes('Logged in to');
  } catch (error) {
    console.error('Not authenticated with GitHub CLI.');
    console.error('Please run: gh auth login');
    return false;
  }
}

/**
 * Fetch a secret from GitHub
 */
function fetchSecret(secretName) {
  try {
    // For security reasons, GitHub doesn't allow direct access to secrets via API
    // This is a workaround that creates a temporary workflow to echo the secret
    console.log(`Fetching secret: ${secretName}...`);
    
    // Create a temporary workflow file
    const workflowContent = `
name: Fetch Secret

on:
  workflow_dispatch:
    inputs:
      secret_name:
        description: 'Secret name to fetch'
        required: true

jobs:
  fetch-secret:
    runs-on: ubuntu-latest
    steps:
      - name: Echo secret
        run: echo "::set-output name=secret_value::\${{ secrets.${secretName} }}"
        id: fetch_secret
`;
    
    const tempWorkflowPath = path.join(__dirname, 'temp-workflow.yml');
    fs.writeFileSync(tempWorkflowPath, workflowContent);
    
    // Upload the workflow file
    execSync(`gh workflow create temp-workflow.yml`, { cwd: __dirname });
    
    // Run the workflow
    const result = execSync(`gh workflow run temp-workflow.yml --field secret_name=${secretName}`, { cwd: __dirname }).toString();
    console.log(result);
    
    // Wait for the workflow to complete
    console.log('Waiting for workflow to complete...');
    execSync('sleep 5');
    
    // Get the workflow run ID
    const runs = JSON.parse(execSync(`gh api repos/${OWNER}/${REPO}/actions/workflows/temp-workflow.yml/runs --jq '.workflow_runs[0].id'`).toString());
    const runId = runs[0].id;
    
    // Wait for the run to complete
    let status = '';
    while (status !== 'completed') {
      const runInfo = JSON.parse(execSync(`gh api repos/${OWNER}/${REPO}/actions/runs/${runId}`).toString());
      status = runInfo.status;
      if (status !== 'completed') {
        console.log(`Workflow status: ${status}. Waiting...`);
        execSync('sleep 5');
      }
    }
    
    // Get the workflow output
    const output = JSON.parse(execSync(`gh api repos/${OWNER}/${REPO}/actions/runs/${runId}/jobs --jq '.jobs[0].steps[1].outputs.secret_value'`).toString());
    
    // Clean up
    execSync(`gh api -X DELETE repos/${OWNER}/${REPO}/actions/workflows/temp-workflow.yml`);
    fs.unlinkSync(tempWorkflowPath);
    
    return output.secret_value;
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error.message);
    return '';
  }
}

/**
 * Main function
 */
async function main() {
  // Check prerequisites
  if (!checkGitHubCLI() || !checkGitHubAuth()) {
    process.exit(1);
  }
  
  console.log('Fetching secrets from GitHub...');
  
  // Create .env file content
  let envContent = '# Environment variables fetched from GitHub Secrets\n';
  envContent += `# Generated at: ${new Date().toISOString()}\n\n`;
  
  // Fetch each secret
  for (const secretName of SECRETS_TO_FETCH) {
    const secretValue = fetchSecret(secretName);
    if (secretValue) {
      envContent += `${secretName}=${secretValue}\n`;
    }
  }
  
  // Write to .env file
  fs.writeFileSync(ENV_FILE_PATH, envContent);
  
  console.log(`Secrets written to ${ENV_FILE_PATH}`);
  console.log('Done!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
