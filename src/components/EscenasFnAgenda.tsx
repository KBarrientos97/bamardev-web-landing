import './EscenasFnAgenda.css'
import { useId, type ReactNode } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de la agenda, una por rubro de belleza (antes todos usaban la del
  espejo de la peluquería): la barbería con su cola de los que llegan sin turno, el spa con
  cabina y terapeuta reservadas a la vez, las uñas reservadas desde el celular, la reserva
  online genérica con anticipo por QR y las comisiones y propinas de cada profesional.

  Mismo lenguaje que las de «Funciones»: viewBox 320 × 150, plataforma con sombra de
  contacto, luz arriba-izquierda, degradés con useId y sólo transform/opacity con CSS (los
  keyframes `esc-ag-*` viven en EscenasFnAgenda.css). Ciclo maestro de 6,5 s: el <Aviso>
  asoma al 10 % y lo que lo «causa» (el turno que cae en la agenda, la comisión que sube)
  pasa justo antes. Nunca uso `transform=""` en un elemento animado: las posiciones van
  absolutas o en un <g> padre.

  El aviso tapa la franja de arriba (y < 50) del lado donde nace: ahí sólo va lo que ya se
  entendió antes (el celular ya usado, encabezados), nunca lo que está cambiando.
*/

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
      <ellipse cx="160" cy="137" rx="148" ry="12" fill={borde} />
      <ellipse cx="160" cy="133" rx="148" ry="12" fill={`url(#${id}pt)`} />
      <ellipse cx="160" cy="130.5" rx="124" ry="7" fill="#fff" opacity=".35" />
      <ellipse cx="160" cy="134" rx="122" ry="8" fill={sombra} opacity=".06" />
    </>
  )
}

/** Sombra de contacto: una ancha y difusa + otra chica y más oscura. */
function Contacto({ cx, cy = 133, rx, color }: { cx: number; cy?: number; rx: number; color: string }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry="6.5" fill={color} opacity=".06" />
      <ellipse cx={cx} cy={cy} rx={rx * 0.72} ry="3.6" fill={color} opacity=".15" />
    </>
  )
}

/** Avatar genérico (cabeza y hombros blancos sobre un círculo de color). */
function Avatar({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx} cy={cy - r * 0.24} r={r * 0.36} fill="#fff" opacity=".93" />
      <path d={`M${cx - r * 0.6} ${cy + r * 0.64}a${r * 0.6} ${r * 0.52} 0 0 1 ${r * 1.2} 0Z`} fill="#fff" opacity=".93" />
    </>
  )
}

/** Turno de la agenda: bloque con franja de color a la izquierda, título y una línea chica. */
function Turno({
  x,
  y,
  w,
  h,
  fondo,
  franja,
  titulo,
  sub,
  tinta = '#fff',
  tam = 6,
}: {
  x: number
  y: number
  w: number
  h: number
  fondo: string
  franja: string
  titulo: string
  sub?: string
  tinta?: string
  /** Tamaño del título (los largos, como «Corte + barba», van un punto más chico). */
  tam?: number
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={fondo} />
      <rect x={x} y={y} width="2.6" height={h} rx="1.3" fill={franja} />
      <text x={x + 5.5} y={y + 7.4} fontSize={tam} fontWeight="800" fill={tinta}>
        {titulo}
      </text>
      {sub && (
        <text x={x + 5.5} y={y + 14} fontSize="5.5" fontWeight="600" fill={tinta} opacity=".78">
          {sub}
        </text>
      )}
    </>
  )
}

/** Hueco libre de la agenda: borde punteado y «Libre». */
function Hueco({ x, y, w, h, color, clase }: { x: number; y: number; w: number; h: number; color: string; clase: string }) {
  return (
    <g className={clase}>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={color} fillOpacity=".08" stroke={color} strokeWidth=".9" strokeDasharray="2.4 1.6" />
      <text x={x + w / 2} y={y + h / 2 + 2} textAnchor="middle" fontSize="5.5" fontWeight="700" fill={color}>
        Libre
      </text>
    </g>
  )
}

/** Celular con su pantalla (los degradés `ph` y `pn` los pone cada escena); el contenido va adentro. */
function Celular({ x, y, w, h, u, children }: { x: number; y: number; w: number; h: number; u: (n: string) => string; children: ReactNode }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={u('ph')} />
      <rect x={x + 0.7} y={y + 12} width="1.4" height={h - 30} rx=".7" fill="#fff" opacity=".22" />
      <rect x={x + w - 0.6} y={y + 28} width="1.8" height="14" rx=".9" fill="#1e293b" />
      <rect x={x + 3.5} y={y + 3.5} width={w - 7} height={h - 7} rx="7.5" fill={u('pn')} />
      <rect x={x + w / 2 - 8} y={y + 6.2} width="16" height="3.6" rx="1.8" fill="#0f172a" />
      {children}
    </>
  )
}

/** Degradés del celular (cuerpo oscuro y pantalla clara), comunes a las escenas que lo usan. */
function DefsCelular({ g, pantalla }: { g: (n: string) => string; pantalla: string }) {
  return (
    <>
      <linearGradient id={g('ph')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3f4e68" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id={g('pn')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor={pantalla} />
      </linearGradient>
    </>
  )
}

/** Ícono de calendario para los avisos. */
const ICONO_CALENDARIO = (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.2" y="4.5" width="13.6" height="12.3" rx="2.2" />
    <path d="M3.2 8.6h13.6M7 2.8v3.2M13 2.8v3.2" />
  </svg>
)

/** Toque del dedo en la pantalla: círculo translúcido con aro. */
function Dedo({ cx, cy, aro }: { cx: number; cy: number; aro: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="5" fill="#fff" opacity=".55" />
      <circle cx={cx} cy={cy} r="5" fill="none" stroke={aro} strokeWidth="1.1" opacity=".6" />
      <circle cx={cx} cy={cy} r="1.8" fill={aro} opacity=".45" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  1 · BARBERÍA: agenda por barbero + cola sin turno                  */
/* ------------------------------------------------------------------ */

/**
 * Piso en damero con perspectiva (punto de fuga arriba, al centro): un solo trazo con las
 * baldosas oscuras; las claras son el fondo.
 */
function damero() {
  const ys = [124, 128.5, 134, 141, 150, 161]
  const fuga = 60
  const x = (k: number, y: number) => (160 + (k * 16 * (y - fuga)) / (124 - fuga)).toFixed(1)
  let d = ''
  for (let j = 0; j < ys.length - 1; j++) {
    for (let k = -15; k < 15; k++) {
      if ((((j + k) % 2) + 2) % 2 !== 0) continue
      const [a, b] = [ys[j], ys[j + 1]]
      d += `M${x(k, a)} ${a}L${x(k + 1, a)} ${a}L${x(k + 1, b)} ${b}L${x(k, b)} ${b}Z`
    }
  }
  return d
}
const DAMERO = damero()

/** Filas de la agenda de la barbería: arriba de cada una y su hora. */
const FILAS_BB = [
  { y: 31, h: '15:30' },
  { y: 50.5, h: '16:00' },
  { y: 70, h: '16:30' },
  { y: 89.5, h: '17:00' },
]
const ALTO_BB = 19.5
/** Columnas (x, ancho) de Barbero 1 y Barbero 2. */
const COLS_BB = [
  { x: 79, w: 48 },
  { x: 130, w: 48 },
]
/** Colores de los turnos: rojo, azul y crema del poste. */
const ROJO = { fondo: '#b83a44', franja: '#e8707a' }
const AZUL = { fondo: '#2f5aa8', franja: '#6f97e0' }
const CREMA = { fondo: '#efe3cf', franja: '#c9a86f', tinta: '#3a2a1f' }

/** Colores de las fichas de la cola (cuatro personas que van pasando). */
const FICHAS = ['#d9a43c', '#5b8bd6', '#c45a62', '#6aa585']

/**
 * Una barbería de verdad: pared de madera oscura con poste giratorio, piso en damero y
 * sillón de cuero. En la pizarra, la agenda de cada barbero; en el hueco de las 16:30 del
 * Barbero 2 cae el turno «Corte + barba» (aviso). A la derecha, el tablero «Sin turno»:
 * cada ciclo el primero pasa al sillón y la cola avanza un lugar (entra uno nuevo atrás).
 */
export function EscenaFnAgendaBarberia() {
  const { g, u } = useIds()
  // Franjas del poste: bandas de 10 de alto (rojo, blanco, azul en ciclo de 30) inclinadas.
  const colores = ['#d6404c', '#f8f4ec', '#2f5aa8']
  const bandas = Array.from({ length: 12 }, (_, k) => {
    const y0 = 14 + 10 * k
    return { d: `M18 ${y0}L32 ${y0 - 8}V${y0 + 2}L18 ${y0 + 10}Z`, c: colores[k % 3] }
  })

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-stone-800 via-stone-800 to-stone-700">
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3d2e25" />
            <stop offset="1" stopColor="#2a1f19" />
          </linearGradient>
          <radialGradient id={g('lz')} cx="0.12" cy="0" r="0.9">
            <stop offset="0" stopColor="#ffdcaa" stopOpacity=".34" />
            <stop offset=".55" stopColor="#ffdcaa" stopOpacity=".08" />
            <stop offset="1" stopColor="#ffdcaa" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('pi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14100d" stopOpacity=".7" />
            <stop offset=".6" stopColor="#14100d" stopOpacity=".1" />
            <stop offset="1" stopColor="#14100d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('mf')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8a5f3c" />
            <stop offset="1" stopColor="#5a3b24" />
          </linearGradient>
          <linearGradient id={g('pz')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#262220" />
            <stop offset="1" stopColor="#1a1715" />
          </linearGradient>
          <linearGradient id={g('cr')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7d8796" />
            <stop offset=".35" stopColor="#f2f4f7" />
            <stop offset=".7" stopColor="#aab3c0" />
            <stop offset="1" stopColor="#636d7c" />
          </linearGradient>
          <linearGradient id={g('cu')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c8424d" />
            <stop offset="1" stopColor="#6e1a22" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity=".28" />
            <stop offset=".25" stopColor="#fff" stopOpacity=".35" />
            <stop offset=".45" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".3" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <rect x="18" y="26" width="14" height="56" rx="1.5" />
          </clipPath>
        </defs>

        {/* ---------- pared de madera (se estira fuera del viewBox para llenar el marco) ---------- */}
        <rect x="-40" y="-20" width="400" height="146" fill={u('pa')} />
        {Array.from({ length: 21 }, (_, i) => (
          <rect key={i} x={-40 + i * 20} y="-20" width=".8" height="144" fill="#1c1410" opacity=".55" />
        ))}
        {[0, 3, 7, 12, 16].map((i) => (
          <rect key={i} x={-39 + i * 20} y="-20" width="19" height="144" fill="#4a382c" opacity=".22" />
        ))}
        <rect x="-40" y="-20" width="400" height="146" fill={u('lz')} />
        {/* zócalo */}
        <rect x="-40" y="116" width="400" height="9" fill="#1d1511" />
        <rect x="-40" y="116" width="400" height="1.2" fill="#6b4a33" opacity=".7" />

        {/* ---------- piso en damero ---------- */}
        <rect x="-40" y="124" width="400" height="40" fill="#d9cfbf" />
        <path d={DAMERO} fill="#2c2420" />
        <rect x="-40" y="124" width="400" height="40" fill={u('pi')} />

        {/* ---------- poste giratorio y repisa con máquina y navaja ---------- */}
        <rect x="35" y="50" width="11" height="3" rx="1.2" fill="#8d97a6" />
        <rect x="16" y="20" width="18" height="6" rx="2.2" fill={u('cr')} />
        <path d="M18.5 20Q25 10 31.5 20Z" fill={u('cr')} />
        <circle cx="25" cy="12.6" r="1.8" fill="#c0c7d2" />
        <g clipPath={u('cv')}>
          <rect x="18" y="26" width="14" height="56" fill="#f8f4ec" />
          <g className="esc-ag-poste">
            {bandas.map((b, i) => (
              <path key={i} d={b.d} fill={b.c} />
            ))}
          </g>
          <rect x="18" y="26" width="14" height="56" fill={u('vi')} />
        </g>
        <rect x="16" y="82" width="18" height="6" rx="2.2" fill={u('cr')} />
        <path d="M19 88L22 92H28L31 88Z" fill="#8d97a6" />
        <rect x="20.2" y="29" width="1.4" height="50" rx=".7" fill="#fff" opacity=".5" />

        <rect x="7" y="104.5" width="36" height="3.4" rx="1.4" fill="#1d1511" />
        <rect x="7" y="103" width="36" height="3" rx="1.4" fill={u('mf')} />
        {/* máquina de cortar */}
        <rect x="12" y="88" width="9" height="15" rx="3" fill="#1b1b1e" />
        <rect x="12.8" y="89" width="1.6" height="12" rx=".8" fill="#fff" opacity=".18" />
        <rect x="11.6" y="85.4" width="9.8" height="3.6" rx="1" fill={u('cr')} />
        <path d="M12 86.2h9M12 87.6h9" stroke="#4b5563" strokeWidth=".4" />
        <circle cx="16.5" cy="96" r="1.2" fill="#d9a43c" />
        {/* navaja cerrada */}
        <rect x="25" y="99.4" width="15" height="3.6" rx="1.8" fill="#151311" />
        <path d="M26 99.6L38.5 97.2L39.6 99.4Z" fill={u('cr')} />
        <circle cx="26.8" cy="101.2" r=".9" fill="#d9a43c" />

        {/* ---------- pizarra de la agenda ---------- */}
        <rect x="48.5" y="15" width="138" height="103" rx="5" fill="#0d0907" opacity=".45" />
        <rect x="46" y="12" width="138" height="103" rx="5" fill={u('mf')} />
        <rect x="47" y="12.8" width="136" height="1" rx=".5" fill="#fff" opacity=".22" />
        <rect x="50" y="16" width="130" height="95" rx="3" fill={u('pz')} />
        {/* encabezados */}
        {COLS_BB.map((c, i) => (
          <g key={c.x}>
            <circle cx={c.x + 7} cy="23.4" r="3.4" fill={i === 0 ? '#d6404c' : '#5b8bd6'} />
            <text x={c.x + 13} y="25.6" fontSize="6" fontWeight="800" fill="#f3e9d8">
              Barbero {i + 1}
            </text>
          </g>
        ))}
        <rect x="52" y="29.4" width="126" height=".7" fill="#f3e9d8" opacity=".2" />
        {/* horas y renglones */}
        {FILAS_BB.map((f) => (
          <g key={f.h}>
            <text x="53" y={f.y + 7} fontSize="5.5" fontWeight="700" fill="#f3e9d8" opacity=".62">
              {f.h}
            </text>
            <rect x="77" y={f.y} width="101" height=".5" fill="#f3e9d8" opacity=".12" />
          </g>
        ))}
        <rect x="128.2" y="31" width=".5" height="78" fill="#f3e9d8" opacity=".12" />

        {/* turnos que ya estaban */}
        <Turno x={80.2} y={32.2} w={45.6} h={ALTO_BB * 2 - 2.4} {...ROJO} titulo="Corte" sub="60 min" />
        <Turno x={80.2} y={90.7} w={45.6} h={ALTO_BB - 2.4} {...CREMA} titulo="Barba" sub="30 min" />
        <Turno x={131.2} y={32.2} w={45.6} h={ALTO_BB - 2.4} {...AZUL} titulo="Degradé" sub="30 min" />
        <Turno x={131.2} y={51.7} w={45.6} h={ALTO_BB - 2.4} {...CREMA} titulo="Barba" sub="30 min" />
        <Turno x={131.2} y={90.7} w={45.6} h={ALTO_BB - 2.4} {...ROJO} titulo="Corte" sub="45 min" />

        {/* hueco de las 16:30 y el turno nuevo que cae ahí */}
        <Hueco x={131.2} y={71.2} w={45.6} h={ALTO_BB - 2.4} color="#e8c88f" clase="esc-ag-bb-hueco" />
        <rect className="esc-ag-bb-aro" x="131.2" y="71.2" width="45.6" height={ALTO_BB - 2.4} rx="3.5" fill="none" stroke="#f2cf72" strokeWidth="1.4" />
        <g className="esc-ag-bb-turno">
          <rect x="132.2" y="73" width="45.6" height={ALTO_BB - 2.4} rx="3" fill="#000" opacity=".35" />
          <Turno x={131.2} y={71.2} w={45.6} h={ALTO_BB - 2.4} fondo="#d9a43c" franja="#fbe3a6" tinta="#2a1a0c" titulo="Corte + barba" tam={5.5} sub="16:30 · nuevo" />
        </g>

        {/* línea de «ahora» */}
        <rect x="77" y="60" width="101" height=".8" fill="#ef4444" opacity=".85" />
        <circle className="esc-ag-led" cx="77" cy="60.4" r="1.8" fill="#ef4444" />

        {/* ---------- sillón de barbero ---------- */}
        <ellipse cx="219" cy="132" rx="26" ry="4" fill="#000" opacity=".35" />
        <ellipse cx="219" cy="131" rx="15" ry="3.2" fill={u('cr')} />
        <path d="M214.5 130L216 112H222L223.5 130Z" fill={u('cr')} />
        <rect x="203" y="113" width="32" height="2.6" rx="1.3" fill={u('cr')} />
        {/* respaldo y apoyacabeza */}
        <rect x="217.4" y="56" width="3.2" height="8" fill="#8d97a6" />
        <rect x="210" y="51" width="18" height="7" rx="3.5" fill={u('cu')} />
        <rect x="203" y="63" width="32" height="36" rx="7" fill={u('cu')} />
        <path d="M213.5 66V96M224.5 66V96" stroke="#5a141b" strokeWidth=".8" opacity=".7" />
        <rect x="205.5" y="65" width="2" height="30" rx="1" fill="#fff" opacity=".18" />
        {/* asiento y apoyabrazos */}
        <rect x="198" y="97" width="42" height="13" rx="5.5" fill={u('cu')} />
        <rect x="200" y="98.2" width="36" height="1.6" rx=".8" fill="#fff" opacity=".22" />
        <rect x="193" y="88" width="11" height="5" rx="2.5" fill="#6e1a22" />
        <rect x="234" y="88" width="11" height="5" rx="2.5" fill="#6e1a22" />
        <rect x="196.5" y="93" width="2" height="6" fill="#8d97a6" />
        <rect x="239.5" y="93" width="2" height="6" fill="#8d97a6" />

        {/* ---------- tablero «Sin turno» ---------- */}
        <rect x="254.5" y="56.5" width="56" height="64" rx="4" fill="#0d0907" opacity=".45" />
        <rect x="252" y="54" width="56" height="64" rx="4" fill={u('mf')} />
        <rect x="254.5" y="56.5" width="51" height="59" rx="2.5" fill="#1d1916" />
        <rect x="254.5" y="56.5" width="51" height="10.5" rx="2.5" fill="#b83a44" />
        <rect x="254.5" y="64" width="51" height="3" fill="#b83a44" />
        <text x="280" y="63.9" textAnchor="middle" fontSize="5.8" fontWeight="800" letterSpacing=".5" fill="#fff">
          SIN TURNO
        </text>
        {/* el primero de la cola: flecha hacia el sillón */}
        <path className="esc-ag-bb-flecha" d="M249.5 75.5L246 73.3V77.7Z" fill="#f2cf72" />
        {FICHAS.map((c, i) => (
          <g
            key={c}
            className="esc-ag-bb-ficha"
            style={v({ animationDelay: i === 0 ? '0s' : `${-6.5 * i}s`, '--y0': `${[42, 30, 15, 0][i]}px`, '--o0': i === 0 ? '0' : '1' })}
          >
            <rect x="257" y="69.5" width="46" height="12.5" rx="3.5" fill="#f3e9d8" />
            <Avatar cx={263.5} cy={75.75} r={4.2} color={c} />
            <rect x="270.5" y="72.6" width="20" height="2.4" rx="1.2" fill="#6b5a4b" />
            <rect x="270.5" y="77" width="12" height="2.2" rx="1.1" fill="#b5a48f" />
          </g>
        ))}
      </svg>
      <Aviso etiqueta="Turno 16:30" texto="Corte + barba" tono="ambar" icono={ICONO_CALENDARIO} />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  2 · SPA: cabina y terapeuta a la vez                               */
/* ------------------------------------------------------------------ */

/** x de una hora (15 a 18) en la línea de tiempo del spa. */
const xSpa = (h: number) => 110 + (h - 15) * 45.33
/** Carriles del spa: [y, etiqueta, tipo]. */
const CARRILES = [
  { y: 33, t: 'Cabina 1', cab: true },
  { y: 52, t: 'Cabina 2', cab: true },
  { y: 76, t: 'Terapeuta 1', cab: false },
  { y: 95, t: 'Terapeuta 2', cab: false },
]

/** Ícono de camilla (cabina) centrado en (cx, cy). */
function Camilla({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g fill="#fff">
      <rect x={cx - 3.4} y={cy - 0.2} width="6.8" height="1.6" rx=".6" />
      <circle cx={cx - 2.2} cy={cy - 1.6} r="1.1" />
      <rect x={cx - 3} y={cy + 1.2} width=".8" height="1.8" />
      <rect x={cx + 2.2} y={cy + 1.2} width=".8" height="1.8" />
    </g>
  )
}

/** Vela con llama que titila y su halo. */
function Vela({ x, y, w, h, g, u, retraso }: { x: number; y: number; w: number; h: number; g: (n: string) => string; u: (n: string) => string; retraso: string }) {
  const cx = x + w / 2
  return (
    <>
      <circle className="esc-ag-sp-halo" style={{ animationDelay: retraso }} cx={cx} cy={y - 6} r="13" fill={u('hv')} />
      <rect x={x} y={y} width={w} height={h} rx="2.5" fill={u('ce')} />
      <ellipse cx={cx} cy={y + 0.6} rx={w / 2} ry="1.6" fill="#fffaf0" />
      <rect x={x} y={y + h * 0.55} width={w} height="3" fill="#b9a6e3" opacity=".8" />
      <rect x={x + 1.4} y={y + 3} width="1.6" height={h - 6} rx=".8" fill="#fff" opacity=".6" />
      <rect x={cx - 0.35} y={y - 3} width=".7" height="3" fill="#4b3a2a" />
      <g className="esc-ag-sp-llama" style={{ animationDelay: retraso }}>
        <path d={`M${cx} ${y - 11}C${cx + 3.2} ${y - 6.5} ${cx + 2.6} ${y - 2.6} ${cx} ${y - 2.6}C${cx - 2.6} ${y - 2.6} ${cx - 3.2} ${y - 6.5} ${cx} ${y - 11}Z`} fill={u('fl')} />
        <ellipse cx={cx} cy={y - 4.6} rx=".9" ry="1.5" fill="#fff" opacity=".8" />
      </g>
      <defs>
        <radialGradient id={g('hv')}>
          <stop offset="0" stopColor="#ffe9b0" stopOpacity=".75" />
          <stop offset="1" stopColor="#ffe9b0" stopOpacity="0" />
        </radialGradient>
      </defs>
    </>
  )
}

/**
 * Spa en lavanda y verde salvia: velas que titilan y piedras apiladas a los costados. La agenda
 * tiene un carril por cabina y otro por terapeuta: el masaje de 60 min se reserva en la Cabina 2
 * y la Terapeuta 1 a la vez (dos bloques unidos por un eslabón) y llega el aviso. Más tarde otro
 * masaje intenta la Terapeuta 1 a las 16:30: se pone rojo, tiembla y se va (sin choques).
 */
export function EscenaFnAgendaSpa() {
  const { id, g, u } = useIds()
  const x16 = xSpa(16)
  const x17 = xSpa(17)
  const fant = { x: xSpa(16.5), w: 45.33 }
  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-violet-100 via-emerald-50 to-white">
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('cd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f5f2fc" />
          </linearGradient>
          <linearGradient id={g('ms')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7c5cd6" />
          </linearGradient>
          <linearGradient id={g('ce')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="1" stopColor="#e9dfcc" />
          </linearGradient>
          <linearGradient id={g('fl')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd56b" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id={g('p1')} cx=".35" cy=".28" r=".85">
            <stop offset="0" stopColor="#d6dedb" />
            <stop offset="1" stopColor="#7f9194" />
          </radialGradient>
          <radialGradient id={g('p2')} cx=".35" cy=".28" r=".85">
            <stop offset="0" stopColor="#ece1d3" />
            <stop offset="1" stopColor="#a8977f" />
          </radialGradient>
          <radialGradient id={g('p3')} cx=".35" cy=".28" r=".85">
            <stop offset="0" stopColor="#e3dcf2" />
            <stop offset="1" stopColor="#968bb4" />
          </radialGradient>
          <clipPath id={g('cc')}>
            <rect x="60" y="14" width="198" height="106" rx="10" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#cbbfe6" luz={['#f6f3fd', '#dfd8f1']} sombra="#3b2a63" />
        <Contacto cx={159} rx={70} color="#3b2a63" />
        <Contacto cx={35} cy={131} rx={24} color="#3b2a63" />
        <Contacto cx={286} cy={131} rx={24} color="#3b2a63" />

        {/* ---------- secundario izquierdo: piedras apiladas y ramita ---------- */}
        <path d="M46 126C46 110 49 96 54 84" stroke="#7fa58d" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        {[
          [52.6, 90, 3.4],
          [48.8, 98, 3.8],
          [53.4, 104, 3.4],
          [47.6, 111, 3.8],
        ].map(([cx, cy, r]) => (
          <ellipse key={cy} cx={cx} cy={cy} rx={r} ry={r * 0.72} fill={cy % 2 ? '#a3c4ad' : '#8bb398'} />
        ))}
        <ellipse cx="35" cy="125" rx="19" ry="6.8" fill={u('p1')} />
        <ellipse cx="36" cy="115.5" rx="13.5" ry="5.2" fill={u('p2')} />
        <ellipse cx="35" cy="107.6" rx="9" ry="4" fill={u('p3')} />
        <ellipse cx="31" cy="105.8" rx="3.6" ry="1.2" fill="#fff" opacity=".55" />
        <ellipse cx="30" cy="113.6" rx="5" ry="1.4" fill="#fff" opacity=".45" />

        {/* ---------- secundario derecho: velas ---------- */}
        <Vela x={268} y={98} w={15} h={31} g={(n) => g(`a${n}`)} u={(n) => (n === 'hv' ? u('ahv') : u(n))} retraso="0s" />
        <Vela x={287} y={110} w={13} h={19} g={(n) => g(`b${n}`)} u={(n) => (n === 'hv' ? u('bhv') : u(n))} retraso="-0.7s" />

        {/* ---------- la agenda ---------- */}
        <rect x="63.5" y="17.5" width="198" height="106" rx="10" fill="#d7cdee" />
        <rect x="60" y="14" width="198" height="106" rx="10" fill={u('cd')} />
        <g clipPath={u('cc')}>
          <rect x="60" y="14" width="198" height="16" fill="#efe9fb" />
        </g>
        <text x="67" y="25" fontSize="6.5" fontWeight="800" fill="#4c3a7a">
          Hoy
        </text>
        {[15, 16, 17].map((h) => (
          <text key={h} x={xSpa(h) + 1.5} y="25" fontSize="5.5" fontWeight="700" fill="#7c6aa8">
            {h}:00
          </text>
        ))}
        {/* cuadrícula: horas enteras y medias */}
        {[15, 16, 17, 18].map((h) => (
          <rect key={h} x={xSpa(h) - 0.25} y="31" width=".5" height="82" fill="#e4dcf5" />
        ))}
        {[15.5, 16.5, 17.5].map((h) => (
          <path key={h} d={`M${xSpa(h)} 31V113`} stroke="#ece6f8" strokeWidth=".5" strokeDasharray="1.5 1.5" />
        ))}
        <rect x="64" y="72" width="182" height=".6" fill="#e4dcf5" />
        {CARRILES.map((c) => (
          <g key={c.t}>
            <rect x="110" y={c.y} width="136" height="16" rx="3" fill="#faf8fe" />
            <circle cx="68" cy={c.y + 8} r="4.6" fill={c.cab ? '#a78bfa' : '#7fb596'} />
            {c.cab ? (
              <Camilla cx={68} cy={c.y + 8} />
            ) : (
              <>
                <circle cx="68" cy={c.y + 6.6} r="1.5" fill="#fff" />
                <path d={`M65.4 ${c.y + 11}a2.6 2.3 0 0 1 5.2 0Z`} fill="#fff" />
              </>
            )}
            <text x="75" y={c.y + 10} fontSize="5.5" fontWeight="700" fill="#4c3a7a">
              {c.t}
            </text>
          </g>
        ))}

        {/* reservas que ya estaban: cada una en una cabina y una terapeuta del mismo color */}
        <Turno x={xSpa(15) + 1} y={34} w={43.3} h={14} fondo="#8fbfa3" franja="#5e9a7a" titulo="Facial" />
        <Turno x={xSpa(15) + 1} y={96} w={43.3} h={14} fondo="#8fbfa3" franja="#5e9a7a" titulo="Facial" />
        <Turno x={x17 + 1} y={34} w={43.3} h={14} fondo="#d9b98f" franja="#b48b57" titulo="Piedras" />
        <Turno x={x17 + 1} y={96} w={43.3} h={14} fondo="#d9b98f" franja="#b48b57" titulo="Piedras" />

        {/* el masaje nuevo: cabina 2 + terapeuta 1 a la vez, unidos por el eslabón */}
        <rect className="esc-ag-sp-aro" x={x16 + 0.5} y="52.5" width="44.3" height="15" rx="3.5" fill="none" stroke="#a78bfa" strokeWidth="1.3" />
        <rect className="esc-ag-sp-aro" x={x16 + 0.5} y="76.5" width="44.3" height="15" rx="3.5" fill="none" stroke="#a78bfa" strokeWidth="1.3" />
        <g className="esc-ag-sp-masaje">
          <Turno x={x16 + 1} y={53} w={43.3} h={14} fondo={u('ms')} franja="#5b3fb8" titulo="Masaje" />
          <text x={x16 + 42} y={60.4} textAnchor="end" fontSize="5.5" fontWeight="700" fill="#fff" opacity=".85">
            60′
          </text>
        </g>
        <g className="esc-ag-sp-masaje" style={{ animationDelay: '-6.42s' }}>
          <Turno x={x16 + 1} y={77} w={43.3} h={14} fondo={u('ms')} franja="#5b3fb8" titulo="Masaje" />
          <text x={x16 + 42} y={84.4} textAnchor="end" fontSize="5.5" fontWeight="700" fill="#fff" opacity=".85">
            60′
          </text>
        </g>
        <g className="esc-ag-sp-enlace">
          {/* dos eslabones de cadena: la cabina y la terapeuta van juntas */}
          <rect x={x16 + 33.7} y="66.4" width="3.2" height="6.2" rx="1.6" fill="#fff" stroke="#7c5cd6" strokeWidth="1.1" />
          <rect x={x16 + 33.7} y="71.4" width="3.2" height="6.2" rx="1.6" fill="none" stroke="#7c5cd6" strokeWidth="1.1" />
        </g>

        {/* el intento que choca: la Terapeuta 1 ya está ocupada a las 16:30 */}
        <g className="esc-ag-sp-fantasma">
          <g className="esc-ag-sp-tiembla">
            <rect x={fant.x + 1} y="77" width={fant.w - 2} height="14" rx="3" fill="#ede7fd" fillOpacity=".85" stroke="#7c5cd6" strokeWidth=".9" strokeDasharray="2.2 1.4" />
            <g className="esc-ag-sp-rojo">
              <rect x={fant.x + 1} y="77" width={fant.w - 2} height="14" rx="3" fill="#fee2e2" fillOpacity=".92" stroke="#ef4444" strokeWidth="1" />
            </g>
            <text x={fant.x + 6} y="85.8" fontSize="6" fontWeight="800" fill="#6d4fc4">
              Masaje
            </text>
            <g className="esc-ag-sp-cruz">
              <circle cx={fant.x + fant.w - 6} cy="84" r="4" fill="#ef4444" />
              <path d={`M${fant.x + fant.w - 7.6} 82.4l3.2 3.2M${fant.x + fant.w - 4.4} 82.4l-3.2 3.2`} stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </g>
        </g>
        <g className="esc-ag-sp-globo">
          <rect x="203" y="63" width="34" height="10" rx="3" fill="#ef4444" />
          <path d="M214.3 73l3 3 3 -3Z" fill="#ef4444" />
          <text x="220" y="69.9" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
            Ocupada
          </text>
        </g>
      </svg>
      <Aviso etiqueta="Cabina 2 · Terapeuta 1" texto="Masaje 60 min" tono="violeta" icono={ICONO_CALENDARIO} />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  3 · UÑAS: la clienta reserva desde el celular                      */
/* ------------------------------------------------------------------ */

/** Frasco de esmalte: tapa negra, cuello y vidrio con el color adentro. */
function Esmalte({ x, y, w, h, color, u }: { x: number; y: number; w: number; h: number; color: string; u: (n: string) => string }) {
  const tapa = h * 0.42
  return (
    <>
      <rect x={x + w * 0.24} y={y} width={w * 0.52} height={tapa} rx="1.6" fill={u('tp')} />
      <rect x={x + w * 0.3} y={y + 1} width="1.2" height={tapa - 2} rx=".6" fill="#fff" opacity=".35" />
      <rect x={x + w * 0.18} y={y + tapa - 0.4} width={w * 0.64} height="2.4" rx=".8" fill="#e5e7eb" />
      <rect x={x} y={y + tapa + 1.6} width={w} height={h - tapa - 1.6} rx="3.4" fill={color} />
      <rect x={x} y={y + tapa + 1.6} width={w} height={h - tapa - 1.6} rx="3.4" fill={u('vd')} />
      <rect x={x + 1.6} y={y + tapa + 3.6} width="1.6" height={h - tapa - 7} rx=".8" fill="#fff" opacity=".7" />
    </>
  )
}

/**
 * Uñas en rosa y frambuesa, con frascos de esmalte. La clienta, en su celular, toca el servicio
 * («Manos»), la profesional (la 2) y la hora (16:00) y aprieta «Reservar»: la cita vuela a la
 * agenda del local y cae justo en la columna de la Prof. 2 a las 16:00 (aviso). Mientras el aviso
 * está arriba, el celular muestra la confirmación; después se limpia y vuelve a empezar.
 */
export function EscenaFnAgendaUnas() {
  const { id, g, u } = useIds()
  const filas = [
    { y: 36, h: '15:00' },
    { y: 58, h: '16:00' },
    { y: 80, h: '17:00' },
    { y: 102, h: '18:00' },
  ]
  const PROF = ['#f472b6', '#a855f7']
  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-pink-100 via-rose-50 to-white">
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <DefsCelular g={g} pantalla="#fdf2f8" />
          <linearGradient id={g('bt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ec4899" />
            <stop offset="1" stopColor="#be185d" />
          </linearGradient>
          <linearGradient id={g('cd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#fdf2f7" />
          </linearGradient>
          <linearGradient id={g('nu')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0509a" />
            <stop offset="1" stopColor="#be185d" />
          </linearGradient>
          <linearGradient id={g('tp')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3f3f46" />
            <stop offset="1" stopColor="#0f0f12" />
          </linearGradient>
          <linearGradient id={g('vd')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity=".25" />
            <stop offset=".4" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".18" />
          </linearGradient>
        </defs>

        <Plataforma id={id} borde="#f4b0cb" luz={['#fff1f7', '#fbd5e5']} sombra="#831843" />
        <Contacto cx={67} rx={40} color="#831843" />
        <Contacto cx={218} rx={92} color="#831843" />
        <Contacto cx={19} cy={131} rx={12} color="#831843" />
        <Contacto cx={117} cy={131} rx={14} color="#831843" />

        {/* ---------- esmaltes ---------- */}
        <Esmalte x={11} y={101} w={15} h={30} color="#db2777" u={u} />
        <Esmalte x={104} y={108} w={12} h={23} color="#fb7185" u={u} />
        <Esmalte x={117.5} y={113} w={11} h={18} color="#c084fc" u={u} />
        <g className="esc-ag-brillo">
          <path d="M22 108l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Z" fill="#fff" />
        </g>

        {/* ---------- el celular de la clienta ---------- */}
        <Celular x={34} y={12} w={66} h={120} u={u}>
          <text x="41" y="31" fontSize="6" fontWeight="800" fill="#831843">
            Reservá tu cita
          </text>
          <text x="41" y="40.5" fontSize="5.5" fontWeight="700" fill="#9f8a96">
            Servicio
          </text>
          {['Manos', 'Pies'].map((t, i) => (
            <g key={t}>
              <rect x={41 + i * 27} y="43" width="25" height="10" rx="5" fill="#fff" stroke="#f9c6dc" strokeWidth=".8" />
              <text x={53.5 + i * 27} y="50" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#9d174d">
                {t}
              </text>
            </g>
          ))}
          <g className="esc-ag-un-sel1">
            <rect x="41" y="43" width="25" height="10" rx="5" fill={u('bt')} />
            <text x="53.5" y="50" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
              Manos
            </text>
          </g>

          <text x="41" y="61" fontSize="5.5" fontWeight="700" fill="#9f8a96">
            Profesional
          </text>
          {PROF.map((c, i) => (
            <g key={c}>
              <rect x={41 + i * 27} y="63.5" width="25" height="16" rx="4" fill="#fff" stroke="#f9c6dc" strokeWidth=".8" />
              <Avatar cx={53.5 + i * 27} cy={69} r={3.8} color={c} />
              <text x={53.5 + i * 27} y="77.6" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#9d174d">
                Prof. {i + 1}
              </text>
            </g>
          ))}
          <g className="esc-ag-un-sel2">
            <rect x="68" y="63.5" width="25" height="16" rx="4" fill="#fce7f3" stroke="#db2777" strokeWidth="1.2" />
            <Avatar cx={80.5} cy={69} r={3.8} color={PROF[1]} />
            <text x="80.5" y="77.6" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#be185d">
              Prof. 2
            </text>
          </g>

          <text x="41" y="88" fontSize="5.5" fontWeight="700" fill="#9f8a96">
            Hora
          </text>
          {['15:00', '16:00', '17:00'].map((t, i) => (
            <g key={t}>
              <rect x={41 + i * 18} y="91" width="16.5" height="10" rx="3" fill="#fff" stroke="#f9c6dc" strokeWidth=".8" />
              <text x={49.25 + i * 18} y="98" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#9d174d">
                {t}
              </text>
            </g>
          ))}
          <g className="esc-ag-un-sel3">
            <rect x="59" y="91" width="16.5" height="10" rx="3" fill={u('bt')} />
            <text x="67.25" y="98" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
              16:00
            </text>
          </g>

          <g className="esc-ag-un-boton">
            <rect x="41" y="107" width="52" height="12" rx="6" fill={u('bt')} />
            <text x="67" y="115" textAnchor="middle" fontSize="6.2" fontWeight="800" fill="#fff">
              Reservar
            </text>
          </g>

          {/* confirmación (tapa el formulario mientras el aviso está arriba) */}
          <g className="esc-ag-un-listo">
            <rect x="37.5" y="25" width="59" height="103" rx="2" fill="#fff" />
            <rect x="37.5" y="25" width="59" height="103" rx="2" fill="#fdf2f8" opacity=".6" />
            <circle cx="67" cy="60" r="12" fill={u('bt')} />
            <path d="M61.6 60.4l3.8 3.8 7-7.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <text x="67" y="84" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#831843">
              ¡Listo!
            </text>
            <text x="67" y="94" textAnchor="middle" fontSize="5.8" fontWeight="700" fill="#9d174d">
              Manos · 16:00
            </text>
            <text x="67" y="103" textAnchor="middle" fontSize="5.5" fontWeight="600" fill="#9f8a96">
              con la Prof. 2
            </text>
          </g>

          <g className="esc-ag-un-dedo">
            <Dedo cx={53.5} cy={48} aro="#9d174d" />
          </g>
        </Celular>

        {/* ---------- la agenda del local ---------- */}
        <rect x="135.5" y="17.5" width="172" height="110" rx="10" fill="#f6c8db" />
        <rect x="132" y="14" width="172" height="110" rx="10" fill={u('cd')} />
        {PROF.map((c, i) => (
          <g key={c}>
            <Avatar cx={177 + i * 72} cy={25} r={5} color={c} />
            <text x={185 + i * 72} y="27.2" fontSize="6" fontWeight="800" fill="#831843">
              Prof. {i + 1}
            </text>
          </g>
        ))}
        <rect x="136" y="33.4" width="164" height=".7" fill="#f9d5e4" />
        {filas.map((f) => (
          <g key={f.h}>
            <text x="137" y={f.y + 7} fontSize="5.5" fontWeight="700" fill="#b4899c">
              {f.h}
            </text>
            <rect x="159" y={f.y} width="141" height=".5" fill="#f9d5e4" />
          </g>
        ))}
        <rect x="230.7" y="36" width=".5" height="86" fill="#f9d5e4" />

        <Turno x={161.5} y={37.5} w={67} h={41} fondo="#fbcfe8" franja="#ec4899" tinta="#831843" titulo="Gel" sub="2 horas" />
        <Turno x={161.5} y={103.5} w={67} h={18.5} fondo="#ede9fe" franja="#a78bfa" tinta="#5b21b6" titulo="Pies" sub="45 min" />
        <Turno x={233} y={37.5} w={66} h={19} fondo="#ede9fe" franja="#a78bfa" tinta="#5b21b6" titulo="Pies" sub="45 min" />
        <Turno x={233} y={81.5} w={66} h={19} fondo="#ffe4e6" franja="#fb7185" tinta="#9f1239" titulo="Diseño" sub="1 hora" />

        <Hueco x={233} y={59.5} w={66} h={19} color="#db2777" clase="esc-ag-hueco" />
        <rect className="esc-ag-aro" x="232" y="58.5" width="68" height="21" rx="4" fill="none" stroke="#ec4899" strokeWidth="1.4" />
        <g className="esc-ag-vuela" style={v({ '--dx': '-199px', '--dy': '45px', '--mx': '-104px', '--my': '-18px' })}>
          <rect x="234" y="61" width="66" height="19" rx="3" fill="#831843" opacity=".18" />
          <Turno x={233} y={59.5} w={66} h={19} fondo={u('nu')} franja="#fbcfe8" titulo="Manos" sub="Reservó online" />
        </g>
      </svg>
      <Aviso lado="izq" etiqueta="Nueva cita · Prof. 2" texto="Manos · 16:00" tono="rosa" icono={ICONO_CALENDARIO} />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  4 · RESERVA ONLINE con anticipo por QR                             */
/* ------------------------------------------------------------------ */

/** Módulos de un QR de mentira (9 × 9) sin los tres cuadros de las esquinas. */
const QR = [
  '000010100',
  '000001000',
  '000010100',
  '101101011',
  '010110110',
  '110011001',
  '000010110',
  '000001011',
  '000011101',
]

/** El QR dibujado en (x, y) con módulos de lado `m`. */
function CodigoQr({ x, y, m, color }: { x: number; y: number; m: number; color: string }) {
  const esquina = (cx: number, cy: number) => (
    <g key={`${cx}-${cy}`}>
      <rect x={cx} y={cy} width={m * 3} height={m * 3} rx=".8" fill={color} />
      <rect x={cx + m * 0.5} y={cy + m * 0.5} width={m * 2} height={m * 2} rx=".5" fill="#fff" />
      <rect x={cx + m} y={cy + m} width={m} height={m} fill={color} />
    </g>
  )
  return (
    <>
      {QR.flatMap((fila, j) =>
        [...fila].map((c, i) => (c === '1' ? <rect key={`${i}-${j}`} x={x + i * m} y={y + j * m} width={m} height={m} fill={color} /> : null)),
      )}
      {esquina(x, y)}
      {esquina(x + m * 6, y)}
      {esquina(x, y + m * 6)}
    </>
  )
}

/**
 * Reserva desde el enlace del local (genérica de belleza, en ciruela). En el celular: se elige el
 * servicio, después un horario libre (los ocupados están tachados), se paga el anticipo con el QR
 * y se aprieta «Reservar». El turno vuela a la agenda de la compu del local y cae en el hueco de
 * las 16:30 (aviso). Las pantallas del celular se deslizan como en una app de verdad.
 */
export function EscenaFnReservaOnline() {
  const { id, g, u } = useIds()
  const filas = [
    { y: 43, h: '16:00' },
    { y: 63, h: '16:30' },
    { y: 83, h: '17:00' },
  ]
  const PROF = ['#c026d3', '#7c3aed']
  const horas = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00']
  const ocupadas = new Set(['15:30', '16:00', '17:30', '18:30'])
  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-fuchsia-100 via-purple-50 to-white">
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <DefsCelular g={g} pantalla="#faf5ff" />
          <linearGradient id={g('bt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a855f7" />
            <stop offset="1" stopColor="#7e22ce" />
          </linearGradient>
          <linearGradient id={g('nu')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b44fd8" />
            <stop offset="1" stopColor="#7e22ce" />
          </linearGradient>
          <linearGradient id={g('lp')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#475569" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('bs')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cp')}>
            <rect x="225.5" y="35" width="57" height="93.5" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#dcb8e8" luz={['#fbf3fd', '#eed8f5']} sombra="#4a044e" />
        <Contacto cx={106} rx={96} color="#4a044e" />
        <Contacto cx={254} rx={40} color="#4a044e" />

        {/* ---------- la compu del local con la agenda ---------- */}
        <rect x="16" y="12" width="180" height="96" rx="6" fill={u('lp')} />
        <rect x="21" y="17" width="170" height="86" rx="2" fill="#fff" />
        <rect x="21" y="17" width="170" height="12" fill="#faf5ff" />
        <text x="26" y="25.4" fontSize="6" fontWeight="800" fill="#581c87">
          Agenda de hoy
        </text>
        <circle className="esc-ag-led" cx="180" cy="23" r="1.8" fill="#22c55e" />
        <text x="176.5" y="25" textAnchor="end" fontSize="5.5" fontWeight="700" fill="#16a34a">
          En línea
        </text>
        {PROF.map((c, i) => (
          <g key={c}>
            <Avatar cx={64 + i * 72} cy={35.5} r={4} color={c} />
            <text x={71 + i * 72} y="37.6" fontSize="5.8" fontWeight="800" fill="#581c87">
              Prof. {i + 1}
            </text>
          </g>
        ))}
        {filas.map((f) => (
          <g key={f.h}>
            <text x="24" y={f.y + 7} fontSize="5.5" fontWeight="700" fill="#a78bba">
              {f.h}
            </text>
            <rect x="46" y={f.y} width="143" height=".5" fill="#ede4f5" />
          </g>
        ))}
        <rect x="117.7" y="43" width=".5" height="60" fill="#ede4f5" />
        <Turno x={48.5} y={44.5} w={67} h={37} fondo="#f5d0fe" franja="#c026d3" tinta="#701a75" titulo="Tinte" sub="1 hora" />
        <Turno x={48.5} y={84.5} w={67} h={17} fondo="#ede9fe" franja="#8b5cf6" tinta="#4c1d95" titulo="Cejas" sub="30 min" />
        <Turno x={120} y={44.5} w={67} h={17} fondo="#ede9fe" franja="#8b5cf6" tinta="#4c1d95" titulo="Cejas" sub="30 min" />
        <Turno x={120} y={84.5} w={67} h={17} fondo="#f5d0fe" franja="#c026d3" tinta="#701a75" titulo="Tinte" sub="1 hora" />
        <Hueco x={120} y={64.5} w={67} h={17} color="#9333ea" clase="esc-ag-hueco" />
        <rect className="esc-ag-aro" x="119" y="63.5" width="69" height="19" rx="4" fill="none" stroke="#a855f7" strokeWidth="1.4" />
        <g className="esc-ag-vuela" style={v({ '--dx': '100px', '--dy': '41px', '--mx': '52px', '--my': '-14px' })}>
          <rect x="121" y="66" width="67" height="17" rx="3" fill="#3b0764" opacity=".18" />
          <Turno x={120} y={64.5} w={67} h={17} fondo={u('nu')} franja="#f0abfc" titulo="Corte" sub="Anticipo pagado" />
          <CodigoQr x={177.4} y={67.2} m={0.9} color="#fff" />
        </g>
        {/* reflejo de la pantalla y base */}
        <polygon points="21,30 52,30 21,56" fill={u('gl')} opacity=".6" />
        <path d="M6 108H206L199 119Q198 121 195 121H17Q14 121 13 119Z" fill={u('bs')} />
        <rect x="90" y="108" width="32" height="2.6" rx="1.3" fill="#94a3b8" />
        <path d="M8 108.6H204" stroke="#fff" strokeWidth=".8" opacity=".7" />

        {/* ---------- el celular con el enlace de reservas ---------- */}
        <Celular x={222} y={12} w={64} h={120} u={u}>
          <rect x="229" y="24.5" width="50" height="8.5" rx="4.25" fill="#f3e8ff" />
          <path d="M234.2 29.8l2.6-2.6M233.6 27.6l-.8.8a1.5 1.5 0 0 0 2.1 2.1l.8-.8M237.4 29.4l.8-.8a1.5 1.5 0 0 0-2.1-2.1l-.8.8" stroke="#7e22ce" strokeWidth=".8" fill="none" strokeLinecap="round" />
          <text x="241" y="30.8" fontSize="5.5" fontWeight="800" fill="#7e22ce">
            /reservas
          </text>
          <g clipPath={u('cp')}>
            {/* pantalla 1: servicio */}
            <g className="esc-ag-ro-s1">
              <text x="229" y="44" fontSize="6" fontWeight="800" fill="#3b0764">
                Elegí el servicio
              </text>
              {[
                ['Corte', 'Bs 60'],
                ['Tinte', 'Bs 150'],
                ['Cejas', 'Bs 40'],
              ].map(([s, p], i) => (
                <g key={s}>
                  <rect x="229" y={49 + i * 17} width="50" height="15" rx="4" fill="#fff" stroke="#ead5f7" strokeWidth=".8" />
                  <circle cx="235.5" cy={56.5 + i * 17} r="3.6" fill={['#e9d5ff', '#f5d0fe', '#ede9fe'][i]} />
                  <text x="242" y={58.7 + i * 17} fontSize="6" fontWeight="800" fill="#3b0764">
                    {s}
                  </text>
                  <text x="276.5" y={58.6 + i * 17} textAnchor="end" fontSize="5.5" fontWeight="700" fill="#9b7bb5">
                    {p}
                  </text>
                </g>
              ))}
              <g className="esc-ag-ro-elige">
                <rect x="229" y="49" width="50" height="15" rx="4" fill="#f3e8ff" stroke="#9333ea" strokeWidth="1.2" />
                <circle cx="235.5" cy="56.5" r="3.6" fill="#a855f7" />
                <text x="242" y="58.7" fontSize="6" fontWeight="800" fill="#6b21a8">
                  Corte
                </text>
                <text x="276.5" y="58.6" textAnchor="end" fontSize="5.5" fontWeight="700" fill="#7e22ce">
                  Bs 60
                </text>
              </g>
            </g>

            {/* pantalla 2: horario */}
            <g className="esc-ag-ro-s2">
              <text x="229" y="44" fontSize="6" fontWeight="800" fill="#3b0764">
                Elegí el horario
              </text>
              <text x="229" y="52.4" fontSize="5.5" fontWeight="600" fill="#9b7bb5">
                Hoy · Corte
              </text>
              {horas.map((h, i) => {
                const x = 229 + (i % 3) * 17.5
                const y = 56 + Math.floor(i / 3) * 12.5
                const oc = ocupadas.has(h)
                return (
                  <g key={h}>
                    <rect x={x} y={y} width="15.5" height="10" rx="2.6" fill={oc ? '#f1f0f4' : '#fff'} stroke={oc ? 'none' : '#d8b4fe'} strokeWidth=".8" />
                    <text x={x + 7.75} y={y + 7} textAnchor="middle" fontSize="5.5" fontWeight="700" fill={oc ? '#c4bccd' : '#6b21a8'}>
                      {h}
                    </text>
                    {oc && <rect x={x + 2.5} y={y + 4.9} width="10.5" height=".6" fill="#c4bccd" />}
                  </g>
                )
              })}
              <g className="esc-ag-ro-hora">
                <rect x="229" y="68.5" width="15.5" height="10" rx="2.6" fill={u('bt')} />
                <text x="236.75" y="75.5" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
                  16:30
                </text>
              </g>
            </g>

            {/* pantalla 3: anticipo por QR y reservar */}
            <g className="esc-ag-ro-s3">
              <text x="229" y="44" fontSize="6" fontWeight="800" fill="#3b0764">
                Anticipo
              </text>
              <text x="276.5" y="44" textAnchor="end" fontSize="6" fontWeight="800" fill="#7e22ce">
                Bs 20
              </text>
              <rect x="237" y="49" width="34" height="34" rx="3" fill="#fff" stroke="#ead5f7" strokeWidth=".8" />
              <CodigoQr x={240.25} y={52.25} m={3.05} color="#3b0764" />
              <rect className="esc-ag-ro-scan" x="238" y="51" width="32" height="1.4" rx=".7" fill="#22c55e" />
              <g className="esc-ag-ro-pago">
                <circle cx="254" cy="66" r="8" fill="#22c55e" />
                <circle cx="254" cy="66" r="8" fill="none" stroke="#fff" strokeWidth="1.2" />
                <path d="M250.4 66.2l2.5 2.5 4.6-5" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <text x="254" y="92" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#9b7bb5">
                Pagá con tu banco
              </text>
              <g className="esc-ag-ro-boton">
                <rect x="229" y="106" width="50" height="12" rx="6" fill={u('bt')} />
                <text x="254" y="114" textAnchor="middle" fontSize="6.2" fontWeight="800" fill="#fff">
                  Reservar
                </text>
              </g>
            </g>

            {/* pantalla 4: listo */}
            <g className="esc-ag-ro-s4">
              <circle cx="254" cy="64" r="12" fill={u('bt')} />
              <path d="M248.6 64.4l3.8 3.8 7-7.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <text x="254" y="88" textAnchor="middle" fontSize="7" fontWeight="800" fill="#3b0764">
                ¡Reservado!
              </text>
              <text x="254" y="98" textAnchor="middle" fontSize="5.8" fontWeight="700" fill="#7e22ce">
                Corte · 16:30
              </text>
              <text x="254" y="107" textAnchor="middle" fontSize="5.5" fontWeight="600" fill="#9b7bb5">
                Anticipo Bs 20 ✓
              </text>
            </g>
          </g>
          <g className="esc-ag-ro-dedo">
            <Dedo cx={254} cy={56.5} aro="#6b21a8" />
          </g>
        </Celular>
      </svg>
      <Aviso etiqueta="Reserva online" texto="Corte · 16:30" tono="violeta" icono={ICONO_CALENDARIO} />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  5 · COMISIONES Y PROPINAS por profesional                          */
/* ------------------------------------------------------------------ */

/** Escala de las barras: 0,5 de ancho por boliviano. */
const BS = 0.5
/** Resumen del día: comisión y propina de cada profesional (la 2 es la que cobra en la escena). */
const PROFES = [
  { c: '#f59e0b', com: 160, pro: 20 },
  { c: '#ec4899', com: 152, pro: 25 },
  { c: '#14b8a6', com: 90, pro: 5 },
]

/** Fila del resumen (avatar, nombre, barra con comisión + propina); los montos los pone quien la usa. */
function FilaComision({ y, i, estatica }: { y: number; i: number; estatica: boolean }) {
  const p = PROFES[i]
  return (
    <>
      <Avatar cx={137} cy={y + 9} r={6} color={p.c} />
      <text x="148" y={y + 7} fontSize="6" fontWeight="800" fill="#431407">
        Prof. {i + 1}
      </text>
      <rect x="148" y={y + 11} width="100" height="5" rx="2.5" fill="#fde7cc" />
      {estatica && (
        <>
          <rect x="148" y={y + 11} width={p.com * BS} height="5" rx="2.5" fill="#f97316" />
          <rect x={148 + p.com * BS + 0.6} y={y + 11} width={p.pro * BS} height="5" rx="2.5" fill="#14b8a6" />
          <text x="296" y={y + 9} textAnchor="end" fontSize="8" fontWeight="800" fill="#431407">
            Bs {p.com}
          </text>
          <text x="296" y={y + 17} textAnchor="end" fontSize="5.5" fontWeight="700" fill="#0f766e">
            +Bs {p.pro} propina
          </text>
        </>
      )}
    </>
  )
}

/**
 * Comisiones y propinas, en ámbar. A la izquierda, el cobro de un corte de la Prof. 2 con su
 * propina; al apretar «Cobrar» salen dos fichas: la comisión (40 %, Bs 32) va a la barra naranja
 * de la Prof. 2 y la propina (Bs 10) a la verde, aparte. Los montos suben y llega el aviso. Más
 * tarde la fila se desvanece y vuelve al estado de antes del cobro.
 */
export function EscenaFnComisiones() {
  const { id, g, u } = useIds()
  const fy = 58 // fila de la Prof. 2
  const antes = { com: 120, pro: 15 }
  const p = PROFES[1]
  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('cd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#fff7ed" />
          </linearGradient>
          <linearGradient id={g('hd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fdba74" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id={g('bt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fb923c" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id={g('ok')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <clipPath id={g('ct')}>
            <rect x="16" y="22" width="94" height="102" rx="9" />
          </clipPath>
          <clipPath id={g('cm')}>
            <rect x="250" y={fy + 1} width="50" height="9.6" />
          </clipPath>
          <clipPath id={g('cq')}>
            <rect x="250" y={fy + 11.6} width="50" height="7.4" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#f3c58f" luz={['#fff8ec', '#fde3bf']} sombra="#7c2d12" />
        <Contacto cx={63} rx={50} color="#7c2d12" />
        <Contacto cx={214} rx={92} color="#7c2d12" />

        {/* ---------- el cobro ---------- */}
        <rect x="19.5" y="25.5" width="94" height="102" rx="9" fill="#f7cf9e" />
        <rect x="16" y="22" width="94" height="102" rx="9" fill={u('cd')} />
        <g clipPath={u('ct')}>
          <rect x="16" y="22" width="94" height="14" fill={u('hd')} />
          <rect x="16" y="22" width="94" height="1.4" fill="#fff" opacity=".4" />
        </g>
        <text x="23" y="31.8" fontSize="6.5" fontWeight="800" fill="#fff">
          Cobro
        </text>
        <text x="103" y="31.8" textAnchor="end" fontSize="5.5" fontWeight="700" fill="#fff" opacity=".9">
          Caja 1
        </text>
        <text x="23" y="48" fontSize="6" fontWeight="800" fill="#431407">
          Corte
        </text>
        <text x="103" y="48" textAnchor="end" fontSize="6" fontWeight="800" fill="#431407">
          Bs 80
        </text>
        <text x="23" y="59" fontSize="6" fontWeight="700" fill="#0f766e">
          Propina
        </text>
        <text x="103" y="59" textAnchor="end" fontSize="6" fontWeight="800" fill="#0f766e">
          Bs 10
        </text>
        <path d="M23 65H103" stroke="#f3d9bd" strokeWidth=".8" strokeDasharray="2 1.6" />
        <text x="23" y="78" fontSize="5.8" fontWeight="700" fill="#a16207">
          Total
        </text>
        <text x="103" y="79" textAnchor="end" fontSize="9.5" fontWeight="800" fill="#431407">
          Bs 90
        </text>
        <rect x="21" y="84" width="84" height="12" rx="6" fill="#fdf0e1" />
        <Avatar cx={27.5} cy={90} r={4} color={p.c} />
        <text x="34" y="92.1" fontSize="5.8" fontWeight="800" fill="#9d174d">
          Prof. 2
        </text>
        <text x="101" y="92.1" textAnchor="end" fontSize="5.5" fontWeight="700" fill="#a16207">
          Comisión 40 %
        </text>
        <g className="esc-ag-co-boton">
          <rect x="21" y="102" width="84" height="13" rx="6.5" fill={u('bt')} />
          <text x="63" y="110.6" textAnchor="middle" fontSize="6.5" fontWeight="800" letterSpacing=".4" fill="#fff">
            COBRAR
          </text>
        </g>
        <g className="esc-ag-co-cobrado">
          <rect x="21" y="102" width="84" height="13" rx="6.5" fill={u('ok')} />
          <path d="M42 108.6l2 2 3.6-4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <text x="68.5" y="110.6" textAnchor="middle" fontSize="6.5" fontWeight="800" letterSpacing=".4" fill="#fff">
            COBRADO
          </text>
        </g>

        {/* ---------- resumen del día por profesional ---------- */}
        <rect x="127.5" y="17.5" width="180" height="108" rx="10" fill="#f7cf9e" />
        <rect x="124" y="14" width="180" height="108" rx="10" fill={u('cd')} />
        <text x="132" y="28" fontSize="7" fontWeight="800" fill="#431407">
          Hoy
        </text>
        <text x="148" y="28" fontSize="5.5" fontWeight="700" fill="#b4825a">
          por profesional
        </text>
        <rect x="130" y="33" width="168" height=".7" fill="#fbe2c6" />

        <FilaComision y={36} i={0} estatica />
        <FilaComision y={80} i={2} estatica />

        {/* la fila que cambia: resaltado, barras que crecen y montos que suben */}
        <rect className="esc-ag-co-resalta" x="128" y={fy - 2} width="172" height="23" rx="5" fill="#ffedd5" />
        <g className="esc-ag-co-capa">
          <FilaComision y={fy} i={1} estatica={false} />
          <rect className="esc-ag-co-com" x="148" y={fy + 11} width={p.com * BS} height="5" rx="2.5" fill="#f97316" />
          <rect className="esc-ag-co-pro" x={148 + p.com * BS + 0.6} y={fy + 11} width={p.pro * BS} height="5" rx="2.5" fill="#14b8a6" />
          <g clipPath={u('cm')}>
            <g className="esc-ag-co-tira">
              <text x="296" y={fy + 9} textAnchor="end" fontSize="8" fontWeight="800" fill="#431407">
                Bs {antes.com}
              </text>
              <text x="296" y={fy + 19} textAnchor="end" fontSize="8" fontWeight="800" fill="#431407">
                Bs {p.com}
              </text>
            </g>
          </g>
          <g clipPath={u('cq')}>
            <g className="esc-ag-co-tira">
              <text x="296" y={fy + 17} textAnchor="end" fontSize="5.5" fontWeight="700" fill="#0f766e">
                +Bs {antes.pro} propina
              </text>
              <text x="296" y={fy + 27} textAnchor="end" fontSize="5.5" fontWeight="700" fill="#0f766e">
                +Bs {p.pro} propina
              </text>
            </g>
          </g>
        </g>

        {/* leyenda */}
        <rect x="132" y="108.5" width="7" height="4.4" rx="2.2" fill="#f97316" />
        <text x="141.5" y="112.6" fontSize="5.5" fontWeight="700" fill="#9a6a45">
          Comisión
        </text>
        <rect x="170" y="108.5" width="7" height="4.4" rx="2.2" fill="#14b8a6" />
        <text x="179.5" y="112.6" fontSize="5.5" fontWeight="700" fill="#9a6a45">
          Propina aparte
        </text>

        {/* las dos fichas que salen del cobro: comisión a la barra naranja, propina a la verde */}
        <g className="esc-ag-co-ficha" style={v({ '--dx': '163px', '--dy': '-38px', '--pk': '-60px' })}>
          <rect x="51" y="104.5" width="24" height="9" rx="4.5" fill="#f97316" />
          <rect x="51" y="104.5" width="24" height="9" rx="4.5" fill="none" stroke="#fff" strokeWidth="1" />
          <text x="63" y="110.9" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
            Bs 32
          </text>
        </g>
        <g className="esc-ag-co-ficha" style={v({ '--dx': '168px', '--dy': '-38px', '--pk': '-52px', animationDelay: '-6.37s' })}>
          <rect x="52" y="104.5" width="22" height="9" rx="4.5" fill="#14b8a6" />
          <rect x="52" y="104.5" width="22" height="9" rx="4.5" fill="none" stroke="#fff" strokeWidth="1" />
          <text x="63" y="110.9" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
            +10
          </text>
        </g>
      </svg>
      <Aviso etiqueta="Prof. 2" texto="Comisión +Bs 32" tono="ambar" />
    </Marco>
  )
}
