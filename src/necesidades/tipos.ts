/**
 * Cuestionario de necesidades: tipos y cálculos puros.
 *
 * El cuestionario (módulos, funcionalidades, preguntas y sus opciones) NO está
 * en esta página: lo manda el backend (`levantamiento.catalogo.ts`) junto con lo
 * ya respondido. Así retocar una pregunta no obliga a publicar la landing.
 */

export interface Opcion {
  valor: string
  etiqueta: string
  corta?: string
}

export interface Pregunta {
  id: string
  texto: string
  tipo: 'corto' | 'largo' | 'sino'
  ayuda?: string
}

export interface Funcion {
  id: string
  texto: string
  ayuda?: string
}

export interface Modulo {
  id: string
  titulo: string
  objetivo: string
  nota?: string
  funciones: Funcion[]
  preguntas: Pregunta[]
}

export interface Categoria {
  id: string
  titulo: string
  descripcion: string
  modulos: Modulo[]
}

export interface GrupoGeneral {
  id: string
  titulo: string
  descripcion?: string
  preguntas: Pregunta[]
}

export interface Catalogo {
  plantilla: string
  version: number
  decisionesModulo: Opcion[]
  prioridades: Opcion[]
  decisionesFuncion: Opcion[]
  opcionesSiNo: Opcion[]
  general: GrupoGeneral[]
  categorias: Categoria[]
}

/** Lo respondido en un módulo. Todo es opcional: se puede dejar a medias. */
export interface ModuloResp {
  decision?: string
  prioridad?: string
  funciones?: Record<string, string>
  preguntas?: Record<string, string>
  actual?: string
  comentarios?: string
}

export interface Respuestas {
  general?: Record<string, string>
  modulos?: Record<string, ModuloResp>
  secciones?: Record<string, true>
}

export interface Cuestionario {
  nombre: string
  contacto: string | null
  estado: string
  editable: boolean
  guardadoEn: string | null
  enviadoEn: string | null
  enviadoPor: string | null
  respuestas: Respuestas
  catalogo: Catalogo
}

/**
 * Un cambio pendiente de guardar. `null` / `''` borra la respuesta. Un módulo
 * viaja ENTERO (reemplaza al guardado); lo general, pregunta por pregunta.
 */
export interface Parche {
  general: Record<string, string | null>
  modulos: Record<string, ModuloResp | null>
  secciones: Record<string, boolean>
}

export const parcheVacio = (): Parche => ({ general: {}, modulos: {}, secciones: {} })

export const parcheEstaVacio = (p: Parche) =>
  !Object.keys(p.general).length &&
  !Object.keys(p.modulos).length &&
  !Object.keys(p.secciones).length

/** Suma `b` encima de `a`: lo más nuevo gana. */
export function fusionar(a: Parche, b: Partial<Parche>): Parche {
  return {
    general: { ...a.general, ...b.general },
    modulos: { ...a.modulos, ...b.modulos },
    secciones: { ...a.secciones, ...b.secciones },
  }
}

/** Quita del módulo lo vacío; `null` si no queda nada contestado. */
export function limpiarModulo(m: ModuloResp): ModuloResp | null {
  const l: ModuloResp = {}
  if (m.decision) l.decision = m.decision
  if (m.prioridad) l.prioridad = m.prioridad
  const funciones = Object.fromEntries(Object.entries(m.funciones ?? {}).filter(([, v]) => v))
  if (Object.keys(funciones).length) l.funciones = funciones
  const preguntas = Object.fromEntries(
    Object.entries(m.preguntas ?? {}).filter(([, v]) => v && v.trim()),
  )
  if (Object.keys(preguntas).length) l.preguntas = preguntas
  if (m.actual?.trim()) l.actual = m.actual
  if (m.comentarios?.trim()) l.comentarios = m.comentarios
  return Object.keys(l).length ? l : null
}

/** Aplica un parche a lo respondido, igual que lo hace el servidor al guardarlo. */
export function aplicarParche(r: Respuestas, p: Partial<Parche>): Respuestas {
  const general = { ...r.general }
  for (const [id, v] of Object.entries(p.general ?? {})) {
    if (v && v.trim()) general[id] = v
    else delete general[id]
  }
  const modulos = { ...r.modulos }
  for (const [id, v] of Object.entries(p.modulos ?? {})) {
    const limpio = v ? limpiarModulo(v) : null
    if (limpio) modulos[id] = limpio
    else delete modulos[id]
  }
  const secciones = { ...r.secciones }
  for (const [id, v] of Object.entries(p.secciones ?? {})) {
    if (v) secciones[id] = true
    else delete secciones[id]
  }
  return { general, modulos, secciones }
}

// ── Avance ───────────────────────────────────────────────────────────────────

export interface EstadoSeccion {
  /** Módulos con una decisión elegida. */
  respondidos: number
  total: number
  revisada: boolean
  /** Hay algún módulo para conversar con BamarDev. */
  conversar: boolean
  estado: 'sin-comenzar' | 'en-progreso' | 'revisada'
}

export function estadoCategoria(c: Categoria, r: Respuestas): EstadoSeccion {
  const respondidos = c.modulos.filter((m) => r.modulos?.[m.id]?.decision).length
  const revisada = !!r.secciones?.[c.id]
  return {
    respondidos,
    total: c.modulos.length,
    revisada,
    conversar: c.modulos.some((m) => r.modulos?.[m.id]?.decision === 'conversar'),
    estado: revisada ? 'revisada' : respondidos ? 'en-progreso' : 'sin-comenzar',
  }
}

export function estadoGeneral(cat: Catalogo, r: Respuestas): EstadoSeccion {
  const preguntas = cat.general.flatMap((g) => g.preguntas)
  const respondidos = preguntas.filter((p) => r.general?.[p.id]?.trim()).length
  const revisada = !!r.secciones?.general
  return {
    respondidos,
    total: preguntas.length,
    revisada,
    conversar: false,
    estado: revisada ? 'revisada' : respondidos ? 'en-progreso' : 'sin-comenzar',
  }
}

export interface Avance {
  modulosTotal: number
  modulosRespondidos: number
  porcentaje: number
  porDecision: Record<string, number>
  sinResponder: Modulo[]
  seccionesTotal: number
  seccionesRevisadas: number
}

export function avance(cat: Catalogo, r: Respuestas): Avance {
  const todos = cat.categorias.flatMap((c) => c.modulos)
  const porDecision: Record<string, number> = {}
  for (const m of todos) {
    const d = r.modulos?.[m.id]?.decision
    if (d) porDecision[d] = (porDecision[d] ?? 0) + 1
  }
  const respondidos = todos.filter((m) => r.modulos?.[m.id]?.decision).length
  const pasos = [estadoGeneral(cat, r), ...cat.categorias.map((c) => estadoCategoria(c, r))]
  return {
    modulosTotal: todos.length,
    modulosRespondidos: respondidos,
    porcentaje: todos.length ? Math.round((respondidos / todos.length) * 100) : 0,
    porDecision,
    sinResponder: todos.filter((m) => !r.modulos?.[m.id]?.decision),
    seccionesTotal: pasos.length,
    seccionesRevisadas: pasos.filter((p) => p.revisada).length,
  }
}

/** ¿Hay algo contestado dentro del módulo además de la decisión? */
export function tieneDetalle(m: ModuloResp | undefined): boolean {
  return !!(
    m &&
    (Object.keys(m.funciones ?? {}).length ||
      Object.keys(m.preguntas ?? {}).length ||
      m.actual?.trim() ||
      m.comentarios?.trim())
  )
}
