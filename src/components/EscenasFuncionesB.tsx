import './EscenasFuncionesB.css'
import { useId, type ReactNode } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de la sección «Funciones» (archivo B): reportes, fiado y
  roles con PIN. A diferencia de las escenas de los rubros, el héroe no es un
  negocio sino la pieza de interfaz que explica la función (el tablero, la
  tarjeta de cuenta, el teclado de PIN), dibujada como producto real.

  Todo se mueve con CSS (sólo transform y opacity); los keyframes `esc-fb-*` viven
  en EscenasFuncionesB.css. Las tres comparten el ciclo maestro de 6,5 s del <Aviso>
  (esc-chip), que asoma al 10 % del ciclo. Los keyframes se escriben en «tiempo
  local» (la historia empieza en 0 %) y cada elemento lleva un desfase de -1,3 s
  (20 %): así lo que «causa» el aviso termina justo en el 9-10 % del ciclo global.

  Ojo: `.escena svg *` fija transform-box/origin al centro de cada caja; por eso no se
  usa el atributo `transform=""` y los pivotes propios van en el .css o como estilo.
*/

/** Ancho del viewBox de las tres escenas (320 × 150). */
const VB = '0 0 320 150'

/** Plataforma común: losa suave con su canto (misma en las tres escenas, sólo cambia el tono). */
function Plataforma({ id, canto, arriba, abajo }: { id: string; canto: string; arriba: string; abajo: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}pl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={arriba} />
          <stop offset="1" stopColor={abajo} />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="135" rx="142" ry="10" fill={canto} />
      <ellipse cx="160" cy="131" rx="142" ry="10" fill={`url(#${id}pl)`} />
      <ellipse cx="160" cy="129" rx="118" ry="6.5" fill="#fff" opacity=".35" />
    </>
  )
}

/** Sombra de contacto: una oscura y chica + otra más ancha y difusa. */
function Contacto({ cx, rx, color }: { cx: number; rx: number; color: string }) {
  return (
    <>
      <ellipse cx={cx} cy="130" rx={rx * 1.25} ry="5" fill={color} opacity=".07" />
      <ellipse cx={cx} cy="129.5" rx={rx} ry="3.6" fill={color} opacity=".14" />
    </>
  )
}

/** Curva suave (Catmull-Rom → Bézier) por una lista de puntos. */
function suave(p: [number, number][]) {
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const f = (n: number) => n.toFixed(1)
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`
  }
  return d
}

/** Arco de circunferencia (grados, 0° = arriba, en sentido horario): los tramos de la dona. */
function arco(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => {
    const t = ((a - 90) * Math.PI) / 180
    return `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * Math.sin(t)).toFixed(2)}`
  }
  return `M${p(a0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`
}

/** Ícono 24×24 colocado con x/y/tamaño (un <svg> anidado: sin atributo transform). */
function Icono({ x, y, s, children }: { x: number; y: number; s: number; children: ReactNode }) {
  return (
    <svg x={x} y={y} width={s} height={s} viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  REPORTES                                                           */
/* ------------------------------------------------------------------ */

const ALTOS = [10, 16, 14, 22, 20, 28]
/** Puntos de la tendencia: 7 unidades sobre la punta de cada barra. */
const TENDENCIA: [number, number][] = ALTOS.map((h, i) => [173.5 + i * 17, 91 - h - 7])
const NUMEROS = ['Bs 860', 'Bs 1.020', 'Bs 1.130', 'Bs 1.240']
/** Tramos de la dona: [desde°, hasta°, color]; entre uno y otro queda un hueco de 4°. */
const TRAMOS: [number, number, string][] = [
  [2, 196, '#059669'],
  [200, 298, '#34d399'],
  [302, 356, '#a7f3d0'],
]

/**
 * Un monitor con el tablero de reportes. La historia (6,5 s): las barras crecen escalonadas,
 * una línea de tendencia se descubre de izquierda a derecha, la dona se arma tramo por tramo y
 * la cifra grande «sube» (tira vertical de números); cuando asienta, llega el aviso de ganancia.
 * Pasado el aviso, el tablero se desvanece y vuelve a armarse.
 */
export function EscenaFnReportes() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`
  const linea = suave(TENDENCIA)
  const [ux, uy] = TENDENCIA[TENDENCIA.length - 1]

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-emerald-100 via-emerald-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('mk')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#c3cddc" />
          </linearGradient>
          <linearGradient id={g('pn')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#eff3f8" />
          </linearGradient>
          <linearGradient id={g('nk')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={g('br')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6ee7b7" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id={g('bu')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
          <linearGradient id={g('ar')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f59e0b" stopOpacity=".3" />
            <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <clipPath id={g('cn')}>
            <rect x="50" y="46" width="62" height="17" />
          </clipPath>
          {/* la línea queda tapada y esta ventana, que crece desde la izquierda, la descubre */}
          <mask id={g('mx')} maskUnits="userSpaceOnUse" x="160" y="40" width="116" height="56">
            <rect className="esc-fb-descubre" x="160" y="40" width="116" height="56" fill="#fff" />
          </mask>
        </defs>

        <Plataforma id={id} canto="#8ed3b7" arriba="#e6f8ef" abajo="#bfe9d5" />
        <Contacto cx={160} rx={46} color="#064e3b" />

        <g className="esc-fb-flota">
          {/* pie del monitor */}
          <path d="M148 100H172L175 120H145Z" fill={u('nk')} />
          <ellipse cx="160" cy="123.5" rx="34" ry="5" fill="#94a3b8" />
          <ellipse cx="160" cy="122" rx="34" ry="5" fill="#dbe3ee" />

          {/* marco: grosor a la derecha-abajo (luz desde arriba-izquierda) y tapa */}
          <rect x="41" y="19" width="244" height="86" rx="8" fill="#94a3b8" />
          <rect x="38" y="16" width="244" height="86" rx="8" fill={u('mk')} />
          <rect x="38.6" y="16.6" width="242.8" height="1.4" rx=".7" fill="#fff" opacity=".8" />
          <rect x="43" y="21" width="234" height="76" rx="4" fill={u('pn')} />

          {/* encabezado del tablero: controles, título y selector de período */}
          <circle cx="50" cy="27" r="1.8" fill="#cbd5e1" />
          <circle cx="56" cy="27" r="1.8" fill="#cbd5e1" />
          <circle cx="62" cy="27" r="1.8" fill="#cbd5e1" />
          <rect x="72" y="25.4" width="30" height="3.2" rx="1.6" fill="#e2e8f0" />
          <rect x="226" y="24" width="14" height="6" rx="3" fill="#e2e8f0" />
          <rect x="243" y="24" width="14" height="6" rx="3" fill="#10b981" />
          <rect x="260" y="24" width="12" height="6" rx="3" fill="#e2e8f0" />
          <rect x="43" y="33" width="234" height="1" fill="#eef2f7" />

          {/* lo que se arma en cada ciclo (se desvanece entero y vuelve a empezar) */}
          <g className="esc-fb-rep-capa">
            {/* cifra grande: tira de números que sube dentro de una ventana */}
            <rect x="52" y="39" width="24" height="3.5" rx="1.75" fill="#cbd5e1" />
            <g clipPath={u('cn')}>
              <g className="esc-fb-rep-tira">
                {NUMEROS.map((n, i) => (
                  <text key={n} x="52" y={59 + i * 16} fontSize="13" fontWeight="800" fill="#0f172a">
                    {n}
                  </text>
                ))}
              </g>
            </g>
            <g className="esc-fb-rep-chip">
              <rect x="52" y="68" width="32" height="12" rx="6" fill="#d1fae5" />
              <text x="68" y="77" textAnchor="middle" fontSize="9" fontWeight="800" fill="#047857">
                +12%
              </text>
            </g>

            {/* dona: tres tramos que giran hasta su lugar, uno tras otro */}
            <circle cx="138" cy="68" r="14" fill="none" stroke="#e8edf4" strokeWidth="7" />
            {TRAMOS.map(([a0, a1, c], i) => (
              <path
                key={a0}
                d={arco(138, 68, 14, a0, a1)}
                fill="none"
                stroke={c}
                strokeWidth="7"
                className="esc-fb-rep-tramo"
                style={{ transformBox: 'view-box', transformOrigin: '138px 68px', ...v({ '--d': `${i * 0.2}s` }) }}
              />
            ))}
            <text x="138" y="71.4" textAnchor="middle" fontSize="9" fontWeight="800" fill="#334155">
              68%
            </text>

            {/* gráfico: rejilla, barras escalonadas y tendencia */}
            <rect x="164" y="59" width="108" height=".8" fill="#eef2f7" />
            <rect x="164" y="75" width="108" height=".8" fill="#eef2f7" />
            <rect x="164" y="91" width="108" height="1.2" fill="#dde4ee" />
            {ALTOS.map((h, i) => (
              <g key={i}>
                <rect x={170 + i * 17} y="94" width="7" height="2" rx="1" fill="#e2e8f0" />
                <rect
                  className="esc-fb-barra"
                  x={168 + i * 17}
                  y={91 - h}
                  width="11"
                  height={h}
                  rx="2.2"
                  fill={i === ALTOS.length - 1 ? u('bu') : u('br')}
                  style={v({ '--d': `${i * 0.1}s` })}
                />
              </g>
            ))}
            <g mask={u('mx')}>
              <path d={`${linea}L${ux} 91L${TENDENCIA[0][0]} 91Z`} fill={u('ar')} />
              <path d={linea} fill="none" stroke={u('pt')} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g className="esc-fb-rep-punta">
              <circle cx={ux} cy={uy} r="3.6" fill="#fff" />
              <circle cx={ux} cy={uy} r="2.2" fill="#f59e0b" />
            </g>
          </g>
        </g>
      </svg>
      <Aviso
        etiqueta="Ganancia"
        texto="+ Bs 1.240"
        tono="verde"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 14.5l5-5 3 3 6-6.5" />
            <path d="M12.5 6h4.5v4.5" />
          </svg>
        }
      />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  FIADO                                                              */
/* ------------------------------------------------------------------ */

/** Un renglón de movimientos de la tarjeta: ícono, descripción en barra y monto. */
function Fila({ y, monto, color }: { y: number; monto: string; color: string }) {
  return (
    <>
      <circle cx="110" cy={y + 5} r="2.8" fill="#ddd6fe" />
      <rect x="118" y={y + 3.5} width="36" height="3" rx="1.5" fill="#e5e7eb" />
      <text x="226" y={y + 7.5} textAnchor="end" fontSize="9" fontWeight="800" fill={color}>
        {monto}
      </text>
    </>
  )
}

/**
 * La tarjeta de cuenta de una clienta (avatar, saldo y movimientos). La historia (6,5 s): un
 * billete de Bs 50 se desliza hacia la tarjeta, entra la fila del abono (se tilda), el saldo
 * (tira de números) baja de 180 a 130 y la barra de deuda se acorta; al asentar llega el aviso.
 * Luego el interior se desvanece y vuelve al estado de antes del abono.
 */
export function EscenaFnFiado() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-violet-100 via-violet-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('cd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f3f0ff" />
          </linearGradient>
          <linearGradient id={g('hd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9d7bff" />
            <stop offset="1" stopColor="#6d3fe0" />
          </linearGradient>
          <linearGradient id={g('bf')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id={g('bl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e4dcfd" />
            <stop offset="1" stopColor="#b6a1f5" />
          </linearGradient>
          <linearGradient id={g('bk')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d6c9fb" />
            <stop offset="1" stopColor="#a995ee" />
          </linearGradient>
          <clipPath id={g('cc')}>
            <rect x="96" y="16" width="140" height="112" rx="11" />
          </clipPath>
          <clipPath id={g('cs')}>
            <rect x="104" y="60" width="86" height="22" />
          </clipPath>
          <clipPath id={g('cf')}>
            <rect x="100" y="95" width="132" height="30" />
          </clipPath>
        </defs>

        <Plataforma id={id} canto="#c4b5fd" arriba="#f5f3ff" abajo="#ddd6fe" />
        <Contacto cx={166} rx={56} color="#3b0764" />
        <ellipse cx="50" cy="129.5" rx="26" ry="3" fill="#3b0764" opacity=".12" />
        <ellipse cx="274" cy="130" rx="22" ry="3" fill="#3b0764" opacity=".12" />

        {/* secundario izquierdo: la libreta de apuntes (menos saturada) */}
        <rect x="29" y="73" width="48" height="56" rx="4" fill="#a590e6" />
        <rect x="26" y="70" width="46" height="58" rx="4" fill={u('bk')} />
        <rect x="26" y="70" width="6" height="58" rx="3" fill="#8f77e0" />
        <rect x="72" y="73" width="3" height="52" rx="1.2" fill="#f5f3ff" />
        <rect x="38" y="82" width="24" height="14" rx="2.5" fill="#fff" opacity=".55" />
        <rect x="41" y="86" width="18" height="2.6" rx="1.3" fill="#8b7bd0" opacity=".6" />
        <rect x="41" y="91" width="11" height="2.6" rx="1.3" fill="#8b7bd0" opacity=".4" />
        <rect x="26.6" y="70.6" width="45" height="1.2" rx=".6" fill="#fff" opacity=".6" />

        {/* secundario derecho: el billete de Bs 50 que entra a la cuenta (queda tapado por la tarjeta) */}
        <g className="esc-fb-fia-billete">
          <rect x="253" y="110" width="42" height="21" rx="3" fill="#7c3aed" opacity=".35" />
          <rect x="252" y="108" width="42" height="21" rx="3" fill={u('bl')} />
          <rect x="254.5" y="110.5" width="37" height="16" rx="2" fill="none" stroke="#fff" strokeWidth="1" opacity=".6" />
          <circle cx="273" cy="118.5" r="6" fill="#fff" opacity=".55" />
          <text x="273" y="122" textAnchor="middle" fontSize="10" fontWeight="800" fill="#5b21b6">
            50
          </text>
        </g>

        <g className="esc-fb-flota">
          {/* tarjeta: grosor a la derecha-abajo y cara */}
          <rect x="99.5" y="19.5" width="140" height="112" rx="11" fill="#bfa9fb" />
          <rect x="96" y="16" width="140" height="112" rx="11" fill={u('cd')} />
          <g clipPath={u('cc')}>
            <rect x="96" y="16" width="140" height="31" fill={u('hd')} />
            <rect x="96" y="16" width="140" height="1.6" fill="#fff" opacity=".35" />
          </g>

          {/* cliente: avatar, nombre y un dato en barras */}
          <circle cx="116" cy="31.5" r="10.5" fill="#fff" />
          <circle cx="116" cy="28.5" r="3.7" fill="#a78bfa" />
          <path d="M109.2 38.6a6.8 6.8 0 0 1 13.6 0Z" fill="#a78bfa" />
          <rect x="132" y="25" width="44" height="4.6" rx="2.3" fill="#fff" opacity=".95" />
          <rect x="132" y="33" width="28" height="3.6" rx="1.8" fill="#fff" opacity=".5" />
          <rect x="198" y="27" width="28" height="3.2" rx="1.6" fill="#fff" opacity=".45" />

          {/* saldo y barra de deuda */}
          <rect x="106" y="54" width="26" height="3" rx="1.5" fill="#c9bdf5" />
          <rect x="106" y="85" width="120" height="6" rx="3" fill="#ece7fe" />
          <rect x="106" y="93.2" width="120" height=".9" fill="#ece7fe" />

          <g className="esc-fb-fia-capa">
            <g clipPath={u('cs')}>
              <g className="esc-fb-fia-tira">
                {['Bs 180', 'Bs 150', 'Bs 130'].map((n, i) => (
                  <text key={n} x="106" y={77 + i * 20} fontSize="17" fontWeight="800" fill="#3b1a8a">
                    {n}
                  </text>
                ))}
              </g>
            </g>
            <rect className="esc-fb-fia-deuda" x="106" y="85" width="120" height="6" rx="3" fill={u('bf')} />

            {/* movimientos: las filas viejas bajan un renglón y entra el abono arriba */}
            <g clipPath={u('cf')}>
              <g className="esc-fb-fia-baja" style={v({ '--d': '0s' })}>
                <Fila y={95} monto="Bs 40" color="#7c6cb8" />
              </g>
              <g className="esc-fb-fia-baja" style={v({ '--d': '.05s' })}>
                <Fila y={105} monto="Bs 25" color="#7c6cb8" />
              </g>
              <g className="esc-fb-fia-baja" style={v({ '--d': '.1s' })}>
                <Fila y={115} monto="Bs 65" color="#7c6cb8" />
              </g>
              <g className="esc-fb-fia-entra">
                <rect className="esc-fb-fia-fondo" x="100" y="95" width="132" height="10" rx="3" fill="#d1fae5" />
                <rect x="118" y="98.5" width="36" height="3" rx="1.5" fill="#e5e7eb" />
                <text x="226" y="102.5" textAnchor="end" fontSize="9" fontWeight="800" fill="#059669">
                  - Bs 50
                </text>
                <g className="esc-fb-fia-tilde">
                  <circle cx="110" cy="100" r="3.8" fill="#10b981" />
                  <path d="M108.1 100.2l1.4 1.4 2.5-2.8" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Abono" texto="Bs 50 · Rosa" tono="violeta" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  ROLES Y PIN                                                        */
/* ------------------------------------------------------------------ */

/** Teclas del teclado: [dígito, columna, fila]. Las cuatro primeras son las que «teclea» la historia (1-2-3-4). */
const TECLAS: [string, number, number][] = [
  ['1', 0, 0], ['2', 1, 0], ['3', 2, 0],
  ['4', 0, 1], ['5', 1, 1], ['6', 2, 1],
  ['7', 0, 2], ['8', 1, 2], ['9', 2, 2],
  ['0', 1, 3],
]
const TX = [128.3, 150.8, 173.3]
const TY = [66, 79.5, 93, 106.5]

/** Ticket con borde dentado abajo (un solo trazo). */
const TICKET = (() => {
  const dientes = 7
  const w = 68 / dientes
  let d = 'M22 54H90V118'
  for (let i = 0; i < dientes; i++) d += `l-${(w / 2).toFixed(2)} 5l-${(w / 2).toFixed(2)} -5`
  return `${d}Z`
})()

/**
 * Un celular con el teclado de PIN, el ticket que se quiere anular a la izquierda y los chips de
 * rol a la derecha. La historia (6,5 s): se teclea 1-2-3-4 (cada tecla se hunde y se llena un
 * punto), el candado se abre con rebote y se pone verde, el chip ADMIN se enciende con su escudo,
 * el ticket queda sellado como anulado y llega el aviso. Después todo vuelve a su lugar:
 * el candado se cierra y el teclado queda listo para la próxima.
 */
export function EscenaFnRoles() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`
  const ESCUDO = 'M12 2.5 4 5.6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6z'

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-rose-100 via-rose-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('cu')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#52627a" />
            <stop offset="1" stopColor="#1b2437" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ffeff2" />
          </linearGradient>
          <linearGradient id={g('ro')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fb7185" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id={g('tk')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        <Plataforma id={id} canto="#fda4af" arriba="#fff1f2" abajo="#fecdd3" />
        <Contacto cx={136} rx={38} color="#4c0519" />
        <ellipse cx="46" cy="129.5" rx="30" ry="3" fill="#4c0519" opacity=".12" />

        <g style={{ transform: 'translateX(-10px)' }}>
        {/* secundario izquierdo: el ticket de una venta (se anula al autorizar) */}
        <path d={TICKET} fill={u('tk')} stroke="#e3e8f0" strokeWidth=".8" />
        <rect x="28" y="60" width="24" height="3.5" rx="1.75" fill="#cbd5e1" />
        {[69, 76, 83].map((y, i) => (
          <g key={y}>
            <rect x="28" y={y} width={[30, 24, 34][i]} height="2.8" rx="1.4" fill="#e2e8f0" />
            <rect x="68" y={y} width="16" height="2.8" rx="1.4" fill="#e2e8f0" />
          </g>
        ))}
        <rect x="28" y="92" width="56" height=".9" fill="#cbd5e1" />
        <text x="28" y="108" fontSize="10" fontWeight="800" fill="#475569">
          Bs 48
        </text>
        <rect className="esc-fb-rol-tacha" x="27" y="103.6" width="31" height="1.8" rx=".9" fill="#e11d48" />
        <g className="esc-fb-rol-sello">
          <rect x="29" y="73" width="54" height="15" rx="2.5" fill="#fff" opacity=".85" />
          <rect x="29" y="73" width="54" height="15" rx="2.5" fill="none" stroke="#e11d48" strokeWidth="1.6" />
          <text x="56" y="83.6" textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="1" fill="#e11d48">
            ANULADA
          </text>
        </g>
        </g>
        <g style={{ transform: 'translateX(-24px)' }}>
        <g className="esc-fb-flota">
          {/* celular: grosor a la derecha-abajo, cuerpo y pantalla */}
          <rect x="121" y="15" width="84" height="116" rx="13" fill="#0f172a" />
          <rect x="118" y="12" width="84" height="116" rx="13" fill={u('cu')} />
          <rect x="118.8" y="12.6" width="82.4" height="1.4" rx=".7" fill="#fff" opacity=".28" />
          <rect x="123" y="18" width="74" height="104" rx="9" fill={u('pa')} />
          <rect x="151" y="20.6" width="18" height="3" rx="1.5" fill="#cbd5e1" />

          {/* candado: cuerpo, ojo de cerradura, y el arco que se abre sobre su pie derecho */}
          <rect x="152" y="33" width="16" height="12" rx="2.6" fill="#e11d48" />
          <rect className="esc-fb-rol-abre" x="152" y="33" width="16" height="12" rx="2.6" fill="#10b981" />
          <circle cx="160" cy="38.2" r="1.7" fill="#fff" />
          <rect x="159.4" y="38.6" width="1.2" height="3.4" rx=".6" fill="#fff" />
          <path
            className="esc-fb-rol-arco"
            d="M155.5 33.2V30a4.5 4.5 0 0 1 9 0v3.2"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ transformBox: 'view-box', transformOrigin: '164.5px 33px' }}
          />

          {/* los cuatro puntos del PIN */}
          {[142, 154, 166, 178].map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy="55" r="4.2" fill="#fff" stroke="#d3dbe6" strokeWidth="1.6" />
              <circle className="esc-fb-rol-punto" cx={cx} cy="55" r="3" fill="#e11d48" style={v({ '--d': `${i * 0.325}s` })} />
            </g>
          ))}

          {/* teclado numérico: base, luz de la tecla pulsada y, encima, el dígito (que no se tapa) */}
          {TECLAS.map(([n, c, f]) => (
            <g key={n}>
              <rect x={TX[c]} y={TY[f] + 1} width="19" height="10.5" rx="3" fill="#d6dde8" />
              <rect x={TX[c]} y={TY[f]} width="19" height="10.5" rx="3" fill="#fff" />
            </g>
          ))}
          {TECLAS.slice(0, 4).map(([n, c, f], i) => (
            <rect
              key={n}
              className="esc-fb-rol-tecla"
              x={TX[c]}
              y={TY[f]}
              width="19"
              height="10.5"
              rx="3"
              fill="#fda4af"
              style={v({ '--d': `${i * 0.325}s` })}
            />
          ))}
          {TECLAS.map(([n, c, f]) => (
            <text key={n} x={TX[c] + 9.5} y={TY[f] + 7.8} textAnchor="middle" fontSize="9" fontWeight="800" fill="#475569">
              {n}
            </text>
          ))}
        </g>

        </g>
        <g style={{ transform: 'translateX(-4px)' }}>
        {/* chips de rol: CAJERO apagado, ADMIN se enciende al autorizar */}
        <g>
          <rect x="220" y="58" width="80" height="18" rx="9" fill="#fff" opacity=".75" />
          <rect x="220.4" y="58.4" width="79.2" height="17.2" rx="8.6" fill="none" stroke="#e2e8f0" strokeWidth=".8" />
          <Icono x={226} y={61} s={12}>
            <circle cx="12" cy="8" r="4" fill="#cbd5e1" />
            <path d="M4.5 21c0-4.5 3.4-7.5 7.5-7.5s7.5 3 7.5 7.5Z" fill="#cbd5e1" />
          </Icono>
          <text x="244" y="70.4" fontSize="9" fontWeight="800" letterSpacing="1" fill="#a3aebf">
            CAJERO
          </text>

          <rect x="220" y="84" width="80" height="20" rx="10" fill="#fff" opacity=".75" />
          <rect x="220.4" y="84.4" width="79.2" height="19.2" rx="9.6" fill="none" stroke="#e2e8f0" strokeWidth=".8" />
          <Icono x={226} y={88} s={12}>
            <path d={ESCUDO} fill="#cbd5e1" />
          </Icono>
          <text x="244" y="97.4" fontSize="9" fontWeight="800" letterSpacing="1" fill="#a3aebf">
            ADMIN
          </text>

          <rect className="esc-fb-rol-aro" x="216" y="80" width="88" height="28" rx="14" fill="none" stroke="#fb7185" strokeWidth="1.6" />
          <g className="esc-fb-rol-encendido">
            <rect x="220" y="84" width="80" height="20" rx="10" fill={u('ro')} />
            <rect x="221" y="84.8" width="78" height="1.2" rx=".6" fill="#fff" opacity=".4" />
            <g className="esc-fb-rol-escudo">
              <Icono x={226} y={88} s={12}>
                <path d={ESCUDO} fill="#fff" />
                <path d="M8.3 12.2l2.7 2.7 4.8-5.3" stroke="#e11d48" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </Icono>
            </g>
            <text x="244" y="97.4" fontSize="9" fontWeight="800" letterSpacing="1" fill="#fff">
              ADMIN
            </text>
          </g>
        </g>
        </g>
      </svg>
      <Aviso
        etiqueta="Autorizado"
        texto="Anulación · PIN ok"
        tono="rosa"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2.2 3.6 4.8v4.6c0 4 2.7 6.9 6.4 8.1 3.7-1.2 6.4-4.1 6.4-8.1V4.8Z" />
            <path d="M7 9.8l2.2 2.2 3.8-4.2" />
          </svg>
        }
      />
    </Marco>
  )
}
