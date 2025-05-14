/**
 * Anomaly Detection Utilities
 * 
 * This file contains utilities for detecting anomalies in health data.
 * It uses statistical methods to identify unusual patterns or values.
 */

import { DataPoint, calculateMean, calculateStandardDeviation } from './trend-prediction';

/**
 * Anomaly severity levels
 */
export enum AnomalySeverity {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Anomaly types
 */
export enum AnomalyType {
  SPIKE = 'spike',
  DROP = 'drop',
  TREND_CHANGE = 'trend_change',
  PATTERN_BREAK = 'pattern_break',
  MISSING_DATA = 'missing_data',
}

/**
 * Detected anomaly interface
 */
export interface Anomaly {
  /** Type of anomaly */
  type: AnomalyType;
  /** Severity of the anomaly */
  severity: AnomalySeverity;
  /** Index of the anomaly in the data points array */
  index: number;
  /** Value at the anomaly point */
  value: number;
  /** Expected value based on the model */
  expectedValue: number;
  /** Deviation from expected value */
  deviation: number;
  /** Timestamp of the anomaly */
  timestamp: Date;
  /** Description of the anomaly */
  description: string;
}

/**
 * Detect anomalies using Z-score method
 * @param dataPoints Array of data points
 * @param threshold Z-score threshold for anomaly detection (default: 2.5)
 * @returns Array of detected anomalies
 */
export function detectAnomaliesZScore(
  dataPoints: DataPoint[],
  threshold: number = 2.5
): Anomaly[] {
  if (dataPoints.length < 3) {
    return []; // Not enough data for anomaly detection
  }
  
  const values = dataPoints.map(point => point.value);
  const mean = calculateMean(values);
  const stdDev = calculateStandardDeviation(values);
  
  if (stdDev === 0) {
    return []; // No variation in the data
  }
  
  const anomalies: Anomaly[] = [];
  
  for (let i = 0; i < dataPoints.length; i++) {
    const zScore = Math.abs((dataPoints[i].value - mean) / stdDev);
    
    if (zScore > threshold) {
      // Determine anomaly type and severity
      const isSpike = dataPoints[i].value > mean;
      const type = isSpike ? AnomalyType.SPIKE : AnomalyType.DROP;
      
      let severity: AnomalySeverity;
      if (zScore > threshold * 2) {
        severity = AnomalySeverity.HIGH;
      } else if (zScore > threshold * 1.5) {
        severity = AnomalySeverity.MEDIUM;
      } else {
        severity = AnomalySeverity.LOW;
      }
      
      anomalies.push({
        type,
        severity,
        index: i,
        value: dataPoints[i].value,
        expectedValue: mean,
        deviation: dataPoints[i].value - mean,
        timestamp: dataPoints[i].timestamp,
        description: isSpike
          ? `Unusually high value detected (${dataPoints[i].value.toFixed(2)})`
          : `Unusually low value detected (${dataPoints[i].value.toFixed(2)})`,
      });
    }
  }
  
  return anomalies;
}

/**
 * Detect anomalies using moving average method
 * @param dataPoints Array of data points
 * @param windowSize Size of the moving window (default: 5)
 * @param threshold Threshold for anomaly detection (default: 2.0)
 * @returns Array of detected anomalies
 */
export function detectAnomaliesMovingAverage(
  dataPoints: DataPoint[],
  windowSize: number = 5,
  threshold: number = 2.0
): Anomaly[] {
  if (dataPoints.length < windowSize + 1) {
    return []; // Not enough data for anomaly detection
  }
  
  // Sort data points by timestamp
  const sortedPoints = [...dataPoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  const anomalies: Anomaly[] = [];
  
  for (let i = windowSize; i < sortedPoints.length; i++) {
    // Calculate moving average and standard deviation
    const windowValues = sortedPoints
      .slice(i - windowSize, i)
      .map(point => point.value);
    
    const movingAvg = calculateMean(windowValues);
    const movingStdDev = calculateStandardDeviation(windowValues);
    
    if (movingStdDev === 0) continue; // Skip if no variation in the window
    
    // Calculate z-score for the current point
    const zScore = Math.abs((sortedPoints[i].value - movingAvg) / movingStdDev);
    
    if (zScore > threshold) {
      // Determine anomaly type and severity
      const isSpike = sortedPoints[i].value > movingAvg;
      const type = isSpike ? AnomalyType.SPIKE : AnomalyType.DROP;
      
      let severity: AnomalySeverity;
      if (zScore > threshold * 2) {
        severity = AnomalySeverity.HIGH;
      } else if (zScore > threshold * 1.5) {
        severity = AnomalySeverity.MEDIUM;
      } else {
        severity = AnomalySeverity.LOW;
      }
      
      anomalies.push({
        type,
        severity,
        index: dataPoints.indexOf(sortedPoints[i]), // Get original index
        value: sortedPoints[i].value,
        expectedValue: movingAvg,
        deviation: sortedPoints[i].value - movingAvg,
        timestamp: sortedPoints[i].timestamp,
        description: isSpike
          ? `Sudden increase detected (${sortedPoints[i].value.toFixed(2)} vs. avg ${movingAvg.toFixed(2)})`
          : `Sudden decrease detected (${sortedPoints[i].value.toFixed(2)} vs. avg ${movingAvg.toFixed(2)})`,
      });
    }
  }
  
  return anomalies;
}

/**
 * Detect trend changes in the data
 * @param dataPoints Array of data points
 * @param windowSize Size of the moving window (default: 7)
 * @param thresholdAngle Threshold angle in degrees for trend change detection (default: 30)
 * @returns Array of detected trend change anomalies
 */
export function detectTrendChanges(
  dataPoints: DataPoint[],
  windowSize: number = 7,
  thresholdAngle: number = 30
): Anomaly[] {
  if (dataPoints.length < windowSize * 2) {
    return []; // Not enough data for trend change detection
  }
  
  // Sort data points by timestamp
  const sortedPoints = [...dataPoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  const anomalies: Anomaly[] = [];
  
  for (let i = windowSize; i < sortedPoints.length - windowSize; i++) {
    // Calculate slope for the previous window
    const prevWindow = sortedPoints.slice(i - windowSize, i);
    const prevSlope = calculateSlope(prevWindow);
    
    // Calculate slope for the next window
    const nextWindow = sortedPoints.slice(i, i + windowSize);
    const nextSlope = calculateSlope(nextWindow);
    
    // Calculate angle between slopes in degrees
    const angle = Math.abs(Math.atan2(nextSlope - prevSlope, 1 + prevSlope * nextSlope) * (180 / Math.PI));
    
    if (angle > thresholdAngle) {
      // Determine severity based on angle
      let severity: AnomalySeverity;
      if (angle > thresholdAngle * 2) {
        severity = AnomalySeverity.HIGH;
      } else if (angle > thresholdAngle * 1.5) {
        severity = AnomalySeverity.MEDIUM;
      } else {
        severity = AnomalySeverity.LOW;
      }
      
      // Calculate expected value based on previous trend
      const expectedValue = prevWindow[prevWindow.length - 1].value + 
        prevSlope * (sortedPoints[i].timestamp.getTime() - prevWindow[prevWindow.length - 1].timestamp.getTime()) / (24 * 60 * 60 * 1000);
      
      anomalies.push({
        type: AnomalyType.TREND_CHANGE,
        severity,
        index: dataPoints.indexOf(sortedPoints[i]), // Get original index
        value: sortedPoints[i].value,
        expectedValue,
        deviation: sortedPoints[i].value - expectedValue,
        timestamp: sortedPoints[i].timestamp,
        description: `Significant trend change detected (${angle.toFixed(1)}° shift)`,
      });
    }
  }
  
  return anomalies;
}

/**
 * Calculate the slope of a line fitted to data points
 * @param dataPoints Array of data points
 * @returns Slope of the fitted line
 */
function calculateSlope(dataPoints: DataPoint[]): number {
  if (dataPoints.length < 2) return 0;
  
  // Convert timestamps to days
  const xValues = dataPoints.map(point => point.timestamp.getTime() / (24 * 60 * 60 * 1000));
  const yValues = dataPoints.map(point => point.value);
  
  const n = dataPoints.length;
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  
  // Calculate slope using least squares method
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
}

/**
 * Detect missing data points
 * @param dataPoints Array of data points
 * @param expectedInterval Expected interval between data points in milliseconds
 * @param thresholdMultiplier Multiplier for the expected interval to consider data missing
 * @returns Array of detected missing data anomalies
 */
export function detectMissingData(
  dataPoints: DataPoint[],
  expectedInterval: number,
  thresholdMultiplier: number = 2
): Anomaly[] {
  if (dataPoints.length < 2) {
    return []; // Not enough data for missing data detection
  }
  
  // Sort data points by timestamp
  const sortedPoints = [...dataPoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  const anomalies: Anomaly[] = [];
  
  for (let i = 1; i < sortedPoints.length; i++) {
    const interval = sortedPoints[i].timestamp.getTime() - sortedPoints[i - 1].timestamp.getTime();
    
    if (interval > expectedInterval * thresholdMultiplier) {
      // Calculate the number of missing points
      const missingCount = Math.floor(interval / expectedInterval) - 1;
      
      // Determine severity based on the number of missing points
      let severity: AnomalySeverity;
      if (missingCount > 5) {
        severity = AnomalySeverity.HIGH;
      } else if (missingCount > 2) {
        severity = AnomalySeverity.MEDIUM;
      } else {
        severity = AnomalySeverity.LOW;
      }
      
      // Calculate expected value (linear interpolation)
      const expectedValue = sortedPoints[i - 1].value + 
        (sortedPoints[i].value - sortedPoints[i - 1].value) * 0.5;
      
      anomalies.push({
        type: AnomalyType.MISSING_DATA,
        severity,
        index: dataPoints.indexOf(sortedPoints[i - 1]) + 1, // After the previous point
        value: NaN, // No actual value
        expectedValue,
        deviation: NaN,
        timestamp: new Date(sortedPoints[i - 1].timestamp.getTime() + interval / 2), // Midpoint
        description: `Missing data detected (${missingCount} point${missingCount > 1 ? 's' : ''} over ${(interval / (60 * 60 * 1000)).toFixed(1)} hours)`,
      });
    }
  }
  
  return anomalies;
}

/**
 * Detect all types of anomalies in the data
 * @param dataPoints Array of data points
 * @param options Detection options
 * @returns Array of all detected anomalies
 */
export function detectAllAnomalies(
  dataPoints: DataPoint[],
  options: {
    zScoreThreshold?: number;
    movingAverageWindowSize?: number;
    movingAverageThreshold?: number;
    trendChangeWindowSize?: number;
    trendChangeThresholdAngle?: number;
    expectedInterval?: number;
    missingDataThresholdMultiplier?: number;
  } = {}
): Anomaly[] {
  // Set default options
  const {
    zScoreThreshold = 2.5,
    movingAverageWindowSize = 5,
    movingAverageThreshold = 2.0,
    trendChangeWindowSize = 7,
    trendChangeThresholdAngle = 30,
    expectedInterval = 24 * 60 * 60 * 1000, // 1 day in milliseconds
    missingDataThresholdMultiplier = 2,
  } = options;
  
  // Detect anomalies using different methods
  const zScoreAnomalies = detectAnomaliesZScore(dataPoints, zScoreThreshold);
  const movingAvgAnomalies = detectAnomaliesMovingAverage(
    dataPoints, 
    movingAverageWindowSize, 
    movingAverageThreshold
  );
  const trendChangeAnomalies = detectTrendChanges(
    dataPoints, 
    trendChangeWindowSize, 
    trendChangeThresholdAngle
  );
  const missingDataAnomalies = detectMissingData(
    dataPoints, 
    expectedInterval, 
    missingDataThresholdMultiplier
  );
  
  // Combine all anomalies
  return [
    ...zScoreAnomalies,
    ...movingAvgAnomalies,
    ...trendChangeAnomalies,
    ...missingDataAnomalies,
  ];
}
