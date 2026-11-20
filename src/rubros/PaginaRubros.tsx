import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from 'motion/react'
import { linkWhatsApp } from '../data/planes'
import { GRUPOS, RUBROS, rubroPorClave, type RubroLanding } from '../data/rubros'
import { ESCENAS } from '../components/Escenas'
import { WhatsAppIcon } from '../components/ui'
import { Escalonado, SUAVE, itemVariantes } from '../components/animacion'
import { WhatsAppFlotante } from '../components/WhatsAppFlotante'
import { EXTRA_ANIMADO, EXTRAS, FUNCIONES } from './funciones'

/*
  /rubros (pedido del dueño, 20-nov-2026): todos los rubros en un lugar, para
  que la home no sea la mitad rubros. Se elige uno y se ve su escena, sus
  puntos y TODO lo que hace, cada función con su animación. El rubro elegido
  queda en el hash (/rubros#panaderia): así un anuncio o un WhatsApp puede
  mandar directo a uno.
*/

const PRIMERO = 'restaurante'

const sinAcentos = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

function claveDelHash(): string {
  const h = decodeURIComponent(window.location.hash.replace('#', ''))
  return rubroPorClave(h) ? h : PRIMERO
}

/** Barra de arriba: el logo vuelve a la home, y la demo por WhatsApp. */
function Barra() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo-marca.png" alt="BamarDev" className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight text-white">
            BamarDev
            <span className="ml-1.5 hidden font-medium text-slate-400 sm:inline">Technology</span>
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a href="/" className="hidden text-sm font-semibold text-slate-300 transition-colors hover:text-white sm:inline">
            ← Volver al inicio
          </a>
          <a
            href={linkWhatsApp('Hola BamarDev, quiero ver una demo del sistema.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-400 active:scale-[0.97]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Pedir demo
          </a>
        </div>
      </nav>
    </header>
  )
}

/** Para los rubros sin escena propia: su emoji grande, flotando sobre un degradé. */
function EscenaEmoji({ emoji }: { emoji: string }) {
  return (
    <div aria-hidden className="escena relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-100 via-white to-amber-50" data-vista="">
      <div className="esc-deriva pointer-events-none absolute -left-10 top-4 h-40 w-40 rounded-full bg-brand-200/60 blur-2xl" />
      <div className="esc-deriva-b pointer-events-none absolute -right-8 bottom-0 h-36 w-36 rounded-full bg-amber-200/60 blur-2xl" />
      <span className="esc-aro absolute h-28 w-28 rounded-full border-2 border-brand-300/70" />
      <span className="esc-flotar relative text-7xl drop-shadow-lg sm:text-8xl">{emoji}</span>
    </div>
  )
}

/** La escena del rubro (o su emoji), más alta que en la tarjeta de la home. */
function EscenaDelRubro({ rubro }: { rubro: RubroLanding }) {
  const Escena = rubro.escena ? ESCENAS[rubro.escena] : null
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 [&_.escena]:h-56 sm:[&_.escena]:h-72">
      {Escena ? <Escena /> : <EscenaEmoji emoji={rubro.emoji} />}
    </div>
  )
}

/** Un rubro del selector: la píldora verde se desliza a la que se elige. */
function Chip({ r, activo, elegir }: { r: RubroLanding; activo: boolean; elegir: (clave: string) => void }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={() => elegir(r.clave)}
      className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
        activo ? 'text-white' : 'bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-800'
      }`}
    >
      {activo && (
        <m.span
          layoutId="rubro-activo"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="absolute inset-0 rounded-full bg-brand-500 shadow-md shadow-brand-500/30"
        />
      )}
      <span className="relative">{r.emoji}</span>
      <span className="relative whitespace-nowrap">{r.nombre}</span>
    </button>
  )
}

/*
  Compacto a pedido del dueño (20-nov): antes iban los cinco grupos abiertos y
  ocupaban la pantalla entera. Ahora son pestañas por grupo y una sola fila con
  los rubros del grupo (en el celular se desliza de costado). Al buscar, la fila
  muestra lo que coincide de todos los grupos.
*/
function Selector({ actual, elegir }: { actual: string; elegir: (clave: string) => void }) {
  const [busqueda, setBusqueda] = useState('')
  const grupoDelActual = rubroPorClave(actual)?.grupo ?? GRUPOS[0].clave
  const [grupo, setGrupo] = useState(grupoDelActual)
  // Si el rubro cambia por el hash (o por la búsqueda), su grupo queda abierto.
  useEffect(() => setGrupo(grupoDelActual), [grupoDelActual])
  const fila = useRef<HTMLDivElement>(null)

  const q = sinAcentos(busqueda.trim())
  const buscando = q.length > 0
  const visibles = buscando
    ? RUBROS.filter((r) => sinAcentos(`${r.nombre} ${r.lema}`).includes(q))
    : RUBROS.filter((r) => r.grupo === grupo)

  // En el celular la fila se desliza: que el rubro elegido quede a la vista
  // (sin mover la página, por eso scrollTo de la fila y no scrollIntoView).
  useEffect(() => {
    const f = fila.current
    const b = f?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!f || !b || f.scrollWidth <= f.clientWidth) return
    f.scrollTo({ left: b.offsetLeft - f.clientWidth / 2 + b.offsetWidth / 2, behavior: 'smooth' })
  }, [actual, grupo, q])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/5 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block lg:w-72 lg:shrink-0">
          <span className="sr-only">Buscar tu rubro</span>
          <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="M13.5 13.5L17 17" />
          </svg>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscá tu rubro…"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100 sm:text-sm"
          />
        </label>
        {/* Pestañas por grupo: en el celular se deslizan de costado. */}
        <div role="tablist" aria-label="Grupo de rubros" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none]">
          {GRUPOS.map((g) => {
            const activa = !buscando && g.clave === grupo
            return (
              <button
                key={g.clave}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => {
                  setBusqueda('')
                  setGrupo(g.clave)
                }}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide transition-colors sm:text-[13px] ${
                  activa ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {g.emoji} {g.nombre}
              </button>
            )
          })}
        </div>
      </div>

      {/* Los rubros del grupo (o de la búsqueda), en una fila que se desliza en el celular. */}
      <div ref={fila} className="relative -mx-3 mt-3 flex gap-2 overflow-x-auto border-t border-slate-100 px-3 pt-3 [scrollbar-width:none] sm:-mx-4 sm:flex-wrap sm:overflow-visible sm:px-4">
        {visibles.map((r) => (
          <Chip key={r.clave} r={r} activo={r.clave === actual} elegir={elegir} />
        ))}
        {!visibles.length && (
          <p className="py-1 text-sm text-slate-600">
            No lo encontramos.{' '}
            <a
              href={linkWhatsApp(`Hola BamarDev, mi rubro es ${busqueda.trim()} y quiero saber si el sistema me sirve.`)}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand-700 underline underline-offset-2"
            >
              Escribinos y lo adaptamos a tu negocio
            </a>
            .
          </p>
        )}
      </div>
    </div>
  )
}

function Detalle({ rubro }: { rubro: RubroLanding }) {
  const grupo = GRUPOS.find((g) => g.clave === rubro.grupo)
  const escenaPropia = rubro.escena ? ESCENAS[rubro.escena] : null
  // La función que cuenta la escena del rubro (la comanda en el restaurante) ya
  // se ve arriba: abajo no se repite la misma animación.
  const funciones = rubro.funciones.map((c) => FUNCIONES[c]).filter((f) => f.Escena !== (escenaPropia as unknown as () => ReactElement))
  const extras = rubro.extras.filter((e) => {
    const animada = EXTRA_ANIMADO[e]
    return !animada || !rubro.funciones.includes(animada)
  })
  const conAsterisco = rubro.puntos.some((p) => p.endsWith('*')) || extras.some((e) => EXTRAS[e].texto.endsWith('*'))

  return (
    <div>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <EscenaDelRubro rubro={rubro} />
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600">
            {grupo?.emoji} {grupo?.nombre}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{rubro.nombre}</h2>
          <p className="mt-3 text-lg font-semibold text-slate-700">{rubro.lema}</p>
          <p className="mt-3 leading-relaxed text-slate-600">{rubro.descripcion}</p>
          <ul className="mt-5 space-y-2.5 text-slate-700">
            {rubro.puntos.map((p) => (
              <li key={p} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={linkWhatsApp(`Hola BamarDev, ${rubro.quienEscribe} y quiero ver cómo funciona el sistema.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:-translate-y-0.5 hover:bg-brand-400 active:scale-[0.97]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Quiero verlo
            </a>
            <a
              href={`/empezar?rubro=${encodeURIComponent(rubro.alta)}`}
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 active:scale-[0.97]"
            >
              Probar gratis
            </a>
          </div>
        </div>
      </div>

      <h3 className="mt-16 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Todo lo que hace por tu negocio
      </h3>
      <Escalonado key={rubro.clave} paso={0.05} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {funciones.map((f) => (
          <m.article
            key={f.titulo}
            variants={itemVariantes}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="group [&_.escena]:h-44 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100"
          >
            <f.Escena />
            <div className="p-6">
              <h4 className="text-lg font-extrabold text-slate-900">{f.titulo}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.texto}</p>
            </div>
          </m.article>
        ))}
      </Escalonado>

      {extras.length > 0 && (
        <div className="mt-10 rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200 sm:p-8">
          <h4 className="text-lg font-extrabold text-slate-900">Y además</h4>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {extras.map((e) => (
              <li key={e} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm ring-1 ring-slate-200">
                  {EXTRAS[e].emoji}
                </span>
                {EXTRAS[e].texto}
              </li>
            ))}
          </ul>
          {conAsterisco && (
            <p className="mt-5 text-xs text-slate-500">
              * La agenda, la ficha de clientes y el cobro de la cita vienen en todos los planes; lo marcado con
              asterisco se activa para tu negocio aparte.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function PaginaRubros() {
  const [actual, setActual] = useState(claveDelHash)
  const detalle = useRef<HTMLElement>(null)
  const rubro = useMemo(() => rubroPorClave(actual) ?? RUBROS[0], [actual])

  useEffect(() => {
    const alCambiar = () => setActual(claveDelHash())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  useEffect(() => {
    document.title = `${rubro.nombre} · Rubros · BamarDev`
  }, [rubro])

  const elegir = (clave: string) => {
    setActual(clave)
    history.replaceState(null, '', `#${clave}`)
    // Que se vea el rubro elegido sin buscarlo (en el celular el selector es largo).
    requestAnimationFrame(() => detalle.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <Barra />
        <main className="bg-white pt-16">
          <section className="bg-gradient-to-b from-slate-950 to-slate-900 pb-20 pt-10 sm:pb-24 sm:pt-14">
            <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-300">Rubros</p>
              <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Elegí tu rubro y mirá todo lo que hace BamarDev por tu negocio
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                {RUBROS.length} rubros con un solo sistema: cada uno ve sólo lo que usa.
              </p>
            </div>
          </section>

          <div className="relative z-40 mx-auto -mt-14 max-w-6xl px-4 sm:px-6 lg:sticky lg:top-16">
            <Selector actual={rubro.clave} elegir={elegir} />
          </div>

          <section ref={detalle} className="mx-auto max-w-6xl scroll-mt-20 px-4 lg:scroll-mt-48 py-12 sm:px-6 sm:py-16">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={rubro.clave}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: SUAVE } }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}
              >
                <Detalle rubro={rubro} />
              </m.div>
            </AnimatePresence>
          </section>

          <section className="border-t border-slate-200 bg-slate-50 py-14">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center sm:px-6">
              <h2 className="text-2xl font-extrabold text-slate-900">¿No ves tu rubro? ✨</h2>
              <p className="text-slate-600">Escribinos y lo adaptamos a tu negocio.</p>
              <a
                href={linkWhatsApp('Hola BamarDev, mi rubro no está en la página y quiero que lo adapten para mi negocio. Mi negocio es: ')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:-translate-y-0.5 hover:bg-brand-400 active:scale-[0.97]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Escribinos por WhatsApp
              </a>
              <a href="/" className="mt-2 text-sm font-bold text-slate-500 hover:text-brand-700">
                ← Volver al inicio
              </a>
            </div>
          </section>
        </main>
        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} BamarDev Technology. Todos los derechos reservados.
        </footer>
        <WhatsAppFlotante />
      </MotionConfig>
    </LazyMotion>
  )
}
