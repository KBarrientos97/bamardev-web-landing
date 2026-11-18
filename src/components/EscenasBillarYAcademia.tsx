import { useId, type CSSProperties } from 'react'
import './EscenasBillarYAcademia.css'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de «Billar y Restobar» y «Academias e institutos».
  Mismo método que Escenas.tsx: SVG propio, sólo transform y opacity con CSS
  (keyframes `esc-billaracad-*` en el .css de al lado) y degradados con prefijo
  de useId para no chocar entre tarjetas.
*/

/** Pivote fijo en coordenadas del viewBox (lámpara, lomo del libro…). */
const pivote = (x: number, y: number): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${x}px ${y}px` })

/**
 * `.escena svg *` (index.css) pone el origen de todo en el centro de su caja, y eso
 * también afecta a los atributos `rotate()`/`scale()`. Con este estilo, un grupo con
 * `transform="…"` vuelve a girar sobre el origen de su sistema de coordenadas.
 */
const origen0: CSSProperties = { transformBox: 'view-box', transformOrigin: '0px 0px' }

/* ------------------------------------------------------------------ */
/*  BILLAR Y RESTOBAR                                                  */
/* ------------------------------------------------------------------ */

/** Bola de billar: con su sombrita y brillo. Centrada en (0,0): se coloca con el `transform` del <g> de fuera. */
function Bola({ grad, className }: { grad: string; className: string }) {
  return (
    <g className={className}>
      <ellipse cx="1.4" cy="2.8" rx="4.6" ry="2.2" fill="#064e3b" opacity=".28" />
      <circle r="4.7" fill={`url(#${grad})`} />
      <circle r="1.9" fill="#fff" opacity=".85" />
      <ellipse cx="-1.6" cy="-2" rx="1.7" ry="1.1" fill="#fff" opacity=".7" />
    </g>
  )
}

/** Una mesa de billar vista de arriba: el taco golpea, la blanca rompe el triángulo y una bola cae al buzón. */
export function EscenaBillar() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  // buzones: 4 esquinas y 2 al medio
  const buzones: [number, number][] = [
    [62, 72],
    [238, 72],
    [62, 136],
    [238, 136],
    [150, 67.5],
    [150, 140.5],
  ]
  // los "diamantes" de madera que marcan el borde
  const diamantes = [84, 112, 188, 216]
  return (
    <Marco fondo="bg-gradient-to-b from-emerald-100 via-teal-50 to-white">
      <div aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('m')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8b57e" />
            <stop offset="1" stopColor="#c58650" />
          </linearGradient>
          <linearGradient id={g('s')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a8683a" />
            <stop offset="1" stopColor="#7b4527" />
          </linearGradient>
          <linearGradient id={g('p')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4cc98d" />
            <stop offset="1" stopColor="#2fa571" />
          </linearGradient>
          <linearGradient id={g('c')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fcd34d" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id={g('z')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff7b8" stopOpacity=".65" />
            <stop offset="1" stopColor="#fff7b8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('t')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5b2c17" />
            <stop offset=".38" stopColor="#7a3f22" />
            <stop offset=".4" stopColor="#e6b878" />
            <stop offset="1" stopColor="#fde9c4" />
          </linearGradient>
          <linearGradient id={g('v')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          {/* bolas: blanca, roja, amarilla y azul */}
          {[
            ['bb', '#ffffff', '#cbd5e1'],
            ['br', '#fb7185', '#e11d48'],
            ['ba', '#fde047', '#eab308'],
            ['bz', '#7dd3fc', '#2563eb'],
          ].map(([n, c1, c2]) => (
            <radialGradient key={n} id={g(n)} cx=".35" cy=".3" r=".85">
              <stop offset="0" stopColor={c1} />
              <stop offset="1" stopColor={c2} />
            </radialGradient>
          ))}
        </defs>

        {/* sombra en el piso */}
        <ellipse cx="150" cy="165" rx="126" ry="6" fill="#064e3b" opacity=".16" />

        {/* taburete de la izquierda */}
        <g>
          <path d="M16 138L13 164M30 138L33 164M23 140V163" stroke="#b45309" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="23" cy="136" rx="13" ry="4.5" fill="#d97706" />
          <ellipse cx="23" cy="134.5" rx="13" ry="4.5" fill="#fbbf24" />
          <ellipse cx="19" cy="133.6" rx="6" ry="1.4" fill="#fff" opacity=".45" />
        </g>

        {/* mesita alta de la derecha con una cerveza */}
        <g>
          <rect x="277" y="136" width="3" height="28" rx="1.5" fill="#92400e" />
          <ellipse cx="278.5" cy="164" rx="9" ry="2.2" fill="#92400e" />
          <ellipse cx="278.5" cy="137" rx="15" ry="4.8" fill="#b45309" />
          <ellipse cx="278.5" cy="135.4" rx="15" ry="4.8" fill="#f1b873" />
          <ellipse cx="273" cy="134.8" rx="7" ry="1.4" fill="#fff" opacity=".45" />
          {/* vaso: cuerpo, asa, espuma y burbujas */}
          <path d="M286 114h4a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-4.6" fill="none" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
          <path d="M270.6 111h15.4l-1.8 21.5a2 2 0 0 1-2 1.8h-7.8a2 2 0 0 1-2-1.8z" fill={`url(#${g('v')})`} />
          <path d="M273 114h2.6l.8 17h-2.6z" fill="#fff" opacity=".4" />
          <g className="esc-billaracad-espuma" style={{ transformOrigin: '50% 100%' }}>
            <rect x="269.4" y="106.6" width="17.6" height="6" rx="3" fill="#fffdf5" />
            <circle cx="274" cy="106" r="3.2" fill="#fffdf5" />
            <circle cx="281" cy="105.6" r="3.6" fill="#fffdf5" />
          </g>
          <circle className="esc-billaracad-burbuja" cx="275" cy="128" r="1.1" fill="#fff" />
          <circle className="esc-billaracad-burbuja" cx="279.6" cy="130" r="1" fill="#fff" style={{ animationDelay: '-0.9s' }} />
          <circle className="esc-billaracad-burbuja" cx="282" cy="127" r="1.2" fill="#fff" style={{ animationDelay: '-1.8s' }} />
        </g>

        {/* patas y cara lateral de la mesa */}
        <rect x="58" y="150" width="11" height="14" rx="3.5" fill="#6b3a1f" />
        <rect x="231" y="150" width="11" height="14" rx="3.5" fill="#6b3a1f" />
        <rect x="46" y="64" width="208" height="96" rx="13" fill={`url(#${g('s')})`} />
        <rect x="52" y="152" width="196" height="3" rx="1.5" fill="#fff" opacity=".18" />

        {/* borde de madera con su bisel */}
        <rect x="46" y="56" width="208" height="96" rx="13" fill={`url(#${g('m')})`} />
        <rect x="55" y="58" width="190" height="3.2" rx="1.6" fill="#fff" opacity=".5" />
        {diamantes.map((x) => (
          <g key={x} fill="#fff4dc" opacity=".85">
            <rect x={x - 2} y="58.4" width="4" height="4" rx="1" />
            <rect x={x - 2} y="145.6" width="4" height="4" rx="1" />
          </g>
        ))}

        {/* banda interior y paño */}
        <rect x="54" y="64" width="192" height="80" rx="8" fill="#1f8a5c" />
        <rect x="58" y="68" width="184" height="72" rx="5" fill={`url(#${g('p')})`} />
        <rect x="58" y="68" width="184" height="6" rx="3" fill="#fff" opacity=".14" />
        <path d="M168 68v72" stroke="#fff" strokeWidth=".8" strokeDasharray="2 3" opacity=".22" />

        {/* cono de luz: se mece con la lámpara pero queda por debajo de los buzones y las bolas */}
        <g className="esc-billaracad-lampara" style={pivote(150, 0)}>
          <path d="M137 47L163 47L240 148L60 148Z" fill={`url(#${g('z')})`} className="esc-billaracad-luz" />
        </g>

        {/* tiza sobre el borde */}
        <g>
          <rect x="88" y="49.5" width="8" height="7" rx="1.6" fill="#38bdf8" />
          <rect x="88" y="49.5" width="8" height="2.6" rx="1.3" fill="#bae6fd" />
        </g>

        {/* los seis buzones */}
        {buzones.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="7.4" fill="#1a6b48" />
            <circle cx={x} cy={y} r="6.2" fill="#0f2a25" />
            <path d={`M${x - 4.4} ${y - 2.6}a5 5 0 0 1 6-1.6`} stroke="#fff" strokeWidth="1" strokeLinecap="round" fill="none" opacity=".18" />
          </g>
        ))}

        {/* el triángulo de 3 bolas: roja de punta, amarilla arriba y azul abajo */}
        <g transform="translate(168 104)">
          <Bola grad={g('br')} className="esc-billaracad-bola-a" />
        </g>
        <g transform="translate(176.1 99.3)">
          <Bola grad={g('ba')} className="esc-billaracad-bola-b" />
        </g>
        <g transform="translate(176.1 108.7)">
          <Bola grad={g('bz')} className="esc-billaracad-bola-c" />
        </g>
        {/* la blanca */}
        <g transform="translate(92 104)">
          <Bola grad={g('bb')} className="esc-billaracad-blanca" />
        </g>

        {/* destello del choque y aro de la bola que cae */}
        <g transform="translate(160 104)">
          <path
            className="esc-billaracad-choque"
            d="M0-9L2.4-2.4 9 0 2.4 2.4 0 9-2.4 2.4-9 0-2.4-2.4Z"
            fill="#fffbd0"
            stroke="#fbbf24"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0"
          />
        </g>
        <g transform="translate(238 72)">
          <circle className="esc-billaracad-buzon" r="8" fill="none" stroke="#fde047" strokeWidth="2.2" opacity="0" />
        </g>

        {/* el taco: se echa atrás y golpea la blanca */}
        <g className="esc-billaracad-taco">
          <path d="M87 102.8L24 101.3Q22 101.3 22 103v2q0 1.7 2 1.7l63-1.5z" fill={`url(#${g('t')})`} />
          <path d="M26 102.2L86 103.4" stroke="#fff" strokeWidth=".9" strokeLinecap="round" opacity=".45" />
          <rect x="85.4" y="102.8" width="3.6" height="2.4" rx="1" fill="#e0f2fe" />
          <rect x="84.6" y="102.9" width="1.4" height="2.2" rx=".6" fill="#38bdf8" />
        </g>

        {/* lámpara colgante que se balancea, con su cono de luz */}
        <g className="esc-billaracad-lampara" style={pivote(150, 0)}>
          <line x1="150" y1="0" x2="150" y2="24" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="150" cy="47" rx="13" ry="5" fill="#fffbe0" className="esc-parpadeo" />
          <path d="M128 42C128 30 138 23 150 23C162 23 172 30 172 42Z" fill={`url(#${g('c')})`} />
          <path d="M133 38C134 31 140 27 147 26" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".55" />
          <rect x="125" y="40" width="50" height="5" rx="2.5" fill="#d97706" />
          <rect x="128" y="40.6" width="44" height="1.6" rx=".8" fill="#fff" opacity=".4" />
          <rect x="146" y="20" width="8" height="5" rx="2" fill="#92400e" />
        </g>
      </svg>
      <Aviso
        lado="izq"
        texto="Mesa 3 · 01:20"
        icono={
          <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
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
const PAG_IZQ = 'M150 104C126 94 86 93 54 100V143C86 136 126 137 150 147Z'
const PAG_DER = 'M150 104C174 94 214 93 246 100V143C214 136 174 137 150 147Z'

/** Renglones de texto de una página; en la derecha se espejan respecto al lomo. */
function Renglones({ lado, desde = 108, cuantos = 4 }: { lado: 'izq' | 'der'; desde?: number; cuantos?: number }) {
  const x = (n: number) => (lado === 'izq' ? n : 300 - n)
  return (
    <g stroke="#b9a8f5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".85">
      {Array.from({ length: cuantos }, (_, i) => {
        const y = desde + i * 7.5
        const corto = i === cuantos - 1 ? 18 : 0
        return <path key={i} d={`M${x(64)} ${y}C${x(90)} ${y - 5} ${x(120 - corto)} ${y - 4} ${x(141 - corto)} ${y + 4 - corto / 6}`} />
      })}
    </g>
  )
}

/** Hoja suelta que se voltea sobre el lomo: va de la página derecha a la izquierda y se desvanece. */
function Hoja({ retraso, grad }: { retraso: number; grad: string }) {
  return (
    <g className="esc-billaracad-hoja" style={{ ...pivote(150, 120), animationDelay: `${retraso}s`, opacity: 0 }}>
      <path d={PAG_DER} fill={`url(#${grad})`} />
      <path d="M150 104C174 94 214 93 246 100" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".8" />
      <Renglones lado="der" desde={110} cuantos={3} />
    </g>
  )
}

/** Estrellita de cuatro puntas que titila. */
function Estrella({ x, y, s = 1, color, retraso }: { x: number; y: number; s?: number; color: string; retraso: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        className="esc-billaracad-estrella"
        d={`M0 ${-6 * s}Q${s} ${-s} ${6 * s} 0Q${s} ${s} 0 ${6 * s}Q${-s} ${s} ${-6 * s} 0Q${-s} ${-s} 0 ${-6 * s}Z`}
        fill={color}
        style={{ animationDelay: `${retraso}s` }}
      />
    </g>
  )
}

/** Letra o nota que sale del libro y sube desvaneciéndose. */
function Letra({ x, texto, dx, retraso, color }: { x: number; texto: string; dx: number; retraso: number; color: string }) {
  return (
    <g transform={`translate(${x} 102)`}>
      <text
        className="esc-billaracad-letra"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill={color}
        stroke="#fff"
        strokeWidth="3"
        paintOrder="stroke"
        strokeLinejoin="round"
        style={v({ '--dx': `${dx}px`, animationDelay: `${retraso}s`, opacity: '0' })}
      >
        {texto}
      </text>
    </g>
  )
}

/** Un libro abierto que pasa hojas, un birrete que sale volando, estrellitas, notas que suben y un lápiz que escribe. */
export function EscenaAcademia() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  return (
    <Marco fondo="bg-gradient-to-b from-indigo-100 via-violet-50 to-white">
      <div aria-hidden className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('c')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7c7ff5" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id={g('h')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffdf7" />
            <stop offset="1" stopColor="#ece8fb" />
          </linearGradient>
          <linearGradient id={g('i')} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#fffdf7" />
            <stop offset="1" stopColor="#ece8fb" />
          </linearGradient>
          <linearGradient id={g('l')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset=".5" stopColor="#4c1d95" stopOpacity=".22" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('e')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ddd6fe" />
            <stop offset="1" stopColor="#c4b5fd" />
          </linearGradient>
          <linearGradient id={g('b')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6d70f2" />
            <stop offset="1" stopColor="#3730a3" />
          </linearGradient>
        </defs>

        {/* escritorio y sombra del libro */}
        <rect x="14" y="152" width="272" height="12" rx="6" fill="#a78bfa" />
        <rect x="14" y="144" width="272" height="14" rx="7" fill={`url(#${g('e')})`} />
        <rect x="26" y="146" width="248" height="3" rx="1.5" fill="#fff" opacity=".5" />
        <ellipse className="esc-sombra" cx="150" cy="156" rx="104" ry="5" fill="#3b0764" opacity=".16" />

        {/* estrellitas del fondo */}
        <Estrella x={36} y={40} s={1} color="#fbbf24" retraso={0} />
        <Estrella x={78} y={64} s={0.7} color="#a78bfa" retraso={-1.1} />
        <Estrella x={236} y={64} s={0.9} color="#fbbf24" retraso={-2} />
        <Estrella x={270} y={104} s={0.75} color="#818cf8" retraso={-0.6} />
        <Estrella x={22} y={104} s={0.7} color="#f9a8d4" retraso={-1.6} />

        {/* todo lo del libro flota apenas */}
        <g className="esc-flotar">
          {/* tapa */}
          <rect x="42" y="100" width="216" height="50" rx="10" fill={`url(#${g('c')})`} />
          <rect x="46" y="104" width="208" height="3" rx="1.5" fill="#fff" opacity=".28" />
          {/* canto de las páginas */}
          <g transform="translate(0 3.4)" fill="#d9d3f5">
            <path d={PAG_IZQ} />
            <path d={PAG_DER} />
          </g>
          {/* páginas */}
          <path d={PAG_IZQ} fill={`url(#${g('i')})`} />
          <path d={PAG_DER} fill={`url(#${g('h')})`} />
          <path d="M54 100C86 93 126 94 150 104C174 94 214 93 246 100" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".85" />
          <rect x="136" y="100" width="28" height="48" fill={`url(#${g('l')})`} />
          <Renglones lado="izq" desde={108} cuantos={3} />
          <Renglones lado="der" desde={110} cuantos={4} />
          {/* marcapáginas */}
          <path d="M147 144h6l-.4 14-2.6-2.4-2.6 2.4z" fill="#f472b6" />

          {/* hojas que se pasan */}
          <Hoja retraso={0} grad={g('h')} />
          <Hoja retraso={-2.5} grad={g('h')} />

          {/* garabato que escribe el lápiz */}
          <path
            className="esc-billaracad-garabato"
            d="M62 130q2.7-4 5.4 0t5.4 0t5.4 0t5.4 0"
            stroke="#6366f1"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            style={{ transformOrigin: '0% 50%' }}
          />

          {/* lápiz: la punta es el origen del grupo, así cabecea sobre ella */}
          <g transform="translate(84 130)">
            <g className="esc-billaracad-lapiz" style={origen0}>
              <g transform="rotate(35)" style={origen0}>
                <rect x="-3.2" y="-46" width="6.4" height="36" rx="1.4" fill="#fcd34d" />
                <rect x="-3.2" y="-46" width="2.4" height="36" rx="1.2" fill="#fff" opacity=".45" />
                <rect x="1.2" y="-46" width="2" height="36" rx="1" fill="#f59e0b" />
                <path d="M-3.2 -10L0 0L3.2 -10Z" fill="#f3d4a6" />
                <path d="M-1.1 -3.4L0 0L1.1 -3.4Z" fill="#475569" />
                <rect x="-3.4" y="-52" width="6.8" height="6" fill="#cbd5e1" />
                <rect x="-3.4" y="-50" width="6.8" height="1.2" fill="#94a3b8" />
                <rect x="-3.2" y="-58" width="6.4" height="7" rx="2.4" fill="#fda4af" />
              </g>
            </g>
          </g>

          {/* birrete: sale disparado girando (el grupo de dentro gira sobre su centro) */}
          <g transform="translate(190 88)">
            <g className="esc-billaracad-birrete" style={origen0}>
              <path d="M-11 1v7q11 6 22 0V1z" fill="#3730a3" />
              <path d="M-11 1v2.4q11 6 22 0V1z" fill="#000" opacity=".15" />
              <path d="M-20 -1L0 7L20 -1V1.8L0 9.8L-20 1.8z" fill="#312e81" />
              <path d="M0 -9L20 -1L0 7L-20 -1Z" fill={`url(#${g('b')})`} />
              <path d="M-17 -1.4L0 -8L17 -1.4L0 -3.6Z" fill="#fff" opacity=".28" />
              <circle cy="-1.4" r="1.9" fill="#fbbf24" />
              <path d="M0 -1.4L14 .8V9" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="12.6" y="8" width="2.8" height="5.6" rx="1.3" fill="#f59e0b" />
            </g>
          </g>

          {/* notas que suben del libro */}
          <Letra x={134} texto="A+" dx={-14} retraso={0} color="#7c3aed" />
          <Letra x={166} texto="10" dx={12} retraso={-2.2} color="#f59e0b" />
        </g>
      </svg>
      <Aviso texto="Nota: 10" />
    </Marco>
  )
}
