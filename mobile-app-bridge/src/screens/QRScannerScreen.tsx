/**
 * QR Scanner Screen
 * 
 * This screen allows users to scan a QR code to connect to the web application.
 * It uses the device's camera to scan QR codes and verifies the connection code.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, CameraType, BarCodeScanningResult } from 'expo-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { verifyConnectionCode } from '../api/sync-service';
import Button from '../components/Button';

type QRScannerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QRScanner'>;

/**
 * QR Scanner Screen Component
 */
const QRScannerScreen = () => {
  const navigation = useNavigation<QRScannerScreenNavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Request camera permission
  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'We need camera permission to scan QR codes. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    };
    
    getCameraPermission();
  }, []);

  // Handle QR code scan
  const handleBarCodeScanned = async ({ type, data }: BarCodeScanningResult) => {
    try {
      setScanned(true);
      setIsVerifying(true);
      
      // Check if the QR code is a valid connection code
      if (!data.startsWith('athletegenesis://connect?code=')) {
        Alert.alert('Invalid QR Code', 'Please scan a valid Athlete Genesis QR code.');
        setScanned(false);
        setIsVerifying(false);
        return;
      }
      
      // Extract the connection code
      const code = data.split('athletegenesis://connect?code=')[1];
      
      // Verify the connection code
      const success = await verifyConnectionCode(code);
      
      if (success) {
        Alert.alert(
          'Connection Successful',
          'Your device is now connected to Athlete Genesis.',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          'Failed to connect to Athlete Genesis. Please try again.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      console.error('Error verifying connection code:', error);
      Alert.alert(
        'Connection Error',
        'An error occurred while connecting to Athlete Genesis. Please try again.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle back button press
  const handleBack = () => {
    navigation.goBack();
  };

  // Render camera permission status
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render no camera permission message
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noPermissionContainer}>
          <Icon name="camera-off" size={64} color="#ccc" />
          <Text style={styles.noPermissionText}>
            We need camera permission to scan QR codes.
          </Text>
          <Button
            title="Open Settings"
            onPress={() => Linking.openSettings()}
            style={styles.settingsButton}
          />
          <Button
            title="Go Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={CameraType.back}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
          </View>
        </Camera>
      </View>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Connect</Text>
        <Text style={styles.instructionsText}>
          1. Open the Athlete Genesis web app on your computer
        </Text>
        <Text style={styles.instructionsText}>
          2. Go to Settings > Health Apps
        </Text>
        <Text style={styles.instructionsText}>
          3. Click "Connect New Device" and scan the QR code
        </Text>
      </View>
      
      {isVerifying && (
        <View style={styles.verifyingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.verifyingText}>Connecting to Athlete Genesis...</Text>
        </View>
      )}
      
      {scanned && !isVerifying && (
        <Button
          title="Scan Again"
          onPress={() => setScanned(false)}
          style={styles.scanAgainButton}
        />
      )}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  instructionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noPermissionText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    color: '#666',
    fontSize: 16,
  },
  settingsButton: {
    marginBottom: 16,
  },
  scanAgainButton: {
    margin: 16,
  },
  verifyingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  verifyingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
});

export default QRScannerScreen;
