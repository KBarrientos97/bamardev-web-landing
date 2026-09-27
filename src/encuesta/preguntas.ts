/**
 * Cuestionario del Plan Emprendedor.
 *
 * Los `valor` son los códigos que acepta el backend
 * (`bamardev-backend/src/encuesta/encuesta.catalogo.ts`): si se cambia uno acá
 * hay que cambiarlo allá y subir la versión, o la respuesta rebota con 400.
 * El texto sí es libre: es lo que lee el dueño del negocio.
 */

export type Rubro =
  | 'RESTAURANTE'
  | 'FARMACIA'
  | 'TIENDA'
  | 'FERRETERIA'
  | 'CAFETERIA'
  | 'ROPA'
  | 'OTRO'

export interface Opcion {
  valor: string
  texto: string
  emoji?: string
}

export const RUBROS: (Opcion & { valor: Rubro })[] = [
  { valor: 'RESTAURANTE', texto: 'Restaurante / comida rápida / pollería', emoji: '🍗' },
  { valor: 'FARMACIA', texto: 'Farmacia', emoji: '💊' },
  { valor: 'TIENDA', texto: 'Tienda / minimarket', emoji: '🛒' },
  { valor: 'FERRETERIA', texto: 'Ferretería', emoji: '🔧' },
  { valor: 'CAFETERIA', texto: 'Cafetería / bebidas', emoji: '🥤' },
  { valor: 'ROPA', texto: 'Tienda de ropa / otros productos', emoji: '👕' },
  { valor: 'OTRO', texto: 'Otro', emoji: '📦' },
]

/** En comida se habla de pedidos; en todo lo demás, de ventas. */
export const atiendePedidos = (rubro?: Rubro) =>
  rubro === 'RESTAURANTE' || rubro === 'CAFETERIA'

export const VENTAS_DIA: Opcion[] = [
  { valor: '1-10', texto: '1 a 10' },
  { valor: '11-30', texto: '11 a 30' },
  { valor: '31-50', texto: '31 a 50' },
  { valor: '51-80', texto: '51 a 80' },
  { valor: '81-100', texto: '81 a 100' },
  { valor: '101-150', texto: '101 a 150' },
  { valor: '150+', texto: 'Más de 150' },
]

export const CONTROL_ACTUAL: Opcion[] = [
  { valor: 'CUADERNO', texto: 'En un cuaderno, a mano', emoji: '📝' },
  { valor: 'EXCEL', texto: 'Con Excel', emoji: '📊' },
  { valor: 'APP_GRATIS', texto: 'Con una aplicación gratuita', emoji: '📱' },
  { valor: 'SISTEMA_PAGO', texto: 'Con un sistema de pago', emoji: '💻' },
  { valor: 'NINGUNO', texto: 'Todavía no llevo control', emoji: '🤷' },
  { valor: 'OTRO', texto: 'De otra forma', emoji: '🔄' },
]

interface Herramienta extends Opcion {
  /** Sólo se ofrece a estos rubros. Sin esto, a todos. */
  soloPara?: Rubro[]
}

const HERRAMIENTAS: Herramienta[] = [
  { valor: 'VENTAS_CAJA', texto: 'Registro de ventas y caja', emoji: '🧾' },
  { valor: 'INVENTARIO', texto: 'Control de inventario', emoji: '📦' },
  { valor: 'REPORTES', texto: 'Reportes de ventas', emoji: '📊' },
  { valor: 'GASTOS', texto: 'Control de gastos', emoji: '💰' },
  { valor: 'GANANCIAS', texto: 'Reporte de ganancias', emoji: '📈' },
  { valor: 'USUARIOS', texto: 'Usuarios / cajeros', emoji: '👥' },
  {
    valor: 'COMANDAS',
    texto: 'Comandas de cocina / pedidos',
    emoji: '🍳',
    soloPara: ['RESTAURANTE', 'CAFETERIA'],
  },
  {
    valor: 'VENCIMIENTOS',
    texto: 'Control de vencimientos',
    emoji: '📅',
    soloPara: ['FARMACIA', 'TIENDA'],
  },
  { valor: 'RECIBOS_WHATSAPP', texto: 'Recibos por WhatsApp', emoji: '📲' },
  { valor: 'PAGOS_QR', texto: 'Cobros en efectivo, QR y mixtos', emoji: '💳' },
  { valor: 'ALERTAS_STOCK', texto: 'Alertas de stock bajo', emoji: '🔔' },
]

/**
 * Las herramientas que tienen sentido para ese rubro: comandas a una farmacia
 * o vencimientos a una pollería sólo alargan la lista.
 */
export const herramientasPara = (rubro?: Rubro): Opcion[] =>
  HERRAMIENTAS.filter((h) => !h.soloPara || (rubro && h.soloPara.includes(rubro)))

export const PRECIO_MENSUAL: Opcion[] = [
  { valor: 'MENOS_30', texto: 'Menos de Bs 30' },
  { valor: '30-50', texto: 'Bs 30 a 50' },
  { valor: '51-70', texto: 'Bs 51 a 70' },
  { valor: '71-100', texto: 'Bs 71 a 100' },
  { valor: '101-150', texto: 'Bs 101 a 150' },
  { valor: 'MAS_150', texto: 'Más de Bs 150' },
  { valor: 'NO_PAGARIA', texto: 'No pagaría por un sistema' },
]

export const MODALIDAD: Opcion[] = [
  // Sin "por día": si el período va acá, la pregunta siguiente llega contestada.
  { valor: 'BAJO_CON_LIMITE', texto: 'Pagar poco al mes, con un límite de ventas', emoji: '💵' },
  { valor: 'MAS_LIMITE_MAYOR', texto: 'Pagar un poco más y tener un límite más alto', emoji: '📈' },
  { valor: 'FIJO_ILIMITADO', texto: 'Pagar un precio fijo con ventas ilimitadas', emoji: '♾️' },
  {
    valor: 'BAJO_MAS_EXTRAS',
    texto: 'Pagar poco y comprar ventas extra sólo cuando las necesite',
    emoji: '🧾',
  },
  { valor: 'NO_SEGURO', texto: 'No estoy seguro', emoji: '🤔' },
]

/**
 * El mismo total, repartido distinto. Es la decisión de diseño del plan: el
 * diario se renueva cada mañana pero corta en el pico; el mensual aguanta los
 * días fuertes. El texto de cada opción dice la consecuencia, no el nombre.
 */
export const PERIODO_LIMITE: Opcion[] = [
  { valor: 'DIARIO', texto: 'Por día: se renueva cada mañana', emoji: '📅' },
  {
    valor: 'MENSUAL',
    texto: 'Por mes: las uso como quiera, más en los días fuertes y menos en los flojos',
    emoji: '🗓️',
  },
  { valor: 'IGUAL', texto: 'Me da igual', emoji: '🤷' },
]

export const COMPRA_EXTRA: Opcion[] = [
  { valor: 'SI', texto: 'Sí, me parece una buena opción', emoji: '👍' },
  { valor: 'DEPENDE', texto: 'Depende del precio', emoji: '🤔' },
  { valor: 'CAMBIAR_PLAN', texto: 'No, prefiero pasarme a un plan más grande', emoji: '⬆️' },
  { valor: 'NO', texto: 'No me interesa', emoji: '👎' },
]

/** Sólo a quien dijo que sí o que depende se le pregunta el precio. */
export const preguntaPrecioExtra = (compraExtra?: string) =>
  compraExtra === 'SI' || compraExtra === 'DEPENDE'

export const PRECIO_EXTRA: Opcion[] = [
  { valor: '5', texto: 'Bs 5' },
  { valor: '10', texto: 'Bs 10' },
  { valor: '15', texto: 'Bs 15' },
  { valor: '20', texto: 'Bs 20' },
  { valor: 'MAS_20', texto: 'Más de Bs 20' },
  { valor: 'NINGUNO', texto: 'Ninguno me parece justo' },
]

export const INTERES: Opcion[] = [
  { valor: 'MUY_INTERESANTE', texto: '¡Me parece muy interesante!', emoji: '⭐' },
  { valor: 'PROBARLO', texto: 'Me gustaría probarlo', emoji: '👍' },
  { valor: 'SABER_PRECIO', texto: 'Tendría que conocer el precio', emoji: '🤔' },
  { valor: 'NO_INTERESA', texto: 'No me interesa', emoji: '👎' },
  { valor: 'NO_SEGURO', texto: 'No estoy seguro', emoji: '🤷' },
]

/** A quien le interesa se le ofrece dejar su WhatsApp; al resto, no. */
export const interesado = (interes?: string) =>
  interes === 'MUY_INTERESANTE' || interes === 'PROBARLO' || interes === 'SABER_PRECIO'
