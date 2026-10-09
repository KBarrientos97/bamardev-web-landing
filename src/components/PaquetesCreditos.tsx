import { VENTAS_DIA_CONVIENE_BASICO, creditos, fmtBs } from '../data/planes'
import { usePaquetes } from '../data/paquetes'
import { usePrecios } from '../data/precios'
import { CheckIcon } from './ui'

/** "0,5" → "0,50": los montos por crédito siempre con dos decimales. */
function fmtCentavos(n: number): string {
  return n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function plural(n: number, singular: string, pluralTxt: string): string {
  return `${fmtBs(n)} ${n === 1 ? singular : pluralTxt}`
}

/** "20 ventas o 10 citas": lo que rinde un paquete, para no hacer la cuenta. */
function alcanza(ventas: number, citas: number): string {
  return `${plural(ventas, 'venta', 'ventas')} o ${plural(citas, 'cita', 'citas')}`
}

/**
 * Cómo funcionan los créditos del Emprendedor y cuánto cuestan. Va entre las
 * tarjetas de planes y la comparación. Paquetes, regalo y equivalencias salen
 * de la API (con los fijos de planes.ts de respaldo).
 */
export function PaquetesCreditos() {
  const { creditosPorVenta, creditosPorCita, regaloAlta, paquetes } = usePaquetes()
  const { precios, cupo } = usePrecios()

  return (
    <section id="creditos" className="scroll-mt-16 bg-white pb-20 lg:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-10 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:p-12">
          {/* Explicación */}
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600">
              Plan Emprendedor · Créditos
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              ¿Un día vendés de más? Seguís vendiendo con créditos.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Cada día tenés {fmtBs(cupo.ventasDia)} ventas y {fmtBs(cupo.citasDia)}{' '}
              citas incluidas, y al día siguiente se renuevan. Si un día te
              pasás, el sistema usa tus créditos: primero se gasta lo del día y
              recién después los créditos.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-2xl border border-brand-200 bg-white px-4 py-2.5 text-base font-extrabold text-slate-900 shadow-sm">
                1 venta = <span className="text-brand-700">{creditos(creditosPorVenta)}</span>
              </span>
              <span className="rounded-2xl border border-brand-200 bg-white px-4 py-2.5 text-base font-extrabold text-slate-900 shadow-sm">
                1 cita = <span className="text-brand-700">{creditos(creditosPorCita)}</span>
              </span>
            </div>

            <ul className="mt-7 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2.5">
                <CheckIcon />
                <span>
                  <strong>No vencen.</strong> Lo que no usás este mes te queda
                  para el siguiente.
                </span>
              </li>
              {regaloAlta > 0 && (
                <li className="flex gap-2.5">
                  <CheckIcon />
                  <span>
                    <strong>Los primeros {fmtBs(regaloAlta)} son de regalo</strong>{' '}
                    cuando empezás.
                  </span>
                </li>
              )}
              <li className="flex gap-2.5">
                <CheckIcon />
                <span>
                  Los comprás <strong>con QR desde la app</strong> y se cargan
                  al instante.
                </span>
              </li>
            </ul>
          </div>

          {/* Paquetes */}
          <div className="lg:pt-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-3 py-3.5 font-bold text-slate-500 sm:px-5">Paquete</th>
                    <th className="px-3 py-3.5 font-bold text-slate-500 sm:px-5">Precio</th>
                    <th className="px-3 py-3.5 font-bold text-slate-500 sm:px-5">Te alcanza para</th>
                  </tr>
                </thead>
                <tbody>
                  {paquetes.map((p) => (
                    <tr key={`${p.creditos}-${p.precio}`} className="border-b border-slate-100">
                      <td className="px-3 py-3.5 font-extrabold text-slate-900 sm:px-5">
                        {creditos(p.creditos)}
                      </td>
                      <td className="px-3 py-3.5 sm:px-5">
                        <span className="font-extrabold text-slate-900">Bs {fmtBs(p.precio)}</span>
                        <span className="block whitespace-nowrap text-xs text-slate-500">
                          Bs {fmtCentavos(p.precioPorCredito)} c/u
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-700 sm:px-5">
                        {alcanza(p.alcanzaVentas, p.alcanzaCitas)}
                      </td>
                    </tr>
                  ))}
                  {regaloAlta > 0 && (
                    <tr className="bg-brand-50/70">
                      <td className="px-3 py-3.5 font-extrabold text-brand-800 sm:px-5">
                        {creditos(regaloAlta)}
                        <span className="block text-xs font-semibold text-brand-700">de regalo</span>
                      </td>
                      <td className="px-3 py-3.5 font-extrabold text-brand-800 sm:px-5">
                        Gratis
                        <span className="block text-xs font-semibold text-brand-700">al empezar</span>
                      </td>
                      <td className="px-3 py-3.5 text-brand-800 sm:px-5">
                        {alcanza(
                          Math.floor(regaloAlta / creditosPorVenta),
                          Math.floor(regaloAlta / creditosPorCita),
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-relaxed text-slate-600">
              <strong className="text-slate-900">
                Ideal si vendés hasta unas {VENTAS_DIA_CONVIENE_BASICO} ventas por día.
              </strong>{' '}
              Si todos los días pasás de ahí, el{' '}
              <a
                href="#planes"
                className="font-bold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-600"
              >
                plan Básico
              </a>
              , con ventas ilimitadas por Bs {fmtBs(precios.BASICO)} al mes, te sale más a cuenta.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
