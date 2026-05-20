// ============================================================
// AI API Relay — Usage Tracking (Vercel KV)
// ============================================================

import type { UsageRecord } from './types';

/**
 * Try to get the KV client. Returns null if KV is not configured
 * (e.g., local dev without KV). Graceful degradation.
 */
async function getKV() {
  try {
    // Dynamic import — only works when @vercel/kv is configured
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch {
    return null;
  }
}

/**
 * Get today's date string in YYYY-MM-DD format.
 */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Record a completed request's usage.
 * Called asynchronously — failures are silently ignored (non-critical path).
 */
export async function recordUsage(
  keyHash: string,
  tokens: { prompt: number; completion: number }
): Promise<void> {
  try {
    const kv = await getKV();
    if (!kv) return; // KV not configured — skip

    const date = today();
    const totalTokens = tokens.prompt + tokens.completion;

    // Per-key daily usage
    const keyDailyKey = `usage:${keyHash}:daily:${date}`;
    await kv.hincrby(keyDailyKey, 'requests', 1);
    await kv.hincrby(keyDailyKey, 'tokens', totalTokens);
    await kv.expire(keyDailyKey, 86400 * 7); // 7 day TTL

    // Per-key total usage
    const keyTotalKey = `usage:${keyHash}:total`;
    await kv.hincrby(keyTotalKey, 'requests', 1);
    await kv.hincrby(keyTotalKey, 'tokens', totalTokens);

    // Global daily usage
    const globalDailyKey = `usage:daily:${date}`;
    await kv.hincrby(globalDailyKey, 'requests', 1);
    await kv.hincrby(globalDailyKey, 'tokens', totalTokens);
    await kv.expire(globalDailyKey, 86400 * 30); // 30 day TTL
  } catch {
    // Usage tracking is non-critical — never break the request
  }
}

/**
 * Get usage stats for a specific key.
 */
export async function getKeyUsage(keyHash: string): Promise<{
  daily: UsageRecord;
  total: UsageRecord;
} | null> {
  try {
    const kv = await getKV();
    if (!kv) return null;

    const date = today();
    const dailyRaw = await kv.hgetall(`usage:${keyHash}:daily:${date}`);
    const totalRaw = await kv.hgetall(`usage:${keyHash}:total`);

    return {
      daily: {
        requests: Number(dailyRaw?.requests || 0),
        tokens: Number(dailyRaw?.tokens || 0),
        lastUsed: Date.now(),
      },
      total: {
        requests: Number(totalRaw?.requests || 0),
        tokens: Number(totalRaw?.tokens || 0),
        lastUsed: Date.now(),
      },
    };
  } catch {
    return null;
  }
}

/**
 * Get global daily usage stats.
 */
export async function getGlobalUsage(): Promise<UsageRecord | null> {
  try {
    const kv = await getKV();
    if (!kv) return null;

    const date = today();
    const raw = await kv.hgetall(`usage:daily:${date}`);

    return {
      requests: Number(raw?.requests || 0),
      tokens: Number(raw?.tokens || 0),
      lastUsed: Date.now(),
    };
  } catch {
    return null;
  }
}
