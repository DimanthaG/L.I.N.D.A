import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function usePosts(filters?: {
  accountIds?: string[];
  startDate?: string;
  endDate?: string;
  sentiment?: string;
  tickers?: string[];
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => apiClient.getPosts(filters),
  });
}

export function useTopPosts(days: number = 7, limit: number = 20) {
  return useQuery({
    queryKey: ['posts', 'top', days, limit],
    queryFn: () => apiClient.getTopPosts(days, limit),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => apiClient.getPost(id),
    enabled: !!id,
  });
}
