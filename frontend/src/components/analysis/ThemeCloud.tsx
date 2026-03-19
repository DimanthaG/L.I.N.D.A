'use client';

interface Theme {
  theme: string;
  count: number;
}

interface ThemeCloudProps {
  themes: Theme[];
}

export function ThemeCloud({ themes }: ThemeCloudProps) {
  if (themes.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400">
        No theme data available
      </div>
    );
  }

  const maxCount = Math.max(...themes.map((t) => t.count));

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {themes.map((theme) => {
        const intensity = (theme.count / maxCount) * 100;
        const bgOpacity = Math.max(10, Math.min(100, intensity));

        return (
          <div
            key={theme.theme}
            className="flex items-center justify-between p-3 rounded-lg transition hover:scale-105"
            style={{
              backgroundColor: `rgba(59, 130, 246, ${bgOpacity / 100 * 0.15})`,
            }}
          >
            <span className="font-medium text-gray-900">{theme.theme}</span>
            <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
              {theme.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
