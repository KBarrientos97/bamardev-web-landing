import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const SITIO = 'https://bamardev.com'

/**
 * robots.txt y sitemap.xml se generan en el build porque QA y PROD comparten la
 * carpeta public/ y no deben decir lo mismo: PROD se indexa (menos el
 * cuestionario y la encuesta, que no son para buscadores) y QA se bloquea
 * entero para que no compita con bamardev.com.
 */
function robotsYSitemap(mode: string): Plugin {
  const produccion = mode === 'production'
  return {
    name: 'robots-y-sitemap',
    apply: 'build',
    generateBundle() {
      const robots = produccion
        ? [
            'User-agent: *',
            'Allow: /',
            'Disallow: /necesidades',
            'Disallow: /encuesta',
            '',
            `Sitemap: ${SITIO}/sitemap.xml`,
            '',
          ].join('\n')
        : ['User-agent: *', 'Disallow: /', ''].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (!produccion) return
      const hoy = new Date().toISOString().slice(0, 10)
      const urls = ['/', '/descargas'].map((u) => `  <url><loc>${SITIO}${u}</loc><lastmod>${hoy}</lastmod></url>`)
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
        '',
      ].join('\n')
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}

export default defineConfig(({ mode }) => {
  // A dónde manda el proxy de desarrollo. Por defecto el backend de QA; con
  // `API_PROXY=http://localhost:3000` en un `.env.local` se prueba contra el de
  // esta máquina, que es el que sirve cuando el cambio todavía no subió.
  const env = loadEnv(mode, process.cwd(), '')
  const destino = env.API_PROXY || 'https://api-qa.bamardev.com'

  return {
    plugins: [react(), tailwindcss(), robotsYSitemap(mode)],
    build: {
      rollupOptions: {
        // Una página por ruta: la landing, la encuesta y el alta de prueba
        // (/empezar, B2). Cloudflare Pages sirve `encuesta.html` en /encuesta
        // (y así las demás) sin configurar nada, también al recargar; el
        // servidor de Vite hace lo mismo en desarrollo.
        //
        // Los textos legales NO se publican hasta completarlos (D1): tienen
        // [MARCADORES] sin llenar. Su código sigue en el repo (terminos.html,
        // privacidad.html y src/legal/); para volver a publicarlos,
        // descomentar estas dos entradas, los links del pie (Cierre.tsx) y
        // sacar sus reglas de public/_redirects.
        input: {
          main: resolve(__dirname, 'index.html'),
          encuesta: resolve(__dirname, 'encuesta.html'),
          empezar: resolve(__dirname, 'empezar.html'),
          // «Descargar Mobile»: los últimos 3 APK, leídos de versiones.json en R2.
          descargas: resolve(__dirname, 'descargas.html'),
          // Cuestionario de necesidades (levantamiento de requerimientos) que
          // llena un cliente desde un link con clave; las respuestas se leen
          // en el panel de licencias → Levantamientos. No se enlaza desde la
          // landing a propósito.
          necesidades: resolve(__dirname, 'necesidades.html'),
          // terminos: resolve(__dirname, 'terminos.html'),
          // privacidad: resolve(__dirname, 'privacidad.html'),
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
