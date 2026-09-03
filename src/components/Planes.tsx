import { useState } from 'react'
import {
  PLANES,
  ahorroAnual,
  fmtBs,
  linkWhatsApp,
  mensualEquivalente,
  precioAnual,
} from '../data/planes'
import { usePrecios } from '../data/precios'
import { CheckIcon } from './ui'

export function Planes() {
  // Mensual / Anual: el precio grande siempre es "por mes"; en anual se
  // muestra el equivalente mensual y, debajo, lo que se paga por el año.
  const [anual, setAnual] = useState(false)
  // Precios vigentes: los que administra el panel (con los fijos de respaldo).
  const { precios, descuento } = usePrecios()
  const pctDescuento = Math.round(descuento * 100)

  return (
    <section id="planes" className="scroll-mt-16 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-600">
          Planes para restaurantes
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          De vender a saber cuánto ganás realmente.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-600">
          Básico te pone a vender desde el día uno; Profesional te da el control
          de un sistema de gestión completo; Full te muestra cuánto gastás en
          producir y cuánto ganás realmente.
        </p>

        {/* Mensual / Anual */}
        <div className="mt-10 flex justify-center">
          <div
            role="group"
            aria-label="Forma de pago"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-bold"
          >
            <button
              type="button"
              onClick={() => setAnual(false)}
              aria-pressed={!anual}
              className={`rounded-full px-5 py-2 transition ${
                !anual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setAnual(true)}
              aria-pressed={anual}
              className={`flex items-center gap-2 rounded-full px-5 py-2 transition ${
                anual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Anual
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-extrabold text-brand-700">
                −{pctDescuento} %
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {PLANES.map((plan) => {
            const mensual = precios[plan.nombre] ?? plan.precio
            const total = precioAnual(mensual, descuento)
            const porMes = anual ? mensualEquivalente(mensual, descuento) : mensual
            const mensajeWhatsApp = anual
              ? `Hola BamarDev, me interesa el plan ${plan.nombre} con pago anual (Bs ${fmtBs(total)}/año) para mi restaurante.`
              : `Hola BamarDev, me interesa el plan ${plan.nombre} (Bs ${mensual}/mes) para mi restaurante.`
            return (
              <article
                key={plan.nombre}
                className={`relative flex flex-col rounded-3xl p-8 ${
                  plan.destacado
                    ? 'border-2 border-brand-500 bg-brand-50/50 shadow-2xl shadow-brand-200 lg:-my-4 lg:py-12'
                    : 'border border-slate-200 bg-white shadow-sm'
                }`}
              >
                {plan.destacado && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg">
                    Más elegido
                  </span>
                )}

                <h3 className="text-2xl font-extrabold text-slate-900">
                  {plan.nombre}
                </h3>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-widest text-brand-600">
                  {plan.objetivo}
                </p>
                <p className="mt-3 min-h-12 text-sm leading-relaxed text-slate-600">
                  {plan.descripcion}
                </p>

                <p className="mt-6">
                  <span className="align-top text-lg font-bold text-slate-500">
                    Bs
                  </span>{' '}
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                    {porMes}
                  </span>
                  <span className="text-base font-semibold text-slate-500">
                    {' '}
                    / mes
                  </span>
                </p>
                <p className="mt-1.5 min-h-10 text-sm text-slate-500">
                  {anual ? (
                    <>
                      Bs {fmtBs(total)} al año, pagado por adelantado.{' '}
                      <span className="font-bold text-brand-700">
                        Ahorrás Bs {fmtBs(ahorroAnual(mensual, descuento))}.
                      </span>
                    </>
                  ) : (
                    <>
                      Facturación mensual. Pagando el año: Bs {fmtBs(total)}{' '}
                      (−{pctDescuento} %).
                    </>
                  )}
                </p>

                <a
                  href={linkWhatsApp(mensajeWhatsApp)}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-6 rounded-full px-6 py-3 text-center text-sm font-bold transition ${
                    plan.destacado
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-500'
                      : 'border border-slate-300 text-slate-700 hover:border-brand-500 hover:text-brand-700'
                  }`}
                >
                  Empezar con {plan.nombre}
                </a>

                {plan.notaPrevia && (
                  <p className="mt-7 text-xs font-extrabold uppercase tracking-widest text-brand-700">
                    {plan.notaPrevia}
                  </p>
                )}
                <ul className={`space-y-3 text-sm text-slate-700 ${plan.notaPrevia ? 'mt-4' : 'mt-7'}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <p className="mx-auto mt-12 max-w-2xl rounded-2xl bg-slate-50 px-6 py-4 text-center text-sm text-slate-600">
          ¿Tenés una <strong>farmacia</strong> o una <strong>ferretería</strong>?
          Los planes para tu rubro están en camino —{' '}
          <a
            href={linkWhatsApp('Hola BamarDev, quiero que me avisen cuando estén los planes para mi rubro (farmacia / ferretería).')}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-600"
          >
            escribinos y te avisamos primero
          </a>
          .
        </p>
      </div>
    </section>
  )
}
