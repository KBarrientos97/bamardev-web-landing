/**
 * Cloudflare Turnstile, el captcha del formulario de contacto. El backend lo
 * exige sólo cuando el VPS tiene `TURNSTILE_SECRET`; acá se dibuja sólo
 * cuando el build trae la site key. Así cada mitad puede publicarse sin
 * esperar a la otra (la misma pieza vive en bamardev-web para la reserva).
 *
 * El script se carga a pedido (render explícito) y una sola vez. El modo
 * (managed) es una propiedad del widget en el tablero de Cloudflare, no del
 * código.
 */

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export interface OpcionesTurnstile {
  sitekey: string
  language?: string
  theme?: 'auto' | 'light' | 'dark'
  size?: 'normal' | 'flexible' | 'compact'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  'timeout-callback'?: () => void
}

export interface ApiTurnstile {
  render: (contenedor: HTMLElement, opciones: OpcionesTurnstile) => string | undefined
  reset: (id?: string) => void
  remove: (id?: string) => void
}

declare global {
  interface Window {
    turnstile?: ApiTurnstile
  }
}

/** La site key del build. Es pública: viaja en el HTML de cualquier sitio con Turnstile. */
export function siteKeyTurnstile(): string | null {
  return import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || null
}

let cargando: Promise<ApiTurnstile> | null = null

/** Baja el script de Cloudflare la primera vez; las siguientes, reusa. */
export function cargarTurnstile(): Promise<ApiTurnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!cargando) {
    cargando = new Promise<ApiTurnstile>((ok, mal) => {
      const script = document.createElement('script')
      script.src = SCRIPT
      script.async = true
      script.defer = true
      const fallo = () => {
        // Que el próximo intento vuelva a probar en vez de quedar trabado.
        cargando = null
        script.remove()
        mal(new Error('No se pudo cargar Turnstile'))
      }
      script.onload = () => (window.turnstile ? ok(window.turnstile) : fallo())
      script.onerror = fallo
      document.head.appendChild(script)
    })
  }
  return cargando
}
