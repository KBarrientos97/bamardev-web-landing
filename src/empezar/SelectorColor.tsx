import { useEffect, useId, useRef, useState } from 'react'
import type { PaletaAlta } from '../lib/alta'

/**
 * El color del negocio (B1): un botón compacto "Color: ● Negro ▾" que
 * despliega las muestras. Casi nadie lo cambia, así que no ocupa lugar hasta
 * que alguien lo abre.
 *
 * Las muestras son radios nativos: el navegador ya da las flechas para
 * moverse entre ellas y el nombre accesible sale del texto de cada una.
 */
export function SelectorColor({
  paletas,
  valor,
  sugerido,
  onElegir,
  deshabilitado,
}: {
  paletas: PaletaAlta[]
  /** La clave que se va a mandar; null mientras no hay rubro ni elección. */
  valor: string | null
  /** El recomendado del rubro elegido: se marca entre las muestras. */
  sugerido: string | null
  onElegir: (clave: string) => void
  deshabilitado?: boolean
}) {
  const id = useId()
  const [abierto, setAbierto] = useState(false)
  const caja = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)
  // Con el dedo o el mouse, elegir cierra el menú; con las flechas no, porque
  // cada flecha ya elige la siguiente y cerrar cortaría el recorrido.
  const conPuntero = useRef(false)
  const actual = paletas.find((p) => p.clave === valor) ?? null

  // Un toque fuera lo cierra, como cualquier menú. Es una suscripción al
  // documento mientras está abierto, no estado que se copie.
  useEffect(() => {
    if (!abierto) return
    const afuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('pointerdown', afuera)
    return () => document.removeEventListener('pointerdown', afuera)
  }, [abierto])

  const cerrar = () => {
    setAbierto(false)
    boton.current?.focus()
  }

  return (
    <div ref={caja} className="relative">
      <button
        ref={boton}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        disabled={deshabilitado}
        aria-expanded={abierto}
        aria-controls={`${id}-muestras`}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white py-2 pl-3 pr-2.5 text-sm font-semibold text-slate-700 transition-[border-color,transform] duration-150 hover:border-slate-400 active:scale-[0.97] disabled:opacity-50"
      >
        <span className="text-slate-500">Color:</span>
        {actual ? (
          <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: actual.color }} aria-hidden />
        ) : (
          // Sin rubro todavía: una rueda con las muestras, "cualquiera de éstas".
          <span
            className="h-4 w-4 rounded-full ring-1 ring-black/10"
            style={{ backgroundImage: `conic-gradient(${paletas.map((p) => p.color).join(', ')}, ${paletas[0]?.color ?? '#cbd5e1'})` }}
            aria-hidden
          />
        )}
        <span className="text-slate-900">{actual ? actual.nombre : 'el de tu rubro'}</span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {abierto && (
        <fieldset
          id={`${id}-muestras`}
          // Enter dentro de un radio mandaría el formulario (= pasar de paso):
          // acá cierra el menú, igual que Escape.
          onPointerDown={() => (conPuntero.current = true)}
          onKeyDown={(e) => {
            conPuntero.current = false
            if (e.key === 'Escape' || e.key === 'Enter') {
              e.preventDefault()
              e.stopPropagation()
              cerrar()
            }
          }}
          className="absolute left-0 top-full z-20 mt-2 w-[min(21rem,calc(100vw-4rem))] origin-top-left rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 transition-[opacity,scale] duration-150 ease-out starting:scale-95 starting:opacity-0 motion-reduce:transition-none"
        >
          <legend className="sr-only">Color de tu sistema</legend>
          <div className="grid grid-cols-4 gap-1">
            {paletas.map((p) => (
              <label
                key={p.clave}
                className="group flex cursor-pointer flex-col items-center gap-1 rounded-xl px-1 py-2 text-center transition-colors hover:bg-slate-50 has-[:focus-visible]:bg-slate-50"
              >
                <input
                  type="radio"
                  name={`${id}-tema`}
                  value={p.clave}
                  checked={p.clave === valor}
                  // Tocar la que ya estaba elegida no dispara change: igual cierra.
                  onClick={() => {
                    if (conPuntero.current && p.clave === valor) cerrar()
                  }}
                  onChange={() => {
                    onElegir(p.clave)
                    if (conPuntero.current) cerrar()
                  }}
                  className="peer sr-only"
                />
                <span
                  className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-black/10 ring-offset-2 transition-[box-shadow] peer-checked:ring-2 peer-checked:ring-slate-900 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500"
                  style={{ backgroundColor: p.color }}
                  aria-hidden
                >
                  {p.clave === valor && (
                    <svg className="h-4 w-4 text-white drop-shadow" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <span className="w-full truncate text-xs font-semibold text-slate-700">{p.nombre}</span>
                {p.clave === sugerido && (
                  <span className="-mt-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">Sugerido</span>
                )}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  )
}
