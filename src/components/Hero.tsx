import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useState, type PointerEvent } from 'react'
import { linkWhatsApp } from '../data/planes'
import { Escalonado, SUAVE, itemVariantes } from './animacion'
import { HeroDemoB } from './HeroDemoB'

/** El titular entra palabra por palabra, cada una subiendo desde abajo de su "ranura". */
const palabra = {
  oculto: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.8, ease: SUAVE } },
}

function Palabras({ texto, className }: { texto: string; className?: string }) {
  return (
    <>
      {texto.split(' ').map((p, i) => (
        <Fragment key={i}>
          {/* pb/-mb: la ranura recorta, y sin ese margen se comerían la "g" y la "q".
              El espacio va afuera de la ranura para que el titular pueda partirse en líneas. */}
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <m.span variants={palabra} className={`inline-block ${className ?? ''}`}>
              {p}
            </m.span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  )
}

/** La grilla del fondo se ilumina donde está el mouse (variables CSS, sin re-render). */
function iluminar(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

const GRILLA =
  'bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:56px_56px]'

const ICONO = 'h-[18px] w-[18px]'

/** Dónde se usa BamarDev, con un ícono simple para reconocerlo de un vistazo. */
const PLATAFORMAS = [
  {
    nombre: 'Android',
    icono: (
      <svg viewBox="0 0 24 24" className={ICONO} fill="currentColor" aria-hidden>
        <path d="M6 18c0 .55.45 1 1 1h1v3.5a1.5 1.5 0 0 0 3 0V19h2v3.5a1.5 1.5 0 0 0 3 0V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8A1.5 1.5 0 0 0 2 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 3.5 8zm17 0A1.5 1.5 0 0 0 19 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 20.5 8zm-4.97-5.84l1.3-1.3a.5.5 0 0 0-.7-.71l-1.48 1.48A5.97 5.97 0 0 0 12 1c-.96 0-1.86.23-2.66.63L7.85.15a.5.5 0 0 0-.7.71l1.31 1.31A5.98 5.98 0 0 0 6 7h12a5.98 5.98 0 0 0-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
      </svg>
    ),
  },
  {
    nombre: 'iPhone',
    icono: (
      <svg viewBox="0 0 24 24" className={ICONO} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <rect x="6.5" y="2" width="11" height="20" rx="3" />
        <path d="M10.5 18.5h3" />
      </svg>
    ),
  },
  {
    nombre: 'Web',
    icono: (
      <svg viewBox="0 0 24 24" className={ICONO} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.4 12 3z" />
      </svg>
    ),
  },
  {
    nombre: 'Windows',
    icono: (
      <svg viewBox="0 0 24 24" className={ICONO} fill="currentColor" aria-hidden>
        <path d="M3 5.6l7.4-1v7H3v-6zm8.4-1.2L21 3v8.6h-9.6v-7.2zM3 12.5h7.4v7L3 18.4v-5.9zm8.4 0H21V21l-9.6-1.3v-7.2z" />
      </svg>
    ),
  },
]

/**
 * Los negocios que ya trabajan con BamarDev, uno por segundo. Antes la palabra seguía a la
 * demo del celular (cambiaba cada ~8 s) y la gente leía «sólo para pollerías»: así se ven
 * todos los rubros en lo que tarda en leerse el titular, tras «para». La última cierra con «a medida».
 */
const NEGOCIOS = [
  'restaurantes',
  'farmacias',
  'ferreterías',
  'minimarkets',
  'billares',
  'peluquerías',
  'barberías',
  'spas',
  'academias',
  'negocios a medida',
]
const CADA_MS = 1100

/** Clases de cada promesa del titular: se enciende la que la demo está mostrando en ese momento. */
function claseChip(fase: number | null, i: number): string {
  const base = 'rounded-md px-1 -mx-1 transition-colors duration-300 '
  if (fase === null) return base + 'text-brand-300'
  return base + (fase === i ? 'bg-brand-500/25 text-white ring-1 ring-brand-300/40' : 'text-brand-300/45')
}

export function Hero() {
  const reducir = useReducedMotion()
  // Qué promesa del titular muestra la demo ahora (0 venta rápida · 1 stock · 2 caja), o ninguna.
  const [fase, setFase] = useState<0 | 1 | 2 | null>(null)
  const [i, setI] = useState(0)
  // Con «reducir movimiento» el titular queda quieto en una frase general.
  useEffect(() => {
    if (reducir) return
    const t = setInterval(() => setI((n) => (n + 1) % NEGOCIOS.length), CADA_MS)
    return () => clearInterval(t)
  }, [reducir])
  const rubro = reducir ? 'cada negocio' : NEGOCIOS[i]

  return (
    <section
      onPointerMove={iluminar}
      className="group/hero relative overflow-hidden bg-slate-950 pt-16 text-white"
    >
      {/* Resplandores de marca que derivan muy lento detrás del contenido */}
      <m.div
        aria-hidden
        animate={reducir ? undefined : { x: [0, 60, -40, 0], y: [0, 30, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
      />
      <m.div
        aria-hidden
        animate={reducir ? undefined : { x: [0, -50, 20, 0], y: [0, -40, 0, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-52 -right-24 h-96 w-96 rounded-full bg-brand-600/15 blur-3xl"
      />
      {/* Grilla tenue que se desvanece hacia abajo… */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${GRILLA} [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]`}
      />
      {/* …y la misma grilla en verde, visible sólo alrededor del mouse */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(52_211_153/0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(52_211_153/0.35)_1px,transparent_1px)] bg-[size:56px_56px] opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100 [mask-image:radial-gradient(220px_circle_at_var(--mx)_var(--my),black,transparent)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-20">
        <Escalonado alMontar paso={0.09} retraso={0.1}>
          <m.span
            variants={itemVariantes}
            className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-300 sm:text-xs sm:tracking-widest"
          >
            Para todo tipo de negocio · Y software a medida
          </m.span>

          <m.h1
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            aria-label="El sistema que maneja todo tu negocio, stock al día, venta rápida y caja sin fugas, para restaurantes, farmacias, ferreterías, minimarkets, billares, peluquerías, barberías, spas y academias."
            className="mt-6 font-extrabold tracking-tight"
          >
            <span aria-hidden>
              {/* Los tres dolores que resolvemos, en una sola frase: inventario, venta rápida y cajeros */}
              <span className="block text-3xl leading-[1.12] sm:text-4xl lg:text-[2.7rem]">
                <Palabras texto="El sistema que maneja todo tu negocio" />
              </span>
              <span className="mt-3 block text-xl font-bold leading-snug text-slate-300 sm:text-2xl">
                <span className={claseChip(fase, 1)}>stock al día</span>, <span className={claseChip(fase, 0)}>venta rápida</span> y{' '}
                <span className={claseChip(fase, 2)}>caja sin fugas</span>
              </span>
              {/* «para» + la palabra que cambia cada segundo, en su propia línea para que nada se reacomode */}
              <span className="mt-4 flex items-start gap-3 text-3xl leading-[1.12] sm:text-4xl lg:text-[2.7rem]">
                <span>para</span>
                <span className="relative block h-[1.22em] flex-1 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <m.span
                      key={rubro}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.32, ease: SUAVE }}
                      className="absolute left-0 top-0 inline-block whitespace-nowrap bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text pb-[0.12em] text-transparent"
                    >
                      {rubro}
                    </m.span>
                  </AnimatePresence>
                </span>
              </span>
            </span>
          </m.h1>

          {/* Un solo botón principal: la prueba del Emprendedor (el alta vive en su
              propia página, /empezar, B2). Los planes están en el menú y el WhatsApp
              flota en toda la página: por eso no hay más enlaces acá. */}
          <m.div variants={itemVariantes} className="mt-8">
            <m.a
              href="/empezar"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block rounded-full bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-500/30 transition-colors hover:bg-brand-400"
            >
              Probar 7 días gratis
            </m.a>
          </m.div>

          {/* El sistema se arma por rubro, pero lo que no exista también se construye */}
          <m.a
            variants={itemVariantes}
            href={linkWhatsApp('Hola BamarDev, necesito un software a medida para mi negocio.')}
            target="_blank"
            rel="noreferrer"
            className="group/medida mt-7 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 pr-4 transition duration-300 hover:border-brand-400/50 hover:bg-white/10"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/25">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
              </svg>
            </span>
            <span className="text-sm leading-snug text-slate-300">
              <strong className="font-bold text-white">¿Tu negocio es distinto?</strong> También hacemos software a medida, pensado para cómo trabajás.
            </span>
            <span aria-hidden className="ml-auto text-brand-300 transition-transform duration-300 group-hover/medida:translate-x-1">→</span>
          </m.a>

          <m.div variants={itemVariantes} className="mt-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Disponible en</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {PLATAFORMAS.map((p) => (
                <li
                  key={p.nombre}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-brand-400/50 hover:bg-white/10"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/25 transition-colors duration-300 group-hover:bg-brand-500/30">
                    {p.icono}
                  </span>
                  {p.nombre}
                </li>
              ))}
            </ul>
          </m.div>
        </Escalonado>

        <HeroDemoB onFase={setFase} />
      </div>
    </section>
  )
}
