/**
 * App Navigator
 * 
 * This component defines the navigation structure of the app.
 * It uses React Navigation to create a stack navigator for the app.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HealthDataDetailsScreen from '../screens/HealthDataDetailsScreen';
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen';

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * App Navigator Component
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="HealthDataDetails" component={HealthDataDetailsScreen} />
        <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
