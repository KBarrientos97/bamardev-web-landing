import { useState, type FormEvent } from 'react'
import { WHATSAPP_DISPLAY, linkWhatsApp } from '../data/planes'
import { WhatsAppIcon } from './ui'
import { Captcha } from './Captcha'
import { siteKeyTurnstile } from '../lib/turnstile'

/**
 * El formulario escribe en el CRM del panel. Antes todo iba a WhatsApp: si
 * nadie contestaba a tiempo o se perdía el chat, ese interesado no quedaba
 * registrado en ningún lado.
 *
 * WhatsApp sigue estando como alternativa: hay gente que prefiere escribir
 * directo, y no hay razón para obligarla a llenar un formulario.
 */
// El API del ambiente, como la encuesta: la landing de QA escribe en el CRM
// de QA (y valida su captcha allá), no en el de producción. En dev queda
// `/api` y el proxy de Vite lo manda a QA.
const API_LEADS_URL = `${import.meta.env.VITE_API_URL || '/api'}/leads`

// Los textos viajan tal cual: el backend los valida contra su propia lista
// (bamardev-backend/src/leads/dto/crear-lead.dto.ts). Uno que no esté allá
// hace fallar el envío entero.
// Primero los disponibles (PerfilRubro DISPONIBLE), después los de belleza
// (EN_DESARROLLO), que se ofrecen igual para juntar interesados.
const RUBROS = [
  'Restaurante',
  'Farmacia',
  'Minimarket',
  'Ferretería',
  'Repuestos',
  'Peluquería',
  'Barbería',
  'Spa',
  'Uñas',
  'Otro',
]

/** Estilo común de los campos del formulario (compacto: py-2.5, texto chico). */
const CAMPO =
  'mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:border-brand-400'

type Estado = 'escribiendo' | 'enviando' | 'listo' | 'error'

export function Contacto({ planInteres }: { planInteres?: string }) {
  const [estado, setEstado] = useState<Estado>('escribiendo')
  const [error, setError] = useState('')
  // Email y mensaje van plegados: lo esencial (nombre, WhatsApp y rubro) basta para llamar.
  const [mas, setMas] = useState(false)
  // Turnstile, sólo si el build trae la site key. `vueltaCaptcha` remonta el
  // widget para pedir otro token: el backend gasta el anterior en cada envío.
  const siteKey = siteKeyTurnstile()
  const [captcha, setCaptcha] = useState<string | null>(null)
  const [vueltaCaptcha, setVueltaCaptcha] = useState(0)

  const enviar = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const datos = new FormData(ev.currentTarget)

    const telefono = String(datos.get('telefono') ?? '').trim()
    const email = String(datos.get('email') ?? '').trim()
    if (!telefono && !email) {
      setError(mas ? 'Dejanos un WhatsApp o un email para poder contactarte.' : 'Dejanos tu WhatsApp para poder contactarte.')
      setEstado('error')
      return
    }
    if (siteKey && !captcha) {
      setError('Completá la verificación anti-robots (el recuadro de arriba del botón) y volvé a enviar.')
      setEstado('error')
      return
    }

    setEstado('enviando')
    setError('')
    // Un token por envío: después de un intento fallido (también si la red se
    // cortó con el pedido ya en el servidor) el siguiente necesita otro.
    const pedirOtroCaptcha = () => {
      if (!siteKey) return
      setCaptcha(null)
      setVueltaCaptcha((v) => v + 1)
    }
    try {
      const res = await fetch(API_LEADS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: String(datos.get('nombre') ?? '').trim(),
          telefono: telefono || undefined,
          email: email || undefined,
          rubro: String(datos.get('rubro') ?? '') || undefined,
          mensaje: String(datos.get('mensaje') ?? '').trim() || undefined,
          planInteres,
          // Honeypot: va oculto, así que sólo lo completa un bot.
          web: String(datos.get('web') ?? ''),
          ...(siteKey && captcha ? { captcha } : {}),
        }),
      })
      if (res.ok) {
        setEstado('listo')
        return
      }
      // El 400 CAPTCHA tiene arreglo en la página (resolverlo de nuevo): se
      // muestra el mensaje del backend en vez de mandar a WhatsApp. Sólo si
      // hay widget: un build sin site key contra un backend que exige captcha
      // no tiene arreglo acá, y "volvé a intentar" dejaría al visitante
      // reintentando para siempre. Ahí va al mensaje de WhatsApp.
      const cuerpo = (await res.json().catch(() => null)) as { codigo?: string; message?: string } | null
      if (siteKey && cuerpo?.codigo === 'CAPTCHA') {
        pedirOtroCaptcha()
        setError(cuerpo.message || 'No pudimos verificar que seas una persona. Volvé a intentar.')
        setEstado('error')
        return
      }
      throw new Error(String(res.status))
    } catch {
      pedirOtroCaptcha()
      // Si la API no responde, no se pierde el contacto: se ofrece WhatsApp.
      setError('No pudimos enviar el formulario. Escribinos por WhatsApp y te respondemos igual.')
      setEstado('error')
    }
  }

  if (estado === 'listo') {
    return (
      <div className="rounded-2xl bg-white/10 px-6 py-8 text-center backdrop-blur">
        <p className="text-lg font-bold text-white">¡Gracias! Recibimos tus datos.</p>
        <p className="mt-2 text-slate-300">
          Te contactamos dentro de las próximas horas. Si preferís, escribinos ahora:
        </p>
        <a
          href={linkWhatsApp('Hola BamarDev, acabo de dejar mis datos en la web.')}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-bold text-white transition hover:bg-brand-400"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {WHATSAPP_DISPLAY}
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="mx-auto w-full max-w-md text-left lg:max-w-none">
      {/* Honeypot: oculto para personas, visible para bots que rellenan todo. */}
      <input
        type="text"
        name="web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-2.5 sm:grid-cols-2">
        <label>
          <span className="text-xs font-medium text-slate-300">Tu nombre *</span>
          <input
            name="nombre"
            required
            minLength={2}
            maxLength={120}
            className={CAMPO}
            placeholder="Juan Pérez"
          />
        </label>

        <label>
          <span className="text-xs font-medium text-slate-300">WhatsApp {mas ? '' : '*'}</span>
          <input
            name="telefono"
            inputMode="tel"
            required={!mas}
            maxLength={30}
            className={CAMPO}
            placeholder="700 00000"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-xs font-medium text-slate-300">¿Qué tipo de negocio tenés?</span>
          <select name="rubro" defaultValue="Restaurante" className={CAMPO}>
            {RUBROS.map((r) => (
              <option key={r} value={r} className="bg-slate-900">
                {r}
              </option>
            ))}
          </select>
        </label>

        {/* Opcionales, plegados: el formulario se ve corto y quien quiera detallar lo abre. */}
        {mas ? (
          <>
            <label className="sm:col-span-2">
              <span className="text-xs font-medium text-slate-300">Email</span>
              <input name="email" type="email" maxLength={120} className={CAMPO} placeholder="juan@ejemplo.com" />
            </label>
            <label className="sm:col-span-2">
              <span className="text-xs font-medium text-slate-300">Contanos qué necesitás</span>
              <textarea
                name="mensaje"
                rows={2}
                maxLength={1000}
                className={CAMPO}
                placeholder="Tengo un restaurante y quiero controlar el stock…"
              />
            </label>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setMas(true)}
            className="sm:col-span-2 text-left text-xs font-semibold text-brand-300 underline-offset-2 hover:underline"
          >
            + Agregar email o un mensaje (opcional)
          </button>
        )}
      </div>

      {siteKey && <Captcha key={vueltaCaptcha} siteKey={siteKey} onToken={setCaptcha} />}

      {/* role="alert": el lector de pantalla lo anuncia al aparecer; si no,
          quien no ve el formulario no se entera de por qué no se envió. */}
      {error && (
        <p role="alert" className="mt-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="mt-3 w-full rounded-full bg-brand-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400 disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Enviando…' : 'Quiero que me contacten'}
      </button>
    </form>
  )
}
