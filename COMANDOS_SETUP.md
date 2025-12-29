# 🚀 Comandos Exatos para Setup

Execute estes comandos na ordem:

## 1. Instalar Dependências Base

```powershell
npm install
```

## 2. Inicializar shadcn/ui

```powershell
npx shadcn@latest init
```

**Quando perguntado, escolha:**
- ✅ Style: Default
- ✅ Base color: Slate  
- ✅ CSS variables: Yes
- ✅ Theme: Dark

## 3. Adicionar Componentes shadcn/ui Necessários

```powershell
npx shadcn@latest add card
```

## 4. Instalar Dependências Adicionais (se necessário)

```powershell
npm install framer-motion lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install -D tailwindcss-animate
```

## 5. Executar em Desenvolvimento

```powershell
npm run dev
```

Acesse: **http://localhost:3000**

---

## ✅ Verificação Final

Após executar `npm run dev`, você deve ver:

- ✅ Homepage dark mode com hero section
- ✅ Título grande: "Se existe no mundo, chega na sua garagem."
- ✅ Botão verde neon (#00E599) com glow effect no hover
- ✅ 3 cards com features
- ✅ Animações suaves de entrada (fade-in)

---

## 🎨 Design System Aplicado

- **Primary:** `#00E599` (verde neon gearhead)
- **Background:** `#0A0A0B` (quase preto, cockpit noturno)
- **Cards:** `#111112` (elevated surfaces)
- **Borders:** `#2A2A2C` (sutis)
- **Radius:** `0.75rem` (12px - borderless premium)

---

## 📝 Notas

- A fonte Geist Mono é opcional. Se não tiver o arquivo, o sistema usa fallback para `monospace`.
- Todos os componentes seguem o Design System "Borderless Premium".
- Dark mode é o padrão (não há toggle, é dark first).

---

**Pronto para construir! 🏎️🔥**

