import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { Fragment, type PointerEvent } from 'react'
import { linkWhatsApp } from '../data/planes'
import { WhatsAppIcon } from './ui'
import { Escalonado, Numero, SUAVE, itemVariantes } from './animacion'

/** Alturas (en %) de las barras del mini-gráfico ilustrativo del mockup. */
const BARRAS = [35, 55, 42, 68, 50, 80, 95]

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

/**
 * Mockup del panel que se inclina siguiendo el mouse (sólo con mouse: en el
 * celular no hay hover y queda quieto).
 */
function Mockup() {
  const reducir = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 18 })
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 })

  function mover(e: PointerEvent<HTMLDivElement>) {
    if (reducir || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  function soltar() {
    px.set(0)
    py.set(0)
  }

  return (
    <div
      className="relative mx-auto w-full max-w-sm [perspective:1200px] lg:max-w-md"
      onPointerMove={mover}
      onPointerLeave={soltar}
    >
      <m.div
        initial={{ opacity: 0, y: 60, rotateX: 18, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.35 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <m.div
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <div className="rounded-3xl border border-white/10 bg-white p-6 text-slate-800 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">Ventas de hoy</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                En vivo
              </span>
            </div>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
              Bs <Numero valor={4850} duracion={1.6} />
            </p>
            <m.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: SUAVE, delay: 1.4 }}
              className="mt-1 text-sm font-semibold text-brand-600"
            >
              ▲ 18% vs. ayer
            </m.p>

            <div className="mt-6 flex h-24 items-end gap-2">
              {BARRAS.map((h, i) => (
                <m.div
                  key={i}
                  style={{ height: `${h}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.8, ease: SUAVE, delay: 0.7 + i * 0.07 }}
                  className={`flex-1 origin-bottom rounded-t-md ${
                    i === BARRAS.length - 1 ? 'bg-brand-500' : 'bg-brand-100'
                  }`}
                />
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-slate-100 pt-4 text-sm">
              <span className="font-semibold text-slate-500">
                Efectivo <span className="text-slate-900">Bs <Numero valor={2980} duracion={1.6} /></span>
              </span>
              <span className="font-semibold text-slate-500">
                QR <span className="text-slate-900">Bs <Numero valor={1870} duracion={1.6} /></span>
              </span>
            </div>
          </div>

          {/* Tarjetas flotantes: entran tarde, desde su costado, y después
              flotan despacio para que el mockup se sienta "vivo". Van más
              adelante en Z, así se separan del panel al inclinarlo. */}
          <m.div
            initial={{ opacity: 0, x: 30, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: SUAVE, delay: 1.1 }}
            style={{ translateZ: 60 }}
            className="absolute -right-6 -top-12 hidden sm:block"
          >
            <m.div
              animate={reducir ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="rotate-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 shadow-xl"
            >
              <p className="text-xs font-bold text-slate-400">Pedido #42</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-white">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Mesa 5 · 1 para llevar
              </p>
            </m.div>
          </m.div>
          <m.div
            initial={{ opacity: 0, x: -30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, ease: SUAVE, delay: 1.3 }}
            style={{ translateZ: 80 }}
            className="absolute -bottom-12 -left-6 hidden sm:block"
          >
            <m.div
              animate={reducir ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="-rotate-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 shadow-xl"
            >
              <p className="text-xs font-bold text-slate-400">Alerta de stock</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-white">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                Queso mozzarella · 2 kg
              </p>
            </m.div>
          </m.div>
        </m.div>
      </m.div>
    </div>
  )
}

export function Hero() {
  const reducir = useReducedMotion()
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-16 text-white">
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
      {/* Grilla tenue que se desvanece hacia abajo: da profundidad al fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-24">
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
            <Palabras texto="El sistema que maneja tu negocio" />
            <Palabras
              texto="y te dice cuánto ganás."
              className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent"
            />
          </m.h1>

          <m.p variants={itemVariantes} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Punto de venta, inventario, agenda y control de costos en un solo
            lugar. Se maneja desde el celular o la tablet, y sigue vendiendo
            aunque se corte el internet.
          </m.p>

          <m.div variants={itemVariantes} className="mt-8 flex flex-wrap items-center gap-4">
            <m.a
              href="#planes"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-brand-500 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-500/30 transition-colors hover:bg-brand-400"
            >
              Ver planes
            </m.a>
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

          <m.ul
            variants={itemVariantes}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-400"
          >
            {['Funciona sin internet', 'App Android y web', 'Respaldo en la nube'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                {t}
              </li>
            ))}
          </m.ul>
        </Escalonado>

        <Mockup />
      </div>
    </section>
  )
}
