import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useInView } from 'motion/react'

/*
  Piezas comunes de las ilustraciones animadas de los rubros (Escenas*.tsx).
  Todo se mueve con CSS (sólo transform y opacity: barato para el celular). Los
  keyframes compartidos `esc-*` viven en index.css; cada archivo de escenas
  puede traer sus propios keyframes en un .css al lado. Cada escena es
  decorativa (el nombre y los puntos de la tarjeta ya dicen lo mismo): va con
  aria-hidden.
*/

/**
 * Marco común: pausa las animaciones cuando la escena no se ve en pantalla (ahorra
 * batería) y, con "reducir movimiento", index.css las apaga y queda la imagen quieta.
 * `fondo` son clases de Tailwind del degradado de fondo.
 */
export function Marco({ fondo, children }: { fondo: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const visto = useInView(ref, { margin: '0px 0px -10% 0px' })
  return (
    <div
      ref={ref}
      aria-hidden
      data-vista={visto ? '' : undefined}
      className={`escena relative h-48 overflow-hidden ${fondo}`}
    >
      {/* luz ambiente desde arriba a la izquierda + dos orbes de color que derivan despacio */}
      <div aria-hidden className="esc-luz pointer-events-none absolute inset-0" />
      <div aria-hidden className="esc-deriva pointer-events-none absolute -left-10 top-6 h-32 w-32 rounded-full bg-white/50 blur-2xl" />
      <div aria-hidden className="esc-deriva-b pointer-events-none absolute -right-8 bottom-2 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
      {children}
    </div>
  )
}

/** Clases del <svg> de cada escena (llena el marco y crece un poco al pasar el mouse por la tarjeta). */
export const svgBase =
  'absolute inset-0 h-full w-full origin-bottom transition-transform duration-500 ease-out group-hover:scale-105'

/** Variables CSS que usan los keyframes (distancia, giro, retraso…). */
export const v = (o: Record<string, string>): CSSProperties => o as CSSProperties

const TONOS = {
  verde: 'from-emerald-400 to-emerald-600',
  azul: 'from-sky-400 to-blue-600',
  rosa: 'from-pink-400 to-rose-600',
  ambar: 'from-amber-400 to-orange-500',
  violeta: 'from-violet-400 to-purple-600',
} as const

/**
 * Notificación del sistema (la venta, la cita, el turno…): entra, se queda un momento y se va.
 * Dos líneas, como las de un sistema de verdad: una etiqueta chica arriba (`etiqueta`) y el
 * dato en negrita (`texto`). `lado` decide en qué esquina de arriba nace; `tono` colorea el
 * ícono para que combine con la escena.
 */
export function Aviso({
  texto,
  etiqueta,
  lado = 'der',
  icono,
  tono = 'verde',
}: {
  texto: string
  etiqueta?: string
  lado?: 'der' | 'izq'
  /** Por defecto, un tilde. */
  icono?: ReactNode
  tono?: keyof typeof TONOS
}) {
  return (
    <div
      className={`esc-chip pointer-events-none absolute top-3 flex items-center gap-2 rounded-xl bg-white/95 py-1.5 pl-1.5 pr-3 shadow-[0_10px_28px_-10px_rgba(15,23,42,.45)] ring-1 ring-slate-900/5 backdrop-blur ${
        lado === 'der' ? 'right-3 [transform-origin:100%_0%]' : 'left-3 [transform-origin:0%_0%]'
      }`}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${TONOS[tono]} text-white shadow-sm`}>
        {icono ?? (
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 10.5l3.5 3.5 7.5-8" />
          </svg>
        )}
      </span>
      <span className="leading-tight">
        {etiqueta && <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{etiqueta}</span>}
        <span className="block text-xs font-extrabold text-slate-800">{texto}</span>
      </span>
    </div>
  )
}
