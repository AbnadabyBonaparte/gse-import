# Estrutura do Projeto GSE 1000

```
gse-import/
├── README.md
├── .cursorrules                ✅ Regras de governança ALSHAM-360-PRIMA
├── env.template                # Template de variáveis de ambiente
├── docker-compose.yml          # n8n local (opcional, usando cloud no MVP)
│
├── governance/                  ✅ MATRIZ GÊNESIS - Governança completa
│   ├── MATRIZ_GENESE_GSE.md    ✅ 6 Leis Sagradas
│   ├── AI_ABSTRACTION.md       ✅ Abstração de IA provider-agnostic
│   └── CLAUDE.md               ✅ Checklist e regras absolutas
│
├── docs/                       # Documentação estratégica (já existe)
│
├── infrastructure/
│   ├── n8n/
│   │   ├── workflows/          # Workflows exportados do n8n
│   │   │   ├── concierge_mvp.json  ✅ PRONTO - Importar no n8n cloud
│   │   │   ├── concierge.json      # (futuro)
│   │   │   ├── hunter.json         # (futuro)
│   │   │   ├── fiscal.json         # (futuro)
│   │   │   └── auditor.json         # (futuro)
│   │   └── README.md          # Guia de workflows
│   │
│   ├── supabase/
│   │   ├── migrations/         # Migrations SQL
│   │   │   ├── 001_initial_schema.sql
│   │   │   └── 002_add_indexes.sql
│   │   └── functions/          # Edge Functions (se necessário)
│   │
│   └── docker/
│       └── n8n.dockerfile
│
├── agents/                     # Código dos agentes (se necessário Python/Node)
│   ├── hunter/
│   │   ├── __init__.py
│   │   ├── search_engine.py
│   │   └── filters.py
│   │
│   ├── fiscal/
│   │   ├── __init__.py
│   │   ├── ncm_classifier.py
│   │   └── tax_calculator.py
│   │
│   ├── concierge/
│   │   ├── __init__.py
│   │   ├── vision_identifier.py
│   │   └── message_handler.py
│   │
│   └── auditor/
│       ├── __init__.py
│       └── photo_validator.py
│
├── frontend/                    # Frontend (Next.js 15 + shadcn/ui)
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── page.tsx        # Home/Scanner
│   │   │   ├── quote/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── tracking/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components (não modificar)
│   │   │   ├── core/           # Componentes customizados GSE
│   │   │   │   ├── scanner/
│   │   │   │   │   └── PartScanner.tsx
│   │   │   │   ├── quote/
│   │   │   │   │   └── QuoteCard.tsx
│   │   │   │   └── tracking/
│   │   │   │       └── TrackingTimeline.tsx
│   │   │   └── layout/         # Layout components
│   │   │
│   │   ├── lib/
│   │   │   ├── ai/             # Abstração de IA (provider-agnostic)
│   │   │   │   ├── providers/  # OpenAI, Anthropic, Google, Grok
│   │   │   │   ├── types.ts
│   │   │   │   ├── config.ts
│   │   │   │   └── client.ts   # Factory pattern
│   │   │   ├── supabase/        # Cliente Supabase + queries
│   │   │   │   ├── client.ts
│   │   │   │   └── queries/     # Queries type-safe (Drizzle)
│   │   │   ├── config/          # Configurações (não hardcoded)
│   │   │   └── utils/           # Utilitários
│   │   │
│   │   ├── agents/              # Agentes (squad pattern)
│   │   │   ├── core/            # Operacional
│   │   │   │   ├── concierge/
│   │   │   │   ├── hunter/
│   │   │   │   ├── fiscal/
│   │   │   │   └── auditor/
│   │   │   ├── guard/            # Segurança
│   │   │   │   ├── antifraud/
│   │   │   │   └── escrow/
│   │   │   └── analyst/         # Inteligência
│   │   │       ├── margin/
│   │   │       └── optimization/
│   │   │
│   │   ├── hooks/               # React hooks customizados
│   │   ├── types/               # TypeScript types (shared)
│   │   │
│   │   └── styles/
│   │       ├── globals.css      # Tailwind base
│   │       └── design-system.css  # CSS variables (Design System)
│   │
│   ├── tailwind.config.ts       # Config com CSS variables
│   ├── package.json
│   └── next.config.js
│
├── prompts/                     # Prompts otimizados para agentes
│   └── concierge_system_prompt.md  ✅ Prompt do Concierge
│
├── data/                        # Dados estáticos
│   ├── ncm_database.csv        # Base de NCMs (futuro)
│   └── part_catalog/           # Catálogos de peças (futuro)
│
├── scripts/                     # Scripts utilitários
│   ├── setup_n8n.sh           # Setup local (opcional)
│   ├── test_concierge.ps1     ✅ Teste PowerShell (Windows)
│   ├── test_concierge.sh      ✅ Teste Bash (Linux/Mac)
│   ├── seed_database.py        # (futuro)
│   └── test_agents.py          # (futuro)
│
└── tests/                       # Testes
    ├── agents/
    └── integration/
```

## Arquivos Críticos - Status Atual

### ✅ Governança (100% Completo)
1. ✅ `.cursorrules` - Regras de governança ALSHAM-360-PRIMA
2. ✅ `governance/MATRIZ_GENESE_GSE.md` - 6 Leis Sagradas
3. ✅ `governance/AI_ABSTRACTION.md` - Abstração de IA provider-agnostic
4. ✅ `governance/CLAUDE.md` - Checklist e regras absolutas

### ✅ Infraestrutura (MVP Concierge)
1. ✅ `infrastructure/n8n/workflows/concierge_mvp.json` - Workflow pronto para importar
2. ✅ `infrastructure/supabase/migrations/001_initial_schema.sql` - Schema do banco
3. ✅ `prompts/concierge_system_prompt.md` - Prompt otimizado
4. ✅ `scripts/test_concierge.ps1` - Script de teste PowerShell
5. ✅ `scripts/test_concierge.sh` - Script de teste Bash

### 🚧 Próximos a Criar (Seguindo Governança)
1. 🚧 `frontend/src/app/page.tsx` - Página inicial com scanner (Next.js 15 + shadcn/ui)
2. 🚧 `frontend/src/lib/ai/` - Abstração de IA (provider-agnostic)
3. 🚧 `frontend/src/lib/supabase/` - Cliente Supabase com Drizzle ORM
4. 🚧 `frontend/src/agents/core/` - Agentes CORE (Concierge, Hunter, Fiscal, Auditor)
5. 🚧 `frontend/src/styles/design-system.css` - CSS variables (Design System)

## 🛡️ Governança Estabelecida

**Status:** Governança 100% completa. Código 0% (aguardando implementação).

**Leis Sagradas:**
1. **Autonomia Absoluta** - 90% dos pedidos sem toque humano
2. **Custo Total Garantido** - GSE cobre diferença de taxação
3. **Dados 100% Reais** - Zero mock, zero fake
4. **Segurança Inquebrável** - Smart Escrow + Auditor + Guard
5. **Conformidade Automática** - Validação NCM e Receita
6. **Margem > Volume** - Foco em pedidos de alto valor

**Regras Críticas:**
- ✅ Zero hardcoded (impostos, NCM, URLs, cores)
- ✅ Zero mock data (apenas dados reais)
- ✅ Queries Supabase com filtro `org_id` obrigatório
- ✅ Cores via CSS variables (Design System)
- ✅ Componentes shadcn/ui (não criar do zero)
- ✅ Stack imutável (Next.js 15 + Supabase + Drizzle + n8n)

**Leia antes de qualquer alteração:**
- [`governance/CLAUDE.md`](governance/CLAUDE.md) - Checklist obrigatório
- [`.cursorrules`](.cursorrules) - Regras detalhadas

