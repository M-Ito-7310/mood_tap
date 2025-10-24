'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeType, THEMES } from '@/types/theme';

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeGradient: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'moodtap-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [mounted, setMounted] = useState(false);

  // 初期テーマ読み込み
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType;
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  // テーマ変更
  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  const themeGradient = THEMES[currentTheme].gradient;

  // SSR対策: マウント前はデフォルトテーマを表示
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          currentTheme: 'default',
          setTheme,
          themeGradient: THEMES.default.gradient,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeGradient }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // デフォルト値を返す（ThemeProviderの外側で使用された場合）
    return {
      currentTheme: 'default' as ThemeType,
      setTheme: () => {},
      themeGradient: THEMES.default.gradient,
    };
  }
  return context;
}
