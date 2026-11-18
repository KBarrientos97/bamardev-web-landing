import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'
import './EscenasPelo.css'

/*
  Escenas animadas de Peluquería y Barbería (SVG propio, sin imágenes de stock).
  Mismo método que Escenas.tsx: sólo transform y opacity con CSS; los keyframes
  `esc-pelo-*` viven en EscenasPelo.css. Las partes que giran sobre un pivote
  concreto (tijeras, péndulos, letrero) llevan el pivote en coordenadas del viewBox.
*/

/** Estrella de cuatro puntas ✦ que titila (el trazo va centrado en 0,0). */
function Estrella({ x, y, s = 1, color, retraso }: { x: number; y: number; s?: number; color: string; retraso: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        className="esc-pelo-brillo"
        d="M0-6.5C.9-2.4 2.4-.9 6.5 0 2.4.9.9 2.4 0 6.5-.9 2.4-2.4.9-6.5 0-2.4-.9-.9-2.4 0-6.5Z"
        fill={color}
        style={{ animationDelay: `${retraso}s` }}
      />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  PELUQUERÍA                                                         */
/* ------------------------------------------------------------------ */

/** Un mechón ondulado que cae desde la punta de las tijeras (origen en 0,0). */
function Mechon({ x, y, dx, giro, retraso, escala = 1 }: { x: number; y: number; dx: number; giro: number; retraso: number; escala?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <g className="esc-pelo-mechon" style={v({ '--dx': `${dx}px`, '--giro': `${giro}deg`, animationDelay: `${retraso}s` })}>
        <path d="M0 0C3.4 5-3.4 10 0 15S3.4 25 0 30" stroke="#a4522a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M3.2 1.5C6.6 6.5-.2 11.5 3.2 16.5S6.6 26 3.2 30" stroke="#cf7a42" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <path d="M-3 1C.4 6-6 10.5-2.6 15.5S0 22-2.6 25" stroke="#873c1d" strokeWidth="1.9" strokeLinecap="round" fill="none" />
      </g>
    </g>
  )
}

/** Una peluquería: espejo con destello, tijeras que cortan en el aire y mechones que caen, secador y estrellitas. */
export function EscenaPeluqueria() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  // Retraso común (negativo): al primer cuadro las tijeras ya van a mitad del ciclo.
  const R = -1.2
  return (
    <Marco fondo="bg-gradient-to-b from-rose-100 via-pink-50 to-white">
      <div aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('oro')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde9a0" />
            <stop offset=".5" stopColor="#f6bd45" />
            <stop offset="1" stopColor="#d99522" />
          </linearGradient>
          <linearGradient id={g('vid')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1f6" />
            <stop offset="1" stopColor="#f9c9de" />
          </linearGradient>
          <linearGradient id={g('rosa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fda4b8" />
            <stop offset="1" stopColor="#f0587c" />
          </linearGradient>
          <linearGradient id={g('acero')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f7fb" />
            <stop offset=".5" stopColor="#c3cddb" />
            <stop offset="1" stopColor="#8999b0" />
          </linearGradient>
          <linearGradient id={g('pelo')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9743a" />
            <stop offset="1" stopColor="#9c4220" />
          </linearGradient>
          <linearGradient id={g('capa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c4b5fd" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id={g('piso')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbd0e1" />
            <stop offset="1" stopColor="#f5a9c6" />
          </linearGradient>
          <linearGradient id={g('sec')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffb3c6" />
            <stop offset="1" stopColor="#f2688f" />
          </linearGradient>
          <linearGradient id={g('mesa')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffafb" />
            <stop offset="1" stopColor="#f6d3df" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <ellipse cx="54" cy="84" rx="29.5" ry="45.5" />
          </clipPath>
        </defs>

        {/* piso y sombras */}
        <rect x="16" y="150" width="268" height="14" rx="7" fill="#f09bbb" />
        <rect x="16" y="145" width="268" height="14" rx="7" fill={`url(#${g('piso')})`} />
        <ellipse className="esc-sombra" cx="54" cy="152" rx="36" ry="3.4" fill="#7a1d3f" opacity=".16" />
        <ellipse cx="150" cy="154" rx="46" ry="3.2" fill="#7a1d3f" opacity=".1" />
        <ellipse cx="274" cy="152" rx="26" ry="3" fill="#7a1d3f" opacity=".14" />

        {/* ESPEJO: pie, marco dorado con cara oscura, cristal, reflejo y destello */}
        <rect x="50" y="134" width="8" height="12" rx="2" fill="#d8962a" />
        <rect x="32" y="142" width="44" height="9" rx="4.5" fill="#d8962a" />
        <rect x="32" y="141" width="44" height="6" rx="3" fill="#fbe39a" />
        <ellipse cx="57" cy="86" rx="36" ry="52" fill="#c98717" />
        <ellipse cx="54" cy="84" rx="36" ry="52" fill={`url(#${g('oro')})`} />
        <ellipse cx="54" cy="84" rx="32.5" ry="48.5" fill="#d9952a" />
        <ellipse cx="54" cy="84" rx="30.5" ry="46.5" fill={`url(#${g('vid')})`} />
        <path d="M24 66C26 44 40 33 54 33" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".7" />

        <g clipPath={`url(#${g('cv')})`}>
          {/* reflejo: una clienta con capa lila */}
          <g opacity=".92">
            <g className="esc-pelo-melena">
              <path d="M40 90C36 66 72 66 68 90C72 104 68 117 62 119H46C40 117 36 104 40 90Z" fill={`url(#${g('pelo')})`} />
            </g>
            <ellipse cx="54" cy="136" rx="27" ry="20" fill={`url(#${g('capa')})`} />
            <path d="M44 117C48 124 60 124 64 117L66 128C60 133 48 133 42 128Z" fill="#fff" opacity=".85" />
            <rect x="49" y="100" width="10" height="13" rx="4" fill="#efbf9f" />
            <circle cx="54" cy="89" r="12.5" fill="#fde2cb" />
            <path d="M41 88C41 70 67 70 67 88C62 80 52 77 41 88Z" fill="#e0824a" className="esc-pelo-melena" />
            <path d="M48.5 92.5q1.5 1.6 3 0M56.5 92.5q1.5 1.6 3 0" stroke="#8a4a32" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M51 98q3 2.6 6 0" stroke="#e0587e" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            <circle cx="46.5" cy="96.5" r="2.4" fill="#fb9db4" opacity=".6" />
            <circle cx="61.5" cy="96.5" r="2.4" fill="#fb9db4" opacity=".6" />
          </g>
          <path d="M22 78L40 46H52L30 110Z" fill="#fff" opacity=".22" />
          {/* destello diagonal que recorre el cristal */}
          <g transform="translate(54 84)">
            <path className="esc-pelo-destello" d="M-3-58H14L-6 58H-23Z" fill="#fff" style={{ animationDelay: `${R}s` }} />
            <path className="esc-pelo-destello" d="M-26-58H-22L-42 58H-46Z" fill="#fff" style={{ animationDelay: `${R + 0.18}s` }} />
          </g>
        </g>
        {/* gema del marco */}
        <circle cx="54" cy="33" r="4.4" fill="#fb7185" stroke="#fde9a0" strokeWidth="1.6" />
        <circle className="esc-latido" cx="52.8" cy="31.8" r="1.2" fill="#fff" opacity=".85" />

        {/* MESITA con secador */}
        <rect x="256" y="126" width="5" height="22" rx="2" fill="#e6a9bf" />
        <rect x="288" y="126" width="5" height="22" rx="2" fill="#d98fad" />
        <rect x="250" y="118" width="50" height="9" rx="4" fill="#e5a6bd" />
        <rect x="250" y="116" width="50" height="8" rx="4" fill={`url(#${g('mesa')})`} />
        <g className="esc-pelo-vibra">
          <rect x="250" y="82" width="9" height="15" rx="3" fill="#f0749a" />
          <rect x="256" y="79" width="36" height="20" rx="10" fill={`url(#${g('sec')})`} />
          <rect x="262" y="82" width="26" height="4" rx="2" fill="#fff" opacity=".5" />
          <rect x="285" y="82" width="5" height="14" rx="2.5" fill="#d9487a" opacity=".55" />
          <rect x="274" y="94" width="11" height="22" rx="5" fill="#ee6a93" />
          <rect x="276" y="96" width="3" height="18" rx="1.5" fill="#fff" opacity=".35" />
        </g>
        {/* aire tibio del secador */}
        <g transform="translate(246 85)">
          <path className="esc-pelo-aire" d="M0 0q-5-2.4-10 0" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" fill="none" style={{ animationDelay: `${R}s` }} />
        </g>
        <g transform="translate(246 90)">
          <path className="esc-pelo-aire" d="M0 0q-6-2.4-12 0" stroke="#fb98b8" strokeWidth="1.8" strokeLinecap="round" fill="none" style={{ animationDelay: `${R + 0.5}s` }} />
        </g>
        <g transform="translate(246 95)">
          <path className="esc-pelo-aire" d="M0 0q-5-2.4-10 0" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" fill="none" style={{ animationDelay: `${R + 1}s` }} />
        </g>

        {/* estrellitas */}
        <Estrella x={103} y={30} s={1} color="#fbbf24" retraso={-0.4} />
        <Estrella x={188} y={46} s={0.85} color="#f472b6" retraso={-1.5} />
        <Estrella x={236} y={34} s={1.1} color="#fbbf24" retraso={-2.3} />
        <Estrella x={22} y={36} s={0.8} color="#f472b6" retraso={-0.9} />
        <Estrella x={160} y={120} s={0.75} color="#fbbf24" retraso={-1.9} />

        {/* TIJERAS: inclinadas 8°, flotan; las hojas giran sobre el tornillo (152,78) */}
        <g className="esc-flotar-suave">
          <g style={{ transformBox: 'view-box', transformOrigin: '152px 78px', transform: 'rotate(8deg)' }}>
            {/* hoja de abajo (su mango queda arriba) */}
            <g className="esc-pelo-corte-b" style={{ animationDelay: `${R}s` }}>
              <path d="M145 72Q190 74 225 77.6L225 78.8Q190 80.5 145 85Z" fill="#9aa9bd" />
              <path d="M145 76Q190 77.4 225 78.2L225 78.8Q190 80.5 145 85Z" fill="#7d8da5" />
              <path d="M150 80L121 65" stroke="#f0587c" strokeWidth="5.5" strokeLinecap="round" />
              <circle cx="113" cy="62" r="9" fill="none" stroke="#f0587c" strokeWidth="4.6" />
              <path d="M106.6 57.4A9 9 0 0 1 114 53.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".65" />
            </g>
            {/* hoja de arriba (su mango queda abajo) */}
            <g className="esc-pelo-corte-a" style={{ animationDelay: `${R}s` }}>
              <path d="M145 72Q190 74 225 77.6L225 78.6Q190 80.5 145 85Z" fill={`url(#${g('acero')})`} stroke="#8a98ad" strokeWidth=".6" strokeLinejoin="round" />
              <path d="M150 74.6Q190 76 220 78" stroke="#fff" strokeWidth="1" strokeLinecap="round" fill="none" opacity=".8" />
              <path d="M150 76L121 91" stroke={`url(#${g('rosa')})`} strokeWidth="5.5" strokeLinecap="round" />
              <circle cx="113" cy="94" r="9" fill="none" stroke={`url(#${g('rosa')})`} strokeWidth="4.6" />
              <path d="M106.6 98.6A9 9 0 0 0 114 102.8" stroke="#c93a5f" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".5" />
              <path d="M107 89.6A9 9 0 0 1 113 85" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".7" />
            </g>
            {/* tornillo */}
            <circle cx="152" cy="78.5" r="4.3" fill="#e0a02a" />
            <circle cx="151.4" cy="77.6" r="3.1" fill="#fbd673" />
            <path d="M149.6 78.2h4.4" stroke="#b9791a" strokeWidth=".9" strokeLinecap="round" />
          </g>
          {/* mechones que caen desde la punta (221,89) justo al cerrar */}
          <Mechon x={221} y={89} dx={14} giro={150} retraso={R} escala={1.3} />
          <Mechon x={221} y={89} dx={-10} giro={-170} retraso={R + 0.72} escala={1.15} />
          <Mechon x={221} y={89} dx={4} giro={110} retraso={R + 0.9} escala={0.8} />
        </g>
      </svg>
      <Aviso texto="Cita 4:30 pm" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  BARBERÍA                                                           */
/* ------------------------------------------------------------------ */

/** Burbuja de espuma que sube del tazón. */
function Burbuja({ x, y = 114, r, dx, retraso }: { x: number; y?: number; r: number; dx: number; retraso: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="esc-pelo-burbuja" style={v({ '--dx': `${dx}px`, animationDelay: `${retraso}s` })}>
        <circle r={r} fill="#fff" fillOpacity=".8" stroke="#8cc4f6" strokeWidth="1" />
        <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.28} fill="#fff" />
      </g>
    </g>
  )
}

/** Una barbería: poste de barbero de franjas que suben sin fin, navaja y peine que se mecen, letrero y espuma. */
export function EscenaBarberia() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  // Franjas del poste: 16 bandas de 10 de alto (rojo, blanco, azul en ciclo de 30) inclinadas 18.
  const colores = ['#f56a6a', '#ffffff', '#5b9bf0']
  const bandas = Array.from({ length: 16 }, (_, k) => {
    const y0 = 22 + 10 * k
    return { d: `M133 ${y0}L167 ${y0 - 18}V${y0 - 8}L133 ${y0 + 10}Z`, c: colores[k % 3] }
  })
  const dientes = Array.from({ length: 11 }, (_, i) => 78.6 + i * 2.85)
  return (
    <Marco fondo="bg-gradient-to-b from-sky-100 via-blue-50 to-white">
      <div aria-hidden className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('crom')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8d9db2" />
            <stop offset=".28" stopColor="#f7fafd" />
            <stop offset=".6" stopColor="#bcc8d8" />
            <stop offset="1" stopColor="#7a8aa0" />
          </linearGradient>
          <linearGradient id={g('cil')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1e3a8a" stopOpacity=".34" />
            <stop offset=".2" stopColor="#fff" stopOpacity=".5" />
            <stop offset=".38" stopColor="#fff" stopOpacity=".04" />
            <stop offset=".72" stopColor="#1e3a8a" stopOpacity=".05" />
            <stop offset="1" stopColor="#1e3a8a" stopOpacity=".4" />
          </linearGradient>
          <linearGradient id={g('rot')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b6fd6" />
            <stop offset="1" stopColor="#1f45a8" />
          </linearGradient>
          <linearGradient id={g('mad')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fde1b6" />
            <stop offset="1" stopColor="#e0aa6c" />
          </linearGradient>
          <linearGradient id={g('man')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7fb6f3" />
            <stop offset="1" stopColor="#3f7fdc" />
          </linearGradient>
          <linearGradient id={g('ace')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4f7fb" />
            <stop offset=".55" stopColor="#b9c5d6" />
            <stop offset="1" stopColor="#8190a8" />
          </linearGradient>
          <linearGradient id={g('pei')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe9a8" />
            <stop offset="1" stopColor="#f2b03c" />
          </linearGradient>
          <linearGradient id={g('taz')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f2f9ff" />
            <stop offset=".55" stopColor="#bcdcfa" />
            <stop offset="1" stopColor="#82b6ee" />
          </linearGradient>
          <linearGradient id={g('piso')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c8e3fb" />
            <stop offset="1" stopColor="#9cccf3" />
          </linearGradient>
          <clipPath id={g('cv')}>
            <rect x="133" y="52" width="34" height="75" rx="3" />
          </clipPath>
        </defs>

        {/* piso y sombras */}
        <rect x="16" y="150" width="268" height="14" rx="7" fill="#78b2e8" />
        <rect x="16" y="145" width="268" height="14" rx="7" fill={`url(#${g('piso')})`} />
        <path d="M60 147h180M110 146v12M200 146v12" stroke="#8ec0ee" strokeWidth="1" opacity=".7" />
        <ellipse className="esc-sombra" cx="150" cy="152" rx="40" ry="3.6" fill="#0b3a6e" opacity=".16" />
        <ellipse cx="232" cy="151" rx="26" ry="3" fill="#0b3a6e" opacity=".12" />

        {/* tablero de pared con riel; navaja y peine cuelgan y se mecen */}
        <rect x="20" y="46" width="98" height="99" rx="10" fill="#fff" opacity=".5" />
        <rect x="20" y="46" width="98" height="5" rx="2.5" fill="#fff" opacity=".7" />
        <rect x="28" y="57" width="82" height="6" rx="3" fill="#c98f52" />
        <rect x="28" y="55" width="82" height="6" rx="3" fill={`url(#${g('mad')})`} />
        <circle cx="31.5" cy="58" r="1.3" fill="#b9791a" />
        <circle cx="106.5" cy="58" r="1.3" fill="#b9791a" />

        {/* navaja */}
        <g className="esc-pelo-pendulo" style={{ transformOrigin: '50px 61px', animationDelay: '-1.1s' }}>
          <path d="M50 61V74" stroke="#9a7a52" strokeWidth="1.2" />
          <circle cx="50" cy="61" r="2.2" fill="#e0a02a" />
          <rect x="44" y="73" width="12" height="35" rx="5.5" fill="#2f66c9" />
          <rect x="44" y="73" width="7.5" height="35" rx="3.7" fill={`url(#${g('man')})`} />
          <rect x="46" y="76" width="2.4" height="26" rx="1.2" fill="#fff" opacity=".5" />
          <path d="M45.5 107.5L54.5 104L77 130.5Q78.5 134 74 133.4L47 115Z" fill={`url(#${g('ace')})`} />
          <path d="M52 108L74 131" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".75" />
          <circle cx="50" cy="106" r="3" fill="#e0a02a" />
          <circle cx="49.2" cy="105.1" r="1.1" fill="#fff" opacity=".7" />
        </g>
        {/* peine */}
        <g className="esc-pelo-pendulo" style={{ transformOrigin: '92px 61px', animationDelay: '-2.4s' }}>
          <circle cx="92" cy="61" r="2.2" fill="#e0a02a" />
          <path d="M92 61L79 76M92 61L105 76" stroke="#9a7a52" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="75.5" y="75" width="33" height="9.5" rx="4" fill="#e69a1e" />
          <rect x="75.5" y="74" width="33" height="9" rx="4" fill={`url(#${g('pei')})`} />
          <rect x="79" y="76" width="22" height="2" rx="1" fill="#fff" opacity=".6" />
          {dientes.map((x, i) => (
            <rect key={i} x={x} y="83" width="1.9" height={i % 2 === 0 ? 17 : 15.5} rx=".95" fill="#f0b73f" />
          ))}
        </g>

        {/* POSTE DE BARBERO */}
        <circle className="esc-parpadeo" cx="150" cy="86" r="44" fill="#fff" />
        {/* base y tapa de abajo */}
        <rect x="127" y="137" width="46" height="10" rx="5" fill="#74849b" />
        <rect x="127" y="135" width="46" height="9" rx="4.5" fill={`url(#${g('crom')})`} />
        <rect x="130" y="125" width="40" height="13" rx="4" fill={`url(#${g('crom')})`} />
        <rect x="132" y="126.5" width="36" height="2.4" rx="1.2" fill="#fff" opacity=".55" />
        {/* vidrio con franjas que suben */}
        <g clipPath={`url(#${g('cv')})`}>
          <rect x="133" y="52" width="34" height="75" fill="#fff" />
          <g className="esc-pelo-franjas">
            {bandas.map((b, i) => (
              <path key={i} d={b.d} fill={b.c} />
            ))}
          </g>
          <rect x="133" y="52" width="34" height="75" fill={`url(#${g('cil')})`} />
          <rect x="133" y="52" width="34" height="5" fill="#1e3a8a" opacity=".1" />
          <rect x="133" y="122" width="34" height="5" fill="#1e3a8a" opacity=".1" />
        </g>
        <rect x="138.5" y="55" width="3.6" height="69" rx="1.8" fill="#fff" opacity=".6" />
        <rect x="144" y="56" width="1.6" height="30" rx=".8" fill="#fff" opacity=".35" />
        {/* tapa de arriba, cúpula y bolita */}
        <rect x="130" y="41" width="40" height="12" rx="4" fill={`url(#${g('crom')})`} />
        <rect x="132" y="42.5" width="36" height="2.4" rx="1.2" fill="#fff" opacity=".6" />
        <path d="M134 41Q150 12 166 41Z" fill={`url(#${g('crom')})`} />
        <path d="M139 36Q148 20 152 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".6" />
        <circle cx="150" cy="16" r="3.8" fill="#9aa9bd" />
        <circle cx="149" cy="15" r="1.6" fill="#fff" opacity=".85" />

        {/* LETRERO colgado de dos cadenas */}
        <g className="esc-pelo-letrero">
          <path d="M202 0V32M262 0V32" stroke="#e8b33a" strokeWidth="1.8" strokeDasharray="2.4 1.6" />
          <rect x="190" y="34" width="84" height="26" rx="8" fill="#17338a" />
          <rect x="190" y="30" width="84" height="26" rx="8" fill={`url(#${g('rot')})`} />
          <rect x="195" y="34.5" width="74" height="17" rx="5" fill="none" stroke="#fcd34d" strokeWidth="1.2" opacity=".9" />
          <rect x="194" y="32.5" width="76" height="3.4" rx="1.7" fill="#fff" opacity=".28" />
          <text x="232" y="47.5" textAnchor="middle" fontSize="12.5" fontWeight="800" letterSpacing="2.6" fill="#fff">
            BARBER
          </text>
          <circle cx="201" cy="30.5" r="2.2" fill="#fcd34d" />
          <circle cx="263" cy="30.5" r="2.2" fill="#fcd34d" />
        </g>

        {/* TAZÓN de espuma con brocha */}
        <path d="M209 128H255Q255 149 232 149Q209 149 209 128Z" fill={`url(#${g('taz')})`} />
        <path d="M214 134Q216 143 224 146" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".6" />
        <ellipse cx="232" cy="128" rx="23.5" ry="5.4" fill="#d3e8fb" />
        <path d="M241 112L253 82" stroke="#2f66c9" strokeWidth="6" strokeLinecap="round" />
        <path d="M239.8 112L251.6 83" stroke="#7fb6f3" strokeWidth="2" strokeLinecap="round" />
        <circle cx="253.4" cy="81.2" r="3.6" fill="#e0a02a" />
        <ellipse cx="232" cy="125.5" rx="20" ry="4.4" fill="#fff" />
        <circle className="esc-latido" cx="222" cy="120.5" r="7.6" fill="#fff" />
        <circle className="esc-latido" cx="234" cy="117.5" r="8.8" fill="#fff" style={{ animationDelay: '-.9s' }} />
        <circle className="esc-latido" cx="244.5" cy="121.5" r="6.6" fill="#fff" style={{ animationDelay: '-1.7s' }} />
        <circle cx="231.5" cy="114.6" r="2.4" fill="#e3f0fc" />
        <ellipse cx="238" cy="113.5" rx="6.2" ry="4.8" fill="#fff" />
        <path d="M216 122.5q5.5 2.6 11 0" stroke="#cfe3f7" strokeWidth="1.3" strokeLinecap="round" fill="none" />

        {/* burbujas de espuma que suben */}
        <Burbuja x={222} r={3.4} dx={-8} retraso={-0.4} />
        <Burbuja x={236} r={2.6} dx={6} retraso={-1.5} />
        <Burbuja x={246} r={3.8} dx={10} retraso={-2.6} />
        <Burbuja x={230} r={2.1} dx={-3} retraso={-3.5} />

        {/* estrellitas */}
        <Estrella x={188} y={86} s={0.9} color="#fbbf24" retraso={-0.6} />
        <Estrella x={274} y={104} s={0.8} color="#60a5fa" retraso={-1.8} />
        <Estrella x={124} y={110} s={0.8} color="#60a5fa" retraso={-2.5} />
        <Estrella x={62} y={36} s={0.8} color="#fbbf24" retraso={-1.2} />
      </svg>
      <Aviso texto="Cola: 2 esperando" lado="izq" />
    </Marco>
  )
}
