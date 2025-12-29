# 🔍 Setup Agente Hunter - Busca Global de Peças

## Configuração da Chave Serper.dev

Para o Agente Hunter funcionar, você precisa configurar a chave da API Serper.dev.

### Passo a Passo

1. **Obter Chave Serper.dev:**
   - Acesse: https://serper.dev/api-key
   - Faça login ou crie uma conta
   - Gere uma nova API key
   - Copie a chave

2. **Configurar no Projeto:**
   ```bash
   # Editar .env.local e adicionar:
   SERPER_API_KEY=sua-chave-serper-aqui
   ```

3. **Verificar:**
   - O arquivo `.env.local` deve estar na raiz do projeto
   - A chave deve estar escrita corretamente: `SERPER_API_KEY=...`
   - Reinicie o servidor Next.js (`npm run dev`)

### Como Funciona

O Agente Hunter busca peças automotivas em marketplaces confiáveis:

- **eBay** - Marketplace global de peças usadas e novas
- **RockAuto** - Especializado em peças automotivas
- **Amazon** - Marketplace geral com seção automotiva
- **PartsGeek** - Especializado em peças de reposição
- **AutoZone** - Loja de peças automotivas
- **O'Reilly** - Loja de peças automotivas

### Fluxo Completo

1. **Identificação (Vision AI):**
   - Foto da peça → GPT-4o Vision identifica
   - Retorna: nome, compatibilidade, OEM, NCM, confiança

2. **Busca Global (Hunter):**
   - Usa nome da peça + compatibilidade + OEM
   - Busca em marketplaces confiáveis via Serper.dev
   - Retorna top 5 opções ordenadas por preço
   - Exibe: título, preço, vendedor, marketplace, rating

3. **Resultados:**
   - Grid responsivo (1 coluna mobile, 3 desktop)
   - Badge "Melhor custo-benefício" no top 1
   - Botão "Ver detalhes" abre link externo
   - Preço convertido para BRL (aproximado)

### Troubleshooting

**Erro: "SERPER_API_KEY não configurada"**
- Verifique se o arquivo `.env.local` existe na raiz
- Verifique se a variável está escrita corretamente: `SERPER_API_KEY=...`
- Reinicie o servidor Next.js

**Erro: "Erro ao buscar peças"**
- Verifique se a chave Serper.dev está válida
- Verifique se você tem créditos disponíveis em https://serper.dev/dashboard
- Tente novamente após alguns segundos

**Nenhuma peça encontrada:**
- A busca pode não ter retornado resultados nos marketplaces confiáveis
- Tente com uma peça mais comum ou específica
- Verifique se o nome da peça está correto

---

**Pronto! O Agente Hunter está funcional e busca peças globalmente.** 🏎️🔥



