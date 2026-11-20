import './EscenasFnBillar.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de tres funciones de «Billar y Restobar» (20-nov-2026):
  la supervisión de las mesas en vivo (desde la casa del dueño), las reservas de mesa
  por horario y la tele del salón con el tablero para los jugadores. Mismo lenguaje
  que las escenas de Funciones (viewBox 320 × 150, plataforma con sombra de contacto,
  luz arriba a la izquierda, ciclo de 6,5 s con el <Aviso> asomando al 10 %).

  Los relojes que corren son «rodillos»: una columna de valores recortada que sube de
  a un paso con `steps()` (sólo transform). Ningún elemento animado lleva
  `transform=""` (la regla `.escena svg *` le cambia el pivote): lo que se mueve va
  dentro de un <g>. Keyframes `esc-bs-*` en EscenasFnBillar.css.
*/

const VB = '0 0 320 150'

/** Id de degradés sin caracteres raros (React 19 los arma con guiones bajos o comillas). */
function useIds() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return { id, g: (n: string) => `${id}${n}`, u: (n: string) => `url(#${id}${n})` }
}

/** Plataforma común: losa elíptica con canto, luz y una sombra ancha difusa. */
function Plataforma({ id, borde, luz, sombra }: { id: string; borde: string; luz: [string, string]; sombra: string }) {
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
      <ellipse cx="160" cy="134" rx="124" ry="8" fill={sombra} opacity=".06" />
    </>
  )
}

/** Sombra de contacto: una ancha y difusa + otra chica y más oscura. */
function Contacto({ cx, cy = 133, rx, color }: { cx: number; cy?: number; rx: number; color: string }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry="6" fill={color} opacity=".07" />
      <ellipse cx={cx} cy={cy} rx={rx * 0.72} ry="3.2" fill={color} opacity=".16" />
    </>
  )
}

/**
 * Reloj que corre: la columna de `valores` queda recortada a un solo renglón y la
 * clase `clase` la sube de a `paso` (con `steps()`). Sin animación se ve el primero.
 */
function Rodillo({
  g,
  u,
  nombre,
  x,
  y,
  ancho,
  valores,
  clase,
  tam,
  fill,
  anchor = 'middle',
  peso = 800,
}: {
  g: (n: string) => string
  u: (n: string) => string
  nombre: string
  x: number
  y: number
  ancho: number
  valores: string[]
  clase: string
  tam: number
  fill: string
  anchor?: 'start' | 'middle' | 'end'
  peso?: number
}) {
  const paso = Math.round(tam * 1.25 * 10) / 10
  const x0 = anchor === 'middle' ? x - ancho / 2 : anchor === 'end' ? x - ancho : x
  return (
    <>
      <defs>
        <clipPath id={g(nombre)}>
          <rect x={x0} y={y - tam * 0.86} width={ancho} height={paso} />
        </clipPath>
      </defs>
      <g clipPath={u(nombre)}>
        <g className={clase} style={v({ '--paso': `${paso}px` })}>
          {valores.map((t, i) => (
            <text key={i} x={x} y={y + i * paso} textAnchor={anchor} fontSize={tam} fontWeight={peso} fill={fill}>
              {t}
            </text>
          ))}
        </g>
      </g>
    </>
  )
}

/** Valores de un reloj que sube de minuto en minuto: «1:20», «1:21»… */
const minutos = (base: string, desde: number, n: number, baja = false) =>
  Array.from({ length: n }, (_, i) => `${base}${baja ? desde - i : desde + i}`)

/** Colores de cada estado de mesa (los mismos en las tres escenas). */
const ESTADO = {
  libre: { fuerte: '#10b981', claro: '#d1fae5', tinta: '#047857', tv: '#4ade80' },
  ocupada: { fuerte: '#0ea5e9', claro: '#e0f2fe', tinta: '#0369a1', tv: '#38bdf8' },
  pausada: { fuerte: '#f59e0b', claro: '#fef3c7', tinta: '#b45309', tv: '#fbbf24' },
  fijo: { fuerte: '#8b5cf6', claro: '#ede9fe', tinta: '#6d28d9', tv: '#a78bfa' },
  reservada: { fuerte: '#f43f5e', claro: '#ffe4e6', tinta: '#be123c', tv: '#fb7185' },
} as const
type Estado = keyof typeof ESTADO

/** Ícono de calendario para el aviso de la reserva. */
const ICONO_CALENDARIO = (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.2" y="4.5" width="13.6" height="12.3" rx="2.2" />
    <path d="M3.2 8.6h13.6M7 2.8v3.2M13 2.8v3.2" />
  </svg>
)

/** Ícono de pausa para el aviso de la supervisión. */
const ICONO_PAUSA = (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
    <rect x="5" y="4" width="3.6" height="12" rx="1.2" />
    <rect x="11.4" y="4" width="3.6" height="12" rx="1.2" />
  </svg>
)

/* ------------------------------------------------------------------ */
/*  1 · SUPERVISIÓN: el tablero de las mesas en vivo, desde la casa    */
/* ------------------------------------------------------------------ */

/** Mesita vista de arriba (30 × 14) para las fichas del tablero; `bolas` en coordenadas del paño. */
function MesaMini({ x, y, u, bolas }: { x: number; y: number; u: (n: string) => string; bolas: [number, number, string][] }) {
  const buzones: [number, number][] = [
    [2.6, 2.6],
    [15, 2.2],
    [27.4, 2.6],
    [2.6, 11.4],
    [15, 11.8],
    [27.4, 11.4],
  ]
  return (
    <>
      <rect x={x + 0.6} y={y + 1} width="30" height="14" rx="3" fill="#0f172a" opacity=".12" />
      <rect x={x} y={y} width="30" height="14" rx="3" fill={u('ma')} />
      <rect x={x + 2.2} y={y + 2.2} width="25.6" height="9.6" rx="1.4" fill={u('pa')} />
      <rect x={x + 3.4} y={y + 2.9} width="15" height=".7" rx=".35" fill="#fff" opacity=".22" />
      {buzones.map(([bx, by]) => (
        <circle key={`${bx}-${by}`} cx={x + bx} cy={y + by} r="1.15" fill="#0c2a23" />
      ))}
      {bolas.map(([bx, by, c]) => (
        <g key={`${bx}-${by}`}>
          <circle cx={x + 2.2 + bx + 0.3} cy={y + 2.2 + by + 0.4} r="1.25" fill="#052e22" opacity=".3" />
          <circle cx={x + 2.2 + bx} cy={y + 2.2 + by} r="1.25" fill={c} />
        </g>
      ))}
    </>
  )
}

const BOLAS_JUEGO: [number, number, string][] = [
  [6, 3.4, '#ef4444'],
  [14, 6.4, '#facc15'],
  [19.5, 3, '#3b82f6'],
  [9.5, 6.8, '#fff'],
]
const BOLAS_RACK: [number, number, string][] = [
  [17, 4.8, '#ef4444'],
  [19.3, 3.5, '#facc15'],
  [19.3, 6.1, '#3b82f6'],
  [7, 4.8, '#fff'],
]

/** Ficha de una mesa en el tablero (42 × 58): franja de color, nombre, mesita y estado. */
function Ficha({ x, y, n, estado }: { x: number; y: number; n: number; estado: Estado }) {
  const c = ESTADO[estado]
  return (
    <>
      <rect x={x + 0.5} y={y + 1} width="42" height="58" rx="3.5" fill="#0f172a" opacity=".07" />
      <rect x={x} y={y} width="42" height="58" rx="3.5" fill="#fff" stroke="#e2e8f0" strokeWidth=".6" />
      <rect x={x + 4} y={y + 1.6} width="34" height="1.6" rx=".8" fill={c.fuerte} />
      <text x={x + 4} y={y + 9.6} fontSize="5.5" fontWeight="800" fill="#334155">
        Mesa {n}
      </text>
    </>
  )
}

/** Pastilla del estado de una ficha (34 × 7). */
function Pastilla({ x, y, estado, texto }: { x: number; y: number; estado: Estado; texto: string }) {
  const c = ESTADO[estado]
  return (
    <>
      <rect x={x} y={y} width="34" height="7.2" rx="3.6" fill={c.claro} />
      <text x={x + 17} y={y + 5.4} textAnchor="middle" fontSize="5.5" fontWeight="800" fill={c.tinta}>
        {texto}
      </text>
    </>
  )
}

/**
 * La compu del dueño, en su casa de noche (ventana con luna, la taza al lado): el tablero de
 * las cuatro mesas «En vivo», con lo que debería haber en la caja del turno. Los relojes de
 * las mesas ocupadas corren (la de tiempo fijo, para atrás). La Mesa 3 se pausa en el salón
 * (73 %) y su contador de pausa avanza; al dar la vuelta llega a 15 min, la ficha destella,
 * el celular del dueño vibra con la alerta y asoma el aviso «Mesa 3 · Pausada 15 min».
 * Cuando el aviso se va (61 %) la reanudan y vuelve un rato a «Ocupada».
 */
export function EscenaFnSupervisionBillar() {
  const { id, g, u } = useIds()
  const xs = [58.5, 103.5, 148.5, 193.5]
  const y0 = 53.5

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-indigo-100 via-slate-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('ta')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#475569" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={g('te')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f1f5f9" />
          </linearGradient>
          <linearGradient id={g('bs')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={g('ma')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b97a47" />
            <stop offset="1" stopColor="#6b3a1f" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4fd096" />
            <stop offset="1" stopColor="#1f8a5f" />
          </linearGradient>
          <linearGradient id={g('no')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1e1b4b" />
            <stop offset="1" stopColor="#3b4a7a" />
          </linearGradient>
          <linearGradient id={g('tz')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f87171" />
            <stop offset="1" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id={g('cl')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffbeb" />
            <stop offset="1" stopColor="#fde68a" />
          </linearGradient>
        </defs>

        <Plataforma id={id} borde="#c7d2fe" luz={['#f8fafc', '#e0e7ff']} sombra="#1e1b4b" />
        <Contacto cx={147} cy={137.6} rx={112} color="#1e1b4b" />
        <Contacto cx={23} cy={134.4} rx={12} color="#1e1b4b" />
        <Contacto cx={284} cy={134.4} rx={17} color="#1e1b4b" />

        {/* ---------- la ventana de la casa, de noche ---------- */}
        <rect x="12.6" y="11" width="34" height="36" rx="2.4" fill="#1e1b4b" opacity=".1" />
        <rect x="11" y="9" width="34" height="36" rx="2.4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth=".8" />
        <rect x="13.6" y="11.6" width="28.8" height="30.8" rx="1.2" fill={u('no')} />
        <circle cx="34" cy="19" r="4" fill="#fde68a" />
        <circle cx="35.8" cy="17.6" r="3.4" fill="#283163" />
        {[
          [18, 16],
          [24, 22],
          [37.5, 30],
          [20, 30],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r=".55" fill="#fff" opacity=".8" />
        ))}
        <path d="M13.6 42.4V36h5v-3.4h6V36h4.6v-5h5.4v11.4Z" fill="#141233" opacity=".75" />
        <rect x="27.4" y="11.6" width="1.2" height="30.8" fill="#e2e8f0" />
        <rect x="13.6" y="26.4" width="28.8" height="1.2" fill="#e2e8f0" />

        {/* ---------- la taza ---------- */}
        <g transform="translate(0 8)">
        <path d="M28.6 110.6h2.4a3 3 0 0 1 0 6h-2.4" fill="none" stroke="#e11d48" strokeWidth="1.6" />
        <path d="M15 107.4H30V122Q30 125.4 26.6 125.4H18.4Q15 125.4 15 122Z" fill="#fb7185" />
        <path d="M15 107.4H30V109H15Z" fill="#be123c" opacity=".35" />
        <rect x="16.8" y="110" width="1.4" height="12" rx=".7" fill="#fff" opacity=".45" />
        <g className="esc-bs-vapor">
          <path d="M20 103q-1.6-2.4 0-4.6t0-4.6M25 103q-1.6-2.4 0-4.6t0-4.6" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity=".55" />
        </g>
        </g>

        {/* ---------- la laptop (bajada para que el aviso no tape el encabezado) ---------- */}
        <g transform="translate(0 11)">
        <rect x="52" y="36.5" width="194" height="84" rx="6" fill="#0f172a" opacity=".12" />
        <rect x="50" y="34" width="194" height="84" rx="6" fill={u('ta')} />
        <rect x="52" y="34.6" width="190" height="1" rx=".5" fill="#fff" opacity=".25" />
        <circle cx="147" cy="36.1" r=".8" fill="#64748b" />
        <rect x="54" y="38" width="186" height="76" rx="2" fill={u('te')} />

        {/* encabezado: título, «En vivo» y la caja del turno */}
        <text x="59" y="46.6" fontSize="6.4" fontWeight="800" fill="#1e293b">
          Mesas
        </text>
        <circle className="esc-bs-vivo-aro" cx="86.4" cy="44.4" r="1.7" fill="none" stroke="#ef4444" strokeWidth=".8" />
        <circle className="esc-bs-vivo" cx="86.4" cy="44.4" r="1.7" fill="#ef4444" />
        <text x="90" y="46.6" fontSize="5.5" fontWeight="800" fill="#dc2626">
          En vivo
        </text>
        <rect x="176" y="40.6" width="60" height="8.4" rx="4.2" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth=".6" />
        <text x="206" y="46.6" textAnchor="middle" fontSize="5.5" fill="#059669">
          <tspan fontWeight="600">En caja </tspan>
          <tspan fontWeight="800" fill="#065f46">
            Bs 1.240
          </tspan>
        </text>
        <rect x="56" y="50.6" width="182" height=".6" fill="#e2e8f0" />

        {/* Mesa 1: ocupada, tiempo libre que corre */}
        <Ficha x={xs[0]} y={y0} n={1} estado="ocupada" />
        <MesaMini x={xs[0] + 6} y={y0 + 12} u={u} bolas={BOLAS_JUEGO} />
        <Pastilla x={xs[0] + 4} y={y0 + 29} estado="ocupada" texto="Ocupada" />
        <Rodillo g={g} u={u} nombre="r1" x={xs[0] + 21} y={y0 + 46} ancho={34} tam={9} fill="#1e293b" valores={minutos('1:2', 0, 10)} clase="esc-bs-rueda" />
        <text x={xs[0] + 21} y={y0 + 53.6} textAnchor="middle" fontSize="5.5" fontWeight="600" fill="#64748b">
          Ana · 19:05
        </text>

        {/* Mesa 2: libre */}
        <Ficha x={xs[1]} y={y0} n={2} estado="libre" />
        <MesaMini x={xs[1] + 6} y={y0 + 12} u={u} bolas={BOLAS_RACK} />
        <Pastilla x={xs[1] + 4} y={y0 + 29} estado="libre" texto="Libre" />
        <text x={xs[1] + 21} y={y0 + 46} textAnchor="middle" fontSize="9" fontWeight="800" fill="#cbd5e1">
          0:00
        </text>
        <text x={xs[1] + 21} y={y0 + 53.6} textAnchor="middle" fontSize="5.5" fontWeight="600" fill="#94a3b8">
          Disponible
        </text>

        {/* Mesa 3: ocupada → pausada (la historia) */}
        <Ficha x={xs[2]} y={y0} n={3} estado="ocupada" />
        <MesaMini x={xs[2] + 6} y={y0 + 12} u={u} bolas={BOLAS_JUEGO.slice(1)} />
        <g className="esc-bs-s-ocu" style={{ opacity: 0 }}>
          <rect x={xs[2] + 4} y={y0 + 1.6} width="34" height="1.6" rx=".8" fill={ESTADO.ocupada.fuerte} />
          <Pastilla x={xs[2] + 4} y={y0 + 29} estado="ocupada" texto="Ocupada" />
          <text x={xs[2] + 21} y={y0 + 46} textAnchor="middle" fontSize="9" fontWeight="800" fill="#1e293b">
            0:52
          </text>
          <text x={xs[2] + 21} y={y0 + 53.6} textAnchor="middle" fontSize="5.5" fontWeight="600" fill="#64748b">
            Luis · 20:10
          </text>
        </g>
        <g className="esc-bs-s-pau">
          <rect x={xs[2]} y={y0} width="42" height="58" rx="3.5" fill="#fffbeb" stroke="#fbbf24" strokeWidth=".9" />
          <rect x={xs[2] + 4} y={y0 + 1.6} width="34" height="1.6" rx=".8" fill={ESTADO.pausada.fuerte} />
          <text x={xs[2] + 4} y={y0 + 9.6} fontSize="5.5" fontWeight="800" fill="#334155">
            Mesa 3
          </text>
          <MesaMini x={xs[2] + 6} y={y0 + 12} u={u} bolas={BOLAS_JUEGO.slice(1)} />
          <rect x={xs[2] + 6} y={y0 + 12} width="30" height="14" rx="3" fill="#fffbeb" opacity=".45" />
          <circle cx={xs[2] + 21} cy={y0 + 19} r="4.6" fill={ESTADO.pausada.fuerte} />
          <rect x={xs[2] + 18.9} y={y0 + 16.6} width="1.5" height="4.8" rx=".5" fill="#fff" />
          <rect x={xs[2] + 21.6} y={y0 + 16.6} width="1.5" height="4.8" rx=".5" fill="#fff" />
          <Pastilla x={xs[2] + 4} y={y0 + 29} estado="pausada" texto="Pausada" />
          <text x={xs[2] + 21} y={y0 + 46} textAnchor="middle" fontSize="9" fontWeight="800" fill="#b45309">
            0:52
          </text>
          <Rodillo
            g={g}
            u={u}
            nombre="rp"
            x={xs[2] + 21}
            y={y0 + 53.6}
            ancho={38}
            tam={5.5}
            peso={800}
            fill="#b45309"
            valores={['hace 15 min', ...Array.from({ length: 14 }, (_, i) => `hace ${i + 1} min`)]}
            clase="esc-bs-s-min"
          />
        </g>
        <rect className="esc-bs-s-aro" x={xs[2] - 1} y={y0 - 1} width="44" height="60" rx="4.5" fill="none" stroke="#f59e0b" strokeWidth="1.4" style={{ opacity: 0 }} />

        {/* Mesa 4: tiempo fijo, cuenta para atrás */}
        <Ficha x={xs[3]} y={y0} n={4} estado="fijo" />
        <MesaMini x={xs[3] + 6} y={y0 + 12} u={u} bolas={BOLAS_JUEGO.slice(0, 3)} />
        <Pastilla x={xs[3] + 4} y={y0 + 29} estado="fijo" texto="Fijo 2 h" />
        <Rodillo g={g} u={u} nombre="r4" x={xs[3] + 21} y={y0 + 46} ancho={34} tam={9} fill="#5b21b6" valores={minutos('0:4', 9, 10, true)} clase="esc-bs-rueda" />
        <text x={xs[3] + 21} y={y0 + 53.6} textAnchor="middle" fontSize="5.5" fontWeight="600" fill="#64748b">
          Ana · 19:30
        </text>

        {/* la base y el teclado */}
        <path d="M42 118H252L261 125Q261.6 126.6 259.6 126.6H34.4Q32.4 126.6 33 125Z" fill={u('bs')} />
        <path d="M43 118.4H251" stroke="#fff" strokeWidth=".8" opacity=".8" />
        <path d="M132 118H162L160.6 119.8H133.4Z" fill="#64748b" opacity=".5" />
        </g>

        {/* ---------- el celular del dueño, en su atril: vibra con la alerta ---------- */}
        <g transform="translate(0 8)">
        <path d="M274 121.6H294L297.6 126.4H270.4Z" fill="#94a3b8" />
        <g className="esc-bs-cel">
          <rect x="271" y="70" width="27" height="52" rx="5" fill={u('ta')} />
          <rect x="273" y="72.6" width="23" height="46.8" rx="3.4" fill="#0f172a" />
          <rect x="280.5" y="74.2" width="8" height="1.8" rx=".9" fill="#334155" />
          <g className="esc-bs-cel-luz" style={{ opacity: 0 }}>
            <rect x="273" y="72.6" width="23" height="46.8" rx="3.4" fill={u('cl')} />
            <g className="esc-bs-campana">
              <path d="M280.6 90.4C280.6 85 282.2 82.8 284.5 82.8S288.4 85 288.4 90.4L289.6 91.6H279.4Z" fill="#f59e0b" />
              <circle cx="284.5" cy="92.8" r="1.2" fill="#f59e0b" />
            </g>
            <text x="284.5" y="102.6" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#78350f">
              Mesa 3
            </text>
            <text x="284.5" y="109.4" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#b45309">
              15 min
            </text>
          </g>
        </g>
        </g>
      </svg>
      <Aviso etiqueta="Supervisión en vivo" texto="Mesa 3 · Pausada 15 min" tono="ambar" icono={ICONO_PAUSA} />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  2 · RESERVAS: la agenda de mesas por horario                       */
/* ------------------------------------------------------------------ */

/** Columnas de la agenda: 19:00, 20:00 y 21:00 (una hora = 46,67 de ancho). */
const COL0 = 52
const HORA = 140 / 3
const xHora = (h: number, m = 0) => COL0 + (h - 19 + m / 60) * HORA
/** Filas de la agenda: arriba de cada mesa. */
const FILAS_R = [44, 63.2, 82.4, 101.6]
const ALTO_R = 17.4

/** Bloque de la agenda: rectángulo de color con nombre y una línea chica. */
function Bloque({ x, y, w, fondo, titulo, sub }: { x: number; y: number; w: number; fondo: string; titulo: string; sub?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={ALTO_R} rx="3" fill={fondo} />
      <rect x={x} y={y} width="2.4" height={ALTO_R} rx="1.2" fill="#fff" opacity=".45" />
      <text x={x + 5} y={y + 7.4} fontSize="5.8" fontWeight="800" fill="#fff">
        {titulo}
      </text>
      {sub && (
        <text x={x + 5} y={y + 14} fontSize="5.5" fontWeight="600" fill="#fff" opacity=".85">
          {sub}
        </text>
      )}
    </>
  )
}

/** Mesa de pool chica en perspectiva 3/4 (la misma geometría que la de EscenaBillar, reducida). */
const T = (x: number, y: number): [number, number] => [258 + (x - 150) * 0.52, 84 + (y - 62) * 0.52]
const poli = (pts: [number, number][]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`
const TOPE_R = poli([T(92, 62), T(208, 62), T(242, 117), T(58, 117)])
const BANDA_R = poli([T(96, 68), T(204, 68), T(232, 111), T(68, 111)])
const PANO_R = poli([T(98, 73), T(202, 73), T(223.7, 106), T(76.3, 106)])

/**
 * La tablet de la caja con la agenda de las mesas (Mesa 1..4 × 19:00–22:00) y, al lado, la
 * Mesa 2 de verdad. Guion (6,5 s): entra la reserva «Carlos · 20:00» en la Mesa 2 (3 %), la
 * mesa pasa a «Reservada» y en el paño aparece el cartelito (aviso al 10 %). La línea de la
 * hora avanza hasta las 20:00; el cajero toca ▶ en la reserva (48 %): la mesa se abre, se
 * prende la lámpara, aparecen las bolas y el reloj de la mesa arranca en 0:00. Al 90 % se
 * limpia para la vuelta siguiente.
 */
export function EscenaFnReservasBillar() {
  const { id, g, u } = useIds()
  const xC = xHora(20)
  const wC = HORA - 1.2
  const yC = FILAS_R[1]
  const reloj = minutos('0:0', 0, 8)

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-emerald-100 via-teal-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('ta')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3f4e68" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={g('te')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f0fdf4" />
          </linearGradient>
          <linearGradient id={g('rs')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fb7185" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id={g('oc')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id={g('fj')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id={g('top')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9b985" />
            <stop offset="1" stopColor="#b97a47" />
          </linearGradient>
          <linearGradient id={g('fa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9a5d36" />
            <stop offset="1" stopColor="#6b3a1f" />
          </linearGradient>
          <linearGradient id={g('cu')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f9467" />
            <stop offset="1" stopColor="#136a49" />
          </linearGradient>
          <linearGradient id={g('pn')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4fd096" />
            <stop offset="1" stopColor="#25966a" />
          </linearGradient>
          <linearGradient id={g('co')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2b0" stopOpacity=".75" />
            <stop offset="1" stopColor="#fff2b0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b8a80" />
            <stop offset="1" stopColor="#0d4d4a" />
          </linearGradient>
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

        <Plataforma id={id} borde="#8fd6b4" luz={['#f7fffb', '#cdf3e0']} sombra="#064e3b" />
        <Contacto cx={104} cy={129} rx={96} color="#064e3b" />
        <Contacto cx={258} cy={130} rx={50} color="#064e3b" />

        {/* ---------- la tablet con la agenda ---------- */}
        <rect x="10" y="20.5" width="190" height="108" rx="8" fill="#064e3b" opacity=".12" />
        <rect x="8" y="18" width="190" height="108" rx="8" fill={u('ta')} />
        <rect x="16" y="18.6" width="174" height="1" rx=".5" fill="#fff" opacity=".22" />
        <rect x="12" y="22" width="182" height="100" rx="4" fill={u('te')} />

        <text x="17" y="31.4" fontSize="6.6" fontWeight="800" fill="#064e3b">
          Reservas
        </text>
        <text x="48.6" y="31.4" fontSize="5.5" fontWeight="600" fill="#94a3b8">
          Hoy
        </text>
        {/* el reloj: 19:45 → 20:00 */}
        <rect x="134" y="24.8" width="34" height="8.6" rx="4.3" fill="#f1f5f9" />
        <circle cx="140.4" cy="29.1" r="2.4" fill="none" stroke="#64748b" strokeWidth=".8" />
        <path d="M140.4 27.7v1.5l1 .7" fill="none" stroke="#64748b" strokeWidth=".7" strokeLinecap="round" />
        <text className="esc-bs-r-h1" x="145" y="31.1" fontSize="5.5" fontWeight="800" fill="#334155">
          19:45
        </text>
        <text className="esc-bs-r-h2" x="145" y="31.1" fontSize="5.5" fontWeight="800" fill="#0369a1" style={{ opacity: 0 }}>
          20:00
        </text>

        {/* encabezado de horas y grilla */}
        {[19, 20, 21].map((h) => (
          <text key={h} x={xHora(h) + 2} y="40.6" fontSize="5.5" fontWeight="700" fill="#94a3b8">
            {h}:00
          </text>
        ))}
        {[19, 20, 21, 22].map((h) => (
          <rect key={h} x={xHora(h) - 0.3} y="43" width=".6" height="77" fill="#e2e8f0" />
        ))}
        {FILAS_R.map((y, i) => (
          <g key={y}>
            <rect x="14" y={y} width="178" height={ALTO_R} rx="3" fill="#f8fafc" opacity=".7" />
            <text x="17" y={y + 7.4} fontSize="5.5" fontWeight="800" fill="#334155">
              Mesa {i + 1}
            </text>
          </g>
        ))}

        {/* estados de cada mesa (debajo del nombre) */}
        {(
          [
            [0, 'ocupada', 'Ocupada'],
            [2, 'ocupada', 'Ocupada'],
            [3, 'libre', 'Libre'],
          ] as [number, Estado, string][]
        ).map(([i, e, t]) => (
          <g key={i}>
            <circle cx="18.6" cy={FILAS_R[i] + 12.4} r="1.6" fill={ESTADO[e].fuerte} />
            <text x="22" y={FILAS_R[i] + 14.3} fontSize="5.5" fontWeight="700" fill={ESTADO[e].tinta}>
              {t}
            </text>
          </g>
        ))}
        {(
          [
            ['esc-bs-r-libre', 'libre', 'Libre', undefined],
            ['esc-bs-r-reserv', 'reservada', 'Reservada', undefined],
            ['esc-bs-r-ocu', 'ocupada', 'Ocupada', 0],
          ] as [string, Estado, string, number | undefined][]
        ).map(([c, e, t, op]) => (
          <g key={c} className={c} style={op === 0 ? { opacity: 0 } : undefined}>
            <circle cx="18.6" cy={yC + 12.4} r="1.6" fill={ESTADO[e].fuerte} />
            <text x="22" y={yC + 14.3} fontSize="5.5" fontWeight="700" fill={ESTADO[e].tinta}>
              {t}
            </text>
          </g>
        ))}

        {/* la línea de la hora: de 19:45 a 20:00 (por detrás de los bloques) */}
        <g className="esc-bs-r-ahora" style={v({ '--dx': `${(HORA / 4).toFixed(2)}px` })}>
          <rect x={xHora(19, 45) - 0.5} y="43" width="1" height="77" fill="#ef4444" />
          <circle cx={xHora(19, 45)} cy="43" r="1.8" fill="#ef4444" />
        </g>

        {/* bloques que ya estaban */}
        <Bloque x={xHora(19) + 0.6} y={FILAS_R[0]} w={HORA * 1.5 - 1.2} fondo={u('oc')} titulo="Tiempo libre" sub="desde 19:00" />
        <Bloque x={xHora(19, 30) + 0.6} y={FILAS_R[2]} w={HORA - 1.2} fondo={u('fj')} titulo="Fijo 1 h" sub="19:30" />
        <Bloque x={xHora(21) + 0.6} y={FILAS_R[3]} w={HORA - 1.2} fondo={u('rs')} titulo="Ana" sub="21:00" />

        {/* la reserva nueva: Carlos · 20:00 en la Mesa 2 */}
        <g className="esc-bs-r-bloque">
          <Bloque x={xC + 0.6} y={yC} w={wC} fondo={u('rs')} titulo="Carlos" sub="20:00" />
          <circle cx={xC + wC - 5.4} cy={yC + ALTO_R / 2} r="4.6" fill="#fff" />
          <path d={`M${xC + wC - 6.8} ${yC + ALTO_R / 2 - 2.4}l4 2.4-4 2.4Z`} fill="#e11d48" />
          {/* abierta desde la reserva: pasa a celeste y corre el reloj */}
          <g className="esc-bs-r-abierta" style={{ opacity: 0 }}>
            <Bloque x={xC + 0.6} y={yC} w={wC} fondo={u('oc')} titulo="Carlos" />
            <Rodillo g={g} u={u} nombre="rb" x={xC + 5.6} y={yC + 14} ancho={20} tam={5.5} peso={700} anchor="start" fill="#fff" valores={reloj} clase="esc-bs-r-reloj" />
          </g>
        </g>
        <rect className="esc-bs-r-aro" x={xC - 1} y={yC - 1.6} width={wC + 3.2} height={ALTO_R + 3.2} rx="4.4" fill="none" stroke="#f43f5e" strokeWidth="1.3" style={{ opacity: 0 }} />
        <rect className="esc-bs-r-aro2" x={xC - 1} y={yC - 1.6} width={wC + 3.2} height={ALTO_R + 3.2} rx="4.4" fill="none" stroke="#0ea5e9" strokeWidth="1.3" style={{ opacity: 0 }} />

        {/* el dedo del cajero toca ▶ */}
        <g className="esc-bs-r-dedo" style={{ opacity: 0 }}>
          <circle cx={xC + wC - 5.4} cy={yC + ALTO_R / 2} r="5" fill="#fff" opacity=".55" />
          <circle cx={xC + wC - 5.4} cy={yC + ALTO_R / 2} r="5" fill="none" stroke="#0369a1" strokeWidth="1.1" opacity=".6" />
          <circle cx={xC + wC - 5.4} cy={yC + ALTO_R / 2} r="1.8" fill="#0369a1" opacity=".45" />
        </g>

        {/* ---------- la Mesa 2 del salón ---------- */}
        {/* lámpara colgante: cable, pantalla y el cono de luz (se prende al abrir) */}
        <rect x="257.5" y="-6" width="1" height="50" fill="#475569" />
        <g className="esc-bs-r-luz" style={{ opacity: 0 }}>
          <path d="M248 51H268L302 106H214Z" fill={u('co')} />
        </g>
        <path d="M245.6 52L250.4 44.4H265.6L270.4 52Z" fill={u('pa')} />
        <rect x="246" y="51.2" width="24" height="1.4" rx=".7" fill="#0b3a37" />
        <ellipse className="esc-bs-r-foco" cx="258" cy="52.8" rx="6" ry="1.4" fill="#fff7c2" style={{ opacity: 0.35 }} />

        {/* patas, faldón, tope, banda y paño */}
        <rect x={T(66, 0)[0]} y="121" width="5.8" height="8.6" rx="1.6" fill="#6b3a1f" />
        <rect x={T(223, 0)[0]} y="121" width="5.8" height="8.6" rx="1.6" fill="#6b3a1f" />
        <path d={`M${T(58, 116)[0]} ${T(58, 116)[1]}H${T(242, 116)[0]}V${T(0, 132)[1]}H${T(58, 116)[0]}Z`} fill={u('fa')} />
        <path d={TOPE_R} fill={u('top')} strokeLinejoin="round" stroke="#b97a47" strokeWidth="1.6" />
        <path d={BANDA_R} fill={u('cu')} />
        <path d={PANO_R} fill={u('pn')} />
        {(
          [
            [100, 71],
            [200, 71],
            [150, 69.6],
            [71, 108],
            [229, 108],
            [150, 109.6],
          ] as [number, number][]
        ).map(([x, y]) => {
          const [cx, cy] = T(x, y)
          return <ellipse key={`${x}-${y}`} cx={cx} cy={cy} rx={x === 150 ? 2.8 : 3.2} ry="1.9" fill="#0c2a23" />
        })}

        {/* las bolas (al abrir la mesa) */}
        <g className="esc-bs-r-bolas" style={{ opacity: 0 }}>
          {(
            [
              [245, 101.5, 'bb'],
              [264, 97.5, 'br'],
              [268, 95.4, 'ba'],
              [268, 99.6, 'bz'],
              [272, 97.5, 'br'],
            ] as [number, number, string][]
          ).map(([x, y, c]) => (
            <g key={`${x}-${y}`}>
              <ellipse cx={x + 0.6} cy={y + 1.4} rx="2.3" ry="1" fill="#052e22" opacity=".3" />
              <circle cx={x} cy={y} r="2.1" fill={u(c)} />
              <circle cx={x - 0.6} cy={y - 0.7} r=".55" fill="#fff" opacity=".8" />
            </g>
          ))}
        </g>

        {/* el cartelito de «Reservada» en el paño */}
        <g className="esc-bs-r-cartel">
          <ellipse cx="258" cy="104.4" rx="16" ry="1.6" fill="#052e22" opacity=".25" />
          <rect x="241" y="88.6" width="34" height="15" rx="2.4" fill={u('rs')} />
          <rect x="242" y="89.2" width="32" height=".8" rx=".4" fill="#fff" opacity=".4" />
          <text x="258" y="95.2" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
            Reservada
          </text>
          <text x="258" y="101.6" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#ffe4e6">
            20:00
          </text>
        </g>

        {/* el reloj de la mesa, que arranca al abrirla */}
        <g className="esc-bs-r-chip" style={{ opacity: 0 }}>
          <rect x="233" y="61.6" width="50" height="12" rx="6" fill="#0f172a" opacity=".15" />
          <rect x="233" y="60" width="50" height="12" rx="6" fill="#0f172a" />
          <circle cx="240" cy="66" r="3" fill="#0ea5e9" />
          <path d="M239 64.4l2.4 1.6-2.4 1.6Z" fill="#fff" />
          <text x="245.4" y="68.1" fontSize="5.5" fontWeight="700" fill="#94a3b8">
            Mesa 2
          </text>
          <Rodillo g={g} u={u} nombre="rc" x={279} y={68.1} ancho={15} tam={5.5} anchor="end" fill="#fff" valores={reloj} clase="esc-bs-r-reloj" />
        </g>
      </svg>
      <Aviso etiqueta="Reserva · Carlos" texto="Mesa 2 · 20:00" tono="rosa" icono={ICONO_CALENDARIO} />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  3 · LA TELE DEL SALÓN: el tablero para los jugadores               */
/* ------------------------------------------------------------------ */

/** Casillas de la tele (2 × 2): esquina, número y estado. */
const TILES: { x: number; y: number; n: number; e: Estado }[] = [
  { x: 86, y: 27, n: 1, e: 'libre' },
  { x: 161, y: 27, n: 2, e: 'ocupada' },
  { x: 86, y: 54.5, n: 3, e: 'fijo' },
  { x: 161, y: 54.5, n: 4, e: 'reservada' },
]
const TW = 73
const TH = 25

/** Casilla de la tele: fondo oscuro, bloque de color con el número y la etiqueta del estado. */
function CasillaTv({
  x,
  y,
  n,
  color,
  etiqueta,
  fondo = '#1e293b',
  espaciado = 0.3,
}: {
  x: number
  y: number
  n: number
  color: string
  etiqueta: string
  fondo?: string
  /** Espaciado de la etiqueta (las largas van sin). */
  espaciado?: number
}) {
  return (
    <>
      <rect x={x} y={y} width={TW} height={TH} rx="3" fill={fondo} />
      <rect x={x} y={y} width="19" height={TH} rx="3" fill={color} />
      <rect x={x + 15} y={y} width="4" height={TH} fill={color} />
      <rect x={x + 1} y={y + 0.8} width="16" height=".8" rx=".4" fill="#fff" opacity=".3" />
      <text x={x + 9.5} y={y + 17} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">
        {n}
      </text>
      <text x={x + 23} y={y + 8.6} fontSize="5.5" fontWeight="800" fill={color} letterSpacing={espaciado}>
        {etiqueta}
      </text>
    </>
  )
}

/** Mesa de pool del salón, vista de frente y cortada por el borde (`cx` su centro). */
function MesaSalon({ cx, u, bolas }: { cx: number; u: (n: string) => string; bolas: [number, number, string][] }) {
  const p = (pts: [number, number][]) => poli(pts.map(([x, y]) => [cx + x, y]))
  return (
    <>
      <ellipse cx={cx} cy="149" rx="70" ry="5" fill="#000" opacity=".35" />
      <path d={p([[-56, 139], [56, 139], [58, 152], [-58, 152]])} fill={u('fa')} />
      <path d={p([[-44, 111], [44, 111], [62, 140], [-62, 140]])} fill={u('top')} stroke="#7c4a2b" strokeWidth="1.4" strokeLinejoin="round" />
      <path d={p([[-41, 113.4], [41, 113.4], [56.6, 137.6], [-56.6, 137.6]])} fill={u('cu')} />
      <path d={p([[-38.6, 115.6], [38.6, 115.6], [52.4, 135.4], [-52.4, 135.4]])} fill={u('pn')} />
      {(
        [
          [-39.5, 115],
          [39.5, 115],
          [0, 114.6],
        ] as [number, number][]
      ).map(([x, y]) => (
        <ellipse key={x} cx={cx + x} cy={y} rx="2.6" ry="1.5" fill="#06231c" />
      ))}
      {bolas.map(([x, y, c]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={cx + x + 0.8} cy={y + 2} rx="3" ry="1.2" fill="#03140f" opacity=".35" />
          <circle cx={cx + x} cy={y} r="2.8" fill={u(c)} />
          <circle cx={cx + x - 0.8} cy={y - 1} r=".7" fill="#fff" opacity=".8" />
        </g>
      ))}
    </>
  )
}

/**
 * El salón de noche: pared oscura, dos mesas de pool con su lámpara y, colgada al medio, la
 * tele con el tablero para los jugadores. Mesa 1 libre (verde), Mesa 2 en juego con el tiempo
 * corriendo, Mesa 3 de tiempo fijo con la cuenta regresiva y Mesa 4 reservada para las 22:00.
 * A la Mesa 3 le quedan 9 min y bajan; con 5 min (27 %) la casilla parpadea en ámbar, y al
 * llegar a 0:00 (60 %) pasa a «Tiempo cumplido» en rojo con un destello. Al final se reinicia.
 * Sin aviso: taparía la tele, que es la protagonista.
 */
export function EscenaFnPantallaSalon() {
  const { g, u } = useIds()
  const m3 = TILES[2]
  const cuenta = minutos('0:0', 9, 10, true)

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#13221d" />
            <stop offset="1" stopColor="#0b1512" />
          </linearGradient>
          <radialGradient id={g('gl')} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#7dd3fc" stopOpacity=".22" />
            <stop offset="1" stopColor="#7dd3fc" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('pn')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3cc488" />
            <stop offset="1" stopColor="#1a7a52" />
          </linearGradient>
          <linearGradient id={g('cu')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a7d58" />
            <stop offset="1" stopColor="#0f5139" />
          </linearGradient>
          <linearGradient id={g('top')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a8693d" />
            <stop offset="1" stopColor="#6b3a1f" />
          </linearGradient>
          <linearGradient id={g('fa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a3019" />
            <stop offset="1" stopColor="#3a1d0e" />
          </linearGradient>
          <linearGradient id={g('co')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2b0" stopOpacity=".3" />
            <stop offset="1" stopColor="#fff2b0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('lp')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b8a80" />
            <stop offset="1" stopColor="#0d4d4a" />
          </linearGradient>
          <linearGradient id={g('tv')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0f172a" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <linearGradient id={g('cm')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f43f5e" />
            <stop offset="1" stopColor="#be123c" />
          </linearGradient>
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

        {/* ---------- la pared (se estira fuera del viewBox para llenar el marco) ---------- */}
        <rect x="-40" y="-20" width="400" height="190" fill={u('pa')} />
        <rect x="-40" y="94" width="400" height="20" fill="#1a120c" opacity=".7" />
        <rect x="-40" y="94" width="400" height=".9" fill="#7c4a2b" opacity=".6" />
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={-34 + i * 28} y="96" width=".7" height="17" fill="#000" opacity=".4" />
        ))}

        {/* resplandor de la tele en la pared */}
        <ellipse cx="160" cy="48" rx="120" ry="52" fill={u('gl')} />

        {/* ---------- lámparas de las mesas ---------- */}
        {[40, 280].map((x) => (
          <g key={x}>
            <rect x={x - 0.5} y="-6" width="1" height="62" fill="#334155" />
            <path d={`M${x - 14} 61H${x + 14}L${x + 46} 128H${x - 46}Z`} fill={u('co')} />
            <path d={`M${x - 15} 62L${x - 9} 54H${x + 9}L${x + 15} 62Z`} fill={u('lp')} />
            <rect x={x - 15} y="61.4" width="30" height="1.4" rx=".7" fill="#062b28" />
            <ellipse cx={x} cy="63.2" rx="8" ry="1.6" fill="#fff7c2" opacity=".55" />
          </g>
        ))}

        {/* ---------- la tele, colgada ---------- */}
        {[120, 200].map((x) => (
          <rect key={x} x={x - 1} y="-4" width="2" height="12" fill="#334155" />
        ))}
        <rect x="80" y="10.5" width="164" height="78" rx="4" fill="#000" opacity=".45" />
        <rect x="78" y="8" width="164" height="78" rx="4" fill="#111827" />
        <rect x="80" y="8.6" width="160" height=".9" rx=".45" fill="#fff" opacity=".18" />
        <rect x="82" y="12" width="156" height="70" rx="1.6" fill={u('tv')} />

        <text x="87" y="21.6" fontSize="6" fontWeight="800" fill="#fff" letterSpacing=".8">
          MESAS
        </text>
        <text x="233" y="21.6" textAnchor="end" fontSize="6" fontWeight="800" fill="#94a3b8">
          21:40
        </text>

        {/* Mesa 1: libre */}
        <CasillaTv x={TILES[0].x} y={TILES[0].y} n={1} color={ESTADO.libre.tv} etiqueta="LIBRE" />
        <text x={TILES[0].x + 23} y={TILES[0].y + 19.4} fontSize="7" fontWeight="800" fill="#e2e8f0">
          Disponible
        </text>

        {/* Mesa 2: en juego, el tiempo corre */}
        <CasillaTv x={TILES[1].x} y={TILES[1].y} n={2} color={ESTADO.ocupada.tv} etiqueta="EN JUEGO" />
        <Rodillo g={g} u={u} nombre="t2" x={TILES[1].x + 23} y={TILES[1].y + 20} ancho={26} tam={9} anchor="start" fill="#fff" valores={minutos('1:2', 0, 10)} clase="esc-bs-rueda" />

        {/* Mesa 3: tiempo fijo → últimos 5 min en ámbar → tiempo cumplido */}
        <CasillaTv x={m3.x} y={m3.y} n={3} color={ESTADO.fijo.tv} etiqueta="TIEMPO FIJO" />
        <g className="esc-bs-p-ambar" style={{ opacity: 0 }}>
          <CasillaTv x={m3.x} y={m3.y} n={3} color={ESTADO.pausada.tv} etiqueta="ÚLTIMOS 5 MIN" fondo="#4a3410" espaciado={0} />
        </g>
        <Rodillo g={g} u={u} nombre="t3" x={m3.x + 23} y={m3.y + 20} ancho={22} tam={9} anchor="start" fill="#fff" valores={cuenta} clase="esc-bs-p-cuenta" />
        <text x={m3.x + 44} y={m3.y + 20} fontSize="5.5" fontWeight="700" fill="#94a3b8">
          quedan
        </text>
        <g className="esc-bs-p-cumplido" style={{ opacity: 0 }}>
          <rect x={m3.x} y={m3.y} width={TW} height={TH} rx="3" fill={u('cm')} />
          <rect x={m3.x} y={m3.y} width="19" height={TH} rx="3" fill="#9f1239" />
          <rect x={m3.x + 15} y={m3.y} width="4" height={TH} fill="#9f1239" />
          <text x={m3.x + 9.5} y={m3.y + 17} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">
            3
          </text>
          <text x={m3.x + 23} y={m3.y + 10.6} fontSize="6.8" fontWeight="800" fill="#fff">
            Tiempo
          </text>
          <text x={m3.x + 23} y={m3.y + 19.4} fontSize="6.8" fontWeight="800" fill="#fff">
            cumplido
          </text>
        </g>
        <rect className="esc-bs-p-aro" x={m3.x - 1.2} y={m3.y - 1.2} width={TW + 2.4} height={TH + 2.4} rx="4" fill="none" stroke="#fb7185" strokeWidth="1.4" style={{ opacity: 0 }} />

        {/* Mesa 4: reservada */}
        <CasillaTv x={TILES[3].x} y={TILES[3].y} n={4} color={ESTADO.reservada.tv} etiqueta="RESERVADA" />
        <text x={TILES[3].x + 23} y={TILES[3].y + 20} fontSize="9" fontWeight="800" fill="#fff">
          22:00
        </text>

        {/* ---------- las mesas del salón ---------- */}
        <MesaSalon
          cx={40}
          u={u}
          bolas={[
            [-14, 128, 'bb'],
            [12, 121, 'br'],
            [20, 126, 'ba'],
          ]}
        />
        <MesaSalon
          cx={280}
          u={u}
          bolas={[
            [-18, 124, 'bz'],
            [6, 129, 'bb'],
            [16, 120, 'br'],
          ]}
        />
        {/* un taco apoyado sobre la mesa de la derecha */}
        <path d="M222 132L300 118" stroke="#e8c08a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M222 132L240 128.8" stroke="#3f1c10" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Marco>
  )
}
