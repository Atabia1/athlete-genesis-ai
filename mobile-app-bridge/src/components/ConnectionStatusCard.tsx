/**
 * Connection Status Card Component
 * 
 * This component displays the connection status between the mobile app and the web app.
 * It shows whether the app is connected, the last sync time, and provides a button to connect.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate, formatTime } from '../utils/date-utils';
import Button from './Button';

interface ConnectionStatusCardProps {
  isConnected: boolean;
  lastSync: Date | null;
  onConnect: () => void;
}

/**
 * Connection Status Card Component
 */
const ConnectionStatusCard = ({
  isConnected,
  lastSync,
  onConnect,
}: ConnectionStatusCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connection Status</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isConnected ? '#4caf50' : '#f44336' },
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </Text>
        </View>
        
        {isConnected ? (
          <View style={styles.connectedContent}>
            <View style={styles.infoRow}>
              <Icon name="sync" size={16} color="#666" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Last Sync: {lastSync ? `${formatDate(lastSync)} at ${formatTime(lastSync)}` : 'Never'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="information-outline" size={16} color="#666" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Your health data is being synced with Athlete Genesis.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.notConnectedContent}>
            <Text style={styles.notConnectedText}>
              Connect to Athlete Genesis to sync your health data.
            </Text>
            <Button
              title="Connect"
              onPress={onConnect}
              style={styles.connectButton}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  connectedContent: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  notConnectedContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  notConnectedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  connectButton: {
    width: '100%',
  },
});

export default ConnectionStatusCard;
