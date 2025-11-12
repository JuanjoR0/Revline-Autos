import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ajuste para que Django sirva correctamente los assets en producción
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/static/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}))
