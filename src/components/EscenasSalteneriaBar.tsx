import './EscenasSalteneriaBar.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Escenas animadas de la salteñería y del bar-karaoke (SVG propio). Todo se
  mueve con CSS (sólo transform y opacity); los keyframes `esc-salte-*` y
  `esc-bar-*` viven en EscenasSalteneriaBar.css y los compartidos `esc-*` en
  index.css. Son decorativas: el Marco ya las marca con aria-hidden.
*/

/** Chispa de cuatro puntas, chica (destellos de la venta). */
const ESTRELLA = 'M0-6L1.6-1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6-1.6Z'

/* ===================================================================== */
/* ============================ SALTEÑERÍA ============================= */
/* ===================================================================== */

/**
 * El repulgue trenzado: ocho torcidas sobre la cresta de la salteña. Se calcula
 * una vez sobre la curva de la cresta (cuadrática) para que cada torcida siga la
 * pendiente y quede inclinada como un trenzado de verdad.
 */
const REPULGUE = Array.from({ length: 8 }, (_, i) => {
  const t = (i + 0.5) / 8
  const p0 = [-5.6, -4.4]
  const c = [0, -13.2]
  const p2 = [5.6, -4.4]
  const x = (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t * t * p2[0]
  const y = (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t * t * p2[1]
  const dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p2[0] - c[0])
  const dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p2[1] - c[1])
  return { x: +x.toFixed(2), y: +y.toFixed(2), a: +((Math.atan2(dy, dx) * 180) / Math.PI + 42).toFixed(1) }
})

/**
 * Una salteña de costado con la base en (0, 0): la panza dorada (con su
 * sombra abajo y el brillo arriba a la izquierda), los puntitos del horno y el
 * repulgue trenzado por la cresta. `piel` y `trenza` son los url() de sus degradados.
 */
function Saltena({ piel, trenza }: { piel: string; trenza: string }) {
  return (
    <g>
      <path d="M-7 0Q-7.6-6.2 0-7.6Q7.6-6.2 7 0Q0 1.3-7 0Z" fill={piel} />
      {/* la sombra de la panza y el brillo de la masa */}
      <path d="M-7 0Q0 1.3 7 0Q6.9-1.9 6.2-2.6Q0-.9-6.2-2.6Q-6.9-1.9-7 0Z" fill="#8a3a12" opacity=".28" />
      <ellipse cx="-2.8" cy="-4.6" rx="2.4" ry="1" fill="#fff4cf" opacity=".5" transform="rotate(-22)" />
      <circle cx="2.6" cy="-2.4" r=".4" fill="#8a3a12" opacity=".45" />
      <circle cx="-3.8" cy="-1.8" r=".35" fill="#8a3a12" opacity=".4" />
      <circle cx="4.4" cy="-4.2" r=".35" fill="#8a3a12" opacity=".35" />
      {/* el repulgue: la cresta y sus torcidas */}
      <path d="M-5.6-4.4Q0-13.2 5.6-4.4" fill="none" stroke="#b9561f" strokeWidth="1.9" strokeLinecap="round" />
      {REPULGUE.map((r) => (
        <g key={r.x}>
          <ellipse cx={r.x} cy={r.y - 0.15} rx="1.2" ry=".78" fill={trenza} transform={`rotate(${r.a})`} />
          <circle cx={r.x - 0.35} cy={r.y - 0.55} r=".32" fill="#ffe3a3" opacity=".9" />
        </g>
      ))}
    </g>
  )
}

/** Bocanada de vapor de la bandeja del horno; el retraso las reparte en el ciclo. */
function Vapor({ x, retraso, fill, dx }: { x: number; retraso: number; fill: string; dx: number }) {
  return (
    <g transform={`translate(${x} 110)`}>
      <circle className="esc-salte-vapor" r="5" fill={fill} style={v({ '--dx': `${dx}px`, animationDelay: `${retraso}s` })} />
    </g>
  )
}

/** Las salteñas de la vitrina, por fila: [x del centro]. La fila de atrás deja el hueco de la que se vende (x = 182). */
const FILA_ATRAS = [104, 120, 136, 152, 167]
const FILA_ADELANTE = [100, 116, 132, 148, 164, 180]

/**
 * Una salteñería de la mañana en tres cuartos: el letrero con su toldito, la
 * vitrina caliente con dos filas de salteñas sobre el mostrador (con su franja
 * de aguayo), el horno de barro a la izquierda sacando una bandeja humeante y,
 * a la derecha, la mesita con el refresco.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): la salteña de la fila de atrás sale
 * de la vitrina en arco y cae al platillo del mostrador; le sube un hilo de
 * vapor, el platillo viaja con su cucharita a la mesa y, al asentarse, llega el
 * aviso de la venta. Después se la comen (se desvanece), el platillo vuelve al
 * mostrador y la vitrina repone la salteña.
 */
export function EscenaSalteneria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <div aria-hidden className="absolute -left-6 -top-8 h-32 w-32 rounded-full bg-amber-200/70 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff8ec" />
            <stop offset="1" stopColor="#f5d9b0" />
          </linearGradient>
          <linearGradient id={g('sa')} x1="0" y1="0" x2=".45" y2="1">
            <stop offset="0" stopColor="#fbd073" />
            <stop offset=".5" stopColor="#e9933d" />
            <stop offset="1" stopColor="#c0602a" />
          </linearGradient>
          <linearGradient id={g('tr')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6b55a" />
            <stop offset="1" stopColor="#c86a26" />
          </linearGradient>
          <linearGradient id={g('mu')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3dc" />
            <stop offset="1" stopColor="#f4d6a8" />
          </linearGradient>
          <linearGradient id={g('le')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cf5d31" />
            <stop offset="1" stopColor="#983a1b" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffbe6" />
            <stop offset=".55" stopColor="#ffe3a0" />
            <stop offset="1" stopColor="#f7bd5a" />
          </linearGradient>
          <linearGradient id={g('br')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3cf77" />
            <stop offset="1" stopColor="#b8862c" />
          </linearGradient>
          <linearGradient id={g('md')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e7ab70" />
            <stop offset="1" stopColor="#b06a34" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d77443" />
            <stop offset="1" stopColor="#ad4f24" />
          </linearGradient>
          <linearGradient id={g('ba')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#eab27e" />
            <stop offset=".6" stopColor="#c97c48" />
            <stop offset="1" stopColor="#a65a2e" />
          </linearGradient>
          <linearGradient id={g('ad')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c9784a" />
            <stop offset="1" stopColor="#a75a32" />
          </linearGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b1209" />
            <stop offset=".6" stopColor="#5e220d" />
            <stop offset="1" stopColor="#b5481a" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".6" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('me')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6dcb3" />
            <stop offset="1" stopColor="#dcae74" />
          </linearGradient>
          <linearGradient id={g('rf')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fb923c" />
            <stop offset=".5" stopColor="#f97316" />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
          <radialGradient id={g('hu')}>
            <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('so')}>
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="1" stopColor="#f59e0b" />
          </radialGradient>
          <clipPath id={g('cv')}>
            <rect x="92" y="73" width="104" height="30" />
          </clipPath>
          <clipPath id={g('ct')}>
            <rect x="76" y="43" width="148" height="21" rx="3.4" />
          </clipPath>
        </defs>

        {/* el sol de la mañana, detrás de todo */}
        <g transform="translate(34 30)">
          <g className="esc-salte-rayos">
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} className="esc-salte-o" x="-1" y="-16" width="2" height="5" rx="1" fill="#fbbf24" opacity=".7" transform={`rotate(${i * 45})`} />
            ))}
          </g>
        </g>
        <circle cx="34" cy="30" r="8.4" fill={u('so')} />
        <circle cx="31.6" cy="27.6" r="3" fill="#fff7d6" opacity=".7" />
        {/* una nubecita */}
        <g className="esc-salte-nube">
          <path d="M48 46a4 4 0 0 1 4-4a5.4 5.4 0 0 1 10-1a3.6 3.6 0 0 1 4.6 5Z" fill="#fff" opacity=".9" />
        </g>

        {/* plataforma: losa suave con su canto y la sombra de contacto de cada objeto */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#e2ad78" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="144" rx="118" ry="10" fill="#fff" opacity=".4" />
        <ellipse className="esc-salte-sombra" cx="152" cy="146.5" rx="72" ry="6" fill="#7c2d12" opacity=".14" />
        <ellipse cx="45" cy="146.5" rx="34" ry="4.2" fill="#7c2d12" opacity=".13" />
        <ellipse cx="258" cy="146.6" rx="20" ry="3.4" fill="#7c2d12" opacity=".12" />

        <g className="esc-salte-flota">
          {/* ---------- la pared del local, el letrero y el toldito ---------- */}
          <rect x="80" y="56" width="140" height="52" fill={u('mu')} />
          <rect x="80" y="56" width="2.4" height="52" fill="#fff" opacity=".6" />
          {/* azulejos de la pared, a cada lado de la vitrina */}
          {[84, 94].map((y) =>
            [83, 201, 210].map((x) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="7.4" height="7.4" rx=".8" fill="#e9b984" opacity=".45" />
            )),
          )}
          {/* el reloj de la pared: las ocho de la mañana */}
          <circle cx="209.6" cy="76.4" r="5.6" fill="#fff" stroke="#b8862c" strokeWidth="1.3" />
          <path d="M209.6 76.4V72.4M209.6 76.4L206.4 78.2" stroke="#5b2a12" strokeWidth=".9" strokeLinecap="round" />
          <circle cx="209.6" cy="76.4" r=".7" fill="#c2410c" />

          <rect x="76" y="43" width="148" height="21" rx="3.4" fill={u('le')} />
          <rect x="78.6" y="45.4" width="142.8" height="16.2" rx="2.2" fill="none" stroke="#fde7b6" strokeWidth=".8" opacity=".7" />
          <text x="150" y="57.6" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff1cc" textLength="104" lengthAdjust="spacing">
            SALTEÑERÍA
          </text>
          {/* dos salteñas chiquitas a los lados del nombre */}
          {[88, 212].map((x) => (
            <g key={x} transform={`translate(${x} 57.6)`}>
              <g className="esc-salte-o" transform="scale(.62)">
                <Saltena piel={u('sa')} trenza={u('tr')} />
              </g>
            </g>
          ))}
          {/* el brillo que cruza el letrero */}
          <g clipPath={`url(#${g('ct')})`}>
            <g transform="translate(64 43)">
              <g className="esc-salte-brillo" style={v({ '--d': '172px' })}>
                <path d="M0 0H8L0 21H-8Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          {/* el toldito con festón, terracota y crema */}
          {Array.from({ length: 10 }, (_, i) => {
            const x = 80 + i * 14
            const c = i % 2 === 0 ? '#c9562b' : '#f4b860'
            return (
              <g key={i}>
                <rect x={x} y="64" width="14" height="2.2" fill={c} />
                <path d={`M${x} 66.2a7 2.8 0 0 0 14 0Z`} fill={c} />
              </g>
            )
          })}
          <rect x="80" y="64" width="140" height="1" fill="#7c2d12" opacity=".2" />

          {/* ---------- la vitrina caliente ---------- */}
          {/* el resplandor cálido de las lámparas, sobre la pared */}
          <ellipse className="esc-salte-halo" cx="144" cy="88" rx="62" ry="24" fill="#ffd27a" opacity=".45" />
          <rect x="92" y="73" width="104" height="30" fill={u('vi')} />
          {/* la repisa de vidrio de la fila de atrás */}
          <rect x="92" y="88.6" width="104" height="1.4" fill="#f0b552" />
          <rect x="92" y="88.2" width="104" height=".6" fill="#fff" opacity=".8" />
          {FILA_ATRAS.map((x) => (
            <g key={x} transform={`translate(${x} 88.4)`}>
              <g className="esc-salte-o" transform="scale(.86)">
                <Saltena piel={u('sa')} trenza={u('tr')} />
              </g>
            </g>
          ))}
          {/* la bandeja de abajo con la fila de adelante */}
          <rect x="93" y="101" width="102" height="2" rx=".6" fill="#9a6a24" />
          {FILA_ADELANTE.map((x) => (
            <g key={x} transform={`translate(${x} 101.2)`}>
              <g className="esc-salte-o" transform="scale(.9)">
                <Saltena piel={u('sa')} trenza={u('tr')} />
              </g>
            </g>
          ))}
          {/* el cartelito del precio, colgado del techo de la vitrina sobre el hueco */}
          <rect x="174" y="73.6" width="16" height="6.6" rx="1.2" fill="#fff" />
          <text x="182" y="78.9" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#b45309">
            Bs 6
          </text>
          {/* reflejos del vidrio y el brillo que lo cruza */}
          <path d="M92 73H112L98 103H92Z" fill="#fff" opacity=".22" />
          <g clipPath={`url(#${g('cv')})`}>
            <g transform="translate(80 73)">
              <g className="esc-salte-brillo" style={v({ '--d': '132px', animationDelay: '-3.2s' })}>
                <path d="M0 0H9L-4 30H-13Z" fill={u('gl')} />
              </g>
            </g>
          </g>
          {/* el marco de bronce: techo con su lámpara, postes y zócalo */}
          <rect x="89" y="69" width="110" height="4.4" rx="1.6" fill={u('br')} />
          <rect x="91" y="69.6" width="106" height="1" rx=".5" fill="#fff6d0" opacity=".8" />
          <rect className="esc-salte-lampara" x="96" y="73.4" width="96" height="1.3" rx=".6" fill="#fff6c2" />
          <rect x="89.6" y="73" width="2.4" height="30" fill={u('br')} />
          <rect x="196" y="73" width="2.4" height="30" fill={u('br')} />
          <rect x="89" y="103" width="110" height="3.4" rx="1" fill={u('br')} />

          {/* ---------- el mostrador con su franja de aguayo ---------- */}
          <rect x="86" y="110.6" width="130" height="35.4" rx="1.6" fill={u('mo')} />
          {[118, 150, 182].map((x) => (
            <rect key={x} x={x} y="133" width="1" height="11" fill="#7c2d12" opacity=".25" />
          ))}
          {/* aguayo: rayas finas y una fila de rombos */}
          <rect x="86" y="117" width="130" height="13" fill="#b4234a" />
          <rect x="86" y="117.6" width="130" height="1.3" fill="#fbbf24" />
          <rect x="86" y="119.8" width="130" height=".9" fill="#16a34a" />
          <rect x="86" y="126.3" width="130" height=".9" fill="#16a34a" />
          <rect x="86" y="128.1" width="130" height="1.3" fill="#fbbf24" />
          {Array.from({ length: 16 }, (_, i) => {
            const x = 90 + i * 8
            return (
              <g key={i}>
                <path d={`M${x} 121.4l2.4 2.2l-2.4 2.2l-2.4-2.2Z`} fill={['#fbbf24', '#f472b6', '#22c55e', '#fff'][i % 4]} />
                <circle cx={x + 4} cy="123.6" r=".6" fill="#fde68a" opacity=".9" />
              </g>
            )
          })}
          <rect x="86" y="142.4" width="130" height="3.6" rx="1" fill="#7c2d12" opacity=".35" />
          {/* la tapa de madera */}
          <rect x="83" y="106" width="136" height="5" rx="2" fill={u('md')} />
          <rect x="85" y="106.6" width="132" height="1.2" rx=".6" fill="#ffd9a8" opacity=".8" />

          {/* ---------- el horno de barro (izquierda) ---------- */}
          {/* la chimenea va detrás de la cúpula */}
          <rect x="52" y="72" width="7" height="14" rx="1.4" fill="#b8693d" />
          <rect x="51" y="70.4" width="9" height="3" rx="1.2" fill="#9a5230" />
          {/* la base de adobe */}
          <rect x="12" y="117" width="66" height="29" rx="2" fill={u('ad')} />
          {[123.6, 130.6, 137.6].map((y, f) =>
            Array.from({ length: 5 - (f % 2) }, (_, i) => (
              <rect key={`${y}-${i}`} x={14 + i * 13 + (f % 2) * 6.5} y={y} width="11" height="5.4" rx="1" fill="#d58b5b" opacity=".55" />
            )),
          )}
          <rect x="12" y="117" width="66" height="2.4" rx="1" fill="#e3a273" />
          {/* la cúpula */}
          <path d="M17 118C17 90 31 79 45 79C59 79 73 90 73 118Z" fill={u('ba')} />
          <path d="M22 108C23 92 33 84 43 82.6" fill="none" stroke="#fbd3a6" strokeWidth="2.2" strokeLinecap="round" opacity=".55" />
          <path d="M28 96Q45 92 63 97M22 108Q45 103 69 108" fill="none" stroke="#a65a2e" strokeWidth=".8" opacity=".35" />
          {/* la boca con el fuego adentro */}
          <path d="M33 118V108A12 12 0 0 1 57 108V118Z" fill="#8a4524" />
          <path d="M35 118V108.6A10 10 0 0 1 55 108.6V118Z" fill={u('bo')} />
          <ellipse className="esc-salte-brasa" cx="45" cy="117" rx="9" ry="3.6" fill="#ff8a3d" opacity=".7" />
          {[39, 45, 51].map((x, i) => (
            <g key={x} transform={`translate(${x} 117)`}>
              <path className="esc-salte-llama" d="M0 0C-2.6 0-2.8-3.2 0-6.6C2.8-3.2 2.6 0 0 0Z" fill="#ffb648" style={{ animationDelay: `${-i * 0.3}s` }} />
            </g>
          ))}
          {/* la bandeja que sale del horno, con tres salteñas recién horneadas */}
          <path d="M27 116.4H63L66 120H24Z" fill="#6b7280" />
          <path d="M27 116.4H63L63.4 117.2H26.6Z" fill="#d1d5db" />
          {[34, 45, 56].map((x) => (
            <g key={x} transform={`translate(${x} 116.6)`}>
              <g className="esc-salte-o" transform="scale(.82)">
                <Saltena piel={u('sa')} trenza={u('tr')} />
              </g>
            </g>
          ))}
          <Vapor x={36} retraso={0} dx={-3} fill={u('hu')} />
          <Vapor x={46} retraso={-0.72} dx={2} fill={u('hu')} />
          <Vapor x={55} retraso={-1.44} dx={-1} fill={u('hu')} />

          {/* ---------- la mesita con el refresco (derecha) ---------- */}
          {/* la silla, detrás */}
          <rect x="284" y="94" width="2.2" height="51" rx="1" fill="#a8693a" />
          <rect x="293" y="95" width="2.2" height="50" rx="1" fill="#8a5129" />
          <rect x="283" y="95.6" width="13" height="3.6" rx="1.4" fill="#c98448" />
          <rect x="283" y="101.6" width="13" height="2.4" rx="1.1" fill="#c98448" />
          <path d="M270 122.6H294L296 125.4H272Z" fill="#c98448" />
          <rect x="272" y="125.4" width="2" height="20" rx="1" fill="#a8693a" />
          <rect x="278.4" y="125.4" width="2" height="19" rx="1" fill="#8a5129" />
          {/* el pie y la tapa */}
          <rect x="255.4" y="119" width="4.2" height="24" rx="1.4" fill="#a8693a" />
          <ellipse cx="257.5" cy="144" rx="10" ry="2.4" fill="#8a5129" />
          <ellipse cx="257.5" cy="118.6" rx="24" ry="5.6" fill="#b77b45" />
          <ellipse cx="257.5" cy="117" rx="24" ry="5.6" fill={u('me')} />
          <ellipse cx="250" cy="116" rx="11" ry="1.6" fill="#fff" opacity=".45" />
          {/* el vaso con refresco y su botella */}
          <ellipse cx="270" cy="116.4" rx="9" ry="1.8" fill="#7c2d12" opacity=".16" />
          <path d="M261.4 105H268.6L267.8 116.6H262.2Z" fill="#fff" opacity=".55" />
          <path d="M261.8 108H268.2L267.8 116.6H262.2Z" fill="#fb923c" />
          <rect x="261.4" y="107.6" width="7.2" height="1" rx=".5" fill="#fed7aa" />
          {[
            [263.6, 114, '0s'],
            [266, 112.6, '-.8s'],
            [264.8, 115.4, '-1.5s'],
          ].map(([x, y, d]) => (
            <circle key={x as number} className="esc-salte-burbuja" cx={x as number} cy={y as number} r=".55" fill="#fff" style={{ animationDelay: d as string }} />
          ))}
          <path d="M262.6 105.6L263.4 105.6L263.6 115.6L262.8 115.6Z" fill="#fff" opacity=".8" />
          <g transform="translate(276 116.4)">
            <path d="M-3.8 0V-12Q-3.8-15-1.6-17V-20.6H1.6V-17Q3.8-15 3.8-12V0Z" fill={u('rf')} />
            <rect x="-2" y="-22.6" width="4" height="2.4" rx=".7" fill="#dc2626" />
            <rect x="-3.8" y="-10.4" width="7.6" height="5.6" fill="#fff" />
            <rect x="-3.8" y="-8.4" width="7.6" height="1.6" fill="#16a34a" />
            <rect x="-2.9" y="-14.6" width="1.2" height="13.6" rx=".6" fill="#fff" opacity=".45" />
          </g>

          {/* ---------- la salteña que se vende y su platillo ---------- */}
          {/*
            El platillo nace en el extremo del mostrador (207, 106) y viaja a la mesa
            (+42, +10.6). La salteña vuela desde su hueco de la vitrina (182, 88.4)
            hasta el platillo; al llegar se cambia por la que viaja dentro del platillo.
          */}
          <g transform="translate(207 106.2)">
            <g className="esc-salte-plato-x">
              <g className="esc-salte-plato-y">
                <g className="esc-salte-plato-rebote">
                  <ellipse cx="0" cy=".6" rx="8.6" ry="2.4" fill="#7c2d12" opacity=".18" />
                  <ellipse cx="0" cy="0" rx="8" ry="2.4" fill="#fff" />
                  <ellipse cx="0" cy="-.2" rx="5.4" ry="1.4" fill="#eef2f7" />
                  <ellipse cx="0" cy="0" rx="8" ry="2.4" fill="none" stroke="#60a5fa" strokeWidth=".5" />
                  <g className="esc-salte-enplato">
                    <Saltena piel={u('sa')} trenza={u('tr')} />
                    {/* el hilo de vapor que sube de la salteña recién servida */}
                    {[
                      [-2.4, '0s'],
                      [2.2, '-1.08s'],
                    ].map(([x, d]) => (
                      <g key={x as number} transform={`translate(${x} -11)`}>
                        <g className="esc-salte-hilo" style={{ animationDelay: d as string }}>
                          <path d="M0 0C-1.6-2 1.6-3.6 0-5.6C-1.6-7.6 1.4-9 0-10.6" fill="none" stroke="#c99a6b" strokeWidth="2.2" strokeLinecap="round" opacity=".28" />
                          <path d="M0 0C-1.6-2 1.6-3.6 0-5.6C-1.6-7.6 1.4-9 0-10.6" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                        </g>
                      </g>
                    ))}
                  </g>
                  {/* la cucharita, apoyada en el borde */}
                  <path d="M4.6-.4L11.4-2.4" stroke="#cbd5e1" strokeWidth=".9" strokeLinecap="round" />
                  <ellipse cx="4.2" cy="-.2" rx="1.6" ry=".9" fill="#e2e8f0" transform="rotate(-16)" />
                </g>
              </g>
            </g>
          </g>
          <g transform="translate(182 88.4)">
            <g className="esc-salte-vuelo-x">
              <g className="esc-salte-vuelo-y">
                <Saltena piel={u('sa')} trenza={u('tr')} />
              </g>
            </g>
          </g>

          {/* la venta: aro y destellos sobre la mesa */}
          <ellipse className="esc-salte-aro" cx="249" cy="116.8" rx="12" ry="3.4" fill="none" stroke="#ea580c" strokeWidth="1.3" />
          <g transform="translate(238 96)">
            <path className="esc-salte-chispa" d={ESTRELLA} fill="#fbbf24" />
          </g>
          <g transform="translate(262 92)">
            <path className="esc-salte-chispa" d={ESTRELLA} fill="#fdba74" style={{ animationDelay: '-6.35s' }} />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Media docena" texto="Bs 36" tono="ambar" />
    </Marco>
  )
}

/* ===================================================================== */
/* ============================ BAR-KARAOKE ============================ */
/* ===================================================================== */

/** Botellas de la estantería: [x del centro, color, alto]. Dos repisas (base = y de la repisa). */
const ESTANTE_BAR: { base: number; botellas: [number, string, number][] }[] = [
  {
    base: 85,
    botellas: [
      [36, '#0ea5e9', 13],
      [44, '#f59e0b', 10],
      [80, '#be185d', 14],
      [88, '#22c55e', 11],
      [96, '#e0f2fe', 15],
      [104, '#a855f7', 10],
      [112, '#f59e0b', 13],
      [120, '#ef4444', 11],
      [128, '#0ea5e9', 14],
      [136, '#fde68a', 10],
      [144, '#be185d', 13],
      [152, '#22c55e', 12],
      [160, '#f59e0b', 14],
    ],
  },
  {
    base: 100,
    botellas: [
      [36, '#ef4444', 10],
      [43, '#fde68a', 12],
      [82, '#a855f7', 11],
      [90, '#0ea5e9', 9],
      [98, '#f59e0b', 12],
      [106, '#22c55e', 10],
      [114, '#be185d', 12],
      [122, '#e0f2fe', 9],
      [130, '#f59e0b', 11],
      [138, '#ef4444', 12],
      [146, '#0ea5e9', 10],
      [154, '#a855f7', 12],
      [162, '#fde68a', 9],
    ],
  },
]

/** Una botella de licor con la base en (0, 0), del alto dado: cuerpo, cuello, tapa, etiqueta y brillo. */
function BotellaBar({ color, alto }: { color: string; alto: number }) {
  const c = alto * 0.62
  return (
    <g>
      <rect x="-2.8" y={-c} width="5.6" height={c} rx="1.2" fill={color} opacity=".92" />
      <path d={`M-2.8 ${-c + 1}Q-2.8 ${-c - 2}-1 ${-c - 2.6}V${-alto}H1V${-c - 2.6}Q2.8 ${-c - 2} 2.8 ${-c + 1}Z`} fill={color} opacity=".92" />
      <rect x="-1.2" y={-alto - 1.6} width="2.4" height="1.8" rx=".5" fill="#1e1b4b" />
      <rect x="-2.2" y={-c * 0.66} width="4.4" height={c * 0.34} rx=".5" fill="#fff" opacity=".75" />
      <rect x="-2.2" y={-c + 0.8} width="1" height={c - 1.6} rx=".5" fill="#fff" opacity=".45" />
    </g>
  )
}

/** Foquitos de la guirnalda, colgados de las dos combas: [x, y del cable, color]. */
const GUIRNALDA: [number, number, string][] = [
  [35.1, 40.4, '#f472b6'],
  [44.2, 41.8, '#67e8f9'],
  [53.4, 42.5, '#fde68a'],
  [62.5, 42.8, '#86efac'],
  [71.6, 42.5, '#f472b6'],
  [80.8, 41.8, '#67e8f9'],
  [89.9, 40.4, '#fde68a'],
  [108.1, 40.4, '#86efac'],
  [117.2, 41.8, '#f472b6'],
  [126.4, 42.5, '#67e8f9'],
  [135.5, 42.8, '#fde68a'],
  [144.6, 42.5, '#86efac'],
  [153.8, 41.8, '#f472b6'],
  [162.9, 40.4, '#67e8f9'],
]

/** Puntitos de luz que refleja la bola de espejos sobre la pared: [x, y, color, retraso]. */
const PUNTOS: [number, number, string, number][] = [
  [18, 22, '#f9a8d4', 0],
  [44, 12, '#67e8f9', -0.4],
  [62, 30, '#fff', -1.1],
  [96, 10, '#fde68a', -0.7],
  [112, 34, '#67e8f9', -1.6],
  [172, 12, '#f9a8d4', -0.2],
  [184, 36, '#fff', -1.3],
  [204, 20, '#67e8f9', -0.9],
  [226, 44, '#fde68a', -1.8],
  [246, 18, '#f9a8d4', -0.5],
  [262, 40, '#fff', -1.5],
  [284, 26, '#67e8f9', -1],
  [196, 62, '#f9a8d4', -1.9],
  [244, 70, '#fff', -0.3],
  [12, 56, '#fde68a', -1.2],
  [288, 52, '#f9a8d4', -0.8],
]

/** Las notas que salen del micrófono: [corchea o doble, color, deriva, retraso]. Derivan a la izquierda, lejos de la pantalla. */
const NOTAS: [boolean, string, string, number][] = [
  [false, '#f472b6', '-6px', 0],
  [true, '#67e8f9', '-14px', -0.8125],
  [false, '#fde68a', '-2px', -1.625],
  [true, '#c4b5fd', '-10px', -2.4375],
]

/** Una nota musical con la cabeza en (0, 0). */
function Nota({ doble, color }: { doble: boolean; color: string }) {
  return doble ? (
    <g fill={color}>
      <ellipse cx="0" cy="0" rx="2.2" ry="1.6" transform="rotate(-20)" />
      <ellipse cx="7" cy="-2" rx="2.2" ry="1.6" transform="rotate(-20)" />
      <rect x="1.4" y="-9" width=".9" height="9" />
      <rect x="8.4" y="-11" width=".9" height="9" />
      <path d="M1.4-9L9.3-11V-9L1.4-7Z" />
    </g>
  ) : (
    <g fill={color}>
      <ellipse cx="0" cy="0" rx="2.2" ry="1.6" transform="rotate(-20)" />
      <rect x="1.4" y="-9" width=".9" height="9" />
      <path d="M2.3-9C4.6-8 6-6.4 5-3.6C5-5.6 3.8-6.6 2.3-6.8Z" />
    </g>
  )
}

/** Un chop de cerveza con la base en (0, 0): vidrio, cerveza, burbujas, espuma y asa. */
function Chop({ vidrio, cerveza, retraso }: { vidrio: string; cerveza: string; retraso: number }) {
  return (
    <g>
      <path d="M4 -10.4h2.2a2 2 0 0 1 2 2v4.4a2 2 0 0 1-2 2H4" fill="none" stroke="#c7d2fe" strokeWidth="1.5" opacity=".85" />
      <path d="M-4.2-12.6H4.2L3.7-.8Q3.6 0 2.8 0H-2.8Q-3.6 0-3.7-.8Z" fill={vidrio} />
      <path d="M-3.6-10.8H3.6L3.2-1.4H-3.2Z" fill={cerveza} />
      {[
        [-1.4, -3, 0],
        [1.2, -2, 0.6],
        [0, -4.5, 1.1],
      ].map(([x, y, d]) => (
        <circle key={x} className="esc-bar-burbuja" cx={x} cy={y} r=".5" fill="#fff" style={{ animationDelay: `${retraso - d}s` }} />
      ))}
      <path d="M-2.8-10.4L-2.2-1.6" stroke="#fff" strokeWidth=".8" strokeLinecap="round" opacity=".6" />
      {/* la espuma que rebalsa un poquito */}
      <path d="M-4.6-11.2a2 2 0 0 1 1.4-2.6a2.4 2.4 0 0 1 4-.8a2.2 2.2 0 0 1 3.8 1.4a1.6 1.6 0 0 1 .2 2Z" fill="#fff8e6" />
      <path d="M-4.4-11.4H4.4" stroke="#f3dca6" strokeWidth=".7" strokeLinecap="round" />
    </g>
  )
}

/**
 * Un bar-karaoke de noche: la barra con su estantería iluminada y el letrero de
 * neón, el barman detrás, dos banquetas, la mesa alta con dos chops y, a la
 * derecha, el rincón del karaoke (pantalla con la letra, micrófono en su pie y
 * el parlante). Arriba gira la bola de espejos y dos haces de luz barren la pista.
 *
 * La historia (6,5 s, el ciclo del <Aviso>): el barman llena un trago, lo empuja
 * y el vaso se desliza por toda la barra; al final salta a la mesa 3, se asienta
 * con su aro, sube el «+Bs 30» y llega el aviso con la cuenta de la mesa. Se lo
 * toman (baja el nivel), el vaso se va y el barman prepara otro.
 */
export function EscenaBar() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco fondo="bg-[#1c1240]">
      {/* el fondo nocturno tapa la luz blanca del Marco; los orbes son el neón que tiñe el aire */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#110b2e] via-[#26154f] to-[#4a2a7c]" />
      <div aria-hidden className="esc-deriva absolute -left-6 top-4 h-28 w-28 rounded-full bg-fuchsia-500/30 blur-2xl" />
      <div aria-hidden className="esc-deriva-b absolute -right-4 top-16 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6b46b0" />
            <stop offset="1" stopColor="#3f2780" />
          </linearGradient>
          <linearGradient id={g('hr')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f472b6" stopOpacity=".42" />
            <stop offset="1" stopColor="#f472b6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('hc')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#67e8f9" stopOpacity=".38" />
            <stop offset="1" stopColor="#67e8f9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1036" />
            <stop offset="1" stopColor="#2a1854" />
          </linearGradient>
          <linearGradient id={g('lc')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#67e8f9" stopOpacity="0" />
            <stop offset="1" stopColor="#67e8f9" stopOpacity=".55" />
          </linearGradient>
          <linearGradient id={g('lr')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f472b6" stopOpacity="0" />
            <stop offset="1" stopColor="#f472b6" stopOpacity=".55" />
          </linearGradient>
          <linearGradient id={g('ba')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4a2a80" />
            <stop offset="1" stopColor="#2c1858" />
          </linearGradient>
          <linearGradient id={g('ta')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c08a55" />
            <stop offset="1" stopColor="#7c4a26" />
          </linearGradient>
          <linearGradient id={g('vd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#e0e7ff" stopOpacity=".2" />
          </linearGradient>
          <linearGradient id={g('ce')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id={g('tg')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f9a8d4" />
            <stop offset="1" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id={g('ca')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f2c49b" />
            <stop offset="1" stopColor="#c98b5c" />
          </linearGradient>
          <radialGradient id={g('bo')} cx=".36" cy=".3" r=".8">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".55" stopColor="#c7d2fe" />
            <stop offset="1" stopColor="#6366f1" />
          </radialGradient>
          <radialGradient id={g('bs')} cx=".38" cy=".32" r=".7">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".7" stopColor="#1e1b4b" stopOpacity=".15" />
            <stop offset="1" stopColor="#1e1b4b" stopOpacity=".6" />
          </radialGradient>
          <radialGradient id={g('lu')}>
            <stop offset="0" stopColor="#f472b6" stopOpacity=".55" />
            <stop offset="1" stopColor="#f472b6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('lz')}>
            <stop offset="0" stopColor="#67e8f9" stopOpacity=".45" />
            <stop offset="1" stopColor="#67e8f9" stopOpacity="0" />
          </radialGradient>
          <clipPath id={g('cb')}>
            <circle cx="140" cy="22" r="9" />
          </clipPath>
          <clipPath id={g('cv')}>
            <path d="M-3.2-10H3.2L2.8-1H-2.8Z" />
          </clipPath>
        </defs>

        {/* los haces de luz del techo, que barren la pista */}
        <g transform="translate(46 -4)">
          <path className="esc-bar-haz" d="M0 0L-26 160H26Z" fill={u('hr')} />
        </g>
        <g transform="translate(244 -4)">
          <path className="esc-bar-haz" d="M0 0L-24 160H24Z" fill={u('hc')} style={{ animationDelay: '-3.25s' }} />
        </g>

        {/* los puntitos que tira la bola de espejos */}
        {PUNTOS.map(([x, y, c, d]) => (
          <circle key={`${x}-${y}`} className="esc-bar-punto" cx={x} cy={y} r="1.1" fill={c} style={{ animationDelay: `${d}s` }} />
        ))}

        {/* la bola de espejos, colgada, con sus facetas que giran */}
        <rect x="139.5" y="0" width="1" height="13" fill="#a5b4fc" opacity=".7" />
        <circle cx="140" cy="22" r="9" fill={u('bo')} />
        <g clipPath={`url(#${g('cb')})`}>
          <g className="esc-bar-facetas">
            {Array.from({ length: 6 }, (_, f) =>
              Array.from({ length: 13 }, (_, c) => (
                <rect
                  key={`${f}-${c}`}
                  x={126 + c * 3}
                  y={13.4 + f * 3}
                  width="2.5"
                  height="2.5"
                  rx=".3"
                  fill={['#ffffff', '#a5b4fc', '#e0e7ff'][(c + f) % 3]}
                  opacity={(c + f) % 3 === 0 ? 0.95 : 0.6}
                />
              )),
            )}
          </g>
        </g>
        <circle cx="140" cy="22" r="9" fill={u('bs')} />
        <g transform="translate(136.4 18.4)">
          <path className="esc-bar-destello" d={ESTRELLA} fill="#fff" />
        </g>

        {/* plataforma: la pista, con su canto, el filo de neón y los charcos de luz */}
        <ellipse cx="150" cy="152" rx="140" ry="16" fill="#24164d" />
        <ellipse cx="150" cy="147" rx="140" ry="16" fill={u('pt')} />
        <ellipse cx="150" cy="147" rx="139" ry="15.4" fill="none" stroke="#f472b6" strokeWidth=".8" opacity=".55" />
        {/* cada charco sigue a su haz (mismo ritmo y retraso) */}
        <ellipse className="esc-bar-charco" cx="46" cy="148" rx="30" ry="5.6" fill={u('lu')} />
        <ellipse className="esc-bar-charco" cx="244" cy="147.4" rx="30" ry="5.6" fill={u('lz')} style={{ animationDelay: '-3.25s' }} />
        <ellipse className="esc-bar-sombra" cx="100" cy="146.5" rx="82" ry="6" fill="#0b0620" opacity=".3" />
        <ellipse cx="222" cy="146.6" rx="16" ry="3" fill="#0b0620" opacity=".28" />
        <ellipse cx="278" cy="146.6" rx="20" ry="3.2" fill="#0b0620" opacity=".28" />

        <g className="esc-bar-flota">
          {/* ---------- la pared de la barra: letrero de neón y estantería ---------- */}
          <rect x="26" y="38" width="146" height="64" rx="2" fill={u('pa')} />
          <rect x="26" y="38" width="146" height="1.4" rx=".7" fill="#7c5cc4" opacity=".6" />
          {/* la guirnalda de foquitos, en dos comba sobre la pared */}
          <path d="M26 38.6Q62 47 99 38.6Q135 47 172 38.6" fill="none" stroke="#0b0620" strokeWidth=".7" />
          {GUIRNALDA.map(([x, y, c], i) => (
            <circle key={x} className={i % 2 ? 'esc-bar-foco-b' : 'esc-bar-foco'} cx={x} cy={y + 1.4} r="1.3" fill={c} />
          ))}
          {/* el letrero: copa en celeste y BAR en rosa, con su halo */}
          <g className="esc-bar-halo">
            <path d="M80 44H96L88 53ZM88 53V61M83.6 61H92.4" fill="none" stroke="#67e8f9" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" opacity=".35" />
            <text x="132" y="62" textAnchor="middle" fontSize="19" fontWeight="900" letterSpacing="3" fill="none" stroke="#f472b6" strokeWidth="3.6" strokeLinejoin="round" opacity=".45">
              BAR
            </text>
          </g>
          <path d="M80 44H96L88 53ZM88 53V61M83.6 61H92.4" fill="none" stroke="#cffafe" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M91 42L86.4 49" stroke="#cffafe" strokeWidth="1" strokeLinecap="round" />
          <circle cx="86" cy="49.6" r="1.4" fill="#86efac" />
          <text className="esc-bar-neon" x="132" y="62" textAnchor="middle" fontSize="19" fontWeight="900" letterSpacing="3" fill="#ffe4f3" stroke="#f472b6" strokeWidth=".7">
            BAR
          </text>
          {/* la estantería: dos repisas con su luz de atrás */}
          <rect x="30" y="70" width="138" height="15" fill={u('lc')} className="esc-bar-luzestante" />
          <rect x="30" y="86.4" width="138" height="13.6" fill={u('lr')} className="esc-bar-luzestante" style={{ animationDelay: '-1.6s' }} />
          {ESTANTE_BAR.map((r) => (
            <g key={r.base}>
              {r.botellas.map(([x, c, a]) => (
                <g key={x} transform={`translate(${x} ${r.base})`}>
                  <BotellaBar color={c} alto={a} />
                </g>
              ))}
              <rect x="28" y={r.base} width="142" height="1.6" fill="#a78bfa" />
            </g>
          ))}

          {/* ---------- el barman, detrás de la barra ---------- */}
          <g>
            {/* el cuerpo: camisa blanca, chaleco y moñito */}
            <path d="M49 104V84Q49 76.6 56 75.6H68Q75 76.6 75 84V104Z" fill="#f8fafc" />
            <path d="M49 104V84Q49 77 55.2 75.8L59.4 86L62 104Z" fill="#2e1065" />
            <path d="M75 104V84Q75 77 68.8 75.8L64.6 86L62 104Z" fill="#2e1065" />
            <circle cx="62" cy="92" r=".7" fill="#c4b5fd" />
            <circle cx="62" cy="96.4" r=".7" fill="#c4b5fd" />
            <path d="M58.6 75.4L62 77.4L65.4 75.4V79.4L62 77.4L58.6 79.4Z" fill="#ec4899" />
            {/* la cabeza */}
            <rect x="59.6" y="70.6" width="4.8" height="5" fill="#b77b52" />
            <ellipse cx="62" cy="65" rx="6.2" ry="6.8" fill={u('ca')} />
            <circle cx="55.8" cy="65.8" r="1.4" fill="#c98b5c" />
            <circle cx="68.2" cy="65.8" r="1.4" fill="#c98b5c" />
            <path d="M55.6 64.4Q55 57.6 62 57.4Q69.2 57.6 68.4 64.4Q67.4 60.4 62.4 61Q58 60.6 55.6 64.4Z" fill="#231431" />
            <circle cx="59.6" cy="65.6" r=".8" fill="#231431" />
            <circle cx="64.4" cy="65.6" r=".8" fill="#231431" />
            <path d="M59.8 68.6Q62 70.2 64.2 68.6" fill="none" stroke="#7c3f22" strokeWidth=".8" strokeLinecap="round" />
            {/* el brazo que empuja el trago */}
            <g className="esc-bar-brazo">
              <path d="M72 79Q78.6 84 79.6 98.6" fill="none" stroke="#f8fafc" strokeWidth="4.6" strokeLinecap="round" />
              <circle cx="79.8" cy="99.4" r="2.2" fill={u('ca')} />
            </g>
            {/* el otro brazo, apoyado */}
            <path d="M52 79Q47 86 50 98" fill="none" stroke="#f8fafc" strokeWidth="4.6" strokeLinecap="round" />
            <circle cx="50.4" cy="99" r="2.1" fill={u('ca')} />
          </g>

          {/* ---------- la barra ---------- */}
          <rect x="22" y="104" width="154" height="42" rx="1.6" fill={u('ba')} />
          {[48, 74, 100, 126, 152].map((x) => (
            <rect key={x} x={x} y="112" width="1" height="30" fill="#1a1036" opacity=".5" />
          ))}
          <rect className="esc-bar-filo" x="22" y="106.6" width="154" height="1.4" fill="#f472b6" />
          <rect x="22" y="106.2" width="154" height="2.2" fill="#f472b6" opacity=".25" />
          <rect x="22" y="141" width="154" height="5" rx="1" fill="#120a2a" opacity=".55" />
          <rect x="18" y="100.6" width="162" height="4.6" rx="2" fill={u('ta')} />
          <rect x="20" y="101.1" width="158" height="1.1" rx=".5" fill="#f5d0a3" opacity=".7" />

          {/* las dos banquetas, delante de la barra */}
          {[58, 128].map((x) => (
            <g key={x}>
              <path d={`M${x - 6} 146L${x - 3} 124M${x + 6} 146L${x + 3} 124`} stroke="#c4b5fd" strokeWidth="1.6" strokeLinecap="round" />
              <ellipse cx={x} cy="136" rx="5" ry="1.2" fill="none" stroke="#a78bfa" strokeWidth="1" />
              <ellipse cx={x} cy="123.2" rx="9" ry="2.8" fill="#be185d" />
              <ellipse cx={x} cy="121.8" rx="9" ry="2.8" fill="#ec4899" />
              <ellipse cx={x - 2.6} cy="121.2" rx="4" ry=".9" fill="#fff" opacity=".4" />
            </g>
          ))}

          {/* ---------- la mesa alta con sus dos chops ---------- */}
          <rect x="220.4" y="103" width="3.2" height="42" rx="1.2" fill="#a78bfa" />
          <ellipse cx="222" cy="145" rx="9" ry="2.2" fill="#7c5cc4" />
          <ellipse cx="222" cy="103.2" rx="20" ry="4.6" fill="#7c4a26" />
          <ellipse cx="222" cy="101.8" rx="20" ry="4.6" fill={u('ta')} />
          <ellipse cx="216" cy="100.8" rx="10" ry="1.4" fill="#fff" opacity=".3" />
          {/* el número de la mesa */}
          <g transform="translate(222 101.4)">
            <path d="M-3.6 0L-2.6-9H2.6L3.6 0Z" fill="#fdf2f8" />
            <text x="0" y="-2.4" textAnchor="middle" fontSize="6.2" fontWeight="900" fill="#be185d">
              3
            </text>
          </g>
          <g transform="translate(230 101.8)">
            <Chop vidrio={u('vd')} cerveza={u('ce')} retraso={0} />
          </g>
          <g transform="translate(239.6 102.6)">
            <Chop vidrio={u('vd')} cerveza={u('ce')} retraso={-0.8} />
          </g>

          {/* ---------- el rincón del karaoke ---------- */}
          {/* la pantalla con la letra que se va pintando */}
          <path d="M273 0V54M291 0V54" stroke="#7c5cc4" strokeWidth=".7" opacity=".8" />
          <rect x="268" y="54" width="28" height="19" rx="1.8" fill="#0f0a24" stroke="#7c5cc4" strokeWidth="1" />
          <rect x="270" y="56" width="24" height="15" rx="1" fill="#1e1b4b" />
          <rect x="272.4" y="60" width="19" height="2" rx="1" fill="#6d5fa6" />
          <rect x="274.4" y="65" width="15" height="2" rx="1" fill="#6d5fa6" />
          <rect className="esc-bar-letra" x="272.4" y="60" width="19" height="2" rx="1" fill="#67e8f9" />
          <rect className="esc-bar-letra-b" x="274.4" y="65" width="15" height="2" rx="1" fill="#f472b6" />
          {/* el parlante */}
          <rect x="283" y="116" width="15" height="30" rx="1.6" fill="#1a1036" />
          <rect x="283" y="116" width="15" height="1.6" rx=".8" fill="#4c3a8a" />
          <circle cx="290.5" cy="123.6" r="3" fill="#2e2260" />
          <g transform="translate(290.5 136.4)">
            <g className="esc-bar-bajo">
              <circle r="5.2" fill="#2e2260" />
              <circle r="3.4" fill="#120a2a" />
              <circle r="1.4" fill="#4c3a8a" />
            </g>
          </g>
          {/* el micrófono en su pie */}
          <path d="M263 146L268 140L273 146" fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="267.4" y="96" width="1.4" height="45" fill="#a5b4fc" />
          <path d="M268 140Q266 143.6 262 144.4Q258 145 258.4 146" fill="none" stroke="#1a1036" strokeWidth="1" />
          <path d="M268.1 96.4L268.6 88" stroke="#334155" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="268.8" cy="86" r="3.2" fill="#cbd5e1" />
          <path d="M266 85H271.6M266.4 87H271.2" stroke="#64748b" strokeWidth=".5" />
          <circle cx="267.6" cy="84.8" r="1" fill="#fff" opacity=".8" />
          {NOTAS.map(([doble, c, dx, d], i) => (
            <g key={i} transform="translate(262 84)">
              <g className="esc-bar-nota" style={v({ '--dx': dx, animationDelay: `${d}s` })}>
                <Nota doble={doble} color={c} />
              </g>
            </g>
          ))}

          {/* ---------- el trago que se vende ---------- */}
          {/*
            Nace junto a la mano del barman (84, 101). Se desliza por la barra hasta su
            punta (+88) y de ahí salta a la mesa 3 (+128). x en una capa, y en otra.
          */}
          <g transform="translate(84 101)">
            <g className="esc-bar-trago-x">
              {/* las rayitas de la velocidad, detrás del vaso */}
              <g className="esc-bar-rayas">
                <rect x="-15" y="-4" width="8" height=".8" rx=".4" fill="#f9a8d4" />
                <rect x="-13" y="-7" width="6" height=".8" rx=".4" fill="#67e8f9" />
                <rect x="-17" y="-1.6" width="9" height=".8" rx=".4" fill="#fff" opacity=".7" />
              </g>
              <g className="esc-bar-trago-y">
                <g className="esc-bar-trago">
                  <g clipPath={`url(#${g('cv')})`}>
                    <g className="esc-bar-nivel">
                      <rect x="-3.4" y="-9" width="6.8" height="8.4" fill={u('tg')} />
                      <rect x="-2.2" y="-7.6" width="2.4" height="2.4" rx=".4" fill="#fff" opacity=".55" transform="rotate(14)" />
                      <rect x=".2" y="-5" width="2.2" height="2.2" rx=".4" fill="#fff" opacity=".45" transform="rotate(-10)" />
                    </g>
                  </g>
                  <path d="M-3.6-10.6H3.6L3.1-.6Q3 0 2.4 0H-2.4Q-3 0-3.1-.6Z" fill={u('vd')} stroke="#e0e7ff" strokeWidth=".4" strokeOpacity=".7" />
                  <path d="M-2.4-9.6L-2-1.4" stroke="#fff" strokeWidth=".7" strokeLinecap="round" opacity=".7" />
                  {/* la pajita y la rodaja de limón */}
                  <path d="M1-6L3.4-14.6L5.6-14.6" fill="none" stroke="#67e8f9" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="-3.4" cy="-10.6" r="2.4" fill="#a3e635" />
                  <circle cx="-3.4" cy="-10.6" r="1.6" fill="#ecfccb" />
                  <path d="M-3.4-12.2V-9M-5-10.6H-1.8" stroke="#a3e635" strokeWidth=".35" />
                </g>
              </g>
            </g>
          </g>

          {/* la venta: aro sobre la mesa, destellos y lo que se suma a la cuenta */}
          <ellipse className="esc-bar-aro" cx="212" cy="101.6" rx="11" ry="3.2" fill="none" stroke="#f472b6" strokeWidth="1.3" />
          <g transform="translate(203 84)">
            <path className="esc-bar-chispa" d={ESTRELLA} fill="#67e8f9" />
          </g>
          <g transform="translate(224 80)">
            <path className="esc-bar-chispa" d={ESTRELLA} fill="#f9a8d4" style={{ animationDelay: '-6.35s' }} />
          </g>
          <g transform="translate(212 78)">
            <g className="esc-bar-suma">
              <rect x="-13" y="-6" width="26" height="9" rx="4.5" fill="#fdf2f8" />
              <text x="0" y="1" textAnchor="middle" fontSize="6.2" fontWeight="900" fill="#be185d">
                +Bs 30
              </text>
            </g>
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Mesa 3" texto="Cuenta · Bs 120" tono="rosa" />
    </Marco>
  )
}
