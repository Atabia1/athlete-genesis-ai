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
    report.push(`- ${workout.name} on ${workout.date}`);
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
