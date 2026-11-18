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
      {children}
    </div>
  )
}

/** Clases del <svg> de cada escena (llena el marco y crece un poco al pasar el mouse por la tarjeta). */
export const svgBase =
  'absolute inset-0 h-full w-full origin-bottom transition-transform duration-500 ease-out group-hover:scale-105'

/** Variables CSS que usan los keyframes (distancia, giro, retraso…). */
export const v = (o: Record<string, string>): CSSProperties => o as CSSProperties

/**
 * Globo de aviso que aparece, se queda un momento y se va (la notificación de una
 * venta, una cita, un turno…). `lado` decide en qué esquina de arriba nace.
 */
export function Aviso({
  texto,
  lado = 'der',
  icono,
}: {
  texto: string
  lado?: 'der' | 'izq'
  /** Por defecto, un tilde verde. */
  icono?: ReactNode
}) {
  return (
    <div
      className={`esc-chip pointer-events-none absolute top-3 flex items-center gap-1.5 rounded-full bg-white py-1 pl-1.5 pr-3 text-[11px] font-extrabold text-slate-700 shadow-lg ring-1 ring-black/5 ${
        lado === 'der' ? 'right-3 [transform-origin:100%_0%]' : 'left-3 [transform-origin:0%_0%]'
      }`}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white">
        {icono ?? (
          <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 10.5l3.5 3.5 7.5-8" />
          </svg>
        )}
      </span>
      {texto}
    </div>
  )
}
