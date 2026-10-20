/**
 * El alta desde la landing (PLAN-ALTA-LANDING): la prueba de 7 días del
 * Emprendedor. Acá va lo que no es pantalla: validar, normalizar, recortar el
 * texto legal y a dónde saltar con la cuenta creada.
 *
 * El backend vuelve a validar todo (y fija plan, días de prueba y precio): lo
 * de acá es para que el visitante se entere del error antes de mandar, no una
 * defensa.
 */

import { API_BASE } from '../data/precios'

export const API_ALTA_URL = `${API_BASE}/publico/alta`
export const API_RUBROS_URL = `${API_BASE}/rubros`

/**
 * La app web del negocio de este ambiente: la landing de QA crea la cuenta en
 * QA, así que tiene que entrar en la app de QA. En dev no hay variable y el
 * proxy de Vite apunta al backend de QA, así que también va a la de QA.
 */
export const APP_URL = (import.meta.env.VITE_APP_URL?.trim() || 'https://app-qa.bamardev.com').replace(/\/+$/, '')

/**
 * El código va en el fragmento (#), no en la query: el navegador no lo manda
 * a ningún servidor, así que no queda en logs de Cloudflare ni del backend.
 * Igual es de un solo uso y vence a los 60 segundos.
 */
export function urlEntrar(codigoEntrada: string): string {
  return `${APP_URL}/entrar#c=${encodeURIComponent(codigoEntrada)}`
}

/** Lo que publica `GET /rubros` y el formulario usa (el resto se ignora). */
export interface RubroApi {
  rubro: string
  nombre: string
  estado: string
}

/**
 * Sólo los DISPONIBLE: el backend rechaza el alta de un rubro en desarrollo.
 * Los de belleza en desarrollo siguen ofreciéndose en el formulario de
 * contacto, que junta interesados sin crear nada.
 */
export function rubrosDisponibles(lista: unknown): RubroApi[] {
  if (!Array.isArray(lista)) return []
  return lista.filter(
    (r): r is RubroApi =>
      !!r &&
      typeof r === 'object' &&
      typeof (r as RubroApi).rubro === 'string' &&
      typeof (r as RubroApi).nombre === 'string' &&
      (r as RubroApi).estado === 'DISPONIBLE',
  )
}

/**
 * Los 8 dígitos de un celular boliviano a partir de lo que escriba la gente:
 * "+591 712 34567", "00591-71234567", "71234567". null si no son 8 dígitos.
 * El 591 se saca sólo si sobra, como hace el backend.
 */
export function normalizarWhatsApp(texto: string): string | null {
  let d = texto.replace(/\D/g, '')
  if (d.length > 8 && d.startsWith('00591')) d = d.slice(5)
  else if (d.length > 8 && d.startsWith('591')) d = d.slice(3)
  return /^\d{8}$/.test(d) ? d : null
}

export interface DatosAlta {
  nombreNegocio: string
  rubro: string
  nombre: string
  whatsapp: string
  password: string
  aceptaTerminos: boolean
}

export type CampoAlta = keyof DatosAlta

/** Un mensaje por campo con problema; vacío si se puede mandar. */
export function validarAlta(d: DatosAlta): Partial<Record<CampoAlta, string>> {
  const errores: Partial<Record<CampoAlta, string>> = {}
  const negocio = d.nombreNegocio.trim()
  if (negocio.length < 2) errores.nombreNegocio = 'Escribí el nombre de tu negocio (al menos 2 letras).'
  else if (negocio.length > 80) errores.nombreNegocio = 'El nombre del negocio puede tener hasta 80 letras.'
  if (!d.rubro) errores.rubro = 'Elegí el rubro de tu negocio.'
  const nombre = d.nombre.trim()
  if (nombre.length < 2) errores.nombre = 'Escribí tu nombre (al menos 2 letras).'
  else if (nombre.length > 80) errores.nombre = 'Tu nombre puede tener hasta 80 letras.'
  if (!normalizarWhatsApp(d.whatsapp)) {
    errores.whatsapp = 'Escribí tu número de WhatsApp de Bolivia: 8 dígitos, por ejemplo 71234567.'
  }
  if (d.password.length < 8) errores.password = 'La contraseña tiene que tener al menos 8 caracteres.'
  else if (d.password.length > 72) errores.password = 'La contraseña puede tener hasta 72 caracteres.'
  if (!d.aceptaTerminos) errores.aceptaTerminos = 'Para crear la cuenta tenés que aceptar los términos.'
  return errores
}

/** Un bloque del adelanto de los términos: un título o un párrafo. */
export interface BloqueAdelanto {
  titulo: boolean
  texto: string
}

/**
 * Las primeras `max` líneas con texto del documento (A4: "Leer más" muestra
 * 10 como máximo), en texto plano: sin `#` ni `**`. Las líneas seguidas se
 * juntan en un párrafo, como en el Markdown; si el recorte deja el último a
 * medias, termina en "…".
 */
export function adelantoLegal(texto: string, max = 10): BloqueAdelanto[] {
  const lineas = texto.replace(/\r\n/g, '\n').split('\n')
  const bloques: BloqueAdelanto[] = []
  let usadas = 0
  let actual: BloqueAdelanto | null = null
  let i = 0
  for (; i < lineas.length && usadas < max; i++) {
    const l = lineas[i].trim()
    if (!l) {
      actual = null
      continue
    }
    usadas++
    const limpia = l.replace(/^#+\s*/, '').replace(/\*\*/g, '')
    if (l.startsWith('#')) {
      bloques.push({ titulo: true, texto: limpia })
      actual = null
    } else if (actual) {
      actual.texto += ' ' + limpia
    } else {
      actual = { titulo: false, texto: limpia }
      bloques.push(actual)
    }
  }
  // ¿Quedó texto sin mostrar pegado al último párrafo? Entonces se cortó.
  const sigue = i < lineas.length && lineas[i].trim() !== ''
  const ultimo = bloques[bloques.length - 1]
  if (sigue && ultimo && !ultimo.titulo) ultimo.texto += '…'
  return bloques
}
