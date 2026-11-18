import './EscenasFuncionesA.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de las tarjetas de «Funciones», archivo A: vender sin internet,
  inventario y delivery/recojo. A diferencia de las escenas de rubros, el héroe no es un
  negocio sino la pieza de interfaz de la función (celular, estante con tablero, mapa).
  Mismo lenguaje: plataforma con sombra de contacto, luz arriba-izquierda, degradés suaves
  y paleta acotada. Todo se mueve con CSS (sólo transform y opacity) y los keyframes
  `esc-fa-*` viven en EscenasFuncionesA.css.

  Las tres comparten el ciclo de 6,5 s del <Aviso> (esc-chip), que asoma al 10 %: la acción
  que lo «causa» cae justo antes. No uso `transform=""` como atributo SVG en ningún lado
  (la regla global `.escena svg *` le cambiaría el pivote): las posiciones van absolutas.
*/

/** Desfase de `k` pasos de 7 % del ciclo (0,455 s), con delay negativo para que el bucle no dé tirón. */
const retraso = (k: number) => (k === 0 ? '0s' : `${(k * 0.455 - 6.5).toFixed(3)}s`)

/** Plataforma común: losa elíptica con canto, luz y una sombra ancha difusa (los objetos ponen la suya). */
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

/* ------------------------------------------------------------------ */
/*  1 · VENDÉ SIN INTERNET                                             */
/* ------------------------------------------------------------------ */

/** Ícono de wifi (tres arcos y un punto) centrado en (50, 88); el color lo pone quien lo usa. */
function Wifi({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="3.1" strokeLinecap="round">
      <path d="M38.7 76.7A16 16 0 0 1 61.3 76.7" />
      <path d="M42.6 80.6A10.5 10.5 0 0 1 57.4 80.6" />
      <path d="M46.1 84.1A5.5 5.5 0 0 1 53.9 84.1" />
      <circle cx="50" cy="88" r="1.7" fill={color} stroke="none" />
    </g>
  )
}

/** Silueta de nube (cuerpo + tres lóbulos) desplazable, para dibujar también su sombra. */
function nube(dx: number, dy: number, fill: string) {
  return (
    <g fill={fill}>
      <rect x={226 + dx} y={84 + dy} width="70" height="20" rx="10" />
      <circle cx={246 + dx} cy={84 + dy} r="14" />
      <circle cx={266 + dx} cy={78 + dy} r="18" />
      <circle cx={284 + dx} cy={88 + dy} r="11" />
    </g>
  )
}

/** Tickets en cola: [y, recorrido a su casilla de la nube (dx, dy), altura del punto alto del arco]. */
const TICKETS = [
  { y: 90, dx: 58, dy: -2, pk: -40 },
  { y: 105, dx: 75, dy: -17, pk: -48 },
  { y: 120, dx: 92, dy: -32, pk: -56 },
]
/** Centros (x) de las tres casillas de la nube. */
const CASILLAS = [245, 262, 279]

/**
 * Un celular con la pantalla de venta. A la izquierda, el wifi; a la derecha, una bandeja y
 * una nube. La historia (6,5 s): la señal se corta (el wifi se tacha y el chip de la pantalla
 * pasa a ámbar) pero la venta SIGUE: se cobran tres ventas y cada una cae como ticket
 * pendiente (punto ámbar) en la bandeja. Vuelve la señal y los tres tickets salen en arco
 * hacia la nube, uno tras otro; al llegar, cada uno se vuelve verde ✓. El último tilde
 * enciende el aviso «Sincronizado».
 */
export function EscenaFnOffline() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-emerald-100 via-teal-50 to-white">
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('ph')} x1="0" y1="0" x2="1" y2="1">
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
          <linearGradient id={g('bd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e6edf5" />
          </linearGradient>
          <linearGradient id={g('cl')} gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="104">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#c2d5ea" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cs')}>
            <rect x="94" y="16" width="56" height="114" rx="8.5" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#86cdb8" luz={['#e2f6ee', '#b9e5d6']} sombra="#064e3b" />
        {/* sombras de contacto: celular, bandeja y el distintivo del wifi (que flota) */}
        <ellipse cx="122" cy="135" rx="56" ry="7" fill="#064e3b" opacity=".06" />
        <ellipse cx="122" cy="135" rx="40" ry="4.5" fill="#064e3b" opacity=".16" />
        <ellipse cx="187" cy="135" rx="26" ry="3" fill="#064e3b" opacity=".1" />
        <ellipse cx="50" cy="134" rx="18" ry="3" fill="#064e3b" opacity=".08" />

        <g className="esc-fa-flota">
          {/* ---------- distintivo del wifi ---------- */}
          <circle cx="52" cy="83" r="22" fill="#064e3b" opacity=".12" />
          <circle cx="50" cy="80" r="22" fill={u('bd')} />
          <circle cx="50" cy="80" r="21.2" fill="none" stroke="#fff" strokeWidth="1" opacity=".9" />
          <circle className="esc-fa-alerta" cx="50" cy="80" r="23.5" fill="none" stroke="#f87171" strokeWidth="2" />
          <Wifi color="#a9b6c7" />
          <g className="esc-fa-senal">
            <Wifi color="#10b981" />
          </g>
          {/* tacha: trazo blanco debajo para que se lea sobre el ícono; se dibuja desde arriba-izquierda */}
          <line className="esc-fa-tacha" x1="36" y1="66" x2="64" y2="94" stroke="#fff" strokeWidth="6.4" strokeLinecap="round" />
          <line className="esc-fa-tacha" x1="36" y1="66" x2="64" y2="94" stroke="#ef4444" strokeWidth="3.2" strokeLinecap="round" />

          {/* ---------- bandeja de ventas pendientes ---------- */}
          <rect x="164" y="86" width="46" height="48" rx="9" fill="#fff" opacity=".5" />
          <rect x="164.5" y="86.5" width="45" height="47" rx="8.5" fill="none" stroke="#fff" opacity=".9" />

          {/* ---------- el celular ---------- */}
          <rect x="90" y="12" width="64" height="122" rx="11" fill={u('ph')} />
          <rect x="90.7" y="24" width="1.4" height="96" rx=".7" fill="#fff" opacity=".22" />
          <rect x="153.4" y="40" width="1.8" height="14" rx=".9" fill="#1e293b" />
          <rect x="94" y="16" width="56" height="114" rx="8.5" fill={u('pn')} />

          {/* barra de estado y cámara */}
          <rect x="99" y="21.5" width="11" height="3" rx="1.5" fill="#a3b0c2" />
          <rect x="134" y="21" width="11" height="4.6" rx="1.6" fill="#a3b0c2" />
          <rect x="114" y="18.4" width="16" height="3.6" rx="1.8" fill="#0f172a" />

          {/* chip de conexión: verde en línea; ámbar (encima) sin red */}
          <rect x="98" y="30" width="34" height="10" rx="5" fill="#d1fae5" />
          <circle cx="104" cy="35" r="2.2" fill="#10b981" />
          <rect x="109" y="33.5" width="17" height="3" rx="1.5" fill="#6ee7b7" />
          <g className="esc-fa-sinred">
            <rect x="98" y="30" width="34" height="10" rx="5" fill="#fef3c7" />
            <circle cx="104" cy="35" r="2.2" fill="#f59e0b" />
            <rect x="109" y="33.5" width="17" height="3" rx="1.5" fill="#fcd34d" />
          </g>
          <circle cx="139" cy="35" r="5" fill="#cbd5e1" />

          {/* renglones del pedido */}
          {[45, 62, 79].map((y, i) => (
            <g key={y}>
              <rect x="98" y={y} width="48" height="14" rx="5" fill="#f1f5f9" />
              <rect x="102" y={y + 2.5} width="9" height="9" rx="2.6" fill={['#fbbf24', '#2dd4bf', '#fb7185'][i]} />
              <rect x="115" y={y + 3.5} width="20" height="3" rx="1.5" fill="#94a3b8" />
              <rect x="115" y={y + 8} width="12" height="2.4" rx="1.2" fill="#cbd5e1" />
              <rect x="138" y={y + 5.5} width="5" height="3" rx="1.5" fill="#64748b" />
            </g>
          ))}

          {/* total y botón de cobro */}
          <rect x="98" y="99" width="14" height="2.6" rx="1.3" fill="#cbd5e1" />
          <text x="98" y="113" fontSize="11" fontWeight="800" fill="#0f172a">
            Bs 48
          </text>
          <g className="esc-fa-cobrado">
            <circle cx="138" cy="108" r="6.2" fill="#10b981" />
            <path d="M135.2 108.2l2 2 3.8-4.2" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g className="esc-fa-toque">
            <rect x="98" y="117" width="48" height="11" rx="5.5" fill={u('bt')} />
            <text x="122.5" y="124.8" textAnchor="middle" fontSize="6.8" fontWeight="800" letterSpacing=".6" fill="#fff">
              COBRAR
            </text>
          </g>
          {/* reflejo de vidrio, recortado a la pantalla */}
          <g clipPath={u('cs')}>
            <polygon points="94,16 122,16 94,62" fill={u('gl')} />
          </g>

          {/* ---------- la nube ---------- */}
          <g className="esc-fa-nube">
            {nube(2, 3, 'rgba(15,118,110,.14)')}
            {nube(0, 0, u('cl'))}
            <path d="M266 85V70M259.5 76.5L266 70L272.5 76.5" fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {CASILLAS.map((x, i) => (
              <g key={x}>
                <circle cx={x} cy="94" r="6.5" fill="#e3edf6" />
                <g className="esc-fa-slot" style={{ animationDelay: retraso(i) }}>
                  <circle cx={x} cy="94" r="6.5" fill="#10b981" />
                  <path d={`M${x - 3} 94.2l2.4 2.4 4-4.4`} fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            ))}
          </g>
          <ellipse className="esc-fa-aro" cx="261" cy="82" rx="40" ry="26" fill="none" stroke="#34d399" strokeWidth="2" />

          {/* ---------- tickets de ventas (ámbar = pendiente; verde al sincronizar) ---------- */}
          {TICKETS.map((t, i) => (
            <g
              key={t.y}
              className="esc-fa-tk"
              style={{ ...v({ '--dx': `${t.dx}px`, '--dy': `${t.dy}px`, '--pk': `${t.pk}px` }), animationDelay: retraso(i) }}
            >
              <rect x="168" y={t.y + 1.2} width="38" height="12" rx="3.6" fill="#064e3b" opacity=".1" />
              <rect x="168" y={t.y} width="38" height="12" rx="3.6" fill="#fff" />
              <rect x="168.4" y={t.y + 0.4} width="37.2" height="11.2" rx="3.3" fill="none" stroke="#e2e8f0" strokeWidth=".8" />
              <circle cx="175.5" cy={t.y + 6} r="3.2" fill="#f59e0b" />
              <g className="esc-fa-dotv" style={{ animationDelay: retraso(i) }}>
                <circle cx="175.5" cy={t.y + 6} r="3.2" fill="#10b981" />
                <path d={`M174 ${t.y + 6.1}l1.2 1.2 2.1-2.4`} fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <rect x="182" y={t.y + 3.2} width="16" height="2.2" rx="1.1" fill="#cbd5e1" />
              <rect x="182" y={t.y + 7} width="10" height="2.2" rx="1.1" fill="#e2e8f0" />
            </g>
          ))}
        </g>
      </svg>
      <Aviso etiqueta="Sincronizado" texto="3 ventas" tono="verde" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  2 · INVENTARIO REAL                                                */
/* ------------------------------------------------------------------ */

/** Fila del estante: altura del piso, color del sticker y cajas [x, ancho, alto]; `anim` = la que entra/sale. */
const FILAS_ESTANTE: { piso: number; color: string; cajas: { x: number; w: number; h: number; anim?: 'a' | 'b' }[] }[] = [
  {
    piso: 56,
    color: '#38bdf8',
    cajas: [
      { x: 40, w: 26, h: 17 },
      { x: 70, w: 22, h: 21 },
      { x: 96, w: 24, h: 19, anim: 'a' },
      { x: 124, w: 26, h: 16 },
      { x: 152, w: 16, h: 20 },
    ],
  },
  {
    piso: 90,
    color: '#f59e0b',
    cajas: [
      { x: 40, w: 24, h: 18 },
      { x: 68, w: 22, h: 20 },
      { x: 94, w: 20, h: 16 },
      { x: 118, w: 26, h: 20, anim: 'b' },
      { x: 148, w: 20, h: 17 },
    ],
  },
  {
    piso: 122,
    color: '#14b8a6',
    cajas: [
      { x: 40, w: 28, h: 19 },
      { x: 72, w: 22, h: 20 },
      { x: 98, w: 26, h: 16 },
      { x: 128, w: 22, h: 20 },
      { x: 154, w: 14, h: 14 },
    ],
  },
]

/**
 * Caja de cartón con volumen: tapa clara (arriba), costado en sombra (derecha) y frente con
 * luz desde la izquierda. Cinta y etiqueta de color de la fila para leer qué barra le toca.
 */
function Caja({ x, piso, w, h, color, kraft, className }: { x: number; piso: number; w: number; h: number; color: string; kraft: string; className?: string }) {
  const y = piso - h
  return (
    <g className={className}>
      <path d={`M${x} ${y}L${x + 4} ${y - 3}H${x + w + 4}L${x + w} ${y}Z`} fill="#f5e1ba" />
      <path d={`M${x + w} ${y}L${x + w + 4} ${y - 3}V${piso - 3}L${x + w} ${piso}Z`} fill="#b27a3a" />
      <rect x={x} y={y} width={w} height={h} fill={kraft} />
      <rect x={x + w * 0.62} y={y} width="2.6" height={h} fill="#f7e8c8" opacity=".55" />
      <rect x={x + 2} y={y + h * 0.5} width="6.5" height="5.2" rx="1" fill="#fff" opacity=".94" />
      <rect x={x + 3} y={y + h * 0.5 + 3.3} width="4.5" height="1.2" rx=".6" fill={color} />
      <rect x={x} y={y} width="1.4" height={h} fill="#fff" opacity=".32" />
    </g>
  )
}

/** Renglones del tablero: [centro y, color del chip]. */
const RENGLONES = [
  { y: 82, color: '#38bdf8' },
  { y: 95, color: '#f59e0b' },
  { y: 108, color: '#14b8a6' },
]

/**
 * Un estante de acero visto en tres cuartos, con cajas de cartón, y a su lado una tablet con
 * las barras de stock de cada fila. La historia (6,5 s): entra una caja a la fila de arriba y
 * otra a la del medio (las barras suben con rebote); sale una de arriba (su barra baja) y por
 * último sale la del medio: su barra cae a la zona roja, se enciende un «3» y el aro rojo
 * pulsa. Ahí aparece el aviso «Stock crítico».
 */
export function EscenaFnInventario() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-sky-100 via-sky-50 to-white">
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('kr')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#efcf9c" />
            <stop offset="1" stopColor="#d29c58" />
          </linearGradient>
          <linearGradient id={g('bk')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#62799a" />
            <stop offset="1" stopColor="#3d5069" />
          </linearGradient>
          <linearGradient id={g('ac')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#dbe4ef" />
            <stop offset="1" stopColor="#9fb0c6" />
          </linearGradient>
          <linearGradient id={g('lt')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8396b0" />
            <stop offset="1" stopColor="#5d7089" />
          </linearGradient>
          <linearGradient id={g('sb')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1b33" stopOpacity=".34" />
            <stop offset="1" stopColor="#0b1b33" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('tb')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4d5d75" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('vd')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6ee7b7" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id={g('rj')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fb7185" />
            <stop offset="1" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".38" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cp')}>
            <rect x="202" y="60" width="96" height="58" rx="4" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#a8c3de" luz={['#e6f0fa', '#c5daef']} sombra="#0b1b33" />
        {/* sombras de contacto: estante y tablet */}
        <ellipse cx="108" cy="135" rx="92" ry="7" fill="#0b1b33" opacity=".06" />
        <ellipse cx="106" cy="135" rx="80" ry="4.6" fill="#0b1b33" opacity=".16" />
        <ellipse cx="250" cy="135" rx="38" ry="3.6" fill="#0b1b33" opacity=".15" />

        <g className="esc-fa-flota">
          {/* ---------- el estante ---------- */}
          {/* lateral derecho (en sombra) y tapa superior (la que recibe la luz) */}
          <path d="M182 22L190 17V128L182 134Z" fill={u('lt')} />
          <path d="M26 22L34 17H190L182 22Z" fill="#e8eef6" />
          {/* fondo del estante con sus sombras internas */}
          <rect x="34" y="29" width="140" height="99" fill={u('bk')} />
          <rect x="34" y="29" width="140" height="7" fill={u('sb')} />
          <rect x="34" y="62" width="140" height="7" fill={u('sb')} />
          <rect x="34" y="96" width="140" height="7" fill={u('sb')} />
          <rect x="34" y="29" width="6" height="99" fill="#0b1b33" opacity=".16" />

          {/* cajas (detrás de los largueros; las que entran/salen llevan su clase) */}
          {FILAS_ESTANTE.map((fila) => (
            <g key={fila.piso}>
              {fila.cajas.map((c) => (
                <Caja
                  key={c.x}
                  x={c.x}
                  piso={fila.piso}
                  w={c.w}
                  h={c.h}
                  color={fila.color}
                  kraft={u('kr')}
                  className={c.anim === 'a' ? 'esc-fa-caja-a' : c.anim === 'b' ? 'esc-fa-caja-b' : undefined}
                />
              ))}
            </g>
          ))}

          {/* largueros y repisas delanteros */}
          <rect x="26" y="22" width="8" height="112" fill={u('ac')} />
          <rect x="174" y="22" width="8" height="112" fill={u('ac')} />
          <rect x="26" y="22" width="156" height="7" rx="1.5" fill={u('ac')} />
          {[56, 90, 122].map((y) => (
            <rect key={y} x="34" y={y} width="140" height="6" fill={u('ac')} />
          ))}
          <rect x="26.6" y="22" width="1.5" height="112" fill="#fff" opacity=".55" />
          <rect x="34" y="56.6" width="140" height="1" fill="#fff" opacity=".5" />
          <rect x="34" y="90.6" width="140" height="1" fill="#fff" opacity=".5" />
          <rect x="34" y="122.6" width="140" height="1" fill="#fff" opacity=".5" />
          {/* patas */}
          <rect x="26" y="128" width="8" height="6" rx="1" fill="#7d8da3" />
          <rect x="174" y="128" width="8" height="6" rx="1" fill="#7d8da3" />

          {/* ---------- la tablet con el stock ---------- */}
          <path d="M242 118H258L262 130H238Z" fill="#64748b" />
          <rect x="228" y="129" width="44" height="5.5" rx="2.7" fill="#475569" />
          <rect x="198" y="56" width="104" height="66" rx="7" fill={u('tb')} />
          <rect x="198.6" y="64" width="1.2" height="50" rx=".6" fill="#fff" opacity=".22" />
          <rect x="202" y="60" width="96" height="58" rx="4" fill="#f8fafc" />
          {/* encabezado */}
          <rect x="202" y="60" width="96" height="12" rx="4" fill="#eaf0f7" />
          <rect x="202" y="66" width="96" height="6" fill="#eaf0f7" />
          <text x="208" y="69.3" fontSize="6.8" fontWeight="800" letterSpacing=".9" fill="#475569">
            STOCK
          </text>
          <circle className="esc-fa-led" cx="290" cy="66" r="2.1" fill="#10b981" />

          {/* pistas de las barras, zona roja (25 %) y su umbral */}
          {RENGLONES.map((r) => (
            <g key={r.y}>
              <rect x="208" y={r.y - 4} width="8" height="8" rx="2.4" fill={r.color} />
              <rect x="221" y={r.y - 3} width="70" height="6" rx="3" fill="#e2e8f0" />
            </g>
          ))}
          <rect x="221" y="76" width="17.5" height="38" rx="3" fill="#fca5a5" opacity=".32" />
          <line x1="238.5" y1="76" x2="238.5" y2="114" stroke="#f87171" strokeWidth=".9" strokeDasharray="2 2" />

          {/* barras: A baja al vender y sube al reponer; B cae a la zona roja; C no se mueve */}
          <rect className="esc-fa-barra-a" x="221" y="79" width="70" height="6" rx="3" fill={u('vd')} />
          <rect className="esc-fa-barra-b" x="221" y="92" width="70" height="6" rx="3" fill={u('vd')} />
          <g className="esc-fa-rojo">
            <rect className="esc-fa-barra-b" x="221" y="92" width="70" height="6" rx="3" fill={u('rj')} />
          </g>
          <rect x="221" y="105" width="70" height="6" rx="3" fill={u('vd')} style={{ transform: 'scaleX(.74)', transformOrigin: '0 50%' }} />

          {/* aro de pulso en la fila crítica */}
          <rect className="esc-fa-pulso" x="218" y="89.5" width="76" height="11" rx="5.5" fill="none" stroke="#ef4444" strokeWidth="1.3" />

          {/* reflejo de vidrio */}
          <g clipPath={u('cp')}>
            <polygon points="202,60 238,60 202,100" fill={u('gl')} />
          </g>

          {/* chapa con las unidades que quedan */}
          <g className="esc-fa-badge">
            <circle cx="298" cy="58" r="8.2" fill="#ef4444" />
            <circle cx="298" cy="58" r="8.2" fill="none" stroke="#fff" strokeWidth="1.4" />
            <text x="298" y="61.2" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">
              3
            </text>
          </g>
        </g>
      </svg>
      <Aviso
        etiqueta="Stock crítico"
        texto="Quedan 3"
        tono="ambar"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M10 4.5v7M10 15.6v.1" />
          </svg>
        }
      />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  3 · DELIVERY Y RECOJO                                              */
/* ------------------------------------------------------------------ */

/** Manzanas del mapa [x, y, ancho, alto]; la de arriba a la derecha es el parque y la de arriba a la izquierda, el local. */
const MANZANAS: [number, number, number, number][] = [
  [30, 28, 36, 22],
  [74, 28, 46, 22],
  [128, 28, 42, 22],
  [30, 58, 36, 24],
  [74, 58, 46, 24],
  [128, 58, 42, 24],
  [178, 58, 40, 24],
  [30, 90, 36, 12],
  [74, 90, 46, 12],
  [128, 90, 42, 12],
  [178, 90, 40, 12],
]

/**
 * Mapa estilizado (calles, manzanas, parque y río) con la ruta punteada del local al pin de
 * destino, y a un lado el mostrador de «recojo» con su bolsa. La historia (6,5 s): la moto de
 * reparto, con su caja, sale del local y recorre la ruta (frena en cada esquina; el trazo azul
 * la va siguiendo). Llega junto al pin, la cajita salta al pin, que late, se marca con un
 * tilde y suelta ondas; la bolsa del mostrador salta también. Aparece «Entregado».
 */
export function EscenaFnDelivery() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-indigo-100 via-sky-50 to-white">
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('rv')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b3dcf7" />
            <stop offset="1" stopColor="#80bdea" />
          </linearGradient>
          <linearGradient id={g('pn')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7aa2fb" />
            <stop offset="1" stopColor="#2f55e0" />
          </linearGradient>
          <linearGradient id={g('lo')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fcd34d" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id={g('mt')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5b92f7" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id={g('cn')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d3dcf2" />
          </linearGradient>
          <linearGradient id={g('sg')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5f7cf5" />
            <stop offset="1" stopColor="#3a50d6" />
          </linearGradient>
          <linearGradient id={g('bg')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#efcf9c" />
            <stop offset="1" stopColor="#cf9955" />
          </linearGradient>
          <clipPath id={g('mc')}>
            <rect x="22" y="20" width="204" height="106" rx="10" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#a9b8e6" luz={['#e7ecfb', '#c8d5f2']} sombra="#1e2a5e" />
        {/* sombras de contacto: mapa y mostrador */}
        <ellipse cx="124" cy="135" rx="112" ry="7" fill="#1e2a5e" opacity=".06" />
        <ellipse cx="124" cy="134.5" rx="102" ry="4.6" fill="#1e2a5e" opacity=".16" />
        <ellipse cx="271" cy="135" rx="40" ry="4" fill="#1e2a5e" opacity=".15" />

        <g className="esc-fa-flota">
          {/* ---------- el mapa: losa con espesor ---------- */}
          <rect x="22" y="26" width="204" height="106" rx="10" fill="#9fb3da" />
          <rect x="22" y="20" width="204" height="106" rx="10" fill="#dfe8f6" />
          <g clipPath={u('mc')}>
            {/* manzanas con su sombra y un tejado más claro */}
            {MANZANAS.map(([x, y, w, h]) => (
              <g key={`${x}-${y}`}>
                <rect x={x + 1.2} y={y + 1.8} width={w} height={h} rx="4" fill="#a9bad8" opacity=".55" />
                <rect x={x} y={y} width={w} height={h} rx="4" fill="#fbfdff" />
                <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx="2.5" fill="#eaf0fa" />
              </g>
            ))}
            {/* parque (bajo el aviso) */}
            <rect x="179.2" y="29.8" width="40" height="22" rx="5" fill="#a9bad8" opacity=".5" />
            <rect x="178" y="28" width="40" height="22" rx="5" fill="#c9edd4" />
            <circle cx="190" cy="40" r="5.6" fill="#7fcf9f" />
            <circle cx="201" cy="35" r="5" fill="#66c28c" />
            <circle cx="210" cy="42" r="4.6" fill="#7fcf9f" />
            <circle cx="188.4" cy="38.4" r="1.6" fill="#fff" opacity=".35" />
            <circle cx="199.6" cy="33.6" r="1.4" fill="#fff" opacity=".35" />
            {/* río */}
            <path d="M22 114C52 108 78 120 112 114S172 108 226 115V126H22Z" fill={u('rv')} />
            <path d="M22 114C52 108 78 120 112 114S172 108 226 115" fill="none" stroke="#fff" strokeWidth="1.1" opacity=".55" />
          </g>

          {/* ---------- ruta: punteada (siempre) y rellena (al avanzar la moto) ---------- */}
          <path d="M48 49V54H124V86H194" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" opacity=".5" />
          <rect className="esc-fa-ruta-1" x="70" y="52.6" width="54" height="2.8" rx="1.4" fill="#2563eb" />
          <rect className="esc-fa-ruta-2" x="122.6" y="54" width="2.8" height="32" rx="1.4" fill="#2563eb" />
          <rect className="esc-fa-ruta-3" x="124" y="84.6" width="48" height="2.8" rx="1.4" fill="#2563eb" />

          {/* ---------- el local (origen) ---------- */}
          <ellipse cx="49.5" cy="49" rx="8" ry="2" fill="#1e2a5e" opacity=".18" />
          <circle cx="48" cy="40" r="8.6" fill={u('lo')} />
          <path d="M43.6 38.4L45 34.8H51L52.4 38.4Z" fill="#fff" />
          <rect x="44.8" y="38.4" width="6.4" height="4.6" fill="#fff" />
          <rect x="47.2" y="40.2" width="1.6" height="2.8" fill="#f59e0b" />

          {/* ---------- destino: pin con su sombra y ondas ---------- */}
          <ellipse cx="194" cy="86.4" rx="4.6" ry="1.8" fill="#1e2a5e" opacity=".28" />
          <ellipse className="esc-fa-onda" cx="194" cy="86" rx="10" ry="4" fill="none" stroke="#3b82f6" strokeWidth="1.6" />
          <ellipse className="esc-fa-onda" cx="194" cy="86" rx="10" ry="4" fill="none" stroke="#3b82f6" strokeWidth="1.6" style={{ animationDelay: '-6.15s' }} />
          <g className="esc-fa-pin">
            <path d="M194 86C190 80 186 77.6 186 73A8 8 0 1 1 202 73C202 77.6 198 80 194 86Z" fill={u('pn')} />
            <ellipse cx="190.6" cy="68.6" rx="2" ry="3" fill="#fff" opacity=".3" />
            <circle cx="194" cy="73" r="4.2" fill="#fff" />
            <circle className="esc-fa-punto" cx="194" cy="73" r="1.9" fill="#3b82f6" />
            <path className="esc-fa-tilde" d="M191.4 73.2l2 2 3.6-4.2" fill="none" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* ---------- la moto con su caja (todo el grupo viaja; el paquete salta al final) ---------- */}
          <g className="esc-fa-moto">
            <ellipse cx="67" cy="58.4" rx="12" ry="1.8" fill="#1e2a5e" opacity=".25" />
            {/* ruedas */}
            <circle cx="63" cy="54.5" r="3.5" fill="#1e293b" />
            <circle cx="63" cy="54.5" r="1.3" fill="#cbd5e1" />
            <circle cx="77" cy="54.5" r="3.5" fill="#1e293b" />
            <circle cx="77" cy="54.5" r="1.3" fill="#cbd5e1" />
            {/* carrocería, asiento y manubrio */}
            <path d="M59.5 51L60.4 47.4Q60.8 46 62.5 46H72Q74 46 74.8 47.6L76 51Z" fill={u('mt')} />
            <rect x="66" y="44.2" width="7.4" height="2.4" rx="1.2" fill="#1e293b" />
            <path d="M74.2 47L76.6 40L78.6 40.4L77.2 51Z" fill="#2563eb" />
            <line x1="75.8" y1="40" x2="79.6" y2="39.2" stroke="#1e293b" strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="79.8" cy="41.4" r="1.3" fill="#fde68a" />
            {/* parrilla y caja de reparto */}
            <rect x="54.5" y="45.3" width="10.5" height="1.4" rx=".7" fill="#475569" />
            <g className="esc-fa-paquete">
              <rect x="54" y="36" width="11.5" height="9.5" rx="2" fill={u('lo')} />
              <rect x="54" y="39.2" width="11.5" height="1.1" fill="#b45309" opacity=".4" />
              <rect x="55.2" y="37" width="4.6" height="1.3" rx=".65" fill="#fff" opacity=".55" />
            </g>
          </g>

          {/* ---------- mostrador de recojo ---------- */}
          <rect x="252" y="81" width="2.6" height="21" fill="#94a3b8" />
          <rect x="288" y="81" width="2.6" height="21" fill="#94a3b8" />
          <rect x="246" y="66" width="50" height="15" rx="3.4" fill={u('sg')} />
          <rect x="246" y="66" width="50" height="2" rx="1" fill="#fff" opacity=".28" />
          <text x="271.6" y="77" textAnchor="middle" fontSize="8.2" fontWeight="800" letterSpacing="1.3" fill="#fff">
            RECOJO
          </text>
          <rect x="240" y="108" width="62" height="26" rx="3" fill={u('cn')} />
          <rect x="240" y="108" width="1.6" height="26" fill="#fff" opacity=".7" />
          <rect x="246" y="113" width="22" height="17" rx="2" fill="#e6ecfa" />
          <rect x="274" y="113" width="22" height="17" rx="2" fill="#e6ecfa" />
          <rect x="236" y="102" width="70" height="7" rx="2.4" fill="#fff" />
          <rect x="236" y="107" width="70" height="2" fill="#b9c6e6" opacity=".7" />
          {/* bolsa lista para llevar */}
          <g className="esc-fa-bolsa">
            <path d="M266.4 88Q266.4 82 271 82Q275.6 82 275.6 88" fill="none" stroke="#a0713a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M262 89H280L281 102H261Z" fill={u('bg')} />
            <path d="M262 89H280L280.4 92H261.6Z" fill="#fff" opacity=".28" />
            <rect x="268" y="94" width="6" height="4.4" rx="1" fill="#fff" opacity=".9" />
            <rect x="269" y="96.8" width="4" height="1.1" rx=".55" fill="#3b82f6" />
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Entregado" texto="Pedido #18" tono="azul" />
    </Marco>
  )
}
