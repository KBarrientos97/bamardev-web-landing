import { useEffect, useState } from 'react'
import { CUPO_EMPRENDEDOR, DESCUENTO_ANUAL, PLANES, type CodigoPlan, type CupoPlan } from './planes'

/**
 * Los precios se administran desde el panel de licencias y los publica el
 * backend. La landing los lee al cargar; si la API no responde (o el CORS no
 * la deja) se quedan los valores fijos de planes.ts, que deben coincidir.
 *
 * Apunta fijo a PROD también en el build de QA: la landing pública siempre
 * muestra los precios reales. paquetes.ts usa la misma base.
 */
export const API_BASE = 'https://api.bamardev.com/api'
export const API_PLANES_URL = `${API_BASE}/licencia/planes`

export interface PreciosVigentes {
  /** Precio mensual por código de plan. */
  precios: Record<CodigoPlan, number>
  /** Fracción de descuento anual (0.15 = 15 %). */
  descuento: number
  /** Cupo diario del Emprendedor y lo que cuesta pasarse. */
  cupo: CupoPlan
  desdeApi: boolean
}

/** Lo que publica `GET /licencia/planes` y la landing usa (el resto se ignora). */
interface PlanApi {
  codigo?: string
  nombre?: string
  precioMensual?: number
  descuentoAnual?: number
  // Sólo los publica el backend con el Emprendedor (oct-2026); antes no vienen.
  limiteVentasDia?: number | null
  limiteCitasDia?: number | null
  creditosPorVenta?: number
  creditosPorCita?: number
}

const FIJOS: PreciosVigentes = {
  precios: Object.fromEntries(PLANES.map((p) => [p.codigo, p.precio])) as Record<CodigoPlan, number>,
  descuento: DESCUENTO_ANUAL,
  cupo: CUPO_EMPRENDEDOR,
  desdeApi: false,
}

function positivo(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0
}

/** El plan de la API que corresponde a uno de los nuestros, por código o por nombre. */
function codigoDe(p: PlanApi): CodigoPlan | null {
  const porCodigo = PLANES.find((pl) => pl.codigo === p.codigo)
  if (porCodigo) return porCodigo.codigo
  const porNombre = PLANES.find((pl) => pl.nombre === p.nombre)
  return porNombre ? porNombre.codigo : null
}

/**
 * Si la API todavía no conoce el Emprendedor (el backend de PROD va después),
 * quedan su precio y su cupo fijos y el resto de los planes se actualiza igual.
 * Un límite en null significaría "sin límite", que no tiene sentido mostrar en
 * este plan: también queda el fijo.
 */
function desdeApi(planes: PlanApi[]): PreciosVigentes {
  const precios = { ...FIJOS.precios }
  let cupo = FIJOS.cupo
  for (const p of planes) {
    const codigo = codigoDe(p)
    if (!codigo) continue
    if (positivo(p.precioMensual)) precios[codigo] = p.precioMensual
    if (codigo === 'EMPRENDEDOR') {
      cupo = {
        ventasDia: positivo(p.limiteVentasDia) ? p.limiteVentasDia : FIJOS.cupo.ventasDia,
        citasDia: positivo(p.limiteCitasDia) ? p.limiteCitasDia : FIJOS.cupo.citasDia,
        creditosPorVenta: positivo(p.creditosPorVenta) ? p.creditosPorVenta : FIJOS.cupo.creditosPorVenta,
        creditosPorCita: positivo(p.creditosPorCita) ? p.creditosPorCita : FIJOS.cupo.creditosPorCita,
      }
    }
  }
  const descuento = planes[0].descuentoAnual
  return {
    precios,
    descuento: typeof descuento === 'number' && Number.isFinite(descuento) ? descuento : DESCUENTO_ANUAL,
    cupo,
    desdeApi: true,
  }
}

// Varias secciones usan los precios: se piden una sola vez por carga de página.
let pedido: Promise<PreciosVigentes | null> | null = null

function pedirPrecios(): Promise<PreciosVigentes | null> {
  pedido ??= fetch(API_PLANES_URL)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((planes: PlanApi[]) => (Array.isArray(planes) && planes.length > 0 ? desdeApi(planes) : null))
    .catch(() => null) // sin red o sin CORS: quedan los fijos
  return pedido
}

export function usePrecios(): PreciosVigentes {
  const [estado, setEstado] = useState<PreciosVigentes>(FIJOS)

  useEffect(() => {
    let vivo = true
    pedirPrecios().then((vigentes) => {
      if (vivo && vigentes) setEstado(vigentes)
    })
    return () => {
      vivo = false
    }
  }, [])

  return estado
}
