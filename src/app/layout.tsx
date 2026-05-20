import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Relay — API 中转站',
  description: '轻量级 AI API 中转服务，支持多 Provider、Key 轮换、用量追踪',
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
        backgroundColor: '#0a0a0a',
        color: '#e0e0e0',
      }}>
        {children}
      </body>
    </html>
  );
}
