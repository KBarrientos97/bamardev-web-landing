import { useId } from 'react'
import { Aviso, Marco, svgBase, v } from './escenasBase'
import './Escenas.css'
import { EscenaMinimarket, EscenaFerreteria } from './EscenasComercio'
import { EscenaBillar, EscenaAcademia } from './EscenasBillarYAcademia'
import { EscenaLicoreria } from './EscenasLicoreria'
import { EscenaPostres } from './EscenasPostres'
import { EscenaPanaderia, EscenaCafeteria } from './EscenasPanaderiaCafeteria'
import { EscenaHeladeria, EscenaJugueria } from './EscenasHeladeriaJugueria'
import { EscenaSalteneria, EscenaBar } from './EscenasSalteneriaBar'
import { EscenaPeluqueria, EscenaBarberia } from './EscenasPelo'
import { EscenaSpa, EscenaUnas } from './EscenasBelleza'

/*
  Ilustraciones animadas de los rubros (SVG propio, sin imágenes de stock).
  Todo se mueve con CSS (transform y opacity: barato para el celular). Los
  keyframes de Pollo y Farmacia viven en Escenas.css; los compartidos `esc-*`,
  en index.css. Cada escena es decorativa: el nombre y los puntos de la tarjeta
  ya dicen lo mismo, así que va con aria-hidden.

  Pollo y Farmacia comparten el ciclo maestro de 6.5 s del aviso del sistema
  (esc-chip): lo que "causa" el aviso (el pedido que sale, la venta) pasa en los
  primeros segundos del ciclo, justo antes de que el aviso entre.
*/

/* ------------------------------------------------------------------ */
/*  FARMACIA                                                           */
/* ------------------------------------------------------------------ */

/** Caja de medicamento con volumen mínimo: luz arriba-izquierda y sombra propia abajo. */
function Caja({ x, y, w, h, c }: { x: number; y: number; w: number; h: number; c: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={c} />
      <rect x={x + 0.8} y={y + 0.6} width={w - 1.6} height="1.6" rx="0.8" fill="#fff" opacity=".45" />
      <rect x={x} y={y + h - 2.4} width={w} height="2.4" rx="1" fill="#0b3b66" opacity=".1" />
    </g>
  )
}

/** Cápsula que sale de la puerta con un arco corto (esc-farm-sube); el retraso la escalona. */
function Capsula({ x, y, dx, giro, retraso, color }: { x: number; y: number; dx: number; giro: number; retraso: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="esc-farm-sube" style={v({ '--dx': `${dx}px`, '--giro': `${giro}deg`, '--d': `${retraso}s` })}>
        <path d="M-7 0a3.5 3.5 0 0 1 3.5-3.5H0V3.5h-3.5A3.5 3.5 0 0 1-7 0z" fill={color} />
        <path d="M0-3.5h3.5A3.5 3.5 0 0 1 7 0a3.5 3.5 0 0 1-3.5 3.5H0z" fill="#fff" stroke="#d9c3cf" strokeWidth=".5" />
        <rect x="-5.6" y="-2.6" width="9" height="1.1" rx=".55" fill="#fff" opacity=".55" />
      </g>
    </g>
  )
}

function Mas({ x, y, dx, retraso }: { x: number; y: number; dx: number; retraso: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="esc-farm-sube" style={v({ '--dx': `${dx}px`, '--giro': '90deg', '--d': `${retraso}s` })}>
        <path d="M-1.6-5h3.2v3.4H5v3.2H1.6V5H-1.6V1.6H-5v-3.2h3.4z" fill="#34d399" />
      </g>
    </g>
  )
}

function Planta({ x, escala = 1, retraso = 0 }: { x: number; escala?: number; retraso?: number }) {
  return (
    <g transform={`translate(${x} 150) scale(${escala})`}>
      <ellipse cx="0" cy="2.4" rx="12" ry="3.6" fill="#0b3b66" opacity=".1" />
      <path d="M-10 0h20l-3 -11h-14z" fill="#d7b186" />
      <path d="M-8.4 -5h16.8l-.9-2h-15z" fill="#000" opacity=".06" />
      <rect x="-9.4" y="-12.6" width="18.8" height="2.6" rx="1.3" fill="#e4c49b" />
      <g className="esc-farm-planta" style={v({ '--d': `${retraso}s` })}>
        <path d="M0 -10C-2 -26 -10 -36 -20 -44" stroke="#4aa062" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M0 -10C0 -28 -3 -40 -4 -52" stroke="#348550" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M0 -10C3 -26 9 -36 18 -42" stroke="#4aa062" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M0 -10C-4 -22 -14 -28 -24 -30" stroke="#348550" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M0 -10C5 -22 14 -28 24 -29" stroke="#348550" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </g>
  )
}

/**
 * Una farmacia con la venta como micro-historia (ciclo de 6.5 s): se cobra, la cruz del cartel da un
 * latido y emite un aro, la vidriera se enciende, un destello cruza los vidrios, salen cápsulas y entra
 * el aviso. El resto del ciclo reposa: toldo y plantas se mecen apenas y el edificio flota 2 px.
 */
export function EscenaFarmacia() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const toldo = Array.from({ length: 6 }, (_, i) => ({ x: 99 + 24 * i, par: i % 2 === 0 }))
  return (
    <Marco fondo="bg-gradient-to-b from-sky-100 via-sky-50 to-white">
      <div aria-hidden className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/70 blur-2xl" />
      <svg viewBox="14 10 292 168" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          <linearGradient id={g('f')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a4d6f4" />
            <stop offset="1" stopColor="#6fb3e2" />
          </linearGradient>
          <linearGradient id={g('l')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4a98cf" />
            <stop offset="1" stopColor="#62b1e3" />
          </linearGradient>
          <linearGradient id={g('t')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d4eefc" />
            <stop offset="1" stopColor="#9fd3f2" />
          </linearGradient>
          <linearGradient id={g('v')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f2fafe" />
            <stop offset="1" stopColor="#bfe1f5" />
          </linearGradient>
          <linearGradient id={g('a')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#efe2f6" />
          </linearGradient>
          <linearGradient id={g('m')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efd6f7" />
            <stop offset="1" stopColor="#d8b2ea" />
          </linearGradient>
          <linearGradient id={g('s')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfe2f7" />
            <stop offset="1" stopColor="#74b8e6" />
          </linearGradient>
          <linearGradient id={g('r')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={g('h')}>
            <stop offset="0" stopColor="#ff6b6b" stopOpacity=".3" />
            <stop offset="1" stopColor="#ff6b6b" stopOpacity="0" />
          </radialGradient>
          {/* los dos vidrios (puerta y vitrina): el destello sólo se ve dentro de ellos */}
          <clipPath id={g('c')}>
            <rect x="112" y="100" width="56" height="44" rx="2" />
            <rect x="180" y="98" width="58" height="46" rx="2" />
          </clipPath>
        </defs>

        {/* losa de la vereda y su sombra */}
        <ellipse cx="160" cy="168" rx="124" ry="9" fill="#0b4a7a" opacity=".07" />
        <ellipse cx="160" cy="167" rx="108" ry="4.5" fill="#0b4a7a" opacity=".16" />
        <rect x="26" y="146" width="268" height="16" rx="8" fill="#6aaedb" />
        <rect x="26" y="140" width="268" height="16" rx="8" fill={`url(#${g('s')})`} />
        <rect x="34" y="141" width="252" height="2" rx="1" fill="#fff" opacity=".45" />
        <path d="M70 148h180M120 142v12M180 142v12M240 142v12" stroke="#8cc4e8" strokeWidth="1" opacity=".6" />

        <Planta x={52} retraso={0} />
        <Planta x={286} escala={0.9} retraso={-3.2} />

        {/* el edificio flota apenas */}
        <g className="esc-farm-flota">
          <path d="M74 58L98 50V148L74 152Z" fill={`url(#${g('l')})`} />
          <rect x="98" y="50" width="148" height="98" rx="5" fill={`url(#${g('f')})`} />
          <path d="M76 44L90 39V56L76 61Z" fill="#7fc0ea" />
          <rect x="90" y="34" width="164" height="22" rx="6" fill={`url(#${g('t')})`} />
          <rect x="95" y="38" width="154" height="3" rx="1.5" fill="#fff" opacity=".6" />
          <rect x="94" y="51" width="156" height="4" rx="2" fill="#4a98cf" opacity=".16" />

          {/* cartel con la cruz: late y emite un aro cuando se cobra la venta */}
          <circle cx="172" cy="36" r="27" fill={`url(#${g('h')})`} />
          <circle className="esc-farm-aro" cx="172" cy="36" r="19" fill="none" stroke="#ff6b6b" strokeWidth="2.5" />
          <circle cx="172" cy="36" r="19" fill="#bfe3f9" stroke="#8cc9ee" strokeWidth="4" />
          <circle cx="172" cy="36" r="14" fill="#fff" />
          <path d="M160 33a14 14 0 0 1 18-8" fill="none" stroke="#bfe3f9" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
          <path
            className="esc-farm-latido"
            d="M168 26h8v6h6v8h-6v6h-8v-6h-6v-8h6z"
            fill="#fff"
            stroke="#e5484d"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* puerta vidriada con estantes */}
          <rect x="108" y="96" width="64" height="52" rx="3" fill="#3f8cc4" />
          <rect x="112" y="100" width="56" height="44" rx="2" fill={`url(#${g('v')})`} />
          <rect x="112" y="100" width="56" height="44" rx="2" fill="#fff" className="esc-farm-luz" />
          <rect x="139" y="100" width="2" height="44" fill="#3f8cc4" />
          <rect x="112" y="114" width="56" height="2.5" fill="#a6cde6" />
          <rect x="112" y="129" width="56" height="2.5" fill="#a6cde6" />
          <Caja x={116} y={103} w={9} h={11} c="#f0a63a" />
          <Caja x={127} y={104} w={9} h={10} c="#f4b95a" />
          <Caja x={145} y={102} w={10} h={12} c="#f0a63a" />
          <Caja x={157} y={105} w={8} h={9} c="#fff" />
          <Caja x={116} y={119} w={12} h={10} c="#fff" />
          <Caja x={131} y={120} w={7} h={9} c="#c9c6ef" />
          <Caja x={145} y={119} w={14} h={10} c="#f2cf5a" />
          <Caja x={116} y={134} w={8} h={10} c="#c9c6ef" />
          <Caja x={127} y={135} w={8} h={9} c="#fff" />
          <Caja x={147} y={134} w={14} h={10} c="#f0a63a" />

          {/* vitrina de la derecha */}
          <rect x="178" y="96" width="62" height="50" rx="3.5" fill="none" stroke="#4a98cf" strokeWidth="3" />
          <rect x="180" y="112" width="58" height="2.5" rx="1" fill="#5ea9dc" />
          <rect x="180" y="127" width="58" height="2.5" rx="1" fill="#5ea9dc" />
          <rect x="180" y="142" width="58" height="2.5" rx="1" fill="#5ea9dc" />
          <Caja x={184} y={98} w={12} h={14} c="#b9bff0" />
          <Caja x={199} y={99} w={12} h={13} c="#fff" />
          <path d="M203.5 102h3v2.4h2.4v3h-2.4v2.4h-3v-2.4h-2.4v-3h2.4z" fill="#e5484d" />
          <Caja x={214} y={99} w={10} h={13} c="#8aa4e8" />
          <Caja x={226} y={102} w={10} h={10} c="#c9c6ef" />
          <Caja x={184} y={115} w={13} h={12} c="#f2cf5a" />
          <Caja x={201} y={116} w={9} h={11} c="#fff" />
          <Caja x={214} y={115} w={12} h={12} c="#c9c6ef" />
          <Caja x={229} y={118} w={7} h={9} c="#8aa4e8" />
          <Caja x={184} y={131} w={14} h={11} c="#5aaee0" />
          <Caja x={202} y={132} w={10} h={10} c="#fff" />
          <Caja x={216} y={130} w={14} h={12} c="#b9bff0" />

          {/* reflejo diagonal fijo en los vidrios + destello que los cruza una vez por ciclo */}
          <g clipPath={`url(#${g('c')})`}>
            <path d="M120 100h14l-22 44h-14z" fill="#fff" opacity=".16" />
            <path d="M186 98h14l-22 46h-14z" fill="#fff" opacity=".14" />
            <path className="esc-farm-barrido" d="M150 98h12l-20 48h-12z" fill={`url(#${g('r')})`} />
          </g>

          {/* toldo rayado que se mece, con su sombra sobre la pared */}
          <g className="esc-farm-toldo">
            {toldo.map((t, i) => (
              <path key={`s${i}`} d={`M${t.x} 72H${t.x + 24}V87a12 12 0 0 1-24 0Z`} fill="#0b3b66" opacity=".1" />
            ))}
            <rect x="96" y="60" width="152" height="9" rx="3" fill="#cfa6e2" />
            {toldo.map((t, i) => (
              <path key={i} d={`M${t.x} 68H${t.x + 24}V82a12 12 0 0 1-24 0Z`} fill={`url(#${t.par ? g('a') : g('m')})`} />
            ))}
            <rect x="96" y="60" width="152" height="3" rx="1.5" fill="#fff" opacity=".6" />
          </g>
        </g>

        {/* lo que sale de la farmacia con la venta: cápsulas y cruces que suben en arco */}
        <Capsula x={128} y={96} dx={-14} giro={220} retraso={0.15} color="#ff7aa5" />
        <Capsula x={152} y={96} dx={16} giro={-200} retraso={0.5} color="#60a5fa" />
        <Capsula x={140} y={96} dx={4} giro={260} retraso={0.85} color="#fbbf24" />
        <Mas x={120} y={98} dx={-22} retraso={0.3} />
        <Mas x={162} y={98} dx={22} retraso={0.7} />
      </svg>
      <Aviso etiqueta="Venta" texto="Bs 23" />
    </Marco>
  )
}

/* ------------------------------------------------------------------ */
/*  RESTAURANTE / POLLERÍA                                             */
/* ------------------------------------------------------------------ */

/**
 * Una presa de pollo (muslo con su hueso) dibujada siempre derecha: la luz viene de arriba-izquierda y,
 * como contra-gira lo mismo que la rueda, esa luz no se mueve aunque la presa dé vueltas. El círculo
 * invisible fija el pivote en el centro de la presa (el `fill-box` toma el centro de lo dibujado).
 */
function Presa({ piel, cuerpo, retraso }: { piel: string; cuerpo: string; retraso: string }) {
  return (
    <g className="esc-pollo-contra" style={v({ '--d': retraso })}>
      <circle r="12" fill="none" />
      {/* hueso: sombra, caña y dos nudillos */}
      <path d="M3.2 -2.4L8.4 -7.4" stroke="#b8a583" strokeWidth="3.4" strokeLinecap="round" opacity=".55" />
      <path d="M3 -3L8.2 -8" stroke="#f6ebd4" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="7.4" cy="-9.4" r="1.9" fill="#f8efdb" />
      <circle cx="9.9" cy="-7" r="1.9" fill="#efe2c8" />
      {/* carne: degradé dorado → caramelo */}
      <path d="M-10.5 3C-11.5 -4 -5 -9 1 -7.2C4.5 -6 5.5 -2.5 4.4 0C3 3.6 1 5.8 -1.6 8C-5.4 11 -9.5 9.4 -10.5 3Z" fill={`url(#${piel})`} />
      <g clipPath={`url(#${cuerpo})`}>
        {/* sombra propia abajo-derecha */}
        <ellipse cx="3" cy="8" rx="10" ry="6.5" fill="#6b2d0c" opacity=".3" />
        {/* marcas de parrilla */}
        <path d="M-9 -2L-5 2.4M-6 -5.4L-1 -0.6M-2 -7L2.6 -2.6" stroke="#6b2d0c" strokeWidth="1" strokeLinecap="round" opacity=".3" />
        {/* brillo graso del glaseado */}
        <ellipse cx="-5.6" cy="-3.2" rx="4.8" ry="1.7" fill="#fff" opacity=".42" transform="rotate(-28)" />
      </g>
    </g>
  )
}

/** Llama baja de las brasas (nace en la base y se estira): cada una con su ritmo para que no latan juntas. */
function Llama({ x, retraso, alto = 1 }: { x: number; retraso: number; alto?: number }) {
  return (
    // la altura va metida en el trazo (no en un scale): el transform-origin global de .escena movería la base
    <g transform={`translate(${x} 141)`}>
      <g className="esc-pollo-llama" style={v({ '--d': `${retraso}s` })}>
        <path d={`M0 0C-5.5-4-3.4-${9.5 * alto} 0-${15 * alto}C3.4-${9.5 * alto} 5.5-4 0 0Z`} fill="#ff6a2a" />
        <path d={`M0 0C-2.8-2-1.8-${5.5 * alto} 0-${8.5 * alto}C1.8-${5.5 * alto} 2.8-2 0 0Z`} fill="#ffd36b" />
      </g>
    </g>
  )
}

/** Bocanada de humo de la chimenea. El retraso reparte las tres de forma exacta en el ciclo (6.5 s / 3). */
function Humo({ retraso, fill }: { retraso: number; fill: string }) {
  return (
    <g transform="translate(99 30)">
      <circle className="esc-pollo-humo" r="6" fill={fill} style={v({ '--d': `${retraso}s` })} />
    </g>
  )
}

/** Gota de jugo que se desprende de las presas y cae a las brasas. */
function Gota({ x, retraso }: { x: number; retraso: number }) {
  return (
    <g transform={`translate(${x} 127)`}>
      <path className="esc-pollo-gota" d="M0 0C-1.8 2.6-1.8 5 0 5C1.8 5 1.8 2.6 0 0Z" fill="#ffd36b" style={v({ '--d': `${retraso}s` })} />
    </g>
  )
}

/** Chispa que sube dentro del horno. */
function Chispa({ x, dx, retraso }: { x: number; dx: number; retraso: number }) {
  return (
    <g transform={`translate(${x} 134)`}>
      <circle className="esc-pollo-chispa" r="1.2" fill="#ffc860" style={v({ '--dx': `${dx}px`, '--d': `${retraso}s` })} />
    </g>
  )
}

/**
 * Un rostizador de acero y cristal con presas doradas girando sobre las brasas (ciclo de 6.5 s). Las
 * presas van en dos ruedas que dan una vuelta cada 3.25 s; el jugo gotea al fuego y, cuando el pedido
 * sale, el LED pasa a verde, un reflejo cruza el vidrio y entra el aviso «Mesa 4 · Listo».
 */
export function EscenaPollo() {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}${n}`
  const flamas = [
    { x: 98, d: 0, a: 0.8 },
    { x: 112, d: -0.4, a: 1 },
    { x: 127, d: -0.8, a: 0.85 },
    { x: 142, d: -0.2, a: 1.05 },
    { x: 157, d: -0.6, a: 0.8 },
    { x: 172, d: -0.9, a: 1 },
    { x: 187, d: -0.3, a: 0.85 },
    { x: 202, d: -0.7, a: 1.05 },
    { x: 217, d: -0.1, a: 0.85 },
  ]
  const carbones = [96, 110, 124, 139, 153, 167, 181, 196, 210, 224]
  return (
    <Marco fondo="bg-gradient-to-b from-amber-100 via-orange-50 to-white">
      <div aria-hidden className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-orange-200/60 blur-2xl" />
      <svg viewBox="20 10 280 168" preserveAspectRatio="xMidYMax meet" className={svgBase}>
        <defs>
          {/* acero: luz arriba-izquierda, sombra abajo-derecha */}
          <linearGradient id={g('a')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3f5f8" />
            <stop offset=".5" stopColor="#d0d6dd" />
            <stop offset="1" stopColor="#a3acb7" />
          </linearGradient>
          <linearGradient id={g('z')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#939eaa" />
            <stop offset="1" stopColor="#59636f" />
          </linearGradient>
          {/* interior del horno: oscuro arriba (resaltan las presas) y brasa abajo */}
          <linearGradient id={g('i')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a1812" />
            <stop offset=".55" stopColor="#5a2512" />
            <stop offset="1" stopColor="#a8451a" />
          </linearGradient>
          <linearGradient id={g('b')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff8f2e" stopOpacity="0" />
            <stop offset="1" stopColor="#ffb54d" stopOpacity=".75" />
          </linearGradient>
          <linearGradient id={g('o')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity=".28" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('p')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fad27a" />
            <stop offset=".45" stopColor="#e09535" />
            <stop offset="1" stopColor="#b2601f" />
          </linearGradient>
          <linearGradient id={g('r')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dd4a2f" />
            <stop offset="1" stopColor="#b02a18" />
          </linearGradient>
          <linearGradient id={g('s')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".38" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g('f')} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffd36b" />
            <stop offset="1" stopColor="#ff6a2a" />
          </linearGradient>
          <linearGradient id={g('t')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fdf0dc" />
            <stop offset="1" stopColor="#f2d6ae" />
          </linearGradient>
          <radialGradient id={g('h')}>
            <stop offset="0" stopColor="#f6f0ea" stopOpacity=".95" />
            <stop offset="1" stopColor="#d9cfc7" stopOpacity="0" />
          </radialGradient>
          <clipPath id={g('v')}>
            <rect x="85" y="85" width="150" height="58" rx="6" />
          </clipPath>
          <clipPath id={g('c')}>
            <path d="M-10.5 3C-11.5 -4 -5 -9 1 -7.2C4.5 -6 5.5 -2.5 4.4 0C3 3.6 1 5.8 -1.6 8C-5.4 11 -9.5 9.4 -10.5 3Z" />
          </clipPath>
        </defs>

        {/* plataforma: canto, cara superior y sombras de contacto */}
        <ellipse cx="160" cy="168" rx="128" ry="9" fill="#e0b88a" />
        <ellipse cx="160" cy="164" rx="128" ry="9" fill={`url(#${g('t')})`} />
        <ellipse cx="160" cy="165" rx="122" ry="8" fill="#5b2a0e" opacity=".06" />
        <ellipse className="esc-pollo-sombra" cx="160" cy="164" rx="100" ry="4.5" fill="#5b2a0e" opacity=".14" />

        {/* objeto secundario izquierdo: cartón de papas, en tonos más apagados */}
        <g opacity=".9">
          <ellipse cx="49" cy="163" rx="14" ry="2.6" fill="#5b2a0e" opacity=".13" />
          {/* las papas: giran sobre su propio centro (el origen del giro ya es el de cada una) */}
          <g fill="#ecd9a2">
            <rect x="40" y="134" width="3.4" height="16" rx="1.7" transform="rotate(-8)" />
            <rect x="44.6" y="130" width="3.4" height="20" rx="1.7" transform="rotate(-2)" />
            <rect x="49.4" y="133" width="3.4" height="17" rx="1.7" transform="rotate(4)" />
            <rect x="54" y="136" width="3.4" height="14" rx="1.7" transform="rotate(9)" />
          </g>
          <path d="M37.5 146H60.5L57.6 163H40.4Z" fill="#cf7d6d" />
          <path d="M37.5 146H44L42.6 163H40.4Z" fill="#e6a597" opacity=".55" />
          <path d="M39 152H59L58.2 157H39.8Z" fill="#f7efe2" opacity=".9" />
          <path d="M37.5 146H60.5" stroke="#f0b8aa" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* objeto secundario derecho: frasco de ají */}
        <g opacity=".9">
          <ellipse cx="272" cy="163" rx="12" ry="2.4" fill="#5b2a0e" opacity=".13" />
          <path d="M270 124L273 124L274.2 132H268.8Z" fill="#e8dcc5" />
          <rect x="268.4" y="130" width="5.6" height="9" rx="1.6" fill="#8fb88d" />
          <rect x="263" y="137" width="16.5" height="25.5" rx="6.5" fill="#86b384" />
          <rect x="263" y="137" width="5" height="25.5" rx="2.5" fill="#bfdcbb" opacity=".55" />
          <rect x="265.6" y="147" width="11.2" height="9" rx="1.6" fill="#f7f0e4" />
          <rect x="267.6" y="150.4" width="7.2" height="1.4" rx=".7" fill="#c46a55" opacity=".8" />
        </g>

        {/* humo de la chimenea (detrás del horno) */}
        <Humo retraso={0} fill={`url(#${g('h')})`} />
        <Humo retraso={-2.17} fill={`url(#${g('h')})`} />
        <Humo retraso={-4.33} fill={`url(#${g('h')})`} />

        <g className="esc-pollo-flota">
          {/* patas y chimenea */}
          <rect x="84" y="154" width="14" height="9" rx="3" fill="#59636f" />
          <rect x="222" y="154" width="14" height="9" rx="3" fill="#59636f" />
          <rect x="92" y="34" width="14" height="22" rx="2" fill={`url(#${g('a')})`} />
          <rect x="90" y="31.5" width="18" height="4.5" rx="2" fill="#8f99a5" />
          <rect x="92" y="32.4" width="14" height="1.2" rx=".6" fill="#fff" opacity=".6" />

          {/* cuerpo de acero */}
          <rect x="70" y="52" width="180" height="105" rx="12" fill={`url(#${g('a')})`} />

          {/* cartel */}
          <path d="M70 74V64a12 12 0 0 1 12-12H238a12 12 0 0 1 12 12V74Z" fill={`url(#${g('r')})`} />
          <path d="M70 72.4H250V74H70Z" fill="#7d1a0e" opacity=".45" />
          <rect x="76" y="54" width="168" height="2.2" rx="1.1" fill="#fff" opacity=".3" />
          <text x="160" y="67" textAnchor="middle" fontSize="10.5" fontWeight="800" letterSpacing="2.6" fill="#fff6e6">
            A LA BRASA
          </text>
          <g transform="translate(96 63)" fill="#ffd36b">
            <path d="M0 5.5C-3.6 3-2.6-1.4 0-5.5C2.6-1.4 3.6 3 0 5.5Z" />
          </g>
          <g transform="translate(224 63)" fill="#ffd36b">
            <path d="M0 5.5C-3.6 3-2.6-1.4 0-5.5C2.6-1.4 3.6 3 0 5.5Z" />
          </g>

          {/* marco del vidrio y cámara de cocción */}
          <rect x="80" y="80" width="160" height="68" rx="9" fill={`url(#${g('z')})`} />
          <rect x="85" y="85" width="150" height="58" rx="6" fill={`url(#${g('i')})`} />

          <g clipPath={`url(#${g('v')})`}>
            {/* resplandor de las brasas, llamas y carbones */}
            <rect className="esc-pollo-brasa" x="85" y="112" width="150" height="31" fill={`url(#${g('b')})`} />
            {flamas.map((f) => (
              <Llama key={f.x} x={f.x} retraso={f.d} alto={f.a} />
            ))}
            {carbones.map((x, i) => (
              <g key={x}>
                <ellipse cx={x} cy={141.5} rx="8" ry="3.4" fill="#24150f" />
                <rect x={x - 3 + (i % 2) * 2} y="140.6" width="5" height="1" rx=".5" fill="#ff8a2a" opacity=".75" />
              </g>
            ))}

            {/* ruedas del rostizador: giran en 3.25 s y cada presa contra-gira para seguir derecha */}
            {[
              { cx: 125, d: '0s' },
              { cx: 195, d: '-1.1s' },
            ].map((r) => (
              <g key={r.cx} transform={`translate(${r.cx} 113)`}>
                <g className="esc-pollo-rueda" style={v({ '--d': r.d })}>
                  <circle r="25" fill="none" />
                  <circle r="12.5" fill="none" stroke="#c9ced4" strokeWidth=".8" opacity=".45" />
                  <path d="M-12.5 0H12.5" stroke="#b4bcc5" strokeWidth="1.4" strokeLinecap="round" />
                  <g transform="translate(12.5 0)">
                    <Presa piel={g('p')} cuerpo={g('c')} retraso={r.d} />
                  </g>
                  <g transform="translate(-12.5 0)">
                    <Presa piel={g('p')} cuerpo={g('c')} retraso={r.d} />
                  </g>
                  <circle r="3.2" fill="#aeb6bf" />
                  <circle r="1.4" fill="#eef1f4" />
                </g>
              </g>
            ))}

            {/* jugo que gotea y chispas que suben */}
            <Gota x={118} retraso={0} />
            <Gota x={188} retraso={-1.1} />
            <Gota x={154} retraso={-2.1} />
            <Chispa x={108} dx={5} retraso={-0.4} />
            <Chispa x={160} dx={-6} retraso={-1.4} />
            <Chispa x={214} dx={5} retraso={-2.5} />

            {/* sombra del marco arriba, reflejos fijos del vidrio y el destello que lo cruza */}
            <rect x="85" y="85" width="150" height="9" fill={`url(#${g('o')})`} />
            <path d="M92 85h34l-22 58H88a3 3 0 0 1-3-3V92a7 7 0 0 1 7-7z" fill="#fff" opacity=".08" />
            <path d="M132 85h9l-22 58h-9z" fill="#fff" opacity=".06" />
            <path className="esc-pollo-barrido" d="M150 85h16l-24 58h-16z" fill={`url(#${g('s')})`} />
          </g>
          <path d="M87 93V92a6 6 0 0 1 6-6H150" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".5" />

          {/* tablero: LED de pedido (ámbar → verde al salir) y perillas */}
          <circle cx="96" cy="153" r="2.2" fill="#f0a63a" />
          <g className="esc-pollo-led">
            <circle cx="96" cy="153" r="4.4" fill="#34d399" opacity=".3" />
            <circle cx="96" cy="153" r="2.2" fill="#34d399" />
          </g>
          <circle cx="214" cy="153" r="3" fill="#8f99a5" />
          <circle cx="214" cy="152.4" r="2.4" fill="#e3e7ec" />
          <path d="M214 150.8v1.6" stroke="#59636f" strokeWidth=".9" strokeLinecap="round" />
          <circle cx="228" cy="153" r="3" fill="#8f99a5" />
          <circle cx="228" cy="152.4" r="2.4" fill="#e3e7ec" />
          <path d="M228.8 151.2l-.8 1.2" stroke="#59636f" strokeWidth=".9" strokeLinecap="round" />
        </g>
      </svg>
      <Aviso etiqueta="Pedido" texto="Mesa 4 · Listo" tono="ambar" />
    </Marco>
  )
}

/** Escena de cada rubro que ya tiene su ilustración animada. */
export const ESCENAS = {
  pollo: EscenaPollo,
  postres: EscenaPostres,
  panaderia: EscenaPanaderia,
  heladeria: EscenaHeladeria,
  jugueria: EscenaJugueria,
  cafeteria: EscenaCafeteria,
  salteneria: EscenaSalteneria,
  bar: EscenaBar,
  minimarket: EscenaMinimarket,
  ferreteria: EscenaFerreteria,
  farmacia: EscenaFarmacia,
  billar: EscenaBillar,
  licoreria: EscenaLicoreria,
  peluqueria: EscenaPeluqueria,
  barberia: EscenaBarberia,
  spa: EscenaSpa,
  unas: EscenaUnas,
  academia: EscenaAcademia,
} as const

export type ClaveEscena = keyof typeof ESCENAS
