/**
 * Mobile App Bridge Entry Point
 * 
 * This is the main entry point for the mobile app bridge.
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { initBackgroundFetch } from './services/background-sync-service';
import { initNotifications } from './utils/notification-utils';

/**
 * App Component
 */
const App = () => {
  // Initialize services on mount
  useEffect(() => {
    // Initialize notifications
    initNotifications();
    
    // Initialize background fetch
    initBackgroundFetch().catch(error => {
      console.error('Failed to initialize background fetch:', error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
