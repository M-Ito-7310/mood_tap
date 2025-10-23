import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MoodTap - 3秒で心の健康を可視化',
  description: 'たった3秒で、心の健康を可視化する',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
