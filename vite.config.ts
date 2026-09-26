import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // A dónde manda el proxy de desarrollo. Por defecto el backend de QA; con
  // `API_PROXY=http://localhost:3000` en un `.env.local` se prueba contra el de
  // esta máquina, que es el que sirve cuando el cambio todavía no subió.
  const env = loadEnv(mode, process.cwd(), '')
  const destino = env.API_PROXY || 'https://api-qa.bamardev.com'

  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        // Dos páginas: la landing y la encuesta. Cloudflare Pages sirve
        // `encuesta.html` en /encuesta sin configurar nada.
        input: {
          main: resolve(__dirname, 'index.html'),
          encuesta: resolve(__dirname, 'encuesta.html'),
        },
      },
    },
    server: {
      // El backend sólo acepta los dominios de CORS_ORIGINS, y localhost no
      // está. En desarrollo la encuesta pega a /api y esto lo reenvía: el
      // navegador ve un mismo origen y no hay CORS que permitir.
      proxy: {
        '/api': {
          target: destino,
          changeOrigin: true,
          secure: destino.startsWith('https'),
        },
      },
    },
  }
})
