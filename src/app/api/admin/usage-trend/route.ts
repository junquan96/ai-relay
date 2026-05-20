// ============================================================
// AI API Relay — Admin Usage Trend API (/api/admin/usage-trend)
// ============================================================

import { NextRequest } from 'next/server';
import { getUsageTrend } from '@/lib/usage';

export const runtime = 'edge';

/**
 * GET /api/admin/usage-trend?range=7d|30d
 *
 * Returns daily token consumption trend data:
 * - Global daily usage (requests, promptTokens, completionTokens)
 * - Per-provider breakdown
 *
 * Requires Bearer token authentication (same RELAY_API_KEY).
 */
export async function GET(request: NextRequest) {
  // Auth check — require RELAY_API_KEY
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '') || '';
  const validKeys = (process.env.RELAY_API_KEY || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  if (!token || !validKeys.includes(token)) {
    return Response.json(
      { error: { message: 'Unauthorized. Use Bearer token.', code: 401 } },
      { status: 401 }
    );
  }

  // Parse range parameter
  const { searchParams } = new URL(request.url);
  const rangeParam = searchParams.get('range');
  const range: '7d' | '30d' = rangeParam === '30d' ? '30d' : '7d';

  const trend = await getUsageTrend(range);

  return Response.json({
    range,
    ...trend,
  });
}
