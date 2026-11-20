import type { ReactElement } from 'react'
import type { ClaveExtra, ClaveFuncion } from '../data/rubros'
import { EscenaFnOffline, EscenaFnInventario, EscenaFnDelivery } from '../components/EscenasFuncionesA'
import { EscenaFnReportes, EscenaFnFiado, EscenaFnRoles } from '../components/EscenasFuncionesB'
import { ESCENAS } from '../components/Escenas'
import { EscenaFnMenuTv } from '../components/EscenasMenuTv'

/*
  Las funciones que muestra la página /rubros, cada una con su animación.
  Reusa las escenas de la home: las de Funciones (offline, inventario,
  delivery, reportes, fiado, roles) y las de algunos rubros que cuentan una
  función mejor que nadie (la comanda del pollo, los toppings del carrito, los
  lotes de la farmacia, la agenda de la peluquería, el tiempo del billar, los
  grupos de la academia).
*/

export interface Funcion {
  titulo: string
  texto: string
  Escena: () => ReactElement
}

export const FUNCIONES: Record<ClaveFuncion, Funcion> = {
  venta: {
    titulo: 'Venta rápida',
    texto: 'Buscador, categorías o escáner. Cobrás en efectivo, QR o mixto y el recibo sale por WhatsApp.',
    Escena: ESCENAS.minimarket,
  },
  comandas: {
    titulo: 'Mesas y comandas',
    texto: 'Mesa o para llevar en cada línea, la comanda a la cocina y la cuenta de cada mesa hasta que se cobra.',
    Escena: ESCENAS.pollo,
  },
  menutv: {
    titulo: 'Tu menú en la TV',
    texto: 'La tele del local pasa tus platos con su foto y su precio. Lo cambiás desde el sistema y la TV se actualiza sola.',
    Escena: EscenaFnMenuTv,
  },
  toppings: {
    titulo: 'Tamaños y toppings',
    texto: 'Cada vaso con su tamaño y los toppings que se suman solos al precio, en la caja y en tu página.',
    Escena: ESCENAS.postres,
  },
  inventario: {
    titulo: 'Inventario real',
    texto: 'Stock al día de productos e insumos, con cada entrada y salida registrada y aviso de stock crítico.',
    Escena: EscenaFnInventario,
  },
  lotes: {
    titulo: 'Lotes y vencimientos',
    texto: 'Cada lote con su fecha: el sistema avisa lo que vence y no deja vender nada vencido (Profesional).',
    Escena: ESCENAS.farmacia,
  },
  agenda: {
    titulo: 'Agenda y turnos',
    texto: 'La agenda de cada profesional, sin turnos repetidos, y la cita se cobra en la misma caja.',
    Escena: ESCENAS.peluqueria,
  },
  tiempo: {
    titulo: 'Cobro por tiempo',
    texto: 'Cada mesa por tiempo libre o fijo, con pausa y extensión, y los consumos en la misma cuenta.',
    Escena: ESCENAS.billar,
  },
  clases: {
    titulo: 'Grupos y cuotas',
    texto: 'Calendario de grupos, inscripciones, cuotas con QR y la asistencia de cada alumno.',
    Escena: ESCENAS.academia,
  },
  delivery: {
    titulo: 'Delivery y recojo',
    texto: 'Pedidos para recoger en todos los planes; en Profesional, delivery a domicilio con app propia para el repartidor.',
    Escena: EscenaFnDelivery,
  },
  fiado: {
    titulo: 'Fiado bajo control',
    texto: 'Ventas a crédito por cliente, con sus abonos y lo que te debe cada uno a la vista.',
    Escena: EscenaFnFiado,
  },
  reportes: {
    titulo: 'Cierre de caja y reportes',
    texto: 'Arqueo al cerrar cada turno y reportes por producto, horario y forma de pago, con la ganancia del día.',
    Escena: EscenaFnReportes,
  },
  offline: {
    titulo: 'Vendé sin internet',
    texto: 'El punto de venta sigue cobrando aunque se corte la conexión; todo se sincroniza solo cuando vuelve.',
    Escena: EscenaFnOffline,
  },
  roles: {
    titulo: 'Roles y PIN',
    texto: 'Cada usuario con su rol; anular una venta o fiar de más pide el PIN del encargado.',
    Escena: EscenaFnRoles,
  },
}

/** Lo que trae el rubro sin animación propia: una línea con su emoji. */
export const EXTRAS: Record<ClaveExtra, { emoji: string; texto: string }> = {
  insumos: { emoji: '🥣', texto: 'Insumos y recetas que se descuentan al vender' },
  plataformas: { emoji: '🛵', texto: 'Pedidos de Yango y PedidosYa con su reporte de liquidación' },
  pagina: { emoji: '🌐', texto: 'Tu página web con catálogo para pedir por WhatsApp' },
  sucursales: { emoji: '🏪', texto: 'Varias sucursales, cada una con su caja y su stock' },
  combos: { emoji: '🎁', texto: 'Combos y packs con un solo precio (Profesional)' },
  conteo: { emoji: '🥤', texto: 'Conteo de vasos por tamaño al cerrar el día' },
  kg: { emoji: '⚖️', texto: 'Venta por kilo, litro o metro, con decimales' },
  qr: { emoji: '📲', texto: 'Cobro con tu QR y pago mixto' },
  tv: { emoji: '📺', texto: 'Pantalla del salón en la TV, con el tiempo de cada mesa' },
  controlados: { emoji: '📕', texto: 'Libro de controlados y venta con receta' },
  proveedores: { emoji: '📦', texto: 'Proveedores, encargos y catálogo importado desde Excel' },
  reservas: { emoji: '🔗', texto: 'Reservas online desde tu enlace*' },
  comisiones: { emoji: '💸', texto: 'Comisiones y propinas por profesional*' },
  paquetes: { emoji: '🎟️', texto: 'Paquetes de sesiones y gift cards*' },
  ficha: { emoji: '📸', texto: 'Ficha del cliente con fotos de cada trabajo*' },
  cola: { emoji: '🚶', texto: 'Cola para los que llegan sin turno' },
  cabinas: { emoji: '🛏️', texto: 'Cabinas con su propia agenda' },
  inscripciones: { emoji: '📝', texto: 'Inscripciones online desde tu página' },
  cobranza: { emoji: '💬', texto: 'Cobranza de cuotas por WhatsApp con QR' },
  notas: { emoji: '📊', texto: 'Notas y asistencia de cada alumno' },
  planilla: { emoji: '🧾', texto: 'Planilla de pago de los docentes' },
}
