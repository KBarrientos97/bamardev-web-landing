import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Fragment, useState, type PointerEvent } from 'react'
import { linkWhatsApp } from '../data/planes'
import { WhatsAppIcon } from './ui'
import { Escalonado, SUAVE, itemVariantes } from './animacion'
import { HeroDemo } from './HeroDemo'

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

export function Hero() {
  const reducir = useReducedMotion()
  // El rubro que muestra la demo del celular: el titular lo acompaña.
  const [rubro, setRubro] = useState('pollería')

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
            Restaurantes · Comercios · Farmacias · Belleza
          </m.span>

          <m.h1
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            <Palabras texto="El sistema que maneja tu" />
            {/* El rubro cambia con la demo: la palabra vieja sube y sale, la
                nueva entra desde abajo; el ancho se acomoda solo (layout). */}
            <m.span
              layout
              transition={{ layout: { duration: 0.4, ease: SUAVE } }}
              className="relative inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={rubro}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: SUAVE }}
                  className="inline-block whitespace-nowrap bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent"
                >
                  {rubro}
                </m.span>
              </AnimatePresence>
            </m.span>{' '}
            <Palabras texto="y te dice cuánto ganás." />
          </m.h1>

          <m.p variants={itemVariantes} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Vendé, cobrá con QR, agendá y controlá tu caja desde el celular.
            Sigue funcionando aunque se corte el internet.
          </m.p>

          {/* Un solo botón principal: la prueba del Emprendedor (el alta vive en su
              propia página, /empezar, B2). La demo por WhatsApp y los planes quedan
              como enlaces de apoyo, y el WhatsApp además flota en toda la página. */}
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

          <m.div variants={itemVariantes} className="mt-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
              <a
                href={linkWhatsApp('Hola BamarDev, quiero ver el sistema funcionando en mi negocio.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-300 underline-offset-2 hover:underline"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Pedir una demo
              </a>
              <a href="#planes" className="whitespace-nowrap text-brand-300 underline-offset-2 hover:underline">
                Ver los planes →
              </a>
            </div>
          </m.div>

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

        <HeroDemo onRubro={setRubro} />
      </div>
    </section>
  )
}
