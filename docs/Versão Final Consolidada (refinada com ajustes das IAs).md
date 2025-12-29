# GSE Import - Global Sourcing Engine

**Versão Final Consolidada — 29/12/2025**  
**Autor:** Abnadaby Bonaparte  
**Status:** Core loop funcional completo (MVP técnico)

**Slogan:** "Se existe no mundo, chega na sua garagem. Com custo total garantido."

### 1. Visão Geral do Produto

O GSE Import é a primeira plataforma brasileira de importação inteligente de peças automotivas, com foco em peças raras e de alto valor.

**Core loop completo e funcional:**
1. Entrada híbrida (foto ou texto livre com marca, modelo, ano, código OEM, VIN)
2. Identificação real via modelo multimodal com visão (ex: GPT-4o Vision)
3. Busca global em marketplaces reais (eBay, RockAuto, Amazon, AliExpress, Yahoo Auctions JP)
4. Cálculo do Custo Total Garantido (impostos brasileiros reais: II, IPI, PIS/COFINS, ICMS, Siscomex + frete estimado + margem)
5. Breakdown visual premium com garantia: "GSE cobre diferença se imposto exceder cálculo"

**Stack técnica:**
- Frontend: Next.js 15 (App Router) + TypeScript strict + Tailwind CSS + shadcn/ui
- Design System: Borderless Premium (dark mode first, #00E599 neon, radius 0.75rem, Inter)
- Backend/API: Next.js API routes
- IA: Provider-agnostic (atual GPT-4o Vision + Serper.dev para busca)
- Preparado para: Supabase (auth + DB), n8n (orquestração), Stripe (pagamento)

**Arquitetura atual:**
- Modular (hooks, sub-componentes, tipos compartilhados)
- Transparente (badges de origem, relatório básico de busca)
- Conformidade total (zero hardcoded, CSS variables)

### 2. Governança Forte — Por que ela existe

Governança não é restrição — é a fundação que garante qualidade, confiabilidade e longevidade.

**Motivos principais:**
- **Zero hardcoded**: valores mudam (câmbio diário, alíquotas por lei). Hardcoded = erro silencioso = perda de confiança
- **Stack imutável**: evita dívida técnica e refatorações constantes
- **Estrutura rígida**: facilita manutenção, onboarding de IAs e devs futuros
- **Dark mode first + Borderless Premium**: UX consistente para gearhead (garagem à noite, contraste alto)
- **Auditoria constante**: mantém alinhamento em projeto solo com IA

**Resultado:**
- Código limpo, escalável e profissional
- Pronto para produção e crescimento real

### 3. Melhores Partes do Projeto (o que torna o GSE único)

1. **Core loop completo com IA real**  
   - Identificação por foto/texto + busca global + custo garantido  
   - Nenhum concorrente brasileiro entrega isso funcionando hoje

2. **Entrada híbrida inteligente**  
   - Foto + texto livre → máxima precisão, máxima chance de achar peça rara

3. **Design Borderless Premium aplicado**  
   - Dark mode, neon #00E599, animações fluidas, tipografia impactante
   - Experiência de produto global

4. **Arquitetura modular e governada**  
   - Hooks reutilizáveis, sub-componentes, tipos compartilhados
   - Código manutenível e testável

5. **Preparação para escala**  
   - Estrutura pronta para Supabase, n8n, Stripe
   - Base sólida para equipe ou automação futura

### 4. Próximo "Up" Sugerido

**Agente Concierge básico** — chat lateral que ajuda em tempo real:
- "Não achou? Me diga mais sobre o carro"
- "Quer alternativa mais barata?"
- "Dúvida no imposto? Explico"

Implementação inicial: sidebar com modelo multimodal orquestrado via n8n — custo baixo, impacto alto.

**Fim da versão final consolidada**