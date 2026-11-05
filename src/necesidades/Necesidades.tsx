import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ErrorApi, cargarCuestionario, enviarCuestionario } from './api'
import { PasoEnviar } from './PasoEnviar'
import { BarraPaso, PasoCategoria, PasoGeneral, PasoInicio } from './Pasos'
import {
  aplicarParche,
  avance,
  estadoCategoria,
  estadoGeneral,
  limpiarModulo,
  type Cuestionario,
  type EstadoSeccion,
  type ModuloResp,
  type Parche,
  type Respuestas,
} from './tipos'
import { useAutoguardado, type EstadoGuardado } from './useAutoguardado'
import { Aviso, Boton, Cargando, Icono, Marca } from './ui'

type Carga =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string; reintentable: boolean }
  | { tipo: 'listo'; datos: Cuestionario }

/** La clave del enlace: `?k=…`. */
const leerToken = () => (new URLSearchParams(window.location.search).get('k') ?? '').trim()

export default function Necesidades() {
  const token = useMemo(leerToken, [])
  const [carga, setCarga] = useState<Carga>(
    token
      ? { tipo: 'cargando' }
      : {
          tipo: 'error',
          mensaje:
            'Falta la clave del enlace. Abra el cuestionario desde el enlace completo que le envió BamarDev.',
          reintentable: false,
        },
  )

  const cargar = useCallback(() => {
    if (!token) return
    setCarga({ tipo: 'cargando' })
    cargarCuestionario(token)
      .then((datos) => setCarga({ tipo: 'listo', datos }))
      .catch((e: unknown) => {
        const err = e instanceof ErrorApi ? e : null
        setCarga({
          tipo: 'error',
          mensaje: err?.sinRed
            ? 'No pudimos conectarnos. Revise su conexión a internet e intente de nuevo.'
            : (err?.message ?? 'No se pudo abrir el cuestionario.'),
          reintentable: !!err?.sinRed,
        })
      })
  }, [token])

  useEffect(cargar, [cargar])

  useEffect(() => {
    document.title =
      carga.tipo === 'listo'
        ? `Cuestionario de necesidades · ${carga.datos.nombre}`
        : 'Cuestionario de necesidades · BamarDev'
  }, [carga])

  if (carga.tipo === 'listo') return <Cuerpo token={token} inicial={carga.datos} />

  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-to-b from-brand-50 via-white to-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Marca />
        </div>
        {carga.tipo === 'cargando' ? (
          <p className="flex items-center justify-center gap-2 text-slate-600">
            <Cargando className="h-5 w-5" /> Abriendo el cuestionario…
          </p>
        ) : (
          <div className="space-y-4">
            <Aviso tono="error" className="text-left">
              {carga.mensaje}
            </Aviso>
            {carga.reintentable && <Boton onClick={cargar}>Intentar de nuevo</Boton>}
          </div>
        )}
      </div>
    </div>
  )
}

// ── El cuestionario ya cargado ───────────────────────────────────────────────

function Cuerpo({ token, inicial }: { token: string; inicial: Cuestionario }) {
  const { catalogo } = inicial
  const [enviadoAhora, setEnviadoAhora] = useState<{ en: string; por: string } | null>(null)
  const editable = inicial.editable && !enviadoAhora
  const datos: Cuestionario = enviadoAhora
    ? { ...inicial, editable: false, enviadoEn: enviadoAhora.en, enviadoPor: enviadoAhora.por }
    : inicial

  const [resp, setResp] = useState<Respuestas>(inicial.respuestas)
  // La referencia es la verdad: los cambios la leen para armar el módulo nuevo
  // sin depender de qué render los vio.
  const respRef = useRef<Respuestas>(inicial.respuestas)

  const auto = useAutoguardado(token, editable, inicial.guardadoEn)
  const { marcar, recuperar } = auto

  // Si la vez anterior se cortó internet con cambios sin mandar, se recuperan.
  useEffect(() => {
    if (!inicial.editable) return
    const p = recuperar()
    if (p) {
      respRef.current = aplicarParche(respRef.current, p)
      setResp(respRef.current)
    }
  }, [inicial.editable, recuperar])

  const cambiar = useCallback(
    (parche: Partial<Parche>) => {
      respRef.current = aplicarParche(respRef.current, parche)
      setResp(respRef.current)
      marcar(parche)
    },
    [marcar],
  )

  const cambiarGeneral = useCallback((id: string, valor: string) => cambiar({ general: { [id]: valor } }), [cambiar])

  const cambiarModulo = useCallback(
    (id: string, fn: (m: ModuloResp) => ModuloResp) => {
      const nuevo = limpiarModulo(fn(respRef.current.modulos?.[id] ?? {}))
      cambiar({ modulos: { [id]: nuevo } })
    },
    [cambiar],
  )

  // ── Navegación entre pasos ────────────────────────────────────────────────
  const pasos = useMemo(
    () => [
      { id: 'inicio', titulo: 'Bienvenida' },
      { id: 'general', titulo: 'Información general' },
      ...catalogo.categorias.map((c) => ({ id: c.id, titulo: `${c.id}. ${c.titulo}` })),
      { id: 'enviar', titulo: datos.editable ? 'Revisar y enviar' : 'Resumen enviado' },
    ],
    [catalogo, datos.editable],
  )
  const idsValidos = useMemo(() => new Set(pasos.map((p) => p.id)), [pasos])
  const pasoDelHash = useCallback(() => {
    const h = decodeURIComponent(window.location.hash.slice(1))
    return idsValidos.has(h) ? h : 'inicio'
  }, [idsValidos])

  const [paso, setPaso] = useState(pasoDelHash)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const titulo = useRef<HTMLHeadingElement>(null)

  const irA = useCallback(
    (id: string, modulo?: string) => {
      setPaso(id)
      setMenuAbierto(false)
      window.history.replaceState(null, '', `${window.location.search}#${id}`)
      // Si pide un módulo puntual, se baja hasta él cuando ya se dibujó.
      window.setTimeout(() => {
        const el = modulo ? document.getElementById(`modulo-${modulo}`) : null
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else {
          window.scrollTo({ top: 0 })
          titulo.current?.focus({ preventScroll: true })
        }
      }, 30)
    },
    [],
  )

  useEffect(() => {
    const alCambiarHash = () => setPaso(pasoDelHash())
    window.addEventListener('hashchange', alCambiarHash)
    return () => window.removeEventListener('hashchange', alCambiarHash)
  }, [pasoDelHash])

  const indice = pasos.findIndex((p) => p.id === paso)
  const ir = (delta: number) => irA(pasos[Math.min(pasos.length - 1, Math.max(0, indice + delta))].id)

  /** Marca la sección como revisada y pasa a la siguiente. */
  const terminarSeccion = (id: string) => {
    if (editable && !respRef.current.secciones?.[id]) cambiar({ secciones: { [id]: true } })
    ir(1)
  }

  // ── Estado de cada paso, para el menú ─────────────────────────────────────
  const estados = useMemo(() => {
    const m = new Map<string, EstadoSeccion>()
    m.set('general', estadoGeneral(catalogo, resp))
    for (const c of catalogo.categorias) m.set(c.id, estadoCategoria(c, resp))
    return m
  }, [catalogo, resp])
  const a = useMemo(() => avance(catalogo, resp), [catalogo, resp])
  const hayAvance = a.modulosRespondidos > 0 || (estados.get('general')?.respondidos ?? 0) > 0

  const comenzar = () => {
    const primero = ['general', ...catalogo.categorias.map((c) => c.id)].find((id) => !estados.get(id)?.revisada)
    irA(hayAvance && primero ? primero : 'general')
  }

  // ── Envío ─────────────────────────────────────────────────────────────────
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const enviar = async () => {
    setEnviando(true)
    setErrorEnvio('')
    try {
      // Lo último que escribió tiene que estar en el servidor antes de cerrar.
      if (!(await auto.guardarAhora())) {
        setErrorEnvio('No pudimos guardar sus últimos cambios. Revise su conexión e intente de nuevo.')
        return
      }
      const r = await enviarCuestionario(
        token,
        respRef.current.general?.quien?.trim() ?? '',
        respRef.current.general?.cargo?.trim() ?? '',
      )
      setEnviadoAhora({ en: r.enviadoEn, por: respRef.current.general?.quien?.trim() ?? '' })
      irA('enviar')
    } catch (e) {
      setErrorEnvio(e instanceof ErrorApi ? e.message : 'No se pudo enviar. Intente de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const categoria = catalogo.categorias.find((c) => c.id === paso)

  return (
    <div className="min-h-dvh bg-slate-50">
      <Encabezado
        nombre={datos.nombre}
        porcentaje={a.porcentaje}
        respondidos={a.modulosRespondidos}
        total={a.modulosTotal}
        editable={editable}
        estado={auto.estado}
        guardadoEn={auto.guardadoEn}
        mensaje={auto.mensaje}
        onGuardar={() => void auto.guardarAhora()}
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 pt-5 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:pt-8">
        {/* Menú: lateral en pantalla grande, desplegable en el celular */}
        <nav aria-label="Secciones" className="print:hidden">
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-200 lg:hidden"
          >
            <Icono n="lista" className="h-5 w-5 shrink-0 text-brand-700" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-slate-500">
                Paso {indice + 1} de {pasos.length}
              </span>
              <span className="block truncate text-[15px] font-bold text-slate-900">{pasos[indice].titulo}</span>
            </span>
            <Icono n="abajo" className={`h-5 w-5 shrink-0 transition ${menuAbierto ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${menuAbierto ? 'mt-2 block' : 'hidden'} lg:sticky lg:top-24 lg:mt-0 lg:block`}>
            <ul className="space-y-1 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
              {pasos.map((p) => (
                <li key={p.id}>
                  <ItemMenu
                    titulo={p.titulo}
                    actual={p.id === paso}
                    estado={estados.get(p.id)}
                    tipo={p.id === 'inicio' ? 'inicio' : p.id === 'enviar' ? 'enviar' : 'seccion'}
                    enviado={!datos.editable}
                    onClick={() => irA(p.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <main className="min-w-0">
          {!datos.editable && paso !== 'inicio' && paso !== 'enviar' && (
            <Aviso tono="ok" className="mb-5 print:hidden">
              Este cuestionario ya fue enviado y está en modo lectura.
            </Aviso>
          )}

          {paso === 'inicio' && (
            <PasoInicio datos={datos} hayAvance={hayAvance} onComenzar={comenzar} refTitulo={titulo} />
          )}

          {paso === 'general' && (
            <PasoGeneral
              catalogo={catalogo}
              resp={resp}
              editable={editable}
              onCambio={cambiarGeneral}
              refTitulo={titulo}
              barra={
                <BarraPaso
                  onAnterior={() => ir(-1)}
                  onSiguiente={() => terminarSeccion('general')}
                  textoSiguiente="Terminé esta sección"
                  revisada={estados.get('general')?.revisada}
                />
              }
            />
          )}

          {categoria && (
            <PasoCategoria
              key={categoria.id}
              categoria={categoria}
              catalogo={catalogo}
              resp={resp}
              editable={editable}
              onCambioModulo={cambiarModulo}
              refTitulo={titulo}
              barra={
                <BarraPaso
                  onAnterior={() => ir(-1)}
                  onSiguiente={() => terminarSeccion(categoria.id)}
                  textoSiguiente={
                    categoria.id === catalogo.categorias[catalogo.categorias.length - 1].id
                      ? 'Terminé, ir a revisar'
                      : 'Terminé esta sección'
                  }
                  revisada={estados.get(categoria.id)?.revisada}
                />
              }
            />
          )}

          {paso === 'enviar' && (
            <PasoEnviar
              datos={datos}
              resp={resp}
              editable={editable}
              sinGuardar={auto.estado !== 'guardado'}
              error={errorEnvio}
              enviando={enviando}
              onCambioGeneral={cambiarGeneral}
              onIrA={irA}
              onEnviar={() => void enviar()}
              refTitulo={titulo}
            />
          )}

          {paso === 'enviar' && editable && (
            <div className="mt-6 print:hidden">
              <Boton variante="secundario" onClick={() => ir(-1)}>
                <Icono n="izquierda" className="h-4 w-4" />
                Volver a las secciones
              </Boton>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ── Piezas del marco ─────────────────────────────────────────────────────────

function Encabezado({
  nombre,
  porcentaje,
  respondidos,
  total,
  editable,
  estado,
  guardadoEn,
  mensaje,
  onGuardar,
}: {
  nombre: string
  porcentaje: number
  respondidos: number
  total: number
  editable: boolean
  estado: EstadoGuardado
  guardadoEn: string | null
  mensaje: string
  onGuardar: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur print:static print:border-0">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <div className="shrink-0">
          <Marca chica />
        </div>
        <p className="hidden min-w-0 flex-1 truncate text-sm font-semibold text-slate-600 md:block">{nombre}</p>
        <div className="ml-auto flex items-center gap-2 sm:gap-3 print:hidden">
          {editable ? (
            <>
              <IndicadorGuardado estado={estado} guardadoEn={guardadoEn} mensaje={mensaje} onReintentar={onGuardar} />
              <Boton
                variante="suave"
                className="min-h-9 whitespace-nowrap px-3 py-1.5 text-[13px]"
                onClick={onGuardar}
              >
                Guardar<span className="hidden sm:inline"> ahora</span>
              </Boton>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">
              <Icono n="candado" className="h-4 w-4" />
              Enviado
            </span>
          )}
        </div>
      </div>
      <div
        className="h-1 bg-slate-100"
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Módulos respondidos"
      >
        <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${porcentaje}%` }} />
      </div>
      <p className="mx-auto max-w-6xl px-4 py-1 text-xs font-semibold text-slate-500 print:hidden">
        {respondidos} de {total} módulos respondidos · {porcentaje}%
      </p>
    </header>
  )
}

function IndicadorGuardado({
  estado,
  guardadoEn,
  mensaje,
  onReintentar,
}: {
  estado: EstadoGuardado
  guardadoEn: string | null
  mensaje: string
  onReintentar: () => void
}) {
  const hora = guardadoEn
    ? new Date(guardadoEn).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
    : null
  const base = 'inline-flex items-center gap-1.5 text-[13px] font-semibold'

  if (estado === 'guardando')
    return (
      <span className={`${base} text-slate-500`} role="status">
        <Cargando /> Guardando…
      </span>
    )
  if (estado === 'pendiente')
    return (
      <span className={`${base} text-slate-500`} role="status">
        Cambios sin guardar…
      </span>
    )
  if (estado === 'sin-conexion')
    return (
      <span className={`${base} text-amber-700`} role="status" title="Se guardará solo al volver la conexión">
        <Icono n="alerta" className="h-4 w-4" />
        <span>
          Sin conexión <span className="hidden sm:inline">· se guardará al volver</span>
        </span>
      </span>
    )
  if (estado === 'error')
    return (
      <span className={`${base} text-rose-700`} role="alert" title={mensaje}>
        <Icono n="alerta" className="h-4 w-4" />
        <span className="hidden max-w-48 truncate sm:inline">{mensaje || 'No se pudo guardar'}</span>
        <button type="button" onClick={onReintentar} className="underline underline-offset-2">
          Reintentar
        </button>
      </span>
    )
  return (
    <span className={`${base} text-brand-700`} role="status">
      <Icono n="check" className="h-4 w-4" />
      <span>
        Guardado<span className="hidden sm:inline">{hora ? ` a las ${hora}` : ''}</span>
      </span>
    </span>
  )
}

function ItemMenu({
  titulo,
  actual,
  estado,
  tipo,
  enviado,
  onClick,
}: {
  titulo: string
  actual: boolean
  estado: EstadoSeccion | undefined
  tipo: 'inicio' | 'seccion' | 'enviar'
  enviado: boolean
  onClick: () => void
}) {
  const punto =
    tipo !== 'seccion' || !estado ? (
      <span className="h-5 w-5 shrink-0" />
    ) : estado.estado === 'revisada' ? (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
        <Icono n="check" className="h-3.5 w-3.5" />
      </span>
    ) : estado.estado === 'en-progreso' ? (
      <span className="h-5 w-5 shrink-0 rounded-full border-2 border-brand-500 bg-gradient-to-r from-brand-500 from-50% to-transparent to-50%" />
    ) : (
      <span className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300" />
    )

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={actual ? 'step' : undefined}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        actual ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
      }`}
    >
      {tipo === 'enviar' && !enviado ? (
        <Icono n="derecha" className="h-5 w-5 shrink-0 text-brand-700" />
      ) : tipo === 'enviar' ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <Icono n="check" className="h-3.5 w-3.5" />
        </span>
      ) : (
        punto
      )}
      <span className="min-w-0 flex-1">
        <span className={`block text-[14px] leading-snug ${actual ? 'font-extrabold text-brand-900' : 'font-semibold text-slate-700'}`}>
          {titulo}
        </span>
        {estado && tipo === 'seccion' && (
          <span className="block text-xs text-slate-500">
            {estado.respondidos} de {estado.total}
            {estado.conversar && <span className="ml-1.5 font-bold text-sky-700">· para conversar</span>}
          </span>
        )}
      </span>
    </button>
  )
}
