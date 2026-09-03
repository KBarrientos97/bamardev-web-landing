import { useEffect, useState } from 'react'
import { DESCUENTO_ANUAL, PLANES } from './planes'

/**
 * Los precios se administran desde el panel de licencias y los publica el
 * backend. La landing los lee al cargar; si la API no responde (o el CORS no
 * la deja) se quedan los valores fijos de planes.ts, que deben coincidir.
 */
export const API_PLANES_URL = 'https://api.bamardev.com/api/licencia/planes'

export interface PreciosVigentes {
  /** Precio mensual por nombre de plan ("Básico", "Profesional", "Full"). */
  precios: Record<string, number>
  /** Fracción de descuento anual (0.1 = 10 %). */
  descuento: number
  desdeApi: boolean
}

const FIJOS: PreciosVigentes = {
  precios: Object.fromEntries(PLANES.map((p) => [p.nombre, p.precio])),
  descuento: DESCUENTO_ANUAL,
  desdeApi: false,
}

export function usePrecios(): PreciosVigentes {
  const [estado, setEstado] = useState<PreciosVigentes>(FIJOS)

  useEffect(() => {
    let vivo = true
    fetch(API_PLANES_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((planes: { nombre: string; precioMensual: number; descuentoAnual: number }[]) => {
        if (!vivo || !Array.isArray(planes) || planes.length === 0) return
        const precios = { ...FIJOS.precios }
        for (const p of planes) {
          if (p.nombre in precios && Number.isFinite(p.precioMensual)) {
            precios[p.nombre] = p.precioMensual
          }
        }
        setEstado({
          precios,
          descuento: Number.isFinite(planes[0].descuentoAnual) ? planes[0].descuentoAnual : DESCUENTO_ANUAL,
          desdeApi: true,
        })
      })
      .catch(() => {
        /* sin red o sin CORS: quedan los fijos */
      })
    return () => {
      vivo = false
    }
  }, [])

  return estado
}
