
/**
 * Trend Prediction Utilities
 *
 * This module provides functions for analyzing data trends and making predictions
 * based on historical data. It includes linear regression and seasonal pattern
 * analysis techniques.
 */

// Define the result type for trend prediction
export interface TrendPredictionResult {
  trend: 'increasing' | 'decreasing' | 'stable';
  slope: number;
  prediction: number;
  confidence: number;
}

// Define the result type for seasonal pattern analysis
export interface SeasonalPattern {
  pattern: number[];
  average: number;
}

// Define data point interface
export interface DataPoint {
  value: number;
  timestamp: Date;
}

/**
 * Calculate mean of an array of numbers
 */
export function calculateMean(data: number[]): number {
  if (data.length === 0) return 0;
  return data.reduce((sum, val) => sum + val, 0) / data.length;
}

/**
 * Calculate standard deviation of an array of numbers
 */
export function calculateStandardDeviation(data: number[]): number {
  if (data.length === 0) return 0;
  const mean = calculateMean(data);
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
}

/**
 * Calculate linear regression for trend prediction
 */
export function calculateLinearRegression(data: number[]): TrendPredictionResult {
  if (data.length < 2) {
    return {
      trend: 'stable',
      slope: 0,
      prediction: data[0] || 0,
      confidence: 0,
    };
  }

  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = data;

  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const prediction = slope * n + intercept;

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (slope > 0.1) {
    trend = 'increasing';
  } else if (slope < -0.1) {
    trend = 'decreasing';
  }

  // Calculate R-squared to determine the goodness of fit
  const yMean = sumY / n;
  const ssRes = y.reduce((sum, val, i) => sum + Math.pow(val - (slope * x[i] + intercept), 2), 0);
  const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const rSquared = 1 - (ssRes / ssTot);

  // Confidence is based on R-squared
  const confidence = Math.max(0, Math.min(1, rSquared));

  return {
    trend,
    slope,
    prediction,
    confidence,
  };
}

/**
 * Detect anomalies in the data using a simple moving average
 */
export function detectAnomalies(data: number[], windowSize: number = 5, threshold: number = 2): number[] {
  const anomalies: number[] = [];
  if (data.length < windowSize) {
    return anomalies; // Not enough data to compute moving average
  }

  for (let i = windowSize; i < data.length; i++) {
    let windowSum = 0;
    for (let j = i - windowSize; j < i; j++) {
      windowSum += data[j];
    }
    const windowAverage = windowSum / windowSize;
    const stdDev = Math.sqrt(data.slice(i - windowSize, i).reduce((sum, val) => sum + Math.pow(val - windowAverage, 2), 0) / windowSize);

    if (Math.abs(data[i] - windowAverage) > threshold * stdDev) {
      anomalies.push(i);
    }
  }

  return anomalies;
}

/**
 * Analyze seasonal patterns
 */
export function analyzeSeasonalPatterns(
  data: number[],
  period: number = 7
): SeasonalPattern {
  const n = data.length;
  if (n < period) {
    return {
      pattern: [],
      average: 0,
    };
  }

  const pattern: number[] = new Array(period).fill(0);
  const counts: number[] = new Array(period).fill(0);

  for (let i = 0; i < n; i++) {
    const index = i % period;
    pattern[index] += data[i];
    counts[index]++;
  }

  for (let i = 0; i < period; i++) {
    pattern[i] /= counts[i];
  }

  const average = pattern.reduce((sum, val) => sum + val, 0) / period;

  return {
    pattern,
    average,
  };
}

/**
 * Forecast future values based on historical data and seasonal patterns
 */
export function forecastFutureValues(
  data: number[],
  periods: number,
  seasonalPattern: SeasonalPattern
): number[] {
  const forecast: number[] = [];
  const n = data.length;

  for (let i = 0; i < periods; i++) {
    const seasonalIndex = (n + i) % seasonalPattern.pattern.length;
    const seasonalValue = seasonalPattern.pattern[seasonalIndex];
    forecast.push(seasonalValue);
  }

  return forecast;
}
