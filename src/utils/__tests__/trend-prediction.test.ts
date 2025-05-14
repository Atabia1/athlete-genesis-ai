/**
 * Tests for trend prediction utilities
 */

import { 
  calculateMean, 
  calculateStandardDeviation, 
  linearRegression, 
  predictTrend, 
  detectSeasonality, 
  generateForecast,
  DataPoint,
  TrendDirection
} from '../trend-prediction';

describe('Trend Prediction Utilities', () => {
  describe('calculateMean', () => {
    it('should calculate the mean of an array of numbers', () => {
      expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateMean([10, 20, 30, 40, 50])).toBe(30);
    });

    it('should return 0 for an empty array', () => {
      expect(calculateMean([])).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(calculateMean([-5, -3, -1, 1, 3, 5])).toBe(0);
    });
  });

  describe('calculateStandardDeviation', () => {
    it('should calculate the standard deviation of an array of numbers', () => {
      expect(calculateStandardDeviation([1, 2, 3, 4, 5])).toBeCloseTo(1.414, 3);
      expect(calculateStandardDeviation([10, 10, 10, 10, 10])).toBe(0);
    });

    it('should return 0 for an array with one or zero elements', () => {
      expect(calculateStandardDeviation([])).toBe(0);
      expect(calculateStandardDeviation([5])).toBe(0);
    });
  });

  describe('linearRegression', () => {
    it('should calculate the slope and intercept of a linear regression', () => {
      const dataPoints: DataPoint[] = [
        { value: 1, timestamp: new Date('2023-01-01') },
        { value: 2, timestamp: new Date('2023-01-02') },
        { value: 3, timestamp: new Date('2023-01-03') },
        { value: 4, timestamp: new Date('2023-01-04') },
        { value: 5, timestamp: new Date('2023-01-05') }
      ];

      const result = linearRegression(dataPoints);
      expect(result.slope).toBeCloseTo(1, 1);
      expect(result.intercept).toBeCloseTo(1, 1);
      expect(result.rSquared).toBeCloseTo(1, 1);
    });

    it('should handle data points with no trend', () => {
      const dataPoints: DataPoint[] = [
        { value: 5, timestamp: new Date('2023-01-01') },
        { value: 5, timestamp: new Date('2023-01-02') },
        { value: 5, timestamp: new Date('2023-01-03') },
        { value: 5, timestamp: new Date('2023-01-04') },
        { value: 5, timestamp: new Date('2023-01-05') }
      ];

      const result = linearRegression(dataPoints);
      expect(result.slope).toBeCloseTo(0, 5);
      expect(result.intercept).toBeCloseTo(5, 5);
    });

    it('should return default values for insufficient data points', () => {
      const dataPoints: DataPoint[] = [
        { value: 5, timestamp: new Date('2023-01-01') }
      ];

      const result = linearRegression(dataPoints);
      expect(result.slope).toBe(0);
      expect(result.intercept).toBe(0);
      expect(result.rSquared).toBe(0);
    });
  });

  describe('predictTrend', () => {
    it('should predict an upward trend', () => {
      const dataPoints: DataPoint[] = [
        { value: 1, timestamp: new Date('2023-01-01') },
        { value: 2, timestamp: new Date('2023-01-02') },
        { value: 3, timestamp: new Date('2023-01-03') },
        { value: 4, timestamp: new Date('2023-01-04') },
        { value: 5, timestamp: new Date('2023-01-05') }
      ];

      const result = predictTrend(dataPoints);
      expect(result.direction).toBe(TrendDirection.UP);
      expect(result.slope).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.nextValue).toBeGreaterThan(5);
    });

    it('should predict a downward trend', () => {
      const dataPoints: DataPoint[] = [
        { value: 5, timestamp: new Date('2023-01-01') },
        { value: 4, timestamp: new Date('2023-01-02') },
        { value: 3, timestamp: new Date('2023-01-03') },
        { value: 2, timestamp: new Date('2023-01-04') },
        { value: 1, timestamp: new Date('2023-01-05') }
      ];

      const result = predictTrend(dataPoints);
      expect(result.direction).toBe(TrendDirection.DOWN);
      expect(result.slope).toBeLessThan(0);
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.nextValue).toBeLessThan(1);
    });

    it('should predict a stable trend', () => {
      const dataPoints: DataPoint[] = [
        { value: 5.1, timestamp: new Date('2023-01-01') },
        { value: 5.0, timestamp: new Date('2023-01-02') },
        { value: 5.2, timestamp: new Date('2023-01-03') },
        { value: 4.9, timestamp: new Date('2023-01-04') },
        { value: 5.1, timestamp: new Date('2023-01-05') }
      ];

      const result = predictTrend(dataPoints);
      expect(result.direction).toBe(TrendDirection.STABLE);
      expect(Math.abs(result.slope)).toBeLessThan(0.1);
    });

    it('should handle insufficient data points', () => {
      const dataPoints: DataPoint[] = [
        { value: 5, timestamp: new Date('2023-01-01') }
      ];

      const result = predictTrend(dataPoints);
      expect(result.direction).toBe(TrendDirection.STABLE);
      expect(result.slope).toBe(0);
      expect(result.confidence).toBe(0);
      expect(result.nextValue).toBe(5);
    });
  });

  describe('detectSeasonality', () => {
    it('should detect seasonality in data with a clear pattern', () => {
      const dataPoints: DataPoint[] = [];
      // Create a weekly pattern over 4 weeks
      for (let week = 0; week < 4; week++) {
        for (let day = 0; day < 7; day++) {
          const date = new Date('2023-01-01');
          date.setDate(date.getDate() + (week * 7) + day);
          
          // Create a pattern where weekends have higher values
          const value = day >= 5 ? 10 : 5;
          dataPoints.push({ value, timestamp: date });
        }
      }

      const seasonalityStrength = detectSeasonality(dataPoints, 7);
      expect(seasonalityStrength).toBeGreaterThan(0.5);
    });

    it('should return low seasonality for random data', () => {
      const dataPoints: DataPoint[] = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date('2023-01-01');
        date.setDate(date.getDate() + i);
        dataPoints.push({ 
          value: Math.random() * 10, 
          timestamp: date 
        });
      }

      const seasonalityStrength = detectSeasonality(dataPoints, 7);
      expect(seasonalityStrength).toBeLessThan(0.5);
    });

    it('should return 0 for insufficient data', () => {
      const dataPoints: DataPoint[] = [
        { value: 5, timestamp: new Date('2023-01-01') },
        { value: 6, timestamp: new Date('2023-01-02') },
        { value: 7, timestamp: new Date('2023-01-03') }
      ];

      const seasonalityStrength = detectSeasonality(dataPoints, 7);
      expect(seasonalityStrength).toBe(0);
    });
  });

  describe('generateForecast', () => {
    it('should generate forecasts for future data points', () => {
      const dataPoints: DataPoint[] = [
        { value: 1, timestamp: new Date('2023-01-01') },
        { value: 2, timestamp: new Date('2023-01-02') },
        { value: 3, timestamp: new Date('2023-01-03') },
        { value: 4, timestamp: new Date('2023-01-04') },
        { value: 5, timestamp: new Date('2023-01-05') }
      ];

      const forecast = generateForecast(dataPoints, 3);
      expect(forecast.length).toBe(3);
      expect(forecast[0]).toBeGreaterThan(5);
      expect(forecast[1]).toBeGreaterThan(forecast[0]);
      expect(forecast[2]).toBeGreaterThan(forecast[1]);
    });

    it('should return trend predictions for insufficient seasonal data', () => {
      const dataPoints: DataPoint[] = [
        { value: 1, timestamp: new Date('2023-01-01') },
        { value: 2, timestamp: new Date('2023-01-02') },
        { value: 3, timestamp: new Date('2023-01-03') }
      ];

      const forecast = generateForecast(dataPoints, 2);
      expect(forecast.length).toBe(2);
    });
  });
});
