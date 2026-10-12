import { m } from 'motion/react'
import { Aparecer, Escalonado, itemVariantes } from './animacion'
import { creditos, fmtBs, ventasDiaConvieneBasico } from '../data/planes'
import { usePaquetes } from '../data/paquetes'
import { usePrecios } from '../data/precios'
import { CheckIcon } from './ui'

/** "0,5" → "0,50": los montos por crédito siempre con dos decimales. */
function fmtCentavos(n: number): string {
  return n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Precio de un paquete: "Bs 35" si es entero, "Bs 32,50" si tiene centavos
 * (el panel admite 2 decimales y fmtBs mostraba "32,5").
 */
function fmtPrecio(n: number): string {
  return Number.isInteger(n) ? fmtBs(n) : fmtCentavos(n)
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
  const conviene = ventasDiaConvieneBasico(
    cupo,
    precios,
    paquetes.map((p) => p.precioPorCredito),
  )
  // Cuatro días de ejemplo. Los números salen del cupo vigente, así siguen
  // cuadrando si el panel lo cambia: ventas y citas son contadores separados.
  const ejemplos = [
    {
      emoji: '🙂',
      titulo: 'Un día tranquilo',
      detalle: `${fmtBs(Math.round(cupo.ventasDia * 0.7))} ventas`,
      extra: 0,
    },
    {
      emoji: '🎉',
      titulo: 'Un día de feria',
      detalle: `${fmtBs(cupo.ventasDia + 20)} ventas: ${fmtBs(cupo.ventasDia)} incluidas + 20 con créditos`,
      extra: 20 * creditosPorVenta,
    },
    {
      emoji: '💇',
      titulo: 'Un salón',
      detalle: `${fmtBs(Math.max(cupo.citasDia - 5, 1))} citas y 15 ventas de productos: van por separado`,
      extra: 0,
    },
    {
      emoji: '📅',
      titulo: 'Quincena llena',
      detalle: `${fmtBs(cupo.citasDia + 5)} citas: ${fmtBs(cupo.citasDia)} incluidas + 5 con créditos`,
      extra: 5 * creditosPorCita,
    },
  ]
  // Sin paquetes a la venta ni regalo (los dos se apagan desde el panel) no
  // hay tabla que mostrar.
  const hayTabla = paquetes.length > 0 || regaloAlta > 0

  return (
    <section id="creditos" className="scroll-mt-16 bg-white pb-20 lg:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Aparecer className="grid gap-10 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-10 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:p-12">
          {/* Explicación */}
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600">
              Plan Emprendedor · Créditos
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              ¿Un día vendés de más? Seguís vendiendo con créditos.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Cada día tenés {fmtBs(cupo.ventasDia)} ventas incluidas y, si
              trabajás con agenda, {fmtBs(cupo.citasDia)} citas más, que se
              cuentan por separado. Al día siguiente se renuevan. Si un día te
              pasás, el sistema usa tus créditos: primero se gasta lo del día y
              recién después los créditos.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <m.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.3 }}
                className="rounded-2xl border border-brand-200 bg-white px-4 py-2.5 text-base font-extrabold text-slate-900 shadow-sm"
              >
                1 venta = <span className="text-brand-700">{creditos(creditosPorVenta)}</span>
              </m.span>
              <m.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.42 }}
                className="rounded-2xl border border-brand-200 bg-white px-4 py-2.5 text-base font-extrabold text-slate-900 shadow-sm"
              >
                1 cita = <span className="text-brand-700">{creditos(creditosPorCita)}</span>
              </m.span>
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
            {hayTabla && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-3 py-3.5 font-bold text-slate-500 sm:px-5">Paquete</th>
                      <th className="px-3 py-3.5 font-bold text-slate-500 sm:px-5">Precio</th>
                      <th className="px-3 py-3.5 font-bold text-slate-500 sm:px-5">Te alcanza para</th>
                    </tr>
                  </thead>
                  <m.tbody
                    variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
                    initial="oculto"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {paquetes.map((p) => (
                      <m.tr
                        key={`${p.creditos}-${p.precio}`}
                        variants={itemVariantes}
                        className="border-b border-slate-100 transition-colors hover:bg-brand-50/50"
                      >
                        <td className="px-3 py-3.5 font-extrabold text-slate-900 sm:px-5">
                          {creditos(p.creditos)}
                        </td>
                        <td className="px-3 py-3.5 sm:px-5">
                          <span className="font-extrabold text-slate-900">Bs {fmtPrecio(p.precio)}</span>
                          <span className="block whitespace-nowrap text-xs text-slate-500">
                            Bs {fmtCentavos(p.precioPorCredito)} c/u
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-slate-700 sm:px-5">
                          {alcanza(p.alcanzaVentas, p.alcanzaCitas)}
                        </td>
                      </m.tr>
                    ))}
                    {regaloAlta > 0 && (
                      <m.tr variants={itemVariantes} className="bg-brand-50/70">
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
                      </m.tr>
                    )}
                  </m.tbody>
                </table>
              </div>
            )}

            <p className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-relaxed text-slate-600">
              <strong className="text-slate-900">
                Ideal si vendés hasta unas {fmtBs(conviene)} ventas por día.
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
        </Aparecer>

        {/* Ejemplos de un día cualquiera, con el cupo y los valores vigentes */}
        <p className="mt-10 text-center text-sm font-bold uppercase tracking-widest text-slate-500">
          Así se ve en un día cualquiera
        </p>
        <Escalonado paso={0.1} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ejemplos.map((e) => (
            <m.article
              key={e.titulo}
              variants={itemVariantes}
              whileHover={{ y: -4, rotate: -0.5 }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
            >
              <p className="inline-block text-2xl transition-transform duration-300 group-hover:scale-125" aria-hidden>{e.emoji}</p>
              <p className="mt-2 text-sm font-extrabold text-slate-900">{e.titulo}</p>
              <p className="mt-1 text-sm text-slate-600">{e.detalle}</p>
              <p
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-extrabold ${
                  e.extra === 0 ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {e.extra === 0 ? 'Todo incluido' : `Usás ${creditos(e.extra)}`}
              </p>
            </m.article>
          ))}
        </Escalonado>
      </div>
    </section>
  )
}
