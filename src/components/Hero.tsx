import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Fragment, useState, type PointerEvent } from 'react'
import { linkWhatsApp } from '../data/planes'
import { WhatsAppIcon } from './ui'
import { Escalonado, SUAVE, itemVariantes } from './animacion'
import { HeroDemo } from './HeroDemo'
import { useAbrirAlta } from './Alta'

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

export function Hero() {
  const reducir = useReducedMotion()
  // El rubro que muestra la demo del celular: el titular lo acompaña.
  const [rubro, setRubro] = useState('pollería')
  const abrirAlta = useAbrirAlta()

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

          {/* La prueba del Emprendedor es lo principal; "Ver planes" queda
              como enlace abajo, para quien quiere comparar antes. */}
          <m.div variants={itemVariantes} className="mt-8 flex flex-wrap items-center gap-4">
            <m.button
              type="button"
              onClick={abrirAlta}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-brand-500 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-500/30 transition-colors hover:bg-brand-400"
            >
              Probar 7 días gratis
            </m.button>
            <m.a
              href={linkWhatsApp('Hola BamarDev, quiero ver el sistema funcionando en mi negocio.')}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-bold text-white transition-colors hover:border-brand-400/60 hover:text-brand-300"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Pedir una demo
            </m.a>
          </m.div>

          <m.p variants={itemVariantes} className="mt-4 text-sm text-slate-400">
            Plan Emprendedor, sin pagar nada por adelantado.{' '}
            <a href="#planes" className="font-semibold text-brand-300 underline-offset-2 hover:underline">
              Ver todos los planes →
            </a>
          </m.p>

          <m.ul
            variants={itemVariantes}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-400"
          >
            {['Funciona sin internet', 'Android, iPhone y web', 'Desde Bs 75 al mes'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                {t}
              </li>
            ))}
          </m.ul>
        </Escalonado>

        <HeroDemo onRubro={setRubro} />
      </div>
    </section>
  )
}
