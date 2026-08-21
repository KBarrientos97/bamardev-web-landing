import { linkWhatsApp } from '../data/planes'
import { WhatsAppIcon } from './ui'

/** Alturas (en %) de las barras del mini-gráfico ilustrativo del mockup. */
const BARRAS = [35, 55, 42, 68, 50, 80, 95]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-16 text-white">
      {/* Resplandores de marca sobre el fondo oscuro */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-24 h-96 w-96 rounded-full bg-brand-600/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-300">
            Restaurantes · Farmacias · Ferreterías
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            El sistema que maneja tu negocio{' '}
            <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
              y te dice cuánto ganás.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Punto de venta, inventario, delivery y control de costos en un solo
            lugar. Se maneja desde el celular o la tablet, y sigue vendiendo
            aunque se corte el internet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#planes"
              className="rounded-full bg-brand-500 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-500/30 transition hover:bg-brand-400"
            >
              Ver planes para restaurantes
            </a>
            <a
              href={linkWhatsApp('Hola BamarDev, quiero ver el sistema funcionando en mi negocio.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-bold text-white transition hover:border-brand-400/60 hover:text-brand-300"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Pedir una demo
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-400">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Funciona sin internet
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              App Android y tablet
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Respaldo en la nube
            </li>
          </ul>
        </div>

        {/* Mockup ilustrativo del dashboard */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white p-6 text-slate-800 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">Ventas de hoy</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                En vivo
              </span>
            </div>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
              Bs 4.850
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-600">
              ▲ 18% vs. ayer
            </p>

            <div className="mt-6 flex h-24 items-end gap-2">
              {BARRAS.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-t-md ${
                    i === BARRAS.length - 1 ? 'bg-brand-500' : 'bg-brand-100'
                  }`}
                />
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-slate-100 pt-4 text-sm">
              <span className="font-semibold text-slate-500">
                Efectivo <span className="text-slate-900">Bs 2.980</span>
              </span>
              <span className="font-semibold text-slate-500">
                QR <span className="text-slate-900">Bs 1.870</span>
              </span>
            </div>
          </div>

          {/* Tarjetas flotantes */}
          <div className="absolute -right-6 -top-12 hidden rotate-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 shadow-xl sm:block">
            <p className="text-xs font-bold text-slate-400">Pedido #42</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              En cocina · Mesa 5
            </p>
          </div>
          <div className="absolute -bottom-12 -left-6 hidden -rotate-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 shadow-xl sm:block">
            <p className="text-xs font-bold text-slate-400">Alerta de stock</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Queso mozzarella · 2 kg
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
