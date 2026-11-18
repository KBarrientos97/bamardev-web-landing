import { m } from 'motion/react'
import { linkWhatsApp } from '../data/planes'
import { WhatsAppIcon } from './ui'

/**
 * Botón de WhatsApp fijo abajo a la derecha: siempre a un toque, en cualquier
 * parte de la página. Es el camino directo al dueño de BamarDev.
 */
export function WhatsAppFlotante() {
  return (
    <m.a
      href={linkWhatsApp('Hola BamarDev, quiero ver una demo del sistema para mi negocio.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Pedir una demo por WhatsApp"
      // Entra con un poco de retraso para no competir con el Hero al cargar.
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-4 pr-5 text-sm font-extrabold text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.7)] ring-1 ring-black/5 motion-safe:animate-[pulso-wa_2.8s_ease-out_infinite] sm:bottom-6 sm:right-6 sm:text-base"
    >
      <WhatsAppIcon className="h-6 w-6" />
      Pedir demo
    </m.a>
  )
}
