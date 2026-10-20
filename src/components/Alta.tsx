import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { WHATSAPP_DISPLAY, linkWhatsApp } from '../data/planes'
import { siteKeyTurnstile } from '../lib/turnstile'
import {
  API_ALTA_URL,
  API_RUBROS_URL,
  adelantoLegal,
  normalizarWhatsApp,
  rubrosDisponibles,
  urlEntrar,
  validarAlta,
  type CampoAlta,
  type DatosAlta,
  type RubroApi,
} from '../lib/alta'
import { Markdown } from '../legal/Markdown'
import terminos from '../legal/TERMINOS-DE-SERVICIO.md?raw'
import privacidad from '../legal/POLITICA-DE-PRIVACIDAD.md?raw'
import { Captcha } from './Captcha'
import { WhatsAppIcon } from './ui'

/**
 * La prueba de 7 días del Emprendedor (PLAN-ALTA-LANDING): el visitante crea
 * su cuenta solo y entra a la app web con la sesión ya abierta. Lo abren el
 * hero y la tarjeta del Emprendedor; los otros planes siguen yendo a contacto
 * (A1).
 *
 * El diálogo es un <dialog> nativo con showModal(): el navegador ya encierra
 * el foco adentro, deja inerte el resto de la página y cierra con Escape.
 */

const AbrirAlta = createContext<() => void>(() => {})

/** Abre el formulario del alta. Fuera del proveedor no hace nada. */
export function useAbrirAlta() {
  return useContext(AbrirAlta)
}

export function AltaProvider({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false)
  const abrir = useCallback(() => setAbierto(true), [])
  // Se monta sólo abierto: así el script de Turnstile y el pedido de rubros
  // esperan a que alguien quiera probar, en vez de cargar con la página.
  return (
    <AbrirAlta.Provider value={abrir}>
      {children}
      {abierto && <DialogoAlta onCerrar={() => setAbierto(false)} />}
    </AbrirAlta.Provider>
  )
}

type Vista = 'formulario' | 'terminos' | 'privacidad'
type Estado = 'escribiendo' | 'creando' | 'entrando' | 'espera'
type Rubros = { estado: 'cargando' } | { estado: 'error' } | { estado: 'listo'; lista: RubroApi[] }

/** Un aviso arriba del botón. `whatsapp` agrega el enlace con ese mensaje. */
interface Aviso {
  texto: string
  whatsapp?: string
}

const VACIO: DatosAlta = {
  nombreNegocio: '',
  rubro: '',
  nombre: '',
  whatsapp: '',
  password: '',
  aceptaTerminos: false,
}

// El orden de la pantalla: al mandar con errores, el foco va al primero.
const ORDEN: CampoAlta[] = ['nombreNegocio', 'rubro', 'nombre', 'whatsapp', 'password', 'aceptaTerminos']

const INPUT =
  'mt-1 w-full rounded-xl border bg-white px-4 py-3 text-base placeholder-slate-400 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 disabled:bg-slate-50'

function DialogoAlta({ onCerrar }: { onCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const form = useRef<HTMLFormElement>(null)
  const volverLegal = useRef<HTMLButtonElement>(null)
  const leerMas = useRef<HTMLButtonElement>(null)
  const id = useId()

  const [vista, setVista] = useState<Vista>('formulario')
  const [estado, setEstado] = useState<Estado>('escribiendo')
  const [datos, setDatos] = useState<DatosAlta>(VACIO)
  // Los errores por campo se muestran recién al intentar mandar: marcar en
  // rojo un campo que todavía no se terminó de escribir sólo molesta.
  const [intentado, setIntentado] = useState(false)
  const [verPassword, setVerPassword] = useState(false)
  const [adelanto, setAdelanto] = useState(false)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [rubros, setRubros] = useState<Rubros>({ estado: 'cargando' })
  const [vueltaRubros, setVueltaRubros] = useState(0)
  const [codigoEntrada, setCodigoEntrada] = useState<string | null>(null)

  // Turnstile, como en contacto: sólo con site key, y un token por envío.
  const siteKey = siteKeyTurnstile()
  const [captcha, setCaptcha] = useState<string | null>(null)
  const [vueltaCaptcha, setVueltaCaptcha] = useState(0)

  const errores = intentado ? validarAlta(datos) : {}
  const creando = estado === 'creando'

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (!d.open) d.showModal()
    // Sin esto la página de atrás se sigue desplazando con el dedo en móvil.
    const html = document.documentElement
    const antes = html.style.overflow
    html.style.overflow = 'hidden'
    // Sin close() acá: dispararía `close` → onCerrar, y en StrictMode (que
    // monta, desmonta y vuelve a montar) el diálogo se cerraba solo al abrir.
    // Al desmontarse, el <dialog> sale del DOM y con él de la capa superior.
    return () => {
      html.style.overflow = antes
    }
  }, [])

  useEffect(() => {
    const control = new AbortController()
    setRubros({ estado: 'cargando' })
    fetch(API_RUBROS_URL, { signal: control.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((lista: unknown) => {
        const disponibles = rubrosDisponibles(lista)
        setRubros(disponibles.length ? { estado: 'listo', lista: disponibles } : { estado: 'error' })
      })
      .catch(() => {
        if (!control.signal.aborted) setRubros({ estado: 'error' })
      })
    return () => control.abort()
  }, [vueltaRubros])

  // Al cambiar entre el formulario y un texto legal, el diálogo vuelve arriba
  // y el foco va a donde sigue la lectura (si no, queda en un botón oculto).
  useEffect(() => {
    dialogo.current?.scrollTo({ top: 0 })
    if (vista !== 'formulario') volverLegal.current?.focus()
  }, [vista])

  const cambiar = <K extends CampoAlta>(campo: K, valor: DatosAlta[K]) => {
    setDatos((d) => ({ ...d, [campo]: valor }))
  }

  const volverAlFormulario = () => {
    setVista('formulario')
    // Después de pintar: hasta entonces el formulario sigue oculto.
    requestAnimationFrame(() => leerMas.current?.focus())
  }

  const pedirOtroCaptcha = () => {
    if (!siteKey) return
    setCaptcha(null)
    setVueltaCaptcha((v) => v + 1)
  }

  const enviar = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (creando) return
    setIntentado(true)
    const problemas = validarAlta(datos)
    const primero = ORDEN.find((c) => problemas[c])
    if (primero) {
      setAviso(null)
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus()
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
          ...(siteKey && captcha ? { captcha } : {}),
          // Campo trampa: va oculto, así que sólo lo completa un bot.
          web: String(trampa ?? ''),
        }),
      })
      const cuerpo = (await res.json().catch(() => null)) as {
        codigo?: string
        codigoEntrada?: string
        message?: string | string[]
      } | null

      if (res.status === 202) {
        // Pasó el tope del día (A3): quedó como interesado y lo contactamos.
        setEstado('espera')
        return
      }
      if (res.ok) {
        if (cuerpo?.codigoEntrada) {
          // El código vence a los 60 segundos: se salta ya, sin pantallas en el medio.
          setCodigoEntrada(cuerpo.codigoEntrada)
          setEstado('entrando')
          window.location.href = urlEntrar(cuerpo.codigoEntrada)
        } else {
          // La cuenta quedó creada pero sin con qué entrar: mandarlo a
          // reintentar daría "ese WhatsApp ya tiene cuenta". Lo contactamos.
          setEstado('espera')
        }
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

  // El color del texto va aparte: el select sin elegir lo muestra gris, como un placeholder.
  const borde = (campo: CampoAlta) => (errores[campo] ? 'border-rose-400' : 'border-slate-300')

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={`${id}-titulo`}
      // Escape cierra, salvo mientras se crea la cuenta: cerrar a mitad dejaría
      // al visitante sin saber si quedó creada.
      onCancel={(e) => {
        if (creando || estado === 'entrando') e.preventDefault()
      }}
      onClose={onCerrar}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-white text-slate-900 transition-[opacity,translate] duration-200 backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm starting:translate-y-4 starting:opacity-0 motion-reduce:transition-none sm:m-auto sm:h-auto sm:max-h-[92dvh] sm:max-w-lg sm:rounded-3xl sm:shadow-2xl"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:px-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-brand-600">Plan Emprendedor · 7 días gratis</p>
        <button
          type="button"
          onClick={() => dialogo.current?.close()}
          disabled={creando || estado === 'entrando'}
          aria-label="Cerrar"
          className="-mr-2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      <div className="px-5 pb-8 pt-6 sm:px-8">
        {estado === 'entrando' ? (
          <div role="status" className="py-10 text-center">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" aria-hidden />
            <h2 id={`${id}-titulo`} className="mt-6 text-2xl font-extrabold tracking-tight">
              ¡Tu cuenta está lista!
            </h2>
            <p className="mt-2 text-slate-600">Te llevamos a tu sistema…</p>
            {codigoEntrada && (
              <a href={urlEntrar(codigoEntrada)} className="mt-4 inline-block text-sm font-bold text-brand-700 underline underline-offset-2">
                Si no se abre solo, tocá acá
              </a>
            )}
          </div>
        ) : estado === 'espera' ? (
          <div role="status" className="py-6 text-center">
            <h2 id={`${id}-titulo`} className="text-2xl font-extrabold tracking-tight">
              ¡Gracias, {datos.nombre.trim().split(' ')[0]}!
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Recibimos tus datos: te escribimos por WhatsApp hoy para activar tu cuenta.
            </p>
            <a
              href={linkWhatsApp(`Hola BamarDev, quiero activar mi prueba del plan Emprendedor para ${datos.nombreNegocio.trim()}.`)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-bold text-white transition hover:bg-brand-500"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {WHATSAPP_DISPLAY}
            </a>
            <div>
              <button
                type="button"
                onClick={() => dialogo.current?.close()}
                className="mt-4 text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <>
            {vista !== 'formulario' && (
              <div>
                <button
                  ref={volverLegal}
                  type="button"
                  onClick={volverAlFormulario}
                  className="text-sm font-bold text-brand-700 hover:text-brand-600"
                >
                  ← Volver al formulario
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
                  onClick={volverAlFormulario}
                  className="mt-8 w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-700"
                >
                  Volver al formulario
                </button>
              </div>
            )}

            {/* El formulario sigue montado mientras se leen los términos: así no
                se pierde lo escrito ni el token del captcha. */}
            <div hidden={vista !== 'formulario'}>
              <h2 id={`${id}-titulo`} className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Probá BamarDev 7 días gratis
              </h2>
              <p className="mt-2 text-slate-600">
                Creás tu cuenta ahora y empezás a vender hoy, sin pagar nada por adelantado. Si te sirve, al terminar la
                prueba pagás con QR desde el mismo sistema.
              </p>

              <form ref={form} onSubmit={enviar} noValidate className="mt-6 space-y-4">
                {/* Campo trampa: oculto para personas, visible para bots que rellenan todo. */}
                <input
                  type="text"
                  name="web"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

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
                    aria-describedby={describir('nombreNegocio')}
                    className={`${INPUT} text-slate-900 ${borde('nombreNegocio')}`}
                  />
                  {errorDe('nombreNegocio')}
                </label>

                <div>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Rubro</span>
                    <select
                      name="rubro"
                      value={datos.rubro}
                      onChange={(e) => cambiar('rubro', e.target.value)}
                      disabled={rubros.estado !== 'listo'}
                      aria-invalid={!!errores.rubro}
                      aria-describedby={describir('rubro')}
                      className={`${INPUT} ${borde('rubro')} ${datos.rubro ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                      <option value="" disabled>
                        {rubros.estado === 'cargando' ? 'Cargando rubros…' : '¿Qué tipo de negocio tenés?'}
                      </option>
                      {rubros.estado === 'listo' &&
                        rubros.lista.map((r) => (
                          <option key={r.rubro} value={r.rubro} className="text-slate-900">
                            {r.nombre}
                          </option>
                        ))}
                    </select>
                  </label>
                  {errorDe('rubro')}
                  {rubros.estado === 'error' && (
                    <p role="alert" className="mt-1 text-sm text-rose-600">
                      No pudimos cargar los rubros.{' '}
                      <button
                        type="button"
                        onClick={() => setVueltaRubros((v) => v + 1)}
                        className="font-bold underline underline-offset-2"
                      >
                        Reintentar
                      </button>
                    </p>
                  )}
                </div>

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
                    className={`${INPUT} text-slate-900 ${borde('nombre')}`}
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
                    className={`${INPUT} text-slate-900 ${borde('whatsapp')}`}
                  />
                  <span id={`${id}-whatsapp-ayuda`} className="mt-1 block text-xs text-slate-500">
                    Celular de Bolivia. Por acá te ayudamos si lo necesitás.
                  </span>
                  {errorDe('whatsapp')}
                </label>

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
                      className={`${INPUT} text-slate-900 ${borde('password')} pr-14`}
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
                        <button type="button" onClick={() => setVista('terminos')} className="text-brand-700 hover:text-brand-600">
                          Ver completo →
                        </button>
                        <button type="button" onClick={() => setVista('privacidad')} className="text-brand-700 hover:text-brand-600">
                          Política de privacidad →
                        </button>
                      </p>
                    </div>
                  )}
                </div>

                {siteKey && <Captcha key={vueltaCaptcha} siteKey={siteKey} onToken={setCaptcha} tema="light" />}

                {/* role="alert": el lector de pantalla lo anuncia al aparecer. */}
                {aviso && (
                  <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
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

                <button
                  type="submit"
                  disabled={creando}
                  className="w-full rounded-full bg-brand-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-500/30 transition hover:bg-brand-500 disabled:opacity-60"
                >
                  {creando ? 'Creando…' : 'Crear mi cuenta'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </dialog>
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
