'use client';

import { useCurrentStrategy, useGenerateStrategy } from '@/hooks/useStrategy';
import { StrategyOverview } from '@/components/strategy/StrategyOverview';
import { RefreshCw } from 'lucide-react';

export default function StrategyPage() {
  const { data: strategy, isLoading } = useCurrentStrategy();
  const generateMutation = useGenerateStrategy();

  const handleGenerate = () => {
    generateMutation.mutate(7);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investment Strategy</h1>
          <p className="text-gray-600 mt-1">
            AI-generated strategy based on Reddit sentiment analysis
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
          {generateMutation.isPending ? 'Generating...' : 'Generate New'}
        </button>
      </div>

      {strategy ? (
        <StrategyOverview strategy={strategy} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">No strategy available yet</p>
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Generate Strategy
          </button>
        </div>
      )}
    </div>
  );
}
