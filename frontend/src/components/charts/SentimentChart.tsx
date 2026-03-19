'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SentimentChartProps {
  data: Array<{ sentiment: string; count: string; avgScore: string }>;
}

const COLORS = {
  bullish: '#10b981',
  bearish: '#ef4444',
  neutral: '#94a3b8',
};

export function SentimentChart({ data }: SentimentChartProps) {
  const chartData = data.map((item) => ({
    name: item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1),
    value: parseInt(item.count),
    sentiment: item.sentiment,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400">
        No sentiment data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment as keyof typeof COLORS]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
