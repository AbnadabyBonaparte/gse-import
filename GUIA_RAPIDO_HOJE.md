# 🏎️ GSE Import - Guia Rápido: Concierge Funcional HOJE

**Objetivo:** Ter o primeiro agente (Concierge) identificando peças por foto em 30-45 minutos.

---

## ✅ Checklist Rápido (30-45 min)

### 1. Setup n8n Cloud (10 min)
- [ ] Criar conta em https://n8n.io (gratuito)
- [ ] Fazer login no dashboard

### 2. Importar Workflow (5 min)
- [ ] Ir em **Workflows** → **Import from File**
- [ ] Selecionar: `infrastructure/n8n/workflows/concierge_mvp.json`
- [ ] Workflow importado ✅

### 3. Configurar OpenAI (5 min)
- [ ] Obter API Key em https://platform.openai.com/api-keys
- [ ] No workflow, clicar no nó "GPT-4o Vision"
- [ ] Criar credencial OpenAI com sua API Key
- [ ] Salvar credencial ✅

### 4. Ativar Webhook (5 min)
- [ ] Clicar no nó "Webhook - Recebe Foto"
- [ ] Ativar "Listen for Test Event" ou toggle do workflow
- [ ] **Copiar URL do webhook** (ex: `https://seu-app.n8n.cloud/webhook/...`)
- [ ] Salvar workflow (Ctrl+S) ✅

### 5. Testar (10 min)
- [ ] Escolher uma foto de peça automotiva (URL pública)
- [ ] Executar script de teste:
  ```powershell
  .\scripts\test_concierge.ps1 -WebhookUrl "SUA_URL" -ImageUrl "URL_DA_FOTO"
  ```
- [ ] Verificar resposta de identificação ✅

---

## 🎯 Resultado Esperado

Após executar o teste, você deve receber uma resposta JSON como:

```json
{
  "success": true,
  "identification": "Identifiquei a peça! É uma bomba d'água (water pump) para motor 2.0 TSI EA888 Gen3. Código OEM: 06H121026H. Compatível com: VW Golf GTI Mk7 (2013-2017)...",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "inputData": {
    "imageUrl": "https://example.com/part.jpg",
    "vin": "",
    "carModel": ""
  }
}
```

---

## 📚 Documentação Completa

- [README.md](README.md) - Visão geral e instruções detalhadas
- [infrastructure/n8n/workflows/GUIA_IMPORTACAO.md](infrastructure/n8n/workflows/GUIA_IMPORTACAO.md) - Guia passo a passo de importação
- [prompts/concierge_system_prompt.md](prompts/concierge_system_prompt.md) - Prompt otimizado

---

## 🚨 Problemas Comuns

### "Workflow não importa"
→ Tente copiar o JSON e colar diretamente no n8n (menu Import → Paste)

### "Erro de credenciais"
→ Verifique se a API Key está correta e se tem créditos na OpenAI

### "Webhook não responde"
→ Certifique-se de que o workflow está **ativado** (toggle verde no topo)

### "Resposta vazia"
→ Verifique os logs na aba "Executions" do n8n

---

## 🎉 Próximo Passo

**Após o Concierge funcionar:**
1. Integrar com Supabase para armazenar identificações
2. Criar Agente Hunter (busca global)
3. Criar Frontend (scanner web)

**Mas primeiro: vamos identificar a primeira peça HOJE! 🏎️🔥**



