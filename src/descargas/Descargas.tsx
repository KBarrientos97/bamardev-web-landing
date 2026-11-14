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

const fechaLarga = (iso: string) =>
  new Date(iso).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })

const megas = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`

export default function Descargas() {
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

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="bg-slate-950 px-4 pb-14 pt-5 text-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <a href="/" className="inline-flex items-center gap-2.5">
            <img src="/logo-marca.png" alt="" className="h-9 w-9" />
            <span className="text-lg font-extrabold tracking-tight">BamarDev</span>
            <span className="sr-only">: volver al inicio</span>
          </a>
          <p className="mt-10 text-xs font-extrabold uppercase tracking-widest text-brand-400">App para Android</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Descargar Mobile</h1>
          <p className="mt-3 max-w-xl text-slate-300">
            La app de BamarDev para tu celular o tablet Android. Bajá siempre la versión más nueva; las anteriores quedan
            por si necesitás compararlas.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-8 max-w-3xl px-4 pb-16 sm:px-6">
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
                      {fechaLarga(v.fecha)} · {megas(v.tamano)}
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
      </main>
    </div>
  )
}
