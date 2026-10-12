import { useEffect, useRef, type ReactNode } from 'react'
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'motion/react'

/*
  Piezas de movimiento compartidas por las secciones. Todo entra con una curva
  ease-out "suave al final" y mueve sólo transform/opacity (no relayout). Con
  "reducir movimiento" del sistema, MotionConfig (App.tsx) apaga los
  desplazamientos y deja sólo el fundido.
*/

/** Curva de entrada: arranca rápido y frena suave. */
export const SUAVE = [0.22, 1, 0.36, 1] as const

/**
 * Cuándo arranca: apenas el bloque asoma por abajo (con un margen chico para
 * que se vea el movimiento). Antes esperaba a que se viera un 25 % del bloque y,
 * en el celular, las grillas altas quedaban en blanco un buen rato.
 */
const AL_VER = { once: true, amount: 0, margin: '0px 0px -40px 0px' } as const

/** Bloque que aparece subiendo y con fundido al entrar en pantalla. */
export function Aparecer({
  children,
  className,
  retraso = 0,
  desde = 16,
}: {
  children: ReactNode
  className?: string
  retraso?: number
  /** Píxeles que sube al aparecer. */
  desde?: number
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: desde }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={AL_VER}
      transition={{ duration: 0.5, ease: SUAVE, delay: retraso }}
    >
      {children}
    </m.div>
  )
}

/** Contenedor que hace entrar a sus `Item` uno tras otro. */
const contenedor = (paso: number, retraso: number): Variants => ({
  oculto: {},
  visible: { transition: { staggerChildren: paso, delayChildren: retraso } },
})

export const itemVariantes: Variants = {
  oculto: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: SUAVE } },
}

export function Escalonado({
  children,
  className,
  paso = 0.05,
  retraso = 0,
  alMontar = false,
}: {
  children: ReactNode
  className?: string
  paso?: number
  retraso?: number
  /** true = arranca apenas se monta (hero, pestañas), no al hacer scroll. */
  alMontar?: boolean
}) {
  return (
    <m.div
      className={className}
      variants={contenedor(paso, retraso)}
      initial="oculto"
      {...(alMontar ? { animate: 'visible' } : { whileInView: 'visible', viewport: AL_VER })}
    >
      {children}
    </m.div>
  )
}

/**
 * Número que cuenta hasta su valor la primera vez que se ve y que, si el valor
 * cambia (mensual ↔ anual), rueda al nuevo en vez de saltar.
 */
export function Numero({
  valor,
  formato = (n) => Math.round(n).toLocaleString('es-BO'),
  duracion = 1.1,
}: {
  valor: number
  formato?: (n: number) => string
  duracion?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const visto = useInView(ref, { once: true, amount: 0.6 })
  const reducir = useReducedMotion()
  const mv = useMotionValue(0)
  const texto = useTransform(mv, formato)

  useEffect(() => {
    if (!visto) return
    if (reducir) {
      mv.set(valor)
      return
    }
    const control = animate(mv, valor, { duration: duracion, ease: SUAVE })
    return () => control.stop()
  }, [visto, valor, reducir, duracion, mv])

  return (
    <m.span ref={ref} className="tabular-nums">
      {texto}
    </m.span>
  )
}
