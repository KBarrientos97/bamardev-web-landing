import './EscenasBelleza.css'
import { useId, type CSSProperties } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas del rubro Belleza (Spa y Uñas). Mismo método que
  Escenas.tsx: SVG propio, sólo transform y opacity, keyframes `esc-belleza-*`
  en EscenasBelleza.css y los compartidos `esc-*` de index.css.

  Las dos comparten el ciclo maestro de 6,5 s del aviso (`esc-chip` de index.css):
  el aviso llega al ~10 % del ciclo y la acción empieza justo después, así la
  notificación se lee como la causa de lo que pasa en la escena.

  OJO con los giros: la regla global `.escena svg *` pone transform-origin al
  centro de cada caja, y eso también afecta a un `transform="rotate()"` puesto
  como atributo. Por eso todo está dibujado en coordenadas absolutas y los
  giros fijos se hacen con `girar()` (pivote explícito en el viewBox).
*/

/** Giro fijo sobre un pivote del viewBox (no depende de la caja del elemento). */
const girar = (grados: number, x: number, y: number): CSSProperties => ({
  transform: `rotate(${grados}deg)`,
  transformBox: 'view-box',
  transformOrigin: `${x}px ${y}px`,
})

/** Pétalo puntiagudo apuntando hacia arriba desde la base (bx, by). */
const petaloPath = (bx: number, by: number, largo: number, ancho: number) =>
  `M${bx} ${by}C${bx - ancho} ${by - largo * 0.28} ${bx - ancho * 0.7} ${by - largo * 0.78} ${bx} ${by - largo}` +
  `C${bx + ancho * 0.7} ${by - largo * 0.78} ${bx + ancho} ${by - largo * 0.28} ${bx} ${by}Z`

/** Destello de cuatro puntas centrado en (x, y). */
function Chispa({ x, y, s = 1, retraso, color = '#fff' }: { x: number; y: number; s?: number; retraso: number; color?: string }) {
  const r = 6 * s
  const c = 1.6 * s
  return (
    <path
      className="esc-belleza-chispa"
      d={`M${x} ${y - r}L${x + c} ${y - c}L${x + r} ${y}L${x + c} ${y + c}L${x} ${y + r}L${x - c} ${y + c}L${x - r} ${y}L${x - c} ${y - c}Z`}
      fill={color}
      style={{ animationDelay: `${retraso}s` }}
    />
  )
}

/** Plataforma común de las dos escenas: losa elíptica con canto y sombra de contacto difusa. */
function Plataforma({ g, sombra }: { g: (n: string) => string; sombra: string }) {
  return (
    <>
      <ellipse cx="150" cy="154" rx="136" ry="7" fill={sombra} opacity=".1" />
      <path d="M22 144v4a128 9 0 0 0 256 0v-4Z" fill={`url(#${g('ls')})`} />
      <ellipse cx="150" cy="144" rx="128" ry="9" fill={`url(#${g('lt')})`} />
      <path d="M30 142.4A128 9 0 0 1 270 142.4" stroke="#fff" strokeWidth=".9" fill="none" opacity=".6" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  SPA                                                                */
/* ------------------------------------------------------------------ */

/** Un loto que se abre sobre una fuente de piedra: pila de piedras a un lado, vela al otro, vapor en el centro. */
export function EscenaSpa() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  // Pivote de los pétalos: la base de la flor, en el centro del agua.
  const PX = 150
  const PY = 118
  const petalo = (ang: number, largo: number, ancho: number, relleno: string, lag: number) => (
    <path
      key={`${relleno}${ang}`}
      className="esc-belleza-petalo"
      d={petaloPath(PX, PY, largo, ancho)}
      fill={`url(#${g(relleno)})`}
      style={{
        ...v({ '--a': `${ang}deg`, animationDelay: `${-0.2 + lag}s` }),
        transformBox: 'view-box',
        transformOrigin: `${PX}px ${PY}px`,
      }}
    />
  )
  // Los pétalos del centro abren primero y los de los lados los siguen.
  const lagAtras = (a: number) => (Math.abs(a) / 66) * 0.14
  const lagFrente = (a: number) => 0.05 + (Math.abs(a) / 48) * 0.08
  return (
    <Marco fondo="bg-gradient-to-b from-teal-100 via-emerald-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('lt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6f3ea" />
            <stop offset="1" stopColor="#dfe6dd" />
          </linearGradient>
          <linearGradient id={g('ls')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c8d3c9" />
            <stop offset="1" stopColor="#aebdb3" />
          </linearGradient>
          <linearGradient id={g('cu')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e4dfd1" />
            <stop offset=".4" stopColor="#f6f3ea" />
            <stop offset="1" stopColor="#b6ae9c" />
          </linearGradient>
          <linearGradient id={g('cs')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5c5443" stopOpacity="0" />
            <stop offset="1" stopColor="#5c5443" stopOpacity=".22" />
          </linearGradient>
          <linearGradient id={g('ri')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fdfcf7" />
            <stop offset=".6" stopColor="#ece7d9" />
            <stop offset="1" stopColor="#d3ccb9" />
          </linearGradient>
          <linearGradient id={g('ag')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4fbdb1" />
            <stop offset="1" stopColor="#a6ece1" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#fbeef5" />
            <stop offset="1" stopColor="#e872ab" />
          </linearGradient>
          <linearGradient id={g('pf')} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f59cc6" />
          </linearGradient>
          <radialGradient id={g('ce')}>
            <stop offset="0" stopColor="#fff3a8" />
            <stop offset="1" stopColor="#f5b52c" />
          </radialGradient>
          <radialGradient id={g('gl')}>
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('p1')} cx=".35" cy=".28" r=".85">
            <stop offset="0" stopColor="#d6dedb" />
            <stop offset="1" stopColor="#85969a" />
          </radialGradient>
          <radialGradient id={g('p2')} cx=".35" cy=".28" r=".85">
            <stop offset="0" stopColor="#ece1d3" />
            <stop offset="1" stopColor="#ae9d89" />
          </radialGradient>
          <radialGradient id={g('p3')} cx=".35" cy=".28" r=".85">
            <stop offset="0" stopColor="#e1ece7" />
            <stop offset="1" stopColor="#97b3aa" />
          </radialGradient>
          <linearGradient id={g('ja')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f8efdf" />
            <stop offset=".55" stopColor="#e6d8c0" />
            <stop offset="1" stopColor="#bfae92" />
          </linearGradient>
          <linearGradient id={g('fl')} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffb13b" />
            <stop offset="1" stopColor="#ffe28a" />
          </linearGradient>
          <radialGradient id={g('ha')}>
            <stop offset="0" stopColor="#ffe9a8" stopOpacity=".8" />
            <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <Plataforma g={g} sombra="#0b4f4a" />

        {/* sombras de contacto de los tres objetos */}
        <ellipse cx="150" cy="146" rx="56" ry="5.4" fill="#0b4f4a" opacity=".16" />
        <ellipse cx="47" cy="147" rx="24" ry="4" fill="#0b4f4a" opacity=".16" />
        <ellipse cx="256" cy="146" rx="17" ry="3.2" fill="#0b4f4a" opacity=".16" />

        {/* pila de piedras: objeto secundario, tonos más apagados */}
        <g className="esc-belleza-piedras">
          <ellipse cx="46" cy="141.5" rx="21" ry="8.5" fill={`url(#${g('p1')})`} />
          <ellipse cx="40" cy="138.6" rx="7" ry="1.7" fill="#fff" opacity=".26" />
          <ellipse cx="48" cy="136" rx="14" ry="3" fill="#2a3a3a" opacity=".16" />
          <ellipse cx="47" cy="131" rx="15" ry="6.8" fill={`url(#${g('p2')})`} />
          <ellipse cx="41.5" cy="128.6" rx="5.4" ry="1.5" fill="#fff" opacity=".28" />
          <ellipse cx="48" cy="126" rx="9.5" ry="2.4" fill="#2a3a3a" opacity=".16" />
          <ellipse cx="46.5" cy="122.4" rx="10" ry="5" fill={`url(#${g('p3')})`} />
          <ellipse cx="43" cy="120.6" rx="3.6" ry="1.1" fill="#fff" opacity=".3" />
        </g>

        {/* fuente: pie, cuerpo de piedra y borde */}
        <ellipse cx="150" cy="143" rx="34" ry="5" fill="#a39b87" />
        <path d="M80 116C80 132 108 140 126 141.6A24 4 0 0 0 174 141.6C192 140 220 132 220 116Z" fill={`url(#${g('cu')})`} />
        <path d="M80 116C80 132 108 140 126 141.6A24 4 0 0 0 174 141.6C192 140 220 132 220 116Z" fill={`url(#${g('cs')})`} />
        <path d="M81.4 125C88 133 112 139.4 150 139.4S212 133 218.6 125" stroke="#fff" strokeWidth="1" fill="none" opacity=".3" />
        <ellipse cx="150" cy="116" rx="71" ry="13.5" fill={`url(#${g('ri')})`} />
        <ellipse cx="150" cy="116.4" rx="64" ry="11.4" fill="#b5ad99" />
        <ellipse cx="150" cy="118" rx="62.5" ry="9.6" fill={`url(#${g('ag')})`} />
        <path d="M84 112.6A71 13.5 0 0 1 130 103.2" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity=".7" />

        {/* reflejo que se desliza por el agua */}
        <ellipse className="esc-belleza-reflejo" cx="116" cy="114.2" rx="13" ry="1.4" fill="#fff" />

        {/* ondas que nacen bajo la flor: dos por ciclo, una al abrir y otra al cerrar */}
        {[0, -1.625].map((d, i) => (
          <ellipse
            key={i}
            className="esc-belleza-onda"
            cx="150"
            cy="119"
            rx="22"
            ry="3.7"
            fill="none"
            stroke="#fff"
            strokeWidth="1.1"
            style={{ animationDelay: `${d}s` }}
          />
        ))}

        {/* dos hojas de nenúfar */}
        <g className="esc-belleza-nenufar" style={{ animationDelay: '-1s' }}>
          <ellipse cx="102" cy="122.6" rx="9" ry="2.5" fill="#2f9c78" />
          <ellipse cx="102" cy="122" rx="8.2" ry="2" fill="#6cd2a3" />
        </g>
        <g className="esc-belleza-nenufar" style={{ animationDelay: '-3.2s' }}>
          <ellipse cx="197" cy="120.6" rx="7.6" ry="2.2" fill="#2f9c78" />
          <ellipse cx="197" cy="120" rx="6.9" ry="1.8" fill="#6cd2a3" />
        </g>

        {/* resplandor detrás de la flor: se enciende al abrirse */}
        <circle className="esc-belleza-brillo" cx="150" cy="99" r="46" fill={`url(#${g('gl')})`} />

        {/* la flor de loto flota apenas sobre el agua */}
        <g className="esc-belleza-flota">
          <ellipse cx="150" cy="119.4" rx="16" ry="3.2" fill="#0b6b63" opacity=".22" />
          {[-66, -33, 0, 33, 66].map((a) => petalo(a, 40, 12.5, 'pa', lagAtras(a)))}
          {[-48, -16, 16, 48].map((a) => petalo(a, 31, 11, 'pf', lagFrente(a)))}
          <ellipse className="esc-belleza-centro" cx="150" cy="108.6" rx="5.4" ry="5" fill={`url(#${g('ce')})`} style={{ animationDelay: '-0.2s' }} />
        </g>

        {/* vapor del agua tibia: hilos que suben y se disuelven */}
        {[
          { x: 106, y: 108, dx: -5, d: 0 },
          { x: 194, y: 107, dx: 6, d: -1.1 },
          { x: 128, y: 104, dx: -3, d: -2.2 },
        ].map((h, i) => (
          <path
            key={i}
            className="esc-belleza-vapor"
            d={`M${h.x} ${h.y}c4-5-4-9 0-14s4-9 0-14`}
            fill="none"
            stroke="#7ec8bd"
            strokeWidth="2.3"
            strokeLinecap="round"
            style={v({ '--dx': `${h.dx}px`, animationDelay: `${h.d}s` })}
          />
        ))}

        {/* vela en un frasco de cerámica: halo que late y llama que parpadea */}
        <circle className="esc-belleza-halo" cx="256" cy="115" r="27" fill={`url(#${g('ha')})`} />
        <path d="M243 128H269V138Q269 144 263 144H249Q243 144 243 138Z" fill={`url(#${g('ja')})`} />
        <rect x="245.4" y="131" width="2.8" height="9" rx="1.4" fill="#fff" opacity=".4" />
        <ellipse cx="256" cy="128" rx="13" ry="3.3" fill="#efe4d0" />
        <ellipse cx="256" cy="128.3" rx="10.6" ry="2.5" fill="#fff6e4" />
        <rect x="255.4" y="121.6" width="1.2" height="6.6" rx=".6" fill="#5a4638" />
        <g className="esc-belleza-llama">
          <path d="M256 122.4C251.6 119 252.4 113 256 106.4C259.6 113 260.4 119 256 122.4Z" fill={`url(#${g('fl')})`} />
          <path d="M256 121.8C254.2 120 254.4 116.8 256 113.8C257.6 116.8 257.8 120 256 121.8Z" fill="#fffbe0" />
        </g>
      </svg>
      <Aviso etiqueta="Reserva" texto="Hoy 5:00 pm · Ana" tono="verde" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  UÑAS                                                               */
/* ------------------------------------------------------------------ */

/** Contorno de una uña: punta redondeada arriba y cutícula casi recta abajo. */
const unaPath = (cx: number, top: number, w: number, h: number) => {
  const r = w / 2
  const b = top + h
  return `M${cx - r} ${top + r}A${r} ${r} 0 0 1 ${cx + r} ${top + r}V${b - 3}Q${cx + r} ${b} ${cx + r - 3} ${b}H${cx - r + 3}Q${cx - r} ${b} ${cx - r} ${b - 3}Z`
}

/** Dedo con la punta redondeada; baja hasta `base` para quedar metido en la palma. */
const dedoPath = (cx: number, w: number, punta: number, base: number) => {
  const r = w / 2
  return `M${cx - r} ${base}V${punta + r}A${r} ${r} 0 0 1 ${cx + r} ${punta + r}V${base}Z`
}

// Dedos de la mano derecha vistos por el dorso, con el pulgar a la izquierda.
const DEDOS = [
  { c: 154, w: 16.5, punta: 42, nh: 16 }, // índice
  { c: 170.5, w: 16.5, punta: 34, nh: 17 }, // medio
  { c: 187, w: 16.5, punta: 40, nh: 17 }, // anular: el que se esmalta
  { c: 202, w: 13.5, punta: 54, nh: 13.5 }, // meñique
]
// Uña que se pinta (anular): el esmalte crece desde la cutícula (y = 60) hasta la punta (y = 43).
const AC = DEDOS[2].c
const A_TOP = DEDOS[2].punta + 3
const A_ALTO = DEDOS[2].nh
const A_BASE = A_TOP + A_ALTO

/** Una mano apoyada sobre un cojín: el pincel esmalta una uña de la cutícula a la punta, brilla y el frasco responde. */
export function EscenaUnas() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  return (
    <Marco fondo="bg-gradient-to-b from-fuchsia-100 via-pink-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <clipPath id={g('cl')}>
            <path d={unaPath(AC, A_TOP, 11, A_ALTO)} />
          </clipPath>
          <clipPath id={g('fb')}>
            <rect x="52" y="106" width="36" height="38" rx="11" />
          </clipPath>
          <linearGradient id={g('lt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8eef8" />
            <stop offset="1" stopColor="#eadbef" />
          </linearGradient>
          <linearGradient id={g('ls')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9c4e4" />
            <stop offset="1" stopColor="#c6aad8" />
          </linearGradient>
          {/* un solo degradé de piel para toda la mano: así no hay costuras entre dedos y palma */}
          <linearGradient id={g('sk')} gradientUnits="userSpaceOnUse" x1="116" y1="0" x2="214" y2="0">
            <stop offset="0" stopColor="#fcdcc4" />
            <stop offset=".55" stopColor="#f5c3a0" />
            <stop offset="1" stopColor="#e1a67f" />
          </linearGradient>
          {/* volumen del dedo: luz a la izquierda, sombra a la derecha */}
          <linearGradient id={g('vo')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity=".26" />
            <stop offset=".45" stopColor="#fff" stopOpacity="0" />
            <stop offset=".55" stopColor="#a85a30" stopOpacity="0" />
            <stop offset="1" stopColor="#a85a30" stopOpacity=".2" />
          </linearGradient>
          {/* el volumen de los dedos se diluye hacia los nudillos, sin corte seco */}
          <linearGradient id={g('df')} gradientUnits="userSpaceOnUse" x1="0" y1="62" x2="0" y2="97">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id={g('mk')} maskUnits="userSpaceOnUse" x="140" y="30" width="76" height="70">
            <rect x="140" y="30" width="76" height="70" fill={`url(#${g('df')})`} />
          </mask>
          <linearGradient id={g('nb')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1ec" />
            <stop offset="1" stopColor="#f6cbc3" />
          </linearGradient>
          <linearGradient id={g('es')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff8cc4" />
            <stop offset="1" stopColor="#e63e8f" />
          </linearGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff93c8" />
            <stop offset="1" stopColor="#e23a8b" />
          </linearGradient>
          <linearGradient id={g('ne')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#52525f" />
            <stop offset=".5" stopColor="#2b2b36" />
            <stop offset="1" stopColor="#16161e" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5d5d6c" />
            <stop offset="1" stopColor="#1c1c26" />
          </linearGradient>
          <linearGradient id={g('pl')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8f8fc" />
            <stop offset="1" stopColor="#a4a6b8" />
          </linearGradient>
          <linearGradient id={g('cr')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff8cc4" />
            <stop offset="1" stopColor="#e63e8f" />
          </linearGradient>
          <linearGradient id={g('co')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0e6fb" />
            <stop offset=".55" stopColor="#d3c0f2" />
            <stop offset="1" stopColor="#a98fe0" />
          </linearGradient>
        </defs>

        <Plataforma g={g} sombra="#6b2a7a" />

        {/* sombras de contacto: cojín y frasco */}
        <ellipse cx="179" cy="148" rx="58" ry="5" fill="#5b2a6b" opacity=".16" />
        <ellipse cx="71" cy="147" rx="24" ry="4" fill="#5b2a6b" opacity=".16" />

        {/* frasco de esmalte: objeto secundario a la izquierda */}
        <rect x="58" y="70" width="24" height="29" rx="5.5" fill={`url(#${g('ne')})`} />
        <rect x="60.6" y="73" width="2.6" height="22" rx="1.3" fill="#fff" opacity=".28" />
        {[67, 70.6, 74.2, 77.8].map((x) => (
          <rect key={x} x={x + 1.2} y="73" width=".9" height="22" rx=".45" fill="#fff" opacity=".07" />
        ))}
        <rect x="62" y="98" width="16" height="9" rx="2" fill="#f4d5e4" />
        <rect x="62" y="100.6" width="16" height="1" fill="#fff" opacity=".5" />
        <rect x="62" y="103.4" width="16" height="1" fill="#fff" opacity=".5" />
        <rect x="52" y="106" width="36" height="38" rx="11" fill="#fbe4f0" />
        <g clipPath={`url(#${g('fb')})`}>
          <rect x="53.6" y="108" width="32.8" height="34.6" rx="9.4" fill={`url(#${g('bo')})`} />
          <rect x="76" y="108" width="12" height="36" fill="#7a0f45" opacity=".22" />
          <rect x="57" y="111" width="3.6" height="26" rx="1.8" fill="#fff" opacity=".4" />
          <rect x="59" y="122" width="24" height="12" rx="3" fill="#fff" opacity=".9" />
          <path d="M71 132.4C67.4 129.6 67.8 126.8 69.2 125.2L71 123 72.8 125.2C74.2 126.8 74.6 129.6 71 132.4Z" fill="#e23a8b" />
          {/* brillo que cruza el frasco cuando la uña termina */}
          <g style={girar(18, 70, 125)}>
            <rect className="esc-belleza-brillo-frasco" x="66" y="96" width="7" height="58" rx="3.5" fill="#fff" />
          </g>
        </g>

        {/* la mano flota apenas sobre el cojín; pincel, esmalte y destellos van con ella */}
        <g className="esc-belleza-flota">
          {/* pulgar */}
          <path d="M146.1 120.1L117.3 92.5A8.5 8.5 0 0 1 129.1 80.3L157.9 107.9Z" fill={`url(#${g('sk')})`} />
          <path d="M146.1 120.1L117.3 92.5A8.5 8.5 0 0 1 129.1 80.3" fill="none" stroke="#fff" strokeWidth="1" opacity=".3" strokeLinecap="round" />
          <path d={unaPath(129, 82, 9, 12)} fill={`url(#${g('nb')})`} style={girar(-46, 129, 88)} />
          {/* palma */}
          <path d="M145.75 92H208.75V100C208.75 108 205 118 199 130H157C150 118 145.75 108 145.75 100Z" fill={`url(#${g('sk')})`} />
          {/* dedos */}
          {DEDOS.map((d) => (
            <path key={d.c} d={dedoPath(d.c, d.w, d.punta, 100)} fill={`url(#${g('sk')})`} />
          ))}
          <g mask={`url(#${g('mk')})`}>
            {DEDOS.map((d) => (
              <path key={d.c} d={dedoPath(d.c, d.w, d.punta, 100)} fill={`url(#${g('vo')})`} />
            ))}
          </g>
          {/* separaciones y pliegues, muy sutiles */}
          <g stroke="#c98a63" strokeLinecap="round" fill="none">
            <path d="M162.25 50V96M178.75 48.5V96M195.25 61V96" strokeWidth="1" opacity=".5" />
            <path d="M150 88Q154 89.6 158 88M166.5 88Q170.5 89.6 174.5 88M183 88Q187 89.6 191 88M198.5 88Q202 89.6 205.5 88" strokeWidth=".8" opacity=".35" />
            <path d="M150 66Q154 67.6 158 66M166.5 60Q170.5 61.6 174.5 60M183 64Q187 65.6 191 64M198.5 72Q202 73.6 205.5 72" strokeWidth=".8" opacity=".3" />
            <path d="M149 110Q153 100 157 96" strokeWidth=".9" opacity=".3" />
          </g>

          {/* uñas al natural */}
          {[DEDOS[0], DEDOS[1], DEDOS[3]].map((d) => (
            <g key={d.c}>
              <path d={unaPath(d.c, d.punta + 3, d.w - 5.5, d.nh)} fill={`url(#${g('nb')})`} />
              <rect x={d.c - d.w / 2 + 3.6} y={d.punta + 6} width="1.8" height={d.nh - 8} rx=".9" fill="#fff" opacity=".5" />
            </g>
          ))}

          {/* uña que se esmalta */}
          <path d={unaPath(AC, A_TOP, 11, A_ALTO)} fill={`url(#${g('nb')})`} />
          <g clipPath={`url(#${g('cl')})`}>
            <g className="esc-belleza-esmalte" style={{ transformBox: 'view-box', transformOrigin: `${AC}px ${A_BASE}px` }}>
              <rect x={AC - 6} y={A_TOP} width="12" height={A_ALTO} fill={`url(#${g('es')})`} />
              <rect x={AC + 2.6} y={A_TOP} width="3.4" height={A_ALTO} fill="#7a0f45" opacity=".2" />
            </g>
            <rect className="esc-belleza-gloss" x={AC - 3.8} y={A_TOP + 3} width="1.8" height="9" rx=".9" fill="#fff" />
            {/* destello diagonal que cruza la uña ya pintada */}
            <g style={girar(18, AC, A_TOP + 8)}>
              <rect className="esc-belleza-destello" x={AC - 2} y={A_TOP - 6} width="3.6" height="30" rx="1.8" fill="#fff" />
            </g>
          </g>
          {/* cutícula sobre el borde del esmalte */}
          <path d={`M${AC - 6.4} ${A_BASE + 0.6}Q${AC} ${A_BASE - 5.6} ${AC + 6.4} ${A_BASE + 0.6}Q${AC} ${A_BASE + 3.4} ${AC - 6.4} ${A_BASE + 0.6}Z`} fill="#f2b995" />

          {/* destellos al terminar */}
          <Chispa x={AC + 8} y={A_TOP - 1} s={1} retraso={0} color="#ff8cc4" />
          <Chispa x={AC - 9} y={A_TOP + 9} s={0.65} retraso={0.22} color="#ffd6ea" />

          {/* pincel: entra, sube con el borde del esmalte y se retira */}
          <g className="esc-belleza-pincel">
            <g style={girar(-20, AC, A_BASE)}>
              <path d={`M${AC} ${A_BASE}C${AC + 3} ${A_BASE - 3.5} ${AC + 8} ${A_BASE - 4.2} ${AC + 12} ${A_BASE - 4}V${A_BASE + 4}C${AC + 8} ${A_BASE + 4.2} ${AC + 3} ${A_BASE + 3.5} ${AC} ${A_BASE}Z`} fill={`url(#${g('cr')})`} />
              <rect x={AC + 12} y={A_BASE - 3.7} width="11" height="7.4" rx="1.2" fill={`url(#${g('pl')})`} />
              <rect x={AC + 17} y={A_BASE - 3.7} width=".9" height="7.4" fill="#8d90a6" opacity=".6" />
              <path d={`M${AC + 23} ${A_BASE - 3}L${AC + 42} ${A_BASE - 4.4}Q${AC + 65} ${A_BASE - 3.4} ${AC + 65} ${A_BASE}Q${AC + 65} ${A_BASE + 3.4} ${AC + 42} ${A_BASE + 4.4}L${AC + 23} ${A_BASE + 3}Z`} fill={`url(#${g('ma')})`} />
              <path d={`M${AC + 27} ${A_BASE - 1.4}L${AC + 60} ${A_BASE - 1.6}`} stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".28" />
            </g>
          </g>
        </g>

        {/* el cojín va delante de la muñeca: la mano queda apoyada en él */}
        <path d="M130 134A12 12 0 0 0 142 146H216A12 12 0 0 0 228 134V133Z" fill="#8f73d1" opacity=".18" />
        <rect x="130" y="122" width="98" height="24" rx="12" fill={`url(#${g('co')})`} />
        <rect x="140" y="125" width="62" height="2.6" rx="1.3" fill="#fff" opacity=".5" />
        <path d="M141 124.5Q138.6 134 141 143.5M217 124.5Q219.4 134 217 143.5" stroke="#7d5fc4" strokeWidth="1" strokeLinecap="round" fill="none" opacity=".3" />
      </svg>
      <Aviso etiqueta="Cita" texto="Hoy 3:00 pm" tono="rosa" lado="izq" />
    </Marco>
  )
}
