import './EscenasMenuTv.css'
import { useId } from 'react'
import { Marco, svgBase, v } from './escenasBase'

/*
  «Menú en la TV» (feature `menu_digital` de gastronomía, 20-nov-2026): la tele
  del local pasa los platos uno por uno, con su foto y su precio, y la lista de
  al lado marca el que se está mostrando. El celular de la derecha es el del
  dueño: lo que cambia ahí sale en la TV. Mismo estilo que las escenas de
  Funciones (viewBox 320 × 150, la plataforma y el ciclo de 6,5 s). Sin el
  aviso de las otras: tapaba la lista de precios, y la TV ya es el aviso. Los
  keyframes `esc-tv-*` viven en EscenasMenuTv.css.
*/

const VB = '0 0 320 150'

/** La lista del costado: [nombre (ancho de la barra), precio, color del punto]. */
const LISTA: [number, string, string][] = [
  [44, 'Bs 25', '#f97316'],
  [38, 'Bs 18', '#f472b6'],
  [34, 'Bs 12', '#a16207'],
  [46, 'Bs 30', '#22c55e'],
]

/** Hamburguesa centrada en (0, 0). */
function Hamburguesa() {
  return (
    <g>
      <path d="M-15-2C-15-12-7-16 0-16S15-12 15-2Z" fill="#f59e0b" />
      <path d="M-15-2C-15-12-7-16 0-16S15-12 15-2Z" fill="#fff" opacity=".12" />
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
      <circle cx="-6" cy="-9" r="6.5" fill="#f9a8d4" />
      <circle cx="6" cy="-9" r="6.5" fill="#fde68a" />
      <circle cx="0" cy="-15" r="6.5" fill="#a16207" />
      <circle cx="0" cy="-22.5" r="2.4" fill="#ef4444" />
      <path d="M-13-5H13L6 6H-6Z" fill="#e0f2fe" opacity=".9" />
      <rect x="-1.4" y="6" width="2.8" height="6" fill="#e0f2fe" />
      <rect x="-7" y="11.5" width="14" height="2.6" rx="1.3" fill="#e0f2fe" />
      <path d="M-11-4.5H-4L-6 3Z" fill="#fff" opacity=".45" />
    </g>
  )
}

/** Café con su vapor centrado en (0, 0). */
function Cafe() {
  return (
    <g>
      {[-4, 1, 6].map((x, i) => (
        <path
          key={x}
          className="esc-tv-vapor"
          d={`M${x} -12c-2-2 2-4 0-6`}
          stroke="#e7e5e4"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          style={{ animationDelay: `${-i * 0.6}s` }}
        />
      ))}
      <path d="M-12-8H10V3A8 8 0 0 1 2 11H-4A8 8 0 0 1-12 3Z" fill="#fafaf9" />
      <path d="M-12-8H10V-5H-12Z" fill="#92400e" />
      <path d="M10-5H13A4 4 0 0 1 13 3H10" fill="none" stroke="#fafaf9" strokeWidth="2.4" />
      <ellipse cx="-1" cy="13" rx="15" ry="2.6" fill="#d6d3d1" />
    </g>
  )
}

const PLATOS = [
  { nombre: 'Hamburguesa', Dibujo: Hamburguesa, desfase: '0s' },
  { nombre: 'Copa helada', Dibujo: CopaHelada, desfase: '-4.333s' },
  { nombre: 'Café con leche', Dibujo: Cafe, desfase: '-2.21s' },
]

export function EscenaFnMenuTv() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pl')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff7ed" />
            <stop offset="1" stopColor="#fed7aa" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#292524" />
            <stop offset="1" stopColor="#1c1917" />
          </linearGradient>
          <radialGradient id={g('lu')} cx=".5" cy=".45" r=".6">
            <stop offset="0" stopColor="#f59e0b" stopOpacity=".35" />
            <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".12" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cp')}>
            <rect x="55" y="19" width="210" height="85" rx="2.5" />
          </clipPath>
        </defs>

        {/* plataforma */}
        <ellipse cx="160" cy="135" rx="142" ry="10" fill="#fdba74" />
        <ellipse cx="160" cy="131" rx="142" ry="10" fill={u('pl')} />
        <ellipse cx="160" cy="129" rx="118" ry="6.5" fill="#fff" opacity=".35" />
        <ellipse cx="160" cy="129.5" rx="80" ry="3.6" fill="#7c2d12" opacity=".14" />
        <ellipse cx="288" cy="129.5" rx="14" ry="2.6" fill="#7c2d12" opacity=".14" />

        <g className="esc-tv-flota">
          {/* patas de la tele */}
          <path d="M84 108L78 126M236 108L242 126" stroke="#57534e" strokeWidth="3" strokeLinecap="round" />
          {/* la tele: grosor abajo-derecha, marco negro y pantalla */}
          <rect x="52" y="16" width="220" height="94" rx="6" fill="#0c0a09" />
          <rect x="50" y="14" width="220" height="94" rx="6" fill="#1c1917" />
          <rect x="50.6" y="14.6" width="218.8" height="1.2" rx=".6" fill="#fff" opacity=".25" />
          <rect x="55" y="19" width="210" height="85" rx="2.5" fill={u('pa')} />
          <circle cx="160" cy="106" r=".9" fill="#ef4444" />

          <g clipPath={`url(#${g('cp')})`}>
            {/* encabezado del menú */}
            <text x="63" y="30" fontSize="7" fontWeight="800" fill="#fbbf24" letterSpacing=".8">
              MENÚ DEL DÍA
            </text>
            <rect x="63" y="33" width="88" height=".8" fill="#fbbf24" opacity=".35" />

            {/* el plato del momento: foto con su luz, nombre y la etiqueta PROMO */}
            <rect x="62" y="37" width="90" height="61" rx="5" fill="#0c0a09" />
            <rect x="62" y="37" width="90" height="61" rx="5" fill={u('lu')} />
            {PLATOS.map(({ nombre, Dibujo, desfase }) => (
              <g key={nombre} className="esc-tv-plato" style={{ animationDelay: desfase }}>
                <g transform="translate(107 64)">
                  <Dibujo />
                </g>
                <text x="107" y="92" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fafaf9">
                  {nombre}
                </text>
              </g>
            ))}
            <g transform="translate(138 44)">
              <g className="esc-tv-promo">
                <rect x="-12" y="-4.5" width="24" height="9" rx="4.5" fill="#ef4444" />
                <text x="0" y="2.2" textAnchor="middle" fontSize="5.4" fontWeight="800" fill="#fff">
                  PROMO
                </text>
              </g>
            </g>

            {/* la lista, con la franja que sigue al plato de la pantalla */}
            <rect className="esc-tv-franja" x="158" y="37" width="100" height="12" rx="3" fill="#f59e0b" opacity=".2" />
            <rect className="esc-tv-franja" x="158" y="37" width="2.4" height="12" rx="1.2" fill="#f59e0b" />
            {LISTA.map(([ancho, precio, punto], i) => (
              <g key={precio + i}>
                <circle cx="166" cy={43 + i * 14} r="2.2" fill={punto} />
                <rect x="172" y={41.4 + i * 14} width={ancho} height="3.2" rx="1.6" fill="#e7e5e4" opacity=".85" />
                <text x="255" y={45.4 + i * 14} textAnchor="end" fontSize="7" fontWeight="800" fill="#fbbf24">
                  {precio}
                </text>
              </g>
            ))}
            <rect x="158" y="93" width="100" height="5" rx="2.5" fill="#fbbf24" opacity=".15" />

            {/* el brillo que cruza la pantalla */}
            <g transform="translate(40 19)">
              <g className="esc-tv-brillo" style={v({ '--d': '240px' })}>
                <path d="M0 0H14L-6 85H-20Z" fill={u('gl')} />
              </g>
            </g>
          </g>

          {/* el celular del dueño: lo que se cambia acá sale en la TV */}
          <rect x="278" y="70" width="22" height="42" rx="4" fill="#1e293b" />
          <rect x="280" y="73" width="18" height="36" rx="2.4" fill="#fff" />
          <rect x="282" y="76" width="10" height="2" rx="1" fill="#f59e0b" />
          {[82, 88, 94].map((y) => (
            <g key={y}>
              <rect x="282" y={y} width="9" height="2" rx="1" fill="#e2e8f0" />
              <rect x="293" y={y} width="3" height="2" rx="1" fill="#fbbf24" />
            </g>
          ))}
          <rect x="282" y="101" width="14" height="4.4" rx="2.2" fill="#10b981" />
          <circle className="esc-tv-toque" cx="289" cy="103" r="5" fill="none" stroke="#10b981" strokeWidth="1.4" style={{ opacity: 0 }} />
        </g>
      </svg>
    </Marco>
  )
}
