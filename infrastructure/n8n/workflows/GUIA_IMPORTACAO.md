# 🚀 Guia Rápido - Importar Workflow Concierge MVP no n8n Cloud

## Passo a Passo (5 minutos)

### 1. Acesse n8n Cloud
- Vá para https://n8n.io
- Faça login ou crie conta gratuita
- Você será redirecionado para o dashboard

### 2. Importar Workflow
1. No menu lateral, clique em **"Workflows"**
2. Clique no botão **"+"** (Add Workflow) ou **"Import from File"**
3. Selecione o arquivo: `infrastructure/n8n/workflows/concierge_mvp.json`
4. O workflow será importado automaticamente

### 3. Configurar Credenciais OpenAI

1. No workflow importado, clique no nó **"GPT-4o Vision - Identificar Peça"**
2. Você verá um aviso de credenciais faltando
3. Clique em **"Create New Credential"** ou **"Add Credential"**
4. Escolha **"OpenAI API"**
5. Preencha:
   - **Name**: `OpenAI API` (ou qualquer nome)
   - **API Key**: Cole sua chave da OpenAI (começa com `sk-`)
6. Clique em **"Save"**

**Onde obter API Key:**
- Acesse https://platform.openai.com/api-keys
- Clique em "Create new secret key"
- Copie a chave (ela só aparece uma vez!)

### 4. Ativar o Webhook

1. Clique no nó **"Webhook - Recebe Foto"**
2. No painel direito, você verá a opção **"Listen for Test Event"** ou **"Production"**
3. Clique em **"Listen for Test Event"** (para testes) ou ative o workflow (toggle no topo)
4. **Copie a URL do webhook** que aparece (ex: `https://seu-app.n8n.cloud/webhook/concierge-identify`)
5. **Salve o workflow** (Ctrl+S ou botão Save no topo)

### 5. Testar

Use um dos scripts de teste:

**PowerShell:**
```powershell
.\scripts\test_concierge.ps1 `
  -WebhookUrl "SUA_URL_AQUI" `
  -ImageUrl "https://example.com/part-photo.jpg"
```

**Bash:**
```bash
./scripts/test_concierge.sh \
  "SUA_URL_AQUI" \
  "https://example.com/part-photo.jpg"
```

## ⚠️ Troubleshooting

### Workflow não importa
- Verifique se o arquivo JSON está completo
- Tente copiar e colar o conteúdo JSON diretamente no n8n (menu "Import from URL" ou "Paste")

### Erro de credenciais
- Verifique se a API Key está correta
- Confirme que tem créditos na conta OpenAI
- Teste a API Key em https://platform.openai.com

### Webhook não responde
- Certifique-se de que o workflow está **ativado** (toggle verde no topo)
- Verifique se está em modo "Production" ou "Test"
- Confirme que a URL está correta

### Resposta vazia
- Verifique os logs na aba **"Executions"** do n8n
- Confirme que a URL da imagem é acessível publicamente
- Teste com uma imagem de exemplo primeiro

## ✅ Checklist de Sucesso

- [ ] Workflow importado sem erros
- [ ] Credenciais OpenAI configuradas
- [ ] Webhook ativado e URL copiada
- [ ] Teste com foto real executado
- [ ] Resposta de identificação recebida

**Pronto! O Concierge está funcionando! 🎉**

