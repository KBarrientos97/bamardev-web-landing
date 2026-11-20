import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { linkWhatsApp } from '../data/planes'
import { WhatsAppIcon } from './ui'
import { ESCENAS, type ClaveEscena } from './Escenas'
import { Aparecer, Escalonado, SUAVE, itemVariantes } from './animacion'

type Modo = 'ventas' | 'agenda' | 'clases'

/** Orden de las pestañas: la animación del panel sale hacia el lado contrario al que entra. */
const MODOS: Modo[] = ['ventas', 'agenda', 'clases']

interface Rubro {
  emoji: string
  nombre: string
  puntos: string[]
  /** Cómo se presenta el interesado en el WhatsApp de la demo. */
  quienEscribe: string
  /** Ilustración animada del rubro (Escenas.tsx). Sin ella, la tarjeta usa el emoji. */
  escena?: ClaveEscena
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
      nombre: 'Restaurantes',
      puntos: [
        'Comanda Mesa / Llevar y pedidos para recoger',
        'Insumos y recetas: sabés cuánto te cuesta cada plato',
        'Salón con meseros y delivery con app del repartidor (Profesional)',
      ],
      quienEscribe: 'tengo un restaurante',
      escena: 'pollo',
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
      escena: 'minimarket',
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
      escena: 'ferreteria',
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
      escena: 'farmacia',
    },
    {
      emoji: '🎱',
      nombre: 'Billar y Restobar',
      puntos: [
        'Mesas por tiempo: libre, por horas o por minutos, con pausa y extensión',
        'La cuenta de cada mesa suma los consumos del restobar y se cobra en la misma caja',
        'Tarifas por mesa, supervisión del turno y reporte del billar',
      ],
      quienEscribe: 'tengo un billar o restobar',
      escena: 'billar',
    },
    {
      // Licorería (20-nov-2026): el núcleo viene en todos los planes; delivery,
      // la página y los pedidos de Yango y PedidosYa se le prenden aparte.
      emoji: '🍷',
      nombre: 'Licorerías',
      puntos: [
        'Venta rápida con buscador: cervezas, vinos y destilados por categoría',
        'Stock real de cada botella y cierre de caja con arqueo',
        'Delivery, tu página web y los pedidos de Yango o PedidosYa, cuando los quieras sumar',
      ],
      quienEscribe: 'tengo una licorería',
      escena: 'licoreria',
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
      escena: 'peluqueria',
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
      escena: 'barberia',
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
      escena: 'spa',
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
      escena: 'unas',
    },
  ],
  clases: [
    {
      emoji: '🎓',
      nombre: 'Academias e institutos',
      puntos: [
        'Calendario de cursos y grupos, con inscripciones también online',
        'Cobranza de cuotas con QR por WhatsApp y estado de cuenta de cada estudiante',
        'Asistencia, notas y planilla de pago de tus docentes',
      ],
      quienEscribe: 'tengo una academia o instituto',
      escena: 'academia',
    },
  ],
}

/** `#agenda` y `#ventas` abren la pestaña: los anuncios de belleza enlazan directo. */
function modoDelHash(): Modo | null {
  const h = window.location.hash.replace('#', '')
  return h === 'agenda' || h === 'ventas' ? h : h === 'academia' ? 'clases' : null
}

export function Rubros() {
  const [modo, setModo] = useState<Modo>(() => modoDelHash() ?? 'ventas')

  useEffect(() => {
    const alCambiar = () => {
      const m = modoDelHash()
      if (m) setModo(m)
    }
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  const esAgenda = modo === 'agenda'
  const lugar = MODOS.indexOf(modo)
  // La tarjeta de "¿no ves tu rubro?" rellena los huecos de la grilla (2 columnas en
  // tablet, 3 en pantalla grande) en vez de quedar sola abajo.
  const cuantos = RUBROS[modo].length
  const anchoSm = cuantos % 2 === 0 ? 'sm:col-span-2 sm:flex-row sm:items-center sm:justify-between' : ''
  const anchoLg = cuantos % 3 === 0 ? 'lg:col-span-3' : cuantos % 3 === 1 ? 'lg:col-span-2' : 'lg:col-span-1'
  const direccionLg = cuantos % 3 === 2 ? 'lg:flex-col lg:items-start lg:justify-center' : 'lg:flex-row lg:items-center lg:justify-between'

  return (
    <section id="rubros" className="relative scroll-mt-16 bg-white py-14 sm:py-20 lg:py-28">
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
          className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-1.5 rounded-3xl border border-slate-200 bg-slate-50 p-1.5 sm:gap-2"
        >
          {(
            [
              { m: 'ventas', icono: '🛒', titulo: 'Ventas', sub: 'Vendo productos' },
              { m: 'agenda', icono: '📅', titulo: 'Agenda', sub: 'Trabajo con citas' },
              { m: 'clases', icono: '🎓', titulo: 'Clases', sub: 'Enseño o capacito' },
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
                className={`relative flex flex-col items-center justify-start gap-1.5 rounded-2xl px-1.5 py-3 text-center transition-colors sm:flex-row sm:justify-center sm:gap-3 sm:px-4 sm:text-left ${
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
          initial={{ opacity: 0, x: lugar === 0 ? -24 : 24 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.25, ease: SUAVE } }}
          exit={{ opacity: 0, x: lugar === 0 ? 24 : -24, transition: { duration: 0.12 } }}
          className="mt-10"
        >
          {/* Rubros del modo + "¿no está el tuyo?" */}
          <Escalonado paso={0.04} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RUBROS[modo].map((r) => (
              <m.article
                key={r.nombre}
                variants={itemVariantes}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100"
              >
                {r.escena &&
                  (() => {
                    const Escena = ESCENAS[r.escena]
                    // La ilustración ocupa el borde de arriba de la tarjeta.
                    return (
                      <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-3xl">
                        <Escena />
                      </div>
                    )
                  })()}
                <div className="flex items-center gap-3">
                  {!r.escena && (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl ring-1 ring-brand-100 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110">
                      {r.emoji}
                    </span>
                  )}
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

            {/* Para los rubros que todavía no están: una línea y un solo botón. */}
            <m.article
              variants={itemVariantes}
              className={`flex flex-col items-start justify-center gap-4 rounded-3xl border-2 border-dashed border-brand-300 bg-gradient-to-br from-brand-50 via-white to-amber-50 p-6 ${anchoSm} ${anchoLg} ${direccionLg}`}
            >
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  ¿No ves tu rubro?{' '}
                  <m.span
                    aria-hidden
                    className="inline-block"
                    animate={{ rotate: [0, 18, -10, 0], scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                  >
                    ✨
                  </m.span>
                </h3>
                <p className="mt-1 text-sm text-slate-600">Escribinos y lo adaptamos a tu negocio.</p>
              </div>
              <a
                href={linkWhatsApp('Hola BamarDev, mi rubro no está en la página y quiero que lo adapten para mi negocio. Mi negocio es: ')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:-translate-y-0.5 hover:bg-brand-400 active:scale-[0.97] sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Escribinos por WhatsApp
              </a>
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
