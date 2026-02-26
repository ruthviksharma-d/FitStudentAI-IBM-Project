import type { UserProfile } from '@/types';

/**
 * Demo user profile - hardcoded for presentation/demo purposes
 * This bypasses real authentication and provides a test user
 */
export const DEMO_USER: UserProfile = {
  name: 'Demo Student',
  age: 20,
  gender: 'Male',
  height: 170, // cm
  weight: 70, // kg
  goal: 'Muscle Gain',
  budget: 150, // INR
  foodPreference: 'Veg',
  gymAccess: false,
  studyHours: 6,
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'fitness_user_profile',
  WORKOUT_HISTORY: 'fitness_workout_history',
  DIET_HISTORY: 'fitness_diet_history',
  WEIGHT_HISTORY: 'fitness_weight_history',
  THEME: 'fitness_theme',
} as const;
