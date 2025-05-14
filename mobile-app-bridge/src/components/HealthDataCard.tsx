/**
 * Health Data Card Component
 * 
 * This component displays health data in a card format.
 * It shows key metrics like steps, heart rate, sleep, and more.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HealthData } from '../types/health';
import { formatDate } from '../utils/date-utils';

interface HealthDataCardProps {
  healthData: HealthData;
  onPress?: () => void;
}

/**
 * Health Data Card Component
 */
const HealthDataCard = ({ healthData, onPress }: HealthDataCardProps) => {
  // Format steps with commas
  const formatSteps = (steps?: number) => {
    if (!steps) return 'N/A';
    return steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Format distance in kilometers
  const formatDistance = (distance?: number) => {
    if (!distance) return 'N/A';
    return `${(distance / 1000).toFixed(2)} km`;
  };

  // Format sleep duration in hours and minutes
  const formatSleepDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    }
    
    return `${hours}h ${mins}m`;
  };

  // Get sleep quality color
  const getSleepQualityColor = (quality?: 'poor' | 'fair' | 'good' | 'excellent') => {
    switch (quality) {
      case 'excellent': return '#4caf50';
      case 'good': return '#8bc34a';
      case 'fair': return '#ffc107';
      case 'poor': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Health Data</Text>
        <Text style={styles.subtitle}>
          Last updated: {formatDate(healthData.lastSyncDate)}
        </Text>
      </View>
      
      <View style={styles.metricsContainer}>
        {/* Steps */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconContainer}>
            <Icon name="shoe-print" size={24} color="#4285f4" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Steps</Text>
            <Text style={styles.metricValue}>{formatSteps(healthData.steps)}</Text>
          </View>
        </View>
        
        {/* Distance */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconContainer}>
            <Icon name="map-marker-distance" size={24} color="#ea4335" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Distance</Text>
            <Text style={styles.metricValue}>{formatDistance(healthData.distance)}</Text>
          </View>
        </View>
        
        {/* Heart Rate */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconContainer}>
            <Icon name="heart-pulse" size={24} color="#fbbc05" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Heart Rate</Text>
            <Text style={styles.metricValue}>
              {healthData.heartRate?.resting 
                ? `${healthData.heartRate.resting} bpm`
                : 'N/A'
              }
            </Text>
          </View>
        </View>
        
        {/* Sleep */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconContainer}>
            <Icon name="sleep" size={24} color="#34a853" />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Sleep</Text>
            <View style={styles.sleepContainer}>
              <Text style={styles.metricValue}>
                {formatSleepDuration(healthData.sleep?.duration)}
              </Text>
              {healthData.sleep?.quality && (
                <View
                  style={[
                    styles.qualityBadge,
                    { backgroundColor: getSleepQualityColor(healthData.sleep.quality) },
                  ]}
                >
                  <Text style={styles.qualityText}>
                    {healthData.sleep.quality.charAt(0).toUpperCase() + 
                     healthData.sleep.quality.slice(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      
      {/* Additional metrics */}
      <View style={styles.additionalMetrics}>
        {/* Weight */}
        {healthData.weight && (
          <View style={styles.additionalMetricItem}>
            <Text style={styles.additionalMetricLabel}>Weight</Text>
            <Text style={styles.additionalMetricValue}>
              {healthData.weight.toFixed(1)} kg
            </Text>
          </View>
        )}
        
        {/* Height */}
        {healthData.height && (
          <View style={styles.additionalMetricItem}>
            <Text style={styles.additionalMetricLabel}>Height</Text>
            <Text style={styles.additionalMetricValue}>
              {healthData.height} cm
            </Text>
          </View>
        )}
        
        {/* Blood Pressure */}
        {healthData.bloodPressure?.systolic && healthData.bloodPressure?.diastolic && (
          <View style={styles.additionalMetricItem}>
            <Text style={styles.additionalMetricLabel}>Blood Pressure</Text>
            <Text style={styles.additionalMetricValue}>
              {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  metricsContainer: {
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sleepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  qualityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  additionalMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  additionalMetricItem: {
    width: '33.33%',
    marginBottom: 8,
  },
  additionalMetricLabel: {
    fontSize: 12,
    color: '#666',
  },
  additionalMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HealthDataCard;
