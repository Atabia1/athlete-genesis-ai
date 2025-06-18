
import {
  calculateLinearRegression,
  detectAnomalies,
  analyzeSeasonalPatterns,
  forecastFutureValues,
  calculateMean,
  calculateStandardDeviation,
  TrendPredictionResult,
  SeasonalPattern,
} from '../trend-prediction';

describe('Trend Prediction Utilities', () => {
  describe('calculateMean', () => {
    it('should calculate the mean of an array', () => {
      expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateMean([10, 20, 30])).toBe(20);
      expect(calculateMean([])).toBe(0);
    });
  });

  describe('calculateStandardDeviation', () => {
    it('should calculate standard deviation', () => {
      const result = calculateStandardDeviation([1, 2, 3, 4, 5]);
      expect(result).toBeCloseTo(1.414, 2);
      expect(calculateStandardDeviation([])).toBe(0);
    });
  });

  describe('calculateLinearRegression', () => {
    it('should calculate linear regression for increasing trend', () => {
      const data = [1, 2, 3, 4, 5];
      const result: TrendPredictionResult = calculateLinearRegression(data);
      
      expect(result.trend).toBe('increasing');
      expect(result.slope).toBeGreaterThan(0);
      expect(result.prediction).toBeGreaterThan(5);
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should calculate linear regression for decreasing trend', () => {
      const data = [5, 4, 3, 2, 1];
      const result: TrendPredictionResult = calculateLinearRegression(data);
      
      expect(result.trend).toBe('decreasing');
      expect(result.slope).toBeLessThan(0);
      expect(result.prediction).toBeLessThan(1);
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should handle empty or single data point', () => {
      const result1 = calculateLinearRegression([]);
      expect(result1.trend).toBe('stable');
      expect(result1.confidence).toBe(0);
      
      const result2 = calculateLinearRegression([5]);
      expect(result2.trend).toBe('stable');
      expect(result2.prediction).toBe(5);
    });
  });

  describe('detectAnomalies', () => {
    it('should detect anomalies in data', () => {
      const data = [1, 2, 3, 2, 3, 100, 2, 3, 2]; // 100 is an anomaly
      const anomalies = detectAnomalies(data, 3, 2);
      
      expect(anomalies).toContain(5); // Index of the anomaly
    });

    it('should return empty array for insufficient data', () => {
      const data = [1, 2];
      const anomalies = detectAnomalies(data, 5);
      
      expect(anomalies).toEqual([]);
    });
  });

  describe('analyzeSeasonalPatterns', () => {
    it('should analyze seasonal patterns', () => {
      const data = [1, 2, 3, 1, 2, 3, 1, 2, 3]; // Pattern repeats every 3
      const result: SeasonalPattern = analyzeSeasonalPatterns(data, 3);
      
      expect(result.pattern).toHaveLength(3);
      expect(result.pattern[0]).toBe(1);
      expect(result.pattern[1]).toBe(2);
      expect(result.pattern[2]).toBe(3);
      expect(result.average).toBe(2);
    });

    it('should handle insufficient data', () => {
      const data = [1, 2];
      const result = analyzeSeasonalPatterns(data, 5);
      
      expect(result.pattern).toEqual([]);
      expect(result.average).toBe(0);
    });
  });

  describe('forecastFutureValues', () => {
    it('should forecast future values based on seasonal pattern', () => {
      const data = [1, 2, 3];
      const seasonalPattern: SeasonalPattern = {
        pattern: [1, 2, 3],
        average: 2,
      };
      
      const forecast = forecastFutureValues(data, 3, seasonalPattern);
      
      expect(forecast).toHaveLength(3);
      expect(forecast[0]).toBe(1); // data.length % pattern.length = 0
      expect(forecast[1]).toBe(2);
      expect(forecast[2]).toBe(3);
    });
  });
});
