# AI Relay ⚡

轻量级 AI API 中转服务，部署在 Vercel (Edge Runtime + KV)。

## 特性

- 🔄 **多 Key 轮换** — Round-Robin + 429 自动退避
- 🔀 **多 Provider 路由** — OpenAI / Claude / DeepSeek / MiMo
- 📊 **用量追踪** — 调用次数 + Token 用量 (Vercel KV)
- 📡 **流式响应** — SSE 透传
- 🛡️ **OpenAI 兼容** — 直接用 OpenAI SDK 对接

## 快速开始

### 1. 克隆 & 安装

```bash
git clone https://github.com/ParsifalC/ai-relay.git
cd ai-relay
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
# 编辑 .env.local 填入你的 API Keys
```

### 3. 本地开发

```bash
npm run dev
# 访问 http://localhost:3000
```

### 4. 部署到 Vercel

```bash
npx vercel
```

## 使用方法

```bash
curl -X POST https://your-domain.vercel.app/v1/chat/completions \
  -H "Authorization: Bearer YOUR_RELAY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### 使用 OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_RELAY_API_KEY",
    base_url="https://your-domain.vercel.app/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## 支持的模型

| 前缀 | Provider |
|------|---------|
| `gpt-*`, `o1-*`, `o3-*` | OpenAI |
| `claude-*` | Anthropic |
| `deepseek-*` | DeepSeek |
| `mimo-*` | Xiaomi |

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `RELAY_API_KEY` | 客户端认证 Key (逗号分隔多个) | ✅ |
| `OPENAI_KEYS` | OpenAI API Keys (逗号分隔) | ⬜ |
| `CLAUDE_KEYS` | Anthropic API Keys | ⬜ |
| `DEEPSEEK_KEYS` | DeepSeek API Keys | ⬜ |
| `XIAOMI_KEYS` | Xiaomi API Keys | ⬜ |

## 技术栈

- Next.js 14+ (App Router)
- Vercel Edge Runtime
- Vercel KV (Redis)
- TypeScript strict mode

## License

MIT
