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
export const API_OPCIONES_URL = `${API_BASE}/publico/alta/opciones`

/**
 * La app web del negocio de este ambiente: la landing de QA crea la cuenta en
 * QA, así que tiene que entrar en la app de QA. En dev no hay variable y el
 * proxy de Vite apunta al backend de QA, así que también va a la de QA.
 */
export const APP_URL = (import.meta.env.VITE_APP_URL?.trim() || 'https://app-qa.bamardev.com').replace(/\/+$/, '')

/**
 * "Abrir mi sistema" (B3): siempre al login, con el código del negocio ya
 * escrito (B5). El usuario y la contraseña los escribe él: el dueño prefiere
 * que aprenda a entrar desde el primer día (B6, 20-oct).
 */
export function urlLogin(alias: string): string {
  return `${APP_URL}/?negocio=${encodeURIComponent(alias)}`
}

/** Un rubro que se puede crear desde la landing y el color que trae (B1). */
export interface RubroAlta {
  rubro: string
  nombre: string
  temaClave: string
}

/** Una paleta del negocio, con un color de muestra en hex para el botón. */
export interface PaletaAlta {
  clave: string
  nombre: string
  color: string
}

export interface OpcionesAlta {
  rubros: RubroAlta[]
  paletas: PaletaAlta[]
}

const esTexto = (v: unknown): v is string => typeof v === 'string' && v.trim() !== ''

/**
 * Lo que publica `GET /publico/alta/opciones`, sin confiar en la forma: lo
 * que no tenga los campos se descarta. El backend ya manda sólo los rubros
 * DISPONIBLE (rechaza el alta de uno en desarrollo) y las paletas válidas.
 * Un color que no sea hex no se pinta: CSS lo recibe tal cual.
 */
export function leerOpciones(cuerpo: unknown): OpcionesAlta {
  const c = (cuerpo && typeof cuerpo === 'object' ? cuerpo : {}) as Record<string, unknown>
  const rubros = (Array.isArray(c.rubros) ? c.rubros : []).filter(
    (r): r is RubroAlta =>
      !!r && typeof r === 'object' && esTexto((r as RubroAlta).rubro) && esTexto((r as RubroAlta).nombre),
  )
  const paletas = (Array.isArray(c.paletas) ? c.paletas : []).filter(
    (p): p is PaletaAlta =>
      !!p &&
      typeof p === 'object' &&
      esTexto((p as PaletaAlta).clave) &&
      esTexto((p as PaletaAlta).nombre) &&
      /^#[0-9a-f]{3,8}$/i.test(String((p as PaletaAlta).color)),
  )
  return {
    rubros: rubros.map((r) => ({ rubro: r.rubro, nombre: r.nombre, temaClave: esTexto(r.temaClave) ? r.temaClave : '' })),
    paletas: paletas.map((p) => ({ clave: p.clave, nombre: p.nombre, color: p.color })),
  }
}

/**
 * El código del negocio que va a salir de este nombre (B3): la misma regla
 * que `slugAlias` del backend (alta-web.service.ts) y el slug del panel.
 * Minúsculas, sin acentos (la ñ queda n), sólo letras, números y guiones, sin
 * guiones en las puntas y hasta 30. Si ya existe, el backend le agrega un
 * número: por eso la pantalla final muestra el que devolvió el servidor.
 */
export const LARGO_ALIAS = 30

export function slugAlias(texto: string): string {
  return (
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '')
      .slice(0, LARGO_ALIAS) || 'negocio'
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

/** Los pasos del asistente de /empezar (B2). */
export type Paso = 1 | 2 | 3

/** Qué campos pide cada paso, en el orden de la pantalla (el foco va al primero con error). */
export const CAMPOS_DEL_PASO: Record<Paso, CampoAlta[]> = {
  1: ['nombreNegocio', 'rubro'],
  2: ['nombre', 'whatsapp'],
  3: ['password', 'aceptaTerminos'],
}

/** Los errores de un paso solo: para avanzar alcanza con que ése esté bien. */
export function erroresDelPaso(paso: Paso, d: DatosAlta): Partial<Record<CampoAlta, string>> {
  const todos = validarAlta(d)
  const delPaso: Partial<Record<CampoAlta, string>> = {}
  for (const c of CAMPOS_DEL_PASO[paso]) if (todos[c]) delPaso[c] = todos[c]
  return delPaso
}

/**
 * La contraseña en la pantalla final (B3): puntos y los últimos 3, para que
 * la reconozca sin que quede a la vista de quien mira por encima del hombro.
 */
export function passwordOculta(password: string): string {
  return '•••••••' + password.slice(-3)
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
