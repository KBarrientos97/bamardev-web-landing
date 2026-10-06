import { Footer } from '../components/Cierre'
import { Markdown } from './Markdown'

/**
 * Una página legal: el texto viene del .md de esta carpeta, que es copia de
 * `bamar/legal/` (la fuente; fuera de los repos). Al cambiar una versión se
 * copia el archivo de nuevo y se ajusta `preliminar`.
 */
export function PaginaLegal({ texto, preliminar }: { texto: string; preliminar: boolean }) {
  return (
    <>
      <header className="border-b border-white/10 bg-slate-950">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="BamarDev" className="h-9 w-9 rounded-xl" />
            <span className="text-lg font-extrabold tracking-tight text-white">
              BamarDev
              <span className="ml-1.5 hidden font-medium text-slate-400 sm:inline">Technology</span>
            </span>
          </a>
          <a href="/" className="text-sm font-semibold text-slate-300 transition hover:text-white">
            ← Volver al inicio
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        {preliminar && (
          // Los marcadores entre corchetes quedan a la vista a propósito: el
          // texto todavía no está revisado por un abogado ni completo.
          <p className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong className="font-bold">Versión preliminar.</strong> Este documento está en
            revisión; los datos <mark className="rounded bg-amber-100 px-1">[entre corchetes]</mark>{' '}
            todavía no están completos.
          </p>
        )}
        <article>
          <Markdown texto={texto} />
        </article>
      </main>

      <Footer />
    </>
  )
}
