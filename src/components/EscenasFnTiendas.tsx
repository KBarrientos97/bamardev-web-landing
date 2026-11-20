import './EscenasFnTiendas.css'
import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas de «Funciones» para tiendas y comercios: catálogo web con pedido
  por WhatsApp, sucursales con transferencias, venta por peso/medida y encargos. Igual que
  EscenasFuncionesA/B, el héroe es la pieza de interfaz (celular, tablero, balanza, lista)
  sobre la plataforma suave, con luz desde arriba a la izquierda y sombras de contacto.

  Todo se mueve con CSS (sólo transform y opacity); los keyframes `esc-ti-*` viven en
  EscenasFnTiendas.css. Las cuatro comparten el ciclo de 6,5 s del <Aviso> (esc-chip), que
  asoma al 10 %. Los keyframes están en «tiempo local» y cada elemento se adelanta 2,6 s
  (40 %): la historia se arma entre el 0 y el 48 % local y el aviso cae al 50 % local
  (= 10 % global). Ningún elemento animado lleva `transform=""` como atributo (la regla
  global `.escena svg *` le cambiaría el pivote): las posiciones van absolutas.

  El aviso nace arriba a la derecha y tapa, más o menos, x > 140 e y < 49 del viewBox:
  ahí no queda nada importante mientras se ve.
*/

const VB = '0 0 320 150'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

/** Plataforma común: losa elíptica con canto y luz (los objetos ponen su sombra de contacto). */
function Plataforma({ id, borde, luz }: { id: string; borde: string; luz: [string, string] }) {
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
    </>
  )
}

/** Sombra de contacto: una ancha y difusa + una chica y más oscura. */
function Contacto({ cx, rx, color, cy = 134.5 }: { cx: number; rx: number; color: string; cy?: number }) {
  return (
    <>
      <ellipse cx={cx} cy={cy + 0.5} rx={rx * 1.3} ry="6.5" fill={color} opacity=".06" />
      <ellipse cx={cx} cy={cy} rx={rx} ry="4" fill={color} opacity=".15" />
    </>
  )
}

/** Tilde blanco centrado en (x, y). */
function Tilde({ x, y, s = 1, ancho = 1.5 }: { x: number; y: number; s?: number; ancho?: number }) {
  return (
    <path
      d={`M${x - 2.2 * s} ${y + 0.1 * s}l${1.6 * s} ${1.6 * s} ${2.9 * s} ${-3.2 * s}`}
      fill="none"
      stroke="#fff"
      strokeWidth={ancho}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

/** Globito de chat (genérico, sin logo de marca), centrado en (x, y). */
function Globito({ x, y, color = '#22c55e' }: { x: number; y: number; color?: string }) {
  return (
    <>
      <circle cx={x} cy={y} r="3.6" fill={color} />
      <path d={`M${x - 1.8} ${y - 1}h3.6a.9.9 0 0 1 .9 .9v1.3a.9.9 0 0 1-.9 .9h-2.2l-1.4 1v-1h0a.9.9 0 0 1-.9-.9v-1.3a.9.9 0 0 1 .9-.9z`} fill="#fff" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  1 · CATÁLOGO WEB Y PEDIDO POR WHATSAPP                             */
/* ------------------------------------------------------------------ */

/** Productos de la tienda online: esquina de la tarjeta, fondo de la foto y precio. */
const PRODUCTOS_WEB = [
  { x: 42, y: 37, fondo: '#e0f2fe', precio: 'Bs 45' },
  { x: 75, y: 37, fondo: '#fef3c7', precio: 'Bs 25' },
  { x: 42, y: 73, fondo: '#ede9fe', precio: 'Bs 90' },
  { x: 75, y: 73, fondo: '#dcfce7', precio: 'Bs 30' },
]

/** Dibujo de cada producto (polera, taza, audífonos, planta) centrado en la foto de su tarjeta. */
function Articulo({ i, cx, cy }: { i: number; cx: number; cy: number }) {
  if (i === 0)
    return (
      <>
        <path
          d={`M${cx - 5} ${cy - 5.5}L${cx - 2} ${cy - 6.5}Q${cx} ${cy - 4.6} ${cx + 2} ${cy - 6.5}L${cx + 5} ${cy - 5.5}L${cx + 8} ${cy - 2}L${cx + 5.6} ${cy}L${cx + 4.6} ${cy - 1.1}V${cy + 6}H${cx - 4.6}V${cy - 1.1}L${cx - 5.6} ${cy}L${cx - 8} ${cy - 2}Z`}
          fill="#38bdf8"
        />
        <path d={`M${cx - 4.6} ${cy - 1.1}V${cy + 6}H${cx - 3}V${cy - 5}Z`} fill="#fff" opacity=".3" />
      </>
    )
  if (i === 1)
    return (
      <>
        <path d={`M${cx + 3} ${cy - 2.6}h1.7a2.6 2.6 0 0 1 0 5.2H${cx + 3}`} fill="none" stroke="#d97706" strokeWidth="1.6" />
        <rect x={cx - 6.5} y={cy - 5} width="10" height="10.5" rx="1.8" fill="#f59e0b" />
        <rect x={cx - 5.2} y={cy - 3.8} width="1.4" height="7.4" rx=".7" fill="#fff" opacity=".45" />
        <path d={`M${cx - 3.5} ${cy - 6.6}q1.1-1.2 0-2.6M${cx - .5} ${cy - 6.6}q1.1-1.2 0-2.6`} fill="none" stroke="#f59e0b" strokeWidth=".9" strokeLinecap="round" opacity=".6" />
      </>
    )
  if (i === 2)
    return (
      <>
        <path d={`M${cx - 5.8} ${cy + 1.5}a5.8 5.8 0 0 1 11.6 0`} fill="none" stroke="#8b5cf6" strokeWidth="1.8" />
        <rect x={cx - 7.6} y={cy} width="3.8" height="6.2" rx="1.5" fill="#7c3aed" />
        <rect x={cx + 3.8} y={cy} width="3.8" height="6.2" rx="1.5" fill="#7c3aed" />
        <rect x={cx - 6.9} y={cy + .8} width="1" height="4.4" rx=".5" fill="#fff" opacity=".4" />
      </>
    )
  return (
    <>
      <path d={`M${cx} ${cy + 1}C${cx - 6} ${cy - 1} ${cx - 6.5} ${cy - 6} ${cx - 3.5} ${cy - 7.5}C${cx - 2} ${cy - 4.5} ${cx - .6} ${cy - 2} ${cx} ${cy + 1}Z`} fill="#22c55e" />
      <path d={`M${cx} ${cy + 1}C${cx + 6} ${cy - 1} ${cx + 6.5} ${cy - 6} ${cx + 3.5} ${cy - 7.5}C${cx + 2} ${cy - 4.5} ${cx + .6} ${cy - 2} ${cx} ${cy + 1}Z`} fill="#16a34a" />
      <path d={`M${cx} ${cy + 1}C${cx - 1.6} ${cy - 3} ${cx - 1} ${cy - 7} ${cx} ${cy - 8.5}C${cx + 1} ${cy - 7} ${cx + 1.6} ${cy - 3} ${cx} ${cy + 1}Z`} fill="#4ade80" />
      <rect x={cx - 5.2} y={cy} width="10.4" height="2.2" rx=".9" fill="#fb923c" />
      <path d={`M${cx - 4.4} ${cy + 2.2}h8.8l-1.2 4.8h-6.4Z`} fill="#ea7a3f" />
    </>
  )
}

/** Renglón de la bandeja de pedidos de la laptop. */
function FilaPedido({ y, n, monto, color }: { y: number; n: string; monto: string; color: string }) {
  return (
    <>
      <rect x="194" y={y} width="92" height="12" rx="3" fill="#fff" />
      <rect x="194.4" y={y + 0.4} width="91.2" height="11.2" rx="2.7" fill="none" stroke="#e2e8f0" strokeWidth=".8" />
      <Globito x={200.5} y={y + 6} color={color} />
      <text x="207" y={y + 8} fontSize="5.6" fontWeight="700" fill="#334155">
        {n}
      </text>
      <text x="282" y={y + 8.1} textAnchor="end" fontSize="5.8" fontWeight="800" fill={color === '#22c55e' ? '#059669' : '#64748b'}>
        {monto}
      </text>
    </>
  )
}

/**
 * Un celular con la tienda online del negocio (cuatro productos con foto y precio) y, al
 * lado, la laptop del local con la bandeja de pedidos web. La historia (6,5 s): el dedo toca
 * el «+» de la polera y el de la taza (cada producto se marca y el carrito cuenta 1, 2) y
 * después «Pedir por WhatsApp»; el pedido sale como globito verde con el monto, viaja en arco
 * hasta la laptop y entra arriba de la lista empujando a los anteriores. Aviso «Pedido nuevo».
 */
export function EscenaFnCatalogoWeb() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-orange-100 via-amber-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('ph')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3f4e68" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={g('pn')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f1f5f9" />
          </linearGradient>
          <linearGradient id={g('lg')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fdba74" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id={g('wa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4ade80" />
            <stop offset="1" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id={g('lp')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4d5d75" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('bs')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9eef5" />
            <stop offset="1" stopColor="#a9b6c8" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cs')}>
            <rect x="40" y="14" width="68" height="116" rx="9" />
          </clipPath>
          <clipPath id={g('cl')}>
            <rect x="188" y="71" width="104" height="47" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#f0b98a" luz={['#fff1e4', '#fbd9bc']} />
        <Contacto cx={74} rx={40} color="#7c2d12" />
        <Contacto cx={240} rx={62} color="#7c2d12" cy={132.5} />

        <g className="esc-ti-flota">
          {/* ---------- el celular con la tienda online ---------- */}
          <rect x="36" y="10" width="76" height="124" rx="12" fill={u('ph')} />
          <rect x="36.7" y="24" width="1.4" height="96" rx=".7" fill="#fff" opacity=".22" />
          <rect x="111.4" y="38" width="1.8" height="14" rx=".9" fill="#1e293b" />
          <rect x="40" y="14" width="68" height="116" rx="9" fill={u('pn')} />
          <rect x="66" y="16.4" width="16" height="3.6" rx="1.8" fill="#0f172a" />

          {/* encabezado: logo, nombre y carrito con su contador */}
          <circle cx="47.5" cy="29" r="4.2" fill={u('lg')} />
          <path d="M46.1 27.4a1.4 1.4 0 0 1 2.8 0" fill="none" stroke="#fff" strokeWidth=".8" />
          <path d="M45 27.4h5l.4 4h-5.8Z" fill="#fff" />
          <text x="54.5" y="31.3" fontSize="6.4" fontWeight="800" fill="#0f172a">
            Mi tienda
          </text>
          <path d="M92.6 25.8h1.8l1.5 5.6h5.4l1.3-4.2h-7.6" fill="none" stroke="#475569" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="96.8" cy="33.3" r=".95" fill="#475569" />
          <circle cx="100.6" cy="33.3" r=".95" fill="#475569" />
          <g className="esc-ti-cw-badge">
            <circle cx="104" cy="25.4" r="3.7" fill="#ef4444" stroke="#fff" strokeWidth=".8" />
            <text className="esc-ti-cw-uno" x="104" y="27.4" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
              1
            </text>
            <text className="esc-ti-cw-dos" x="104" y="27.4" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#fff">
              2
            </text>
          </g>

          {/* catálogo: foto, nombre, precio y botón «+» */}
          {PRODUCTOS_WEB.map((p, i) => (
            <g key={i}>
              <rect x={p.x} y={p.y} width="31" height="34" rx="4" fill="#fff" />
              <rect x={p.x + 0.35} y={p.y + 0.35} width="30.3" height="33.3" rx="3.7" fill="none" stroke="#e2e8f0" strokeWidth=".7" />
              <rect x={p.x + 2} y={p.y + 2} width="27" height="17" rx="3" fill={p.fondo} />
              <Articulo i={i} cx={p.x + 15.5} cy={p.y + 10.5} />
              <rect x={p.x + 3} y={p.y + 22.3} width="14" height="2.4" rx="1.2" fill="#cbd5e1" />
              <text x={p.x + 3} y={p.y + 31} fontSize="6" fontWeight="800" fill="#0f172a">
                {p.precio}
              </text>
              <circle cx={p.x + 25} cy={p.y + 28} r="4" fill="#f97316" />
              <path d={`M${p.x + 23.2} ${p.y + 28}h3.6M${p.x + 25} ${p.y + 26.2}v3.6`} stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
              {i < 2 && (
                <g className={i === 0 ? 'esc-ti-cw-ok1' : 'esc-ti-cw-ok2'}>
                  <circle cx={p.x + 25} cy={p.y + 28} r="4.4" fill="#10b981" />
                  <Tilde x={p.x + 25} y={p.y + 28} s={0.85} ancho={1.3} />
                </g>
              )}
            </g>
          ))}

          {/* botón de pedido */}
          <g className="esc-ti-cw-boton">
            <rect x="42" y="111" width="64" height="14" rx="7" fill={u('wa')} />
            <rect x="46" y="112" width="56" height="2" rx="1" fill="#fff" opacity=".22" />
            <text x="74" y="120.3" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#fff">
              Pedir por WhatsApp
            </text>
          </g>

          {/* reflejo de vidrio */}
          <g clipPath={u('cs')}>
            <polygon points="40,14 72,14 40,60" fill={u('gl')} />
          </g>

          {/* el dedo y las ondas de cada toque */}
          {[
            [67, 65, 0],
            [100, 65, 0.78],
            [82, 118, 1.56],
          ].map(([x, y, d]) => (
            <circle key={x} className="esc-ti-cw-onda" cx={x} cy={y} r="4.6" fill="none" stroke="#f97316" strokeWidth="1.4" style={v({ '--d': `${d}s` })} />
          ))}
          <g className="esc-ti-cw-dedo">
            <circle cx="67" cy="65" r="5.6" fill="#0f172a" opacity=".3" />
            <circle cx="67" cy="65" r="5.6" fill="none" stroke="#fff" strokeWidth="1.4" />
          </g>

          {/* ---------- la laptop del local con los pedidos web ---------- */}
          <rect x="184" y="54" width="112" height="68" rx="6" fill={u('lp')} />
          <rect x="184.6" y="60" width="1.2" height="56" rx=".6" fill="#fff" opacity=".2" />
          <rect x="188" y="58" width="104" height="60" rx="3" fill="#f8fafc" />
          <rect x="188" y="58" width="104" height="12" rx="3" fill="#eef2f7" />
          <rect x="188" y="64" width="104" height="6" fill="#eef2f7" />
          <text x="194" y="66.6" fontSize="6.2" fontWeight="800" fill="#334155">
            Pedidos web
          </text>
          <circle className="esc-ti-led" cx="285" cy="64" r="2" fill="#22c55e" />
          <g clipPath={u('cl')}>
            <g className="esc-ti-cw-viejos">
              <FilaPedido y={73} n="Pedido #23" monto="Bs 32" color="#94a3b8" />
              <FilaPedido y={87} n="Pedido #22" monto="Bs 55" color="#94a3b8" />
            </g>
            <g className="esc-ti-cw-nuevo">
              <FilaPedido y={73} n="Pedido #24" monto="Bs 70" color="#22c55e" />
              <rect className="esc-ti-cw-brillo" x="194" y="73" width="92" height="12" rx="3" fill="none" stroke="#22c55e" strokeWidth="1.3" />
            </g>
          </g>
          {/* base de la laptop */}
          <path d="M174 122H306L301 130.5H179Z" fill={u('bs')} />
          <rect x="174" y="122" width="132" height="1.4" fill="#fff" opacity=".8" />
          <rect x="226" y="122" width="28" height="2.2" rx="1.1" fill="#94a3b8" />

          {/* ---------- el pedido en camino: globito con el monto (x, y y tamaño por separado) ---------- */}
          <g className="esc-ti-cw-vx">
            <g className="esc-ti-cw-vy">
              <g className="esc-ti-cw-vs">
                <rect x="79" y="105" width="26" height="12" rx="6" fill="#14532d" opacity=".15" />
                <path d="M83.5 113.6l-3.4 4.4 6-2.4Z" fill="#22c55e" />
                <rect x="79" y="104" width="26" height="12" rx="6" fill="#22c55e" />
                <text x="92" y="112.1" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#fff">
                  Bs 70
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <Aviso
        etiqueta="Pedido nuevo"
        texto="2 productos · Bs 70"
        tono="verde"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4.5h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9.5L6 16.2v-2.7H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z" />
          </svg>
        }
      />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  2 · SUCURSALES                                                     */
/* ------------------------------------------------------------------ */

/**
 * Local chico visto de frente: cornisa, cartel con el nombre, toldo a rayas, vidriera con su
 * caja registradora y puerta. `ox` corre todo el dibujo; `espejo` pone la puerta del lado del
 * centro de la escena (así las dos puertas se miran).
 */
function Local({
  ox,
  espejo,
  nombre,
  color,
  oscuro,
  fachada,
  vidrio,
  d = '0s',
}: {
  ox: number
  espejo?: boolean
  nombre: string
  color: string
  oscuro: string
  fachada: string
  vidrio: string
  d?: string
}) {
  const wx = ox + (espejo ? 58 : 22)
  const px = ox + (espejo ? 24 : 70)
  return (
    <g>
      {/* cuerpo, cornisa y costado en sombra */}
      <rect x={ox + 16} y="66" width="88" height="64" fill={fachada} />
      <rect x={espejo ? ox + 16 : ox + 100} y="66" width="4" height="64" fill="#0f172a" opacity=".06" />
      <rect x={ox + 14} y="61.5" width="92" height="6" rx="2" fill={oscuro} />
      <rect x={ox + 14} y="61.5" width="92" height="1.4" rx=".7" fill="#fff" opacity=".35" />
      {/* cartel */}
      <rect x={ox + 26} y="70" width="68" height="11" rx="2.5" fill={color} />
      <rect x={ox + 26} y="70" width="68" height="1.6" rx=".8" fill="#fff" opacity=".3" />
      <text x={ox + 60} y="77.6" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff">
        {nombre}
      </text>
      {/* toldo a rayas con festón */}
      {Array.from({ length: 12 }, (_, k) => (
        <g key={k}>
          <rect x={ox + 18 + k * 7} y="84" width="7" height="6" fill={k % 2 ? '#fff' : color} />
          <circle cx={ox + 21.5 + k * 7} cy="90" r="3.5" fill={k % 2 ? '#fff' : color} />
        </g>
      ))}
      <rect x={ox + 18} y="84" width="84" height="1.4" fill="#000" opacity=".08" />
      {/* vidriera con mostrador y caja registradora */}
      <rect x={wx} y="98" width="40" height="26" rx="2" fill={oscuro} />
      <rect x={wx + 2} y="100" width="36" height="22" rx="1" fill={vidrio} />
      <rect x={wx + 2} y="115" width="36" height="7" fill="#cbd5e1" />
      <rect x={wx + 2} y="115" width="36" height="1.2" fill="#fff" opacity=".7" />
      <rect className="esc-ti-su-cajon" x={wx + 11} y="113" width="18" height="2.6" rx=".8" fill="#475569" style={v({ '--d': d })} />
      <rect x={wx + 12} y="106.5" width="16" height="7" rx="1.6" fill="#334155" />
      <rect x={wx + 14} y="108.4" width="12" height="1.2" rx=".6" fill="#64748b" />
      <rect x={wx + 14} y="110.6" width="8" height="1.2" rx=".6" fill="#64748b" />
      <rect x={wx + 15} y="102" width="10" height="4.4" rx="1" fill="#1e293b" />
      <rect className="esc-ti-su-luz" x={wx + 15.8} y="102.8" width="8.4" height="2.8" rx=".7" fill="#5eead4" style={v({ '--d': d })} />
      <polygon points={`${wx + 2},100 ${wx + 16},100 ${wx + 2},114`} fill="#fff" opacity=".35" />
      {/* puerta */}
      <rect x={px} y="96" width="26" height="34" rx="2" fill={oscuro} />
      <rect x={px + 3} y="99" width="20" height="18" rx="1" fill={vidrio} />
      <polygon points={`${px + 3},99 ${px + 12},99 ${px + 3},109`} fill="#fff" opacity=".35" />
      <circle cx={espejo ? px + 21 : px + 5} cy="121" r="1.2" fill="#e2e8f0" />
    </g>
  )
}

/** Chapa de stock sobre la cornisa de un local (caja + texto), centrada en `cx`. */
function ChapaStock({ cx, texto, fondo, tinta, clase }: { cx: number; texto: string; fondo: string; tinta: string; clase: string }) {
  return (
    <g className={clase}>
      <rect x={cx - 21} y="55.2" width="42" height="10" rx="5" fill="#0f172a" opacity=".12" />
      <rect x={cx - 21} y="54" width="42" height="10" rx="5" fill={fondo} />
      <rect x={cx - 16.5} y="56.5" width="6" height="5" rx="1" fill="#d29c58" />
      <rect x={cx - 16.5} y="58.1" width="6" height=".9" fill="#fff" opacity=".6" />
      <text x={cx - 7.5} y="61.1" fontSize="6" fontWeight="800" fill={tinta}>
        {texto}
      </text>
    </g>
  )
}

/** Monedas de las ventas: sale de la caja (x, y) y viaja (dx, dy) hasta su renglón del tablero. */
const MONEDAS = [
  { x: 42, y: 100, dx: 140, dy: -14.5, pk: -36, d: '0s' },
  { x: 278, y: 100, dx: -96, dy: -5.5, pk: -30, d: '0.39s' },
]

/**
 * Dos locales (Sucursal Centro y Sucursal Norte), cada uno con su caja, y entre ellos la
 * tablet del dueño con las ventas del día. La historia (6,5 s): suena la caja del Centro y
 * después la del Norte; cada venta vuela como moneda al tablero, que suma su renglón y el
 * total. Luego el Centro manda una caja de mercadería (con flecha) que cruza en arco hasta el
 * Norte: el stock del Centro baja de 40 a 28 y el del Norte sube de 8 a 20 (de ámbar a
 * verde). Aviso «Transferencia recibida».
 */
export function EscenaFnSucursales() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-sky-100 via-indigo-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('fc')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="1" stopColor="#f3e6cf" />
          </linearGradient>
          <linearGradient id={g('fn')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8fbff" />
            <stop offset="1" stopColor="#e1e9f5" />
          </linearGradient>
          <linearGradient id={g('vd')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0f2fe" />
            <stop offset="1" stopColor="#a5cbe8" />
          </linearGradient>
          <linearGradient id={g('tb')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4d5d75" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('pe')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={g('kr')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#efcf9c" />
            <stop offset="1" stopColor="#cf9955" />
          </linearGradient>
          <linearGradient id={g('mo')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".4" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <Plataforma id={id} borde="#a8bde0" luz={['#eaf1fb', '#c9d8ef']} />
        <Contacto cx={60} rx={48} color="#1e2a5e" />
        <Contacto cx={260} rx={48} color="#1e2a5e" />
        <Contacto cx={160} rx={22} color="#1e2a5e" cy={130} />

        <g className="esc-ti-flota">
          <Local ox={0} nombre="Sucursal Centro" color="#f59e0b" oscuro="#b45309" fachada={u('fc')} vidrio={u('vd')} />
          <Local ox={200} espejo nombre="Sucursal Norte" color="#3b82f6" oscuro="#1e40af" fachada={u('fn')} vidrio={u('vd')} d="0.39s" />

          {/* chapas de stock: cambian al salir y al llegar la transferencia */}
          <ChapaStock cx={60} texto="Stock 40" fondo="#fff" tinta="#334155" clase="esc-ti-su-sc0" />
          <ChapaStock cx={60} texto="Stock 28" fondo="#fff" tinta="#334155" clase="esc-ti-su-sc1" />
          <ChapaStock cx={260} texto="Stock 8" fondo="#fef3c7" tinta="#b45309" clase="esc-ti-su-sn0" />
          <ChapaStock cx={260} texto="Stock 20" fondo="#d1fae5" tinta="#047857" clase="esc-ti-su-sn1" />

          {/* ---------- tablet del dueño: ventas de las dos sucursales ---------- */}
          <path d="M152 118h16l3 9.5h-22z" fill={u('pe')} />
          <ellipse cx="160" cy="128" rx="19" ry="2.8" fill="#94a3b8" />
          <ellipse cx="160" cy="127.2" rx="19" ry="2.8" fill="#dbe3ee" />
          <rect x="120" y="66" width="80" height="52" rx="6" fill={u('tb')} />
          <rect x="120.6" y="72" width="1.2" height="40" rx=".6" fill="#fff" opacity=".2" />
          <rect x="124" y="70" width="72" height="44" rx="3" fill="#f8fafc" />
          <text x="128" y="78" fontSize="5.6" fontWeight="800" fill="#475569">
            Ventas de hoy
          </text>
          <circle className="esc-ti-led" cx="191" cy="76" r="1.9" fill="#22c55e" />
          <circle cx="130" cy="85.5" r="2.1" fill="#f59e0b" />
          <text x="134.5" y="87.5" fontSize="5.6" fontWeight="700" fill="#64748b">
            Centro
          </text>
          <circle cx="130" cy="94.5" r="2.1" fill="#3b82f6" />
          <text x="134.5" y="96.5" fontSize="5.6" fontWeight="700" fill="#64748b">
            Norte
          </text>
          {/* cifras que «ruedan» al entrar cada venta */}
          {[
            ['esc-ti-su-c0', 87.5, 'Bs 820'],
            ['esc-ti-su-c1', 87.5, 'Bs 865'],
            ['esc-ti-su-n0', 96.5, 'Bs 640'],
            ['esc-ti-su-n1', 96.5, 'Bs 690'],
          ].map(([c, y, t]) => (
            <text key={c} className={c as string} x="192" y={y} textAnchor="end" fontSize="5.8" fontWeight="800" fill="#1e293b">
              {t}
            </text>
          ))}
          <rect x="128" y="100.3" width="64" height=".9" fill="#e2e8f0" />
          <text x="128" y="109.6" fontSize="5.8" fontWeight="800" fill="#334155">
            Total
          </text>
          {[
            ['esc-ti-su-t0', 'Bs 1.460'],
            ['esc-ti-su-t1', 'Bs 1.505'],
            ['esc-ti-su-t2', 'Bs 1.555'],
          ].map(([c, t]) => (
            <text key={c} className={c} x="192" y="110" textAnchor="end" fontSize="7" fontWeight="800" fill="#059669">
              {t}
            </text>
          ))}
          <polygon points="124,70 150,70 124,94" fill={u('gl')} />

          {/* ---------- ventas que viajan al tablero ---------- */}
          {MONEDAS.map((m) => (
            <g key={m.x} className="esc-ti-su-mx" style={v({ '--dx': `${m.dx}px`, '--d': m.d })}>
              <g className="esc-ti-su-my" style={v({ '--dy': `${m.dy}px`, '--pk': `${m.pk}px`, '--d': m.d })}>
                <g className="esc-ti-su-ms" style={v({ '--d': m.d })}>
                  <circle cx={m.x} cy={m.y + 0.8} r="3.6" fill="#78350f" opacity=".2" />
                  <circle cx={m.x} cy={m.y} r="3.6" fill={u('mo')} />
                  <circle cx={m.x} cy={m.y} r="2.2" fill="none" stroke="#fff" strokeWidth=".8" opacity=".7" />
                </g>
              </g>
            </g>
          ))}

          {/* ---------- la transferencia: caja con flecha del Centro al Norte ---------- */}
          <ellipse className="esc-ti-su-onda" cx="237" cy="112" rx="14" ry="5" fill="none" stroke="#10b981" strokeWidth="1.6" />
          <g className="esc-ti-su-bx">
            <g className="esc-ti-su-by">
              <g className="esc-ti-su-bs">
                <rect x="75" y="101" width="18" height="14" rx="1.8" fill="#0f172a" opacity=".14" />
                <path d="M73 99l3-2.8h17l-3 2.8Z" fill="#f5e1ba" />
                <path d="M90 99l3-2.8V110l-3 3Z" fill="#b27a3a" />
                <rect x="73" y="99" width="17" height="14" rx="1" fill={u('kr')} />
                <rect x="73" y="99" width="1.3" height="14" fill="#fff" opacity=".3" />
                <path d="M76.6 106h8.4M82.2 103l3 3-3 3" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          </g>
        </g>
      </svg>
      <Aviso
        etiqueta="Sucursal Norte"
        texto="Transferencia recibida"
        tono="azul"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 10h12M11.5 6l4 4-4 4" />
          </svg>
        }
      />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  3 · VENTA POR PESO O MEDIDA                                        */
/* ------------------------------------------------------------------ */

/** Lecturas de la balanza mientras se asienta la bolsa (una tira que sube renglón por renglón). */
const LECTURAS = ['0,000', '0,415', '0,960', '1,215', '1,250']

/**
 * Una balanza de mostrador con visor de peso y total, y al lado la pantalla de la caja con
 * la venta en curso (ya tiene cable por metro). La historia (6,5 s): baja una bolsa de
 * clavos al plato (que se hunde un poco), el peso sube de 0,000 a 1,250 kg y se asienta (luz
 * de estable); el total se calcula solo con el precio por kilo de la etiqueta (Bs 18 × 1,250
 * = Bs 22,50) y ese monto viaja como ficha a la pantalla: entra la línea «Clavos» con
 * «1,250 kg × Bs 18» y el total del ticket rueda a Bs 43,50. Aviso «Venta por peso».
 */
export function EscenaFnVentaPeso() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-teal-100 via-emerald-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('cu')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d5dee9" />
          </linearGradient>
          <linearGradient id={g('pl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f1f5f9" />
            <stop offset=".5" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={g('vi')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1e2d40" />
            <stop offset="1" stopColor="#0b1422" />
          </linearGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e9c48c" />
            <stop offset="1" stopColor="#c48a45" />
          </linearGradient>
          <linearGradient id={g('tb')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4d5d75" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('pe')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cp')}>
            <rect x="42" y="105.6" width="46" height="11" />
          </clipPath>
        </defs>

        <Plataforma id={id} borde="#8fcfbf" luz={['#e4f6f0', '#bfe6da']} />
        <Contacto cx={88} rx={58} color="#064e3b" />
        <Contacto cx={242} rx={26} color="#064e3b" cy={131} />

        <g className="esc-ti-flota">
          {/* ---------- la balanza ---------- */}
          <rect x="34" y="129" width="10" height="4" rx="1.5" fill="#64748b" />
          <rect x="132" y="129" width="10" height="4" rx="1.5" fill="#64748b" />
          <rect x="28" y="89" width="120" height="41" rx="8" fill={u('cu')} />
          <rect x="30" y="89.6" width="116" height="1.4" rx=".7" fill="#fff" />
          <rect x="144" y="94" width="3" height="32" rx="1.5" fill="#0f172a" opacity=".06" />

          {/* visor: peso (tira que sube) y total */}
          <rect x="38" y="94.5" width="100" height="24" rx="3.5" fill={u('vi')} />
          <text x="43" y="101.2" fontSize="5.5" fontWeight="700" fill="#5eead4" opacity=".8">
            PESO kg
          </text>
          <circle className="esc-ti-pe-estable" cx="86" cy="99.4" r="1.6" fill="#4ade80" />
          <g clipPath={u('cp')}>
            <g className="esc-ti-pe-tira">
              {LECTURAS.map((n, i) => (
                <text key={n} x="87" y={114.6 + i * 13} textAnchor="end" fontSize="11" fontWeight="700" fontFamily={MONO} fill="#99f6e4">
                  {n}
                </text>
              ))}
            </g>
          </g>
          <rect x="91.5" y="98" width=".8" height="17" fill="#334155" />
          <text x="96" y="101.2" fontSize="5.5" fontWeight="700" fill="#fcd34d" opacity=".8">
            TOTAL Bs
          </text>
          <text className="esc-ti-pe-t0" x="134" y="114.6" textAnchor="end" fontSize="11" fontWeight="700" fontFamily={MONO} fill="#fde68a">
            0,00
          </text>
          <text className="esc-ti-pe-t1" x="134" y="114.6" textAnchor="end" fontSize="11" fontWeight="700" fontFamily={MONO} fill="#fde68a">
            22,50
          </text>
          <polygon points="38,94.5 62,94.5 38,110" fill="#fff" opacity=".07" />
          {/* precio por kilo cargado en el producto */}
          <text x="88" y="126.3" textAnchor="middle" fontSize="5.8" fontWeight="800" fill="#475569">
            Bs 18,00 / kg
          </text>

          {/* plato (se hunde un poco con el peso) y la bolsa de clavos */}
          <g className="esc-ti-pe-plato">
            <rect x="80" y="85" width="16" height="5" fill="#94a3b8" />
            <rect x="36" y="80" width="104" height="6" rx="3" fill={u('pl')} />
            <rect x="40" y="80.5" width="96" height="1.2" rx=".6" fill="#fff" opacity=".9" />
            <g className="esc-ti-pe-bolsa">
              {/* clavos que asoman */}
              {[74, 80, 87, 95, 101].map((x, k) => (
                <g key={x}>
                  <rect x={x} y={44 + (k % 2) * 2.5} width="1.4" height="10" rx=".5" fill="#94a3b8" />
                  <rect x={x - 1} y={43.5 + (k % 2) * 2.5} width="3.4" height="1.4" rx=".7" fill="#64748b" />
                </g>
              ))}
              <path d="M66 54h44l2 26H64Z" fill={u('bo')} />
              <path d="M66 54h44l-.4 3.5H66.4Z" fill="#a8743a" />
              <path d="M66 54l2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4 2.2 2.4 2.2-2.4" fill="none" stroke="#f3d9ae" strokeWidth=".8" />
              <rect x="66" y="58" width="2" height="21.5" fill="#fff" opacity=".25" />
              <rect x="74" y="63" width="28" height="10" rx="2" fill="#fff" />
              <text x="88" y="70.2" textAnchor="middle" fontSize="5.8" fontWeight="800" fill="#7c4a1e">
                Clavos
              </text>
            </g>
          </g>

          {/* ---------- pantalla de la caja con el ticket ---------- */}
          <path d="M234 118h16l3 9h-22z" fill={u('pe')} />
          <ellipse cx="242" cy="128.4" rx="20" ry="2.8" fill="#94a3b8" />
          <ellipse cx="242" cy="127.6" rx="20" ry="2.8" fill="#dbe3ee" />
          <rect x="186" y="54" width="112" height="64" rx="6" fill={u('tb')} />
          <rect x="186.6" y="60" width="1.2" height="52" rx=".6" fill="#fff" opacity=".2" />
          <rect x="190" y="58" width="104" height="56" rx="3" fill="#f8fafc" />
          <text x="195" y="66.4" fontSize="6.2" fontWeight="800" fill="#334155">
            Venta
          </text>
          <text x="289" y="66.4" textAnchor="end" fontSize="5.5" fontWeight="700" fill="#94a3b8">
            #105
          </text>
          <rect x="194" y="69.4" width="96" height=".8" fill="#e2e8f0" />
          {/* línea anterior: por metro */}
          <text x="195" y="77" fontSize="5.8" fontWeight="800" fill="#334155">
            Cable
          </text>
          <text x="195" y="83" fontSize="5.5" fontWeight="600" fill="#94a3b8">
            3,50 m × Bs 6
          </text>
          <text x="289" y="80" textAnchor="end" fontSize="6" fontWeight="800" fill="#334155">
            Bs 21,00
          </text>
          {/* línea nueva: por kilo */}
          <g className="esc-ti-pe-linea">
            <rect className="esc-ti-pe-brillo" x="192" y="85.5" width="100" height="13" rx="2.5" fill="#d1fae5" />
            <text x="195" y="91.5" fontSize="5.8" fontWeight="800" fill="#334155">
              Clavos 2&quot;
            </text>
            <text x="195" y="97.4" fontSize="5.5" fontWeight="600" fill="#94a3b8">
              1,250 kg × Bs 18
            </text>
            <text x="289" y="94.5" textAnchor="end" fontSize="6" fontWeight="800" fill="#059669">
              Bs 22,50
            </text>
          </g>
          <line x1="194" y1="101.5" x2="290" y2="101.5" stroke="#cbd5e1" strokeWidth=".8" strokeDasharray="2 1.6" />
          <text x="195" y="110" fontSize="6" fontWeight="800" fill="#334155">
            Total
          </text>
          <text className="esc-ti-pe-ta" x="289" y="110.3" textAnchor="end" fontSize="7.4" fontWeight="800" fill="#0f172a">
            Bs 21,00
          </text>
          <text className="esc-ti-pe-tb" x="289" y="110.3" textAnchor="end" fontSize="7.4" fontWeight="800" fill="#059669">
            Bs 43,50
          </text>
          <polygon points="190,58 222,58 190,86" fill={u('gl')} />

          {/* ---------- ficha con el monto que pasa de la balanza al ticket ---------- */}
          <g className="esc-ti-pe-cx">
            <g className="esc-ti-pe-cy">
              <g className="esc-ti-pe-cs">
                <rect x="101" y="104.6" width="34" height="11" rx="5.5" fill="#064e3b" opacity=".18" />
                <rect x="101" y="103.5" width="34" height="11" rx="5.5" fill="#10b981" />
                <text x="118" y="110.9" textAnchor="middle" fontSize="5.8" fontWeight="800" fill="#fff">
                  Bs 22,50
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <Aviso
        etiqueta="Venta por peso"
        texto="1,250 kg · Bs 22,50"
        tono="verde"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16h12M6.5 16l1.2-8h4.6l1.2 8M10 8V4.5" />
          </svg>
        }
      />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  4 · ENCARGOS                                                       */
/* ------------------------------------------------------------------ */

/** Pastilla de estado del encargo (Pendiente / Llegó), centrada en (cx, cy). */
function Pastilla({ cx, cy, texto, fondo, tinta, clase }: { cx: number; cy: number; texto: string; fondo: string; tinta: string; clase?: string }) {
  return (
    <g className={clase}>
      <rect x={cx - 17} y={cy - 5} width="34" height="10" rx="5" fill={fondo} />
      <text x={cx} y={cy + 2} textAnchor="middle" fontSize="5.5" fontWeight="800" fill={tinta}>
        {texto}
      </text>
    </g>
  )
}

/**
 * La lista de encargos en una tablet (lo que el cliente pidió y no había), una caja del
 * proveedor y el celular del cliente. La historia (6,5 s): se anota un encargo nuevo («Ana
 * pidió: Pintura blanca 4 L», el texto se escribe solo) y queda «Pendiente»; llega la caja con
 * la mercadería (cae con su polvito), el encargo se ilumina y la pastilla gira a «Llegó»; sale
 * un globito de chat hasta el celular de Ana, que vibra con el mensaje «¡Llegó tu pintura!».
 * Aviso «Encargo listo».
 */
export function EscenaFnEncargos() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const u = (n: string) => `url(#${g(n)})`

  return (
    <Marco alto="h-40" fondo="bg-gradient-to-b from-violet-100 via-fuchsia-50 to-white">
      <svg viewBox={VB} preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('tb')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4d5d75" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={g('pe')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id={g('kr')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#efcf9c" />
            <stop offset="1" stopColor="#cf9955" />
          </linearGradient>
          <linearGradient id={g('ph')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3f4e68" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={g('gl')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".38" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={g('mk')} maskUnits="userSpaceOnUse" x="40" y="82" width="70" height="16">
            <rect className="esc-ti-en-escribe" x="40" y="82" width="70" height="16" fill="#fff" />
          </mask>
        </defs>

        <Plataforma id={id} borde="#c2b0e6" luz={['#f3eefc', '#dccff3']} />
        <Contacto cx={95} rx={26} color="#3b1a6e" cy={131} />
        <Contacto cx={202} rx={24} color="#3b1a6e" />
        <Contacto cx={266} rx={26} color="#3b1a6e" />

        <g className="esc-ti-flota">
          {/* ---------- tablet con la lista de encargos ---------- */}
          <path d="M87 118h16l3 9h-22z" fill={u('pe')} />
          <ellipse cx="95" cy="128.4" rx="22" ry="2.8" fill="#94a3b8" />
          <ellipse cx="95" cy="127.6" rx="22" ry="2.8" fill="#dbe3ee" />
          <rect x="20" y="44" width="150" height="74" rx="7" fill={u('tb')} />
          <rect x="20.6" y="52" width="1.2" height="58" rx=".6" fill="#fff" opacity=".2" />
          <rect x="24" y="48" width="142" height="66" rx="4" fill="#f8fafc" />
          <rect x="24" y="48" width="142" height="12" rx="4" fill="#f1ecfb" />
          <rect x="24" y="54" width="142" height="6" fill="#f1ecfb" />
          <text x="30" y="56.6" fontSize="6.6" fontWeight="800" fill="#4c1d95">
            Encargos
          </text>
          <circle cx="158" cy="54" r="3.6" fill="#8b5cf6" />
          <path d="M156.4 54h3.2M158 52.4v3.2" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />

          {/* encargo anterior, todavía pendiente */}
          <rect x="27" y="63" width="136" height="16" rx="3" fill="#fff" stroke="#ede9fe" strokeWidth=".8" />
          <circle cx="34" cy="71" r="4.4" fill="#fce7f3" />
          <text x="34" y="73" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#be185d">
            C
          </text>
          <text x="41.5" y="69.4" fontSize="5.5" fontWeight="700" fill="#94a3b8">
            Carla pidió
          </text>
          <text x="41.5" y="76.4" fontSize="6" fontWeight="800" fill="#334155">
            Foco LED 12 W
          </text>
          <Pastilla cx={144} cy={71} texto="Pendiente" fondo="#fef3c7" tinta="#b45309" />

          {/* encargo nuevo: se anota, queda pendiente y pasa a «Llegó» */}
          <g className="esc-ti-en-fila">
            <rect x="27" y="82" width="136" height="16" rx="3" fill="#fff" stroke="#ede9fe" strokeWidth=".8" />
            <rect className="esc-ti-en-flash" x="27" y="82" width="136" height="16" rx="3" fill="#dcfce7" stroke="#4ade80" strokeWidth=".9" />
            <g className="esc-ti-en-avatar">
              <circle cx="34" cy="90" r="4.4" fill="#e0f2fe" />
              <text x="34" y="92" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#0369a1">
                A
              </text>
            </g>
            <g mask={u('mk')}>
              <text x="41.5" y="88.4" fontSize="5.5" fontWeight="700" fill="#94a3b8">
                Ana pidió
              </text>
              <text x="41.5" y="95.4" fontSize="6" fontWeight="800" fill="#334155">
                Pintura blanca 4 L
              </text>
            </g>
            <Pastilla cx={144} cy={90} texto="Pendiente" fondo="#fef3c7" tinta="#b45309" clase="esc-ti-en-pend" />
            <Pastilla cx={144} cy={90} texto="Llegó ✓" fondo="#10b981" tinta="#fff" clase="esc-ti-en-llego" />
          </g>

          {/* renglón libre para anotar otro */}
          <rect x="27.4" y="101.4" width="135.2" height="10" rx="3" fill="none" stroke="#d8cdf3" strokeWidth=".8" strokeDasharray="2.4 1.8" />
          <text x="95" y="108.4" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#a78bfa">
            + Anotar encargo
          </text>
          <polygon points="24,48 58,48 24,80" fill={u('gl')} />

          {/* ---------- la caja que llega del proveedor ---------- */}
          <ellipse className="esc-ti-en-polvo" cx="184" cy="129" rx="5" ry="2" fill="#a78bfa" style={v({ '--dx': '-7px' })} />
          <ellipse className="esc-ti-en-polvo" cx="220" cy="129" rx="5" ry="2" fill="#a78bfa" style={v({ '--dx': '7px' })} />
          <g className="esc-ti-en-caja">
            <path d="M182 104l5-4h34l-5 4Z" fill="#f5e1ba" />
            <path d="M216 104l5-4v26l-5 4Z" fill="#b27a3a" />
            <rect x="182" y="104" width="34" height="26" fill={u('kr')} />
            <rect x="196" y="104" width="6" height="26" fill="#f7e8c8" opacity=".5" />
            <rect x="182" y="104" width="1.6" height="26" fill="#fff" opacity=".3" />
            {/* etiqueta con el tarro de pintura */}
            <rect x="186" y="110" width="13" height="13" rx="2" fill="#fff" opacity=".95" />
            <path d="M189.2 113.6a3.4 3.4 0 0 1 6.6 0" fill="none" stroke="#64748b" strokeWidth=".8" />
            <rect x="189" y="114" width="7" height="7" rx="1.2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth=".6" />
            <rect x="189" y="116" width="7" height="2.4" fill="#c4b5fd" />
          </g>

          {/* ---------- el celular del cliente ---------- */}
          <g className="esc-ti-en-tel">
            <rect x="238" y="52" width="58" height="82" rx="9" fill={u('ph')} />
            <rect x="238.7" y="62" width="1.2" height="60" rx=".6" fill="#fff" opacity=".2" />
            <rect x="241" y="55" width="52" height="76" rx="6.5" fill="#efe9df" />
            <path d="M241 61.5a6.5 6.5 0 0 1 6.5-6.5h39a6.5 6.5 0 0 1 6.5 6.5V68h-52Z" fill="#15803d" />
            <circle cx="248" cy="62" r="3.4" fill="#dcfce7" />
            <path d="M247 60.6a1 1 0 0 1 2 0" fill="none" stroke="#15803d" strokeWidth=".7" />
            <path d="M246.2 60.6h3.6l.3 3h-4.2Z" fill="#15803d" />
            <text x="253.4" y="64" fontSize="5.6" fontWeight="800" fill="#fff">
              Tu tienda
            </text>
            {/* lo que el cliente había preguntado */}
            <rect x="253" y="72" width="37" height="10" rx="3" fill="#dcf8c6" />
            <text x="287" y="78.8" textAnchor="end" fontSize="5.5" fontWeight="600" fill="#334155">
              ¿Hay pintura?
            </text>
            {/* la respuesta del negocio cuando llega */}
            <g className="esc-ti-en-resp">
              <rect x="244" y="86.5" width="44" height="17" rx="3" fill="#0f172a" opacity=".06" />
              <rect x="244" y="86" width="44" height="17" rx="3" fill="#fff" />
              <text x="247" y="92.8" fontSize="5.5" fontWeight="800" fill="#15803d">
                ¡Llegó tu
              </text>
              <text x="247" y="99.6" fontSize="5.5" fontWeight="800" fill="#15803d">
                pintura, Ana!
              </text>
            </g>
            <polygon points="241,68 262,68 241,92" fill={u('gl')} />
          </g>

          {/* ---------- el aviso en camino: globito de chat ---------- */}
          <g className="esc-ti-en-vx">
            <g className="esc-ti-en-vy">
              <g className="esc-ti-en-vs">
                <circle cx="144" cy="91" r="6.4" fill="#14532d" opacity=".15" />
                <circle cx="144" cy="90" r="6" fill="#22c55e" />
                <path d="M141 88.2h6a1.4 1.4 0 0 1 1.4 1.4v1.9a1.4 1.4 0 0 1-1.4 1.4h-3.4l-2.2 1.6v-1.6h-.4a1.4 1.4 0 0 1-1.4-1.4v-1.9a1.4 1.4 0 0 1 1.4-1.4z" fill="#fff" />
              </g>
            </g>
          </g>
        </g>
      </svg>
      <Aviso etiqueta="Encargo listo" texto="Avisado a Ana" tono="violeta" />
    </Marco>
  )
}
