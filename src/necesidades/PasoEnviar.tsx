import { useEffect, useRef, useState } from 'react'
import { TituloPaso } from './Pasos'
import {
  avance,
  estadoCategoria,
  estadoGeneral,
  type Cuestionario,
  type Respuestas,
} from './tipos'
import { Aviso, Boton, CLASE_CAMPO, Cargando, ESTILO_DECISION, Icono } from './ui'

const fechaLarga = (iso: string) =>
  new Date(iso).toLocaleString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

interface Props {
  datos: Cuestionario
  resp: Respuestas
  editable: boolean
  /** Hay cambios que todavía no llegaron al servidor. */
  sinGuardar: boolean
  error: string
  enviando: boolean
  onCambioGeneral: (id: string, valor: string) => void
  onIrA: (paso: string, modulo?: string) => void
  onEnviar: () => void
  refTitulo: React.RefObject<HTMLHeadingElement | null>
}

/** Resumen de lo respondido y envío a BamarDev. Una vez enviado, queda de sólo lectura. */
export function PasoEnviar({
  datos,
  resp,
  editable,
  sinGuardar,
  error,
  enviando,
  onCambioGeneral,
  onIrA,
  onEnviar,
  refTitulo,
}: Props) {
  const { catalogo } = datos
  const a = avance(catalogo, resp)
  const [confirmando, setConfirmando] = useState(false)
  const quien = resp.general?.quien ?? ''
  const cargo = resp.general?.cargo ?? ''

  const sinRevisar = [
    { id: 'general', titulo: 'Información general', e: estadoGeneral(catalogo, resp) },
    ...catalogo.categorias.map((c) => ({ id: c.id, titulo: `${c.id}. ${c.titulo}`, e: estadoCategoria(c, resp) })),
  ].filter((s) => !s.e.revisada)

  // ── Ya enviado ───────────────────────────────────────────────────────────
  if (!editable) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
              <Icono n="check" className="h-6 w-6" />
            </span>
            <div>
              <h1 ref={refTitulo} tabIndex={-1} className="text-2xl font-extrabold text-brand-900 outline-none">
                ¡Gracias! Recibimos su cuestionario
              </h1>
              {datos.enviadoEn && (
                <p className="text-sm text-brand-800">
                  Enviado el {fechaLarga(datos.enviadoEn)}
                  {datos.enviadoPor ? ` por ${datos.enviadoPor}` : ''}.
                </p>
              )}
            </div>
          </div>
          <p className="mt-3 text-[15px] text-brand-900">
            El equipo de BamarDev revisará sus respuestas y se pondrá en contacto para validar el alcance del
            proyecto. Si necesita cambiar algo, avíseles y le reabrirán el cuestionario.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 print:hidden">
          <Boton variante="secundario" onClick={() => window.print()}>
            <Icono n="imprimir" className="h-4 w-4" />
            Imprimir o guardar como PDF
          </Boton>
        </div>

        <ResumenFinal datos={datos} resp={resp} />
      </div>
    )
  }

  // ── Revisar y enviar ─────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <TituloPaso
        refTitulo={refTitulo}
        detalle="Este es el resumen de lo que contestó. Puede volver a cualquier sección para cambiar algo; mientras no lo envíe, todo se puede editar."
      >
        Revisar y enviar
      </TituloPaso>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
        <p className="text-[15px] font-semibold text-slate-800">
          Respondió {a.modulosRespondidos} de {a.modulosTotal} módulos
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {catalogo.decisionesModulo.map((o) => {
            const e = ESTILO_DECISION[o.valor]
            return (
              <div key={o.valor} className={`rounded-xl px-3 py-2.5 ${e.chip}`}>
                <p className="text-2xl font-extrabold leading-none">{a.porDecision[o.valor] ?? 0}</p>
                <p className="mt-1 text-[12.5px] font-bold leading-tight">{o.corta ?? o.etiqueta}</p>
              </div>
            )
          })}
          <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-300">
            <p className="text-2xl font-extrabold leading-none text-slate-900">{a.sinResponder.length}</p>
            <p className="mt-1 text-[12.5px] font-bold leading-tight text-slate-600">Sin responder</p>
          </div>
        </div>
      </section>

      {a.sinResponder.length > 0 && (
        <Aviso tono="alerta">
          <p className="font-semibold">
            {a.sinResponder.length === 1
              ? 'Falta 1 módulo por responder'
              : `Faltan ${a.sinResponder.length} módulos por responder`}
          </p>
          <p className="mt-0.5">
            Puede enviar igual. Pero nos ayuda más si los marca, aunque sea con «Quiero conversarlo».
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {a.sinResponder.map((m) => {
              const cat = catalogo.categorias.find((c) => c.modulos.some((x) => x.id === m.id))
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => cat && onIrA(cat.id, m.id)}
                    title={m.titulo}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-300 hover:bg-amber-100"
                  >
                    {m.id} · {m.titulo.length > 28 ? `${m.titulo.slice(0, 28)}…` : m.titulo}
                  </button>
                </li>
              )
            })}
          </ul>
        </Aviso>
      )}

      {sinRevisar.length > 0 && (
        <p className="text-sm text-slate-500">
          Secciones que no marcó como revisadas:{' '}
          {sinRevisar.map((s, i) => (
            <span key={s.id}>
              {i > 0 && ', '}
              <button
                type="button"
                onClick={() => onIrA(s.id)}
                className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900"
              >
                {s.titulo}
              </button>
            </span>
          ))}
          . Esto no impide el envío.
        </p>
      )}

      <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
        <h2 className="text-lg font-extrabold text-slate-900">¿Quién envía?</h2>
        <p className="mt-1 text-[14px] text-slate-600">Para saber con quién conversar si hace falta aclarar algo.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[15px] font-semibold text-slate-800">Su nombre</span>
            <input
              value={quien}
              maxLength={120}
              autoComplete="name"
              onChange={(e) => onCambioGeneral('quien', e.target.value)}
              className={`${CLASE_CAMPO} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="text-[15px] font-semibold text-slate-800">Cargo o área (opcional)</span>
            <input
              value={cargo}
              maxLength={120}
              onChange={(e) => onCambioGeneral('cargo', e.target.value)}
              className={`${CLASE_CAMPO} mt-1.5`}
            />
          </label>
        </div>
      </section>

      {error && <Aviso tono="error">{error}</Aviso>}

      <div className="flex flex-wrap items-center gap-3">
        <Boton
          disabled={!quien.trim() || enviando}
          onClick={() => setConfirmando(true)}
          className="px-8"
        >
          Enviar el cuestionario a BamarDev
        </Boton>
        {!quien.trim() && <p className="text-sm text-slate-500">Escriba su nombre para poder enviar.</p>}
        {sinGuardar && quien.trim() && (
          <p className="text-sm text-slate-500">Se guardarán sus últimos cambios antes de enviar.</p>
        )}
      </div>

      {confirmando && (
        <Confirmacion
          enviando={enviando}
          onCancelar={() => setConfirmando(false)}
          onConfirmar={() => {
            onEnviar()
          }}
          resumen={`${a.modulosRespondidos} de ${a.modulosTotal} módulos respondidos`}
        />
      )}
    </div>
  )
}

function Confirmacion({
  enviando,
  resumen,
  onCancelar,
  onConfirmar,
}: {
  enviando: boolean
  resumen: string
  onCancelar: () => void
  onConfirmar: () => void
}) {
  const botonCancelar = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    botonCancelar.current?.focus()
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && !enviando && onCancelar()
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [enviando, onCancelar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onClick={() => !enviando && onCancelar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmar"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="titulo-confirmar" className="text-xl font-extrabold text-slate-900">
          ¿Desea enviar estas respuestas a BamarDev para su revisión?
        </h2>
        <p className="mt-2 text-[15px] text-slate-600">
          {resumen}. Después de enviar ya no podrá cambiarlas, salvo que BamarDev le reabra el cuestionario.
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Boton ref={botonCancelar} variante="secundario" disabled={enviando} onClick={onCancelar}>
            Volver y revisar
          </Boton>
          <Boton disabled={enviando} onClick={onConfirmar}>
            {enviando ? (
              <>
                <Cargando /> Enviando…
              </>
            ) : (
              'Sí, enviar'
            )}
          </Boton>
        </div>
      </div>
    </div>
  )
}

/** Todo lo decidido, módulo por módulo. También es lo que se imprime. */
function ResumenFinal({ datos, resp }: { datos: Cuestionario; resp: Respuestas }) {
  const { catalogo } = datos
  const a = avance(catalogo, resp)
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 print:ring-0 sm:p-5">
      <h2 className="text-lg font-extrabold text-slate-900">
        Resumen de sus respuestas · {datos.nombre}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {a.modulosRespondidos} de {a.modulosTotal} módulos respondidos
        {catalogo.decisionesModulo
          .map((o) => ` · ${a.porDecision[o.valor] ?? 0} ${(o.corta ?? o.etiqueta).toLowerCase()}`)
          .join('')}
      </p>

      <div className="mt-4 space-y-5">
        {catalogo.categorias.map((c) => (
          <div key={c.id} className="break-inside-avoid">
            <h3 className="text-[15px] font-extrabold text-slate-900">
              {c.id}. {c.titulo}
            </h3>
            <ul className="mt-1 divide-y divide-slate-100">
              {c.modulos.map((m) => {
                const r = resp.modulos?.[m.id]
                const d = catalogo.decisionesModulo.find((o) => o.valor === r?.decision)
                const e = r?.decision ? ESTILO_DECISION[r.decision] : undefined
                const necesarias = Object.values(r?.funciones ?? {}).filter((x) => x === 'necesaria').length
                return (
                  <li key={m.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-[14px]">
                    <span className="w-9 shrink-0 font-extrabold text-slate-500">{m.id}</span>
                    <span className="min-w-0 flex-1 basis-48 text-slate-800">{m.titulo}</span>
                    {d && e ? (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${e.chip}`}>
                        {d.corta ?? d.etiqueta}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">Sin responder</span>
                    )}
                    {r?.prioridad && r.decision !== 'no' && (
                      <span className="text-xs text-slate-500">Prioridad {r.prioridad}</span>
                    )}
                    {necesarias > 0 && (
                      <span className="text-xs text-slate-500">
                        {necesarias} {necesarias === 1 ? 'función necesaria' : 'funciones necesarias'}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
