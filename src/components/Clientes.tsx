import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useReducedMotion } from 'motion/react'
import { Aparecer } from './animacion'

interface Cliente {
  nombre: string
  rubro: string
  /** Emoji del rubro, para la etiqueta. */
  icono: string
  /** WebP en public/clientes/: 160 px de alto (160×160, o 280×160 si es apaisado). */
  logo: string
  /** Logo apaisado: la tarjeta le da más ancho. */
  ancho?: boolean
}

/*
  Negocios que ya trabajan con BamarDev (nov-2026). Sólo nombre, rubro y logo:
  sin enlaces ni datos del negocio, por decisión del dueño. Para sumar uno: su
  logo en public/clientes/ y una línea acá; la cinta se alarga sola.
*/
const CLIENTES: Cliente[] = [
  { nombre: 'Pollos Don Omar', rubro: 'Restaurante', icono: '🍽️', logo: '/clientes/pollos-don-omar.webp' },
  { nombre: 'La Tacada', rubro: 'Billar y Bar', icono: '🎱', logo: '/clientes/la-tacada.webp' },
  { nombre: 'El Ganadero JF', rubro: 'Postres', icono: '🍨', logo: '/clientes/el-ganadero-jf.webp' },
  { nombre: 'Pollos Tío Fabio', rubro: 'Restaurante', icono: '🍽️', logo: '/clientes/pollos-tio-fabio.webp' },
  { nombre: 'Tattoos Drick Academy', rubro: 'Academia de tatuajes', icono: '🖋️', logo: '/clientes/tattoos-drick-academy.webp', ancho: true },
]

/*
  La cinta avanza UNA tarjeta cada CADA_MS y vuelve a empezar sin que se note: la
  lista se repite varias veces y, al completar una vuelta (N pasos), salta sin
  animación al inicio, que se ve idéntico. Cinco repeticiones alcanzan para
  cubrir hasta una pantalla ultra ancha más una vuelta completa.
*/
const REPETICIONES = 5
const FILA = Array.from({ length: REPETICIONES }, () => CLIENTES).flat()
const CADA_MS = 5000
const DESLIZ_MS = 900

function Tarjeta({ c, oculta, movil = false }: { c: Cliente; oculta: boolean; movil?: boolean }) {
  return (
    <li aria-hidden={oculta || undefined} className={`${movil ? 'w-[calc(100vw-2rem)] snap-center ' : ''}group/cliente relative flex shrink-0 items-center gap-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white py-3.5 pl-3.5 pr-7 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_8px_24px_-12px_rgb(15_23_42/0.18)] transition duration-300 ease-out hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_36px_-14px_rgb(16_185_129/0.45)]`}>
      {/* Resplandor de marca en la esquina: se enciende al pasar el mouse */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-200/50 blur-2xl transition-opacity duration-300 group-hover/cliente:bg-brand-300/70"
      />

      <div className="relative shrink-0">
        {/* El nombre va al lado: el logo es decorativo para el lector de pantalla. */}
        <img
          src={c.logo}
          alt=""
          width={c.ancho ? 128 : 76}
          height={76}
          loading="lazy"
          decoding="async"
          className={`h-[4.75rem] rounded-2xl object-cover shadow-md ring-2 ring-white outline outline-1 outline-slate-200 transition duration-300 group-hover/cliente:-rotate-2 group-hover/cliente:scale-105 ${
            c.ancho ? 'w-24 sm:w-32' : 'w-[4.75rem]'
          }`}
        />
        {/* Insignia de cliente activo */}
        <span
          aria-hidden
          className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white shadow ring-2 ring-white"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 10.5l3.5 3.5 7.5-8" />
          </svg>
        </span>
      </div>

      <div className="relative min-w-0">
        <p className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:whitespace-nowrap">{c.nombre}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-50 py-1 pl-2 pr-3 text-xs font-bold text-brand-700 ring-1 ring-brand-200/70">
          <span aria-hidden className="text-sm leading-none">{c.icono}</span>
          {c.rubro}
        </p>
      </div>
    </li>
  )
}

/** Escritorio: fila que se desliza una tarjeta cada 5 s. Se frena con el mouse o el foco encima. */
function CintaEscritorio() {
  const reducir = useReducedMotion()
  const pista = useRef<HTMLUListElement>(null)
  const [paso, setPaso] = useState(0)
  const [animar, setAnimar] = useState(true)
  const [pausa, setPausa] = useState(false)
  const n = CLIENTES.length

  // Avanza un paso cada CADA_MS. Al pausar o reanudar, la cuenta vuelve a empezar.
  useEffect(() => {
    if (reducir || pausa) return
    const t = setTimeout(() => {
      setAnimar(true)
      setPaso((p) => p + 1)
    }, CADA_MS)
    return () => clearTimeout(t)
  }, [paso, reducir, pausa])

  // Al completar una vuelta, vuelve al inicio sin animar (se ve idéntico).
  useEffect(() => {
    if (paso < n) return
    const t = setTimeout(() => {
      setAnimar(false)
      setPaso(0)
    }, DESLIZ_MS + 60)
    return () => clearTimeout(t)
  }, [paso, n])

  // Mueve la fila hasta la tarjeta `paso`. Se mide en el DOM porque el logo apaisado es más ancho.
  useLayoutEffect(() => {
    const ul = pista.current
    if (!ul || reducir) return
    const lis = ul.children
    const x = (lis[paso] as HTMLElement).offsetLeft - (lis[0] as HTMLElement).offsetLeft
    ul.style.transition = animar ? `transform ${DESLIZ_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none'
    ul.style.transform = `translateX(${-x}px)`
  }, [paso, animar, reducir])

  return (
    // Con "reducir movimiento" no se desliza solo: queda quieta y se mueve a mano.
    <div
      className="relative mt-10 overflow-hidden py-3 motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      <ul ref={pista} aria-label="Negocios que usan BamarDev" className="flex w-max gap-4 px-6 will-change-transform">
        {FILA.map((c, i) => (
          <Tarjeta key={`${c.nombre}-${i}`} c={c} oculta={i >= n} />
        ))}
      </ul>
    </div>
  )
}

const MEDIA_MOVIL = '(max-width: 639px)'

function useMovil(): boolean {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(MEDIA_MOVIL)
      mq.addEventListener('change', avisar)
      return () => mq.removeEventListener('change', avisar)
    },
    () => window.matchMedia(MEDIA_MOVIL).matches,
    () => false,
  )
}

/** Si la persona tocó o deslizó hace menos de esto, el avance automático espera. */
const ESPERA_TRAS_TOQUE_MS = 8000

/**
 * Celular: una tarjeta a la vez. Pasa sola cada 5 s y también se puede deslizar a
 * mano (el scroll nativo con "imán" deja cada tarjeta centrada). Es infinita igual
 * que la de escritorio: arranca en la segunda repetición y, al detenerse, vuelve
 * en silencio a la zona del medio, donde se ve idéntico.
 */
function CintaMovil() {
  const reducir = useReducedMotion()
  const pista = useRef<HTMLUListElement>(null)
  const ultimoToque = useRef(0)
  const n = CLIENTES.length

  useEffect(() => {
    const ul = pista.current
    if (!ul) return
    const li = (i: number) => ul.children[i] as HTMLElement
    const paso = () => li(1).offsetLeft - li(0).offsetLeft
    // Posición de scroll que deja la tarjeta i centrada.
    const pos = (i: number) => li(i).offsetLeft - (ul.clientWidth - li(i).offsetWidth) / 2

    ul.style.scrollBehavior = 'auto'
    ul.scrollLeft = pos(n)

    let t = 0
    const alDesplazar = () => {
      clearTimeout(t)
      t = window.setTimeout(() => {
        const i = Math.round((ul.scrollLeft - pos(0)) / paso())
        if (i < n) ul.scrollLeft += n * paso()
        else if (i >= 3 * n) ul.scrollLeft -= n * paso()
      }, 140)
    }
    ul.addEventListener('scroll', alDesplazar, { passive: true })

    const id = window.setInterval(() => {
      if (reducir || document.hidden || Date.now() - ultimoToque.current < ESPERA_TRAS_TOQUE_MS) return
      ul.scrollTo({ left: ul.scrollLeft + paso(), behavior: 'smooth' })
    }, CADA_MS)

    return () => {
      clearTimeout(t)
      clearInterval(id)
      ul.removeEventListener('scroll', alDesplazar)
    }
  }, [n, reducir])

  const tocada = () => {
    ultimoToque.current = Date.now()
  }

  return (
    <div className="relative mt-10">
      {/* tabIndex: para que también se pueda recorrer con el teclado. */}
      <ul
        ref={pista}
        tabIndex={0}
        aria-label="Negocios que usan BamarDev"
        onPointerDown={tocada}
        onTouchStart={tocada}
        onWheel={tocada}
        onKeyDown={tocada}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FILA.map((c, i) => (
          <Tarjeta key={`${c.nombre}-${i}`} c={c} oculta={i >= n} movil />
        ))}
      </ul>
    </div>
  )
}

/** En celular, una tarjeta a la vez con scroll; en pantallas grandes, la cinta que avanza sola. */
function Cinta() {
  return useMovil() ? <CintaMovil /> : <CintaEscritorio />
}

export function Clientes() {
  return (
    <section id="clientes" aria-labelledby="clientes-titulo" className="relative scroll-mt-16 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 sm:py-16">
      {/* Textura de puntos y un resplandor de marca detrás del título */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(15_23_42/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl"
      />

      <Aparecer className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-700 ring-1 ring-brand-200">
          <span aria-hidden className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          Ya confían en BamarDev
        </p>
        <h2 id="clientes-titulo" className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Negocios que ya trabajan con nosotros
        </h2>
      </Aparecer>

      <Cinta />
    </section>
  )
}
