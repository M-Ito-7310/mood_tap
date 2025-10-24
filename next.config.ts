import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Turbopack設定を追加（Next.js 16対応）
  turbopack: {},
  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withPWA(nextConfig);
