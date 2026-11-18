import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, m } from 'motion/react'
import { PLANES, comparativa } from '../data/planes'
import { usePrecios } from '../data/precios'
import { SUAVE } from './animacion'

/** Pinta "Sí" en verde y "—" apagado; el resto tal cual. */
function Celda({ valor, destacada }: { valor: string; destacada?: boolean }) {
  const contenido =
    valor === 'Sí' ? (
      <span className="font-bold text-brand-600">Sí</span>
    ) : valor === '—' ? (
      <span className="text-slate-300">—</span>
    ) : (
      valor
    )
  return (
    <td
      className={`px-3 py-3 text-center text-sm text-slate-700 sm:px-4 sm:py-3.5 ${
        destacada ? 'bg-brand-50/70' : ''
      }`}
    >
      {contenido}
    </td>
  )
}

function Tabla() {
  const { precios, descuento, cupo, descuentoPorPlazo } = usePrecios()
  const filas = comparativa(precios, descuento, cupo, descuentoPorPlazo)
  return (
    // En el celular la tabla se desliza de costado; la columna del concepto
    // queda fija para no perder de qué fila se trata.
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-sm">
            <th className="sticky left-0 bg-slate-50 px-3 py-3.5 text-left font-bold text-slate-500 sm:px-4">
              Incluye
            </th>
            {PLANES.map((plan) => (
              <th
                key={plan.codigo}
                className={`px-3 py-3.5 text-center font-extrabold sm:px-4 ${
                  plan.destacado ? 'bg-brand-50 text-brand-700' : 'text-slate-900'
                }`}
              >
                {plan.nombre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map(([concepto, ...valores]) => (
            <tr key={concepto} className="border-b border-slate-100 last:border-0">
              <td className="sticky left-0 bg-white px-3 py-3 text-sm font-semibold text-slate-600 sm:px-4 sm:py-3.5">
                {/* Angosta en el celular para que se vea al menos un plan al lado. */}
                <div className="w-28 sm:w-auto">{concepto}</div>
              </td>
              {valores.map((valor, i) => (
                <Celda key={PLANES[i].codigo} valor={valor} destacada={PLANES[i].destacado} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const FOCO = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** La ventana emergente. Va en el <body> (un ancestro con transform rompería el `fixed`). */
function Ventana({ alCerrar }: { alCerrar: () => void }) {
  const caja = useRef<HTMLDivElement>(null)
  const cerrar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // El fondo no se desplaza mientras está abierta, y el foco entra a la ventana.
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrar.current?.focus()

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return alCerrar()
      if (e.key !== 'Tab' || !caja.current) return
      // El foco da la vuelta dentro de la ventana en vez de irse a la página de atrás.
      const f = Array.from(caja.current.querySelectorAll<HTMLElement>(FOCO))
      if (f.length === 0) return
      const primero = f[0]
      const ultimo = f[f.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.body.style.overflow = antes
      document.removeEventListener('keydown', alTeclear)
    }
  }, [alCerrar])

  return createPortal(
    <m.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={alCerrar}
    >
      <m.div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparativa-titulo"
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        initial={{ opacity: 0, y: 48, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: SUAVE } }}
        exit={{ opacity: 0, y: 24, transition: { duration: 0.15 } }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 id="comparativa-titulo" className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Qué incluye cada plan
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Lo mismo de las tarjetas, en una sola mirada.</p>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto">
          <Tabla />
        </div>
      </m.div>
    </m.div>,
    document.body,
  )
}

/** Botón de información: abre la comparación completa en una ventana emergente. */
export function BotonComparativa() {
  const [abierta, setAbierta] = useState(false)
  const boton = useRef<HTMLButtonElement>(null)

  const cerrar = useCallback(() => {
    setAbierta(false)
    boton.current?.focus() // el foco vuelve al botón que la abrió
  }, [])

  return (
    <>
      <button
        ref={boton}
        type="button"
        onClick={() => setAbierta(true)}
        aria-haspopup="dialog"
        className="mx-auto mt-10 flex items-center gap-2.5 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700 hover:shadow-md active:scale-[0.98]"
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 9v5" />
          <circle cx="10" cy="6.2" r="0.6" fill="currentColor" />
        </svg>
        Ver qué incluye cada plan
      </button>
      <AnimatePresence>{abierta && <Ventana alCerrar={cerrar} />}</AnimatePresence>
    </>
  )
}
