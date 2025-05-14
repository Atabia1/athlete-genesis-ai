/**
 * Notification Utilities
 * 
 * This file contains utility functions for showing notifications.
 */

import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

// Initialize push notification
export const initNotifications = () => {
  // Configure push notification
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // Process the notification
      if (Platform.OS === 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },

    // Should the initial notification be popped automatically
    popInitialNotification: true,

    // Request permissions on iOS
    requestPermissions: true,
  });

  // Create notification channel for Android
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'health-sync-channel',
        channelName: 'Health Sync Notifications',
        channelDescription: 'Notifications for health data synchronization',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }
};

/**
 * Show a local notification
 * @param title The notification title
 * @param message The notification message
 */
export const showNotification = (title: string, message: string) => {
  PushNotification.localNotification({
    channelId: 'health-sync-channel',
    title,
    message,
    playSound: true,
    soundName: 'default',
    importance: 'high',
    vibrate: true,
  });
};

/**
 * Schedule a local notification
 * @param title The notification title
 * @param message The notification message
 * @param date The date to show the notification
 */
export const scheduleNotification = (title: string, message: string, date: Date) => {
  PushNotification.localNotificationSchedule({
    channelId: 'health-sync-channel',
    title,
    message,
    date,
    playSound: true,
    soundName: 'default',
    importance: 'high',
    vibrate: true,
  });
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    PushNotification.requestPermissions((permissions) => {
      if (Platform.OS === 'ios') {
        resolve(permissions.alert === true);
      } else {
        resolve(true); // Android permissions are requested at app install time
      }
    });
  });
};
