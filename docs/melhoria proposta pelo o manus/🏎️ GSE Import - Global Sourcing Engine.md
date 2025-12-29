# 🏎️ GSE Import - Global Sourcing Engine

```
  ____ ____ ____   ____ ____ ____   ____ ____ ____   ____ ____ ____
 / ___|  _ \/ ___| / ___|  _ \/ ___| / ___|  _ \/ ___| / ___|  _ \/ ___|
| |  _| |_) \___ \| |  _| |_) \___ \| |  _| |_) \___ \| |  _| |_) \___ \
| |_| |  _ < ___) | |_| |  _ < ___) | |_| |  _ < ___) | |_| |  _ < ___) |
 \____|_| \_\____/ \____|_| \_\____/ \____|_| \_\____/ \____|_| \_\____/
```

## 🌟 A Máquina que Roda Sozinha

A **GSE Import** é a primeira máquina 100% autônoma de importação de peças automotivas do Brasil. Nosso objetivo é eliminar a incerteza e a frustração na busca por peças raras ou de alto valor agregado.

> **"Se existe no mundo, chega na sua garagem."**

### Badges de Status e Tecnologia

| Categoria | Status |
| :--- | :--- |
| **Status do Projeto** | **Em Desenvolvimento (Alpha Fechado)** |
| **Frontend** | Next.js 15 (App Router) |
| **Design System** | shadcn/ui + Tailwind CSS |
| **Backend/DB** | Supabase + Drizzle ORM |
| **Orquestração** | n8n |
| **Inteligência Artificial** | Provider-Agnostic (GPT-4o Vision, Gemini, Claude) |

---

## 🎯 Visão e Proposta de Valor

Nossa missão é resolver a angústia da "peça impossível" através de um fluxo de trabalho automatizado e transparente, focado em **Custo Total Garantido** e **Autonomia**.

### O Problema Resolvido

A importação tradicional é lenta, burocrática e cheia de custos ocultos. O GSE transforma isso em uma experiência de e-commerce global, onde o preço final é o preço que você paga.

### O Diferencial Inquebrável: Custo Total Garantido

Se o cálculo de impostos e taxas exceder o valor apresentado no orçamento final, a **GSE assume a diferença**. Isso garante que o cliente nunca terá surpresas na alfândega ou na entrega.

---

## ⚙️ Core Feature: Scanner de Peças (Vision AI)

O coração do GSE é o **Scanner de Peças**, que utiliza Inteligência Artificial de Visão para identificar a peça com precisão cirúrgica.

### Fluxo de Identificação

1.  **Entrada Híbrida:** O usuário fornece uma foto da peça, um código OEM, um VIN (Vehicle Identification Number) ou uma descrição textual.
2.  **Identificação por IA:** O modelo GPT-4o Vision (ou equivalente) analisa a imagem e o texto, retornando:
    *   Nome e descrição técnica da peça.
    *   Códigos OEM e NCM (Nomenclatura Comum do Mercosul) sugeridos.
    *   Modelos e anos de veículos compatíveis.
3.  **Busca Global (Hunter Agent):** Com a identificação confirmada, um agente autônomo varre marketplaces globais (eBay, RockAuto, Amazon, etc.) em busca das melhores ofertas.
4.  **Resultado Consolidado:** O sistema apresenta as opções, já com a conversão de moeda e a estimativa de Custo Total Garantido (incluindo frete e impostos).

> **RECOMENDAÇÃO:** Adicione um **GIF ou um vídeo curto** (máximo 30 segundos) mostrando o fluxo completo do Scanner de Peças. Isso aumenta drasticamente o engajamento e a clareza do projeto.

---

## 🏛️ Arquitetura Técnica

O projeto GSE Import adota uma arquitetura moderna, desacoplada e baseada em agentes, garantindo escalabilidade e resiliência.

### Diagrama de Alto Nível (Conceitual)

*   **Frontend:** Next.js 15 (React) para uma interface rápida e responsiva.
*   **API Gateway:** Rotas `/api/vision` e `/api/hunter/search` para comunicação segura.
*   **Backend (Data):** Supabase (PostgreSQL) para autenticação e dados, Drizzle ORM para tipagem segura.
*   **Orquestração (Agentes):** n8n gerencia os fluxos de trabalho complexos (Hunter Agent, Tax Agent, etc.).
*   **IA Abstraction:** Um *wrapper* de código permite trocar o provedor de IA (OpenAI, Anthropic, etc.) sem alterar a lógica de negócio.

### Estrutura de Dados (Exemplo de Tipagem)

A tipagem é central para a robustez do projeto. As interfaces principais são:

| Interface | Propósito | Campos Chave |
| :--- | :--- | :--- |
| `VisionResult` | Saída da IA de Visão | `partName`, `oemCode`, `compatibility`, `confidence` |
| `HunterResult` | Resultado da Busca Global | `title`, `url`, `price`, `marketplace`, `compatibility` |

---

## 🛡️ Governança e Princípios (Matriz Gênesis)

O desenvolvimento do GSE é guiado por um conjunto de regras e princípios de governança técnica.

> **LEIA PRIMEIRO:** Consulte os arquivos de governança para entender a filosofia por trás do projeto.
>
> *   **[.cursorrules](.cursorrules)** — Regras de desenvolvimento e padrões de código.
> *   **[governance/MATRIZ\_GENESE\_GSE.md](governance/MATRIZ_GENESE_GSE.md)** — As 6 Leis Sagradas do GSE.

---

## 🚀 Quick Start (Desenvolvimento Local)

Para rodar o projeto localmente, siga os passos abaixo.

### 1. Pré-requisitos

*   Node.js (v20+)
*   pnpm (Recomendado) ou npm
*   Conta no OpenAI (para a API Vision)
*   Conta no Serper (para a busca global)

### 2. Instalar Dependências

```bash
pnpm install
# ou
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto, copiando o template, e preencha com suas chaves:

```bash
# Copiar template
cp env.template .env.local

# .env.local
# Chave obrigatória para o Scanner de Peças (Vision AI)
OPENAI_API_KEY="sk-..."

# Chave obrigatória para o Agente Hunter (Busca Global)
SERPER_API_KEY="sua-chave-serper"

# Outras variáveis do Supabase, Drizzle, etc.
```

### 4. Executar em Desenvolvimento

```bash
pnpm run dev
# ou
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Melhorias de Código (Refatoração)

O componente `Scanner.tsx` foi refatorado para aumentar a **modularidade** e a **manutenibilidade**.

| Antes | Depois | Benefício |
| :--- | :--- | :--- |
| `Scanner.tsx` (811 linhas) | `Scanner.tsx` (Componente orquestrador) | Redução de complexidade e melhor legibilidade. |
| Lógica de `fetch` e `FormData` no componente | `useGSEApi` (Custom Hook) | Separação de preocupações (SoC) e reuso de lógica de API. |
| Componente monolítico | `ScannerInput`, `VisionResultDisplay` (Sub-componentes) | Modularização da UI e melhor gestão de estados. |
| Taxa de câmbio fixa em `Scanner.tsx` | `src/utils/format-price.ts` | Isolamento de lógica de negócio e facilidade para futura integração com API de câmbio. |

---

## 🗺️ Roadmap (Próximos Milestones)

*   **Milestone 1 (Atual):** Refatoração do Scanner e Documentação (Concluído)
*   **Milestone 2:** Integração completa do **Tax Agent** (Cálculo de IPI, ICMS, II, PIS/COFINS) para Custo Total Garantido.
*   **Milestone 3:** Implementação do **VIN Decoder Agent** para identificação de veículos por chassi.
*   **Milestone 4:** Dashboard do usuário com rastreio em tempo real e histórico de pedidos.

## 🤝 Contribuição

Se você deseja contribuir para a máquina que roda sozinha, sinta-se à vontade para abrir *issues* ou *pull requests*.

1.  Faça um *fork* do projeto.
2.  Crie uma *branch* para sua *feature* (`git checkout -b feature/nova-funcionalidade`).
3.  Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`).
4.  Faça o *push* para a *branch* (`git push origin feature/nova-funcionalidade`).
5.  Abra um *Pull Request* e mencione o **Leonidas** (o Agente de Governança).

**Leonidas**
**GSE Import - A Máquina que Roda Sozinha**
