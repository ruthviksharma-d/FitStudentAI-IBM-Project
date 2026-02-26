import type { UserProfile, HealthMetrics } from '@/types';

/**
 * Calculate Body Mass Index (BMI)
 * Formula: weight(kg) / (height(m))^2
 */
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

/**
 * Get BMI category based on BMI value
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 * Men: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(years) + 5
 * Women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(years) - 161
 */
export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  
  if (gender === 'Male') {
    return Math.round(baseBMR + 5);
  } else if (gender === 'Female') {
    return Math.round(baseBMR - 161);
  } else {
    // For 'Other', use average
    return Math.round(baseBMR - 78);
  }
}

/**
 * Calculate daily calorie requirement based on activity level and goal
 * Activity multiplier: Student with study hours = Sedentary to Light Active (1.4-1.5)
 * Goal adjustment: Weight Loss (-500), Muscle Gain (+300), Maintenance (0)
 */
export function calculateDailyCalories(profile: UserProfile, bmr: number): number {
  // Activity multiplier based on study hours and gym access
  let activityMultiplier = 1.4; // Sedentary base for students
  
  if (profile.gymAccess) {
    activityMultiplier = 1.55; // Moderate activity
  } else if (profile.studyHours < 4) {
    activityMultiplier = 1.5; // Light activity
  }
  
  const maintenanceCalories = bmr * activityMultiplier;
  
  // Adjust based on goal
  let goalAdjustment = 0;
  if (profile.goal === 'Weight Loss') {
    goalAdjustment = -500; // Calorie deficit
  } else if (profile.goal === 'Muscle Gain') {
    goalAdjustment = 300; // Calorie surplus
  }
  
  return Math.round(maintenanceCalories + goalAdjustment);
}

/**
 * Calculate all health metrics for a user profile
 */
export function calculateHealthMetrics(profile: UserProfile): HealthMetrics {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmr = calculateBMR(profile);
  const dailyCalories = calculateDailyCalories(profile, bmr);
  const bmiCategory = getBMICategory(bmi);
  
  return {
    bmi,
    bmr,
    dailyCalories,
    bmiCategory,
  };
}
