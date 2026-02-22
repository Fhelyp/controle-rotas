# 🚛 Controle de Rotas

App mobile-first para registro de execução de rotas de transportadora.

---

## ⚙️ Como configurar

### 1. Configurar o Supabase

1. Acesse o seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase_schema.sql`
3. Vá em **Project Settings → API** e copie:
   - **Project URL**
   - **anon public** key

### 2. Adicionar suas credenciais

Abra o arquivo `src/lib/config.ts` e substitua:

```ts
export const SUPABASE_URL = 'https://SEU_PROJECT_ID.supabase.co'
export const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI'
```

### 3. Configurar a base URL para o GitHub Pages

Abra `vite.config.ts` e ajuste o `base` para o nome do seu repositório:

```ts
base: '/nome-do-seu-repositorio/',
```

---

## 🚀 Como publicar no GitHub Pages

### Opção A — Publicar manualmente

```bash
npm install
npm run build
```

Depois suba a pasta `dist/` para o branch `gh-pages` do seu repositório, ou configure o GitHub Pages para servir a partir de `/docs` (renomeie a pasta `dist` para `docs`).

### Opção B — GitHub Actions (automático)

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Depois de subir o código, vá em **Settings → Pages** no seu repositório e configure para servir o branch `gh-pages`.

---

## 📱 Funcionalidades

- **Registro** — cadastro diário de motorista, rota, veículo e observações com suporte a datas retroativas
- **Relatório** — dashboard com filtros por semana atual/passada, mês atual/passado e período personalizado
- **Configurações** — CRUD completo de motoristas, veículos e rotas

---

## 🛠 Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Supabase (banco de dados)
- Lucide React (ícones)
