import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Rutas relativas: funciona en un dominio o en un subdirectorio de GitHub Pages.
  base: './',
  plugins: [react(), tailwindcss()],
})
