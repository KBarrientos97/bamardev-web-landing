import './EscenasRegalosCosmeticos.css'
import { useId, type CSSProperties } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escenas animadas de la tienda de regalos y de la perfumería-cosméticos (SVG
  propio). Todo se mueve con CSS (sólo transform y opacity); los keyframes
  `esc-reg-*` y `esc-cos-*` viven en EscenasRegalosCosmeticos.css y los
  compartidos `esc-*` en index.css. Son decorativas: el Marco ya las marca con
  aria-hidden.
*/

/** Chispa de cuatro puntas, chica (destellos de la venta). */
const ESTRELLA = 'M0-6L1.6-1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6-1.6Z'
/** La misma chispa, mini (los brillitos del perfume y los destellos dorados). */
const BRILLITO = 'M0-2.4L.6-.6L2.4 0L.6.6L0 2.4L-.6.6L-2.4 0L-.6-.6Z'

/**
 * `.escena svg *` gira y escala cada pieza sobre el centro de su propia caja. Las
 * piezas quietas que se escalan o se giran con el atributo `transform` vuelven con
 * esto al comportamiento normal de SVG (pivote en el origen de su sistema).
 */
const origen0: CSSProperties = { transformBox: 'view-box', transformOrigin: '0px 0px' }

/** Estrella de cinco puntas centrada en (cx, cy). */
function estrella5(cx: number, cy: number, R: number, r: number) {
  return (
    Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5
      const rr = i % 2 ? r : R
      return `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`
    }).join('') + 'Z'
  )
}

/** Corazón centrado en (cx, cy); con s = 1 mide 13,2 × 11,2. */
function corazon(cx: number, cy: number, s: number) {
  const p = (x: number, y: number) => `${(cx + x * s).toFixed(2)} ${(cy + (y + 6.8) * s).toFixed(2)}`
  return `M${p(0, -1.2)}C${p(-2, -2.8)} ${p(-6.6, -5)} ${p(-6.6, -8.6)}C${p(-6.6, -11)} ${p(-4.8, -12.4)} ${p(-3.2, -12.4)}C${p(-1.8, -12.4)} ${p(-0.6, -11.6)} ${p(0, -10.4)}C${p(0.6, -11.6)} ${p(1.8, -12.4)} ${p(3.2, -12.4)}C${p(4.8, -12.4)} ${p(6.6, -11)} ${p(6.6, -8.6)}C${p(6.6, -5)} ${p(2, -2.8)} ${p(0, -1.2)}Z`
}

/* ======================================================================
   Tienda de regalos
   ====================================================================== */

/**
 * Moño de cinta con el nudo en (0, 0): dos lazos, las dos colas y el nudo. `a` es
 * el largo de un lazo.
 */
function Mono({ a, c, osc }: { a: number; c: string; osc: string }) {
  const n = (x: number) => (x * a).toFixed(2)
  const lazo = (k: number) =>
    `M0 0C${n(-0.3 * k)} ${n(-0.95)} ${n(-1.25 * k)} ${n(-0.85)} ${n(-1.1 * k)} ${n(-0.15)}C${n(-1 * k)} ${n(0.3)} ${n(-0.4 * k)} ${n(0.15)} 0 0Z`
  const sombra = (k: number) => `M0 0C${n(-0.3 * k)} ${n(-0.6)} ${n(-0.85 * k)} ${n(-0.55)} ${n(-0.8 * k)} ${n(-0.2)}Z`
  const cola = (k: number) => `M0 0L${n(-0.55 * k)} ${n(0.95)}L${n(-0.25 * k)} ${n(0.82)}L${n(-0.05 * k)} ${n(0.25)}Z`
  return (
    <g>
      <path d={cola(1)} fill={osc} />
      <path d={cola(-1)} fill={c} />
      <path d={lazo(1)} fill={c} />
      <path d={lazo(-1)} fill={c} />
      <path d={sombra(1)} fill={osc} opacity=".45" />
      <path d={sombra(-1)} fill={osc} opacity=".45" />
      <ellipse cx="0" cy={n(-0.05)} rx={n(0.3)} ry={n(0.28)} fill={c} />
      <ellipse cx={n(-0.08)} cy={n(-0.12)} rx={n(0.12)} ry={n(0.09)} fill="#fff" opacity=".6" />
    </g>
  )
}

/** Caja de regalo con la base en (0, 0): cuerpo, tapa, cinta y moño. */
function CajaRegalo({
  w,
  h,
  c,
  tapa,
  cinta,
  osc,
  motas,
  a = 3,
}: {
  w: number
  h: number
  c: string
  tapa: string
  cinta: string
  osc: string
  motas?: string
  a?: number
}) {
  return (
    <g>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={c} />
      {motas &&
        Array.from({ length: Math.floor(w / 4) * Math.floor(h / 4) }, (_, i) => {
          const cols = Math.floor(w / 4)
          const cx = -w / 2 + 2 + (i % cols) * 4 + (Math.floor(i / cols) % 2) * 1.2
          const cy = -h + 2.6 + Math.floor(i / cols) * 4
          return <circle key={i} cx={cx} cy={cy} r=".55" fill={motas} opacity=".85" />
        })}
      <rect x={w / 2 - w * 0.24} y={-h} width={w * 0.24} height={h} fill="#1e1b4b" opacity=".1" />
      <rect x={-w / 2} y={-h} width="1.1" height={h} fill="#fff" opacity=".35" />
      <rect x="-1.1" y={-h} width="2.2" height={h} fill={cinta} />
      <rect x={-w / 2 - 1} y={-h - 2.6} width={w + 2} height="2.8" rx=".6" fill={tapa} />
      <rect x={-w / 2 - 1} y={-h - 2.6} width={w + 2} height=".8" rx=".4" fill="#fff" opacity=".35" />
      <rect x="-1.1" y={-h - 2.6} width="2.2" height="2.8" fill={cinta} />
      <g transform={`translate(0 ${-h - 2.6})`}>
        <Mono a={a} c={cinta} osc={osc} />
      </g>
    </g>
  )
}

/** Osito de peluche sentado, con la base en (0, 0) y unos 17 de alto. */
function Osito({ c, claro, oscuro, lazo }: { c: string; claro: string; oscuro: string; lazo?: string }) {
  return (
    <g>
      <ellipse cx="0" cy="-5.6" rx="4.6" ry="4.8" fill={c} />
      <ellipse cx="0" cy="-4.8" rx="2.7" ry="3" fill={claro} />
      <ellipse cx="-4.3" cy="-5.8" rx="1.5" ry="2.7" fill={c} />
      <ellipse cx="4.3" cy="-5.8" rx="1.5" ry="2.7" fill={c} />
      <ellipse cx="-3.4" cy="-1.7" rx="2.6" ry="1.8" fill={c} />
      <ellipse cx="3.4" cy="-1.7" rx="2.6" ry="1.8" fill={c} />
      <ellipse cx="-3.9" cy="-1.5" rx="1.2" ry="1" fill={claro} />
      <ellipse cx="3.9" cy="-1.5" rx="1.2" ry="1" fill={claro} />
      <circle cx="-3.3" cy="-15" r="1.8" fill={c} />
      <circle cx="3.3" cy="-15" r="1.8" fill={c} />
      <circle cx="-3.3" cy="-15" r=".9" fill={claro} />
      <circle cx="3.3" cy="-15" r=".9" fill={claro} />
      <circle cx="0" cy="-11.8" r="4.3" fill={c} />
      <ellipse cx="0" cy="-10.5" rx="2" ry="1.5" fill={claro} />
      <ellipse cx="0" cy="-11.1" rx=".75" ry=".55" fill={oscuro} />
      <path d="M0-10.6V-10M-.7-9.8Q0-9.3.7-9.8" stroke={oscuro} strokeWidth=".35" fill="none" strokeLinecap="round" />
      <circle cx="-1.6" cy="-12.6" r=".55" fill={oscuro} />
      <circle cx="1.6" cy="-12.6" r=".55" fill={oscuro} />
      <circle cx="-1.45" cy="-12.8" r=".18" fill="#fff" />
      <circle cx="1.75" cy="-12.8" r=".18" fill="#fff" />
      <circle cx="-2.8" cy="-10.8" r=".7" fill="#f9a8d4" opacity=".6" />
      <circle cx="2.8" cy="-10.8" r=".7" fill="#f9a8d4" opacity=".6" />
      <ellipse cx="-1.8" cy="-14.4" rx="1.4" ry=".8" fill="#fff" opacity=".3" />
      {lazo && (
        <g>
          <path d="M0-7.7L-2.3-8.9V-6.5ZM0-7.7L2.3-8.9V-6.5Z" fill={lazo} />
          <circle cx="0" cy="-7.7" r=".75" fill={lazo} />
        </g>
      )}
    </g>
  )
}

/** Conejita de peluche (blanca, orejas largas) con la base en (0, 0), unos 22 de alto. */
function Conejita() {
  return (
    <g stroke="#c9b8e8" strokeWidth=".35">
      <ellipse cx="-1.9" cy="-19.4" rx="1.4" ry="4.4" fill="#fdfcff" />
      <ellipse cx="1.9" cy="-19.4" rx="1.4" ry="4.4" fill="#f4f1fb" />
      <ellipse cx="-1.9" cy="-19" rx=".6" ry="3.2" fill="#f9a8d4" />
      <ellipse cx="1.9" cy="-19" rx=".6" ry="3.2" fill="#f9a8d4" />
      <ellipse cx="0" cy="-5.4" rx="4.4" ry="4.8" fill="#f4f1fb" />
      <ellipse cx="-4" cy="-5.8" rx="1.4" ry="2.6" fill="#fdfcff" />
      <ellipse cx="4" cy="-5.8" rx="1.4" ry="2.6" fill="#ece7f6" />
      <ellipse cx="-3.2" cy="-1.6" rx="2.4" ry="1.7" fill="#fdfcff" />
      <ellipse cx="3.2" cy="-1.6" rx="2.4" ry="1.7" fill="#ece7f6" />
      <circle cx="0" cy="-11.6" r="4.2" fill="#fdfcff" />
      <circle cx="-1.5" cy="-12.2" r=".5" fill="#4c1d95" />
      <circle cx="1.5" cy="-12.2" r=".5" fill="#4c1d95" />
      <path d="M-.6-10.8L.6-10.8L0-10.1Z" fill="#f472b6" />
      <circle cx="-2.7" cy="-10.6" r=".7" fill="#f9a8d4" opacity=".7" />
      <circle cx="2.7" cy="-10.6" r=".7" fill="#f9a8d4" opacity=".7" />
      <path d="M-1.6-7.6L-3.4-8.6V-6.6ZM1.6-7.6L3.4-8.6V-6.6Z" fill="#a78bfa" />
      <circle cx="0" cy="-7.6" r=".9" fill="#8b5cf6" />
    </g>
  )
}

/** Corazón de peluche con carita y patitas, la base en (0, 0). */
function CorazonPeluche() {
  return (
    <g>
      <ellipse cx="-2.4" cy="-.9" rx="1.7" ry="1.1" fill="#be123c" />
      <ellipse cx="2.4" cy="-.9" rx="1.7" ry="1.1" fill="#be123c" />
      <path d={corazon(0, -7.6, 0.9)} fill="#f43f5e" />
      <path d={corazon(-1.6, -9, 0.32)} fill="#fff" opacity=".3" />
      <circle cx="-1.6" cy="-8.4" r=".55" fill="#4c0519" />
      <circle cx="1.6" cy="-8.4" r=".55" fill="#4c0519" />
      <path d="M-.9-7Q0-6.2.9-7" stroke="#4c0519" strokeWidth=".4" fill="none" strokeLinecap="round" />
      <circle cx="-3" cy="-7" r=".7" fill="#fda4af" />
      <circle cx="3" cy="-7" r=".7" fill="#fda4af" />
    </g>
  )
}

/** Taza con corazón, la base en (0, 0). */
function TazaRegalo({ c, motivo }: { c: string; motivo: string }) {
  return (
    <g>
      <path d="M3.2-6.4C6-6.4 6-2.2 3.2-2.2" fill="none" stroke={c} strokeWidth="1.1" />
      <path d="M-3.4-8H3.4V-1C3.4-.4 3-.1 2.4 0H-2.4C-3-.1-3.4-.4-3.4-1Z" fill={c} />
      <ellipse cx="0" cy="-8" rx="3.4" ry=".7" fill="#e2dbef" />
      <path d={corazon(0, -4.2, 0.28)} fill={motivo} />
      <rect x="-3" y="-7.4" width=".9" height="6.4" fill="#fff" opacity=".5" />
    </g>
  )
}

/** Colores y dibujos de las tarjetas del exhibidor (se repiten cada 4: el giro no da tirón). */
const TARJETAS = ['#fda4af', '#99f6e4', '#fde68a', '#c4b5fd']

/** Una tarjeta de saludo (6 × 9) con la esquina de arriba a la izquierda en (x, y). */
function Tarjeta({ x, y, c, m }: { x: number; y: number; c: string; m: number }) {
  return (
    <g>
      <rect x={x} y={y} width="6" height="9" rx=".5" fill={c} />
      <rect x={x + 0.8} y={y + 0.8} width="4.4" height="5" rx=".3" fill="#fff" opacity=".85" />
      {m === 0 && <path d={corazon(x + 3, y + 3.3, 0.24)} fill="#f43f5e" />}
      {m === 1 && <path d={estrella5(x + 3, y + 3.3, 1.7, 0.75)} fill="#f59e0b" />}
      {m === 2 && (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={x + 3 + Math.cos((a * Math.PI) / 180) * 1.1} cy={y + 3.3 + Math.sin((a * Math.PI) / 180) * 1.1} r=".7" fill="#ec4899" />
          ))}
          <circle cx={x + 3} cy={y + 3.3} r=".55" fill="#fbbf24" />
        </g>
      )}
      {m === 3 && (
        <g>
          <ellipse cx={x + 3} cy={y + 2.8} rx="1.2" ry="1.4" fill="#8b5cf6" />
          <path d={`M${x + 3} ${y + 4.2}Q${x + 2.4} ${y + 5} ${x + 3.2} ${y + 5.6}`} stroke="#8b5cf6" strokeWidth=".3" fill="none" />
        </g>
      )}
      <path d={`M${x + 1.2} ${y + 7.2}H${x + 4.8}`} stroke="#fff" strokeWidth=".5" opacity=".8" />
    </g>
  )
}

/** Rayas del toldo de la tienda de regalos (turquesa y crema). */
const RAYAS_REG = Array.from({ length: 10 }, (_, i) => i)

/** Foquitos de la guirnalda que cuelga en la vidriera: punto de la curva y color. */
const FOQUITOS = Array.from({ length: 13 }, (_, i) => {
  const t = i / 12
  const x = (1 - t) * (1 - t) * 90 + 2 * (1 - t) * t * 151 + t * t * 212
  const y = (1 - t) * (1 - t) * 73.4 + 2 * (1 - t) * t * 82 + t * t * 73.4
  return { x, y, c: ['#fbbf24', '#f472b6', '#2dd4bf', '#a78bfa'][i % 4], par: i % 2 === 0 }
})

/**
 * Una tienda de regalos de barrio en tres cuartos: el letrero con su moño, el
 * toldo turquesa, la vidriera con la guirnalda de foquitos y las repisas de
 * peluches, tazas y cajitas; el mostrador de envolver con el rollo de papel, la
 * cinta adhesiva y el QR de cobro; a la izquierda el exhibidor giratorio de
 * tarjetas con el racimo de globos, y a la derecha la pila de regalos con un osote.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): sobre el mostrador espera una caja
 * abierta; el osito de la repisa salta adentro y una tarjeta vuela desde el
 * exhibidor. Se cierra la tapa, el papel sale del rollo y envuelve la caja, se
 * cruza la cinta, cae el moño y un globo-corazón se infla y sube: llega el aviso
 * de la venta. Después se llevan el regalo y vuelve la caja vacía.
 */
export function EscenaRegalos() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco fondo="bg-gradient-to-b from-teal-100 via-violet-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#faf7ff" />
            <stop offset="1" stopColor="#e4dafa" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset="1" stopColor="#f3ecdf" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#cdbfe6" />
            <stop offset="1" stopColor="#ddd2f0" />
          </linearGradient>
          <linearGradient id={g('in')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ece4fb" />
            <stop offset="1" stopColor="#d9cdf3" />
          </linearGradient>
          <linearGradient id={g('le')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#d6cbe9" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3e4cd" />
            <stop offset="1" stopColor="#d8b98d" />
          </linearGradient>
          <linearGradient id={g('fr')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffaf1" />
            <stop offset="1" stopColor="#efe2cc" />
          </linearGradient>
          <linearGradient id={g('ka')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f4dab2" />
            <stop offset="1" stopColor="#d8ad74" />
          </linearGradient>
          <linearGradient id={g('ta')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8e4c3" />
            <stop offset="1" stopColor="#e3bf8a" />
          </linearGradient>
          <linearGradient id={g('oro')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset=".5" stopColor="#f5b83d" />
            <stop offset="1" stopColor="#c98a1c" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* el sombreado que hace "cilindro" del exhibidor giratorio */}
          <linearGradient id={g('ci')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b0764" stopOpacity=".32" />
            <stop offset=".3" stopColor="#3b0764" stopOpacity="0" />
            <stop offset=".55" stopColor="#fff" stopOpacity=".18" />
            <stop offset=".75" stopColor="#3b0764" stopOpacity="0" />
            <stop offset="1" stopColor="#3b0764" stopOpacity=".36" />
          </linearGradient>
          <linearGradient id={g('ro')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".4" />
            <stop offset=".45" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#4c0519" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id={g('po')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e5e7eb" />
            <stop offset="1" stopColor="#9ca3af" />
          </linearGradient>
          {/* globos: brillo arriba a la izquierda */}
          <radialGradient id={g('gc')} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#ffc9bf" />
            <stop offset=".45" stopColor="#fb7185" />
            <stop offset="1" stopColor="#be3455" />
          </radialGradient>
          <radialGradient id={g('gt')} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#b8f5ec" />
            <stop offset=".45" stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#0f8a80" />
          </radialGradient>
          <radialGradient id={g('gv')} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#e4d6fd" />
            <stop offset=".45" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#6d3fc4" />
          </radialGradient>
          <radialGradient id={g('ga')} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff4c2" />
            <stop offset=".45" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#c27c0e" />
          </radialGradient>
          <linearGradient id={g('gh')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd0e2" />
            <stop offset=".45" stopColor="#f43f7e" />
            <stop offset="1" stopColor="#b3134f" />
          </linearGradient>
          {/* el papel de regalo: rosado con lunares dorados y blancos */}
          <pattern id={g('pp')} width="5" height="5" patternUnits="userSpaceOnUse">
            <rect width="5" height="5" fill="#f472b6" />
            <circle cx="1.25" cy="1.25" r=".7" fill="#fde68a" />
            <circle cx="3.75" cy="3.75" r=".55" fill="#fff" opacity=".9" />
          </pattern>
          <pattern id={g('pr')} width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#5eead4" />
            <path d="M0 4L4 0" stroke="#fff" strokeWidth=".8" opacity=".8" />
          </pattern>
          <pattern id={g('pe')} width="5" height="5" patternUnits="userSpaceOnUse">
            <rect width="5" height="5" fill="#c4b5fd" />
            <path d={estrella5(2.5, 2.5, 1.3, 0.55)} fill="#fde68a" />
          </pattern>
          <clipPath id={g('cx')}>
            <rect x="28" y="76" width="32" height="63" />
          </clipPath>
          <clipPath id={g('cr')}>
            <rect x="100" y="101.6" width="32" height="9" />
          </clipPath>
          <clipPath id={g('cv')}>
            <rect x="88" y="70" width="126" height="42" />
          </clipPath>
        </defs>

        {/* plataforma: losa lila con su canto y la sombra de contacto de cada cosa */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#c9b8ef" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".45" />
        <ellipse className="esc-reg-sombra" cx="152" cy="146.4" rx="76" ry="6" fill="#3b0764" opacity=".13" />
        <ellipse cx="44" cy="146.4" rx="20" ry="3.4" fill="#3b0764" opacity=".14" />
        <ellipse cx="260" cy="146.8" rx="32" ry="4" fill="#3b0764" opacity=".12" />

        <g className="esc-reg-flota">
          {/* ---------- el local ---------- */}
          <path d="M66 70L78 65V146L66 149Z" fill={u('la')} />
          <rect x="78" y="56" width="146" height="90" fill={u('pa')} />
          <rect x="78" y="56" width="2.4" height="90" fill="#fff" opacity=".6" />
          <rect x="76" y="52" width="150" height="4.6" rx="1.2" fill="#7c3aed" />
          <rect x="76" y="52" width="150" height="1.2" rx=".6" fill="#c4b5fd" />
          <path d="M64 70L78 64.6V52L64 58Z" fill="#5b21b6" />

          {/* la vidriera: pared lila con lunares, dos repisas y la guirnalda */}
          <rect x="88" y="70" width="126" height="42" fill={u('in')} />
          {Array.from({ length: 30 }, (_, i) => (
            <circle key={i} cx={92 + (i % 10) * 12.6 + (Math.floor(i / 10) % 2) * 6.3} cy={78 + Math.floor(i / 10) * 11} r=".8" fill="#fff" opacity=".55" />
          ))}

          {/* repisa de arriba (base y = 88): peluches */}
          <g transform="translate(97 88) scale(.78)" style={origen0}>
            <Conejita />
          </g>
          <g transform="translate(110 88)">
            <Osito c="#b7794a" claro="#ecc9a2" oscuro="#3b2314" lazo="#f43f5e" />
          </g>
          <g transform="translate(123 88)">
            <CorazonPeluche />
          </g>
          {/* el hueco del osito que se vende (se ve cuando salta a la caja) */}
          <g transform="translate(183 88)">
            <Osito c="#f4f1fb" claro="#fff" oscuro="#1e1b4b" lazo="#2dd4bf" />
          </g>
          <g transform="translate(183 88)">
            {/* manchas de panda */}
            <circle cx="-3.3" cy="-15" r="1.8" fill="#27272a" />
            <circle cx="3.3" cy="-15" r="1.8" fill="#27272a" />
            <ellipse cx="-1.7" cy="-12.5" rx="1.2" ry="1" fill="#27272a" />
            <ellipse cx="1.7" cy="-12.5" rx="1.2" ry="1" fill="#27272a" />
            <circle cx="-1.6" cy="-12.6" r=".35" fill="#fff" />
            <circle cx="1.6" cy="-12.6" r=".35" fill="#fff" />
            <ellipse cx="-4.3" cy="-5.8" rx="1.5" ry="2.7" fill="#27272a" />
            <ellipse cx="4.3" cy="-5.8" rx="1.5" ry="2.7" fill="#27272a" />
          </g>
          <g transform="translate(197 88)">
            <Osito c="#f9a8d4" claro="#fde2ef" oscuro="#831843" lazo="#a78bfa" />
          </g>
          <g transform="translate(208 88)">
            <CajaRegalo w={7} h={6} c="#2dd4bf" tapa="#14b8a6" cinta="#fde68a" osc="#d4a017" a={2} />
          </g>
          <rect x="88" y="88" width="126" height="2.4" fill={u('ma')} />
          <rect x="88" y="90.4" width="126" height=".8" fill="#5b21b6" opacity=".15" />

          {/* repisa de abajo (base y = 102): tazas y cajitas */}
          {[
            [96, '#fff', '#f43f5e'],
            [105, '#fce7f3', '#8b5cf6'],
            [114, '#ccfbf1', '#f43f5e'],
          ].map(([x, c, m]) => (
            <g key={x as number} transform={`translate(${x} 102)`}>
              <TazaRegalo c={c as string} motivo={m as string} />
            </g>
          ))}
          <g transform="translate(128 102)">
            <CajaRegalo w={9} h={7} c="#fb7185" tapa="#e11d48" cinta="#fff" osc="#e2e8f0" motas="#fff" a={2.4} />
          </g>
          <g transform="translate(139 102)">
            <CajaRegalo w={6} h={9} c="#a78bfa" tapa="#7c3aed" cinta="#fde68a" osc="#d4a017" a={2} />
          </g>
          <g transform="translate(179 102)">
            <CajaRegalo w={8} h={6} c="#fde68a" tapa="#f59e0b" cinta="#f43f5e" osc="#be123c" a={2.2} />
          </g>
          {/* portarretrato con corazón */}
          <g transform="translate(189 102)">
            <path d="M-4-10H4L4.6 0H-4.6Z" fill="#f5b83d" />
            <rect x="-2.8" y="-8.8" width="5.6" height="6.8" fill="#fff7ed" />
            <path d={corazon(0, -5.4, 0.3)} fill="#fb7185" />
          </g>
          {/* vela en frasco */}
          <g transform="translate(198 102)">
            <rect x="-3" y="-7" width="6" height="7" rx="1" fill="#fff" opacity=".7" />
            <rect x="-2.4" y="-5" width="4.8" height="4.6" rx=".6" fill="#fbcfe8" />
            <rect x="-.2" y="-6.6" width=".4" height="1.6" fill="#3f3f46" />
            <g transform="translate(0 -6.6)">
              <path className="esc-llama" d="M0-2.6C1-1.4 1-.2 0 0C-1-.2-1-1.4 0-2.6Z" fill="#fbbf24" />
            </g>
          </g>
          <rect x="88" y="102" width="126" height="2.4" fill={u('ma')} />
          <rect x="88" y="104.4" width="126" height=".8" fill="#5b21b6" opacity=".15" />

          {/* la guirnalda de foquitos que cuelga de lado a lado */}
          <path d="M90 73.4Q151 90.6 212 73.4" fill="none" stroke="#475569" strokeWidth=".45" opacity=".7" />
          {FOQUITOS.map((f) => (
            <g key={f.x}>
              <circle className={f.par ? 'esc-reg-foco' : 'esc-reg-foco-b'} cx={f.x} cy={f.y + 1.6} r="2.2" fill={f.c} opacity=".35" />
              <ellipse cx={f.x} cy={f.y + 1.6} rx=".9" ry="1.2" fill={f.c} />
            </g>
          ))}

          {/* el vidrio de la vidriera: reflejo fijo y el brillo que lo cruza */}
          <path d="M88 70H112L96 112H88Z" fill="#fff" opacity=".22" />
          <path d="M118 70H124L108 112H102Z" fill="#fff" opacity=".14" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(74 70)">
              <g className="esc-reg-brillo" style={v({ '--d': '160px' })}>
                <path d="M0 0H10L-6 42H-16Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          {/* columnas de los lados */}
          <rect x="82" y="68" width="6" height="78" fill={u('fr')} />
          <rect x="214" y="68" width="6" height="78" fill={u('fr')} />
          <rect x="82" y="68" width="1.4" height="78" fill="#fff" opacity=".7" />

          {/* el toldo a rayas con festón */}
          {RAYAS_REG.map((i) => {
            const w = 150 / 10
            const x = 76 + w * i
            const c = i % 2 === 0 ? '#2dd4bf' : '#fbcfe8'
            return (
              <g key={i}>
                <path d={`M${x + 1.6 - i * 0.32} 57H${x + w + 1.6 - (i + 1) * 0.32}L${x + w} 66H${x}Z`} fill={c} />
                <path d={`M${x} 66a${w / 2} ${w / 3.2} 0 0 0 ${w} 0Z`} fill={c} />
              </g>
            )
          })}
          <rect x="76" y="65.6" width="150" height="1" fill="#134e4a" opacity=".12" />

          {/* banderines entre el letrero y la esquina */}
          <path d="M152 52.6Q187 57.4 224 52.6" fill="none" stroke="#7c3aed" strokeWidth=".4" />
          {Array.from({ length: 9 }, (_, i) => {
            const x = 156 + i * 7.8
            const t = (x - 152) / 72
            const y = 52.6 + 4.8 * 4 * t * (1 - t) * 0.5
            return <path key={i} d={`M${x - 2.6} ${y}H${x + 2.6}L${x} ${y + 4.6}Z`} fill={['#f472b6', '#fbbf24', '#2dd4bf', '#a78bfa'][i % 4]} />
          })}

          {/* letrero con el moño en la esquina */}
          <rect x="80" y="33" width="70" height="18" rx="4" fill={u('le')} />
          <rect x="80" y="33" width="70" height="2.2" rx="1.1" fill="#c4b5fd" opacity=".7" />
          <rect x="82.4" y="35.4" width="65.2" height="13.2" rx="2.6" fill="none" stroke="#fde68a" strokeWidth=".6" opacity=".8" />
          <text x="116.6" y="46.4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fde68a" textLength="52" lengthAdjust="spacing">
            REGALOS
          </text>
          {[95, 136].map((x) => (
            <rect key={x} x={x} y="51" width="2" height="2" fill="#4c1d95" />
          ))}
          <g transform="translate(82 34)">
            <Mono a={5} c="#fbbf24" osc="#c98a1c" />
          </g>
          <g transform="translate(148 33)">
            <path className="esc-reg-destello" d={BRILLITO} fill="#fff" />
          </g>

          {/* ---------- el mostrador de envolver ---------- */}
          <rect x="92" y="116" width="126" height="30" fill={u('fr')} />
          <rect x="92" y="116" width="2" height="30" fill="#fff" opacity=".7" />
          {/* panel izquierdo: el muestrario de papeles colgando */}
          <rect x="97" y="120" width="54" height="22" rx="1.5" fill="#ede4d4" />
          <rect x="99" y="121.4" width="50" height="1.2" rx=".6" fill="#a8a29e" />
          {[
            [102, u('pp')],
            [113, u('pr')],
            [124, u('pe')],
            [135, '#fde68a'],
          ].map(([x, f], i) => (
            <g key={x as number}>
              <path d={`M${x} 122.6H${(x as number) + 9}V138.4L${(x as number) + 4.5} 136.6L${x} 138.4Z`} fill={f as string} />
              {i === 3 && <path d={`M${(x as number) + 4.5} 123V136`} stroke="#f43f5e" strokeWidth="1.2" />}
              <path d={`M${x} 122.6H${(x as number) + 1.4}V138L${x} 138.4Z`} fill="#fff" opacity=".35" />
            </g>
          ))}
          {/* panel derecho: carretes de cinta con sus colitas rizadas */}
          <rect x="157" y="120" width="56" height="22" rx="1.5" fill="#ede4d4" />
          {[
            [164, '#f43f5e'],
            [174, '#fbbf24'],
            [184, '#2dd4bf'],
            [194, '#8b5cf6'],
            [204, '#f472b6'],
          ].map(([x, c]) => (
            <g key={x as number}>
              <circle cx={x as number} cy="127" r="4" fill={c as string} />
              <circle cx={x as number} cy="127" r="2.6" fill="#fff" opacity=".25" />
              <circle cx={x as number} cy="127" r="1.2" fill="#e7dccb" />
              <path d={`M${(x as number) + 3.4} 129C${(x as number) + 4.4} 132 ${(x as number) + 1} 133 ${(x as number) + 2.6} 135.6C${(x as number) + 3.8} 137.6 ${(x as number) + 1.2} 138.6 ${(x as number) + 2} 140.4`} fill="none" stroke={c as string} strokeWidth=".9" strokeLinecap="round" />
            </g>
          ))}
          {/* la tabla de arriba */}
          <rect x="89" y="111.4" width="132" height="5" rx="1.6" fill={u('mo')} />
          <rect x="91" y="111.8" width="128" height="1" rx=".5" fill="#fff" opacity=".6" />

          {/* la cinta adhesiva y el QR de cobro */}
          <g transform="translate(192 111.6)">
            <path d="M-6 0V-3.4C-6-5-4.8-6-3-6H4L6-3.6V0Z" fill="#0f766e" />
            <circle cx="-1.6" cy="-4" r="2.6" fill="#e0f2fe" opacity=".9" />
            <circle cx="-1.6" cy="-4" r="1.2" fill="#0f766e" />
            <path d="M4-6L6.4-6.6" stroke="#94a3b8" strokeWidth=".6" />
          </g>
          <rect x="204.6" y="109" width="8" height="2.8" rx="1" fill="#5b21b6" />
          <rect x="202.6" y="96.4" width="12" height="13" rx="1.6" fill="#fff" />
          <path d="M204.4 98.2h3.4v3.4h-3.4zM209.4 98.2h3.4v3.4h-3.4zM204.4 103.2h3.4v3.4h-3.4zM209.8 103.6h1.3v1.3h-1.3zM211.4 105.2h1.3v1.3h-1.3zM209.8 105.8h1.3v.8h-1.3z" fill="#3b0764" />

          {/* el rollo de papel de regalo en su soporte */}
          <path d="M101 111.6L103 103.6H105L106 111.6ZM127 111.6L128 103.6H130L132 111.6Z" fill="#a8a29e" />
          <rect x="100" y="101.6" width="32" height="9" fill={u('pp')} />
          <g clipPath={`url(#${g('cr')})`}>
            <g className="esc-reg-rueda">
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x="100" y={100 + i * 3} width="32" height=".5" fill="#fff" opacity=".35" />
              ))}
            </g>
          </g>
          <rect x="100" y="101.6" width="32" height="9" fill={u('ro')} />
          <ellipse cx="100" cy="106.1" rx="1.6" ry="4.5" fill="#fbcfe8" />
          <ellipse cx="100" cy="106.1" rx=".8" ry="2" fill="#d6b98a" />
          <ellipse cx="132" cy="106.1" rx="1.2" ry="4.5" fill="#db2777" opacity=".5" />
          {/* el papel que se estira del rollo hasta la caja */}
          <g className="esc-reg-tira">
            <path d="M131 109.4H173L174.4 112H130.4Z" fill={u('pp')} />
            <path d="M131 109.4H173L173.3 110H130.9Z" fill="#fff" opacity=".35" />
          </g>
          {/* tijera sobre la tabla */}
          <g transform="translate(142 113.6)">
            <circle cx="-3.6" cy="-.6" r="1.3" fill="none" stroke="#7c3aed" strokeWidth=".7" />
            <circle cx="-3.6" cy="1" r="1.3" fill="none" stroke="#7c3aed" strokeWidth=".7" />
            <path d="M-2.4-.2L4.4-1.2M-2.4.6L4.4-1.2" stroke="#cbd5e1" strokeWidth=".7" strokeLinecap="round" />
          </g>

          {/* ---------- el exhibidor giratorio de tarjetas (izquierda) ---------- */}
          <path d="M33 146L44 141.6L55 146" fill="none" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
          <ellipse cx="44" cy="142" rx="3" ry="1" fill="#6b7280" />
          <rect x="43" y="64" width="2" height="78" fill={u('po')} />
          {/* el cartelito de arriba, con corazón */}
          <circle cx="44" cy="66.4" r="4.4" fill="#fff" stroke="#a78bfa" strokeWidth=".8" />
          <path d={corazon(44, 66.6, 0.38)} fill="#f43f5e" />
          {/* las cuatro filas de tarjetas, que giran (se corren por dentro del recorte) */}
          {[76, 92, 108, 124].map((ty) => (
            <rect key={ty} x="28" y={ty} width="32" height="15" fill="#f5f3ff" />
          ))}
          <g clipPath={`url(#${g('cx')})`}>
            <g className="esc-reg-gira">
              {[76, 92, 108, 124].map((ty, t) =>
                Array.from({ length: 10 }, (_, i) => (
                  <Tarjeta key={`${t}-${i}`} x={i * 7 - 0.4} y={ty + 1.4} c={TARJETAS[(i + t) % 4]} m={(i + 2 * t) % 4} />
                )),
              )}
            </g>
          </g>
          {[76, 92, 108, 124].map((ty) => (
            <g key={ty}>
              <rect x="28" y={ty + 7} width="32" height="5" fill="#fff" opacity=".4" />
              <rect x="28" y={ty} width="32" height="15" fill={u('ci')} />
              <rect x="27.4" y={ty + 12} width="33.2" height="1" rx=".4" fill="#9ca3af" />
              <rect x="27.4" y={ty + 6.8} width="33.2" height=".5" fill="#cbd5e1" />
              <rect x="27.4" y={ty + 14.4} width="33.2" height=".6" fill="#6b7280" opacity=".5" />
            </g>
          ))}

          {/* el racimo de globos atado al cartelito; se mece */}
          <g className="esc-reg-racimo">
            {(
              [
                [42, 39, 'M44 62Q41 52 42 47.2'],
                [28, 22, 'M44 62Q34 46 29.4 29.4'],
                [53, 24, 'M44 62Q50 44 53 31.6'],
                [24, 42, 'M44 62Q30 56 24.8 50.6'],
                [64, 40, 'M44 62Q58 56 63.6 48.2'],
              ] as const
            ).map(([, , d]) => (
              <path key={d} d={d} fill="none" stroke="#94a3b8" strokeWidth=".4" />
            ))}
            <g className="esc-reg-globo-b" style={{ animationDelay: '-.8s' }}>
              <ellipse cx="42" cy="39" rx="7" ry="8" fill={u('gv')} />
              <ellipse cx="39.4" cy="35.4" rx="1.8" ry="2.8" fill="#fff" opacity=".45" />
              <path d="M41 47.8L42 46.6L43 47.8Z" fill="#6d3fc4" />
            </g>
            <g className="esc-reg-globo-b" style={{ animationDelay: '-2s' }}>
              <path d={estrella5(28, 21, 8.4, 4)} fill={u('oro')} />
              <path d={estrella5(28, 21, 4.6, 2.2)} fill="#fff" opacity=".25" />
              <path d="M25 15.6L26.8 18" stroke="#fff" strokeWidth=".8" strokeLinecap="round" opacity=".8" />
            </g>
            <g className="esc-reg-globo-b" style={{ animationDelay: '-3.1s' }}>
              <path d={corazon(53, 24, 1.05)} fill={u('gh')} />
              <path d="M48 20.4Q48.6 18.6 50.4 18.4" stroke="#fff" strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".75" />
            </g>
            <g className="esc-reg-globo-b" style={{ animationDelay: '-1.4s' }}>
              <ellipse cx="24" cy="42" rx="7.4" ry="8.4" fill={u('gc')} />
              <ellipse cx="21.2" cy="38.2" rx="1.9" ry="2.9" fill="#fff" opacity=".45" />
              <path d="M23 51.2L24 50L25 51.2Z" fill="#be3455" />
            </g>
            <g className="esc-reg-globo-b" style={{ animationDelay: '-4.4s' }}>
              <ellipse cx="64" cy="40" rx="6.8" ry="7.8" fill={u('gt')} />
              <ellipse cx="61.4" cy="36.6" rx="1.7" ry="2.6" fill="#fff" opacity=".45" />
              <path d="M63 48.6L64 47.4L65 48.6Z" fill="#0f8a80" />
            </g>
          </g>

          {/* ---------- la pila de regalos y el osote (derecha) ---------- */}
          <g transform="translate(244 146)">
            <CajaRegalo w={28} h={22} c="#2dd4bf" tapa="#14b8a6" cinta="#fbbf24" osc="#c98a1c" a={5} />
          </g>
          <g transform="translate(245 121.2)">
            <CajaRegalo w={17} h={12} c="#fb7185" tapa="#e11d48" cinta="#fff" osc="#e2e8f0" motas="#fff" a={3.6} />
          </g>
          <g transform="translate(266 146)">
            <CajaRegalo w={13} h={10} c="#c4b5fd" tapa="#8b5cf6" cinta="#f43f5e" osc="#be123c" a={2.8} />
          </g>
          {/* el globo amarillo atado a la pila */}
          <path d="M245 104.6Q250 94 257.4 85.4" fill="none" stroke="#94a3b8" strokeWidth=".4" />
          <g className="esc-reg-corazon">
            <ellipse cx="258" cy="77" rx="6.6" ry="7.6" fill={u('ga')} />
            <ellipse cx="255.4" cy="73.6" rx="1.7" ry="2.6" fill="#fff" opacity=".5" />
            <path d="M257 85.4L258 84.2L259 85.4Z" fill="#b7791f" />
          </g>
          <g transform="translate(281 144.4) scale(1.25)" style={origen0}>
            <Osito c="#c08552" claro="#f1d2ad" oscuro="#3b2314" lazo="#8b5cf6" />
          </g>
        </g>

        {/* ---------- la historia: la caja que se arma y se envuelve ---------- */}
        <g className="esc-reg-flota">
          <g className="esc-reg-caja">
            <ellipse cx="160" cy="112.2" rx="13" ry="1.2" fill="#3b0764" opacity=".18" />
            {/* el fondo de la caja abierta */}
            <rect x="149" y="89.6" width="22" height="3" fill="#a4733d" />
            {/* el osito de la repisa que salta adentro */}
            <g transform="translate(157 102)">
              <g className="esc-reg-osito-x">
                <g className="esc-reg-osito-y">
                  <Osito c="#d9a066" claro="#f6dcb9" oscuro="#3b2314" lazo="#f43f5e" />
                </g>
              </g>
            </g>
            {/* la tarjeta que vuela desde el exhibidor */}
            <g className="esc-reg-tarjeta-x">
              <g className="esc-reg-tarjeta-y">
                <Tarjeta x={163} y={84} c="#fda4af" m={0} />
              </g>
            </g>
            <g className="esc-reg-golpe">
              {/* el frente de la caja */}
              <rect x="149" y="92" width="22" height="20" fill={u('ka')} />
              <rect x="149" y="92" width="1.4" height="20" fill="#fff" opacity=".35" />
              <path d="M149 92H171" stroke="#8a5a26" strokeWidth=".5" opacity=".5" />
              {/* la tapa: apoyada al costado, se levanta y cierra */}
              <g className="esc-reg-tapa">
                <rect x="147.5" y="88" width="25" height="4.6" rx=".8" fill={u('ta')} />
                <rect x="147.5" y="88" width="25" height="1" rx=".5" fill="#fff" opacity=".5" />
              </g>
              {/* el papel que sube y la envuelve */}
              <g className="esc-reg-papel">
                <rect x="147.3" y="87.8" width="25.4" height="24.2" fill={u('pp')} />
                <rect x="147.3" y="87.8" width="2" height="24.2" fill="#fff" opacity=".3" />
                <rect x="167.6" y="87.8" width="5.1" height="24.2" fill="#831843" opacity=".14" />
                <path d="M147.3 92.6H172.7" stroke="#831843" strokeWidth=".5" opacity=".25" />
              </g>
              {/* la cinta que se cruza */}
              <g className="esc-reg-cinta-v">
                <rect x="158.6" y="87.8" width="2.8" height="24.2" fill={u('oro')} />
                <rect x="158.9" y="87.8" width=".7" height="24.2" fill="#fff" opacity=".5" />
              </g>
              <g className="esc-reg-cinta-h">
                <rect x="147.3" y="99" width="25.4" height="2.8" fill={u('oro')} />
                <rect x="147.3" y="99.3" width="25.4" height=".6" fill="#fff" opacity=".5" />
              </g>
              {/* el moño que cae */}
              <g transform="translate(160 88)">
                <g className="esc-reg-mono">
                  <Mono a={6} c="#fbbf24" osc="#c98a1c" />
                </g>
              </g>
            </g>
          </g>

          {/* el globo-corazón: se infla sobre el moño y sube hasta el aviso */}
          <g className="esc-reg-globo">
            <g className="esc-reg-inflar">
              <path d="M160 86Q158.4 79 160 70.6" fill="none" stroke="#94a3b8" strokeWidth=".45" />
              <path d={corazon(160, 61.6, 1.3)} fill={u('gh')} />
              <path d={corazon(157.6, 58.6, 0.42)} fill="#fff" opacity=".18" />
              <path d="M153.2 57.4Q153.9 54.9 156.4 54.6" stroke="#fff" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity=".8" />
              <path d="M159.1 71L160 69.6L160.9 71Z" fill="#b3134f" />
            </g>
          </g>

          {/* la venta: aro y destellos sobre la caja */}
          <ellipse className="esc-reg-aro" cx="160" cy="112" rx="16" ry="3.6" fill="none" stroke="#8b5cf6" strokeWidth="1.3" />
          <g transform="translate(144 84)">
            <path className="esc-reg-chispa" d={ESTRELLA} fill="#fbbf24" />
          </g>
          <g transform="translate(178 80)">
            <path className="esc-reg-chispa" d={ESTRELLA} fill="#c4b5fd" style={{ animationDelay: '-6.35s' }} />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Peluche + tarjeta" texto="Bs 60" tono="violeta" />
    </Marco>
  )
}

/* ======================================================================
   Cosméticos y perfumería
   ====================================================================== */

/** Pote de crema con la base en (0, 0): cuerpo, tapa y etiqueta. */
function Pote({ w, h, c, tapa }: { w: number; h: number; c: string; tapa: string }) {
  return (
    <g>
      <rect x={-w / 2} y={-h} width={w} height={h} rx="1" fill={c} />
      <rect x={-w / 2} y={-h * 0.62} width={w} height={h * 0.3} fill="#fff" opacity=".55" />
      <rect x={-w / 2 + 0.6} y={-h + 0.4} width=".9" height={h - 0.8} rx=".4" fill="#fff" opacity=".5" />
      <rect x={-w / 2 - 0.4} y={-h - 2.2} width={w + 0.8} height="2.4" rx=".7" fill={tapa} />
      <rect x={-w / 2 - 0.4} y={-h - 2.2} width={w + 0.8} height=".7" rx=".35" fill="#fff" opacity=".45" />
    </g>
  )
}

/** Pomo (tubo de crema) parado sobre su tapa, la base en (0, 0). */
function Pomo({ h, c, tapa }: { h: number; c: string; tapa: string }) {
  return (
    <g>
      <rect x="-1.8" y="-2.6" width="3.6" height="2.6" rx=".5" fill={tapa} />
      <path d={`M-1.6-2.6L-2.3 ${-h + 0.8}H2.3L1.6-2.6Z`} fill={c} />
      <rect x="-2.3" y={-h} width="4.6" height="1" fill={tapa} opacity=".7" />
      <path d={`M-1.2-4L-1.6 ${-h + 1.6}`} stroke="#fff" strokeWidth=".6" opacity=".6" />
      <rect x="-1.2" y={-h * 0.6} width="2.4" height="1.4" fill="#fff" opacity=".45" />
    </g>
  )
}

/** Frasco con dosificador (loción), la base en (0, 0). */
function Dosificador({ c }: { c: string }) {
  return (
    <g>
      <rect x="-2.6" y="-9" width="5.2" height="9" rx="1.2" fill={c} />
      <rect x="-2.6" y="-6" width="5.2" height="2.6" fill="#fff" opacity=".5" />
      <rect x="-2" y="-8.4" width=".8" height="7.6" rx=".4" fill="#fff" opacity=".5" />
      <rect x="-1" y="-10.4" width="2" height="1.5" fill="#e7e5e4" />
      <rect x="-1.5" y="-12" width="3" height="1.7" rx=".4" fill="#f5f5f4" />
      <path d="M1.4-11.7H3.8V-10.9H1.4Z" fill="#d6d3d1" />
    </g>
  )
}

/** Sérum con gotero, la base en (0, 0). */
function Gotero({ c }: { c: string }) {
  return (
    <g>
      <rect x="-2" y="-6" width="4" height="6" rx=".8" fill={c} />
      <rect x="-1.5" y="-5.2" width=".7" height="4.4" rx=".3" fill="#fff" opacity=".45" />
      <rect x="-1.2" y="-7.4" width="2.4" height="1.5" fill="#d4a24c" />
      <ellipse cx="0" cy="-9" rx="1.1" ry="1.8" fill="#3f2430" />
    </g>
  )
}

/** Esmalte de uñas, la base en (0, 0). */
function Esmalte({ c, tapa = '#27272a' }: { c: string; tapa?: string }) {
  return (
    <g>
      <rect x="-1.7" y="-4.2" width="3.4" height="4.2" rx=".9" fill={c} />
      <rect x="-1.2" y="-3.6" width=".6" height="3" rx=".3" fill="#fff" opacity=".55" />
      <rect x="-.9" y="-7.6" width="1.8" height="3.5" rx=".3" fill={tapa} />
    </g>
  )
}

/** Tonos de los labiales del mostrador (de nude a ciruela). */
const TONOS_LABIAL = ['#d9a08b', '#e8798f', '#c2185b', '#e11d48', '#b45372', '#9f1239', '#f08a7a', '#7a2848']
/** Godetes de las paletas de sombras: dos filas de cinco por paleta. */
const PALETAS = [
  ['#f5d9c8', '#e8b89c', '#c98a6b', '#9c5a44', '#5b3427', '#f7c6cf', '#e8a0b4', '#d4af37', '#b8860b', '#6b2a47'],
  ['#fce7f3', '#f9a8d4', '#ec4899', '#be185d', '#831843', '#fde68a', '#f5c26b', '#e0a458', '#c08552', '#7c4a2d'],
  ['#ede9fe', '#c4b5fd', '#a78bfa', '#7c3aed', '#4c1d95', '#fee2e2', '#fca5a5', '#f87171', '#dc2626', '#7f1d1d'],
  ['#fff1e6', '#f2d0b6', '#e6b08e', '#d08c64', '#a8613d', '#f4e4c1', '#e9cf8f', '#d4af37', '#a77c1f', '#4a3424'],
]
/** Brillitos del atomizador: hacia dónde salen desde la boquilla, tamaño, color y si es estrellita. */
const BRILLITOS: [string, string, number, string, boolean][] = [
  ['-12px', '-6px', 1.7, '#f5b942', true],
  ['-18px', '-13px', 1.2, '#f472b6', false],
  ['-24px', '-3px', 1.5, '#ffffff', true],
  ['-28px', '-15px', 1, '#f5b942', false],
  ['-15px', '-19px', 1.4, '#f472b6', true],
  ['-31px', '-8px', 1.8, '#f5b942', true],
  ['-8px', '-13px', 1, '#ffffff', false],
  ['-22px', '-22px', 1.2, '#e0a458', false],
  ['-6px', '-3px', 1.2, '#f472b6', true],
  ['-20px', '-9px', 0.9, '#d9466f', false],
  ['-34px', '-17px', 1.3, '#f9a8d4', true],
  ['-11px', '-24px', 0.9, '#f5b942', false],
]
/** Foquitos alrededor del espejo: [x, y, grupo con el que titila]. */
const FOCOS_ESPEJO: [number, number, boolean][] = [
  [95, 71.6, true],
  [103, 71.6, false],
  [111, 71.6, true],
  [119, 71.6, false],
  [88.6, 80, false],
  [88.6, 88.5, true],
  [88.6, 97, false],
  [125.4, 80, true],
  [125.4, 88.5, false],
  [125.4, 97, true],
]
/** Pisos de la torre de esmaltes: altura, radio y colores. */
const TORRE: [number, number, string[]][] = [
  [132, 17, ['#e11d48', '#f9a8d4', '#be185d', '#fca5a5', '#7a2848', '#f472b6', '#d97706', '#fde68a']],
  [116, 14, ['#c4b5fd', '#ec4899', '#f43f5e', '#fbcfe8', '#a21caf', '#e8798f']],
  [100, 11, ['#f08a7a', '#d9a08b', '#9f1239', '#f9a8d4']],
]

/**
 * Una perfumería-cosmética elegante en tres cuartos: el letrero ciruela con
 * letras doradas, el toldo de festón rosa viejo, el espejo de camarín con sus
 * foquitos, los estantes de vidrio con cremas, pomos, sérums y lociones, y el
 * mostrador de vidrio con la fila de labiales y las paletas de sombras abiertas.
 * Sobre el mostrador, la bandeja de probadores, el vasito de tiras, el perfume
 * estrella, la bolsita de regalo y el QR. A la izquierda la torre de esmaltes con
 * el labial gigante; a la derecha las cajas, el perfume de exhibición y las rosas.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): aparece el perfume en el
 * mostrador, se le saca la tapa y el atomizador lanza tres nubecitas de
 * brillitos (y suben las ondas del aroma); vuelve la tapa, el frasco salta en
 * arco a la bolsita de regalo, la bolsa se aplasta con su aro y llega el aviso.
 * Después se llevan la bolsa y vuelve una vacía.
 */
export function EscenaCosmeticos() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco fondo="bg-gradient-to-b from-rose-100 via-orange-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff8f4" />
            <stop offset="1" stopColor="#f5d8cd" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fdf0ea" />
            <stop offset="1" stopColor="#f3d6ca" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9a99a" />
            <stop offset="1" stopColor="#e7bfb1" />
          </linearGradient>
          <linearGradient id={g('in')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff5f1" />
            <stop offset="1" stopColor="#f6dbd3" />
          </linearGradient>
          <linearGradient id={g('le')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a3152" />
            <stop offset="1" stopColor="#4a1c33" />
          </linearGradient>
          <linearGradient id={g('oro')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbe3a6" />
            <stop offset=".5" stopColor="#d9a84e" />
            <stop offset="1" stopColor="#a8762a" />
          </linearGradient>
          <linearGradient id={g('es')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbf9fd" />
            <stop offset=".6" stopColor="#e6e1ee" />
            <stop offset="1" stopColor="#cfc8dc" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffaf8" stopOpacity=".95" />
            <stop offset="1" stopColor="#f7e3dc" stopOpacity=".95" />
          </linearGradient>
          <linearGradient id={g('vl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff1f5" />
            <stop offset=".6" stopColor="#f9c9d6" />
            <stop offset="1" stopColor="#e9a3b7" />
          </linearGradient>
          <linearGradient id={g('li')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbb6c9" />
            <stop offset="1" stopColor="#d9466f" />
          </linearGradient>
          <linearGradient id={g('tp')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde4dc" />
            <stop offset=".5" stopColor="#e9b3a2" />
            <stop offset="1" stopColor="#c98a76" />
          </linearGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f9c8d2" />
            <stop offset="1" stopColor="#ec9fb1" />
          </linearGradient>
          <linearGradient id={g('ga')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe9c2" />
            <stop offset=".55" stopColor="#f0b467" />
            <stop offset="1" stopColor="#c07a33" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={g('lz')}>
            <stop offset="0" stopColor="#fff3c4" stopOpacity=".95" />
            <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('ni')}>
            <stop offset="0" stopColor="#f9a8d4" stopOpacity=".85" />
            <stop offset="1" stopColor="#fbcfe8" stopOpacity="0" />
          </radialGradient>
          <clipPath id={g('ce')}>
            <rect x="90" y="73" width="34" height="32" rx="4" />
          </clipPath>
          <clipPath id={g('cm')}>
            <rect x="85" y="115" width="136" height="28.6" />
          </clipPath>
        </defs>

        {/* plataforma: losa nude con su canto y las sombras de contacto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#e9b9ab" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".45" />
        <ellipse className="esc-cos-sombra" cx="148" cy="146.4" rx="80" ry="6" fill="#5b2a3a" opacity=".13" />
        <ellipse cx="32" cy="146.4" rx="19" ry="3.4" fill="#5b2a3a" opacity=".14" />
        <ellipse cx="262" cy="146.8" rx="32" ry="4" fill="#5b2a3a" opacity=".12" />

        <g className="esc-cos-flota">
          {/* ---------- el local ---------- */}
          <path d="M60 70L72 65V146L60 149Z" fill={u('la')} />
          <path d="M58 70L72 64.4V52L58 58Z" fill="#8f5a3a" />
          <rect x="72" y="56" width="154" height="90" fill={u('pa')} />
          <rect x="72" y="56" width="2.4" height="90" fill="#fff" opacity=".6" />
          <rect x="70" y="52" width="158" height="4.6" rx="1.2" fill={u('oro')} />
          <rect x="70" y="52" width="158" height="1.1" rx=".55" fill="#fff3d6" opacity=".8" />

          {/* el fondo: pared rosada con rayas de papel tapiz */}
          <rect x="82" y="66" width="136" height="46" fill={u('in')} />
          {Array.from({ length: 17 }, (_, i) => (
            <rect key={i} x={84 + i * 8} y="66" width="3.2" height="46" fill="#f1c9bd" opacity=".35" />
          ))}

          {/* el espejo de camarín con sus foquitos */}
          <rect x="87" y="70" width="40" height="38" rx="6" fill={u('oro')} />
          <rect x="90" y="73" width="34" height="32" rx="4" fill={u('es')} />
          <g clipPath={`url(#${g('ce')})`}>
            <path d="M96 73H104L92 105H90V90Z" fill="#fff" opacity=".7" />
            <path d="M108 73H111L99 105H96Z" fill="#fff" opacity=".5" />
            <rect x="110" y="93" width="16" height="1" fill="#d8c3c9" opacity=".6" />
            <g transform="translate(82 73)">
              <g className="esc-cos-espejo" style={v({ '--d': '58px' })}>
                <path d="M0 0H7L-3 32H-10Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          {FOCOS_ESPEJO.map(([x, y, a]) => (
            <g key={`${x}-${y}`}>
              <circle className={a ? 'esc-cos-foco' : 'esc-cos-foco-b'} cx={x} cy={y} r="3.4" fill={u('lz')} />
              <circle cx={x} cy={y} r="1.45" fill="#fffaf0" stroke="#e2bd76" strokeWidth=".4" />
            </g>
          ))}

          {/* los estantes de vidrio con cremas, pomos, sérums y lociones */}
          {[84, 100].map((y) => (
            <path key={y} d={`M134 ${y + 1.4}L136 ${y + 4}H137L137 ${y + 1.4}ZM210 ${y + 1.4}L210 ${y + 4}H211L213 ${y + 1.4}Z`} fill="#c99a4e" />
          ))}
          <g transform="translate(138 84)">
            <Pote w={9} h={6} c="#fde2e4" tapa="#d9a84e" />
          </g>
          <g transform="translate(147 84)">
            <Pomo h={12} c="#fbcfe8" tapa="#be185d" />
          </g>
          <g transform="translate(152.4 84)">
            <Pomo h={11} c="#fff" tapa="#d9a84e" />
          </g>
          <g transform="translate(160 84)">
            <Dosificador c="#f5d0c5" />
          </g>
          <g transform="translate(169.6 84)">
            <Pote w={8} h={8} c="#f3c6b8" tapa="#fdf8f6" />
          </g>
          <g transform="translate(178.4 84)">
            <Gotero c="#d97706" />
          </g>
          <g transform="translate(184 84)">
            <Gotero c="#be185d" />
          </g>
          <g transform="translate(194 84)">
            <Pote w={10} h={5} c="#fff" tapa="#e8a0b4" />
          </g>
          <g transform="translate(205 84)">
            <Dosificador c="#efd3c0" />
          </g>
          <rect x="133" y="84" width="81" height="1.4" fill="#fff" opacity=".9" />
          <rect x="133" y="85.4" width="81" height=".5" fill="#d9a84e" />
          <g transform="translate(138 100)">
            <Dosificador c="#fecdd3" />
          </g>
          <g transform="translate(147 100)">
            <Pote w={8} h={6} c="#fff1e6" tapa="#be185d" />
          </g>
          <g transform="translate(155 100)">
            <Pomo h={11} c="#f9a8d4" tapa="#fff" />
          </g>
          <g transform="translate(160 100)">
            <Pomo h={10} c="#fde68a" tapa="#d9a84e" />
          </g>
          <g transform="translate(169 100)">
            <Pote w={9} h={7} c="#e8a0b4" tapa="#d9a84e" />
          </g>
          <g transform="translate(179 100)">
            <Dosificador c="#fff" />
          </g>
          <g transform="translate(209 100)">
            <Pote w={8} h={5} c="#f5d0c5" tapa="#7a3152" />
          </g>
          <rect x="133" y="100" width="81" height="1.4" fill="#fff" opacity=".9" />
          <rect x="133" y="101.4" width="81" height=".5" fill="#d9a84e" />

          {/* columnas de los lados, con su filete dorado */}
          <rect x="77" y="64" width="5" height="82" fill={u('pa')} />
          <rect x="218" y="64" width="5" height="82" fill={u('pa')} />
          <rect x="81.4" y="64" width=".6" height="82" fill="#d9a84e" />
          <rect x="218" y="64" width=".6" height="82" fill="#d9a84e" />

          {/* el toldo de festón, rosa viejo y crema, con flecos dorados */}
          {Array.from({ length: 10 }, (_, i) => {
            const w = 158 / 10
            const x = 70 + w * i
            const c = i % 2 === 0 ? '#e8a0b4' : '#fffaf7'
            return (
              <g key={i}>
                <path d={`M${x + 1.6 - i * 0.32} 57H${x + w + 1.6 - (i + 1) * 0.32}L${x + w} 64.4H${x}Z`} fill={c} stroke="#e8a0b4" strokeWidth=".4" />
                <path d={`M${x} 64.4a${w / 2} ${w / 3.6} 0 0 0 ${w} 0Z`} fill={c} stroke="#e8a0b4" strokeWidth=".4" />
                <circle cx={x + w / 2} cy={64.4 + w / 3.6 + 0.8} r=".8" fill="#d9a84e" />
              </g>
            )
          })}
          <rect x="70" y="64" width="158" height=".8" fill="#7a3152" opacity=".12" />

          {/* el letrero ciruela con letras doradas */}
          <rect x="76" y="31" width="90" height="19" rx="9.5" fill={u('le')} />
          <rect x="78" y="33" width="86" height="15" rx="7.5" fill="none" stroke="#e8c27a" strokeWidth=".7" />
          <rect x="84" y="32" width="58" height="1.2" rx=".6" fill="#fff" opacity=".18" />
          <text x="121" y="44" textAnchor="middle" fontSize="9.6" fontWeight="800" fill="#f6d58e" textLength="68" lengthAdjust="spacing">
            COSMÉTICOS
          </text>
          <path d="M82 40.5L83.4 39.1L84.8 40.5L83.4 41.9ZM157.2 40.5L158.6 39.1L160 40.5L158.6 41.9Z" fill="#e8c27a" />
          {[100, 142].map((x) => (
            <rect key={x} x={x} y="50" width="1.6" height="2.4" fill="#a8762a" />
          ))}
          <g transform="translate(79 34)">
            <path className="esc-cos-destello" d={BRILLITO} fill="#fff6d6" />
          </g>
          <g transform="translate(163 47)">
            <path className="esc-cos-destello" d={BRILLITO} fill="#fff6d6" style={{ animationDelay: '-1.6s' }} />
          </g>

          {/* ---------- el mostrador de vidrio ---------- */}
          <rect x="84" y="115" width="138" height="31" fill={u('vi')} />
          {/* la fila de labiales; dos se asoman y se esconden */}
          {Array.from({ length: 17 }, (_, i) => {
            const x = 91 + i * 7.6
            const c = TONOS_LABIAL[i % TONOS_LABIAL.length]
            const tapado = i % 5 === 4
            const anima = i === 3 || i === 11
            return (
              <g key={i} transform={`translate(${x} 128.6)`}>
                <g className={anima ? 'esc-cos-labial' : undefined} style={anima && i === 11 ? { animationDelay: '-2.2s' } : undefined}>
                  <path d="M-1.1-4V-9.2L1.1-10.8V-4Z" fill={c} />
                  <path d="M-1.1-9.2L-.3-9.8V-4H-1.1Z" fill="#fff" opacity=".35" />
                </g>
                <rect x="-1.25" y="-6.6" width="2.5" height="1.8" fill="#f0d08a" />
                <rect x="-1.6" y="-5" width="3.2" height="5" rx=".4" fill={u('oro')} />
                <rect x="-1.6" y="-3" width="3.2" height=".5" fill="#7a3152" opacity=".5" />
                {tapado && (
                  <g>
                    <rect x="-1.7" y="-11.4" width="3.4" height="6.6" rx=".5" fill="#4a1c33" />
                    <rect x="-1.7" y="-6.4" width="3.4" height=".7" fill="#d9a84e" />
                  </g>
                )}
              </g>
            )
          })}
          <rect x="84" y="129" width="138" height="1.4" fill="#fff" />
          <rect x="84" y="130.4" width="138" height=".5" fill="#d9a84e" opacity=".7" />
          {/* las paletas de sombras abiertas y el rubor */}
          {PALETAS.map((p, k) => {
            const x = 90 + k * 30
            return (
              <g key={k}>
                <rect x={x} y="131.6" width="26" height="4.2" rx=".8" fill={u('es')} stroke="#3f2430" strokeWidth=".5" />
                <rect x={x} y="136" width="26" height="7" rx=".9" fill="#3f2430" />
                {p.map((c, j) => (
                  <rect key={j} x={x + 1.2 + (j % 5) * 4.8} y={137 + Math.floor(j / 5) * 3} width="4" height="2.5" rx=".5" fill={c} />
                ))}
                <rect x={x + 1.2} y="137" width="23.6" height=".5" fill="#fff" opacity=".35" />
              </g>
            )
          })}
          <circle cx="214" cy="139" r="4.4" fill="#3f2430" />
          <circle cx="214" cy="139" r="3.4" fill="#f4a3a8" />
          <path d="M212 137.4Q214 136.4 216 137.4" stroke="#fff" strokeWidth=".5" fill="none" opacity=".6" />
          {/* el vidrio del frente: reflejos fijos y el brillo que lo cruza */}
          <path d="M84 115H104L92 146H84Z" fill="#fff" opacity=".3" />
          <path d="M110 115H115L103 146H98Z" fill="#fff" opacity=".2" />
          <g clipPath={`url(#${g('cm')})`}>
            <g transform="translate(70 115)">
              <g className="esc-cos-vidrio" style={v({ '--d': '170px' })}>
                <path d="M0 0H10L-2 29H-12Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          {/* marco dorado, la base ciruela y la tapa de vidrio */}
          <rect x="84" y="115" width="138" height="31" fill="none" stroke="#d9a84e" strokeWidth="1" />
          <rect x="84" y="143.6" width="138" height="2.4" fill="#4a1c33" />
          <rect x="82.6" y="111.6" width="140.8" height="3.6" rx="1" fill="#fff" opacity=".9" />
          <rect x="82.6" y="114.4" width="140.8" height=".9" fill="#d9a84e" />
          <rect x="82.6" y="111.6" width="140.8" height=".6" rx=".3" fill="#d9a84e" opacity=".6" />

          {/* la bandeja de probadores y el vasito de tiras */}
          <ellipse cx="106" cy="111.8" rx="15" ry="1.9" fill={u('oro')} />
          <ellipse cx="106" cy="111.4" rx="13.6" ry="1.3" fill="#fff6ea" />
          <g transform="translate(98.6 111.4)">
            <circle cx="0" cy="-3.8" r="3.6" fill={u('vl')} />
            <circle cx="0" cy="-3" r="2.6" fill={u('li')} opacity=".8" />
            <circle cx="-1.3" cy="-5" r=".9" fill="#fff" opacity=".7" />
            <rect x="-.9" y="-9" width="1.8" height="1.8" fill="#d9a84e" />
            <circle cx="0" cy="-10" r="1.5" fill="#3f2430" />
          </g>
          <g transform="translate(106 111.4)">
            <path d="M-2 0V-10.4L-1.2-11.2H1.2L2-10.4V0Z" fill="#e9d5ff" />
            <rect x="-1.4" y="-7" width="2.8" height="6.4" fill="#a78bfa" opacity=".6" />
            <rect x="-1.6" y="-10" width=".6" height="9" fill="#fff" opacity=".6" />
            <rect x="-1.1" y="-14" width="2.2" height="2.8" rx=".4" fill={u('oro')} />
          </g>
          <g transform="translate(113.4 111.4)">
            <rect x="-3" y="-6.4" width="6" height="6.4" rx=".6" fill="#fde68a" opacity=".9" />
            <rect x="-2.2" y="-4.6" width="4.4" height="4" rx=".4" fill="#f0b467" opacity=".7" />
            <rect x="-2.4" y="-5.8" width=".7" height="5.2" fill="#fff" opacity=".6" />
            <rect x="-1.6" y="-9.6" width="3.2" height="3.2" rx=".4" fill="#27272a" />
          </g>
          <g transform="translate(127.4 111.6)">
            <path d="M-.6-6L-2.6-14.6L-1.6-14.8L.2-6ZM.2-6L.6-15.4H1.6L1-6ZM.8-6L3.4-13.8L4.2-13.4L1.6-6Z" fill="#fff" stroke="#e8d3cc" strokeWidth=".25" />
            <path d="M-3-7H3.6L3 0H-2.4Z" fill="#fff" />
            <rect x="-2.9" y="-4.2" width="6.4" height="1" fill="#d9a84e" />
          </g>

          {/* el QR de cobro */}
          <rect x="211" y="109.2" width="8" height="2.6" rx="1" fill="#7a3152" />
          <rect x="209" y="97" width="12" height="12.6" rx="1.6" fill="#fff" />
          <path d="M210.8 98.8h3.3v3.3h-3.3zM215.6 98.8h3.3v3.3h-3.3zM210.8 103.6h3.3v3.3h-3.3zM216 104h1.2v1.2h-1.2zM217.6 105.6h1.2v1.2h-1.2zM216 106.2h1.2v.7h-1.2z" fill="#4a1c33" />

          {/* ---------- la torre de esmaltes con el labial gigante (izquierda) ---------- */}
          <ellipse cx="32" cy="145" rx="13" ry="2.4" fill="#4a1c33" />
          <ellipse cx="32" cy="144.2" rx="11" ry="1.6" fill="#7a3152" />
          <rect x="31" y="96" width="2" height="48" fill={u('oro')} />
          {TORRE.map(([y, rx, cs]) => {
            const n = cs.length
            const xs = n === 4 ? [-9, -5.4, 5.4, 9] : cs.map((_, i) => -rx + 2.6 + (i * (2 * rx - 5.2)) / (n - 1))
            return (
              <g key={y}>
                <ellipse cx="32" cy={y} rx={rx} ry="2.4" fill="#fdf2ee" />
                {cs.map((c, i) => (
                  <g key={i} transform={`translate(${32 + xs[i]} ${y + 0.6})`}>
                    <Esmalte c={c} tapa={i % 3 === 0 ? '#d9a84e' : '#27272a'} />
                  </g>
                ))}
                <path d={`M${32 - rx} ${y}A${rx} 2.4 0 0 0 ${32 + rx} ${y}V${y + 1.6}A${rx} 2.4 0 0 1 ${32 - rx} ${y + 1.6}Z`} fill={u('oro')} />
              </g>
            )
          })}
          {/* el labial gigante de exhibición */}
          <g transform="translate(32 99)">
            <path d="M-3.2-13V-26L3.2-30.4V-13Z" fill="#c2185b" />
            <path d="M-3.2-26L-1.6-27.1V-13H-3.2Z" fill="#fff" opacity=".35" />
            <rect x="-3.8" y="-14.6" width="7.6" height="3" fill="#f0d08a" />
            <rect x="-4.4" y="-12" width="8.8" height="11.6" rx="1" fill={u('oro')} />
            <rect x="-4.4" y="-7" width="8.8" height="1" fill="#7a3152" opacity=".5" />
            <rect x="-3.6" y="-11.4" width="1.2" height="10.4" rx=".6" fill="#fff" opacity=".45" />
          </g>
          <g transform="translate(38 70)">
            <path className="esc-cos-destello" d={BRILLITO} fill="#fff" style={{ animationDelay: '-.8s' }} />
          </g>

          {/* ---------- cajas, perfume de exhibición y rosas (derecha) ---------- */}
          <g transform="translate(241 146)">
            <rect x="-9" y="-14" width="18" height="14" fill="#f9c8d2" />
            <rect x="-9" y="-14" width="18" height="2" fill="#4a1c33" />
            <rect x="-9" y="-7.6" width="18" height="1.2" fill="#d9a84e" />
            <rect x="5" y="-14" width="4" height="14" fill="#7a3152" opacity=".12" />
            <rect x="-6.4" y="-26" width="12.8" height="12" fill="#4a1c33" />
            <rect x="-6.4" y="-21" width="12.8" height="1.2" fill="#d9a84e" />
            <circle cx="0" cy="-17.4" r="1.6" fill="none" stroke="#d9a84e" strokeWidth=".5" />
            <rect x="3.4" y="-26" width="3" height="12" fill="#000" opacity=".15" />
          </g>
          <g transform="translate(265 146)">
            {/* el frasco grande: cuerpo facetado, líquido ámbar y tapa-esfera */}
            <path d="M-11 0C-12.2 0-13-.8-13-2V-17L-9-22H9L13-17V-2C13-.8 12.2 0 11 0Z" fill={u('vl')} opacity=".95" />
            <path d="M-12-2V-15H12V-2C12-1.4 11.4-.9 10.8-.9H-10.8C-11.4-.9-12-1.4-12-2Z" fill={u('ga')} />
            <path d="M-12-15H12" stroke="#fff" strokeWidth=".6" opacity=".7" />
            <path d="M-12-3V-16.6L-9-20.6V-4Z" fill="#fff" opacity=".4" />
            <path d="M12-3V-16.6L9-20.6V-4Z" fill="#7a3152" opacity=".1" />
            <ellipse cx="0" cy="-8.4" rx="4.6" ry="3" fill="#fff6e6" stroke="#d9a84e" strokeWidth=".5" />
            <rect x="-3" y="-25.4" width="6" height="3.6" fill={u('oro')} />
            <circle cx="0" cy="-30.6" r="5.6" fill={u('tp')} />
            <circle cx="-1.8" cy="-32.4" r="1.6" fill="#fff" opacity=".55" />
          </g>
          <g transform="translate(257 120)">
            <path className="esc-cos-destello" d={BRILLITO} fill="#fff" style={{ animationDelay: '-2.4s' }} />
          </g>
          <g transform="translate(283.6 144)">
            <g className="esc-planta">
              <path d="M0-8C-1-13-3-16-4.2-20M0-8C.4-13 .2-17 .8-22M0-8C1.2-12 3.6-15 4.6-18.6" fill="none" stroke="#4d7c4f" strokeWidth=".7" />
              <path d="M-2.4-14C-5-15-5.6-12.6-3.4-12.4ZM2.4-12.6C5-13.6 5.4-11 3.2-11Z" fill="#6b9b5e" />
              {(
                [
                  [-4.2, -21.6, '#f9a8c0'],
                  [0.8, -23.8, '#e8798f'],
                  [4.6, -20.2, '#fbcfe8'],
                ] as const
              ).map(([x, y, c]) => (
                <g key={x}>
                  <circle cx={x} cy={y} r="2.6" fill={c} />
                  <path d={`M${x - 1.2} ${y}a1.2 1.2 0 1 1 2.4 0a.7.7 0 1 1-1.4 0`} fill="none" stroke="#be185d" strokeWidth=".4" opacity=".55" />
                </g>
              ))}
            </g>
            <path d="M-3.4-8.4H3.4L3 0H-3Z" fill="#e0f2fe" opacity=".75" />
            <rect x="-3" y="-4" width="6" height="3.6" fill="#bae6fd" opacity=".5" />
            <rect x="-2.6" y="-8" width=".7" height="7.4" fill="#fff" opacity=".8" />
          </g>
        </g>

        {/* ---------- la historia: el perfume se prueba y va a la bolsita ---------- */}
        <g className="esc-cos-flota">
          {/* la bolsa: el fondo, la manija de atrás y el papel seda */}
          <g className="esc-cos-bolsa">
            <path d="M190 91.4C190 84.6 202 84.6 202 91.4" fill="none" stroke="#b9617a" strokeWidth=".8" />
            <rect x="187" y="90.6" width="18" height="2" fill="#c97b90" />
            <path d="M187.6 92.4L190.4 85.4L194 90L197.6 84.2L201.2 89.6L204.4 85.8L204.8 92.4Z" fill="#fff" />
            <path d="M190.4 85.4L192 91M197.6 84.2L198.6 91" stroke="#f3d6dd" strokeWidth=".4" />
          </g>

          {/* el perfume estrella (x en una capa, y en otra) */}
          <g transform="translate(148 112)">
            <g className="esc-cos-x">
              <g className="esc-cos-y">
                <ellipse cx="0" cy="0" rx="8" ry=".9" fill="#5b2a3a" opacity=".18" />
                {/* el atomizador, que se aprieta */}
                <g className="esc-cos-boton">
                  <rect x="-2.2" y="-20.6" width="4.4" height="3.4" rx=".6" fill={u('oro')} />
                  <ellipse cx="-2.2" cy="-19.2" rx=".35" ry=".5" fill="#4a1c33" />
                </g>
                <rect x="-1.9" y="-18" width="3.8" height="3" fill={u('oro')} />
                <rect x="-2.7" y="-15.6" width="5.4" height="1.2" rx=".4" fill="#a8762a" />
                {/* el frasco facetado, con el líquido rosa */}
                <path d="M-7.4 0C-8.2 0-8.6-.6-8.6-1.4V-11.6L-6.4-14.6H6.4L8.6-11.6V-1.4C8.6-.6 8.2 0 7.4 0Z" fill={u('vl')} />
                <path d="M-7.6-1.2V-9.6H7.6V-1.2C7.6-.9 7.3-.8 7-.8H-7C-7.3-.8-7.6-.9-7.6-1.2Z" fill={u('li')} />
                <path d="M-7.6-9.6H7.6" stroke="#ffe4ec" strokeWidth=".5" />
                <path d="M-7.6-2.4V-11.2L-5.8-13.6V-3.4Z" fill="#fff" opacity=".5" />
                <path d="M7.6-2.4V-11.2L5.8-13.6V-3.4Z" fill="#7a3152" opacity=".14" />
                <path d="M-6.4-14.6H6.4L5.4-13.4H-5.4Z" fill="#fff" opacity=".6" />
                <ellipse cx="0" cy="-5.6" rx="2.8" ry="1.9" fill="#fff6ea" stroke="#d9a84e" strokeWidth=".45" />
                <path d={corazon(0, -5.6, 0.18)} fill="#d9466f" />
                {/* la tapa de cristal: sale, espera al costado y vuelve */}
                <g className="esc-cos-tapa">
                  <path d="M-4-18.6H4L4.8-23.6L2.6-28.4H-2.6L-4.8-23.6Z" fill={u('tp')} />
                  <path d="M-4.8-23.6H4.8M-2.6-28.4L-1.4-23.6L0-18.6M2.6-28.4L1.4-23.6" stroke="#fff" strokeWidth=".35" fill="none" opacity=".7" />
                  <path d="M-4-18.6L-4.8-23.6L-2.6-28.4L-1.4-23.6Z" fill="#fff" opacity=".35" />
                  <rect x="-4" y="-19.4" width="8" height=".8" fill="#a8762a" />
                </g>
              </g>
            </g>
          </g>

          {/* el frente de la bolsa (rebota junto con el fondo) */}
          <g className="esc-cos-bolsa">
            <path d="M187.4 92.4L189.8 87.6L192.6 92.4Z" fill="#fdf2f4" />
            <path d="M186 92H206L207.2 112H184.8Z" fill={u('bo')} />
            <path d="M186 92H206L206.1 93.6H185.9Z" fill="#b9617a" opacity=".3" />
            <path d="M184.8 112L186 92H188.6L187.8 112Z" fill="#fff" opacity=".3" />
            <path d="M203 92L204.4 112" stroke="#b9617a" strokeWidth=".4" opacity=".4" />
            <circle cx="196" cy="102" r="3.6" fill="#fff4f6" stroke="#d9a84e" strokeWidth=".6" />
            <path d={corazon(196, 102, 0.24)} fill="#d9466f" />
            <path d="M190.4 92.8C190.4 86.4 201.6 86.4 201.6 92.8" fill="none" stroke="#d9a84e" strokeWidth=".9" />
          </g>

          {/* la nube de brillitos del atomizador (tres disparos) y las ondas del aroma */}
          <g transform="translate(145.7 92.8)">
            {['0s', '-6.11s', '-5.72s'].map((d) => (
              <g key={d}>
                <ellipse className="esc-cos-niebla" cx="-9" cy="-5" rx="11" ry="7" fill={u('ni')} style={{ animationDelay: d }} />
                {BRILLITOS.map(([dx, dy, e, c, estrella]) => (
                  <g key={`${dx}${dy}`} className="esc-cos-brillito" style={v({ animationDelay: d, '--dx': dx, '--dy': dy })}>
                    {estrella ? (
                      <path d={BRILLITO} transform={`scale(${e})`} style={origen0} fill={c} stroke={c === '#ffffff' ? '#e8a0b4' : 'none'} strokeWidth=".3" />
                    ) : (
                      <circle r={e} fill={c} stroke={c === '#ffffff' ? '#e8a0b4' : 'none'} strokeWidth=".3" />
                    )}
                  </g>
                ))}
              </g>
            ))}
            {(
              [
                [-10, '0s'],
                [-16, '-.25s'],
                [-22, '-.5s'],
              ] as const
            ).map(([x, d]) => (
              <path
                key={x}
                className="esc-cos-onda"
                d={`M${x} -6C${x - 2} -8 ${x + 2} -10 ${x} -12C${x - 2} -14 ${x + 2} -16 ${x} -18`}
                fill="none"
                stroke="#e8798f"
                strokeWidth=".7"
                strokeLinecap="round"
                style={{ animationDelay: d }}
              />
            ))}
          </g>

          {/* la venta: aro y destellos sobre la bolsa */}
          <ellipse className="esc-cos-aro" cx="196" cy="112" rx="14" ry="3.4" fill="none" stroke="#d9466f" strokeWidth="1.3" />
          <g transform="translate(181 84)">
            <path className="esc-cos-chispa" d={ESTRELLA} fill="#f5b942" />
          </g>
          <g transform="translate(210 80)">
            <path className="esc-cos-chispa" d={ESTRELLA} fill="#f9a8c0" style={{ animationDelay: '-6.35s' }} />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Perfume" texto="Bs 180" tono="rosa" />
    </Marco>
  )
}
