'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { cn } from '@/lib/utils';

const timeRanges = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export function TimeRangeSelector() {
  const { timeRange, setTimeRange } = useFilterStore();

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
      {timeRanges.map((range) => (
        <button
          key={range.days}
          onClick={() => setTimeRange(range.days)}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition',
            timeRange === range.days
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100',
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
