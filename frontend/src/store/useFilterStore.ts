import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  timeRange: number;
  selectedAccounts: string[];
  selectedTickers: string[];
  selectedSentiment: string | null;
  setTimeRange: (days: number) => void;
  setSelectedAccounts: (accounts: string[]) => void;
  setSelectedTickers: (tickers: string[]) => void;
  setSelectedSentiment: (sentiment: string | null) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      timeRange: 7,
      selectedAccounts: [],
      selectedTickers: [],
      selectedSentiment: null,
      setTimeRange: (days) => set({ timeRange: days }),
      setSelectedAccounts: (accounts) => set({ selectedAccounts: accounts }),
      setSelectedTickers: (tickers) => set({ selectedTickers: tickers }),
      setSelectedSentiment: (sentiment) => set({ selectedSentiment: sentiment }),
      clearFilters: () =>
        set({
          selectedAccounts: [],
          selectedTickers: [],
          selectedSentiment: null,
        }),
    }),
    {
      name: 'linda-filters',
    },
  ),
);
