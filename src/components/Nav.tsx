import { linkWhatsApp } from '../data/planes'
import { WhatsAppIcon } from './ui'

const LINKS = [
  { href: '#rubros', label: 'Rubros' },
  { href: '#funciones', label: 'Funciones' },
  { href: '#planes', label: 'Planes' },
  { href: '#contacto', label: 'Contacto' },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="BamarDev" className="h-9 w-9 rounded-xl" />
          <span className="text-lg font-extrabold tracking-tight text-white">
            BamarDev
            <span className="ml-1.5 hidden font-medium text-slate-400 sm:inline">
              Technology
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={linkWhatsApp('Hola BamarDev, quiero ver una demo del sistema.')}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Pedir demo
        </a>
      </nav>
    </header>
  )
}
