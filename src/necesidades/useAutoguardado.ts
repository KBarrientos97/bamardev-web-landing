import { useCallback, useEffect, useRef, useState } from 'react'
import { ErrorApi, guardarParche } from './api'
import { fusionar, parcheEstaVacio, parcheVacio, type Parche } from './tipos'

export type EstadoGuardado = 'guardado' | 'pendiente' | 'guardando' | 'sin-conexion' | 'error'

/** Cuánto se espera después del último cambio antes de mandarlo. */
const ESPERA_MS = 1200
/** Módulos por pedido: un parche con todo pendiente podría pasar los 100 kb que acepta el servidor. */
const MODULOS_POR_PEDIDO = 4
/** Esperas entre reintentos cuando no hay red (el último se repite). */
const REINTENTOS_MS = [4000, 8000, 15000, 30000]

const clave = (token: string) => `bamardev_necesidades_${token}`

/**
 * Autoguardado del cuestionario.
 *
 * Lo que la persona cambia se anota en un PARCHE pendiente y se manda al
 * servidor poco después de que deja de escribir. El estado "Guardado" se
 * muestra sólo cuando el servidor confirmó, nunca antes.
 *
 * Sin internet los cambios no se pierden: el parche pendiente también se copia
 * en el navegador (`localStorage`) y se reintenta solo al volver la conexión,
 * aunque se haya cerrado la página en el medio. Reenviar un parche no duplica
 * nada: guardar es "dejar la respuesta así", no "agregar".
 */
export function useAutoguardado(token: string, activo: boolean, guardadoInicial: string | null) {
  const pendiente = useRef<Parche>(parcheVacio())
  const [estado, setEstado] = useState<EstadoGuardado>('guardado')
  const [guardadoEn, setGuardadoEn] = useState<string | null>(guardadoInicial)
  const [mensaje, setMensaje] = useState('')

  const temporizador = useRef<number | undefined>(undefined)
  const reintento = useRef<number | undefined>(undefined)
  const intentos = useRef(0)
  const enVuelo = useRef<Promise<boolean> | null>(null)
  const activoRef = useRef(activo)
  activoRef.current = activo

  const persistir = useCallback(() => {
    try {
      if (parcheEstaVacio(pendiente.current)) localStorage.removeItem(clave(token))
      else localStorage.setItem(clave(token), JSON.stringify(pendiente.current))
    } catch {
      /* sin almacenamiento (modo privado): sigue funcionando, sin la copia */
    }
  }, [token])

  /** Manda lo pendiente, en tandas. `true` si no quedó nada sin guardar. */
  const vaciar = useCallback(async (): Promise<boolean> => {
    window.clearTimeout(temporizador.current)
    window.clearTimeout(reintento.current)
    setEstado('guardando')
    while (!parcheEstaVacio(pendiente.current)) {
      const p = pendiente.current
      const ids = Object.keys(p.modulos).slice(0, MODULOS_POR_PEDIDO)
      const tanda: Parche = {
        general: { ...p.general },
        modulos: Object.fromEntries(ids.map((id) => [id, p.modulos[id]])),
        secciones: { ...p.secciones },
      }
      try {
        const r = await guardarParche(token, tanda)
        // Se descuenta sólo lo que viajó Y no cambió mientras tanto: si la persona
        // siguió escribiendo, eso queda pendiente para la próxima vuelta.
        const ahora = pendiente.current
        for (const k of ['general', 'modulos', 'secciones'] as const) {
          for (const [id, v] of Object.entries(tanda[k])) {
            const actual = (ahora[k] as Record<string, unknown>)[id]
            if (JSON.stringify(actual) === JSON.stringify(v)) {
              delete (ahora[k] as Record<string, unknown>)[id]
            }
          }
        }
        persistir()
        intentos.current = 0
        setGuardadoEn(r.guardadoEn)
      } catch (e) {
        const err = e instanceof ErrorApi ? e : new ErrorApi('No se pudo guardar', 500)
        if (err.sinRed || err.status === 429) {
          setEstado('sin-conexion')
          const espera = REINTENTOS_MS[Math.min(intentos.current, REINTENTOS_MS.length - 1)]
          intentos.current += 1
          reintento.current = window.setTimeout(() => void vaciar(), espera)
        } else {
          setMensaje(err.message)
          setEstado('error')
        }
        return false
      }
    }
    setMensaje('')
    setEstado('guardado')
    return true
  }, [token, persistir])

  /** Un solo envío a la vez; si piden otro, espera al que va y revisa de nuevo. */
  const guardarAhora = useCallback(async (): Promise<boolean> => {
    if (enVuelo.current) {
      await enVuelo.current
      if (parcheEstaVacio(pendiente.current)) return true
    }
    const trabajo = vaciar().finally(() => {
      enVuelo.current = null
    })
    enVuelo.current = trabajo
    return trabajo
  }, [vaciar])

  /** Anota un cambio y programa el guardado. */
  const marcar = useCallback(
    (cambio: Partial<Parche>) => {
      if (!activoRef.current) return
      pendiente.current = fusionar(pendiente.current, cambio)
      persistir()
      setEstado((e) => (e === 'sin-conexion' || e === 'error' ? e : 'pendiente'))
      window.clearTimeout(temporizador.current)
      temporizador.current = window.setTimeout(() => void guardarAhora(), ESPERA_MS)
    },
    [persistir, guardarAhora],
  )

  /**
   * Lo que quedó sin mandar la vez anterior (se cortó internet y se cerró la
   * página). Lo devuelve para mostrarlo y lo deja pendiente para reenviarlo.
   */
  const recuperar = useCallback((): Parche | null => {
    try {
      const crudo = localStorage.getItem(clave(token))
      if (!crudo) return null
      const p = fusionar(parcheVacio(), JSON.parse(crudo) as Parche)
      if (parcheEstaVacio(p)) return null
      pendiente.current = fusionar(pendiente.current, p)
      setEstado('pendiente')
      temporizador.current = window.setTimeout(() => void guardarAhora(), 600)
      return p
    } catch {
      return null
    }
  }, [token, guardarAhora])

  // Al volver la conexión o salir de la pestaña, se manda ya, sin esperar.
  useEffect(() => {
    const ya = () => {
      if (activoRef.current && !parcheEstaVacio(pendiente.current)) void guardarAhora()
    }
    const alOcultar = () => document.visibilityState === 'hidden' && ya()
    window.addEventListener('online', ya)
    document.addEventListener('visibilitychange', alOcultar)
    const antesDeSalir = (e: BeforeUnloadEvent) => {
      if (!parcheEstaVacio(pendiente.current)) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', antesDeSalir)
    return () => {
      window.removeEventListener('online', ya)
      document.removeEventListener('visibilitychange', alOcultar)
      window.removeEventListener('beforeunload', antesDeSalir)
      window.clearTimeout(temporizador.current)
      window.clearTimeout(reintento.current)
    }
  }, [guardarAhora])

  return { estado, guardadoEn, mensaje, marcar, guardarAhora, recuperar }
}
