import { STORAGE_KEYS } from '@/constants/demo-user';
import type { UserProfile, WorkoutPlan, DietPlan, WeightEntry } from '@/types';

/**
 * Local storage utility functions for demo mode
 * In production, this would be replaced with backend API calls
 */

export const storage = {
  // User Profile
  getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Workout History
  getWorkoutHistory(): WorkoutPlan[] {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    if (!data) return [];
    return JSON.parse(data).map((plan: any) => ({
      ...plan,
      generatedAt: new Date(plan.generatedAt),
    }));
  },

  saveWorkoutPlan(plan: WorkoutPlan): void {
    const history = this.getWorkoutHistory();
    history.unshift(plan); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  },

  // Diet History
  getDietHistory(): DietPlan[] {
    const data = localStorage.getItem(STORAGE_KEYS.DIET_HISTORY);
    if (!data) return [];
    return JSON.parse(data).map((plan: any) => ({
      ...plan,
      generatedAt: new Date(plan.generatedAt),
    }));
  },

  saveDietPlan(plan: DietPlan): void {
    const history = this.getDietHistory();
    history.unshift(plan); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.DIET_HISTORY, JSON.stringify(history));
  },

  // Weight History
  getWeightHistory(): WeightEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_HISTORY);
    if (!data) return [];
    return JSON.parse(data).map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
    }));
  },

  addWeightEntry(entry: WeightEntry): void {
    const history = this.getWeightHistory();
    history.push(entry);
    localStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(history));
  },

  updateWeight(weight: number, bmi: number): void {
    const entry: WeightEntry = {
      date: new Date(),
      weight,
      bmi,
    };
    this.addWeightEntry(entry);
    
    // Also update user profile
    const profile = this.getUserProfile();
    if (profile) {
      profile.weight = weight;
      this.saveUserProfile(profile);
    }
  },

  // Theme
  getTheme(): 'light' | 'dark' {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as 'light' | 'dark') || 'light';
  },

  saveTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Clear all data (logout)
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
