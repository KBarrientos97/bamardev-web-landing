import type { ComponentProps, ReactNode } from 'react'

/** Trazos de los íconos (viewBox 24, sólo línea). */
const TRAZOS = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  x: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
  reloj: 'M12 7.5V12l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  chat: 'M20.5 12a7.5 7.5 0 01-10.9 6.7L4 20l1.4-4.6A7.5 7.5 0 1120.5 12z',
  abajo: 'M6 9.5l6 6 6-6',
  izquierda: 'M14.5 6l-6 6 6 6',
  derecha: 'M9.5 6l6 6-6 6',
  lista: 'M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01',
  nube: 'M7 18.5a4.5 4.5 0 01-.6-8.96A6 6 0 0117.8 8.8 4.2 4.2 0 0117 18.5H7z',
  alerta: 'M12 9v4m0 3.5h.01M10.3 4.2L2.8 17.3A2 2 0 004.5 20.3h15a2 2 0 001.7-3L13.7 4.2a2 2 0 00-3.4 0z',
  imprimir: 'M7 9V4h10v5M7 17H5a1 1 0 01-1-1v-5a2 2 0 012-2h12a2 2 0 012 2v5a1 1 0 01-1 1h-2M7 14h10v6H7v-6z',
  info: 'M12 11v5m0-8.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  mas: 'M12 6v12M6 12h12',
  candado: 'M7 11V8a5 5 0 0110 0v3M6 11h12a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1z',
} as const

export type NombreIcono = keyof typeof TRAZOS

export function Icono({ n, className = 'h-5 w-5' }: { n: NombreIcono; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={TRAZOS[n]} />
    </svg>
  )
}

export function Cargando({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** El logotipo en texto: BAMAR DEV / TECHNOLOGY, como en el material de marca. */
export function Marca({ chica = false }: { chica?: boolean }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span
        className={`font-extrabold tracking-[0.12em] text-slate-900 ${chica ? 'text-base' : 'text-2xl'}`}
      >
        BAMAR <span className="text-brand-600">DEV</span>
      </span>
      <span
        className={`flex items-center gap-1.5 font-semibold tracking-[0.5em] text-slate-500 ${
          chica ? 'mt-0.5 text-[7px]' : 'mt-1 text-[10px]'
        }`}
      >
        <span className={`h-px bg-brand-500 ${chica ? 'w-3' : 'w-6'}`} />
        TECHNOLOGY
        <span className={`h-px bg-brand-500 ${chica ? 'w-3' : 'w-6'}`} />
      </span>
    </div>
  )
}

export const CLASE_CAMPO =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-600'

type Variante = 'primario' | 'secundario' | 'suave'

const VARIANTES: Record<Variante, string> = {
  primario:
    'bg-brand-700 text-white shadow-md shadow-brand-700/20 hover:bg-brand-800 active:bg-brand-900 disabled:bg-slate-300 disabled:shadow-none',
  secundario:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:text-slate-400',
  suave: 'bg-brand-50 text-brand-800 hover:bg-brand-100 disabled:text-slate-400',
}

export function Boton({
  variante = 'primario',
  className = '',
  type = 'button',
  ...props
}: ComponentProps<'button'> & { variante?: Variante }) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-bold transition disabled:cursor-not-allowed ${VARIANTES[variante]} ${className}`}
    />
  )
}

export function Aviso({
  tono = 'info',
  children,
  className = '',
}: {
  tono?: 'info' | 'alerta' | 'error' | 'ok'
  children: ReactNode
  className?: string
}) {
  const estilos = {
    info: 'bg-sky-50 text-sky-900 ring-sky-200',
    alerta: 'bg-amber-50 text-amber-900 ring-amber-200',
    error: 'bg-rose-50 text-rose-800 ring-rose-200',
    ok: 'bg-brand-50 text-brand-900 ring-brand-200',
  }[tono]
  return (
    <div
      role={tono === 'error' ? 'alert' : undefined}
      className={`flex gap-3 rounded-xl px-4 py-3 text-sm ring-1 ${estilos} ${className}`}
    >
      <Icono n={tono === 'ok' ? 'check' : tono === 'info' ? 'info' : 'alerta'} className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

/** Colores de cada decisión: se repiten en el módulo, el resumen y las etiquetas. */
export const ESTILO_DECISION: Record<
  string,
  { icono: NombreIcono; activo: string; chip: string; punto: string }
> = {
  incluir: {
    icono: 'check',
    activo: 'border-brand-600 bg-brand-100 text-brand-900 ring-2 ring-brand-200',
    chip: 'bg-brand-100 text-brand-800',
    punto: 'bg-brand-500',
  },
  no: {
    icono: 'x',
    activo: 'border-slate-600 bg-slate-200 text-slate-900 ring-2 ring-slate-300',
    chip: 'bg-slate-200 text-slate-700',
    punto: 'bg-slate-400',
  },
  futuro: {
    icono: 'reloj',
    activo: 'border-amber-500 bg-amber-100 text-amber-900 ring-2 ring-amber-200',
    chip: 'bg-amber-100 text-amber-800',
    punto: 'bg-amber-500',
  },
  conversar: {
    icono: 'chat',
    activo: 'border-sky-500 bg-sky-100 text-sky-900 ring-2 ring-sky-200',
    chip: 'bg-sky-100 text-sky-800',
    punto: 'bg-sky-500',
  },
}

/** Funcionalidades: mismos colores, otros valores. */
export const ESTILO_FUNCION: Record<string, string> = {
  necesaria: 'border-brand-600 bg-brand-100 text-brand-900',
  no: 'border-slate-600 bg-slate-200 text-slate-900',
  futuro: 'border-amber-500 bg-amber-100 text-amber-900',
  consultar: 'border-sky-500 bg-sky-100 text-sky-900',
}
