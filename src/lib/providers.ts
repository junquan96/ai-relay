// ============================================================
// AI API Relay — Provider Configuration & Routing
// ============================================================

import type { ProviderConfig, ProviderName } from './types';

/** All supported providers and their configurations */
export const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  openai: {
    name: 'openai',
    displayName: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    modelPrefixes: ['gpt-', 'o1-', 'o3-', 'o4-', 'chatgpt-', 'dall-e-'],
    headerFormat: 'openai',
    envKeyField: 'OPENAI_KEYS',
    envBaseUrlField: 'OPENAI_BASE_URL',
  },
  anthropic: {
    name: 'anthropic',
    displayName: 'Anthropic (Claude)',
    baseUrl: 'https://api.anthropic.com/v1',
    modelPrefixes: ['claude-'],
    headerFormat: 'anthropic',
    envKeyField: 'CLAUDE_KEYS',
    envBaseUrlField: 'CLAUDE_BASE_URL',
  },
  deepseek: {
    name: 'deepseek',
    displayName: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    modelPrefixes: ['deepseek-'],
    headerFormat: 'openai',
    envKeyField: 'DEEPSEEK_KEYS',
    envBaseUrlField: 'DEEPSEEK_BASE_URL',
  },
  xiaomi: {
    name: 'xiaomi',
    displayName: 'Xiaomi (MiMo)',
    baseUrl: 'https://api.xiaomi.com/v1',
    modelPrefixes: ['mimo-'],
    headerFormat: 'openai',
    envKeyField: 'XIAOMI_KEYS',
    envBaseUrlField: 'XIAOMI_BASE_URL',
  },
};

/**
 * Resolve which provider a model name belongs to.
 * Returns null if no provider matches.
 */
export function resolveProvider(model: string): ProviderConfig | null {
  const lowerModel = model.toLowerCase();
  for (const provider of Object.values(PROVIDERS)) {
    for (const prefix of provider.modelPrefixes) {
      if (lowerModel.startsWith(prefix)) {
        return provider;
      }
    }
  }
  return null;
}

/**
 * Get the upstream URL for a provider's chat completions endpoint.
 */
export function getUpstreamUrl(provider: ProviderConfig): string {
  const customBase = provider.envBaseUrlField
    ? process.env[provider.envBaseUrlField]
    : undefined;
  const base = customBase || provider.baseUrl;

  if (provider.headerFormat === 'anthropic') {
    return `${base}/messages`;
  }
  return `${base}/chat/completions`;
}
