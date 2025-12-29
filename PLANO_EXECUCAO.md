# 🚀 Plano de Execução GSE 1000 - Próximos Passos

## Status Atual
✅ **Documentação 100% completa**  
❌ **Código 0% implementado**  
🎯 **Meta: Protótipo funcional mínimo em 6 semanas**

---

## Fase 1: Fundação (Semanas 1-2)

### ✅ Passo 1: Setup do Repositório
- [x] Estrutura de pastas criada
- [x] Docker Compose configurado
- [x] Schema do banco definido
- [ ] Executar `scripts/setup_n8n.sh`
- [ ] Configurar variáveis de ambiente (.env)

### ✅ Passo 2: Infraestrutura Core
- [ ] Instalar n8n via Docker
- [ ] Criar projeto no Supabase
- [ ] Executar migration `001_initial_schema.sql`
- [ ] Testar conexão n8n ↔ Supabase

### ✅ Passo 3: Agente Concierge MVP
- [ ] Criar workflow n8n básico:
  - Webhook recebe mensagem WhatsApp
  - Extrai foto/VIN
  - Chama `agents/concierge/vision_identifier.py` (ou API)
  - Responde ao cliente
- [ ] Testar end-to-end: foto → identificação → resposta

**Deliverable Semana 2:** Cliente manda foto → recebe identificação da peça

---

## Fase 2: Automação de Sourcing (Semanas 3-4)

### ✅ Passo 4: Agente Hunter
- [ ] Integrar Serper.dev no n8n
- [ ] Criar workflow: recebe peça identificada → busca global → retorna top 3
- [ ] Salvar resultados no Supabase (tabela `quotes`)
- [ ] Testar busca real em eBay/RockAuto

### ✅ Passo 5: Agente Fiscal
- [ ] Criar workflow: recebe peça + preço → calcula impostos → gera cotação
- [ ] Integrar `agents/fiscal/tax_calculator.py`
- [ ] Gerar PDF de cotação (usar biblioteca Python ou n8n)
- [ ] Testar cálculo com peça real

### ✅ Passo 6: Frontend Básico
- [ ] Setup Next.js + Tailwind + shadcn/ui
- [ ] Página inicial: Scanner de peça (upload foto)
- [ ] Página de cotação: exibir resultado do n8n
- [ ] Integrar com Supabase (ler pedidos/cotações)

**Deliverable Semana 4:** Fluxo completo: foto → busca → cotação → exibição web

---

## Fase 3: Automação Completa (Semanas 5-6)

### ✅ Passo 7: Pagamento
- [ ] Integrar Stripe Connect no n8n
- [ ] Workflow: cotação aprovada → gera link pagamento → webhook confirma → libera próxima etapa
- [ ] Salvar pagamento no Supabase (tabela `payments`)

### ✅ Passo 8: Agente Auditor
- [ ] Criar workflow: recebe fotos inspeção → GPT-4o Vision valida → aprova/reprova
- [ ] Sistema de alertas para revisão humana
- [ ] Integrar com tabela `inspections`

### ✅ Passo 9: Rastreio Automático
- [ ] Integrar Shippo ou API forwarder
- [ ] Workflow: pedido aprovado → gera etiqueta → atualiza rastreio
- [ ] Atualizar status no Supabase (tabela `tracking`)
- [ ] Notificações automáticas (WhatsApp ou email)

### ✅ Passo 10: Dashboard de Supervisão
- [ ] Interface simples (Retool ou Supabase Dashboard customizado)
- [ ] Visualizar pedidos em andamento
- [ ] Alertas de revisão necessária
- [ ] Métricas básicas (margem, receita, pedidos/dia)

**Deliverable Semana 6:** Sistema 80% autônomo rodando end-to-end

---

## Checklist de Dependências

### APIs e Serviços Necessários
- [ ] Conta OpenAI (GPT-4o Vision)
- [ ] Conta Serper.dev (busca)
- [ ] Conta Supabase (banco)
- [ ] Conta Stripe (pagamentos)
- [ ] Conta Shippo (logística)
- [ ] Evolution API ou Typebot (WhatsApp)
- [ ] VPS ou servidor para n8n (Hetzner/DigitalOcean)

### Credenciais a Configurar
- [ ] `OPENAI_API_KEY`
- [ ] `SERPER_API_KEY`
- [ ] `SUPABASE_URL` + `SUPABASE_ANON_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `SHIPPO_API_KEY`
- [ ] `WHATSAPP_API_URL`

---

## Métricas de Sucesso

### Semana 2
- ✅ n8n rodando localmente
- ✅ Supabase configurado
- ✅ Agente Concierge identifica peça de foto

### Semana 4
- ✅ Agente Hunter encontra peça em marketplace real
- ✅ Agente Fiscal calcula impostos corretamente
- ✅ Frontend exibe cotação

### Semana 6
- ✅ Fluxo completo: foto → pagamento → rastreio
- ✅ Dashboard mostra pedidos em tempo real
- ✅ Sistema processa pedido sem intervenção humana (80% dos casos)

---

## Próxima Ação Imediata

**AGORA:**
1. Execute `chmod +x scripts/setup_n8n.sh && ./scripts/setup_n8n.sh`
2. Configure o arquivo `.env` com suas credenciais
3. Acesse http://localhost:5678 e configure o n8n
4. Execute a migration no Supabase: `001_initial_schema.sql`

**DEPOIS:**
5. Teste o `agents/concierge/vision_identifier.py` com uma foto real
6. Crie o primeiro workflow no n8n (Concierge básico)

---

## Notas Importantes

- 🎯 **Foco**: MVP funcional, não perfeito
- 🚀 **Velocidade > Perfeição**: Teste rápido, itere rápido
- 🤖 **Automação primeiro**: Cada passo deve reduzir trabalho manual
- 📊 **Métricas desde o dia 1**: Log tudo, meça tudo

**Vamos construir esse monstro! 🏎️🔥**



