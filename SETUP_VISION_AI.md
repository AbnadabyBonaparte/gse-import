# 🔧 Setup Vision AI - Scanner de Peças

## Configuração da Chave OpenAI

Para o Scanner de Peças funcionar, você precisa configurar a chave da API OpenAI.

### Passo a Passo

1. **Obter Chave OpenAI:**
   - Acesse: https://platform.openai.com/api-keys
   - Faça login ou crie uma conta
   - Clique em "Create new secret key"
   - Copie a chave (ela só aparece uma vez!)

2. **Configurar no Projeto:**
   ```bash
   # Criar arquivo .env.local na raiz do projeto
   echo "OPENAI_API_KEY=sk-sua-chave-aqui" > .env.local
   ```

   **OU** copie o arquivo `env.template` para `.env.local` e preencha:
   ```bash
   cp env.template .env.local
   # Edite .env.local e adicione sua chave
   ```

3. **Verificar:**
   - O arquivo `.env.local` deve estar na raiz do projeto
   - A chave deve começar com `sk-`
   - Não commite o arquivo `.env.local` (já está no .gitignore)

### Testar

1. Execute `npm run dev`
2. Acesse http://localhost:3000
3. Clique em "Tirar foto da peça →"
4. Faça upload de uma imagem de peça automotiva
5. Clique em "Identificar peça"
6. Aguarde a identificação (pode levar alguns segundos)

### Troubleshooting

**Erro: "OPENAI_API_KEY não configurada"**
- Verifique se o arquivo `.env.local` existe na raiz
- Verifique se a variável está escrita corretamente: `OPENAI_API_KEY=sk-...`
- Reinicie o servidor Next.js (`npm run dev`)

**Erro: "Erro da OpenAI: Invalid API Key"**
- Verifique se a chave está correta
- Verifique se a chave não expirou
- Gere uma nova chave em https://platform.openai.com/api-keys

**Erro: "Rate limit exceeded"**
- Você atingiu o limite de requisições da OpenAI
- Aguarde alguns minutos ou verifique seu plano em https://platform.openai.com/usage

---

**Pronto! O Scanner de Peças está funcional com Vision AI real.** 🏎️🔥


