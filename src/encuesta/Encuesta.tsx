import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import {
  COMPRA_EXTRA,
  CONTROL_ACTUAL,
  INTERES,
  MODALIDAD,
  PERIODO_LIMITE,
  PRECIO_EXTRA,
  PRECIO_MENSUAL,
  RUBROS,
  VENTAS_DIA,
  atiendePedidos,
  herramientasPara,
  interesado,
  preguntaPrecioExtra,
  type Opcion,
  type Rubro,
} from './preguntas'

/**
 * En los builds la fija `.env.production` / `.env.qa`. En `npm run dev` queda
 * vacía y se pega a /api, que el proxy de Vite reenvía (ver vite.config.ts):
 * así localhost no necesita estar en el CORS del backend.
 */
const API = import.meta.env.VITE_API_URL || '/api'

/** Marca que deja el navegador al terminar, para no pedirle la encuesta dos veces. */
const YA_RESPONDIO = 'bamardev_encuesta_emprendedor'

interface Respuestas {
  rubro?: Rubro
  rubroOtro?: string
  ventasDia?: string
  control?: string
  herramientas: string[]
  precioMensual?: string
  modalidad?: string
  periodoLimite?: string
  compraExtra?: string
  precioExtra?: string
  interes?: string
  nombreNegocio?: string
  whatsapp?: string
}

type Pregunta =
  | 'rubro'
  | 'ventasDia'
  | 'control'
  | 'herramientas'
  | 'precioMensual'
  | 'modalidad'
  | 'periodoLimite'
  | 'compraExtra'
  | 'precioExtra'
  | 'interes'
  | 'contacto'

type Paso = 'inicio' | Pregunta | 'gracias'

/**
 * Qué se pregunta, según lo que ya contestó. Dos preguntas dependen de otra:
 * el precio de las ventas extra (sólo si las compraría) y el contacto (sólo si
 * el plan le interesa).
 */
function secuencia(r: Respuestas): Pregunta[] {
  const pasos: Pregunta[] = [
    'rubro',
    'ventasDia',
    'control',
    'herramientas',
    'precioMensual',
    'modalidad',
    'periodoLimite',
    'compraExtra',
  ]
  if (preguntaPrecioExtra(r.compraExtra)) pasos.push('precioExtra')
  pasos.push('interes')
  if (interesado(r.interes)) pasos.push('contacto')
  return pasos
}

/**
 * La primera pregunta sin contestar, si queda alguna. Pasa con un borrador de
 * una versión anterior de la encuesta (se agregó una pregunta mientras alguien
 * la tenía a medias): sin esto el envío rebotaba y no había cómo llegar a ella.
 */
function sinContestar(r: Respuestas): Pregunta | undefined {
  return secuencia(r).find((p) =>
    p === 'contacto'
      ? false
      : p === 'herramientas'
        ? // Se cuenta lo que se VA A ENVIAR, no lo que quedó en el estado: el
          // payload filtra las herramientas por rubro y el backend exige al
          // menos una. Mirando la lista cruda, una respuesta cuyas
          // herramientas no existan para su rubro pasaba la guardia y rebotaba
          // con 400 — mostrando "actualizamos la encuesta", que no ayuda y
          // pierde todo lo contestado.
          herramientasElegidasDe(r).length === 0
        : !r[p],
  )
}

/** Las herramientas que sobreviven al filtro por rubro: lo que se envía. */
function herramientasElegidasDe(r: Respuestas): string[] {
  const visibles = herramientasPara(r.rubro)
  return r.herramientas.filter((h) => visibles.some((o) => o.valor === h))
}

/**
 * De dónde vino el link: `?origen=facebook`, `?o=visita` o el utm de siempre.
 *
 * Se sanea igual que el backend y se corta en 40, que es lo que acepta el DTO.
 * Sin esto, un `utm_source` de los que arma el administrador de anuncios de
 * Facebook —"fb_campaign_verano2026_bolivia_santacruz_leads_v3" son 49
 * caracteres— rebotaba con 400 y la persona perdía la encuesta entera con el
 * mensaje de "actualizamos la encuesta", que no tiene nada que ver.
 *
 * El saneado va ANTES del corte a propósito: el backend valida el largo del
 * texto crudo y recién después limpia, así que recortar sin limpiar dejaría
 * pasar 40 caracteres que el backend igual rechaza.
 */
function leerOrigen(): string | undefined {
  const q = new URLSearchParams(window.location.search)
  const crudo = (q.get('origen') || q.get('o') || q.get('utm_source') || '').trim()
  const limpio = crudo.toLowerCase().replace(/[^a-z0-9_-]/g, '')
  return limpio.slice(0, 40) || undefined
}

function leerYaRespondio(): boolean {
  try {
    return localStorage.getItem(YA_RESPONDIO) !== null
  } catch {
    return false
  }
}

/**
 * Lo contestado hasta ahora, por pestaña. Si la página se recarga a mitad de
 * camino (la señal se corta, el celular la recarga al volver de WhatsApp) no
 * se empieza de cero.
 */
const BORRADOR = 'bamardev_encuesta_emprendedor_borrador'

/** Las opciones vigentes de cada pregunta de opción única. */
const OPCIONES: Partial<Record<keyof Respuestas, Opcion[]>> = {
  rubro: RUBROS,
  ventasDia: VENTAS_DIA,
  control: CONTROL_ACTUAL,
  precioMensual: PRECIO_MENSUAL,
  modalidad: MODALIDAD,
  periodoLimite: PERIODO_LIMITE,
  compraExtra: COMPRA_EXTRA,
  precioExtra: PRECIO_EXTRA,
  interes: INTERES,
}

/**
 * El borrador puede venir de una versión anterior de la encuesta: una opción
 * que ya no existe se descarta, y `sinContestar` vuelve a hacer esa pregunta
 * antes de enviar. Si no, el backend la rechazaba una y otra vez.
 */
function leerBorrador(): Respuestas | null {
  try {
    const raw = sessionStorage.getItem(BORRADOR)
    if (!raw) return null
    const r = JSON.parse(raw) as Respuestas
    for (const [campo, opciones] of Object.entries(OPCIONES) as [keyof Respuestas, Opcion[]][]) {
      if (r[campo] !== undefined && !opciones.some((o) => o.valor === r[campo])) delete r[campo]
    }
    r.herramientas = (r.herramientas ?? []).filter((h) =>
      herramientasPara(r.rubro).some((o) => o.valor === h),
    )
    return r
  } catch {
    return null
  }
}

/**
 * Un 400 con la encuesta completa sólo pasa si cambió mientras alguien la
 * respondía (un despliegue en el medio). El mensaje del backend ahí es técnico
 * ("Elige una opción válida en…" de una pregunta que nunca vio); recargar trae
 * la versión nueva y el borrador lo deja donde estaba.
 */
const DESACTUALIZADA =
  'Actualizamos la encuesta mientras la respondías. Recarga para terminarla: lo que ya respondiste se mantiene.'

/** Una pausa corta antes de pasar: que se vea la opción marcada. */
const PAUSA_MS = 220

export default function Encuesta() {
  const [borrador] = useState(leerBorrador)
  // Tras una recarga el historial todavía dice en qué pregunta iba; sin el
  // borrador esa pregunta estaría huérfana, así que se vuelve al inicio.
  const [paso, setPaso] = useState<Paso>(() => {
    const enHistorial = history.state?.paso as Paso | undefined
    return borrador && enHistorial && enHistorial !== 'gracias' ? enHistorial : 'inicio'
  })
  const [r, setR] = useState<Respuestas>(borrador ?? { herramientas: [] })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [yaRespondio] = useState(leerYaRespondio)
  const titulo = useRef<HTMLHeadingElement>(null)
  const enviado = useRef(false)
  /**
   * El POST en vuelo. Va en un ref y no en el estado `enviando` porque
   * `setEnviando(true)` no desactiva el botón hasta que React vuelve a
   * pintar: dos toques rápidos —o el doble tap que deja el teclado del
   * celular al cerrarse— entran los dos en el mismo tick y mandan la encuesta
   * dos veces. El endpoint no tiene idempotencia, así que eso son dos filas
   * en la base y una persona contada doble en los promedios.
   *
   * Es el mismo cuidado que ya tenía el avance automático con
   * `pasoAutomatico`; al envío le faltaba.
   */
  const enVuelo = useRef(false)
  const pasoAutomatico = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (enviado.current) return
    try {
      sessionStorage.setItem(BORRADOR, JSON.stringify(r))
    } catch {
      /* sin storage: sólo se pierde lo contestado si recarga */
    }
  }, [r])

  // El botón "atrás" del celular vuelve a la pregunta anterior en vez de
  // sacar a la persona de la encuesta con todo lo contestado. Cada avance
  // deja una entrada en el historial y acá se la lee.
  useEffect(() => {
    const alVolver = (ev: PopStateEvent) => {
      if (enviado.current) {
        // Ya envió: volver a las preguntas invitaría a mandarla de nuevo.
        history.pushState({ paso: 'gracias' }, '')
        return
      }
      setError('')
      setPaso((ev.state?.paso as Paso | undefined) ?? 'inicio')
    }
    window.addEventListener('popstate', alVolver)
    return () => window.removeEventListener('popstate', alVolver)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    titulo.current?.focus({ preventScroll: true })
  }, [paso])

  const ir = (siguiente: Paso) => {
    history.pushState({ paso: siguiente }, '')
    setPaso(siguiente)
  }

  /**
   * El "← Atrás" del encabezado.
   *
   * En la primera pregunta NO usa `history.back()`: la encuesta se comparte
   * por WhatsApp, y quien entra desde ahí tiene la portada como única entrada
   * propia del historial. Un `back()` de más lo devolvía a WhatsApp, o sea
   * fuera del sitio, y la encuesta quedaba abandonada. Desde la segunda
   * pregunta sí es `back()`, para que el botón del encabezado y el del celular
   * hagan exactamente lo mismo.
   */
  const volverAtras = () => {
    const pasos = secuencia(r)
    if (paso === pasos[0]) ir('inicio')
    else history.back()
  }

  /** Pasa a la siguiente pregunta que corresponda con estas respuestas. */
  const avanzar = (con: Respuestas) => {
    const pasos = secuencia(con)
    const i = pasos.indexOf(paso as Pregunta)
    const siguiente = pasos[i + 1]
    if (siguiente) ir(siguiente)
    else void enviar(con)
  }

  /**
   * Opción única: marca y pasa sola. Un segundo toque dentro de la pausa
   * reemplaza al primero en vez de sumar otro avance: con dos, un doble toque
   * saltaba la pregunta siguiente sin que nadie la viera.
   */
  const elegir = (campo: keyof Respuestas, valor: string) => {
    const nuevas = { ...r, [campo]: valor }
    setR(nuevas)
    clearTimeout(pasoAutomatico.current)
    pasoAutomatico.current = setTimeout(() => avanzar(nuevas), PAUSA_MS)
  }

  const alternar = (valor: string) =>
    setR((prev) => ({
      ...prev,
      herramientas: prev.herramientas.includes(valor)
        ? prev.herramientas.filter((h) => h !== valor)
        : [...prev.herramientas, valor],
    }))

  /**
   * Si volvió atrás y cambió de rubro, lo marcado que el rubro nuevo no ofrece
   * (comandas en una farmacia) no se manda; lo demás se conserva.
   */
  const herramientasVisibles = herramientasPara(r.rubro)
  const herramientasElegidas = herramientasElegidasDe(r)

  async function enviar(con: Respuestas, honeypot = '') {
    const falta = sinContestar(con)
    if (falta) {
      ir(falta)
      return
    }
    // Antes de cualquier await: es lo único que corta el segundo toque, porque
    // `setEnviando` recién desactiva el botón en el próximo render.
    if (enVuelo.current || enviado.current) return
    enVuelo.current = true
    setEnviando(true)
    setError('')
    try {
      const res = await fetch(`${API}/encuestas/plan-emprendedor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rubro: con.rubro,
          rubroOtro: con.rubro === 'OTRO' ? con.rubroOtro?.trim() || undefined : undefined,
          ventasDia: con.ventasDia,
          control: con.control,
          herramientas: herramientasElegidasDe(con),
          precioMensual: con.precioMensual,
          modalidad: con.modalidad,
          periodoLimite: con.periodoLimite,
          compraExtra: con.compraExtra,
          precioExtra: preguntaPrecioExtra(con.compraExtra) ? con.precioExtra : undefined,
          interes: con.interes,
          nombreNegocio: interesado(con.interes) ? con.nombreNegocio?.trim() || undefined : undefined,
          whatsapp: interesado(con.interes) ? con.whatsapp?.trim() || undefined : undefined,
          origen: leerOrigen(),
          web: honeypot,
        }),
      })
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Llegaron muchas respuestas desde tu conexión. Espera un minuto y vuelve a intentar.')
        }
        throw new Error(
          res.status === 400
            ? DESACTUALIZADA
            : 'No pudimos guardar tus respuestas. Vuelve a intentar en un momento.',
        )
      }
      enviado.current = true
      try {
        localStorage.setItem(YA_RESPONDIO, new Date().toISOString())
        sessionStorage.removeItem(BORRADOR)
      } catch {
        /* modo privado: sólo se pierde el aviso de "ya respondiste" */
      }
      history.replaceState({ paso: 'gracias' }, '')
      setPaso('gracias')
    } catch (e) {
      setError(
        e instanceof TypeError
          ? 'No pudimos conectarnos. Revisa tu internet y vuelve a intentar.'
          : e instanceof Error
            ? e.message
            : 'No pudimos guardar tus respuestas.',
      )
    } finally {
      // Se libera siempre: si falló por red o por un 429, la persona tiene que
      // poder reintentar. Lo que impide el reenvío tras un alta exitosa es
      // `enviado.current`, no esto.
      enVuelo.current = false
      setEnviando(false)
    }
  }

  if (paso === 'inicio') {
    return (
      <Pantalla>
        <div className="flex flex-col items-center text-center">
          <img src="/logo-192.png" alt="" className="h-24 w-24 rounded-3xl shadow-lg shadow-brand-500/20" />
          <Marca className="mt-4" />

          <span className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-800">
            🚀 Nuevo · Plan Emprendedor
          </span>
          <h1
            ref={titulo}
            tabIndex={-1}
            className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 outline-none sm:text-3xl"
          >
            Ayúdanos a crear un plan para los que recién empiezan
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Estamos preparando un plan económico de BamarDev para pequeños negocios y
            emprendimientos. Tu opinión nos ayuda a definir su precio y sus límites.
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-semibold text-slate-700">
            <li className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">⏱️ 2 minutos</li>
            <li className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">📋 9 preguntas</li>
            <li className="rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">🔒 Sin registrarte</li>
          </ul>

          {yaRespondio && (
            <p className="mt-6 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800 ring-1 ring-brand-200">
              Ya respondiste esta encuesta desde este celular. ¡Gracias! 💚
              <br />
              Si es para otro negocio, puedes responderla de nuevo.
            </p>
          )}

          <Boton className="mt-8" onClick={() => ir('rubro')}>
            {yaRespondio ? 'Responder para otro negocio' : 'Comenzar encuesta'}
          </Boton>
        </div>
      </Pantalla>
    )
  }

  if (paso === 'gracias') {
    return (
      <Pantalla>
        <div className="flex flex-col items-center py-6 text-center">
          <img src="/logo-192.png" alt="" className="h-28 w-28 rounded-3xl shadow-lg shadow-brand-500/20" />
          <h1
            ref={titulo}
            tabIndex={-1}
            className="mt-8 text-2xl font-extrabold text-slate-900 outline-none sm:text-3xl"
          >
            ¡Muchas gracias por participar! 💚
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Tus respuestas nos ayudan a diseñar un Plan Emprendedor realmente accesible para
            pequeños negocios.
          </p>
          {r.whatsapp?.trim() && interesado(r.interes) && (
            <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800 ring-1 ring-brand-200">
              Te escribiremos al <strong>{r.whatsapp.trim()}</strong> cuando lancemos el plan.
            </p>
          )}

          <div className="mt-10 w-full border-t border-slate-200 pt-8">
            <Marca />
            <p className="mt-2 text-sm font-medium text-slate-500">
              Plataforma inteligente para tu negocio
            </p>
            <a
              href="/"
              className="mt-6 inline-block text-sm font-bold text-brand-700 underline-offset-4 hover:underline"
            >
              Conoce BamarDev →
            </a>
          </div>
        </div>
      </Pantalla>
    )
  }

  // El contacto no cuenta como pregunta: es opcional, y sumarlo hacía decir
  // "9 de 10" a una encuesta que promete 8.
  const preguntas = secuencia(r).filter((p) => p !== 'contacto')
  const numero = paso === 'contacto' ? preguntas.length : preguntas.indexOf(paso) + 1
  const pedidos = atiendePedidos(r.rubro)

  return (
    <Pantalla>
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={volverAtras}
          className="-ml-2 rounded-full px-2 py-1 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          ← Atrás
        </button>
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {paso === 'contacto' ? 'Último paso' : `Pregunta ${numero} de ${preguntas.length}`}
        </span>
      </header>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={preguntas.length}
        aria-valuenow={numero}
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${(numero / preguntas.length) * 100}%` }}
        />
      </div>

      <section className="mt-8">
        {paso === 'rubro' && (
          <>
            <Titulo refTitulo={titulo}>¿Qué tipo de negocio tienes?</Titulo>
            <Opciones
              opciones={RUBROS}
              elegida={r.rubro}
              onElegir={(v) =>
                v === 'OTRO' ? setR({ ...r, rubro: 'OTRO' }) : elegir('rubro', v)
              }
            />
            {r.rubro === 'OTRO' && (
              <form
                className="mt-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  avanzar(r)
                }}
              >
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">¿Cuál? (opcional)</span>
                  <input
                    autoFocus
                    value={r.rubroOtro ?? ''}
                    onChange={(e) => setR({ ...r, rubroOtro: e.target.value })}
                    maxLength={60}
                    placeholder="Librería, panadería, veterinaria…"
                    className={CLASE_INPUT}
                  />
                </label>
                <Boton type="submit" className="mt-4">
                  Siguiente
                </Boton>
              </form>
            )}
          </>
        )}

        {paso === 'ventasDia' && (
          <>
            <Titulo refTitulo={titulo}>
              {pedidos
                ? '¿Cuántos pedidos atiendes en un día normal?'
                : '¿Cuántas ventas haces en un día normal?'}
            </Titulo>
            <Ayuda>
              {pedidos
                ? 'Cuenta cada cobro como un pedido, aunque lleve varios platos.'
                : 'Cuenta cada cobro como una venta, aunque lleve varios productos.'}
            </Ayuda>
            <Opciones
              opciones={VENTAS_DIA}
              elegida={r.ventasDia}
              onElegir={(v) => elegir('ventasDia', v)}
              columnas
            />
          </>
        )}

        {paso === 'control' && (
          <>
            <Titulo refTitulo={titulo}>¿Cómo controlas hoy tus ventas y tu inventario?</Titulo>
            <Opciones opciones={CONTROL_ACTUAL} elegida={r.control} onElegir={(v) => elegir('control', v)} />
          </>
        )}

        {paso === 'herramientas' && (
          <>
            <Titulo refTitulo={titulo}>¿Qué te sería más útil para administrar tu negocio?</Titulo>
            <Ayuda>Puedes elegir varias.</Ayuda>
            <div className="mt-5 grid gap-2.5">
              {herramientasVisibles.map((o) => (
                <BotonOpcion
                  key={o.valor}
                  opcion={o}
                  marcada={herramientasElegidas.includes(o.valor)}
                  multiple
                  onClick={() => alternar(o.valor)}
                />
              ))}
            </div>
            <Boton
              className="mt-6"
              disabled={herramientasElegidas.length === 0}
              onClick={() => avanzar(r)}
            >
              {herramientasElegidas.length === 0
                ? 'Elige al menos una'
                : `Siguiente (${herramientasElegidas.length})`}
            </Boton>
          </>
        )}

        {paso === 'precioMensual' && (
          <>
            <Titulo refTitulo={titulo}>
              Si estuvieras empezando tu negocio, ¿cuánto te parecería razonable pagar al mes por
              un sistema con ventas, inventario y reportes?
            </Titulo>
            <Opciones
              opciones={PRECIO_MENSUAL}
              elegida={r.precioMensual}
              onElegir={(v) => elegir('precioMensual', v)}
            />
          </>
        )}

        {paso === 'modalidad' && (
          <>
            <Titulo refTitulo={titulo}>¿Qué forma de pago preferirías para un plan económico?</Titulo>
            <Ayuda>
              Imagina un plan para emprendedores con lo principal de un sistema de ventas e
              inventario.
            </Ayuda>
            <Opciones opciones={MODALIDAD} elegida={r.modalidad} onElegir={(v) => elegir('modalidad', v)} />
          </>
        )}

        {paso === 'periodoLimite' && (
          <>
            <Titulo refTitulo={titulo}>
              Si tu plan tuviera un límite de ventas, ¿cómo te acomodaría más?
            </Titulo>
            <Ayuda>Imagina el mismo total de ventas, repartido de dos formas.</Ayuda>
            <Opciones
              opciones={PERIODO_LIMITE}
              elegida={r.periodoLimite}
              onElegir={(v) => elegir('periodoLimite', v)}
            />
          </>
        )}

        {paso === 'compraExtra' && (
          <>
            {/* Acá "ventas" también para comida: "comprar pedidos" se lee como
                encargar comida, y lo que se vende es cupo de ventas. Y sin "del
                día": el límite puede terminar siendo mensual. */}
            <Titulo refTitulo={titulo}>
              Si llegas al límite de ventas de tu plan, ¿te interesaría comprar un paquete de ventas
              adicionales para seguir usando el sistema?
            </Titulo>
            <Ayuda>Las ventas extra que compres y no uses no se pierden: te quedan para después.</Ayuda>
            <Opciones
              opciones={COMPRA_EXTRA}
              elegida={r.compraExtra}
              onElegir={(v) => elegir('compraExtra', v)}
            />
          </>
        )}

        {paso === 'precioExtra' && (
          <>
            <Titulo refTitulo={titulo}>
              ¿Cuánto te parecería justo pagar por un paquete de 50 ventas adicionales?
            </Titulo>
            <Opciones
              opciones={PRECIO_EXTRA}
              elegida={r.precioExtra}
              onElegir={(v) => elegir('precioExtra', v)}
              columnas
            />
          </>
        )}

        {paso === 'interes' && (
          <>
            <Titulo refTitulo={titulo}>
              ¿Qué te parece un plan para emprendedores con lo principal de un sistema de gestión,
              a un precio accesible y que crece junto con tu negocio?
            </Titulo>
            {/* Sin avance automático: es la última pregunta, y si el plan no le
                interesa, tocar una opción sería enviar sin querer. */}
            <Opciones
              opciones={INTERES}
              elegida={r.interes}
              onElegir={(v) => setR({ ...r, interes: v })}
            />
            {r.interes && (
              <>
                <AvisoError>{error}</AvisoError>
                <Boton className="mt-6" disabled={enviando} onClick={() => avanzar(r)}>
                  {interesado(r.interes)
                    ? 'Siguiente'
                    : enviando
                      ? 'Enviando…'
                      : 'Enviar respuestas'}
                </Boton>
              </>
            )}
          </>
        )}

        {paso === 'contacto' && (
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              const honeypot = String(new FormData(e.currentTarget).get('web') ?? '')
              void enviar(r, honeypot)
            }}
          >
            <Titulo refTitulo={titulo}>¿Quieres ser de los primeros en probarlo? 🚀</Titulo>
            <Ayuda>
              Déjanos tu WhatsApp y te avisamos cuando lancemos el Plan Emprendedor. Es opcional:
              puedes enviar sin dejarlo.
            </Ayuda>

            {/* Honeypot: oculto para personas, visible para bots que rellenan todo. */}
            <input
              type="text"
              name="web"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Nombre de tu negocio</span>
                <input
                  value={r.nombreNegocio ?? ''}
                  onChange={(e) => setR({ ...r, nombreNegocio: e.target.value })}
                  maxLength={80}
                  autoComplete="organization"
                  placeholder="Pollería Don Juan"
                  className={CLASE_INPUT}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">WhatsApp</span>
                <input
                  value={r.whatsapp ?? ''}
                  onChange={(e) => setR({ ...r, whatsapp: e.target.value })}
                  maxLength={30}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="700 00000"
                  className={CLASE_INPUT}
                />
              </label>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Sólo lo usamos para avisarte del plan. No lo compartimos con nadie.
            </p>

            <AvisoError>{error}</AvisoError>
            <Boton type="submit" className="mt-6" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar respuestas'}
            </Boton>
          </form>
        )}
      </section>
    </Pantalla>
  )
}

// ── Piezas ──────────────────────────────────────────────────────────────────

const CLASE_INPUT =
  'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100'

function Pantalla({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-brand-50 via-white to-white">
      <main className="mx-auto w-full max-w-lg px-4 pt-6 pb-12 sm:pt-12">{children}</main>
    </div>
  )
}

/** El logotipo en texto: BAMAR DEV / TECHNOLOGY, como en el material de marca. */
function Marca({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="text-2xl font-extrabold tracking-[0.12em] text-slate-900">
        BAMAR <span className="text-brand-600">DEV</span>
      </span>
      <span className="mt-1 flex items-center gap-2 text-[10px] font-semibold tracking-[0.5em] text-slate-500">
        <span className="h-px w-6 bg-brand-500" />
        TECHNOLOGY
        <span className="h-px w-6 bg-brand-500" />
      </span>
    </div>
  )
}

function Titulo({
  children,
  refTitulo,
}: {
  children: ReactNode
  refTitulo: RefObject<HTMLHeadingElement | null>
}) {
  return (
    <h1
      ref={refTitulo}
      tabIndex={-1}
      className="text-xl font-extrabold leading-snug text-slate-900 outline-none sm:text-2xl"
    >
      {children}
    </h1>
  )
}

function Ayuda({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[15px] text-slate-500">{children}</p>
}

function AvisoError({ children }: { children: ReactNode }) {
  if (!children) return null
  return (
    <div role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
      <p>{children}</p>
      {children === DESACTUALIZADA && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-800"
        >
          Recargar y continuar
        </button>
      )}
    </div>
  )
}

function Boton({
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`w-full rounded-full bg-brand-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-700/25 transition hover:bg-brand-800 active:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none ${className}`}
    />
  )
}

function Opciones({
  opciones,
  elegida,
  onElegir,
  columnas = false,
}: {
  opciones: Opcion[]
  elegida?: string
  onElegir: (valor: string) => void
  /** Opciones cortas (rangos, montos) en dos columnas: entra todo sin scroll. */
  columnas?: boolean
}) {
  return (
    <div className={`mt-5 grid gap-2.5 ${columnas ? 'grid-cols-2' : ''}`}>
      {opciones.map((o) => (
        <BotonOpcion
          key={o.valor}
          opcion={o}
          marcada={elegida === o.valor}
          onClick={() => onElegir(o.valor)}
        />
      ))}
    </div>
  )
}

function BotonOpcion({
  opcion,
  marcada,
  multiple = false,
  onClick,
}: {
  opcion: Opcion
  marcada: boolean
  multiple?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={marcada}
      className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[15px] font-semibold transition ${
        marcada
          ? 'border-brand-500 bg-brand-50 text-brand-900'
          : 'border-slate-200 bg-white text-slate-800 hover:border-brand-300'
      }`}
    >
      {opcion.emoji && (
        <span className="w-7 shrink-0 text-center text-xl" aria-hidden>
          {opcion.emoji}
        </span>
      )}
      <span className="flex-1">{opcion.texto}</span>
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
          multiple ? 'rounded-md' : 'rounded-full'
        } ${marcada ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'}`}
      >
        {marcada && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </button>
  )
}
