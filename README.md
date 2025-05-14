# Athlete GPT

## Project Overview

Athlete GPT is a web application designed to provide personalized fitness and nutrition plans for athletes, fitness enthusiasts, and coaches. The platform uses AI to generate customized workout and meal plans based on user preferences, goals, and constraints.

## Core Features

1. **Personalized Workout Plans**: AI-generated exercise routines tailored to specific sports, fitness levels, and goals.

2. **Nutrition Planning**: Custom meal plans optimized for training schedules, body composition, and dietary preferences.

3. **Multi-User Types**:

   - **Athletes**: Sport-specific training plans for performance improvement
   - **Fitness Enthusiasts**: General fitness and health-focused plans
   - **Coaches**: Tools to manage multiple athletes and monitor their progress

4. **Adaptive Learning**: The system evolves with users, adjusting recommendations based on progress and feedback.

5. **Progress Tracking**: Analytics to visualize improvements and identify areas for growth.

6. **Coach Integration**: Tools for coaches to manage teams, including athlete rosters, team calendars, and analytics.

## Getting Started

Follow these steps to set up the project locally:

```sh
# Step 1: Clone the repository
git clone <REPOSITORY_URL>

# Step 2: Navigate to the project directory
cd athlete-genesis-ai

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp .env.example .env.local
# Edit .env.local with your own values

# Step 5: Start the development server
npm run dev
```

### Environment Setup

This project requires several environment variables to be set up. Create a `.env.local` file based on the `.env.example` template and fill in the required values:

1. **Supabase Configuration**:

   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project and get the URL and anon key
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env.local` file

2. **Paystack Configuration**:

   - Create a Paystack account at [paystack.com](https://paystack.com)
   - Get your public key
   - Set `VITE_PAYSTACK_PUBLIC_KEY` in your `.env.local` file

3. **Firebase Configuration**:

   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Add a web app to your project
   - Copy the Firebase configuration values to your `.env.local` file:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_FIREBASE_MEASUREMENT_ID`

4. **Feature Flags**:
   - Configure feature flags according to your development needs
   - `VITE_ENABLE_OFFLINE_MODE`: Enable offline functionality
   - `VITE_ENABLE_ANALYTICS`: Enable analytics tracking
   - `VITE_ENABLE_DARK_MODE`: Enable dark mode theme

## Technologies Used

This project is built with:

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React Context API and React Query
- **Backend Integration**: Supabase
- **Authentication & Storage**: Firebase
- **Payment Processing**: Paystack
- **Hosting & Deployment**: Netlify
- **Routing**: React Router for navigation

## Project Structure

The project follows a feature-based architecture:

- `src/app`: Application core (providers, routes, main entry point)
- `src/features`: Feature modules organized by domain
  - `auth`: Authentication and authorization
  - `workout`: Workout planning and tracking
  - `nutrition`: Nutrition planning and tracking
  - `offline`: Offline functionality
  - `user`: User profile and settings
- `src/shared`: Shared code used across multiple features
  - `components`: Reusable UI components
  - `hooks`: Custom React hooks
  - `utils`: Utility functions
  - `types`: TypeScript type definitions
- `src/pages`: Page components that compose features
- `src/services`: Service implementations (API, database, etc.)
- `src/integrations`: External service integrations
- `src/firebase`: Firebase configuration and service modules

### Architecture Guidelines

1. **Feature Isolation**: Features should be isolated from each other
2. **Import Rules**:
   - Features can import from `shared`
   - Features should not import from other features
   - `app` can import from both `features` and `shared`
3. **State Management**: Feature-specific state should be managed within the feature

## Dependency Management

This project uses several tools to manage dependencies and ensure code quality:

### Scripts

- `npm run deps:check`: Check for outdated dependencies
- `npm run deps:update`: Update dependencies to their latest compatible versions
- `npm run deps:audit`: Check for security vulnerabilities
- `npm run deps:fix`: Fix security vulnerabilities

### Git Hooks

- **Pre-commit**: Runs linting and type checking on staged files
- **Pre-push**: Runs tests before pushing to the repository

### Automated Dependency Updates

This project uses GitHub Dependabot to automatically create pull requests for dependency updates. Configuration can be found in `.github/dependabot.yml`.

### Best Practices

1. **Regular Maintenance**: Run `npm run deps:check` and `npm run deps:audit` regularly
2. **Update Dependencies**: Keep dependencies up to date with `npm run deps:update`
3. **Review PRs**: Review Dependabot pull requests carefully before merging

## Offline Functionality

This project includes robust offline support:

1. **Offline Data Access**: Access workout plans and other data when offline
2. **Offline Actions**: Perform actions while offline that will sync when back online
3. **Sync Mechanism**: Automatic synchronization when connectivity is restored
4. **Visual Indicators**: Clear UI indicators for offline status and pending sync operations

### Implementation Details

- **IndexedDB**: Used for local data storage
- **Network Detection**: Monitors online/offline status
- **Retry Queue**: Queues failed operations for retry when online
- **Data Validation**: Validates data before saving to prevent corruption

### Testing Offline Mode

1. Open the application in Chrome
2. Open Chrome DevTools (F12)
3. Go to the Network tab
4. Check the "Offline" checkbox
5. Use the application and observe offline behavior
6. Uncheck "Offline" to restore connectivity and observe sync behavior

## TypeScript and Code Quality

This project uses TypeScript with strict type checking to ensure code quality and prevent runtime errors.

### TypeScript Configuration

- **Strict Mode**: Enables all strict type checking options
- **No Implicit Any**: Prevents the use of variables with implicit `any` type
- **Strict Null Checks**: Prevents null and undefined from being assigned to variables unless explicitly allowed

### Code Quality Tools

- **ESLint**: Static code analysis to identify problematic patterns
- **Prettier**: Code formatter to ensure consistent code style
- **Husky**: Git hooks to enforce code quality before commits
- **Jest**: Testing framework for unit and integration tests

### Best Practices

1. **Avoid `any` Type**: Always define proper types instead of using `any`
2. **Use Type Guards**: Validate types at runtime when necessary
3. **Document Complex Types**: Add JSDoc comments to explain complex types
4. **Write Tests**: Cover critical functionality with unit tests

## Deployment

This project is configured for deployment on Netlify using GitHub Actions and GitHub Secrets.

### GitHub Secrets Setup

1. **Add Required Secrets**:

   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `VITE_API_BASE_URL`: Your API base URL
     - `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack public key
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `VITE_OPENAI_API_KEY`: Your OpenAI API key
     - `VITE_FIREBASE_API_KEY`: Your Firebase API key
     - `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
     - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
     - `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
     - `VITE_FIREBASE_APP_ID`: Your Firebase app ID
     - `VITE_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID
     - `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
     - `NETLIFY_SITE_ID`: Your Netlify site ID

2. **Get Netlify Tokens**:

   - To get your `NETLIFY_AUTH_TOKEN`:

     - Go to Netlify User Settings > Applications > Personal access tokens
     - Create a new token with appropriate permissions

   - To get your `NETLIFY_SITE_ID`:
     - Go to your Netlify site settings
     - The site ID is in the Site information section

### Automated Deployment

This project uses GitHub Actions for automated deployment:

1. **Manual Deployment**:

   - Go to the Actions tab in your GitHub repository
   - Select the "Deploy to Netlify" workflow
   - Click "Run workflow" and select the branch to deploy

2. **Automatic Deployment**:

   - Pushes to the main branch will automatically trigger a deployment
   - The workflow will:
     - Build the application
     - Generate environment configuration from GitHub Secrets
     - Deploy to Netlify

3. **Environment Configuration**:
   - The deployment workflow generates:
     - A `.env` file for build-time environment variables
     - A `config.js` file for runtime configuration
   - This approach allows updating configuration without rebuilding the app

### Netlify Configuration

1. **Connect to Netlify**:

   - Create an account on [Netlify](https://netlify.com)
   - Connect your GitHub repository to Netlify
   - Configure the build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

2. **Custom Domain**:
   - Configure your custom domain in the Netlify dashboard
   - Netlify provides free SSL certificates via Let's Encrypt

### Firebase Configuration

For Firebase services to work in production:

1. **Authentication**:

   - Enable the authentication methods you need in the Firebase console
   - Configure authorized domains in the Firebase Authentication settings

2. **Storage Rules**:

   - Configure Firebase Storage security rules to control access
   - Example rules are available in the Firebase documentation

3. **Firestore Rules**:
   - Set up security rules for Firestore to protect your data
   - Test your rules thoroughly before deploying to production
