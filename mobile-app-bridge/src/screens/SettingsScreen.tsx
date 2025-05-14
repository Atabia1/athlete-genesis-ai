/**
 * Settings Screen
 * 
 * This screen allows users to configure the mobile app bridge settings.
 * It provides options for sync frequency, notifications, and app information.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import { RootStackParamList } from '../navigation/types';
import { disconnectDevice } from '../api/sync-service';

// Storage keys
const AUTO_SYNC_ENABLED_KEY = 'auto_sync_enabled';
const SYNC_FREQUENCY_KEY = 'sync_frequency';
const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';

// Sync frequency options (in minutes)
const syncFrequencyOptions = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '3 hours', value: 180 },
  { label: '6 hours', value: 360 },
  { label: '12 hours', value: 720 },
  { label: '24 hours', value: 1440 },
];

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

/**
 * Settings Screen Component
 */
const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState(60); // Default: 1 hour
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSyncOptions, setShowSyncOptions] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    setAppVersion(DeviceInfo.getVersion());
  }, []);

  // Load settings from storage
  const loadSettings = async () => {
    try {
      // Load auto sync setting
      const autoSyncEnabledStr = await AsyncStorage.getItem(AUTO_SYNC_ENABLED_KEY);
      if (autoSyncEnabledStr !== null) {
        setAutoSyncEnabled(autoSyncEnabledStr === 'true');
      }
      
      // Load sync frequency
      const syncFrequencyStr = await AsyncStorage.getItem(SYNC_FREQUENCY_KEY);
      if (syncFrequencyStr !== null) {
        setSyncFrequency(parseInt(syncFrequencyStr, 10));
      }
      
      // Load notifications setting
      const notificationsEnabledStr = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
      if (notificationsEnabledStr !== null) {
        setNotificationsEnabled(notificationsEnabledStr === 'true');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Save auto sync setting
  const saveAutoSyncSetting = async (value: boolean) => {
    try {
      setAutoSyncEnabled(value);
      await AsyncStorage.setItem(AUTO_SYNC_ENABLED_KEY, value.toString());
    } catch (error) {
      console.error('Error saving auto sync setting:', error);
    }
  };

  // Save sync frequency
  const saveSyncFrequency = async (value: number) => {
    try {
      setSyncFrequency(value);
      await AsyncStorage.setItem(SYNC_FREQUENCY_KEY, value.toString());
      setShowSyncOptions(false);
    } catch (error) {
      console.error('Error saving sync frequency:', error);
    }
  };

  // Save notifications setting
  const saveNotificationsSetting = async (value: boolean) => {
    try {
      setNotificationsEnabled(value);
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, value.toString());
    } catch (error) {
      console.error('Error saving notifications setting:', error);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to disconnect from Athlete Genesis? This will remove all synced data from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnectDevice();
              Alert.alert(
                'Disconnected',
                'Your device has been disconnected from Athlete Genesis.',
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
              );
            } catch (error) {
              console.error('Error disconnecting device:', error);
              Alert.alert('Error', 'Failed to disconnect device. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Get sync frequency label
  const getSyncFrequencyLabel = () => {
    const option = syncFrequencyOptions.find(option => option.value === syncFrequency);
    return option ? option.label : '1 hour';
  };

  // Open privacy policy
  const openPrivacyPolicy = () => {
    Linking.openURL('https://athletegenesis.ai/privacy');
  };

  // Open terms of service
  const openTermsOfService = () => {
    Linking.openURL('https://athletegenesis.ai/terms');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Sync Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Auto Sync</Text>
            <Text style={styles.settingDescription}>
              Automatically sync health data in the background
            </Text>
          </View>
          <Switch
            value={autoSyncEnabled}
            onValueChange={saveAutoSyncSetting}
            trackColor={{ false: '#D1D1D6', true: '#3F51B5' }}
            thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : autoSyncEnabled ? '#3F51B5' : '#F4F3F4'}
          />
        </View>
        
        {autoSyncEnabled && (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowSyncOptions(!showSyncOptions)}
          >
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Sync Frequency</Text>
              <Text style={styles.settingDescription}>
                How often to sync health data
              </Text>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{getSyncFrequencyLabel()}</Text>
              <Icon
                name={showSyncOptions ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#757575"
              />
            </View>
          </TouchableOpacity>
        )}
        
        {autoSyncEnabled && showSyncOptions && (
          <View style={styles.syncOptionsContainer}>
            {syncFrequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.syncOption,
                  syncFrequency === option.value && styles.syncOptionSelected,
                ]}
                onPress={() => saveSyncFrequency(option.value)}
              >
                <Text
                  style={[
                    styles.syncOptionText,
                    syncFrequency === option.value && styles.syncOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {syncFrequency === option.value && (
                  <Icon name="check" size={18} color="#3F51B5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive notifications about sync status
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={saveNotificationsSetting}
            trackColor={{ false: '#D1D1D6', true: '#3F51B5' }}
            thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : notificationsEnabled ? '#3F51B5' : '#F4F3F4'}
          />
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleDisconnect}
        >
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingLabel, styles.disconnectText]}>
              Disconnect from Athlete Genesis
            </Text>
          </View>
          <Icon name="logout" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Version</Text>
          </View>
          <Text style={styles.settingValue}>{appVersion}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.settingItem}
          onPress={openPrivacyPolicy}
        >
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#757575" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.settingItem}
          onPress={openTermsOfService}
        >
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#757575" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
    marginHorizontal: 16,
    marginVertical: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#757575',
    marginRight: 8,
  },
  syncOptionsContainer: {
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  syncOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  syncOptionSelected: {
    backgroundColor: '#F0F4FF',
  },
  syncOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  syncOptionTextSelected: {
    color: '#3F51B5',
    fontWeight: 'bold',
  },
  disconnectText: {
    color: '#F44336',
  },
});

export default SettingsScreen;
