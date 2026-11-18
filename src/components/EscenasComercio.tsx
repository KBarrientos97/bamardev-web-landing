import './EscenasComercio.css'
import { useId, type CSSProperties } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escenas animadas de comercio: minimarket y ferretería (SVG propio).
  Todo se mueve con CSS (transform y opacity); los keyframes `esc-comercio-*`
  viven en EscenasComercio.css y los compartidos `esc-*` en index.css. Cada
  escena es decorativa: el Marco ya la marca con aria-hidden.
*/

/** Pivote fijo en coordenadas del viewBox (para girar un martillo, un engranaje…). */
const pivote = (x: number, y: number): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${x}px ${y}px` })

/** Chispa de cuatro puntas (destellos). */
const ESTRELLA = 'M0-4.5L1.2-1.2L4.5 0L1.2 1.2L0 4.5L-1.2 1.2L-4.5 0L-1.2-1.2Z'

/* ------------------------------------------------------------------ */
/*  MINIMARKET                                                         */
/* ------------------------------------------------------------------ */

type Prod = [x: number, w: number, h: number, color: string]

/** Productos de cada repisa de la vitrina: [x, ancho, alto, color]. La base de cada fila es `base`. */
const FILAS: { base: number; prods: Prod[] }[] = [
  {
    base: 108,
    prods: [
      [54, 9, 12, '#fcd34d'],
      [65, 10, 10, '#fb7185'],
      [77, 8, 12, '#ffffff'],
      [87, 12, 11, '#34d399'],
      [101, 8, 12, '#c4b5fd'],
      [111, 10, 9, '#fdba74'],
      [123, 8, 12, '#fb7185'],
      [133, 10, 11, '#fcd34d'],
    ],
  },
  {
    base: 124,
    prods: [
      [54, 12, 11, '#34d399'],
      [68, 8, 12, '#fb7185'],
      [78, 12, 9, '#fcd34d'],
      [92, 14, 11, '#c4b5fd'],
    ],
  },
  {
    base: 140,
    prods: [
      [54, 14, 12, '#fdba74'],
      [70, 9, 12, '#ffffff'],
      [81, 11, 10, '#fb7185'],
      [94, 12, 12, '#34d399'],
      [108, 9, 10, '#fcd34d'],
      [119, 12, 12, '#c4b5fd'],
      [133, 9, 12, '#ffffff'],
    ],
  },
]

/**
 * Un minimarket con su letrero, toldo y vitrina llena; un carrito rueda suave y en él van
 * cayendo (y rebotando) una manzana, un cartón de leche y un pan; el lector barre un código
 * de barras y la caja avisa la venta.
 */
export function EscenaMinimarket() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const toldo = Array.from({ length: 6 }, (_, i) => ({ x: 38 + (164 / 6) * i, c: i % 2 === 0 ? '#ffffff' : '#fca5a5' }))
  const ancho = 164 / 6
  return (
    <Marco fondo="bg-gradient-to-b from-emerald-100 via-emerald-50 to-white">
      <div aria-hidden className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('f')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#86edc2" />
            <stop offset="1" stopColor="#4fd1a1" />
          </linearGradient>
          <linearGradient id={g('l')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1f9d74" />
            <stop offset="1" stopColor="#2fb98b" />
          </linearGradient>
          <linearGradient id={g('s')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0a8" />
            <stop offset="1" stopColor="#fcd34d" />
          </linearGradient>
          <linearGradient id={g('v')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1fdf7" />
            <stop offset="1" stopColor="#c3efdc" />
          </linearGradient>
          <linearGradient id={g('c')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dfe6f7" />
            <stop offset="1" stopColor="#aebbdc" />
          </linearGradient>
          <linearGradient id={g('m')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id={g('p')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="1" stopColor="#f5b53c" />
          </linearGradient>
        </defs>

        {/* losa de la vereda y su sombra */}
        <ellipse className="esc-sombra" cx="150" cy="166" rx="136" ry="6.5" fill="#065f46" opacity=".14" />
        <rect x="10" y="146" width="280" height="16" rx="8" fill="#8fd0b3" />
        <rect x="10" y="140" width="280" height="16" rx="8" fill="#c2ecd7" />
        <path d="M60 148h180M110 142v12M170 142v12M230 142v12" stroke="#9fd8bf" strokeWidth="1" opacity=".7" />

        {/* la tienda flota apenas */}
        <g className="esc-flotar">
          <path d="M24 58L40 52V148L24 152Z" fill={`url(#${g('l')})`} />
          <rect x="40" y="50" width="160" height="98" rx="5" fill={`url(#${g('f')})`} />
          <rect x="36" y="144" width="168" height="6" rx="3" fill="#2fb98b" />

          {/* letrero */}
          <path d="M26 38L36 33V54L26 59Z" fill="#e5b93b" />
          <rect x="34" y="28" width="172" height="24" rx="7" fill={`url(#${g('s')})`} />
          <rect x="39" y="31" width="162" height="4.5" rx="2.2" fill="#fff" opacity=".55" />
          <text
            x="120"
            y="46"
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="900"
            fill="#0f766e"
            textLength="128"
            lengthAdjust="spacingAndGlyphs"
          >
            MINIMARKET
          </text>

          {/* vitrina con repisas llenas */}
          <rect x="46" y="88" width="104" height="60" rx="3" fill="#16966c" />
          <rect x="50" y="92" width="96" height="52" rx="2" fill={`url(#${g('v')})`} />
          {FILAS.map((fila) => (
            <g key={fila.base}>
              {fila.prods.map(([x, w, h, c]) => (
                <g key={x}>
                  <rect x={x} y={fila.base - h} width={w} height={h} rx="2" fill={c} />
                  <rect x={x + 1.4} y={fila.base - h + 1.6} width="2" height={h - 4} rx="1" fill="#fff" opacity=".5" />
                </g>
              ))}
              <rect x="50" y={fila.base} width="96" height="3.2" rx="1.6" fill="#3fb98f" />
            </g>
          ))}

          {/* caja con código de barras y su rayo láser */}
          <rect x="112" y="112" width="30" height="12" rx="1.6" fill="#fff" />
          <path
            d="M115 114v8M117 114v8M119 114v8M121.5 114v8M123 114v8M125.5 114v8M127 114v8M129.5 114v8M131 114v8M133.5 114v8M136 114v8M138.5 114v8"
            stroke="#334155"
            strokeWidth=".9"
          />
          <path d="M117 114v8M123 114v8M131 114v8M136 114v8" stroke="#334155" strokeWidth="1.5" />
          <g className="esc-comercio-laser">
            <rect x="109" y="112.2" width="36" height="4.5" rx="2" fill="#ef4444" opacity=".28" />
            <rect x="109" y="113.5" width="36" height="1.7" rx=".85" fill="#ef4444" />
          </g>
          {/* reflejo del vidrio */}
          <rect x="50" y="92" width="96" height="52" rx="2" fill="#fff" className="esc-parpadeo" />

          {/* puerta con el cartelito colgando */}
          <rect x="158" y="90" width="36" height="58" rx="3" fill="#16966c" />
          <rect x="162" y="94" width="28" height="54" rx="2" fill={`url(#${g('v')})`} />
          <path d="M165 94h9l-12 54h-0z" fill="#fff" opacity=".35" />
          <rect x="164" y="118" width="2.6" height="14" rx="1.3" fill="#fff" />
          <g className="esc-comercio-colgar">
            <line x1="176" y1="95" x2="176" y2="100" stroke="#0f766e" strokeWidth="1" />
            <rect x="165" y="100" width="22" height="9" rx="2.5" fill="#fb7185" />
            <rect x="166.5" y="101" width="19" height="2.2" rx="1" fill="#fff" opacity=".4" />
            <text x="176" y="106.6" textAnchor="middle" fontSize="4.6" fontWeight="800" fill="#fff" letterSpacing=".3">
              ABIERTO
            </text>
          </g>

          {/* toldo rayado que se mece */}
          <g className="esc-toldo">
            <rect x="36" y="54" width="168" height="8" rx="3" fill="#f87171" />
            {toldo.map((t, i) => (
              <path
                key={i}
                d={`M${t.x} 61H${t.x + ancho}V72a${ancho / 2} ${ancho / 2} 0 0 1-${ancho} 0Z`}
                fill={t.c}
              />
            ))}
            <rect x="36" y="54" width="168" height="3.4" rx="1.7" fill="#fff" opacity=".55" />
          </g>
        </g>

        {/* el carrito: rueda de un lado a otro, con las ruedas girando lo que avanza */}
        <g className="esc-comercio-rodar" style={{ animationDelay: '-1.3s' }}>
          {/* chasis y ruedas */}
          <path d="M227 134v8M259 134v8" stroke="#8294b8" strokeWidth="2.4" strokeLinecap="round" />
          <g className="esc-comercio-rueda" style={{ animationDelay: '-1.3s' }}>
            <circle cx="230" cy="143" r="5" fill="#64748b" />
            <circle cx="230" cy="143" r="2" fill="#cbd5e1" />
            <path d="M230 138.6v8.8M225.6 143h8.8" stroke="#94a3b8" strokeWidth="1" />
          </g>
          <g className="esc-comercio-rueda" style={{ animationDelay: '-1.3s' }}>
            <circle cx="257" cy="143" r="5" fill="#64748b" />
            <circle cx="257" cy="143" r="2" fill="#cbd5e1" />
            <path d="M257 138.6v8.8M252.6 143h8.8" stroke="#94a3b8" strokeWidth="1" />
          </g>

          {/* mango */}
          <path d="M270 113L282 97" stroke="#8294b8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M281 97h12" stroke="#fb7185" strokeWidth="3.6" strokeLinecap="round" />

          {/* fondo interior de la canasta */}
          <path d="M220 106H274L270 128H226Z" fill="#8fa1c4" />

          {/* lo que cae: cada uno con su propio retraso, uno tras otro */}
          <g className="esc-comercio-caer" style={{ animationDelay: '-4.4s' }}>
            <circle cx="232" cy="112" r="7" fill="#fb7185" />
            <ellipse cx="229.6" cy="109.4" rx="2.2" ry="3.2" fill="#fff" opacity=".45" />
            <path d="M232 105.4c0-2 .6-3.2 1.6-4" stroke="#7c4a2d" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M233.4 103c2.6-1.8 5-1.4 5.6-.6-1.2 2-3.8 2.4-5.6.6z" fill="#34d399" />
          </g>
          <g className="esc-comercio-caer" style={{ animationDelay: '-2.4s' }}>
            <path d="M241 101L244 95.6H250L253 101Z" fill="#bfe3fb" />
            <rect x="241" y="101" width="12" height="18" rx="1.6" fill={`url(#${g('m')})`} />
            <rect x="241" y="106" width="12" height="5.5" fill="#60a5fa" />
            <circle cx="247" cy="108.8" r="1.7" fill="#fff" />
            <rect x="250.6" y="101" width="2.4" height="18" rx="1.2" fill="#93c5fd" opacity=".45" />
          </g>
          <g className="esc-comercio-caer" style={{ animationDelay: '-0.4s' }}>
            <ellipse cx="262" cy="112" rx="9" ry="6.2" fill={`url(#${g('p')})`} />
            <path d="M257 107.6l2.4 5M262 106.4l2.4 5.6M267 107.8l1.6 4.4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
            <ellipse cx="258.4" cy="109.6" rx="2.6" ry="1.4" fill="#fff" opacity=".4" />
          </g>

          {/* destellos al aterrizar (mismo ciclo que cada producto, 30 %) */}
          <g transform="translate(232 108)">
            <path className="esc-comercio-chispa" d={ESTRELLA} fill="#fff7b8" stroke="#fbbf24" strokeWidth=".7" style={{ animationDelay: '-4.4s' }} />
          </g>
          <g transform="translate(247 100)">
            <path className="esc-comercio-chispa" d={ESTRELLA} fill="#fff7b8" stroke="#fbbf24" strokeWidth=".7" style={{ animationDelay: '-2.4s' }} />
          </g>
          <g transform="translate(262 107)">
            <path className="esc-comercio-chispa" d={ESTRELLA} fill="#fff7b8" stroke="#fbbf24" strokeWidth=".7" style={{ animationDelay: '-0.4s' }} />
          </g>

          {/* frente de la canasta (rejilla) */}
          <path d="M216 113H270L262 134H224Z" fill={`url(#${g('c')})`} />
          <path d="M223.6 123.5H265M221 118.4H267.5M227 113v21M237 113v21M247 113v21M257 113v21" stroke="#fff" strokeWidth="1" opacity=".55" />
          <rect x="214" y="110" width="58" height="4.2" rx="2.1" fill="#e9eefb" />
          <rect x="216" y="110.6" width="54" height="1.4" rx=".7" fill="#fff" opacity=".8" />
        </g>
      </svg>
      <Aviso texto="Venta Bs 12" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  FERRETERÍA                                                         */
/* ------------------------------------------------------------------ */

/**
 * Contorno de un engranaje centrado en (cx, cy): `n` dientes, raíz `rIn`, punta `rOut`.
 * `fase` es el ángulo (grados, sentido horario de la pantalla) de un diente. El diente es
 * más angosto en la punta que el hueco en la raíz, para que dos engranajes engranen sin pisarse.
 */
function engranaje(cx: number, cy: number, n: number, rIn: number, rOut: number, fase: number) {
  const paso = 360 / n
  const p = (a: number, r: number) => {
    const t = (a * Math.PI) / 180
    return `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * Math.sin(t)).toFixed(2)}`
  }
  const pts: string[] = []
  for (let k = 0; k < n; k++) {
    const a = fase + k * paso
    pts.push(p(a - 0.31 * paso, rIn), p(a - 0.12 * paso, rOut), p(a + 0.12 * paso, rOut), p(a + 0.31 * paso, rIn))
  }
  return `M${pts.join('L')}Z`
}

/** Partícula del impacto (chispa o astilla): sale hacia (dx, dy) y cae. */
function Salto({ dx, dy, giro, color, astilla = false, retraso }: { dx: number; dy: number; giro: number; color: string; astilla?: boolean; retraso: number }) {
  return astilla ? (
    <rect className="esc-comercio-salto" x="-2" y="-1" width="4" height="2.2" rx=".8" fill={color} style={v({ '--dx': `${dx}px`, '--dy': `${dy}px`, '--giro': `${giro}deg`, animationDelay: `${retraso}s` })} />
  ) : (
    <circle className="esc-comercio-salto" r="1.7" fill={color} style={v({ '--dx': `${dx}px`, '--dy': `${dy}px`, '--giro': `${giro}deg`, animationDelay: `${retraso}s` })} />
  )
}

// El engranaje grande y el chico: la distancia entre centros es la suma de los radios de paso (20 + 10).
const G_GRANDE = { cx: 62, cy: 60, n: 12, rIn: 17.5, rOut: 22.5 }
const ANG = (-35 * Math.PI) / 180
const G_CHICO = { cx: G_GRANDE.cx + 30 * Math.cos(ANG), cy: G_GRANDE.cy + 30 * Math.sin(ANG), n: 6, rIn: 7.5, rOut: 12.5 }

/**
 * Un banco de trabajo: el martillo baja y hunde un clavo (cada golpe un poco más), saltan
 * chispas y astillas, dos engranajes giran en sentidos contrarios y la bandeja con tornillos
 * y la llave dan un respingo con cada golpe. Un aviso confirma el stock.
 */
export function EscenaFerreteria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  // Todo lo que va al compás del martillo comparte el mismo retraso (negativo: arranca a mitad de ciclo).
  const d = '-1.9s'
  const dSalto = -1.9
  return (
    <Marco fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <div aria-hidden className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-orange-200/60 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('w')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe9c8" />
            <stop offset="1" stopColor="#ffd59a" />
          </linearGradient>
          <linearGradient id={g('bt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7dba9" />
            <stop offset="1" stopColor="#ecc084" />
          </linearGradient>
          <linearGradient id={g('bf')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e2a95e" />
            <stop offset="1" stopColor="#c58a45" />
          </linearGradient>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbe3b8" />
            <stop offset="1" stopColor="#f2c88a" />
          </linearGradient>
          <linearGradient id={g('pf')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9b46c" />
            <stop offset="1" stopColor="#d49a52" />
          </linearGradient>
          <linearGradient id={g('ac')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dbe4f0" />
            <stop offset="1" stopColor="#93a7c2" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8d197" />
            <stop offset="1" stopColor="#dca04c" />
          </linearGradient>
          <linearGradient id={g('co')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fda4af" />
            <stop offset="1" stopColor="#f0566f" />
          </linearGradient>
          <pattern id={g('pp')} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="1.2" fill="#e6ae62" opacity=".7" />
          </pattern>
          <clipPath id={g('cl')}>
            <rect x="120" y="60" width="52" height="43" />
          </clipPath>
        </defs>

        {/* piso y sombra */}
        <ellipse className="esc-sombra" cx="150" cy="164" rx="132" ry="6" fill="#7c3f0e" opacity=".14" />
        <rect x="14" y="148" width="272" height="16" rx="8" fill="#dcb888" />
        <rect x="14" y="142" width="272" height="16" rx="8" fill="#f1d8b0" />

        {/* pared de herramientas con agujeros */}
        <rect x="20" y="8" width="260" height="104" rx="8" fill={`url(#${g('w')})`} />
        <rect x="20" y="8" width="260" height="104" rx="8" fill={`url(#${g('pp')})`} />
        <rect x="24" y="11" width="252" height="4.5" rx="2.2" fill="#fff" opacity=".45" />

        {/* engranajes: el grande y el chico, en sentidos contrarios */}
        <circle cx={G_GRANDE.cx + 2} cy={G_GRANDE.cy + 2.5} r="21" fill="#b8742a" opacity=".12" />
        <circle cx={G_CHICO.cx + 1.5} cy={G_CHICO.cy + 2} r="11.5" fill="#b8742a" opacity=".12" />
        <g className="esc-comercio-gira-a" style={{ ...pivote(G_CHICO.cx, G_CHICO.cy), animationDelay: '-0.7s' }}>
          <path d={engranaje(G_CHICO.cx, G_CHICO.cy, G_CHICO.n, G_CHICO.rIn, G_CHICO.rOut, -35 + 180 + 30)} fill="#9db0cb" stroke="#7d92b3" strokeWidth=".8" strokeLinejoin="round" />
          <circle cx={G_CHICO.cx} cy={G_CHICO.cy} r="6" fill="#bccadf" />
          <circle cx={G_CHICO.cx} cy={G_CHICO.cy} r="2.3" fill="#ffe2b4" />
        </g>
        <g className="esc-comercio-gira-h" style={{ ...pivote(G_GRANDE.cx, G_GRANDE.cy), animationDelay: '-0.35s' }}>
          <path d={engranaje(G_GRANDE.cx, G_GRANDE.cy, G_GRANDE.n, G_GRANDE.rIn, G_GRANDE.rOut, -35)} fill="#f6b53a" stroke="#e29a1c" strokeWidth=".8" strokeLinejoin="round" />
          <circle cx={G_GRANDE.cx} cy={G_GRANDE.cy} r="14" fill="#fcd679" />
          {Array.from({ length: 6 }, (_, k) => {
            const a = (k * 60 * Math.PI) / 180
            return <circle key={k} cx={G_GRANDE.cx + 9.2 * Math.cos(a)} cy={G_GRANDE.cy + 9.2 * Math.sin(a)} r="2.5" fill="#ffe2b4" />
          })}
          <circle cx={G_GRANDE.cx} cy={G_GRANDE.cy} r="4.4" fill="#ffe2b4" />
        </g>
        {/* brillo fijo sobre los engranajes y un destello que titila */}
        <ellipse cx="53" cy="48" rx="7" ry="3.2" fill="#fff" opacity=".3" transform="rotate(-35 53 48)" />
        <path className="esc-parpadeo" d="M100 30l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff" />
        <path className="esc-parpadeo" style={{ animationDelay: '-1.5s' }} d="M44 36l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fff" />

        {/* repisa con latas de pintura */}
        <g>
          <rect x="236" y="43" width="14" height="20" rx="2.4" fill={`url(#${g('co')})`} />
          <rect x="236" y="49" width="14" height="6" fill="#fff" opacity=".85" />
          <ellipse cx="243" cy="43.4" rx="7" ry="2.2" fill="#fecdd3" />
          <rect x="238.4" y="44" width="2" height="18" rx="1" fill="#fff" opacity=".35" />
          <rect x="256" y="49" width="14" height="14" rx="2.4" fill="#7ee0bf" />
          <rect x="256" y="53.4" width="14" height="4.6" fill="#fff" opacity=".8" />
          <ellipse cx="263" cy="49.4" rx="7" ry="2.2" fill="#c8f3e3" />
          <rect x="258.4" y="50" width="2" height="12" rx="1" fill="#fff" opacity=".35" />
          <rect x="232" y="63" width="44" height="5" rx="2.4" fill="#d79a4f" />
          <rect x="232" y="63" width="44" height="2" rx="1" fill="#fff" opacity=".4" />
        </g>

        {/* banco de trabajo */}
        <rect x="38" y="136" width="12" height="14" rx="2.5" fill="#c58a45" />
        <rect x="250" y="136" width="12" height="14" rx="2.5" fill="#b27a37" />
        <path d="M40 108H262L274 124H28Z" fill={`url(#${g('bt')})`} />
        <rect x="28" y="124" width="246" height="14" rx="3" fill={`url(#${g('bf')})`} />
        <rect x="30" y="125.4" width="242" height="3" rx="1.5" fill="#fff" opacity=".35" />
        <path d="M60 131h42M130 132h70M222 131h36" stroke="#a96b2b" strokeWidth="1" strokeLinecap="round" opacity=".28" />

        {/* bandeja de tornillos y llave: respingan con cada golpe */}
        <g className="esc-comercio-temblor" style={{ animationDelay: d }}>
          {/* llave inglesa */}
          <g transform="translate(66 118) rotate(-5)">
            <rect x="-20" y="-3.2" width="42" height="6.4" rx="3.2" fill={`url(#${g('ac')})`} />
            {/* cabeza abierta (la boca de la llave es un hueco real, no un parche) */}
            <path d="M-28.89-3.2H-22V3.2H-28.89A7.6 7.6 0 1 0-28.89-3.2Z" fill={`url(#${g('ac')})`} />
            {/* aro del otro extremo, con su agujero */}
            <path fillRule="evenodd" d="M18 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0ZM21.1 0a1.9 1.9 0 1 0 3.8 0a1.9 1.9 0 1 0-3.8 0Z" fill={`url(#${g('ac')})`} />
            <rect x="-17" y="-2.4" width="34" height="1.5" rx=".75" fill="#fff" opacity=".6" />
          </g>

          {/* tornillos en la bandeja */}
          <g transform="translate(216 109) rotate(-18)">
            <rect x="0" y="-1.5" width="14" height="3" rx="1" fill="#b4c2d6" />
            <path d="M3 -1.5v3M6 -1.5v3M9 -1.5v3M12 -1.5v3" stroke="#8294b8" strokeWidth=".7" />
            <rect x="-5" y="-3.6" width="5.4" height="7.2" rx="1.4" fill="#dbe4f0" />
          </g>
          <g transform="translate(236 107) rotate(12)">
            <rect x="0" y="-1.5" width="14" height="3" rx="1" fill="#b4c2d6" />
            <path d="M3 -1.5v3M6 -1.5v3M9 -1.5v3M12 -1.5v3" stroke="#8294b8" strokeWidth=".7" />
            <rect x="-5" y="-3.6" width="5.4" height="7.2" rx="1.4" fill="#dbe4f0" />
          </g>
          <g transform="translate(254 110) rotate(-8)">
            <path d="M-4 0L-2 -3.4H2L4 0L2 3.4H-2Z" fill="#dbe4f0" />
            <circle r="1.5" fill="#f3d19b" />
          </g>
          <rect x="204" y="111" width="62" height="11" rx="3" fill={`url(#${g('co')})`} />
          <rect x="206" y="112.2" width="58" height="2.4" rx="1.2" fill="#fff" opacity=".45" />
        </g>

        {/* tablón de madera sobre el banco */}
        <path d="M104 98H196L188 108H96Z" fill={`url(#${g('pt')})`} />
        <rect x="96" y="108" width="92" height="12" rx="1.6" fill={`url(#${g('pf')})`} />
        <path d="M188 108L196 98V110L188 120Z" fill="#b97830" />
        <path d="M104 113h26M142 115h30M110 117h14" stroke="#a96b2b" strokeWidth=".9" strokeLinecap="round" opacity=".3" />
        <rect x="98" y="108.6" width="88" height="2.4" rx="1.2" fill="#fff" opacity=".4" />
        {/* hendidura donde entra el clavo */}
        <ellipse cx="146" cy="103.3" rx="3" ry="1" fill="#8a4f1c" opacity=".5" />

        {/* el clavo: se hunde en cada golpe; se recorta a la altura de la madera */}
        <g clipPath={`url(#${g('cl')})`}>
          <g className="esc-comercio-clavo" style={{ animationDelay: d }}>
            <rect x="144.8" y="90" width="2.4" height="16" rx="1" fill="#b4c2d6" />
            <rect x="141" y="87" width="10" height="3.2" rx="1.6" fill="#e6edf6" />
            <rect x="142.4" y="87.4" width="5" height="1" rx=".5" fill="#fff" />
          </g>
        </g>

        {/* el martillo: gira sobre el extremo del mango */}
        <g className="esc-comercio-martillo" style={{ ...pivote(222, 77.5), animationDelay: d }}>
          <rect x="150" y="73.4" width="74" height="8.2" rx="4.1" fill={`url(#${g('ma')})`} />
          <rect x="192" y="72.6" width="34" height="9.8" rx="4.9" fill={`url(#${g('co')})`} />
          <rect x="196" y="74.2" width="26" height="2" rx="1" fill="#fff" opacity=".5" />
          {/* garra */}
          <path d="M135 68C133 59 141 55 152 58L150 62C144 60 140 62 140 68Z" fill="#8fa3bd" />
          {/* cabeza */}
          <rect x="133" y="67" width="26" height="15" rx="3.4" fill={`url(#${g('ac')})`} />
          <rect x="154.4" y="67" width="4.6" height="15" rx="2" fill="#6b7e99" opacity=".4" />
          <rect x="135" y="68.5" width="19" height="3" rx="1.5" fill="#fff" opacity=".5" />
          <rect x="135" y="82" width="22" height="5" rx="2" fill="#6f84a3" />
        </g>

        {/* impacto: destello, chispas y astillas (se hunden junto con el clavo) */}
        <g className="esc-comercio-clavo" style={{ animationDelay: d }}>
          <g transform="translate(146 87)">
            <path className="esc-comercio-destello" d={ESTRELLA} fill="#fff7c2" stroke="#fcd34d" strokeWidth=".8" transform="scale(1.6)" style={{ animationDelay: d }} />
            <Salto dx={-24} dy={-18} giro={160} color="#fde047" retraso={dSalto} />
            <Salto dx={22} dy={-22} giro={-140} color="#fb923c" retraso={dSalto} />
            <Salto dx={-10} dy={-28} giro={90} color="#fff7c2" retraso={dSalto} />
            <Salto dx={13} dy={-14} giro={-60} color="#fde68a" retraso={dSalto} />
            <Salto dx={-30} dy={-6} giro={-200} color="#b9772f" astilla retraso={dSalto} />
            <Salto dx={28} dy={-9} giro={240} color="#d49a52" astilla retraso={dSalto} />
          </g>
        </g>
      </svg>
      <Aviso texto="Stock al día" />
    </Marco>
  )
}

/** Escenas de comercio (minimarket y ferretería). */
export const ESCENAS_COMERCIO = {
  minimarket: EscenaMinimarket,
  ferreteria: EscenaFerreteria,
} as const
