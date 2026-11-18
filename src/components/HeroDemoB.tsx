import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, m, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { SUAVE } from './animacion'

/*
  Demo del hero, variante B: «El negocio completo». Dos dispositivos que
  cuentan lo mismo que el titular (venta rápida · stock al día · caja sin
  fugas): el celular del cajero, delante, y el panel del dueño, detrás y en
  perspectiva. Lo que pasa en el celular aparece EN VIVO en el panel, unido por
  un pulso de luz.

  Guion (un ciclo ≈ 10 s, el rubro rota en cada vuelta):
    tramo 0 · venta rápida   → el cajero arma el ticket y cobra; la venta sube al panel.
                               En las vueltas impares la venta se hace SIN INTERNET: queda
                               «pendiente» en el celular y, al volver la señal, sube de golpe.
    tramo 1 · stock al día   → el panel pasa a Inventario: baja el stock de lo vendido y
                               lo que queda poco se pone en rojo («Stock crítico»).
    tramo 2 · caja sin fugas → el panel pasa a Cajeros; en el celular el encargado pone su
                               PIN para anular una venta y el arqueo queda «Caja cuadrada».

  Cómo está hecho: un solo reloj de pasos (setTimeout, no por cuadro). Cada paso
  es un evento con nombre; toda la pantalla se deriva de «cuál es el último evento
  alcanzado», así el celular y el panel nunca se desincronizan. Sólo se animan
  transform/opacity (los halos tienen blur estático). Se pausa fuera de pantalla
  y con «reducir movimiento» queda la imagen quieta de la venta ya cobrada.

  Todo está dibujado en un escenario de 512×512 px lógicos que se escala entero
  con la anchura disponible: en el celular se ve igual, más chico.
*/

type Fase = 0 | 1 | 2 | null

/* ───────────────────────── Guion ───────────────────────── */

type Ev =
  | 'INICIO' | 'TOCA1' | 'TOCA2' | 'TOCA3' | 'COBRAR' | 'PAGADO' | 'VUELVE' | 'LLEGA'
  | 'FASE1' | 'STOCK' | 'CRITICO'
  | 'FASE2' | 'PIN1' | 'PIN2' | 'PIN3' | 'PIN4' | 'AUTORIZADO' | 'CUADRA'
  | 'FIN'

/** Orden de los eventos: «alcanzó X» = el evento actual es X o uno posterior. */
const ORDEN: readonly Ev[] = [
  'INICIO', 'TOCA1', 'TOCA2', 'TOCA3', 'COBRAR', 'PAGADO', 'VUELVE', 'LLEGA',
  'FASE1', 'STOCK', 'CRITICO',
  'FASE2', 'PIN1', 'PIN2', 'PIN3', 'PIN4', 'AUTORIZADO', 'CUADRA',
  'FIN',
]
const alcanza = (ev: Ev, x: Ev) => ORDEN.indexOf(ev) >= ORDEN.indexOf(x)

interface Paso {
  ev: Ev
  /** Milisegundos desde el inicio del ciclo. */
  at: number
}

/** Pausa tras «FIN» (el titular se apaga) antes de arrancar el siguiente rubro. */
const PAUSA_FIN = 400

function guionDe(sinInternet: boolean): Paso[] {
  // Sin internet hace falta un segundo entero de «pendiente» para que se note;
  // se compensa tocando más rápido para que el tramo 0 no pase de ~4 s.
  const d = sinInternet ? 300 : 0
  const inicio: Paso[] = sinInternet
    ? [
        { ev: 'INICIO', at: 0 }, { ev: 'TOCA1', at: 550 }, { ev: 'TOCA2', at: 900 }, { ev: 'TOCA3', at: 1250 },
        { ev: 'COBRAR', at: 1650 }, { ev: 'PAGADO', at: 2000 }, { ev: 'VUELVE', at: 3050 }, { ev: 'LLEGA', at: 3500 },
      ]
    : [
        { ev: 'INICIO', at: 0 }, { ev: 'TOCA1', at: 600 }, { ev: 'TOCA2', at: 1100 }, { ev: 'TOCA3', at: 1600 },
        { ev: 'COBRAR', at: 2100 }, { ev: 'PAGADO', at: 2500 }, { ev: 'LLEGA', at: 3000 },
      ]
  return [
    ...inicio,
    { ev: 'FASE1', at: 3600 + d }, { ev: 'STOCK', at: 4100 + d }, { ev: 'CRITICO', at: 5000 + d },
    { ev: 'FASE2', at: 6800 + d }, { ev: 'PIN1', at: 7250 + d }, { ev: 'PIN2', at: 7550 + d },
    { ev: 'PIN3', at: 7850 + d }, { ev: 'PIN4', at: 8150 + d }, { ev: 'AUTORIZADO', at: 8550 + d },
    { ev: 'CUADRA', at: 9050 + d }, { ev: 'FIN', at: 9800 + d },
  ]
}
const GUION_NORMAL = guionDe(false)
const GUION_SIN_INTERNET = guionDe(true)

/* ───────────────────────── Datos de ejemplo ───────────────────────── */

interface Prod {
  emoji: string
  nombre: string
  precio: number
  costo: number
  /** Unidades antes de la venta. */
  stock: number
  /** Stock «lleno», para el largo de la barra. */
  par: number
  /** Por debajo de esto es stock crítico. */
  min: number
}

interface Rubro {
  local: string
  prods: Prod[]
  /** Lo que se vende: índice del producto y cantidad, en el orden en que se toca. */
  venta: { i: number; q: number }[]
  pago: 'QR' | 'Efectivo' | 'Mixto'
  /** Producto que queda en stock crítico tras la venta. */
  critico: number
  /** Lo vendido hoy por cada cajero antes de esta venta. */
  ana: number
  luis: number
  /** Ganancia del día antes de esta venta, y cantidad de ventas. */
  ganancia: number
  tickets: number
  previas: { quien: string; monto: number; pago: string }[]
}

const RUBROS: Rubro[] = [
  {
    local: 'Mi restaurante',
    prods: [
      { emoji: '🍗', nombre: '1/4 de pollo', precio: 22, costo: 12, stock: 18, par: 40, min: 8 },
      { emoji: '🍗', nombre: '1/2 pollo', precio: 40, costo: 22, stock: 7, par: 24, min: 6 },
      { emoji: '🍟', nombre: 'Papas', precio: 10, costo: 5, stock: 30, par: 60, min: 10 },
      { emoji: '🥤', nombre: 'Refresco', precio: 12, costo: 7, stock: 40, par: 72, min: 12 },
    ],
    venta: [{ i: 1, q: 2 }, { i: 2, q: 1 }, { i: 3, q: 1 }],
    pago: 'QR',
    critico: 1,
    ana: 1840,
    luis: 1215,
    ganancia: 920,
    tickets: 38,
    previas: [
      { quien: 'Luis', monto: 35, pago: 'Efectivo' },
      { quien: 'Ana', monto: 18, pago: 'QR' },
      { quien: 'Luis', monto: 64, pago: 'QR' },
    ],
  },
  {
    local: 'Mi farmacia',
    prods: [
      { emoji: '💊', nombre: 'Paracetamol', precio: 8, costo: 5, stock: 6, par: 30, min: 5 },
      { emoji: '🧴', nombre: 'Alcohol 70 %', precio: 15, costo: 9, stock: 18, par: 36, min: 8 },
      { emoji: '🩹', nombre: 'Curitas', precio: 6, costo: 3, stock: 25, par: 50, min: 10 },
      { emoji: '😷', nombre: 'Barbijos', precio: 5, costo: 3, stock: 40, par: 80, min: 15 },
    ],
    venta: [{ i: 0, q: 3 }, { i: 1, q: 1 }, { i: 3, q: 2 }],
    pago: 'Efectivo',
    critico: 0,
    ana: 960,
    luis: 745,
    ganancia: 480,
    tickets: 31,
    previas: [
      { quien: 'Ana', monto: 22, pago: 'Efectivo' },
      { quien: 'Luis', monto: 47, pago: 'QR' },
      { quien: 'Ana', monto: 12, pago: 'Efectivo' },
    ],
  },
  {
    local: 'Mi ferretería',
    prods: [
      { emoji: '🔩', nombre: 'Tornillos', precio: 12, costo: 7, stock: 60, par: 120, min: 20 },
      { emoji: '🎨', nombre: 'Pintura 1 L', precio: 45, costo: 31, stock: 5, par: 16, min: 4 },
      { emoji: '🔨', nombre: 'Martillo', precio: 38, costo: 24, stock: 9, par: 20, min: 4 },
      { emoji: '🪛', nombre: 'Destornillador', precio: 20, costo: 13, stock: 14, par: 30, min: 6 },
    ],
    venta: [{ i: 1, q: 2 }, { i: 0, q: 1 }, { i: 3, q: 1 }],
    pago: 'QR',
    critico: 1,
    ana: 2310,
    luis: 1580,
    ganancia: 1060,
    tickets: 22,
    previas: [
      { quien: 'Luis', monto: 38, pago: 'Efectivo' },
      { quien: 'Ana', monto: 96, pago: 'QR' },
      { quien: 'Luis', monto: 20, pago: 'Efectivo' },
    ],
  },
  {
    local: 'Mi tienda',
    prods: [
      { emoji: '🥛', nombre: 'Leche', precio: 7, costo: 5, stock: 7, par: 24, min: 6 },
      { emoji: '🍚', nombre: 'Arroz 1 kg', precio: 9, costo: 7, stock: 20, par: 40, min: 8 },
      { emoji: '🧃', nombre: 'Jugo', precio: 6, costo: 4, stock: 16, par: 36, min: 8 },
      { emoji: '🍫', nombre: 'Chocolate', precio: 5, costo: 3, stock: 30, par: 60, min: 10 },
    ],
    venta: [{ i: 0, q: 3 }, { i: 1, q: 1 }, { i: 2, q: 2 }],
    pago: 'Mixto',
    critico: 0,
    ana: 640,
    luis: 515,
    ganancia: 205,
    tickets: 64,
    previas: [
      { quien: 'Luis', monto: 9, pago: 'Efectivo' },
      { quien: 'Ana', monto: 27, pago: 'QR' },
      { quien: 'Luis', monto: 14, pago: 'Efectivo' },
    ],
  },
]

const totalDe = (r: Rubro) => r.venta.reduce((s, l) => s + r.prods[l.i].precio * l.q, 0)
const gananciaDe = (r: Rubro) => r.venta.reduce((s, l) => s + (r.prods[l.i].precio - r.prods[l.i].costo) * l.q, 0)
const vendidoDe = (r: Rubro, i: number) => r.venta.find((l) => l.i === i)?.q ?? 0
const textoPago = (p: Rubro['pago']) => (p === 'QR' ? 'con QR' : p === 'Efectivo' ? 'en efectivo' : 'mixto')

/** Miles con punto y sin depender del idioma del navegador (es-BO no agrupa los de 4 cifras). */
const miles = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const entero = (n: number) => Math.round(n).toString()

/** Altura relativa de las barras de «ventas por hora» ya cerradas, y de la hora actual antes/después de la venta. */
const HORAS = [0.3, 0.46, 0.62, 0.42, 0.78, 0.92, 0.58]
const AHORA_ANTES = 0.36
const AHORA_DESPUES = 0.86

/** Los cuatro textos que acompañan cada tramo: se entiende sin mirar el titular. */
const TRAMOS = [
  { icono: '⚡', titulo: 'Venta rápida', texto: 'Cobrás en pocos toques con QR, efectivo o mixto.' },
  { icono: '📦', titulo: 'Stock al día', texto: 'Cada venta descuenta el inventario y avisa cuando queda poco.' },
  { icono: '🔒', titulo: 'Caja sin fugas', texto: 'Anular una venta pide el PIN del encargado y el arqueo cuadra solo.' },
] as const

/* ───────────────────────── Piezas chicas ───────────────────────── */

/**
 * Número que rueda al cambiar de valor. Arranca ya en su valor (a diferencia de
 * `Numero`, que cuenta desde 0): al cambiar de rubro no queremos que todo
 * «cargue» de nuevo, sólo que suba cuando entra la venta.
 */
function Cuenta({ valor, formato = miles, dur = 0.7 }: { valor: number; formato?: (n: number) => string; dur?: number }) {
  const reducir = useReducedMotion()
  const mv = useMotionValue(valor)
  const texto = useTransform(mv, formato)
  useEffect(() => {
    if (reducir) {
      mv.set(valor)
      return
    }
    const c = animate(mv, valor, { duration: dur, ease: SUAVE })
    return () => c.stop()
  }, [valor, dur, reducir, mv])
  return <m.span className="tabular-nums">{texto}</m.span>
}

function Wifi({ tachado }: { tachado: boolean }) {
  return (
    <svg
      viewBox="0 0 16 12"
      className={`h-3 w-4 transition-colors duration-300 ${tachado ? 'text-amber-500' : 'text-slate-500'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M1.5 4.2a9 9 0 0 1 13 0M3.8 6.8a5.6 5.6 0 0 1 8.4 0" />
      <circle cx="8" cy="9.6" r="1" fill="currentColor" stroke="none" />
      {/* La raya del «sin señal» se dibuja sola al cortarse el internet */}
      <m.path d="M2 1.5l12 9.5" strokeWidth="1.9" initial={false} animate={{ pathLength: tachado ? 1 : 0, opacity: tachado ? 1 : 0 }} transition={{ duration: 0.35 }} />
    </svg>
  )
}

const ENTRA = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: SUAVE } }

/* ───────────────────────── Celular del cajero ───────────────────────── */

function PantallaVenta({ r, ev, sinInternet }: { r: Rubro; ev: Ev; sinInternet: boolean }) {
  const toques = [alcanza(ev, 'TOCA1'), alcanza(ev, 'TOCA2'), alcanza(ev, 'TOCA3')].filter(Boolean).length
  const tocandoAhora = ev === 'TOCA1' ? 0 : ev === 'TOCA2' ? 1 : ev === 'TOCA3' ? 2 : -1
  const lineas = r.venta.slice(0, toques)
  const total = lineas.reduce((s, l) => s + r.prods[l.i].precio * l.q, 0)
  const totalFinal = totalDe(r)

  const pagado = alcanza(ev, 'PAGADO')
  const pendiente = sinInternet && pagado && !alcanza(ev, 'VUELVE')
  const sincronizando = sinInternet && alcanza(ev, 'VUELVE') && !alcanza(ev, 'LLEGA')
  const estadoAccion = !pagado ? 'cobrar' : pendiente ? 'pendiente' : sincronizando ? 'sync' : 'ok'

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-2 gap-1.5">
        {r.prods.map((p, i) => {
          const j = r.venta.findIndex((l) => l.i === i)
          const tomado = j >= 0 && j < toques
          const tocando = j >= 0 && j === tocandoAhora
          return (
            <m.div
              key={p.nombre}
              animate={tocando ? { scale: [1, 0.9, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, ease: SUAVE }}
              className={`relative rounded-xl border p-1.5 ${tomado ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white'}`}
            >
              {tocando && (
                <m.span
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.55 }}
                  className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-brand-400"
                />
              )}
              <p className="text-base leading-none">{p.emoji}</p>
              <p className="mt-1 truncate text-[10.5px] font-bold text-slate-800">{p.nombre}</p>
              <p className="text-[10px] font-semibold text-slate-500">Bs {p.precio}</p>
              {tomado && (
                <m.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-extrabold text-white"
                >
                  ×{r.venta[j].q}
                </m.span>
              )}
            </m.div>
          )
        })}
      </div>

      <div className="mt-2 min-h-0 flex-1 rounded-xl bg-slate-50 p-2">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Ticket</p>
        <div className="mt-1 space-y-1">
          <AnimatePresence initial={false}>
            {lineas.map((l) => (
              <m.div key={l.i} {...ENTRA} className="flex justify-between text-[10.5px] text-slate-700">
                <span>{l.q} × {r.prods[l.i].nombre}</span>
                <span className="font-semibold">Bs {r.prods[l.i].precio * l.q}</span>
              </m.div>
            ))}
          </AnimatePresence>
          {lineas.length === 0 && <p className="text-[10.5px] text-slate-400">Tocá un producto…</p>}
        </div>
      </div>

      {/* Acción de abajo: del botón Cobrar al estado de la venta (pagada, pendiente o sincronizando) */}
      <div className="mt-2 h-11">
        <AnimatePresence mode="wait" initial={false}>
          {estadoAccion === 'cobrar' && (
            <m.div
              key="cobrar"
              exit={{ opacity: 0, scale: 0.96 }}
              animate={ev === 'COBRAR' ? { scale: [1, 0.93, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className={`flex h-full items-center justify-between rounded-xl px-3 text-white ${total > 0 ? 'bg-brand-600' : 'bg-slate-300'}`}
            >
              <span className="text-[11px] font-bold">Cobrar · {r.pago}</span>
              <span className="text-sm font-extrabold tabular-nums">Bs {total}</span>
            </m.div>
          )}
          {estadoAccion === 'pendiente' && (
            <m.div
              key="pendiente"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="flex h-full items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3"
            >
              <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-amber-500" />
              <span className="leading-tight">
                <span className="block text-[11px] font-extrabold text-amber-800">Guardada · pendiente</span>
                <span className="block text-[9px] font-semibold text-amber-700">Sin internet: se envía al volver</span>
              </span>
            </m.div>
          )}
          {estadoAccion === 'sync' && (
            <m.div
              key="sync"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-full items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 animate-spin text-amber-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
                <path d="M12 3a9 9 0 1 0 9 9" />
              </svg>
              <span className="leading-tight">
                <span className="block text-[11px] font-extrabold text-amber-800">Volvió internet</span>
                <span className="block text-[9px] font-semibold text-amber-700">Enviando la venta…</span>
              </span>
            </m.div>
          )}
          {estadoAccion === 'ok' && (
            <m.div
              key="ok"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex h-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-3 text-white"
            >
              <m.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.08 }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-brand-600"
              >
                ✓
              </m.span>
              <span className="leading-tight">
                <span className="block text-[11px] font-extrabold">{sinInternet ? 'Sincronizada' : 'Pagado'} · Bs {totalFinal}</span>
                <span className="block text-[9px] font-semibold text-brand-100">Pago {textoPago(r.pago)}</span>
              </span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']
/** PIN de ejemplo, en el orden en que se teclea. */
const PIN_DIGITOS = ['4', '1', '7', '2']

/** Pide el PIN del encargado para anular una venta: se llenan los 4 puntos y se autoriza. */
function PinEncargado({ ev }: { ev: Ev }) {
  const pin = [alcanza(ev, 'PIN1'), alcanza(ev, 'PIN2'), alcanza(ev, 'PIN3'), alcanza(ev, 'PIN4')].filter(Boolean).length
  const autorizado = alcanza(ev, 'AUTORIZADO')
  const pulsada = pin > 0 && !autorizado ? PIN_DIGITOS[pin - 1] : null
  return (
    <>
      <m.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-20 bg-slate-900/50"
      />
      <m.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="absolute inset-x-0 bottom-0 z-30 rounded-t-[22px] bg-white px-3 pb-3 pt-3 shadow-[0_-8px_24px_rgb(15_23_42/0.25)]"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[12px]">🔒</span>
          <div className="leading-tight">
            <p className="text-[11.5px] font-extrabold text-slate-900">Anular venta #0412</p>
            <p className="text-[9.5px] font-semibold text-slate-500">PIN del encargado</p>
          </div>
        </div>

        <div className="mt-2.5 flex justify-center gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <m.span
              key={i}
              animate={i < pin ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`h-3 w-3 rounded-full border-2 transition-colors duration-200 ${
                autorizado ? 'border-brand-500 bg-brand-500' : i < pin ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Altura fija: el teclado y el «Autorizado» ocupan el mismo lugar y nada salta */}
        <div className="mt-2.5 h-[142px]">
          <AnimatePresence mode="wait" initial={false}>
            {!autorizado ? (
              <m.div key="teclado" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }} className="grid grid-cols-3 gap-1.5">
                {TECLAS.map((t, i) => (
                  <m.span
                    key={i}
                    animate={t !== '' && t === pulsada ? { scale: [1, 0.82, 1] } : { scale: 1 }}
                    transition={{ duration: 0.28 }}
                    className={`flex h-8 items-center justify-center rounded-lg text-[13px] font-bold ${
                      t === '' ? '' : t === pulsada ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t}
                  </m.span>
                ))}
              </m.div>
            ) : (
              <m.div
                key="autorizado"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                className="flex h-full flex-col items-center justify-center rounded-2xl bg-brand-50"
              >
                <m.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-xl font-black text-white"
                >
                  ✓
                </m.span>
                <p className="mt-2 text-[13px] font-extrabold text-brand-800">Autorizado</p>
                <p className="text-[10px] font-semibold text-brand-700">Encargado · Marcos</p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>
    </>
  )
}

/** Todo lo que cambia con cada vuelta del guion, dentro del celular (el marco queda fijo). */
function CuerpoCelular({ r, ev, sinInternet }: { r: Rubro; ev: Ev; sinInternet: boolean }) {
  const sinSenal = sinInternet && !alcanza(ev, 'VUELVE')
  const critico = r.prods[r.critico]
  const quedan = critico.stock - vendidoDe(r, r.critico)
  const toast = alcanza(ev, 'CRITICO') && !alcanza(ev, 'FASE2')
  const pin = alcanza(ev, 'FASE2')
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center justify-between gap-1">
        <p className="truncate text-[13px] font-extrabold text-slate-900">{r.local}</p>
        <AnimatePresence mode="wait" initial={false}>
          {sinSenal ? (
            <m.span
              key="sin"
              {...ENTRA}
              exit={{ opacity: 0 }}
              className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Sin internet
            </m.span>
          ) : (
            <m.span key="abierta" {...ENTRA} exit={{ opacity: 0 }} className="shrink-0 whitespace-nowrap rounded-full bg-brand-50 px-1.5 py-0.5 text-[9.5px] font-bold text-brand-700">
              Caja abierta
            </m.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2 min-h-0 flex-1">
        <PantallaVenta r={r} ev={ev} sinInternet={sinInternet} />
      </div>

      {/* Aviso de stock crítico, como una notificación que baja desde arriba */}
      <AnimatePresence>
        {toast && (
          <m.div
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="absolute inset-x-0 -top-5 z-10 flex items-center gap-2 rounded-2xl bg-slate-900/95 px-2.5 py-2 text-white shadow-lg"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-xs">⚠️</span>
            <span className="leading-tight">
              <span className="block text-[10.5px] font-extrabold">Stock crítico</span>
              <span className="block text-[9.5px] font-semibold text-slate-300">{critico.nombre} · quedan {quedan}</span>
            </span>
          </m.div>
        )}
      </AnimatePresence>

      {pin && <PinEncargado ev={ev} />}
    </div>
  )
}

/* ───────────────────────── Panel del dueño ───────────────────────── */

function Kpi({
  etiqueta, prefijo, valor, delta, llego, sinInternet, acento,
}: {
  etiqueta: string
  prefijo: string
  valor: number
  delta: string
  llego: boolean
  sinInternet: boolean
  acento?: boolean
}) {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg bg-white/[0.06] px-2.5 py-2 ring-1 ring-white/10">
        <p className="text-[10px] font-semibold text-slate-400">{etiqueta}</p>
        <p className={`mt-0.5 text-[17px] font-extrabold leading-none ${acento ? 'text-brand-300' : 'text-white'}`}>
          {prefijo}
          <Cuenta valor={valor} dur={sinInternet ? 0.45 : 0.7} />
        </p>
        {llego && (
          <>
            <m.span
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.9 }}
              className="pointer-events-none absolute inset-0 bg-brand-400/25"
            />
            <m.span
              aria-hidden
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -8] }}
              transition={{ duration: 1.8, times: [0, 0.15, 0.7, 1] }}
              className="absolute right-2 top-1.5 text-[10px] font-extrabold text-brand-300"
            >
              {delta}
            </m.span>
          </>
        )}
      </div>
      {/* Onda que sale de la tarjeta al llegar la venta; al volver el internet salen dos, «de golpe» */}
      {llego && (
        <>
          <m.span
            aria-hidden
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 1.28 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-brand-300"
          />
          {sinInternet && (
            <m.span
              aria-hidden
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 1.55 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.12 }}
              className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-brand-300"
            />
          )}
        </>
      )}
    </div>
  )
}

const FILA = 26

function FilaVenta({ quien, monto, pago, nueva, sinInternet }: { quien: string; monto: number; pago: string; nueva?: boolean; sinInternet?: boolean }) {
  return (
    <div
      style={{ height: FILA }}
      className={`flex items-center gap-1.5 rounded-md px-1.5 text-[11px] ${nueva ? 'bg-brand-500/15 ring-1 ring-brand-400/30' : ''}`}
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${quien === 'Ana' ? 'bg-brand-500' : 'bg-slate-500'}`}>
        {quien[0]}
      </span>
      <span className="font-semibold text-slate-200">{quien}</span>
      <span className="rounded bg-white/10 px-1 text-[9px] font-bold text-slate-300">{pago}</span>
      {nueva && <span className="text-[9px] font-bold text-brand-300">{sinInternet ? 'sincronizada' : 'ahora'}</span>}
      <span className="ml-auto font-extrabold tabular-nums text-white">Bs {monto}</span>
    </div>
  )
}

function PanelHoy({ r, llego, sinInternet }: { r: Rubro; llego: boolean; sinInternet: boolean }) {
  const filas = [{ quien: 'Ana', monto: totalDe(r), pago: r.pago }, ...r.previas]
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
        <span>Ventas por hora</span>
        <span className="text-slate-500">hoy</span>
      </div>
      <div className="mt-1.5 flex h-[56px] items-end gap-1.5">
        {HORAS.map((h, i) => (
          <m.span
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: h }}
            transition={{ duration: 0.5, ease: SUAVE, delay: 0.04 * i }}
            className="h-full flex-1 origin-bottom rounded-t bg-white/15"
          />
        ))}
        {/* La barra de la hora actual crece cuando entra la venta */}
        <m.span
          initial={{ scaleY: 0 }}
          animate={{ scaleY: llego ? AHORA_DESPUES : AHORA_ANTES }}
          transition={{ type: 'spring', stiffness: 140, damping: 14, delay: llego ? 0 : 0.3 }}
          className="h-full flex-1 origin-bottom rounded-t bg-gradient-to-t from-brand-600 to-brand-300"
        />
      </div>

      <p className="mt-3 text-[10px] font-semibold text-slate-400">Últimas ventas</p>
      <div className="mt-1 overflow-hidden" style={{ height: FILA * 3 }}>
        {/* Cuatro filas en una ventana de tres: al llegar la venta la lista baja una fila y la nueva asoma arriba */}
        <m.div initial={false} animate={{ y: llego ? 0 : -FILA }} transition={{ duration: 0.5, ease: SUAVE }}>
          {filas.map((f, i) => (
            <FilaVenta key={i} {...f} nueva={i === 0} sinInternet={sinInternet} />
          ))}
        </m.div>
      </div>
    </div>
  )
}

function PanelStock({ r, ev }: { r: Rubro; ev: Ev }) {
  const bajo = alcanza(ev, 'STOCK')
  const crit = alcanza(ev, 'CRITICO')
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400">Inventario · stock real</p>
      <div className="mt-1 space-y-0.5">
        {r.prods.map((p, i) => {
          const q = vendidoDe(r, i)
          const esCrit = i === r.critico
          const unidades = bajo ? p.stock - q : p.stock
          return (
            <div key={p.nombre} className="relative rounded-md px-1.5 py-1" style={{ height: 36 }}>
              {esCrit && (
                <m.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: crit ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 rounded-md bg-red-500/10 ring-1 ring-red-400/50"
                />
              )}
              <div className="relative flex items-center gap-1.5 text-[11px]">
                <span>{p.emoji}</span>
                <span className="font-semibold text-slate-200">{p.nombre}</span>
                {esCrit && (
                  <AnimatePresence>
                    {crit && (
                      <m.span
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                        className="flex items-center gap-1 rounded-full bg-red-500/20 px-1.5 py-px text-[9px] font-extrabold text-red-300"
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
                        </span>
                        Stock crítico
                      </m.span>
                    )}
                  </AnimatePresence>
                )}
                <span className={`ml-auto font-extrabold ${esCrit && crit ? 'text-red-300' : 'text-white'}`}>
                  <Cuenta valor={unidades} formato={entero} dur={0.6} />
                  <span className="ml-0.5 text-[9px] font-semibold text-slate-500">u</span>
                </span>
              </div>
              <div className="relative mt-1.5 h-[5px] overflow-hidden rounded-full bg-white/10">
                <m.div
                  initial={false}
                  animate={{ scaleX: unidades / p.par }}
                  transition={{ duration: 0.7, ease: SUAVE }}
                  className="relative h-full origin-left rounded-full bg-brand-400"
                >
                  {/* El color pasa a ámbar y a rojo con capas que se funden (sólo opacidad) */}
                  {esCrit && (
                    <>
                      <m.span initial={false} animate={{ opacity: bajo ? 1 : 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-amber-400" />
                      <m.span initial={false} animate={{ opacity: crit ? 1 : 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-red-500" />
                    </>
                  )}
                </m.div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Cajero({ nombre, caja, ventas, monto, cuadra, retraso, color }: {
  nombre: string
  caja: string
  ventas: number
  monto: number
  cuadra: boolean
  retraso: number
  color: string
}) {
  return (
    <div className="flex h-10 items-center gap-2 rounded-lg bg-white/[0.06] px-2 ring-1 ring-white/10">
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${color}`}>{nombre[0]}</span>
      <span className="leading-tight">
        <span className="block text-[11.5px] font-bold text-white">{nombre}</span>
        <span className="block text-[9.5px] text-slate-400">{caja} · {ventas} ventas</span>
      </span>
      <span className="ml-auto text-right leading-tight">
        <span className="block text-[12px] font-extrabold tabular-nums text-white">Bs {miles(monto)}</span>
        <span className="relative block h-3.5 w-[68px]">
          <m.span initial={false} animate={{ opacity: cuadra ? 0 : 1 }} transition={{ duration: 0.2 }} className="absolute right-0 top-0 text-[9.5px] font-semibold text-slate-400">
            En turno
          </m.span>
          <m.span
            initial={false}
            animate={{ opacity: cuadra ? 1 : 0, scale: cuadra ? 1 : 0.7 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18, delay: cuadra ? retraso : 0 }}
            className="absolute right-0 top-0 origin-right whitespace-nowrap rounded-full bg-brand-500/20 px-1.5 text-[9.5px] font-extrabold text-brand-300"
          >
            Cuadra ✓
          </m.span>
        </span>
      </span>
    </div>
  )
}

function PanelCajeros({ r, ev }: { r: Rubro; ev: Ev }) {
  const cuadra = alcanza(ev, 'CUADRA')
  const autorizado = alcanza(ev, 'AUTORIZADO')
  const ana = r.ana + totalDe(r)
  const anaN = Math.round(r.tickets * 0.55) + 1
  const luisN = r.tickets - Math.round(r.tickets * 0.55)
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400">Cajeros · turno de hoy</p>
      <div className="mt-1 space-y-1.5">
        <Cajero nombre="Ana" caja="Caja 1" ventas={anaN} monto={ana} cuadra={cuadra} retraso={0} color="bg-brand-500" />
        <Cajero nombre="Luis" caja="Caja 2" ventas={luisN} monto={r.luis} cuadra={cuadra} retraso={0.25} color="bg-slate-500" />
      </div>

      {/* Registro de la anulación autorizada con PIN: queda constancia de quién y cuándo */}
      <m.div
        initial={false}
        animate={{ opacity: autorizado ? 1 : 0, y: autorizado ? 0 : 6 }}
        transition={{ duration: 0.35, ease: SUAVE }}
        className="mt-1.5 flex h-6 items-center gap-1.5 rounded-md bg-amber-400/10 px-2 text-[10px] font-semibold text-amber-200 ring-1 ring-amber-300/25"
      >
        <span>🔒</span>
        <span className="truncate">Anulación #0412 autorizada con PIN</span>
      </m.div>

      <div className="relative mt-1.5 h-10">
        <m.div
          initial={false}
          animate={{ opacity: cuadra ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-between rounded-lg border border-dashed border-white/15 px-2.5"
        >
          <span className="text-[10.5px] font-bold text-slate-300">Arqueo de caja</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
            Contando
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1 w-1 animate-pulse rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </span>
          </span>
        </m.div>
        <m.div
          initial={false}
          animate={{ opacity: cuadra ? 1 : 0, scale: cuadra ? 1 : 0.92 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="absolute inset-0 flex items-center justify-between rounded-lg bg-brand-500/20 px-2.5 ring-1 ring-brand-400/40"
        >
          <span className="text-[12px] font-extrabold text-brand-200">Caja cuadrada ✓</span>
          <span className="text-[10px] font-semibold text-brand-300">Diferencia Bs 0</span>
        </m.div>
      </div>
    </div>
  )
}

/** Contenido del panel que cambia con cada rubro: tarjetas de arriba y la pestaña activa. */
function CuerpoPanel({ r, ev, sinInternet }: { r: Rubro; ev: Ev; sinInternet: boolean }) {
  const llego = alcanza(ev, 'LLEGA')
  const total = totalDe(r)
  const tab = alcanza(ev, 'FASE2') ? 'cajeros' : alcanza(ev, 'FASE1') ? 'stock' : 'hoy'
  return (
    <>
      <div className="grid grid-cols-3 gap-2 px-3 pt-2.5">
        <Kpi etiqueta="Ventas hoy" prefijo="Bs " valor={r.ana + r.luis + (llego ? total : 0)} delta={`+Bs ${total}`} llego={llego} sinInternet={sinInternet} />
        <Kpi etiqueta="Ganancia" prefijo="Bs " valor={r.ganancia + (llego ? gananciaDe(r) : 0)} delta={`+Bs ${gananciaDe(r)}`} llego={llego} sinInternet={sinInternet} acento />
        <Kpi etiqueta="Ventas" prefijo="" valor={r.tickets + (llego ? 1 : 0)} delta="+1" llego={llego} sinInternet={sinInternet} />
      </div>
      {/* pl: el celular tapa la parte de abajo a la izquierda, el contenido útil queda a su derecha */}
      <div className="relative min-h-0 flex-1 overflow-hidden pb-2 pl-[108px] pr-3 pt-2.5">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={tab}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.22, ease: SUAVE }}
          >
            {tab === 'hoy' ? <PanelHoy r={r} llego={llego} sinInternet={sinInternet} /> : tab === 'stock' ? <PanelStock r={r} ev={ev} /> : <PanelCajeros r={r} ev={ev} />}
          </m.div>
        </AnimatePresence>
      </div>
    </>
  )
}

const PESTANAS = ['Hoy', 'Inventario', 'Cajeros']

/* ───────────────────────── Pulso de luz ───────────────────────── */

/** Cometa que sale del «Pagado» del celular y sube hasta las ventas del panel. */
function Pulso() {
  return (
    <>
      {[0, 0.05, 0.1].map((retraso, i) => (
        <m.span
          key={i}
          aria-hidden
          initial={{ x: 108, y: 462, opacity: 0 }}
          animate={{ x: [108, 202, 240, 190], y: [462, 380, 230, 78], opacity: i === 0 ? [0, 1, 1, 0] : [0, 0.6, 0.5, 0], scale: [0.6, 1, 1, 1.5] }}
          transition={{ duration: 0.48, delay: retraso, ease: 'easeInOut' }}
          className={`pointer-events-none absolute left-0 top-0 z-40 -ml-1.5 -mt-1.5 rounded-full bg-brand-300 ${
            i === 0 ? 'h-3 w-3 shadow-[0_0_16px_6px_rgb(52_211_153/0.7)]' : 'h-2 w-2'
          }`}
        />
      ))}
    </>
  )
}

/* ───────────────────────── Componente ───────────────────────── */

const ANCHO = 512
const ALTO = 512

export const HeroDemoB = memo(function HeroDemoB({ onFase }: { onFase?: (fase: Fase) => void }) {
  const raiz = useRef<HTMLDivElement>(null)
  const medida = useRef<HTMLDivElement>(null)
  const visible = useInView(raiz, { amount: 0.3 })
  const reducir = useReducedMotion()
  const [n, setN] = useState(0)
  const [k, setK] = useState(0)
  const [escala, setEscala] = useState(1)

  const alFase = useRef(onFase)
  alFase.current = onFase

  // Las vueltas impares (farmacia y tienda) venden sin internet; la primera, que es la
  // que se ve al cargar la página, es la venta rápida normal.
  const sinInternet = !reducir && n % 2 === 1
  const guion = sinInternet ? GUION_SIN_INTERNET : GUION_NORMAL
  const r = RUBROS[n % RUBROS.length]
  // Con «reducir movimiento»: la primera venta, ya cobrada y llegada al panel, quieta.
  const ev: Ev = reducir ? 'LLEGA' : guion[Math.min(k, guion.length - 1)].ev

  // El escenario es de 512 px lógicos y se achica entero si la columna es más angosta.
  useLayoutEffect(() => {
    const el = medida.current
    if (!el) return
    const ajustar = () => setEscala(Math.min(1, el.clientWidth / ANCHO))
    ajustar()
    const ro = new ResizeObserver(ajustar)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Reloj del guion: un temporizador por paso; no corre fuera de pantalla ni con «reducir movimiento».
  useEffect(() => {
    if (reducir || !visible) return
    const sig = guion[k + 1]
    const espera = sig ? sig.at - guion[k].at : PAUSA_FIN
    const t = setTimeout(() => {
      if (sig) {
        setK(k + 1)
      } else {
        setN((x) => x + 1)
        setK(0)
      }
    }, espera)
    return () => clearTimeout(t)
  }, [k, n, visible, reducir, guion])

  // Qué promesa del titular se enciende: la del tramo que arranca. null = entre vueltas.
  useEffect(() => {
    if (reducir) alFase.current?.(null)
    else if (ev === 'INICIO') alFase.current?.(0)
    else if (ev === 'FASE1') alFase.current?.(1)
    else if (ev === 'FASE2') alFase.current?.(2)
    else if (ev === 'FIN') alFase.current?.(null)
  }, [ev, n, reducir])

  const tramo = alcanza(ev, 'FASE2') ? 2 : alcanza(ev, 'FASE1') ? 1 : 0
  const sinSenal = sinInternet && !alcanza(ev, 'VUELVE')
  // El pulso viaja justo antes de que la venta llegue al panel
  const pulsando = !reducir && (sinInternet ? ev === 'VUELVE' : ev === 'PAGADO')
  const tab = tramo === 2 ? 2 : tramo === 1 ? 1 : 0

  const textoTramo = useMemo(() => {
    if (tramo !== 0 || !sinInternet) return TRAMOS[tramo].texto
    return alcanza(ev, 'VUELVE') ? 'Volvió el internet: la venta sube sola al panel.' : 'Sin internet no frena: la venta se guarda en el celular.'
  }, [tramo, sinInternet, ev])

  return (
    <div ref={raiz} aria-hidden className="relative mx-auto w-full max-w-md pb-6 pt-6 lg:max-w-lg">
      <div ref={medida} className="relative w-full" style={{ height: ALTO * escala }}>
        <div className="absolute left-0 top-0" style={{ width: ANCHO, height: ALTO, transform: `scale(${escala})`, transformOrigin: 'top left' }}>
          {/* Halos (blur estático, no se animan) */}
          <div className="absolute left-[56%] top-[44%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="absolute left-[18%] top-[78%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/15 blur-3xl" />

          {/* ── Panel del dueño: detrás, a la derecha y apenas en perspectiva ── */}
          <div className="absolute left-[112px] top-0 w-[400px]" style={{ perspective: 1400 }}>
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: SUAVE, delay: 0.5 }}
              style={{ rotateY: 7, rotateX: 3 }}
              className="rounded-[18px] border border-white/15 bg-slate-800 p-1.5 shadow-2xl shadow-black/60 ring-1 ring-white/5"
            >
              <div className="flex h-[300px] flex-col overflow-hidden rounded-[13px] bg-gradient-to-b from-slate-900 to-slate-950 text-white">
                <div className="flex h-[34px] shrink-0 items-center gap-2 border-b border-white/5 px-3">
                  <img src="/logo-marca.png" alt="" className="h-4 w-4" />
                  <AnimatePresence mode="wait" initial={false}>
                    <m.span key={r.local} {...ENTRA} exit={{ opacity: 0 }} className="text-[11px] font-bold text-slate-100">
                      {r.local}
                    </m.span>
                  </AnimatePresence>
                  <span className="flex items-center gap-1 text-[9.5px] font-bold text-brand-300">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-400" />
                    </span>
                    En vivo
                  </span>
                  <div className="ml-auto flex gap-1">
                    {PESTANAS.map((p, i) => (
                      <span
                        key={p}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors duration-300 ${i === tab ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={n}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    <CuerpoPanel r={r} ev={ev} sinInternet={sinInternet} />
                  </m.div>
                </AnimatePresence>
              </div>
            </m.div>
          </div>

          {/* ── Celular del cajero: delante, abajo a la izquierda ── */}
          <m.div
            initial={{ opacity: 0, y: 60, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 15, delay: 0.3 }}
            className="absolute left-0 top-[112px] z-10 h-[396px] w-[216px] rounded-[34px] border border-white/15 bg-slate-900 p-2 shadow-2xl shadow-black/60 ring-1 ring-white/5"
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-white px-3 pb-3 pt-2.5 text-slate-800">
              <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>12:41</span>
                <span className="h-3.5 w-14 rounded-full bg-slate-900" />
                <span className="flex items-center gap-1">
                  <Wifi tachado={sinSenal} />
                  <span className="text-[9px]">▮▮▮</span>
                </span>
              </div>
              <div className="relative min-h-0 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={n}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25, ease: SUAVE }}
                    className="absolute inset-0"
                  >
                    <CuerpoCelular r={r} ev={ev} sinInternet={sinInternet} />
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </m.div>

          {/* ── Pulso de luz de un dispositivo al otro ── */}
          {pulsando && <Pulso key={`${n}-pulso`} />}

          {/* ── Qué está pasando, en una frase (se entiende sin leer el titular) ── */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: SUAVE, delay: 1 }}
            className="absolute right-0 top-[352px] z-10 w-[268px] rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl shadow-black/40"
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={`${tramo}-${textoTramo}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: SUAVE }}
                className="flex items-start gap-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-xl ring-1 ring-brand-400/30">
                  {TRAMOS[tramo].icono}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-extrabold leading-tight text-white">{TRAMOS[tramo].titulo}</span>
                  <span className="mt-0.5 block text-[11.5px] font-medium leading-snug text-slate-300">{textoTramo}</span>
                </span>
              </m.div>
            </AnimatePresence>
            <div className="mt-2.5 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i === tramo ? 'bg-brand-400' : 'bg-white/10'}`} />
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </div>
  )
})
