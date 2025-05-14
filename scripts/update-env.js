/**
 * Update Environment Variables Script
 *
 * This script helps you update the .env file with real values.
 * It will prompt you for each environment variable and update the .env file.
 *
 * Usage:
 * node scripts/update-env.js
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ENV_FILE_PATH = path.join(__dirname, '..', '.env');
const ENV_VARS = [
  {
    name: 'VITE_API_BASE_URL',
    description: 'The base URL for the API',
    default: 'https://api.athletegenesis.ai',
  },
  {
    name: 'VITE_SUPABASE_URL',
    description: 'The URL for the Supabase instance',
    default: '',
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    description: 'The anonymous key for Supabase authentication',
    default: '',
  },
  {
    name: 'VITE_PAYSTACK_PUBLIC_KEY',
    description: 'The public key for Paystack payment integration',
    default: '',
  },
  {
    name: 'VITE_OPENAI_API_KEY',
    description: 'The API key for OpenAI integration',
    default: '',
  },
  {
    name: 'VITE_FIREBASE_API_KEY',
    description: 'The API key for Firebase integration',
    default: '',
  },
  {
    name: 'VITE_FIREBASE_AUTH_DOMAIN',
    description: 'The auth domain for Firebase',
    default: '',
  },
  {
    name: 'VITE_FIREBASE_PROJECT_ID',
    description: 'The project ID for Firebase',
    default: '',
  },
  {
    name: 'VITE_FIREBASE_STORAGE_BUCKET',
    description: 'The storage bucket for Firebase',
    default: '',
  },
  {
    name: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
    description: 'The messaging sender ID for Firebase',
    default: '',
  },
  {
    name: 'VITE_FIREBASE_APP_ID',
    description: 'The app ID for Firebase',
    default: '',
  },
  {
    name: 'VITE_FIREBASE_MEASUREMENT_ID',
    description: 'The measurement ID for Firebase',
    default: '',
  },
  {
    name: 'VITE_ENABLE_OFFLINE_MODE',
    description: 'Whether to enable offline mode',
    default: 'true',
  },
  {
    name: 'VITE_ENABLE_ANALYTICS',
    description: 'Whether to enable analytics',
    default: 'true',
  },
];

/**
 * Read the .env file
 */
function readEnvFile() {
  try {
    const content = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    const lines = content.split('\n');
    const envVars = {};

    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || !line.trim()) {
        continue;
      }

      // Parse the line
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, name, value] = match;
        envVars[name.trim()] = value.trim();
      }
    }

    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

/**
 * Write the .env file
 */
function writeEnvFile(envVars) {
  try {
    // Create .env file content
    let content = '# Environment variables for Athlete Genesis AI\n';
    content += `# Updated at: ${new Date().toISOString()}\n\n`;

    // Group variables by category
    const categories = {
      'API Configuration': ['VITE_API_BASE_URL'],
      'Authentication Configuration': ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'],
      'Payment Configuration': ['VITE_PAYSTACK_PUBLIC_KEY'],
      'External Services': ['VITE_OPENAI_API_KEY'],
      'Firebase Configuration': [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID',
        'VITE_FIREBASE_MEASUREMENT_ID',
      ],
      'Feature Flags': ['VITE_ENABLE_OFFLINE_MODE', 'VITE_ENABLE_ANALYTICS'],
    };

    // Add variables by category
    for (const [category, vars] of Object.entries(categories)) {
      content += `# ${category}\n`;

      for (const name of vars) {
        if (envVars[name] !== undefined) {
          content += `${name}=${envVars[name]}\n`;
        }
      }

      content += '\n';
    }

    // Write to .env file
    fs.writeFileSync(ENV_FILE_PATH, content);

    console.log(`Environment variables written to ${ENV_FILE_PATH}`);
  } catch (error) {
    console.error('Error writing .env file:', error.message);
  }
}

/**
 * Prompt for environment variables
 */
async function promptForEnvVars() {
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Read current .env file
  const currentEnvVars = readEnvFile();
  const newEnvVars = { ...currentEnvVars };

  // Prompt for each environment variable
  for (const envVar of ENV_VARS) {
    const { name, description, default: defaultValue } = envVar;
    const currentValue = currentEnvVars[name] || defaultValue;

    // Prompt for the value
    const value = await new Promise(resolve => {
      rl.question(`${name} (${description}) [${currentValue}]: `, answer => {
        resolve(answer.trim() || currentValue);
      });
    });

    // Update the value
    newEnvVars[name] = value;
  }

  // Close readline interface
  rl.close();

  return newEnvVars;
}

/**
 * Main function
 */
async function main() {
  console.log('Updating environment variables...');

  // Prompt for environment variables
  const envVars = await promptForEnvVars();

  // Write the .env file
  writeEnvFile(envVars);

  console.log('Done!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
