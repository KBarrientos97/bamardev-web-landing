/*
  Contenido de los planes para restaurantes, vigente desde sep-2026: dos
  planes (Básico y Profesional), 15 % de descuento anual. Si cambian precios o
  features, actualizar acá, en el backend (src/licencia/catalogo.ts y su
  migración) y en el PDF comercial a la vez.

  Lo que se promete por plan sale de la PLANTILLA del backend
  (GET /api/licencia/planes → `modulos`, tablas Plan y PlanFeature): cada
  viñeta y cada fila de la comparativa nombra en un comentario el código de
  feature que la respalda. Una feature que no está en la plantilla (agenda,
  página pública, promociones, cupones, "el mesero cobra", aprobación de
  movimientos…) o que está inactiva en el catálogo (panel de cocina,
  descuentos, QR automatizado) no se promete en ningún plan.

  `lotes` y `encargos` están en la plantilla pero son de farmacia y comercio:
  el alta de un restaurante no los recibe (FeatureVertical), así que esta
  sección, que es de restaurantes, no los muestra.
*/

export const WHATSAPP_NUMERO = '59170490686'
export const WHATSAPP_DISPLAY = '+591 70490686'

export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`
}

export interface Plan {
  nombre: string
  objetivo: string
  descripcion: string
  /** Precio mensual en Bs (facturación mes a mes). */
  precio: number
  destacado?: boolean
  notaPrevia?: string
  features: string[]
}

/**
 * Pagar el año por adelantado descuenta un 15 %. Mismo cálculo que el backend
 * (src/licencia/catalogo.ts): 12 meses × precio × 0,85, redondeado a Bs enteros.
 */
export const DESCUENTO_ANUAL = 0.15

export function precioAnual(precioMensual: number, descuento = DESCUENTO_ANUAL): number {
  return Math.round(precioMensual * 12 * (1 - descuento))
}

/** Lo que "sale por mes" pagando anual (para mostrar "Bs 170 / mes"). */
export function mensualEquivalente(precioMensual: number, descuento = DESCUENTO_ANUAL): number {
  return Math.round(precioAnual(precioMensual, descuento) / 12)
}

export function ahorroAnual(precioMensual: number, descuento = DESCUENTO_ANUAL): number {
  return precioMensual * 12 - precioAnual(precioMensual, descuento)
}

/** "2040" → "2.040" (separador de miles local). */
export function fmtBs(n: number): string {
  return n.toLocaleString('es-BO')
}

export const PLANES: Plan[] = [
  {
    nombre: 'Básico',
    objetivo: 'Vender',
    descripcion:
      'Punto de venta completo: cobrás, controlás stock, caja y gastos, y funciona sin internet.',
    precio: 200,
    features: [
      // pos · mesa_llevar · recoger
      'Punto de venta con comanda Mesa / Llevar y pedidos para recoger',
      // pago_qr_mixto · fiado
      'Cobro en efectivo, QR, mixto (efectivo + QR) y fiado con sus abonos',
      // caja · movimientos_caja · autorizacion_pin
      'Caja con arqueo, ingresos y egresos de efectivo, y anulaciones con PIN del encargado',
      // catalogo · inventario · insumos
      'Inventario con stock real: productos, insumos y movimientos',
      // gastos
      'Gastos del negocio (alquiler, sueldos, servicios), con los fijos que se cargan solos',
      // reportes · reportes_operacion · reportes_rentabilidad
      'Reportes de ventas, caja, productos, horarios y ganancia estimada',
      // recibo_pdf
      'Recibo impreso y en PDF por WhatsApp',
      // offline
      'Funciona sin internet — la venta se sincroniza sola',
      // usuarios · usuariosIncluidos = 4
      'Usuarios con roles (administrador, supervisor, cajero) · hasta 4',
      // sucursalesIncluidas = 1
      '1 sucursal incluida (adicionales, Bs 100/mes c/u)',
    ],
  },
  {
    nombre: 'Profesional',
    objetivo: 'Administrar',
    descripcion:
      'Delivery, salón con meseros, combos, varios almacenes y exportación de reportes.',
    precio: 350,
    destacado: true,
    notaPrevia: 'Todo lo de Básico, más',
    features: [
      // delivery
      'Delivery con app propia para el repartidor',
      // salon (el reporte por mesero vive en reportes_operacion, pero sin
      // salón no hay meseros que reportar)
      'Salón con meseros: mesas, comandas, cuenta a caja y reporte por mesero',
      // combos. NO descuentan ingredientes: desde que el combo tiene stock
      // propio, la receta es descriptiva (venta.service › aplicarStock).
      'Combos y platos compuestos, con su receta y su propio stock',
      // multi_almacen
      'Varios almacenes',
      // exportacion
      'Exportación de reportes a Excel (archivo CSV)',
      // usuariosIncluidos = null
      'Usuarios ilimitados',
      // sucursalesIncluidas = 2
      '2 sucursales incluidas (adicionales, Bs 100/mes c/u)',
    ],
  },
]

/**
 * Filas de la tabla comparativa: [concepto, Básico, Profesional].
 * Las dos de precio se arman con los precios vigentes (API o fijos).
 */
export function comparativa(
  precios: Record<string, number>,
  descuento: number,
): [string, string, string][] {
  const p = PLANES.map((pl) => precios[pl.nombre] ?? pl.precio)
  return [
    ['Precio mensual', `Bs ${fmtBs(p[0])}`, `Bs ${fmtBs(p[1])}`],
    [
      `Precio anual (−${Math.round(descuento * 100)} %)`,
      `Bs ${fmtBs(precioAnual(p[0], descuento))}`,
      `Bs ${fmtBs(precioAnual(p[1], descuento))}`,
    ],
    ...COMPARATIVA_FIJA,
  ]
}

/**
 * Filas que no dependen del precio. Completa a propósito: una fila por cada
 * feature de la plantilla que aplica a un restaurante (el código, al lado).
 */
const COMPARATIVA_FIJA: [string, string, string][] = [
  ['Objetivo', 'Vender', 'Administrar'],
  ['Punto de venta con comanda Mesa / Llevar', 'Sí', 'Sí'], // pos · mesa_llevar
  ['Pedidos para recoger', 'Sí', 'Sí'], // recoger
  ['Cobro en efectivo, QR y mixto', 'Sí', 'Sí'], // pago_qr_mixto
  ['Fiado: ventas a crédito y abonos', 'Sí', 'Sí'], // fiado
  ['Caja: apertura, cierre con arqueo, ingresos y egresos', 'Sí', 'Sí'], // caja · movimientos_caja
  ['Anulaciones con PIN del encargado', 'Sí', 'Sí'], // autorizacion_pin
  ['Inventario: productos, insumos y movimientos', 'Sí', 'Sí'], // catalogo · inventario · insumos
  ['Gastos del negocio (alquiler, sueldos, servicios)', 'Sí', 'Sí'], // gastos
  ['Reportes de ventas y caja', 'Sí', 'Sí'], // reportes
  ['Reportes por producto, categoría, horario y forma de pago', 'Sí', 'Sí'], // reportes_operacion
  ['Reportes de rentabilidad: ganancia, compras e insumos', 'Sí', 'Sí'], // reportes_rentabilidad
  ['Recibo impreso y en PDF por WhatsApp', 'Sí', 'Sí'], // recibo_pdf
  ['Funciona sin internet', 'Sí', 'Sí'], // offline
  ['Delivery con app del repartidor', '—', 'Sí'], // delivery
  ['Salón con meseros (mesas, comandas y reporte por mesero)', '—', 'Sí'], // salon
  ['Combos y platos compuestos', '—', 'Sí'], // combos
  ['Varios almacenes', '—', 'Sí'], // multi_almacen
  ['Exportación de reportes (CSV)', '—', 'Sí'], // exportacion
  ['Sucursales incluidas', '1', '2'],
  ['Usuarios incluidos', '4', 'Ilimitados'],
]

export const NOTA_LEGAL =
  'Precios en bolivianos. Facturación mensual, o anual por adelantado con 15 % de descuento. Incluye actualizaciones y respaldo en la nube. Instalación y capacitación se cotizan aparte. Básico incluye 1 sucursal y Profesional 2; adicionales, Bs 100/mes cada una. Las ganancias mostradas son estimadas: se calculan sobre precio de venta y costo cargado en el sistema, sin incluir otros gastos del negocio (alquiler, sueldos, servicios).'
