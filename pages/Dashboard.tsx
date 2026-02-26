import { useState, useEffect } from 'react';
import { Activity, Apple, TrendingUp, FileText, Sparkles } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HealthMetricsCard from '@/components/features/HealthMetricsCard';
import WorkoutSection from '@/components/features/WorkoutSection';
import DietSection from '@/components/features/DietSection';
import ProgressSection from '@/components/features/ProgressSection';
import { storage } from '@/lib/storage';
import { calculateHealthMetrics } from '@/lib/health-calculations';
import type { UserProfile, HealthMetrics } from '@/types';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);

  useEffect(() => {
    const userProfile = storage.getUserProfile();
    if (userProfile) {
      setProfile(userProfile);
      const healthMetrics = calculateHealthMetrics(userProfile);
      setMetrics(healthMetrics);
    }
  }, []);

  const refreshMetrics = () => {
    const userProfile = storage.getUserProfile();
    if (userProfile) {
      setProfile(userProfile);
      const healthMetrics = calculateHealthMetrics(userProfile);
      setMetrics(healthMetrics);
    }
  };

  if (!profile || !metrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Your Personalized Fitness Dashboard</h2>
          </div>
          <p className="text-blue-100 text-lg">
            Get AI-powered workout and diet plans tailored to your student lifestyle
          </p>
        </div>

        {/* Health Metrics Overview */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Health Metrics
            </h3>
          </div>
          <HealthMetricsCard profile={profile} metrics={metrics} />
        </div>

        {/* Workout Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Workout Plan
            </h3>
          </div>
          <WorkoutSection profile={profile} />
        </div>

        {/* Diet Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Apple className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Diet Plan
            </h3>
          </div>
          <DietSection profile={profile} dailyCalories={metrics.dailyCalories} />
        </div>

        {/* Progress Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Progress Tracking
            </h3>
          </div>
          <ProgressSection onWeightUpdate={refreshMetrics} />
        </div>
      </div>
    </DashboardLayout>
  );
}
