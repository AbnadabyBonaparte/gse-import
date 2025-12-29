# 🏎️ MATRIZ GÊNESIS GSE IMPORT
## As 6 Leis Sagradas da Máquina Autônoma

> **"Se existe no mundo, chega na sua garagem."**

---

**Autor:** Leonidas  
**Data de Criação:** 27 de Janeiro de 2025  
**Versão:** 1.0.0 - Gênesis  
**Status:** INVOLÁVEL

---

## 🛡️ PREÂMBULO

Esta é a **Matriz Gênesis** do GSE Import — Global Sourcing Engine.  
Não é um documento. É um **manifesto de guerra** contra a mediocridade do mercado automotivo brasileiro.

Aqui estão as **6 Leis Sagradas** que regem cada linha de código, cada decisão, cada pedido processado.

**Violar uma Lei Sagrada é trair a visão. Não há perdão. Não há segunda chance.**

---

## ⚡ LEI 1: AUTONOMIA ABSOLUTA

### "90% dos pedidos devem ser processados sem toque humano."

**O que significa:**
- O GSE Import não é uma plataforma. É uma **máquina autônoma**.
- De foto até entrega, o sistema deve operar sozinho.
- Intervenção humana apenas em casos excepcionais (flag de revisão).

**Métricas obrigatórias:**
- **Meta:** 90% de pedidos processados automaticamente
- **Tolerância:** 10% para revisão humana (peças raras, divergências graves)
- **Medição:** Dashboard em tempo real mostra % de autonomia

**Implementação:**
- Agentes CORE (Concierge, Hunter, Fiscal, Auditor) operam 24/7
- Agente GUARD bloqueia automaticamente transações suspeitas
- Agente ANALYST otimiza rotas e preços sem intervenção
- Workflows n8n orquestram todo o fluxo end-to-end

**Violação desta lei:**
- Se mais de 15% dos pedidos precisarem de intervenção manual → **FALHA CRÍTICA**
- Se qualquer etapa crítica depender de ação humana → **REGRESSÃO**

**Esta é a primeira e mais importante lei. Sem autonomia, não há GSE Import.**

---

## 💰 LEI 2: CUSTO TOTAL GARANTIDO

### "GSE cobre a diferença se o imposto exceder o cálculo."

**O que significa:**
- O cliente paga o valor cotado. Ponto final.
- Se a Receita Federal cobrar mais impostos → GSE assume a diferença.
- Se o frete for maior → GSE assume a diferença (até limite definido).

**Limites de garantia:**
- **Diferença de imposto:** GSE cobre até R$ 800,00
- **Acima de R$ 800,00:** Negociação 50/50 com cliente
- **Frete:** GSE cobre até 20% de variação
- **Extravio total:** Seguro obrigatório cobre 100%

**Implementação:**
- Agente Fiscal calcula impostos com margem de segurança (3% sobre PTAX)
- Sistema de escrow (Stripe Connect) retém fundos até aprovação final
- Dashboard mostra "Custo Total Garantido" em destaque
- Contrato digital com termos claros

**Violação desta lei:**
- Se cliente pagar mais que o cotado sem acordo → **REEMBOLSO TOTAL + COMPENSAÇÃO**
- Se garantia não for cumprida → **FALHA OPERACIONAL CRÍTICA**

**Esta é a promessa que não pode ser quebrada. É o diferencial que vence a concorrência.**

---

## 🔥 LEI 3: DADOS 100% REAIS

### "Zero mock. Zero fake. Zero placeholder. Apenas dados reais."

**O que significa:**
- Nenhum dado de teste em produção.
- Nenhum mock data em código.
- Nenhum placeholder ou exemplo hardcoded.
- Apenas dados reais de APIs, banco de dados e clientes.

**Implementação:**
- Queries Supabase sempre retornam dados reais
- APIs externas (Serper, OpenAI, Stripe) sempre chamadas (não mockadas)
- Testes usam ambiente de staging com dados reais
- Seed scripts populam banco com dados realistas (não fake)

**Palavras proibidas no código:**
- ❌ `mock`, `fake`, `dummy`, `sample`, `test`, `example`, `placeholder`
- ❌ `TODO`, `FIXME`, `HACK`, `XXX`
- ✅ Apenas dados reais ou seed scripts documentados

**Validação:**
- Pre-commit hook verifica palavras proibidas
- Linter rejeita qualquer mock data
- Code review obrigatório para garantir dados reais

**Violação desta lei:**
- Se mock data for encontrado em produção → **REGRESSÃO IMEDIATA**
- Se placeholder for commitado → **REJEIÇÃO DO PR**

**Dados reais geram confiança. Dados fake geram desconfiança. Não há meio termo.**

---

## 🛡️ LEI 4: SEGURANÇA TRANSACIONAL INQUEBRÁVEL

### "Smart Escrow + Auditor Vision + Guard Antifraude = Zero Golpes."

**O que significa:**
- Cada transação é protegida por 3 camadas de segurança.
- Smart Escrow retém pagamento até aprovação.
- Auditor Vision valida fotos automaticamente.
- Guard Antifraude bloqueia transações suspeitas.

**Camadas de segurança:**

**1. Smart Escrow (Stripe Connect):**
- Pagamento fica em garantia até cliente aprovar inspeção
- Liberação automática após aprovação do Auditor
- Reembolso automático se reprovado

**2. Auditor Vision (GPT-4o Vision):**
- Analisa fotos da inspeção automaticamente
- Compara com catálogo original
- Aprova/reprova com nível de confiança (0-100%)
- Se confiança < 90% → flag para revisão humana

**3. Guard Antifraude:**
- Analisa histórico do vendedor (eBay, etc.)
- Verifica padrões suspeitos (preço muito baixo, conta nova, etc.)
- Bloqueia automaticamente transações de alto risco
- Notifica equipe para casos críticos

**Implementação:**
- Agente Guard roda antes de cada compra
- Agente Auditor valida todas as fotos de inspeção
- Smart Escrow configurado no Stripe Connect
- Dashboard mostra status de segurança de cada pedido

**Violação desta lei:**
- Se golpe passar pelo sistema → **ANÁLISE CRÍTICA + CORREÇÃO IMEDIATA**
- Se segurança for comprometida → **PARADA DE OPERAÇÕES ATÉ CORREÇÃO**

**Segurança não é opcional. É a base da confiança. Sem segurança, não há negócio.**

---

## ⚖️ LEI 5: CONFORMIDADE AUTOMÁTICA

### "Validação NCM e regras da Receita Federal automáticas."

**O que significa:**
- Sistema valida NCM automaticamente antes de comprar.
- Verifica restrições de importação automaticamente.
- Calcula impostos conforme regras atuais da Receita.
- Bloqueia peças proibidas automaticamente.

**Implementação:**
- Agente Fiscal classifica NCM via IA (GPT-4o)
- Base de dados NCM atualizada (Supabase)
- Validação de restrições (peças proibidas, limites, etc.)
- Cálculo de impostos conforme tabela oficial
- Bloqueio automático de peças não permitidas

**Validações automáticas:**
- ✅ NCM válido e atualizado
- ✅ Peça não está na lista de proibidas
- ✅ Valor dentro dos limites permitidos
- ✅ Documentação necessária (se aplicável)
- ✅ Impostos calculados corretamente

**Violação desta lei:**
- Se peça proibida for processada → **BLOQUEIO IMEDIATO + NOTIFICAÇÃO**
- Se cálculo de imposto estiver errado → **CORREÇÃO + REVISÃO DO AGENTE FISCAL**

**Conformidade não é burocracia. É proteção. Proteção para o cliente e para o GSE.**

---

## 📈 LEI 6: MARGEM > VOLUME

### "Foco em pedidos de alto valor. Qualidade sobre quantidade."

**O que significa:**
- Não competimos por volume. Competimos por margem.
- Pedidos de alto valor (>R$ 2.000) são prioridade.
- Ticket mínimo: R$ 1.200
- Margem mínima por pedido: R$ 600 líquido

**Estratégia:**
- **Peças baratas (<R$ 1.200):** Recusar ou sugerir consolidação
- **Peças médias (R$ 1.200 - R$ 2.000):** Aceitar com margem mínima
- **Peças premium (>R$ 2.000):** Prioridade máxima, margem otimizada

**Métricas:**
- Ticket médio: R$ 2.500 - R$ 3.500
- Margem média: 25-35%
- Margem mínima aceita: R$ 600 por pedido
- Meta de receita: R$ 12.500/mês (5 pedidos de R$ 2.500)

**Implementação:**
- Agente Analyst calcula margem antes de aceitar pedido
- Dashboard mostra margem projetada em tempo real
- Sistema sugere upsell para aumentar ticket
- Recusa automática de pedidos abaixo do mínimo

**Violação desta lei:**
- Se margem média cair abaixo de 20% → **REVISÃO DE ESTRATÉGIA**
- Se ticket médio cair abaixo de R$ 2.000 → **ANÁLISE DE CAUSAS**

**Volume sem margem é trabalho de graça. Margem sem volume é sustentável.**

---

## 🎯 CONCLUSÃO

Estas são as **6 Leis Sagradas** do GSE Import.

Elas não são sugestões. São **mandamentos**.

Violar uma lei é quebrar a confiança. Quebrar a confiança é matar o negócio.

**Cada linha de código deve honrar estas leis.**  
**Cada decisão deve respeitar estas leis.**  
**Cada pedido deve seguir estas leis.**

---

## 📜 JURAMENTO DO DESENVOLVEDOR

Ao trabalhar no GSE Import, você jura:

- ✅ Respeitar a **Autonomia Absoluta** (Lei 1)
- ✅ Garantir o **Custo Total Garantido** (Lei 2)
- ✅ Usar apenas **Dados 100% Reais** (Lei 3)
- ✅ Manter **Segurança Inquebrável** (Lei 4)
- ✅ Garantir **Conformidade Automática** (Lei 5)
- ✅ Priorizar **Margem sobre Volume** (Lei 6)

**Quebrou uma lei? Corrija imediatamente. Não há desculpas.**

---

**Leonidas**  
**27 de Janeiro de 2025**  
**GSE Import - A Máquina que Roda Sozinha** 🏎️🔥

---

*"Se existe no mundo, chega na sua garagem. Com autonomia. Com garantia. Com segurança."*

