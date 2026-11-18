import type { ReactNode } from 'react'
import { creditos, fmtBs, ventasDiaConvieneBasico } from '../data/planes'
import { usePaquetes } from '../data/paquetes'
import { usePrecios } from '../data/precios'
import { ConVentana } from './Modal'

/** "0,5" → "0,50": los montos por crédito siempre con dos decimales. */
function fmtCentavos(n: number): string {
  return n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** "Bs 35" si es entero, "Bs 32,50" si tiene centavos (el panel admite 2 decimales). */
function fmtPrecio(n: number): string {
  return Number.isInteger(n) ? fmtBs(n) : fmtCentavos(n)
}

function plural(n: number, singular: string, pluralTxt: string): string {
  return `${fmtBs(n)} ${n === 1 ? singular : pluralTxt}`
}

function Paso({ emoji, titulo, children }: { emoji: string; titulo: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl ring-1 ring-brand-100"
      >
        {emoji}
      </span>
      <div>
        <p className="font-extrabold text-slate-900">{titulo}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{children}</p>
      </div>
    </li>
  )
}

/**
 * Cómo funcionan los créditos del Emprendedor, en tres pasos y sin tablas.
 * Cupos, equivalencias, paquetes y regalo salen de la API (con los fijos de
 * planes.ts de respaldo), así que siguen cuadrando si el panel los cambia.
 */
function Contenido({ cerrar }: { cerrar: () => void }) {
  const { creditosPorVenta, creditosPorCita, regaloAlta, paquetes } = usePaquetes()
  const { precios, cupo } = usePrecios()
  const conviene = ventasDiaConvieneBasico(
    cupo,
    precios,
    paquetes.map((p) => p.precioPorCredito),
  )
  const extra = 20 // ventas de más en el día de feria del ejemplo

  return (
    <div className="space-y-6 p-5 sm:p-6">
      <ol className="space-y-3">
        <Paso emoji="🗓️" titulo={`Cada día tenés ${fmtBs(cupo.ventasDia)} ventas incluidas`}>
          Si trabajás con agenda, además tenés {fmtBs(cupo.citasDia)} citas por aparte. Mañana se renuevan.
        </Paso>
        <Paso emoji="✨" titulo="Si un día te pasás, no te frenamos">
          Seguís vendiendo con créditos: 1 venta = {creditos(creditosPorVenta)}, 1 cita ={' '}
          {creditos(creditosPorCita)}. Primero se gasta lo del día y recién después los créditos.
        </Paso>
        <Paso emoji="💚" titulo="Los créditos no vencen">
          Lo que no usás te queda para después.
          {regaloAlta > 0 && <> Los primeros {fmtBs(regaloAlta)} son de regalo cuando empezás.</>}
        </Paso>
      </ol>

      {paquetes.length > 0 && (
        <section>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">
            ¿Necesitás más? Elegís un paquete
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {paquetes.map((p) => (
              <div
                key={`${p.creditos}-${p.precio}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center"
              >
                <p className="text-3xl font-extrabold leading-none tracking-tight text-slate-900">{fmtBs(p.creditos)}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">créditos</p>
                <p className="mt-3 text-xl font-extrabold text-brand-700">Bs {fmtPrecio(p.precio)}</p>
                <p className="text-xs text-slate-500">Bs {fmtCentavos(p.precioPorCredito)} c/u</p>
                <p className="mt-3 text-xs leading-snug text-slate-600">
                  Alcanza para {plural(p.alcanzaVentas, 'venta', 'ventas')} o {plural(p.alcanzaCitas, 'cita', 'citas')}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-sm text-slate-600">
            Los comprás <strong>con QR desde la app</strong> y se cargan al instante.
          </p>
        </section>
      )}

      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
        <strong>Ejemplo:</strong> un día de feria vendés {fmtBs(cupo.ventasDia + extra)}.{' '}
        {fmtBs(cupo.ventasDia)} van incluidas y las otras {extra} las cubrís con {creditos(extra * creditosPorVenta)}.
      </p>

      <p className="border-t border-slate-200 pt-5 text-sm leading-relaxed text-slate-600">
        <strong className="text-slate-900">Ideal si vendés hasta unas {fmtBs(conviene)} ventas por día.</strong> Si
        todos los días pasás de ahí, el plan Básico (ventas ilimitadas, Bs {fmtBs(precios.BASICO)} al mes) te sale
        más a cuenta.{' '}
        <a
          href="#planes"
          onClick={cerrar}
          className="font-bold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-600"
        >
          Ver los planes
        </a>
      </p>
    </div>
  )
}

/**
 * Un botón (con la clase que le pase cada lugar) que abre la explicación de los
 * créditos en una ventana emergente.
 */
export function BotonCreditos({ className, children }: { className: string; children: ReactNode }) {
  return (
    <ConVentana
      titulo="¿Y si un día vendés de más?"
      subtitulo="En el plan Emprendedor seguís vendiendo, sin vueltas."
      ancho="max-w-2xl"
      disparador={(p) => (
        <button {...p} type="button" className={className}>
          {children}
        </button>
      )}
    >
      {(cerrar) => <Contenido cerrar={cerrar} />}
    </ConVentana>
  )
}
