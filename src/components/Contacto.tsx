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
const API_LEADS_URL = 'https://api.bamardev.com/api/leads'

// Los textos viajan tal cual: el backend los valida contra su propia lista
// (bamardev-backend/src/leads/dto/crear-lead.dto.ts). Uno que no esté allá
// hace fallar el envío entero.
const RUBROS = [
  'Restaurante',
  'Farmacia',
  'Ferretería',
  'Minimarket',
  'Peluquería',
  'Barbería',
  'Spa',
  'Uñas',
  'Otro',
]

type Estado = 'escribiendo' | 'enviando' | 'listo' | 'error'

export function Contacto({ planInteres }: { planInteres?: string }) {
  const [estado, setEstado] = useState<Estado>('escribiendo')
  const [error, setError] = useState('')
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
      setError('Dejanos un teléfono o un email para poder contactarte.')
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
      // El token ya se gastó: el próximo intento necesita uno nuevo.
      if (siteKey) {
        setCaptcha(null)
        setVueltaCaptcha((v) => v + 1)
      }
      // El 400 CAPTCHA tiene arreglo en la página (resolverlo de nuevo): se
      // muestra el mensaje del backend en vez de mandar a WhatsApp.
      const cuerpo = (await res.json().catch(() => null)) as { codigo?: string; message?: string } | null
      if (cuerpo?.codigo === 'CAPTCHA') {
        setError(cuerpo.message || 'No pudimos verificar que seas una persona. Volvé a intentar.')
        setEstado('error')
        return
      }
      throw new Error(String(res.status))
    } catch {
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
    <form onSubmit={enviar} className="mx-auto max-w-lg text-left">
      {/* Honeypot: oculto para personas, visible para bots que rellenan todo. */}
      <input
        type="text"
        name="web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">Tu nombre *</span>
          <input
            name="nombre"
            required
            minLength={2}
            maxLength={120}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-brand-400"
            placeholder="Juan Pérez"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-300">WhatsApp</span>
          <input
            name="telefono"
            inputMode="tel"
            maxLength={30}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-brand-400"
            placeholder="700 00000"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-300">Email</span>
          <input
            name="email"
            type="email"
            maxLength={120}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-brand-400"
            placeholder="juan@ejemplo.com"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">¿Qué tipo de negocio tenés?</span>
          <select
            name="rubro"
            defaultValue="Restaurante"
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:border-brand-400"
          >
            {RUBROS.map((r) => (
              <option key={r} value={r} className="bg-slate-900">
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">Contanos qué necesitás</span>
          <textarea
            name="mensaje"
            rows={3}
            maxLength={1000}
            className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-brand-400"
            placeholder="Tengo una pollería y quiero controlar el stock…"
          />
        </label>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Dejanos al menos un teléfono o un email para poder responderte.
      </p>

      {siteKey && <Captcha key={vueltaCaptcha} siteKey={siteKey} onToken={setCaptcha} />}

      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="mt-4 w-full rounded-full bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-500/30 transition hover:bg-brand-400 disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Enviando…' : 'Quiero que me contacten'}
      </button>

      <p className="mt-4 text-center text-sm text-slate-400">
        ¿Preferís escribir directo?{' '}
        <a
          href={linkWhatsApp('Hola BamarDev, quiero coordinar una demo del sistema para mi negocio.')}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-300 underline-offset-2 hover:underline"
        >
          WhatsApp {WHATSAPP_DISPLAY}
        </a>
      </p>
    </form>
  )
}
