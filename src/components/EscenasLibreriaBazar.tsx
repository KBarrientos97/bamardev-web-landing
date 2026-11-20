import './EscenasLibreriaBazar.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escenas animadas de la librería-papelería y del bazar-importadora (SVG propio).
  Todo se mueve con CSS (sólo transform y opacity); los keyframes `esc-lib-*` y
  `esc-baz-*` viven en EscenasLibreriaBazar.css y los compartidos `esc-*` en
  index.css. Son decorativas: el Marco ya las marca con aria-hidden.

  Los grupos estáticos con escala o giro llevan la clase `esc-lb-fijo`: les
  devuelve el pivote clásico del SVG (el 0,0 del grupo) que `.escena svg *`
  cambia por el centro de la caja. Nunca va en un elemento animado.
*/

/** Chispa de cuatro puntas, chica (destellos de la venta). */
const ESTRELLA = 'M0-6L1.6-1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6-1.6Z'

/** Sorteo fijo (siempre igual en cada render) para variar lomos y alturas sin escribirlos a mano. */
function sorteo(semilla: number) {
  let s = semilla
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/* ======================================================================
   Librería
   ====================================================================== */

const COLORES_LIBRO = ['#e11d48', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#0891b2', '#ea580c', '#db2777', '#0f766e', '#facc15', '#1e3a8a', '#84cc16']

type Lomo = { x: number; w: number; h: number; c: string; banda: boolean }

/** Una tanda de lomos parados entre x0 y x1 (alturas entre hMin y hMax). */
function lomos(x0: number, x1: number, hMin: number, hMax: number, semilla: number): Lomo[] {
  const r = sorteo(semilla)
  const out: Lomo[] = []
  let x = x0
  while (x < x1 - 2.4) {
    const w = Math.min(2.2 + r() * 2.2, x1 - x)
    out.push({ x, w, h: hMin + r() * (hMax - hMin), c: COLORES_LIBRO[Math.floor(r() * COLORES_LIBRO.length)], banda: r() > 0.45 })
    x += w + 0.3
  }
  return out
}

/** Fila de libros parados con la base en `base`: el lomo, su sombra a la derecha y las bandas del título. */
function FilaLibros({ libros, base }: { libros: Lomo[]; base: number }) {
  return (
    <g>
      {libros.map((l) => (
        <g key={l.x}>
          <rect x={l.x} y={base - l.h} width={l.w} height={l.h} rx=".3" fill={l.c} />
          <rect x={l.x + l.w - 0.6} y={base - l.h} width=".6" height={l.h} fill="#000" opacity=".2" />
          <rect x={l.x + 0.3} y={base - l.h + 0.3} width=".5" height={l.h - 0.6} fill="#fff" opacity=".28" />
          {l.banda && (
            <>
              <rect x={l.x} y={base - l.h + 1.4} width={l.w} height=".6" fill="#fff" opacity=".7" />
              <rect x={l.x} y={base - 2} width={l.w} height=".6" fill="#fff" opacity=".55" />
            </>
          )}
          {!l.banda && <rect x={l.x + l.w / 2 - 0.35} y={base - l.h + 2} width=".7" height={l.h * 0.45} rx=".3" fill="#fff" opacity=".5" />}
        </g>
      ))}
    </g>
  )
}

/** Pila de libros acostados, de abajo hacia arriba, con la base en (0, 0). */
function PilaLibros({ libros }: { libros: [number, number, string][] }) {
  let y = 0
  return (
    <g>
      {libros.map(([w, h, c], i) => {
        y -= h
        const dx = i % 2 ? 0.8 : -0.4
        return (
          <g key={i}>
            <rect x={-w / 2 + dx} y={y} width={w} height={h} rx=".4" fill={c} />
            {/* el canto de las hojas, del lado de adelante */}
            <rect x={-w / 2 + dx + 0.8} y={y + 0.5} width={w - 1.6} height={h - 1} rx=".2" fill="#fffaf0" />
            <path d={`M${-w / 2 + dx + 1} ${y + h / 2}H${w / 2 + dx - 1}`} stroke="#e7dcc6" strokeWidth=".3" />
            <rect x={-w / 2 + dx} y={y} width={w} height=".5" fill="#fff" opacity=".35" />
          </g>
        )
      })}
    </g>
  )
}

/** Cuaderno parado de frente, con espiral a la izquierda y la etiqueta. Base en (0, 0). */
function Cuaderno({ c, w = 13, h = 17 }: { c: string; w?: number; h?: number }) {
  const x = -w / 2
  return (
    <g>
      <rect x={x} y={-h} width={w} height={h} rx="1" fill={c} />
      <rect x={x} y={-h} width={w * 0.2} height={h} rx="1" fill="#000" opacity=".16" />
      <rect x={x + w * 0.25} y={-h + 0.6} width={w * 0.7} height=".8" rx=".4" fill="#fff" opacity=".35" />
      {Array.from({ length: Math.floor(h / 2.4) }, (_, i) => (
        <circle key={i} cx={x + w * 0.1} cy={-h + 1.6 + i * 2.4} r=".7" fill="none" stroke="#e2e8f0" strokeWidth=".45" />
      ))}
      <rect x={x + w * 0.34} y={-h * 0.72} width={w * 0.54} height={h * 0.28} rx=".6" fill="#fff" />
      <path d={`M${x + w * 0.42} ${-h * 0.62}H${x + w * 0.8}M${x + w * 0.42} ${-h * 0.53}H${x + w * 0.7}`} stroke="#94a3b8" strokeWidth=".4" />
      <path d={`M${x + w} ${-h + 1.6}V-.6`} stroke="#fff" strokeWidth=".5" opacity=".3" />
    </g>
  )
}

/** Lápiz parado, punta arriba, de largo `l`, con la base (la goma) en (0, 0). */
function Lapiz({ c, l = 15 }: { c: string; l?: number }) {
  return (
    <g>
      <rect x="-.95" y="-1.6" width="1.9" height="1.6" rx=".5" fill="#f9a8d4" />
      <rect x="-1" y="-2.7" width="2" height="1.2" fill="#cbd5e1" />
      <rect x="-.95" y={-(l - 3)} width="1.9" height={l - 5.7} fill={c} />
      <rect x="-.95" y={-(l - 3)} width=".6" height={l - 5.7} fill="#fff" opacity=".35" />
      <path d={`M-.95 ${-(l - 3)}L0 ${-l}L.95 ${-(l - 3)}Z`} fill="#f3d2a2" />
      <path d={`M-.32 ${-(l - 1)}L0 ${-l}L.32 ${-(l - 1)}Z`} fill={c} />
    </g>
  )
}

/** Regla acostada de largo `l`, centrada en (0, 0), con sus marcas de centímetro. */
function Regla({ l = 24 }: { l?: number }) {
  return (
    <g>
      <rect x={-l / 2} y="-1.7" width={l} height="3.4" rx=".5" fill="#fde047" />
      <rect x={-l / 2} y="-1.7" width={l} height=".8" rx=".4" fill="#fff" opacity=".45" />
      {Array.from({ length: Math.floor(l / 1.6) - 1 }, (_, i) => (
        <path key={i} d={`M${-l / 2 + 1.6 + i * 1.6} 1.7v${i % 5 === 4 ? -1.8 : -1}`} stroke="#a16207" strokeWidth=".3" />
      ))}
    </g>
  )
}

/** Vaso con lápices (o bolígrafos) que asoman en abanico, con la base en (0, 0). */
function VasoLapices({ c, puntas, w = 8.6 }: { c: string; puntas: [number, number, string][]; w?: number }) {
  return (
    <g>
      {puntas.map(([dx, giro, col], i) => (
        <g key={i} className="esc-lb-fijo" transform={`translate(${dx} -1) rotate(${giro})`}>
          <Lapiz c={col} l={14} />
        </g>
      ))}
      <path d={`M${-w / 2} -9H${w / 2}L${w / 2 - 0.6} 0H${-w / 2 + 0.6}Z`} fill={c} />
      <ellipse cx="0" cy="-9" rx={w / 2} ry=".9" fill="#0f172a" opacity=".35" />
      <path d={`M${-w / 2 + 1} -8V-1`} stroke="#fff" strokeWidth="1" opacity=".35" strokeLinecap="round" />
      <path d={`M${-w / 2 + 0.3} -3H${w / 2 - 0.3}`} stroke="#fff" strokeWidth=".5" opacity=".5" />
    </g>
  )
}

/** Mochila colgada de su asa, con la parte de arriba en (0, 0). */
function Mochila({ c, c2 }: { c: string; c2: string }) {
  return (
    <g>
      <path d="M-2.2 2.2C-2.2-.6 2.2-.6 2.2 2.2" fill="none" stroke="#1e293b" strokeWidth=".9" />
      <path d="M-6.4 4.4C-6.4 2 -4 1.4 0 1.4C4 1.4 6.4 2 6.4 4.4V17.4C6.4 18.6 5.4 19.4 4 19.4H-4C-5.4 19.4-6.4 18.6-6.4 17.4Z" fill={c} />
      <path d="M-6.4 4.4C-6.4 2 -4 1.4 0 1.4C4 1.4 6.4 2 6.4 4.4V8.6C4 10 -4 10 -6.4 8.6Z" fill={c2} />
      <path d="M-6.4 8.6C-4 10 4 10 6.4 8.6" fill="none" stroke="#000" strokeWidth=".4" opacity=".2" />
      <rect x="-3.6" y="8.4" width="1.3" height="4" rx=".4" fill={c2} />
      <rect x="2.3" y="8.4" width="1.3" height="4" rx=".4" fill={c2} />
      <rect x="-3.7" y="11" width="1.5" height="1" rx=".3" fill="#e2e8f0" />
      <rect x="2.2" y="11" width="1.5" height="1" rx=".3" fill="#e2e8f0" />
      <rect x="-4.4" y="13" width="8.8" height="5.4" rx="1.6" fill={c2} opacity=".9" />
      <path d="M-3.4 14.4H3.4" stroke="#fff" strokeWidth=".45" strokeDasharray=".6 .4" opacity=".8" />
      <circle cx="3.6" cy="14.4" r=".5" fill="#e2e8f0" />
      <path d="M-5.6 5V17" stroke="#fff" strokeWidth="1" opacity=".22" strokeLinecap="round" />
    </g>
  )
}

/** Banderines de la temporada escolar, colgados en una guirnalda de x0 a x1. */
const BANDERINES = Array.from({ length: 15 }, (_, i) => i)
const COLORES_BANDERIN = ['#ef4444', '#facc15', '#22c55e', '#3b82f6', '#a855f7']

/**
 * Una librería-papelería de barrio: el letrero con su lápiz, el toldo azul,
 * el estante de libros de colores tras el mostrador-vitrina (cuadernos,
 * estuches y cajas de colores), los vasos de lápices, el tablero de mochilas
 * colgadas, la fotocopiadora a la izquierda (con su luz de escaneo y las copias
 * que salen) y, a la derecha, el globo terráqueo que gira sobre una pila de
 * libros junto al canasto de papelógrafos.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): cae la guirnalda y se balancea el
 * cartel «A CLASES» (arranca la temporada escolar); en el mostrador aparece la
 * lista escolar y se arma el pedido punto por punto (cuaderno, lápices, regla),
 * cada uno con su tilde. El pedido vuela a la bolsa, la bolsa se aplasta con
 * su aro y llega el aviso de la venta. Después la bolsa se va y la lista se
 * guarda para el próximo cliente.
 */
export function EscenaLibreria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  const fila1a = lomos(89, 127, 7.4, 10.2, 7)
  const fila1b = lomos(143, 194, 7.4, 10.2, 19)
  const fila2a = lomos(89, 150, 7, 9.6, 31)
  const fila2b = lomos(165, 194, 7, 9.6, 43)
  const fila3 = lomos(89, 194, 6, 7.6, 57)

  return (
    <Marco fondo="bg-gradient-to-b from-sky-100 via-indigo-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6f8fc" />
            <stop offset="1" stopColor="#dbe3f0" />
          </linearGradient>
          <linearGradient id={g('pr')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fdfcf7" />
            <stop offset="1" stopColor="#eae6d8" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9b3a0" />
            <stop offset="1" stopColor="#d4cfbd" />
          </linearGradient>
          <linearGradient id={g('in')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b2a1e" />
            <stop offset="1" stopColor="#5c4330" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c89562" />
            <stop offset="1" stopColor="#99673a" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f5fb3" />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8fbff" />
            <stop offset="1" stopColor="#dce7f5" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* la fotocopiadora: carcasa clara, tapa gris */}
          <linearGradient id={g('fc')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8fafc" />
            <stop offset="1" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id={g('ft')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#b8c2d0" />
          </linearGradient>
          <linearGradient id={g('es')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a7f3d0" stopOpacity="0" />
            <stop offset=".5" stopColor="#ecfdf5" />
            <stop offset="1" stopColor="#a7f3d0" stopOpacity="0" />
          </linearGradient>
          {/* el globo: el mar con luz arriba a la izquierda */}
          <radialGradient id={g('mar')} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset=".6" stopColor="#0284c7" />
            <stop offset="1" stopColor="#075985" />
          </radialGradient>
          <radialGradient id={g('so')} cx=".2" cy=".3" r=".9">
            <stop offset=".55" stopColor="#0c1d3a" stopOpacity="0" />
            <stop offset="1" stopColor="#0c1d3a" stopOpacity=".45" />
          </radialGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e9c08a" />
            <stop offset="1" stopColor="#c99556" />
          </linearGradient>
          <linearGradient id={g('ce')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9a15c" />
            <stop offset="1" stopColor="#a86c31" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <rect x="94" y="110" width="130" height="25" rx="1.5" />
          </clipPath>
          <clipPath id={g('cg')}>
            <circle cx="268" cy="114" r="11.4" />
          </clipPath>
          <clipPath id={g('cf')}>
            <rect x="16" y="96.2" width="38" height="1.4" />
          </clipPath>
        </defs>

        {/* plataforma: losa con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#c3cfe2" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".45" />
        <ellipse className="esc-lib-sombra" cx="158" cy="146.4" rx="74" ry="6" fill="#1e293b" opacity=".13" />
        <ellipse cx="40" cy="146.6" rx="30" ry="4" fill="#1e293b" opacity=".13" />
        <ellipse cx="266" cy="147" rx="32" ry="4" fill="#1e293b" opacity=".12" />

        <g className="esc-lib-flota">
          {/* ---------- el local ---------- */}
          <path d="M70 68L82 63V146L70 149Z" fill={u('la')} />
          <rect x="82" y="62" width="150" height="84" fill={u('pr')} />
          <rect x="82" y="62" width="2.4" height="84" fill="#fff" opacity=".55" />
          {/* el hueco del estante, con la luz que baja */}
          <rect x="88" y="72" width="106" height="32" rx="1.6" fill={u('in')} />
          <ellipse className="esc-lib-halo" cx="141" cy="74" rx="48" ry="6" fill="#ffe6b0" opacity=".45" />
          {/* repisa de arriba: lomos, una pila acostada y más lomos */}
          <FilaLibros libros={fila1a} base={83} />
          <g transform="translate(135 83)">
            <PilaLibros
              libros={[
                [13, 2.4, '#0f766e'],
                [11.4, 2, '#e11d48'],
                [12.4, 2.2, '#f59e0b'],
                [10, 1.8, '#7c3aed'],
              ]}
            />
          </g>
          <FilaLibros libros={fila1b} base={83} />
          <rect x="88" y="83" width="106" height="2.2" fill={u('ma')} />
          <rect x="88" y="83" width="106" height=".7" fill="#ecc896" />
          {/* repisa del medio: lomos y la caja de lápices de colores */}
          <FilaLibros libros={fila2a} base={94} />
          <g transform="translate(157.6 94)">
            <rect x="-7" y="-9" width="14" height="9" rx=".6" fill="#fff7ed" />
            <rect x="-7" y="-9" width="14" height="2.6" fill="#f97316" />
            {['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'].map((c, i) => (
              <path key={c} d={`M${-5.6 + i * 2.2} -1.6V-5.4L${-4.9 + i * 2.2} -7.2L${-4.2 + i * 2.2} -5.4V-1.6Z`} fill={c} />
            ))}
            <rect x="-7" y="-2" width="14" height="2" fill="#f97316" opacity=".85" />
          </g>
          <FilaLibros libros={fila2b} base={94} />
          <rect x="88" y="94" width="106" height="2.2" fill={u('ma')} />
          <rect x="88" y="94" width="106" height=".7" fill="#ecc896" />
          {/* repisa de abajo (la tapan casi toda el mostrador y lo de encima) */}
          <FilaLibros libros={fila3} base={104} />

          {/* el tablero de útiles, a la derecha del estante: reglas, escuadra, transportador y tijera */}
          <rect x="197" y="72" width="30" height="32" rx="1.4" fill="#dbeafe" />
          {Array.from({ length: 5 }, (_, f) =>
            Array.from({ length: 6 }, (_, k) => <circle key={`${f}-${k}`} cx={200 + k * 4.8} cy={75.4 + f * 6.6} r=".45" fill="#93c5fd" />),
          )}
          {[
            [200.6, '#facc15', 18],
            [203.4, '#38bdf8', 15],
            [206.2, '#f472b6', 12],
          ].map(([x, c, l]) => (
            <g key={x as number}>
              <circle cx={x as number} cy="77.4" r=".7" fill="#64748b" />
              <rect x={(x as number) - 1.1} y="78" width="2.2" height={l as number} rx=".4" fill={c as string} opacity=".92" />
              {Array.from({ length: Math.floor((l as number) / 2) }, (_, i) => (
                <path key={i} d={`M${(x as number) - 1.1} ${79.4 + i * 2}h${i % 2 ? 0.7 : 1.2}`} stroke="#0f172a" strokeWidth=".25" opacity=".5" />
              ))}
            </g>
          ))}
          {/* la escuadra */}
          <path d="M211 76.4V90.6H224.6Z" fill="#a5f3fc" opacity=".75" />
          <path d="M211 76.4V90.6H224.6Z" fill="none" stroke="#0891b2" strokeWidth=".6" />
          <path d="M213.4 83.4V88.2H218.2Z" fill="#dbeafe" stroke="#0891b2" strokeWidth=".4" />
          {/* el transportador */}
          <path d="M210.4 101.6A6.4 6.4 0 0 1 223.2 101.6Z" fill="#fef08a" opacity=".85" />
          <path d="M210.4 101.6A6.4 6.4 0 0 1 223.2 101.6Z" fill="none" stroke="#ca8a04" strokeWidth=".5" />
          <path d="M214.2 101.6A2.6 2.6 0 0 1 219.4 101.6" fill="none" stroke="#ca8a04" strokeWidth=".4" />
          {/* la tijera */}
          <g className="esc-lb-fijo" transform="translate(204 97) rotate(-30)">
            <path d="M0-1L8-.2L8 .2L0 1Z" fill="#cbd5e1" />
            <circle cx="-2" cy="-1.6" r="1.6" fill="none" stroke="#ef4444" strokeWidth=".9" />
            <circle cx="-2" cy="1.6" r="1.6" fill="none" stroke="#ef4444" strokeWidth=".9" />
          </g>

          {/* el toldo azul con su festón */}
          {Array.from({ length: 12 }, (_, i) => {
            const w = 156 / 12
            const x = 78 + w * i
            const c = i % 2 === 0 ? '#2563eb' : '#fde68a'
            return (
              <g key={i}>
                <path d={`M${x + 2 - i * 0.33} 62H${x + w + 2 - (i + 1) * 0.33}L${x + w} 70H${x}Z`} fill={c} />
                <path d={`M${x} 70a${w / 2} ${w / 3} 0 0 0 ${w} 0Z`} fill={c} />
              </g>
            )
          })}
          <rect x="78" y="69.6" width="156" height="1" fill="#1e293b" opacity=".1" />

          {/* la guirnalda de la temporada escolar: cae del toldo */}
          <g className="esc-lib-guirnalda">
            <path d="M80 73.4Q155 79 232 73.4" fill="none" stroke="#475569" strokeWidth=".45" />
            {BANDERINES.map((i) => {
              const x = 84 + i * 10.2
              const t = (x - 80) / 152
              // la misma curva que la cuerda (cuadrática con el control 5,6 más abajo)
              const y = 73.4 + 11.2 * t * (1 - t)
              return <path key={i} d={`M${x - 2.6} ${y - 0.4}H${x + 2.6}L${x} ${y + 4.6}Z`} fill={COLORES_BANDERIN[i % 5]} />
            })}
          </g>

          {/* el cartel «A CLASES», que entra balanceándose */}
          <g className="esc-lib-cartel">
            <path d="M95 70.4L97.4 76.4M114 70.4L111.6 76.4" stroke="#475569" strokeWidth=".45" />
            <rect x="89.4" y="76" width="30.2" height="10" rx="1.6" fill="#facc15" />
            <rect x="89.4" y="76" width="30.2" height="10" rx="1.6" fill="none" stroke="#ca8a04" strokeWidth=".5" />
            <text x="104.5" y="83.2" textAnchor="middle" fontSize="5.8" fontWeight="900" fill="#1e3a8a" textLength="23" lengthAdjust="spacingAndGlyphs">
              A CLASES
            </text>
            <circle cx="91.6" cy="78.4" r=".7" fill="#ef4444" />
            <circle cx="117.4" cy="78.4" r=".7" fill="#22c55e" />
          </g>

          {/* las mochilas, colgadas de una barra en la punta del toldo */}
          <path d="M226 71.4H254M248 71.4L234 79" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
          <path d="M234 79L232 79" stroke="#475569" strokeWidth="1" />
          {[
            [237.6, '#ec4899', '#f9a8d4', '0s'],
            [250.6, '#2563eb', '#60a5fa', '-1.4s'],
          ].map(([x, c, c2, d]) => (
            <g key={x as number} transform={`translate(${x} 71)`}>
              <g className="esc-lib-mochila" style={{ animationDelay: d as string }}>
                <Mochila c={c as string} c2={c2 as string} />
              </g>
            </g>
          ))}

          {/* el letrero con el lápiz y el libro abierto */}
          <rect x="80" y="51" width="3" height="11" fill="#475569" />
          <rect x="176" y="51" width="3" height="11" fill="#475569" />
          <rect x="76" y="41.4" width="106" height="19" rx="4" fill="#1e3a8a" />
          <rect x="74" y="39" width="110" height="4.2" rx="2.1" fill="#facc15" />
          <rect x="78" y="57.6" width="102" height="1.4" rx=".7" fill="#0b1b4d" opacity=".5" />
          <text x="130" y="55.4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" textLength="68" lengthAdjust="spacing">
            LIBRERÍA
          </text>
          <g className="esc-lb-fijo" transform="translate(88 51) rotate(-40)">
            <rect x="-1.2" y="-5" width="2.4" height="8" fill="#facc15" />
            <path d="M-1.2 3L0 6L1.2 3Z" fill="#f3d2a2" />
            <rect x="-1.2" y="-6.6" width="2.4" height="1.6" rx=".5" fill="#f9a8d4" />
          </g>
          <g transform="translate(172 51)">
            <path d="M0-3.4C-2-4.6-4-4.6-5.6-3.8V3C-4 2.2-2 2.2 0 3.4Z" fill="#fff" />
            <path d="M0-3.4C2-4.6 4-4.6 5.6-3.8V3C4 2.2 2 2.2 0 3.4Z" fill="#dbeafe" />
            <path d="M-4.4-2.2H-1M-4.4-.6H-1M-4.4 1H-1.6M1-2.2H4.4M1-.6H4.4" stroke="#93c5fd" strokeWidth=".45" />
          </g>

          {/* el lapizote del techo */}
          <rect x="196" y="56" width="1.4" height="6" fill="#64748b" />
          <rect x="220" y="56" width="1.4" height="6" fill="#64748b" />
          <g transform="translate(186 53.4)">
            <rect x="5" y="-3.4" width="30" height="6.8" fill="#facc15" />
            <rect x="5" y="-3.4" width="30" height="2.2" fill="#fde68a" />
            <rect x="5" y="1.4" width="30" height="2" fill="#eab308" />
            <path d="M5-3.4L-3 0L5 3.4Z" fill="#f3d2a2" />
            <path d="M-.4-1.1L-3 0L-.4 1.1Z" fill="#334155" />
            <rect x="35" y="-3.6" width="3.4" height="7.2" fill="#cbd5e1" />
            <rect x="38.4" y="-3.4" width="4.6" height="6.8" rx="1.6" fill="#f9a8d4" />
          </g>

          {/* ---------- el mostrador-vitrina ---------- */}
          <rect x="92" y="108" width="136" height="38" fill={u('mo')} />
          <rect x="94" y="110" width="130" height="25" rx="1.5" fill={u('vi')} />
          {/* nivel de arriba: cuadernos de colores parados */}
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i} transform={`translate(${99.4 + i * 9} 121.4)`}>
              <Cuaderno c={COLORES_LIBRO[(i * 5) % COLORES_LIBRO.length]} w={7.4} h={9.4} />
            </g>
          ))}
          <rect x="94" y="121.4" width="130" height="1.2" fill="#c7d5ea" />
          {/* nivel de abajo: estuches, cajas de colores, pegamentos y tijeras */}
          {Array.from({ length: 6 }, (_, i) => {
            const x = 100 + i * 21
            return (
              <g key={i}>
                {/* estuche con su cierre */}
                <rect x={x - 4.6} y="128.2" width="9.2" height="5" rx="2.4" fill={i % 2 ? '#a855f7' : '#14b8a6'} />
                <path d={`M${x - 3.2} 129.6H${x + 3.2}`} stroke="#fff" strokeWidth=".45" strokeDasharray=".6 .4" />
                {/* caja de colores */}
                <rect x={x + 5.6} y="126.4" width="6.4" height="6.8" rx=".4" fill="#fff" />
                {['#ef4444', '#22c55e', '#3b82f6'].map((c, k) => (
                  <rect key={c} x={x + 6.4 + k * 1.8} y="127.2" width="1.2" height="3.2" fill={c} />
                ))}
                {/* pegamento en barra */}
                <rect x={x + 13.4} y="126" width="2.6" height="7.2" rx=".8" fill={i % 2 ? '#f43f5e' : '#facc15'} />
                <rect x={x + 13.4} y="126" width="2.6" height="1.8" rx=".8" fill="#e2e8f0" />
              </g>
            )
          })}
          <rect x="94" y="133.2" width="130" height="1.2" fill="#c7d5ea" />
          {/* reflejo del vidrio y el brillo que lo cruza */}
          <path d="M94 110H124L108 135H94Z" fill="#fff" opacity=".24" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(80 110)">
              <g className="esc-lib-brillo" style={v({ '--d': '158px' })}>
                <path d="M0 0H9L-1 25H-10Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          <rect x="92" y="135" width="136" height="11" fill={u('mo')} />
          {[96, 129, 162, 195].map((x) => (
            <rect key={x} x={x} y="137.4" width="28" height="6.4" rx="1.2" fill="#0b1b4d" opacity=".25" />
          ))}
          <rect x="88" y="104" width="144" height="5" rx="2.2" fill={u('ma')} />
          <rect x="90" y="104.6" width="140" height="1.2" rx=".6" fill="#f1d3a8" />

          {/* los vasos de lápices y de bolígrafos */}
          <g transform="translate(99 104)">
            <VasoLapices
              c="#ef4444"
              puntas={[
                [-2.4, -14, '#22c55e'],
                [0, -3, '#3b82f6'],
                [2.2, 10, '#f59e0b'],
                [-1, 4, '#a855f7'],
              ]}
            />
          </g>
          <g transform="translate(110.4 104)">
            <VasoLapices
              c="#0f766e"
              w={7.6}
              puntas={[
                [-1.8, -10, '#1e3a8a'],
                [1.6, 8, '#dc2626'],
                [0, -1, '#111827'],
              ]}
            />
          </g>

          {/* la lista escolar: aparece, se va tildando y se guarda */}
          <g className="esc-lib-lista">
            <path d="M126 104L129 92M138 104L135 92" stroke="#7c5a35" strokeWidth=".9" />
            <rect x="119.6" y="79.6" width="24.8" height="24.4" rx="1.6" fill="#b07a43" />
            <rect x="121.2" y="82.2" width="21.6" height="21" rx=".6" fill="#fff" />
            <rect x="127" y="78.2" width="10" height="3.8" rx="1" fill="#94a3b8" />
            <rect x="128.4" y="78.9" width="7.2" height="1.2" rx=".6" fill="#e2e8f0" />
            <text x="132" y="88.2" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#1e3a8a" textLength="17" lengthAdjust="spacingAndGlyphs">
              LISTA
            </text>
            {[90.6, 94.8, 99].map((y) => (
              <g key={y}>
                <rect x="123" y={y} width="2.8" height="2.8" rx=".4" fill="#fff" stroke="#94a3b8" strokeWidth=".4" />
                <path d={`M131.6 ${y + 1.4}H140.6`} stroke="#e2e8f0" strokeWidth=".6" />
              </g>
            ))}
            {/* los íconos de cada renglón: cuaderno, lápiz, regla */}
            <rect x="127.2" y="90.7" width="3" height="2.6" rx=".3" fill="#e11d48" />
            <path d="M127 96.2H130.4" stroke="#f59e0b" strokeWidth="1.1" />
            <path d="M130.4 95.65L131.4 96.2L130.4 96.75Z" fill="#f3d2a2" />
            <rect x="127" y="99.8" width="4.2" height="1.2" fill="#facc15" />
            {/* los tildes */}
            {[90.6, 94.8, 99].map((y, i) => (
              <g key={y} transform={`translate(124.4 ${y + 1.4})`}>
                <path className={`esc-lib-tilde esc-lib-tilde-${i + 1}`} d="M-1 0L-.1 .9L1.6-1.2" fill="none" stroke="#16a34a" strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
          </g>

          {/* el QR de cobro, parado en el mostrador */}
          <rect x="182.6" y="101.4" width="9" height="3" rx="1" fill="#1e3a8a" />
          <rect x="180.6" y="89" width="13" height="13.4" rx="1.6" fill="#fff" />
          <path
            d="M182.6 91h3.6v3.6h-3.6zM188 91h3.6v3.6h-3.6zM182.6 96.4h3.6v3.6h-3.6zM188.4 96.8h1.4v1.4h-1.4zM190.2 98.6h1.4v1.4h-1.4zM188.4 99.2h1.4v.8h-1.4z"
            fill="#1e3a8a"
          />

          {/* la bolsa: el fondo, el asa de atrás y lo que ya está adentro */}
          <g className="esc-lib-bolsa">
            <path d="M204.6 85C204.6 78 215.4 78 215.4 85" fill="none" stroke="#7a4a1e" strokeWidth="1" />
            <path d="M199.4 84.4H220.6L220.4 86.2H199.6Z" fill="#5c3b1c" />
            <g className="esc-lib-contenido">
              <g className="esc-lb-fijo" transform="translate(211 81) rotate(-62)">
                <Regla l={14} />
              </g>
              <g className="esc-lb-fijo" transform="translate(204 88) rotate(-8)">
                <Lapiz c="#ef4444" l={11} />
              </g>
              <g className="esc-lb-fijo" transform="translate(206.4 88) rotate(6)">
                <Lapiz c="#22c55e" l={10} />
              </g>
              <rect x="213" y="80.6" width="6" height="5" rx=".6" fill="#e11d48" />
            </g>
          </g>
        </g>

        {/* ---------- el pedido que se arma y vuela a la bolsa ---------- */}
        <g className="esc-lib-flota">
          <g transform="translate(163 104)">
            <g className="esc-lib-vuelo-x">
              <g className="esc-lib-vuelo-y">
                <g className="esc-lib-item esc-lib-item-1">
                  <g transform="translate(-4 0)">
                    <rect x="-7.1" y="-17.6" width="14.2" height="18.2" rx="1.4" fill="#fff" />
                    <Cuaderno c="#e11d48" />
                  </g>
                </g>
                <g className="esc-lib-item esc-lib-item-2">
                  {/* la caja de lápices de colores, con las puntas que asoman */}
                  {['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'].map((c, i) => (
                    <g key={c} transform={`translate(${5.9 + i * 1.9} -10)`}>
                      <rect x="-.8" y="-3.4" width="1.6" height="3.4" fill={c} />
                      <path d="M-.8-3.4L0-5.4L.8-3.4Z" fill="#f3d2a2" />
                      <path d="M-.3-4.4L0-5.4L.3-4.4Z" fill={c} />
                    </g>
                  ))}
                  <rect x="4.4" y="-12" width="9" height="12" rx=".8" fill="#fffbeb" stroke="#fff" strokeWidth=".6" />
                  <rect x="4.4" y="-12" width="9" height="3" rx=".8" fill="#f97316" />
                  {['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'].map((c, i) => (
                    <rect key={c} x={5.4 + i * 1.5} y="-7" width="1.2" height="4.4" rx=".3" fill={c} />
                  ))}
                  <rect x="4.4" y="-1.6" width="9" height="1.6" fill="#f97316" opacity=".8" />
                </g>
                <g className="esc-lib-item esc-lib-item-3">
                  <g className="esc-lb-fijo" transform="translate(2 -2.4) rotate(-12)">
                    <Regla />
                  </g>
                </g>
              </g>
            </g>
          </g>

          {/* el frente de la bolsa (rebota junto con el fondo) */}
          <g className="esc-lib-bolsa">
            <path d="M199 85.2H221L222 104.4H198Z" fill={u('bo')} />
            <path d="M199 85.2L201 86.8L203 85.2L205 86.8L207 85.2L209 86.8L211 85.2L213 86.8L215 85.2L217 86.8L219 85.2L221 86.8L221.1 88H198.9Z" fill="#9c6a35" opacity=".4" />
            <path d="M198 104.4L199 85.2H201.6L201 104.4Z" fill="#fff" opacity=".25" />
            <path d="M204.6 86C204.6 80.4 215.4 80.4 215.4 86" fill="none" stroke="#a86c31" strokeWidth="1" />
            {/* el sello: un lápiz en un círculo */}
            <circle cx="210" cy="96" r="4" fill="#1e3a8a" />
            <g className="esc-lb-fijo" transform="translate(210 96) rotate(40)">
              <rect x="-.8" y="-2.6" width="1.6" height="4" fill="#f59e0b" />
              <path d="M-.8 1.4L0 3L.8 1.4Z" fill="#334155" />
            </g>
          </g>
          {/* la venta: aro y destellos sobre la bolsa */}
          <ellipse className="esc-lib-aro" cx="210" cy="104" rx="13" ry="4" fill="none" stroke="#2563eb" strokeWidth="1.3" />
          <g transform="translate(196 80)">
            <path className="esc-lib-chispa" d={ESTRELLA} fill="#facc15" />
          </g>
          <g transform="translate(225 77)">
            <path className="esc-lib-chispa" d={ESTRELLA} fill="#93c5fd" style={{ animationDelay: '-6.35s' }} />
          </g>

          {/* ---------- la fotocopiadora (izquierda) ---------- */}
          {/* las resmas al lado */}
          <g transform="translate(70 146)">
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={-6.4 + (i % 2) * 0.6} y={-4.4 * (i + 1)} width="12.8" height="4.4" rx=".4" fill="#fff" stroke="#e2e8f0" strokeWidth=".3" />
                <rect x={-1.6 + (i % 2) * 0.6} y={-4.4 * (i + 1)} width="3.6" height="4.4" fill={['#3b82f6', '#22c55e', '#ef4444'][i]} opacity=".85" />
              </g>
            ))}
          </g>
          {/* el mueble con sus bandejas de papel */}
          <rect x="18" y="108" width="44" height="34" rx="1.6" fill={u('fc')} />
          {[111.4, 122.4].map((y) => (
            <g key={y}>
              <rect x="20.4" y={y} width="39.2" height="9.4" rx="1" fill="#eef2f7" stroke="#cbd5e1" strokeWidth=".4" />
              <rect x="34" y={y + 3.6} width="12" height="1.6" rx=".8" fill="#94a3b8" />
            </g>
          ))}
          <rect x="18" y="134.4" width="44" height="8" rx="1" fill="#94a3b8" />
          <rect x="18" y="134.4" width="44" height="1" fill="#fff" opacity=".35" />
          {[22, 58].map((x) => (
            <circle key={x} cx={x} cy="143.6" r="1.8" fill="#334155" />
          ))}
          <rect x="18.6" y="108.6" width="2" height="25" rx="1" fill="#fff" opacity=".55" />
          {/* el cuerpo de impresión con su rótulo */}
          <rect x="16" y="97" width="48" height="12" rx="1.6" fill={u('ft')} />
          <rect x="16.6" y="97.6" width="46.8" height="1" rx=".5" fill="#fff" opacity=".6" />
          <rect x="20" y="100" width="25" height="7" rx="1" fill="#fff" />
          <text x="32.5" y="105.3" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#1e3a8a" textLength="21" lengthAdjust="spacingAndGlyphs">
            COPIAS
          </text>
          <rect x="48" y="101.6" width="12" height="1.4" rx=".7" fill="#64748b" />
          <rect x="48" y="104.2" width="12" height="1.4" rx=".7" fill="#64748b" opacity=".6" />
          {/* la tapa del vidrio y la luz de escaneo que corre debajo */}
          <rect x="16" y="96.2" width="38" height="1.4" fill="#0f172a" opacity=".55" />
          <g clipPath={`url(#${g('cf')})`}>
            <g className="esc-lib-escaneo">
              <rect x="14" y="96.2" width="8" height="1.4" fill={u('es')} />
            </g>
          </g>
          <path d="M14.6 93.2H54L55 96.2H13.6Z" fill="#475569" />
          <path d="M15.4 93.2H53.4" stroke="#94a3b8" strokeWidth=".5" />
          {/* el panel de control, inclinado */}
          <path d="M54 91.4H64.6L66 97H54.6Z" fill="#334155" />
          <rect x="55.4" y="92.4" width="5.4" height="2.8" rx=".4" fill="#34d399" />
          <path d="M56 93.4H59.4M56 94.3H58.2" stroke="#065f46" strokeWidth=".35" />
          <circle className="esc-lib-led" cx="63" cy="93" r=".75" fill="#4ade80" />
          <circle cx="62.6" cy="95.4" r=".7" fill="#94a3b8" />
          <circle cx="64.6" cy="95.4" r=".7" fill="#f87171" />
          {/* la bandeja de salida (a la izquierda) con las copias apiladas */}
          <path d="M16.4 103.6L5.6 106.2V107.6L16.4 105.4Z" fill="#94a3b8" />
          <path d="M16 103L7.4 105L8 105.6L16 103.8Z" fill="#fff" />
          <path d="M16 102.4L7.8 104.3L8.4 104.9L16 103.2Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth=".2" />
          <g className="esc-lib-hoja">
            <path d="M17 101.4L8.4 103.4L9 104L17 102.2Z" fill="#fff" stroke="#cbd5e1" strokeWidth=".2" />
            <path d="M15 102.2L11 103.1" stroke="#94a3b8" strokeWidth=".25" />
          </g>

          {/* ---------- el canasto de papelógrafos y el globo terráqueo (derecha) ---------- */}
          <g transform="translate(244 146)">
            {[
              [-4, -31, -10, '#f472b6'],
              [0, -34, 2, '#38bdf8'],
              [4, -30, 12, '#facc15'],
              [-1, -27, -4, '#4ade80'],
            ].map(([x, y, r, c]) => (
              <g key={c as string} className="esc-lb-fijo" transform={`translate(${x} ${y}) rotate(${r})`}>
                <rect x="-2" y="0" width="4" height="28" rx="1" fill={c as string} />
                <rect x="-2" y="0" width="1.2" height="28" fill="#fff" opacity=".35" />
                <ellipse cx="0" cy="0" rx="2" ry=".9" fill="#fff" />
                <path d="M-.9 0a.9.4 0 1 0 1.8 0" fill="none" stroke={c as string} strokeWidth=".4" />
              </g>
            ))}
            <path d="M-9-16H9L7.4 0H-7.4Z" fill={u('ce')} />
            {[-12, -8, -4].map((y) => (
              <path key={y} d={`M${-9 + (16 + y) * 0.1} ${y}H${9 - (16 + y) * 0.1}`} stroke="#8a5a26" strokeWidth=".6" opacity=".7" />
            ))}
            <rect x="-10" y="-17.2" width="20" height="2.6" rx="1.3" fill="#e7b472" />
            <path d="M-8.2-15V-1" stroke="#fff" strokeWidth="1.2" opacity=".15" />
          </g>
          <g transform="translate(268 146)">
            <PilaLibros
              libros={[
                [34, 5, '#dc2626'],
                [30, 4.6, '#1d4ed8'],
                [26, 4.4, '#15803d'],
              ]}
            />
          </g>
          {/* el globo: el mar, los continentes que pasan (giro) y la sombra del lado oscuro */}
          <ellipse cx="268" cy="132.2" rx="7" ry="1.6" fill="#78350f" />
          <ellipse cx="268" cy="131.6" rx="6" ry="1.1" fill="#b45309" />
          <rect x="267" y="125" width="2" height="6.8" fill="#a16207" />
          <circle cx="268" cy="114" r="11.4" fill={u('mar')} />
          <g clipPath={`url(#${g('cg')})`}>
            <g className="esc-lib-globo">
              {[0, 46].map((o) => (
                <g key={o} transform={`translate(${o} 0)`}>
                  <path d="M258 106C261 104 265 105 266 108C267 111 264 112 263 115C262 118 259 119 258 116C257 113 255 109 258 106Z" fill="#4ade80" />
                  <path d="M262 117C264 116 266 118 265.6 121C265.2 124 263 125.6 262 123.6C261.2 122 260.6 118 262 117Z" fill="#22c55e" />
                  <path d="M272 104C276 103 281 105 282 108C283 111 279 111 277 113C275 115 272 113 271.6 110C271.2 107 270 105 272 104Z" fill="#a3e635" />
                  <path d="M276 116C279 115.4 281 117.6 280 120C279 122 276.4 121.6 275.4 120C274.6 118.6 274.8 116.4 276 116Z" fill="#4ade80" />
                  <path d="M285 112C288 111 291 113 290 116C289 119 286 118 285 116Z" fill="#facc15" opacity=".85" />
                  <path d="M296 105C299 104 302 107 301 110C300 112 297 111 296 109Z" fill="#86efac" />
                </g>
              ))}
            </g>
          </g>
          <circle cx="268" cy="114" r="11.4" fill={u('so')} />
          <ellipse cx="264" cy="108.6" rx="3.4" ry="2.2" fill="#fff" opacity=".35" />
          {/* el meridiano de bronce */}
          <path d="M268 101.2A12.8 12.8 0 0 0 268 126.8" fill="none" stroke="#b45309" strokeWidth="1.2" />
          <path d="M268 101.2A12.8 12.8 0 0 0 268 126.8" fill="none" stroke="#fcd34d" strokeWidth=".4" />
          <circle cx="268" cy="101.6" r=".9" fill="#fcd34d" />
        </g>
      </svg>
      <Aviso etiqueta="Lista escolar" texto="Bs 25" tono="azul" />
    </Marco>
  )
}

/* ======================================================================
   Bazar
   ====================================================================== */

/** Olla de ancho `w` con su tapa y sus asas, con la base en (0, 0). */
function Olla({ c, borde, tapa, w = 14 }: { c: string; borde: string; tapa: string; w?: number }) {
  const r = w / 2
  const h = w * 0.48
  return (
    <g>
      <path d={`M${-r - 2.2} ${-h + 1.2}H${-r}V${-h + 2.8}H${-r - 2.2}Z M${r} ${-h + 1.2}H${r + 2.2}V${-h + 2.8}H${r}Z`} fill={borde} />
      <path d={`M${-r} ${-h}H${r}V-1.8C${r} -.6 ${r - 1.2} 0 ${r - 2.6} 0H${-r + 2.6}C${-r + 1.2} 0 ${-r} -.6 ${-r} -1.8Z`} fill={c} />
      <rect x={-r + 1} y={-h + 0.8} width="1.2" height={h - 2.2} rx=".6" fill="#fff" opacity=".55" />
      <path d={`M${-r} ${-h * 0.4}H${r}`} stroke={borde} strokeWidth=".5" opacity=".6" />
      <rect x={-r - 0.7} y={-h - 1.1} width={w + 1.4} height="1.5" rx=".7" fill={borde} />
      <path d={`M${-r + 0.4} ${-h - 1.1}C${-r + 1.6} ${-h - 4.2} ${r - 1.6} ${-h - 4.2} ${r - 0.4} ${-h - 1.1}Z`} fill={tapa} />
      <path d={`M${-r + 2} ${-h - 2.2}C${-r + 3} ${-h - 3.4} -1 ${-h - 3.6} 0 ${-h - 3.6}`} fill="none" stroke="#fff" strokeWidth=".5" opacity=".7" />
      <rect x="-1.4" y={-h - 5.2} width="2.8" height="1.5" rx=".7" fill="#1f2937" />
    </g>
  )
}

/** Tetera (pava) con la base en (0, 0). */
function Tetera({ c }: { c: string }) {
  return (
    <g>
      <path d="M3.6-5.6L7.2-8.6L7.6-8L4.6-3.6Z" fill={c} />
      <path d="M-2.6-9C-5.4-9-5.4-4.6-4-4.4" fill="none" stroke="#1f2937" strokeWidth=".9" />
      <path d="M-4.6-1C-5.4-6 -3-8.6 0-8.6C3-8.6 5.4-6 4.6-1C4.4 0 -4.4 0 -4.6-1Z" fill={c} />
      <ellipse cx="0" cy="-8.6" rx="2.6" ry=".8" fill="#1f2937" opacity=".6" />
      <circle cx="0" cy="-9.6" r=".9" fill="#1f2937" />
      <path d="M-3.4-2.4C-3.8-5 -2.6-7 -1-7.4" fill="none" stroke="#fff" strokeWidth=".7" opacity=".6" strokeLinecap="round" />
    </g>
  )
}

/** Balde de plástico con su asa, con la base en (0, 0). */
function Balde({ c, w = 10 }: { c: string; w?: number }) {
  const r = w / 2
  const h = w
  return (
    <g>
      <path d={`M${-r + 0.4} ${-h + 0.6}C${-r + 0.4} ${-h - 5.4} ${r - 0.4} ${-h - 5.4} ${r - 0.4} ${-h + 0.6}`} fill="none" stroke="#475569" strokeWidth=".6" />
      <path d={`M${-r} ${-h}H${r}L${r - 1.2} 0H${-r + 1.2}Z`} fill={c} />
      <rect x={-r - 0.5} y={-h - 0.6} width={w + 1} height="1.6" rx=".6" fill={c} />
      <rect x={-r - 0.5} y={-h - 0.6} width={w + 1} height="1.6" rx=".6" fill="#fff" opacity=".3" />
      <path d={`M${-r + 0.4} ${-h * 0.62}H${r - 0.4}M${-r + 0.8} ${-h * 0.3}H${r - 0.8}`} stroke="#000" strokeWidth=".4" opacity=".15" />
      <path d={`M${-r + 1.2} ${-h + 1.4}L${-r + 2} -1`} stroke="#fff" strokeWidth=".9" opacity=".4" strokeLinecap="round" />
    </g>
  )
}

/** Tápers apilados (cuerpo transparente, tapas de color), con la base en (0, 0). */
function Tapers({ tapas }: { tapas: string[] }) {
  let y = 0
  return (
    <g>
      {tapas.map((c, i) => {
        const w = 11 - i * 1.6
        const h = 3.4
        y -= h + 1
        return (
          <g key={i}>
            <rect x={-w / 2} y={y + 1} width={w} height={h} rx=".8" fill="#e0f2fe" opacity=".95" />
            <rect x={-w / 2 + 0.6} y={y + 1.6} width="1" height={h - 1.2} rx=".4" fill="#fff" />
            <rect x={-w / 2 - 0.3} y={y} width={w + 0.6} height="1.2" rx=".5" fill={c} />
          </g>
        )
      })}
    </g>
  )
}

/** Palanganas apiladas, de abajo hacia arriba, con la base en (0, 0). */
function Palanganas({ colores, w = 16 }: { colores: string[]; w?: number }) {
  return (
    <g>
      {colores.map((c, i) => {
        const y = -i * 1.8
        return (
          <g key={c}>
            <path d={`M${-w / 2} ${y - 4.4}H${w / 2}L${w / 2 - 2} ${y}H${-w / 2 + 2}Z`} fill={c} />
            <rect x={-w / 2 - 0.6} y={y - 5} width={w + 1.2} height="1.2" rx=".6" fill={c} />
            <rect x={-w / 2 - 0.6} y={y - 5} width={w + 1.2} height=".5" rx=".25" fill="#fff" opacity=".4" />
          </g>
        )
      })}
    </g>
  )
}

/** Pelota de dos colores con su gajo curvo, con la base en (0, 0). */
function Pelota({ r = 4, c, c2 }: { r?: number; c: string; c2: string }) {
  return (
    <g>
      <circle cx="0" cy={-r} r={r} fill={c} />
      <path d={`M${-r * 0.9} ${-r * 1.4}C${-r * 0.2} ${-r * 0.9} ${r * 0.2} ${-r * 1.1} ${r * 0.9} ${-r * 0.6}L${r * 0.6} ${-r * 0.2}C0 ${-r * 0.6} ${-r * 0.5} ${-r * 0.4} ${-r} ${-r * 0.8}Z`} fill={c2} />
      <circle cx={-r * 0.35} cy={-r * 1.4} r={r * 0.28} fill="#fff" opacity=".55" />
    </g>
  )
}

/** Osito de peluche sentado, con la base en (0, 0). */
function Osito({ c, c2 = '#fde7c8', lazo = '#ef4444' }: { c: string; c2?: string; lazo?: string }) {
  return (
    <g>
      <ellipse cx="-2.8" cy="-1.2" rx="1.9" ry="1.3" fill={c} />
      <ellipse cx="2.8" cy="-1.2" rx="1.9" ry="1.3" fill={c} />
      <ellipse cx="0" cy="-3.8" rx="3.6" ry="3.6" fill={c} />
      <ellipse cx="0" cy="-3.4" rx="2" ry="2.2" fill={c2} />
      <ellipse cx="-3.6" cy="-4.4" rx="1.1" ry="1.7" fill={c} />
      <ellipse cx="3.6" cy="-4.4" rx="1.1" ry="1.7" fill={c} />
      <circle cx="-2.4" cy="-11.6" r="1.4" fill={c} />
      <circle cx="2.4" cy="-11.6" r="1.4" fill={c} />
      <circle cx="-2.4" cy="-11.6" r=".7" fill={c2} />
      <circle cx="2.4" cy="-11.6" r=".7" fill={c2} />
      <circle cx="0" cy="-9.4" r="3.2" fill={c} />
      <ellipse cx="0" cy="-8.6" rx="1.5" ry="1.1" fill={c2} />
      <circle cx="0" cy="-9" r=".45" fill="#1f2937" />
      <circle cx="-1.2" cy="-10.2" r=".4" fill="#1f2937" />
      <circle cx="1.2" cy="-10.2" r=".4" fill="#1f2937" />
      <path d="M-1.4-6.6L0-6L1.4-6.6V-5.2L0-5.8L-1.4-5.2Z" fill={lazo} />
      <circle cx="-1" cy="-11" r=".9" fill="#fff" opacity=".3" />
    </g>
  )
}

/** Autito de juguete, de perfil, con la base en (0, 0). */
function Autito({ c }: { c: string }) {
  return (
    <g>
      <path d="M-6-1.6V-4C-6-4.8-5.4-5.2-4.6-5.2H-3L-1.4-7.6H2.4L4.2-5.2H5.2C5.8-5.2 6.2-4.8 6.2-4.2V-1.6Z" fill={c} />
      <path d="M-.9-7H.4V-5.2H-2.2ZM1.2-7H2.1L3.4-5.2H1.2Z" fill="#bae6fd" />
      <rect x="-5.6" y="-4.4" width="11" height=".6" fill="#fff" opacity=".4" />
      {[-3.4, 3.4].map((x) => (
        <g key={x}>
          <circle cx={x} cy="-1.4" r="1.6" fill="#1f2937" />
          <circle cx={x} cy="-1.4" r=".6" fill="#cbd5e1" />
        </g>
      ))}
    </g>
  )
}

/** Robot de juguete con su antena, con la base en (0, 0). */
function Robot() {
  return (
    <g>
      <rect x="-3" y="-1.6" width="2" height="1.6" fill="#64748b" />
      <rect x="1" y="-1.6" width="2" height="1.6" fill="#64748b" />
      <rect x="-3.6" y="-7.4" width="7.2" height="5.8" rx="1" fill="#94a3b8" />
      <rect x="-2" y="-6" width="4" height="2.4" rx=".4" fill="#38bdf8" />
      <rect x="-5" y="-6.8" width="1.4" height="3.6" rx=".6" fill="#64748b" />
      <rect x="3.6" y="-6.8" width="1.4" height="3.6" rx=".6" fill="#64748b" />
      <rect x="-2.8" y="-11.6" width="5.6" height="4" rx="1" fill="#cbd5e1" />
      <circle cx="-1.2" cy="-9.6" r=".7" fill="#ef4444" />
      <circle cx="1.2" cy="-9.6" r=".7" fill="#ef4444" />
      <path d="M0-11.6V-13" stroke="#64748b" strokeWidth=".5" />
      <circle cx="0" cy="-13.4" r=".6" fill="#facc15" />
    </g>
  )
}

/** Caja de juguete con ventanita (una muñeca adentro), con la base en (0, 0). */
function CajaJuguete({ c }: { c: string }) {
  return (
    <g>
      <rect x="-4.6" y="-12" width="9.2" height="12" rx=".6" fill={c} />
      <rect x="-3.4" y="-10.4" width="6.8" height="7.6" rx=".6" fill="#fdf2f8" />
      <circle cx="0" cy="-8.4" r="1.5" fill="#fcd9b6" />
      <path d="M-1.6-8.8C-1.8-10.6 1.8-10.6 1.6-8.8C1.2-9.8-1.2-9.8-1.6-8.8Z" fill="#a16207" />
      <path d="M-1.6-3V-6.2C-1.6-6.8-1-7 0-7C1-7 1.6-6.8 1.6-6.2V-3Z" fill="#f472b6" />
      <rect x="-3.4" y="-10.4" width="2" height="7.6" fill="#fff" opacity=".35" />
      <rect x="-4.6" y="-1.8" width="9.2" height="1.8" fill="#fff" opacity=".3" />
    </g>
  )
}

/** Basurero de tapa vaivén, con la base en (0, 0). */
function Basurero({ c, h = 14 }: { c: string; h?: number }) {
  return (
    <g>
      <path d={`M-4.6 ${-h + 3}H4.6L3.8 0H-3.8Z`} fill={c} />
      <path d={`M-5 ${-h + 3}C-5 ${-h - 0.6} 5 ${-h - 0.6} 5 ${-h + 3}Z`} fill={c} />
      <path d={`M-5 ${-h + 3}C-5 ${-h - 0.6} 5 ${-h - 0.6} 5 ${-h + 3}Z`} fill="#000" opacity=".12" />
      <rect x="-2.6" y={-h + 0.8} width="5.2" height="1.2" rx=".4" fill="#0f172a" opacity=".45" />
      <path d={`M-3.4 ${-h + 4.4}L-2.8 -1.2`} stroke="#fff" strokeWidth="1" opacity=".35" strokeLinecap="round" />
    </g>
  )
}

/** Canasta de ropa calada, con la base en (0, 0). */
function Canasta({ c, w = 16 }: { c: string; w?: number }) {
  const r = w / 2
  return (
    <g>
      <path d={`M${-r} -10H${r}L${r - 1.4} 0H${-r + 1.4}Z`} fill={c} />
      {[-7.4, -4.6, -1.8].map((y) => (
        <g key={y}>
          {Array.from({ length: Math.floor(w / 3) }, (_, i) => (
            <rect key={i} x={-r + 1.8 + i * 3} y={y} width="1.6" height="1.4" rx=".4" fill="#0f172a" opacity=".25" />
          ))}
        </g>
      ))}
      <rect x={-r - 0.6} y="-10.6" width={w + 1.2} height="1.6" rx=".6" fill={c} />
      <rect x={-r - 0.6} y="-10.6" width={w + 1.2} height=".6" rx=".3" fill="#fff" opacity=".4" />
    </g>
  )
}

/**
 * Caja de importación de cartón en tres cuartos (frente, costado y tapa), con
 * la esquina de abajo a la izquierda en (0, 0): flechas de "este lado arriba",
 * copa de frágil, etiqueta con código de barras y sello de aduana.
 */
function CajaCarton({ w, h, sello = '#dc2626', fragil = false, carton }: { w: number; h: number; sello?: string; fragil?: boolean; carton: string }) {
  return (
    <g>
      <path d={`M${w} ${-h}L${w + 5} ${-h - 3.6}V-3.6L${w} 0Z`} fill="#b07a43" />
      <path d={`M0 ${-h}L5 ${-h - 3.6}H${w + 5}L${w} ${-h}Z`} fill="#e6bb83" />
      <path d={`M${w / 2 - 1.4} ${-h}L${w / 2 + 3.6} ${-h - 3.6}H${w / 2 + 6.4}L${w / 2 + 1.4} ${-h}Z`} fill="#d9c7a6" opacity=".9" />
      <rect x="0" y={-h} width={w} height={h} fill={carton} />
      <rect x={w / 2 - 1.4} y={-h} width="2.8" height={Math.min(7, h * 0.3)} fill="#d9c7a6" opacity=".9" />
      <rect x="0" y={-h} width="1.6" height={h} fill="#fff" opacity=".18" />
      <g transform={`translate(${w * 0.12 + 1} ${-h + 5})`}>
        {[0, 3].map((x) => (
          <path key={x} d={`M${x} 0L${x + 1.4} -2.2L${x + 2.8} 0H${x + 1.9}V2.4H${x + 0.9}V0Z`} fill="#3f2a14" opacity=".75" />
        ))}
      </g>
      {fragil && (
        <g transform={`translate(${w * 0.82} ${-h + 5.4})`}>
          <path d="M-1.6-2.6H1.6C1.6-.4 .8.4 0 .4C-.8.4-1.6-.4-1.6-2.6Z" fill="none" stroke="#3f2a14" strokeWidth=".55" opacity=".75" />
          <path d="M0 .4V2.4M-1 2.4H1" stroke="#3f2a14" strokeWidth=".55" opacity=".75" />
        </g>
      )}
      {w > 20 && (
        <>
          <rect x={w * 0.12} y={-h * 0.62} width={w * 0.36} height={h * 0.3} rx=".4" fill="#fff" />
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={w * 0.12 + 1 + (i * (w * 0.36 - 2)) / 7} y={-h * 0.62 + 1} width={i % 3 ? 0.5 : 0.9} height={h * 0.3 - 2.4} fill="#1f2937" />
          ))}
        </>
      )}
      <circle cx={w * 0.72} cy={-h * 0.48} r={Math.min(4, h * 0.18)} fill="none" stroke={sello} strokeWidth=".7" opacity=".8" />
      <circle cx={w * 0.72} cy={-h * 0.48} r={Math.min(4, h * 0.18) - 1.1} fill="none" stroke={sello} strokeWidth=".4" opacity=".8" />
      <circle cx={w * 0.72} cy={-h * 0.48} r=".8" fill={sello} opacity=".8" />
    </g>
  )
}

/** Silla de plástico de frente (en el bazar se venden apiladas), con la base en (0, 0). */
function Silla({ c }: { c: string }) {
  return (
    <g>
      <path d="M-9 0L-7-10M9 0L7-10" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-8-24C-8-26 8-26 8-24L7-12H-7Z" fill={c} />
      {[-21, -18, -15].map((y) => (
        <rect key={y} x="-4.6" y={y} width="9.2" height="1.1" rx=".5" fill="#000" opacity=".18" />
      ))}
      <path d="M-10-10.6H10L9-8.6H-9Z" fill={c} />
      <path d="M-10-10.6H10" stroke="#fff" strokeWidth=".5" opacity=".45" />
    </g>
  )
}

type Pieza =
  | ['osito', string]
  | ['pelota', string, string]
  | ['robot']
  | ['caja', string]
  | ['olla', string, string, string, number]
  | ['tetera', string]
  | ['balde', string]
  | ['tapers', string[]]
  | ['palanganas', string[]]
  | ['auto', string]
  | ['basurero', string]
  | ['canasta', string]

function PiezaBazar({ p }: { p: Pieza }) {
  switch (p[0]) {
    case 'osito':
      return <Osito c={p[1]} />
    case 'pelota':
      return <Pelota c={p[1]} c2={p[2]} r={4.2} />
    case 'robot':
      return <Robot />
    case 'caja':
      return <CajaJuguete c={p[1]} />
    case 'olla':
      return <Olla c={p[1]} borde={p[2]} tapa={p[3]} w={p[4]} />
    case 'tetera':
      return <Tetera c={p[1]} />
    case 'balde':
      return <Balde c={p[1]} />
    case 'tapers':
      return <Tapers tapas={p[1]} />
    case 'palanganas':
      return <Palanganas colores={p[1]} w={14} />
    case 'auto':
      return <Autito c={p[1]} />
    case 'basurero':
      return <Basurero c={p[1]} />
    case 'canasta':
      return <Canasta c={p[1]} />
  }
}

/** La estantería: [base de la repisa, [x, pieza][]], de arriba hacia abajo (piso en 146). */
const REPISAS: [number, [number, Pieza][]][] = [
  [
    80,
    [
      [104, ['osito', '#b45309']],
      [115, ['osito', '#f9a8d4']],
      [126, ['pelota', '#ef4444', '#facc15']],
      [134.6, ['pelota', '#3b82f6', '#fff']],
      [148, ['osito', '#60a5fa']],
      [159.6, ['caja', '#ec4899']],
      [171, ['robot']],
      [182, ['osito', '#facc15']],
      [190.4, ['pelota', '#22c55e', '#fff']],
    ],
  ],
  [
    96,
    [
      [95, ['olla', '#e2e8f0', '#94a3b8', '#cbd5e1', 12]],
      [111, ['olla', '#dc2626', '#fff', '#ef4444', 11]],
      [125, ['tetera', '#0ea5e9']],
      [134.4, ['olla', '#e2e8f0', '#94a3b8', '#cbd5e1', 7]],
      [151, ['olla', '#f59e0b', '#fff', '#fbbf24', 12]],
      [165, ['tetera', '#ef4444']],
      [178.6, ['olla', '#e2e8f0', '#94a3b8', '#cbd5e1', 11]],
      [190.4, ['olla', '#16a34a', '#fff', '#22c55e', 6]],
    ],
  ],
  [
    112,
    [
      [92, ['balde', '#ef4444']],
      [104, ['balde', '#3b82f6']],
      [130, ['tapers', ['#22c55e', '#ec4899', '#f59e0b']]],
      [153, ['palanganas', ['#f472b6', '#38bdf8', '#a3e635']]],
      [170, ['tapers', ['#3b82f6', '#ef4444']]],
      [182, ['balde', '#22c55e']],
      [191, ['balde', '#a855f7']],
    ],
  ],
  [
    128,
    [
      [94, ['auto', '#ef4444']],
      [108, ['auto', '#2563eb']],
      [120, ['pelota', '#f97316', '#fff']],
      [132, ['caja', '#8b5cf6']],
      [150, ['robot']],
      [162, ['auto', '#facc15']],
      [175, ['caja', '#14b8a6']],
      [188, ['osito', '#a16207']],
    ],
  ],
  [
    146,
    [
      [96, ['palanganas', ['#22d3ee', '#f472b6', '#facc15', '#a78bfa']]],
      [114, ['basurero', '#16a34a']],
      [129, ['canasta', '#f472b6']],
      [154, ['canasta', '#38bdf8']],
      [171, ['basurero', '#ef4444']],
      [186, ['basurero', '#3b82f6']],
    ],
  ],
]

/** Huecos que llena la mercadería nueva: [x, base] del peluche y del balde. */
const HUECO_PELUCHE: [number, number] = [92, 80]
const HUECO_BALDE: [number, number] = [117, 112]
/** De dónde sale la mercadería (adentro de la caja, bajo su boca) y dónde se vende la olla. */
const CAJA: [number, number] = [47, 128]
const MOSTRADOR: [number, number] = [218, 112]

/**
 * Un bazar-importadora: el letrero, el toldo rojo, la estantería del piso al
 * techo repleta (peluches y pelotas, ollas y teteras, baldes, tápers y
 * palanganas, juguetes en caja, basureros y canastas), el mostrador con la
 * olla, los utensilios colgados y el QR; a la izquierda las sillas de plástico
 * apiladas y a la derecha las cajas de importación con flechas, copa de
 * frágil y sello de aduana, con un rehilete que gira arriba.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): entra el carrito de carga con una
 * caja, la caja se abre y la mercadería sube a su lugar: un peluche y un balde
 * a los huecos del estante (+3 de stock) y una olla al mostrador. El carrito se
 * va, entra la mano del cliente, levanta la olla y se la lleva: aro, el QR
 * dice pagado y llega el aviso de la venta. Mientras el aviso está arriba, lo
 * del estante "se vende" de a poco y los huecos esperan la próxima caja.
 */
export function EscenaBazar() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  /** Variables del vuelo caja → destino (las mismas para la capa x y la capa y). */
  const sube = (destino: [number, number], pico: number, retraso = '0s') =>
    ({
      ...v({ '--dx': `${destino[0] - CAJA[0]}px`, '--dy': `${destino[1] - CAJA[1]}px`, '--pk': `${pico}px` }),
      animationDelay: retraso,
    })

  return (
    <Marco fondo="bg-gradient-to-b from-rose-100 via-orange-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6ee" />
            <stop offset="1" stopColor="#f3dcc8" />
          </linearGradient>
          <linearGradient id={g('pr')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff8ef" />
            <stop offset="1" stopColor="#f1e3d0" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c7b299" />
            <stop offset="1" stopColor="#dcc9b1" />
          </linearGradient>
          <linearGradient id={g('in')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2a22" />
            <stop offset="1" stopColor="#5a4232" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e5e7eb" />
            <stop offset="1" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b91c1c" />
            <stop offset="1" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id={g('cj')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e2b57d" />
            <stop offset="1" stopColor="#c48d50" />
          </linearGradient>
          <linearGradient id={g('me')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f8fafc" />
            <stop offset=".4" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={g('tb')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c08457" />
            <stop offset="1" stopColor="#9a5f36" />
          </linearGradient>
        </defs>

        {/* plataforma: losa con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#e6c3a5" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".42" />
        <ellipse className="esc-baz-sombra" cx="156" cy="146.4" rx="80" ry="6" fill="#5a2c0c" opacity=".14" />
        <ellipse cx="18" cy="146.6" rx="16" ry="3" fill="#5a2c0c" opacity=".12" />
        <ellipse cx="266" cy="147" rx="34" ry="4" fill="#5a2c0c" opacity=".13" />

        <g className="esc-baz-flota">
          {/* ---------- las sillas de plástico apiladas (izquierda, atrás) ---------- */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(16 ${146 - i * 3.2})`}>
              <Silla c={i === 4 ? '#ef4444' : '#dc2626'} />
            </g>
          ))}

          {/* ---------- el local ---------- */}
          <path d="M70 64L80 60V146L70 149Z" fill={u('la')} />
          <rect x="80" y="58" width="152" height="88" fill={u('pr')} />
          <rect x="80" y="58" width="2.4" height="88" fill="#fff" opacity=".55" />
          {/* la estantería del piso al techo */}
          <rect x="84" y="66" width="112" height="80" rx="1.4" fill={u('in')} />
          <ellipse className="esc-baz-halo" cx="140" cy="68" rx="52" ry="5" fill="#ffd9a8" opacity=".45" />
          {REPISAS.map(([base, piezas]) => (
            <g key={base}>
              {piezas.map(([x, p]) => (
                <g key={x} transform={`translate(${x} ${base})`}>
                  <PiezaBazar p={p} />
                </g>
              ))}
            </g>
          ))}
          {/* los huecos que esperan mercadería */}
          {[HUECO_PELUCHE, HUECO_BALDE].map(([x, y]) => (
            <rect key={x} x={x - 5} y={y - 12.4} width="10" height="12" rx="1" fill="none" stroke="#fde7c8" strokeWidth=".5" strokeDasharray="1.2 1" opacity=".45" />
          ))}
          {[80, 96, 112, 128].map((y) => (
            <g key={y}>
              <rect x="84" y={y} width="112" height="1.8" fill={u('ma')} />
              <rect x="84" y={y} width="112" height=".5" fill="#fff" opacity=".7" />
              {/* las etiquetas de precio en el canto */}
              {[90, 113, 128, 151, 172, 188].map((x, i) => (
                <rect key={x} x={x} y={y + 0.3} width="3.6" height="1.3" rx=".2" fill={i % 2 ? '#fde047' : '#fff'} />
              ))}
            </g>
          ))}
          <rect x="139.2" y="66" width="1.8" height="80" fill={u('ma')} />
          <rect x="84" y="66" width="1.4" height="80" fill={u('ma')} />
          <rect x="194.6" y="66" width="1.4" height="80" fill={u('ma')} />

          {/* la pared del mostrador: utensilios colgados y el QR */}
          <rect x="199" y="68.6" width="31" height="1" rx=".5" fill="#64748b" />
          <g transform="translate(204.4 69.4)">
            <g className="esc-baz-cuelga">
              <path d="M0 0V7" stroke="#64748b" strokeWidth=".7" />
              <circle cx="0" cy="11" r="4.2" fill={u('me')} />
              <circle cx="0" cy="11" r="3.2" fill="none" stroke="#64748b" strokeWidth=".3" strokeDasharray=".5 .5" />
            </g>
          </g>
          <g transform="translate(214 69.4)">
            <g className="esc-baz-cuelga" style={{ animationDelay: '-.8s' }}>
              <path d="M0 0V12" stroke="#94a3b8" strokeWidth="1" />
              <path d="M-3 12A3 3 0 0 0 3 12Z" fill={u('me')} />
            </g>
          </g>
          <g transform="translate(224.4 69.4)">
            <g className="esc-baz-cuelga" style={{ animationDelay: '-1.6s' }}>
              <path d="M-2.4 0L-3.6 4.6M2.4 0L3.6 4.6" stroke="#64748b" strokeWidth=".5" />
              <g transform="translate(0 15)">
                <Canasta c="#22c55e" w={9} />
              </g>
            </g>
          </g>
          <rect x="200" y="92" width="11.6" height="12" rx="1.4" fill="#fff" />
          <path
            d="M201.6 93.6h3.4v3.4h-3.4zM206.6 93.6h3.4v3.4h-3.4zM201.6 98.6h3.4v3.4h-3.4zM207 99h1.3v1.3h-1.3zM208.7 100.7h1.3v1.3h-1.3zM207 101.2h1.3v.8h-1.3z"
            fill="#7f1d1d"
          />
          {/* el QR dice pagado */}
          <g className="esc-baz-pagado">
            <circle cx="205.8" cy="98" r="4.6" fill="#16a34a" />
            <path d="M203.8 98.1L205.3 99.6L208 96.6" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* el mostrador */}
          <rect x="198" y="114" width="34" height="32" fill={u('mo')} />
          <rect x="201" y="118" width="28" height="11" rx="1" fill="#991b1b" />
          <rect x="201" y="132" width="28" height="10" rx="1" fill="#991b1b" />
          <rect x="198" y="114" width="1.6" height="32" fill="#fff" opacity=".2" />
          <rect x="196" y="111.6" width="38" height="3.6" rx="1.6" fill={u('tb')} />
          <rect x="197" y="111.9" width="36" height=".9" rx=".45" fill="#e3b48a" />

          {/* el toldo rojo con su festón */}
          {Array.from({ length: 12 }, (_, i) => {
            const w = 156 / 12
            const x = 78 + w * i
            const c = i % 2 === 0 ? '#dc2626' : '#fcd34d'
            return (
              <g key={i}>
                <path d={`M${x + 2 - i * 0.33} 58H${x + w + 2 - (i + 1) * 0.33}L${x + w} 65H${x}Z`} fill={c} />
                <path d={`M${x} 65a${w / 2} ${w / 3} 0 0 0 ${w} 0Z`} fill={c} />
              </g>
            )
          })}
          <rect x="78" y="64.6" width="156" height="1" fill="#5a2c0c" opacity=".1" />

          {/* el letrero con un regalo y una estrella */}
          <rect x="80" y="48" width="3" height="10" fill="#7c2d12" />
          <rect x="166" y="48" width="3" height="10" fill="#7c2d12" />
          <rect x="76" y="37.6" width="96" height="19" rx="4" fill="#7f1d1d" />
          <rect x="74" y="35.2" width="100" height="4.2" rx="2.1" fill="#facc15" />
          <rect x="78" y="53.8" width="92" height="1.4" rx=".7" fill="#450a0a" opacity=".5" />
          <text x="124" y="51.8" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff7ed" textLength="54" lengthAdjust="spacing">
            BAZAR
          </text>
          <g transform="translate(87 47)">
            <rect x="-4" y="-2.4" width="8" height="6" rx=".6" fill="#facc15" />
            <rect x="-4.6" y="-3.6" width="9.2" height="1.8" rx=".5" fill="#fde047" />
            <rect x="-.7" y="-3.6" width="1.4" height="7.2" fill="#ef4444" />
            <path d="M0-3.6C-2-6-4-4.4-2-3.6ZM0-3.6C2-6 4-4.4 2-3.6Z" fill="#ef4444" />
          </g>
          <g transform="translate(161 46.8)">
            <path className="esc-baz-estrella" d="M0-4.6L1.3-1.6L4.4-1.4L2-.6L2.8 3.2L0 1.4L-2.8 3.2L-2-.6L-4.4-1.4L-1.3-1.6Z" fill="#facc15" />
          </g>

          {/* ---------- las cajas de importación (derecha) ---------- */}
          <g transform="translate(238 146)">
            <CajaCarton w={40} h={28} fragil carton={u('cj')} />
          </g>
          <g transform="translate(243 118)">
            <CajaCarton w={30} h={22} sello="#2563eb" carton={u('cj')} />
          </g>
          <g transform="translate(281 146)">
            <CajaCarton w={14} h={14} carton={u('cj')} />
          </g>
          <text x="256" y="143.6" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#b91c1c" opacity=".85">
            FRÁGIL
          </text>
          {/* el rehilete clavado en la caja de arriba */}
          <path d="M262 96V78" stroke="#a16207" strokeWidth=".9" />
          <g transform="translate(262 78)">
            <g className="esc-baz-rehilete">
              {['#ef4444', '#facc15', '#22c55e', '#3b82f6'].map((c, i) => (
                <g key={c} className="esc-lb-fijo" transform={`rotate(${i * 90})`}>
                  <path d="M0 0L0-6.4C2.6-6.4 3.8-4 3.4-1.6Z" fill={c} />
                </g>
              ))}
              <circle cx="0" cy="0" r=".9" fill="#fff" />
            </g>
          </g>
        </g>

        {/* ---------- el carrito de carga con la caja nueva y la mercadería que sube ---------- */}
        <g className="esc-baz-flota">
          {/* atrás: el bastidor del carrito y la boca de la caja */}
          <g className="esc-baz-carro">
            <path d="M31.4 143.4L27 98" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M27 98C26.4 94.6 22 94.4 21.4 97.4" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
            <path d="M28.6 120L33 120M29.6 132L33 132" stroke="#475569" strokeWidth="1.2" />
            <path d="M33 115L37 111.4H65L61 115Z" fill="#5c3b1c" />
          </g>

          {/* la mercadería: dos piezas al estante y la olla al mostrador */}
          <g transform={`translate(${CAJA[0]} ${CAJA[1]})`}>
            <g className="esc-baz-sube-x" style={sube(HUECO_PELUCHE, -66)}>
              <g className="esc-baz-sube-y" style={sube(HUECO_PELUCHE, -66)}>
                <Osito c="#a855f7" />
              </g>
            </g>
          </g>
          <g transform={`translate(${CAJA[0]} ${CAJA[1]})`}>
            <g className="esc-baz-sube-x" style={sube(HUECO_BALDE, -40, '-6.11s')}>
              <g className="esc-baz-sube-y" style={sube(HUECO_BALDE, -40, '-6.11s')}>
                <Balde c="#f97316" />
              </g>
            </g>
          </g>
          <g transform={`translate(${MOSTRADOR[0]} ${MOSTRADOR[1]})`}>
            <g className="esc-baz-lleva">
              <g className="esc-baz-olla-x" style={v({ '--dx': `${CAJA[0] - MOSTRADOR[0]}px` })}>
                <g className="esc-baz-olla-y" style={v({ '--dy': `${CAJA[1] - MOSTRADOR[1]}px` })}>
                  <Olla c="#dc2626" borde="#fff" tapa="#ef4444" w={16} />
                </g>
              </g>
            </g>
          </g>

          {/* adelante: la caja de cartón con sus solapas, la pala y la rueda */}
          <g className="esc-baz-carro">
            <path d="M61 115L65 111.4V139.8L61 143.4Z" fill="#a86f3a" />
            <rect x="33" y="115" width="28" height="28.4" fill={u('cj')} />
            <rect x="33" y="115" width="1.4" height="28.4" fill="#fff" opacity=".2" />
            <rect x="45.6" y="115" width="2.8" height="7" fill="#d9c7a6" opacity=".9" />
            <g transform="translate(37 121)">
              {[0, 3].map((x) => (
                <path key={x} d={`M${x} 0L${x + 1.4} -2.2L${x + 2.8} 0H${x + 1.9}V2.4H${x + 0.9}V0Z`} fill="#3f2a14" opacity=".75" />
              ))}
            </g>
            <rect x="36" y="127" width="12" height="8" rx=".5" fill="#fff" />
            {Array.from({ length: 7 }, (_, i) => (
              <rect key={i} x={37 + i * 1.4} y="128.2" width={i % 3 ? 0.5 : 0.9} height="4" fill="#1f2937" />
            ))}
            <path d="M37 134H46" stroke="#94a3b8" strokeWidth=".5" />
            <circle cx="54.4" cy="131" r="3.6" fill="none" stroke="#dc2626" strokeWidth=".7" opacity=".85" />
            <path d="M54.4 128.6L55 130.4H56.8L55.4 131.4L55.9 133.2L54.4 132.1L52.9 133.2L53.4 131.4L52 130.4H53.8Z" fill="#dc2626" opacity=".85" />
            {/* las solapas: se abren hacia los costados */}
            <g className="esc-baz-solapa-i">
              <path d="M33 115L37 111.4H51L47 115Z" fill="#e6bb83" />
              <path d="M33 115L37 111.4H39L35 115Z" fill="#fff" opacity=".25" />
            </g>
            <g className="esc-baz-solapa-d">
              <path d="M47 115L51 111.4H65L61 115Z" fill="#d6a56c" />
            </g>
            <rect x="29" y="143" width="35" height="2" rx=".6" fill="#334155" />
            <g transform="translate(29.4 141.4)">
              <g className="esc-baz-rueda">
                <circle cx="0" cy="0" r="4.6" fill="#1f2937" />
                <circle cx="0" cy="0" r="2.6" fill="#94a3b8" />
                <path d="M-2.6 0H2.6M0-2.6V2.6" stroke="#475569" strokeWidth=".7" />
                <circle cx="0" cy="0" r=".8" fill="#e2e8f0" />
              </g>
            </g>
          </g>

          {/* el +3 de stock, que flota sobre la caja */}
          <g transform="translate(47 100)">
            <g className="esc-baz-stock">
              <rect x="-8.4" y="-4.4" width="16.8" height="8.4" rx="4.2" fill="#16a34a" />
              <text x="0" y="2" textAnchor="middle" fontSize="6" fontWeight="900" fill="#fff">
                +3
              </text>
            </g>
          </g>

          {/* ---------- la mano del cliente, que se lleva la olla ---------- */}
          <g className="esc-baz-mano">
            <path d="M236 100.6L322 86V108L236 109.6Z" fill="#0ea5e9" />
            <path d="M236 100.6L322 86V89.6L236 103.4Z" fill="#7dd3fc" opacity=".8" />
            <path d="M252 107.4L272 104.6" stroke="#0369a1" strokeWidth=".7" strokeLinecap="round" opacity=".6" />
            <rect x="233.6" y="100.2" width="4.4" height="9.8" rx="2" fill="#e0f2fe" />
            <path d="M234 101.6C231.6 101 229.6 101.6 228.6 103.2V108.6C230 109.6 232.4 109.6 234 108.8Z" fill="#d6a07a" />
            {[103, 105.4, 107.8].map((y, i) => (
              <rect key={y} x={i === 2 ? 226 : 225.2} y={y - 1} width={i === 2 ? 4.4 : 5.2} height="2.2" rx="1.1" fill={i % 2 ? '#d6a07a' : '#e0ad88'} />
            ))}
            <path d="M229 102.4C227.6 100.4 225.6 100.4 224.8 101.4C225.6 102.8 227.2 103.4 229 103.4Z" fill="#c98e66" />
          </g>

          {/* la venta: aro en el mostrador y destellos */}
          <ellipse className="esc-baz-aro" cx={MOSTRADOR[0]} cy={MOSTRADOR[1]} rx="14" ry="4" fill="none" stroke="#dc2626" strokeWidth="1.3" />
          <g transform="translate(207 90)">
            <path className="esc-baz-chispa" d={ESTRELLA} fill="#facc15" />
          </g>
          <g transform="translate(231 86)">
            <path className="esc-baz-chispa" d={ESTRELLA} fill="#fda4af" style={{ animationDelay: '-6.35s' }} />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Olla N° 24" texto="Bs 85" tono="rosa" />
    </Marco>
  )
}
