# Secrets Management

This document explains how to manage secrets in the Athlete Genesis AI application.

## Overview

The application uses environment variables to store sensitive information such as API keys, authentication tokens, and other secrets. These secrets are stored in GitHub Secrets and can be accessed in different ways depending on your environment:

1. **GitHub Actions**: Secrets are automatically available in GitHub Actions workflows
2. **Local Development**: Secrets can be fetched using the provided scripts
3. **Production**: Secrets are injected into the application during the build process

## GitHub Secrets

GitHub Secrets are encrypted environment variables that you can create for a repository. They're used to store sensitive information that your code needs to access.

### Secrets Used in the Application

The application uses the following secrets:

- `VITE_API_BASE_URL`: The base URL for the API
- `VITE_PAYSTACK_PUBLIC_KEY`: The public key for Paystack payment integration
- `VITE_SUPABASE_URL`: The URL for the Supabase instance
- `VITE_SUPABASE_ANON_KEY`: The anonymous key for Supabase authentication
- `VITE_OPENAI_API_KEY`: The API key for OpenAI integration
- `VITE_FIREBASE_API_KEY`: The API key for Firebase integration
- `VITE_FIREBASE_AUTH_DOMAIN`: The auth domain for Firebase
- `VITE_FIREBASE_PROJECT_ID`: The project ID for Firebase
- `VITE_FIREBASE_STORAGE_BUCKET`: The storage bucket for Firebase
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: The messaging sender ID for Firebase
- `VITE_FIREBASE_APP_ID`: The app ID for Firebase
- `VITE_FIREBASE_MEASUREMENT_ID`: The measurement ID for Firebase

## Accessing Secrets

### In GitHub Actions

Secrets are automatically available in GitHub Actions workflows as environment variables. You can access them using the `${{ secrets.SECRET_NAME }}` syntax:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Use secret
        run: echo "The secret is ${{ secrets.VITE_API_BASE_URL }}"
```

### In Local Development

For local development, you can use one of the following methods to access secrets:

#### Method 1: Using the GitHub CLI

If you have the GitHub CLI installed and authenticated, you can use the provided script to fetch secrets:

```bash
# Run the script to fetch secrets
npm run secrets:fetch
```

This will create a `.env` file in the root of the project with the secrets.

#### Method 2: Using a Personal Access Token

If you have a GitHub personal access token with the `repo` scope, you can use the provided script to fetch secrets:

```bash
# Set the GitHub token environment variable
export GITHUB_TOKEN=your_personal_access_token
export GITHUB_REPOSITORY_OWNER=your_github_username_or_organization

# Run the script to fetch secrets
npm run secrets:fetch:token
```

This will create a `.env` file in the root of the project with placeholders for the secrets. You'll need to manually replace the placeholders with the actual values.

#### Method 3: Using the GitHub Actions Workflow

You can also use the provided GitHub Actions workflow to fetch secrets:

```bash
# Run the workflow to generate the .env file
npm run secrets:workflow

# Wait for the workflow to complete, then download the .env file
npm run secrets:download
```

This will create a `.env` file in the root of the project with the secrets.

### In Production

For production deployments, secrets are injected into the application during the build process. This is handled by the CI/CD pipeline.

## Adding or Updating Secrets

To add or update a secret in GitHub:

1. Go to your repository on GitHub
2. Click on "Settings"
3. Click on "Secrets and variables" in the left sidebar
4. Click on "Actions"
5. Click on "New repository secret"
6. Enter the name and value of the secret
7. Click on "Add secret"

## Using Secrets in the Application

The application uses the `env-config.ts` utility to access secrets. This utility provides a standardized way to access environment variables and runtime configuration.

```typescript
import { getConfig, getApiBaseUrl, getSupabaseConfig } from '@/utils/env-config';

// Get a specific config value
const apiBaseUrl = getConfig('API_BASE_URL');

// Or use the convenience functions
const apiBaseUrl = getApiBaseUrl();
const { url, anonKey } = getSupabaseConfig();
```

## Security Considerations

- Never commit secrets to the repository
- Never log secrets in the application
- Rotate secrets regularly
- Use the minimum required permissions for each secret
- Use different secrets for different environments (development, staging, production)

## Troubleshooting

### The `.env` file is not being created

- Make sure you have the GitHub CLI installed and authenticated
- Make sure you have the correct permissions to access the repository
- Check the error messages in the console

### The secrets are not being loaded in the application

- Make sure the `.env` file is in the root of the project
- Make sure the secrets are named correctly (they should start with `VITE_`)
- Make sure the application is using the `env-config.ts` utility to access the secrets

### The GitHub Actions workflow is failing

- Make sure the workflow file is correct
- Make sure the secrets are available in the repository
- Check the workflow logs for error messages
