import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'
import './EscenasPelo.css'

/*
  Escenas animadas de Peluquería y Barbería (SVG propio, sin imágenes de stock).
  Un objeto héroe por escena, centrado y entero, sobre una plataforma de elipse con
  sombra de contacto. Luz desde arriba a la izquierda: brillos arriba-izquierda,
  sombras propias abajo-derecha. Sólo transform y opacity con CSS; los keyframes
  `esc-pelo-*` viven en EscenasPelo.css. Ciclo maestro de 6.5 s en las dos escenas
  (el mismo del aviso `esc-chip`), así el aviso entra justo después de la acción
  que lo causa.
*/

/**
 * Las reglas globales `.escena svg *` ponen el origen de transform al centro de cada caja, y eso
 * altera cualquier `transform="rotate()/scale()"` escrito como atributo. Con este style el atributo
 * vuelve a leerse desde el origen del viewBox, como en SVG puro.
 */
const ORIGEN_SVG = { transformBox: 'view-box', transformOrigin: '0 0' } as const

/** Plataforma de elipse con borde y sombras de contacto (la misma en todas las escenas). */
function Plataforma({ id, claro, medio, borde, sombra }: { id: string; claro: string; medio: string; borde: string; sombra: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}plat`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={claro} />
          <stop offset="1" stopColor={medio} />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="154" rx="132" ry="10" fill={borde} />
      <ellipse cx="150" cy="151" rx="132" ry="10" fill={`url(#${id}plat)`} />
      {/* sombra ancha y difusa + sombra de contacto más oscura bajo el héroe */}
      <ellipse cx="150" cy="151" rx="104" ry="7" fill={sombra} opacity=".07" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  PELUQUERÍA                                                         */
/* ------------------------------------------------------------------ */

/** Una peluquería: espejo ovalado sobre un tocador; en el reflejo, las tijeras cortan un mechón que cae. */
export function EscenaPeluqueria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  return (
    <Marco fondo="bg-gradient-to-b from-rose-100 via-pink-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('oro')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbeab5" />
            <stop offset=".5" stopColor="#e6bb5c" />
            <stop offset="1" stopColor="#bd8a2c" />
          </linearGradient>
          <linearGradient id={g('bisel')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b8862a" />
            <stop offset="1" stopColor="#e9c46d" />
          </linearGradient>
          <linearGradient id={g('vid')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff7fa" />
            <stop offset="1" stopColor="#f7cddd" />
          </linearGradient>
          <linearGradient id={g('pelo')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#cf6e3c" />
            <stop offset="1" stopColor="#8d3b1e" />
          </linearGradient>
          <linearGradient id={g('capa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d4c6fb" />
            <stop offset="1" stopColor="#9d85ee" />
          </linearGradient>
          <linearGradient id={g('piel')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe8d6" />
            <stop offset="1" stopColor="#f2c4a2" />
          </linearGradient>
          <linearGradient id={g('acero')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8fafd" />
            <stop offset=".5" stopColor="#c6d0de" />
            <stop offset="1" stopColor="#8d9db3" />
          </linearGradient>
          <linearGradient id={g('rosa')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff9db5" />
            <stop offset="1" stopColor="#e8456f" />
          </linearGradient>
          <linearGradient id={g('losa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffbfc" />
            <stop offset="1" stopColor="#f8dce6" />
          </linearGradient>
          <linearGradient id={g('cuerpo')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbe3eb" />
            <stop offset="1" stopColor="#eab4c8" />
          </linearGradient>
          <linearGradient id={g('cajon')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0f5" />
            <stop offset="1" stopColor="#f6cfdc" />
          </linearGradient>
          <linearGradient id={g('sec')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffc6d5" />
            <stop offset="1" stopColor="#e9628b" />
          </linearGradient>
          <linearGradient id={g('boq')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7b6a92" />
            <stop offset="1" stopColor="#4d4064" />
          </linearGradient>
          <linearGradient id={g('crom')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9aa8bc" />
            <stop offset=".35" stopColor="#f4f7fb" />
            <stop offset="1" stopColor="#8794aa" />
          </linearGradient>
          <linearGradient id={g('asie')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e6daf3" />
            <stop offset="1" stopColor="#b9a6d6" />
          </linearGradient>
          <linearGradient id={g('luz')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".6" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <ellipse cx="150" cy="72" rx="43" ry="49" />
          </clipPath>
        </defs>

        <Plataforma id={id} claro="#fff1f6" medio="#f8c7da" borde="#e99db9" sombra="#7a1d3f" />
        <ellipse className="esc-sombra" cx="150" cy="150" rx="76" ry="4.6" fill="#7a1d3f" opacity=".14" />

        {/* SECUNDARIO IZQUIERDO: banqueta de peluquería, en tonos apagados para dar profundidad */}
        <ellipse cx="52" cy="149" rx="19" ry="3" fill="#7a1d3f" opacity=".1" />
        <rect x="50" y="117" width="4.4" height="26" rx="2" fill={`url(#${g('crom')})`} />
        <path d="M41 148Q52 134 63 148Z" fill={`url(#${g('crom')})`} />
        <ellipse cx="52" cy="148" rx="12" ry="2.6" fill="#8794aa" opacity=".6" />
        <path d="M33 104V111Q33 118 52 118Q71 118 71 111V104Z" fill="#a994c9" />
        <path d="M33 104V111Q33 118 52 118Q57 118 60 117.5Q38 116 35 106Z" fill="#c9b9e3" opacity=".7" />
        <ellipse cx="52" cy="104" rx="19" ry="5.6" fill={`url(#${g('asie')})`} />
        <path d="M40 102.4Q48 100 58 100.6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".6" />

        {/* TOCADOR: patas, cuerpo con dos cajones, losa de arriba */}
        <rect x="88" y="148" width="6" height="4" rx="1.5" fill="#d890ab" />
        <rect x="212" y="148" width="6" height="4" rx="1.5" fill="#d890ab" />
        <rect x="84" y="130" width="138" height="20" rx="2.5" fill={`url(#${g('cuerpo')})`} />
        <rect x="90" y="134" width="58" height="12" rx="2" fill={`url(#${g('cajon')})`} />
        <rect x="158" y="134" width="58" height="12" rx="2" fill={`url(#${g('cajon')})`} />
        <path d="M91 145.4H147M159 145.4H215" stroke="#dd9fb8" strokeWidth="1" strokeLinecap="round" opacity=".7" />
        <circle cx="119" cy="140" r="2" fill="#d9a43c" />
        <circle cx="118.4" cy="139.3" r=".8" fill="#fff" opacity=".8" />
        <circle cx="187" cy="140" r="2" fill="#d9a43c" />
        <circle cx="186.4" cy="139.3" r=".8" fill="#fff" opacity=".8" />
        <rect x="78" y="124.5" width="150" height="7" rx="3.5" fill="#e6b2c6" />
        <rect x="78" y="123.5" width="150" height="6" rx="3" fill={`url(#${g('losa')})`} />
        <path d="M84 124.2H222" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".9" />

        {/* ESPEJO héroe: soporte, marco dorado con bisel, cristal con reflejo */}
        <path d="M136 125L141 118H159L164 125Z" fill={`url(#${g('oro')})`} />
        <ellipse cx="152" cy="75" rx="48" ry="54" fill="#b98a2e" opacity=".22" />
        <ellipse cx="150" cy="72" rx="48" ry="54" fill={`url(#${g('oro')})`} />
        <ellipse cx="150" cy="72" rx="44.5" ry="50.5" fill={`url(#${g('bisel')})`} />
        <ellipse cx="150" cy="72" rx="43" ry="49" fill={`url(#${g('vid')})`} />
        <path d="M110 58C114 40 130 26 150 24" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".55" />

        <g clipPath={`url(#${g('cv')})`}>
          {/* reflejo: la clienta con capa lila, de perfil a la izquierda; deja el aire a las tijeras */}
          <g className="esc-pelo-melena">
            <path d="M117 62C117 45 147 45 147 62C149 77 149 86 145 91H121C117 86 117 77 117 62Z" fill={`url(#${g('pelo')})`} />
          </g>
          <path d="M103 124C103 101 116 91 132 91C148 91 161 101 161 124Z" fill={`url(#${g('capa')})`} />
          <path d="M124 91L132 102L140 91Z" fill="#fff" opacity=".8" />
          <rect x="127" y="73" width="10" height="15" rx="4" fill="#f0c1a0" />
          <circle cx="132" cy="63" r="11.5" fill={`url(#${g('piel')})`} />
          <path d="M120 62C121 49 142 48 144 60C138 55 128 54 120 62Z" fill="#c4622f" />
          <path d="M127.5 66.4q1.4 1.5 2.8 0M134.5 66.4q1.4 1.5 2.8 0" stroke="#8a4a32" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M130 71q2.4 1.8 4.8 0" stroke="#e0587e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* mechón: la parte de arriba queda; la punta (debajo del corte) cae */}
          <path d="M145 62C153 67 150 77 153 87C154 90 154 92 154 94" stroke="#a24c25" strokeWidth="4.6" strokeLinecap="round" fill="none" />
          <path d="M146.6 63.5C153.4 68.5 151.2 77 154.2 86" stroke="#d98a52" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".85" />
          <g className="esc-pelo-punta">
            <path d="M154 94C156 99 151.5 103 154 111" stroke="#a24c25" strokeWidth="4.3" strokeLinecap="round" fill="none" />
            <path d="M155.6 95.5C157.4 99.5 153.4 103 155.4 108" stroke="#d98a52" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".85" />
          </g>
          <path className="esc-pelo-recorte" style={v({ '--dx': '8px', '--giro': '70deg' })} d="M156 95q2 3 0 6" stroke="#a24c25" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path className="esc-pelo-recorte" style={v({ '--dx': '-6px', '--giro': '-60deg', animationDelay: '.12s' })} d="M153 96q-2 3 0 6" stroke="#c4622f" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* TIJERAS en proporción: entran, abren, anticipan, cortan, rebotan y se retiran */}
          <g transform="translate(164 94.5) rotate(-10) scale(1)" style={ORIGEN_SVG}>
            <g className="esc-pelo-tijera">
              <g className="esc-pelo-corte-a">
                <path d="M3-2.2Q-8-1.8-19 .6V1.2Q-8 1.8 3 2.6Z" fill={`url(#${g('acero')})`} />
                <path d="M2 1.4L10.5 6.2" stroke={`url(#${g('rosa')})`} strokeWidth="3.2" strokeLinecap="round" />
                <circle cx="14.4" cy="8.6" r="4" fill="none" stroke={`url(#${g('rosa')})`} strokeWidth="2.4" />
                <path d="M11.2 6.8A4 4 0 0 1 14.6 4.7" stroke="#fff" strokeWidth=".9" strokeLinecap="round" fill="none" opacity=".7" />
              </g>
              <g className="esc-pelo-corte-b">
                <path d="M3 2.2Q-8 1.8-19-.6V-1.2Q-8-1.8 3-2.6Z" fill="#8d9db3" />
                <path d="M3 2.2Q-8 1.8-19-.6V-.2Q-8 .6 3 1.2Z" fill="#a9b6c8" />
                <path d="M2-1.4L10.5-6.2" stroke="#e8456f" strokeWidth="3.2" strokeLinecap="round" />
                <circle cx="14.4" cy="-8.6" r="4" fill="none" stroke="#e8456f" strokeWidth="2.4" />
                <path d="M11.2-6.8A4 4 0 0 0 14.6-4.7" stroke="#fff" strokeWidth=".9" strokeLinecap="round" fill="none" opacity=".6" />
              </g>
              <circle r="2.3" fill="#d9a43c" />
              <circle cx="-.6" cy="-.7" r="1.1" fill="#fbe39a" />
            </g>
          </g>

          {/* reflejo diagonal quieto + destello que cruza el cristal, a media historia */}
          <path d="M108 70L124 26H134L114 100Z" fill="#fff" opacity=".16" />
          <g transform="translate(150 72)">
            <path className="esc-pelo-destello" d="M-4-52H8L-12 52H-24Z" fill={`url(#${g('luz')})`} />
          </g>
        </g>
        {/* gema del marco */}
        <circle cx="150" cy="19" r="3.6" fill="#e8456f" />
        <circle cx="150" cy="19" r="3.6" fill="none" stroke="#fbe39a" strokeWidth="1.2" />
        <circle className="esc-pelo-gema" cx="148.9" cy="17.9" r="1.1" fill="#fff" />

        {/* SECUNDARIO DERECHO: secador sobre el tocador, con aire tibio */}
        <path d="M206 125V112Q206 110 208 110H212Q214 110 214 112V125Z" fill="#e65b85" />
        <rect x="207.2" y="112" width="2" height="12" rx="1" fill="#fff" opacity=".35" />
        <rect x="196" y="95" width="32" height="17" rx="8.5" fill={`url(#${g('sec')})`} />
        <rect x="201" y="97" width="20" height="2.4" rx="1.2" fill="#fff" opacity=".55" />
        <path d="M196 102a4 4 0 0 0 0 5" stroke="#b83e66" strokeWidth="1" opacity=".4" fill="none" />
        <rect x="224" y="97" width="8" height="13" rx="2.5" fill={`url(#${g('boq')})`} />
        <path d="M226 99.4V108" stroke="#fff" strokeWidth=".8" strokeLinecap="round" opacity=".35" />
        <g transform="translate(236 101)">
          <path className="esc-pelo-aire" d="M0 0q9-1.8 18 0" stroke="#f08fb0" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>
        <g transform="translate(236 104.5)">
          <path className="esc-pelo-aire" style={{ animationDelay: '-1.08s' }} d="M0 0q10-1.8 20 0" stroke="#f6a9c4" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>
        <g transform="translate(236 108)">
          <path className="esc-pelo-aire" style={{ animationDelay: '-2.17s' }} d="M0 0q9-1.8 18 0" stroke="#f08fb0" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>
      </svg>
      <Aviso
        etiqueta="Cita · Ana"
        texto="Hoy 5:00 pm"
        tono="rosa"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" />
            <path d="M3 9h14M7 2.5v4M13 2.5v4" />
          </svg>
        }
      />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  BARBERÍA                                                           */
/* ------------------------------------------------------------------ */

/** Burbuja de jabón que sube de la espuma mientras la brocha bate. */
function Burbuja({ x, y, r, dx, retraso }: { x: number; y: number; r: number; dx: number; retraso: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="esc-pelo-burbuja" style={v({ '--dx': `${dx}px`, animationDelay: `${retraso}s` })}>
        <circle r={r} fill="#fff" fillOpacity=".35" stroke="#a9cdf3" strokeWidth=".9" />
        <path d={`M${-r * 0.55} ${-r * 0.15}A${r * 0.6} ${r * 0.6} 0 0 1 ${-r * 0.05} ${-r * 0.6}`} stroke="#fff" strokeWidth=".9" strokeLinecap="round" fill="none" />
      </g>
    </g>
  )
}

/** Una barbería: poste de barbero héroe con letrero BARBER, y un carrito con brocha, espuma y navaja. */
export function EscenaBarberia() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  // Franjas del poste: bandas de 10 de alto (rojo, blanco, azul en ciclo de 30) inclinadas 16 sobre 30 de ancho.
  const colores = ['#e24b57', '#fbfdff', '#3d6bd0']
  const bandas = Array.from({ length: 15 }, (_, k) => {
    const y0 = 24 + 10 * k
    return { d: `M135 ${y0}L165 ${y0 - 16}V${y0 - 6}L135 ${y0 + 10}Z`, c: colores[k % 3] }
  })
  return (
    <Marco fondo="bg-gradient-to-b from-sky-100 via-blue-50 to-white">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('crom')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8d9db2" />
            <stop offset=".3" stopColor="#f7fafd" />
            <stop offset=".62" stopColor="#bcc8d8" />
            <stop offset="1" stopColor="#74849b" />
          </linearGradient>
          <linearGradient id={g('cil')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1e3a8a" stopOpacity=".3" />
            <stop offset=".2" stopColor="#fff" stopOpacity=".38" />
            <stop offset=".38" stopColor="#fff" stopOpacity=".03" />
            <stop offset=".74" stopColor="#1e3a8a" stopOpacity=".05" />
            <stop offset="1" stopColor="#1e3a8a" stopOpacity=".36" />
          </linearGradient>
          <radialGradient id={g('halo')}>
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('rot')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2f55b5" />
            <stop offset="1" stopColor="#16296b" />
          </linearGradient>
          <linearGradient id={g('laton')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6dc8d" />
            <stop offset="1" stopColor="#c8962f" />
          </linearGradient>
          <linearGradient id={g('mad')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e4c79b" />
            <stop offset="1" stopColor="#bf9566" />
          </linearGradient>
          <linearGradient id={g('met')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9c6d8" />
            <stop offset="1" stopColor="#8b9bb3" />
          </linearGradient>
          <linearGradient id={g('taz')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7fbff" />
            <stop offset="1" stopColor="#a9c8ea" />
          </linearGradient>
          <linearGradient id={g('esp')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#cfe2f6" />
          </linearGradient>
          <linearGradient id={g('man')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8fb4ea" />
            <stop offset="1" stopColor="#4a72bd" />
          </linearGradient>
          <linearGradient id={g('ace')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6f9fc" />
            <stop offset="1" stopColor="#8e9db4" />
          </linearGradient>
          <linearGradient id={g('toa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#dbe6f3" />
          </linearGradient>
          <linearGradient id={g('hoja')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9cc4b4" />
            <stop offset="1" stopColor="#5e9783" />
          </linearGradient>
          <linearGradient id={g('maceta')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d3dcea" />
            <stop offset="1" stopColor="#97a8c2" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <rect x="135" y="40" width="30" height="75" rx="2.5" />
          </clipPath>
        </defs>

        <Plataforma id={id} claro="#e9f4ff" medio="#bcd8f5" borde="#97bde8" sombra="#0b3a6e" />

        {/* SECUNDARIO DERECHO: planta en maceta, apagada de tono */}
        <ellipse cx="246" cy="150" rx="19" ry="3" fill="#0b3a6e" opacity=".12" />
        <g className="esc-pelo-planta">
          <path d="M243 132C238 120 238 108 241 99C246 110 247 121 248 132Z" fill={`url(#${g('hoja')})`} />
          <path d="M247 132C248 118 251 108 256 101C257 112 256 123 252 132Z" fill="#6ea591" />
          <path d="M240 132C233 124 231 114 232 108C238 114 242 122 243 132Z" fill="#82b09d" />
          <path d="M251 132C254 124 260 118 265 116C264 123 259 129 254 132Z" fill="#82b09d" />
        </g>
        <path d="M233 134H259L256 149Q256 150 254.5 150H237.5Q236 150 236 149Z" fill={`url(#${g('maceta')})`} />
        <rect x="231" y="131" width="30" height="4.5" rx="2.2" fill="#c4d0e2" />
        <path d="M234 137L236 147" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity=".5" />

        {/* SECUNDARIO IZQUIERDO: carrito de barbero con brocha, espuma y navaja sobre la repisa y toallas abajo */}
        <g transform="translate(-6 0)">
          <ellipse cx="68" cy="150" rx="46" ry="3.4" fill="#0b3a6e" opacity=".1" />
          <rect x="31" y="111" width="3.6" height="32" rx="1.5" fill={`url(#${g('met')})`} />
          <rect x="104" y="111" width="3.6" height="32" rx="1.5" fill={`url(#${g('met')})`} />
          <circle cx="33" cy="146" r="3.4" fill="#5f6f89" />
          <circle cx="106" cy="146" r="3.4" fill="#5f6f89" />
          <circle cx="33" cy="146" r="1.2" fill="#cbd5e4" />
          <circle cx="106" cy="146" r="1.2" fill="#cbd5e4" />
          {/* repisa baja con toallas dobladas */}
          <rect x="30" y="131" width="80" height="4.2" rx="2" fill="#a98558" />
          <rect x="30" y="130" width="80" height="3.6" rx="1.8" fill={`url(#${g('mad')})`} />
          <rect x="40" y="123" width="36" height="7" rx="2.4" fill={`url(#${g('toa')})`} />
          <path d="M43 126.6H73" stroke="#c4d3e6" strokeWidth="1" strokeLinecap="round" />
          <rect x="43" y="116.5" width="30" height="6.6" rx="2.4" fill="#7ea3df" />
          <path d="M46 119.8H70" stroke="#a9c3ee" strokeWidth="1" strokeLinecap="round" />
          {/* repisa alta */}
          <rect x="26" y="107" width="88" height="5" rx="2.2" fill="#a98558" />
          <rect x="26" y="106" width="88" height="4.4" rx="2" fill={`url(#${g('mad')})`} />
          <path d="M30 106.6H110" stroke="#fff" strokeWidth=".8" strokeLinecap="round" opacity=".6" />
          {/* tazón con espuma */}
          <rect x="54" y="104.6" width="14" height="1.8" rx=".9" fill="#8fa8c6" />
          <path d="M44 94Q44 105 61 105Q78 105 78 94Z" fill={`url(#${g('taz')})`} />
          <path d="M44.6 98.4H77.4" stroke="#7ea3df" strokeWidth="1.3" opacity=".7" />
          <path d="M48 98Q50 103 56 104" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".7" />
          <ellipse cx="61" cy="94" rx="17" ry="3.6" fill="#dbe9f8" />
          <g className="esc-pelo-espuma">
            <path d="M46 94C44 86 51 82 55.5 84C57 77 66 77 68 83C74 82 78 88 76 94Q61 98 46 94Z" fill={`url(#${g('esp')})`} />
            <path d="M52 86C54 82.5 58 82.6 59.5 85" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          </g>
          {/* brocha: mango azul en la espuma, bate de lado a lado */}
          <g className="esc-pelo-brocha">
            <path d="M62 88L69.5 63" stroke="#456db8" strokeWidth="5.6" strokeLinecap="round" />
            <path d="M61 88L68.2 63.6" stroke={`url(#${g('man')})`} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M62.4 86.6L64 81.4" stroke={`url(#${g('ace')})`} strokeWidth="6.4" strokeLinecap="round" />
            <ellipse cx="70.4" cy="60.6" rx="4.2" ry="4.8" transform="rotate(16 70.4 60.6)" style={ORIGEN_SVG} fill="#456db8" />
            <ellipse cx="69.2" cy="59.4" rx="1.4" ry="2" transform="rotate(16 69.2 59.4)" style={ORIGEN_SVG} fill="#fff" opacity=".55" />
          </g>
          <Burbuja x={52} y={80} r={3.2} dx={-6} retraso={-3.6} />
          <Burbuja x={71} y={78} r={2.4} dx={7} retraso={-3.3} />
          <Burbuja x={60} y={74} r={1.9} dx={-2} retraso={-3} />
          {/* navaja recta apoyada en la repisa */}
          <path d="M90.5 104.5L83 87L84.6 86.4L93 103.6Z" fill={`url(#${g('ace')})`} />
          <path d="M84.6 86.4L93 103.6" stroke="#6f7f97" strokeWidth=".7" opacity=".7" />
          <path d="M83.6 88L90.6 103.6" stroke="#fff" strokeWidth=".6" opacity=".8" />
          <rect x="91" y="102" width="19" height="4.2" rx="2.1" fill="#33415d" />
          <rect x="92" y="102.6" width="17" height="1" rx=".5" fill="#fff" opacity=".28" />
          <circle cx="92.5" cy="104.1" r="1.4" fill="#d9a43c" />
          <circle cx="107.5" cy="104.1" r=".9" fill="#a9b6c8" />
        </g>

        {/* POSTE DE BARBERO héroe */}
        <ellipse className="esc-sombra" cx="150" cy="150" rx="40" ry="4.2" fill="#0b3a6e" opacity=".16" />
        <circle className="esc-pelo-halo" cx="150" cy="80" r="62" fill={`url(#${g('halo')})`} />
        {/* base y pedestal */}
        <rect x="118" y="143" width="64" height="8" rx="4" fill="#74849b" />
        <rect x="118" y="141.5" width="64" height="7" rx="3.5" fill={`url(#${g('crom')})`} />
        <path d="M139 142L142 125H158L161 142Z" fill={`url(#${g('crom')})`} />
        <rect x="130" y="114" width="40" height="11" rx="4" fill={`url(#${g('crom')})`} />
        <rect x="133" y="115.6" width="34" height="2" rx="1" fill="#fff" opacity=".6" />
        {/* vidrio con franjas que suben */}
        <g clipPath={`url(#${g('cv')})`}>
          <rect x="135" y="40" width="30" height="75" fill="#fbfdff" />
          <g className="esc-pelo-franjas">
            {bandas.map((b, i) => (
              <path key={i} d={b.d} fill={b.c} />
            ))}
          </g>
          <rect x="135" y="40" width="30" height="75" fill={`url(#${g('cil')})`} />
          <rect x="135" y="40" width="30" height="5" fill="#1e3a8a" opacity=".12" />
          <rect x="135" y="110" width="30" height="5" fill="#1e3a8a" opacity=".12" />
        </g>
        <rect x="139.4" y="44" width="2.8" height="66" rx="1.4" fill="#fff" opacity=".45" />
        {/* tapa de arriba, cúpula y remate */}
        <rect x="130" y="31" width="40" height="10" rx="4" fill={`url(#${g('crom')})`} />
        <rect x="133" y="32.6" width="34" height="2" rx="1" fill="#fff" opacity=".6" />
        <path d="M135 31Q150 11 165 31Z" fill={`url(#${g('crom')})`} />
        <path d="M140 29Q147 19 151 17.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".6" />
        <circle cx="150" cy="17" r="3.2" fill="#9aa9bd" />
        <circle cx="149.2" cy="16.2" r="1.2" fill="#fff" opacity=".85" />

        {/* LETRERO colgado de un brazo de latón, con balanceo amortiguado */}
        <path d="M164 50Q184 47 190 36.5" stroke={`url(#${g('laton')})`} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <rect x="167" y="34" width="86" height="3.2" rx="1.6" fill={`url(#${g('laton')})`} />
        <circle cx="254" cy="35.6" r="2.4" fill="#d9a43c" />
        <g className="esc-pelo-letrero">
          <path d="M188 36.5V54M240 36.5V54" stroke="#c8962f" strokeWidth="1.2" strokeDasharray="2 1.3" />
          <rect x="176" y="57" width="76" height="28" rx="5" fill="#0f1f55" opacity=".35" />
          <rect x="176" y="54" width="76" height="28" rx="5" fill={`url(#${g('rot')})`} />
          <rect x="179.5" y="57.5" width="69" height="21" rx="3" fill="none" stroke="#f2cf72" strokeWidth="1" opacity=".9" />
          <rect x="178" y="55" width="72" height="3" rx="1.5" fill="#fff" opacity=".16" />
          <text x="215.2" y="73.6" textAnchor="middle" fontSize="12.5" fontWeight="800" letterSpacing="2.2" fill="#0f1f55" opacity=".5">
            BARBER
          </text>
          <text x="214.2" y="72.6" textAnchor="middle" fontSize="12.5" fontWeight="800" letterSpacing="2.2" fill="#fff">
            BARBER
          </text>
          <circle cx="188" cy="54.4" r="1.8" fill="#f2cf72" />
          <circle cx="240" cy="54.4" r="1.8" fill="#f2cf72" />
        </g>
      </svg>
      <Aviso
        lado="izq"
        etiqueta="Turno · Cola"
        texto="2 esperando"
        tono="azul"
        icono={
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="10" r="7.2" />
            <path d="M10 5.8V10l2.8 1.8" />
          </svg>
        }
      />
    </Marco>
  )
}
