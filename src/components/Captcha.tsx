import { useEffect, useRef, useState } from 'react'
import { cargarTurnstile } from '../lib/turnstile'

/**
 * El widget de Turnstile. Avisa el token cuando Cloudflare lo da y `null`
 * cuando vence o falla, así el formulario sabe si puede mandar.
 *
 * Los tokens son de un solo uso: para pedir otro, el formulario lo vuelve a
 * montar con otra `key` (después de cada envío, que ya lo gastó).
 */
export function Captcha({ siteKey, onToken }: { siteKey: string; onToken: (token: string | null) => void }) {
  const caja = useRef<HTMLDivElement>(null)
  const avisar = useRef(onToken)
  const [fallo, setFallo] = useState(false)

  useEffect(() => {
    avisar.current = onToken
  }, [onToken])

  useEffect(() => {
    let vivo = true
    let id: string | undefined
    cargarTurnstile()
      .then((ts) => {
        if (!vivo || !caja.current) return
        id = ts.render(caja.current, {
          sitekey: siteKey,
          language: 'es',
          // La sección de contacto es oscura.
          theme: 'dark',
          // Ocupa el ancho del formulario (mínimo 300 px, ver abajo).
          size: 'flexible',
          callback: (token) => avisar.current(token),
          'expired-callback': () => avisar.current(null),
          'timeout-callback': () => avisar.current(null),
          'error-callback': () => avisar.current(null),
        })
      })
      .catch(() => {
        if (vivo) setFallo(true)
      })
    return () => {
      vivo = false
      if (id) window.turnstile?.remove(id)
    }
  }, [siteKey])

  return (
    <div className="mt-4">
      {/* El widget mide al menos 300 px y a 390 px el formulario deja 294:
          centrado, sobra 3 px de cada lado en vez de 6 de uno solo. */}
      <div ref={caja} aria-label="Verificación anti-robots" className="flex min-h-[65px] w-full justify-center" />
      {fallo && (
        <p className="mt-1 text-xs text-rose-300">
          No pudimos cargar la verificación anti-robots. Revisá tu conexión (o el bloqueador de anuncios) y recargá la
          página, o escribinos por WhatsApp.
        </p>
      )}
    </div>
  )
}
