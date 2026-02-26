// Core type definitions for the Workout & Diet Planner

export interface UserProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // in cm
  weight: number; // in kg
  goal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance';
  budget: number; // in currency
  foodPreference: 'Veg' | 'Non-Veg' | 'Vegan';
  gymAccess: boolean;
  studyHours: number;
}

export interface HealthMetrics {
  bmi: number;
  bmr: number;
  dailyCalories: number;
  bmiCategory: string;
}

export type MoodType = 'Energetic' | 'Normal' | 'Tired' | 'Stressed';

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  duration: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  exercises: Exercise[];
  totalDuration: string;
  mood: MoodType;
  generatedAt: Date;
}

export interface MealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  estimatedProtein: string;
}

export interface DietPlan {
  id: string;
  meals: MealPlan;
  totalCalories: number;
  generatedAt: Date;
}

export interface WeightEntry {
  date: Date;
  weight: number;
  bmi: number;
}

export interface ProgressData {
  weightHistory: WeightEntry[];
  currentWeight: number;
}
