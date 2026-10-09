import { useEffect, useState } from 'react'
import { CUPO_EMPRENDEDOR, PAQUETES_CREDITOS, REGALO_ALTA } from './planes'
import { API_BASE } from './precios'

/**
 * Paquetes de créditos del Emprendedor. Los edita el panel y los publica
 * `GET /licencia/paquetes-creditos` (pública, sin token). Si la API no
 * responde, o todavía no tiene la ruta (el backend de PROD va después que la
 * landing en el desarrollo), se muestran los fijos de planes.ts.
 */
export const API_PAQUETES_URL = `${API_BASE}/licencia/paquetes-creditos`

export interface PaqueteCreditos {
  creditos: number
  precio: number
  precioPorCredito: number
  alcanzaVentas: number
  alcanzaCitas: number
}

export interface CreditosVigentes {
  creditosPorVenta: number
  creditosPorCita: number
  regaloAlta: number
  paquetes: PaqueteCreditos[]
  desdeApi: boolean
}

/** `PaqueteCreditosVista` del contrato; sólo lo que la landing muestra. */
interface PaqueteApi {
  creditos?: number
  precio?: number
  precioPorCredito?: number
  alcanzaVentas?: number
  alcanzaCitas?: number
  activo?: boolean
  orden?: number
}

interface RespuestaApi {
  creditosPorVenta?: number
  creditosPorCita?: number
  regaloAlta?: number
  paquetes?: PaqueteApi[]
}

function positivo(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0
}

/** Lo que el backend calcula; se repite acá para los fijos (mismas fórmulas). */
function armar(creditos: number, precio: number, porVenta: number, porCita: number): PaqueteCreditos {
  return {
    creditos,
    precio,
    precioPorCredito: Math.round((precio / creditos) * 100) / 100,
    alcanzaVentas: Math.floor(creditos / porVenta),
    alcanzaCitas: Math.floor(creditos / porCita),
  }
}

const FIJOS: CreditosVigentes = {
  creditosPorVenta: CUPO_EMPRENDEDOR.creditosPorVenta,
  creditosPorCita: CUPO_EMPRENDEDOR.creditosPorCita,
  regaloAlta: REGALO_ALTA,
  paquetes: PAQUETES_CREDITOS.map((p) =>
    armar(p.creditos, p.precio, CUPO_EMPRENDEDOR.creditosPorVenta, CUPO_EMPRENDEDOR.creditosPorCita),
  ),
  desdeApi: false,
}

/**
 * Sin paquetes válidos se quedan los fijos: una lista vacía dejaría la sección
 * sin tabla, y es más probable un error de carga que "no se vende ninguno".
 */
function desdeApi(r: RespuestaApi): CreditosVigentes | null {
  if (!r || !Array.isArray(r.paquetes)) return null
  const porVenta = positivo(r.creditosPorVenta) ? r.creditosPorVenta : FIJOS.creditosPorVenta
  const porCita = positivo(r.creditosPorCita) ? r.creditosPorCita : FIJOS.creditosPorCita
  const paquetes = r.paquetes
    .filter((p) => p.activo !== false && positivo(p.creditos) && positivo(p.precio))
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map((p) => {
      const base = armar(p.creditos as number, p.precio as number, porVenta, porCita)
      return {
        ...base,
        // Si el backend ya lo calculó, manda el suyo.
        precioPorCredito: positivo(p.precioPorCredito) ? p.precioPorCredito : base.precioPorCredito,
        alcanzaVentas: positivo(p.alcanzaVentas) ? p.alcanzaVentas : base.alcanzaVentas,
        alcanzaCitas: positivo(p.alcanzaCitas) ? p.alcanzaCitas : base.alcanzaCitas,
      }
    })
  if (paquetes.length === 0) return null
  return {
    creditosPorVenta: porVenta,
    creditosPorCita: porCita,
    // 0 es un valor válido: el panel puede apagar el regalo.
    regaloAlta:
      typeof r.regaloAlta === 'number' && Number.isFinite(r.regaloAlta) && r.regaloAlta >= 0
        ? r.regaloAlta
        : FIJOS.regaloAlta,
    paquetes,
    desdeApi: true,
  }
}

let pedido: Promise<CreditosVigentes | null> | null = null

function pedirPaquetes(): Promise<CreditosVigentes | null> {
  pedido ??= fetch(API_PAQUETES_URL)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((r: RespuestaApi) => desdeApi(r))
    .catch(() => null) // sin red, sin CORS o sin la ruta (404): quedan los fijos
  return pedido
}

export function usePaquetes(): CreditosVigentes {
  const [estado, setEstado] = useState<CreditosVigentes>(FIJOS)

  useEffect(() => {
    let vivo = true
    pedirPaquetes().then((vigentes) => {
      if (vivo && vigentes) setEstado(vigentes)
    })
    return () => {
      vivo = false
    }
  }, [])

  return estado
}
