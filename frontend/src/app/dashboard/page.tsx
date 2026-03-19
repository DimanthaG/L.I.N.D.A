'use client';

import { useSentimentTrends, useTrendingTickers, useTrendingThemes } from '@/hooks/useAnalysis';
import { useTopPosts } from '@/hooks/usePosts';
import { useCurrentStrategy } from '@/hooks/useStrategy';
import { useFilterStore } from '@/store/useFilterStore';
import { SentimentChart } from '@/components/charts/SentimentChart';
import { TickerList } from '@/components/analysis/TickerList';
import { ThemeCloud } from '@/components/analysis/ThemeCloud';
import { PostFeed } from '@/components/posts/PostFeed';
import { StrategyOverview } from '@/components/strategy/StrategyOverview';
import { TimeRangeSelector } from '@/components/filters/TimeRangeSelector';
import { TrendingUp, BarChart3, Target } from 'lucide-react';

export default function DashboardPage() {
  const { timeRange } = useFilterStore();

  const { data: sentimentData, isLoading: sentimentLoading } = useSentimentTrends(timeRange);
  const { data: tickersData, isLoading: tickersLoading } = useTrendingTickers(timeRange, 10);
  const { data: themesData, isLoading: themesLoading } = useTrendingThemes(timeRange, 10);
  const { data: topPosts, isLoading: postsLoading } = useTopPosts(timeRange, 10);
  const { data: strategy, isLoading: strategyLoading } = useCurrentStrategy();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Investment insights from Reddit finance accounts
          </p>
        </div>
        <TimeRangeSelector />
      </div>

      {strategy && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Current Strategy</h2>
          </div>
          <p className="text-blue-100 mb-4">{strategy.summary}</p>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-blue-200">Confidence:</span>{' '}
              <span className="font-semibold">
                {((strategy.confidenceScore || 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-blue-200">Posts Analyzed:</span>{' '}
              <span className="font-semibold">{strategy.postCount}</span>
            </div>
            <div>
              <span className="text-blue-200">Accounts:</span>{' '}
              <span className="font-semibold">{strategy.accountCount}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Sentiment Overview</h3>
          </div>
          {sentimentLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <SentimentChart data={sentimentData || []} />
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Trending Tickers</h3>
          </div>
          {tickersLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <TickerList tickers={tickersData || []} />
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Trending Themes</h3>
          </div>
          {themesLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ThemeCloud themes={themesData || []} />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top Engaging Posts</h3>
        {postsLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <PostFeed posts={topPosts || []} />
        )}
      </div>
    </div>
  );
}
