
/**
 * Health Score Calculator
 *
 * This module provides functions for calculating a comprehensive health score
 * based on various health metrics.
 */

/**
 * Health score result interface
 */
export interface HealthScoreResult {
  overallScore: number;
  vitalSignsScore: number;
  activityScore: number;
  nutritionScore: number;
  sleepScore: number;
  stressScore: number;
}

/**
 * Health data interface (simplified for demonstration)
 */
export interface HealthData {
  weight?: number;
  height?: number;
  activityLevel?: string;
  sleepDuration?: number;
  stressLevel?: string;
}

/**
 * Calculate comprehensive health score
 */
export function calculateHealthScore(healthData: HealthData): HealthScoreResult {
  const vitalSignsScore = calculateVitalSignsScore(healthData);
  const activityScore = calculateActivityScore(healthData);
  const nutritionScore = calculateNutritionScore(healthData);
  const sleepScore = calculateSleepScore(healthData);
  const stressScore = calculateStressScore(healthData);

  const overallScore =
    0.3 * vitalSignsScore +
    0.2 * activityScore +
    0.2 * nutritionScore +
    0.15 * sleepScore +
    0.15 * stressScore;

  return {
    overallScore,
    vitalSignsScore,
    activityScore,
    nutritionScore,
    sleepScore,
    stressScore,
  };
}

/**
 * Calculate vital signs score
 */
export function calculateVitalSignsScore(healthData: HealthData): number {
  let score = 100;
  
  if (healthData.weight && healthData.height) {
    const bmi = healthData.weight / Math.pow(healthData.height / 100, 2);
    if (bmi < 18.5 || bmi > 30) {
      score -= 20;
    } else if (bmi > 25) {
      score -= 10;
    }
  }

  return Math.max(0, score);
}

/**
 * Calculate activity score
 */
export function calculateActivityScore(healthData: HealthData): number {
  let score = 100;

  if (healthData.activityLevel === 'sedentary') {
    score -= 30;
  } else if (healthData.activityLevel === 'light') {
    score -= 15;
  }

  return Math.max(0, score);
}

/**
 * Calculate nutrition score (placeholder implementation)
 */
export function calculateNutritionScore(_healthData: HealthData): number {
  // Placeholder implementation
  return 80;
}

/**
 * Calculate sleep score
 */
export function calculateSleepScore(healthData: HealthData): number {
  let score = 100;

  if (healthData.sleepDuration && healthData.sleepDuration < 6) {
    score -= 25;
  } else if (healthData.sleepDuration && healthData.sleepDuration > 9) {
    score -= 10;
  }

  return Math.max(0, score);
}

/**
 * Calculate stress score
 */
export function calculateStressScore(healthData: HealthData): number {
  let score = 100;

  if (healthData.stressLevel === 'high') {
    score -= 30;
  } else if (healthData.stressLevel === 'moderate') {
    score -= 15;
  }

  return Math.max(0, score);
}
