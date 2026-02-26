import { useState, useEffect } from 'react';
import { Scale, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { storage } from '@/lib/storage';
import { calculateBMI } from '@/lib/health-calculations';
import type { WeightEntry } from '@/types';

interface ProgressSectionProps {
  onWeightUpdate: () => void;
}

export default function ProgressSection({ onWeightUpdate }: ProgressSectionProps) {
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = storage.getWeightHistory();
    setWeightHistory(history);
  };

  const handleWeightUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    const profile = storage.getUserProfile();
    if (!profile) return;

    const bmi = calculateBMI(weight, profile.height);
    storage.updateWeight(weight, bmi);
    
    loadHistory();
    onWeightUpdate();
    setNewWeight('');
    setShowUpdateForm(false);
  };

  const downloadPDF = () => {
    // In production, this would generate a PDF using a library like jsPDF
    alert('PDF generation feature coming soon! This will create a comprehensive report with your metrics, workout plans, diet plans, and progress charts.');
    console.log('Generating PDF report with current data...');
  };

  // Format data for chart
  const chartData = weightHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
    bmi: entry.bmi,
  }));

  return (
    <div className="space-y-6">
      {/* Weight Update Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Update Weight
            </h4>
          </div>
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showUpdateForm ? 'Cancel' : 'Update'}
          </button>
        </div>

        {showUpdateForm && (
          <form onSubmit={handleWeightUpdate} className="flex gap-3">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Enter weight (kg)"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Save
            </button>
          </form>
        )}

        {weightHistory.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Weight</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weightHistory[weightHistory.length - 1].weight} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current BMI</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weightHistory[weightHistory.length - 1].bmi}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Chart */}
      {chartData.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Weight Progress Chart
          </h4>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weight Change Summary */}
          {chartData.length > 1 && (
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Total Change:</span>
                <span className={`text-lg font-bold ${
                  chartData[chartData.length - 1].weight - chartData[0].weight > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {(chartData[chartData.length - 1].weight - chartData[0].weight).toFixed(1)} kg
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Download PDF Report */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold mb-2">Download Complete Report</h4>
            <p className="text-blue-100">
              Get a PDF summary of your health metrics, workout plans, diet plans, and progress
            </p>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold whitespace-nowrap"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
