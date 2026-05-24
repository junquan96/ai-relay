import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Relay — Lightweight Open-Source AI API Relay',
  description: '轻量级开源 AI API 中转服务，支持多 Provider 路由、Key 轮换、Fallback、Admin 后台与用量追踪。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#0a0a0f',
        color: '#e0e0e0',
      }}>
        {children}
      </body>
    </html>
  );
}
