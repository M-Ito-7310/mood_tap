'use client';

import { ReactNode, useEffect, useState } from 'react';

interface SlideInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 400,
  className = '',
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTranslate = () => {
    if (isVisible) return 'translate-x-0 translate-y-0';

    switch (direction) {
      case 'up':
        return 'translate-y-4';
      case 'down':
        return '-translate-y-4';
      case 'left':
        return 'translate-x-4';
      case 'right':
        return '-translate-x-4';
      default:
        return 'translate-y-4';
    }
  };

  return (
    <div
      className={`transition-all ${getTranslate()} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
