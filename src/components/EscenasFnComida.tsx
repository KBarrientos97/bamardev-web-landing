import './EscenasFnComida.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de dos funciones de comida (20-nov-2026): los pedidos con
  número y la tele de «Pedidos listos», y los pedidos que llegan por las apps de
  delivery. Mismo lenguaje que las escenas de Funciones (viewBox 320 × 150,
  plataforma con sombra de contacto, luz arriba a la izquierda, ciclo de 6,5 s con
  el <Aviso> asomando al 10 %). Nada de marcas: las apps son «App 1» (amarilla) y
  «App 2» (roja), con una moto.

  Ningún elemento animado lleva `transform=""` (la regla `.escena svg *` le cambia
  el pivote): lo que se traslada va dentro de un <g>. Keyframes `esc-fct-*`
  (tickets) y `esc-fcp-*` (plataformas) en EscenasFnComida.css.
*/

const VB = '0 0 320 150'

/** Plataforma común: losa elíptica con canto y luz. */
function Plataforma({ id, borde, luz }: { id: string; borde: string; luz: [string, string] }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}pt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={luz[0]} />
          <stop offset="1" stopColor={luz[1]} />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="137" rx="150" ry="12" fill={borde} />
      <ellipse cx="160" cy="133" rx="150" ry="12" fill={`url(#${id}pt)`} />
      <ellipse cx="160" cy="130.5" rx="126" ry="7" fill="#fff" opacity=".35" />
    </>
  )
}

/** Moto de reparto chiquita (con su caja), centrada en (0, 0); `c` es el color del cuerpo. */
function Moto({ c, rueda = '#1e293b' }: { c: string; rueda?: string }) {
  return (
    <g>
      <circle cx="-6.5" cy="4" r="3.2" fill="none" stroke={rueda} strokeWidth="1.8" />
      <circle cx="7" cy="4" r="3.2" fill="none" stroke={rueda} strokeWidth="1.8" />
      <path d="M-6.5 4L-2 -1H4L7 4" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M3.6 -1L5.4 -5.4H8" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="-9.5" y="-7.4" width="7" height="6" rx="1.2" fill={c} />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  1 · PEDIDOS CON NÚMERO                                             */
/* ------------------------------------------------------------------ */

/** Ticket impreso (20 × 24) con su número; esquina arriba-izquierda en (x, y). */
function Ticket({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x + 0.8} y={y + 1} width="20" height="24" rx="1.6" fill="#0f172a" opacity=".14" />
      <path d={`M${x} ${y}H${x + 20}V${y + 22.5}l-2.5 1.5-2.5-1.5-2.5 1.5-2.5-1.5-2.5 1.5-2.5-1.5-2.5 1.5-2.5-1.5Z`} fill="#fff" />
      <text x={x + 10} y={y + 6.8} textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#94a3b8">
        N°
      </text>
      <text x={x + 10} y={y + 16.4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#0f172a">
        42
      </text>
      <rect x={x + 4} y={y + 18.6} width="12" height="1.2" rx=".6" fill="#cbd5e1" />
    </g>
  )
}

/** Casillas de la tele: [x, y, número] (26 × 15). La de 42 se mueve de PREPARANDO a LISTO (+67 en x). */
const PREPARANDO: [number, number, string][] = [
  [21, 27, '41'],
  [51, 27, '43'],
  [51, 47, '44'],
]
const LISTOS: [number, number, string][] = [
  [88, 27, '39'],
  [118, 27, '40'],
]

/**
 * El mostrador de un local de comida rápida. Guion (6,5 s): el cliente paga en la caja
 * (52 %), sale el ticket N° 42 de la impresora y le llega a la mano; el 42 aparece en la
 * tele de «Pedidos» bajo PREPARANDO. Al dar la vuelta del ciclo el 42 cruza a LISTO, se
 * pone verde, destella y suena la campanita (el aviso «42 · Listo» asoma al 10 %); cae la
 * bolsa con su 42 en el mostrador y el cliente la retira entregando el ticket.
 */
export function EscenaFnTickets() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  const casilla = ([x, y, n]: [number, number, string], listo: boolean) => (
    <g key={n}>
      <rect x={x} y={y} width="26" height="15" rx="3.5" fill={listo ? u('ve') : '#334155'} />
      {!listo && <rect x={x + 0.4} y={y + 0.4} width="25.2" height="14.2" rx="3.2" fill="none" stroke="#fbbf24" strokeWidth=".7" opacity=".45" />}
      <text x={x + 13} y={y + 10.8} textAnchor="middle" fontSize="9" fontWeight="800" fill={listo ? '#fff' : '#fbbf24'}>
        {n}
      </text>
    </g>
  )

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-sky-100 via-indigo-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1e293b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={g('ve')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22c55e" />
            <stop offset="1" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id={g('mt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3d3a6" />
            <stop offset="1" stopColor="#d9a46a" />
          </linearGradient>
          <linearGradient id={g('mf')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a8643a" />
            <stop offset="1" stopColor="#7c4322" />
          </linearGradient>
          <linearGradient id={g('im')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#64748b" />
            <stop offset="1" stopColor="#334155" />
          </linearGradient>
          <linearGradient id={g('ca')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a5b4fc" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id={g('pi')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe3cc" />
            <stop offset="1" stopColor="#e8b48c" />
          </linearGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9c58f" />
            <stop offset="1" stopColor="#b98544" />
          </linearGradient>
          <linearGradient id={g('bt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <clipPath id={g('cp')}>
            <rect x="17.5" y="12.5" width="131" height="59" rx="2" />
          </clipPath>
          {/* lo que asoma por la ranura de la impresora */}
          <clipPath id={g('ci')}>
            <rect x="270" y="40" width="36" height="44.2" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#a5b4fc" luz={['#eef2ff', '#c7d2fe']} />

        {/* ---------- la tele de «Pedidos», colgada ---------- */}
        <rect x="19" y="15" width="138" height="66" rx="7" fill="#1e1b4b" opacity=".06" />
        <rect x="17" y="12.5" width="138" height="66" rx="6" fill="#1e1b4b" opacity=".1" />
        {[44, 122].map((x) => (
          <g key={x}>
            <rect x={x - 0.9} y="-2" width="1.8" height="12" fill="#64748b" />
            <rect x={x - 2.6} y="7.6" width="5.2" height="2.4" rx="1" fill="#475569" />
          </g>
        ))}
        <rect x="15.5" y="10.5" width="138" height="66" rx="5" fill="#020617" />
        <rect x="14" y="9" width="138" height="66" rx="5" fill="#1e293b" />
        <rect x="15" y="9.6" width="136" height="1.1" rx=".55" fill="#fff" opacity=".22" />
        <rect x="17.5" y="12.5" width="131" height="59" rx="2" fill={u('pa')} />

        <g clipPath={u('cp')}>
          <text x="21" y="21.6" fontSize="5.6" fontWeight="800" fill="#fbbf24" letterSpacing=".5">
            PREPARANDO
          </text>
          <text x="88" y="21.6" fontSize="5.6" fontWeight="800" fill="#4ade80" letterSpacing=".5">
            LISTO
          </text>
          <rect x="83.8" y="16" width=".7" height="52" fill="#fff" opacity=".12" />
          {PREPARANDO.map((c) => casilla(c, false))}
          {LISTOS.map((c) => casilla(c, true))}
          {/* el hueco de abajo en LISTO, donde llega el 42 */}
          <rect x="88" y="47" width="26" height="15" rx="3.5" fill="none" stroke="#fff" strokeWidth=".6" strokeDasharray="2 2" opacity=".18" />

          {/* destello sobre LISTO al llegar el 42 */}
          <rect className="esc-fct-destello" x="85" y="14" width="63" height="57" fill="#4ade80" style={{ opacity: 0 }} />

          {/* el 42: nace en PREPARANDO, cruza a LISTO y se pone verde */}
          <g className="esc-fct-num" style={v({ '--dx': '67px' })}>
            <rect x="21" y="47" width="26" height="15" rx="3.5" fill="#334155" />
            <rect x="21.4" y="47.4" width="25.2" height="14.2" rx="3.2" fill="none" stroke="#fbbf24" strokeWidth=".7" opacity=".7" />
            <text x="34" y="57.8" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fbbf24">
              42
            </text>
            <g className="esc-fct-verde" style={{ opacity: 0 }}>
              <rect x="21" y="47" width="26" height="15" rx="3.5" fill={u('ve')} />
              <text x="34" y="57.8" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">
                42
              </text>
            </g>
          </g>
        </g>
        <rect className="esc-fct-aro" x="86" y="45" width="30" height="19" rx="5" fill="none" stroke="#4ade80" strokeWidth="1.6" style={{ opacity: 0 }} />

        {/* campanita al lado de LISTO */}
        <g className="esc-fct-campana">
          <path d="M113.6 23.4C113.6 18.8 115.4 16.6 118 16.6S122.4 18.8 122.4 23.4L123.6 24.6H112.4Z" fill="#fbbf24" />
          <circle cx="118" cy="25.6" r="1.2" fill="#fbbf24" />
          <rect x="117.3" y="15.2" width="1.4" height="1.8" rx=".7" fill="#fbbf24" />
        </g>
        <g className="esc-fct-onda" style={{ opacity: 0 }}>
          <path d="M126 17.4q2 3 0 6M128.6 15.6q3.2 4.8 0 9.6" stroke="#fde68a" strokeWidth="1" strokeLinecap="round" fill="none" />
        </g>

        {/* ---------- el mostrador ---------- */}
        <ellipse cx="160" cy="132" rx="146" ry="4" fill="#1e1b4b" opacity=".14" />
        <rect x="14" y="101" width="292" height="31" fill={u('mf')} />
        {[70, 126, 182, 238].map((x) => (
          <rect key={x} x={x} y="104" width=".9" height="26" fill="#fff" opacity=".12" />
        ))}
        <rect x="14" y="101" width="292" height="2.6" fill="#000" opacity=".14" />
        <rect x="10" y="96" width="300" height="5.4" rx="2" fill={u('mt')} />
        <rect x="11" y="96.4" width="298" height="1" rx=".5" fill="#fff" opacity=".55" />

        {/* salsas en la punta del mostrador */}
        <rect x="34" y="84" width="6" height="12" rx="2" fill="#dc2626" />
        <rect x="35.4" y="81" width="3.2" height="3.4" rx="1" fill="#991b1b" />
        <rect x="42" y="86" width="6" height="10" rx="2" fill="#facc15" />
        <rect x="43.4" y="83" width="3.2" height="3.4" rx="1" fill="#a16207" />
        <rect x="35" y="86" width="1.2" height="7" rx=".6" fill="#fff" opacity=".4" />

        {/* ---------- la caja: pantalla con el cobro ---------- */}
        <path d="M245 96L248 89H255L258 96Z" fill="#475569" />
        <rect x="232" y="65" width="39" height="25" rx="3" fill="#1e293b" />
        <rect x="234.4" y="67.4" width="34.2" height="20.2" rx="1.6" fill="#f8fafc" />
        <text x="237" y="75.4" fontSize="6.6" fontWeight="800" fill="#0f172a">
          Bs 35
        </text>
        <g className="esc-fct-boton">
          <rect x="237" y="78" width="29" height="7.6" rx="2" fill={u('bt')} />
          <text x="251.5" y="83.8" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
            COBRAR
          </text>
        </g>
        <g className="esc-fct-pagado" style={{ opacity: 0 }}>
          <rect x="237" y="78" width="29" height="7.6" rx="2" fill="#d1fae5" />
          <text x="251.5" y="83.8" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#047857">
            PAGADO
          </text>
        </g>
        <circle className="esc-fct-toque" cx="251.5" cy="81.8" r="5" fill="none" stroke="#10b981" strokeWidth="1.4" style={{ opacity: 0 }} />

        {/* ---------- la impresora y el ticket que sale ---------- */}
        <g clipPath={u('ci')}>
          <g className="esc-fct-imprime" style={{ opacity: 0 }}>
            <Ticket x={278} y={58} />
          </g>
        </g>
        <rect x="275" y="82" width="26" height="14" rx="3" fill={u('im')} />
        <rect x="276" y="82.6" width="24" height="1" rx=".5" fill="#fff" opacity=".3" />
        <rect x="278" y="83.4" width="20" height="1.6" rx=".8" fill="#0f172a" />
        <circle cx="296" cy="91" r="1.1" fill="#4ade80" />

        {/* ---------- la bolsa del pedido 42 ---------- */}
        <g className="esc-fct-bolsa" style={{ opacity: 0 }}>
          <ellipse cx="220" cy="96.4" rx="9" ry="1.2" fill="#1e1b4b" opacity=".2" />
          <path d="M212 83H228L229 96H211Z" fill={u('bo')} />
          <path d="M212 83L214 80.6H226L228 83Z" fill="#d4a86a" />
          <path d="M216.6 82.6V79.6A3.4 3.4 0 0 1 223.4 79.6V82.6" fill="none" stroke="#8a5a2b" strokeWidth="1" />
          <circle cx="220" cy="90" r="4.2" fill="#16a34a" />
          <text x="220" y="92" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
            42
          </text>
        </g>

        {/* ---------- el cliente, de perfil hacia la caja ---------- */}
        <ellipse cx="190" cy="133" rx="17" ry="2.6" fill="#1e1b4b" opacity=".2" />
        <rect x="182" y="117" width="7" height="15" rx="2" fill="#334155" />
        <rect x="191" y="117" width="7" height="15" rx="2" fill="#1e293b" />
        <path d="M176 121C175 106 180 94 190 94C200 94 204 106 203 121Z" fill={u('ca')} />
        <path d="M180 112C180 103 183 97.6 188 96" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".35" />
        <rect x="187" y="87" width="6.4" height="8" rx="2.6" fill="#e8b48c" />
        <circle cx="191" cy="81" r="8" fill={u('pi')} />
        <path d="M198.6 81.4l1.6 1.6-1.6.6" fill="#e8b48c" />
        <path d="M183 82C181.6 73 189 70 194 71.6C197.4 72.6 199.4 75.4 199 77.6C195 75.6 191 76.6 189.4 79.6C188.6 82.6 186.6 86.4 184.6 87C183.6 85.6 183.2 84 183 82Z" fill="#3f2a1d" />
        <ellipse cx="189" cy="82.6" rx="1.4" ry="2" fill="#e0a77c" />
        <circle cx="195.8" cy="80.6" r=".9" fill="#1e293b" />
        <path d="M195.4 85q1.6.8 2.8-.4" stroke="#b45309" strokeWidth=".8" strokeLinecap="round" fill="none" />
        {/* brazo estirado hacia el mostrador */}
        <path d="M195 99L207 90" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
        <circle cx="208.4" cy="89" r="2.8" fill="#e8b48c" />

        {/* ---------- el ticket viaja de la impresora a la mano ---------- */}
        <g className="esc-fct-vuela" style={{ ...v({ '--dx': '-75px', '--dy': '10px', '--pk': '-10px' }), opacity: 0 }}>
          <Ticket x={278} y={58} />
        </g>
      </svg>
      <Aviso etiqueta="Pedido" texto="42 · Listo" tono="verde" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  2 · PEDIDOS DE APPS DE DELIVERY                                    */
/* ------------------------------------------------------------------ */

/** Las dos apps genéricas: posición del ícono, colores y datos del pedido de su mitad del ciclo. */
const APPS = [
  { nombre: 'App 1', y: 30, de: '#fde047', a: '#eab308', tinta: '#422006', clase: 'a', pedido: '#118' },
  { nombre: 'App 2', y: 72, de: '#f87171', a: '#dc2626', tinta: '#fff', clase: 'b', pedido: '#119' },
] as const

/**
 * El mostrador con una tablet donde caen los pedidos de dos apps de delivery. Ciclo doble
 * (13 s): en una vuelta de 6,5 s llega uno de la App 1 y en la otra uno de la App 2. Guion
 * de cada vuelta: el ícono de la app se sacude y suelta un pedido hacia la tablet (62 %), la
 * tarjeta aparece (72 %), el cajero toca REGISTRAR (2 %), el stock de hamburguesas baja de
 * 12 a 10 y el pedido entra arriba en la lista de liquidación, cuyo total por app destella;
 * el aviso «Pedido registrado» asoma al 10 %.
 */
export function EscenaFnPlataformas() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-slate-100 via-sky-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          {APPS.map((a) => (
            <linearGradient key={a.clase} id={g(`ap${a.clase}`)} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={a.de} />
              <stop offset="1" stopColor={a.a} />
            </linearGradient>
          ))}
          <linearGradient id={g('tb')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3f4e68" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={g('pn')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#edf2f7" />
          </linearGradient>
          <linearGradient id={g('bt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id={g('mt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3d3a6" />
            <stop offset="1" stopColor="#d9a46a" />
          </linearGradient>
          <linearGradient id={g('mf')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a8643a" />
            <stop offset="1" stopColor="#7c4322" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cs')}>
            <rect x="70" y="30" width="96" height="72" rx="4" />
          </clipPath>
          <clipPath id={g('cn')}>
            <rect x="26" y="119" width="30" height="11" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#9fb7d6" luz={['#f1f6fc', '#cddbeb']} />
        {/* sombras de contacto: íconos, tablet y reporte */}
        <ellipse cx="34" cy="133" rx="22" ry="2.8" fill="#0f172a" opacity=".1" />
        <ellipse cx="128" cy="133" rx="66" ry="3.6" fill="#0f172a" opacity=".16" />
        <ellipse cx="248" cy="133" rx="56" ry="3.4" fill="#0f172a" opacity=".1" />

        {/* ---------- las dos apps ---------- */}
        {APPS.map((a) => (
          <g key={a.clase}>
            <g className={`esc-fcp-icono-${a.clase}`}>
              <rect x="17.4" y={a.y + 1.6} width="28" height="28" rx="8" fill="#0f172a" opacity=".12" />
              <rect x="16" y={a.y} width="28" height="28" rx="8" fill={u(`ap${a.clase}`)} />
              <path d={`M19 ${a.y + 9}C19 ${a.y + 4} 22 ${a.y + 2} 28 ${a.y + 2}`} stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".5" />
              <g transform={`translate(30 ${a.y + 15})`}>
                <Moto c={a.tinta} rueda={a.tinta} />
              </g>
            </g>
            <text x="30" y={a.y + 36.5} textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#475569">
              {a.nombre}
            </text>
            {/* globito de «pedido nuevo» */}
            <g className={`esc-fcp-globo-${a.clase}`} style={{ opacity: 0 }}>
              <circle cx="44" cy={a.y + 1} r="4.4" fill="#ef4444" stroke="#fff" strokeWidth="1.2" />
              <text x="44" y={a.y + 3} textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
                1
              </text>
            </g>
          </g>
        ))}

        {/* ---------- stock de hamburguesas ---------- */}
        <rect x="11" y="113" width="50" height="19" rx="6" fill="#fff" />
        <rect x="11.5" y="113.5" width="49" height="18" rx="5.5" fill="none" stroke="#e2e8f0" />
        <g className="esc-fcp-burger">
          <path d="M14.6 122C14.6 118 16.6 116.6 19 116.6S23.4 118 23.4 122Z" fill="#f59e0b" />
          <rect x="14.2" y="122" width="9.6" height="1.6" rx=".8" fill="#22c55e" />
          <rect x="14.2" y="123.6" width="9.6" height="2" rx="1" fill="#7c2d12" />
          <path d="M14.6 125.6H23.4C23.4 127.4 22 128 19 128S14.6 127.4 14.6 125.6Z" fill="#f59e0b" />
        </g>
        <text x="27" y="119" fontSize="5.5" fontWeight="800" fill="#94a3b8" letterSpacing=".3">
          STOCK
        </text>
        <g clipPath={u('cn')}>
          <g className="esc-fcp-stock-antes">
            <text x="27" y="128.6" fontSize="8.6" fontWeight="800" fill="#0f172a">
              12
            </text>
          </g>
          <g className="esc-fcp-stock-ahora" style={{ opacity: 0 }}>
            <text x="27" y="128.6" fontSize="8.6" fontWeight="800" fill="#dc2626">
              10
            </text>
          </g>
        </g>
        <g className="esc-fcp-menos" style={{ opacity: 0 }}>
          <rect x="44" y="104" width="14" height="8" rx="4" fill="#fee2e2" />
          <text x="51" y="110" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#dc2626">
            −2
          </text>
        </g>

        {/* ---------- el mostrador chico con la tablet ---------- */}
        <rect x="70" y="113" width="116" height="19" fill={u('mf')} />
        <rect x="70" y="113" width="116" height="2.2" fill="#000" opacity=".14" />
        <rect x="66" y="108.6" width="124" height="4.8" rx="2" fill={u('mt')} />
        <rect x="67" y="109" width="122" height="1" rx=".5" fill="#fff" opacity=".55" />
        <path d="M110 108.6L113 104H123L126 108.6Z" fill="#475569" />

        <rect x="66" y="26" width="104" height="80" rx="7" fill={u('tb')} />
        <rect x="66.7" y="34" width="1.3" height="62" rx=".65" fill="#fff" opacity=".2" />
        <rect x="70" y="30" width="96" height="72" rx="4" fill={u('pn')} />
        <circle cx="76" cy="35.6" r="1.8" fill="#10b981" />
        <text x="80" y="37.6" fontSize="5.6" fontWeight="800" fill="#64748b">
          Pedidos de apps
        </text>
        <text x="118" y="70" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#cbd5e1">
          Esperando pedidos…
        </text>

        {/* la tarjeta del pedido: la estructura es la misma; el color de la app cambia cada vuelta */}
        <g className="esc-fcp-tarjeta">
          <rect x="74" y="43" width="88" height="56" rx="4" fill="#fff" />
          <rect x="74.4" y="43.4" width="87.2" height="55.2" rx="3.7" fill="none" stroke="#e2e8f0" strokeWidth=".8" />
          {APPS.map((a) => (
            <g key={a.clase} className={`esc-fcp-color-${a.clase}`} style={{ opacity: a.clase === 'a' ? 1 : 0 }}>
              <rect x="78" y="47" width="27" height="9" rx="4.5" fill={u(`ap${a.clase}`)} />
              <text x="91.5" y="53.3" textAnchor="middle" fontSize="5.6" fontWeight="800" fill={a.tinta}>
                {a.nombre}
              </text>
              <text x="157.5" y="53.6" textAnchor="end" fontSize="5.5" fontWeight="700" fill="#94a3b8">
                {a.pedido}
              </text>
              <g transform="translate(148 69)">
                <Moto c={a.a} />
              </g>
            </g>
          ))}
          <text x="78" y="65" fontSize="6" fontWeight="700" fill="#334155">
            2 × Hamburguesa
          </text>
          <text x="78" y="76" fontSize="8.4" fontWeight="800" fill="#0f172a">
            Bs 60
          </text>
          <g className="esc-fcp-boton">
            <rect x="78" y="82" width="80" height="12" rx="4" fill={u('bt')} />
            <text x="118" y="90" textAnchor="middle" fontSize="6" fontWeight="800" letterSpacing=".6" fill="#fff">
              REGISTRAR
            </text>
          </g>
          <g className="esc-fcp-hecho" style={{ opacity: 0 }}>
            <rect x="78" y="82" width="80" height="12" rx="4" fill="#d1fae5" />
            <path d="M99 88.2l2 2 3.8-4.2" fill="none" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <text x="108" y="90" fontSize="6" fontWeight="800" fill="#047857">
              Registrado
            </text>
          </g>
          <circle className="esc-fcp-toque" cx="118" cy="88" r="6" fill="none" stroke="#10b981" strokeWidth="1.6" style={{ opacity: 0 }} />
        </g>
        <g clipPath={u('cs')}>
          <polygon points="70,30 104,30 70,70" fill={u('gl')} />
        </g>

        {/* el pedido que vuela de cada app a la tablet */}
        {APPS.map((a) => (
          <g
            key={a.clase}
            className={`esc-fcp-vuela-${a.clase}`}
            style={{ ...v({ '--dx': '86px', '--dy': `${62 - (a.y + 14)}px` }), opacity: 0 }}
          >
            <rect x="23" y={a.y + 9} width="15" height="11" rx="3" fill="#fff" />
            <rect x="23.4" y={a.y + 9.4} width="14.2" height="10.2" rx="2.7" fill="none" stroke={a.a} strokeWidth=".9" />
            <rect x="26" y={a.y + 12} width="4" height="5" rx="1" fill={a.a} />
            <rect x="31.4" y={a.y + 12.4} width="4" height="1.4" rx=".7" fill="#94a3b8" />
            <rect x="31.4" y={a.y + 15.2} width="3" height="1.4" rx=".7" fill="#cbd5e1" />
          </g>
        ))}

        {/* ---------- el reporte de liquidación ---------- */}
        <rect x="186.6" y="54.6" width="122" height="72" rx="7" fill="#0f172a" opacity=".08" />
        <rect x="185" y="53" width="122" height="72" rx="7" fill="#fff" />
        <rect x="185.5" y="53.5" width="121" height="71" rx="6.5" fill="none" stroke="#e2e8f0" />
        <text x="191" y="62.4" fontSize="5.6" fontWeight="800" fill="#94a3b8" letterSpacing=".6">
          LIQUIDACIÓN
        </text>
        <text x="301" y="62.4" textAnchor="end" fontSize="5.5" fontWeight="700" fill="#cbd5e1">
          Semana
        </text>
        <rect x="191" y="65" width="110" height=".7" fill="#e2e8f0" />

        {/* fila nueva (arriba): la del pedido que se acaba de registrar */}
        <g className="esc-fcp-fila">
          <rect className="esc-fcp-resalte" x="188" y="67.4" width="116" height="8.6" rx="2.6" fill="#10b981" style={{ opacity: 0 }} />
          {APPS.map((a) => (
            <g key={a.clase} className={`esc-fcp-fila-${a.clase}`} style={{ opacity: a.clase === 'a' ? 1 : 0 }}>
              <circle cx="193.4" cy="71.6" r="2.2" fill={a.a} />
              <text x="198" y="73.6" fontSize="5.6" fontWeight="800" fill="#334155">
                {a.nombre}
              </text>
            </g>
          ))}
          <text x="221" y="73.6" fontSize="5.5" fontWeight="700" fill="#10b981">
            ahora
          </text>
          <text x="301" y="73.6" textAnchor="end" fontSize="5.8" fontWeight="800" fill="#0f172a">
            Bs 60
          </text>
        </g>
        {/* filas anteriores */}
        {(
          [
            [81.6, APPS[1], '12:31', 'Bs 45'],
            [89.6, APPS[0], '12:18', 'Bs 38'],
          ] as const
        ).map(([y, a, hora, monto]) => (
          <g key={hora}>
            <circle cx="193.4" cy={y - 2} r="2.2" fill={a.a} />
            <text x="198" y={y} fontSize="5.6" fontWeight="700" fill="#64748b">
              {a.nombre}
            </text>
            <text x="221" y={y} fontSize="5.5" fontWeight="700" fill="#94a3b8">
              {hora}
            </text>
            <text x="301" y={y} textAnchor="end" fontSize="5.8" fontWeight="800" fill="#475569">
              {monto}
            </text>
          </g>
        ))}
        <rect x="191" y="93.6" width="110" height=".7" fill="#e2e8f0" />
        {/* totales por app */}
        {(
          [
            [97, APPS[0], '8 pedidos', 'Bs 480'],
            [108.6, APPS[1], '5 pedidos', 'Bs 310'],
          ] as const
        ).map(([y, a, cuantos, total]) => (
          <g key={a.clase}>
            <rect className={`esc-fcp-total-${a.clase}`} x="188" y={y - 1} width="116" height="11" rx="3" fill={a.de} style={{ opacity: 0 }} />
            <rect x="190" y={y + 0.6} width="25" height="8" rx="4" fill={u(`ap${a.clase}`)} />
            <text x="202.5" y={y + 6.4} textAnchor="middle" fontSize="5.5" fontWeight="800" fill={a.tinta}>
              {a.nombre}
            </text>
            <text x="219" y={y + 6.6} fontSize="5.5" fontWeight="700" fill="#94a3b8">
              {cuantos}
            </text>
            <text x="301" y={y + 7} textAnchor="end" fontSize="6.8" fontWeight="800" fill="#0f172a">
              {total}
            </text>
          </g>
        ))}
      </svg>
      <Aviso etiqueta="Pedido" texto="Registrado" tono="verde" />
    </Marco>
  )
}
