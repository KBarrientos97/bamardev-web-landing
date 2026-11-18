import { createRoot } from 'react-dom/client'
import '../index.css'

// Sólo para desarrollo: junta todas las escenas exportadas por src/components/Escenas*.tsx
// y las muestra del tamaño de la tarjeta real. ?solo=Minimarket muestra una sola.
// Esta página no entra al build (no está en vite.config.ts).
const mods = import.meta.glob('../components/Escenas*.tsx', { eager: true }) as Record<string, Record<string, unknown>>
const escenas = Object.values(mods)
  .flatMap((m) => Object.entries(m))
  .filter(([k, c]) => k.startsWith('Escena') && typeof c === 'function') as [string, () => React.ReactElement][]

function Vista() {
  const solo = new URLSearchParams(location.search).get('solo')
  const lista = escenas.filter(([n]) => !solo || n.toLowerCase().includes(solo.toLowerCase()))
  return (
    <div className="flex flex-wrap gap-6 bg-slate-100 p-6">
      {lista.map(([nombre, Escena]) => (
        <div key={nombre} className="group w-[350px]">
          <p className="mb-1 text-xs font-bold text-slate-500">{nombre}</p>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <Escena />
          </div>
        </div>
      ))}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Vista />)
