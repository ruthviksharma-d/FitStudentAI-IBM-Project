import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Apple, TrendingUp, LogIn, UserPlus, Zap } from 'lucide-react';
import { storage } from '@/lib/storage';
import { DEMO_USER } from '@/constants/demo-user';
import { calculateBMI } from '@/lib/health-calculations';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleDemoLogin = () => {
    // Initialize demo user data
    storage.saveUserProfile(DEMO_USER);
    
    // Initialize with first weight entry if no history exists
    if (storage.getWeightHistory().length === 0) {
      const bmi = calculateBMI(DEMO_USER.weight, DEMO_USER.height);
      storage.addWeightEntry({
        date: new Date(),
        weight: DEMO_USER.weight,
        bmi,
      });
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Dumbbell className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              FitStudent AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            AI-Powered Personalized Workout & Diet Planner designed specifically for busy students
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
            >
              <UserPlus className="w-5 h-5" />
              Register
            </button>
            <button
              onClick={handleDemoLogin}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-semibold text-lg shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Login as Demo User
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Dumbbell className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Workout Plans</h3>
            <p className="text-gray-600">
              Get personalized workout routines based on your mood, goals, and gym access
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Apple className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Diet Plans</h3>
            <p className="text-gray-600">
              Budget-friendly meal plans tailored to your calorie needs and food preferences
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your weight, BMI, and fitness journey with visual charts
            </p>
          </div>
        </div>
      </div>

      {/* Demo Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <p className="text-gray-600 mb-6">
              This is a demo interface. Real authentication is not implemented.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                disabled
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                disabled
              />
              <button
                className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                disabled
              >
                Login (Demo Only)
              </button>
            </div>
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleDemoLogin}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-semibold"
              >
                Continue as Demo User
              </button>
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Demo Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Register</h2>
            <p className="text-gray-600 mb-6">
              This is a demo interface. Real authentication is not implemented.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                disabled
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                disabled
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                disabled
              />
              <button
                className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                disabled
              >
                Register (Demo Only)
              </button>
            </div>
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleDemoLogin}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-semibold"
              >
                Continue as Demo User
              </button>
            </div>
            <button
              onClick={() => setShowRegisterModal(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
