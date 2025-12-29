# GSE 100% Autônomo: A Máquina que Roda Sozinha (n8n Edition)

> **⚠️ NOTA:** Este documento contém comparações históricas com Make.com e Zapier para contexto. A stack atual do GSE Import é **n8n** (definida como imutável em `.cursorrules`).

**Abnadaby**, o objetivo é claro: chegar num ponto em que o GSE funcione dia e noite sem você precisar tocar em 90% dos pedidos. Você vira supervisor, não operador. A ferramenta que vai orquestrar essa máquina toda é o **n8n** — e vou te explicar por quê e como, sem enrolação.

## 1. Por que n8n e não Make.com ou Zapier? (Contexto Histórico)

- **Self-hosted:** Roda na sua VPS barata (R$100–200/mês). Zero limite de tarefas, zero surpresa na fatura quando crescer.
- **AI Agent nativo:** Tem nó pronto de LangChain/LangGraph. Você cria agentes que pensam, tomam decisões e chamam ferramentas sozinhos.
- **Flexibilidade bruta:** Pode injetar JavaScript/Python quando precisar de lógica exata (ex: cálculo de II + IPI + taxa Siscomex com regras loucas da Receita).
- **Comunidade forte + templates prontos:** Tem workflow pronto pra quase tudo que a gente precisa.

Resultado: custo previsível, controle total e poder pra construir agentes realmente inteligentes.

## 2. Arquitetura da "Empresa de Um Homem Só"

| Camada                  | Ferramenta Principal                  | Papel da IA / Automação                                                                 |
|-------------------------|---------------------------------------|------------------------------------------------------------------------------------------|
| **Entrada do Cliente**  | WhatsApp (via Evolution API ou oficial) + Typebot ou Chatwoot | IA Concierge entende mensagem, extrai foto/link/VIN, confirma dados e já inicia o workflow |
| **Orquestrador Central**| **n8n (self-hosted)**                 | Cérebro da operação. Decide qual agente chamar, trata erros, marca pedidos pra sua revisão |
| **Busca & Sourcing**    | Serper.dev + Apify + Perplexity API   | Agente Hunter varre eBay, RockAuto, Taobao, Yahoo Auctions, compara preço/prazo/reputação e devolve 3 opções |
| **Tributos & Cotação**  | GPT-4o + base NCM atualizada (Google Sheet ou Supabase) | Agente Fiscal classifica NCM, calcula imposto real, frete estimado e gera custo total garantido |
| **Inspeção & Qualidade**| GPT-4o Vision                         | Agente Auditor recebe fotos do agente local, compara com catálogo e aprova/reprova automaticamente |
| **Pagamento**           | Stripe Connect + Pix automático       | n8n gera link/cobrança, confirma pagamento e só libera próxima etapa depois |
| **Compra & Logística**  | API do forwarder (SuperBuy, Shipito) + Shippo | n8n (ou RPA simples) faz a compra no exterior e gera etiqueta de envio |
| **Comunicação Cliente** | WhatsApp mesmo                        | Todas as atualizações (cotação, fotos, rastreio, entrega) vão automático pro cliente |

## 3. Fluxo Real 100% Zero Touch (como vai rodar na prática)

1. Cliente manda foto + “preciso da bomba d’água do meu Golf 2008” no WhatsApp.  
2. Typebot/Evolution captura → webhook pro n8n.  
3. Agente de IA Vision + GPT-4o identifica peça exata e extrai VIN/modelo.  
4. Agente Hunter busca no mundo todo → devolve 3 opções viáveis.  
5. Agente Fiscal calcula custo total (peça + frete + imposto + inspeção + margem).  
6. n8n gera PDF bonito com as opções + link de pagamento Stripe e manda pro cliente no WhatsApp.  
7. Cliente paga → n8n detecta → escolhe automaticamente a melhor opção (ou a que o cliente marcou).  
8. n8n aciona agente local (EUA/China) via WhatsApp automático pra comprar e inspecionar.  
9. Agente local sobe fotos num link simples → Agente Auditor (Vision) valida.  
   → Se OK → libera envio internacional via Shippo.  
   → Se problema → n8n pausa, notifica você e inicia devolução/reembolso automático.  
10. Rastreio é atualizado automaticamento no WhatsApp do cliente até entregar na porta.

Você só abre o dashboard quando aparecer a flag vermelha “Revisão Humana Necessária”.

## 4. Seu Novo Papel: AI Supervisor

- Dashboard simples (n8n próprio ou Retool/Supabase) mostrando:
  - Pedidos em andamento
  - Margem média do dia
  - Pedidos com alerta
  - Receita do mês
- Você intervém só em:
  - Peças muito raras que a IA não achou
  - Divergência grave na inspeção
  - Cliente reclamando no WhatsApp (a IA já tenta resolver 80% sozinho)

## 5. Próximos Passos Concretos (pra sair do papel essa semana)

1. Alugar uma VPS Hetzner ou DigitalOcean (4vCPU + 8GB RAM → uns R$150/mês) e instalar n8n via Docker (tem tutorial de 10min).
2. Configurar o primeiro workflow simples: WhatsApp → extrai foto → GPT-4o Vision descreve a peça → responde pro cliente “Entendi, é X pro Y?”.
3. Conectar Serper.dev ou Apify pro Agente Hunter fazer busca real.
4. Montar a base de NCM + cálculo de imposto (planilha no Google Sheets por enquanto).
5. Testar o fluxo completo com 1–2 pedidos reais (os seus ou de amigo).

**Leonidas**, isso não é ficção. Tem gente já rodando e-commerce inteiro com n8n + IA.  
O GSE pode ser a primeira importadora de peças automotivas 100% autônoma do Brasil — e você constrói isso sozinho, sem folha de pagamento, sem sócio, sem reunião.

Quer que eu monte o template inicial do n8n pra você copiar e colar?  
Ou prefere o passo a passo detalhado da instalação essa semana?

