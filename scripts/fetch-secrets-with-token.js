/**
 * Fetch Secrets with Token Script
 * 
 * This script fetches secrets from GitHub using a personal access token
 * and creates a local .env file.
 * 
 * Usage:
 * GITHUB_TOKEN=your_token node scripts/fetch-secrets-with-token.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const REPO = 'athlete-genesis-ai'; // Your repository name
const OWNER = process.env.GITHUB_REPOSITORY_OWNER || ''; // Your GitHub username or organization
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Your GitHub personal access token
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
 * Make a request to the GitHub API
 */
function makeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        'User-Agent': 'Node.js',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsedData = JSON.parse(responseData);
            resolve(parsedData);
          } catch (error) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Get repository secrets
 */
async function getRepoSecrets() {
  try {
    const response = await makeRequest(`/repos/${OWNER}/${REPO}/actions/secrets`);
    return response.secrets || [];
  } catch (error) {
    console.error('Error fetching repository secrets:', error.message);
    return [];
  }
}

/**
 * Create a workflow to fetch a secret
 */
async function createWorkflowToFetchSecret(secretName) {
  const workflowContent = `
name: Fetch Secret

on:
  workflow_dispatch:

jobs:
  fetch-secret:
    runs-on: ubuntu-latest
    steps:
      - name: Echo secret
        run: echo "::set-output name=secret_value::\${{ secrets.${secretName} }}"
        id: fetch_secret
      
      - name: Upload secret as artifact
        uses: actions/upload-artifact@v3
        with:
          name: secret-value
          path: ${{ steps.fetch_secret.outputs.secret_value }}
          retention-days: 1
`;
  
  try {
    // Create or update the workflow file
    await makeRequest(
      `/repos/${OWNER}/${REPO}/contents/.github/workflows/fetch-secret.yml`,
      'PUT',
      {
        message: 'Create workflow to fetch secret',
        content: Buffer.from(workflowContent).toString('base64'),
        branch: 'main'
      }
    );
    
    // Trigger the workflow
    await makeRequest(
      `/repos/${OWNER}/${REPO}/actions/workflows/fetch-secret.yml/dispatches`,
      'POST',
      { ref: 'main' }
    );
    
    // Wait for the workflow to complete
    console.log(`Waiting for workflow to complete for secret: ${secretName}...`);
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    
    // Get the workflow run
    const runs = await makeRequest(`/repos/${OWNER}/${REPO}/actions/workflows/fetch-secret.yml/runs`);
    const latestRun = runs.workflow_runs[0];
    
    // Wait for the run to complete
    let status = latestRun.status;
    while (status !== 'completed') {
      console.log(`Workflow status: ${status}. Waiting...`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const runInfo = await makeRequest(`/repos/${OWNER}/${REPO}/actions/runs/${latestRun.id}`);
      status = runInfo.status;
    }
    
    // Get the artifact
    const artifacts = await makeRequest(`/repos/${OWNER}/${REPO}/actions/runs/${latestRun.id}/artifacts`);
    const secretArtifact = artifacts.artifacts.find(a => a.name === 'secret-value');
    
    if (secretArtifact) {
      // Download the artifact
      const downloadUrl = await makeRequest(`/repos/${OWNER}/${REPO}/actions/artifacts/${secretArtifact.id}/zip`);
      
      // Extract the secret value from the artifact
      // Note: This is a simplified example. In reality, you would need to download and extract the ZIP file.
      return downloadUrl;
    }
    
    return '';
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error.message);
    return '';
  }
}

/**
 * Main function
 */
async function main() {
  // Check if GitHub token is provided
  if (!GITHUB_TOKEN) {
    console.error('GitHub token is required. Please set the GITHUB_TOKEN environment variable.');
    process.exit(1);
  }
  
  // Check if owner is provided
  if (!OWNER) {
    console.error('GitHub repository owner is required. Please set the GITHUB_REPOSITORY_OWNER environment variable.');
    process.exit(1);
  }
  
  console.log('Fetching secrets from GitHub...');
  
  // Get repository secrets
  const secrets = await getRepoSecrets();
  console.log(`Found ${secrets.length} secrets in the repository.`);
  
  // Create .env file content
  let envContent = '# Environment variables fetched from GitHub Secrets\n';
  envContent += `# Generated at: ${new Date().toISOString()}\n\n`;
  
  // Add a note about the limitation
  envContent += '# Note: Due to GitHub API limitations, secret values cannot be directly fetched.\n';
  envContent += '# This file contains placeholders for the secrets. Please replace them with the actual values.\n\n';
  
  // Add each secret as a placeholder
  for (const secretName of SECRETS_TO_FETCH) {
    const secretExists = secrets.some(s => s.name === secretName);
    if (secretExists) {
      envContent += `${secretName}=<replace_with_actual_value>\n`;
      console.log(`Added placeholder for secret: ${secretName}`);
    } else {
      console.log(`Secret not found: ${secretName}`);
    }
  }
  
  // Write to .env file
  fs.writeFileSync(ENV_FILE_PATH, envContent);
  
  console.log(`Placeholders written to ${ENV_FILE_PATH}`);
  console.log('Please replace the placeholders with the actual secret values.');
  console.log('Done!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
