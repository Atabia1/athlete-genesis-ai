/**
 * Trend Prediction Utilities
 * 
 * This file contains utilities for predicting trends in health data.
 * It uses simple statistical methods to identify trends and make predictions.
 */

/**
 * Data point interface
 */
export interface DataPoint {
  /** Value of the data point */
  value: number;
  /** Timestamp of the data point */
  timestamp: Date;
}

/**
 * Trend direction
 */
export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  FLUCTUATING = 'fluctuating',
}

/**
 * Trend prediction result
 */
export interface TrendPrediction {
  /** Direction of the trend */
  direction: TrendDirection;
  /** Slope of the trend line */
  slope: number;
  /** Confidence level (0-1) */
  confidence: number;
  /** Predicted next value */
  nextValue: number;
  /** Predicted values for future points */
  predictions: number[];
  /** R-squared value (goodness of fit) */
  rSquared: number;
}

/**
 * Calculate the mean of an array of numbers
 * @param values Array of numbers
 * @returns Mean value
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Calculate the standard deviation of an array of numbers
 * @param values Array of numbers
 * @returns Standard deviation
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  
  const mean = calculateMean(values);
  const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
  const variance = calculateMean(squaredDifferences);
  
  return Math.sqrt(variance);
}

/**
 * Perform simple linear regression on data points
 * @param dataPoints Array of data points
 * @returns Regression result with slope, intercept, and r-squared
 */
export function linearRegression(dataPoints: DataPoint[]): {
  slope: number;
  intercept: number;
  rSquared: number;
} {
  if (dataPoints.length <= 1) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }
  
  // Convert timestamps to numerical x values (days since first point)
  const firstTimestamp = dataPoints[0].timestamp.getTime();
  const xValues = dataPoints.map(point => 
    (point.timestamp.getTime() - firstTimestamp) / (1000 * 60 * 60 * 24)
  );
  
  const yValues = dataPoints.map(point => point.value);
  
  const n = dataPoints.length;
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  const sumYY = yValues.reduce((sum, y) => sum + y * y, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared
  const yMean = sumY / n;
  const totalVariation = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const predictedValues = xValues.map(x => slope * x + intercept);
  const residualVariation = yValues.reduce((sum, y, i) => 
    sum + Math.pow(y - predictedValues[i], 2), 0
  );
  const rSquared = 1 - (residualVariation / totalVariation);
  
  return { slope, intercept, rSquared };
}

/**
 * Predict the trend in health data
 * @param dataPoints Array of data points
 * @param daysToPredict Number of days to predict into the future
 * @returns Trend prediction result
 */
export function predictTrend(
  dataPoints: DataPoint[], 
  daysToPredict: number = 7
): TrendPrediction {
  if (dataPoints.length <= 1) {
    return {
      direction: TrendDirection.STABLE,
      slope: 0,
      confidence: 0,
      nextValue: dataPoints.length > 0 ? dataPoints[0].value : 0,
      predictions: Array(daysToPredict).fill(dataPoints.length > 0 ? dataPoints[0].value : 0),
      rSquared: 0,
    };
  }
  
  // Sort data points by timestamp
  const sortedPoints = [...dataPoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  // Perform linear regression
  const { slope, intercept, rSquared } = linearRegression(sortedPoints);
  
  // Calculate confidence based on R-squared and number of data points
  const confidence = Math.min(
    rSquared * (1 - 1 / Math.sqrt(dataPoints.length)),
    0.99
  );
  
  // Determine trend direction
  let direction: TrendDirection;
  if (Math.abs(slope) < 0.01) {
    direction = TrendDirection.STABLE;
  } else if (rSquared < 0.3) {
    direction = TrendDirection.FLUCTUATING;
  } else if (slope > 0) {
    direction = TrendDirection.UP;
  } else {
    direction = TrendDirection.DOWN;
  }
  
  // Calculate predictions
  const lastX = (sortedPoints[sortedPoints.length - 1].timestamp.getTime() - 
    sortedPoints[0].timestamp.getTime()) / (1000 * 60 * 60 * 24);
  
  const predictions = Array.from({ length: daysToPredict }, (_, i) => {
    const x = lastX + (i + 1);
    return slope * x + intercept;
  });
  
  return {
    direction,
    slope,
    confidence,
    nextValue: predictions[0],
    predictions,
    rSquared,
  };
}

/**
 * Detect seasonality in data
 * @param dataPoints Array of data points
 * @param periodLength Expected period length in days
 * @returns Seasonality strength (0-1)
 */
export function detectSeasonality(
  dataPoints: DataPoint[],
  periodLength: number
): number {
  if (dataPoints.length < periodLength * 2) {
    return 0; // Not enough data to detect seasonality
  }
  
  // Sort data points by timestamp
  const sortedPoints = [...dataPoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  // Calculate autocorrelation at the period length
  const values = sortedPoints.map(point => point.value);
  const mean = calculateMean(values);
  const normalizedValues = values.map(value => value - mean);
  
  let autocorrelation = 0;
  let denominator = 0;
  
  for (let i = 0; i < normalizedValues.length - periodLength; i++) {
    autocorrelation += normalizedValues[i] * normalizedValues[i + periodLength];
    denominator += normalizedValues[i] * normalizedValues[i];
  }
  
  if (denominator === 0) return 0;
  
  // Normalize to 0-1 range
  const seasonalityStrength = Math.abs(autocorrelation / denominator);
  return Math.min(seasonalityStrength, 1);
}

/**
 * Generate a forecast that combines trend and seasonality
 * @param dataPoints Array of data points
 * @param daysToPredict Number of days to predict
 * @param periodLength Expected period length in days
 * @returns Predicted values
 */
export function generateForecast(
  dataPoints: DataPoint[],
  daysToPredict: number = 7,
  periodLength: number = 7
): number[] {
  // Get trend prediction
  const { predictions: trendPredictions, confidence } = predictTrend(dataPoints, daysToPredict);
  
  // If we don't have enough data for seasonality, just return trend predictions
  if (dataPoints.length < periodLength * 2) {
    return trendPredictions;
  }
  
  // Sort data points by timestamp
  const sortedPoints = [...dataPoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  // Calculate seasonal factors
  const values = sortedPoints.map(point => point.value);
  const seasonalFactors: number[] = Array(periodLength).fill(0);
  const seasonalCounts: number[] = Array(periodLength).fill(0);
  
  // Calculate average value for each position in the cycle
  for (let i = 0; i < values.length; i++) {
    const position = i % periodLength;
    seasonalFactors[position] += values[i];
    seasonalCounts[position]++;
  }
  
  // Calculate average seasonal factors
  for (let i = 0; i < periodLength; i++) {
    if (seasonalCounts[i] > 0) {
      seasonalFactors[i] /= seasonalCounts[i];
    }
  }
  
  // Normalize seasonal factors
  const avgFactor = calculateMean(seasonalFactors);
  const normalizedFactors = seasonalFactors.map(factor => 
    avgFactor === 0 ? 1 : factor / avgFactor
  );
  
  // Apply seasonal factors to trend predictions
  const lastPosition = (sortedPoints.length - 1) % periodLength;
  
  return trendPredictions.map((prediction, i) => {
    const position = (lastPosition + i + 1) % periodLength;
    return prediction * normalizedFactors[position];
  });
}
