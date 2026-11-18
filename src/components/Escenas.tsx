import { useId, useRef, type CSSProperties, type ReactNode } from 'react'
import { useInView } from 'motion/react'

/*
  Ilustraciones animadas de los rubros (SVG propio, sin imágenes de stock).
  Todo se mueve con CSS (transform y opacity: barato para el celular); los
  keyframes `esc-*` viven en index.css. Cada escena es decorativa: el nombre y
  los puntos de la tarjeta ya dicen lo mismo, así que va con aria-hidden.
*/

/**
 * Marco común: pausa las animaciones cuando la escena no se ve en pantalla (ahorra
 * batería) y, con "reducir movimiento", index.css las apaga y queda la imagen quieta.
 */
function Marco({ fondo, children }: { fondo: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const visto = useInView(ref, { margin: '0px 0px -10% 0px' })
  return (
    <div
      ref={ref}
      aria-hidden
      data-vista={visto ? '' : undefined}
      className={`escena relative h-48 overflow-hidden ${fondo}`}
    >
      {children}
    </div>
  )
}

const svgBase =
  'absolute inset-0 h-full w-full origin-bottom transition-transform duration-500 ease-out group-hover:scale-105'

/** Variables CSS que usan los keyframes (distancia, giro, retraso…). */
const v = (o: Record<string, string>): CSSProperties => o as CSSProperties

/** Un globo de aviso que aparece, se queda un momento y se va (como la notificación de una venta). */
function ChipVenta() {
  return (
    <div className="esc-chip pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white py-1 pl-1.5 pr-3 text-[11px] font-extrabold text-emerald-700 shadow-lg ring-1 ring-emerald-200">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
        <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 10.5l3.5 3.5 7.5-8" />
        </svg>
      </span>
      Venta Bs 23
    </div>
  )
}

/** La comanda que "sale" de la cocina cuando el pedido está listo. */
function Comanda() {
  return (
    <div className="esc-ticket pointer-events-none absolute left-3 top-0 w-[78px] border-b-2 border-dashed border-slate-300 bg-white px-2 pb-1.5 pt-1.5 text-[9px] font-bold leading-snug text-slate-600 shadow-lg">
      <p className="tracking-widest text-slate-400">COMANDA</p>
      <p className="text-[11px] font-extrabold text-slate-900">Mesa 4</p>
      <p>1 pollo + papas</p>
      <p className="mt-0.5 font-extrabold text-emerald-600">✓ Listo</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FARMACIA                                                           */
/* ------------------------------------------------------------------ */

function Capsula({ x, y, dx, giro, retraso, color }: { x: number; y: number; dx: number; giro: number; retraso: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="esc-subir" style={v({ '--dx': `${dx}px`, '--giro': `${giro}deg`, animationDelay: `${retraso}s` })}>
        <path d="M-7 0a3.5 3.5 0 0 1 3.5-3.5H0V3.5h-3.5A3.5 3.5 0 0 1-7 0z" fill={color} />
        <path d="M0-3.5h3.5A3.5 3.5 0 0 1 7 0a3.5 3.5 0 0 1-3.5 3.5H0z" fill="#fff" stroke="#d9c3cf" strokeWidth=".5" />
      </g>
    </g>
  )
}

function Mas({ x, y, dx, retraso }: { x: number; y: number; dx: number; retraso: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="esc-subir" style={v({ '--dx': `${dx}px`, '--giro': '90deg', animationDelay: `${retraso}s` })}>
        <path d="M-1.6-5h3.2v3.4H5v3.2H1.6V5H-1.6V1.6H-5v-3.2h3.4z" fill="#34d399" />
      </g>
    </g>
  )
}

function Planta({ x, escala = 1, retraso = 0 }: { x: number; escala?: number; retraso?: number }) {
  return (
    <g transform={`translate(${x} 150) scale(${escala})`}>
      <ellipse cx="0" cy="2" rx="11" ry="3.5" fill="#b9936a" />
      <path d="M-10 0h20l-3 -11h-14z" fill="#d7b186" />
      <g className="esc-planta" style={{ animationDelay: `${retraso}s` }}>
        <path d="M0 -10C-2 -26 -10 -36 -20 -44" stroke="#3f9a58" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M0 -10C0 -28 -3 -40 -4 -52" stroke="#2f7f48" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M0 -10C3 -26 9 -36 18 -42" stroke="#3f9a58" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M0 -10C-4 -22 -14 -28 -24 -30" stroke="#2f7f48" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M0 -10C5 -22 14 -28 24 -29" stroke="#2f7f48" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </g>
  )
}

/** Una farmacia que "respira": cartel que late, toldo que se mece, plantas, cápsulas que salen y una venta cobrada. */
export function EscenaFarmacia() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const toldo = Array.from({ length: 6 }, (_, i) => ({ x: 99 + 24 * i, c: i % 2 === 0 ? '#ffffff' : '#e9c8f3' }))
  return (
    <Marco fondo="bg-gradient-to-b from-sky-100 via-sky-50 to-white">
      <div aria-hidden className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="14 10 292 168" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('f')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9bd0f2" />
            <stop offset="1" stopColor="#74b8e6" />
          </linearGradient>
          <linearGradient id={g('l')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4f9fd4" />
            <stop offset="1" stopColor="#62b1e3" />
          </linearGradient>
          <linearGradient id={g('t')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c7e8fb" />
            <stop offset="1" stopColor="#9fd3f2" />
          </linearGradient>
          <linearGradient id={g('v')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#eef8fe" />
            <stop offset="1" stopColor="#bfe1f5" />
          </linearGradient>
        </defs>

        {/* losa de la vereda y su sombra */}
        <ellipse className="esc-sombra" cx="160" cy="168" rx="118" ry="7" fill="#0b4a7a" opacity=".14" />
        <rect x="26" y="146" width="268" height="16" rx="8" fill="#79b9e3" />
        <rect x="26" y="140" width="268" height="16" rx="8" fill="#a7d6f4" />
        <path d="M70 148h180M120 142v12M180 142v12M240 142v12" stroke="#8cc4e8" strokeWidth="1" opacity=".7" />

        <Planta x={52} retraso={0} />
        <Planta x={286} escala={0.9} retraso={-1.4} />

        {/* el edificio flota apenas */}
        <g className="esc-flotar">
          <path d="M74 58L98 50V148L74 152Z" fill={`url(#${g('l')})`} />
          <rect x="98" y="50" width="148" height="98" rx="5" fill={`url(#${g('f')})`} />
          <path d="M76 44L90 39V56L76 61Z" fill="#7fc0ea" />
          <rect x="90" y="34" width="164" height="22" rx="6" fill={`url(#${g('t')})`} />
          <rect x="95" y="38" width="154" height="4.5" rx="2.2" fill="#fff" opacity=".5" />

          {/* cartel con la cruz: late y emite un aro */}
          <circle className="esc-aro" cx="172" cy="36" r="19" fill="none" stroke="#ff6b6b" strokeWidth="2.5" />
          <circle cx="172" cy="36" r="19" fill="#bfe3f9" stroke="#8cc9ee" strokeWidth="4" />
          <circle cx="172" cy="36" r="14" fill="#fff" />
          <path
            className="esc-latido"
            d="M168 26h8v6h6v8h-6v6h-8v-6h-6v-8h6z"
            fill="#fff"
            stroke="#e5484d"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* puerta vidriada con estantes */}
          <rect x="108" y="96" width="64" height="52" rx="3" fill="#4a96cd" />
          <rect x="112" y="100" width="56" height="44" rx="2" fill={`url(#${g('v')})`} />
          <rect x="112" y="100" width="56" height="44" rx="2" fill="#fff" className="esc-parpadeo" />
          <rect x="139" y="100" width="2" height="44" fill="#4a96cd" />
          <rect x="112" y="114" width="56" height="2.5" fill="#a6cde6" />
          <rect x="112" y="129" width="56" height="2.5" fill="#a6cde6" />
          <rect x="116" y="103" width="9" height="11" rx="2" fill="#f0a63a" />
          <rect x="127" y="104" width="9" height="10" rx="2" fill="#f4b95a" />
          <rect x="145" y="102" width="10" height="12" rx="2" fill="#f0a63a" />
          <rect x="157" y="105" width="8" height="9" rx="2" fill="#fff" />
          <rect x="116" y="119" width="12" height="10" rx="2" fill="#fff" />
          <rect x="131" y="120" width="7" height="9" rx="2" fill="#c9c6ef" />
          <rect x="145" y="119" width="14" height="10" rx="2" fill="#f2cf5a" />
          <rect x="116" y="134" width="8" height="10" rx="2" fill="#c9c6ef" />
          <rect x="127" y="135" width="8" height="9" rx="2" fill="#fff" />
          <rect x="147" y="134" width="14" height="10" rx="2" fill="#f0a63a" />

          {/* vitrina de la derecha */}
          <rect x="180" y="112" width="58" height="2.5" rx="1" fill="#5ea9dc" />
          <rect x="180" y="127" width="58" height="2.5" rx="1" fill="#5ea9dc" />
          <rect x="180" y="142" width="58" height="2.5" rx="1" fill="#5ea9dc" />
          <rect x="184" y="98" width="12" height="14" rx="2" fill="#b9bff0" />
          <rect x="199" y="99" width="12" height="13" rx="2" fill="#fff" />
          <path d="M203.5 102h3v2.4h2.4v3h-2.4v2.4h-3v-2.4h-2.4v-3h2.4z" fill="#e5484d" />
          <rect x="214" y="99" width="10" height="13" rx="2" fill="#8aa4e8" />
          <rect x="226" y="102" width="10" height="10" rx="2" fill="#c9c6ef" />
          <rect x="184" y="115" width="13" height="12" rx="2" fill="#f2cf5a" />
          <rect x="201" y="116" width="9" height="11" rx="2" fill="#fff" />
          <rect x="214" y="115" width="12" height="12" rx="2" fill="#c9c6ef" />
          <rect x="229" y="118" width="7" height="9" rx="2" fill="#8aa4e8" />
          <rect x="184" y="131" width="14" height="11" rx="2" fill="#5aaee0" />
          <rect x="202" y="132" width="10" height="10" rx="2" fill="#fff" />
          <rect x="216" y="130" width="14" height="12" rx="2" fill="#b9bff0" />

          {/* toldo rayado que se mece */}
          <g className="esc-toldo">
            <rect x="96" y="60" width="152" height="9" rx="3" fill="#d8b4e8" />
            {toldo.map((t, i) => (
              <path key={i} d={`M${t.x} 68H${t.x + 24}V82a12 12 0 0 1-24 0Z`} fill={t.c} />
            ))}
            <rect x="96" y="60" width="152" height="3.5" rx="1.7" fill="#fff" opacity=".55" />
          </g>
        </g>

        {/* lo que sale de la farmacia: cápsulas y cruces que suben */}
        <Capsula x={128} y={96} dx={-14} giro={220} retraso={0} color="#ff7aa5" />
        <Capsula x={152} y={96} dx={16} giro={-200} retraso={1.5} color="#60a5fa" />
        <Capsula x={140} y={96} dx={4} giro={260} retraso={3} color="#fbbf24" />
        <Mas x={120} y={98} dx={-22} retraso={0.8} />
        <Mas x={162} y={98} dx={22} retraso={2.3} />
      </svg>
      <ChipVenta />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  RESTAURANTE / POLLERÍA                                             */
/* ------------------------------------------------------------------ */

function Pollo({ x, retraso, clip }: { x: number; retraso: number; clip: string }) {
  return (
    <g transform={`translate(${x} 104)`}>
      <ellipse cx="0" cy="0" rx="19" ry="20" fill="#d98a3a" />
      {/* la piel se "mueve" hacia abajo: el pollo gira en el espiedo */}
      <g clipPath={`url(#${clip})`}>
        <rect className="esc-gira" x="-22" y="-5" width="44" height="9" fill="#ffe1a0" opacity=".55" style={{ animationDelay: `${retraso}s` }} />
        <rect className="esc-gira" x="-22" y="-5" width="44" height="4" fill="#8a4a16" opacity=".35" style={{ animationDelay: `${retraso - 0.6}s` }} />
        <circle className="esc-gira-punto" cx="-9" cy="0" r="2" fill="#8a4a16" style={{ animationDelay: `${retraso - 0.2}s` }} />
        <circle className="esc-gira-punto" cx="6" cy="0" r="2.2" fill="#8a4a16" style={{ animationDelay: `${retraso - 0.9}s` }} />
        <circle className="esc-gira-punto" cx="12" cy="0" r="1.6" fill="#a8641f" style={{ animationDelay: `${retraso - 0.5}s` }} />
        <circle className="esc-gira-punto" cx="-2" cy="0" r="1.8" fill="#a8641f" style={{ animationDelay: `${retraso - 1.1}s` }} />
      </g>
      <ellipse cx="0" cy="0" rx="19" ry="20" fill="none" stroke="#a8601f" strokeWidth="1.6" />
      <ellipse cx="-7" cy="-9" rx="5" ry="3" fill="#fff" opacity=".35" />
    </g>
  )
}

function Llama({ x, retraso, alto = 1 }: { x: number; retraso: number; alto?: number }) {
  return (
    <g transform={`translate(${x} 138) scale(${alto})`}>
      <g className="esc-llama" style={{ animationDelay: `${retraso}s` }}>
        <path d="M0 0C-8-6-4-14 0-22C4-14 8-6 0 0Z" fill="#ff8a3d" />
        <path d="M0 0C-4-3-2-8 0-12C2-8 4-3 0 0Z" fill="#ffd36b" />
      </g>
    </g>
  )
}

function Humo({ x, retraso }: { x: number; retraso: number }) {
  return (
    <g transform={`translate(${x} 30)`}>
      <circle className="esc-humo" r="6" fill="#e9e2dc" style={{ animationDelay: `${retraso}s` }} />
    </g>
  )
}

/** Un pollo a la brasa girando sobre las llamas, con humo y la comanda que sale cuando está listo. */
export function EscenaPollo() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  return (
    <Marco fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <div aria-hidden className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-orange-200/60 blur-2xl" />
      <svg viewBox="40 14 240 164" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('b')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe08a" />
            <stop offset=".55" stopColor="#ff9a45" />
            <stop offset="1" stopColor="#e2561f" />
          </linearGradient>
          <clipPath id={g('c')}>
            <ellipse cx="0" cy="0" rx="19" ry="20" />
          </clipPath>
        </defs>

        <ellipse cx="160" cy="170" rx="104" ry="7" fill="#5b2a0e" opacity=".14" />

        {/* humo de la chimenea */}
        <Humo x={222} retraso={0} />
        <Humo x={226} retraso={1.1} />
        <Humo x={219} retraso={2.2} />

        <g className="esc-flotar-suave">
          {/* patas, cuerpo del horno y chimenea */}
          <rect x="88" y="150" width="14" height="16" rx="3" fill="#2b1d19" />
          <rect x="218" y="150" width="14" height="16" rx="3" fill="#2b1d19" />
          <rect x="214" y="32" width="16" height="18" rx="3" fill="#2b1d19" />
          <rect x="70" y="56" width="180" height="96" rx="14" fill="#4a3128" />
          <rect x="70" y="56" width="180" height="10" rx="5" fill="#fff" opacity=".07" />

          {/* cartel */}
          <rect x="62" y="42" width="196" height="20" rx="10" fill="#d1432c" />
          <rect x="66" y="45" width="188" height="4" rx="2" fill="#fff" opacity=".28" />
          <text x="160" y="56.5" textAnchor="middle" fontSize="10.5" fontWeight="800" letterSpacing="2.2" fill="#fff">
            A LA BRASA
          </text>

          {/* ventana con el fuego adentro */}
          <rect x="82" y="72" width="156" height="68" rx="10" fill={`url(#${g('b')})`} />
          <rect x="82" y="72" width="156" height="68" rx="10" fill="#ffd36b" className="esc-parpadeo" />
          <line x1="86" y1="104" x2="234" y2="104" stroke="#9a9a9a" strokeWidth="3" strokeLinecap="round" />

          <Pollo x={118} retraso={0} clip={g('c')} />
          <Pollo x={160} retraso={-0.5} clip={g('c')} />
          <Pollo x={202} retraso={-1} clip={g('c')} />

          {/* llamas */}
          <Llama x={96} retraso={0} alto={0.9} />
          <Llama x={120} retraso={-0.4} />
          <Llama x={142} retraso={-0.9} alto={0.85} />
          <Llama x={164} retraso={-0.2} alto={1.05} />
          <Llama x={186} retraso={-0.7} alto={0.9} />
          <Llama x={208} retraso={-0.3} />
          <Llama x={228} retraso={-1} alto={0.8} />

          {/* reflejo del vidrio */}
          <path d="M92 74h28l-30 64H82V84a10 10 0 0 1 10-10z" fill="#fff" opacity=".14" />
        </g>

        {/* chispas que suben */}
        <g transform="translate(128 134)">
          <circle className="esc-subir" r="1.8" fill="#ffd36b" style={v({ '--dx': '6px', '--giro': '0deg', animationDelay: '0.2s' })} />
        </g>
        <g transform="translate(176 134)">
          <circle className="esc-subir" r="1.6" fill="#ffb347" style={v({ '--dx': '-8px', '--giro': '0deg', animationDelay: '1.7s' })} />
        </g>
        <g transform="translate(208 134)">
          <circle className="esc-subir" r="1.7" fill="#ffd36b" style={v({ '--dx': '5px', '--giro': '0deg', animationDelay: '3s' })} />
        </g>
      </svg>
      <Comanda />
    </Marco>
  )
}

/** Escena de cada rubro que ya tiene su ilustración animada. */
export const ESCENAS = {
  farmacia: EscenaFarmacia,
  pollo: EscenaPollo,
} as const

export type ClaveEscena = keyof typeof ESCENAS
