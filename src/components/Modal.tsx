import { useCallback, useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, m } from 'motion/react'
import { SUAVE } from './animacion'

const FOCO = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface VentanaProps {
  titulo: string
  subtitulo?: string
  /** Ancho máximo de la ventana (clase de Tailwind). */
  ancho: string
  alCerrar: () => void
  children: ReactNode
}

/** La ventana emergente. Va en el <body> (un ancestro con transform rompería el `fixed`). */
function Ventana({ titulo, subtitulo, ancho, alCerrar, children }: VentanaProps) {
  const caja = useRef<HTMLDivElement>(null)
  const cerrar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // El fondo no se desplaza mientras está abierta, y el foco entra a la ventana.
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrar.current?.focus()

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return alCerrar()
      if (e.key !== 'Tab' || !caja.current) return
      // El foco da la vuelta dentro de la ventana en vez de irse a la página de atrás.
      const f = Array.from(caja.current.querySelectorAll<HTMLElement>(FOCO))
      if (f.length === 0) return
      const primero = f[0]
      const ultimo = f[f.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.body.style.overflow = antes
      document.removeEventListener('keydown', alTeclear)
    }
  }, [alCerrar])

  return createPortal(
    <m.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={alCerrar}
    >
      <m.div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className={`flex max-h-[88vh] w-full ${ancho} flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl`}
        initial={{ opacity: 0, y: 48, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: SUAVE } }}
        exit={{ opacity: 0, y: 24, transition: { duration: 0.15 } }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 id="modal-titulo" className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {titulo}
            </h2>
            {subtitulo && <p className="mt-0.5 text-sm text-slate-500">{subtitulo}</p>}
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </m.div>
    </m.div>,
    document.body,
  )
}

interface DisparadorProps {
  titulo: string
  subtitulo?: string
  ancho?: string
  /** Lo que se muestra dentro de la ventana (o una función que recibe `cerrar`). */
  children: ReactNode | ((cerrar: () => void) => ReactNode)
  /** Pinta el botón que la abre: recibe lo que hay que ponerle. */
  disparador: (p: { ref: Ref<HTMLButtonElement>; onClick: () => void; 'aria-haspopup': 'dialog' }) => ReactNode
}

/**
 * Un botón (el que pinta `disparador`) que abre una ventana emergente accesible:
 * Esc y clic afuera cierran, el foco entra y vuelve al botón, el fondo no se mueve.
 */
export function ConVentana({ titulo, subtitulo, ancho = 'max-w-3xl', children, disparador }: DisparadorProps) {
  const [abierta, setAbierta] = useState(false)
  const boton = useRef<HTMLButtonElement>(null)

  const cerrar = useCallback(() => {
    setAbierta(false)
    boton.current?.focus() // el foco vuelve al botón que la abrió
  }, [])

  return (
    <>
      {disparador({ ref: boton, onClick: () => setAbierta(true), 'aria-haspopup': 'dialog' })}
      <AnimatePresence>
        {abierta && (
          <Ventana titulo={titulo} subtitulo={subtitulo} ancho={ancho} alCerrar={cerrar}>
            {typeof children === 'function' ? children(cerrar) : children}
          </Ventana>
        )}
      </AnimatePresence>
    </>
  )
}
