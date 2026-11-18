import './EscenasBelleza.css'
import { useId, type CSSProperties } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'

/*
  Ilustraciones animadas del rubro Belleza (Spa y Uñas). Mismo método que
  Escenas.tsx: SVG propio, sólo transform y opacity, keyframes `esc-belleza-*`
  en EscenasBelleza.css y los compartidos `esc-*` de index.css.

  OJO con los giros: la regla global `.escena svg *` pone transform-origin al
  centro de cada caja, y eso también afecta a un `transform="rotate()"` puesto
  como atributo. Por eso todo está dibujado en coordenadas absolutas y los
  giros fijos se hacen con `girar()` (pivote explícito en el viewBox).
*/

/** Giro fijo sobre un pivote del viewBox (no depende de la caja del elemento). */
const girar = (grados: number, x: number, y: number): CSSProperties => ({
  transform: `rotate(${grados}deg)`,
  transformBox: 'view-box',
  transformOrigin: `${x}px ${y}px`,
})

/** Hoja/pétalo en forma de gota apuntando hacia arriba desde la base (bx, by). */
const gota = (bx: number, by: number, largo: number, ancho: number) =>
  `M${bx} ${by}C${bx - ancho} ${by - largo * 0.3} ${bx - ancho * 0.8} ${by - largo * 0.75} ${bx} ${by - largo}` +
  `C${bx + ancho * 0.8} ${by - largo * 0.75} ${bx + ancho} ${by - largo * 0.3} ${bx} ${by}Z`

/** Destello de cuatro puntas centrado en (x, y). */
function Estrella({ x, y, s = 1, retraso, color = '#fff' }: { x: number; y: number; s?: number; retraso: number; color?: string }) {
  const r = 6 * s
  const c = 1.7 * s
  return (
    <path
      className="esc-belleza-estrella"
      d={`M${x} ${y - r}L${x + c} ${y - c}L${x + r} ${y}L${x + c} ${y + c}L${x} ${y + r}L${x - c} ${y + c}L${x - r} ${y}L${x - c} ${y - c}Z`}
      fill={color}
      style={{ animationDelay: `${retraso}s` }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  SPA                                                                */
/* ------------------------------------------------------------------ */

/** Fronda de hojas que se mece desde la base (bx, by). */
function Fronda({ bx, by, hojas, retraso, g }: { bx: number; by: number; hojas: [number, number, number][]; retraso: number; g: (n: string) => string }) {
  return (
    <g className="esc-belleza-fronda" style={{ animationDelay: `${retraso}s` }}>
      {hojas.map(([ang, largo, ancho], i) => (
        <path key={i} d={gota(bx, by, largo, ancho)} fill={`url(#${g(i % 2 ? 'ho2' : 'ho1')})`} style={girar(ang, bx, by)} />
      ))}
    </g>
  )
}

/** Una flor de loto que se abre y se cierra sobre el agua, con ondas, piedras zen y una vela. */
export function EscenaSpa() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  // Pivote de los pétalos: la base de la flor, en el agua.
  const PX = 150
  const PY = 127
  const atras = [-68, -34, 34, 68, 0]
  const frente = [-52, -18, 18, 52]
  const petalo = (ang: number, i: number, largo: number, ancho: number, relleno: string, retraso0: number) => (
    <path
      key={`${relleno}${ang}`}
      className="esc-belleza-petalo"
      d={gota(PX, PY, largo, ancho)}
      fill={`url(#${g(relleno)})`}
      style={{
        ...v({ '--a': `${ang}deg`, animationDelay: `${retraso0 + i * 0.14}s` }),
        transformBox: 'view-box',
        transformOrigin: `${PX}px ${PY}px`,
      }}
    />
  )
  return (
    <Marco fondo="bg-gradient-to-b from-teal-100 via-emerald-50 to-white">
      <div aria-hidden className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/60 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('lt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f9f0de" />
            <stop offset="1" stopColor="#e6d5b2" />
          </linearGradient>
          <linearGradient id={g('ls')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d2bd93" />
            <stop offset="1" stopColor="#bda677" />
          </linearGradient>
          <linearGradient id={g('cu')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d3dcda" />
            <stop offset=".45" stopColor="#eef3f1" />
            <stop offset="1" stopColor="#a9bab7" />
          </linearGradient>
          <linearGradient id={g('ag')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9be8dd" />
            <stop offset="1" stopColor="#3fb5ad" />
          </linearGradient>
          <linearGradient id={g('pa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbcfe8" />
            <stop offset="1" stopColor="#e864a8" />
          </linearGradient>
          <linearGradient id={g('pf')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1f8" />
            <stop offset="1" stopColor="#f58cc2" />
          </linearGradient>
          <radialGradient id={g('ce')}>
            <stop offset="0" stopColor="#fff6b0" />
            <stop offset="1" stopColor="#fbbf24" />
          </radialGradient>
          <radialGradient id={g('ha')}>
            <stop offset="0" stopColor="#fff3a6" stopOpacity=".95" />
            <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('p1')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cfd8d7" />
            <stop offset="1" stopColor="#8d9e9f" />
          </linearGradient>
          <linearGradient id={g('p2')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efe3d6" />
            <stop offset="1" stopColor="#b9a894" />
          </linearGradient>
          <linearGradient id={g('p3')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dbe9e3" />
            <stop offset="1" stopColor="#a2bdb4" />
          </linearGradient>
          <linearGradient id={g('ho1')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fdcb6" />
            <stop offset="1" stopColor="#2f9f85" />
          </linearGradient>
          <linearGradient id={g('ho2')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5cc7a0" />
            <stop offset="1" stopColor="#23846f" />
          </linearGradient>
          <linearGradient id={g('ja')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fde4f0" />
            <stop offset=".6" stopColor="#f9b4d6" />
            <stop offset="1" stopColor="#e88fbc" />
          </linearGradient>
        </defs>

        {/* sol pálido detrás de la flor */}
        <circle className="esc-latido" cx="150" cy="96" r="50" fill="#fff" opacity=".42" style={{ animationDuration: '5.5s' }} />
        <circle cx="150" cy="96" r="34" fill="#fff" opacity=".35" />

        {/* sombra y losa */}
        <ellipse className="esc-sombra" cx="150" cy="165" rx="128" ry="5.5" fill="#0b5a55" opacity=".15" />
        <rect x="22" y="151" width="256" height="10" rx="5" fill={`url(#${g('ls')})`} />
        <rect x="22" y="145" width="256" height="12" rx="6" fill={`url(#${g('lt')})`} />
        <rect x="30" y="147" width="240" height="3" rx="1.5" fill="#fff" opacity=".6" />

        {/* frondas de fondo */}
        <Fronda bx={30} by={149} g={g} retraso={-1.2} hojas={[[-48, 44, 7], [-20, 56, 8], [8, 48, 7], [32, 38, 6]]} />
        <Fronda bx={274} by={149} g={g} retraso={-2.6} hojas={[[-34, 38, 6], [-8, 50, 7], [20, 56, 8], [46, 42, 7]]} />

        {/* cuenco de piedra */}
        <path d="M64 128V140A86 17 0 0 0 236 140V128Z" fill={`url(#${g('cu')})`} />
        <path d="M64 130V134A86 17 0 0 0 236 134V130Z" fill="#fff" opacity=".18" />
        <ellipse cx="150" cy="128" rx="86" ry="17" fill="#f7f6f0" />
        <ellipse cx="150" cy="128.6" rx="79" ry="14.6" fill="#c3d3cf" />
        <ellipse cx="150" cy="129.6" rx="76" ry="13.6" fill={`url(#${g('ag')})`} />
        <rect x="74" y="123" width="40" height="3" rx="1.5" fill="#fff" opacity=".35" />

        {/* reflejos que se deslizan por el agua */}
        <ellipse className="esc-belleza-reflejo" cx="112" cy="128" rx="14" ry="1.8" fill="#fff" style={{ animationDelay: '-1.5s' }} />
        <ellipse className="esc-belleza-reflejo" cx="194" cy="133" rx="10" ry="1.5" fill="#fff" style={{ animationDelay: '-3.4s' }} />

        {/* ondas que se expanden bajo la flor */}
        {[0, -1.5, -3].map((d, i) => (
          <ellipse
            key={i}
            className="esc-belleza-onda"
            cx="150"
            cy="131"
            rx="20"
            ry="4.2"
            fill="none"
            stroke="#fff"
            strokeWidth="1.4"
            style={{ animationDelay: `${d}s` }}
          />
        ))}

        {/* nenúfares */}
        <g className="esc-belleza-nenufar" style={{ animationDelay: '-1s' }}>
          <ellipse cx="104" cy="134" rx="11" ry="3.3" fill="#4cb98d" />
          <ellipse cx="104" cy="133.2" rx="10" ry="2.8" fill="#6fd3a5" />
        </g>
        <g className="esc-belleza-nenufar" style={{ animationDelay: '-2.7s' }}>
          <ellipse cx="200" cy="130" rx="9" ry="2.8" fill="#4cb98d" />
          <ellipse cx="200" cy="129.3" rx="8" ry="2.3" fill="#6fd3a5" />
          <circle cx="202" cy="127.6" r="2.4" fill="#fbcfe8" />
        </g>

        {/* la flor de loto: se abre y se cierra */}
        <g className="esc-flotar-suave">
          {atras.map((a, i) => petalo(a, i, 40, 13, 'pa', -2.6))}
          {frente.map((a, i) => petalo(a, i, 32, 11.5, 'pf', -2.3))}
          <circle
            className="esc-belleza-centro"
            cx="150"
            cy="107"
            r="5.5"
            fill={`url(#${g('ce')})`}
            style={{ transformOrigin: '50% 100%', animationDelay: '-2.6s' }}
          />
          <ellipse cx="150" cy="127" rx="9" ry="3" fill="#f58cc2" opacity=".55" />
        </g>

        {/* polen brillante que sube de la flor */}
        <circle className="esc-subir" cx="142" cy="108" r="1.7" fill="#fff6b0" style={v({ '--dx': '-8px', '--giro': '0deg', animationDelay: '-1s' })} />
        <circle className="esc-subir" cx="158" cy="106" r="1.5" fill="#fff" style={v({ '--dx': '9px', '--giro': '0deg', animationDelay: '-2.8s' })} />
        <circle className="esc-subir" cx="150" cy="104" r="1.9" fill="#fde68a" style={v({ '--dx': '2px', '--giro': '0deg', animationDelay: '-4s' })} />

        {/* vapor del agua tibia */}
        <circle className="esc-humo" cx="118" cy="112" r="5" fill="#fff" style={{ animationDelay: '-0.6s' }} />
        <circle className="esc-humo" cx="184" cy="112" r="5.5" fill="#fff" style={{ animationDelay: '-2s' }} />
        <circle className="esc-humo" cx="166" cy="110" r="4" fill="#fff" style={{ animationDelay: '-3s' }} />

        {/* pila de piedras zen */}
        <g className="esc-belleza-piedras" style={{ animationDelay: '-1.8s' }}>
          <ellipse cx="44" cy="146" rx="18" ry="8" fill={`url(#${g('p1')})`} />
          <ellipse cx="38" cy="143" rx="7" ry="2.2" fill="#fff" opacity=".35" />
          <ellipse cx="45" cy="134" rx="13.5" ry="7" fill={`url(#${g('p2')})`} />
          <ellipse cx="40.5" cy="131.4" rx="5.5" ry="1.9" fill="#fff" opacity=".4" />
          <ellipse cx="43" cy="124" rx="9" ry="5.3" fill={`url(#${g('p3')})`} />
          <ellipse cx="40" cy="122" rx="3.8" ry="1.4" fill="#fff" opacity=".45" />
        </g>

        {/* vela: halo que late y llama que parpadea */}
        <circle className="esc-belleza-halo" cx="258" cy="128" r="21" fill={`url(#${g('ha')})`} />
        <rect x="248" y="137" width="20" height="15" rx="4.5" fill={`url(#${g('ja')})`} />
        <rect x="250.5" y="139" width="3" height="10" rx="1.5" fill="#fff" opacity=".5" />
        <ellipse cx="258" cy="137.4" rx="10" ry="2.6" fill="#fff7ed" />
        <rect x="257.4" y="132.5" width="1.4" height="5" rx=".7" fill="#7c5a49" />
        <g className="esc-belleza-llama" style={{ animationDelay: '-0.5s' }}>
          <path d="M258 134C253.5 131 254.5 125 258 119C261.5 125 262.5 131 258 134Z" fill="#fbbf24" />
          <path d="M258 133.4C256 131.6 256.4 128.4 258 125.4C259.6 128.4 260 131.6 258 133.4Z" fill="#fff7c2" />
        </g>
      </svg>
      <Aviso texto="Reserva 5:00 pm" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  UÑAS                                                               */
/* ------------------------------------------------------------------ */

// Geometría de la uña (coordenadas del viewBox). El esmalte crece desde la
// cutícula (y = 101) hasta la punta (y = 46): 55 unidades.
const UNA = 'M115 94V66Q115 46 135 46Q155 46 155 66V94Q155 101 148 101H122Q115 101 115 94Z'

function Corazon({ x, y, retraso, dx }: { x: number; y: number; retraso: number; dx: number }) {
  return (
    <path
      className="esc-subir"
      d={`M${x} ${y + 2}C${x - 6} ${y - 2} ${x - 5} ${y - 7} ${x - 2.5} ${y - 7}C${x - 1} ${y - 7} ${x} ${y - 6} ${x} ${y - 5}C${x} ${y - 6} ${x + 1} ${y - 7} ${x + 2.5} ${y - 7}C${x + 5} ${y - 7} ${x + 6} ${y - 2} ${x} ${y + 2}Z`}
      fill="#fb7185"
      style={v({ '--dx': `${dx}px`, '--giro': '0deg', animationDelay: `${retraso}s` })}
    />
  )
}

/** Un pincel pinta de rosa una uña, de la base a la punta; luego un destello y vuelta a empezar. */
export function EscenaUnas() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const cic = 'M105 170V72Q105 34 135 34Q165 34 165 72V170Z'
  return (
    <Marco fondo="bg-gradient-to-b from-fuchsia-100 via-pink-50 to-white">
      <div aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/60 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <clipPath id={g('cl')}>
            <path d={UNA} />
          </clipPath>
          <linearGradient id={g('pi')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fde3cd" />
            <stop offset=".62" stopColor="#f9c9a6" />
            <stop offset="1" stopColor="#e9a57d" />
          </linearGradient>
          <linearGradient id={g('nb')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0ec" />
            <stop offset="1" stopColor="#f8cdc7" />
          </linearGradient>
          <linearGradient id={g('es')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff9fcf" />
            <stop offset="1" stopColor="#ee4d9f" />
          </linearGradient>
          <linearGradient id={g('bo')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffa6d2" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id={g('ne')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4a4a58" />
            <stop offset=".5" stopColor="#23232e" />
            <stop offset="1" stopColor="#12121a" />
          </linearGradient>
          <linearGradient id={g('pl')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f4f4f8" />
            <stop offset="1" stopColor="#aeb0c0" />
          </linearGradient>
          <linearGradient id={g('pt')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0e4ff" />
            <stop offset="1" stopColor="#d3bbf7" />
          </linearGradient>
          <linearGradient id={g('cr')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd0e6" />
            <stop offset="1" stopColor="#f472b6" />
          </linearGradient>
        </defs>

        <ellipse className="esc-sombra" cx="150" cy="166" rx="120" ry="4.5" fill="#86198f" opacity=".1" />

        {/* pedestal del frasco */}
        <rect x="204" y="152" width="68" height="12" rx="6" fill="#bd9df0" />
        <rect x="204" y="146" width="68" height="14" rx="7" fill={`url(#${g('pt')})`} />
        <rect x="212" y="148" width="52" height="3" rx="1.5" fill="#fff" opacity=".6" />

        {/* frasco de esmalte */}
        <ellipse className="esc-sombra" cx="238" cy="150" rx="19" ry="3" fill="#6b21a8" opacity=".18" style={{ animationDelay: '-2s' }} />
        <g className="esc-flotar-suave" style={{ animationDelay: '-2s' }}>
          <clipPath id={g('fb')}>
            <rect x="218" y="108" width="40" height="40" rx="11" />
          </clipPath>
          <rect x="228" y="76" width="20" height="26" rx="5" fill={`url(#${g('ne')})`} />
          <rect x="231" y="79" width="3" height="19" rx="1.5" fill="#fff" opacity=".4" />
          <rect x="228" y="88" width="20" height="1.4" fill="#000" opacity=".35" />
          <rect x="230" y="100" width="16" height="10" rx="3" fill="#fbe3f0" />
          <g clipPath={`url(#${g('fb')})`}>
            <rect x="218" y="108" width="40" height="40" fill={`url(#${g('bo')})`} />
            <rect x="246" y="108" width="14" height="40" fill="#a3175f" opacity=".2" />
            <rect x="221.5" y="112" width="4.5" height="30" rx="2.2" fill="#fff" opacity=".45" />
            <rect x="218" y="108" width="40" height="5" fill="#fff" opacity=".25" />
          </g>
          <rect x="226" y="124" width="24" height="14" rx="5" fill="#fff" opacity=".88" />
          <path d="M238 135C233 131.8 233.6 128 235.8 128C237 128 238 128.8 238 129.6C238 128.8 239 128 240.2 128C242.4 128 243 131.8 238 135Z" fill="#f472b6" />
        </g>

        {/* corazones que salen del frasco */}
        <Corazon x={236} y={104} dx={-10} retraso={-0.8} />
        <Corazon x={242} y={104} dx={12} retraso={-3} />

        {/* la mano: dedo + uña + pincel flotan juntos */}
        <g className="esc-flotar">
          <path d={cic} fill={`url(#${g('pi')})`} />
          <rect x="110" y="48" width="5" height="120" rx="2.5" fill="#fff" opacity=".28" />
          <path d="M108 122Q135 128 162 122M108 148Q135 154 162 148" stroke="#d98f68" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".45" />

          {/* uña desnuda */}
          <path d={UNA} fill={`url(#${g('nb')})`} />

          {/* esmalte que crece de la base a la punta */}
          <g clipPath={`url(#${g('cl')})`}>
            <g
              className="esc-belleza-esmalte"
              style={{ transformBox: 'view-box', transformOrigin: '135px 101px', animationDelay: '-3.4s' }}
            >
              <rect x="112" y="46" width="46" height="55" fill={`url(#${g('es')})`} />
              <rect x="147" y="46" width="11" height="55" fill="#a3175f" opacity=".2" />
              <ellipse cx="125" cy="64" rx="3.4" ry="9" fill="#fff" opacity=".5" />
              <ellipse cx="125" cy="80" rx="1.8" ry="2.4" fill="#fff" opacity=".4" />
            </g>
            {/* destello diagonal sobre la uña ya pintada */}
            <g style={girar(18, 135, 73)}>
              <rect
                className="esc-belleza-destello"
                x="131"
                y="30"
                width="9"
                height="86"
                rx="4.5"
                fill="#fff"
                style={{ animationDelay: '-3.4s' }}
              />
            </g>
          </g>
          <path d="M115.6 70Q116 47.5 135 47.4Q154 47.5 154.4 70" stroke="#fff" strokeWidth="1.2" fill="none" opacity=".55" strokeLinecap="round" />
          {/* cutícula */}
          <path d="M113 101Q135 91 157 101Q150 106 135 106Q120 106 113 101Z" fill="#f6c19c" />
          <path d="M118 102Q135 95 152 102" stroke="#fff" strokeWidth="1" fill="none" opacity=".4" strokeLinecap="round" />

          {/* pincel: sube junto al borde del esmalte y se retira */}
          <g className="esc-belleza-pincel" style={{ animationDelay: '-3.4s' }}>
            <g style={girar(-28, 135, 101)}>
              <rect x="131" y="123" width="8" height="78" rx="4" fill={`url(#${g('ne')})`} />
              <rect x="132.6" y="127" width="1.8" height="60" rx=".9" fill="#fff" opacity=".35" />
              <rect x="129.5" y="114" width="11" height="10" rx="2.4" fill={`url(#${g('pl')})`} />
              <rect x="129.5" y="117" width="11" height="1.2" fill="#8d90a6" opacity=".6" />
              <path d="M135 101C132 105 130 110 130 115H140C140 110 138 105 135 101Z" fill={`url(#${g('cr')})`} />
            </g>
          </g>
        </g>

        {/* destellos */}
        <Estrella x={92} y={62} s={1.1} retraso={-0.4} />
        <Estrella x={186} y={50} s={1.3} retraso={-1.5} color="#fde68a" />
        <Estrella x={176} y={118} s={0.9} retraso={-2.3} />
        <Estrella x={206} y={92} s={0.8} retraso={-0.9} color="#fbcfe8" />
        <Estrella x={84} y={118} s={0.8} retraso={-1.9} color="#fde68a" />
      </svg>
      <Aviso texto="Cita 3:00 pm" lado="izq" />
    </Marco>
  )
}
