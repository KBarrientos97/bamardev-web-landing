import { COMPARATIVA } from '../data/planes'

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
      className={`px-4 py-3.5 text-center text-sm text-slate-700 ${
        destacada ? 'bg-brand-50/70' : ''
      }`}
    >
      {contenido}
    </td>
  )
}

export function Comparativa() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Comparación rápida
        </h2>
        <p className="mt-3 text-lg text-slate-600">
          Lo mismo de arriba, en una sola mirada.
        </p>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[40rem] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm">
                <th className="px-4 py-4 text-left font-bold text-slate-500">
                  Incluye
                </th>
                <th className="px-4 py-4 text-center font-extrabold text-slate-900">
                  Básico
                </th>
                <th className="bg-brand-50 px-4 py-4 text-center font-extrabold text-brand-700">
                  Profesional
                </th>
                <th className="px-4 py-4 text-center font-extrabold text-slate-900">
                  Full
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARATIVA.map(([concepto, basico, profesional, full]) => (
                <tr key={concepto} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-600">
                    {concepto}
                  </td>
                  <Celda valor={basico} />
                  <Celda valor={profesional} destacada />
                  <Celda valor={full} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
