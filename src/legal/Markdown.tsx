import type { ReactNode } from 'react'

/**
 * Lo justo de Markdown para los documentos legales: títulos, párrafos,
 * listas, tablas, negrita, cursiva y la raya final. No es un parser general.
 *
 * Por qué no una librería: los textos los escribe BamarDev y usan pocas
 * construcciones, y así los marcadores sin completar (`[RAZÓN SOCIAL]`,
 * `[15]`…) se pueden resaltar tal cual están, sin `innerHTML`.
 */
export function Markdown({ texto }: { texto: string }) {
  return <>{bloques(texto).map((b, i) => renderBloque(b, i))}</>
}

type Bloque =
  | { tipo: 'h1' | 'h2' | 'p'; texto: string }
  | { tipo: 'ul' | 'ol'; items: string[] }
  | { tipo: 'tabla'; filas: string[][] }
  | { tipo: 'hr' }

function bloques(texto: string): Bloque[] {
  const crudos = texto.replace(/\r\n/g, '\n').trim().split(/\n\s*\n/)
  return crudos.map((crudo): Bloque => {
    const lineas = crudo.split('\n')
    const primera = lineas[0]
    if (primera.startsWith('# ')) return { tipo: 'h1', texto: primera.slice(2) }
    if (primera.startsWith('## ')) return { tipo: 'h2', texto: primera.slice(3) }
    if (/^-{3,}$/.test(primera.trim())) return { tipo: 'hr' }
    if (primera.startsWith('|')) {
      return {
        tipo: 'tabla',
        filas: lineas
          // La fila de guiones sólo separa el encabezado.
          .filter((l) => !/^\|[\s|:-]+\|$/.test(l.trim()))
          .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())),
      }
    }
    const lista = /^- /.test(primera) ? 'ul' : /^\d+\. /.test(primera) ? 'ol' : null
    if (lista) {
      // Cada ítem empieza con su viñeta; las líneas sangradas lo continúan.
      const items: string[] = []
      for (const l of lineas) {
        const m = l.match(/^(?:- |\d+\. )(.*)$/)
        if (m) items.push(m[1])
        else items[items.length - 1] += ' ' + l.trim()
      }
      return { tipo: lista, items }
    }
    return { tipo: 'p', texto: lineas.map((l) => l.trim()).join(' ') }
  })
}

function renderBloque(b: Bloque, key: number): ReactNode {
  switch (b.tipo) {
    case 'h1':
      return (
        <h1 key={key} className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {inline(b.texto)}
        </h1>
      )
    case 'h2':
      return (
        <h2 key={key} className="mt-10 text-xl font-extrabold text-slate-900">
          {inline(b.texto)}
        </h2>
      )
    case 'p':
      return (
        <p key={key} className="mt-4 leading-relaxed text-slate-700">
          {inline(b.texto)}
        </p>
      )
    case 'ul':
    case 'ol': {
      const Lista = b.tipo
      return (
        <Lista
          key={key}
          className={`mt-4 space-y-2 pl-6 leading-relaxed text-slate-700 ${
            b.tipo === 'ul' ? 'list-disc marker:text-brand-500' : 'list-decimal marker:font-bold marker:text-brand-600'
          }`}
        >
          {b.items.map((it, i) => (
            <li key={i}>{inline(it)}</li>
          ))}
        </Lista>
      )
    }
    case 'tabla': {
      const [cabecera, ...filas] = b.filas
      return (
        <div key={key} className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                {cabecera.map((c, i) => (
                  <th key={i} className="px-4 py-3 font-bold">
                    {inline(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filas.map((f, i) => (
                <tr key={i}>
                  {f.map((c, j) => (
                    <td key={j} className="px-4 py-3 align-top">
                      {inline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    case 'hr':
      return <hr key={key} className="mt-10 border-slate-200" />
  }
}

/** Negrita, cursiva y marcadores `[…]` (un `[…]` seguido de `(` sería un enlace: no hay). */
function inline(texto: string): ReactNode[] {
  const partes = texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\](?!\())/)
  return partes.filter(Boolean).map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {inline(p.slice(2, -2))}
        </strong>
      )
    }
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
      return (
        <em key={i} className="text-slate-500">
          {inline(p.slice(1, -1))}
        </em>
      )
    }
    if (p.startsWith('[') && p.endsWith(']')) {
      // Se muestra tal cual, pero que salte a la vista que falta completarlo.
      return (
        <mark key={i} className="rounded bg-amber-100 px-1 text-amber-800">
          {p}
        </mark>
      )
    }
    return p
  })
}
