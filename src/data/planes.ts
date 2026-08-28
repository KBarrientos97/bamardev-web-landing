/*
  Contenido de los planes para restaurantes — transcrito del PDF oficial
  "BamarDev - Planes Restaurante (v7)". Si cambian precios o features,
  actualizar aquí y en el PDF a la vez.
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
 * Pagar el año por adelantado descuenta un 10 %. Mismo cálculo que el backend
 * (src/licencia/catalogo.ts): 12 meses × precio × 0,9, redondeado a Bs enteros.
 */
export const DESCUENTO_ANUAL = 0.1

export function precioAnual(precioMensual: number, descuento = DESCUENTO_ANUAL): number {
  return Math.round(precioMensual * 12 * (1 - descuento))
}

/** Lo que "sale por mes" pagando anual (para mostrar "Bs 314 / mes"). */
export function mensualEquivalente(precioMensual: number, descuento = DESCUENTO_ANUAL): number {
  return Math.round(precioAnual(precioMensual, descuento) / 12)
}

export function ahorroAnual(precioMensual: number, descuento = DESCUENTO_ANUAL): number {
  return precioMensual * 12 - precioAnual(precioMensual, descuento)
}

/** "2689" → "2.689" (separador de miles local). */
export function fmtBs(n: number): string {
  return n.toLocaleString('es-BO')
}

export const PLANES: Plan[] = [
  {
    nombre: 'Básico',
    objetivo: 'Vender',
    descripcion:
      'Punto de venta profesional: cobrás, cerrás caja y funciona sin internet.',
    precio: 249,
    features: [
      'Punto de venta: pagos en efectivo',
      'Alta simple de productos y categorías, sin límite',
      'Apertura y cierre de caja, con ajustes de efectivo',
      'Historial de cierres de caja',
      'Funciona sin internet — la venta se sincroniza sola',
      'Reportes: ventas totales por período',
      'Hasta 3 usuarios (Administrador + Cajero)',
      '1 sucursal incluida (¿más sucursales? Bs 100/mes c/u)',
      'App Android y tablet, respaldo en la nube',
    ],
  },
  {
    nombre: 'Profesional',
    objetivo: 'Administrar',
    descripcion:
      'Sistema de gestión completo: inventario, delivery y reportes de rentabilidad.',
    precio: 349,
    destacado: true,
    notaPrevia: 'Todo lo de Básico, más',
    features: [
      'Inventario con control de stock real',
      'Combos y platos compuestos: armá un combo con varios productos y el sistema descuenta el stock de cada uno al vender',
      'Dashboard: valor de inventario y alertas de stock',
      'Pagos con QR y mixto (efectivo + QR)',
      'Reportes completos: producto, categoría, horario, pago y ganancia estimada',
      'Delivery y recojo, con app propia para el repartidor',
      'Fiado: clientes, ventas a crédito, abonos y cuánto te deben',
      'Rol de Encargado/Supervisor con PIN para autorizar descuentos, anulaciones y ajustes',
      'Hasta 8 usuarios',
    ],
  },
  {
    nombre: 'Full',
    objetivo: 'Rentabilizar',
    descripcion:
      'Control total de costos: sabé exactamente cuánto gastás en producir y cuánto ganás.',
    precio: 449,
    notaPrevia: 'Todo lo de Profesional, más',
    features: [
      'Insumos: registro, stock y alertas de materia prima',
      'Reporte Ventas vs. Insumos y ganancia estimada',
      'Reporte de compras: en qué gastás y cuánto te queda',
      'Exportación de reportes a Excel (archivo CSV)',
      'Usuarios ilimitados',
      'Soporte prioritario',
    ],
  },
]

/**
 * Filas de la tabla comparativa: [concepto, Básico, Profesional, Full].
 * Las dos de precio se arman con los precios vigentes (API o fijos).
 */
export function comparativa(
  precios: Record<string, number>,
  descuento: number,
): [string, string, string, string][] {
  const p = PLANES.map((pl) => precios[pl.nombre] ?? pl.precio)
  return [
    ['Precio mensual', `Bs ${fmtBs(p[0])}`, `Bs ${fmtBs(p[1])}`, `Bs ${fmtBs(p[2])}`],
    [
      `Precio anual (−${Math.round(descuento * 100)} %)`,
      `Bs ${fmtBs(precioAnual(p[0], descuento))}`,
      `Bs ${fmtBs(precioAnual(p[1], descuento))}`,
      `Bs ${fmtBs(precioAnual(p[2], descuento))}`,
    ],
    ...COMPARATIVA_FIJA,
  ]
}

/** Filas que no dependen del precio. */
const COMPARATIVA_FIJA: [string, string, string, string][] = [
  ['Objetivo', 'Vender', 'Administrar', 'Rentabilizar'],
  ['Punto de venta (efectivo)', 'Sí', 'Sí', 'Sí'],
  ['Pagos con QR y mixto', '—', 'Sí', 'Sí'],
  ['Inventario (control de stock real)', '—', 'Sí', 'Sí'],
  ['Delivery y recojo con repartidor', '—', 'Sí', 'Sí'],
  [
    'Reportes',
    'Solo ventas totales',
    'Ventas, stock y rentabilidad',
    '+ Insumos y costos de producción',
  ],
  ['Insumos + Ventas vs. Insumos', '—', '—', 'Sí'],
  ['Fiado y cuentas por cobrar', '—', 'Sí', 'Sí'],
  ['Exportación de reportes', '—', '—', 'Sí'],
  ['Sucursales incluidas', '1', '1', '1'],
  ['Usuarios incluidos', '3', '8', 'Ilimitados'],
  ['Soporte', 'Estándar', 'Estándar', 'Prioritario'],
]

export const NOTA_LEGAL =
  'Precios en bolivianos. Facturación mensual, o anual por adelantado con 10 % de descuento. Incluye actualizaciones y respaldo en la nube. Instalación y capacitación se cotizan aparte. Cada plan incluye 1 sucursal; adicionales, Bs 100/mes cada una. Las ganancias mostradas son estimadas: se calculan sobre precio de venta y costo cargado en el sistema, sin incluir otros gastos del negocio (alquiler, sueldos, servicios).'
