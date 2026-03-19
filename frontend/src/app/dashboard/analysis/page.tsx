'use client';

import {
  useSentimentTrends,
  useTrendingTickers,
  useSectorDistribution,
  useTrendingThemes,
} from '@/hooks/useAnalysis';
import { useFilterStore } from '@/store/useFilterStore';
import { TimeRangeSelector } from '@/components/filters/TimeRangeSelector';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalysisPage() {
  const { timeRange } = useFilterStore();

  const { data: sentimentData } = useSentimentTrends(timeRange);
  const { data: tickersData } = useTrendingTickers(timeRange, 20);
  const { data: sectorsData } = useSectorDistribution(timeRange);
  const { data: themesData } = useTrendingThemes(timeRange, 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analysis</h1>
          <p className="text-gray-600 mt-1">Deep dive into market sentiment and trends</p>
        </div>
        <TimeRangeSelector />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Trending Tickers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tickersData?.slice(0, 10) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ticker" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mentionCount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Sector Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorsData || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="sector" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Detailed Ticker Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                  Ticker
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                  Mentions
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                  Posts
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                  Sentiment
                </th>
              </tr>
            </thead>
            <tbody>
              {tickersData?.map((ticker: any) => {
                const sentiment = parseFloat(ticker.avgSentiment);
                const sentimentColor =
                  sentiment > 0.1
                    ? 'text-green-600'
                    : sentiment < -0.1
                    ? 'text-red-600'
                    : 'text-gray-600';

                return (
                  <tr key={ticker.ticker} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-700">${ticker.ticker}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{ticker.mentionCount}</td>
                    <td className="py-3 px-4 text-gray-700">{ticker.postCount}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${sentimentColor}`}>
                        {sentiment > 0 ? '+' : ''}
                        {(sentiment * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
