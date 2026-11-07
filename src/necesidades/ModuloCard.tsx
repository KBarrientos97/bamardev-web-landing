import { useState } from 'react'
import { CampoPregunta, CampoTexto } from './Campos'
import { tieneDetalle, type Catalogo, type Modulo, type ModuloResp } from './tipos'
import { Boton, ESTILO_DECISION, ESTILO_FUNCION, Icono } from './ui'

interface Props {
  modulo: Modulo
  catalogo: Catalogo
  valor: ModuloResp | undefined
  editable: boolean
  /** Cambia el módulo: recibe una función que parte de lo último guardado. */
  onCambio: (cambio: (m: ModuloResp) => ModuloResp) => void
}

/**
 * Un módulo del sistema. Lo principal está a la vista y es de un toque: elegir
 * si lo necesitan. El detalle (funcionalidades, preguntas, comentarios) se abre
 * aparte, para quien quiera darlo — nadie tiene que contestarlo todo.
 */
export function ModuloCard({ modulo, catalogo, valor, editable, onCambio }: Props) {
  const v = valor ?? {}
  const [abierto, setAbierto] = useState(false)
  const [confirmarNo, setConfirmarNo] = useState(false)

  const funcionesMarcadas = Object.keys(v.funciones ?? {}).length
  const preguntasContestadas = Object.keys(v.preguntas ?? {}).length
  const sinFunciones = modulo.funciones.filter((f) => !v.funciones?.[f.id])
  const decision = catalogo.decisionesModulo.find((o) => o.valor === v.decision)

  const elegirDecision = (valorNuevo: string) => {
    if (!editable) return
    // Tocar la elegida otra vez la deshace.
    if (v.decision === valorNuevo) {
      setConfirmarNo(false)
      onCambio((m) => ({ ...m, decision: undefined }))
      return
    }
    // Pasar a "No lo necesitamos" con cosas ya marcadas no se hace en silencio.
    if (valorNuevo === 'no' && tieneDetalle(v)) {
      setConfirmarNo(true)
      return
    }
    setConfirmarNo(false)
    onCambio((m) => ({ ...m, decision: valorNuevo }))
    // Si lo necesitan, lo siguiente natural es el detalle.
    if (valorNuevo !== 'no') setAbierto(true)
  }

  const marcarFuncion = (id: string, d: string) =>
    onCambio((m) => {
      const funciones = { ...m.funciones }
      if (funciones[id] === d) delete funciones[id]
      else funciones[id] = d
      return { ...m, funciones }
    })

  const marcarPendientesNecesarias = () =>
    onCambio((m) => {
      const funciones = { ...m.funciones }
      for (const f of modulo.funciones) funciones[f.id] ??= 'necesaria'
      return { ...m, funciones }
    })

  const textoDe = (id: string) => v.preguntas?.[id] ?? ''
  const cambiarPregunta = (id: string, texto: string) =>
    onCambio((m) => ({ ...m, preguntas: { ...m.preguntas, [id]: texto } }))

  const estilo = v.decision ? ESTILO_DECISION[v.decision] : undefined

  return (
    <article
      id={`modulo-${modulo.id}`}
      className={`scroll-mt-28 rounded-2xl bg-white p-4 shadow-sm ring-1 transition sm:p-5 ${
        v.decision ? 'ring-slate-300' : 'ring-slate-200'
      }`}
    >
      <header className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 rounded-lg bg-slate-900 px-2 py-1 text-xs font-extrabold tracking-wide text-white">
          {modulo.id}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[17px] font-extrabold leading-snug text-slate-900">{modulo.titulo}</h3>
          <p className="mt-1 text-[14px] leading-snug text-slate-600">{modulo.objetivo}</p>
        </div>
        {decision && estilo && (
          <span
            className={`hidden shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${estilo.chip}`}
          >
            <Icono n={estilo.icono} className="h-3.5 w-3.5" />
            {decision.corta ?? decision.etiqueta}
          </span>
        )}
      </header>

      {modulo.nota && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-900 ring-1 ring-amber-200">
          {modulo.nota}
        </p>
      )}

      {/* La decisión: lo único que hace falta para dejar el módulo respondido. */}
      <div role="group" aria-label={`¿Necesitan "${modulo.titulo}"?`} className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {catalogo.decisionesModulo.map((o) => {
          const e = ESTILO_DECISION[o.valor]
          const marcada = v.decision === o.valor
          return (
            <button
              key={o.valor}
              type="button"
              disabled={!editable}
              aria-pressed={marcada}
              onClick={() => elegirDecision(o.valor)}
              className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 px-2 py-2 text-center text-[14px] font-bold leading-tight transition disabled:cursor-not-allowed ${
                marcada
                  ? e.activo
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 disabled:hover:border-slate-200'
              }`}
            >
              <Icono n={e.icono} className="h-4 w-4 shrink-0" />
              <span>{o.corta ?? o.etiqueta}</span>
            </button>
          )
        })}
      </div>

      {confirmarNo && (
        <div role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
          <p>
            Ya contestó algo en este módulo. Lo que marcó se conserva, pero el módulo quedará como{' '}
            <strong>«No lo necesitamos»</strong>. ¿Desea continuar?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Boton
              className="min-h-10 px-4 py-2 text-sm"
              onClick={() => {
                setConfirmarNo(false)
                onCambio((m) => ({ ...m, decision: 'no' }))
              }}
            >
              Sí, continuar
            </Boton>
            <Boton variante="secundario" className="min-h-10 px-4 py-2 text-sm" onClick={() => setConfirmarNo(false)}>
              Cancelar
            </Boton>
          </div>
        </div>
      )}

      {v.decision && v.decision !== 'no' && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[14px] font-semibold text-slate-700">¿Qué tan importante es?</span>
          <div role="group" aria-label="Prioridad" className="flex gap-2">
            {catalogo.prioridades.map((p) => {
              const marcada = v.prioridad === p.valor
              return (
                <button
                  key={p.valor}
                  type="button"
                  disabled={!editable}
                  aria-pressed={marcada}
                  onClick={() => onCambio((m) => ({ ...m, prioridad: marcada ? undefined : p.valor }))}
                  className={`min-h-10 rounded-full border-2 px-4 text-[14px] font-semibold transition disabled:cursor-not-allowed ${
                    marcada
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 disabled:hover:border-slate-200'
                  }`}
                >
                  {p.etiqueta}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-left text-[14px] font-semibold text-slate-700 transition hover:bg-slate-100 print:hidden"
      >
        <span>
          {abierto ? 'Ocultar el detalle' : 'Ver detalle y dar más información'}
          <span className="block font-normal text-slate-500">
            {modulo.funciones.length} funciones
            {modulo.preguntas.length > 0 && ` · ${modulo.preguntas.length} preguntas`}
            {funcionesMarcadas + preguntasContestadas > 0 &&
              ` · ${funcionesMarcadas + preguntasContestadas} contestadas`}
          </span>
        </span>
        <Icono n="abajo" className={`h-5 w-5 shrink-0 transition ${abierto ? 'rotate-180' : ''}`} />
      </button>

      {abierto && (
        <div className="mt-4 space-y-6">
          {/* Funcionalidades */}
          <section aria-label="Funcionalidades">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-[15px] font-extrabold text-slate-900">¿Qué funciones necesitan?</h4>
              {editable && sinFunciones.length > 0 && (
                <button
                  type="button"
                  onClick={marcarPendientesNecesarias}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-[13px] font-bold text-brand-800 hover:bg-brand-100"
                >
                  Marcar las pendientes como necesarias
                </button>
              )}
            </div>
            <p className="mt-1 text-[13px] text-slate-500">
              Marque lo que le corresponda. Puede dejar sin marcar lo que no conozca todavía.
            </p>
            <ul className="mt-2 divide-y divide-slate-100">
              {modulo.funciones.map((f) => {
                const actual = v.funciones?.[f.id]
                return (
                  <li key={f.id} className="py-3">
                    <p className="text-[14.5px] leading-snug text-slate-800">{f.texto}</p>
                    {f.ayuda && <p className="mt-0.5 text-[12.5px] text-slate-500">{f.ayuda}</p>}
                    <div
                      role="group"
                      aria-label={f.texto}
                      className="mt-2 grid grid-cols-4 gap-1.5 sm:max-w-md"
                    >
                      {catalogo.decisionesFuncion.map((d) => {
                        const marcada = actual === d.valor
                        return (
                          <button
                            key={d.valor}
                            type="button"
                            disabled={!editable}
                            aria-pressed={marcada}
                            title={d.etiqueta}
                            onClick={() => marcarFuncion(f.id, d.valor)}
                            className={`min-h-10 rounded-lg border-2 px-1 text-[12.5px] font-bold transition disabled:cursor-not-allowed ${
                              marcada
                                ? ESTILO_FUNCION[d.valor]
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 disabled:hover:border-slate-200'
                            }`}
                          >
                            {d.corta ?? d.etiqueta}
                          </button>
                        )
                      })}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* Preguntas del módulo */}
          {modulo.preguntas.length > 0 && (
            <section aria-label="Preguntas" className="space-y-4">
              <h4 className="text-[15px] font-extrabold text-slate-900">Preguntas para usted</h4>
              {modulo.preguntas.map((p) => (
                <CampoPregunta
                  key={p.id}
                  pregunta={p}
                  valor={textoDe(p.id)}
                  siNo={catalogo.opcionesSiNo}
                  deshabilitado={!editable}
                  onCambio={(t) => cambiarPregunta(p.id, t)}
                  marcador="Escriba su respuesta"
                />
              ))}
            </section>
          )}

          <section aria-label="Comentarios" className="space-y-4">
            <CampoTexto
              titulo="¿Cómo lo hacen actualmente?"
              ayuda="Opcional. Quién lo hace, con qué papeles o programas."
              valor={v.actual ?? ''}
              deshabilitado={!editable}
              marcador="Ej.: se anota en un cuaderno y luego se pasa a Excel"
              onCambio={(t) => onCambio((m) => ({ ...m, actual: t }))}
            />
            <CampoTexto
              titulo="¿Qué otra necesidad debemos considerar?"
              ayuda="Opcional. Reglas particulares, dudas o cosas que no aparecen en la lista."
              valor={v.comentarios ?? ''}
              deshabilitado={!editable}
              marcador="Escriba aquí sus comentarios. No incluya datos de pacientes."
              onCambio={(t) => onCambio((m) => ({ ...m, comentarios: t }))}
            />
          </section>
        </div>
      )}
    </article>
  )
}
