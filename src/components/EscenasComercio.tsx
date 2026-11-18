import './EscenasComercio.css'
import { useId, type CSSProperties } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escenas animadas de comercio: minimarket y ferretería (SVG propio).
  Todo se mueve con CSS (sólo transform y opacity); los keyframes `esc-comercio-*`
  viven en EscenasComercio.css y los compartidos `esc-*` en index.css. Cada
  escena es decorativa: el Marco ya la marca con aria-hidden.

  Las dos comparten ciclo maestro de 6,5 s: es el mismo del <Aviso> (esc-chip), que
  asoma al 10 % del ciclo. Por eso la acción que «causa» el aviso (el pitido del
  escáner, el último martillazo) cae justo antes de ese punto.
*/

/** Pivote fijo en coordenadas del viewBox (para girar un martillo, un engranaje…). */
const pivote = (x: number, y: number): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${x}px ${y}px` })

/** Chispa de cuatro puntas, chica (destellos). */
const ESTRELLA = 'M0-7L1.9-1.9L7 0L1.9 1.9L0 7L-1.9 1.9L-7 0L-1.9-1.9Z'

/* ------------------------------------------------------------------ */
/*  MINIMARKET                                                         */
/* ------------------------------------------------------------------ */

/** Producto de vitrina: [x, ancho, alto, color]. La base de cada fila la fija `FILAS`. */
type Prod = [x: number, w: number, h: number, color: string]

/** Tres filas de productos tras el vidrio de la vitrina (la base de cada una es `base`). */
const FILAS: { base: number; prods: Prod[] }[] = [
  {
    base: 107,
    prods: [
      [108, 7, 10, '#fcd34d'],
      [117, 8, 8, '#f59e8b'],
      [127, 6, 10, '#ffffff'],
      [135, 9, 9, '#86d9b8'],
      [146, 7, 10, '#a5b4fc'],
      [155, 6, 8, '#fdba74'],
    ],
  },
  {
    base: 119,
    prods: [
      [108, 10, 9, '#86d9b8'],
      [120, 7, 10, '#f59e8b'],
      [129, 9, 8, '#ffffff'],
      [140, 8, 10, '#fcd34d'],
      [150, 9, 9, '#a5b4fc'],
    ],
  },
  {
    base: 132.5,
    prods: [
      [108, 16, 7, '#fdba74'],
      [128, 8, 9, '#fcd34d'],
      [139, 10, 7, '#86d9b8'],
      [152, 8, 8, '#f59e8b'],
    ],
  },
]

/**
 * Un minimarket de barrio visto en tres cuartos: letrero, toldo rayado, vitrina y puerta,
 * con el carrito a la izquierda y la caja con su escáner a la derecha. La historia (6,5 s):
 * un cartón de leche sale del carrito en arco, aterriza sobre el escáner, el láser lee el
 * código, suena el «pitido» (aro verde + tilde en la pantalla) y la caja avisa la venta.
 * El cartón se cobra y sale por la caja; mientras tanto reaparece uno nuevo en el carrito.
 */
export function EscenaMinimarket() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`
  const ancho = 17
  // Ocho rayas de toldo de 17 de ancho: 92 → 228, alternando verde profundo y blanco.
  const rayas = Array.from({ length: 8 }, (_, i) => ({ x: 92 + ancho * i, c: i % 2 === 0 ? '#0e7f5d' : '#ffffff' }))
  const feston = (x: number) => `M${x} 67H${x + ancho}V74a${ancho / 2} ${ancho / 2} 0 0 1-${ancho} 0Z`

  return (
    <Marco fondo="bg-gradient-to-b from-emerald-100 via-emerald-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6f8ef" />
            <stop offset="1" stopColor="#bfe9d5" />
          </linearGradient>
          <linearGradient id={g('f')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5ad6aa" />
            <stop offset="1" stopColor="#34b98c" />
          </linearGradient>
          <linearGradient id={g('l')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1a8e6a" />
            <stop offset="1" stopColor="#25a47c" />
          </linearGradient>
          <linearGradient id={g('s')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#dff3ea" />
          </linearGradient>
          <linearGradient id={g('v')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0fcf7" />
            <stop offset="1" stopColor="#b4e6d0" />
          </linearGradient>
          <linearGradient id={g('sw')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#064e3b" stopOpacity=".26" />
            <stop offset="1" stopColor="#064e3b" stopOpacity="0" />
          </linearGradient>
          {/* luz y sombra sobre los festones del toldo (en coordenadas absolutas: y 67 → 83) */}
          <linearGradient id={g('td')} gradientUnits="userSpaceOnUse" x1="0" y1="67" x2="0" y2="83">
            <stop offset="0" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".55" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#022c22" stopOpacity=".16" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('sl')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#cde6da" />
          </linearGradient>
          <linearGradient id={g('cb')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2fb88c" />
            <stop offset="1" stopColor="#168a66" />
          </linearGradient>
          <linearGradient id={g('sc')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#64748b" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('hz')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ef4444" stopOpacity=".04" />
            <stop offset="1" stopColor="#ef4444" stopOpacity=".55" />
          </linearGradient>
          <linearGradient id={g('c')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef2fb" />
            <stop offset="1" stopColor="#aebcdb" />
          </linearGradient>
          <linearGradient id={g('b')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fbd48a" />
            <stop offset="1" stopColor="#d99a3c" />
          </linearGradient>
          <linearGradient id={g('cn')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#cfe0f6" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <rect x="105.5" y="95.5" width="59" height="37" rx="1.5" />
          </clipPath>
          <clipPath id={g('cp')}>
            <rect x="180" y="92" width="34" height="44" rx="1.5" />
          </clipPath>
        </defs>

        {/* plataforma: losa suave con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#8ed3b7" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".35" />
        <ellipse cx="150" cy="146" rx="112" ry="9" fill="#064e3b" opacity=".07" />
        <ellipse className="esc-comercio-sombra" cx="152" cy="146" rx="78" ry="6" fill="#064e3b" opacity=".14" />
        <ellipse cx="40" cy="146.5" rx="30" ry="4" fill="#064e3b" opacity=".12" />
        <ellipse cx="262" cy="147" rx="29" ry="4" fill="#064e3b" opacity=".12" />

        <g className="esc-comercio-flota">
          {/* ---------- la tienda ---------- */}
          {/* lateral izquierdo (en sombra) */}
          <path d="M80 67L94 62V145L80 149Z" fill={u('l')} />
          <path d="M80 47L92 42V62L80 66Z" fill="#a9d3c1" />
          {/* frente */}
          <rect x="94" y="62" width="132" height="83" fill={u('f')} />
          <rect x="94" y="138" width="132" height="7" fill="#1f9a74" />
          <rect x="94" y="62" width="2.4" height="83" fill="#fff" opacity=".18" />

          {/* letrero */}
          <rect x="92" y="40" width="136" height="22" rx="4" fill={u('s')} />
          <rect x="90" y="37.5" width="140" height="4.5" rx="2.2" fill="#0e7f5d" />
          <text
            x="160"
            y="56"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#0b6b50"
            textLength="112"
            lengthAdjust="spacing"
          >
            MINIMARKET
          </text>

          {/* vitrina: marco blanco, repisas y productos */}
          <rect x="99" y="135.5" width="72" height="4" rx="2" fill="#e8f6ef" />
          <rect x="102" y="92" width="66" height="44" rx="3" fill="#fff" />
          <rect x="105.5" y="95.5" width="59" height="37" rx="1.5" fill={u('v')} />
          {FILAS.map((fila) => (
            <g key={fila.base}>
              {fila.prods.map(([x, w, h, c]) => (
                <g key={x}>
                  <rect x={x} y={fila.base - h} width={w} height={h} rx="1.4" fill={c} />
                  <rect x={x + 1} y={fila.base - h + 1.2} width="1.3" height={h - 3} rx=".65" fill="#fff" opacity=".5" />
                  <rect x={x + w - 1.8} y={fila.base - h} width="1.8" height={h} rx=".8" fill="#0f172a" opacity=".08" />
                </g>
              ))}
              {fila.base < 130 && <rect x="105.5" y={fila.base} width="59" height="2" fill="#7fcfb0" />}
            </g>
          ))}
          <path d="M105.5 95.5H128L105.5 124Z" fill="#fff" opacity=".22" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(98 95)">
              <g className="esc-comercio-brillo" style={v({ '--d': '74px' })}>
                <path d="M0 0H8L-6 38H-14Z" fill={u('gl')} />
              </g>
            </g>
          </g>

          {/* puerta */}
          <rect x="176" y="88" width="42" height="57" rx="3" fill="#fff" />
          <rect x="180" y="92" width="34" height="44" rx="1.5" fill={u('v')} />
          <rect x="180" y="137" width="34" height="8" rx="1" fill="#1f9a74" />
          <rect x="183.5" y="106" width="2.4" height="15" rx="1.2" fill="#94a3b8" />
          <path d="M180 92H196L180 116Z" fill="#fff" opacity=".22" />
          <g clipPath={`url(#${g('cp')})`}>
            <g transform="translate(168 92)">
              <g className="esc-comercio-brillo" style={v({ '--d': '54px', animationDelay: '-6.3s' })}>
                <path d="M0 0H7L-5 44H-12Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          <rect x="177" y="145" width="40" height="2.6" rx="1.3" fill="#0e7f5d" opacity=".75" />

          {/* sombra que proyecta el toldo sobre la fachada */}
          <rect x="94" y="78" width="132" height="14" fill={u('sw')} />

          {/* toldo rayado que se mece apenas */}
          <g className="esc-comercio-toldo">
            <rect x="90" y="62" width="140" height="5.5" rx="2.2" fill="#0a5f46" />
            {rayas.map((r) => (
              <g key={r.x}>
                <path d={feston(r.x)} fill={r.c} />
                <path d={feston(r.x)} fill={u('td')} />
              </g>
            ))}
            <rect x="92" y="62.8" width="136" height="1.6" rx=".8" fill="#fff" opacity=".35" />
          </g>

          {/* ---------- la caja con su escáner (derecha) ---------- */}
          <rect x="238" y="119" width="46" height="27" rx="3" fill={u('cb')} />
          <rect x="246" y="130" width="30" height="10" rx="2" fill="#0b6b50" opacity=".5" />
          <rect x="256" y="133.4" width="10" height="2" rx="1" fill="#d1fae5" opacity=".85" />
          <rect x="234" y="112" width="54" height="7.5" rx="3" fill={u('sl')} />
          <rect x="236" y="112.6" width="50" height="1.6" rx=".8" fill="#fff" />
          {/* pantalla */}
          <rect x="268" y="108.4" width="14" height="3.6" rx="1.8" fill="#94a3b8" />
          <rect x="272" y="98" width="4" height="11" rx="1.6" fill="#a3b1c6" />
          <rect x="262" y="79" width="24" height="20" rx="3.4" fill="#1e293b" />
          <rect x="264.5" y="81.5" width="19" height="15" rx="1.8" fill="#0f172a" />
          <rect x="266" y="83.4" width="8" height="1.8" rx=".9" fill="#475569" />
          <rect x="266" y="87.2" width="11" height="1.8" rx=".9" fill="#475569" opacity=".8" />
          <rect x="266" y="91" width="6" height="1.8" rx=".9" fill="#475569" opacity=".6" />
          <path d="M264.5 81.5H274L264.5 92Z" fill="#fff" opacity=".1" />
          <g transform="translate(279 90)">
            <g className="esc-comercio-check">
              <circle r="4.6" fill="#34d399" />
              <path d="M-2.2 .2l1.7 1.8 3.2-3.6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
          {/* escáner plano con su luz roja */}
          <rect x="241" y="107" width="28" height="5.2" rx="2.6" fill={u('sc')} />
          <rect x="245" y="108.2" width="20" height="2.2" rx="1.1" fill="#7dd3fc" opacity=".85" />
          <g className="esc-comercio-haz">
            <path d="M246 108.6H264L260.5 100H249.5Z" fill={u('hz')} />
            <rect x="245" y="108.7" width="20" height="1.2" rx=".6" fill="#ef4444" />
          </g>
          {/* pitido: aro verde sobre la caja */}
          <ellipse className="esc-comercio-aro" cx="255" cy="110" rx="11" ry="3.6" fill="none" stroke="#34d399" strokeWidth="1.3" />

          {/* ---------- el carrito (izquierda) ---------- */}
          <path d="M26 128L28 138M58 128L56 138" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <rect x="25" y="133" width="34" height="2.4" rx="1.2" fill="#94a3b8" />
          <circle cx="30" cy="142" r="4" fill="#475569" />
          <circle cx="30" cy="142" r="1.6" fill="#cbd5e1" />
          <circle cx="56" cy="142" r="4" fill="#475569" />
          <circle cx="56" cy="142" r="1.6" fill="#cbd5e1" />
          <path d="M18 106L13.5 91H25" stroke="#94a3b8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="11.6" y="89.6" width="15" height="3" rx="1.5" fill="#475569" />
          {/* interior y lo que va dentro */}
          <path d="M18 107H66L61 119H23Z" fill="#7f90b0" />
          <rect x="22" y="97" width="14" height="20" rx="1.6" fill="#f59e8b" />
          <rect x="24.4" y="101" width="9" height="7" rx="1" fill="#fff" opacity=".85" />
          <rect x="22" y="97" width="3" height="20" rx="1" fill="#fff" opacity=".25" />
          <g transform="translate(58 107) rotate(18)">
            <rect x="-3.4" y="-19" width="6.8" height="30" rx="3.4" fill={u('b')} />
            <path d="M-2 -13l3.4 1.6M-2 -7l3.4 1.6M-2 -1l3.4 1.6" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".55" />
          </g>

          {/* el cartón que viaja: sale del carrito, cruza en arco y se cobra */}
          <g transform="translate(255 100)">
            <g className="esc-comercio-vuelo-x">
              <g className="esc-comercio-vuelo-y">
                <path d="M-5.5-14L-3.6-18.5H3.6L5.5-14Z" fill="#c7ddf7" />
                <rect x="-5.5" y="-14" width="11" height="14" rx="1.2" fill={u('cn')} />
                <path d="M-5.5-12.8a1.2 1.2 0 0 1 1.2-1.2H4.3a1.2 1.2 0 0 1 1.2 1.2V-10H-5.5Z" fill="#60a5fa" />
                <rect x="-4" y="-8.6" width="8" height="6.4" rx=".8" fill="#fff" />
                <path d="M-3-7.6v4.2M-2.1-7.6v4.2M-.9-7.6v4.2M.3-7.6v4.2M1.4-7.6v4.2M2.6-7.6v4.2" stroke="#334155" strokeWidth=".55" />
                <rect className="esc-comercio-barrido" x="-4.4" y="-8.4" width="8.8" height=".9" rx=".45" fill="#ef4444" />
                <rect x="3.4" y="-13" width="1.4" height="10.5" rx=".7" fill="#93c5fd" opacity=".4" />
              </g>
            </g>
          </g>

          {/* frente del carrito: malla translúcida con su aro */}
          <path d="M16 108H68L62 130H22Z" fill={u('c')} fillOpacity=".42" />
          <path d="M20 118.5H64.4M18.2 113H66M23.5 124H62.6M27 108V130M37 108V130M47 108V130M57 108V130" stroke="#fff" strokeWidth="1" opacity=".8" />
          <rect x="15" y="104" width="54" height="4.6" rx="2.3" fill="#e6ecf8" />
          <rect x="17" y="104.7" width="50" height="1.5" rx=".75" fill="#fff" />
        </g>
      </svg>
      <Aviso etiqueta="Venta" texto="Bs 23" />
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

/** Partícula del último golpe (chispa o astilla): sale hacia (dx, dy) y cae. */
function Salto({ dx, dy, giro, color, astilla = false }: { dx: number; dy: number; giro: number; color: string; astilla?: boolean }) {
  const estilo = v({ '--dx': `${dx}px`, '--dy': `${dy}px`, '--giro': `${giro}deg` })
  return astilla ? (
    <rect className="esc-comercio-salto" x="-1.8" y="-.9" width="3.6" height="1.9" rx=".7" fill={color} style={estilo} />
  ) : (
    <circle className="esc-comercio-salto" r="1.3" fill={color} style={estilo} />
  )
}

// Engranaje grande y chico: la distancia entre centros es la suma de los radios de paso (~14,5 + ~7,4).
const ANG_GRADOS = -20
const ANG = (ANG_GRADOS * Math.PI) / 180
const G_GRANDE = { cx: 104, cy: 67, n: 12, rIn: 12.6, rOut: 16.4 }
const G_CHICO = { cx: G_GRANDE.cx + 21.9 * Math.cos(ANG), cy: G_GRANDE.cy + 21.9 * Math.sin(ANG), n: 6, rIn: 5.6, rOut: 9.2 }

/**
 * Un banco de trabajo con panel de pared: lo único que pasa es una tarea de taller (6,5 s).
 * El martillo clava un clavo en un tablón en tres golpes (con retroceso antes y rebote
 * después); al hundirse del todo salta el destello con chispas, se enciende el piloto verde,
 * arranca el mecanismo de engranajes del panel y el sistema avisa el stock. Luego llega un
 * clavo nuevo y se repite.
 */
export function EscenaFerreteria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`
  return (
    <Marco fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f9ead0" />
            <stop offset="1" stopColor="#ecd2a3" />
          </linearGradient>
          <linearGradient id={g('pn')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7388a2" />
            <stop offset="1" stopColor="#566a83" />
          </linearGradient>
          <linearGradient id={g('ps')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0f172a" stopOpacity="0" />
            <stop offset="1" stopColor="#0f172a" stopOpacity=".28" />
          </linearGradient>
          <linearGradient id={g('bt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7dba5" />
            <stop offset="1" stopColor="#ecbd77" />
          </linearGradient>
          <linearGradient id={g('bf')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dca458" />
            <stop offset="1" stopColor="#c28a42" />
          </linearGradient>
          <linearGradient id={g('lg')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d2994d" />
            <stop offset="1" stopColor="#b57b36" />
          </linearGradient>
          <linearGradient id={g('bl')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbe3b8" />
            <stop offset="1" stopColor="#f2c88a" />
          </linearGradient>
          <linearGradient id={g('bn')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ebb76f" />
            <stop offset="1" stopColor="#d49a52" />
          </linearGradient>
          <linearGradient id={g('ac')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f1f5fb" />
            <stop offset="1" stopColor="#8ea2bd" />
          </linearGradient>
          <linearGradient id={g('fc')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a9bbd2" />
            <stop offset="1" stopColor="#6b809d" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6cd8c" />
            <stop offset="1" stopColor="#d79a47" />
          </linearGradient>
          <linearGradient id={g('co')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fb923c" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id={g('lu')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".5" />
            <stop offset=".55" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#0f172a" stopOpacity=".14" />
          </linearGradient>
          <linearGradient id={g('tb')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9db1cf" />
            <stop offset="1" stopColor="#7388ad" />
          </linearGradient>
          <linearGradient id={g('pl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e3eaf3" />
            <stop offset="1" stopColor="#a3b3c8" />
          </linearGradient>
          {/* sólo el tablón: el clavo se «hunde» recortado a la altura de la madera */}
          <clipPath id={g('cl')}>
            <rect x="140" y="40" width="40" height="45.4" />
          </clipPath>
        </defs>

        {/* plataforma y sombras de contacto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#d5b27c" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".35" />
        <ellipse cx="150" cy="146" rx="112" ry="9" fill="#7c3f0e" opacity=".07" />
        <ellipse className="esc-comercio-sombra" cx="150" cy="146" rx="94" ry="6" fill="#7c3f0e" opacity=".15" />
        <ellipse cx="36" cy="147" rx="21" ry="3.4" fill="#7c3f0e" opacity=".12" />
        <ellipse cx="269" cy="147" rx="18" ry="3.4" fill="#7c3f0e" opacity=".12" />

        {/* objeto secundario izquierdo: caja de herramientas cerrada (apagada de tono) */}
        <path d="M27 118V112.5a3 3 0 0 1 3-3H39a3 3 0 0 1 3 3V118" stroke="#8394b3" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <rect x="18" y="125" width="34" height="21" rx="3" fill={u('tb')} />
        <rect x="16" y="117.5" width="38" height="10" rx="3" fill="#b4c4dc" />
        <rect x="18" y="118.4" width="34" height="2" rx="1" fill="#fff" opacity=".6" />
        <rect x="32" y="124" width="6" height="5.4" rx="1.4" fill="#e8c47b" />
        <rect x="18" y="125" width="3" height="21" rx="1.5" fill="#fff" opacity=".2" />

        {/* objeto secundario derecho: balde galvanizado */}
        <path d="M257.5 119.6C259 101 279 101 280.5 119.6" stroke="#9fb0c5" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M256 118H283L280 146H259Z" fill={u('pl')} />
        <ellipse cx="269.5" cy="118" rx="13.5" ry="3" fill="#eef2f7" />
        <ellipse cx="269.5" cy="118.6" rx="11" ry="2" fill="#7d8da4" />
        <path d="M257.6 127H281.4M258.6 136H280.4" stroke="#fff" strokeWidth="1" opacity=".5" />

        {/* ---------- panel de pared del banco ---------- */}
        <rect x="72" y="46" width="156" height="40" rx="4" fill={u('pn')} />
        <rect x="76" y="48" width="148" height="2" rx="1" fill="#fff" opacity=".28" />
        <rect x="72" y="74" width="156" height="12" fill={u('ps')} />

        {/* mecanismo: dos engranajes que engranan. Sombra fija + cuerpo plano que gira + brillo fijo encima */}
        <circle cx={G_GRANDE.cx + 1.6} cy={G_GRANDE.cy + 2.2} r={G_GRANDE.rOut - 1.2} fill="#0f172a" opacity=".22" />
        <circle cx={G_CHICO.cx + 1.2} cy={G_CHICO.cy + 1.8} r={G_CHICO.rOut - 1} fill="#0f172a" opacity=".22" />
        <g className="esc-comercio-gira-a" style={pivote(G_CHICO.cx, G_CHICO.cy)}>
          <path d={engranaje(G_CHICO.cx, G_CHICO.cy, G_CHICO.n, G_CHICO.rIn, G_CHICO.rOut, ANG_GRADOS + 180 + 30)} fill="#b3c3d9" strokeLinejoin="round" />
          <circle cx={G_CHICO.cx} cy={G_CHICO.cy} r={G_CHICO.rIn - 1.2} fill="#9db0cb" />
        </g>
        <g className="esc-comercio-gira-h" style={pivote(G_GRANDE.cx, G_GRANDE.cy)}>
          <path d={engranaje(G_GRANDE.cx, G_GRANDE.cy, G_GRANDE.n, G_GRANDE.rIn, G_GRANDE.rOut, ANG_GRADOS)} fill="#efb73f" strokeLinejoin="round" />
          <circle cx={G_GRANDE.cx} cy={G_GRANDE.cy} r={G_GRANDE.rIn - 2.4} fill="none" stroke="#fff" strokeWidth="1" opacity=".35" />
        </g>
        <circle cx={G_GRANDE.cx} cy={G_GRANDE.cy} r={G_GRANDE.rIn} fill={u('lu')} />
        <circle cx={G_CHICO.cx} cy={G_CHICO.cy} r={G_CHICO.rIn} fill={u('lu')} />
        <circle cx={G_GRANDE.cx} cy={G_GRANDE.cy} r="3.8" fill="#8a5a14" />
        <circle cx={G_GRANDE.cx - 0.8} cy={G_GRANDE.cy - 0.9} r="1.5" fill="#f7d98a" />
        <circle cx={G_CHICO.cx} cy={G_CHICO.cy} r="2.3" fill="#64748b" />
        <circle cx={G_CHICO.cx - 0.5} cy={G_CHICO.cy - 0.6} r=".9" fill="#e2e8f0" />

        {/* piloto: se enciende cuando el clavo queda a ras */}
        <circle cx="79" cy="56" r="3.6" fill="#334155" />
        <circle className="esc-comercio-aro" cx="79" cy="56" r="3.4" fill="none" stroke="#34d399" strokeWidth="1" />
        <circle className="esc-comercio-luz" cx="79" cy="56" r="2.4" fill="#34d399" />

        {/* ---------- el banco ---------- */}
        <rect x="70" y="111" width="10" height="35" rx="2" fill={u('lg')} />
        <rect x="220" y="111" width="10" height="35" rx="2" fill={u('lg')} />
        <rect x="80" y="128" width="140" height="6" rx="2" fill="#cf9448" />
        <rect x="80" y="128.6" width="140" height="1.6" rx=".8" fill="#fff" opacity=".3" />
        <path d="M74 86H226L236 100H64Z" fill={u('bt')} />
        <rect x="64" y="100" width="172" height="11" rx="2" fill={u('bf')} />
        <rect x="66" y="100.6" width="168" height="2" rx="1" fill="#fff" opacity=".4" />
        <path d="M74 106.4h38M124 107.4h58M196 106h32" stroke="#a96b2b" strokeWidth=".9" strokeLinecap="round" opacity=".25" />
        <rect x="138" y="103.6" width="24" height="5" rx="1.6" fill="#b57a35" opacity=".55" />
        <rect x="146" y="105.2" width="8" height="1.8" rx=".9" fill="#f3d9a8" />

        {/* tablón sobre el banco */}
        <path d="M138 80H182L188 90H132Z" fill={u('bl')} />
        <rect x="132" y="90" width="56" height="9" rx="1.6" fill={u('bn')} />
        <rect x="134" y="90.6" width="52" height="1.8" rx=".9" fill="#fff" opacity=".4" />
        <path d="M142 84h20M150 87h26" stroke="#c58a45" strokeWidth=".8" strokeLinecap="round" opacity=".28" />
        <ellipse cx="160" cy="85" rx="3.4" ry="1.1" fill="#8a4f1c" opacity=".4" />

        {/* el clavo: se hunde un poco más en cada golpe */}
        <g clipPath={u('cl')}>
          <g className="esc-comercio-clavo">
            <rect x="158.9" y="74" width="2.2" height="13" rx="1" fill="#b4c2d6" />
            <rect x="155.5" y="72" width="9" height="2.8" rx="1.4" fill="#e9eff7" />
            <rect x="156.6" y="72.5" width="4.4" height="1" rx=".5" fill="#fff" />
          </g>
        </g>

        {/* el martillo: gira sobre el extremo del mango (cabeza con la cara hacia abajo) */}
        <g className="esc-comercio-martillo" style={pivote(214, 58)}>
          <rect x="163" y="54.6" width="62" height="6.8" rx="3.4" fill={u('ma')} />
          <rect x="196" y="53.8" width="29" height="8.4" rx="4.2" fill={u('co')} />
          <rect x="199" y="55" width="22" height="1.8" rx=".9" fill="#fff" opacity=".5" />
          <path d="M204 54.2V61.8M209 54.2V61.8M214 54.2V61.8" stroke="#9a3412" strokeWidth=".8" opacity=".35" />
          {/* garra, cuello y cara */}
          <path d="M153.5 49C153.5 41 160 38 169 39L166.5 43.5C162 43 159 45 158.5 51Z" fill={u('ac')} />
          <rect x="153.5" y="47" width="12" height="21" rx="2.5" fill={u('ac')} />
          <rect x="152" y="63" width="15" height="9" rx="2.2" fill={u('fc')} />
          <rect x="155" y="49" width="2.2" height="13" rx="1.1" fill="#fff" opacity=".55" />
          <rect x="165" y="53.8" width="3" height="8.4" fill="#6f84a3" opacity=".4" />
        </g>

        {/* impacto: destello en cada golpe y chispas en el último (viajan con el clavo) */}
        <g className="esc-comercio-clavo-sig">
          <g transform="translate(160 72)">
            <path className="esc-comercio-destello" d={ESTRELLA} fill="#fff6c9" />
          </g>
          <g transform="translate(160 73)">
            <Salto dx={-24} dy={-16} giro={160} color="#fde047" />
            <Salto dx={22} dy={-19} giro={-140} color="#fb923c" />
            <Salto dx={-9} dy={-25} giro={90} color="#fff7c2" />
            <Salto dx={12} dy={-13} giro={-60} color="#fde68a" />
            <Salto dx={-28} dy={-5} giro={-200} color="#c07c34" astilla />
            <Salto dx={27} dy={-8} giro={240} color="#d9a05a" astilla />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Inventario" texto="Stock al día" tono="ambar" />
    </Marco>
  )
}

/** Escenas de comercio (minimarket y ferretería). */
export const ESCENAS_COMERCIO = {
  minimarket: EscenaMinimarket,
  ferreteria: EscenaFerreteria,
} as const
