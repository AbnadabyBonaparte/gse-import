# Workflows n8n - GSE 1000

Este diretório contém os workflows exportados do n8n.

## Como usar

1. Acesse o n8n em http://localhost:5678
2. Vá em "Workflows" → "Import from File"
3. Selecione o arquivo JSON desejado

## Workflows Disponíveis

### 1. `concierge_basic.json` (PRIORIDADE 1)
- Recebe mensagem do WhatsApp
- Extrai foto/VIN
- Chama GPT-4o Vision para identificar peça
- Responde ao cliente

### 2. `hunter_basic.json` (PRIORIDADE 2)
- Recebe identificação de peça
- Busca em múltiplos marketplaces via Serper.dev
- Filtra e rankeia resultados
- Salva no Supabase

### 3. `fiscal_basic.json` (PRIORIDADE 3)
- Recebe peça identificada
- Classifica NCM
- Calcula impostos
- Gera cotação PDF

### 4. `auditor_basic.json` (PRIORIDADE 4)
- Recebe fotos de inspeção
- Valida com GPT-4o Vision
- Aprova/reprova automaticamente

## Estrutura de um Workflow

Cada workflow n8n exportado contém:
- **Nodes**: Nós de automação (webhook, HTTP request, code, etc.)
- **Connections**: Conexões entre nós
- **Credentials**: Referências a credenciais (não incluem valores reais)

## Notas Importantes

- ⚠️ Credenciais não são exportadas por segurança
- Configure as credenciais manualmente no n8n após importar
- Teste cada workflow isoladamente antes de conectar
- Use o modo "Test" do n8n para debugar



