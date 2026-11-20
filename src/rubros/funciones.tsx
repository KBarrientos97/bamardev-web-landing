import type { ReactElement } from 'react'
import type { ClaveExtra, ClaveFuncion } from '../data/rubros'
import { EscenaFnOffline, EscenaFnInventario, EscenaFnDelivery } from '../components/EscenasFuncionesA'
import { EscenaFnReportes, EscenaFnFiado, EscenaFnRoles } from '../components/EscenasFuncionesB'
import { ESCENAS } from '../components/Escenas'
import { EscenaFnMenuTv } from '../components/EscenasMenuTv'
import { EscenaFnTickets, EscenaFnPlataformas } from '../components/EscenasFnComida'
import { EscenaFnCatalogoWeb, EscenaFnSucursales, EscenaFnVentaPeso, EscenaFnEncargos } from '../components/EscenasFnTiendas'
import {
  EscenaFnAgendaBarberia,
  EscenaFnAgendaSpa,
  EscenaFnAgendaUnas,
  EscenaFnReservaOnline,
  EscenaFnComisiones,
} from '../components/EscenasFnAgenda'
import { EscenaFnSupervisionBillar, EscenaFnReservasBillar, EscenaFnPantallaSalon } from '../components/EscenasFnBillar'
import { EscenaFnInscripcionWeb, EscenaFnCuotas, EscenaFnGrupos, EscenaFnAsistencia } from '../components/EscenasFnAcademia'

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
    titulo: 'Tu menú en las TV del local',
    texto: 'Una tele pasa tus platos y promos con foto y precio; la otra, la carta completa. Lo cambiás desde el sistema y las dos se actualizan solas.',
    Escena: EscenaFnMenuTv,
  },
  tickets: {
    titulo: 'Pedidos con número',
    texto: 'Al cobrar sale el ticket con su número; la TV de pedidos lo pasa de «Preparando» a «Listo» y el cliente lo retira sin gritar nombres.',
    Escena: EscenaFnTickets,
  },
  plataformas: {
    titulo: 'Pedidos de Yango y PedidosYa',
    texto: 'Registrás cada pedido de las apps con un toque, el stock baja solo y el reporte te muestra cuánto te tiene que pagar cada app por período.',
    Escena: EscenaFnPlataformas,
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
  encargos: {
    titulo: 'Encargos',
    texto: 'Lo que el cliente pidió y no había queda anotado; cuando llega la mercadería, el encargo pasa a «Llegó» y le avisás por WhatsApp.',
    Escena: EscenaFnEncargos,
  },
  peso: {
    titulo: 'Venta por kilo, litro o metro',
    texto: 'Cantidades con decimales: pesás o medís, el precio se calcula solo y la línea entra al ticket.',
    Escena: EscenaFnVentaPeso,
  },
  sucursales: {
    titulo: 'Varias sucursales',
    texto: 'Cada local con su caja y su stock; transferís mercadería entre ellos y ves las ventas de todos juntos desde el celular.',
    Escena: EscenaFnSucursales,
  },
  catalogoweb: {
    titulo: 'Tu página web con catálogo',
    texto: 'Tus productos con foto y precio en tu propia página; el cliente arma su pedido y te llega por WhatsApp, listo para cobrar.',
    Escena: EscenaFnCatalogoWeb,
  },
  agenda: {
    titulo: 'Agenda y turnos',
    texto: 'La agenda de cada profesional, sin turnos repetidos, y la cita se cobra en la misma caja.',
    Escena: ESCENAS.peluqueria,
  },
  agendabarberia: {
    titulo: 'Agenda de barberos y cola sin turno',
    texto: 'Cada barbero con su agenda, sin turnos repetidos, y en la misma pantalla la cola de los que llegan sin turno.',
    Escena: EscenaFnAgendaBarberia,
  },
  agendaspa: {
    titulo: 'Cabinas y terapeutas sin choques',
    texto: 'Cada masaje ocupa la cabina y la terapeuta a la vez: el sistema no deja dar dos turnos a la misma hora.',
    Escena: EscenaFnAgendaSpa,
  },
  agendaunas: {
    titulo: 'Tu clienta elige la hora',
    texto: 'Elige el servicio, la profesional y el horario desde su celular, y la cita cae sola en tu agenda.',
    Escena: EscenaFnAgendaUnas,
  },
  reserva: {
    titulo: 'Reservas online',
    texto: 'Tu enlace de reservas muestra sólo los horarios libres; el cliente reserva, paga el anticipo con QR si lo pedís y el turno cae en tu agenda.',
    Escena: EscenaFnReservaOnline,
  },
  comisiones: {
    titulo: 'Comisiones y propinas',
    texto: 'Al cobrar cada servicio se calcula la comisión de la profesional y la propina va aparte; al cerrar el día ves cuánto le toca a cada una.',
    Escena: EscenaFnComisiones,
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
  supervisionbillar: {
    titulo: 'Supervisión de cada mesa',
    texto: 'Desde tu casa ves en vivo cada mesa: si está libre, ocupada o pausada, quién la abrió y cuánto debería haber en la caja. Si hace falta, pausás una mesa desde lejos.',
    Escena: EscenaFnSupervisionBillar,
  },
  reservasbillar: {
    titulo: 'Reservas por horario',
    texto: 'Reservás una mesa a nombre del cliente para una hora; queda marcada en el tablero y, cuando llegan, se abre desde la reserva y el tiempo arranca solo.',
    Escena: EscenaFnReservasBillar,
  },
  pantallasalon: {
    titulo: 'Pantalla del salón',
    texto: 'Una TV en el salón muestra todas las mesas: las libres, el tiempo de las que juegan y la cuenta regresiva de las de tiempo fijo, con aviso al terminar.',
    Escena: EscenaFnPantallaSalon,
  },
  inscripcion: {
    titulo: 'Inscripción online',
    texto: 'El alumno elige el curso y el horario desde tu página y la inscripción llega a la recepción, lista para cobrar e inscribir.',
    Escena: EscenaFnInscripcionWeb,
  },
  cuotas: {
    titulo: 'Cobro de cuotas con QR',
    texto: 'El recordatorio con el QR llega por WhatsApp; el alumno paga y su cuota del mes pasa a pagada en su estado de cuenta.',
    Escena: EscenaFnCuotas,
  },
  grupos: {
    titulo: 'Grupos y horarios',
    texto: 'El calendario de cada sede con sus franjas: abrís un grupo en un horario libre con su aula y su docente, y ves los cupos que quedan.',
    Escena: EscenaFnGrupos,
  },
  asistencia: {
    titulo: 'Asistencia',
    texto: 'El docente pasa lista desde su celular y ves el porcentaje de asistencia de cada grupo y de cada alumno.',
    Escena: EscenaFnAsistencia,
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

/**
 * Un extra que ya tiene su animación no se repite en «Y además»: la página web
 * es el catálogo, las sucursales, las plataformas…
 */
export const EXTRA_ANIMADO: Partial<Record<ClaveExtra, ClaveFuncion>> = {
  pagina: 'catalogoweb',
  sucursales: 'sucursales',
  kg: 'peso',
  plataformas: 'plataformas',
  reservas: 'reserva',
  comisiones: 'comisiones',
  inscripciones: 'inscripcion',
  cobranza: 'cuotas',
  notas: 'asistencia',
  cola: 'agendabarberia',
  cabinas: 'agendaspa',
  tv: 'pantallasalon',
}
