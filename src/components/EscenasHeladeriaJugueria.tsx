import './EscenasHeladeriaJugueria.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escenas animadas de la heladería y de la juguería (SVG propio). Todo se mueve
  con CSS (sólo transform y opacity); los keyframes `esc-hela-*` y `esc-jugo-*`
  viven en EscenasHeladeriaJugueria.css y los compartidos `esc-*` en index.css.
  Son decorativas: el Marco ya las marca con aria-hidden.
*/

/** Chispa de cuatro puntas, chica (destellos de la venta). */
const ESTRELLA = 'M0-6L1.6-1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6-1.6Z'

/** Copo de nieve de seis brazos (la escarcha del vidrio). */
const COPO = 'M0-3V3M-2.6-1.5L2.6 1.5M-2.6 1.5L2.6-1.5'

/* ================================ HELADERÍA ================================ */

type Sabor = { base: string; sombra: string; luz: string; motas?: string; tapa: string }

/** Sabores de la fila de adelante (la bandeja 1, frutilla, es la que se sirve). */
const FRENTE: Sabor[] = [
  { base: '#a7f3d0', sombra: '#5fd6a8', luz: '#e3fcef', motas: '#3f2a1d', tapa: '#10b981' }, // menta granizada
  { base: '#fda4af', sombra: '#f47187', luz: '#ffe4e6', motas: '#be123c', tapa: '#f43f5e' }, // frutilla
  { base: '#fef3c7', sombra: '#f6d77a', luz: '#fffdf4', motas: '#a16207', tapa: '#f59e0b' }, // vainilla
  { base: '#a9714f', sombra: '#7c4a2f', luz: '#cf9a76', motas: '#4a2c1a', tapa: '#78350f' }, // chocolate
  { base: '#bae6fd', sombra: '#72c6f2', luz: '#f0f9ff', motas: '#ffffff', tapa: '#0ea5e9' }, // cielo
  { base: '#fdba74', sombra: '#f6923c', luz: '#ffedd5', tapa: '#ea580c' }, // mango
]
/** Fila de atrás, más chica y en sombra: pistacho, mora, dulce de leche, limón y coco. */
const ATRAS: Sabor[] = [
  { base: '#c5e88a', sombra: '#9ccc58', luz: '#e9f8cf', tapa: '#65a30d' },
  { base: '#d1a6f5', sombra: '#ad7ce6', luz: '#f1e4fd', motas: '#6b21a8', tapa: '#9333ea' },
  { base: '#ddb07a', sombra: '#bb8650', luz: '#f2d9b8', tapa: '#92400e' },
  { base: '#fdf3a0', sombra: '#ecd75c', luz: '#fffbe0', tapa: '#ca8a04' },
  { base: '#ffffff', sombra: '#e2e8f0', luz: '#ffffff', motas: '#cbd5e1', tapa: '#64748b' },
]

/**
 * Una bandeja de helado vista de frente: el montículo con sus olas, la luz de
 * arriba, las motas del sabor, la espátula clavada y el canto de acero (con su
 * etiquetita de color) tapando la base. `x` es el borde izquierdo, `y` el canto.
 */
function Bandeja({ x, y, w, h, s, palito }: { x: number; y: number; w: number; h: number; s: Sabor; palito?: string }) {
  const p = (fx: number, fy: number) => `${(x + w * fx).toFixed(2)} ${(y - h * fy).toFixed(2)}`
  const monte = `M${p(0, -0.15)}C${p(0, 0.6)} ${p(0.1, 1)} ${p(0.3, 0.92)}C${p(0.42, 1.16)} ${p(0.6, 1.12)} ${p(0.68, 0.9)}C${p(0.82, 1.04)} ${p(1, 0.72)} ${p(1, -0.15)}Z`
  const luz = `M${p(0.1, 0.5)}C${p(0.12, 0.86)} ${p(0.24, 0.9)} ${p(0.32, 0.82)}C${p(0.26, 0.7)} ${p(0.16, 0.62)} ${p(0.1, 0.5)}Z`
  const motas: [number, number][] = [
    [0.22, 0.42],
    [0.4, 0.7],
    [0.55, 0.38],
    [0.72, 0.6],
    [0.86, 0.3],
    [0.36, 0.22],
  ]
  return (
    <g>
      <path d={monte} fill={s.base} />
      {/* la sombra de abajo, donde el helado se hunde en la bandeja */}
      <path d={`M${p(0, -0.15)}C${p(0.02, 0.3)} ${p(0.3, 0.2)} ${p(0.5, 0.3)}C${p(0.72, 0.18)} ${p(0.98, 0.32)} ${p(1, -0.15)}Z`} fill={s.sombra} opacity=".7" />
      <path d={luz} fill={s.luz} opacity=".9" />
      {s.motas && motas.map(([fx, fy]) => <circle key={`${fx}`} cx={x + w * fx} cy={y - h * fy} r={w > 23 ? 0.65 : 0.75} fill={s.motas} />)}
      {palito && <Palito x={x + w * 0.62} y={y - h * 0.62} color={palito} />}
      {/* el canto de acero de la bandeja, con su etiqueta del sabor */}
      <rect x={x - 0.6} y={y} width={w + 1.2} height="4.6" rx=".8" fill="#dbe3ec" />
      <rect x={x - 0.6} y={y} width={w + 1.2} height="1.1" rx=".5" fill="#fff" />
      <rect x={x + w * 0.3} y={y + 1.8} width={w * 0.4} height="1.8" rx=".9" fill={s.tapa} />
    </g>
  )
}

/**
 * La espátula clavada en el helado, inclinada 24° a la derecha: la hoja de
 * acero asoma del helado y sigue el mango de color. Las puntas se calculan (un
 * `rotate` en el atributo se correría con el transform-origin de `.escena`).
 */
function Palito({ x, y, color }: { x: number; y: number; color: string }) {
  const dx = Math.sin((24 * Math.PI) / 180)
  const dy = -Math.cos((24 * Math.PI) / 180)
  const q = (k: number) => `${(x + dx * k).toFixed(2)} ${(y + dy * k).toFixed(2)}`
  return (
    <g>
      <path d={`M${q(-1)}L${q(3.4)}`} stroke="#cbd5e1" strokeWidth="2.6" />
      <path d={`M${q(2.6)}L${q(12)}`} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M${q(3.2)}L${q(11)}`} stroke="#fff" strokeWidth=".5" strokeLinecap="round" opacity=".5" transform="translate(-.4 0)" />
    </g>
  )
}

/** Un cono de barquillo con la punta en (0, 0) y la boca en y = -16. */
function Barquillo({ id }: { id: string }) {
  return (
    <g>
      <path d="M-5.4-16H5.4L0 0Z" fill="#e3a257" />
      <g clipPath={`url(#${id})`}>
        {[-14, -10, -6, -2, 2].map((k) => (
          <path key={k} d={`M${k - 6} -16L${k + 6} 0M${k + 6} -16L${k - 6} 0`} stroke="#b9772f" strokeWidth=".55" />
        ))}
        <path d="M-5.4-16H-1.6L-.4-3Z" fill="#fff" opacity=".22" />
      </g>
      <rect x="-6" y="-17.4" width="12" height="2.6" rx="1.2" fill="#c98a3e" />
      <rect x="-5.6" y="-17.2" width="11.2" height=".9" rx=".45" fill="#f2c27f" />
    </g>
  )
}

/**
 * Una bocha de helado con centro en (0, 0) y radio `r`: la bola con su luz, la
 * pollerita de abajo (donde se apoya) y, si el sabor tiene, sus motas.
 */
function Bocha({ r, s }: { r: number; s: Sabor }) {
  const pollera = Array.from({ length: 5 }, (_, i) => {
    const x = -r + (i * 2 * r) / 4
    return <circle key={i} cx={x * 0.92} cy={r * 0.62} r={r * 0.34} fill={s.base} />
  })
  return (
    <g>
      <circle r={r} fill={s.base} />
      {pollera}
      <path d={`M${-r} ${r * 0.3}C${-r * 0.5} ${r * 0.9} ${r * 0.5} ${r * 0.9} ${r} ${r * 0.3}`} fill="none" stroke={s.sombra} strokeWidth={r * 0.22} opacity=".55" />
      <ellipse cx={-r * 0.38} cy={-r * 0.42} rx={r * 0.36} ry={r * 0.24} fill={s.luz} opacity=".9" transform="rotate(-30)" />
      {s.motas &&
        [
          [0.35, -0.2],
          [-0.1, 0.25],
          [0.5, 0.35],
          [-0.55, 0.1],
        ].map(([fx, fy]) => <circle key={`${fx}${fy}`} cx={r * fx} cy={r * fy} r={r * 0.11} fill={s.motas} />)}
    </g>
  )
}

/** Las chispas de colores que caen sobre la bocha de arriba: [x, y, color, giro]. */
const CHISPAS: [number, number, string, number][] = [
  [-3.2, -31.2, '#3b82f6', -30],
  [-0.6, -33.2, '#facc15', 20],
  [2.2, -32.4, '#22c55e', -60],
  [3.8, -30.2, '#f472b6', 40],
  [0.8, -30.6, '#f97316', 70],
  [-2.2, -29, '#a855f7', -10],
]

/**
 * La heladería de frente: el letrero con su cono, el toldo de frutilla con su
 * festón, la vitrina refrigerada de dos filas de bandejas con espátulas y el
 * vidrio escarchado, y encima los conos apilados, los frascos de toppings, el
 * vaso de agua de la cuchara, el portaconos y el QR. A la izquierda la
 * congeladora de paletas; a la derecha, la mesita con una copa servida.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): la cuchara sale de su vaso de
 * agua, se mete en la bandeja de frutilla, arma la bocha, la lleva en arco y
 * la suelta sobre el cono de menta que espera en el portaconos. El cono se
 * aplasta y rebota, le llueven las chispas y llega el aviso del cono doble. La
 * cuchara vuelve a su vaso, el cono se lo llevan y aparece otro.
 */
export function EscenaHeladeria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  // Doce rayas del toldo, de 58 → 242 arriba y de 52 → 248 abajo.
  const rayas = Array.from({ length: 12 }, (_, i) => {
    const t0 = 58 + (184 / 12) * i
    const b0 = 52 + (196 / 12) * i
    return { t0, t1: t0 + 184 / 12, b0, b1: b0 + 196 / 12, c: i % 2 === 0 ? '#f9a8c9' : '#ffffff' }
  })
  // la escarcha del borde de abajo del vidrio: dientes irregulares
  const dientes = Array.from({ length: 31 }, (_, i) => `L${75 + i * 5} ${i % 2 ? 118 : 114.6 - (i % 3) * 0.9}`).join('')

  return (
    <Marco fondo="bg-gradient-to-b from-sky-100 via-emerald-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#effcf7" />
            <stop offset="1" stopColor="#c4eee0" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffbf0" />
            <stop offset="1" stopColor="#fbecc8" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e4cf9f" />
            <stop offset="1" stopColor="#efdcb2" />
          </linearGradient>
          <linearGradient id={g('le')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#17645d" />
            <stop offset="1" stopColor="#0e4743" />
          </linearGradient>
          <linearGradient id={g('in')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6eef9" />
            <stop offset="1" stopColor="#f2fbff" />
          </linearGradient>
          <linearGradient id={g('mu')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#86e0c6" />
            <stop offset="1" stopColor="#4fbf9f" />
          </linearGradient>
          <linearGradient id={g('ri')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#cfdbe6" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
            <stop offset=".25" stopColor="#e0f2fe" stopOpacity=".12" />
            <stop offset=".8" stopColor="#e0f2fe" stopOpacity=".1" />
            <stop offset="1" stopColor="#ffffff" stopOpacity=".45" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('co')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#eef2f6" />
            <stop offset=".2" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e6ebf1" />
          </linearGradient>
          <linearGradient id={g('ag')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" stopOpacity=".7" />
            <stop offset="1" stopColor="#7dd3fc" stopOpacity=".8" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <rect x="75" y="88" width="150" height="30" />
          </clipPath>
          <clipPath id={g('cl')}>
            <rect x="46" y="28" width="94" height="18" rx="3" />
          </clipPath>
          <clipPath id={g('cb')}>
            <path d="M-5.4-16H5.4L0 0Z" />
          </clipPath>
          <clipPath id={g('cz')}>
            <path d="M18 117L22 109H52L56 117Z" />
          </clipPath>
        </defs>

        {/* plataforma: losa suave con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#9fdcc8" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".4" />
        <ellipse className="esc-hela-sombra" cx="152" cy="146" rx="84" ry="6" fill="#134e4a" opacity=".14" />
        <ellipse cx="36" cy="146.5" rx="25" ry="3.6" fill="#134e4a" opacity=".13" />
        <ellipse cx="262" cy="146.5" rx="26" ry="3.4" fill="#134e4a" opacity=".13" />

        <g className="esc-hela-flota">
          {/* ---------- el local: lateral, pared, toldo y letrero ---------- */}
          <path d="M50 50L58 46V140L50 144Z" fill={u('la')} />
          <rect x="58" y="44" width="184" height="96" fill={u('pa')} />
          {[86, 114, 142, 170, 198, 226].map((x) => (
            <rect key={x} x={x} y="58" width=".8" height="30" fill="#e8d6a8" opacity=".6" />
          ))}
          <rect x="58" y="44" width="2.2" height="96" fill="#fff" opacity=".5" />
          <rect x="56" y="42" width="188" height="3.4" rx="1.7" fill="#0e4743" />

          {/* el toldo a rayas, en perspectiva, con su festón que se mece */}
          {rayas.map((r, i) => (
            <path key={`t${i}`} d={`M${r.t0} 45H${r.t1}L${r.b1} 55H${r.b0}Z`} fill={r.c} />
          ))}
          <path d="M58 45H242L248 55H52Z" fill="#9d174d" opacity=".06" />
          <g className="esc-toldo">
            {rayas.map((r, i) => (
              <path key={`f${i}`} d={`M${r.b0} 55H${r.b1}V57a${(r.b1 - r.b0) / 2} ${(r.b1 - r.b0) / 2.4} 0 0 1-${r.b1 - r.b0} 0Z`} fill={r.c} />
            ))}
            <rect x="52" y="55" width="196" height="1" fill="#9d174d" opacity=".1" />
          </g>

          {/* el letrero con su cono */}
          <rect x="46" y="28" width="94" height="18" rx="3" fill={u('le')} />
          <rect x="48" y="30" width="90" height="14" rx="2" fill="none" stroke="#f9a8d4" strokeWidth=".7" opacity=".6" />
          <text x="100.6" y="40.6" textAnchor="middle" fontSize="10" fontWeight="800" fill="#f9a8d4" opacity=".6" textLength="66" lengthAdjust="spacing">
            HELADERÍA
          </text>
          <text x="100" y="40" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" textLength="66" lengthAdjust="spacing">
            HELADERÍA
          </text>
          <g clipPath={`url(#${g('cl')})`}>
            <g transform="translate(40 28)">
              <g className="esc-hela-brillo" style={v({ '--d': '108px', animationDelay: '-1.6s' })}>
                <path d="M0 0H8L2 18H-6Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          {/* el cono del letrero, que se sale del cartel */}
          <g transform="translate(57 47)">
            <Barquillo id={g('cb')} />
            <g transform="translate(0 -20)">
              <Bocha r={6} s={FRENTE[0]} />
            </g>
            <g transform="translate(0 -28.6)">
              <Bocha r={5.4} s={FRENTE[1]} />
            </g>
            <path d="M0-34.6C-.4-36.4.8-37.6 2-37.2" fill="none" stroke="#15803d" strokeWidth=".8" />
            <circle cx="0" cy="-35" r="2" fill="#e11d48" />
            <circle cx="-.6" cy="-35.7" r=".6" fill="#fff" opacity=".7" />
          </g>

          {/* ---------- la vitrina refrigerada: interior y bandejas ---------- */}
          <rect x="72" y="86" width="156" height="34" rx="3" fill="#e9f1f7" />
          <rect x="75" y="88" width="150" height="30" fill={u('in')} />
          {/* el frío que sube de las bandejas */}
          {[96, 150, 200].map((x, i) => (
            <circle
              key={x}
              className="esc-hela-vaho"
              cx={x}
              cy="100"
              r="3.4"
              fill="#fff"
              style={v({ '--dx': i === 1 ? '3px' : '-3px', animationDelay: `${-i * 1.1}s` })}
            />
          ))}
          {ATRAS.map((s, i) => (
            <Bandeja key={`a${i}`} x={78 + i * 29.4} y={103} w={27} h={8.5} s={s} palito={i === 1 ? '#fbbf24' : i === 3 ? '#38bdf8' : undefined} />
          ))}
          <rect x="75" y="103" width="150" height="8" fill="#0c4a6e" opacity=".05" />

          {FRENTE.map((s, i) => (
            <Bandeja
              key={`f${i}`}
              x={77 + i * 24.4}
              y={111}
              w={23}
              h={10.5}
              s={s}
              palito={['#f472b6', undefined, '#38bdf8', '#fbbf24', undefined, '#34d399'][i]}
            />
          ))}

          {/* la cuchara: va delante del helado pero detrás del vidrio y del canto (se mete por atrás) */}
          <g transform="translate(160 79)">
            <g className="esc-hela-cuchara">
              <rect x="-17" y="-16.5" width="34" height="30" fill="none" />
              <g className="esc-hela-bola">
                <g transform="translate(0 -1.5)">
                  <Bocha r={5.2} s={FRENTE[1]} />
                </g>
              </g>
              <path d="M3 -1.8L11.4-9.6" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M9.6-8L15.6-13.4" stroke="#f472b6" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M10.4-8.9L14.6-12.6" stroke="#fff" strokeWidth=".8" strokeLinecap="round" opacity=".5" />
              <path d="M-4.6 0A4.6 4.6 0 0 0 4.6 0Z" fill="#cbd5e1" />
              <path d="M-4.6 0A4.6 4.6 0 0 0 -1 4.5L-2 .4Z" fill="#fff" opacity=".6" />
              <rect x="-4.9" y="-.7" width="9.8" height="1.4" rx=".7" fill="#e2e8f0" />
            </g>
          </g>

          {/* el vidrio: reflejo curvo de arriba, escarcha abajo y en las esquinas, brillo que lo cruza */}
          <rect x="75" y="88" width="150" height="30" fill={u('vi')} />
          <path d="M76 91.6Q150 87.4 224 91.6V93.8Q150 89.6 76 93.8Z" fill="#fff" opacity=".75" />
          <path d={`M75 118V114.6${dientes}V118Z`} fill="#fff" opacity=".8" />
          <path d="M75 118V104C77 106 76 109 79 110C78 112 81 113 82 116L84 118Z" fill="#fff" opacity=".55" />
          <path d="M225 88V100C223 98 224 96 221 95C222 93 219 92 219 90L217 88Z" fill="#fff" opacity=".55" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(60 88)">
              <g className="esc-hela-brillo" style={v({ '--d': '180px' })}>
                <path d="M0 0H9L-1 30H-10Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          {(
            [
              [84, 99, '0s'],
              [118, 95, '-.9s'],
              [171, 98, '-1.7s'],
              [214, 106, '-2.4s'],
              [137, 108, '-3.1s'],
            ] as const
          ).map(([x, y, d]) => (
            <g key={x} transform={`translate(${x} ${y}) scale(.9)`}>
              <path className="esc-hela-copo" d={COPO} stroke="#fff" strokeWidth=".7" strokeLinecap="round" style={{ animationDelay: d }} />
            </g>
          ))}

          {/* ---------- el mueble de la vitrina ---------- */}
          <rect x="72" y="118" width="156" height="24" rx="2.4" fill={u('mu')} />
          <rect x="72" y="118" width="3" height="24" rx="1.4" fill="#fff" opacity=".22" />
          {/* la banda de vainilla que chorrea */}
          <path
            d="M72 118H228V122.6C226 122.6 225 127 222.6 127C220 127 220.4 122.6 217 122.6C213 122.6 214 129.6 210.4 129.6C207 129.6 208 122.6 203 122.6H180C177 122.6 177.6 126.4 175 126.4C172.4 126.4 173 122.6 170 122.6H150C146 122.6 147.4 130 143.4 130C139.6 130 141 122.6 137 122.6H114C111 122.6 111.6 126.6 109 126.6C106.4 126.6 107 122.6 104 122.6H90C87 122.6 87.6 128 84.6 128C81.6 128 82.4 122.6 79 122.6H72Z"
            fill="#fffbeb"
          />
          <path d="M72 118H228V119.2H72Z" fill="#fde68a" opacity=".7" />
          {/* confites del frente */}
          {(
            [
              [96, 134, '#f472b6', 30],
              [124, 136, '#38bdf8', -20],
              [158, 135, '#fbbf24', 50],
              [188, 133.6, '#a78bfa', -40],
              [214, 136, '#f472b6', 10],
              [110, 131, '#fde68a', 70],
              [196, 128, '#fff', -60],
              [138, 138, '#fff', 20],
            ] as const
          ).map(([x, y, c, r]) => (
            <rect key={`${x}`} x={x - 2} y={y - 0.6} width="4" height="1.2" rx=".6" fill={c} transform={`rotate(${r})`} />
          ))}
          <rect x="72" y="140" width="156" height="5" rx="1.4" fill="#2c9c80" />
          {[80, 220].map((x) => (
            <rect key={x} x={x - 3} y="144" width="6" height="2" rx=".8" fill="#64748b" />
          ))}

          {/* el canto superior de la vitrina, donde se apoya todo */}
          <rect x="70" y="84" width="160" height="4.4" rx="1.6" fill={u('ri')} />
          <rect x="70" y="84" width="160" height="1" rx=".5" fill="#fff" />

          {/* ---------- lo de arriba de la vitrina ---------- */}
          {/* conos apilados, encajados uno en otro, en su aro de alambre */}
          <rect x="84" y="82.4" width="14" height="2" rx=".8" fill="#94a3b8" />
          <rect x="96" y="70" width="1.4" height="13" fill="#94a3b8" />
          {[4, 3, 2, 1, 0].map((k) => (
            <g key={k} transform={`translate(91 ${84 - k * 2.5})`}>
              <Barquillo id={g('cb')} />
            </g>
          ))}
          <path d="M87.4 74.6A3.6 1.1 0 0 0 94.6 74.6" fill="none" stroke="#94a3b8" strokeWidth="1" />
          {/* frascos de toppings: chispas de colores, chocolate y maní */}
          {(
            [
              [111, '#ffffff', ['#3b82f6', '#facc15', '#22c55e', '#f472b6', '#f97316'], '#f472b6'],
              [124.5, '#5b3417', ['#8a5a2b', '#3b2010'], '#fbbf24'],
              [138, '#e9c58e', ['#b07a3c', '#c99556'], '#38bdf8'],
            ] as const
          ).map(([x, fondo, motas, tapa]) => (
            <g key={x} transform={`translate(${x} 84)`}>
              <rect x="-5.4" y="-12" width="10.8" height="12" rx="2.2" fill="#fff" opacity=".85" />
              <rect x="-4.6" y="-8.6" width="9.2" height="8" rx="1.6" fill={fondo} />
              {Array.from({ length: 7 }, (_, i) => (
                <rect
                  key={i}
                  x={-3.6 + (i % 4) * 2.2}
                  y={-7.6 + Math.floor(i / 4) * 2.8 + (i % 2) * 0.8}
                  width="1.6"
                  height=".7"
                  rx=".35"
                  fill={motas[i % motas.length]}
                  transform={`rotate(${((i * 47) % 90) - 45})`}
                />
              ))}
              <rect x="-6" y="-14" width="12" height="2.8" rx="1.2" fill={tapa} />
              <rect x="-4" y="-11" width="1.2" height="10" rx=".6" fill="#fff" opacity=".6" />
            </g>
          ))}

          {/* el vaso de agua donde descansa la cuchara */}
          <ellipse className="esc-hela-onda" cx="160" cy="75" rx="4.4" ry="1" fill="none" stroke="#fff" strokeWidth=".7" />
          <path d="M154.4 73H165.6L164.6 84H155.4Z" fill={u('ag')} />
          <path d="M154.4 73H165.6L165.4 75H154.6Z" fill="#fff" opacity=".6" />
          <rect x="155.8" y="75" width="1.1" height="8" rx=".5" fill="#fff" opacity=".7" />

          {/* la salsa de chocolate, en su botella de pico */}
          <g transform="translate(176 84)">
            <rect x="-3.6" y="-14" width="7.2" height="14" rx="1.8" fill="#6b3a1e" />
            <rect x="-3.6" y="-9" width="7.2" height="5" fill="#fef3c7" />
            <rect x="-2" y="-7.4" width="4" height="1.6" rx=".8" fill="#6b3a1e" opacity=".7" />
            <path d="M-2.4-14L-1-19H1L2.4-14Z" fill="#f472b6" />
            <rect x="-.5" y="-21.4" width="1" height="2.6" rx=".5" fill="#f472b6" />
            <rect x="-2.8" y="-13" width="1" height="12" rx=".5" fill="#fff" opacity=".3" />
          </g>

          {/* el portaconos: base y aro (el aro de adelante va sobre el cono) */}
          <rect x="188" y="82.4" width="16" height="2" rx=".8" fill="#94a3b8" />
          <rect x="202" y="76.6" width="1.4" height="6" fill="#94a3b8" />
          <ellipse cx="196" cy="77" rx="3.8" ry="1.2" fill="none" stroke="#64748b" strokeWidth=".9" />

          {/* el cono que se vende: espera con la bocha de menta y recibe la de frutilla */}
          <g transform="translate(196 84)">
            <g className="esc-hela-cono">
              <g className="esc-hela-rebote">
                <Barquillo id={g('cb')} />
                <g transform="translate(0 -20)">
                  <Bocha r={6.2} s={FRENTE[0]} />
                </g>
                <g className="esc-hela-bocha2">
                  <g transform="translate(0 -28.6)">
                    <Bocha r={5.4} s={FRENTE[1]} />
                  </g>
                </g>
                {CHISPAS.map(([x, y, c, r], i) => (
                  <g key={i} className="esc-hela-chispa" style={{ animationDelay: `${-i * 0.03}s` }}>
                    <rect x={x - 1} y={y - 0.35} width="2" height=".7" rx=".35" fill={c} transform={`rotate(${r})`} />
                  </g>
                ))}
              </g>
            </g>
          </g>
          <path d="M192.2 77.4A3.8 1.2 0 0 0 199.8 77.4" fill="none" stroke="#94a3b8" strokeWidth="1" />

          {/* el QR de cobro, parado sobre la vitrina */}
          <rect x="211" y="82.6" width="10" height="1.8" rx=".8" fill="#0e4743" />
          <rect x="209" y="69" width="14" height="14.4" rx="1.6" fill="#fff" />
          <rect x="209" y="69" width="14" height="14.4" rx="1.6" fill="none" stroke="#0e4743" strokeWidth=".6" />
          <path d="M211 71h4v4h-4zM217 71h4v4h-4zM211 77h4v4h-4zM217.5 77.5h1.5v1.5h-1.5zM219.5 79.5h1.5v1.5h-1.5zM217.5 80h1.5v1h-1.5z" fill="#0e4743" />

          {/* la venta: aro y destellos sobre el cono */}
          <ellipse className="esc-hela-aro" cx="196" cy="84" rx="13" ry="3.6" fill="none" stroke="#ec4899" strokeWidth="1.3" />
          <g transform="translate(182 56)">
            <path className="esc-hela-destello" d={ESTRELLA} fill="#f9a8d4" />
          </g>
          <g transform="translate(210 50)">
            <path className="esc-hela-destello" d={ESTRELLA} fill="#7dd3fc" style={{ animationDelay: '-6.35s' }} />
          </g>

          {/* ---------- la congeladora de paletas (izquierda) ---------- */}
          {/* el cartel de la paleta, en su palo, que se mece */}
          <g className="esc-planta">
            <rect x="35.2" y="84" width="1.6" height="26" fill="#94a3b8" />
            <rect x="34.4" y="82" width="3.2" height="9" rx="1.2" fill="#e9c58e" />
            <path d="M29 82V69.6A7 7 0 0 1 43 69.6V82Z" fill="#fb7185" />
            <path d="M29 76.4V69.6A7 7 0 0 1 43 69.6V76.4C41.4 75 40 78 38.4 76.6C36.8 75.2 35.4 78.2 33.8 76.8C32.2 75.4 30.6 78 29 76.4Z" fill="#fecdd3" />
            <path d="M31 70.6C31 67.6 32.6 65.4 34.6 64.8" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
            {[
              [32.4, 79.6],
              [37.6, 80.4],
              [40.2, 78.4],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r=".55" fill="#9f1239" />
            ))}
          </g>
          <rect x="16" y="116" width="42" height="30" rx="2.6" fill={u('co')} />
          <rect x="16" y="124" width="42" height="5" fill="#86e0c6" />
          <rect x="16" y="124" width="42" height="1" fill="#fff" opacity=".6" />
          <text x="37" y="139.6" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#0e4743" opacity=".85">
            PALETAS
          </text>
          <path d="M18 117L22 109H52L56 117Z" fill="#e6f4fb" />
          <g clipPath={`url(#${g('cz')})`}>
            {(
              [
                [24, 112.6, '#fb7185', -12],
                [31, 113.4, '#fde68a', 8],
                [38, 112.4, '#a7f3d0', -6],
                [45, 113.2, '#c084fc', 14],
                [50, 111.6, '#fdba74', -10],
              ] as const
            ).map(([x, y, c, r]) => (
              <g key={x} transform={`rotate(${r})`}>
                <rect x={x - 5.6} y={y - 0.9} width="2.6" height="1.8" rx=".5" fill="#e9c58e" />
                <rect x={x - 3.4} y={y - 1.9} width="8" height="3.8" rx="1.9" fill={c} />
              </g>
            ))}
            <path d="M18 117L22 109H30L24 117Z" fill="#fff" opacity=".45" />
          </g>
          <path d="M18 117L22 109H52L56 117Z" fill="none" stroke="#cbd5e1" strokeWidth=".9" />
          <rect x="16" y="116" width="42" height="2" rx="1" fill="#cbd5e1" />
          {/* el frío que sale de la tapa */}
          {[
            [28, '-3px', '0s'],
            [40, '3px', '-1.3s'],
            [50, '-2px', '-2.4s'],
          ].map(([x, dx, d]) => (
            <circle key={x as number} className="esc-hela-frio" cx={x as number} cy="108" r="3" fill="#fff" style={v({ '--dx': dx as string, animationDelay: d as string })} />
          ))}

          {/* ---------- la mesita con una copa servida (derecha) ---------- */}
          {/* la silla de bistró, detrás de la mesa */}
          <path d="M241 144L243.4 120M255 144L252.6 120" stroke="#f9a8c9" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M243 120V100A5 5 0 0 1 253 100V120" fill="none" stroke="#f472b6" strokeWidth="1.8" />
          <path d="M245.6 102V118M250.4 102V118" stroke="#f9a8c9" strokeWidth="1" />
          <rect x="240" y="118.6" width="16" height="3" rx="1.5" fill="#f472b6" />
          <rect x="241" y="118.6" width="14" height=".9" rx=".45" fill="#fff" opacity=".5" />
          {/* la mesa */}
          <rect x="269.6" y="117" width="2.8" height="26" fill="#e2e8f0" />
          <ellipse cx="271" cy="144.2" rx="9" ry="2" fill="#cbd5e1" />
          <ellipse cx="271" cy="117" rx="19" ry="4.2" fill="#ffffff" />
          <ellipse cx="271" cy="118.4" rx="19" ry="3.4" fill="#e2e8f0" opacity=".5" />
          <ellipse cx="271" cy="116.4" rx="17" ry="3" fill="#fff" />
          {/* la copa: pie, cáliz, dos bochas, crema y la guinda */}
          <g transform="translate(270 116)">
            <ellipse cx="0" cy="0" rx="4.6" ry="1.1" fill="#dbeafe" />
            <rect x="-.7" y="-6" width="1.4" height="6" fill="#dbeafe" />
            <path d="M-7-14H7C7-8.6 3.6-6 0-6C-3.6-6-7-8.6-7-14Z" fill="#e0f2fe" opacity=".9" />
            <path d="M-6-13H6C5.6-9.4 3-7.2 0-7.2C-3-7.2-5.6-9.4-6-13Z" fill="#fde68a" />
            <g transform="translate(-3 -15.6)">
              <Bocha r={4} s={FRENTE[3]} />
            </g>
            <g transform="translate(3.2 -15.8)">
              <Bocha r={4} s={FRENTE[4]} />
            </g>
            <path d="M-3.6-19C-3.6-23 3.6-23 3.6-19C2-18 -2-18 -3.6-19Z" fill="#fff" />
            <circle cx="0" cy="-23.4" r="1.8" fill="#e11d48" />
            <path d="M0-25C.4-27 1.6-27.6 2.6-27.4" fill="none" stroke="#15803d" strokeWidth=".6" />
            <path d="M-6.4-13.4C-6-10.4-4.6-8.6-3-7.8" fill="none" stroke="#fff" strokeWidth=".9" strokeLinecap="round" opacity=".8" />
            <path d="M5.6-17L9-26" stroke="#f472b6" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Cono doble" texto="Bs 12" tono="rosa" />
    </Marco>
  )
}

/* ================================ JUGUERÍA ================================ */

/** Naranja con centro en (x, y): la fruta, su luz y el cabito. */
function Naranja({ x, y, r = 5, c = '#fb923c' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c} />
      <circle cx={x + r * 0.2} cy={y + r * 0.25} r={r * 0.78} fill="#000" opacity=".06" />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.38} rx={r * 0.32} ry={r * 0.22} fill="#fff" opacity=".55" />
      <circle cx={x + r * 0.15} cy={y - r * 0.82} r={r * 0.14} fill="#3f6212" />
    </g>
  )
}

/** Frutilla con la punta abajo y el centro en (x, y): cuerpo, semillas y hojita. */
function Frutilla({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  const p = (dx: number, dy: number) => `${(x + dx * k).toFixed(2)} ${(y + dy * k).toFixed(2)}`
  return (
    <g>
      <path d={`M${p(0, 4)}C${p(-3.6, 3.6)} ${p(-4.4, -1)} ${p(-2.8, -2.4)}C${p(-1.4, -3.4)} ${p(1.4, -3.4)} ${p(2.8, -2.4)}C${p(4.4, -1)} ${p(3.6, 3.6)} ${p(0, 4)}Z`} fill="#ef4444" />
      <path d={`M${p(-2.6, -1.2)}C${p(-2.6, 1)} ${p(-1.4, 2.4)} ${p(-0.6, 2.8)}`} fill="none" stroke="#fff" strokeWidth={0.6 * k} opacity=".35" strokeLinecap="round" />
      {[
        [-1.4, -0.6],
        [1.2, -1],
        [0, 1],
        [1.6, 1.4],
        [-1.2, 2],
      ].map(([dx, dy]) => (
        <circle key={`${dx}${dy}`} cx={x + dx * k} cy={y + dy * k} r={0.38 * k} fill="#fde68a" />
      ))}
      <path d={`M${p(-2.4, -2.6)}L${p(-1, -3.2)}L${p(0, -4.6)}L${p(1, -3.2)}L${p(2.4, -2.6)}L${p(0, -2)}Z`} fill="#16a34a" />
    </g>
  )
}

/** Piña parada con la base en (x, y): el cuerpo escamado y la corona de hojas. */
function Pina({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  const cy = y - 8 * k
  // hojas de la corona: [x de la punta, alto de la punta, ancho en la base]
  const hojas: [number, number, number][] = [
    [-6, 15, 2.6],
    [6, 15, 2.6],
    [-3, 19, 2.4],
    [3, 19, 2.4],
    [0, 21, 2.2],
  ]
  return (
    <g>
      {hojas.map(([dx, alto, ancho], i) => (
        <path
          key={i}
          d={`M${x - ancho * k} ${cy - 6.6 * k}Q${x + dx * 0.3 * k} ${cy - (alto * 0.6 + 6) * k} ${x + dx * k} ${cy - (alto + 6) * k}Q${x + dx * 0.5 * k} ${cy - (alto * 0.5 + 6) * k} ${x + ancho * k} ${cy - 6.6 * k}Z`}
          fill={i % 2 ? '#22c55e' : '#16a34a'}
        />
      ))}
      <ellipse cx={x} cy={cy} rx={5.8 * k} ry={8 * k} fill="#f59e0b" />
      <ellipse cx={x + 1.6 * k} cy={cy + 1 * k} rx={4 * k} ry={7 * k} fill="#d97706" opacity=".35" />
      {[-5, -2, 1, 4].map((dy) =>
        [-3, 0, 3].map((dx) => (
          <path
            key={`${dx}${dy}`}
            d={`M${x + dx * k - 1.1 * k} ${cy + dy * k}L${x + dx * k} ${cy + dy * k + 1.1 * k}L${x + dx * k + 1.1 * k} ${cy + dy * k}`}
            fill="none"
            stroke="#92400e"
            strokeWidth={0.5 * k}
            opacity=".7"
          />
        )),
      )}
      <ellipse cx={x - 2.4 * k} cy={cy - 3 * k} rx={1.2 * k} ry={3 * k} fill="#fde68a" opacity=".55" />
    </g>
  )
}

/** Un plátano con el cabo en (x, y), colgando y con la punta a la derecha (`lado` = -1 lo espeja). */
function Platano({ x, y, lado = 1 }: { x: number; y: number; lado?: number }) {
  const p = (dx: number, dy: number) => `${(x + dx * lado).toFixed(2)} ${(y + dy).toFixed(2)}`
  return (
    <g>
      <path d={`M${p(-1, 0)}C${p(-2, 7)} ${p(2, 12)} ${p(8, 12.4)}C${p(6, 10)} ${p(2.4, 6)} ${p(1.2, 0)}Z`} fill="#facc15" />
      <path d={`M${p(-0.6, 2)}C${p(-1, 7)} ${p(2, 10.6)} ${p(6, 11.6)}`} fill="none" stroke="#fde68a" strokeWidth=".7" />
      <path d={`M${p(0.8, 2)}C${p(1.4, 6)} ${p(4, 9.6)} ${p(7.4, 11.8)}`} fill="none" stroke="#ca8a04" strokeWidth=".5" opacity=".7" />
      <circle cx={x + 8 * lado} cy={y + 12.4} r=".7" fill="#713f12" />
      <rect x={x - 1} y={y - 1.6} width="2" height="2" rx=".5" fill="#65a30d" />
    </g>
  )
}

/**
 * Una mano de plátanos acostada, con el cabo a la izquierda en (x, y): cinco
 * dedos curvos (trazos gruesos de punta redonda) que suben hacia la derecha.
 */
function Racimo({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[4, 3, 2, 1, 0].map((k) => {
        const dx = k * 1.2
        const dy = -k * 2.2
        return (
          <g key={k}>
            <path d={`M${x + dx} ${y + dy}Q${x + dx + 8} ${y + dy + 3} ${x + dx + 15} ${y + dy - 4}`} fill="none" stroke={k % 2 ? '#eab308' : '#facc15'} strokeWidth="3.4" strokeLinecap="round" />
            <path d={`M${x + dx + 2} ${y + dy - 0.9}Q${x + dx + 8} ${y + dy + 1.4} ${x + dx + 13.4} ${y + dy - 4.6}`} fill="none" stroke="#fef08a" strokeWidth=".8" strokeLinecap="round" />
            <circle cx={x + dx + 15.2} cy={y + dy - 4.2} r=".9" fill="#713f12" />
          </g>
        )
      })}
      <path d={`M${x - 0.6} ${y + 1.4}Q${x - 2.4} ${y - 4} ${x + 3.6} ${y - 9.6}`} fill="none" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

/** Un cajón de madera (esquina de arriba a la izquierda en x, y) con sus tablas y esquineros. */
function Cajon({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1.2" fill="#9a622d" />
      {[0.08, 0.4, 0.72].map((f) => (
        <rect key={f} x={x} y={y + h * f} width={w} height={h * 0.24} rx=".6" fill="#d39a5c" />
      ))}
      {[0.08, 0.4, 0.72].map((f) => (
        <rect key={`l${f}`} x={x} y={y + h * f} width={w} height=".8" fill="#ecc08a" opacity=".8" />
      ))}
      <rect x={x} y={y} width="3" height={h} rx="1" fill="#8a5525" />
      <rect x={x + w - 3} y={y} width="3" height={h} rx="1" fill="#8a5525" />
      <rect x={x + w / 2 - 5} y={y + h * 0.42} width="10" height={h * 0.22} rx=".8" fill="#fef3c7" opacity=".85" />
    </g>
  )
}

/** Las tres frutillas que caen en la licuadora: [x final, y final, retraso]. */
const CAEN: [number, number, string][] = [
  [127.6, 79, '-.36s'],
  [132.8, 79.4, '-.18s'],
  [130, 74.6, '0s'],
]

/**
 * Un puesto de jugos con techo de paja: el letrero con su rodaja de naranja,
 * banderines, plátanos colgados, la pizarra de los jugos, el mostrador
 * turquesa pintado con frutas, y encima la canasta, la licuadora y el vaso.
 * Al costado, los cajones de naranjas y frutillas, la piña y el cajón de
 * plátanos con la media sandía.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): se levanta la tapa y caen tres
 * frutillas a la licuadora; la tapa vuelve, la licuadora tiembla con su
 * remolino rojo y se llena de jugo. La jarra se inclina y sirve el vaso alto,
 * cae la pajita con su frutilla, el vaso se desliza por el mostrador hasta el
 * cliente y llega el aviso. Después una mano se lo lleva y aparece otro vaso.
 */
export function EscenaJugueria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  // flecos de la paja: dientes de 60 a 240, uno de cada tres más corto
  const flecos = (y0: number, largo: number, paso: number, corrimiento: number) =>
    `M60 ${y0}L${60 + corrimiento} ${y0}` +
    Array.from({ length: Math.floor((180 - corrimiento) / paso) }, (_, i) => {
      const x = 60 + corrimiento + i * paso
      return `L${x + paso / 2} ${y0 + largo * (i % 3 === 1 ? 0.65 : 1)}L${x + paso} ${y0}`
    }).join('') +
    `L240 ${y0}Z`
  // banderines colgados de un hilo bajo el techo
  const banderines = Array.from({ length: 11 }, (_, i) => {
    const x = 84 + i * 13.2
    const t = (x - 80) / 140
    return { x, y: 53.2 + Math.sin(t * Math.PI) * 3.4, c: ['#ef4444', '#facc15', '#22c55e', '#f97316', '#ec4899', '#38bdf8'][i % 6] }
  })

  return (
    <Marco fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff7ec" />
            <stop offset="1" stopColor="#fed7aa" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe7c2" />
            <stop offset="1" stopColor="#ffd8a0" />
          </linearGradient>
          <linearGradient id={g('te')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8d26a" />
            <stop offset="1" stopColor="#e3a93a" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#0f9f8f" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d99a5b" />
            <stop offset="1" stopColor="#a86a32" />
          </linearGradient>
          <linearGradient id={g('le')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#16a34a" />
            <stop offset="1" stopColor="#11793a" />
          </linearGradient>
          <linearGradient id={g('ju')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fb7185" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id={g('ba')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#475569" />
            <stop offset=".35" stopColor="#334155" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cj')}>
            <path d="M122.6 56H137.4L135.4 83.4H124.6Z" />
          </clipPath>
          <clipPath id={g('cv')}>
            <path d="M-5.2-23H5.2L4-1H-4Z" />
          </clipPath>
          <clipPath id={g('cl')}>
            <rect x="30" y="10" width="78" height="18" rx="3" />
          </clipPath>
        </defs>

        {/* plataforma: losa suave con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#f8b77a" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".4" />
        <ellipse className="esc-jugo-sombra" cx="150" cy="146" rx="86" ry="6" fill="#7c2d12" opacity=".14" />
        <ellipse cx="40" cy="146.5" rx="30" ry="3.8" fill="#7c2d12" opacity=".13" />
        <ellipse cx="264" cy="146.5" rx="29" ry="3.6" fill="#7c2d12" opacity=".13" />

        <g className="esc-jugo-flota">
          {/* ---------- el fondo del puesto ---------- */}
          <rect x="78" y="40" width="144" height="58" fill={u('pa')} />
          {[96, 114, 132, 150, 168, 186, 204].map((x) => (
            <rect key={x} x={x} y="46" width=".8" height="52" fill="#f2bf7e" opacity=".6" />
          ))}
          {/* repisa con fruta, a la izquierda */}
          <Naranja x={89} y={70.4} r={3.6} />
          <Naranja x={96} y={71} r={3} c="#a3e635" />
          <Naranja x={102.6} y={70.4} r={3.6} c="#f97316" />
          <rect x="84" y="74" width="26" height="2.6" rx="1" fill={u('ma')} />
          {/* la pizarra de los jugos */}
          <rect x="181" y="58" width="34" height="30" rx="2" fill="#a86a32" />
          <rect x="183" y="60" width="30" height="26" rx="1.4" fill="#14532d" />
          <text x="198" y="66.8" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#fde68a">
            JUGOS
          </text>
          {(
            [
              [71.4, '#ef4444'],
              [76.2, '#fb923c'],
              [81, '#facc15'],
            ] as const
          ).map(([y, c], i) => (
            <g key={y}>
              <circle cx="187.4" cy={y} r="1.5" fill={c} />
              <rect x="190.4" y={y - 0.7} width={[11, 9, 12][i]} height="1.4" rx=".7" fill="#fff" opacity=".8" />
              <rect x="205" y={y - 0.7} width="5" height="1.4" rx=".7" fill="#fde68a" />
            </g>
          ))}

          {/* ---------- los postes de caña ---------- */}
          {[74, 222].map((x) => (
            <g key={x}>
              <rect x={x} y="36" width="4.4" height="62" rx="1.4" fill="#d9a54a" />
              <rect x={x} y="36" width="1.3" height="62" fill="#f5cf7a" />
              {[52, 70, 88].map((y) => (
                <rect key={y} x={x - 0.4} y={y} width="5.2" height="1.6" rx=".8" fill="#a16f22" />
              ))}
            </g>
          ))}

          {/* plátanos colgados del techo, que se mecen */}
          <g className="esc-jugo-mece">
            <path d="M94 44V54" stroke="#92400e" strokeWidth=".7" />
            <Platano x={94} y={55} />
            <Platano x={94} y={55} lado={-1} />
            <Platano x={92} y={57} />
            <Platano x={96} y={57} lado={-1} />
            <rect x="92.6" y="52.4" width="2.8" height="4" rx="1" fill="#65a30d" />
          </g>

          {/* ---------- el techo de paja, con su fleco que se mece ---------- */}
          <path d="M82 26H218L240 44H60Z" fill={u('te')} />
          {Array.from({ length: 18 }, (_, i) => (
            <path key={i} d={`M${84 + i * 7.6} 27L${62 + i * 9.8} 43`} stroke="#c98a1a" strokeWidth=".6" opacity=".6" />
          ))}
          <rect x="80" y="23.6" width="140" height="4" rx="2" fill="#b9791c" />
          <g className="esc-toldo">
            <path d={flecos(43, 9, 7, 0)} fill="#d6992c" />
            <path d={flecos(42, 7.6, 6, 3)} fill="#f3c654" />
            <path d="M60 42.4H240" stroke="#fde68a" strokeWidth=".8" opacity=".7" />
          </g>
          {/* banderines */}
          <path d="M80 53Q150 60 220 53" fill="none" stroke="#7c2d12" strokeWidth=".5" opacity=".7" />
          {banderines.map((b) => (
            <path key={b.x} d={`M${b.x - 2.6} ${b.y - 0.4}H${b.x + 2.6}L${b.x} ${b.y + 4.6}Z`} fill={b.c} />
          ))}

          {/* el letrero con su rodaja de naranja */}
          <path d="M62 28L66 26M100 28L96 26" stroke="#7c2d12" strokeWidth=".8" />
          <rect x="30" y="10" width="78" height="18" rx="3" fill={u('le')} />
          <rect x="32" y="12" width="74" height="14" rx="2" fill="none" stroke="#fde68a" strokeWidth=".7" opacity=".6" />
          <text x="78.6" y="23.2" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0b4f25" textLength="46" lengthAdjust="spacing">
            JUGOS
          </text>
          <text x="78" y="22.6" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fef3c7" textLength="46" lengthAdjust="spacing">
            JUGOS
          </text>
          <g clipPath={`url(#${g('cl')})`}>
            <g transform="translate(24 10)">
              <g className="esc-jugo-brillo" style={v({ '--d': '94px', animationDelay: '-1.6s' })}>
                <path d="M0 0H8L2 18H-6Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          <g className="esc-jugo-rodaja">
            <circle cx="37" cy="19" r="10" fill="#f97316" />
            <circle cx="37" cy="19" r="8.4" fill="#fed7aa" />
            <circle cx="37" cy="19" r="7.4" fill="#fb923c" />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4
              return <path key={i} d={`M37 19L${(37 + 7.4 * Math.cos(a)).toFixed(2)} ${(19 + 7.4 * Math.sin(a)).toFixed(2)}`} stroke="#fed7aa" strokeWidth=".9" />
            })}
            <circle cx="37" cy="19" r="1.4" fill="#fed7aa" />
            <ellipse cx="33.6" cy="15.4" rx="2" ry="1.2" fill="#fff" opacity=".5" />
          </g>
          <path d="M42.4 9.8C44 6.6 48 6.2 50.4 7.6C48 10 45 11 42.4 9.8Z" fill="#22c55e" />

          {/* ---------- el mostrador ---------- */}
          <rect x="70" y="100" width="160" height="42" fill={u('mo')} />
          {[90, 110, 130, 170, 190, 210].map((x) => (
            <rect key={x} x={x} y="104" width=".8" height="36" fill="#0d7f73" opacity=".5" />
          ))}
          <rect x="70" y="100" width="3" height="42" fill="#fff" opacity=".2" />
          {/* la franja amarilla ondulada de arriba */}
          <path
            d={`M70 100H230V104${Array.from({ length: 10 }, (_, i) => `Q${226 - i * 16} 108 ${222 - i * 16} 104.4Q${218 - i * 16} 101 ${214 - i * 16} 104.4`).join('')}L70 104Z`}
            fill="#fde047"
          />
          {/* la fruta pintada al frente: rodaja de naranja, frutillas y hojas */}
          <path d="M126 124C130 116 138 116 140 120C134 121 130 124 126 124Z" fill="#16a34a" />
          <path d="M174 124C170 116 162 116 160 120C166 121 170 124 174 124Z" fill="#16a34a" />
          <circle cx="150" cy="123" r="12" fill="#f97316" />
          <circle cx="150" cy="123" r="10.2" fill="#fff7ed" />
          <circle cx="150" cy="123" r="9" fill="#fb923c" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4 + Math.PI / 8
            return <path key={i} d={`M150 123L${(150 + 9 * Math.cos(a)).toFixed(2)} ${(123 + 9 * Math.sin(a)).toFixed(2)}`} stroke="#fff7ed" strokeWidth="1.1" />
          })}
          <circle cx="150" cy="123" r="1.6" fill="#fff7ed" />
          <Frutilla x={119} y={126} k={1.5} />
          <Frutilla x={181} y={126} k={1.5} />
          <rect x="70" y="138" width="160" height="5" fill="#0b766b" />
          {[78, 222].map((x) => (
            <rect key={x} x={x - 3} y="142.6" width="6" height="3" rx="1" fill="#7c4a1d" />
          ))}
          <rect x="64" y="95.6" width="172" height="5" rx="1.6" fill={u('ma')} />
          <rect x="64" y="95.6" width="172" height="1.2" rx=".6" fill="#f3c99a" />

          {/* ---------- sobre el mostrador ---------- */}
          {/* la canasta de fruta */}
          <Frutilla x={93.4} y={85.4} />
          <Frutilla x={101.6} y={84.8} />
          <Naranja x={89.6} y={89.4} r={4} />
          <Naranja x={97.4} y={88.8} r={4.2} c="#f97316" />
          <Naranja x={105} y={89.6} r={3.6} c="#a3e635" />
          <path d="M84 89.6H111L108.6 96H86.4Z" fill="#b7793d" />
          {[91.6, 93.8].map((y) => (
            <path key={y} d={`M85 ${y}H110`} stroke="#8a5525" strokeWidth=".5" />
          ))}
          {[89, 94, 99, 104].map((x) => (
            <path key={x} d={`M${x} 89.8L${x + 1} 95.8`} stroke="#d39a5c" strokeWidth=".7" />
          ))}

          {/* la licuadora: el motor queda; la jarra se mueve */}
          <path d="M121 96L122.6 84H137.4L139 96Z" fill={u('ba')} />
          <rect x="121.6" y="83" width="16.8" height="2.4" rx="1" fill="#cbd5e1" />
          <circle cx="130" cy="90.4" r="2.2" fill="#94a3b8" />
          <circle cx="130" cy="90.4" r="1" fill="#e2e8f0" />
          <circle cx="124.6" cy="93" r=".8" fill="#22c55e" />
          <circle cx="135.4" cy="93" r=".8" fill="#ef4444" />
          {/* las rayitas del temblor mientras licúa */}
          <g className="esc-jugo-vibra">
            <path
              d="M118 84Q116.6 88 118 92M115.4 85.4Q114 88 115.4 90.6M142 84Q143.4 88 142 92M144.6 85.4Q146 88 144.6 90.6"
              fill="none"
              stroke="#e11d48"
              strokeWidth=".7"
              strokeLinecap="round"
            />
          </g>

          <g className="esc-jugo-jarra">
            {/* caja fija para el pivote (abajo a la derecha = la base de la jarra) */}
            <rect x="100" y="20" width="41" height="64" fill="none" />
            {/* el asa */}
            <path d="M123 60H118.6Q117.4 60 117.4 61.4V74Q117.4 75.6 119 76L124 77.4" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
            {/* el interior: frutillas que caen, el jugo y su remolino */}
            <path d="M122.6 56H137.4L135.4 83.4H124.6Z" fill="#e0f2fe" opacity=".35" />
            {CAEN.map(([x, y, d]) => (
              <g key={x} className="esc-jugo-cae" style={{ animationDelay: d }}>
                <Frutilla x={x} y={y} />
              </g>
            ))}
            <g clipPath={`url(#${g('cj')})`}>
              <g className="esc-jugo-nivel">
                <rect x="120" y="64" width="20" height="20" fill={u('ju')} />
                <rect x="120" y="64" width="20" height="1.4" fill="#fecdd3" opacity=".8" />
              </g>
              <g className="esc-jugo-remolino">
                <path d="M124 65Q130 70 130 83Q130 70 136 65Z" fill="#fda4af" opacity=".75" />
                <g className="esc-jugo-giro">
                  <path d="M124.6 69Q130 71.4 135.4 69M125.6 74Q130 76 134.4 74M126.6 79Q130 80.6 133.4 79" fill="none" stroke="#fff" strokeWidth=".8" strokeLinecap="round" opacity=".8" />
                </g>
                <g className="esc-jugo-giro" style={{ animationDelay: '-.17s' }}>
                  <circle cx="127" cy="72" r=".9" fill="#be123c" />
                  <circle cx="133" cy="77" r=".8" fill="#fde68a" />
                  <circle cx="129" cy="80" r=".7" fill="#be123c" />
                </g>
              </g>
            </g>
            {/* el vidrio: rayitas de medida, luz y borde */}
            {[64, 70, 76].map((y) => (
              <rect key={y} x="133.6" y={y} width="2.4" height=".6" fill="#fff" opacity=".8" />
            ))}
            <rect x="124" y="57" width="1.6" height="25" rx=".8" fill="#fff" opacity=".6" />
            <path d="M122.6 56H137.4L135.4 83.4H124.6Z" fill="none" stroke="#e2e8f0" strokeWidth=".9" />
            <path d="M137.4 56L140.6 54.2L137 58Z" fill="#e2e8f0" />
            {/* la tapa, que se levanta para que entre la fruta */}
            <g className="esc-jugo-tapa">
              <rect x="121.4" y="52.4" width="17.2" height="4" rx="1.4" fill="#334155" />
              <rect x="127.6" y="50" width="4.8" height="2.8" rx="1" fill="#1e293b" />
              <rect x="122.4" y="52.8" width="15" height=".9" rx=".45" fill="#64748b" />
            </g>
          </g>
          {/* el chorro de jugo hacia el vaso */}
          <rect className="esc-jugo-chorro" x="165.2" y="60" width="1.8" height="34" rx=".9" fill={u('ju')} />

          {/* el vaso alto que se vende: se llena, le cae la pajita, se desliza al cliente */}
          <g transform="translate(166 96)">
            <g className="esc-jugo-vaso">
              <path d="M-6-24H6L4.6 0H-4.6Z" fill="#f0f9ff" opacity=".55" />
              <g clipPath={`url(#${g('cv')})`}>
                <g className="esc-jugo-lleno">
                  <rect x="-6" y="-21" width="12" height="21" fill={u('ju')} />
                  <rect x="-6" y="-21" width="12" height="2.2" fill="#fecdd3" />
                  <circle cx="-2" cy="-12" r=".7" fill="#fecdd3" opacity=".8" />
                  <circle cx="2.4" cy="-7" r=".6" fill="#fecdd3" opacity=".8" />
                </g>
              </g>
              <g className="esc-jugo-pajita">
                <path d="M1.4-6L6.6-33" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M1.4-6L6.6-33" stroke="#ec4899" strokeWidth="1.7" strokeDasharray="1.6 1.6" />
                <Frutilla x={-4.6} y={-25.4} k={0.95} />
              </g>
              <rect x="-4.6" y="-22.6" width="1.3" height="20" rx=".6" fill="#fff" opacity=".7" />
              <path d="M-6-24H6L4.6 0H-4.6Z" fill="none" stroke="#e2e8f0" strokeWidth=".8" />
              <rect x="-6.4" y="-24.6" width="12.8" height="1.2" rx=".6" fill="#fff" />
            </g>
          </g>

          {/* la venta: aro y destellos donde para el vaso */}
          <ellipse className="esc-jugo-aro" cx="212" cy="96" rx="12" ry="3.4" fill="none" stroke="#f97316" strokeWidth="1.3" />
          <g transform="translate(200 70)">
            <path className="esc-jugo-destello" d={ESTRELLA} fill="#facc15" />
          </g>
          <g transform="translate(224 64)">
            <path className="esc-jugo-destello" d={ESTRELLA} fill="#fb7185" style={{ animationDelay: '-6.35s' }} />
          </g>

          {/* el QR de cobro, colgado del poste */}
          <path d="M224.2 62L225.6 68.4M226.2 62L236 68.4" stroke="#7c2d12" strokeWidth=".5" />
          <rect x="223.4" y="68" width="14.4" height="14.4" rx="1.6" fill="#fff" />
          <path d="M225.4 70h4v4h-4zM231.8 70h4v4h-4zM225.4 76.4h4v4h-4zM232.2 76.8h1.5v1.5h-1.5zM234.2 78.8h1.5v1.5h-1.5zM232.2 79.4h1.5v1h-1.5z" fill="#14532d" />

          {/* la mano del cliente, que entra a buscar su jugo */}
          <g className="esc-jugo-mano">
            {/* la manga sube hacia afuera: el cliente está del otro lado del mostrador */}
            <path d="M227 77.4L320 62V84L227 90.2Z" fill="#8b5cf6" />
            <path d="M227 77.4L320 62V65.4L227 80.4Z" fill="#a78bfa" opacity=".8" />
            <path d="M244 87.4L262 84.6" stroke="#6d28d9" strokeWidth=".7" strokeLinecap="round" opacity=".6" />
            <rect x="224" y="77" width="5" height="13.4" rx="2" fill="#ede9fe" />
            <path d="M224.4 79.4C221 78.6 218 79 216.6 80.6V88.6C218.4 90 222 90 224.4 89Z" fill="#d6a07a" />
            {[80.4, 83.2, 86, 88.6].map((y, i) => (
              <rect key={y} x={i === 3 ? 209.6 : 208.4} y={y} width={i === 3 ? 9 : 10.4} height="2.6" rx="1.3" fill={i % 2 ? '#d6a07a' : '#e0ad88'} />
            ))}
            <path d="M216 80C214 77.4 211 77 209.6 78C210.4 80 213 81.4 216 81.6Z" fill="#c98e66" />
          </g>

          {/* ---------- los cajones de fruta (izquierda) ---------- */}
          {[19.4, 26.4, 33.4, 40.4, 47.4, 54.4].map((x, i) => (
            <Naranja key={x} x={x + 1} y={121.6 - (i % 2) * 1.2} r={4.2} c={i === 3 ? '#f97316' : '#fb923c'} />
          ))}
          <Cajon x={14} y={122} w={50} h={24} />
          {[24, 30, 36, 42, 48].map((x, i) => (
            <Frutilla key={x} x={x} y={102.6 - (i % 2) * 1.2} k={1.15} />
          ))}
          <Cajon x={20} y={104} w={34} h={18} />
          <Pina x={64} y={146} k={1.25} />

          {/* ---------- el cajón de plátanos y la sandía (derecha) ---------- */}
          {[
            [244, 119],
            [256, 118],
          ].map(([x, y]) => (
            <Racimo key={x} x={x} y={y} />
          ))}
          <Cajon x={238} y={122} w={52} h={24} />
          <g transform="translate(278 122)">
            <path d="M-11 0A11 11 0 0 1 11 0Z" fill="#15803d" />
            <path d="M-9.8 0A9.8 9.8 0 0 1 9.8 0Z" fill="#bbf7d0" />
            <path d="M-8.8 0A8.8 8.8 0 0 1 8.8 0Z" fill="#f43f5e" />
            {[
              [-4, -3],
              [0, -5],
              [4, -3],
              [-1.6, -2],
              [2, -2.4],
            ].map(([x, y]) => (
              <ellipse key={`${x}${y}`} cx={x} cy={y} rx=".5" ry=".8" fill="#1f2937" />
            ))}
            <rect x="-11" y="-.6" width="22" height="1.2" rx=".6" fill="#fda4af" />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Jugo de frutilla" texto="Bs 10" tono="ambar" />
    </Marco>
  )
}
