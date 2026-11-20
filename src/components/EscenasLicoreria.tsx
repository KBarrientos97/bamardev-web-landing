import './EscenasLicoreria.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escena animada de la licorería (SVG propio), en la ciruela del rubro.
  Todo se mueve con CSS (sólo transform y opacity); los keyframes `esc-licor-*`
  viven en EscenasLicoreria.css y los compartidos `esc-*` en index.css. Es
  decorativa: el Marco ya la marca con aria-hidden.

  La historia (6,5 s, el ciclo del <Aviso>): una botella de vino sale del estante
  en arco, cae en la bolsa del mostrador, la bolsa salta con su aro y llega el
  aviso de la venta. La botella se hunde (ya se cobró) y el estante la repone. A
  la izquierda, la heladera de las cervezas echa su frío.
*/

type Tipo = 'vino' | 'verde' | 'whisky' | 'singani' | 'cerveza'

/** Botellas del estante: [x del centro, tipo], por repisa (base = y de la repisa). */
const REPISAS: { base: number; botellas: [number, Tipo][] }[] = [
  {
    base: 88,
    // El hueco en x = 200 es el de la botella que se vende (va aparte, en vuelo).
    botellas: [
      [110, 'vino'],
      [121, 'whisky'],
      [132, 'verde'],
      [143, 'singani'],
      [155, 'whisky'],
      [166, 'vino'],
      [178, 'singani'],
      [189, 'whisky'],
      [210, 'verde'],
    ],
  },
  {
    base: 112,
    botellas: [
      [108, 'cerveza'],
      [115, 'cerveza'],
      [122, 'cerveza'],
      [132, 'verde'],
      [143, 'whisky'],
      [154, 'vino'],
      [165, 'singani'],
      [176, 'whisky'],
      [187, 'vino'],
      [198, 'singani'],
      [209, 'whisky'],
    ],
  },
  {
    base: 136,
    botellas: [
      [142, 'vino'],
      [152, 'verde'],
      [162, 'whisky'],
      [172, 'cerveza'],
      [179, 'cerveza'],
    ],
  },
]

/** Colores de cada tipo: cuerpo, tapa y etiqueta. */
const COLOR: Record<Tipo, { cuerpo: string; tapa: string; etiqueta: string }> = {
  vino: { cuerpo: '#5b1235', tapa: '#c0266d', etiqueta: '#fdf2f8' },
  verde: { cuerpo: '#1d4a35', tapa: '#e0b04a', etiqueta: '#fef3c7' },
  whisky: { cuerpo: '#c2700f', tapa: '#1f1720', etiqueta: '#1f1720' },
  singani: { cuerpo: '#dbeafe', tapa: '#dc2626', etiqueta: '#ffffff' },
  cerveza: { cuerpo: '#7a3410', tapa: '#e8b54a', etiqueta: '#fde68a' },
}

/** Una botella con la base en (0, 0): cuerpo, hombros, cuello, tapa, etiqueta y brillo. */
function Botella({ tipo }: { tipo: Tipo }) {
  const c = COLOR[tipo]
  if (tipo === 'whisky') {
    // Petaca cuadrada, baja, de cuello corto.
    return (
      <g>
        <rect x="-4.5" y="-12.5" width="9" height="12.5" rx="1.3" fill={c.cuerpo} />
        <rect x="-1.3" y="-16" width="2.6" height="4" fill={c.cuerpo} />
        <rect x="-1.9" y="-18.2" width="3.8" height="2.6" rx=".6" fill={c.tapa} />
        <rect x="-3.4" y="-8.4" width="6.8" height="4.2" rx=".6" fill={c.etiqueta} />
        <rect x="-2.6" y="-6.8" width="5.2" height=".9" rx=".45" fill="#e0b04a" />
        <rect x="-3.6" y="-11.6" width="1.3" height="10" rx=".6" fill="#fff" opacity=".35" />
      </g>
    )
  }
  if (tipo === 'cerveza') {
    return (
      <g>
        <rect x="-2.6" y="-9.5" width="5.2" height="9.5" rx="1.2" fill={c.cuerpo} />
        <path d="M-2.6-9C-2.6-11-1-11.6-1-12.6V-14.4H1V-12.6C1-11.6 2.6-11 2.6-9Z" fill={c.cuerpo} />
        <rect x="-1.3" y="-15.6" width="2.6" height="1.5" rx=".5" fill={c.tapa} />
        <rect x="-2.6" y="-6.6" width="5.2" height="3.4" fill={c.etiqueta} />
        <rect x="-2" y="-9" width="1" height="8" rx=".5" fill="#fff" opacity=".3" />
      </g>
    )
  }
  // Vino y singani: altas, de hombros redondos y cuello largo.
  const transparente = tipo === 'singani'
  return (
    <g>
      <rect x="-3.6" y="-14" width="7.2" height="14" rx="1.6" fill={c.cuerpo} opacity={transparente ? 0.9 : 1} />
      <path d="M-3.6-13Q-3.6-17-1.3-18V-21H1.3V-18Q3.6-17 3.6-13Z" fill={c.cuerpo} opacity={transparente ? 0.9 : 1} />
      {transparente && <rect x="-2.8" y="-12" width="5.6" height="11.2" rx="1" fill="#bfdbfe" opacity=".7" />}
      <rect x="-1.5" y="-22.6" width="3" height="2.2" rx=".6" fill={c.tapa} />
      <rect x="-2.9" y="-9.4" width="5.8" height="5.2" rx=".7" fill={c.etiqueta} />
      <rect x="-1.9" y="-7.6" width="3.8" height=".8" rx=".4" fill={c.cuerpo} opacity=".55" />
      <rect x="-2.8" y="-13" width="1.2" height="12" rx=".6" fill="#fff" opacity=".35" />
    </g>
  )
}

/** Chispa de cuatro puntas, chica (destellos de la venta). */
const ESTRELLA = 'M0-6L1.6-1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6-1.6Z'

/**
 * Una licorería de barrio en tres cuartos: el letrero de neón, el estante de
 * botellas tras el vidrio, la heladera de cervezas a la izquierda y el mostrador
 * con la bolsa y el QR de cobro a la derecha.
 */
export function EscenaLicoreria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco fondo="bg-gradient-to-b from-fuchsia-100 via-pink-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdf2f8" />
            <stop offset="1" stopColor="#f5cfe4" />
          </linearGradient>
          <linearGradient id={g('fa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a8336f" />
            <stop offset="1" stopColor="#84235a" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5e1740" />
            <stop offset="1" stopColor="#6f1d4c" />
          </linearGradient>
          <linearGradient id={g('in')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a0c28" />
            <stop offset="1" stopColor="#5a1640" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d79a63" />
            <stop offset="1" stopColor="#a8693a" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('he')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f1dce8" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0f2fe" />
            <stop offset="1" stopColor="#a5d8f3" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9b2c6b" />
            <stop offset="1" stopColor="#6f1d4c" />
          </linearGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e7c08f" />
            <stop offset="1" stopColor="#c99a62" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <rect x="102" y="66" width="114" height="74" rx="2" />
          </clipPath>
          <clipPath id={g('ch')}>
            <rect x="27" y="90" width="40" height="47" rx="2" />
          </clipPath>
          {/* la botella en vuelo no se ve por debajo de la tapa del mostrador */}
          <clipPath id={g('cb')}>
            <rect x="0" y="0" width="300" height="116.6" />
          </clipPath>
        </defs>

        {/* plataforma: losa suave con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#e7aacb" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".35" />
        <ellipse className="esc-licor-sombra" cx="158" cy="146" rx="70" ry="6" fill="#500724" opacity=".14" />
        <ellipse cx="47" cy="146.5" rx="30" ry="4" fill="#500724" opacity=".12" />
        <ellipse cx="261" cy="147" rx="33" ry="4" fill="#500724" opacity=".12" />

        <g className="esc-licor-flota">
          {/* ---------- el local con su estante ---------- */}
          <path d="M82 66L96 61V145L82 149Z" fill={u('la')} />
          <path d="M82 45L94 40V60L82 64Z" fill="#c9a0b8" />
          <rect x="96" y="60" width="126" height="85" fill={u('fa')} />
          <rect x="96" y="60" width="2.4" height="85" fill="#fff" opacity=".16" />
          {/* el interior oscuro, tras el vidrio */}
          <rect x="102" y="66" width="114" height="74" rx="2" fill={u('in')} />
          {/* luz cálida que baja sobre las botellas */}
          <ellipse className="esc-licor-halo" cx="159" cy="68" rx="52" ry="10" fill="#f9a8d4" opacity=".55" />

          {REPISAS.map((r) => (
            <g key={r.base}>
              {r.botellas.map(([x, tipo]) => (
                <g key={x} transform={`translate(${x} ${r.base})`}>
                  <Botella tipo={tipo} />
                </g>
              ))}
              <rect x="102" y={r.base} width="114" height="3.2" fill={u('ma')} />
              <rect x="102" y={r.base} width="114" height="1" fill="#f3c99a" />
            </g>
          ))}
          {/* las cajas de cerveza de la repisa de abajo */}
          <rect x="105" y="122" width="30" height="14" rx="1.6" fill="#e0a32a" />
          <rect x="105" y="122" width="30" height="3" rx="1" fill="#f5c451" />
          <rect x="114" y="127" width="12" height="3.4" rx="1.7" fill="#8a5a12" opacity=".55" />
          <rect x="187" y="124" width="26" height="12" rx="1.6" fill="#be185d" />
          <rect x="187" y="124" width="26" height="2.6" rx="1" fill="#e7579a" />
          <rect x="194" y="128.4" width="12" height="3" rx="1.5" fill="#500724" opacity=".5" />

          {/* reflejo del vidrio y el brillo que lo cruza */}
          <path d="M102 66H132L102 104Z" fill="#fff" opacity=".07" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(88 66)">
              <g className="esc-licor-brillo" style={v({ '--d': '140px' })}>
                <path d="M0 0H10L-8 74H-18Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          <rect x="96" y="140" width="126" height="5" fill="#6f1d4c" />

          {/* letrero de neón */}
          <rect x="92" y="38" width="134" height="21" rx="4" fill="#2a0a1f" />
          <rect x="90" y="35.5" width="138" height="4.5" rx="2.2" fill="#9b2c6b" />
          <text
            className="esc-licor-halo"
            x="159"
            y="53.5"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="none"
            stroke="#f472b6"
            strokeWidth="3"
            strokeLinejoin="round"
            opacity=".55"
            textLength="112"
            lengthAdjust="spacing"
          >
            LICORERÍA
          </text>
          <text
            className="esc-licor-neon"
            x="159"
            y="53.5"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#fdf2f8"
            textLength="112"
            lengthAdjust="spacing"
          >
            LICORERÍA
          </text>

          {/* ---------- la heladera de cervezas (izquierda) ---------- */}
          <rect x="22" y="80" width="50" height="66" rx="4" fill={u('he')} />
          <rect x="22" y="80" width="50" height="8" rx="3" fill="#9b2c6b" />
          <rect x="30" y="82.6" width="18" height="2.8" rx="1.4" fill="#fdf2f8" opacity=".85" />
          <circle cx="64" cy="84" r="1.6" fill="#7dd3fc" />
          <rect x="27" y="90" width="40" height="47" rx="2" fill={u('vi')} />
          {[106, 123].map((y) => (
            <rect key={y} x="27" y={y} width="40" height="1.6" fill="#7fb6d6" />
          ))}
          {/* latas arriba, botellas abajo */}
          {[31, 37.5, 44, 50.5, 57].map((x, i) => (
            <g key={x}>
              <rect x={x} y="97" width="5" height="9" rx="1.2" fill={['#dc2626', '#f59e0b', '#16a34a', '#dc2626', '#2563eb'][i]} />
              <rect x={x + 0.8} y="98" width="1" height="7" rx=".5" fill="#fff" opacity=".45" />
            </g>
          ))}
          {[32, 39, 46, 53, 60].map((x) => (
            <g key={x} transform={`translate(${x} 123)`}>
              <Botella tipo="cerveza" />
            </g>
          ))}
          {[32, 40, 48, 56].map((x) => (
            <rect key={x} x={x} y="129" width="6" height="8" rx="1" fill="#c7e6f6" opacity=".9" />
          ))}
          <rect x="63" y="104" width="2.4" height="16" rx="1.2" fill="#94a3b8" />
          <g clipPath={`url(#${g('ch')})`}>
            <g transform="translate(14 90)">
              <g className="esc-licor-brillo" style={v({ '--d': '64px', animationDelay: '-3.2s' })}>
                <path d="M0 0H7L-6 47H-13Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          {/* el frío que sale arriba */}
          {[
            [33, '-4px', '0s'],
            [47, '3px', '-1.2s'],
            [60, '-2px', '-2.3s'],
          ].map(([x, dx, d]) => (
            <circle
              key={x as number}
              className="esc-licor-frio"
              cx={x as number}
              cy="78"
              r="3.2"
              fill="#e0f2fe"
              style={v({ '--dx': dx as string, animationDelay: d as string })}
            />
          ))}

          {/* ---------- el mostrador (derecha) ---------- */}
          <rect x="232" y="121" width="58" height="25" rx="2.4" fill={u('mo')} />
          <rect x="238" y="127" width="46" height="13" rx="2" fill="#500724" opacity=".35" />
          <rect x="229" y="115.6" width="64" height="6" rx="3" fill={u('ma')} />
          <rect x="231" y="116.2" width="60" height="1.4" rx=".7" fill="#f3c99a" />
          {/* el QR de cobro, parado en el mostrador */}
          <rect x="278" y="113" width="10" height="3" rx="1" fill="#6f1d4c" />
          <rect x="276" y="99" width="14" height="15" rx="1.6" fill="#fff" />
          <path
            d="M278 101h4v4h-4zM284 101h4v4h-4zM278 107h4v4h-4zM284.5 107.5h1.5v1.5h-1.5zM286.5 109.5h1.5v1.5h-1.5zM284.5 110h1.5v1h-1.5z"
            fill="#2a0a1f"
          />

          {/* la bolsa: el fondo, la botella que cae y el frente (los dos rebotan juntos) */}
          <g className="esc-licor-bolsa">
            <path d="M247 101H269L270.5 116H245.5Z" fill="#b98852" />
          </g>
          <g clipPath={`url(#${g('cb')})`}>
            <g transform="translate(200 88)">
              <g className="esc-licor-vuelo-x">
                <g className="esc-licor-vuelo-y">
                  <Botella tipo="vino" />
                </g>
              </g>
            </g>
          </g>
          <g className="esc-licor-bolsa">
            <path d="M246 104H270L271.5 116.4H244.5Z" fill={u('bo')} />
            <path d="M246 104H270L269.6 106.6H246.4Z" fill="#a8763f" opacity=".45" />
            <rect x="253" y="109" width="10" height="4" rx="1" fill="#fdf2f8" opacity=".75" />
          </g>
          {/* la venta: aro y destellos sobre la bolsa */}
          <ellipse className="esc-licor-aro" cx="258" cy="116" rx="13" ry="4" fill="none" stroke="#ec4899" strokeWidth="1.3" />
          <g transform="translate(246 94)">
            <path className="esc-licor-chispa" d={ESTRELLA} fill="#f9a8d4" />
          </g>
          <g transform="translate(271 90)">
            <path className="esc-licor-chispa" d={ESTRELLA} fill="#fbcfe8" style={{ animationDelay: '-6.35s' }} />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Venta" texto="Bs 85" tono="rosa" />
    </Marco>
  )
}
