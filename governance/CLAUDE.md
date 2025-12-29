# 🚨 CLAUDE.md - LEIA ESTE ARQUIVO INTEIRO ANTES DE FAZER QUALQUER ALTERAÇÃO

> **"Se você não leu este arquivo, não toque em nada."**

---
## ⚠️ AVISO CRÍTICO
Este é o arquivo mais importante do projeto.
Se você é um desenvolvedor, designer, ou IA assistente trabalhando no GSE Import, **LEIA ESTE ARQUIVO INTEIRO** antes de:
- Criar qualquer arquivo novo
- Modificar qualquer código existente
- Adicionar qualquer dependência
- Fazer qualquer commit
- Criar qualquer PR

**Ignorar este arquivo = Violação grave da governança = Rejeição imediata.**

---
## 🛡️ REGRAS ABSOLUTAS
### 1. ZERO HARDCODED
**NUNCA hardcode:**
- Valores de impostos, NCM, URLs, cores, taxas, limites
**SEMPRE usar:**
- Variáveis de ambiente, Supabase, CSS variables, config files

### 2. ZERO MOCK DATA
**Palavras PROIBIDAS no código:**
- mock, fake, dummy, sample, test, example, placeholder, TODO, FIXME, HACK

### 3. SUPABASE - FILTRO org_id OBRIGATÓRIO
**Todas as queries devem ter .eq('org_id', currentOrgId)**

### 4. DESIGN SYSTEM - CSS VARIABLES OBRIGATÓRIO
**NUNCA hardcode cores. Sempre usar var(--color-primary), var(--bg), etc.**

### 5. COMPONENTES - shadcn/ui OBRIGATÓRIO
**Sempre usar componentes do shadcn/ui. Nunca criar do zero.**

### 6. ARQUITETURA DE AGENTES - SQUAD PATTERN
**Agentes divididos em CORE, GUARD, ANALYST**

### 7. VALIDAÇÃO PRÉ-COMMIT OBRIGATÓRIA
**Todo commit deve passar grep de validação (hardcoded, mock, etc.)**

---
## 📋 CHECKLIST PRÉ-COMMIT
- [ ] Zero hardcoded
- [ ] Zero mock data
- [ ] Queries com org_id
- [ ] Cores via CSS variables
- [ ] Componentes shadcn/ui
- [ ] Validação pré-commit passou

---
**Violar qualquer regra = rejeição imediata.**
**Não há exceções. Não há "só desta vez".**

**Leonidas**  
**GSE Import - A Máquina que Roda Sozinha**

