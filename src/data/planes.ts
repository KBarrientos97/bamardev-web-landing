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
  precio: number
  destacado?: boolean
  notaPrevia?: string
  features: string[]
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
      'Combos y platos compuestos: al cobrar uno, el sistema descuenta automáticamente los ingredientes del stock',
      'Dashboard: valor de inventario y alertas de stock',
      'Pagos con QR y mixto (efectivo + QR)',
      'Reportes completos: producto, categoría, horario, pago y ganancia estimada',
      'Delivery y recojo, con app propia para el repartidor',
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
      'Panel de Cocina y Tablero TV para visualización de pedidos en tiempo real',
      'Exportación de reportes a Excel',
      'Usuarios ilimitados',
      'Soporte prioritario',
    ],
  },
]

/** Filas de la tabla comparativa: [concepto, Básico, Profesional, Full]. */
export const COMPARATIVA: [string, string, string, string][] = [
  ['Precio mensual', 'Bs 249', 'Bs 349', 'Bs 449'],
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
  ['Panel de Cocina y Tablero TV', '—', '—', 'Sí'],
  ['Exportación a Excel', '—', '—', 'Sí'],
  ['Sucursales incluidas', '1', '1', '1'],
  ['Usuarios incluidos', '3', '8', 'Ilimitados'],
  ['Soporte', 'Estándar', 'Estándar', 'Prioritario'],
]

export const NOTA_LEGAL =
  'Precios en bolivianos, facturación mensual. Incluye actualizaciones y respaldo en la nube. Instalación y capacitación se cotizan aparte. Cada plan incluye 1 sucursal; adicionales, Bs 100/mes cada una. Las ganancias mostradas son estimadas: se calculan sobre precio de venta y costo cargado en el sistema, sin incluir otros gastos del negocio (alquiler, sueldos, servicios).'
