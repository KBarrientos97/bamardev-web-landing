import type { PointerEvent } from 'react'
import { m } from 'motion/react'
import { Aparecer, Escalonado, itemVariantes } from './animacion'

interface Funcion {
  emoji: string
  titulo: string
  texto: string
}

const FUNCIONES: Funcion[] = [
  {
    emoji: '⚡',
    titulo: 'Vendé sin internet',
    texto:
      'El punto de venta sigue cobrando aunque se corte la conexión; todo se sincroniza solo cuando vuelve.',
  },
  {
    emoji: '📦',
    titulo: 'Inventario real',
    texto:
      'Stock al día de productos e insumos, con cada entrada y salida registrada y aviso de stock crítico.',
  },
  {
    emoji: '🛵',
    titulo: 'Delivery y recojo',
    texto:
      'Pedidos para recoger en todos los planes; en Profesional, delivery a domicilio con app propia para el repartidor.',
  },
  {
    emoji: '📊',
    titulo: 'Reportes que deciden',
    texto:
      'Ventas por producto, categoría, horario y método de pago, con ganancia estimada y los gastos del negocio.',
  },
  {
    // Antes acá iba "Cocina en tiempo real" (panel de cocina y tablero TV):
    // la feature `cocina` está inactiva en el catálogo, no existe todavía.
    emoji: '📒',
    titulo: 'Fiado bajo control',
    texto:
      'Ventas a crédito por cliente, con sus abonos y lo que te debe cada uno a la vista.',
  },
  {
    emoji: '🔐',
    titulo: 'Control con roles y PIN',
    texto:
      'Cada usuario con su rol; anular una venta o fiar por encima del límite pide el PIN del encargado.',
  },
]

/** Guarda dónde está el mouse dentro de la tarjeta, para el brillo que lo sigue (sin re-render). */
function seguir(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

export function Funciones() {
  return (
    <section id="funciones" className="scroll-mt-16 bg-slate-50 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Aparecer>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-600">
          Funciones
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Todo lo que tu operación necesita, sin planillas ni cuadernos
        </h2>
        </Aparecer>

        <Escalonado paso={0.06} className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {FUNCIONES.map((f) => (
            <m.article
              key={f.titulo}
              variants={itemVariantes}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onPointerMove={seguir}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 transition-[box-shadow,border-color] duration-300 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/60"
            >
              {/* Brillo verde que sigue al mouse dentro de la tarjeta */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'radial-gradient(320px circle at var(--x) var(--y), rgb(16 185 129 / 0.12), transparent 60%)' }}
              />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:scale-110">
                {f.emoji}
              </span>
              <h3 className="relative mt-4 text-lg font-extrabold text-slate-900">
                {f.titulo}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                {f.texto}
              </p>
            </m.article>
          ))}
        </Escalonado>
      </div>
    </section>
  )
}
