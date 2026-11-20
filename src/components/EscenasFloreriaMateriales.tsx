import './EscenasFloreriaMateriales.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escenas animadas de la florería y de la barraca de materiales de construcción
  (SVG propio). Todo se mueve con CSS (sólo transform y opacity); los keyframes
  `esc-flor-*` y `esc-mat-*` viven en EscenasFloreriaMateriales.css y los
  compartidos `esc-*` en index.css. Son decorativas: el Marco ya las marca con
  aria-hidden.

  Ojo con `.escena svg *` (transform-box: fill-box; origin al centro): un
  rotate()/scale() del atributo `transform` gira cada pieza sobre el centro de
  SU caja. Por eso los pétalos se calculan a mano (`petalo`) en vez de girarlos
  alrededor del centro de la flor.
*/

/** Chispa de cuatro puntas, chica (destellos de la venta). */
const ESTRELLA = 'M0-6L1.6-1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6-1.6Z'

const r2 = (n: number) => Math.round(n * 100) / 100
const rad = (g: number) => (g * Math.PI) / 180

/**
 * Pétalo (u hoja) que nace en (0, 0) y apunta hacia `a` grados (0 = arriba,
 * sentido horario), de largo `l` y medio ancho `w`. Se calcula el camino ya
 * girado: así no depende del transform-origin.
 */
function petalo(a: number, l: number, w: number): string {
  const dx = Math.sin(rad(a))
  const dy = -Math.cos(rad(a))
  const nx = Math.cos(rad(a))
  const ny = Math.sin(rad(a))
  const p = (t: number, k: number) => `${r2(dx * l * t + nx * w * k)} ${r2(dy * l * t + ny * w * k)}`
  return `M0 0C${p(0.3, 1)} ${p(0.85, 0.8)} ${p(1, 0)}C${p(0.85, -0.8)} ${p(0.3, -1)} 0 0Z`
}

/** Generador pseudoaleatorio fijo (mismas piedritas en cada render). */
function semillas(n: number, s: number) {
  let x = s
  return Array.from({ length: n }, () => {
    x = (x * 9301 + 49297) % 233280
    return x / 233280
  })
}

/* ======================================================================
   Florería
   ====================================================================== */

type Tipo = 'rosa' | 'girasol' | 'lirio' | 'tulipan' | 'margarita' | 'nube'

const ANG_GIRASOL = Array.from({ length: 12 }, (_, k) => k * 30)
const ANG_LIRIO = [0, 60, 120, 180, 240, 300]
const ANG_MARGARITA = Array.from({ length: 10 }, (_, k) => k * 36)
const ANG_CINCO = [0, 72, 144, 216, 288]

/** La cabeza de cada flor, centrada en (0, 0). */
function Cabeza({ t, c = '#e11d48' }: { t: Tipo; c?: string }) {
  if (t === 'rosa')
    return (
      <g>
        <path d="M-3.6-.4C-4-3.4-2-5 0-4.8C2-5 4-3.4 3.6-.4C3 1.8 1.4 2.8 0 2.8C-1.4 2.8-3 1.8-3.6-.4Z" fill={c} />
        <path d="M-3.6-.4C-2.4 1.4 2.4 1.4 3.6-.4C3 1.8 1.4 2.8 0 2.8C-1.4 2.8-3 1.8-3.6-.4Z" fill="#4c0519" opacity=".22" />
        <path d="M-2.3-2.3C-1.4-3.7 1.4-3.7 2.3-2.3C1.5-1.1-.3-1.3-.6-2.3" fill="none" stroke="#4c0519" strokeOpacity=".35" strokeWidth=".5" strokeLinecap="round" />
        <path d="M-3.1-.9C-2.4.5-.9 1.1.6.9M3.1-.9C2.6.2 1.8.7 1 .9" fill="none" stroke="#4c0519" strokeOpacity=".25" strokeWidth=".4" strokeLinecap="round" />
        <ellipse cx="-1.6" cy="-3.5" rx="1.1" ry=".5" fill="#fff" opacity=".4" />
      </g>
    )
  if (t === 'girasol')
    return (
      <g>
        {ANG_GIRASOL.map((a, k) => (
          <ellipse
            key={a}
            cx={r2(3.5 * Math.sin(rad(a)))}
            cy={r2(-3.5 * Math.cos(rad(a)))}
            rx=".95"
            ry="2.1"
            fill={k % 2 ? '#f59e0b' : '#fcc419'}
            transform={`rotate(${a})`}
          />
        ))}
        <circle r="2.5" fill="#7a3e16" />
        <circle r="1.7" fill="#4a2510" />
        {[
          [-0.7, -0.5],
          [0.6, -0.8],
          [0.2, 0.6],
          [-0.8, 0.7],
          [0.9, 0.4],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r=".28" fill="#a0612e" />
        ))}
        <circle cx="-.9" cy="-1" r=".7" fill="#fff" opacity=".25" />
      </g>
    )
  if (t === 'lirio')
    return (
      <g>
        {ANG_LIRIO.map((a) => (
          <path key={a} d={petalo(a, 4.6, 1.5)} fill="#fffafc" stroke="#f5b8cb" strokeWidth=".3" />
        ))}
        {ANG_LIRIO.map((a) => (
          <path key={a} d={petalo(a, 2.8, 0.45)} fill={c} opacity=".75" />
        ))}
        {[-30, 0, 30].map((a) => (
          <g key={a}>
            <path d={`M0 0L${r2(2.4 * Math.sin(rad(a)))} ${r2(-2.4 * Math.cos(rad(a)))}`} stroke="#a3d977" strokeWidth=".3" />
            <circle cx={r2(2.6 * Math.sin(rad(a)))} cy={r2(-2.6 * Math.cos(rad(a)))} r=".45" fill="#e8772e" />
          </g>
        ))}
      </g>
    )
  if (t === 'tulipan')
    return (
      <g>
        <path d="M-2.4 1C-2.9-1-2.7-2.9-2.2-4.2L-1.1-2.6L0-4.6L1.1-2.6L2.2-4.2C2.7-2.9 2.9-1 2.4 1C1.6 2.2-1.6 2.2-2.4 1Z" fill={c} />
        <path d="M0-4.6L1.1-2.6L2.2-4.2C2.7-2.9 2.9-1 2.4 1C1.6 2.2.4 2.3 0 2.2Z" fill="#000" opacity=".12" />
        <path d="M-1.5-2.4C-1.7-1-1.5.4-1 1.2" fill="none" stroke="#fff" strokeWidth=".45" strokeLinecap="round" opacity=".55" />
      </g>
    )
  if (t === 'margarita')
    return (
      <g>
        {ANG_MARGARITA.map((a) => (
          <path key={a} d={petalo(a, 2.7, 0.8)} fill="#fff" stroke="#e2e8f0" strokeWidth=".2" />
        ))}
        <circle r="1.15" fill={c} />
        <circle cx="-.35" cy="-.35" r=".4" fill="#fff6c2" opacity=".7" />
      </g>
    )
  // nube: la paniculata, un racimo de puntitos blancos
  return (
    <g>
      {[
        [0, 0],
        [-1.6, 0.6],
        [1.5, 0.5],
        [-0.8, -1.3],
        [0.9, -1.2],
        [0.1, 1.4],
        [-2.3, -0.9],
        [2.2, -0.8],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r=".72" fill="#fff" stroke="#e2e8f0" strokeWidth=".2" />
      ))}
    </g>
  )
}

/**
 * Balde de zinc lleno de flores, con la base en (x, y). Primero va la boca
 * oscura, después los tallos y las cabezas (de las más altas, que están
 * atrás, a las más bajas) y al final el cuerpo del balde tapando los tallos.
 */
function BaldeFlores({
  x,
  y,
  tipo,
  colores,
  flores,
  zinc,
  esc = 0.82,
}: {
  x: number
  y: number
  tipo: Tipo
  colores: string[]
  flores: [number, number][]
  zinc: string
  esc?: number
}) {
  const boca = y - 13
  const orden = flores.map((f, i) => [...f, i] as const).sort((a, b) => b[1] - a[1])
  return (
    <g>
      <ellipse cx={x} cy={boca} rx="7.4" ry="1.7" fill="#3f4a55" />
      {/* hojas de relleno que asoman del balde */}
      {[-60, -25, 25, 60].map((a, k) => (
        <path key={a} transform={`translate(${x + (k - 1.5) * 2.2} ${boca + 0.4})`} d={petalo(a, 6, 1.5)} fill={k % 2 ? '#3f8f4e' : '#5fae5c'} />
      ))}
      {orden.map(([dx, h, i]) => (
        <g key={i}>
          <path d={`M${r2(x + dx * 0.3)} ${boca + 1}Q${r2(x + dx * 0.7)} ${r2(boca - h * 0.5)} ${x + dx} ${boca - h}`} fill="none" stroke="#3f8f4e" strokeWidth=".7" />
          <g transform={`translate(${x + dx} ${boca - h}) scale(${esc})`}>
            <Cabeza t={tipo} c={colores[i % colores.length]} />
          </g>
        </g>
      ))}
      {/* el balde */}
      <path d={`M${x - 7.4} ${boca}L${x - 5.6} ${y}H${x + 5.6}L${x + 7.4} ${boca}Z`} fill={zinc} />
      {[4, 9].map((t) => {
        const w = 7.4 - (1.8 * t) / 13
        return <path key={t} d={`M${r2(x - w)} ${boca + t}H${r2(x + w)}`} stroke="#8b96a3" strokeWidth=".55" />
      })}
      <path d={`M${x - 7.6} ${boca}A7.6 1.8 0 0 0 ${x + 7.6} ${boca}`} fill="none" stroke="#eef2f6" strokeWidth=".9" />
      <path d={`M${x - 6.4} ${boca + 1.6}L${x - 5} ${y - 0.6}`} stroke="#fff" strokeWidth="1.1" opacity=".45" strokeLinecap="round" />
      {/* la etiqueta del precio */}
      <rect x={x + 0.6} y={boca + 4.8} width="4.6" height="3" rx=".5" fill="#fff" stroke="#f48fb1" strokeWidth=".3" />
      <path d={`M${x + 1.4} ${boca + 6.3}H${x + 4.4}`} stroke="#e75480" strokeWidth=".45" />
    </g>
  )
}

/** Maceta chiquita de la vidriera, con la base en (0, 0). */
function Maceta({ p }: { p: 'suc' | 'cac' | 'hel' | 'orq' }) {
  return (
    <g>
      {p === 'suc' &&
        [-70, -35, 0, 35, 70].map((a) => <path key={a} transform="translate(0 -5)" d={petalo(a, 3.4, 1.1)} fill={a === 0 ? '#9ad3a5' : '#6fbf87'} />)}
      {p === 'cac' && (
        <g>
          <rect x="-1.6" y="-12" width="3.2" height="7.4" rx="1.6" fill="#4f9d69" />
          <path d="M1.6-8.6H3.2V-11C3.2-11.8 4.4-11.8 4.4-11V-8.2C4.4-7.4 3.8-7.2 3.2-7.2H1.6Z" fill="#4f9d69" />
          <path d="M-.4-11.4V-6" stroke="#8fd1a2" strokeWidth=".4" />
          <circle cx="0" cy="-12.2" r=".8" fill="#f472b6" />
        </g>
      )}
      {p === 'hel' &&
        [-55, -25, 0, 25, 55].map((a) => <path key={a} transform="translate(0 -5)" d={petalo(a, 6.4, 0.9)} fill="#4fa45c" />)}
      {p === 'orq' && (
        <g>
          <path d="M0-5C.4-8 1.6-11 3-12.6" fill="none" stroke="#5f8f4e" strokeWidth=".45" />
          {[
            [1.2, -9.2],
            [2.8, -12],
          ].map(([x, y]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              {ANG_CINCO.map((a) => (
                <path key={a} d={petalo(a, 1.5, 0.7)} fill="#e9a6e0" />
              ))}
              <circle r=".4" fill="#a3367f" />
            </g>
          ))}
          <path transform="translate(0 -5)" d={petalo(-70, 4, 1.2)} fill="#4f9d69" />
          <path transform="translate(0 -5)" d={petalo(70, 4, 1.2)} fill="#4f9d69" />
        </g>
      )}
      <path d="M-3.2-5H3.2L2.6 0H-2.6Z" fill="#c8714a" />
      <rect x="-3.6" y="-5.6" width="7.2" height="1.4" rx=".5" fill="#de8a5f" />
      <path d="M-2.4-4.2L-2-.6" stroke="#fff" strokeWidth=".5" opacity=".3" />
    </g>
  )
}

/**
 * Maceta colgante (macramé) con el gancho en (0, 0): las cuerdas, la maceta y
 * las guías que cuelgan con sus hojitas.
 */
function Colgante({ flor }: { flor: string }) {
  return (
    <g>
      <path d="M0 0L-4.6 10M0 0L4.6 10M0 0V10.4" stroke="#b08c62" strokeWidth=".45" />
      <circle cx="0" cy="0" r=".8" fill="none" stroke="#7c5a3a" strokeWidth=".5" />
      {/* las guías que caen */}
      {[
        ['M-4 11C-6 15-5.4 20-6.6 25', -6.6, 25],
        ['M-2 12C-2.6 17-1.4 21-2.4 27', -2.4, 27],
        ['M3.6 11.6C5.4 16 4.6 19 5.8 23', 5.8, 23],
      ].map(([d, ex, ey]) => (
        <g key={d as string}>
          <path d={d as string} fill="none" stroke="#3f8f4e" strokeWidth=".5" />
          {[0.3, 0.55, 0.8, 1].map((t) => {
            const yy = 11 + ((ey as number) - 11) * t
            const xx = (ex as number) * (0.55 + 0.45 * t) + (t * 10) % 2 * 0.3
            return <path key={t} transform={`translate(${r2(xx)} ${r2(yy)})`} d={petalo(t * 100 % 2 ? 120 : -120, 2.2, 0.9)} fill={t > 0.7 ? '#5fae5c' : '#3f8f4e'} />
          })}
        </g>
      ))}
      {/* el follaje de arriba */}
      {[-60, -30, 0, 30, 60].map((a) => (
        <path key={a} transform="translate(0 10)" d={petalo(a, 4.6, 1.5)} fill={a % 60 ? '#5fae5c' : '#3f8f4e'} />
      ))}
      {[
        [-2.4, 7],
        [2.2, 6.4],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r=".9" fill={flor} />
      ))}
      <path d="M-5 10H5L3.8 16.4H-3.8Z" fill="#f4ece1" />
      <path d="M-5 10H5L4.8 11.4H-4.8Z" fill="#e0d3c0" />
      <path d="M-4.2 12V15.4" stroke="#fff" strokeWidth=".8" opacity=".6" />
      <path d="M-4.4 13.4H4.4" stroke="#f48fb1" strokeWidth=".6" />
    </g>
  )
}

/** Canasta de mimbre con flores (arreglo), con la base en (0, 0) y `w` de ancho. */
function Canasta({ w, flores, mimbre }: { w: number; flores: [Tipo, string, number, number][]; mimbre: string }) {
  const m = w / 2
  return (
    <g>
      <path d={`M${-m + 1} -8C${-m + 1} -20 ${m - 1} -20 ${m - 1} -8`} fill="none" stroke="#a87443" strokeWidth="1.2" />
      {flores.map(([t, c, x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(.78)`}>
          <Cabeza t={t} c={c} />
        </g>
      ))}
      {[-50, 50].map((a) => (
        <path key={a} transform={`translate(${a < 0 ? -m + 3 : m - 3} -8)`} d={petalo(a, 4.4, 1.3)} fill="#4f9d69" />
      ))}
      <path d={`M${-m} -8H${m}L${m - 2} 0H${-m + 2}Z`} fill={mimbre} />
      {[-5.6, -3].map((y) => (
        <path key={y} d={`M${-m + 0.8} ${y}H${m - 0.8}`} stroke="#8a5a26" strokeWidth=".5" opacity=".7" />
      ))}
      {Array.from({ length: Math.floor(w / 4) }, (_, k) => -m + 2.5 + k * 4).map((x) => (
        <path key={x} d={`M${r2(x)} -7.6L${r2(x * 0.9)} -.4`} stroke="#f0c486" strokeWidth=".55" opacity=".6" />
      ))}
      <rect x={-m - 0.6} y="-9" width={w + 1.2} height="1.8" rx=".9" fill="#d9a066" />
    </g>
  )
}

/** Las flores de los baldes de la tarima: [x, base, tipo, colores, flores]. */
const BALDES_ATRAS: [number, number, Tipo, string[], [number, number][]][] = [
  [32, 111.6, 'rosa', ['#e11d48', '#be123c'], [[-4.4, 8], [0, 10.6], [4.4, 8], [-2.3, 13.6], [2.4, 14]]],
  [50, 111.6, 'girasol', ['#fcc419'], [[-3.8, 9], [3.9, 9.4], [0, 14.6]]],
  [68, 111.6, 'lirio', ['#f472b6'], [[-3.8, 8.4], [3.8, 10], [-0.2, 14.4]]],
]
const BALDES_FRENTE: [number, number, Tipo, string[], [number, number][]][] = [
  [26, 129.6, 'tulipan', ['#f472b6', '#ec4899'], [[-4, 7], [0, 9], [4, 7], [-2.1, 11.6], [2.1, 11.8]]],
  [44, 129.6, 'margarita', ['#facc15'], [[-4, 6.6], [0, 8.6], [4, 6.6], [-2, 11], [2, 11.2], [0, 13.6]]],
  [62, 129.6, 'rosa', ['#fb7185', '#f43f5e'], [[-4, 7], [0, 9], [4, 7], [-2.2, 11.6], [2.2, 11.8]]],
]

/** Las focos de la guirnalda de la vidriera (sobre la curva de la cuerda). */
const FOCOS = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 0.5) / 9
  return { x: r2(88 + 66 * t), y: r2(78.5 + 2 * (1 - t) * t * 5.5), d: `${-(i * 0.37).toFixed(2)}s` }
})

/**
 * Una florería de barrio: el letrero, el toldo rosado con festón, la vidriera
 * con macetas y guirnalda de luces, la puerta con su corona, dos macetas
 * colgantes, la tarima de baldes de zinc (rosas rojas y rosadas, girasoles,
 * lirios, tulipanes y margaritas), arreglos en canasta, la mesa de trabajo con
 * el rollo de papel kraft, la tijera y el carrete de cinta, y la moto de
 * reparto con su canasta junto a la puerta.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): de los baldes saltan, de a una,
 * una rosa, un girasol y un lirio y se juntan en la mesa; brota el follaje,
 * el papel kraft envuelve el ramo, la tijera corta la cinta y aparece el
 * moño. El ramo salta en arco a la canasta de la moto, cae el pin de la
 * dirección de entrega y llega el aviso; la moto sale con el ramo y vuelve
 * vacía por el siguiente.
 */
export function EscenaFloreria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco fondo="bg-gradient-to-b from-rose-100 via-pink-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff8fa" />
            <stop offset="1" stopColor="#f8d9e2" />
          </linearGradient>
          {/* fachada verde salvia, con la luz que entra por la izquierda */}
          <linearGradient id={g('fa')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#eef7f0" />
            <stop offset="1" stopColor="#cfe5d6" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9fc6ae" />
            <stop offset="1" stopColor="#b6d6c2" />
          </linearGradient>
          <linearGradient id={g('in')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a5847" />
            <stop offset="1" stopColor="#1d4033" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d8f0ea" />
            <stop offset="1" stopColor="#8fc4b6" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c08b5a" />
            <stop offset="1" stopColor="#94643a" />
          </linearGradient>
          <linearGradient id={g('mc')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e6b887" />
            <stop offset="1" stopColor="#c8935f" />
          </linearGradient>
          <linearGradient id={g('kr')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9c48f" />
            <stop offset=".6" stopColor="#d4a066" />
            <stop offset="1" stopColor="#b9834c" />
          </linearGradient>
          <linearGradient id={g('zn')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e6ebf0" />
            <stop offset=".5" stopColor="#b9c3cd" />
            <stop offset="1" stopColor="#8e9aa6" />
          </linearGradient>
          <linearGradient id={g('mi')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e2b57d" />
            <stop offset="1" stopColor="#b98448" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7fd6bd" />
            <stop offset=".6" stopColor="#3fa98d" />
            <stop offset="1" stopColor="#2b8670" />
          </linearGradient>
          <linearGradient id={g('pn')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fb7aa5" />
            <stop offset="1" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={g('lu')}>
            <stop offset="0" stopColor="#ffe3a3" stopOpacity=".55" />
            <stop offset="1" stopColor="#ffe3a3" stopOpacity="0" />
          </radialGradient>
          <clipPath id={g('cv')}>
            <rect x="88" y="76" width="66" height="42" />
          </clipPath>
        </defs>

        {/* plataforma: losa rosada con su canto y las sombras de contacto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#efc0cd" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".4" />
        <ellipse className="esc-flor-sombra" cx="134" cy="146.4" rx="66" ry="5.6" fill="#7a1f3d" opacity=".12" />
        <ellipse cx="50" cy="146.6" rx="40" ry="4.4" fill="#7a1f3d" opacity=".13" />

        <g className="esc-flor-flota">
          {/* ---------- el local ---------- */}
          <path d="M74 70L82 65V146L74 149Z" fill={u('la')} />
          <rect x="82" y="62" width="116" height="84" fill={u('fa')} />
          {[100, 118, 136, 154, 172, 190].map((x) => (
            <path key={x} d={`M${x} 72V140`} stroke="#b9d6c4" strokeWidth=".4" opacity=".6" />
          ))}
          <rect x="82" y="62" width="2.4" height="84" fill="#fff" opacity=".55" />
          <rect x="82" y="140" width="116" height="6" fill="#a9cbb6" />
          <rect x="82" y="140" width="116" height=".8" fill="#fff" opacity=".5" />

          {/* la vidriera: guirnalda de luces, repisa de macetas y floreros */}
          <rect x="86" y="74" width="70" height="46" rx="1.6" fill="#8a6440" />
          <rect x="88" y="76" width="66" height="42" fill={u('in')} />
          <ellipse className="esc-flor-halo" cx="121" cy="80" rx="34" ry="12" fill={u('lu')} />
          <path d="M88 78.5Q121 84 154 78.5" fill="none" stroke="#d6c7a1" strokeWidth=".4" />
          {FOCOS.map((f) => (
            <g key={f.x}>
              <circle className="esc-flor-foco" cx={f.x} cy={f.y + 1} r="1.8" fill="#ffd98a" opacity=".5" style={{ animationDelay: f.d }} />
              <circle cx={f.x} cy={f.y + 1} r=".85" fill="#fff3c4" />
            </g>
          ))}
          {(['suc', 'cac', 'hel', 'orq', 'suc', 'hel'] as const).map((p, i) => (
            <g key={i} transform={`translate(${94 + i * 10.6} 96)`}>
              <Maceta p={p} />
            </g>
          ))}
          <rect x="88" y="96" width="66" height="2.2" fill={u('mc')} />
          <rect x="88" y="98.2" width="66" height=".8" fill="#000" opacity=".2" />
          {/* floreros de vidrio con gerberas */}
          {[
            [95, '#fb923c'],
            [114, '#f472b6'],
          ].map(([x, c]) => (
            <g key={x as number} transform={`translate(${x} 116)`}>
              {[
                [-2.6, -15, -1.2],
                [0.4, -18, 0.2],
                [2.8, -14, 1],
              ].map(([hx, hy, bx]) => (
                <g key={hx}>
                  <path d={`M${bx} -8L${hx} ${hy}`} stroke="#5fae5c" strokeWidth=".5" />
                  <g transform={`translate(${hx} ${hy}) scale(.85)`}>
                    <Cabeza t="margarita" c={c as string} />
                  </g>
                </g>
              ))}
              <path d="M-2.8 0C-3.8-3.4-3-6.6-2-9H2C3-6.6 3.8-3.4 2.8 0Z" fill="#d8f0ea" opacity=".45" />
              <path d="M-3.3-4.4H3.3C3.3-1.6 3.1-.4 2.8 0H-2.8C-3.1-.4-3.3-1.6-3.3-4.4Z" fill="#9fd8e8" opacity=".5" />
              <path d="M-1.8-8V-1.4" stroke="#fff" strokeWidth=".6" opacity=".7" />
            </g>
          ))}
          {/* reflejo del vidrio y el brillo que lo cruza */}
          <path d="M88 76H104L92 118H88Z" fill="#fff" opacity=".12" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(76 76)">
              <g className="esc-flor-brillo" style={v({ '--d': '92px' })}>
                <path d="M0 0H8L-4 42H-12Z" fill={u('gl')} />
              </g>
            </g>
          </g>

          {/* la puerta con la corona */}
          <rect x="160" y="75" width="32" height="71" rx="1.2" fill="#8a6440" />
          <rect x="162.4" y="77.4" width="27.2" height="68.6" fill="#2f6b55" />
          <rect x="165.4" y="80.4" width="21.2" height="33" rx="1" fill={u('vi')} />
          <path d="M165.4 80.4H174L167 113.4H165.4Z" fill="#fff" opacity=".3" />
          <rect x="166" y="117.4" width="20" height="23" rx="1" fill="none" stroke="#24533f" strokeWidth=".8" />
          <rect x="184.8" y="115" width="1.6" height="6.4" rx=".8" fill="#e8c26a" />
          <circle cx="176" cy="97" r="5.2" fill="none" stroke="#3f8f4e" strokeWidth="2.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <circle key={a} cx={r2(176 + 5.2 * Math.sin(rad(a)))} cy={r2(97 - 5.2 * Math.cos(rad(a)))} r=".7" fill={a % 90 ? '#5fae5c' : '#e11d48'} />
          ))}
          <path d="M176 102.2L173.6 104.4L174.6 105L176 103.4L177.4 105L178.4 104.4Z" fill="#f472b6" />
          <rect x="158" y="144.2" width="36" height="1.8" rx=".6" fill="#93b8a2" />

          {/* el toldo a rayas con su festón */}
          {Array.from({ length: 10 }, (_, i) => {
            const w = 118 / 10
            const x = 80 + w * i
            const c = i % 2 === 0 ? '#f48fb1' : '#fff5f8'
            return (
              <g key={i}>
                <path d={`M${r2(x + 2 - i * 0.4)} 62H${r2(x + w + 2 - (i + 1) * 0.4)}L${r2(x + w)} 70H${r2(x)}Z`} fill={c} />
                <path d={`M${r2(x)} 70a${r2(w / 2)} ${r2(w / 3)} 0 0 0 ${r2(w)} 0Z`} fill={c} />
              </g>
            )
          })}
          <rect x="80" y="69.6" width="118" height="1" fill="#7a1f3d" opacity=".1" />
          <rect x="78" y="57.6" width="122" height="4.6" rx="1" fill="#24533f" />
          <rect x="78" y="57.6" width="122" height="1.2" rx=".6" fill="#3f7a62" />

          {/* letrero (corrido a la izquierda: el aviso asoma a la derecha) */}
          <rect x="84" y="55" width="1.6" height="3" fill="#24533f" />
          <rect x="154" y="55" width="1.6" height="3" fill="#24533f" />
          <rect x="70" y="40.6" width="100" height="16" rx="4" fill="#24553f" />
          <rect x="68" y="38.4" width="104" height="4" rx="2" fill="#f48fb1" />
          <rect x="72" y="54" width="96" height="1.2" rx=".6" fill="#123326" opacity=".6" />
          <text x="120" y="53" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff1f5" textLength="64" lengthAdjust="spacing">
            FLORERÍA
          </text>
          {[80, 160].map((x) => (
            <g key={x} transform={`translate(${x} 48.6)`}>
              <path transform="translate(0 1)" d={petalo(x < 120 ? 135 : -135, 4, 1.2)} fill="#5fae5c" />
              {ANG_CINCO.map((a) => (
                <path key={a} d={petalo(a, 2.8, 1.2)} fill="#f9a8c9" />
              ))}
              <circle r=".9" fill="#fcd34d" />
            </g>
          ))}

          {/* las dos macetas colgantes, que se mecen */}
          {[
            [87, '#f472b6', '0s'],
            [195, '#fbbf24', '-1.4s'],
          ].map(([x, c, d]) => (
            <g key={x as number} transform={`translate(${x} 71)`}>
              <g className="esc-flor-colgante" style={{ animationDelay: d as string }}>
                <Colgante flor={c as string} />
              </g>
            </g>
          ))}

          {/* ---------- la tarima de baldes (izquierda) ---------- */}
          <rect x="20" y="113" width="60" height="33" fill={u('ma')} />
          {[119, 125].map((y) => (
            <path key={y} d={`M20 ${y}H80`} stroke="#7a5230" strokeWidth=".5" opacity=".6" />
          ))}
          <rect x="18" y="111.6" width="64" height="3" rx="1" fill={u('mc')} />
          {BALDES_ATRAS.map(([x, y, t, c, f]) => (
            <BaldeFlores key={x} x={x} y={y} tipo={t} colores={c} flores={f} zinc={u('zn')} />
          ))}
          <rect x="14" y="131" width="72" height="15" fill={u('ma')} />
          <path d="M14 138.4H86" stroke="#7a5230" strokeWidth=".5" opacity=".6" />
          <rect x="14" y="131" width="2.4" height="15" fill="#fff" opacity=".15" />
          <rect x="12" y="129.6" width="76" height="3" rx="1" fill={u('mc')} />
          {BALDES_FRENTE.map(([x, y, t, c, f]) => (
            <BaldeFlores key={x} x={x} y={y} tipo={t} colores={c} flores={f} zinc={u('zn')} />
          ))}

          {/* ---------- la mesa de trabajo ---------- */}
          <rect x="102.5" y="121" width="3" height="25" fill="#7a5230" />
          <rect x="172.5" y="121" width="3" height="25" fill="#7a5230" />
          <rect x="101" y="135" width="76" height="2.2" fill={u('mc')} />
          {/* abajo: pliegos de kraft, rollos de cinta y la regadera */}
          {[0, 1.6, 3.2].map((d) => (
            <rect key={d} x={108 + d * 0.3} y={133.4 - d} width="18" height="1.6" rx=".3" fill={d === 3.2 ? '#e3b77d' : '#c99a5e'} />
          ))}
          {[
            [134, '#f472b6'],
            [139.6, '#c4b5fd'],
          ].map(([x, c]) => (
            <g key={x as number}>
              <circle cx={x as number} cy="132.4" r="2.5" fill={c as string} />
              <circle cx={x as number} cy="132.4" r=".9" fill="#fff" opacity=".8" />
            </g>
          ))}
          <g transform="translate(157 135)">
            <path d="M-4 0V-6.4H4V0Z" fill={u('zn')} />
            <path d="M4-4.6L10-9" stroke="#9aa5b1" strokeWidth="1.1" strokeLinecap="round" />
            <ellipse cx="10.4" cy="-9.4" rx="1.1" ry="1.5" fill="#b9c3cd" />
            <path d="M-3-6.4C-3-10 3-10 3-6.4" fill="none" stroke="#9aa5b1" strokeWidth=".8" />
            <path d="M-3.2-5.6V-.8" stroke="#fff" strokeWidth=".8" opacity=".5" />
          </g>
          <rect x="98" y="116" width="82" height="3.4" rx="1.2" fill={u('mc')} />
          <rect x="98" y="116" width="82" height=".8" rx=".4" fill="#f5d2a8" />
          <rect x="100" y="119.4" width="78" height="2.6" fill="#8a6440" />
          {/* el rollo de papel kraft y el pliego extendido */}
          <rect x="104" y="110.6" width="18" height="5.4" rx="2.7" fill={u('kr')} />
          <path d="M106 112.4H120" stroke="#fff" strokeWidth=".6" opacity=".35" />
          <ellipse cx="104.6" cy="113.3" rx="1.3" ry="2.7" fill="#edd0a2" />
          <ellipse cx="104.6" cy="113.3" rx=".5" ry="1" fill="#8a6440" />
          <path className="esc-flor-lamina" d="M120 116L123.6 113.8H157.4L154 116Z" fill="#e3b77d" />
          {/* la tijera (cada hoja gira sobre el perno) */}
          <g transform="translate(161 114.4)">
            <g className="esc-flor-tijera-a">
              <path d="M0 0L7-1.4L7.4-.8L.4.6Z" fill="#cbd5e1" />
              <circle cx="-3.2" cy=".9" r="1.5" fill="none" stroke="#e11d48" strokeWidth=".9" />
            </g>
            <g className="esc-flor-tijera-b">
              <path d="M0 0L7 1.4L7.4.8L.4-.6Z" fill="#e2e8f0" />
              <circle cx="-3.2" cy="-.9" r="1.5" fill="none" stroke="#f43f5e" strokeWidth=".9" />
            </g>
            <circle r=".5" fill="#64748b" />
          </g>
          {/* el carrete de cinta, que gira cuando se corta */}
          <path d="M171.2 114.6C169.6 115.4 168.4 114.8 166.8 115.6" fill="none" stroke="#ec4899" strokeWidth=".9" strokeLinecap="round" />
          <g transform="translate(174 112.6)">
            <g className="esc-flor-carrete">
              <circle r="3.2" fill={u('pn')} />
              <circle r="1.6" fill="#fbcfe8" />
              <path d="M0-1.6V-3.2M0 1.6V3.2" stroke="#9d174d" strokeWidth=".4" />
              <circle r=".6" fill="#fff" />
            </g>
          </g>

          {/* arreglos en canasta, en el piso */}
          <g transform="translate(93 146)">
            <Canasta
              w={18}
              mimbre={u('mi')}
              flores={[
                ['rosa', '#e11d48', -4.4, -11],
                ['nube', '', 0, -13.4],
                ['rosa', '#fb7185', 4.2, -11.4],
                ['margarita', '#facc15', -1, -9.6],
              ]}
            />
          </g>
          <g transform="translate(188 146)">
            <Canasta
              w={14}
              mimbre={u('mi')}
              flores={[
                ['girasol', '', -2.6, -11],
                ['girasol', '', 2.8, -12.4],
              ]}
            />
          </g>

          {/* ---------- la moto de reparto (detrás del ramo) ---------- */}
          <g className="esc-flor-moto">
            <ellipse cx="244" cy="146.4" rx="44" ry="3.6" fill="#7a1f3d" opacity=".14" />
            {/* humo del escape al arrancar */}
            <g className="esc-flor-escape-on">
              {['0s', '-.36s', '-.72s'].map((d) => (
                <circle key={d} className="esc-flor-escape" cx="211" cy="134.6" r="1.8" fill="#e2e8f0" style={{ animationDelay: d }} />
              ))}
            </g>
            <g className="esc-flor-amortigua">
              {/* ruedas */}
              {[216, 274].map((x) => (
                <g key={x}>
                  <circle cx={x} cy="139" r="6.6" fill="#1f2937" />
                  <circle cx={x} cy="139" r="3.8" fill="#cbd5e1" />
                  <g transform={`translate(${x} 139)`}>
                    <g className="esc-flor-rueda">
                      <circle r="2.4" fill="#94a3b8" />
                      <path d="M0-2.4V2.4M-2.4 0H2.4" stroke="#64748b" strokeWidth=".6" />
                    </g>
                  </g>
                  <circle cx={x} cy="139" r=".9" fill="#475569" />
                  <path d={`M${x - 5} 135.4A6 6 0 0 1 ${x + 1} 133`} fill="none" stroke="#fff" strokeWidth=".6" opacity=".25" />
                </g>
              ))}
              <path d="M266 133C268 129 280 129 282 133L281 134.4C277 131.6 270 131.6 267 134.4Z" fill={u('mo')} />
              <path d="M265.6 104L274 139" stroke="#475569" strokeWidth="1.4" />
              {/* caño de escape y pata */}
              <rect x="212" y="133.6" width="18" height="2.6" rx="1.3" fill="#9aa5b1" />
              <path d="M238 135L242 145" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
              {/* carrocería trasera, piso y escudo delantero */}
              <path d="M200 134C200 123 207 116 216 116H242C246 116 249 119 249 123V134H226C225 130 221 128 216 128C211 128 207 130 206 134Z" fill={u('mo')} />
              <path d="M206 134C207 130 211 128 216 128C221 128 225 130 226 134" fill="none" stroke="#1d5f4f" strokeWidth=".8" />
              <path d="M203 126C208 121 216 120 247 121" fill="none" stroke="#f9a8c9" strokeWidth="1.3" />
              <path d="M203.4 122C205 118.6 209 117 214 117" fill="none" stroke="#fff" strokeWidth=".9" opacity=".5" strokeLinecap="round" />
              <path d="M247 132H260L259 136H246Z" fill="#334155" />
              <path d="M256 136C256 124 258 113 262 104H268C266 114 265 125 266 136Z" fill={u('mo')} />
              <path d="M258 128C258.4 120 260 112 263 105.6" fill="none" stroke="#fff" strokeWidth=".7" opacity=".45" />
              <rect x="200.4" y="120.6" width="2" height="3.4" rx=".6" fill="#ef4444" />
              {/* manubrio, espejo y faro */}
              <path d="M266 104L264.6 98.4" stroke="#475569" strokeWidth="1.2" />
              <path d="M258.4 98.4L270.4 97.4" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M260 98.2L257.6 92.4" stroke="#475569" strokeWidth=".6" />
              <ellipse cx="257.4" cy="91.6" rx="1.7" ry="1.2" fill="#cbd5e1" stroke="#475569" strokeWidth=".4" />
              <ellipse cx="268.6" cy="106.4" rx="2" ry="2.6" fill="#fef3c7" stroke="#2b8670" strokeWidth=".6" />
              <ellipse cx="268" cy="105.6" rx=".7" ry="1" fill="#fff" />
              {/* asiento y parrilla */}
              <path d="M214 116C214 112.6 218 111.4 224 111.4H240C243 111.4 244.4 113 243.6 116Z" fill="#3b2a22" />
              <path d="M217 113.2C220 112.4 230 112.2 238 112.6" fill="none" stroke="#fff" strokeWidth=".5" opacity=".3" />
              <rect x="196" y="116.4" width="20" height="1.4" rx=".5" fill="#475569" />
              <path d="M205 117.8L209 122" stroke="#475569" strokeWidth=".9" />
              {/* la canasta: la boca oscura (el ramo entra por aquí) */}
              <ellipse cx="209" cy="103.4" rx="12.6" ry="1.8" fill="#6b4423" />
            </g>
          </g>

          {/* ---------- el ramo: se arma en la mesa y viaja a la moto ---------- */}
          <g transform="translate(140 116)">
            <g className="esc-flor-ramo-x">
              <g className="esc-flor-ramo-y">
                {/* el papel de atrás, que se abre como abanico */}
                <g className="esc-flor-papel">
                  <path d="M-9-16L-12.6-27.4C-6-31.6 6-31.6 12.6-27.4L9-16Z" fill="#c8945c" />
                  <path d="M-12.6-27.4C-6-31.6 6-31.6 12.6-27.4" fill="none" stroke="#f1d3a6" strokeWidth=".6" />
                  <path d="M-4-17L-5.4-29.6M4-17L5.4-29.6" stroke="#9c6a35" strokeWidth=".4" opacity=".5" />
                </g>
                {/* follaje y relleno: eucalipto, paniculata y dos tulipanes */}
                <g className="esc-flor-verde">
                  {[
                    [-7, -14, -40],
                    [7, -14, 40],
                    [-4, -16, -15],
                    [4, -16, 18],
                  ].map(([x, y, a]) => (
                    <path key={a} transform={`translate(${x} ${y})`} d={petalo(a, 10, 1.8)} fill={a < 0 ? '#5fae5c' : '#4f9d69'} />
                  ))}
                  <path d="M-1-3L-9.4-18.6M1-3L9.6-18" stroke="#3f8f4e" strokeWidth=".55" />
                  <g transform="translate(-9.6 -19.6)">
                    <Cabeza t="tulipan" c="#f472b6" />
                  </g>
                  <g transform="translate(9.8 -19)">
                    <Cabeza t="tulipan" c="#c084fc" />
                  </g>
                  {[
                    [-2, -30.4],
                    [6.8, -27.4],
                    [-7.6, -26],
                  ].map(([x, y]) => (
                    <g key={x} transform={`translate(${x} ${y}) scale(.75)`}>
                      <Cabeza t="nube" />
                    </g>
                  ))}
                </g>
                {/* la rosa, el girasol y el lirio: cada uno salta de su balde */}
                <g className="esc-flor-rosa-x">
                  <g className="esc-flor-rosa-y">
                    <path d="M0-2Q-3-12-5-19" fill="none" stroke="#3f8f4e" strokeWidth=".7" />
                    <path transform="translate(-3.2 -12)" d={petalo(-70, 3.6, 1.1)} fill="#4f9d69" />
                    <g transform="translate(-5 -22.5)">
                      <Cabeza t="rosa" c="#e11d48" />
                    </g>
                  </g>
                </g>
                <g className="esc-flor-girasol-x">
                  <g className="esc-flor-girasol-y">
                    <path d="M0-2Q.6-14 .5-23" fill="none" stroke="#3f8f4e" strokeWidth=".8" />
                    <path transform="translate(.5 -15)" d={petalo(65, 4, 1.3)} fill="#4f9d69" />
                    <g transform="translate(.5 -27.6)">
                      <Cabeza t="girasol" />
                    </g>
                  </g>
                </g>
                <g className="esc-flor-lirio-x">
                  <g className="esc-flor-lirio-y">
                    <path d="M0-2Q3.6-11 5.5-17.4" fill="none" stroke="#3f8f4e" strokeWidth=".7" />
                    <g transform="translate(5.5 -21.4)">
                      <Cabeza t="lirio" c="#f472b6" />
                    </g>
                  </g>
                </g>
                {/* el cono de kraft de adelante */}
                <g className="esc-flor-papel">
                  <path d="M-2.6 0L-10-17C-5-14.6 5-14.6 10-17L2.6 0Z" fill={u('kr')} />
                  <path d="M-2-1L-5.4-15.4M2-1L5.8-15.2" stroke="#9c6a35" strokeWidth=".45" opacity=".45" />
                  <path d="M-10-17C-5-14.6 5-14.6 10-17" fill="none" stroke="#fff6e6" strokeWidth=".7" />
                  <path d="M-8.6-15.6L-2.4-1.2" stroke="#fff" strokeWidth=".8" opacity=".3" />
                </g>
                {/* la cinta y el moño */}
                <g className="esc-flor-mono">
                  <path d="M-5.8-7.8H5.8L5.5-6.2H-5.5Z" fill="#ec4899" />
                  <g transform="translate(0 -7)">
                    <path d="M0 0C-3-3-6.2-1.6-5.2.4C-4.2 2-1.6 1 0 0Z" fill="#f472b6" />
                    <path d="M0 0C3-3 6.2-1.6 5.2.4C4.2 2 1.6 1 0 0Z" fill="#f472b6" />
                    <path d="M-.4.4L-2.8 5.4L-1.4 4.8L-.8 6ZM.4.4L2.8 5.4L1.4 4.8L.8 6Z" fill="#db2777" />
                    <circle r="1.1" fill="#db2777" />
                    <path d="M-4-.6C-3.4-1.4-2.4-1.4-1.6-.8" fill="none" stroke="#fff" strokeWidth=".4" opacity=".6" />
                  </g>
                </g>
              </g>
            </g>
          </g>

          {/* el frente de la canasta de la moto (tapa los tallos del ramo) */}
          <g className="esc-flor-moto">
            <g className="esc-flor-amortigua">
              <path d="M196.4 103.4H221.6L219.6 117H198.4Z" fill={u('mi')} />
              {[107, 111, 114.4].map((y) => (
                <path key={y} d={`M${r2(196.4 + (y - 103.4) * 0.147)} ${y}H${r2(221.6 - (y - 103.4) * 0.147)}`} stroke="#8a5a26" strokeWidth=".55" opacity=".7" />
              ))}
              {[200, 204.5, 209, 213.5, 218].map((x) => (
                <path key={x} d={`M${x} 104.6L${r2(209 + (x - 209) * 0.88)} 116.4`} stroke="#f0c486" strokeWidth=".55" opacity=".6" />
              ))}
              <rect x="195.4" y="102" width="27.2" height="2.4" rx="1.2" fill="#d9a066" />
              <path d="M198.4 104.6L199.6 116" stroke="#fff" strokeWidth="1" opacity=".2" />
            </g>
          </g>

          {/* la entrega: el pin de la dirección, su onda, el aro y los destellos */}
          <ellipse className="esc-flor-onda" cx="238" cy="104.4" rx="5" ry="1.4" fill="none" stroke="#db2777" strokeWidth=".9" />
          <g transform="translate(238 104)">
            <g className="esc-flor-pin">
              <path d="M0 0C-1.6-3-5.2-5.4-5.2-9.8A5.2 5.2 0 0 1 5.2-9.8C5.2-5.4 1.6-3 0 0Z" fill={u('pn')} />
              <circle cx="0" cy="-9.8" r="2.1" fill="#fff" />
              <path d="M-3.4-12C-2.8-13.4-1.6-14.2-.4-14.4" fill="none" stroke="#fff" strokeWidth=".8" opacity=".5" strokeLinecap="round" />
            </g>
          </g>
          <ellipse className="esc-flor-aro" cx="209" cy="117" rx="14" ry="4" fill="none" stroke="#ec4899" strokeWidth="1.2" />
          <g transform="translate(194 92)">
            <path className="esc-flor-chispa" d={ESTRELLA} fill="#fbbf24" />
          </g>
          <g transform="translate(224 88)">
            <path className="esc-flor-chispa" d={ESTRELLA} fill="#f9a8c9" style={{ animationDelay: '-6.35s' }} />
          </g>

          {/* ambiente: la mariposa y los pétalos que caen de la maceta */}
          <g transform="translate(46 78)">
            <g className="esc-flor-mariposa">
              <g className="esc-flor-alas">
                <path d="M0 0C-2-3-5.6-3.6-5.4-1C-5.2.6-2.2.8 0 0Z" fill="#fb923c" />
                <path d="M0 0C2-3 5.6-3.6 5.4-1C5.2.6 2.2.8 0 0Z" fill="#fb923c" />
                <path d="M0 0C-1.6 1-3.8 3.4-2.4 4.2C-1 4.8-.2 2 0 0Z" fill="#f97316" />
                <path d="M0 0C1.6 1 3.8 3.4 2.4 4.2C1 4.8.2 2 0 0Z" fill="#f97316" />
                <circle cx="-3.6" cy="-1.6" r=".6" fill="#fff" opacity=".8" />
                <circle cx="3.6" cy="-1.6" r=".6" fill="#fff" opacity=".8" />
              </g>
              <ellipse cx="0" cy=".6" rx=".55" ry="2.4" fill="#3b2a22" />
              <path d="M-.3-1.6L-1.4-3.6M.3-1.6L1.4-3.6" stroke="#3b2a22" strokeWidth=".3" />
            </g>
          </g>
          {[
            [85, 98, '0s', '-6px'],
            [90, 97, '-1.6s', '5px'],
            [196, 96, '-.8s', '-4px'],
          ].map(([x, y, d, dx]) => (
            <ellipse
              key={x as number}
              className="esc-flor-petalo"
              cx={x as number}
              cy={y as number}
              rx="1"
              ry=".55"
              fill="#f9a8c9"
              style={v({ animationDelay: d as string, '--dx': dx as string })}
            />
          ))}
        </g>
      </svg>
      <Aviso etiqueta="Ramo de flores" texto="Bs 120" tono="rosa" />
    </Marco>
  )
}

/* ======================================================================
   Materiales de construcción
   ====================================================================== */

/** Bolsa de cemento acostada: papel, la franja impresa y la costura. */
function Bolsa({ x, y, w = 14, h = 6, papel }: { x: number; y: number; w?: number; h?: number; papel: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r2(h * 0.42)} fill={papel} />
      <rect x={r2(x + w * 0.32)} y={r2(y + 0.7)} width={r2(w * 0.36)} height={r2(h - 1.4)} rx=".4" fill="#5b6b7f" opacity=".85" />
      <circle cx={r2(x + w / 2)} cy={r2(y + h / 2)} r={r2(h * 0.17)} fill="#fff" opacity=".85" />
      <path d={`M${r2(x + 1.2)} ${r2(y + h * 0.3)}H${r2(x + w - 1.2)}`} stroke="#fff" strokeWidth=".45" opacity=".55" />
      <path d={`M${r2(x + 1)} ${r2(y + 1)}V${r2(y + h - 1)}`} stroke="#8f8573" strokeWidth=".35" strokeDasharray=".5 .5" />
      <path d={`M${x + 0.6} ${r2(y + h - 0.4)}H${x + w - 0.6}`} stroke="#000" strokeWidth=".5" opacity=".12" />
    </g>
  )
}

/**
 * Bloque de ladrillos sobre su pallet, con la base en (x, y), `w` de ancho y
 * `h` de alto: frente con las juntas trabadas, techo y costado en perspectiva
 * y los zunchos que lo amarran.
 */
function Ladrillos({ x, y, w, h, frente, pallet = true }: { x: number; y: number; w: number; h: number; frente: string; pallet?: boolean }) {
  const b = pallet ? y - 2.8 : y
  const t = b - h
  const filas = Math.round(h / 3)
  return (
    <g>
      {pallet && (
        <g>
          <rect x={x - 0.6} y={y - 2.8} width={w + 1.2} height="1.2" fill="#c8955a" />
          {[0, 0.5, 1].map((k) => (
            <rect key={k} x={r2(x - 0.6 + (w - 2.8) * k)} y={y - 1.6} width="4" height="1.6" fill="#9c6a35" />
          ))}
          <path d={`M${x + w + 0.6} ${y - 2.8}L${x + w + 4} ${y - 5}V${y - 3.6}L${x + w + 0.6} ${y - 1.4}Z`} fill="#a5733f" />
        </g>
      )}
      <path d={`M${x} ${t}L${x + 4} ${t - 3}H${x + w + 4}L${x + w} ${t}Z`} fill="#eb9a70" />
      <path d={`M${x + w} ${t}L${x + w + 4} ${t - 3}V${b - 3}L${x + w} ${b}Z`} fill="#9c3f22" />
      <rect x={x} y={t} width={w} height={h} fill={frente} />
      {Array.from({ length: filas - 1 }, (_, k) => t + (k + 1) * (h / filas)).map((yy) => (
        <path key={yy} d={`M${x} ${r2(yy)}H${x + w}`} stroke="#f4c3a6" strokeWidth=".4" opacity=".7" />
      ))}
      {Array.from({ length: filas }, (_, k) =>
        Array.from({ length: Math.ceil(w / 6) + 1 }, (_, j) => x + j * 6 + (k % 2) * 3)
          .filter((xx) => xx > x + 0.5 && xx < x + w - 0.5)
          .map((xx) => (
            <path key={`${k}-${xx}`} d={`M${xx} ${r2(t + k * (h / filas))}v${r2(h / filas)}`} stroke="#f4c3a6" strokeWidth=".4" opacity=".6" />
          )),
      )}
      {[0.28, 0.72].map((k) => (
        <g key={k}>
          <rect x={r2(x + w * k - 0.6)} y={t} width="1.2" height={h} fill="#e8eef5" opacity=".85" />
          <path d={`M${r2(x + w * k - 0.6)} ${t}L${r2(x + w * k + 3.4)} ${t - 3}H${r2(x + w * k + 4.6)}L${r2(x + w * k + 0.6)} ${t}Z`} fill="#e8eef5" opacity=".85" />
        </g>
      ))}
      <rect x={x} y={t} width="1.6" height={h} fill="#fff" opacity=".18" />
    </g>
  )
}

const PIEDRAS = (() => {
  const s = semillas(90, 7)
  return Array.from({ length: 30 }, (_, i) => ({
    x: r2(38 + s[i * 3] * 42),
    y: r2(124 + s[i * 3 + 1] * 22),
    r: r2(0.5 + s[i * 3 + 2] * 0.7),
    c: ['#7d7870', '#a19c93', '#cfcac0', '#8f8a80'][i % 4],
  }))
})()
const GRANOS = (() => {
  const s = semillas(60, 3)
  return Array.from({ length: 20 }, (_, i) => ({ x: r2(16 + s[i * 3] * 42), y: r2(122 + s[i * 3 + 1] * 24), o: r2(0.25 + s[i * 3 + 2] * 0.35) }))
})()

/** Las capas del pallet que se arma en la balanza: 5 capas de 2 bolsas. */
const CAPAS = [1, 2, 3, 4, 5]

/** El contador de la balanza (de 2 en 2). */
const CUENTA = ['0', '2', '4', '6', '8', '10']

/**
 * Una barraca de materiales de construcción: el galpón con techo de calamina y
 * el letrero amarillo con franjas de peligro, banderines, el foco colgado, los
 * pallets de ladrillo, la pirámide de bolsas de cemento con su precio, las
 * varillas de fierro en el caballete, los montículos de arena (con la pala) y
 * de grava, la carretilla, la balanza de plataforma con su visor y la
 * camioneta.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): la camioneta retrocede vacía;
 * sobre el pallet de la balanza caen las capas de bolsas y el visor cuenta 2,
 * 4, 6, 8, 10. El pallet sube en arco a la carrocería, la camioneta se hunde
 * con el peso, asoma la insignia "×10", arranca un poco y llega el aviso;
 * después sale con la carga.
 */
export function EscenaMateriales() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`
  const papel = u('bo')

  return (
    <Marco fondo="bg-gradient-to-b from-amber-100 via-stone-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8f2e6" />
            <stop offset="1" stopColor="#e6d6b8" />
          </linearGradient>
          <linearGradient id={g('mu')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f1ece3" />
            <stop offset="1" stopColor="#d9d0c1" />
          </linearGradient>
          <linearGradient id={g('te')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d5dde5" />
            <stop offset=".5" stopColor="#aab7c4" />
            <stop offset="1" stopColor="#8796a6" />
          </linearGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f1ece0" />
            <stop offset="1" stopColor="#cfc5b0" />
          </linearGradient>
          <linearGradient id={g('la')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#de7349" />
            <stop offset="1" stopColor="#b04527" />
          </linearGradient>
          <linearGradient id={g('ar')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7e1b0" />
            <stop offset=".6" stopColor="#e3bd78" />
            <stop offset="1" stopColor="#c99a55" />
          </linearGradient>
          <linearGradient id={g('gr')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9c5bd" />
            <stop offset="1" stopColor="#8b867d" />
          </linearGradient>
          <linearGradient id={g('ca')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4f94d4" />
            <stop offset=".6" stopColor="#2c6fb0" />
            <stop offset="1" stopColor="#1f5690" />
          </linearGradient>
          <linearGradient id={g('cv')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e4f3fc" />
            <stop offset="1" stopColor="#8ec2e4" />
          </linearGradient>
          <linearGradient id={g('ba')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c7d0d9" />
            <stop offset="1" stopColor="#8a97a5" />
          </linearGradient>
          <linearGradient id={g('na')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f59a52" />
            <stop offset="1" stopColor="#d4611f" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".8" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={g('fo')}>
            <stop offset="0" stopColor="#ffe39a" stopOpacity=".75" />
            <stop offset="1" stopColor="#ffe39a" stopOpacity="0" />
          </radialGradient>
          <clipPath id={g('cg')}>
            <path d="M38 146C42 136 50 127 59 126C68 125 75 134 80 146Z" />
          </clipPath>
          <clipPath id={g('cs')}>
            <path d="M14 146C17 137 24 126 34 124C44 123 52 132 58 146Z" />
          </clipPath>
          <clipPath id={g('lc')}>
            <rect x="158.6" y="102.6" width="21" height="8.2" rx=".8" />
          </clipPath>
          <clipPath id={g('cf')}>
            <rect x="104" y="84" width="66" height="8" />
          </clipPath>
        </defs>

        {/* plataforma: el patio de tierra apisonada, con su canto y las sombras */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#d2bc94" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".35" />
        {[
          [120, 150.4, 34],
          [180, 151, 28],
        ].map(([x, y, w]) => (
          <path key={x} d={`M${x - w / 2} ${y}h${w}`} stroke="#c9b28a" strokeWidth=".6" strokeDasharray="2 1.4" opacity=".6" />
        ))}
        <ellipse className="esc-mat-sombra" cx="96" cy="146.4" rx="84" ry="5.4" fill="#4a3412" opacity=".13" />

        <g className="esc-mat-flota">
          {/* ---------- el galpón ---------- */}
          <path d="M14 72L22 68V146L14 149Z" fill="#c9bfae" />
          <rect x="22" y="68" width="152" height="78" fill={u('mu')} />
          {Array.from({ length: 12 }, (_, k) => 74 + k * 6).map((y, f) => (
            <g key={y}>
              <path d={`M22 ${y}H174`} stroke="#c7bca9" strokeWidth=".4" opacity=".7" />
              {Array.from({ length: 13 }, (_, j) => 22 + j * 12 + (f % 2) * 6)
                .filter((x) => x > 22 && x < 174)
                .map((x) => (
                  <path key={x} d={`M${x} ${y - 6}V${y}`} stroke="#c7bca9" strokeWidth=".4" opacity=".55" />
                ))}
            </g>
          ))}
          <rect x="22" y="128" width="152" height="18" fill="#cfc4b1" opacity=".5" />
          {/* los banderines, bajo el techo */}
          <path d="M24 74.6Q97 79 172 72.4" fill="none" stroke="#6b7280" strokeWidth=".35" />
          {Array.from({ length: 16 }, (_, i) => {
            const t = (i + 0.5) / 16
            const x = 24 + 148 * t
            const y = 74.6 * (1 - t) * (1 - t) + 2 * (1 - t) * t * 79 + t * t * 72.4
            return (
              <g key={i} transform={`translate(${r2(x)} ${r2(y)})`}>
                <path
                  className="esc-mat-banderin"
                  d="M-2.2 0H2.2L0 4.2Z"
                  fill={['#f97316', '#facc15', '#3b82f6'][i % 3]}
                  style={{ animationDelay: `${-(i * 0.23).toFixed(2)}s` }}
                />
              </g>
            )
          })}
          {/* el foco colgado y su luz */}
          <ellipse className="esc-mat-foco" cx="100" cy="86" rx="22" ry="14" fill={u('fo')} />
          <path d="M100 72V80" stroke="#475569" strokeWidth=".4" />
          <path d="M98.4 80H101.6L101 81.6H99Z" fill="#475569" />
          <circle cx="100" cy="83" r="1.8" fill="#fff1c2" />

          {/* pallets de ladrillos (atrás, a la izquierda) */}
          <Ladrillos x={26} y={128} w={34} h={18} frente={u('la')} />
          <Ladrillos x={28} y={110.4} w={30} h={13.2} frente={u('la')} />

          {/* varillas de fierro sobre el caballete (atrás, a la derecha) */}
          {[118, 158].map((x) => (
            <g key={x}>
              <path d={`M${x - 5} 128L${x} 91M${x + 5} 128L${x} 91`} stroke="#8a5a2b" strokeWidth="1.3" strokeLinecap="round" />
              <path d={`M${x - 3.4} 115H${x + 3.4}`} stroke="#8a5a2b" strokeWidth=".8" />
              <rect x={x - 4} y="90.4" width="8" height="1.8" rx=".5" fill="#a5733f" />
            </g>
          ))}
          {[
            [106, 169, 89.6],
            [108.6, 167, 88.4],
            [104.4, 170, 87.4],
            [110, 166.4, 86.4],
            [107, 168.6, 85.4],
          ].map(([x1, x2, y]) => (
            <g key={y}>
              <path d={`M${x1} ${y}H${x2}`} stroke="#5f4a3e" strokeWidth=".95" strokeLinecap="round" />
              <path d={`M${x1 + 0.6} ${y - 0.22}H${x2 - 0.6}`} stroke="#a8988c" strokeWidth=".28" />
              <path d={`M${x1} ${y}H${x2}`} stroke="#3b2d25" strokeWidth=".95" strokeDasharray=".22 1.6" opacity=".45" />
              <circle cx={x1} cy={y} r=".48" fill="#c7a27c" />
            </g>
          ))}
          {[128, 150].map((x) => (
            <path key={x} d={`M${x} 84.6V90.4`} stroke="#94a3b8" strokeWidth=".6" />
          ))}
          <g clipPath={`url(#${g('cf')})`}>
            <g transform="translate(92 84)">
              <g className="esc-mat-brillo" style={v({ '--d': '84px' })}>
                <path d="M0 0H5L2 8H-3Z" fill={u('gl')} />
              </g>
            </g>
          </g>

          {/* la pirámide de bolsas de cemento, con su precio */}
          <path d="M79 108V118" stroke="#8a5a2b" strokeWidth=".8" />
          <rect x="69" y="100" width="20" height="8.6" rx="1" fill="#fff8e6" stroke="#d4a017" strokeWidth=".5" />
          <text x="79" y="106.6" textAnchor="middle" fontSize="5.8" fontWeight="800" fill="#1f2937">
            Bs 65
          </text>
          {[
            [89, 106],
            [82, 112],
            [96, 112],
            [75, 118],
            [89, 118],
            [103, 118],
            [68, 124],
            [82, 124],
            [96, 124],
            [110, 124],
          ].map(([x, y]) => (
            <Bolsa key={`${x}-${y}`} x={x} y={y} papel={papel} />
          ))}

          {/* los postes y el techo de calamina */}
          <rect x="20" y="66" width="3.6" height="80" fill="#475569" />
          <rect x="172" y="62" width="3.6" height="84" fill="#475569" />
          <rect x="20" y="66" width="1" height="80" fill="#fff" opacity=".25" />
          <rect x="172" y="62" width="1" height="84" fill="#fff" opacity=".25" />
          <path d="M12 72L188 65V68.4L12 75.4Z" fill="#334155" opacity=".25" />
          <path d="M10 66L186 59L188 65L12 72Z" fill={u('te')} />
          {Array.from({ length: 35 }, (_, k) => 13 + k * 5).map((x) => (
            <path key={x} d={`M${x} ${r2(66 - ((x - 10) * 7) / 176)}L${x + 1.6} ${r2(72 - ((x - 12) * 7) / 176)}`} stroke="#fff" strokeWidth=".55" opacity=".45" />
          ))}
          <path d="M10 66L186 59" stroke="#eef2f6" strokeWidth=".7" />

          {/* el letrero amarillo con franjas de peligro (a la izquierda del aviso) */}
          <rect x="30" y="52" width="2" height="12" fill="#475569" />
          <rect x="118" y="50" width="2" height="11" fill="#475569" />
          <rect x="14" y="36" width="124" height="17" rx="2.6" fill="#1f2937" />
          <rect x="15.4" y="37.4" width="121.2" height="14.2" rx="1.8" fill="#f8bf24" />
          {[18, 124].map((x0) => (
            <g key={x0}>
              <rect x={x0} y="39" width="10.4" height="11" rx=".8" fill="#1f2937" />
              {[0, 1, 2].map((k) => (
                <path key={k} d={`M${x0 + k * 4} 50L${x0 + 2.6 + k * 4} 39H${x0 + 4.6 + k * 4}L${x0 + 2 + k * 4} 50Z`} fill="#f8bf24" />
              ))}
            </g>
          ))}
          <text x="76" y="48.6" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1f2937" textLength="80" lengthAdjust="spacing">
            MATERIALES
          </text>
          <rect x="15.4" y="37.4" width="121.2" height="2" rx="1" fill="#fff" opacity=".35" />

          {/* ---------- adelante: grava, arena con la pala y la carretilla ---------- */}
          <path d="M38 146C42 136 50 127 59 126C68 125 75 134 80 146Z" fill={u('gr')} />
          <g clipPath={`url(#${g('cg')})`}>
            {PIEDRAS.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.c} />
            ))}
          </g>
          <path d="M44 138C48 131 53 128 58 127.6" fill="none" stroke="#fff" strokeWidth="1" opacity=".3" strokeLinecap="round" />
          {/* la pala clavada */}
          <path d="M37.6 125L46.4 100.4" stroke="#b07a43" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M44.6 99.4C45.4 97 49 98.2 48.2 100.6" fill="none" stroke="#3b2a22" strokeWidth="1" />
          <path d="M34.2 128.4L36.4 122.4L40.4 123.8L39.6 130Z" fill="#94a3b8" />
          <path d="M14 146C17 137 24 126 34 124C44 123 52 132 58 146Z" fill={u('ar')} />
          <g clipPath={`url(#${g('cs')})`}>
            {GRANOS.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r=".45" fill="#a77b3f" opacity={p.o} />
            ))}
          </g>
          <path d="M33.6 127.6C35.6 126.4 38.4 126.6 40.6 128" fill="none" stroke="#e8c98d" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M19 140C22 133 27 127.4 33 126" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".4" strokeLinecap="round" />
          {/* la carretilla con arena */}
          <path d="M92 131L87 140" stroke="#475569" strokeWidth="1.2" />
          <path d="M104 133L107 145.4M99 133L98 145.4" stroke="#475569" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M106 131.4L121 126.4" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M119.2 127L122.4 126" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M85 122C90 113.4 104 112.6 111 122Z" fill={u('ar')} />
          <path d="M84 122H112L106 134H91Z" fill={u('na')} />
          <rect x="83" y="120.8" width="30" height="2.2" rx="1.1" fill="#f6ad72" />
          <path d="M87 124L92 132.6" stroke="#fff" strokeWidth=".9" opacity=".3" />
          <circle cx="87" cy="140" r="5.4" fill="#1f2937" />
          <circle cx="87" cy="140" r="2.6" fill="#cbd5e1" />
          <circle cx="87" cy="140" r=".8" fill="#475569" />

          {/* ---------- la balanza de plataforma y su visor ---------- */}
          <rect x="167" y="100" width="2" height="46" fill="#334155" />
          <rect x="156" y="95" width="26" height="18" rx="2" fill="#1e293b" />
          <rect x="156" y="95" width="26" height="1.2" rx=".6" fill="#475569" />
          <text x="169" y="100.8" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#cbd5e1" letterSpacing=".3">
            BOLSAS
          </text>
          <rect x="158.6" y="102.6" width="21" height="8.2" rx=".8" fill="#0d2a1c" />
          <g clipPath={`url(#${g('lc')})`}>
            <g className="esc-mat-cuenta">
              {CUENTA.map((n, i) => (
                <text key={n} x="177.6" y={109.6 + i * 9} textAnchor="end" fontSize="7.4" fontWeight="800" fill="#4ade80">
                  {n}
                </text>
              ))}
            </g>
          </g>
          <circle className="esc-mat-led" cx="160.6" cy="104.4" r=".7" fill="#4ade80" />
          <rect x="118" y="141" width="48" height="5" rx="1" fill="#334155" />
          <rect x="116" y="137.6" width="52" height="3.6" rx="1" fill={u('ba')} />
          {Array.from({ length: 12 }, (_, k) => 119 + k * 4.2).map((x) => (
            <path key={x} d={`M${x} 139.4l1.2-.8l1.2.8`} fill="none" stroke="#6b7785" strokeWidth=".35" />
          ))}
          <rect x="116" y="137.6" width="52" height=".8" rx=".4" fill="#fff" opacity=".5" />
          {[120, 162].map((x) => (
            <rect key={x} x={x} y="145.4" width="3" height="1.2" rx=".4" fill="#1f2937" />
          ))}

          {/* ---------- la camioneta: la caja por dentro (detrás del pallet) ---------- */}
          <g transform="translate(-4 0)">
            <g className="esc-mat-camion">
              <ellipse cx="238" cy="146.6" rx="56" ry="3.8" fill="#4a3412" opacity=".16" />
              <g className="esc-mat-suspension">
                <rect x="186" y="109.6" width="48" height="3" rx=".6" fill="#1d4f80" />
                <rect x="186" y="112.4" width="48" height="13" fill="#1a3f66" />
              </g>
            </g>
          </g>

          {/* ---------- el pallet: se arma en la balanza y sube a la camioneta ---------- */}
          <g transform="translate(142 137.6)">
            <g className="esc-mat-pallet-x">
              <g className="esc-mat-pallet-y">
                <rect x="-19" y="-3.6" width="38" height="1.4" fill="#c8955a" />
                {[-19, -2, 15].map((x) => (
                  <rect key={x} x={x} y="-2.2" width="4" height="2.2" fill="#9c6a35" />
                ))}
                <path d="M-19-3.6H19" stroke="#e3b47e" strokeWidth=".4" />
                {CAPAS.map((n) => (
                  <g key={n} transform={`translate(0 ${r2(-3.6 - 5.6 * n)})`}>
                    <g className={`esc-mat-capa esc-mat-capa${n}`}>
                      <Bolsa x={-18.4} y={0} w={18.2} h={5.6} papel={papel} />
                      <Bolsa x={0.2} y={0} w={18.2} h={5.6} papel={papel} />
                    </g>
                  </g>
                ))}
              </g>
            </g>
          </g>

          {/* ---------- la camioneta: carrocería, cabina y ruedas ---------- */}
          <g transform="translate(-4 0)">
            <g className="esc-mat-camion">
              {/* humo del escape */}
              <g className="esc-mat-escape-on">
                {['0s', '-.36s', '-.72s'].map((d) => (
                  <circle key={d} className="esc-mat-escape" cx="182" cy="133" r="2" fill="#d6d3d1" style={{ animationDelay: d }} />
                ))}
              </g>
              <g className="esc-mat-suspension">
                {/* el lateral de la caja */}
                <path d="M182 113H234V133H208C207 127.5 203 125 198 125C193 125 189 127.5 188 133H182Z" fill={u('ca')} />
                <rect x="182" y="111.6" width="52" height="2.2" rx=".8" fill="#6aa9e0" />
                <path d="M184 118H232" stroke="#1a4a7a" strokeWidth=".6" opacity=".6" />
                <path d="M188 133C189 127.5 193 125 198 125C203 125 207 127.5 208 133" fill="none" stroke="#163e66" strokeWidth=".9" />
                <rect x="182" y="115.4" width="2" height="4.6" rx=".5" fill="#ef4444" />
                <rect x="180.6" y="131" width="6" height="2.4" rx=".6" fill="#64748b" />
                {/* la cabina */}
                <path d="M234 133V101C234 98 236 96 239 96H258C260.5 96 262 97 263 99L270 112H286C289.5 112 292 114.5 292 118V129C292 131.5 290.5 133 288 133H278C277 127.5 273 125 268 125C263 125 259 127.5 258 133Z" fill={u('ca')} />
                <path d="M258 133C259 127.5 263 125 268 125C273 125 277 127.5 278 133" fill="none" stroke="#163e66" strokeWidth=".9" />
                <path d="M238.6 99.6H257.6L263.6 111H238.6Z" fill={u('cv')} />
                {/* el chofer con su casco */}
                <path d="M248.6 111C248.6 108.6 250.6 107.6 253.2 107.6C255.8 107.6 257.8 108.6 257.8 111Z" fill="#f97316" />
                <circle cx="253.2" cy="105.4" r="2.3" fill="#c98b5a" />
                <path d="M250.2 104.6C250.2 101.6 251.6 100.6 253.2 100.6C254.8 100.6 256.2 101.6 256.2 104.6Z" fill="#facc15" />
                <rect x="249.6" y="104.2" width="7.2" height=".9" rx=".4" fill="#eab308" />
                <path d="M240 101L245 101L241 110H240Z" fill="#fff" opacity=".35" />
                <rect x="247.6" y="99.6" width="1.4" height="11.4" fill="#1f5690" />
                <path d="M236.6 113V131M262 113V125" stroke="#163e66" strokeWidth=".6" opacity=".7" />
                <rect x="239" y="114.6" width="4" height="1.2" rx=".5" fill="#cbd5e1" />
                {/* el logo de la puerta: un muro de ladrillos */}
                <rect x="244.6" y="116.4" width="12" height="8" rx="1.4" fill="#fff" opacity=".92" />
                {[0, 1, 2].map((k) => (
                  <g key={k}>
                    <rect x={246 + (k % 2) * 1.6} y={117.6 + k * 2.1} width="4" height="1.6" rx=".3" fill="#d4612f" />
                    <rect x={250.4 + (k % 2) * 1.6} y={117.6 + k * 2.1} width={k % 2 ? 2.6 : 4} height="1.6" rx=".3" fill="#d4612f" />
                  </g>
                ))}
                <path d="M263 107.6L266.4 106.6V110.4L263.4 110.6Z" fill="#1f2937" />
                <path d="M270 112H286C289.5 112 292 114.5 292 118" fill="none" stroke="#9ccaf0" strokeWidth=".7" opacity=".7" />
                <rect x="288.6" y="114" width="3.4" height="3.2" rx=".8" fill="#fef3c7" />
                <rect x="289.8" y="118.6" width="2.2" height="6.4" rx=".5" fill="#cbd5e1" />
                <rect x="286" y="129" width="8" height="3.6" rx="1" fill="#94a3b8" />
                <path d="M236 102C236 99 237 98 239 98" fill="none" stroke="#fff" strokeWidth=".7" opacity=".4" />
              </g>
              {/* ruedas (giran cuando la camioneta se mueve) */}
              {[198, 268].map((x) => (
                <g key={x}>
                  <circle cx={x} cy="139" r="7" fill="#1f2937" />
                  <circle cx={x} cy="139" r="4.6" fill="#374151" />
                  <circle cx={x} cy="139" r="3.4" fill="#d1d5db" />
                  <g transform={`translate(${x} 139)`}>
                    <g className="esc-mat-rueda">
                      {[0, 72, 144, 216, 288].map((a) => (
                        <circle key={a} cx={r2(2.1 * Math.sin(rad(a)))} cy={r2(-2.1 * Math.cos(rad(a)))} r=".5" fill="#6b7280" />
                      ))}
                      <circle r="3.4" fill="none" stroke="#9ca3af" strokeWidth=".3" />
                    </g>
                  </g>
                  <circle cx={x} cy="139" r="1" fill="#6b7280" />
                </g>
              ))}
              {/* la carga confirmada: insignia "×10", golpe y polvo en la caja */}
              <ellipse className="esc-mat-aro" cx="208" cy="125" rx="24" ry="4.4" fill="none" stroke="#f97316" strokeWidth="1.1" />
              {[188, 228].map((x, k) => (
                <circle key={x} className="esc-mat-polvo" cx={x} cy="110.4" r="2.6" fill="#e7dcc6" style={v({ '--dx': k ? '4px' : '-4px' })} />
              ))}
              <g transform="translate(208 84)">
                <g className="esc-mat-insignia">
                  <path d="M-10-6H10C11.4-6 12-5.4 12-4V3.4C12 4.8 11.4 5.4 10 5.4H2.4L0 8L-2.4 5.4H-10C-11.4 5.4-12 4.8-12 3.4V-4C-12-5.4-11.4-6-10-6Z" fill={u('na')} />
                  <text x="0" y="2.4" textAnchor="middle" fontSize="7" fontWeight="900" fill="#fff">
                    ×10
                  </text>
                </g>
              </g>
            </g>
          </g>
          <g transform="translate(184 80)">
            <path className="esc-mat-chispa" d={ESTRELLA} fill="#fbbf24" />
          </g>
          <g transform="translate(232 76)">
            <path className="esc-mat-chispa" d={ESTRELLA} fill="#fdba74" style={{ animationDelay: '-6.35s' }} />
          </g>

          {/* polvo que flota en el patio */}
          {[
            [70, '0s'],
            [128, '-1.1s'],
            [176, '-2.2s'],
          ].map(([x, d]) => (
            <circle key={x as number} className="esc-mat-mota" cx={x as number} cy="140" r=".9" fill="#d9c49c" style={{ animationDelay: d as string }} />
          ))}
        </g>
      </svg>
      <Aviso etiqueta="10 bolsas de cemento" texto="Bs 650" tono="ambar" />
    </Marco>
  )
}
