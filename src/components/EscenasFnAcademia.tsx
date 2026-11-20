import './EscenasFnAcademia.css'
import { useId, type ReactNode } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de las funciones de la academia / instituto: inscripción
  online, cobro de cuotas, grupos y horarios, y lista de asistencia. Como en las de
  «Funciones», el héroe es la pieza de interfaz (el celular con la página, el chat
  con el QR, el calendario, la tablet del docente), sobre la plataforma índigo del
  rubro, con luz desde arriba a la izquierda y sombras de contacto.

  Todo se mueve con CSS (sólo transform y opacity); los keyframes `esc-ac-*` viven en
  EscenasFnAcademia.css. Ciclo maestro de 6,5 s, el mismo del <Aviso> (esc-chip), que
  asoma al 10 % del ciclo. Las escenas con aviso escriben sus keyframes en «tiempo
  local» y corren con un desfase de -2,47 s (38 %): así el aviso asoma entre el 38 y el
  48 % local, justo cuando termina la acción que lo causa, y la historia tiene del 6 al
  45 % para armarse sin que el aviso tape nada.

  Ojo: `.escena svg *` fija transform-box/origin al centro de cada caja; por eso no se
  usa el atributo `transform=""` y los pivotes propios van en el .css.
*/

const VB = '0 0 320 150'

/** Plataforma común: losa elíptica con canto, luz y una sombra ancha difusa. */
function Plataforma({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}pt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef0ff" />
          <stop offset="1" stopColor="#cfd2f6" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="137" rx="148" ry="12" fill="#a9ade6" />
      <ellipse cx="160" cy="133" rx="148" ry="12" fill={`url(#${id}pt)`} />
      <ellipse cx="160" cy="130.5" rx="124" ry="7" fill="#fff" opacity=".4" />
      <ellipse cx="160" cy="134" rx="122" ry="8" fill="#1e1b4b" opacity=".05" />
    </>
  )
}

/** Sombra de contacto: una ancha y difusa + otra chica y más oscura. */
function Sombra({ cx, rx, cy = 134 }: { cx: number; rx: number; cy?: number }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx * 1.35} ry="6.5" fill="#1e1b4b" opacity=".06" />
      <ellipse cx={cx} cy={cy} rx={rx} ry="3.8" fill="#1e1b4b" opacity=".15" />
    </>
  )
}

/** Toque del dedo: un círculo translúcido con aro blanco. Se dibuja en su primera posición. */
function Dedo({ x, y, className }: { x: number; y: number; className: string }) {
  return (
    <g className={className}>
      <circle cx={x} cy={y} r="5.6" fill="#1e1b4b" opacity=".22" />
      <circle cx={x} cy={y} r="5.6" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".95" />
      <circle cx={x} cy={y} r="2" fill="#fff" opacity=".9" />
    </g>
  )
}

/** Cuerpo de un celular (marco oscuro, botón lateral y pantalla) en x..x+60, y 12..132. */
function Celular({ x, u, children }: { x: number; u: (n: string) => string; children: ReactNode }) {
  return (
    <>
      <rect x={x} y="12" width="60" height="120" rx="11" fill={u('ph')} />
      <rect x={x + 0.7} y="24" width="1.4" height="94" rx=".7" fill="#fff" opacity=".22" />
      <rect x={x + 59.4} y="40" width="1.8" height="14" rx=".9" fill="#1e1b4b" />
      <rect x={x + 4} y="16" width="52" height="112" rx="8.5" fill={u('pn')} />
      {children}
      <rect x={x + 22} y="18.4" width="16" height="3.6" rx="1.8" fill="#0f172a" />
    </>
  )
}

/** Degradés comunes: marco del celular, pantalla clara, botón índigo y verde, reflejo. */
function Comunes({ g }: { g: (n: string) => string }) {
  return (
    <>
      <linearGradient id={g('ph')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a4f7a" />
        <stop offset="1" stopColor="#151738" />
      </linearGradient>
      <linearGradient id={g('pn')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#eef0f8" />
      </linearGradient>
      <linearGradient id={g('in')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7c7ff2" />
        <stop offset="1" stopColor="#4338ca" />
      </linearGradient>
      <linearGradient id={g('vd')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#34d399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
      <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".5" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={g('mk')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4a4f7a" />
        <stop offset="1" stopColor="#1b1d44" />
      </linearGradient>
    </>
  )
}

/** Tilde blanco centrado en (x, y), del tamaño de un botón chico. */
function Tilde({ x, y, s = 1, color = '#fff', w = 1.6 }: { x: number; y: number; s?: number; color?: string; w?: number }) {
  return (
    <path
      d={`M${x - 2.6 * s} ${y + 0.2 * s}l${1.9 * s} ${1.9 * s} ${3.4 * s} -${3.8 * s}`}
      fill="none"
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

/* ------------------------------------------------------------------ */
/*  1 · INSCRIPCIÓN ONLINE                                             */
/* ------------------------------------------------------------------ */

/** Filas viejas de la bandeja de recepción: [y, color del avatar, ancho del nombre]. */
const FILAS_BANDEJA: [number, string, number][] = [
  [71, '#fbbf24', 34],
  [86, '#38bdf8', 28],
  [101, '#f472b6', 31],
]

/**
 * Un celular con la página de la academia y, al lado, la laptop de la recepción. La historia
 * (6,5 s): el alumno toca el curso «Inglés B1», el horario de las 19:00, escribe su nombre y
 * toca «Inscribirme» (el botón se vuelve verde). La solicitud sale volando como un sobre hacia
 * la laptop: las filas de la bandeja bajan, entra la de Lucía marcada «Nueva inscripción» y el
 * contador pasa de 3 a 4. Ahí asoma el aviso.
 */
export function EscenaFnInscripcionWeb() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-indigo-100 via-violet-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <Comunes g={g} />
          <linearGradient id={g('bs')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef0f7" />
            <stop offset="1" stopColor="#b9bdd8" />
          </linearGradient>
          <clipPath id={g('cs')}>
            <rect x="42" y="16" width="52" height="112" rx="8.5" />
          </clipPath>
          <clipPath id={g('cd')}>
            <rect x="125" y="57" width="150" height="61" rx="3" />
          </clipPath>
          {/* el nombre se «escribe»: esta ventana crece desde la izquierda a saltos */}
          <mask id={g('mt')} maskUnits="userSpaceOnUse" x="47" y="96" width="44" height="12">
            <rect className="esc-ac-iw-tipeo" x="48" y="96" width="38" height="12" fill="#fff" />
          </mask>
        </defs>

        <Plataforma id={id} />
        <Sombra cx={68} rx={34} />
        <Sombra cx={200} rx={84} cy={131} />

        <g className="esc-ac-flota">
          {/* ---------- laptop de la recepción ---------- */}
          <rect x="122" y="54" width="160" height="70" rx="6" fill="#151738" />
          <rect x="120" y="52" width="160" height="70" rx="6" fill={u('mk')} />
          <rect x="121" y="52.6" width="158" height="1.2" rx=".6" fill="#fff" opacity=".25" />
          <circle cx="200" cy="54.8" r=".9" fill="#64748b" />
          <rect x="125" y="57" width="150" height="61" rx="3" fill={u('pn')} />
          <path d="M110 122H290L297 128.5Q297 130.5 295 130.5H105Q103 130.5 103 128.5Z" fill={u('bs')} />
          <path d="M110 122H290L291.2 123.2H108.8Z" fill="#fff" opacity=".8" />
          <rect x="186" y="122" width="28" height="2" rx="1" fill="#9ca3c9" />

          <g clipPath={u('cd')}>
            {/* encabezado: título, quién lo ve y el contador de nuevas */}
            <rect x="125" y="57" width="150" height="11" fill="#f1f0fe" />
            <text x="131" y="64.6" fontSize="6.2" fontWeight="800" fill="#312e81">
              Inscripciones
            </text>
            <text x="261" y="64.4" textAnchor="end" fontSize="5.5" fontWeight="600" fill="#94a3b8">
              Recepción
            </text>
            <circle cx="268" cy="62.5" r="4.3" fill={u('in')} />
            <text className="esc-ac-iw-c3" x="268" y="64.5" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#fff">
              3
            </text>
            <text className="esc-ac-iw-c4" x="268" y="64.5" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#fff">
              4
            </text>
            <rect x="125" y="68" width="150" height=".8" fill="#e4e6f2" />

            {/* filas que ya estaban: bajan un lugar cuando entra la nueva */}
            <g className="esc-ac-iw-filas">
              {FILAS_BANDEJA.map(([y, c, w]) => (
                <g key={y}>
                  <rect x="129" y={y} width="142" height="13" rx="3.5" fill="#fff" stroke="#eceef6" strokeWidth=".8" />
                  <circle cx="137" cy={y + 6.5} r="3.8" fill={c} />
                  <rect x="144" y={y + 3.3} width={w} height="2.8" rx="1.4" fill="#cbd5e1" />
                  <rect x="144" y={y + 8} width="22" height="2.3" rx="1.15" fill="#e2e8f0" />
                  <rect x="230" y={y + 3} width="37" height="7" rx="3.5" fill="#d1fae5" />
                  <text x="248.5" y={y + 8.4} textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#047857">
                    Confirmada
                  </text>
                </g>
              ))}
            </g>

            {/* la inscripción que llega desde la página */}
            <g className="esc-ac-iw-nueva">
              <rect x="129" y="71" width="142" height="13" rx="3.5" fill="#eef2ff" stroke="#a5b4fc" strokeWidth=".9" />
              <rect x="129" y="71" width="2.6" height="13" rx="1.3" fill="#6366f1" />
              <circle cx="137.5" cy="77.5" r="3.9" fill={u('in')} />
              <text x="137.5" y="79.5" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
                L
              </text>
              <text x="144" y="76.6" fontSize="5.8" fontWeight="800" fill="#1e1b4b">
                Lucía Mamani
              </text>
              <text x="144" y="82.3" fontSize="5.5" fontWeight="600" fill="#6b7280">
                Inglés B1 · 19:00
              </text>
              <rect x="213" y="74" width="55" height="7.4" rx="3.7" fill={u('in')} />
              <text x="240.5" y="79.5" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
                Nueva inscripción
              </text>
            </g>
          </g>
          <rect className="esc-ac-iw-brillo" x="127.5" y="69.5" width="145" height="16" rx="4.5" fill="none" stroke="#818cf8" strokeWidth="1.4" />

          {/* ---------- el celular con la página de la academia ---------- */}
          <Celular x={38} u={u}>
            <g clipPath={u('cs')}>
              <rect x="42" y="16" width="52" height="24" fill={u('in')} />
              <rect x="47" y="21.5" width="10" height="2.6" rx="1.3" fill="#fff" opacity=".55" />
              <rect x="80" y="21" width="9" height="3.8" rx="1.4" fill="#fff" opacity=".55" />
              {/* birrete chiquito + título */}
              <path d="M51 30.2L55.5 28.4L60 30.2L55.5 32Z" fill="#fff" />
              <path d="M52.6 31v2q2.9 1.4 5.8 0v-2l-2.9 1.1z" fill="#c7d2fe" />
              <text x="62" y="33.6" fontSize="6.4" fontWeight="800" fill="#fff">
                Academia
              </text>
            </g>

            {/* cursos */}
            <text x="46" y="47.5" fontSize="5.5" fontWeight="700" fill="#94a3b8">
              Curso
            </text>
            {[
              [50, 'Inglés B1'],
              [62, 'Robótica'],
            ].map(([y, t]) => (
              <g key={t}>
                <rect x="46" y={y} width="44" height="10" rx="3" fill="#fff" stroke="#e2e5f0" strokeWidth=".8" />
                <circle cx="51" cy={Number(y) + 5} r="2.3" fill="none" stroke="#c3c8dc" strokeWidth=".9" />
                <text x="56" y={Number(y) + 7.1} fontSize="5.8" fontWeight="700" fill="#334155">
                  {t}
                </text>
              </g>
            ))}
            <g className="esc-ac-iw-sel1">
              <rect x="46" y="50" width="44" height="10" rx="3" fill="#eef2ff" stroke="#6366f1" strokeWidth="1" />
              <circle cx="51" cy="55" r="2.3" fill="#4f46e5" />
              <circle cx="51" cy="55" r=".9" fill="#fff" />
              <text x="56" y="57.1" fontSize="5.8" fontWeight="800" fill="#312e81">
                Inglés B1
              </text>
            </g>

            {/* horarios */}
            <text x="46" y="80" fontSize="5.5" fontWeight="700" fill="#94a3b8">
              Horario
            </text>
            {[
              [46, '15:00'],
              [68.5, '19:00'],
            ].map(([x, t]) => (
              <g key={t}>
                <rect x={x} y="83" width="21.5" height="9" rx="4.5" fill="#fff" stroke="#e2e5f0" strokeWidth=".8" />
                <text x={Number(x) + 10.75} y="89.4" textAnchor="middle" fontSize="5.6" fontWeight="700" fill="#475569">
                  {t}
                </text>
              </g>
            ))}
            <g className="esc-ac-iw-sel2">
              <rect x="68.5" y="83" width="21.5" height="9" rx="4.5" fill={u('in')} />
              <text x="79.25" y="89.4" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#fff">
                19:00
              </text>
            </g>

            {/* nombre: el texto de ayuda se va y el nombre se escribe con su cursor */}
            <rect x="46" y="96" width="44" height="11" rx="3" fill="#fff" stroke="#d6daea" strokeWidth=".8" />
            <text className="esc-ac-iw-ph" x="49" y="103.3" fontSize="5.6" fontWeight="600" fill="#b6bccf">
              Tu nombre
            </text>
            <g className="esc-ac-iw-nombre">
              <text x="49" y="103.3" fontSize="5.6" fontWeight="700" fill="#1e293b" mask={u('mt')}>
                Lucía Mamani
              </text>
            </g>
            <g className="esc-ac-iw-cursor">
              <rect className="esc-ac-parpadeo" x="49" y="98.5" width=".9" height="6.4" rx=".45" fill="#4f46e5" />
            </g>

            {/* botón: se hunde al tocarlo y queda verde con la solicitud enviada */}
            <g className="esc-ac-iw-boton">
              <rect x="46" y="111" width="44" height="12" rx="6" fill={u('in')} />
              <text x="68" y="119" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff">
                Inscribirme
              </text>
            </g>
            <g className="esc-ac-iw-listo">
              <rect x="46" y="111" width="44" height="12" rx="6" fill={u('vd')} />
              <Tilde x={53.8} y={117} s={0.8} w={1.4} />
              <text x="72" y="119" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff">
                Enviada
              </text>
            </g>

            <g clipPath={u('cs')}>
              <polygon points="42,16 70,16 42,58" fill={u('gl')} opacity=".6" />
            </g>
          </Celular>

          {/* la solicitud vuela del celular a la bandeja */}
          <g className="esc-ac-iw-sobre" style={v({ '--dx': '132px', '--dy': '-23px', '--pk': '-48px' })}>
            <rect x="59" y="95.2" width="18" height="12" rx="2" fill="#1e1b4b" opacity=".12" />
            <rect x="59" y="94" width="18" height="12" rx="2" fill="#fff" stroke="#c7d2fe" strokeWidth=".8" />
            <path d="M59.6 94.8L68 100.6L76.4 94.8" fill="none" stroke="#6366f1" strokeWidth="1.1" strokeLinejoin="round" />
          </g>

          <Dedo x={68} y={55} className="esc-ac-iw-dedo" />
        </g>
      </svg>
      <Aviso etiqueta="Inscripción online" texto="Lucía · Inglés B1" tono="violeta" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  2 · COBRO DE CUOTAS                                                */
/* ------------------------------------------------------------------ */

/** Módulos del QR (9 × 9): «1» oscuro; «.» va libre (ahí están los tres cuadros de las esquinas). */
const QR = ['....1....', '....0....', '....1....', '....1....', '101101011', '....01101', '....10110', '....11010', '....01011']
const QX = 51.8
const QY = 57
const QM = 2.6

/** Meses del estado de cuenta: [y de la fila, mes]. La última (noviembre) es la que se paga. */
const MESES: [number, string][] = [
  [70, 'Sep'],
  [85, 'Oct'],
  [100, 'Nov'],
]

/** Moneda verde con «Bs», dibujada en (x, y). */
function Moneda({ x, y }: { x: number; y: number }) {
  return (
    <>
      <circle cx={x + 0.6} cy={y + 1.2} r="5.6" fill="#064e3b" opacity=".18" />
      <circle cx={x} cy={y} r="5.6" fill="#10b981" />
      <circle cx={x} cy={y} r="4.3" fill="none" stroke="#fff" strokeWidth=".7" opacity=".6" />
      <text x={x} y={y + 2} textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
        Bs
      </text>
    </>
  )
}

/**
 * Un chat del celular con el recordatorio de la cuota y su QR; al lado, la tablet con el estado
 * de cuenta del alumno y la caja. La historia (6,5 s): llega el recordatorio, el alumno toca el
 * QR (una línea lo escanea y queda el tilde), responde «Pagado» y la moneda vuela a la fila de
 * noviembre: la pastilla ámbar «Vence» gira y queda verde «Pagada». Una segunda moneda entra a la
 * caja, que sube de Bs 4.200 a Bs 4.500. Ahí asoma el aviso.
 */
export function EscenaFnCuotas() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-indigo-100 via-violet-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <Comunes g={g} />
          <linearGradient id={g('ch')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#14b8a6" />
            <stop offset="1" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id={g('cj')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f5fb" />
            <stop offset="1" stopColor="#bfc3dc" />
          </linearGradient>
          <clipPath id={g('cs')}>
            <rect x="38" y="16" width="52" height="112" rx="8.5" />
          </clipPath>
          <clipPath id={g('cn')}>
            <rect x="241" y="81.5" width="48" height="10.5" />
          </clipPath>
        </defs>

        <Plataforma id={id} />
        <Sombra cx={64} rx={34} />
        <Sombra cx={164} rx={50} />
        <Sombra cx={264} rx={32} />

        <g className="esc-ac-flota">
          {/* ---------- el celular con el chat ---------- */}
          <Celular x={34} u={u}>
            <g clipPath={u('cs')}>
              <rect x="38" y="34" width="52" height="94" fill="#efeae2" />
              <rect x="38" y="16" width="52" height="18" fill={u('ch')} />
              <rect x="43" y="21.5" width="10" height="2.6" rx="1.3" fill="#fff" opacity=".55" />
              <rect x="76" y="21" width="9" height="3.8" rx="1.4" fill="#fff" opacity=".55" />
              <circle cx="46" cy="29" r="3.6" fill="#fff" />
              <path d="M43.6 28.6L46 27.6L48.4 28.6L46 29.6Z" fill="#4338ca" />
              <text x="52" y="31" fontSize="6" fontWeight="800" fill="#fff">
                Academia
              </text>
            </g>

            {/* recordatorio de la academia, con el QR */}
            <g className="esc-ac-cu-entra">
              <path d="M41 38h3v4z" fill="#fff" />
              <rect x="41" y="38" width="46.5" height="55" rx="4" fill="#fff" />
              <text x="44.5" y="45.8" fontSize="5.8" fontWeight="800" fill="#1e1b4b">
                Cuota Bs 300
              </text>
              <text x="44.5" y="52.6" fontSize="5.5" fontWeight="600" fill="#b45309">
                Vence el 25
              </text>
              <rect x={QX - 1.2} y={QY - 1.2} width={9 * QM + 2.4} height={9 * QM + 2.4} rx="1.4" fill="#fff" stroke="#e2e8f0" strokeWidth=".6" />
              {[
                [0, 0],
                [6, 0],
                [0, 6],
              ].map(([c, r]) => (
                <g key={`${c}${r}`}>
                  <rect x={QX + c * QM} y={QY + r * QM} width={3 * QM} height={3 * QM} rx=".8" fill="#1e1b4b" />
                  <rect x={QX + c * QM + 1.1} y={QY + r * QM + 1.1} width={3 * QM - 2.2} height={3 * QM - 2.2} rx=".4" fill="#fff" />
                  <rect x={QX + c * QM + 2.1} y={QY + r * QM + 2.1} width={3 * QM - 4.2} height={3 * QM - 4.2} fill="#1e1b4b" />
                </g>
              ))}
              {QR.flatMap((fila, r) =>
                [...fila].map((m, c) =>
                  m === '1' ? <rect key={`${r}-${c}`} x={QX + c * QM} y={QY + r * QM} width={QM} height={QM} fill="#1e1b4b" /> : null,
                ),
              )}
              <text x="63.5" y="89" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#64748b">
                Pagá con QR
              </text>
              {/* escaneo y tilde de pagado sobre el QR */}
              <rect className="esc-ac-cu-scan" x={QX - 1} y={QY} width={9 * QM + 2} height="1.6" rx=".8" fill="#10b981" />
              <g className="esc-ac-cu-qrok">
                <circle cx="63.5" cy="68.7" r="8" fill="#fff" />
                <circle cx="63.5" cy="68.7" r="6.6" fill="#10b981" />
                <Tilde x={63.5} y={68.6} s={1.05} w={1.7} />
              </g>
            </g>

            {/* respuesta del alumno */}
            <g className="esc-ac-cu-sale">
              <path d="M87 97h-3v4z" fill="#d9fdd3" />
              <rect x="50" y="97" width="37" height="11" rx="3.5" fill="#d9fdd3" />
              <text x="53" y="104.4" fontSize="5.8" fontWeight="700" fill="#14532d">
                Pagado
              </text>
              <path d="M77.4 102.6l1.3 1.3 2.4-2.7M80.2 102.6l1.3 1.3 2.4-2.7" fill="none" stroke="#3b82f6" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* barra para escribir */}
            <rect x="41" y="114.5" width="37" height="10" rx="5" fill="#fff" />
            <rect x="45" y="118.6" width="16" height="2" rx="1" fill="#d6d3cc" />
            <circle cx="83.5" cy="119.5" r="4.6" fill={u('ch')} />
            <rect x="82.7" y="117" width="1.6" height="3.4" rx=".8" fill="#fff" />
            <g clipPath={u('cs')}>
              <polygon points="38,16 66,16 38,58" fill={u('gl')} opacity=".5" />
            </g>
          </Celular>

          {/* ---------- tablet con el estado de cuenta ---------- */}
          <rect x="108" y="46" width="116" height="80" rx="8" fill="#151738" />
          <rect x="106" y="44" width="116" height="80" rx="8" fill={u('mk')} />
          <rect x="107" y="44.6" width="114" height="1.2" rx=".6" fill="#fff" opacity=".25" />
          <rect x="110" y="48" width="108" height="72" rx="4.5" fill={u('pn')} />
          <text x="116" y="57.5" fontSize="6.2" fontWeight="800" fill="#1e1b4b">
            Estado de cuenta
          </text>
          <text x="116" y="64.6" fontSize="5.5" fontWeight="600" fill="#94a3b8">
            Lucía Mamani · Inglés B1
          </text>
          {MESES.map(([y, mes], i) => (
            <g key={mes}>
              <rect x="114" y={y} width="100" height="13" rx="3.5" fill="#fff" stroke="#eceef6" strokeWidth=".8" />
              <text x="119" y={y + 8.6} fontSize="6" fontWeight="800" fill="#334155">
                {mes}
              </text>
              <text x="140" y={y + 8.6} fontSize="5.8" fontWeight="600" fill="#64748b">
                Bs 300
              </text>
              {i < 2 && (
                <>
                  <rect x="180" y={y + 2.5} width="30" height="8" rx="4" fill="#d1fae5" />
                  <text x="195" y={y + 8.2} textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#047857">
                    Pagada
                  </text>
                </>
              )}
            </g>
          ))}
          {/* noviembre: brillo verde al pagarse, y la pastilla que gira de ámbar a verde */}
          <rect className="esc-ac-cu-brillo" x="114" y="100" width="100" height="13" rx="3.5" fill="#ecfdf5" stroke="#34d399" strokeWidth="1" />
          <text className="esc-ac-cu-brillo" x="119" y="108.6" fontSize="6" fontWeight="800" fill="#334155">
            Nov
          </text>
          <text className="esc-ac-cu-brillo" x="140" y="108.6" fontSize="5.8" fontWeight="600" fill="#64748b">
            Bs 300
          </text>
          <g className="esc-ac-cu-vence">
            <rect x="180" y="102.5" width="30" height="8" rx="4" fill="#fef3c7" />
            <circle cx="185" cy="106.5" r="1.3" fill="#f59e0b" />
            <text x="197" y="108.2" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#b45309">
              Vence
            </text>
          </g>
          <g className="esc-ac-cu-pagada">
            <rect x="180" y="102.5" width="30" height="8" rx="4" fill="#10b981" />
            <text x="195" y="108.2" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
              Pagada
            </text>
          </g>

          {/* ---------- la caja ---------- */}
          <path d="M234 104H294L298 128Q298 130 296 130H232Q230 130 230 128Z" fill={u('cj')} />
          <path d="M234 104H294L294.4 106H233.6Z" fill="#fff" opacity=".85" />
          <rect x="236" y="118" width="56" height="2" rx="1" fill="#a3a8c8" />
          {[0, 1, 2, 3].map((c) => (
            <g key={c}>
              <rect x={240 + c * 12.5} y="108.5" width="9.5" height="3.2" rx="1" fill="#d5d8ea" />
              <rect x={240 + c * 12.5} y="113" width="9.5" height="3.2" rx="1" fill="#d5d8ea" />
            </g>
          ))}
          <rect x="259" y="96" width="10" height="8" fill="#9ca1c4" />
          <rect x="236" y="68" width="56" height="28" rx="5" fill={u('mk')} />
          <rect x="239" y="71" width="50" height="22" rx="3" fill="#24265a" />
          <text x="243" y="78.6" fontSize="5.5" fontWeight="800" letterSpacing=".5" fill="#a5b4fc">
            CAJA
          </text>
          <g clipPath={u('cn')}>
            <g className="esc-ac-cu-tira">
              {['Bs 4.200', 'Bs 4.500'].map((t, i) => (
                <text key={t} x="243" y={89.8 + i * 12} fontSize="8.4" fontWeight="800" fill={i ? '#6ee7b7' : '#fff'}>
                  {t}
                </text>
              ))}
            </g>
          </g>
          <rect className="esc-ac-cu-aro" x="234" y="66" width="60" height="32" rx="7" fill="none" stroke="#34d399" strokeWidth="1.6" />
          <text className="esc-ac-cu-suma" x="264" y="62" textAnchor="middle" fontSize="6.6" fontWeight="800" fill="#059669">
            + Bs 300
          </text>

          {/* monedas: del chat a noviembre, y de noviembre a la caja */}
          <g className="esc-ac-cu-moneda1" style={v({ '--dx': '124px', '--dy': '4px', '--pk': '-40px' })}>
            <Moneda x={71} y={102.5} />
          </g>
          <g className="esc-ac-cu-moneda2" style={v({ '--dx': '68px', '--dy': '-22px', '--pk': '-34px' })}>
            <Moneda x={196} y={106.5} />
          </g>

          <Dedo x={63.5} y={69} className="esc-ac-cu-dedo" />
        </g>
      </svg>
      <Aviso etiqueta="Cuota pagada" texto="Bs 300 · Noviembre" tono="verde" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  3 · GRUPOS Y HORARIOS                                              */
/* ------------------------------------------------------------------ */

type Tono = { fondo: string; barra: string; tinta: string }
const T: Record<string, Tono> = {
  indigo: { fondo: '#e0e7ff', barra: '#6366f1', tinta: '#312e81' },
  ambar: { fondo: '#fef3c7', barra: '#f59e0b', tinta: '#78350f' },
  cielo: { fondo: '#e0f2fe', barra: '#0ea5e9', tinta: '#0c4a6e' },
  rosa: { fondo: '#fce7f3', barra: '#ec4899', tinta: '#831843' },
  violeta: { fondo: '#ede9fe', barra: '#8b5cf6', tinta: '#4c1d95' },
  verde: { fondo: '#d1fae5', barra: '#10b981', tinta: '#064e3b' },
}

/** Geometría del calendario: columnas de 35 desde x 52 y franjas de 22 desde y 39. */
const COL0 = 52
const ANCHO = 35
const FRANJAS: [number, string][] = [
  [39, 'Mañana'],
  [62, 'Tarde'],
  [85, 'Noche'],
]
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']

/** Grupos que ya existen: [columna, franja, curso, aula, inicial del docente, tono]. */
const GRUPOS: [number, number, string, string, string, keyof typeof T][] = [
  [0, 0, 'Inglés A1', 'Aula 1', 'R', 'indigo'],
  [2, 0, 'Cálculo', 'Aula 2', 'J', 'ambar'],
  [3, 0, 'Francés', 'Aula 3', 'M', 'cielo'],
  [4, 0, 'Inglés A1', 'Aula 1', 'R', 'indigo'],
  [1, 1, 'Francés', 'Aula 1', 'M', 'cielo'],
  [3, 1, 'Dibujo', 'Aula 3', 'P', 'rosa'],
  [4, 1, 'Cálculo', 'Aula 2', 'J', 'ambar'],
  [0, 2, 'Oratoria', 'Aula 2', 'C', 'violeta'],
  [2, 2, 'Inglés B1', 'Aula 1', 'R', 'indigo'],
]

/** Bloque de un grupo dentro de su celda (curso, aula y el avatar del docente). */
function Bloque({ col, franja, curso, aula, ini, t }: { col: number; franja: number; curso: string; aula: string; ini: string; t: Tono }) {
  const x = COL0 + col * ANCHO + 1.5
  const y = FRANJAS[franja][0] + 1.5
  return (
    <>
      <rect x={x} y={y} width="32" height="19" rx="3" fill={t.fondo} />
      <rect x={x} y={y} width="2.4" height="19" rx="1.2" fill={t.barra} />
      <text x={x + 4.8} y={y + 7.8} fontSize="5.6" fontWeight="800" fill={t.tinta}>
        {curso}
      </text>
      <text x={x + 4.8} y={y + 15.2} fontSize="5.5" fontWeight="600" fill={t.tinta} opacity=".7">
        {aula}
      </text>
      <circle cx={x + 27.2} cy={y + 13.2} r="3.5" fill={t.barra} />
      <text x={x + 27.2} y={y + 15.2} textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
        {ini}
      </text>
    </>
  )
}

/** Desfase de `k` pasos de `paso` segundos, con delay negativo para que el bucle no dé tirón. */
const desfase = (k: number, paso: number) => (k === 0 ? '0s' : `${(k * paso - 6.5).toFixed(3)}s`)

/** Asientos del grupo nuevo: 5 × 4; los primeros 12 se ocupan. */
const ASIENTOS = Array.from({ length: 20 }, (_, i) => [250 + (i % 5) * 11.5, 88 + Math.floor(i / 5) * 9.5] as const)

/**
 * Un monitor con el calendario semanal: franjas mañana/tarde/noche y los grupos de colores (curso,
 * aula y docente) que se arman uno tras otro. La historia (6,5 s): el dedo toca el hueco «Libre»
 * del jueves a la noche, ahí se abre «Robótica» y a la derecha aparece la ficha del grupo; los
 * asientos se van ocupando uno por uno y el contador sube hasta 12/20. Sin aviso: la ficha ya es
 * el remate (y un aviso arriba tapaba el calendario).
 */
export function EscenaFnGrupos() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`
  const nuevo = { x: COL0 + 3 * ANCHO + 1.5, y: FRANJAS[2][0] + 1.5 }

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-indigo-100 via-violet-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <Comunes g={g} />
          <linearGradient id={g('pi')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c9cce6" />
            <stop offset="1" stopColor="#8f94bf" />
          </linearGradient>
          <clipPath id={g('cc')}>
            <rect x="262" y="67.2" width="40" height="9.6" />
          </clipPath>
          <clipPath id={g('cf')}>
            <rect x="240" y="24" width="66" height="102" rx="8" />
          </clipPath>
        </defs>

        <Plataforma id={id} />
        <Sombra cx={123} rx={40} cy={133} />
        <Sombra cx={273} rx={30} />

        <g className="esc-ac-flota">
          {/* ---------- monitor con el calendario ---------- */}
          <path d="M112 112H134L138 124H108Z" fill={u('pi')} />
          <ellipse cx="123" cy="126" rx="30" ry="4.4" fill="#a1a6cc" />
          <ellipse cx="123" cy="124.6" rx="30" ry="4.4" fill="#e3e5f3" />
          <rect x="16" y="14" width="218" height="100" rx="8" fill="#151738" />
          <rect x="14" y="12" width="218" height="100" rx="8" fill={u('mk')} />
          <rect x="15" y="12.6" width="216" height="1.2" rx=".6" fill="#fff" opacity=".25" />
          <rect x="19" y="17" width="208" height="91" rx="4" fill={u('pn')} />

          <text x="25" y="26.2" fontSize="6.6" fontWeight="800" fill="#1e1b4b">
            Horarios
          </text>
          <text x="221" y="26" textAnchor="end" fontSize="5.5" fontWeight="600" fill="#94a3b8">
            Semana 47
          </text>
          {DIAS.map((d, i) => (
            <text key={d} x={COL0 + i * ANCHO + ANCHO / 2} y="35.6" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#64748b">
              {d}
            </text>
          ))}
          {FRANJAS.map(([y, f]) => (
            <g key={f}>
              <rect x="20" y={y} width="206" height=".7" fill="#e4e6f2" />
              <text x="23" y={y + 13} fontSize="5.5" fontWeight="700" fill="#94a3b8">
                {f}
              </text>
              {DIAS.map((d, i) => (
                <rect key={d} x={COL0 + i * ANCHO + 1.5} y={y + 1.5} width="32" height="19" rx="3" fill="#f4f5fa" />
              ))}
            </g>
          ))}

          {/* los grupos que ya existen: se arman uno tras otro */}
          {GRUPOS.map(([col, franja, curso, aula, ini, t], k) => (
            <g key={`${col}${franja}`} className="esc-ac-gr-bloque" style={v({ '--d': desfase(k, 0.13) })}>
              <Bloque col={col} franja={franja} curso={curso} aula={aula} ini={ini} t={T[t]} />
            </g>
          ))}

          {/* el hueco libre del jueves a la noche y el grupo nuevo que lo ocupa */}
          <g className="esc-ac-gr-libre">
            <rect x={nuevo.x} y={nuevo.y} width="32" height="19" rx="3" fill="#fff" stroke="#a5b4fc" strokeWidth=".9" strokeDasharray="2.2 1.6" />
            <text x={nuevo.x + 16} y={nuevo.y + 12} textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#818cf8">
              + Libre
            </text>
          </g>
          <g className="esc-ac-gr-nuevo">
            <Bloque col={3} franja={2} curso="Robótica" aula="Aula 3" ini="D" t={T.verde} />
          </g>
          <rect className="esc-ac-gr-aro" x={nuevo.x - 1.5} y={nuevo.y - 1.5} width="35" height="22" rx="4" fill="none" stroke="#10b981" strokeWidth="1.4" />

          {/* ---------- ficha del grupo nuevo ---------- */}
          {/* mientras no hay grupo, un lugar vacío punteado (equilibra la escena) */}
          <g className="esc-ac-gr-vacia">
            <rect x="240" y="24" width="66" height="102" rx="8" fill="#fff" opacity=".45" stroke="#a5b4fc" strokeWidth=".9" strokeDasharray="3 2.2" />
            <circle cx="273" cy="66" r="8" fill="#eef2ff" />
            <path d="M273 62v8M269 66h8" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" />
            <text x="273" y="85" textAnchor="middle" fontSize="5.8" fontWeight="800" fill="#818cf8">
              Nuevo grupo
            </text>
          </g>
          <g className="esc-ac-gr-ficha">
            <rect x="241.5" y="26" width="66" height="102" rx="8" fill="#1e1b4b" opacity=".1" />
            <rect x="240" y="24" width="66" height="102" rx="8" fill="#fff" />
            <g clipPath={u('cf')}>
              <rect x="240" y="24" width="66" height="24" fill={u('vd')} />
            </g>
            <text x="246" y="33" fontSize="5.5" fontWeight="700" fill="#d1fae5">
              Grupo nuevo
            </text>
            <text x="246" y="43" fontSize="7.4" fontWeight="800" fill="#fff">
              Robótica
            </text>
            <text x="246" y="56" fontSize="5.6" fontWeight="800" fill="#334155">
              Jue 19:00 · Aula 3
            </text>
            <circle cx="249" cy="62.4" r="2.8" fill="#10b981" />
            <text x="254" y="64.4" fontSize="5.5" fontWeight="600" fill="#64748b">
              Prof. Daniel
            </text>
            <text x="246" y="74.6" fontSize="5.5" fontWeight="700" fill="#94a3b8">
              Cupos
            </text>
            <g clipPath={u('cc')}>
              <g className="esc-ac-gr-tira">
                {Array.from({ length: 13 }, (_, n) => (
                  <text key={n} x="300" y={74.8 + n * 10} textAnchor="end" fontSize="7.4" fontWeight="800" fill="#064e3b">
                    {n}/20
                  </text>
                ))}
              </g>
            </g>
            <rect x="246" y="78" width="54" height="3" rx="1.5" fill="#e2e8f0" />
            <rect className="esc-ac-gr-barra" x="246" y="78" width="32.4" height="3" rx="1.5" fill="#10b981" />
            {ASIENTOS.map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="3.4" fill="#f1f5f9" stroke="#d3d8e4" strokeWidth=".7" />
                {i < 12 && (
                  <g className="esc-ac-gr-asiento" style={v({ '--d': desfase(i, 0.169) })}>
                    <circle cx={cx} cy={cy} r="3.4" fill="#10b981" />
                    <circle cx={cx} cy={cy - 1} r="1.15" fill="#fff" />
                    <path d={`M${cx - 1.9} ${cy + 2.3}Q${cx} ${cy - 0.1} ${cx + 1.9} ${cy + 2.3}`} fill="#fff" />
                  </g>
                )}
              </g>
            ))}
          </g>

          <Dedo x={nuevo.x + 24} y={nuevo.y + 13} className="esc-ac-gr-dedo" />
        </g>
      </svg>
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  4 · LISTA DE ASISTENCIA                                            */
/* ------------------------------------------------------------------ */

/** Alumnos de la lista: [nombre, color del avatar, presente]. */
const ALUMNOS: [string, string, boolean][] = [
  ['Lucía M.', '#fbbf24', true],
  ['Diego R.', '#38bdf8', true],
  ['Sofía P.', '#f472b6', false],
  ['Mateo C.', '#a78bfa', true],
  ['Valeria T.', '#34d399', true],
]
const FILA0 = 42
const PASO = 12.5

/** Arco de circunferencia (grados, 0° = arriba, en sentido horario): los tramos del aro. */
function arco(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => {
    const t = ((a - 90) * Math.PI) / 180
    return `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * Math.sin(t)).toFixed(2)}`
  }
  return `M${p(a0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`
}
/** Cinco tramos del aro (uno por alumno), con 5° de hueco y extremos rectos (los redondos se pisaban). */
const TRAMOS = [0, 1, 2, 3, 4].map((i) => [i * 72 + 2.5, i * 72 + 69.5] as const)

/**
 * Una tablet con la lista del grupo y, al lado, la tarjeta del porcentaje de asistencia. La
 * historia (6,5 s): el docente marca a cada alumno —cuatro ✓ presentes y un ✗ ausente—; por cada
 * presente se enciende un tramo verde del aro y el porcentaje sube (0 → 80 %); el ausente pinta
 * su tramo de rojo claro. Toca «Guardar lista», el botón queda verde y asoma el aviso.
 */
export function EscenaFnAsistencia() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-indigo-100 via-violet-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <Comunes g={g} />
          <clipPath id={g('ct')}>
            <rect x="33" y="21" width="140" height="98" rx="5" />
          </clipPath>
          <clipPath id={g('cp')}>
            <rect x="218" y="86.5" width="42" height="13" />
          </clipPath>
        </defs>

        <Plataforma id={id} />
        <Sombra cx={103} rx={56} />
        <Sombra cx={239} rx={34} />

        <g className="esc-ac-flota">
          {/* ---------- tablet del docente ---------- */}
          <rect x="30" y="18" width="150" height="108" rx="9" fill="#151738" />
          <rect x="28" y="16" width="150" height="108" rx="9" fill={u('mk')} />
          <rect x="29" y="16.6" width="148" height="1.2" rx=".6" fill="#fff" opacity=".25" />
          <rect x="33" y="21" width="140" height="98" rx="5" fill={u('pn')} />
          <g clipPath={u('ct')}>
            <rect x="33" y="21" width="140" height="18" fill={u('in')} />
            <polygon points="33,21 80,21 33,60" fill={u('gl')} opacity=".35" />
          </g>
          <text x="39" y="29.6" fontSize="6.6" fontWeight="800" fill="#fff">
            Inglés B1
          </text>
          <text x="39" y="36.2" fontSize="5.5" fontWeight="600" fill="#c7d2fe">
            Lun 19:00 · Aula 1
          </text>

          {ALUMNOS.map(([nombre, c, presente], i) => {
            const y = FILA0 + i * PASO
            const cy = y + 5.5
            return (
              <g key={nombre}>
                <rect x="36" y={y} width="134" height="11" rx="3" fill={i % 2 ? '#f6f7fb' : '#fff'} />
                <circle cx="42" cy={cy} r="3.6" fill={c} />
                <circle cx="42" cy={cy - 1} r="1.2" fill="#fff" opacity=".85" />
                <path d={`M39.9 ${cy + 2.5}Q42 ${cy + 0.2} 44.1 ${cy + 2.5}`} fill="#fff" opacity=".85" />
                <text x="49" y={y + 7.6} fontSize="6" fontWeight="700" fill="#1e293b">
                  {nombre}
                </text>
                {/* botones sin marcar */}
                <circle cx="150" cy={cy} r="4.3" fill="#fff" stroke="#d3d8e4" strokeWidth=".8" />
                <Tilde x={150} y={cy} s={0.62} color="#b6bccf" w={1.1} />
                <circle cx="162" cy={cy} r="4.3" fill="#fff" stroke="#d3d8e4" strokeWidth=".8" />
                <path d={`M160.4 ${cy - 1.6}l3.2 3.2m0 -3.2l-3.2 3.2`} stroke="#b6bccf" strokeWidth="1.1" strokeLinecap="round" />
                {/* la marca que pone el docente */}
                <g className={`esc-ac-as-m${i}`}>
                  {presente ? (
                    <>
                      <circle cx="150" cy={cy} r="4.5" fill="#10b981" />
                      <Tilde x={150} y={cy} s={0.66} w={1.3} />
                    </>
                  ) : (
                    <>
                      <circle cx="162" cy={cy} r="4.5" fill="#ef4444" />
                      <path d={`M160.3 ${cy - 1.7}l3.4 3.4m0 -3.4l-3.4 3.4`} stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
                    </>
                  )}
                </g>
              </g>
            )
          })}

          <text x="39" y="113" fontSize="5.5" fontWeight="600" fill="#94a3b8">
            5 alumnos
          </text>
          <g className="esc-ac-as-boton">
            <rect x="117" y="106" width="50" height="10" rx="5" fill={u('in')} />
            <text x="142" y="112.9" textAnchor="middle" fontSize="5.8" fontWeight="800" fill="#fff">
              Guardar lista
            </text>
          </g>
          <g className="esc-ac-as-listo">
            <rect x="117" y="106" width="50" height="10" rx="5" fill={u('vd')} />
            <Tilde x={126.5} y={111} s={0.7} w={1.3} />
            <text x="145" y="112.9" textAnchor="middle" fontSize="5.8" fontWeight="800" fill="#fff">
              Guardada
            </text>
          </g>

          {/* ---------- tarjeta del porcentaje ---------- */}
          <rect x="197.5" y="54" width="84" height="73" rx="9" fill="#1e1b4b" opacity=".1" />
          <rect x="196" y="52" width="84" height="73" rx="9" fill="#fff" />
          <text x="238" y="64" textAnchor="middle" fontSize="6.2" fontWeight="800" fill="#475569">
            Asistencia
          </text>
          <circle cx="238" cy="92" r="20" fill="none" stroke="#eceef8" strokeWidth="6.5" />
          {TRAMOS.map(([a0, a1], i) => (
            <path key={i} d={arco(238, 92, 20, a0, a1)} fill="none" stroke="#e2e5f3" strokeWidth="6.5" />
          ))}
          {/* los cuatro presentes encienden su tramo en verde; el ausente, en rojo claro */}
          {TRAMOS.map(([a0, a1], i) => (
            <path
              key={`t${i}`}
              className={`esc-ac-as-tramo esc-ac-as-t${i}`}
              d={arco(238, 92, 20, a0, a1)}
              fill="none"
              stroke={i === 4 ? '#fca5a5' : '#10b981'}
              strokeWidth="6.5"
            />
          ))}
          <g clipPath={u('cp')}>
            <g className="esc-ac-as-tira">
              {['0%', '20%', '40%', '60%', '80%'].map((t, i) => (
                <text key={t} x="238" y={96.4 + i * 13} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e1b4b">
                  {t}
                </text>
              ))}
            </g>
          </g>
          <text x="238" y="121" textAnchor="middle" fontSize="5.5" fontWeight="600" fill="#94a3b8">
            del grupo
          </text>
          <circle className="esc-ac-as-aro" cx="238" cy="92" r="25" fill="none" stroke="#34d399" strokeWidth="1.6" />

          <Dedo x={150} y={FILA0 + 5.5} className="esc-ac-as-dedo" />
        </g>
      </svg>
      <Aviso etiqueta="Lista guardada" texto="4 de 5 presentes" tono="violeta" />
    </Marco>
  )
}
