import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react'
import { Numero, SUAVE } from './animacion'
import { usePrecios } from '../data/precios'

/*
  Demo del hero: un celular que "usa" el sistema solo, rubro por rubro. En los
  de venta se tocan productos, se arma el ticket y se cobra; en los de agenda
  se toma un turno libre y se cobra la cita. Los nombres y precios son de
  ejemplo. Cada escena avisa al hero qué rubro mostrar en el titular.

  El guion avanza por pasos con setTimeout (cambios discretos, no por cuadro) y
  se pausa fuera de pantalla. Con "reducir movimiento" queda quieto en la
  primera escena ya cobrada.
*/

interface Producto {
  emoji: string
  nombre: string
  precio: number
}

type Escena =
  | {
      rubro: string
      tipo: 'venta'
      local: string
      productos: Producto[]
      /** Índices de `productos` que se tocan, en orden. */
      compra: number[]
      pago: 'QR' | 'Efectivo' | 'Mixto'
    }
  | {
      rubro: string
      tipo: 'cita'
      local: string
      citas: { hora: string; cliente: string; servicio: string }[]
      nueva: { hora: string; cliente: string; servicio: string; precio: number }
    }

export const ESCENAS: Escena[] = [
  {
    rubro: 'pollería',
    tipo: 'venta',
    local: 'Mi pollería',
    productos: [
      { emoji: '🍗', nombre: '1/4 de pollo', precio: 22 },
      { emoji: '🍗', nombre: '1/2 pollo', precio: 40 },
      { emoji: '🍟', nombre: 'Papas', precio: 10 },
      { emoji: '🥤', nombre: 'Refresco', precio: 12 },
    ],
    compra: [1, 2, 3],
    pago: 'QR',
  },
  {
    rubro: 'barbería',
    tipo: 'cita',
    local: 'Mi barbería',
    citas: [
      { hora: '09:00', cliente: 'Marcos', servicio: 'Corte' },
      { hora: '10:00', cliente: 'Jhonny', servicio: 'Barba' },
      { hora: '11:00', cliente: 'Rodrigo', servicio: 'Corte' },
    ],
    nueva: { hora: '12:00', cliente: 'Diego', servicio: 'Corte + barba', precio: 60 },
  },
  {
    rubro: 'farmacia',
    tipo: 'venta',
    local: 'Mi farmacia',
    productos: [
      { emoji: '💊', nombre: 'Paracetamol', precio: 8 },
      { emoji: '🧴', nombre: 'Alcohol 70 %', precio: 15 },
      { emoji: '🩹', nombre: 'Curitas', precio: 6 },
      { emoji: '😷', nombre: 'Barbijos', precio: 5 },
    ],
    compra: [0, 1, 3],
    pago: 'Efectivo',
  },
  {
    rubro: 'tienda',
    tipo: 'venta',
    local: 'Mi tienda',
    productos: [
      { emoji: '🍞', nombre: 'Marraqueta', precio: 1 },
      { emoji: '🥛', nombre: 'Leche', precio: 7 },
      { emoji: '🍚', nombre: 'Arroz 1 kg', precio: 9 },
      { emoji: '🧃', nombre: 'Jugo', precio: 6 },
    ],
    compra: [0, 1, 2],
    pago: 'Mixto',
  },
  {
    rubro: 'spa',
    tipo: 'cita',
    local: 'Mi spa',
    citas: [
      { hora: '15:00', cliente: 'Carla', servicio: 'Masaje' },
      { hora: '16:00', cliente: 'Andrea', servicio: 'Facial' },
      { hora: '17:00', cliente: 'Paola', servicio: 'Uñas' },
    ],
    nueva: { hora: '18:00', cliente: 'Valeria', servicio: 'Masaje relajante', precio: 120 },
  },
  {
    rubro: 'ferretería',
    tipo: 'venta',
    local: 'Mi ferretería',
    productos: [
      { emoji: '🔩', nombre: 'Tornillos', precio: 12 },
      { emoji: '🎨', nombre: 'Pintura 1 L', precio: 45 },
      { emoji: '🔨', nombre: 'Martillo', precio: 38 },
      { emoji: '🪛', nombre: 'Destornillador', precio: 20 },
    ],
    compra: [1, 0, 3],
    pago: 'QR',
  },
]

/** Cuánto dura cada paso de la escena (ms). El último es la pausa antes de la siguiente. */
const PASOS_VENTA = [600, 550, 550, 650, 500, 900, 1500]
const PASOS_CITA = [800, 700, 1000, 600, 1600]

function totalDe(e: Escena): number {
  return e.tipo === 'venta'
    ? e.compra.reduce((s, i) => s + e.productos[i].precio, 0)
    : e.nueva.precio
}

const ENTRA = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: SUAVE } }

/** Patrón fijo que hace de QR de ejemplo (no es escaneable a propósito). */
const QR = '1110111010110001101011101000101100110100101110101101011101010010011010110000001011101101011010001110110100101011'

function QrFalso() {
  return (
    <div className="grid h-20 w-20 grid-cols-[repeat(11,1fr)] gap-px rounded-md bg-white p-1.5 ring-1 ring-slate-200">
      {QR.slice(0, 121).padEnd(121, '0').split('').map((c, i) => (
        <span key={i} className={c === '1' ? 'bg-slate-900' : 'bg-transparent'} />
      ))}
    </div>
  )
}

function PantallaVenta({ e, paso }: { e: Extract<Escena, { tipo: 'venta' }>; paso: number }) {
  // Pasos: 0 grilla · 1-3 toca productos · 4 aprieta Cobrar · 5 pago · 6 pagado
  const tocados = e.compra.slice(0, Math.max(0, Math.min(paso, 3)))
  const total = tocados.reduce((s, i) => s + e.productos[i].precio, 0)
  const tocandoAhora = paso >= 1 && paso <= 3 ? e.compra[paso - 1] : -1
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-2 gap-2">
        {e.productos.map((p, i) => (
          <m.div
            key={p.nombre}
            animate={
              i === tocandoAhora
                ? { scale: [1, 0.9, 1], boxShadow: ['0 0 0 0 rgb(16 185 129 / 0)', '0 0 0 4px rgb(16 185 129 / 0.35)', '0 0 0 0 rgb(16 185 129 / 0)'] }
                : { scale: 1 }
            }
            transition={{ duration: 0.45, ease: SUAVE }}
            className={`rounded-xl border p-2 text-left ${
              tocados.includes(i) ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white'
            }`}
          >
            <p className="text-lg leading-none">{p.emoji}</p>
            <p className="mt-1 truncate text-[11px] font-bold text-slate-800">{p.nombre}</p>
            <p className="text-[10px] font-semibold text-slate-500">Bs {p.precio}</p>
          </m.div>
        ))}
      </div>

      <div className="mt-2.5 flex-1 rounded-xl bg-slate-50 p-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ticket</p>
        <div className="mt-1 space-y-1">
          <AnimatePresence initial={false}>
            {tocados.map((i) => (
              <m.div key={i} {...ENTRA} className="flex justify-between text-[11px] text-slate-700">
                <span>1 × {e.productos[i].nombre}</span>
                <span className="font-semibold">Bs {e.productos[i].precio}</span>
              </m.div>
            ))}
          </AnimatePresence>
          {tocados.length === 0 && <p className="text-[11px] text-slate-400">Tocá un producto…</p>}
        </div>
      </div>

      <div className="mt-2.5">
        <AnimatePresence mode="wait" initial={false}>
          {paso < 5 ? (
            <m.div
              key="cobrar"
              exit={{ opacity: 0, scale: 0.96 }}
              animate={paso === 4 ? { scale: [1, 0.94, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-white ${
                total > 0 ? 'bg-brand-600' : 'bg-slate-300'
              }`}
            >
              <span className="text-[11px] font-bold">Cobrar · {e.pago}</span>
              <span className="text-sm font-extrabold tabular-nums">Bs {total}</span>
            </m.div>
          ) : paso === 5 ? (
            <m.div
              key="pago"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: SUAVE }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2"
            >
              {e.pago === 'Efectivo' ? (
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-md bg-emerald-50 text-[10px] font-bold text-brand-800">
                  <span className="text-2xl">💵</span>
                  Recibido
                </div>
              ) : (
                <QrFalso />
              )}
              <div className="text-[11px] text-slate-600">
                <p className="font-bold text-slate-900">Bs {total}</p>
                {e.pago === 'QR' && <p>Esperando el pago QR…</p>}
                {e.pago === 'Efectivo' && <p>Paga con Bs {Math.ceil(total / 50) * 50} · cambio Bs {Math.ceil(total / 50) * 50 - total}</p>}
                {e.pago === 'Mixto' && <p>Bs 7 en efectivo + Bs {total - 7} por QR</p>}
              </div>
            </m.div>
          ) : (
            <m.div
              key="pagado"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-3 py-2.5 text-white"
            >
              <m.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.1 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-brand-600"
              >
                ✓
              </m.span>
              <span className="text-xs font-extrabold">Pagado · Bs {total}</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function PantallaCita({ e, paso }: { e: Extract<Escena, { tipo: 'cita' }>; paso: number }) {
  // Pasos: 0 agenda · 1 toca el libre · 2 entra la cita · 3 aprieta Cobrar · 4 cobrada
  return (
    <div className="flex h-full flex-col">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agenda de hoy</p>
      <div className="mt-1.5 space-y-1.5">
        {e.citas.map((c) => (
          <div key={c.hora} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
            <span className="w-9 text-[10px] font-bold text-slate-400">{c.hora}</span>
            <div className="h-7 w-1 rounded-full bg-brand-300" />
            <div>
              <p className="text-[11px] font-bold text-slate-800">{c.cliente}</p>
              <p className="text-[10px] text-slate-500">{c.servicio}</p>
            </div>
          </div>
        ))}
        <m.div
          animate={paso === 1 ? { scale: [1, 0.94, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-2 rounded-xl border p-2 ${
            paso >= 2 ? 'border-brand-300 bg-brand-50' : 'border-dashed border-slate-300 bg-slate-50'
          }`}
        >
          <span className="w-9 text-[10px] font-bold text-slate-400">{e.nueva.hora}</span>
          <div className={`h-7 w-1 rounded-full ${paso >= 2 ? 'bg-brand-500' : 'bg-slate-200'}`} />
          <AnimatePresence mode="wait" initial={false}>
            {paso >= 2 ? (
              <m.div key="ocupado" {...ENTRA}>
                <p className="text-[11px] font-bold text-slate-800">{e.nueva.cliente}</p>
                <p className="text-[10px] text-slate-500">{e.nueva.servicio}</p>
              </m.div>
            ) : (
              <m.p key="libre" exit={{ opacity: 0 }} className="text-[11px] font-semibold text-slate-400">
                Libre · tocá para agendar
              </m.p>
            )}
          </AnimatePresence>
        </m.div>
      </div>

      <div className="mt-auto pt-2.5">
        <AnimatePresence mode="wait" initial={false}>
          {paso < 4 ? (
            <m.div
              key="cobrar"
              exit={{ opacity: 0, scale: 0.96 }}
              animate={paso === 3 ? { scale: [1, 0.94, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-white ${
                paso >= 2 ? 'bg-brand-600' : 'bg-slate-300'
              }`}
            >
              <span className="text-[11px] font-bold">Cobrar cita</span>
              <span className="text-sm font-extrabold tabular-nums">Bs {paso >= 2 ? e.nueva.precio : 0}</span>
            </m.div>
          ) : (
            <m.div
              key="pagado"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-3 py-2.5 text-white"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-brand-600">✓</span>
              <span className="text-xs font-extrabold">Cita cobrada · Bs {e.nueva.precio}</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function HeroDemo({ onRubro }: { onRubro: (rubro: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { amount: 0.3 })
  const reducir = useReducedMotion()
  const [n, setN] = useState(0)
  const [paso, setPaso] = useState(0)
  const [ventasBs, setVentasBs] = useState(4850)
  const [ventasDia, setVentasDia] = useState(13)
  const [citasDia, setCitasDia] = useState(4)
  const [aviso, setAviso] = useState<string | null>(null)
  // El cupo vigente (API o respaldo): un "/50" fijo quedó viejo cuando bajó a 30.
  // El contador se detiene en el tope para no mostrar "31/30".
  const { cupo } = usePrecios()
  const ventasHoy = Math.min(ventasDia, cupo.ventasDia)
  const citasHoy = Math.min(citasDia, cupo.citasDia)

  const e = ESCENAS[n]
  const pasos = e.tipo === 'venta' ? PASOS_VENTA : PASOS_CITA
  const pagado = paso >= pasos.length - 1

  useEffect(() => onRubro(e.rubro), [e.rubro, onRubro])

  // Con "reducir movimiento": la primera escena, ya cobrada, sin avanzar.
  useEffect(() => {
    if (reducir) setPaso(PASOS_VENTA.length - 1)
  }, [reducir])

  useEffect(() => {
    if (reducir || !visible) return
    const t = setTimeout(() => {
      if (paso < pasos.length - 1) {
        const siguiente = paso + 1
        setPaso(siguiente)
        if (siguiente === pasos.length - 1) {
          // Cobrado: suben los contadores y aparece el aviso arriba.
          setVentasBs((v) => v + totalDe(e))
          if (e.tipo === 'venta') setVentasDia((v) => v + 1)
          else setCitasDia((v) => v + 1)
          setAviso(e.tipo === 'venta' ? `Venta guardada · Bs ${totalDe(e)}` : `Cita cobrada · Bs ${totalDe(e)}`)
        }
      } else {
        setAviso(null)
        setPaso(0)
        setN((x) => (x + 1) % ESCENAS.length)
      }
    }, pasos[paso])
    return () => clearTimeout(t)
  }, [paso, pasos, visible, reducir, e])

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md pb-6 pt-6 lg:max-w-lg">
      {/* Halo detrás del celular */}
      <div aria-hidden className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/25 blur-3xl" />

      <m.div
        initial={{ opacity: 0, y: 60, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 70, damping: 15, delay: 0.3 }}
        className="relative mx-auto w-[17rem] rounded-[2.6rem] border border-white/15 bg-slate-900 p-2.5 shadow-2xl shadow-black/60 ring-1 ring-white/5"
      >
        {/* Pantalla */}
        <div className="relative flex h-[30rem] flex-col overflow-hidden rounded-[2.1rem] bg-white px-3.5 pb-4 pt-3 text-slate-800">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>12:41</span>
            <span className="h-4 w-16 rounded-full bg-slate-900" />
            <span>5G ▮▮▮</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <m.p key={e.local} {...ENTRA} exit={{ opacity: 0, y: -8 }} className="text-sm font-extrabold text-slate-900">
                {e.local}
              </m.p>
            </AnimatePresence>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">Caja abierta</span>
          </div>

          <div className="relative mt-2.5 min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={n}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: SUAVE }}
                className="absolute inset-0"
              >
                {e.tipo === 'venta' ? <PantallaVenta e={e} paso={paso} /> : <PantallaCita e={e} paso={paso} />}
              </m.div>
            </AnimatePresence>
          </div>

          {/* Aviso que baja desde arriba al cobrar */}
          <AnimatePresence>
            {aviso && pagado && (
              <m.div
                key={aviso}
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="absolute inset-x-3 top-3 flex items-center gap-2 rounded-2xl bg-slate-900/95 px-3 py-2 text-[11px] font-bold text-white shadow-lg"
              >
                <img src="/logo-marca.png" alt="" className="h-5 w-5" />
                {aviso}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>

      {/* Tarjetas que acompañan: suben con cada cobro. En el celular van en
          fila debajo del teléfono; desde sm flotan a los costados. */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-0">
      <m.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: SUAVE, delay: 0.9 }}
        className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur sm:absolute sm:-left-2 sm:top-20 lg:-left-6"
      >
        <p className="text-[11px] font-bold text-slate-400">Ventas de hoy</p>
        <p className="mt-0.5 text-xl font-extrabold text-white">
          Bs <Numero valor={ventasBs} duracion={0.8} />
        </p>
      </m.div>
      <m.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: SUAVE, delay: 1.1 }}
        className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur sm:absolute sm:-right-2 sm:bottom-16 sm:w-40 lg:-right-6"
      >
        <p className="text-[11px] font-bold text-slate-400">Cupo de hoy</p>
        <div className="mt-1.5 space-y-1.5 text-[11px] font-semibold text-slate-300">
          <div>
            <div className="flex justify-between"><span>Ventas</span><span className="tabular-nums text-white">{ventasHoy}/{cupo.ventasDia}</span></div>
            <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/10">
              <m.div className="h-full origin-left rounded-full bg-brand-400" animate={{ scaleX: ventasHoy / cupo.ventasDia }} transition={{ duration: 0.6, ease: SUAVE }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between"><span>Citas</span><span className="tabular-nums text-white">{citasHoy}/{cupo.citasDia}</span></div>
            <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/10">
              <m.div className="h-full origin-left rounded-full bg-brand-300" animate={{ scaleX: citasHoy / cupo.citasDia }} transition={{ duration: 0.6, ease: SUAVE }} />
            </div>
          </div>
        </div>
      </m.div>
      </div>
    </div>
  )
}
