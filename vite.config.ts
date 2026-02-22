import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Altere o "base" para o nome do seu repositório no GitHub
// Ex: se o repo se chama "controle-rotas", deixe como '/controle-rotas/'
// Se for usar domínio próprio ou raiz, deixe como '/'
export default defineConfig({
  plugins: [react()],
  base: '/controle-rotas/',
})
