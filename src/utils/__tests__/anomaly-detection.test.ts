/**
 * Tests for anomaly detection utilities
 */

import { 
  detectAnomaliesZScore, 
  detectAnomaliesMovingAverage, 
  detectTrendChanges, 
  detectMissingData, 
  detectAllAnomalies,
  AnomalySeverity,
  AnomalyType
} from '../anomaly-detection';
import { DataPoint } from '../trend-prediction';

describe('Anomaly Detection Utilities', () => {
  describe('detectAnomaliesZScore', () => {
    it('should detect spike anomalies using Z-score method', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01') },
        { value: 12, timestamp: new Date('2023-01-02') },
        { value: 9, timestamp: new Date('2023-01-03') },
        { value: 11, timestamp: new Date('2023-01-04') },
        { value: 30, timestamp: new Date('2023-01-05') }, // Anomaly
        { value: 10, timestamp: new Date('2023-01-06') }
      ];

      const anomalies = detectAnomaliesZScore(dataPoints, 2.0);
      expect(anomalies.length).toBe(1);
      expect(anomalies[0].type).toBe(AnomalyType.SPIKE);
      expect(anomalies[0].index).toBe(4);
      expect(anomalies[0].value).toBe(30);
    });

    it('should detect drop anomalies using Z-score method', () => {
      const dataPoints: DataPoint[] = [
        { value: 100, timestamp: new Date('2023-01-01') },
        { value: 98, timestamp: new Date('2023-01-02') },
        { value: 102, timestamp: new Date('2023-01-03') },
        { value: 30, timestamp: new Date('2023-01-04') }, // Anomaly
        { value: 99, timestamp: new Date('2023-01-05') }
      ];

      const anomalies = detectAnomaliesZScore(dataPoints, 2.0);
      expect(anomalies.length).toBe(1);
      expect(anomalies[0].type).toBe(AnomalyType.DROP);
      expect(anomalies[0].index).toBe(3);
      expect(anomalies[0].value).toBe(30);
    });

    it('should not detect anomalies in consistent data', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01') },
        { value: 10, timestamp: new Date('2023-01-02') },
        { value: 10, timestamp: new Date('2023-01-03') },
        { value: 10, timestamp: new Date('2023-01-04') },
        { value: 10, timestamp: new Date('2023-01-05') }
      ];

      const anomalies = detectAnomaliesZScore(dataPoints, 2.0);
      expect(anomalies.length).toBe(0);
    });

    it('should handle insufficient data points', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01') },
        { value: 20, timestamp: new Date('2023-01-02') }
      ];

      const anomalies = detectAnomaliesZScore(dataPoints, 2.0);
      expect(anomalies.length).toBe(0);
    });
  });

  describe('detectAnomaliesMovingAverage', () => {
    it('should detect anomalies using moving average method', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01') },
        { value: 11, timestamp: new Date('2023-01-02') },
        { value: 9, timestamp: new Date('2023-01-03') },
        { value: 10, timestamp: new Date('2023-01-04') },
        { value: 12, timestamp: new Date('2023-01-05') },
        { value: 30, timestamp: new Date('2023-01-06') }, // Anomaly
        { value: 11, timestamp: new Date('2023-01-07') }
      ];

      const anomalies = detectAnomaliesMovingAverage(dataPoints, 5, 2.0);
      expect(anomalies.length).toBe(1);
      expect(anomalies[0].type).toBe(AnomalyType.SPIKE);
      expect(anomalies[0].value).toBe(30);
    });

    it('should handle insufficient data points', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01') },
        { value: 20, timestamp: new Date('2023-01-02') },
        { value: 30, timestamp: new Date('2023-01-03') }
      ];

      const anomalies = detectAnomaliesMovingAverage(dataPoints, 5, 2.0);
      expect(anomalies.length).toBe(0);
    });
  });

  describe('detectTrendChanges', () => {
    it('should detect significant trend changes', () => {
      const dataPoints: DataPoint[] = [
        // Upward trend
        { value: 10, timestamp: new Date('2023-01-01') },
        { value: 12, timestamp: new Date('2023-01-02') },
        { value: 14, timestamp: new Date('2023-01-03') },
        { value: 16, timestamp: new Date('2023-01-04') },
        { value: 18, timestamp: new Date('2023-01-05') },
        { value: 20, timestamp: new Date('2023-01-06') },
        { value: 22, timestamp: new Date('2023-01-07') },
        // Sudden downward trend
        { value: 20, timestamp: new Date('2023-01-08') },
        { value: 18, timestamp: new Date('2023-01-09') },
        { value: 16, timestamp: new Date('2023-01-10') },
        { value: 14, timestamp: new Date('2023-01-11') },
        { value: 12, timestamp: new Date('2023-01-12') },
        { value: 10, timestamp: new Date('2023-01-13') },
        { value: 8, timestamp: new Date('2023-01-14') }
      ];

      const anomalies = detectTrendChanges(dataPoints, 7, 30);
      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].type).toBe(AnomalyType.TREND_CHANGE);
    });

    it('should handle insufficient data points', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01') },
        { value: 12, timestamp: new Date('2023-01-02') },
        { value: 14, timestamp: new Date('2023-01-03') }
      ];

      const anomalies = detectTrendChanges(dataPoints, 7, 30);
      expect(anomalies.length).toBe(0);
    });
  });

  describe('detectMissingData', () => {
    it('should detect missing data points', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01T00:00:00Z') },
        { value: 12, timestamp: new Date('2023-01-02T00:00:00Z') },
        // Missing data for 2023-01-03
        { value: 14, timestamp: new Date('2023-01-04T00:00:00Z') },
        { value: 16, timestamp: new Date('2023-01-05T00:00:00Z') }
      ];

      const expectedInterval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      const anomalies = detectMissingData(dataPoints, expectedInterval, 1.5);
      expect(anomalies.length).toBe(1);
      expect(anomalies[0].type).toBe(AnomalyType.MISSING_DATA);
    });

    it('should handle insufficient data points', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01') }
      ];

      const expectedInterval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      const anomalies = detectMissingData(dataPoints, expectedInterval, 1.5);
      expect(anomalies.length).toBe(0);
    });
  });

  describe('detectAllAnomalies', () => {
    it('should detect all types of anomalies', () => {
      const dataPoints: DataPoint[] = [
        { value: 10, timestamp: new Date('2023-01-01T00:00:00Z') },
        { value: 12, timestamp: new Date('2023-01-02T00:00:00Z') },
        // Missing data for 2023-01-03
        { value: 14, timestamp: new Date('2023-01-04T00:00:00Z') },
        { value: 16, timestamp: new Date('2023-01-05T00:00:00Z') },
        { value: 18, timestamp: new Date('2023-01-06T00:00:00Z') },
        { value: 20, timestamp: new Date('2023-01-07T00:00:00Z') },
        { value: 22, timestamp: new Date('2023-01-08T00:00:00Z') },
        { value: 50, timestamp: new Date('2023-01-09T00:00:00Z') }, // Spike
        { value: 24, timestamp: new Date('2023-01-10T00:00:00Z') },
        { value: 22, timestamp: new Date('2023-01-11T00:00:00Z') },
        { value: 20, timestamp: new Date('2023-01-12T00:00:00Z') },
        { value: 18, timestamp: new Date('2023-01-13T00:00:00Z') },
        { value: 16, timestamp: new Date('2023-01-14T00:00:00Z') },
        { value: 14, timestamp: new Date('2023-01-15T00:00:00Z') }
      ];

      const anomalies = detectAllAnomalies(dataPoints, {
        zScoreThreshold: 2.0,
        movingAverageWindowSize: 5,
        movingAverageThreshold: 2.0,
        trendChangeWindowSize: 7,
        trendChangeThresholdAngle: 30,
        expectedInterval: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        missingDataThresholdMultiplier: 1.5
      });

      // Should detect at least the spike and missing data
      expect(anomalies.length).toBeGreaterThan(1);
      
      // Check if we have different types of anomalies
      const anomalyTypes = new Set(anomalies.map(a => a.type));
      expect(anomalyTypes.size).toBeGreaterThan(1);
    });
  });
});
