'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DailyUsagePoint {
  date: string;
  requests: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface ProviderDailyUsage {
  provider: string;
  data: DailyUsagePoint[];
}

interface UsageTrendData {
  range: '7d' | '30d';
  global: DailyUsagePoint[];
  providers: ProviderDailyUsage[];
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: '#10b981',
  anthropic: '#f59e0b',
  deepseek: '#3b82f6',
  xiaomi: '#ef4444',
};

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  deepseek: 'DeepSeek',
  xiaomi: 'Xiaomi',
};

const PROMPT_COLOR = '#3b82f6';
const COMPLETION_COLOR = '#8b5cf6';

interface TokenTrendChartProps {
  apiKey: string;
}

export default function TokenTrendChart({ apiKey }: TokenTrendChartProps) {
  const [data, setData] = useState<UsageTrendData | null>(null);
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/usage-trend?range=${range}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) throw new Error('Failed to fetch trend data');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError('Failed to load trend data');
    } finally {
      setLoading(false);
    }
  }, [apiKey, range]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  const fmtTokens = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const fmtDate = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  // Get chart data based on selected provider
  const chartData = (() => {
    if (!data) return [];
    if (selectedProvider === 'all') {
      return data.global;
    }
    const provider = data.providers.find((p) => p.provider === selectedProvider);
    return provider?.data || [];
  })();

  // Available providers (including 'all')
  const availableProviders = data
    ? ['all', ...data.providers.map((p) => p.provider)]
    : ['all'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        backgroundColor: '#1a1a2e',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        fontSize: '0.85rem',
      }}>
        <div style={{ color: '#888', marginBottom: '0.5rem' }}>{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} style={{ color: entry.color, marginBottom: '0.25rem' }}>
            {entry.name}: {fmtTokens(entry.value)}
          </div>
        ))}
        {payload.length >= 2 && (
          <div style={{ color: '#666', marginTop: '0.5rem', borderTop: '1px solid #333', paddingTop: '0.5rem' }}>
            Total: {fmtTokens(payload.reduce((sum: number, p: any) => sum + p.value, 0))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section style={{
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #333',
      backgroundColor: '#111',
      marginBottom: '1.5rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: 0, margin: 0 }}>
          📉 Token Consumption Trend
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Provider filter */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {availableProviders.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProvider(p)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: selectedProvider === p ? 'none' : '1px solid #333',
                  backgroundColor: selectedProvider === p
                    ? (p === 'all' ? '#2563eb' : (PROVIDER_COLORS[p] || '#2563eb'))
                    : 'transparent',
                  color: selectedProvider === p ? 'white' : '#888',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {p === 'all' ? 'All' : (PROVIDER_DISPLAY_NAMES[p] || p)}
              </button>
            ))}
          </div>
          {/* Range selector */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {(['7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: range === r ? 'none' : '1px solid #333',
                  backgroundColor: range === r ? '#2563eb' : 'transparent',
                  color: range === r ? 'white' : '#888',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {r === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          Loading trend data...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {!loading && !error && data && chartData.length > 0 && (
        <>
          {/* Provider-specific chart: single line showing total tokens */}
          {selectedProvider !== 'all' ? (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradPrompt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PROMPT_COLOR} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={PROMPT_COLOR} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COMPLETION_COLOR} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COMPLETION_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis
                  dataKey="date"
                  tickFormatter={fmtDate}
                  stroke="#555"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={fmtTokens}
                  stroke="#555"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '0.85rem', color: '#888' }}
                />
                <Area
                  type="monotone"
                  dataKey="promptTokens"
                  name="Prompt Tokens"
                  stroke={PROMPT_COLOR}
                  fill="url(#gradPrompt)"
                  strokeWidth={2}
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="completionTokens"
                  name="Completion Tokens"
                  stroke={COMPLETION_COLOR}
                  fill="url(#gradCompletion)"
                  strokeWidth={2}
                  stackId="1"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            /* All providers: stacked area by provider */
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis
                  dataKey="date"
                  tickFormatter={fmtDate}
                  stroke="#555"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={fmtTokens}
                  stroke="#555"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalTokens"
                  name="Total Tokens"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Provider breakdown mini cards */}
          {selectedProvider === 'all' && data.providers.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
              marginTop: '1rem',
            }}>
              {data.providers.map((p) => {
                const totalTokens = p.data.reduce((sum, d) => sum + d.totalTokens, 0);
                const color = PROVIDER_COLORS[p.provider] || '#888';
                return (
                  <div
                    key={p.provider}
                    onClick={() => setSelectedProvider(p.provider)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: `1px solid ${color}33`,
                      backgroundColor: `${color}11`,
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${color}33`;
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.25rem' }}>
                      {PROVIDER_DISPLAY_NAMES[p.provider] || p.provider}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color }}>
                      {fmtTokens(totalTokens)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {!loading && !error && (!data || chartData.every((d: DailyUsagePoint) => d.totalTokens === 0)) && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>
          No usage data yet for this period
        </div>
      )}
    </section>
  );
}
