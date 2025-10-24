declare module '@ducanh2912/next-pwa' {
  import { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    sw?: string;
    scope?: string;
    reloadOnOnline?: boolean;
    cacheOnFrontEndNav?: boolean;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    cacheStartUrl?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    workboxOptions?: {
      disableDevLogs?: boolean;
      runtimeCaching?: Array<{
        urlPattern: RegExp | string;
        handler: string;
        options?: {
          cacheName?: string;
          expiration?: {
            maxEntries?: number;
            maxAgeSeconds?: number;
          };
        };
      }>;
    };
    publicExcludes?: string[];
    buildExcludes?: Array<string | RegExp>;
  }

  export default function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}
