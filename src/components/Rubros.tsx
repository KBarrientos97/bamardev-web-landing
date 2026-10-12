import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { fmtBs, linkWhatsApp } from '../data/planes'
import { usePaquetes } from '../data/paquetes'
import { usePrecios } from '../data/precios'
import { CheckIcon, WhatsAppIcon } from './ui'
import { Aparecer, Escalonado, Numero, SUAVE, itemVariantes } from './animacion'

type Modo = 'ventas' | 'agenda'

interface Rubro {
  emoji: string
  nombre: string
  puntos: string[]
  /** Cómo se presenta el interesado en el WhatsApp de la demo. */
  quienEscribe: string
}

/*
  Dos maneras de trabajar, como en la pieza de campaña del Emprendedor (oct-2026):
  el que vende productos y el que trabaja con agenda. Los rubros son los de
  PerfilRubro (GET /api/rubros) y los puntos sólo nombran features que su vertical
  recibe (FeatureVertical); las que son de Profesional lo dicen.

  Belleza: `agenda`, `clientes` y la cola de la barbería son fijas del rubro y
  vienen en todos los planes. Reservas online, comisiones, propinas, paquetes,
  gift cards y ficha técnica no tienen plan asignado (PLAN-AGENDA-BELLEZA §2.5):
  el operador las prende negocio por negocio, por eso llevan asterisco y la nota
  de abajo, y no se prometen en las tarjetas de planes.
*/
const RUBROS: Record<Modo, Rubro[]> = {
  ventas: [
    {
      emoji: '🍗',
      nombre: 'Restaurantes y pollerías',
      puntos: [
        'Comanda Mesa / Llevar y pedidos para recoger',
        'Insumos y recetas: sabés cuánto te cuesta cada plato',
        'Salón con meseros y delivery con app del repartidor (Profesional)',
      ],
      quienEscribe: 'tengo un restaurante',
    },
    {
      emoji: '🛒',
      nombre: 'Minimarkets y tiendas',
      puntos: [
        'Venta rápida con buscador y categorías',
        'Stock real con aviso de lo que se está acabando',
        'Fiado por cliente, con sus abonos y lo que te debe',
      ],
      quienEscribe: 'tengo un minimarket o tienda',
    },
    {
      emoji: '🔩',
      nombre: 'Ferreterías y repuestos',
      puntos: [
        'Muchos productos, ordenados y fáciles de encontrar',
        'Encargos de lo que el cliente pidió y no había',
        'Stock y precio por sucursal',
      ],
      quienEscribe: 'tengo una ferretería o casa de repuestos',
    },
    {
      emoji: '💊',
      nombre: 'Farmacias',
      puntos: [
        'Lotes y vencimientos: nada vencido se vende (Profesional)',
        'Venta con receta y libro de controlados',
        'Encargos, proveedores y catálogo importado desde Excel',
      ],
      quienEscribe: 'tengo una farmacia',
    },
  ],
  agenda: [
    {
      emoji: '✂️',
      nombre: 'Peluquerías',
      puntos: [
        'Agenda del día y de la semana por estilista',
        'Ficha del cliente con historial y alergias',
        'Ficha técnica con fotos de cada trabajo*',
      ],
      quienEscribe: 'tengo una peluquería',
    },
    {
      emoji: '💈',
      nombre: 'Barberías',
      puntos: [
        'Cola para los que llegan sin turno',
        'Agenda por barbero, sin turnos repetidos',
        'Propinas y comisiones por barbero*',
      ],
      quienEscribe: 'tengo una barbería',
    },
    {
      emoji: '🧖',
      nombre: 'Spa',
      puntos: [
        'Cabinas y profesionales, cada uno con su agenda',
        'Paquetes de sesiones y gift cards*',
        'Reservas online desde tu enlace*',
      ],
      quienEscribe: 'tengo un spa',
    },
    {
      emoji: '💅',
      nombre: 'Uñas y estética',
      puntos: [
        'Tu cliente elige servicio, profesional y hora*',
        'La cita se cobra en la misma caja',
        'Comisiones por profesional, con adelantos*',
      ],
      quienEscribe: 'tengo un local de uñas o estética',
    },
  ],
}

/** Lo que comparten todos los rubros de cada modo (columna oscura). */
const INCLUYE: Record<Modo, string[]> = {
  ventas: [
    'Cobro en efectivo, QR, mixto y fiado',
    'Caja con arqueo y anulaciones con PIN',
    'Inventario, gastos y ganancia estimada',
    'Sigue vendiendo sin internet',
  ],
  agenda: [
    'Agenda por profesional, sin turnos repetidos',
    'Ficha de cada cliente',
    'La cita se cobra en el mismo punto de venta',
    'Venta de productos, caja e inventario',
  ],
}

/** Rubros que nos piden y todavía no tienen su versión: ejemplos del "pedilo". */
const OTROS = ['Panaderías', 'Veterinarias', 'Talleres', 'Ropa y calzado', 'Celulares', 'Distribuidoras']

/** `#agenda` y `#ventas` abren la pestaña: los anuncios de belleza enlazan directo. */
function modoDelHash(): Modo | null {
  const h = window.location.hash.replace('#', '')
  return h === 'agenda' || h === 'ventas' ? h : null
}

export function Rubros() {
  const [modo, setModo] = useState<Modo>(() => modoDelHash() ?? 'ventas')
  const { cupo } = usePrecios()
  const { paquetes } = usePaquetes()
  // El paquete más barato, para el "desde": sale del panel, no es un número fijo.
  const desde = paquetes.length ? Math.min(...paquetes.map((p) => p.precio)) : null

  useEffect(() => {
    const alCambiar = () => {
      const m = modoDelHash()
      if (m) setModo(m)
    }
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  const esAgenda = modo === 'agenda'

  return (
    <section id="rubros" className="relative scroll-mt-16 bg-white py-20 lg:py-28">
      {/* Anclas para enlazar una pestaña desde un anuncio (bamardev.com/#agenda) */}
      <span id="ventas" className="absolute top-0 scroll-mt-16" aria-hidden />
      <span id="agenda" className="absolute top-0 scroll-mt-16" aria-hidden />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Aparecer>
        <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-600">
          Rubros
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          ¿Cómo trabaja tu negocio?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
          Un solo sistema que se arma según tu rubro: si vendés productos o si
          trabajás con citas, ves sólo lo que usás.
        </p>
        </Aparecer>

        {/* Pestañas */}
        <div
          role="tablist"
          aria-label="Tipo de negocio"
          className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-1.5"
        >
          {(
            [
              { m: 'ventas', icono: '🛒', titulo: 'Ventas', sub: 'Vendo productos' },
              { m: 'agenda', icono: '📅', titulo: 'Agenda', sub: 'Trabajo con citas' },
            ] as const
          ).map((t) => {
            const activa = modo === t.m
            return (
              <button
                key={t.m}
                type="button"
                role="tab"
                id={`tab-${t.m}`}
                aria-selected={activa}
                aria-controls={`panel-${t.m}`}
                onClick={() => setModo(t.m)}
                className={`relative flex items-center justify-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors sm:px-5 ${
                  activa ? '' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {/* El fondo blanco de la pestaña activa es UNO solo que se
                    desliza de una a otra (layoutId). */}
                {activa && (
                  <m.span
                    layoutId="pestana-activa"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-2xl bg-white shadow-md ring-1 ring-brand-200"
                  />
                )}
                <m.span
                  animate={activa ? { scale: [1, 1.18, 1], rotate: [0, -8, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.45, ease: SUAVE }}
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition-colors ${
                    activa ? 'bg-brand-50' : 'bg-slate-100'
                  }`}
                >
                  {t.icono}
                </m.span>
                <span className="relative">
                  <span className={`block text-base font-extrabold ${activa ? 'text-slate-900' : ''}`}>
                    {t.titulo}
                  </span>
                  <span className={`block text-xs font-semibold ${activa ? 'text-brand-700' : ''}`}>
                    {t.sub}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={modo}
          role="tabpanel"
          id={`panel-${modo}`}
          aria-labelledby={`tab-${modo}`}
          // Al cambiar de pestaña el panel sale hacia el lado contrario y el
          // nuevo entra desde el lado de su pestaña.
          initial={{ opacity: 0, x: esAgenda ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: esAgenda ? -40 : 40 }}
          transition={{ duration: 0.35, ease: SUAVE }}
          className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
        >
          {/* Columna oscura: lo común del modo y el cupo del Emprendedor. En el
              celular va después de los rubros, que es lo que se vino a ver. */}
          <aside className="relative order-last flex flex-col overflow-hidden lg:order-none rounded-3xl bg-slate-950 p-7 text-white sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl"
            />
            <p className="relative text-xs font-extrabold uppercase tracking-widest text-brand-300">
              {esAgenda ? 'Para negocios con citas' : 'Para negocios que venden'}
            </p>
            <h3 className="relative mt-2 text-2xl font-extrabold leading-tight">
              {esAgenda ? 'Tu agenda y tu caja, en un solo lugar' : 'Vendé rápido y sabé cuánto ganás'}
            </h3>

            <ul className="relative mt-6 space-y-3 text-sm text-slate-200">
              {INCLUYE[modo].map((p) => (
                <li key={p} className="flex gap-2.5">
                  <CheckIcon className="text-brand-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            {/* Cupo del Emprendedor: lo mismo que la pieza de campaña */}
            <div className="relative mt-8 mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Plan Emprendedor · Bs 75/mes
              </p>
              <div className={`mt-3 grid gap-3 ${esAgenda ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div>
                  <p className="text-4xl font-extrabold tracking-tight text-white"><Numero valor={cupo.ventasDia} /></p>
                  <p className="text-sm font-semibold text-brand-300">ventas por día</p>
                </div>
                {esAgenda && (
                  <div className="border-l border-white/10 pl-3">
                    <p className="text-4xl font-extrabold tracking-tight text-white"><Numero valor={cupo.citasDia} /></p>
                    <p className="text-sm font-semibold text-brand-300">citas por día</p>
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {esAgenda
                  ? 'Se usan por separado: vender no te gasta citas. '
                  : ''}
                ¿Te faltó? Seguís con créditos
                {desde !== null && <> desde Bs&nbsp;{fmtBs(desde)}</>}.{' '}
                <a href="#creditos" className="font-bold text-brand-300 underline underline-offset-2 hover:text-brand-200">
                  Cómo funcionan
                </a>
              </p>
            </div>

            <a
              href="#planes"
              className="relative mt-6 inline-flex w-full items-center lg:mt-auto justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
            >
              Ver planes
            </a>
          </aside>

          {/* Rubros del modo + "¿no está el tuyo?" */}
          <Escalonado paso={0.07} retraso={0.1} className="grid gap-5 sm:grid-cols-2">
            {RUBROS[modo].map((r) => (
              <m.article
                key={r.nombre}
                variants={itemVariantes}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl ring-1 ring-brand-100 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110">
                    {r.emoji}
                  </span>
                  <h3 className="text-lg font-extrabold leading-tight text-slate-900">{r.nombre}</h3>
                </div>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-700">
                  {r.puntos.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href={linkWhatsApp(`Hola BamarDev, ${r.quienEscribe} y quiero ver cómo funciona el sistema.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition hover:text-brand-600"
                >
                  Quiero verlo{' '}
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
                </a>
              </m.article>
            ))}

            {/* El gancho para los rubros que todavía no están */}
            <m.article
              variants={itemVariantes}
              className="relative overflow-hidden rounded-3xl border-2 border-dashed border-brand-300 bg-gradient-to-br from-brand-50 via-white to-amber-50 p-6 sm:col-span-2 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-brand-700">
                    ¿No ves tu rubro?
                  </p>
                  <h3 className="mt-1.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Pedilo y lo adaptamos a tu negocio{' '}
                    <m.span
                      aria-hidden
                      className="inline-block"
                      animate={{ rotate: [0, 18, -10, 0], scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                    >
                      ✨
                    </m.span>
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-slate-600">
                    Contanos cómo trabajás y armamos tu versión con lo que tu
                    rubro necesita, como hicimos con farmacias y belleza.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {OTROS.map((o) => (
                      <span
                        key={o}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600"
                      >
                        {o}
                      </span>
                    ))}
                    <span className="rounded-full px-1 py-0.5 text-xs font-semibold text-slate-400">y más…</span>
                  </div>
                </div>
                <a
                  href={linkWhatsApp('Hola BamarDev, mi rubro no está en la página y quiero que lo adapten para mi negocio. Mi negocio es: ')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 active:scale-[0.97]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Solicitar mi rubro
                </a>
              </div>
            </m.article>
          </Escalonado>
        </m.div>
        </AnimatePresence>

        {esAgenda && (
          <p className="mt-6 text-center text-xs text-slate-500">
            * La agenda, la ficha de clientes y el cobro de la cita vienen en todos los
            planes. Reservas online, comisiones, propinas, paquetes y gift cards se
            activan para tu negocio:{' '}
            <a
              href={linkWhatsApp('Hola BamarDev, tengo un negocio con agenda y quiero saber qué incluye cada plan.')}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand-700 underline underline-offset-2"
            >
              consultanos
            </a>
            .
          </p>
        )}
      </div>
    </section>
  )
}
