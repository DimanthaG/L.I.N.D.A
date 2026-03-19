import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useCurrentStrategy() {
  return useQuery({
    queryKey: ['strategy', 'current'],
    queryFn: () => apiClient.getCurrentStrategy(),
  });
}

export function useStrategyHistory(limit: number = 10) {
  return useQuery({
    queryKey: ['strategy', 'history', limit],
    queryFn: () => apiClient.getStrategyHistory(limit),
  });
}

export function useGenerateStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (days?: number) => apiClient.generateStrategy(days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategy'] });
    },
  });
}

export function useSaveStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ strategyId, notes }: { strategyId: string; notes?: string }) =>
      apiClient.saveStrategy(strategyId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategy', 'saved'] });
    },
  });
}

export function useSavedStrategies() {
  return useQuery({
    queryKey: ['strategy', 'saved'],
    queryFn: () => apiClient.getSavedStrategies(),
  });
}
