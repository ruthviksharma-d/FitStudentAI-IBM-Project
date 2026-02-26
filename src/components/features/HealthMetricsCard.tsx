import { Activity, Heart, Flame } from 'lucide-react';
import type { UserProfile, HealthMetrics } from '@/types';

interface HealthMetricsCardProps {
  profile: UserProfile;
  metrics: HealthMetrics;
}

export default function HealthMetricsCard({ profile, metrics }: HealthMetricsCardProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* BMI Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            metrics.bmiCategory === 'Normal' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
          }`}>
            {metrics.bmiCategory}
          </span>
        </div>
        <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Body Mass Index</h4>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {metrics.bmi}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Weight: {profile.weight} kg | Height: {profile.height} cm
        </p>
      </div>

      {/* BMR Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Basal Metabolic Rate</h4>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {metrics.bmr}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Calories at rest per day
        </p>
      </div>

      {/* Daily Calories Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            {profile.goal}
          </span>
        </div>
        <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Daily Calorie Target</h4>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {metrics.dailyCalories}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total calories needed per day
        </p>
      </div>
    </div>
  );
}
