import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { WHATSAPP_DISPLAY, linkWhatsApp } from '../data/planes'
import { siteKeyTurnstile } from '../lib/turnstile'
import {
  API_ALTA_URL,
  API_OPCIONES_URL,
  APP_HOST,
  APP_URL,
  CAMPOS_DEL_PASO,
  adelantoLegal,
  erroresDelPaso,
  leerOpciones,
  normalizarWhatsApp,
  passwordOculta,
  slugAlias,
  urlEntrar,
  validarAlta,
  type CampoAlta,
  type DatosAlta,
  type PaletaAlta,
  type Paso,
  type RubroAlta,
} from '../lib/alta'
import { Markdown } from '../legal/Markdown'
import terminos from '../legal/TERMINOS-DE-SERVICIO.md?raw'
import privacidad from '../legal/POLITICA-DE-PRIVACIDAD.md?raw'
import { Captcha } from '../components/Captcha'
import { CheckIcon, WhatsAppIcon } from '../components/ui'
import { SelectorColor } from './SelectorColor'

/**
 * /empezar: la prueba de 7 días del Emprendedor (PLAN-ALTA-LANDING, B2). Una
 * página propia en vez del diálogo de antes: un asistente de 3 pasos y, al
 * terminar, una pantalla con los datos para entrar (B3) en lugar de saltar
 * sola a la app.
 *
 * Si se recarga a mitad arranca de cero, y está bien así: la contraseña no
 * se guarda en ningún lado, ni siquiera en el navegador.
 */
export default function Empezar() {
  return (
    <div className="min-h-dvh bg-slate-50 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Lateral />
      <main className="px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:flex lg:items-start lg:justify-center lg:px-10 lg:py-16">
        <Asistente />
      </main>
    </div>
  )
}

/** El costado oscuro (arriba en el celular): la marca y por qué vale la pena. */
function Lateral() {
  return (
    <aside className="relative overflow-hidden bg-slate-950 px-4 pb-8 pt-5 text-white sm:px-6 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:px-12 lg:py-10">
      {/* El mismo resplandor de marca que el hero de la landing, quieto. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-32 h-80 w-[36rem] rounded-full bg-brand-500/20 blur-3xl"
      />
      <a href="/" className="relative inline-flex items-center gap-2.5">
        <img src="/logo-marca.png" alt="" className="h-9 w-9" />
        <span className="text-lg font-extrabold tracking-tight">BamarDev</span>
        <span className="sr-only">: volver al inicio</span>
      </a>

      <div className="relative mt-6 lg:mt-auto">
        <p className="text-xs font-extrabold uppercase tracking-widest text-brand-400">Plan Emprendedor · 7 días gratis</p>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
          Probá BamarDev 7 días gratis
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
          Creás tu cuenta ahora y empezás a vender hoy, sin pagar nada por adelantado. Si te sirve, al terminar la
          prueba pagás con QR desde el mismo sistema.
        </p>
        <ul className="mt-8 hidden space-y-3 text-slate-200 lg:block">
          {[
            'Sin tarjeta y sin pago por adelantado',
            'Entrás desde el celular o la compu',
            'Si te trabás, te ayudamos por WhatsApp',
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <CheckIcon className="text-brand-400" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={linkWhatsApp('Hola BamarDev, quiero probar el plan Emprendedor y prefiero que me ayuden a crear la cuenta.')}
        target="_blank"
        rel="noreferrer"
        className="relative mt-auto hidden items-center gap-2 pt-10 text-sm font-semibold text-slate-400 transition-colors hover:text-brand-300 lg:inline-flex"
      >
        <WhatsAppIcon className="h-4 w-4" />
        ¿Preferís que te la armemos? {WHATSAPP_DISPLAY}
      </a>
    </aside>
  )
}

type Opciones =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; rubros: RubroAlta[]; paletas: PaletaAlta[] }

type Vista = 'asistente' | 'terminos' | 'privacidad'
type Estado = 'escribiendo' | 'creando' | 'listo' | 'espera'

/** Un aviso arriba del botón. `whatsapp` agrega el enlace con ese mensaje. */
interface Aviso {
  texto: string
  whatsapp?: string
}

/** Lo que queda en pantalla con la cuenta creada. De la contraseña, sólo la versión oculta. */
interface Creada {
  alias: string
  codigoEntrada: string
  oculta: string
}

const VACIO: DatosAlta = {
  nombreNegocio: '',
  rubro: '',
  nombre: '',
  whatsapp: '',
  password: '',
  aceptaTerminos: false,
}

const PASOS: { paso: Paso; titulo: string }[] = [
  { paso: 1, titulo: 'Tu negocio' },
  { paso: 2, titulo: 'Tus datos' },
  { paso: 3, titulo: 'Tu acceso' },
]

const INPUT =
  'mt-1 w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 outline-none transition-[border-color,box-shadow] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:bg-slate-50'

const PRIMARIO =
  'rounded-full bg-brand-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-500/30 transition-[background-color,transform] duration-150 hover:bg-brand-500 active:scale-[0.97] disabled:opacity-60'

function Asistente() {
  const id = useId()
  const form = useRef<HTMLFormElement>(null)
  const tarjeta = useRef<HTMLDivElement>(null)
  const titulos = useRef<Partial<Record<Paso, HTMLHeadingElement | null>>>({})
  const volverLegal = useRef<HTMLButtonElement>(null)
  const leerMas = useRef<HTMLButtonElement>(null)

  const [vista, setVista] = useState<Vista>('asistente')
  const [estado, setEstado] = useState<Estado>('escribiendo')
  const [paso, setPaso] = useState<Paso>(1)
  // Hasta dónde llegó: los pasos ya vistos siguen montados (ocultos) para no
  // perder el token del captcha al volver atrás.
  const [alcanzado, setAlcanzado] = useState<Paso>(1)
  const [datos, setDatos] = useState<DatosAlta>(VACIO)
  // Los errores de un paso se muestran recién al intentar pasarlo: marcar en
  // rojo un campo que todavía no se terminó de escribir sólo molesta.
  const [intentados, setIntentados] = useState<Partial<Record<Paso, boolean>>>({})
  // null = no tocó el color: sigue al recomendado del rubro (B1).
  const [temaElegido, setTemaElegido] = useState<string | null>(null)
  const [verPassword, setVerPassword] = useState(false)
  const [adelanto, setAdelanto] = useState(false)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [opciones, setOpciones] = useState<Opciones>({ estado: 'cargando' })
  const [vueltaOpciones, setVueltaOpciones] = useState(0)
  const [creada, setCreada] = useState<Creada | null>(null)

  // Turnstile, como en contacto: sólo con site key, y un token por envío.
  const siteKey = siteKeyTurnstile()
  const [captcha, setCaptcha] = useState<string | null>(null)
  const [vueltaCaptcha, setVueltaCaptcha] = useState(0)

  const creando = estado === 'creando'
  const errores: Partial<Record<CampoAlta, string>> = {}
  for (const p of [1, 2, 3] as Paso[]) if (intentados[p]) Object.assign(errores, erroresDelPaso(p, datos))

  // El color que se manda: el que eligió o, si no tocó nada, el del rubro.
  // Calculado y no copiado a un estado: cambiar de rubro mueve el recomendado
  // sin pisar una elección hecha a mano.
  const paletas = opciones.estado === 'listo' ? opciones.paletas : []
  const rubroActual = opciones.estado === 'listo' ? opciones.rubros.find((r) => r.rubro === datos.rubro) : undefined
  const sugerido = paletas.some((p) => p.clave === rubroActual?.temaClave) ? rubroActual!.temaClave : null
  const temaClave = temaElegido ?? sugerido

  const alias = slugAlias(datos.nombreNegocio)

  useEffect(() => {
    const control = new AbortController()
    setOpciones({ estado: 'cargando' })
    fetch(API_OPCIONES_URL, { signal: control.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((cuerpo: unknown) => {
        const { rubros, paletas } = leerOpciones(cuerpo)
        setOpciones(rubros.length ? { estado: 'listo', rubros, paletas } : { estado: 'error' })
      })
      .catch(() => {
        if (!control.signal.aborted) setOpciones({ estado: 'error' })
      })
    return () => control.abort()
  }, [vueltaOpciones])

  const cambiar = <K extends CampoAlta>(campo: K, valor: DatosAlta[K]) => {
    setDatos((d) => ({ ...d, [campo]: valor }))
  }

  /** Lleva la pantalla al principio de la tarjeta y el foco al título del paso. */
  const mostrarPaso = (p: Paso) => {
    // Después de pintar: hasta entonces el paso nuevo sigue oculto.
    requestAnimationFrame(() => {
      titulos.current[p]?.focus({ preventScroll: true })
      const arriba = tarjeta.current?.getBoundingClientRect().top ?? 0
      if (arriba < 0) tarjeta.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    })
  }

  const irAPaso = (p: Paso) => {
    setPaso(p)
    setAlcanzado((a) => (p > a ? p : a))
    setAviso(null)
    mostrarPaso(p)
  }

  /** Valida el paso actual; con errores, el foco va al primero. */
  const pasoValido = (p: Paso) => {
    setIntentados((i) => ({ ...i, [p]: true }))
    const problemas = erroresDelPaso(p, datos)
    const primero = CAMPOS_DEL_PASO[p].find((c) => problemas[c])
    if (primero) {
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus()
      return false
    }
    return true
  }

  const verLegal = (v: Vista) => {
    setVista(v)
    requestAnimationFrame(() => {
      tarjeta.current?.scrollIntoView({ block: 'start' })
      if (v !== 'asistente') volverLegal.current?.focus()
      else leerMas.current?.focus()
    })
  }

  const pedirOtroCaptcha = () => {
    if (!siteKey) return
    setCaptcha(null)
    setVueltaCaptcha((v) => v + 1)
  }

  const enviar = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (creando) return
    if (!pasoValido(paso)) {
      setAviso(null)
      return
    }
    if (paso < 3) {
      irAPaso((paso + 1) as Paso)
      return
    }
    // Por las dudas, todo junto: un paso anterior pudo quedar mal si volvió
    // atrás y lo cambió sin pasar por "Siguiente".
    const problemas = validarAlta(datos)
    const pasoConError = ([1, 2] as Paso[]).find((p) => CAMPOS_DEL_PASO[p].some((c) => problemas[c]))
    if (pasoConError) {
      setIntentados((i) => ({ ...i, [pasoConError]: true }))
      irAPaso(pasoConError)
      return
    }
    if (siteKey && !captcha) {
      setAviso({ texto: 'Completá la verificación anti-robots (el recuadro de arriba del botón) y volvé a intentar.' })
      return
    }

    setEstado('creando')
    setAviso(null)
    const trampa = new FormData(ev.currentTarget).get('web')
    try {
      const res = await fetch(API_ALTA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreNegocio: datos.nombreNegocio.trim(),
          rubro: datos.rubro,
          nombre: datos.nombre.trim(),
          whatsapp: normalizarWhatsApp(datos.whatsapp),
          password: datos.password,
          aceptaTerminos: true,
          ...(temaClave ? { temaClave } : {}),
          ...(siteKey && captcha ? { captcha } : {}),
          // Campo trampa: va oculto, así que sólo lo completa un bot.
          web: String(trampa ?? ''),
        }),
      })
      const cuerpo = (await res.json().catch(() => null)) as {
        codigo?: string
        codigoEntrada?: string
        alias?: string
        message?: string | string[]
      } | null

      if (res.status === 202) {
        // Pasó el tope del día (A3): quedó como interesado y lo contactamos.
        setEstado('espera')
        return
      }
      if (res.ok) {
        if (cuerpo?.codigoEntrada && cuerpo.alias) {
          // Sin saltar sola a la app (B3): primero ve con qué va a entrar la
          // próxima vez. El código vale 10 minutos (B4), tiempo de sobra.
          setCreada({ alias: cuerpo.alias, codigoEntrada: cuerpo.codigoEntrada, oculta: passwordOculta(datos.password) })
          // La contraseña no se queda en memoria más de lo necesario.
          setDatos((d) => ({ ...d, password: '' }))
          setEstado('listo')
        } else {
          // La cuenta quedó creada pero sin con qué entrar: mandarlo a
          // reintentar daría "ese WhatsApp ya tiene cuenta". Lo contactamos.
          setEstado('espera')
        }
        requestAnimationFrame(() => window.scrollTo({ top: 0 }))
        return
      }

      // Cualquier otro intento necesita un token nuevo: el backend gastó éste.
      pedirOtroCaptcha()
      setEstado('escribiendo')
      if (res.status === 409 && cuerpo?.codigo === 'WHATSAPP_YA_REGISTRADO') {
        setAviso({
          texto: 'Ese WhatsApp ya tiene una cuenta en BamarDev. Escribinos y te ayudamos a entrar.',
          whatsapp: 'Hola BamarDev, quise crear mi cuenta en la web pero mi WhatsApp ya tiene una cuenta.',
        })
      } else if (res.status === 400 && cuerpo?.codigo === 'COLOR_INVALIDO') {
        // Las paletas cambiaron mientras tenía la página abierta: vuelve al
        // recomendado del rubro, con la lista recién pedida, y lo deja verlo.
        setTemaElegido(null)
        setVueltaOpciones((v) => v + 1)
        setPaso(1)
        mostrarPaso(1)
        setAviso({ texto: 'Ese color ya no está disponible. Te dejamos el recomendado para tu rubro: revisalo y seguí.' })
      } else if (res.status === 400 && cuerpo?.codigo === 'CAPTCHA' && siteKey) {
        // Sin widget no hay arreglo en la página (ver Contacto): va al genérico.
        setAviso({ texto: 'No pudimos verificar que seas una persona. Resolvé la verificación de nuevo y volvé a intentar.' })
      } else if (res.status === 429) {
        setAviso({ texto: 'Hubo demasiados intentos desde tu conexión. Probá de nuevo en un rato.' })
      } else if (res.status === 400 && cuerpo?.message && cuerpo.codigo !== 'CAPTCHA') {
        // Lo que el backend no aceptó (class-validator manda una lista).
        const mensaje = Array.isArray(cuerpo.message) ? cuerpo.message.join(' ') : cuerpo.message
        setAviso({ texto: mensaje })
      } else {
        throw new Error(String(res.status))
      }
    } catch {
      pedirOtroCaptcha()
      setEstado('escribiendo')
      setAviso({
        texto: 'No pudimos crear tu cuenta. Revisá tu conexión y probá de nuevo, o escribinos por WhatsApp.',
        whatsapp: 'Hola BamarDev, quiero probar el plan Emprendedor y no pude crear mi cuenta en la web.',
      })
    }
  }

  const describir = (campo: CampoAlta, ayuda?: string) => {
    const ids = [ayuda, errores[campo] ? `${id}-${campo}-error` : null].filter(Boolean)
    return ids.length ? ids.join(' ') : undefined
  }

  const errorDe = (campo: CampoAlta) =>
    errores[campo] ? (
      <p id={`${id}-${campo}-error`} className="mt-1 text-sm text-rose-600">
        {errores[campo]}
      </p>
    ) : null

  const borde = (campo: CampoAlta) => (errores[campo] ? 'border-rose-400' : 'border-slate-300')

  /** El título de cada paso: recibe el foco al llegar, para el lector de pantalla. */
  const tituloPaso = (p: Paso, texto: string, bajada: string) => (
    <div>
      <h2
        ref={(el) => {
          titulos.current[p] = el
        }}
        tabIndex={-1}
        className="text-2xl font-extrabold tracking-tight text-slate-900 outline-none"
      >
        {texto}
      </h2>
      <p className="mt-1 text-slate-600">{bajada}</p>
    </div>
  )

  // Cada paso entra con un fundido corto desde abajo; con menos movimiento, sólo aparece.
  const clasePaso =
    'space-y-5 transition-[opacity,translate] duration-200 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none'

  return (
    <div
      ref={tarjeta}
      className="mx-auto w-full max-w-xl scroll-mt-4 rounded-3xl bg-white p-5 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8"
    >
      {estado === 'listo' && creada ? (
        <Listo creada={creada} />
      ) : estado === 'espera' ? (
        <div role="status" className="py-6 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            ¡Gracias, {datos.nombre.trim().split(' ')[0]}!
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Recibimos tus datos: te escribimos por WhatsApp hoy para activar tu cuenta.
          </p>
          <a
            href={linkWhatsApp(`Hola BamarDev, quiero activar mi prueba del plan Emprendedor para ${datos.nombreNegocio.trim()}.`)}
            target="_blank"
            rel="noreferrer"
            className={`mt-6 inline-flex items-center gap-2 ${PRIMARIO}`}
          >
            <WhatsAppIcon className="h-5 w-5" />
            {WHATSAPP_DISPLAY}
          </a>
          <div>
            <a href="/" className="mt-5 inline-block text-sm font-semibold text-slate-500 hover:text-slate-800">
              Volver al inicio
            </a>
          </div>
        </div>
      ) : (
        <>
          {vista !== 'asistente' && (
            <div>
              <button
                ref={volverLegal}
                type="button"
                onClick={() => verLegal('asistente')}
                className="text-sm font-bold text-brand-700 hover:text-brand-600"
              >
                ← Volver a crear mi cuenta
              </button>
              {/* Son borradores (A4): los marcadores entre corchetes quedan a la vista. */}
              <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <strong className="font-bold">Versión preliminar.</strong> Este documento está en revisión; los datos
                entre corchetes todavía no están completos.
              </p>
              <article className="mt-6 [&_h1]:text-2xl sm:[&_h1]:text-3xl">
                <Markdown texto={vista === 'terminos' ? terminos : privacidad} />
              </article>
              <button
                type="button"
                onClick={() => verLegal('asistente')}
                className="mt-8 w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-700"
              >
                Volver a crear mi cuenta
              </button>
            </div>
          )}

          {/* El asistente sigue montado mientras se leen los términos: así no
              se pierde lo escrito ni el token del captcha. */}
          <div hidden={vista !== 'asistente'}>
            <Progreso paso={paso} />

            <form ref={form} onSubmit={enviar} noValidate className="mt-7">
              {/* Campo trampa: oculto para personas, visible para bots que rellenan todo. */}
              <input
                type="text"
                name="web"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div hidden={paso !== 1} className={clasePaso}>
                {tituloPaso(1, 'Tu negocio', 'Con esto armamos tu sistema.')}

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Nombre del negocio</span>
                  <input
                    name="nombreNegocio"
                    value={datos.nombreNegocio}
                    onChange={(e) => cambiar('nombreNegocio', e.target.value)}
                    maxLength={80}
                    autoComplete="organization"
                    placeholder="Billar Los Pinos"
                    aria-invalid={!!errores.nombreNegocio}
                    aria-describedby={describir('nombreNegocio', `${id}-alias`)}
                    className={`${INPUT} ${borde('nombreNegocio')}`}
                  />
                  {errorDe('nombreNegocio')}
                  {/* B3: el código con el que va a entrar, mientras escribe. */}
                  <span id={`${id}-alias`} className="mt-2 block rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
                    {datos.nombreNegocio.trim() ? (
                      <>
                        Vas a entrar con el código{' '}
                        <strong className="break-all font-extrabold text-slate-900">{alias}</strong>
                      </>
                    ) : (
                      'Del nombre sale el código con el que vas a entrar.'
                    )}
                    <span className="mt-0.5 block text-xs text-slate-500">Si ya existe, le agregamos un número.</span>
                  </span>
                </label>

                <div>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Rubro</span>
                    <select
                      name="rubro"
                      value={datos.rubro}
                      onChange={(e) => cambiar('rubro', e.target.value)}
                      disabled={opciones.estado !== 'listo'}
                      aria-invalid={!!errores.rubro}
                      aria-describedby={describir('rubro')}
                      // El color del texto va aparte: sin elegir se ve gris, como un placeholder.
                      className={`${INPUT} ${borde('rubro')} ${datos.rubro ? '' : 'text-slate-400'}`}
                    >
                      <option value="" disabled>
                        {opciones.estado === 'cargando' ? 'Cargando rubros…' : '¿Qué tipo de negocio tenés?'}
                      </option>
                      {opciones.estado === 'listo' &&
                        opciones.rubros.map((r) => (
                          <option key={r.rubro} value={r.rubro} className="text-slate-900">
                            {r.nombre}
                          </option>
                        ))}
                    </select>
                  </label>
                  {errorDe('rubro')}
                  {opciones.estado === 'error' && (
                    <p role="alert" className="mt-1 text-sm text-rose-600">
                      No pudimos cargar los rubros.{' '}
                      <button
                        type="button"
                        onClick={() => setVueltaOpciones((v) => v + 1)}
                        className="font-bold underline underline-offset-2"
                      >
                        Reintentar
                      </button>
                    </p>
                  )}
                </div>

                {/* Sin paletas publicadas no hay qué elegir: el backend usa la del rubro. */}
                {paletas.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <SelectorColor
                      paletas={paletas}
                      valor={temaClave}
                      sugerido={sugerido}
                      onElegir={setTemaElegido}
                      deshabilitado={creando}
                    />
                    <span className="text-xs text-slate-500">
                      {temaElegido && temaElegido !== sugerido
                        ? 'El color de tu sistema.'
                        : 'Arranca con el recomendado para tu rubro.'}
                    </span>
                  </div>
                )}
              </div>

              {alcanzado >= 2 && (
                <div hidden={paso !== 2} className={clasePaso}>
                  {tituloPaso(2, 'Tus datos', 'Para saber con quién hablamos si necesitás ayuda.')}

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Tu nombre</span>
                    <input
                      name="nombre"
                      value={datos.nombre}
                      onChange={(e) => cambiar('nombre', e.target.value)}
                      maxLength={80}
                      autoComplete="name"
                      placeholder="Juan Pérez"
                      aria-invalid={!!errores.nombre}
                      aria-describedby={describir('nombre')}
                      className={`${INPUT} ${borde('nombre')}`}
                    />
                    {errorDe('nombre')}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">WhatsApp</span>
                    <input
                      name="whatsapp"
                      type="tel"
                      inputMode="tel"
                      value={datos.whatsapp}
                      onChange={(e) => cambiar('whatsapp', e.target.value)}
                      maxLength={20}
                      autoComplete="tel"
                      placeholder="71234567"
                      aria-invalid={!!errores.whatsapp}
                      aria-describedby={describir('whatsapp', `${id}-whatsapp-ayuda`)}
                      className={`${INPUT} ${borde('whatsapp')}`}
                    />
                    <span id={`${id}-whatsapp-ayuda`} className="mt-1 block text-xs text-slate-500">
                      Celular de Bolivia. Por acá te ayudamos si lo necesitás.
                    </span>
                    {errorDe('whatsapp')}
                  </label>
                </div>
              )}

              {alcanzado >= 3 && (
                <div hidden={paso !== 3} className={clasePaso}>
                  {tituloPaso(3, 'Tu acceso', 'La contraseña con la que vas a entrar.')}

                  <div>
                    <label htmlFor={`${id}-password`} className="text-sm font-semibold text-slate-700">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id={`${id}-password`}
                        name="password"
                        type={verPassword ? 'text' : 'password'}
                        value={datos.password}
                        onChange={(e) => cambiar('password', e.target.value)}
                        maxLength={72}
                        autoComplete="new-password"
                        placeholder="Al menos 8 caracteres"
                        aria-invalid={!!errores.password}
                        aria-describedby={describir('password', `${id}-password-ayuda`)}
                        className={`${INPUT} ${borde('password')} pr-14`}
                      />
                      <button
                        type="button"
                        onClick={() => setVerPassword((v) => !v)}
                        aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        aria-pressed={verPassword}
                        className="absolute right-1.5 top-1/2 mt-0.5 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                      >
                        <Ojo tachado={verPassword} />
                      </button>
                    </div>
                    <span id={`${id}-password-ayuda`} className="mt-1 block text-xs text-slate-500">
                      Vas a entrar con el usuario <strong className="font-semibold text-slate-700">admin</strong> y esta
                      contraseña.
                    </span>
                    {errorDe('password')}
                  </div>

                  <div>
                    <div className="flex items-start gap-3">
                      <input
                        id={`${id}-acepta`}
                        name="aceptaTerminos"
                        type="checkbox"
                        checked={datos.aceptaTerminos}
                        onChange={(e) => cambiar('aceptaTerminos', e.target.checked)}
                        aria-invalid={!!errores.aceptaTerminos}
                        aria-describedby={describir('aceptaTerminos')}
                        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-brand-600"
                      />
                      <div className="text-sm leading-relaxed text-slate-700">
                        <label htmlFor={`${id}-acepta`} className="cursor-pointer">
                          Acepto los términos y la política de privacidad.
                        </label>{' '}
                        <button
                          ref={leerMas}
                          type="button"
                          onClick={() => setAdelanto((v) => !v)}
                          aria-expanded={adelanto}
                          aria-controls={`${id}-adelanto`}
                          className="font-bold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-600"
                        >
                          {adelanto ? 'Leer menos' : 'Leer más'}
                        </button>
                      </div>
                    </div>
                    {errorDe('aceptaTerminos')}
                    {adelanto && (
                      <div id={`${id}-adelanto`} className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                        {adelantoLegal(terminos).map((b, i) =>
                          b.titulo ? (
                            <p key={i} className={`font-bold text-slate-900 ${i ? 'mt-3' : ''}`}>
                              {b.texto}
                            </p>
                          ) : (
                            <p key={i} className={`leading-relaxed text-slate-600 ${i ? 'mt-1' : ''}`}>
                              {b.texto}
                            </p>
                          ),
                        )}
                        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-bold">
                          <button type="button" onClick={() => verLegal('terminos')} className="text-brand-700 hover:text-brand-600">
                            Ver completo →
                          </button>
                          <button type="button" onClick={() => verLegal('privacidad')} className="text-brand-700 hover:text-brand-600">
                            Política de privacidad →
                          </button>
                        </p>
                      </div>
                    )}
                  </div>

                  {siteKey && <Captcha key={vueltaCaptcha} siteKey={siteKey} onToken={setCaptcha} tema="light" />}
                </div>
              )}

              {/* role="alert": el lector de pantalla lo anuncia al aparecer. */}
              {aviso && (
                <p role="alert" className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {aviso.texto}
                  {aviso.whatsapp && (
                    <>
                      {' '}
                      <a
                        href={linkWhatsApp(aviso.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-rose-800 underline underline-offset-2"
                      >
                        WhatsApp {WHATSAPP_DISPLAY}
                      </a>
                    </>
                  )}
                </p>
              )}

              <div className="mt-7 flex items-center gap-3">
                {paso > 1 && (
                  <button
                    type="button"
                    onClick={() => irAPaso((paso - 1) as Paso)}
                    disabled={creando}
                    className="rounded-full px-5 py-3.5 text-base font-bold text-slate-600 transition-[background-color,color,transform] duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.97] disabled:opacity-50"
                  >
                    Atrás
                  </button>
                )}
                <button type="submit" disabled={creando} className={`flex-1 ${PRIMARIO}`}>
                  {paso < 3 ? 'Siguiente' : creando ? 'Creando tu cuenta…' : 'Crear mi cuenta'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

/** El indicador de los 3 pasos: barra por paso, número y nombre. */
function Progreso({ paso }: { paso: Paso }) {
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label={`Paso ${paso} de 3`}>
      {PASOS.map(({ paso: p, titulo }) => {
        const hecho = p < paso
        const actual = p === paso
        return (
          <li key={p} aria-current={actual ? 'step' : undefined}>
            <span className="block h-1.5 overflow-hidden rounded-full bg-slate-200">
              <span
                className={`block h-full origin-left rounded-full bg-brand-500 transition-transform duration-300 ease-out motion-reduce:transition-none ${
                  hecho || actual ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </span>
            <span
              className={`mt-2 flex items-center gap-1.5 text-xs font-bold sm:text-sm ${
                actual ? 'text-slate-900' : hecho ? 'text-brand-700' : 'text-slate-400'
              }`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] ${
                  hecho ? 'bg-brand-500 text-white' : actual ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                }`}
                aria-hidden
              >
                {hecho ? '✓' : p}
              </span>
              <span className="truncate">{titulo}</span>
              {hecho && <span className="sr-only">(listo)</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Copia al portapapeles; sin permiso (o en http), con el truco del textarea. */
async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = texto
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    area.remove()
    return ok
  }
}

/** La confirmación (B3): los datos para la próxima vez y la puerta a la app. */
function Listo({ creada }: { creada: Creada }) {
  const titulo = useRef<HTMLHeadingElement>(null)
  const [copiado, setCopiado] = useState<'codigo' | 'datos' | null>(null)
  const temporizador = useRef<number | undefined>(undefined)

  // El foco al título: si no, queda en el botón que ya no existe.
  useEffect(() => {
    titulo.current?.focus()
    return () => window.clearTimeout(temporizador.current)
  }, [])

  const copiar = async (que: 'codigo' | 'datos') => {
    // Los datos, sin la contraseña: el texto copiado termina en chats y notas.
    const texto =
      que === 'codigo'
        ? creada.alias
        : `Mi sistema BamarDev\nDirección: ${APP_URL}\nCódigo del negocio: ${creada.alias}\nUsuario: admin`
    if (await copiarTexto(texto)) {
      setCopiado(que)
      window.clearTimeout(temporizador.current)
      temporizador.current = window.setTimeout(() => setCopiado(null), 2000)
    }
  }

  return (
    <div className="transition-[opacity,translate] duration-300 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-600 transition-[scale] duration-300 ease-out starting:scale-90">
        <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <h2 ref={titulo} tabIndex={-1} className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 outline-none">
        ¡Tu sistema está listo!
      </h2>
      <p className="mt-2 text-slate-600">
        Guardá estos datos: los vas a usar para entrar desde cualquier celular o compu.
      </p>

      <dl className="mt-6 divide-y divide-slate-200 rounded-2xl bg-slate-50 ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <div className="min-w-0">
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Código del negocio</dt>
            <dd className="mt-0.5 break-all text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {creada.alias}
            </dd>
          </div>
          <button
            type="button"
            onClick={() => copiar('codigo')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-[border-color,color,transform] duration-150 hover:border-brand-500 hover:text-brand-700 active:scale-[0.97]"
          >
            <IconoCopiar hecho={copiado === 'codigo'} />
            {copiado === 'codigo' ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <Dato titulo="Usuario">admin</Dato>
        <Dato titulo="Contraseña">
          <span className="tracking-wider">{creada.oculta}</span>
          <span className="sr-only"> (sólo se muestran los últimos 3 caracteres)</span>
        </Dato>
        <Dato titulo="Dirección">{APP_HOST}</Dato>
      </dl>

      <a
        href={urlEntrar(creada.alias, creada.codigoEntrada)}
        className={`mt-6 flex w-full items-center justify-center gap-2 py-4 text-lg ${PRIMARIO}`}
      >
        Abrir mi sistema
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 01.75-.75h10.64l-3.95-3.95a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06l3.95-3.95H3.75A.75.75 0 013 10z"
            clipRule="evenodd"
          />
        </svg>
      </a>
      <button
        type="button"
        onClick={() => copiar('datos')}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-[border-color,color,transform] duration-150 hover:border-brand-500 hover:text-brand-700 active:scale-[0.97]"
      >
        <IconoCopiar hecho={copiado === 'datos'} />
        {copiado === 'datos' ? 'Datos copiados' : 'Copiar mis datos'}
      </button>
      <p role="status" className="sr-only">
        {copiado === 'codigo' ? 'Código copiado.' : copiado === 'datos' ? 'Datos copiados, sin la contraseña.' : ''}
      </p>
      <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
        «Abrir mi sistema» te deja entrar sin escribir nada durante 10 minutos. Después, entrás con estos datos. La
        contraseña no la copiamos: anotala vos.
      </p>
    </div>
  )
}

function Dato({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-4 py-3">
      <dt className="text-sm font-semibold text-slate-500">{titulo}</dt>
      <dd className="text-right text-base font-bold text-slate-900">{children}</dd>
    </div>
  )
}

function IconoCopiar({ hecho }: { hecho: boolean }) {
  return hecho ? (
    <svg className="h-4 w-4 text-brand-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
        clipRule="evenodd"
      />
    </svg>
  ) : (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path strokeLinecap="round" d="M5 15V6a2 2 0 012-2h9" />
    </svg>
  )
}

function Ojo({ tachado }: { tachado: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.04 12.32a1 1 0 010-.64C3.42 7.51 7.36 4.5 12 4.5c4.64 0 8.57 3 9.96 7.18a1 1 0 010 .64C20.58 16.49 16.64 19.5 12 19.5c-4.64 0-8.57-3-9.96-7.18z" />
      <circle cx="12" cy="12" r="3" />
      {tachado && <path strokeLinecap="round" d="M4 4l16 16" />}
    </svg>
  )
}
