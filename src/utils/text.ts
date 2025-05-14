/**
 * Text Utility
 * 
 * This utility provides a simple way to manage text throughout the application.
 * It replaces the i18n functionality with direct text, making it easy to update UI text.
 */

/**
 * Application text constants
 */
export const AppText = {
  // App title and general text
  app: {
    title: 'Athlete GPT',
    description: 'Personalized AI-powered fitness coaching',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    close: 'Close',
    confirm: 'Confirm',
  },

  // Navigation
  nav: {
    home: 'Home',
    pricing: 'Pricing',
    features: 'Features',
    about: 'About',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
  },

  // Authentication
  auth: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    logoutSuccess: 'Logout successful',
    passwordResetSuccess: 'Password reset successful',
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome to your dashboard',
    summary: 'Summary',
    recentWorkouts: 'Recent Workouts',
    upcomingWorkouts: 'Upcoming Workouts',
    progress: 'Progress',
    goals: 'Goals',
    metrics: 'Metrics',
    performance: 'Performance',
    strength: 'Strength',
    endurance: 'Endurance',
    flexibility: 'Flexibility',
    recovery: 'Recovery',
  },

  // Workouts
  workouts: {
    title: 'Workouts',
    create: 'Create Workout',
    edit: 'Edit Workout',
    delete: 'Delete Workout',
    save: 'Save Workout',
    start: 'Start Workout',
    finish: 'Finish Workout',
    cancel: 'Cancel Workout',
    name: 'Workout Name',
    description: 'Workout Description',
    duration: 'Duration',
    intensity: 'Intensity',
    type: 'Workout Type',
    exercises: 'Exercises',
    sets: 'Sets',
    reps: 'Reps',
    weight: 'Weight',
    rest: 'Rest',
    notes: 'Notes',
    saveOffline: 'Save for Offline',
    savedOffline: 'Saved for Offline',
  },

  // Offline
  offline: {
    status: 'You are offline',
    savedWorkouts: 'Saved Workouts',
    pendingSync: 'Pending Sync',
    syncNow: 'Sync Now',
    syncComplete: 'Sync Complete',
    syncFailed: 'Sync Failed',
    retryQueue: 'Retry Queue',
    retryNow: 'Retry Now',
    clearQueue: 'Clear Queue',
  },

  // Settings
  settings: {
    title: 'Settings',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    notifications: 'Notifications',
    privacy: 'Privacy',
    account: 'Account',
    language: 'Language',
    units: 'Units',
    metric: 'Metric',
    imperial: 'Imperial',
  },

  // Accessibility
  accessibility: {
    settings: 'Accessibility Settings',
    highContrast: 'High Contrast',
    largeText: 'Large Text',
    reduceMotion: 'Reduce Motion',
    screenReader: 'Screen Reader',
    skipToContent: 'Skip to Content',
  },

  // Errors
  errors: {
    general: 'An error occurred',
    network: 'Network error',
    auth: 'Authentication error',
    validation: 'Validation error',
    notFound: 'Not found',
    serverError: 'Server error',
    offline: 'You are offline',
    unknown: 'Unknown error',
  },

  // Success messages
  success: {
    saved: 'Successfully saved',
    deleted: 'Successfully deleted',
    updated: 'Successfully updated',
    created: 'Successfully created',
    uploaded: 'Successfully uploaded',
    downloaded: 'Successfully downloaded',
  },
};

/**
 * Get text from the AppText object
 * @param key - The key to get text for (e.g., 'app.title')
 * @param defaultValue - Optional default value if the key is not found
 * @returns The text for the given key or the default value
 */
export function getText(key: string, defaultValue?: string): string {
  const parts = key.split('.');
  let result: any = AppText;
  
  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = result[part];
    } else {
      return defaultValue || key;
    }
  }
  
  return typeof result === 'string' ? result : defaultValue || key;
}

/**
 * A simple hook to get text
 * This mimics the i18n t() function to make migration easier
 */
export function useText() {
  return {
    t: getText
  };
}
