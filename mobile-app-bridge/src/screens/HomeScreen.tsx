/**
 * Home Screen
 * 
 * This is the main screen of the mobile app bridge.
 * It displays the connection status and health data sync status.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { getConnectionStatus, syncHealthData } from '../api/sync-service';
import { isHealthAppAvailable, fetchHealthData } from '../health';
import { formatDate, formatTime } from '../utils/date-utils';
import { HealthData } from '../types/health';
import HealthDataCard from '../components/HealthDataCard';
import ConnectionStatusCard from '../components/ConnectionStatusCard';
import Button from '../components/Button';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * Home Screen Component
 */
const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isConnected, setIsConnected] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isHealthAppSupported, setIsHealthAppSupported] = useState(false);

  // Check if health app is available
  useEffect(() => {
    const checkHealthApp = async () => {
      try {
        const isAvailable = await isHealthAppAvailable();
        setIsHealthAppSupported(isAvailable);
        
        if (!isAvailable) {
          Alert.alert(
            'Health App Not Available',
            `${Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect'} is not available on this device.`
          );
        }
      } catch (error) {
        console.error('Error checking health app availability:', error);
      }
    };
    
    checkHealthApp();
  }, []);

  // Check connection status
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        setIsLoading(true);
        const status = await getConnectionStatus();
        setIsConnected(status.isConnected);
        
        if (status.isConnected) {
          // Fetch health data
          await syncHealthDataFromHealthApp();
        }
      } catch (error) {
        console.error('Error checking connection status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnectionStatus();
  }, []);

  // Sync health data from health app
  const syncHealthDataFromHealthApp = async () => {
    try {
      setIsSyncing(true);
      
      // Get the date range for the health data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Get data for the last 7 days
      
      // Fetch health data from the health app
      const data = await fetchHealthData(startDate, endDate);
      setHealthData(data);
      
      // Sync health data with the web app
      await syncHealthData(true);
      
      // Update last sync time
      setLastSync(new Date());
      
      Alert.alert('Success', 'Health data synced successfully');
    } catch (error) {
      console.error('Error syncing health data:', error);
      Alert.alert('Error', 'Failed to sync health data');
    } finally {
      setIsSyncing(false);
    }
  };

  // Navigate to QR scanner
  const navigateToQRScanner = () => {
    navigation.navigate('QRScanner');
  };

  // Navigate to settings
  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Athlete Genesis</Text>
        <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
          <Icon name="cog" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isSyncing}
            onRefresh={syncHealthDataFromHealthApp}
          />
        }
      >
        <ConnectionStatusCard
          isConnected={isConnected}
          lastSync={lastSync}
          onConnect={navigateToQRScanner}
        />
        
        {isConnected && healthData ? (
          <HealthDataCard healthData={healthData} />
        ) : (
          <View style={styles.notConnectedContainer}>
            <Icon name="connection" size={64} color="#ccc" />
            <Text style={styles.notConnectedText}>
              {isConnected
                ? 'No health data available. Pull down to sync.'
                : 'Connect to Athlete Genesis to sync your health data.'}
            </Text>
            {!isConnected && (
              <Button
                title="Connect Now"
                onPress={navigateToQRScanner}
                style={styles.connectButton}
              />
            )}
          </View>
        )}
        
        {isConnected && (
          <Button
            title="Sync Health Data"
            onPress={syncHealthDataFromHealthApp}
            loading={isSyncing}
            disabled={isSyncing || !isHealthAppSupported}
            style={styles.syncButton}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  notConnectedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notConnectedText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    color: '#666',
    fontSize: 16,
  },
  connectButton: {
    width: '100%',
  },
  syncButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
