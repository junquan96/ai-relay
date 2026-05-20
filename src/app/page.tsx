export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
        ⚡ AI Relay
      </h1>
      <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '2rem' }}>
        轻量级 AI API 中转服务
      </p>

      <div style={{
        maxWidth: '600px',
        width: '100%',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #333',
        backgroundColor: '#111',
      }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>📋 快速开始</h2>
        <pre style={{
          backgroundColor: '#1a1a1a',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.85rem',
          lineHeight: 1.6,
        }}>
{`curl -X POST https://your-domain.vercel.app/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
        </pre>

        <h2 style={{ fontSize: '1.2rem' }}>🔗 支持的 Provider</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Provider</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Model 前缀</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '0.5rem' }}>OpenAI</td>
              <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>gpt-*, o1-*, o3-*</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '0.5rem' }}>Anthropic</td>
              <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>claude-*</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '0.5rem' }}>DeepSeek</td>
              <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>deepseek-*</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem' }}>Xiaomi</td>
              <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>mimo-*</td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ fontSize: '1.2rem' }}>✨ 功能特性</h2>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>🔄 多 Key 自动轮换 (Round-Robin)</li>
          <li>🔀 多 Provider 自动路由</li>
          <li>📊 用量追踪 (调用次数 + Token)</li>
          <li>🔁 429/5xx 自动重试 + Key 退避</li>
          <li>📡 流式响应 (SSE) 透传</li>
          <li>🛡️ OpenAI 兼容接口</li>
        </ul>
      </div>

      <p style={{ color: '#555', marginTop: '2rem', fontSize: '0.85rem' }}>
        AI Relay v1.0 · Powered by Vercel Edge + KV
      </p>
    </main>
  );
}
