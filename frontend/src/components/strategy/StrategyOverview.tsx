'use client';

import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';

interface Strategy {
  id: string;
  title: string;
  summary: string;
  bullishIdeas: any[];
  bearishRisks: any[];
  trendingOpportunities: any[];
  consensusSignals: any[];
  confidenceScore: number;
  postCount: number;
  accountCount: number;
  generatedAt: string;
}

interface StrategyOverviewProps {
  strategy: Strategy;
}

export function StrategyOverview({ strategy }: StrategyOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{strategy.title}</h2>
        <p className="text-blue-100 mb-4">{strategy.summary}</p>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-blue-200">Confidence:</span>{' '}
            <span className="font-semibold">
              {(strategy.confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            <span className="text-blue-200">Posts:</span>{' '}
            <span className="font-semibold">{strategy.postCount}</span>
          </div>
          <div>
            <span className="text-blue-200">Accounts:</span>{' '}
            <span className="font-semibold">{strategy.accountCount}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Bullish Ideas</h3>
          </div>
          <div className="space-y-3">
            {strategy.bullishIdeas?.slice(0, 5).map((idea: any, idx: number) => (
              <div key={idx} className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-green-700">${idea.ticker}</span>
                  <span className="text-xs text-green-600">{idea.mentions} mentions</span>
                </div>
                <p className="text-sm text-gray-700">
                  Avg sentiment: {(idea.avgSentiment * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Bearish Risks</h3>
          </div>
          <div className="space-y-3">
            {strategy.bearishRisks?.slice(0, 5).map((risk: any, idx: number) => (
              <div key={idx} className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-red-700">{risk.theme}</span>
                  <span className="text-xs text-red-600">{risk.mentions} mentions</span>
                </div>
                <p className="text-sm text-gray-700">
                  Severity: {(risk.severity * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Consensus Signals</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {strategy.consensusSignals?.slice(0, 6).map((signal: any, idx: number) => (
            <div key={idx} className="p-4 bg-purple-50 rounded-lg">
              <p className="font-bold text-purple-700 mb-1">${signal.ticker}</p>
              <p className="text-sm text-gray-700">
                {signal.accountCount} accounts · {signal.totalMentions} mentions
              </p>
              <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600"
                  style={{ width: `${Math.min(100, signal.accountCount * 20)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-900 mb-1">Research Disclaimer</p>
          <p className="text-xs text-yellow-800">
            This analysis is for informational and educational purposes only. It does not
            constitute financial advice. Always conduct your own research and consult with
            qualified financial advisors before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
