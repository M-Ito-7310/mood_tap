'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * BaseLayout - Main application layout with gradient background
 *
 * This component provides the foundational layout structure for all pages,
 * including the gradient background and proper content containment.
 */
export function BaseLayout({ children, className = '' }: BaseLayoutProps) {
  const { themeGradient } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR/初回レンダリング時はデフォルトテーマ
  const gradient = mounted ? themeGradient : 'from-blue-50 via-purple-50 to-pink-50';

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${gradient} ${className}`}>
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
