import { useState, useEffect } from 'react';
import { Sparkles, Utensils, History, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react';
import { storage } from '@/lib/storage';
import type { UserProfile, DietPlan } from '@/types';

interface DietSectionProps {
  profile: UserProfile;
  dailyCalories: number;
}

export default function DietSection({ profile, dailyCalories }: DietSectionProps) {
  const [currentPlan, setCurrentPlan] = useState<DietPlan | null>(null);
  const [history, setHistory] = useState<DietPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load diet history on mount
    const dietHistory = storage.getDietHistory();
    setHistory(dietHistory);
    
    if (dietHistory.length > 0) {
      setCurrentPlan(dietHistory[0]);
    }
  }, []);

  const generateDiet = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation (in production, this would call OnSpace AI)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dietData = generateMockDiet(profile, dailyCalories);
      
      // Save to history
      storage.saveDietPlan(dietData);
      
      // Update state
      setCurrentPlan(dietData);
      setHistory([dietData, ...history]);
      
      console.log('Generated diet plan:', dietData);
    } catch (error) {
      console.error('Error generating diet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Personalized {profile.foodPreference} Diet Plan
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Budget: ₹{profile.budget} • Target: {dailyCalories} calories/day
            </p>
          </div>
          
          <button
            onClick={generateDiet}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Generate Diet Plan'}
          </button>
        </div>
      </div>

      {/* Current Diet Plan */}
      {currentPlan && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Daily Meal Plan
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Utensils className="w-4 h-4" />
                  {currentPlan.totalCalories} calories
                </span>
                <span>Protein: {currentPlan.meals.estimatedProtein}</span>
                <span>{new Date(currentPlan.generatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Breakfast */}
            <div className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-l-4 border-yellow-500">
              <h5 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                🌅 Breakfast
              </h5>
              <p className="text-gray-700 dark:text-gray-300">
                {currentPlan.meals.breakfast}
              </p>
            </div>

            {/* Lunch */}
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                ☀️ Lunch
              </h5>
              <p className="text-gray-700 dark:text-gray-300">
                {currentPlan.meals.lunch}
              </p>
            </div>

            {/* Dinner */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                🌙 Dinner
              </h5>
              <p className="text-gray-700 dark:text-gray-300">
                {currentPlan.meals.dinner}
              </p>
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                Estimated Daily Budget
              </span>
              <span className="flex items-center gap-1 text-lg font-bold text-purple-600 dark:text-purple-400">
                <IndianRupee className="w-5 h-5" />
                {profile.budget}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Diet History */}
      {history.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Diet Plan History ({history.length - 1} previous)
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
                        Daily Meal Plan
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.totalCalories} calories • Protein: {plan.meals.estimatedProtein}
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

// Mock diet generator (will be replaced with OnSpace AI in production)
function generateMockDiet(profile: UserProfile, dailyCalories: number): DietPlan {
  const vegDiets = [
    {
      breakfast: 'Oats porridge (50g) with banana, 2 boiled eggs, green tea',
      lunch: 'Brown rice (1 cup), dal tadka (1 bowl), mixed vegetable curry, cucumber salad',
      dinner: 'Roti (3), paneer curry (100g), spinach sabzi, curd',
      estimatedProtein: '75-85g',
    },
    {
      breakfast: 'Whole wheat toast (2 slices), peanut butter, scrambled eggs (2), milk',
      lunch: 'Rajma curry (1 bowl), rice (1 cup), mixed salad, buttermilk',
      dinner: 'Chapati (3), chana masala, bhindi sabzi, curd',
      estimatedProtein: '70-80g',
    },
    {
      breakfast: 'Poha with peanuts and vegetables, boiled eggs (2), banana',
      lunch: 'Quinoa pulao (1 cup), moong dal (1 bowl), cabbage sabzi, raita',
      dinner: 'Multigrain roti (3), soya curry, palak paneer, lassi',
      estimatedProtein: '80-90g',
    },
  ];

  const randomDiet = vegDiets[Math.floor(Math.random() * vegDiets.length)];

  return {
    id: Date.now().toString(),
    meals: randomDiet,
    totalCalories: dailyCalories,
    generatedAt: new Date(),
  };
}

