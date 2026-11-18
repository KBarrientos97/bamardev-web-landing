import { useId, type CSSProperties } from 'react'
import './EscenasBillarYAcademia.css'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de «Billar y Restobar» y «Academias e institutos».
  Mismo sistema que el resto de escenas: un objeto héroe entero y centrado sobre
  una plataforma con sombra de contacto, luz desde arriba a la izquierda, volumen
  con degradados suaves y movimiento sólo con transform/opacity (keyframes
  `esc-billaracad-*` en el .css de al lado). Todo el movimiento cuenta una sola
  micro-historia en un ciclo maestro de 6.5 s, el mismo que el del Aviso
  (`esc-chip`, index.css), para que la notificación aparezca justo después de la
  acción que la causa.
*/

/** Pivote fijo en coordenadas del viewBox (lámpara, lomo del libro…). */
const pivote = (x: number, y: number): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${x}px ${y}px` })

/**
 * `.escena svg *` (index.css) pone el origen de todo en el centro de su caja, y eso
 * también afecta a los atributos `rotate()`/`scale()`. Con este estilo, un grupo con
 * `transform="…"` vuelve a girar sobre el origen de su sistema de coordenadas.
 */
const origen0: CSSProperties = { transformBox: 'view-box', transformOrigin: '0px 0px' }

const f = (n: number) => Math.round(n * 100) / 100

/** Polígono con las esquinas redondeadas (curvas cuadráticas), para las piezas con perspectiva. */
function redondo(pts: [number, number][], r: number): string {
  const n = pts.length
  let d = ''
  pts.forEach((p, i) => {
    const a = pts[(i + n - 1) % n]
    const b = pts[(i + 1) % n]
    const ta = Math.min(r / Math.hypot(a[0] - p[0], a[1] - p[1]), 0.5)
    const tb = Math.min(r / Math.hypot(b[0] - p[0], b[1] - p[1]), 0.5)
    const p1 = [p[0] + (a[0] - p[0]) * ta, p[1] + (a[1] - p[1]) * ta]
    const p2 = [p[0] + (b[0] - p[0]) * tb, p[1] + (b[1] - p[1]) * tb]
    d += `${i === 0 ? 'M' : 'L'}${f(p1[0])} ${f(p1[1])}Q${p[0]} ${p[1]} ${f(p2[0])} ${f(p2[1])}`
  })
  return `${d}Z`
}

/**
 * Plataforma común de las dos escenas: disco suave con su canto y la sombra de contacto
 * (una elipse apretada y otra ancha y difusa). `tinte` la combina con el fondo del marco.
 */
function Base({ tinte, cy = 145 }: { tinte: 'verde' | 'violeta'; cy?: number }) {
  const id = useId().replace(/:/g, '')
  const c =
    tinte === 'verde'
      ? { luz: '#f7fffb', medio: '#cdf3e0', canto: '#8fd6b4', sombra: '#064e3b' }
      : { luz: '#faf8ff', medio: '#e2dcfb', canto: '#b9aaf0', sombra: '#2e1065' }
  return (
    <>
      <defs>
        <radialGradient id={`${id}d`} cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor={c.luz} />
          <stop offset="1" stopColor={c.medio} />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy={cy + 3.4} rx="134" ry="13" fill={c.canto} opacity=".8" />
      <ellipse cx="150" cy={cy} rx="134" ry="13" fill={`url(#${id}d)`} />
      <ellipse cx="150" cy={cy} rx="133.4" ry="12.4" fill="none" stroke="#fff" strokeWidth=".9" opacity=".7" />
      {/* sombra de contacto: ancha y difusa + apretada y oscura */}
      <ellipse cx="152" cy={cy + 4} rx="116" ry="9" fill={c.sombra} opacity=".08" />
      <ellipse cx="152" cy={cy + 4.5} rx="96" ry="5" fill={c.sombra} opacity=".14" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  BILLAR Y RESTOBAR                                                  */
/* ------------------------------------------------------------------ */

/** Bola de billar centrada en (0,0): sombra abajo-derecha, volumen y un solo brillo fino. */
function Bola({ grad, className, estilo }: { grad: string; className: string; estilo?: CSSProperties }) {
  return (
    <g className={className} style={estilo}>
      <ellipse cx="1.3" cy="2.4" rx="3.9" ry="1.8" fill="#052e22" opacity=".3" />
      <circle r="3.8" fill={`url(#${grad})`} />
      <ellipse cx="-1.2" cy="-1.5" rx="1.2" ry=".65" fill="#fff" opacity=".75" />
    </g>
  )
}

// Geometría de la mesa en perspectiva 3/4 (el borde de atrás es más angosto que el de adelante)
const MESA_TOPE = redondo([[92, 62], [208, 62], [242, 117], [58, 117]], 7)
const MESA_CUSHION = redondo([[96, 68], [204, 68], [232, 111], [68, 111]], 4)
const MESA_PANO = redondo([[98, 73], [202, 73], [223.7, 106], [76.3, 106]], 3)

/**
 * Mesa de «Billar y Restobar»: el taco rompe el triángulo, una bola cae al buzón y corre la cuenta
 * de la mesa (Aviso). A la derecha, la jarra de cerveza del restobar baja mientras se juega y
 * se rellena: el consumo que se suma a la cuenta. Ciclo maestro de 6.5 s.
 */
export function EscenaBillar() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  // Rack: 6 bolas en triángulo con la punta hacia la blanca. [x, y, gradiente, dx, dy]; la amarilla de arriba va al buzón.
  const rack: { x: number; y: number; c: string; dx: number; dy: number }[] = [
    { x: 158, y: 90, c: 'br', dx: 10, dy: 2 },
    { x: 164.6, y: 86.2, c: 'ba', dx: 4, dy: -4 },
    { x: 164.6, y: 93.8, c: 'bz', dx: 16, dy: 9 },
    { x: 171.2, y: 90, c: 'br', dx: 30, dy: -1 },
    { x: 171.2, y: 97.6, c: 'bz', dx: 20, dy: -2 },
  ]
  return (
    <Marco fondo="bg-gradient-to-b from-emerald-100 via-teal-50 to-white">
      <div aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('top')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9b985" />
            <stop offset="1" stopColor="#b97a47" />
          </linearGradient>
          <linearGradient id={g('apron')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9a5d36" />
            <stop offset="1" stopColor="#6b3a1f" />
          </linearGradient>
          <linearGradient id={g('leg')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8a5130" />
            <stop offset="1" stopColor="#5a3019" />
          </linearGradient>
          <linearGradient id={g('cush')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f9467" />
            <stop offset="1" stopColor="#136a49" />
          </linearGradient>
          <linearGradient id={g('pano')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4fd096" />
            <stop offset="1" stopColor="#25966a" />
          </linearGradient>
          <linearGradient id={g('cono')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2b0" stopOpacity=".6" />
            <stop offset="1" stopColor="#fff2b0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('shade')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b8a80" />
            <stop offset="1" stopColor="#0d4d4a" />
          </linearGradient>
          <linearGradient id={g('shaft')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6e2bb" />
            <stop offset="1" stopColor="#c8985c" />
          </linearGradient>
          <linearGradient id={g('butt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a3a22" />
            <stop offset="1" stopColor="#3f1c10" />
          </linearGradient>
          <linearGradient id={g('beer')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7c85a" />
            <stop offset="1" stopColor="#d9861b" />
          </linearGradient>
          <linearGradient id={g('glass')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".6" />
            <stop offset="1" stopColor="#dff3f5" stopOpacity=".18" />
          </linearGradient>
          <linearGradient id={g('bar')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dcc7a8" />
            <stop offset="1" stopColor="#b79c78" />
          </linearGradient>
          <clipPath id={g('vaso')}>
            <path d="M260.6 100.6H274.4L273.3 124.6Q273.2 126.4 271.2 126.4H263.8Q261.8 126.4 261.7 124.6Z" />
          </clipPath>
          {[
            ['bb', '#ffffff', '#c9d3df'],
            ['br', '#fb7a8c', '#d51f45'],
            ['ba', '#fde36b', '#e5ad0f'],
            ['bz', '#80c4f5', '#2358d6'],
          ].map(([n, c1, c2]) => (
            <radialGradient key={n} id={g(n)} cx=".35" cy=".3" r=".85">
              <stop offset="0" stopColor={c1} />
              <stop offset="1" stopColor={c2} />
            </radialGradient>
          ))}
        </defs>

        <Base tinte="verde" />

        {/* taburete de la izquierda: más chico y apagado, para dar profundidad */}
        <g opacity=".92">
          <ellipse cx="25" cy="149" rx="9" ry="2.2" fill="#064e3b" opacity=".16" />
          <path d="M17 138L14.5 148M33 138L35.5 148M25 140V149" stroke="#8fa39b" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="25" cy="144" rx="7.6" ry="1.9" fill="none" stroke="#a9bab3" strokeWidth="1" />
          <ellipse cx="25" cy="136.6" rx="11" ry="3.4" fill="#7d9088" />
          <ellipse cx="25" cy="135" rx="11" ry="3.4" fill="#b1c3bb" />
          <ellipse cx="21.6" cy="134.2" rx="5" ry="1" fill="#fff" opacity=".5" />
        </g>

        {/* mesa alta del restobar a la derecha, con la jarra */}
        <g>
          <ellipse cx="269" cy="150" rx="11" ry="2.6" fill="#064e3b" opacity=".16" />
          <rect x="267.2" y="133" width="3.2" height="16" rx="1.4" fill="#8b7358" />
          <ellipse cx="268.8" cy="148.4" rx="9" ry="2.4" fill="#8b7358" />
          <ellipse cx="268.8" cy="133" rx="15" ry="4.4" fill="#9d825f" />
          <ellipse cx="268.8" cy="131.2" rx="15" ry="4.4" fill={`url(#${g('bar')})`} />
          <ellipse cx="263" cy="130.4" rx="7" ry="1.2" fill="#fff" opacity=".4" />
          {/* sombra de la jarra sobre la mesa */}
          <ellipse cx="270" cy="129.8" rx="9" ry="2" fill="#5b4630" opacity=".25" />
          {/* asa y vidrio */}
          <path d="M275.4 104.5h3.3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-3.6" fill="none" stroke="#a9cfd6" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M275.6 105.4h3a2.2 2.2 0 0 1 2.2 2.2v8.8a2.2 2.2 0 0 1-2.2 2.2h-3.2" fill="none" stroke="#fff" strokeWidth=".7" strokeLinecap="round" opacity=".7" />
          <path d="M259 99.6H276L274.6 124.8Q274.4 128.2 271.4 128.2H263.6Q260.6 128.2 260.4 124.8Z" fill={`url(#${g('glass')})`} stroke="#8fbcc4" strokeWidth=".7" strokeOpacity=".7" />
          <g clipPath={`url(#${g('vaso')})`}>
            <g className="esc-billaracad-cerveza">
              <rect x="259" y="102" width="17" height="25" fill={`url(#${g('beer')})`} />
              <circle className="esc-billaracad-burbuja" cx="264.4" cy="123" r=".8" fill="#fff" opacity=".8" />
              <circle className="esc-billaracad-burbuja" cx="268.6" cy="125" r=".7" fill="#fff" opacity=".8" style={{ animationDelay: '-1.1s' }} />
              <circle className="esc-billaracad-burbuja" cx="271.6" cy="123.5" r=".9" fill="#fff" opacity=".8" style={{ animationDelay: '-2.2s' }} />
            </g>
          </g>
          {/* fondo grueso y reflejo del vidrio */}
          <path d="M260.8 123.6H273.8L273.4 125Q273.2 126.4 271.4 126.4H263.4Q261.6 126.4 261.2 125Z" fill="#fff" opacity=".35" />
          <path d="M262.2 101.5L263.6 101.5L264.2 123L262.8 123Z" fill="#fff" opacity=".55" />
          <g className="esc-billaracad-espuma">
            <path d="M259 102.4a3.4 3.4 0 0 1 2.6-4.4a3.8 3.8 0 0 1 6.6-1.6a3.8 3.8 0 0 1 6.4 1.8a3.4 3.4 0 0 1 1.8 4.2z" fill="#fff6e0" />
            <path d="M259.4 102.2h16l-.3.5q-7.8 1.8-15.4 0z" fill="#ecd6a2" opacity=".7" />
            <path d="M261 101.6a2.4 2.4 0 0 1 2-2.6" stroke="#e9d5a8" strokeWidth=".9" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* patas delanteras y faldón */}
        <rect x="66" y="132" width="11" height="16" rx="3" fill={`url(#${g('leg')})`} />
        <rect x="223" y="132" width="11" height="16" rx="3" fill={`url(#${g('leg')})`} />
        <path d="M58 116H242V130Q242 134 238 134H62Q58 134 58 130Z" fill={`url(#${g('apron')})`} />
        <rect x="64" y="118" width="172" height="1.8" rx=".9" fill="#fff" opacity=".18" />

        {/* tope de madera con su bisel y los diamantes */}
        <path d={MESA_TOPE} fill={`url(#${g('top')})`} />
        <path d="M96 63.4H204" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
        {[118, 134, 166, 182].map((x) => (
          <g key={x} fill="#fff6e2" opacity=".85">
            <path d={`M${x} 63.6l1.6 1.5-1.6 1.5-1.6-1.5z`} />
            <path d={`M${f(150 + (x - 150) * 1.27)} 112.6l2.1 1.8-2.1 1.8-2.1-1.8z`} />
          </g>
        ))}

        {/* banda de goma y paño */}
        <path d={MESA_CUSHION} fill={`url(#${g('cush')})`} />
        <path d={MESA_PANO} fill={`url(#${g('pano')})`} />
        <path d="M104 74.4H196" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".18" />

        {/* seis buzones */}
        {(
          [
            [99, 71, 6, 3.8],
            [201, 71, 6, 3.8],
            [150, 69.6, 6, 3.4],
            [71, 108, 7.4, 4.5],
            [229, 108, 7.4, 4.5],
            [150, 109.6, 7.4, 4.2],
          ] as [number, number, number, number][]
        ).map(([x, y, rx, ry]) => (
          <g key={`${x}-${y}`}>
            <ellipse cx={x} cy={y} rx={rx + 1.3} ry={ry + 0.9} fill="#7c4a2b" />
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#0c2a23" />
            <path d={`M${x - rx * 0.6} ${y - ry * 0.55}a${rx * 0.7} ${ry * 0.7} 0 0 1 ${rx * 0.9} ${-ry * 0.3}`} stroke="#fff" strokeWidth=".8" strokeLinecap="round" fill="none" opacity=".2" />
          </g>
        ))}

        {/* cono de luz de la lámpara: se mece con ella y queda por debajo de las bolas */}
        <g className="esc-billaracad-lampara" style={pivote(150, 0)}>
          <path d="M138 42L162 42L226 106L74 106Z" fill={`url(#${g('cono')})`} className="esc-billaracad-luz" />
        </g>

        {/* tiza sobre el borde de atrás */}
        <g>
          <ellipse cx="121.6" cy="66.4" rx="4" ry="1.2" fill="#3d2411" opacity=".25" />
          <path d="M117.4 62.8h7.2v3.4h-7.2z" fill="#2f88d8" />
          <path d="M117.4 62.8l1.6-1.6h5.6l0 1.6z" fill="#8cc8f5" />
          <path d="M124.6 62.8v3.4l1-1.2v-3.4z" fill="#1d62a8" />
        </g>

        {/* las bolas: la blanca y el triángulo (todas arrancan juntas con la jugada) */}
        <g transform="translate(108 90)">
          <Bola grad={g('bb')} className="esc-billaracad-blanca" />
        </g>
        {rack.map((b) => (
          <g key={`${b.x}-${b.y}`} transform={`translate(${b.x} ${b.y})`}>
            <Bola grad={g(b.c)} className="esc-billaracad-rueda" estilo={v({ '--dx': `${b.dx}px`, '--dy': `${b.dy}px` })} />
          </g>
        ))}
        <g transform="translate(171.2 82.4)">
          <Bola grad={g('ba')} className="esc-billaracad-cae" />
        </g>

        {/* destello del choque y aro del buzón donde cae la amarilla */}
        <g transform="translate(153.6 90)">
          <circle className="esc-billaracad-choque" r="6" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0" />
        </g>
        <g transform="translate(201 71)">
          <ellipse className="esc-billaracad-aro" rx="8" ry="5" fill="none" stroke="#fbbf24" strokeWidth="1.6" opacity="0" />
        </g>

        {/* el taco: gira sobre la punta (en la blanca) y se desliza por su propio eje */}
        <g transform="translate(104.6 91.7) rotate(-26)" style={origen0}>
          <g className="esc-billaracad-taco">
            <path d="M0 -.9L-36 -1.5V1.5L0 .9Z M-36 -1.5L-56 -2.5Q-57.4 -2.5 -57.4 -1.2V1.2Q-57.4 2.5 -56 2.5L-36 1.5Z" fill="#052e22" opacity=".18" transform="translate(1 2.6)" />
            <path d="M0 -1L-36 -1.5V1.5L0 1Z" fill={`url(#${g('shaft')})`} />
            <path d="M-36 -1.5L-56 -2.5Q-57.4 -2.5 -57.4 -1.2V1.2Q-57.4 2.5 -56 2.5L-36 1.5Z" fill={`url(#${g('butt')})`} />
            <rect x="-39" y="-1.8" width="2.4" height="3.6" rx=".6" fill="#e6c26a" />
            <rect x="-5" y="-1.15" width="3.4" height="2.3" fill="#f1f5f9" />
            <rect x="-1.7" y="-1" width="1.7" height="2" rx=".6" fill="#4e9fe6" />
            <path d="M-6 -.7L-34 -1.15" stroke="#fff" strokeWidth=".6" strokeLinecap="round" opacity=".6" />
            <path d="M-42 -1.4L-55 -2" stroke="#fff" strokeWidth=".6" strokeLinecap="round" opacity=".28" />
          </g>
        </g>

        {/* lámpara colgante: pantalla esmaltada, foco cálido y cordón */}
        <g className="esc-billaracad-lampara" style={pivote(150, 0)}>
          <line x1="150" y1="0" x2="150" y2="21" stroke="#5b6f6a" strokeWidth="1.4" strokeLinecap="round" />
          <ellipse cx="150" cy="43" rx="13.5" ry="3.6" fill="#fff0a8" className="esc-billaracad-foco" />
          <path d="M131.5 42C131.5 30 139 21.6 150 21.6C161 21.6 168.5 30 168.5 42Z" fill={`url(#${g('shade')})`} />
          <path d="M136 38.4C137 31.6 142 27 148 26" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".45" />
          <rect x="129.5" y="40" width="41" height="4" rx="2" fill="#d9a441" />
          <rect x="131" y="40.5" width="38" height="1.2" rx=".6" fill="#fff" opacity=".45" />
          <rect x="147" y="18.4" width="6" height="4.4" rx="1.6" fill="#d9a441" />
        </g>
      </svg>
      <Aviso
        etiqueta="Mesa 3"
        texto="1:20 h · Bs 48"
        tono="ambar"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="10" cy="10" r="7.6" />
            <path className="esc-billaracad-aguja" d="M10 10V5.2" style={pivote(10, 10)} />
          </svg>
        }
      />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  ACADEMIAS E INSTITUTOS                                             */
/* ------------------------------------------------------------------ */

// Contorno de cada página del libro (el lomo está en x = 150)
const PAG_IZQ = 'M150 98C126 86 90 85 62 90V128C90 123 126 126 150 138Z'
const PAG_DER = 'M150 98C174 86 210 85 238 90V128C210 123 174 126 150 138Z'

/** Renglón de texto que sigue la curva de la página; en la derecha se espeja respecto al lomo. */
function Renglon({ lado, x1, x2, y, grueso = false }: { lado: 'izq' | 'der'; x1: number; x2: number; y: number; grueso?: boolean }) {
  const x = (n: number) => (lado === 'izq' ? n : 300 - n)
  const alto = (x2 - x1) * 0.09 // negativo en la página derecha (el renglón arranca en el lomo y sube hacia el borde)
  return (
    <path
      d={`M${x(x1)} ${y}Q${x((x1 + x2) / 2)} ${f(y - 2.4 + alto * 0.4)} ${x(x2)} ${f(y + alto)}`}
      stroke={grueso ? '#8f85e6' : '#c3b8f3'}
      strokeWidth={grueso ? 2.6 : 1.9}
      strokeLinecap="round"
      fill="none"
    />
  )
}

/** Lápiz apoyado en el vaso: de la base a la punta, con el cono de madera y la mina. */
function Lapiz({ x1, y1, x2, y2, color, tapa }: { x1: number; y1: number; x2: number; y2: number; color: string; tapa: string }) {
  const L = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / L
  const uy = (y2 - y1) / L
  const px = -uy * 1.9
  const py = ux * 1.9
  const cx = x2 - ux * 5.2
  const cy = y2 - uy * 5.2
  return (
    <g>
      <line x1={x1} y1={y1} x2={cx} y2={cy} stroke={color} strokeWidth="3.8" />
      <line x1={x1} y1={y1} x2={x1 + ux * 3} y2={y1 + uy * 3} stroke={tapa} strokeWidth="3.8" />
      <path d={`M${f(cx + px)} ${f(cy + py)}L${x2} ${y2}L${f(cx - px)} ${f(cy - py)}Z`} fill="#f1d3a1" />
      <path d={`M${f(x2 - ux * 1.7 + px * 0.35)} ${f(y2 - uy * 1.7 + py * 0.35)}L${x2} ${y2}L${f(x2 - ux * 1.7 - px * 0.35)} ${f(y2 - uy * 1.7 - py * 0.35)}Z`} fill="#475569" />
    </g>
  )
}

/**
 * Libro abierto con el birrete encima: se voltea una hoja, el sello de la nota cae en la
 * página y el birrete salta de alegría mientras llega el aviso de la nota. Ciclo de 6.5 s.
 */
export function EscenaAcademia() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  return (
    <Marco fondo="bg-gradient-to-b from-indigo-100 via-violet-50 to-white">
      <div aria-hidden className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('c')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7478f0" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
          <linearGradient id={g('h')} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset="1" stopColor="#e6e1f8" />
          </linearGradient>
          <linearGradient id={g('i')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset="1" stopColor="#e6e1f8" />
          </linearGradient>
          <linearGradient id={g('l')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b1d8f" stopOpacity="0" />
            <stop offset=".5" stopColor="#3b1d8f" stopOpacity=".24" />
            <stop offset="1" stopColor="#3b1d8f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('b')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5f63e8" />
            <stop offset="1" stopColor="#2f2a94" />
          </linearGradient>
          <linearGradient id={g('s')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fcd34d" />
            <stop offset="1" stopColor="#e8890c" />
          </linearGradient>
          <linearGradient id={g('v')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9d4ef" />
            <stop offset="1" stopColor="#aaa4d4" />
          </linearGradient>
        </defs>

        <Base tinte="violeta" />

        {/* pila de libros de la izquierda: más chica y apagada */}
        <g opacity=".93">
          <rect x="15" y="136.4" width="32" height="9.6" rx="2" fill="#9c97cf" />
          <rect x="17" y="138.4" width="29" height="5.6" rx="1" fill="#f2effb" />
          <rect x="15" y="136.4" width="32" height="2.4" rx="1.2" fill="#b3aee0" />
          <rect x="19" y="127.8" width="25" height="8.6" rx="2" fill="#7f86c4" />
          <rect x="21" y="129.8" width="22" height="4.6" rx="1" fill="#f2effb" />
          <rect x="19" y="127.8" width="25" height="2.2" rx="1.1" fill="#99a0d8" />
          <rect x="17" y="119.4" width="28" height="8.6" rx="2" fill="#b9a8e2" />
          <rect x="19" y="121.4" width="25" height="4.6" rx="1" fill="#f2effb" />
          <rect x="17" y="119.4" width="28" height="2.2" rx="1.1" fill="#cfc2ee" />
        </g>

        {/* vaso con lápices de la derecha */}
        <g opacity=".95">
          <ellipse cx="271" cy="148.6" rx="13" ry="2.8" fill="#2e1065" opacity=".16" />
          <ellipse cx="271" cy="127.4" rx="10.6" ry="3.2" fill="#6f68ad" />
          <Lapiz x1={268} y1={127} x2={262} y2={105} color="#e5b84a" tapa="#f08aa3" />
          <Lapiz x1={271} y1={127} x2={272} y2={102} color="#8d96d8" tapa="#cbd5e1" />
          <Lapiz x1={274} y1={127} x2={282} y2={107} color="#e08aa5" tapa="#cbd5e1" />
          <path d="M260.4 127.4Q271 132 281.6 127.4V145.4Q271 150.6 260.4 145.4Z" fill={`url(#${g('v')})`} />
          <path d="M263 129.8L264.6 130.4L264.6 145.6L263 145Z" fill="#fff" opacity=".45" />
        </g>

        {/* todo el libro flota apenas */}
        <g className="esc-billaracad-flota">
          {/* tapa y su grosor */}
          <rect x="52" y="90" width="196" height="56" rx="10" fill="#2f2a94" />
          <rect x="52" y="86" width="196" height="56" rx="10" fill={`url(#${g('c')})`} />
          <rect x="60" y="87.6" width="180" height="1.6" rx=".8" fill="#fff" opacity=".3" />
          {/* canto de las páginas (el bloque tiene grosor) */}
          <g fill="#cdc6ec">
            <path d={PAG_IZQ} transform="translate(0 4)" />
            <path d={PAG_DER} transform="translate(0 4)" />
          </g>
          <path d="M62 128V132C90 127 126 130 150 142V138Z" fill="#b8b0e0" opacity=".6" />
          <path d="M238 128V132C210 127 174 130 150 142V138Z" fill="#b8b0e0" opacity=".6" />
          {/* páginas */}
          <path d={PAG_IZQ} fill={`url(#${g('i')})`} />
          <path d={PAG_DER} fill={`url(#${g('h')})`} />
          <path d="M62 90C90 85 126 86 150 98C174 86 210 85 238 90" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".9" />
          <rect x="132" y="90" width="36" height="52" fill={`url(#${g('l')})`} />

          {/* texto de las dos páginas */}
          <Renglon lado="izq" x1={70} x2={138} y={105} grueso />
          <Renglon lado="izq" x1={70} x2={140} y={112} />
          <Renglon lado="izq" x1={70} x2={126} y={118} />
          <Renglon lado="izq" x1={70} x2={136} y={124} />
          <Renglon lado="der" x1={138} x2={102} y={104} grueso />
          <Renglon lado="der" x1={138} x2={108} y={112} />
          <Renglon lado="der" x1={138} x2={112} y={118} />
          <Renglon lado="der" x1={138} x2={120} y={124} />
          {/* marcapáginas */}
          <path d="M150 138h6l-.4 12-2.6-2.4-2.6 2.4z" fill="#f08aa3" />
          <path d="M150 138h2.2v12l-1.4-1.4-.8.8z" fill="#fff" opacity=".25" />

          {/* sello de la nota: cae sobre la página derecha */}
          <g transform="translate(214 112)">
            <ellipse className="esc-billaracad-aro-sello" rx="12" ry="12" fill="none" stroke="#f59e0b" strokeWidth="1.6" opacity="0" />
            <g className="esc-billaracad-sello">
              <circle cx="1" cy="1.8" r="11.4" fill="#5b3a06" opacity=".22" />
              <circle r="11.4" fill={`url(#${g('s')})`} />
              <circle r="8.6" fill="none" stroke="#fff" strokeWidth=".9" opacity=".7" />
              <text
                textAnchor="middle"
                y="4.4"
                fontSize="12.5"
                fontWeight="800"
                fill="#fff"
                letterSpacing=".4"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                10
              </text>
              <path d="M-7.6 -5.4A9.4 9.4 0 0 1 -1.4 -9" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".55" />
            </g>
          </g>

          {/* hoja que se voltea sobre el lomo: de la derecha a la izquierda */}
          <g className="esc-billaracad-hoja" opacity="0" style={pivote(150, 118)}>
            <path d={PAG_DER} fill={`url(#${g('h')})`} />
            <path d="M150 98C174 86 210 85 238 90" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".9" />
            <Renglon lado="der" x1={138} x2={102} y={104} grueso />
            <Renglon lado="der" x1={138} x2={108} y={112} />
            <Renglon lado="der" x1={138} x2={112} y={118} />
          </g>

          {/* birrete sobre la página izquierda: salta cuando cae el sello */}
          <g transform="translate(100 88) rotate(-6)" style={origen0}>
            {/* la sombra se queda en la página mientras el birrete salta */}
            <ellipse cx="2" cy="10.4" rx="15" ry="3" fill="#2e1065" opacity=".2" />
            <g className="esc-billaracad-birrete">
              <path d="M-12 3v8q12 6.4 24 0V3z" fill={`url(#${g('b')})`} />
              <path d="M-12 3v3q12 6.4 24 0V3z" fill="#000" opacity=".16" />
              <path d="M-25 0L0 10L25 0V3L0 13L-25 3z" fill="#262273" />
              <path d="M0 -10L25 0L0 10L-25 0Z" fill={`url(#${g('b')})`} />
              <path d="M-21 -.6L0 -8.6L21 -.6L0 -3.4Z" fill="#fff" opacity=".26" />
              <circle cy="0" r="2" fill="#fbbf24" />
              {/* borla: cuelga del borde derecho y se balancea tras el salto */}
              <g className="esc-billaracad-borla">
                <path d="M0 0L18 1.6Q23 2 22.6 6.4V14" stroke="#f5b83a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M20.4 13.4h4.4l.9 7h-6.2z" fill="#f2a623" />
                <path d="M21.2 13.4h1.2l-.4 7h-1.2z" fill="#fff" opacity=".35" />
              </g>
            </g>
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Nota" texto="Ana · 10 de 10" tono="violeta" />
    </Marco>
  )
}
