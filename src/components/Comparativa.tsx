import { PLANES, comparativa } from '../data/planes'
import { usePrecios } from '../data/precios'
import { ConVentana } from './Modal'

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

/** Botón de información: abre la comparación completa en una ventana emergente. */
export function BotonComparativa() {
  return (
    <ConVentana
      titulo="Qué incluye cada plan"
      subtitulo="Lo mismo de las tarjetas, en una sola mirada."
      disparador={(p) => (
        <button
          {...p}
          type="button"
          className="mx-auto mt-10 flex items-center gap-2.5 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700 hover:shadow-md active:scale-[0.98]"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="10" cy="10" r="8" />
            <path d="M10 9v5" />
            <circle cx="10" cy="6.2" r="0.6" fill="currentColor" />
          </svg>
          Ver qué incluye cada plan
        </button>
      )}
    >
      <Tabla />
    </ConVentana>
  )
}
