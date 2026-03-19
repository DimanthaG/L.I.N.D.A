import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useSentimentTrends(days: number = 7) {
  return useQuery({
    queryKey: ['analysis', 'sentiment', days],
    queryFn: () => apiClient.getSentimentTrends(days),
  });
}

export function useTrendingTickers(days: number = 7, limit: number = 20) {
  return useQuery({
    queryKey: ['analysis', 'tickers', days, limit],
    queryFn: () => apiClient.getTrendingTickers(days, limit),
  });
}

export function useSectorDistribution(days: number = 7) {
  return useQuery({
    queryKey: ['analysis', 'sectors', days],
    queryFn: () => apiClient.getSectorDistribution(days),
  });
}

export function useTrendingThemes(days: number = 7, limit: number = 15) {
  return useQuery({
    queryKey: ['analysis', 'themes', days, limit],
    queryFn: () => apiClient.getTrendingThemes(days, limit),
  });
}
