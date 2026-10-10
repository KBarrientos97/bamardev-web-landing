import { WHATSAPP_DISPLAY, linkWhatsApp, notaLegal } from '../data/planes'
import { usePrecios } from '../data/precios'
import { Contacto } from './Contacto'

export function Cierre() {
  return (
    <section id="contacto" className="scroll-mt-16 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl"
          />
          <div className="relative">
            <img src="/logo-marca.png" alt="" className="mx-auto h-16 w-16 drop-shadow-lg" />
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              ¿Querés ver el sistema funcionando en tu negocio?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Coordinamos una visita a tu local o te lo mostramos por
              videollamada — sin compromiso.
            </p>
            <div className="mt-8">
              <Contacto />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { descuento, cupo } = usePrecios()
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <img src="/logo-marca.png" alt="BamarDev" className="h-9 w-9" />
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              BamarDev <span className="font-medium text-slate-500">Technology</span>
            </span>
          </div>
          <a
            href={linkWhatsApp('Hola BamarDev, tengo una consulta.')}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-brand-700 hover:text-brand-600"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>
        <p className="mt-8 max-w-4xl text-xs leading-relaxed text-slate-400">
          {notaLegal(descuento, cupo)}
        </p>
        <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} BamarDev Technology. Todos los derechos
            reservados.
          </p>
          {/* Ocultos hasta completar los textos legales (D1): todavía tienen
              [MARCADORES] sin llenar, y vite.config.ts no publica /terminos ni
              /privacidad. Para volver a mostrarlos, descomentar esto y las
              dos entradas de vite.config.ts, y sacar las reglas de
              public/_redirects.
          <p className="flex gap-4">
            <a href="/terminos" className="font-semibold hover:text-brand-600">
              Términos del servicio
            </a>
            <a href="/privacidad" className="font-semibold hover:text-brand-600">
              Política de privacidad
            </a>
          </p>
          */}
        </div>
      </div>
    </footer>
  )
}
