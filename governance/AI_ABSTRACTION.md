# 🤖 Abstração de IA - Provider-Agnostic

**Objetivo**
Permitir troca de LLM sem quebrar os agentes (Concierge, Hunter, Fiscal, Auditor, Guard, Analyst).

**Providers Suportados**
- OpenAI (GPT-4o Vision - padrão)
- Anthropic (Claude 3.5 Sonnet)
- Google (Gemini Pro Vision)
- Grok (Grok-2)

**Estrutura Proposta**
src/lib/ai/
├── providers/
│   ├── openai/adapter.ts
│   ├── anthropic/adapter.ts
│   ├── google/adapter.ts
│   └── grok/adapter.ts
├── types.ts            # Interface comum
├── config.ts           # Configuração centralizada
├── client.ts           # Factory pattern
└── index.ts            # Export público

**Interface Comum (types.ts)**
chat(messages, options): Promise<response>
vision(messages, images, options): Promise<response>
stream(messages, options): AsyncGenerator

**Config via .env**
AI_PROVIDER=openai (default)
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GOOGLE_API_KEY=...
GROK_API_KEY=...

**Vantagens**
- Troca de provider com uma linha no .env
- Fallback automático (ex: OpenAI falha → tenta Claude)
- Métricas de custo por provider
- Testes mockam a interface comum

**Esta abstração garante que os agentes funcionem independente do provider.**


