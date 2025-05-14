import { HealthData } from '@/integrations/health-apps/types';

/**
 * Health score component weights
 */
const COMPONENT_WEIGHTS = {
  activity: 0.25,
  heart: 0.20,
  sleep: 0.20,
  nutrition: 0.15,
  weight: 0.10,
  vitals: 0.10,
};

/**
 * Health score result interface
 */
interface HealthScore {
  total: number;
  components: {
    activity?: number;
    heart?: number;
    sleep?: number;
    nutrition?: number;
    weight?: number;
    vitals?: number;
    [key: string]: number | undefined;
  };
}

/**
 * Calculate activity score based on steps, distance, and calories
 * @param healthData Health data
 * @returns Activity score (0-100)
 */
const calculateActivityScore = (healthData: HealthData): number => {
  // Default values if data is missing
  const steps = healthData.steps || 0;
  const distance = healthData.distance || 0; // in meters
  const calories = healthData.calories || 0;
  
  // Step score (10,000 steps = 100%)
  const stepScore = Math.min(steps / 10000 * 100, 100);
  
  // Distance score (10 km = 100%)
  const distanceScore = Math.min(distance / 10000 * 100, 100);
  
  // Calorie score (500 calories = 100%)
  const calorieScore = Math.min(calories / 500 * 100, 100);
  
  // Weighted average of the three scores
  return (stepScore * 0.5) + (distanceScore * 0.3) + (calorieScore * 0.2);
};

/**
 * Calculate heart health score based on heart rate metrics
 * @param healthData Health data
 * @returns Heart health score (0-100)
 */
const calculateHeartScore = (healthData: HealthData): number => {
  if (!healthData.heartRate) {
    return 0;
  }
  
  const { resting, average, max } = healthData.heartRate;
  
  // If no heart rate data is available
  if (!resting && !average && !max) {
    return 0;
  }
  
  let score = 0;
  let dataPoints = 0;
  
  // Resting heart rate score (60-70 bpm is optimal)
  if (resting) {
    dataPoints++;
    if (resting < 50) {
      // Very low resting heart rate (could be athletic or concerning)
      score += 90;
    } else if (resting >= 50 && resting <= 70) {
      // Optimal range
      score += 100;
    } else if (resting > 70 && resting <= 90) {
      // Higher than optimal
      score += 80 - ((resting - 70) * 1);
    } else {
      // Very high resting heart rate
      score += 60 - ((resting - 90) * 0.5);
    }
  }
  
  // Average heart rate (depends on activity level)
  if (average) {
    dataPoints++;
    // Simplified scoring for average heart rate
    if (average < 100) {
      score += 100;
    } else if (average >= 100 && average <= 140) {
      score += 90;
    } else {
      score += 80;
    }
  }
  
  // Max heart rate (age-dependent, using simplified approach)
  if (max) {
    dataPoints++;
    // Simplified scoring for max heart rate
    if (max < 180) {
      score += 100;
    } else if (max >= 180 && max <= 200) {
      score += 90;
    } else {
      score += 70;
    }
  }
  
  // Return average score
  return dataPoints > 0 ? score / dataPoints : 0;
};

/**
 * Calculate sleep score based on duration and quality
 * @param healthData Health data
 * @returns Sleep score (0-100)
 */
const calculateSleepScore = (healthData: HealthData): number => {
  if (!healthData.sleep) {
    return 0;
  }
  
  const { duration, quality } = healthData.sleep;
  
  // If no sleep data is available
  if (!duration && !quality) {
    return 0;
  }
  
  let score = 0;
  let dataPoints = 0;
  
  // Duration score (7-9 hours is optimal)
  if (duration) {
    dataPoints++;
    const hours = duration / 60; // Convert minutes to hours
    
    if (hours >= 7 && hours <= 9) {
      // Optimal range
      score += 100;
    } else if (hours >= 6 && hours < 7) {
      // Slightly below optimal
      score += 80;
    } else if (hours > 9 && hours <= 10) {
      // Slightly above optimal
      score += 80;
    } else if (hours >= 5 && hours < 6) {
      // Below optimal
      score += 60;
    } else if (hours > 10) {
      // Too much sleep
      score += 60;
    } else {
      // Too little sleep
      score += 40;
    }
  }
  
  // Quality score
  if (quality) {
    dataPoints++;
    switch (quality) {
      case 'excellent':
        score += 100;
        break;
      case 'good':
        score += 80;
        break;
      case 'fair':
        score += 60;
        break;
      case 'poor':
        score += 40;
        break;
    }
  }
  
  // Return average score
  return dataPoints > 0 ? score / dataPoints : 0;
};

/**
 * Calculate nutrition score (placeholder - would use actual nutrition data)
 * @param healthData Health data
 * @returns Nutrition score (0-100)
 */
const calculateNutritionScore = (healthData: HealthData): number => {
  // This is a placeholder. In a real app, you would use actual nutrition data.
  // For demo purposes, we'll return a random score between 60 and 90
  return Math.floor(Math.random() * 30) + 60;
};

/**
 * Calculate weight score based on BMI
 * @param healthData Health data
 * @returns Weight score (0-100)
 */
const calculateWeightScore = (healthData: HealthData): number => {
  const { weight, height } = healthData;
  
  // If weight or height data is missing
  if (!weight || !height) {
    return 0;
  }
  
  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Score based on BMI
  if (bmi >= 18.5 && bmi <= 24.9) {
    // Normal weight
    return 100;
  } else if ((bmi >= 17 && bmi < 18.5) || (bmi > 24.9 && bmi <= 29.9)) {
    // Slightly underweight or overweight
    return 80;
  } else if ((bmi >= 16 && bmi < 17) || (bmi > 29.9 && bmi <= 34.9)) {
    // Moderately underweight or overweight
    return 60;
  } else {
    // Severely underweight or overweight
    return 40;
  }
};

/**
 * Calculate vitals score based on blood pressure, glucose, and oxygen
 * @param healthData Health data
 * @returns Vitals score (0-100)
 */
const calculateVitalsScore = (healthData: HealthData): number => {
  const { bloodPressure, bloodGlucose, oxygenSaturation } = healthData;
  
  let score = 0;
  let dataPoints = 0;
  
  // Blood pressure score
  if (bloodPressure && bloodPressure.systolic && bloodPressure.diastolic) {
    dataPoints++;
    const { systolic, diastolic } = bloodPressure;
    
    // Optimal: 120/80 or lower
    if (systolic <= 120 && diastolic <= 80) {
      score += 100;
    }
    // Elevated: 120-129/80 or lower
    else if (systolic >= 120 && systolic <= 129 && diastolic <= 80) {
      score += 90;
    }
    // Stage 1 hypertension: 130-139/80-89
    else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      score += 70;
    }
    // Stage 2 hypertension: 140+/90+
    else {
      score += 50;
    }
  }
  
  // Blood glucose score (70-99 mg/dL is normal fasting)
  if (bloodGlucose) {
    dataPoints++;
    
    if (bloodGlucose >= 70 && bloodGlucose <= 99) {
      // Normal
      score += 100;
    } else if (bloodGlucose >= 100 && bloodGlucose <= 125) {
      // Prediabetes
      score += 70;
    } else {
      // Diabetes range
      score += 50;
    }
  }
  
  // Oxygen saturation score (95-100% is normal)
  if (oxygenSaturation) {
    dataPoints++;
    
    if (oxygenSaturation >= 95) {
      // Normal
      score += 100;
    } else if (oxygenSaturation >= 90 && oxygenSaturation < 95) {
      // Mild hypoxemia
      score += 70;
    } else {
      // Severe hypoxemia
      score += 40;
    }
  }
  
  // Return average score
  return dataPoints > 0 ? score / dataPoints : 0;
};

/**
 * Calculate overall health score based on health data
 * @param healthData Health data
 * @returns Health score object with total and component scores
 */
export const calculateHealthScore = (healthData: HealthData): HealthScore => {
  // Calculate component scores
  const activityScore = calculateActivityScore(healthData);
  const heartScore = calculateHeartScore(healthData);
  const sleepScore = calculateSleepScore(healthData);
  const nutritionScore = calculateNutritionScore(healthData);
  const weightScore = calculateWeightScore(healthData);
  const vitalsScore = calculateVitalsScore(healthData);
  
  // Calculate total score using weighted average
  const totalScore = (
    activityScore * COMPONENT_WEIGHTS.activity +
    heartScore * COMPONENT_WEIGHTS.heart +
    sleepScore * COMPONENT_WEIGHTS.sleep +
    nutritionScore * COMPONENT_WEIGHTS.nutrition +
    weightScore * COMPONENT_WEIGHTS.weight +
    vitalsScore * COMPONENT_WEIGHTS.vitals
  );
  
  return {
    total: totalScore,
    components: {
      activity: activityScore,
      heart: heartScore,
      sleep: sleepScore,
      nutrition: nutritionScore,
      weight: weightScore,
      vitals: vitalsScore,
    },
  };
};
