import { useEffect, useState } from 'react'

/**
 * Dónde publica el pipeline del APK (bucket público de R2 con dominio propio,
 * repo bamardev-android → apk-descargas.yml). Siempre PROD: el APK que se baja
 * es el de producción también desde la landing de QA.
 */
const BASE = (import.meta.env.VITE_DESCARGAS_URL?.trim() || 'https://descargas.bamardev.com').replace(/\/+$/, '')

interface Version {
  version: string
  archivo: string
  fecha: string
  tamano: number
  sha256: string
}

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'listo'; versiones: Version[] }
  | { tipo: 'error' }

/**
 * Una pestaña por app. La de TV está vacía a propósito: se muestra ya para que
 * se vea que viene, y cuando exista su APK sólo hay que publicarlo (hoy
 * versiones.json trae únicamente el de Android para celular y tablet).
 */
const PESTANAS = [
  { id: 'app', etiqueta: 'App' },
  { id: 'tv', etiqueta: 'TV' },
] as const
type Pestana = (typeof PESTANAS)[number]['id']

/** /descargas#tv abre directo la pestaña de TV (se puede compartir ese link). */
const pestanaInicial = (): Pestana => (location.hash === '#tv' ? 'tv' : 'app')

/**
 * Fecha y hora del despliegue. A veces salen varias versiones el mismo día, y
 * la hora es lo que las distingue. Hora de Bolivia fija (no la del visitante)
 * para que quien la lea y el equipo de soporte hablen de la misma hora.
 */
const ZONA = 'America/La_Paz'
const fechaHora = (iso: string) => {
  const d = new Date(iso)
  const fecha = d.toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: ZONA })
  const hora = d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONA })
  return `${fecha} · ${hora}`
}

const megas = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`

export default function Descargas() {
  const [pestana, setPestana] = useState<Pestana>(pestanaInicial)
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' })

  useEffect(() => {
    const control = new AbortController()
    fetch(`${BASE}/versiones.json`, { signal: control.signal, cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { versiones?: Version[] }) => {
        // Máximo 3 también acá: aunque el bucket tuviera de más, la página no los muestra.
        const versiones = Array.isArray(d.versiones) ? d.versiones.slice(0, 3) : []
        setEstado(versiones.length > 0 ? { tipo: 'listo', versiones } : { tipo: 'error' })
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== 'AbortError') setEstado({ tipo: 'error' })
      })
    return () => control.abort()
  }, [])

  // Un link a /descargas#tv pegado con la página ya abierta también cambia de pestaña.
  useEffect(() => {
    const alCambiarHash = () => setPestana(pestanaInicial())
    window.addEventListener('hashchange', alCambiarHash)
    return () => window.removeEventListener('hashchange', alCambiarHash)
  }, [])

  const elegir = (id: Pestana) => {
    setPestana(id)
    history.replaceState(null, '', id === 'tv' ? '#tv' : location.pathname)
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="bg-slate-950 px-4 pb-14 pt-5 text-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <a href="/" className="inline-flex items-center gap-2.5">
            <img src="/logo-marca.png" alt="" className="h-9 w-9" />
            <span className="text-lg font-extrabold tracking-tight">BamarDev</span>
            <span className="sr-only">: volver al inicio</span>
          </a>
          <p className="mt-10 text-xs font-extrabold uppercase tracking-widest text-brand-400">Descargas</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Descargar las apps
          </h1>
          <p className="mt-3 max-w-xl text-slate-300">
            Las aplicaciones de BamarDev para Android: la de celular y tablet, y la de TV. Bajá siempre la versión más nueva.
          </p>

          <div role="tablist" aria-label="Aplicaciones" className="mt-6 inline-flex rounded-full bg-white/10 p-1">
            {PESTANAS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                id={`pestana-${p.id}`}
                aria-selected={pestana === p.id}
                aria-controls={`panel-${p.id}`}
                onClick={() => elegir(p.id)}
                className={`rounded-full px-6 py-2 text-sm font-bold transition active:scale-[0.97] ${
                  pestana === p.id ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                {p.etiqueta}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-8 max-w-3xl px-4 pb-16 sm:px-6">
        {pestana === 'app' && (
          <div role="tabpanel" id="panel-app" aria-labelledby="pestana-app">
            <PanelApp estado={estado} />
          </div>
        )}
        {pestana === 'tv' && (
          <div role="tabpanel" id="panel-tv" aria-labelledby="pestana-tv">
            <PanelTv />
          </div>
        )}
      </main>
    </div>
  )
}

function PanelApp({ estado }: { estado: Estado }) {
  return (
    <>
      {estado.tipo === 'cargando' && (
        <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm ring-1 ring-slate-200" role="status">
          Buscando las versiones…
        </div>
      )}

      {estado.tipo === 'error' && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" role="alert">
          <p className="font-bold text-slate-900">No pudimos mostrar las versiones ahora.</p>
          <p className="mt-1 text-slate-600">Probá de nuevo en unos minutos, o escribinos por WhatsApp y te la enviamos.</p>
          <button
            type="button"
            onClick={() => location.reload()}
            className="mt-4 rounded-full bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-400 active:scale-[0.97]"
          >
            Reintentar
          </button>
        </div>
      )}

      {estado.tipo === 'listo' && (
        <ul className="space-y-4">
          {estado.versiones.map((v, i) => (
            <li
              key={v.version}
              className={`rounded-2xl bg-white p-5 shadow-sm ring-1 sm:p-6 ${
                i === 0 ? 'ring-2 ring-brand-500' : 'ring-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
                    Versión {v.version}
                    {i === 0 && (
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-800">
                        Última
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {fechaHora(v.fecha)} · {megas(v.tamano)}
                  </p>
                </div>
                <a
                  href={`${BASE}/${v.archivo}`}
                  download
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-[0.97] ${
                    i === 0
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:-translate-y-0.5 hover:bg-brand-400'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M10 2a1 1 0 011 1v8.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 11.586V3a1 1 0 011-1zM4 15a1 1 0 011 1v1h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" />
                  </svg>
                  Descargar
                </a>
              </div>
              <details className="mt-3 text-xs text-slate-500">
                <summary className="cursor-pointer font-semibold">Huella SHA-256 del archivo</summary>
                <code className="mt-1 block break-all text-slate-600">{v.sha256}</code>
              </details>
            </li>
          ))}
        </ul>
      )}
      {estado.tipo === 'listo' && <p className="mt-3 px-1 text-xs text-slate-400">Fecha y hora de Bolivia (GMT-4).</p>}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-extrabold text-slate-900">Antes de instalar</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          <li>
            Si ya tenés la app, instalá la nueva <strong>encima</strong>. No la desinstales: se borrarían las ventas que
            todavía no subieron al servidor.
          </li>
          <li>Android no deja instalar una versión más vieja sobre una más nueva. Para eso hay que desinstalar.</li>
          <li>
            La primera vez, Android puede pedirte permiso para instalar apps desde el navegador: aceptalo sólo para este
            archivo.
          </li>
          <li>Al abrirla entrás con el alias de tu negocio, tu usuario y tu clave.</li>
        </ul>
      </section>
    </>
  )
}

/** Vacía a propósito hasta que exista el APK para TV. */
function PanelTv() {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <rect x="2.5" y="4" width="19" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mt-4 text-lg font-extrabold text-slate-900">App para TV</p>
      <p className="mt-1 text-slate-600">
        Estamos desarrollándola. Todavía no hay versiones para descargar: cuando esté lista la vas a encontrar acá.
      </p>
    </div>
  )
}
