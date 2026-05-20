// ============================================================
// AI API Relay — Status API (/api/status)
// ============================================================

import { NextRequest } from 'next/server';
import { getKeyPoolStats } from '@/lib/key-manager';
import { getGlobalUsage } from '@/lib/usage';
import { PROVIDERS } from '@/lib/providers';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Simple auth check (optional — could be public)
  const url = new URL(request.url);
  const showDetails = url.searchParams.get('detail') === '1';

  const providerStats = getKeyPoolStats();
  const globalUsage = await getGlobalUsage();

  const providers = Object.entries(PROVIDERS).map(([name, config]) => {
    const stats = providerStats[name];
    return {
      name: config.displayName,
      keyCount: stats?.total || 0,
      availableKeys: stats?.available || 0,
      configured: !!process.env[config.envKeyField],
    };
  });

  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers,
    usage: globalUsage || { requests: 0, tokens: 0 },
  });
}
