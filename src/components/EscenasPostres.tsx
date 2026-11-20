import './EscenasPostres.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escena animada del carrito de postres (SVG propio): la variante "Postres" del
  restaurante. Calcada de un carrito real (foto del dueño, 20-nov): kiosco
  blanco con toldo a rayas rosa y festón, repisitas rosadas con las salsas y
  los vasos, la fila de frascos de toppings en el mostrador, la franja rosa
  ondulada y el logo redondo de fresas con crema al frente. Todo se mueve con
  CSS (sólo transform y opacity); los keyframes `esc-postre-*` viven en
  EscenasPostres.css. Es decorativa: el Marco ya la marca con aria-hidden.

  La historia (6,5 s, el ciclo del <Aviso>): sobre el vaso del mostrador cae
  la crema con su frutilla y una lluvia de grageas, el vaso salta con su aro y
  llega el aviso de la venta; el vaso se va (ya se lo llevaron) y sirven otro.
*/

/** Un vaso de fresas con crema con la base en (0, 0): plástico, crema y trozos de frutilla. */
function Vaso({ ancho, alto }: { ancho: number; alto: number }) {
  const a = ancho / 2
  const b = a - 2
  return (
    <g>
      <path d={`M${-a} ${-alto}H${a}L${b} 0H${-b}Z`} fill="#ffffff" opacity=".75" />
      <path d={`M${-a + 1} ${-alto + 2}H${a - 1}L${b - 0.6} -0.8H${-b + 0.6}Z`} fill="#fffaf5" />
      {[
        [-0.45, 0.35],
        [0.3, 0.55],
        [-0.1, 0.75],
        [0.5, 0.25],
      ].map(([fx, fy]) => (
        <circle key={`${fx}${fy}`} cx={fx * a} cy={-alto * (1 - fy)} r="1.3" fill="#ef4444" opacity=".9" />
      ))}
      <rect x={-a - 0.6} y={-alto - 1.2} width={ancho + 1.2} height="1.8" rx=".9" fill="#fbcfe0" />
      <rect x={-a + 1.2} y={-alto + 1} width="1.3" height={alto - 3} rx=".6" fill="#fff" opacity=".8" />
    </g>
  )
}

/** Chispa de cuatro puntas, chica (destellos de la venta). */
const ESTRELLA = 'M0-6L1.6-1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6-1.6Z'

/** Las grageas que caen sobre el vaso: [x, y final, color]. */
const GRAGEAS: [number, number, string][] = [
  [-4.6, -15.4, '#3b82f6'],
  [-1.6, -16.8, '#facc15'],
  [2.8, -15.8, '#22c55e'],
  [4.8, -17, '#f472b6'],
  [0.6, -18.4, '#f97316'],
]

/** Los frascos de toppings del mostrador: [x, color del contenido, color de los puntitos]. */
const FRASCOS: [number, string, string | null][] = [
  [114, '#5b3417', null],
  [127, '#fff7ed', '#e7c3a5'],
  [140, '#fde68a', '#3b82f6'],
  [153, '#c08a4f', '#8a5a2b'],
  [166, '#f9a8d4', '#ef4444'],
]

/** Siete rayas del toldo, alternando rosa y blanco. */
const RAYAS = Array.from({ length: 7 }, (_, i) => i)
const rosa = (i: number) => (i % 2 === 0 ? '#f4a3c4' : '#ffffff')

/** Frutilla con la base en (x, y + 2,4): cuerpo, hoja arriba. */
function frutilla(x: number, y: number) {
  return (
    <g key={`${x}-${y}`}>
      <path
        d={`M${x} ${y + 2.4}C${x - 2} ${y + 2.4} ${x - 2.4} ${y} ${x - 1.4} ${y - 0.8}C${x - 0.8} ${y - 1.4} ${x + 0.8} ${y - 1.4} ${x + 1.4} ${y - 0.8}C${x + 2.4} ${y} ${x + 2} ${y + 2.4} ${x} ${y + 2.4}Z`}
        fill="#ef4444"
      />
      <path d={`M${x - 1} ${y - 1}L${x} ${y - 2}L${x + 1} ${y - 1}`} fill="#16a34a" />
    </g>
  )
}

/**
 * El carrito de postres de frente: toldo a rayas con festón, cuatro postes,
 * las repisitas de las salsas y los vasos, el mostrador con los frascos de
 * toppings, la franja ondulada y la caja con el logo de fresas con crema. A la
 * izquierda la pizarra del menú y a la derecha la conservadora de la fruta.
 */
export function EscenaPostres() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco fondo="bg-gradient-to-b from-pink-100 via-rose-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1f5" />
            <stop offset="1" stopColor="#fbcfe0" />
          </linearGradient>
          <linearGradient id={g('ca')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#eceef2" />
            <stop offset=".16" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f5f6f8" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".8" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('pi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#334155" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('to')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#831843" stopOpacity="0" />
            <stop offset="1" stopColor="#831843" stopOpacity=".12" />
          </linearGradient>
          <clipPath id={g('cl')}>
            <circle cx="150" cy="119" r="12" />
          </clipPath>
          <clipPath id={g('ct')}>
            <path d="M108 15H192L201 29H99Z" />
          </clipPath>
        </defs>

        {/* plataforma: losa suave con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#f3b3cb" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".4" />
        <ellipse className="esc-postre-sombra" cx="150" cy="146" rx="56" ry="6" fill="#831843" opacity=".14" />
        <ellipse cx="52" cy="147" rx="22" ry="3.4" fill="#831843" opacity=".12" />
        <ellipse cx="244" cy="147" rx="26" ry="3.6" fill="#831843" opacity=".12" />

        <g className="esc-postre-flota">
          {/* ---------- los postes de atrás ---------- */}
          <rect x="117" y="34" width="2.4" height="54" fill="#e5e7eb" />
          <rect x="180.6" y="34" width="2.4" height="54" fill="#e5e7eb" />

          {/* ---------- la caja con su logo ---------- */}
          <rect x="104" y="96" width="92" height="46" rx="1.6" fill={u('ca')} />
          <rect x="104" y="140" width="92" height="3.4" rx="1" fill="#e5e7eb" />
          {[110, 190].map((x) => (
            <g key={x}>
              <rect x={x - 1.6} y="143" width="3.2" height="2" fill="#94a3b8" />
              <circle cx={x} cy="146" r="2.4" fill="#475569" />
            </g>
          ))}
          {/* el logo: un vaso de fresas con crema en un círculo rosa con rayos */}
          <circle cx="150" cy="119" r="15.5" fill="#f4a3c4" />
          <circle cx="150" cy="119" r="15.5" fill="none" stroke="#fff" strokeWidth="1.4" />
          <circle cx="150" cy="119" r="12" fill="#fde7f0" />
          <g clipPath={`url(#${g('cl')})`}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a0 = (i * Math.PI) / 3
              const a1 = ((i + 0.5) * Math.PI) / 3
              const p = (a: number) => `${(150 + 16 * Math.cos(a)).toFixed(2)} ${(119 + 16 * Math.sin(a)).toFixed(2)}`
              return <path key={i} d={`M150 119L${p(a0)}L${p(a1)}Z`} fill="#fbcfe0" />
            })}
          </g>
          <path d="M143 120H157L155 126.6H145Z" fill="#fff" />
          <path d="M143 120H157L156.6 121.6H143.4Z" fill="#f4a3c4" />
          <path d="M144 120C144 116 147 114.4 150 114.6C153 114.4 156 116 156 120Z" fill="#fff" />
          <path d="M147 115.4C148 113.4 152 113.4 153 115.4" fill="none" stroke="#fde7f0" strokeWidth="1" />
          {frutilla(145.2, 116.8)}
          {frutilla(154.6, 117.2)}
          {frutilla(150, 113.4)}

          {/* ---------- la franja rosa ondulada bajo el mostrador ---------- */}
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={106 + i * 8} cy="96.4" r="4" fill="#f4a3c4" />
          ))}
          <rect x="102" y="90.6" width="96" height="6" fill="#f4a3c4" />
          <rect x="102" y="90.6" width="96" height="1.2" fill="#fff" opacity=".4" />

          {/* ---------- el mostrador con los frascos de toppings ---------- */}
          <rect x="101" y="86" width="98" height="5" rx="1.4" fill="#fff" />
          <rect x="101" y="90" width="98" height="1" fill="#e5e7eb" />
          {FRASCOS.map(([x, color, puntos]) => (
            <g key={x} transform={`translate(${x} 86)`}>
              <rect x="-5.2" y="-8" width="10.4" height="8" rx="2" fill="#fff" opacity=".9" />
              <rect x="-4.4" y="-6" width="8.8" height="5.4" rx="1.4" fill={color} />
              {puntos &&
                [-2.6, -0.4, 1.8, 3].map((px, i) => (
                  <circle key={px} cx={px} cy={-4.6 + (i % 2) * 2} r=".55" fill={i === 2 ? '#22c55e' : puntos} />
                ))}
              <rect x="-5.6" y="-9.4" width="11.2" height="2" rx=".9" fill="#fef3c7" />
              <rect x="-4.2" y="-7.4" width="1.1" height="6.4" rx=".5" fill="#fff" opacity=".7" />
            </g>
          ))}

          {/* el vaso que se vende: le cae la crema con su frutilla y las grageas */}
          <g transform="translate(182 86)">
            <g className="esc-postre-vaso">
              <g className="esc-postre-rebote">
                <Vaso ancho={12} alto={14} />
                <g className="esc-postre-topping">
                  {/* la crema en remolino */}
                  <path d="M-6.4-14.4C-6.4-18.4-3-20 0-19.8C3-20 6.4-18.4 6.4-14.4Z" fill="#fff" />
                  <path d="M-3.6-18.4C-2-20.6 2-20.6 3.6-18.4" fill="none" stroke="#fde7f0" strokeWidth="1" />
                  {/* la frutilla, con sus semillas y la hoja */}
                  <path d="M0-19.4C-3.4-19.4-4.2-23-2.6-24.4C-1.4-25.4 1.4-25.4 2.6-24.4C4.2-23 3.4-19.4 0-19.4Z" fill="#ef4444" />
                  <circle cx="-1.1" cy="-23" r=".45" fill="#fde68a" />
                  <circle cx="1.2" cy="-22.2" r=".45" fill="#fde68a" />
                  <circle cx="-.3" cy="-21" r=".45" fill="#fde68a" />
                  <path d="M-1.8-24.8L0-26.4L1.8-24.8L0-24.1Z" fill="#16a34a" />
                </g>
                {GRAGEAS.map(([x, y, c], i) => (
                  <rect
                    key={i}
                    className="esc-postre-gragea"
                    x={x - 1.1}
                    y={y - 0.45}
                    width="2.2"
                    height=".9"
                    rx=".45"
                    fill={c}
                    style={{ animationDelay: `${-i * 0.04}s` }}
                  />
                ))}
              </g>
            </g>
          </g>

          {/* ---------- los postes de adelante y las repisitas ---------- */}
          <rect x="105" y="30" width="3.6" height="61" fill="#fff" />
          <rect x="105" y="30" width="1" height="61" fill="#e5e7eb" />
          <rect x="191.4" y="30" width="3.6" height="61" fill="#fff" />
          <rect x="194" y="30" width="1" height="61" fill="#e5e7eb" />
          {/* repisa izquierda: las salsas */}
          <rect x="108.6" y="55" width="14" height="6" rx="1" fill="#f4a3c4" />
          <rect x="108.6" y="55" width="14" height="1.2" fill="#fff" opacity=".45" />
          {(
            [
              [112.4, '#dc2626'],
              [118.4, '#7c3f1d'],
            ] as const
          ).map(([x, c]) => (
            <g key={x} transform={`translate(${x} 55)`}>
              <rect x="-2" y="-8" width="4" height="8" rx="1" fill={c} />
              <path d="M-1.2-8L0-11L1.2-8Z" fill="#fff" />
              <rect x="-1.4" y="-6.6" width=".9" height="5.4" rx=".45" fill="#fff" opacity=".4" />
            </g>
          ))}
          {/* repisa derecha: los vasos apilados */}
          <rect x="177.4" y="55" width="14" height="6" rx="1" fill="#f4a3c4" />
          <rect x="177.4" y="55" width="14" height="1.2" fill="#fff" opacity=".45" />
          <path d="M180.4 45H188.4L187.4 55H181.4Z" fill="#fff" />
          {[47.6, 50.2, 52.8].map((y) => (
            <path key={y} d={`M180.6 ${y}H188.2`} stroke="#fbcfe0" strokeWidth=".7" />
          ))}

          {/* ---------- el toldo a rayas con su festón ---------- */}
          {RAYAS.map((i) => {
            const t0 = 108 + (84 / 7) * i
            const t1 = t0 + 84 / 7
            const b0 = 99 + (102 / 7) * i
            const b1 = b0 + 102 / 7
            return <path key={`t${i}`} d={`M${t0} 15H${t1}L${b1} 29H${b0}Z`} fill={rosa(i)} />
          })}
          <path d="M108 15H192L201 29H99Z" fill={u('to')} />
          <rect x="106" y="13.4" width="88" height="2.2" rx="1.1" fill="#f4a3c4" />
          {RAYAS.map((i) => {
            const x = 99 + (102 / 7) * i
            const w = 102 / 7
            return (
              <g key={`f${i}`}>
                <rect x={x} y="29" width={w} height="5.4" fill={rosa(i)} />
                <path d={`M${x} 34.4a${w / 2} ${w / 2.6} 0 0 0 ${w} 0Z`} fill={rosa(i)} />
              </g>
            )
          })}
          <rect x="99" y="29" width="102" height="1.2" fill="#831843" opacity=".08" />
          {/* el brillo que cruza el toldo */}
          <g clipPath={`url(#${g('ct')})`}>
            <g transform="translate(92 15)">
              <g className="esc-postre-brillo" style={v({ '--d': '116px' })}>
                <path d="M0 0H6L-2 14H-8Z" fill={u('gl')} />
              </g>
            </g>
          </g>

          {/* la venta: aro y destellos sobre el vaso */}
          <ellipse className="esc-postre-aro" cx="182" cy="86" rx="11" ry="3.2" fill="none" stroke="#ec4899" strokeWidth="1.3" />
          <g transform="translate(172 64)">
            <path className="esc-postre-chispa" d={ESTRELLA} fill="#fbbf24" />
          </g>
          <g transform="translate(203 62)">
            <path className="esc-postre-chispa" d={ESTRELLA} fill="#f9a8d4" style={{ animationDelay: '-6.35s' }} />
          </g>

          {/* ---------- la pizarra del menú (izquierda) ---------- */}
          <path d="M38 146L44 100M66 146L60 100" stroke="#b98048" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="35" y="98" width="34" height="34" rx="2.4" fill="#b98048" />
          <rect x="37.5" y="100.5" width="29" height="29" rx="1.4" fill={u('pi')} />
          <text x="52" y="108.6" textAnchor="middle" fontSize="5.2" fontWeight="800" fill="#fde68a">
            MENÚ
          </text>
          {[113.6, 118.6, 123.6].map((y, i) => (
            <g key={y}>
              <rect x="41" y={y - 1.2} width={[11, 13, 10][i]} height="1.6" rx=".8" fill="#fff" opacity=".8" />
              <rect x="57.5" y={y - 1.2} width="6" height="1.6" rx=".8" fill="#f9a8d4" />
            </g>
          ))}

          {/* ---------- la conservadora de la fruta (derecha) ---------- */}
          <rect x="224" y="124" width="40" height="22" rx="3" fill="#fff" />
          <rect x="224" y="124" width="5" height="22" rx="2" fill="#eef0f3" />
          <rect x="222" y="118.6" width="44" height="7" rx="3" fill="#f4a3c4" />
          <rect x="224" y="119.2" width="40" height="1.4" rx=".7" fill="#fff" opacity=".45" />
          <rect x="236" y="115" width="16" height="4" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
          {frutilla(238, 133)}
          <rect x="243" y="132" width="14" height="1.8" rx=".9" fill="#f4a3c4" />
        </g>
      </svg>
      <Aviso etiqueta="Venta" texto="Bs 35" tono="rosa" />
    </Marco>
  )
}
