'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface Ticker {
  ticker: string;
  mentionCount: string;
  postCount: string;
  avgSentiment: string;
}

interface TickerListProps {
  tickers: Ticker[];
}

export function TickerList({ tickers }: TickerListProps) {
  if (tickers.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400">
        No ticker data available
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {tickers.map((ticker) => {
        const sentiment = parseFloat(ticker.avgSentiment);
        const isBullish = sentiment > 0.1;
        const isBearish = sentiment < -0.1;

        return (
          <div
            key={ticker.ticker}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-700">{ticker.ticker}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">${ticker.ticker}</p>
                <p className="text-xs text-gray-500">
                  {ticker.mentionCount} mentions · {ticker.postCount} posts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isBullish && <TrendingUp className="w-5 h-5 text-green-600" />}
              {isBearish && <TrendingDown className="w-5 h-5 text-red-600" />}
              <span
                className={`text-sm font-semibold ${
                  isBullish
                    ? 'text-green-600'
                    : isBearish
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {sentiment > 0 ? '+' : ''}
                {(sentiment * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
