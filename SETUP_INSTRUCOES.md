# 🚀 Instruções de Setup - GSE Import

## 📋 Pré-requisitos

- Node.js 20+ instalado
- npm ou yarn

## 🔧 Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Inicializar shadcn/ui (se necessário)

```bash
npx shadcn@latest init
```

**Configurações recomendadas:**
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Theme: Dark

### 3. Instalar Componentes shadcn/ui Adicionais (se necessário)

```bash
npx shadcn@latest add card
```

### 4. Configurar Fonte Geist Mono (Opcional)

A fonte Geist Mono é opcional. Se quiser usá-la:

1. Baixe de: https://github.com/vercel/geist-font
2. Coloque `GeistMonoVF.woff2` em `src/fonts/`

**OU** remova a referência em `src/app/layout.tsx` e use apenas Inter.

### 5. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## ✅ Verificação

Após executar, você deve ver:
- ✅ Homepage com hero section dark
- ✅ Título: "Se existe no mundo, chega na sua garagem."
- ✅ Botão neon verde (#00E599) com glow effect
- ✅ Cards com features
- ✅ Animações suaves de entrada

## 🎨 Design System

- **Primary Color:** #00E599 (verde neon)
- **Background:** #0A0A0B (quase preto)
- **Cards:** #111112 (elevated)
- **Borders:** #2A2A2C (sutis)
- **Dark Mode First:** ✅

## 📁 Estrutura Criada

```
src/
├── app/
│   ├── layout.tsx      ✅ Layout raiz com fonts
│   ├── page.tsx        ✅ Homepage com hero
│   └── globals.css     ✅ CSS variables + Design System
├── components/
│   ├── ui/
│   │   ├── button.tsx  ✅ Button com variante neon
│   │   └── card.tsx    ✅ Card component
│   ├── scanner/        ✅ (vazio, para futuro)
│   └── hero/           ✅ (vazio, para futuro)
├── lib/
│   └── utils.ts        ✅ cn() helper
└── agents/             ✅ (vazio, para futuro)
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/components/ui/button'"
→ Verifique se `tsconfig.json` tem `"@/*": ["./src/*"]` em paths

### Erro: Fonte GeistMono não encontrada
→ Remova a referência em `layout.tsx` ou adicione a fonte em `src/fonts/`

### Erro: Tailwind não aplica estilos
→ Verifique se `tailwind.config.ts` está na raiz e `globals.css` importa `@tailwind`

---

**Pronto para construir! 🏎️🔥**

