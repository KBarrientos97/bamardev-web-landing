import './EscenasPanaderiaCafeteria.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escenas animadas de la panadería-pastelería y de la cafetería (SVG propio).
  Todo se mueve con CSS (sólo transform y opacity); los keyframes `esc-pan-*` y
  `esc-cafe-*` viven en EscenasPanaderiaCafeteria.css y los compartidos `esc-*`
  en index.css. Son decorativas: el Marco ya las marca con aria-hidden.
*/

/** Chispa de cuatro puntas, chica (destellos de la venta). */
const ESTRELLA = 'M0-6L1.6-1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6-1.6Z'

/* ======================================================================
   Panadería
   ====================================================================== */

/**
 * Marraqueta paceña con la base en (0, 0): el bollo alargado con su raja a lo
 * largo (las dos "orejas"), la corteza dorada y el brillo de arriba.
 */
function Marraqueta({ c }: { c: string }) {
  return (
    <g>
      <path d="M-5.4-1.4C-5.6-4.6-2.6-6.6 0-6.4C2.6-6.6 5.6-4.6 5.4-1.4C5.2-.2 4-0 0 0C-4 0-5.2-.2-5.4-1.4Z" fill={c} />
      <path d="M-4.2-3.2C-2.6-5 2.6-5 4.2-3.2" fill="none" stroke="#8a4a18" strokeWidth=".9" strokeLinecap="round" />
      <path d="M-3.6-2.8C-2-4.2 2-4.2 3.6-2.8" fill="none" stroke="#ffe2a8" strokeWidth=".45" strokeLinecap="round" opacity=".8" />
      <ellipse cx="-2.4" cy="-5" rx="1.8" ry=".7" fill="#fff6dd" opacity=".55" />
    </g>
  )
}

/** Cuñapé (bolita de queso y almidón) con la base en (0, 0). */
function Cunape({ c, r = 2.4 }: { c: string; r?: number }) {
  return (
    <g>
      <circle cx="0" cy={-r} r={r} fill={c} />
      <circle cx={-r * 0.35} cy={-r * 1.4} r={r * 0.32} fill="#fff6dd" opacity=".6" />
      <path d={`M${-r * 0.2} ${-r * 0.5}l${r * 0.3} ${r * 0.18}`} stroke="#b9701f" strokeWidth=".35" opacity=".6" />
    </g>
  )
}

/**
 * Pan trenzado con la base en (0, 0): el cuerpo alargado, los nudos de la
 * trenza (lóbulos con su pliegue en V), el brillo de huevo y el ajonjolí.
 */
function Trenza({ c, largo = 15 }: { c: string; largo?: number }) {
  const n = 4
  const paso = largo / n
  return (
    <g>
      <ellipse cx="0" cy="-3.2" rx={largo / 2} ry="3.2" fill={c} />
      {Array.from({ length: n }, (_, i) => {
        const x = -largo / 2 + paso * (i + 0.5)
        return <ellipse key={i} cx={x} cy="-3.6" rx={paso * 0.62} ry="3.2" fill={c} />
      })}
      {Array.from({ length: n - 1 }, (_, i) => {
        const x = -largo / 2 + paso * (i + 1)
        return (
          <path
            key={i}
            d={`M${x - 1.2} -6.2L${x + 0.4} -3.6L${x - 1.2} -1`}
            fill="none"
            stroke="#8a4a18"
            strokeWidth=".7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      })}
      {Array.from({ length: n }, (_, i) => -largo / 2 + paso * (i + 0.5)).map((x, i) => (
        <g key={x}>
          <ellipse cx={x - 0.6} cy="-5.4" rx={paso * 0.28} ry=".7" fill="#fff6dd" opacity=".55" />
          <ellipse cx={x + 0.6} cy={i % 2 ? -3 : -4.2} rx=".5" ry=".3" fill="#fff4d6" />
        </g>
      ))}
    </g>
  )
}

/** Pan redondo (hogaza) con la base en (0, 0) y sus dos cortes. */
function Hogaza({ c }: { c: string }) {
  return (
    <g>
      <path d="M-5.6 0C-6-5 -3-7.6 0-7.6C3-7.6 6-5 5.6 0Z" fill={c} />
      <path d="M-2.6-5.4L-.6-2.4M1-6L2.8-3" stroke="#8a4a18" strokeWidth=".8" strokeLinecap="round" />
      <ellipse cx="-2.6" cy="-5.8" rx="1.4" ry=".7" fill="#fff6dd" opacity=".5" />
    </g>
  )
}

/** Medialuna con la base en (0, 0). */
function Medialuna({ c }: { c: string }) {
  return (
    <g>
      <path d="M-6-.6C-5.4-3.4-2.6-5 0-5C2.6-5 5.4-3.4 6-.6C4.4-1.6 2.6-2 0-2C-2.6-2-4.4-1.6-6-.6Z" fill={c} />
      <path d="M-2.4-4.6L-1.6-2M.4-5L.4-2.1M2.8-4.4L1.9-2" stroke="#8a4a18" strokeWidth=".55" opacity=".6" />
    </g>
  )
}

/** Tajada de torta de pie con la base en (0, 0): bizcocho, rellenos y crema. */
function Tajada({ relleno }: { relleno: string }) {
  return (
    <g>
      <path d="M-4.4 0V-7.4L4.4-5.4V0Z" fill="#f6d9a4" />
      <path d="M-4.4-2.6L4.4-1.8V-.9L-4.4-1.6ZM-4.4-5.2L4.4-3.8V-2.9L-4.4-4.2Z" fill={relleno} />
      <path d="M-4.4-7.4L4.4-5.4L4.4-6.4L-4.4-8.6Z" fill="#fff7ee" />
      <circle cx="-1.6" cy="-8.8" r="1" fill="#e2463b" />
    </g>
  )
}

/** Rollo de canela con la base en (0, 0), de frente: la espiral y el glaseado. */
function Rollo() {
  return (
    <g>
      <ellipse cx="0" cy="-3.2" rx="4.2" ry="3.2" fill="#d88f42" />
      <path d="M0-3.2m-.8 0a.8.8 0 1 1 1.6 0a1.8 1.8 0 1 1-3.6 0a2.8 2.8 0 1 1 5.6 0" fill="none" stroke="#8a4a18" strokeWidth=".55" />
      <path d="M-3.4-5C-2-6.6 2-6.6 3.4-5" fill="none" stroke="#fff7ee" strokeWidth=".8" strokeLinecap="round" opacity=".9" />
    </g>
  )
}

/** Las piezas del estante de atrás: [x, pieza], repisa de arriba (base y = 87). */
const ESTANTE_ARRIBA: [number, 'm' | 't' | 'h'][] = [
  [109, 'm'],
  [120, 'm'],
  [137, 't'],
  [153, 'h'],
  [165, 'h'],
  [177, 'm'],
]

/** Rayas del toldo de la panadería (caramelo y crema). */
const RAYAS_PAN = Array.from({ length: 10 }, (_, i) => i)

/**
 * Una panadería-pastelería de barrio en tres cuartos: el letrero, el toldo con
 * festón, el estante de panes tras el mostrador-vitrina (cuñapés, medialunas,
 * tajadas y rollos), la torta en su pedestal, la bolsa de papel con el QR, el
 * horno de ladrillo a la izquierda y el canasto de panes con la bolsa de harina
 * a la derecha.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): del horno sale la bandeja de
 * marraquetas calientes echando vapor; una salta en arco a la bolsa del
 * mostrador, la bolsa se aplasta con su aro y llega el aviso de la venta. La
 * bandeja vuelve al horno a hornear la siguiente tanda.
 */
export function EscenaPanaderia() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`
  const pan = u('pa')

  return (
    <Marco fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff8ea" />
            <stop offset="1" stopColor="#f5ddb0" />
          </linearGradient>
          {/* corteza: dorada arriba a la izquierda, tostada abajo a la derecha */}
          <linearGradient id={g('pa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8cd78" />
            <stop offset=".55" stopColor="#e0953f" />
            <stop offset="1" stopColor="#b9682a" />
          </linearGradient>
          <linearGradient id={g('cu')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde08a" />
            <stop offset="1" stopColor="#df9a36" />
          </linearGradient>
          <linearGradient id={g('pr')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff6e2" />
            <stop offset="1" stopColor="#f6dcae" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c99559" />
            <stop offset="1" stopColor="#dcae74" />
          </linearGradient>
          <linearGradient id={g('in')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6e3a1c" />
            <stop offset="1" stopColor="#8f5228" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d7a063" />
            <stop offset="1" stopColor="#a8693a" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="1" stopColor="#f3dfbd" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9a5a2a" />
            <stop offset="1" stopColor="#74401c" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* el horno de barro y ladrillo */}
          <linearGradient id={g('ho')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e39a62" />
            <stop offset=".6" stopColor="#c2683a" />
            <stop offset="1" stopColor="#9a4824" />
          </linearGradient>
          <linearGradient id={g('lb')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9572d" />
            <stop offset="1" stopColor="#933f1e" />
          </linearGradient>
          <radialGradient id={g('fu')} cx=".5" cy=".85" r=".75">
            <stop offset="0" stopColor="#ffe08a" />
            <stop offset=".35" stopColor="#ff9d3a" />
            <stop offset=".8" stopColor="#b3361a" />
            <stop offset="1" stopColor="#3a140a" />
          </radialGradient>
          <radialGradient id={g('ca')}>
            <stop offset="0" stopColor="#ffb357" stopOpacity=".7" />
            <stop offset="1" stopColor="#ffb357" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e2b57d" />
            <stop offset="1" stopColor="#c3904f" />
          </linearGradient>
          <linearGradient id={g('ba')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9dde3" />
            <stop offset="1" stopColor="#9aa3ae" />
          </linearGradient>
          <linearGradient id={g('ce')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9a15c" />
            <stop offset="1" stopColor="#a86c31" />
          </linearGradient>
          <linearGradient id={g('ha')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffdf7" />
            <stop offset="1" stopColor="#eadcc2" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <rect x="98" y="110" width="122" height="25" rx="1.5" />
          </clipPath>
          <clipPath id={g('cb')}>
            <path d="M32 112V100C32 92 39 87.6 47 87.6C55 87.6 62 92 62 100V112Z" />
          </clipPath>
        </defs>

        {/* plataforma: losa suave con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#e8c08a" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".4" />
        <ellipse className="esc-pan-sombra" cx="158" cy="146.4" rx="70" ry="6" fill="#5a2c0c" opacity=".14" />
        <ellipse cx="47" cy="146.6" rx="34" ry="4.2" fill="#5a2c0c" opacity=".13" />
        <ellipse cx="262" cy="147" rx="30" ry="4" fill="#5a2c0c" opacity=".12" />

        <g className="esc-pan-flota">
          {/* el calor del horno, que late detrás */}
          <ellipse className="esc-pan-calor" cx="47" cy="98" rx="50" ry="42" fill={u('ca')} />

          {/* ---------- el local ---------- */}
          <path d="M84 69L96 64V146L84 149Z" fill={u('la')} />
          <path d="M84 50L92 46V63L84 67Z" fill="#7a4120" />
          <rect x="96" y="63" width="124" height="83" fill={u('pr')} />
          <rect x="96" y="63" width="2.4" height="83" fill="#fff" opacity=".5" />
          {/* el hueco del estante, con la luz cálida que baja */}
          <rect x="102" y="72" width="112" height="34" rx="2" fill={u('in')} />
          <ellipse className="esc-pan-halo" cx="158" cy="75" rx="50" ry="7" fill="#ffd08a" opacity=".5" />
          {/* repisa de arriba: marraquetas, trenzas y hogazas */}
          {ESTANTE_ARRIBA.map(([x, p]) => (
            <g key={x} transform={`translate(${x} 87)`}>
              {p === 'm' ? <Marraqueta c={pan} /> : p === 't' ? <Trenza c={pan} /> : <Hogaza c={pan} />}
            </g>
          ))}
          <rect x="102" y="87" width="112" height="2.6" fill={u('ma')} />
          <rect x="102" y="87" width="112" height=".8" fill="#f3d09a" />
          {/* repisa de abajo: el canasto de cuñapés (lo demás lo tapan la bolsa y la torta) */}
          <g transform="translate(160 104)">
            {[-6, -3, 0, 3, 6, -4.5, -1.5, 1.5, 4.5].map((x, i) => (
              <g key={i} transform={`translate(${x} ${i < 5 ? -4.6 : -7.4})`}>
                <Cunape c={u('cu')} r={1.9} />
              </g>
            ))}
            <path d="M-9.6-5.6H9.6L8 0H-8Z" fill="#c98a45" />
            {[-6, -2, 2, 6].map((x) => (
              <path key={x} d={`M${x} -5.4L${x * 0.85} -.2`} stroke="#8f5a26" strokeWidth=".6" />
            ))}
            <path d="M-9.4-3.4H9.2" stroke="#e8b878" strokeWidth=".6" />
            <rect x="-10.2" y="-6.4" width="20.4" height="1.6" rx=".8" fill="#e0a865" />
          </g>
          <rect x="102" y="104" width="112" height="2" fill={u('ma')} />

          {/* el toldo a rayas con su festón */}
          {RAYAS_PAN.map((i) => {
            const w = 128 / 10
            const x = 94 + w * i
            const c = i % 2 === 0 ? '#c97d3a' : '#fff1d6'
            return (
              <g key={i}>
                <path d={`M${x + 2 - i * 0.4} 63H${x + w + 2 - (i + 1) * 0.4}L${x + w} 70.4H${x}Z`} fill={c} />
                <path d={`M${x} 70.4a${w / 2} ${w / 3} 0 0 0 ${w} 0Z`} fill={c} />
              </g>
            )
          })}
          <rect x="94" y="70" width="128" height="1" fill="#5a2c0c" opacity=".1" />

          {/* letrero con las dos espigas */}
          <rect x="92" y="43" width="132" height="19" rx="4" fill="#5a3218" />
          <rect x="90" y="40.5" width="136" height="4.4" rx="2.2" fill="#c97d3a" />
          <rect x="94" y="59" width="128" height="1.4" rx=".7" fill="#3d2010" opacity=".6" />
          <text x="158" y="56.6" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff1d6" textLength="92" lengthAdjust="spacing">
            PANADERÍA
          </text>
          {[103, 213].map((x, k) => (
            <g key={x} transform={`translate(${x} 52) scale(${k === 0 ? 1 : -1} 1)`}>
              <path d="M0 6.4C.6 2 1 -1.6 2.4 -5.4" fill="none" stroke="#f3c46b" strokeWidth=".8" strokeLinecap="round" />
              {[0, 1, 2, 3].map((j) => (
                <g key={j}>
                  <ellipse cx={1.9 - j * 0.5} cy={-4 + j * 2.3} rx="1.5" ry=".8" fill="#f3c46b" transform="rotate(-50)" />
                  <ellipse cx={3.3 - j * 0.45} cy={-3 + j * 2.3} rx="1.5" ry=".8" fill="#e0a845" transform="rotate(35)" />
                </g>
              ))}
            </g>
          ))}

          {/* ---------- el mostrador-vitrina ---------- */}
          <rect x="96" y="108" width="126" height="38" fill={u('mo')} />
          <rect x="98" y="110" width="122" height="25" rx="1.5" fill={u('vi')} />
          {/* nivel de arriba: cuñapés y medialunas */}
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i} transform={`translate(${104 + i * 4.9} 121.6)`}>
              <Cunape c={u('cu')} r={2.1} />
            </g>
          ))}
          {[163, 176, 189, 202, 214].map((x) => (
            <g key={x} transform={`translate(${x} 121.6)`}>
              <Medialuna c={pan} />
            </g>
          ))}
          <rect x="98" y="121.6" width="122" height="1.2" fill="#e2c595" />
          {/* nivel de abajo: tajadas de torta y rollos de canela */}
          {[106, 116, 126, 136, 146].map((x, i) => (
            <g key={x} transform={`translate(${x} 133.4)`}>
              <Tajada relleno={i % 2 === 0 ? '#e86a7a' : '#7a3f1c'} />
            </g>
          ))}
          {[162, 172, 182, 192, 202, 212].map((x) => (
            <g key={x} transform={`translate(${x} 133.4)`}>
              <Rollo />
            </g>
          ))}
          {/* etiquetas de precio */}
          {[118, 186].map((x) => (
            <rect key={x} x={x} y="113" width="9" height="3.4" rx=".8" fill="#fff" stroke="#c97d3a" strokeWidth=".4" />
          ))}
          {/* reflejo del vidrio y el brillo que lo cruza */}
          <path d="M98 110H128L112 135H98Z" fill="#fff" opacity=".22" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(84 110)">
              <g className="esc-pan-brillo" style={v({ '--d': '150px' })}>
                <path d="M0 0H9L-1 25H-10Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          <rect x="96" y="135" width="126" height="11" fill={u('mo')} />
          {[100, 131, 162, 193].map((x) => (
            <rect key={x} x={x} y="137.4" width="25" height="6.4" rx="1.2" fill="#5a3218" opacity=".3" />
          ))}
          <rect x="92" y="104" width="134" height="5" rx="2.2" fill={u('ma')} />
          <rect x="94" y="104.6" width="130" height="1.2" rx=".6" fill="#f6d3a0" />

          {/* la torta decorada en su pedestal */}
          <g transform="translate(196 104)">
            <ellipse cx="0" cy="-.6" rx="6.4" ry="1.4" fill="#e9eef3" />
            <rect x="-1.5" y="-7" width="3" height="6.4" fill="#d7dee6" />
            <rect x="-1.5" y="-7" width="1" height="6.4" fill="#fff" opacity=".7" />
            <ellipse cx="0" cy="-7.4" rx="14" ry="2.2" fill="#e9eef3" />
            <ellipse cx="0" cy="-7.9" rx="13" ry="1.6" fill="#fff" />
            {/* piso de abajo */}
            <path d="M-12-8.4V-18.6H12V-8.4C12-7.4 6-7 0-7C-6-7-12-7.4-12-8.4Z" fill="#fff3ea" />
            <path d="M-12-18.6H12V-15.6C11-14.4 10-15.8 9-14.2C8-12.6 7-15 6-14.6C5-14.2 4-12.4 3-14.6C2-16 1-13 0-14.6C-1-16.2-2-13.2-3-14.8C-4-16.2-5-12.8-6-14.6C-7-16-8-13.6-9-14.8C-10-16-11-14.6-12-15.6Z" fill="#f28c94" />
            <path d="M-12-18.6V-8.4H-9.6V-18.6Z" fill="#fff" opacity=".55" />
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx={-10.4 + i * 2.6} cy="-8.6" r="1.1" fill="#fff" stroke="#f6c7c4" strokeWidth=".35" />
            ))}
            {/* piso de arriba */}
            <path d="M-7.6-18.8V-27H7.6V-18.8C7.6-18.2 4-17.8 0-17.8C-4-17.8-7.6-18.2-7.6-18.8Z" fill="#fff8f1" />
            <path d="M-7.6-27H7.6V-24.6C7-23.6 6-25 5-23.6C4-22.4 3-24.8 2-24C1-23.2 0-22.4-1-24C-2-25.4-3-22.8-4-24C-5-25-6-23-7.6-24.6Z" fill="#f28c94" />
            <path d="M-7.6-27V-18.8H-5.8V-27Z" fill="#fff" opacity=".6" />
            <ellipse cx="0" cy="-27" rx="7.6" ry="1.4" fill="#ffe4e4" />
            {[-5, -1.6, 1.8, 5.2].map((x) => (
              <circle key={x} cx={x} cy="-27.6" r="1.1" fill="#fff" />
            ))}
            {/* las frutillas y la vela */}
            <path d="M-2.6-28.4C-4.4-28.4-4.6-30.6-3.6-31.2C-3-31.6-2.2-31.6-1.6-31.2C-.6-30.6-.8-28.4-2.6-28.4Z" fill="#e2463b" />
            <path d="M3-28.4C1.2-28.4 1-30.6 2-31.2C2.6-31.6 3.4-31.6 4-31.2C5-30.6 4.8-28.4 3-28.4Z" fill="#e2463b" />
            <path d="M-3.6-31.4L-2.6-32.4L-1.6-31.4M2-31.4L3-32.4L4-31.4" fill="#16a34a" />
            <rect x="-.5" y="-35.6" width="1" height="6.4" rx=".4" fill="#7dd3fc" />
            <path d="M-.5-34.2H.5M-.5-32.4H.5M-.5-30.6H.5" stroke="#fff" strokeWidth=".4" />
            <g transform="translate(0 -36.2)">
              <path className="esc-llama" d="M0-3.2C1.2-1.8 1.2-.2 0 0C-1.2-.2-1.2-1.8 0-3.2Z" fill="#fbbf24" />
            </g>
          </g>

          {/* el QR de cobro, parado en el mostrador */}
          <rect x="138" y="101.4" width="9" height="3" rx="1" fill="#74401c" />
          <rect x="136" y="89" width="13" height="13.4" rx="1.6" fill="#fff" />
          <path
            d="M138 91h3.6v3.6h-3.6zM143.4 91h3.6v3.6h-3.6zM138 96.4h3.6v3.6h-3.6zM143.8 96.8h1.4v1.4h-1.4zM145.6 98.6h1.4v1.4h-1.4zM143.8 99.2h1.4v.8h-1.4z"
            fill="#3d2010"
          />

          {/* la bolsa de papel: el fondo y las marraquetas que ya están adentro */}
          <g className="esc-pan-bolsa">
            <path d="M108 84.6H128L128.6 104H107.4Z" fill="#b5844e" />
            <g transform="translate(113.4 91.6) rotate(-14)">
              <Marraqueta c={pan} />
            </g>
            <g transform="translate(123 91) rotate(12)">
              <Marraqueta c={pan} />
            </g>
          </g>

          {/* ---------- el horno de ladrillo (izquierda) ---------- */}
          {/* la chimenea, con su humo */}
          <rect x="56" y="55" width="9" height="20" fill={u('lb')} />
          <rect x="56" y="55" width="2" height="20" fill="#fff" opacity=".15" />
          <rect x="54.4" y="52" width="12.2" height="3.4" rx="1" fill="#7a3518" />
          {[
            ['0s', '-6px'],
            ['-1.1s', '-10px'],
            ['-2.2s', '-4px'],
          ].map(([d, dx]) => (
            <circle key={d} className="esc-pan-humo" cx="60.5" cy="48" r="3" fill="#f4e7d8" style={v({ animationDelay: d, '--dx': dx })} />
          ))}
          {/* la base de ladrillo */}
          <rect x="16" y="114" width="62" height="32" rx="2" fill={u('lb')} />
          {[119.5, 125, 130.5, 136, 141.5].map((y, f) => (
            <g key={y}>
              <rect x="16" y={y} width="62" height=".7" fill="#f2c39b" opacity=".45" />
              {Array.from({ length: 6 }, (_, k) => 20 + k * 11 + (f % 2) * 5.5)
                .filter((x) => x < 77)
                .map((x) => (
                <rect key={x} x={x} y={y - 5.5} width=".7" height="5.5" fill="#f2c39b" opacity=".4" />
              ))}
            </g>
          ))}
          <rect x="16" y="114" width="3" height="32" rx="1" fill="#fff" opacity=".12" />
          {/* la cúpula */}
          <path d="M18 112C18 84 30 69 47 69C64 69 76 84 76 112Z" fill={u('ho')} />
          {[
            'M22 104C22 86 32 74 47 74C62 74 72 86 72 104',
            'M26.4 96C29 84 37 78.4 47 78.4C57 78.4 65 84 67.6 96',
          ].map((d) => (
            <path key={d} d={d} fill="none" stroke="#a24e26" strokeWidth=".7" opacity=".5" />
          ))}
          <path d="M22 100C22 84 31 73.6 42 71.6C33 77 27 87 26 101Z" fill="#fff" opacity=".2" />
          {/* la boca: el fuego al fondo y el arco de ladrillo */}
          <path d="M32 112V100C32 92 39 87.6 47 87.6C55 87.6 62 92 62 100V112Z" fill={u('fu')} />
          <g clipPath={`url(#${g('cb')})`}>
            <ellipse className="esc-pan-brasa" cx="47" cy="110" rx="18" ry="9" fill="#ffd36b" opacity=".6" />
            {[
              [39, '-.3s', 0.8],
              [47, '0s', 1.15],
              [55, '-.55s', 0.9],
            ].map(([x, d, e]) => (
              <g key={x as number} transform={`translate(${x} 111.6) scale(${e})`}>
                <path className="esc-llama" d="M0-9C3-5.6 4-2 0 0C-4-2-3-5.6 0-9Z" fill="#ff8a2a" style={{ animationDelay: d as string }} />
              </g>
            ))}
            {[
              [36, '0s'],
              [44, '-.7s'],
              [52, '-1.3s'],
              [58, '-.4s'],
            ].map(([x, d]) => (
              <circle key={x as number} className="esc-pan-chispa-horno" cx={x as number} cy="108" r=".8" fill="#ffe08a" style={{ animationDelay: d as string }} />
            ))}
          </g>
          <path d="M30 112V100C30 91 38 85.6 47 85.6C56 85.6 64 91 64 100V112" fill="none" stroke="#8a3a18" strokeWidth="3" />
          <path d="M30 112V100C30 91 38 85.6 47 85.6C56 85.6 64 91 64 100V112" fill="none" stroke="#f2c39b" strokeWidth=".6" strokeDasharray="3 3.4" opacity=".5" />
          {/* el umbral de piedra, iluminado por la boca */}
          <rect x="13" y="111" width="68" height="4.6" rx="1.6" fill="#ead6b6" />
          <rect x="13" y="114.4" width="68" height="1.2" rx=".6" fill="#b79a72" />
          <ellipse className="esc-pan-brasa" cx="47" cy="112" rx="20" ry="2" fill="#ffb357" opacity=".55" />
        </g>

        {/* ---------- la bandeja que sale del horno (y la marraqueta que vuela) ---------- */}
        <g className="esc-pan-flota">
          <g className="esc-pan-bandeja">
            <path d="M31 107.6H63L66.4 111.2H27.6Z" fill={u('ba')} />
            <rect x="27.6" y="111.2" width="38.8" height="1.4" rx=".5" fill="#6b7480" />
            {[37, 57].map((x) => (
              <g key={x} transform={`translate(${x} 109.6)`}>
                <Marraqueta c={pan} />
              </g>
            ))}
            <g transform="translate(47 109.6)">
              <g className="esc-pan-vuelo-x">
                <g className="esc-pan-vuelo-y">
                  <Marraqueta c={pan} />
                </g>
              </g>
            </g>
            {/* el pan recién salido brilla de calor */}
            <g className="esc-pan-caliente">
              {[37, 57].map((x) => (
                <ellipse key={x} cx={x} cy="106.4" rx="5" ry="2.6" fill="#ffb357" opacity=".45" />
              ))}
            </g>
          </g>
          {/* el vapor del pan caliente */}
          <g className="esc-pan-vapor">
            {[
              [36, '0s', '-3px'],
              [46, '-.7s', '2px'],
              [56, '-1.45s', '-2px'],
              [41, '-1.1s', '3px'],
            ].map(([x, d, dx]) => (
              <g key={x as string} transform={`translate(${x} 104)`}>
                <path
                  className="esc-pan-voluta"
                  d="M0 0C-2-2.4 2-4.6 0-7C-2-9.4 2-11.6 0-14"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  style={v({ animationDelay: d as string, '--dx': dx as string })}
                />
              </g>
            ))}
          </g>

          {/* el frente de la bolsa (rebota junto con el fondo) */}
          <g className="esc-pan-bolsa">
            <path d="M107.4 88.6L109.5 87L111.6 88.6L113.7 87L115.8 88.6L117.9 87L120 88.6L122.1 87L124.2 88.6L126.3 87L128.4 88.6L129.4 104.4H106.6Z" fill={u('bo')} />
            <path d="M107.4 88.6L109.5 87L111.6 88.6L113.7 87L115.8 88.6L117.9 87L120 88.6L122.1 87L124.2 88.6L126.3 87L128.4 88.6L128.5 90.4H107.3Z" fill="#9c6a35" opacity=".35" />
            <path d="M106.6 104.4L107.4 88.6H110L109.6 104.4Z" fill="#fff" opacity=".2" />
            {/* el sello de la casa: una espiga en un círculo */}
            <circle cx="118" cy="97" r="3.6" fill="none" stroke="#8a5a26" strokeWidth=".6" opacity=".7" />
            <path d="M118 99.4V94.4M118 95.6L116.8 94.6M118 95.6L119.2 94.6M118 97.2L116.8 96.2M118 97.2L119.2 96.2" stroke="#8a5a26" strokeWidth=".6" strokeLinecap="round" opacity=".75" />
          </g>
          {/* la venta: aro y destellos sobre la bolsa */}
          <ellipse className="esc-pan-aro" cx="118" cy="104" rx="13" ry="4" fill="none" stroke="#e08a2e" strokeWidth="1.3" />
          <g transform="translate(105 80)">
            <path className="esc-pan-chispa" d={ESTRELLA} fill="#fbbf24" />
          </g>
          <g transform="translate(131 77)">
            <path className="esc-pan-chispa" d={ESTRELLA} fill="#fcd9a0" style={{ animationDelay: '-6.35s' }} />
          </g>

          {/* ---------- el canasto de panes y la bolsa de harina (derecha) ---------- */}
          <g transform="translate(250 146)">
            {/* baguettes y panes que asoman */}
            {[
              [-7, -28, -16],
              [0, -31, -4],
              [7, -27, 12],
            ].map(([x, y, r]) => (
              <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
                <rect x="-2.6" y="0" width="5.2" height="24" rx="2.6" fill={pan} />
                {[4, 9, 14].map((yy) => (
                  <path key={yy} d={`M-1.4 ${yy + 1.6}L1.4 ${yy}`} stroke="#8a4a18" strokeWidth=".7" strokeLinecap="round" />
                ))}
                <rect x="-1.8" y="1.6" width="1" height="16" rx=".5" fill="#fff6dd" opacity=".45" />
              </g>
            ))}
            <g transform="translate(-9 -17)">
              <Hogaza c={pan} />
            </g>
            <g transform="translate(9.6 -17.4)">
              <Hogaza c={pan} />
            </g>
            {/* el canasto de mimbre */}
            <path d="M-15-19H15L12.4 0H-12.4Z" fill={u('ce')} />
            {[-15, -10.5, -6].map((y) => (
              <path key={y} d={`M${-15 + (19 + y) * 0.13} ${y}H${15 - (19 + y) * 0.13}`} stroke="#8a5a26" strokeWidth=".7" opacity=".7" />
            ))}
            {[-10, -5, 0, 5, 10].map((x) => (
              <path key={x} d={`M${x} -19L${x * 0.83} 0`} stroke="#f0c486" strokeWidth=".7" opacity=".55" />
            ))}
            <rect x="-16" y="-20.4" width="32" height="2.8" rx="1.4" fill="#e7b472" />
            <path d="M-14.6-19V-1" stroke="#fff" strokeWidth="1.6" opacity=".15" />
          </g>
          <g transform="translate(279 146)">
            {/* la bolsa de harina, atada arriba */}
            <path d="M-11 0C-12.4-6-12-15-9.6-20.4H9.6C12-15 12.4-6 11 0Z" fill={u('ha')} />
            <path d="M-9.6-20.4C-8-23-4-22-2.6-24.4L2.6-24.4C4-22 8-23 9.6-20.4Z" fill="#f4ead8" />
            <rect x="-4" y="-25" width="8" height="2" rx="1" fill="#c97d3a" />
            <path d="M-11 0C-12.4-6-12-15-9.6-20.4H-7C-9-15-9.4-6-8.2 0Z" fill="#fff" opacity=".6" />
            <text x="0" y="-9" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#b9682a">
              HARINA
            </text>
            <path d="M-6.4-6H6.4" stroke="#c97d3a" strokeWidth=".8" />
            <g transform="translate(0 -14.6)">
              <path d="M0 2.6V-2.6M0-.8L-1.4-2M0-.8L1.4-2M0 .8L-1.4-.4M0 .8L1.4-.4" stroke="#e0a845" strokeWidth=".7" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </svg>
      <Aviso etiqueta="6 marraquetas" texto="Bs 6" tono="ambar" />
    </Marco>
  )
}

/* ======================================================================
   Cafetería
   ====================================================================== */

/**
 * Taza de capuchino en su platillo, con la base en (0, 0). `clip` es el id del
 * recorte de la boca de la taza: el café sube por dentro de ese óvalo. Con
 * `animada`, el café, la crema y el corazón de leche siguen el ciclo de la
 * escena; sin ella, la taza ya está servida.
 */
function Taza({ clip, cuerpo, animada = false }: { clip: string; cuerpo: string; animada?: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="-.6" rx="9.4" ry="2" fill="#d9cbb8" />
      <ellipse cx="0" cy="-1.2" rx="9" ry="1.8" fill="#fffdf8" />
      <ellipse cx="0" cy="-1.3" rx="5" ry=".9" fill="#e9dccb" />
      {/* el asa */}
      <path d="M5.4-8.6C9.4-9.4 9.6-4.4 5.2-4" fill="none" stroke="#f4ece1" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M-6-10.4H6C6-4.6 3.8-1.6 0-1.6C-3.8-1.6-6-4.6-6-10.4Z" fill={cuerpo} />
      <path d="M-5.9-7.6H5.9L5.7-6.4H-5.7Z" fill="#2bb3a3" />
      <path d="M-4.8-9.6C-4.8-6-3.6-3.4-1.6-2.4" fill="none" stroke="#fff" strokeWidth=".9" strokeLinecap="round" opacity=".8" />
      {/* la boca: el interior y, recortado ahí, el café que sube */}
      <ellipse cx="0" cy="-10.4" rx="6" ry="1.9" fill="#f6efe6" />
      <ellipse cx="0" cy="-10.1" rx="5.3" ry="1.5" fill="#d8c9b6" />
      <g clipPath={`url(#${clip})`}>
        <g className={animada ? 'esc-cafe-nivel' : undefined}>
          <ellipse cx="0" cy="-10.2" rx="5.6" ry="1.7" fill="#5a2f17" />
          <g className={animada ? 'esc-cafe-crema' : undefined}>
            <ellipse cx="0" cy="-10.2" rx="5.4" ry="1.6" fill="#c98b4a" />
            <ellipse cx="0" cy="-10.2" rx="4.2" ry="1.1" fill="#d9a466" />
          </g>
          <g transform="translate(0 -9.9)">
            <g className={animada ? 'esc-cafe-corazon' : undefined}>
              <path d="M0 .8C-1.3.2-2.1-.3-2.1-.8C-2.1-1.3-1.1-1.5 0-1C1.1-1.5 2.1-1.3 2.1-.8C2.1-.3 1.3.2 0 .8Z" fill="#fff8ee" />
            </g>
          </g>
        </g>
      </g>
      <ellipse cx="0" cy="-10.4" rx="6" ry="1.9" fill="none" stroke="#fffdf8" strokeWidth=".7" />
    </g>
  )
}

/** Un manómetro de la máquina, centrado en (0, 0); la aguja tiembla al servir. */
function Manometro({ retraso }: { retraso: string }) {
  return (
    <g>
      <circle r="5.4" fill="#cfd5dc" />
      <circle r="5.4" fill="none" stroke="#8b95a1" strokeWidth=".6" />
      <circle r="4.3" fill="#fffaf0" />
      <path d="M-3 2.2A3.7 3.7 0 0 1 -3.4-1.4" fill="none" stroke="#2bb3a3" strokeWidth=".9" />
      <path d="M2.4-2.8A3.7 3.7 0 0 1 3.4 1.4" fill="none" stroke="#e05a3a" strokeWidth=".9" />
      {[-60, -30, 0, 30, 60].map((a) => {
        const r = (a * Math.PI) / 180
        const p = (d: number) => `${(d * Math.sin(r)).toFixed(2)} ${(-d * Math.cos(r)).toFixed(2)}`
        return <path key={a} d={`M${p(3.9)}L${p(3)}`} stroke="#6b4430" strokeWidth=".45" />
      })}
      {/* la aguja gira sobre su base (el centro del manómetro); el reposo, -35°, va en el keyframe */}
      <path className="esc-cafe-aguja" d="M-.35 0L0-3.4L.35 0Z" fill="#c0392b" style={{ animationDelay: retraso }} />
      <circle r=".8" fill="#3b2a22" />
      <path d="M-3.4-1.6A3.8 3.8 0 0 1 -1.2-3.6" fill="none" stroke="#fff" strokeWidth=".6" opacity=".8" />
    </g>
  )
}

/** Muffin con la base en (0, 0). */
function Muffin() {
  return (
    <g>
      <path d="M-3.6-5H3.6L2.8 0H-2.8Z" fill="#e8b7c6" />
      {[-2, 0, 2].map((x) => (
        <path key={x} d={`M${x}-4.8V-.2`} stroke="#c98ba0" strokeWidth=".4" />
      ))}
      <path d="M-4.4-4.6C-4.8-8.4-1.4-9.4 0-9.4C1.4-9.4 4.8-8.4 4.4-4.6Z" fill="#8a4a22" />
      {[
        [-2, -7],
        [1.2, -7.8],
        [2.2, -5.8],
        [-0.6, -5.6],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r=".55" fill="#3b1e0e" />
      ))}
    </g>
  )
}

/** La carta de la pizarra: [plato, precio]. */
const CARTA: [string, string][] = [
  ['Espresso', '10'],
  ['Capuchino', '15'],
  ['Latte', '14'],
  ['Mocaccino', '17'],
]

/**
 * Una cafetería con barra: el letrero, la máquina de espresso con sus dos
 * manómetros y la jarra de leche bajo el vaporizador, el molinillo con su tolva
 * de granos, la vitrina de pasteles, la pizarra con la carta y la banqueta del
 * cliente; a la izquierda el saco de café y a la derecha una mesita con su taza.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): bajo el grupo aparece una taza
 * vacía, la máquina le echa el chorro (los manómetros tiemblan) y el café sube;
 * el vaporizador espuma la leche y en la crema se dibuja un corazón. La taza se
 * desliza por la barra hasta el cliente, se asienta con su aro y llega el aviso
 * de la venta. Después el cliente se la lleva y la máquina espera la siguiente.
 */
export function EscenaCafeteria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco fondo="bg-gradient-to-b from-stone-200 via-orange-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbf4ea" />
            <stop offset="1" stopColor="#ead5b8" />
          </linearGradient>
          <linearGradient id={g('mu')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a4b30" />
            <stop offset="1" stopColor="#5a3420" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3f2416" />
            <stop offset="1" stopColor="#4e2d1c" />
          </linearGradient>
          <linearGradient id={g('az')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbf6ee" />
            <stop offset="1" stopColor="#efe2cf" />
          </linearGradient>
          {/* acero: luz arriba-izquierda, sombra abajo-derecha */}
          <linearGradient id={g('ac')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6f7f9" />
            <stop offset=".5" stopColor="#cfd5dc" />
            <stop offset="1" stopColor="#97a1ad" />
          </linearGradient>
          <linearGradient id={g('tu')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3cc4b3" />
            <stop offset="1" stopColor="#168a7e" />
          </linearGradient>
          <linearGradient id={g('ba')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b77a45" />
            <stop offset="1" stopColor="#8a5530" />
          </linearGradient>
          <linearGradient id={g('bt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a2a1a" />
            <stop offset="1" stopColor="#3a2014" />
          </linearGradient>
          <linearGradient id={g('ta')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#eee3d4" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffaf2" stopOpacity=".95" />
            <stop offset="1" stopColor="#f1e2cc" stopOpacity=".95" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('sa')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#dcbf8f" />
            <stop offset="1" stopColor="#b8945e" />
          </linearGradient>
          <linearGradient id={g('ch')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f2c57a" />
            <stop offset="1" stopColor="#b8732f" />
          </linearGradient>
          <radialGradient id={g('lu')}>
            <stop offset="0" stopColor="#ffd89a" stopOpacity=".75" />
            <stop offset="1" stopColor="#ffd89a" stopOpacity="0" />
          </radialGradient>
          <clipPath id={g('bt1')}>
            <ellipse cx="0" cy="-10.1" rx="5.3" ry="1.5" />
          </clipPath>
          <clipPath id={g('bt2')}>
            <ellipse cx="0" cy="-10.1" rx="5.3" ry="1.5" />
          </clipPath>
          <clipPath id={g('cv')}>
            <rect x="70" y="84" width="27" height="24" rx="1" />
          </clipPath>
        </defs>

        {/* plataforma: losa suave con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#d9b48a" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".4" />
        <ellipse className="esc-cafe-sombra" cx="150" cy="146.4" rx="92" ry="6" fill="#3b1e0e" opacity=".14" />
        <ellipse cx="33" cy="146.6" rx="20" ry="3.4" fill="#3b1e0e" opacity=".13" />
        <ellipse cx="270" cy="147" rx="24" ry="3.6" fill="#3b1e0e" opacity=".12" />

        <g className="esc-cafe-flota">
          {/* ---------- la pared del local ---------- */}
          <path d="M50 30L62 24V146L50 150Z" fill={u('la')} />
          <rect x="62" y="24" width="176" height="122" fill={u('mu')} />
          <rect x="62" y="24" width="2.4" height="122" fill="#fff" opacity=".12" />
          {[96, 130, 164, 198].map((x) => (
            <rect key={x} x={x} y="24" width=".8" height="90" fill="#3b1e0e" opacity=".25" />
          ))}
          {/* la luz cálida sobre la barra */}
          <ellipse className="esc-cafe-luz" cx="127" cy="60" rx="46" ry="34" fill={u('lu')} />
          {/* azulejos detrás de la máquina */}
          <rect x="98" y="44" width="82" height="64" rx="1.6" fill={u('az')} />
          {[52, 60, 68, 76, 84, 92, 100].map((y) => (
            <rect key={y} x="98" y={y} width="82" height=".5" fill="#d9c7ae" />
          ))}
          {[44, 52, 60, 68, 76, 84, 92, 100].map((y, f) =>
            Array.from({ length: 6 }, (_, k) => 104 + k * 14 + (f % 2) * 7)
              .filter((x) => x < 180)
              .map((x) => <rect key={`${y}-${x}`} x={x} y={y} width=".5" height="8" fill="#d9c7ae" />),
          )}

          {/* letrero con su tacita humeante */}
          <rect x="68" y="27" width="78" height="15" rx="3.4" fill="#2a160c" />
          <rect x="66" y="25" width="82" height="3.4" rx="1.7" fill="#2bb3a3" />
          <text x="112.6" y="38.4" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fbeedb" textLength="56" lengthAdjust="spacing">
            CAFETERÍA
          </text>
          <g transform="translate(77.6 39)">
            <path d="M-4-6H3C3-2.6 1.8-.8-.5-.8C-2.8-.8-4-2.6-4-6Z" fill="#fbeedb" />
            <path d="M3-5.4C5-5.6 5-3 2.6-2.8" fill="none" stroke="#fbeedb" strokeWidth=".8" />
            <path d="M-2-7.4C-2.8-8.4-1.2-9-2-10M.6-7.4C-.2-8.4 1.4-9 .6-10" fill="none" stroke="#2bb3a3" strokeWidth=".7" strokeLinecap="round" />
          </g>

          {/* la repisa de la pared: granos en frasco y bolsas de café */}
          <rect x="66" y="66" width="30" height="2" rx=".8" fill="#c98b4a" />
          <g transform="translate(73 66)">
            <rect x="-4" y="-11" width="8" height="11" rx="1.6" fill="#fff" opacity=".85" />
            <rect x="-3.2" y="-8" width="6.4" height="7.4" rx="1" fill="#4a2a1a" />
            {[
              [-1.6, -6.6],
              [1.2, -5.2],
              [-0.4, -3],
              [1.8, -2],
              [-2, -1.6],
            ].map(([x, y]) => (
              <ellipse key={`${x}${y}`} cx={x} cy={y} rx=".9" ry=".6" fill="#7a4420" />
            ))}
            <rect x="-4.4" y="-12.6" width="8.8" height="2.2" rx=".8" fill="#2bb3a3" />
          </g>
          {[84, 91.4].map((x, i) => (
            <g key={x} transform={`translate(${x} 66)`}>
              <path d="M-3.4 0V-10.6L-2.6-12.4H2.6L3.4-10.6V0Z" fill={i === 0 ? '#c79a62' : '#a8763f'} />
              <path d="M-3.4-10.6H3.4" stroke="#7a4b30" strokeWidth=".5" />
              <ellipse cx="0" cy="-5.4" rx="1.6" ry="2.2" fill="#3b1e0e" opacity=".75" />
              <path d="M0-7.4C-.6-6-.6-4.8 0-3.4" stroke={i === 0 ? '#c79a62' : '#a8763f'} strokeWidth=".45" fill="none" />
            </g>
          ))}

          {/* ---------- la pizarra con la carta ---------- */}
          <rect x="184" y="49" width="48" height="50" rx="2.2" fill="#a8693a" />
          <rect x="186.2" y="51.2" width="43.6" height="45.6" rx="1.4" fill="#26352f" />
          <text x="208" y="60" textAnchor="middle" fontSize="6.4" fontWeight="800" fill="#fde68a" letterSpacing=".6">
            CARTA
          </text>
          <path d="M197 62.4H219" stroke="#fde68a" strokeWidth=".5" strokeDasharray="1.2 1" opacity=".7" />
          {CARTA.map(([plato, precio], i) => (
            <g key={plato}>
              <text x="189" y={69.6 + i * 7.4} fontSize="5.5" fontWeight="600" fill="#f4efe6">
                {plato}
              </text>
              <text x="227" y={69.6 + i * 7.4} textAnchor="end" fontSize="5.5" fontWeight="800" fill={i === 1 ? '#fde68a' : '#9fe3d8'}>
                {precio}
              </text>
            </g>
          ))}
          {/* el capuchino del día, encerrado con tiza */}
          <ellipse className="esc-cafe-tiza" cx="223.4" cy="75.2" rx="4.6" ry="3.4" fill="none" stroke="#fde68a" strokeWidth=".6" />

          {/* ---------- la barra ---------- */}
          <rect x="58" y="112" width="184" height="34" fill={u('ba')} />
          {Array.from({ length: 12 }, (_, i) => 58 + i * 15.33).map((x) => (
            <rect key={x} x={x} y="112" width=".8" height="34" fill="#5a3420" opacity=".35" />
          ))}
          <rect x="58" y="112" width="184" height="4" fill="#5a3420" opacity=".25" />
          <rect x="58" y="138.4" width="184" height="1.8" rx=".9" fill="#d9b06a" />
          <rect x="58" y="138.4" width="184" height=".6" fill="#fff" opacity=".4" />
          <rect x="54" y="106" width="192" height="7" rx="2" fill={u('bt')} />
          <rect x="56" y="106.4" width="188" height="1.4" rx=".7" fill="#8a5a3a" />

          {/* la vitrina de pasteles sobre la barra */}
          <rect x="68" y="82" width="31" height="27" rx="1.6" fill="#8a5530" />
          <rect x="70" y="84" width="27" height="24" rx="1" fill={u('vi')} />
          <g transform="translate(77 95.6)">
            <Medialuna c={u('ch')} />
          </g>
          <g transform="translate(90 95.6)">
            <Muffin />
          </g>
          <rect x="70" y="95.6" width="27" height="1" fill="#d9c09a" />
          {[76, 85, 92.4].map((x, i) => (
            <g key={x} transform={`translate(${x} 107.6)`}>
              {i === 2 ? <Muffin /> : <Tajada relleno={i === 0 ? '#7a3f1c' : '#e86a7a'} />}
            </g>
          ))}
          <path d="M70 84H82L74 108H70Z" fill="#fff" opacity=".25" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(60 84)">
              <g className="esc-cafe-brillo" style={v({ '--d': '46px' })}>
                <path d="M0 0H6L0 24H-6Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          <rect x="66.6" y="80.4" width="33.8" height="2.6" rx="1.2" fill="#a8693a" />

          {/* ---------- la máquina de espresso ---------- */}
          {/* las tazas que se entibian arriba */}
          {[108, 116.4, 124.8].map((x) => (
            <g key={x}>
              <path d={`M${x - 3.4} 51H${x + 3.4}L${x + 2.6} 46H${x - 2.6}Z`} fill="#fffdf8" stroke="#bfa98a" strokeWidth=".4" />
              <path d={`M${x + 0.8} 50.6H${x + 3}L${x + 2.3} 46.4H${x + 0.6}Z`} fill="#e3d3bd" />
              <rect x={x - 3} y="48" width="6" height=".9" fill="#2bb3a3" />
            </g>
          ))}
          <path d="M131 51H139L138 46.6H132Z" fill="#fffdf8" stroke="#bfa98a" strokeWidth=".4" />
          <path d="M131.6 46.6H138.4L137.6 42.4H132.4Z" fill="#f4ece1" stroke="#bfa98a" strokeWidth=".4" />
          <rect x="101" y="50.4" width="52" height="2" rx="1" fill="#8b95a1" />
          {/* el cuerpo, las columnas y el hueco del grupo */}
          <rect x="104" y="74" width="46" height="31" fill="#3b2a22" />
          <rect x="104" y="74" width="46" height="3" fill="#000" opacity=".25" />
          <rect x="100" y="52" width="54" height="24" rx="3" fill={u('ac')} />
          <rect x="100" y="72" width="5" height="34" rx="1.2" fill={u('ac')} />
          <rect x="149" y="72" width="5" height="34" rx="1.2" fill={u('ac')} />
          <rect x="104" y="55" width="46" height="17" rx="2" fill={u('tu')} />
          <rect x="104" y="55" width="46" height="2" rx="1" fill="#fff" opacity=".3" />
          <rect x="101" y="53" width="2" height="21" rx="1" fill="#fff" opacity=".7" />
          <g transform="translate(115 63.6)">
            <Manometro retraso="0s" />
          </g>
          <g transform="translate(139 63.6)">
            <Manometro retraso="-.12s" />
          </g>
          {/* la luz de encendido */}
          <circle cx="127" cy="60" r="1.5" fill="#fef3c7" />
          <circle className="esc-cafe-piloto" cx="127" cy="60" r="1" fill="#f59e0b" />
          <rect x="122.4" y="65.6" width="9.2" height="3" rx="1.5" fill="#0f5f57" opacity=".55" />
          {/* el grupo y el portafiltro con su mango */}
          <rect x="120" y="76" width="14" height="4.6" rx="1" fill={u('ac')} />
          <rect x="118.4" y="80.4" width="17.2" height="3.4" rx="1.2" fill="#8b95a1" />
          <path d="M119 81.4L104.6 84.4C103.4 84.6 103.2 82.6 104.4 82.4L119 80.6Z" fill="#2a1d17" />
          <rect x="124.6" y="83.6" width="1.6" height="2.4" fill="#6b7480" />
          <rect x="127.8" y="83.6" width="1.6" height="2.4" fill="#6b7480" />
          {/* el chorro de café (sale de los dos picos) */}
          <g className="esc-cafe-chorro">
            <rect x="124.9" y="86" width="1.1" height="9.6" rx=".55" fill="#b8692e" />
            <rect x="128.1" y="86" width="1.1" height="9.6" rx=".55" fill="#b8692e" />
            <rect x="125.1" y="86" width=".4" height="9.4" rx=".2" fill="#f2b56b" opacity=".8" />
            <rect x="128.3" y="86" width=".4" height="9.4" rx=".2" fill="#f2b56b" opacity=".8" />
          </g>
          {/* la bandeja de goteo */}
          <rect x="103" y="104.4" width="48" height="4.6" rx="1" fill="#6b7480" />
          <rect x="104" y="104.4" width="46" height="1.4" rx=".6" fill="#b8c0ca" />
          {[108, 114, 120, 134, 140, 146].map((x) => (
            <rect key={x} x={x} y="104.6" width="2.6" height=".9" rx=".4" fill="#4b5563" />
          ))}
          {/* el vaporizador, metido en la jarra de leche */}
          <path d="M152 73H157.6V104" fill="none" stroke="#8b95a1" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="153" cy="73" r="1.6" fill="#cfd5dc" />
          <g transform="translate(158 109)">
            <path d="M-3.8 0L-4.2-9.6H4.2L3.8 0Z" fill={u('ac')} />
            <path d="M-4.2-9.6H3.6L5.4-10.8L4.2-8.6" fill="#cfd5dc" />
            <path d="M3.6-7.6C6.2-7.6 6.2-2.6 3.8-2.4" fill="none" stroke="#97a1ad" strokeWidth="1" />
            <rect x="-3.2" y="-8.6" width="1" height="7.6" rx=".5" fill="#fff" opacity=".7" />
          </g>
          <g className="esc-cafe-espuma">
            {[
              ['0s', '-3px'],
              ['-.36s', '2px'],
              ['-.72s', '-1px'],
            ].map(([d, dx]) => (
              <circle key={d} className="esc-cafe-vapor" cx="158" cy="97" r="2" fill="#fff" style={v({ animationDelay: d, '--dx': dx })} />
            ))}
          </g>

          {/* ---------- el molinillo ---------- */}
          <g transform="translate(172 109)">
            <rect x="-8" y="-11" width="16" height="11" rx="1.6" fill={u('ac')} />
            <rect x="-6.4" y="-9" width="12.8" height="3" rx="1" fill="#2a1d17" />
            <rect x="-5" y="-26" width="10" height="15" rx="1.6" fill="#2a1d17" />
            <rect x="-4.4" y="-25" width="1.6" height="13" rx=".8" fill="#fff" opacity=".2" />
            <circle cx="2" cy="-20" r="1.4" fill="#2bb3a3" />
            <rect x="-1.4" y="-13" width="2.8" height="3" fill="#8b95a1" />
            {/* la tolva con los granos */}
            <path d="M-8-42H8L3-26H-3Z" fill="#fff" opacity=".55" />
            <path d="M-7-38H7L3-27H-3Z" fill="#4a2a1a" />
            {[
              [-4.6, -36.4],
              [-1.4, -36.8],
              [2, -36.2],
              [4.8, -36.8],
              [-2.8, -33.6],
              [0.4, -34],
              [3, -33.4],
              [-1, -30.6],
              [1.6, -30],
            ].map(([x, y]) => (
              <ellipse key={`${x}${y}`} cx={x} cy={y} rx="1.2" ry=".8" fill="#7a4420" />
            ))}
            <path d="M-7-41.4L-3.4-27.6" stroke="#fff" strokeWidth=".8" opacity=".6" />
            <rect x="-9" y="-44.4" width="18" height="3" rx="1.4" fill="#2a1d17" />
            <rect x="-2" y="-46" width="4" height="1.8" rx=".9" fill="#2a1d17" />
          </g>

          {/* el QR de cobro, parado al final de la barra */}
          <rect x="228.4" y="106.4" width="8" height="2.6" rx="1" fill="#5a3420" />
          <rect x="226.4" y="94" width="12" height="13" rx="1.6" fill="#fff" />
          <path
            d="M228.2 95.8h3.4v3.4h-3.4zM233.2 95.8h3.4v3.4h-3.4zM228.2 100.8h3.4v3.4h-3.4zM233.6 101.2h1.3v1.3h-1.3zM235.3 102.9h1.3v1.3h-1.3zM233.6 103.4h1.3v.8h-1.3z"
            fill="#2a160c"
          />

          {/* ---------- la banqueta del cliente ---------- */}
          <path d="M199 123L196.6 146M211 123L213.4 146M205 124V146" stroke="#3b2a22" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="205" cy="136.6" rx="7.4" ry="1.6" fill="none" stroke="#3b2a22" strokeWidth="1" />
          <ellipse cx="205" cy="122.6" rx="10" ry="3" fill="#0f6b62" />
          <ellipse cx="205" cy="121.2" rx="10" ry="3" fill={u('tu')} />
          <ellipse cx="202" cy="120.4" rx="4.6" ry="1.1" fill="#fff" opacity=".3" />
        </g>

        {/* ---------- la taza que se sirve y se desliza (sobre todo lo de la barra) ---------- */}
        <g className="esc-cafe-flota">
          <g transform="translate(127 104.4)">
            <g className="esc-cafe-taza-x">
              <g className="esc-cafe-taza-y">
                <Taza clip={g('bt1')} cuerpo={u('ta')} animada />
              </g>
            </g>
          </g>
          {/* la venta: aro y destellos donde llega la taza */}
          <ellipse className="esc-cafe-aro" cx="205" cy="108.6" rx="12" ry="3.4" fill="none" stroke="#2bb3a3" strokeWidth="1.3" />
          <g transform="translate(190 100) scale(.8)">
            <path className="esc-cafe-chispa" d={ESTRELLA} fill="#fbbf24" />
          </g>
          <g transform="translate(220 99) scale(.8)">
            <path className="esc-cafe-chispa" d={ESTRELLA} fill="#9fe3d8" style={{ animationDelay: '-6.35s' }} />
          </g>

          {/* ---------- el saco de café (izquierda) ---------- */}
          <g transform="translate(33 146)">
            <path d="M-13 0C-15-7-14.6-17-11.6-23H11.6C14.6-17 15-7 13 0Z" fill={u('sa')} />
            <path d="M-11.6-23C-10.4-26.4-6-25.4-4-27.4H4C6-25.4 10.4-26.4 11.6-23Z" fill="#cfae7a" />
            <ellipse cx="0" cy="-24" rx="9.4" ry="2.6" fill="#3b1e0e" />
            {[
              [-5.6, -24.6],
              [-2.4, -25.2],
              [1, -24.4],
              [4.4, -25],
              [6.6, -24],
              [-0.8, -23.2],
            ].map(([x, y]) => (
              <ellipse key={`${x}${y}`} cx={x} cy={y} rx="1.3" ry=".85" fill="#7a4420" />
            ))}
            {[-18, -13, -8, -3].map((y) => (
              <path key={y} d={`M-12.6 ${y}H12.6`} stroke="#a8844f" strokeWidth=".4" opacity=".6" />
            ))}
            <path d="M-13 0C-15-7-14.6-17-11.6-23H-8.6C-11-17-11.6-7-10 0Z" fill="#fff" opacity=".2" />
            <text x="0" y="-9.6" textAnchor="middle" fontSize="6" fontWeight="800" fill="#6b4430">
              CAFÉ
            </text>
            <path d="M-6-6.6H6" stroke="#6b4430" strokeWidth=".6" />
            <ellipse cx="0" cy="-15.6" rx="2" ry="2.8" fill="#6b4430" transform="rotate(25)" />
            <path d="M-.6-18C.6-16.4-.4-14.8.6-13.2" stroke="#dcbf8f" strokeWidth=".5" fill="none" />
          </g>
          {/* granos sueltos al pie del saco */}
          {[
            [52, 145.6, 20],
            [56, 147.4, -30],
            [49, 148.4, 60],
          ].map(([x, y, r]) => (
            <ellipse key={x} cx={x} cy={y} rx="1.4" ry=".9" fill="#5a2f17" transform={`rotate(${r})`} />
          ))}

          {/* ---------- la mesita con su taza (derecha) ---------- */}
          <g transform="translate(270 146)">
            {/* la silla, detrás de la mesa */}
            <path d="M4-48V-22M14-48V-22" stroke="#3b2a22" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M3.2-48C6-50 12-50 14.8-48" fill="none" stroke="#3b2a22" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4-42H14M4-36H14" stroke="#3b2a22" strokeWidth="1" />
            <path d="M3-22L1 0M15-22L17 0" stroke="#3b2a22" strokeWidth="1.6" strokeLinecap="round" />
            <ellipse cx="9" cy="-22" rx="8.4" ry="2.4" fill="#0f6b62" />
            <ellipse cx="9" cy="-23" rx="8.4" ry="2.4" fill={u('tu')} />
          </g>
          <g transform="translate(264 146)">
            <ellipse cx="0" cy="-.6" rx="8" ry="1.8" fill="#3b2a22" />
            <rect x="-1.3" y="-31" width="2.6" height="30.4" fill="#3b2a22" />
            <ellipse cx="0" cy="-31" rx="18" ry="4" fill="#d6cbbb" />
            <ellipse cx="0" cy="-32" rx="18" ry="4" fill="#fbf6ee" />
            <ellipse cx="-5" cy="-33" rx="7" ry="1.4" fill="#fff" opacity=".8" />
          </g>
          <g transform="translate(258 114) scale(.82)">
            <Taza clip={g('bt2')} cuerpo={u('ta')} />
          </g>
          {[
            [256.6, '0s'],
            [259.6, '-1.08s'],
          ].map(([x, d]) => (
            <g key={x} transform={`translate(${x} 103)`}>
              <path
                className="esc-cafe-voluta"
                d="M0 0C-1.6-2 1.6-3.8 0-5.8C-1.6-7.8 1.6-9.6 0-11.6"
                fill="none"
                stroke="#fff"
                strokeWidth="1.3"
                strokeLinecap="round"
                style={{ animationDelay: d as string }}
              />
            </g>
          ))}
          {/* el platito con la tajada */}
          <ellipse cx="272" cy="114" rx="6" ry="1.4" fill="#fffdf8" />
          <ellipse cx="272" cy="114.2" rx="6" ry="1.4" fill="none" stroke="#d9cbb8" strokeWidth=".4" />
          <g transform="translate(272 113.4)">
            <Tajada relleno="#7a3f1c" />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Capuchino" texto="Bs 15" tono="verde" />
    </Marco>
  )
}
