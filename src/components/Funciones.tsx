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
      'Stock al día y combos que descuentan sus ingredientes automáticamente al cobrar.',
  },
  {
    emoji: '🛵',
    titulo: 'Delivery y recojo',
    texto:
      'Gestioná pedidos para llevar y a domicilio, con app propia para el repartidor.',
  },
  {
    emoji: '📊',
    titulo: 'Reportes que deciden',
    texto:
      'Ventas por producto, categoría, horario y método de pago, con ganancia estimada.',
  },
  {
    emoji: '👨‍🍳',
    titulo: 'Cocina en tiempo real',
    texto:
      'Panel de cocina y tablero TV para que los pedidos fluyan sin gritos ni papelitos.',
  },
  {
    emoji: '🔐',
    titulo: 'Control con roles y PIN',
    texto:
      'Descuentos, anulaciones y ajustes solo con autorización del encargado.',
  },
]

export function Funciones() {
  return (
    <section id="funciones" className="scroll-mt-16 bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-600">
          Funciones
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Todo lo que tu operación necesita, sin planillas ni cuadernos
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FUNCIONES.map((f) => (
            <article
              key={f.titulo}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {f.emoji}
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                {f.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.texto}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
