import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'bullish':
      return 'text-bullish';
    case 'bearish':
      return 'text-bearish';
    case 'neutral':
      return 'text-neutral';
    default:
      return 'text-gray-500';
  }
}

export function getSentimentBgColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'bullish':
      return 'bg-green-100 text-green-800';
    case 'bearish':
      return 'bg-red-100 text-red-800';
    case 'neutral':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getConvictionColor(conviction: string): string {
  switch (conviction.toLowerCase()) {
    case 'high':
      return 'text-orange-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}
