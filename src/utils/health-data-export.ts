
/**
 * Health Data Export Utilities
 *
 * This module provides functions for formatting and generating reports from health data.
 */

import {
  HealthData,
  WorkoutSession,
  NutritionLog,
} from '@/types/health';

/**
 * Format health data for export
 */
export function formatHealthDataForExport(healthData: Partial<HealthData>): string {
  const lines: string[] = [];
  
  // Add header
  lines.push('Health Data Export');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  // Basic metrics
  if (healthData.weight) {
    lines.push(`Weight: ${healthData.weight} kg`);
  }

  if (healthData.height) {
    lines.push(`Height: ${healthData.height} cm`);
  }

  if (healthData.age) {
    lines.push(`Age: ${healthData.age} years`);
  }

  if (healthData.activityLevel) {
    lines.push(`Activity Level: ${healthData.activityLevel}`);
  }

  if (healthData.sleepDuration) {
    lines.push(`Sleep Duration: ${healthData.sleepDuration} hours`);
  }

  if (healthData.stressLevel) {
    lines.push(`Stress Level: ${healthData.stressLevel}`);
  }

  return lines.join('\n');
}

/**
 * Generate workout summary report
 */
export function generateWorkoutSummaryReport(
  workouts: WorkoutSession[],
  startDate: Date,
  endDate: Date
): string {
  const report: string[] = [];

  report.push('Workout Summary Report');
  report.push(`Period: ${startDate.toISOString()} - ${endDate.toISOString()}`);
  report.push('');

  workouts.forEach((workout) => {
    report.push(`- ${workout.name} on ${workout.date} (${workout.duration} minutes)`);
  });

  return report.join('\n');
}

/**
 * Generate nutrition summary report
 */
export function generateNutritionSummaryReport(
  nutritionLogs: NutritionLog[],
  startDate: Date,
  endDate: Date
): string {
  const report: string[] = [];

  report.push('Nutrition Summary Report');
  report.push(`Period: ${startDate.toISOString()} - ${endDate.toISOString()}`);
  report.push('');

  nutritionLogs.forEach((log) => {
    report.push(`- ${log.food} (${log.calories} calories) on ${log.date}`);
  });

  return report.join('\n');
}

/**
 * Generate comprehensive health report
 */
export function generateComprehensiveHealthReport(
  healthData: Partial<HealthData>,
  workouts: WorkoutSession[],
  nutritionLogs: NutritionLog[],
  startDate: Date,
  endDate: Date
): string {
  const report: string[] = [];

  report.push('Comprehensive Health Report');
  report.push(`Period: ${startDate.toISOString()} - ${endDate.toISOString()}`);
  report.push('');

  // Health data section
  report.push('=== Health Metrics ===');
  report.push(formatHealthDataForExport(healthData));
  report.push('');

  // Workout section
  report.push('=== Workout Summary ===');
  if (workouts.length > 0) {
    workouts.forEach((workout) => {
      report.push(`- ${workout.name} on ${workout.date} (${workout.duration} minutes)`);
    });
  } else {
    report.push('No workouts recorded for this period.');
  }
  report.push('');

  // Nutrition section
  report.push('=== Nutrition Summary ===');
  if (nutritionLogs.length > 0) {
    nutritionLogs.forEach((log) => {
      report.push(`- ${log.food} (${log.calories} calories) on ${log.date}`);
    });
  } else {
    report.push('No nutrition logs recorded for this period.');
  }

  return report.join('\n');
}
