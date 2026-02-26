import { useState, useEffect } from 'react';
import { Sparkles, Clock, History, ChevronDown, ChevronUp } from 'lucide-react';
import { storage } from '@/lib/storage';
import type { UserProfile, MoodType, WorkoutPlan } from '@/types';

interface WorkoutSectionProps {
  profile: UserProfile;
}

export default function WorkoutSection({ profile }: WorkoutSectionProps) {
  const [mood, setMood] = useState<MoodType>('Normal');
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [history, setHistory] = useState<WorkoutPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load workout history on mount
    const workoutHistory = storage.getWorkoutHistory();
    setHistory(workoutHistory);
    
    if (workoutHistory.length > 0) {
      setCurrentPlan(workoutHistory[0]);
      setMood(workoutHistory[0].mood);
    }
  }, []);

  const generateWorkout = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation (in production, this would call OnSpace AI)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const workoutData = generateMockWorkout(profile, mood);
      
      // Save to history
      storage.saveWorkoutPlan(workoutData);
      
      // Update state
      setCurrentPlan(workoutData);
      setHistory([workoutData, ...history]);
      
      console.log('Generated workout plan:', workoutData);
    } catch (error) {
      console.error('Error generating workout:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mood Selector and Generate Button */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Mood
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value as MoodType)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Energetic">⚡ Energetic - Ready to push hard</option>
              <option value="Normal">😊 Normal - Balanced workout</option>
              <option value="Tired">😴 Tired - Light activity</option>
              <option value="Stressed">😰 Stressed - Relaxing exercises</option>
            </select>
          </div>
          
          <button
            onClick={generateWorkout}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Generate Workout'}
          </button>
        </div>
      </div>

      {/* Current Workout Plan */}
      {currentPlan && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentPlan.title}
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentPlan.totalDuration}
                </span>
                <span>Mood: {currentPlan.mood}</span>
                <span>{new Date(currentPlan.generatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {currentPlan.exercises.map((exercise, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {exercise.name}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {exercise.sets} sets × {exercise.reps} reps • {exercise.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout History */}
      {history.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Workout History ({history.length - 1} previous)
              </h4>
            </div>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {showHistory && (
            <div className="mt-4 space-y-3">
              {history.slice(1).map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setCurrentPlan(plan)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {plan.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mood: {plan.mood} • {plan.totalDuration}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(plan.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Mock workout generator (will be replaced with OnSpace AI in production)
function generateMockWorkout(profile: UserProfile, mood: MoodType): WorkoutPlan {
  const workouts = {
    Energetic: {
      title: 'High-Intensity Full Body Workout',
      exercises: [
        { name: 'Jumping Jacks', sets: '3', reps: '30', duration: '3 min' },
        { name: 'Push-ups', sets: '4', reps: '15-20', duration: '5 min' },
        { name: 'Squats', sets: '4', reps: '20', duration: '5 min' },
        { name: 'Burpees', sets: '3', reps: '10', duration: '4 min' },
        { name: 'Plank Hold', sets: '3', reps: '45 sec', duration: '3 min' },
      ],
      totalDuration: '25-30 minutes',
    },
    Normal: {
      title: 'Balanced Strength Training',
      exercises: [
        { name: 'Warm-up Jog in Place', sets: '1', reps: '5 min', duration: '5 min' },
        { name: 'Lunges', sets: '3', reps: '12 each leg', duration: '6 min' },
        { name: 'Push-ups', sets: '3', reps: '10-15', duration: '5 min' },
        { name: 'Bicycle Crunches', sets: '3', reps: '20', duration: '4 min' },
        { name: 'Cool-down Stretch', sets: '1', reps: '5 min', duration: '5 min' },
      ],
      totalDuration: '25 minutes',
    },
    Tired: {
      title: 'Light Recovery Workout',
      exercises: [
        { name: 'Gentle Stretching', sets: '1', reps: '10 min', duration: '10 min' },
        { name: 'Wall Push-ups', sets: '2', reps: '10', duration: '3 min' },
        { name: 'Chair Squats', sets: '2', reps: '12', duration: '4 min' },
        { name: 'Walking', sets: '1', reps: '10 min', duration: '10 min' },
      ],
      totalDuration: '20 minutes',
    },
    Stressed: {
      title: 'Mindful Movement & Relaxation',
      exercises: [
        { name: 'Deep Breathing', sets: '3', reps: '2 min', duration: '6 min' },
        { name: 'Gentle Yoga Flow', sets: '1', reps: '10 min', duration: '10 min' },
        { name: 'Cat-Cow Stretch', sets: '2', reps: '10', duration: '3 min' },
        { name: 'Child Pose Hold', sets: '2', reps: '2 min', duration: '4 min' },
        { name: 'Meditation', sets: '1', reps: '5 min', duration: '5 min' },
      ],
      totalDuration: '25-30 minutes',
    },
  };

  const selectedWorkout = workouts[mood];

  return {
    id: Date.now().toString(),
    title: selectedWorkout.title,
    exercises: selectedWorkout.exercises,
    totalDuration: selectedWorkout.totalDuration,
    mood,
    generatedAt: new Date(),
  };
}
