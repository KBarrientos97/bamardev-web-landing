import type { Cuestionario, Parche } from './tipos'

/**
 * En los builds la fija `.env.production` / `.env.qa`. En `npm run dev` queda
 * vacía y se pega a /api, que el proxy de Vite reenvía (ver vite.config.ts).
 */
const API = import.meta.env.VITE_API_URL || '/api'

/** Un fallo del servidor (`status` 4xx/5xx) o de la red (`status` 0). */
export class ErrorApi extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }

  /** No hubo respuesta: sin internet o servidor caído. Se puede reintentar. */
  get sinRed() {
    return this.status === 0 || this.status === 429 || this.status >= 502
  }
}

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API}/levantamientos/publico/${ruta}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ErrorApi('Sin conexión a internet', 0)
  }
  if (!res.ok) {
    let mensaje = 'No se pudo completar la acción'
    try {
      const cuerpo = await res.json()
      const m = cuerpo?.message
      mensaje = Array.isArray(m) ? m.join('. ') : typeof m === 'string' ? m : mensaje
    } catch {
      /* la respuesta no era JSON (p. ej. un 502 de la red) */
    }
    throw new ErrorApi(mensaje, res.status)
  }
  return (await res.json()) as T
}

export const cargarCuestionario = (token: string) =>
  pedir<Cuestionario>(encodeURIComponent(token))

export const guardarParche = (token: string, parche: Parche) =>
  pedir<{ ok: true; guardadoEn: string }>(encodeURIComponent(token), {
    method: 'PATCH',
    body: JSON.stringify(parche),
  })

export const enviarCuestionario = (token: string, quien: string, cargo: string) =>
  pedir<{ ok: true; enviadoEn: string }>(`${encodeURIComponent(token)}/enviar`, {
    method: 'POST',
    body: JSON.stringify({ quien, cargo: cargo || undefined }),
  })
