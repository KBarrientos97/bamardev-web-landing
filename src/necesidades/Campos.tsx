import { useId } from 'react'
import type { Opcion, Pregunta } from './tipos'
import { CLASE_CAMPO } from './ui'

const MAX_CORTO = 200
const MAX_LARGO = 2000

/**
 * Una pregunta del cuestionario. Según su tipo es una línea, un cuadro de texto
 * o tres botones (Sí / No / No sé). Todas son opcionales.
 */
export function CampoPregunta({
  pregunta,
  valor,
  siNo,
  deshabilitado,
  onCambio,
  marcador,
}: {
  pregunta: Pregunta
  valor: string
  siNo: Opcion[]
  deshabilitado: boolean
  onCambio: (valor: string) => void
  /** Texto gris de ejemplo (solo para campos de texto). */
  marcador?: string
}) {
  const id = useId()
  const max = pregunta.tipo === 'corto' ? MAX_CORTO : MAX_LARGO

  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold leading-snug text-slate-800">
        {pregunta.texto}
      </label>
      {pregunta.ayuda && <p className="mt-0.5 text-[13px] text-slate-500">{pregunta.ayuda}</p>}

      {pregunta.tipo === 'sino' ? (
        <div
          id={id}
          role="group"
          aria-label={pregunta.texto}
          className="mt-2 grid max-w-sm grid-cols-3 gap-2"
        >
          {siNo.map((o) => {
            const marcada = valor === o.valor
            return (
              <button
                key={o.valor}
                type="button"
                disabled={deshabilitado}
                aria-pressed={marcada}
                // Tocar la opción elegida otra vez la quita: se puede arrepentir.
                onClick={() => onCambio(marcada ? '' : o.valor)}
                className={`min-h-11 rounded-xl border-2 px-2 text-[15px] font-semibold transition disabled:cursor-not-allowed ${
                  marcada
                    ? 'border-brand-500 bg-brand-50 text-brand-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 disabled:hover:border-slate-200'
                }`}
              >
                {o.etiqueta}
              </button>
            )
          })}
        </div>
      ) : pregunta.tipo === 'corto' ? (
        <input
          id={id}
          value={valor}
          disabled={deshabilitado}
          maxLength={max}
          onChange={(e) => onCambio(e.target.value)}
          placeholder={marcador}
          className={`${CLASE_CAMPO} mt-1.5`}
        />
      ) : (
        <>
          <textarea
            id={id}
            value={valor}
            disabled={deshabilitado}
            maxLength={max}
            rows={2}
            onChange={(e) => onCambio(e.target.value)}
            placeholder={marcador}
            className={`${CLASE_CAMPO} field-sizing-content mt-1.5 min-h-[4.25rem] resize-y`}
          />
          {valor.length > max * 0.85 && (
            <p className="mt-1 text-right text-xs text-slate-400">
              {valor.length} / {max}
            </p>
          )}
        </>
      )}
    </div>
  )
}

/** Texto libre con título propio (los dos cuadros de cada módulo). */
export function CampoTexto({
  titulo,
  ayuda,
  valor,
  marcador,
  deshabilitado,
  onCambio,
}: {
  titulo: string
  ayuda?: string
  valor: string
  marcador: string
  deshabilitado: boolean
  onCambio: (valor: string) => void
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold text-slate-800">
        {titulo}
      </label>
      {ayuda && <p className="mt-0.5 text-[13px] text-slate-500">{ayuda}</p>}
      <textarea
        id={id}
        value={valor}
        disabled={deshabilitado}
        maxLength={MAX_LARGO}
        rows={2}
        onChange={(e) => onCambio(e.target.value)}
        placeholder={marcador}
        className={`${CLASE_CAMPO} field-sizing-content mt-1.5 min-h-[4.25rem] resize-y`}
      />
      {valor.length > MAX_LARGO * 0.85 && (
        <p className="mt-1 text-right text-xs text-slate-400">
          {valor.length} / {MAX_LARGO}
        </p>
      )}
    </div>
  )
}
