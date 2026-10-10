import { linkWhatsApp } from '../data/planes'

interface Rubro {
  emoji: string
  nombre: string
  disponible: boolean
  descripcion: string
  puntos: string[]
  /** Cómo se presenta el interesado en el WhatsApp de "Avisame" (sólo si no está disponible). */
  quienEscribe?: string
}

const RUBROS: Rubro[] = [
  {
    emoji: '🍽️',
    nombre: 'Restaurantes',
    disponible: true,
    descripcion:
      'Del punto de venta al control total de costos: el sistema crece con tu restaurante.',
    puntos: [
      'Comanda Mesa / Llevar y salón con meseros',
      'Insumos, gastos y ganancia estimada por producto',
      'Delivery y recojo con app para el repartidor',
    ],
  },
  {
    emoji: '💊',
    nombre: 'Farmacias',
    disponible: false,
    descripcion:
      'Estamos construyendo la experiencia para farmacias sobre el mismo motor de venta e inventario.',
    puntos: [
      'Control de stock y alertas de reposición',
      'Ventas ágiles en mostrador',
      'Reportes de rotación por producto',
    ],
    quienEscribe: 'tengo una farmacia',
  },
  {
    emoji: '🛠️',
    nombre: 'Ferreterías',
    disponible: false,
    descripcion:
      'Pensado para inventarios grandes y venta al por mayor y al detalle.',
    puntos: [
      'Miles de productos organizados por categoría',
      'Precios diferenciados y ventas mixtas',
      'Control de caja y de stock real',
    ],
    quienEscribe: 'tengo una ferretería',
  },
  {
    emoji: '✂️',
    nombre: 'Salones, barberías, spa y uñas',
    disponible: false,
    descripcion:
      'Agenda de citas para tu equipo y reservas online: tus clientes eligen servicio, profesional y horario desde un enlace.',
    puntos: [
      'Agenda del día y de la semana por profesional',
      'Reservas online, sin llamadas ni mensajes de ida y vuelta',
      'La cita se cobra en la misma caja del sistema',
    ],
    quienEscribe: 'tengo un salón de belleza, barbería, spa o local de uñas',
  },
]

export function Rubros() {
  return (
    <section id="rubros" className="scroll-mt-16 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-600">
          Rubros
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Un solo sistema, pensado para tu rubro
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Empezamos por restaurantes y estamos llevando la misma experiencia a
          farmacias, ferreterías y salones de belleza.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {RUBROS.map((r) => (
            <article
              key={r.nombre}
              className={`flex flex-col rounded-3xl border p-7 transition ${
                r.disponible
                  ? 'border-brand-200 bg-brand-50/60 shadow-lg shadow-brand-100'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-slate-100">
                  {r.emoji}
                </span>
                {r.disponible ? (
                  <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Disponible
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                    En desarrollo
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                {r.nombre}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {r.descripcion}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {r.puntos.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-2">
                {r.disponible ? (
                  <a
                    href="#planes"
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition hover:text-brand-600"
                  >
                    Ver planes →
                  </a>
                ) : (
                  <a
                    href={linkWhatsApp(
                      `Hola BamarDev, ${r.quienEscribe} y quiero que me avisen cuando el sistema esté listo para mi rubro.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 transition hover:text-brand-600"
                  >
                    Avisame cuando esté →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
