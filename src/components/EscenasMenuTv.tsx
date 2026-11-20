import './EscenasMenuTv.css'
import { useId } from 'react'
import { Marco, svgBase, v } from './escenasBase'

/*
  «Menú en la TV» (feature `menu_digital` de gastronomía, 20-nov-2026), como se ve
  en el local: la pared de atrás del mostrador con DOS teles colgadas, porque así
  lo tienen muchos negocios. La de la izquierda pasa los platos en promoción uno
  por uno (foto grande, nombre y precio); la de la derecha es la carta entera por
  categoría y marca con una franja el plato que está saliendo en la otra. Abajo,
  el mostrador con la caja y la cajera, y un cliente de espaldas que mira las
  teles. Sin <Aviso>: taparía la tele de la derecha, y las teles ya son el mensaje.

  Mismo lenguaje que las escenas de Funciones (viewBox 320 × 150, plataforma, luz
  de arriba a la izquierda, ciclo de 6,5 s). Los platos cambian en cada tercio del
  ciclo (0 %, 33 % y 66 %). Ningún elemento animado lleva `transform=""`: la regla
  `.escena svg *` le movería el pivote; los que se trasladan van dentro de un <g>.
  Keyframes `esc-mtv-*` en EscenasMenuTv.css.
*/

const VB = '0 0 320 150'

/** Desfase de cada plato: entra a los 0 %, 33 % y 66 % del ciclo (delay negativo, sin tirón al repetir). */
const DESFASES = ['0s', '-4.333s', '-2.167s']

/** Pollo frito en canasta, centrado en (0, 0). */
function PolloFrito({ carne }: { carne: string }) {
  const presa = (d: string, hueso: [number, number, number, number], nudos: [number, number][]) => (
    <g>
      <path d={d} fill={carne} />
      <line x1={hueso[0]} y1={hueso[1]} x2={hueso[2]} y2={hueso[3]} stroke="#fef3c7" strokeWidth="2.6" strokeLinecap="round" />
      {nudos.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.7" fill="#fef3c7" />
      ))}
    </g>
  )
  return (
    <g>
      {/* papas atrás */}
      {[
        [-13, -4, -10, 6],
        [-8, -9, -6, 5],
        [9, -8, 8, 5],
        [14, -3, 12, 6],
      ].map(([x1, y1, x2, y2]) => (
        <line key={x1} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="2.8" strokeLinecap="round" />
      ))}
      {/* dos presas: una con el hueso a la izquierda y otra a la derecha */}
      {presa('M10-1C13-7 8-13 2-12C-2-11-4-7-2-3C0 1 4 4 7 3C9 2.5 9.6 1 10-1Z', [-2, -9, -7, -14], [[-7.6, -15.4], [-9, -13.4]])}
      {presa('M-11 0C-14-6-9-12-3-11C1-10 3-6 1-2C-1 2-5 5-8 4C-10 3.5-10.6 2-11 0Z', [1, -8, 6, -13], [[6.6, -14.4], [8, -12.4]])}
      <ellipse cx="-5" cy="-6" rx="2.6" ry="1.4" fill="#fff" opacity=".25" />
      <ellipse cx="5" cy="-7" rx="2.4" ry="1.3" fill="#fff" opacity=".22" />
      {/* canasta con papel cuadriculado */}
      <path d="M-19 2H19L15 14H-15Z" fill="#dc2626" />
      <path d="M-19 2H19L18.2 4.4H-18.2Z" fill="#fff" opacity=".3" />
      {[-12, -4, 4, 12].map((x) => (
        <rect key={x} x={x - 1.6} y="6.5" width="3.2" height="3.2" rx=".6" fill="#fff" opacity=".8" />
      ))}
    </g>
  )
}

/** Hamburguesa centrada en (0, 0). */
function Hamburguesa() {
  return (
    <g>
      <path d="M-15-2C-15-12-7-16 0-16S15-12 15-2Z" fill="#f59e0b" />
      <path d="M-11-6C-11-11-6-14-1-14" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".35" />
      {[-8, -3, 3, 8].map((x) => (
        <ellipse key={x} cx={x} cy={-10 + Math.abs(x) * 0.25} rx=".9" ry=".55" fill="#fef3c7" />
      ))}
      <path d="M-16-2H16L13 1.5H-13Z" fill="#22c55e" />
      <rect x="-15" y="1" width="30" height="3.4" rx="1.4" fill="#facc15" />
      <rect x="-15.5" y="4" width="31" height="5" rx="2.4" fill="#7c2d12" />
      <path d="M-14 9H14C14 13 10 14 0 14S-14 13-14 9Z" fill="#f59e0b" />
    </g>
  )
}

/** Copa helada centrada en (0, 0). */
function CopaHelada() {
  return (
    <g>
      <circle cx="-6" cy="-7" r="6.5" fill="#f9a8d4" />
      <circle cx="6" cy="-7" r="6.5" fill="#fde68a" />
      <circle cx="0" cy="-13" r="6.5" fill="#a16207" />
      <circle cx="-2" cy="-15" r="1.6" fill="#fff" opacity=".3" />
      <circle cx="1.6" cy="-20" r="2.4" fill="#ef4444" />
      <path d="M-13-3H13L6 8H-6Z" fill="#e0f2fe" opacity=".9" />
      <rect x="-1.4" y="8" width="2.8" height="5" fill="#e0f2fe" />
      <rect x="-7" y="12.5" width="14" height="2.6" rx="1.3" fill="#e0f2fe" />
      <path d="M-11-2.5H-4L-6 5Z" fill="#fff" opacity=".45" />
    </g>
  )
}

/** Platos que pasa la TV 1 (en el mismo orden que la franja de la TV 2). */
const PLATOS = [
  { nombre: 'Pollo frito', antes: 'Bs 30', precio: 'Bs 25', dibujo: 'pollo' },
  { nombre: 'Hamburguesa', antes: 'Bs 35', precio: 'Bs 30', dibujo: 'hamburguesa' },
  { nombre: 'Copa helada', antes: 'Bs 22', precio: 'Bs 18', dibujo: 'copa' },
] as const

/** La carta de la TV 2: [nombre, precio, color del punto] por categoría. */
const CARTA: { titulo: string; y: number; filas: [string, string, string][] }[] = [
  {
    titulo: 'PLATOS',
    y: 29,
    filas: [
      ['Pollo frito', 'Bs 25', '#f97316'],
      ['Hamburguesa', 'Bs 30', '#f59e0b'],
      ['Salchipapa', 'Bs 20', '#eab308'],
    ],
  },
  {
    titulo: 'POSTRES Y BEBIDAS',
    y: 58,
    filas: [
      ['Copa helada', 'Bs 18', '#f472b6'],
      ['Refresco', 'Bs 8', '#38bdf8'],
    ],
  },
]

/** Las dos teles: esquina del marco. La pantalla va 3,5 adentro (123 × 65). */
const TV1 = 22
const TV2 = 168
const TV_Y = 8

export function EscenaFnMenuTv() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  /** Marco, grosor, sombra en la pared y las dos varillas del techo de una tele. */
  const tele = (x: number) => (
    <g key={x}>
      {/* sombra sobre la pared (la luz viene de arriba a la izquierda) */}
      <rect x={x + 5} y={TV_Y + 6} width="130" height="72" rx="7" fill="#7c2d12" opacity=".06" />
      <rect x={x + 3} y={TV_Y + 3.5} width="130" height="72" rx="6" fill="#7c2d12" opacity=".1" />
      {/* varillas del techo */}
      {[x + 28, x + 102].map((vx) => (
        <g key={vx}>
          <rect x={vx - 0.9} y="-2" width="1.8" height={TV_Y + 3} fill="#57534e" />
          <rect x={vx - 2.6} y={TV_Y - 1.4} width="5.2" height="2.4" rx="1" fill="#44403c" />
        </g>
      ))}
      <rect x={x + 1.5} y={TV_Y + 1.5} width="130" height="72" rx="5" fill="#0c0a09" />
      <rect x={x} y={TV_Y} width="130" height="72" rx="5" fill="#1c1917" />
      <rect x={x + 1} y={TV_Y + 0.6} width="128" height="1.1" rx=".55" fill="#fff" opacity=".22" />
      <rect x={x + 3.5} y={TV_Y + 3.5} width="123" height="65" rx="2" fill={u('pa')} />
      <circle cx={x + 65} cy={TV_Y + 70.4} r=".8" fill="#ef4444" />
    </g>
  )

  /** Brillo de vidrio que cruza una pantalla. */
  const brillo = (x: number, clip: string, retraso: string) => (
    <g clipPath={u(clip)}>
      <g className="esc-mtv-brillo" style={{ ...v({ '--d': '150px' }), animationDelay: retraso }}>
        <path d={`M${x - 20} ${TV_Y + 3.5}H${x - 8}L${x - 26} ${TV_Y + 68.5}H${x - 38}Z`} fill={u('gl')} />
      </g>
    </g>
  )

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-orange-100 via-amber-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pl')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff7ed" />
            <stop offset="1" stopColor="#fed7aa" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#292524" />
            <stop offset="1" stopColor="#0c0a09" />
          </linearGradient>
          <radialGradient id={g('lu')} cx=".5" cy=".45" r=".62">
            <stop offset="0" stopColor="#f59e0b" stopOpacity=".42" />
            <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".13" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('pf')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id={g('mt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3d3a6" />
            <stop offset="1" stopColor="#d9a46a" />
          </linearGradient>
          <linearGradient id={g('mf')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a8643a" />
            <stop offset="1" stopColor="#7c4322" />
          </linearGradient>
          <linearGradient id={g('ca')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5eead4" />
            <stop offset="1" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id={g('pi')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe3cc" />
            <stop offset="1" stopColor="#e8b48c" />
          </linearGradient>
          <clipPath id={g('c1')}>
            <rect x={TV1 + 3.5} y={TV_Y + 3.5} width="123" height="65" rx="2" />
          </clipPath>
          <clipPath id={g('c2')}>
            <rect x={TV2 + 3.5} y={TV_Y + 3.5} width="123" height="65" rx="2" />
          </clipPath>
          <clipPath id={g('cf')}>
            <rect x="29" y="15" width="62" height="58" rx="4" />
          </clipPath>
        </defs>

        {/* zócalo de la pared, detrás del mostrador */}
        <rect x="0" y="86" width="320" height="14" fill="#fdba74" opacity=".18" />

        {/* plataforma */}
        <ellipse cx="160" cy="137" rx="150" ry="12" fill="#fdba74" />
        <ellipse cx="160" cy="133" rx="150" ry="12" fill={u('pl')} />
        <ellipse cx="160" cy="130.5" rx="126" ry="7" fill="#fff" opacity=".35" />

        {tele(TV1)}
        {tele(TV2)}

        {/* ---------- TV 1: el carrusel de promociones ---------- */}
        <g clipPath={u('c1')}>
          <rect x="29" y="15" width="62" height="58" rx="4" fill="#0c0a09" />
          <rect x="29" y="15" width="62" height="58" rx="4" fill={u('lu')} />
          <ellipse cx="60" cy="62" rx="22" ry="3.4" fill="#000" opacity=".35" />
          <g clipPath={u('cf')}>
            {PLATOS.map(({ dibujo }, i) => (
              <g key={dibujo} className="esc-mtv-plato" style={{ ...v({ '--dx': '18px' }), animationDelay: DESFASES[i], opacity: i === 0 ? 1 : 0 }}>
                <g transform={`translate(60 ${dibujo === 'copa' ? 49 : 46}) scale(1.2)`}>
                  {dibujo === 'pollo' ? <PolloFrito carne={u('pf')} /> : dibujo === 'hamburguesa' ? <Hamburguesa /> : <CopaHelada />}
                </g>
              </g>
            ))}
          </g>
          {/* etiqueta PROMO sobre la foto */}
          <g className="esc-mtv-promo">
            <rect x="32" y="18" width="25" height="9" rx="4.5" fill="#ef4444" />
            <text x="44.5" y="24.4" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#fff" letterSpacing=".3">
              PROMO
            </text>
          </g>

          <text x="97" y="24" fontSize="5.6" fontWeight="800" fill="#fbbf24" letterSpacing=".6">
            DEL DÍA
          </text>
          {PLATOS.map(({ nombre, antes, precio }, i) => (
            <g key={nombre} className="esc-mtv-texto" style={{ ...v({ '--dx': '5px' }), animationDelay: DESFASES[i], opacity: i === 0 ? 1 : 0 }}>
              <text x="96.5" y="36" fontSize="6.8" fontWeight="800" fill="#fafaf9">
                {nombre}
              </text>
              <text x="97" y="47" fontSize="5.8" fontWeight="700" fill="#a8a29e">
                {antes}
              </text>
              <rect x="96.5" y="44.6" width="17" height=".8" fill="#ef4444" />
              <text x="97" y="61" fontSize="12.5" fontWeight="800" fill="#fbbf24">
                {precio}
              </text>
            </g>
          ))}
          {/* puntos del carrusel: el encendido es el plato de la pantalla */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx={99 + i * 6} cy="69" r="1.5" fill="#57534e" />
              <circle className="esc-mtv-punto" cx={99 + i * 6} cy="69" r="1.5" fill="#fbbf24" style={{ animationDelay: DESFASES[i], opacity: i === 0 ? 1 : 0 }} />
            </g>
          ))}
        </g>
        {brillo(TV1, 'c1', '0s')}

        {/* ---------- TV 2: la carta, con la franja que sigue al plato de la TV 1 ---------- */}
        <g clipPath={u('c2')}>
          <text x="176" y="20" fontSize="6.6" fontWeight="800" fill="#fbbf24" letterSpacing=".9">
            CARTA
          </text>
          <rect x="176" y="22.4" width="114" height=".7" fill="#fbbf24" opacity=".35" />
          <g className="esc-mtv-franja">
            <rect x="174" y="30.6" width="118" height="7.4" rx="2" fill="#f59e0b" opacity=".3" />
            <rect x="174" y="30.6" width="2.2" height="7.4" rx="1.1" fill="#fbbf24" />
          </g>
          {CARTA.map(({ titulo, y, filas }) => (
            <g key={titulo}>
              <text x="176" y={y} fontSize="5.5" fontWeight="800" fill="#a8a29e" letterSpacing=".6">
                {titulo}
              </text>
              {filas.map(([nombre, precio, punto], i) => (
                <g key={nombre}>
                  <circle cx="181" cy={y + 5 + i * 7} r="1.8" fill={punto} />
                  <text x="185.5" y={y + 7 + i * 7} fontSize="6" fontWeight="700" fill="#e7e5e4">
                    {nombre}
                  </text>
                  <text x="289" y={y + 7 + i * 7} textAnchor="end" fontSize="6" fontWeight="800" fill="#fbbf24">
                    {precio}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </g>
        {brillo(TV2, 'c2', '-0.4s')}

        {/* ---------- la cajera, detrás del mostrador ---------- */}
        <path d="M64 100C64 92 70 89 77 89S90 92 90 100Z" fill="#f97316" />
        <rect x="74.5" y="85" width="5" height="5" rx="2" fill="#e8b48c" />
        <circle cx="77" cy="80.5" r="6.6" fill={u('pi')} />
        <path d="M70.4 80C70 74 74 72.4 77 72.4S84 74 83.6 80C81 77.2 73 77.2 70.4 80Z" fill="#3f2a1d" />
        <path d="M70 77.6H84.4L85.6 79.4H70Z" fill="#ea580c" />
        <circle cx="74.6" cy="81.4" r=".75" fill="#3f2a1d" />
        <circle cx="79.4" cy="81.4" r=".75" fill="#3f2a1d" />
        <path d="M75.6 84q1.4 1 2.8 0" stroke="#b45309" strokeWidth=".8" strokeLinecap="round" fill="none" />

        {/* ---------- el mostrador ---------- */}
        <ellipse cx="160" cy="132" rx="134" ry="4" fill="#7c2d12" opacity=".16" />
        <rect x="30" y="101" width="260" height="31" fill={u('mf')} />
        {[82, 134, 186, 238].map((x) => (
          <rect key={x} x={x} y="104" width=".9" height="26" fill="#fff" opacity=".12" />
        ))}
        <rect x="30" y="101" width="260" height="2.6" fill="#000" opacity=".14" />
        <rect x="26" y="96" width="268" height="5.4" rx="2" fill={u('mt')} />
        <rect x="27" y="96.4" width="266" height="1" rx=".5" fill="#fff" opacity=".55" />

        {/* la caja: pantallita sobre su pie, al lado de la cajera */}
        <path d="M45 96L47.5 90H53.5L56 96Z" fill="#475569" />
        <rect x="38" y="78" width="25" height="14" rx="2" fill="#1e293b" />
        <rect x="39.6" y="79.6" width="21.8" height="10.8" rx="1.2" fill="#f8fafc" />
        <rect x="41.4" y="81.6" width="9" height="1.8" rx=".9" fill="#cbd5e1" />
        <rect x="41.4" y="84.6" width="12" height="1.8" rx=".9" fill="#e2e8f0" />
        <rect x="53" y="85.8" width="7" height="3" rx="1.5" fill="#10b981" />
        {/* campanita de mostrador y servilletero */}
        <ellipse cx="112" cy="96" rx="6" ry="1.2" fill="#78716c" />
        <path d="M107.4 95.6A4.6 4.6 0 0 1 116.6 95.6Z" fill="#d6d3d1" />
        <circle cx="112" cy="90.4" r=".9" fill="#a8a29e" />
        <path d="M108.8 93.4A3.4 3.4 0 0 1 111 91.4" stroke="#fff" strokeWidth=".8" strokeLinecap="round" fill="none" opacity=".7" />
        <rect x="262" y="88" width="14" height="8.4" rx="1.2" fill="#e7e5e4" />
        <path d="M264 88V84.6H274V88" fill="#fff" />
        <rect x="262" y="88" width="14" height="1.2" fill="#a8a29e" opacity=".5" />

        {/* ---------- el cliente, de espaldas, mirando las teles ---------- */}
        <ellipse cx="216" cy="133" rx="20" ry="2.8" fill="#7c2d12" opacity=".2" />
        <path d="M197 133C197 108 204 97 216 97S235 108 235 133Z" fill={u('ca')} />
        <path d="M201 120C201 108 206 100 213 98.6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".3" />
        <rect x="212.5" y="91" width="7" height="8" rx="3" fill="#e0a77c" />
        <g className="esc-mtv-mira">
          <ellipse cx="207.6" cy="88" rx="1.6" ry="2.4" fill="#e0a77c" />
          <ellipse cx="224.4" cy="88" rx="1.6" ry="2.4" fill="#e0a77c" />
          <circle cx="216" cy="86" r="8.4" fill="#2b1d14" />
          <path d="M209 82C210 77 214 76 218 76.6C214 78 211.4 80 211 84Z" fill="#fff" opacity=".14" />
        </g>
      </svg>
    </Marco>
  )
}
