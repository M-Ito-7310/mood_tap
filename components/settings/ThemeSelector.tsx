'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { THEMES, ThemeType } from '@/types/theme';

export function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        お好みのカラーテーマを選択してください
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.values(THEMES).map((theme) => {
          const isActive = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id as ThemeType)}
              className={`p-4 rounded-lg transition-all ${
                isActive
                  ? 'border-2 border-blue-500 shadow-lg'
                  : 'border-2 border-gray-200 hover:border-gray-300 hover:shadow'
              }`}
            >
              <div
                className={`w-full h-16 bg-gradient-to-br ${theme.gradient} rounded mb-3`}
              ></div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  {theme.name}
                  {isActive && <span className="text-blue-500">✓</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {theme.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
