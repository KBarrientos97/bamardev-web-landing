/*
  Contenido de los planes para restaurantes, vigente desde sep-2026: dos
  planes (Básico y Profesional), 15 % de descuento anual. Si cambian precios o
  features, actualizar acá, en el backend (src/licencia/catalogo.ts y su
  migración) y en el PDF comercial a la vez.
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
      'Punto de venta completo: cobrás, controlás stock y caja, y funciona sin internet.',
    precio: 200,
    features: [
      'Punto de venta: venta en el local y pedidos para recoger',
      'Cobro en efectivo, QR, mixto (efectivo + QR) y a crédito (fiado)',
      'Caja: apertura, cierre con arqueo y gastos operativos (egresos de efectivo)',
      'Inventario: productos, insumos y movimientos de stock',
      'Reportes de ventas, inventario, caja y gastos',
      'Recibo impreso y envío por WhatsApp',
      'Comanda Mesa / Llevar por producto',
      'Funciona sin internet — la venta se sincroniza sola',
      'Paneles de Administrador y Cajero · hasta 4 usuarios',
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
      'Delivery con app propia para el repartidor',
      'Panel de Mesero: mesas, comandas y cuenta a caja',
      'Combos y platos compuestos que descuentan ingredientes al vender',
      'Varios almacenes',
      'Reporte de meseros',
      'Exportación de reportes a Excel (archivo CSV)',
      'Usuarios ilimitados',
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

/** Filas que no dependen del precio. */
const COMPARATIVA_FIJA: [string, string, string][] = [
  ['Objetivo', 'Vender', 'Administrar'],
  ['Punto de venta (local y recoger)', 'Sí', 'Sí'],
  ['Delivery con app del repartidor', '—', 'Sí'],
  ['Cobro: efectivo, QR, mixto y crédito', 'Sí', 'Sí'],
  ['Inventario: productos, insumos y movimientos', 'Sí', 'Sí'],
  ['Panel de mesero (mesas y comandas)', '—', 'Sí'],
  ['Combos y platos compuestos', '—', 'Sí'],
  ['Reportes de ventas, inventario, caja y gastos', 'Sí', 'Sí'],
  ['Reporte de meseros', '—', 'Sí'],
  ['Recibo impreso y por WhatsApp', 'Sí', 'Sí'],
  ['Exportación de reportes (CSV)', '—', 'Sí'],
  ['Sucursales incluidas', '1', '2'],
  ['Usuarios incluidos', '4', 'Ilimitados'],
]

export const NOTA_LEGAL =
  'Precios en bolivianos. Facturación mensual, o anual por adelantado con 15 % de descuento. Incluye actualizaciones y respaldo en la nube. Instalación y capacitación se cotizan aparte. Básico incluye 1 sucursal y Profesional 2; adicionales, Bs 100/mes cada una. Las ganancias mostradas son estimadas: se calculan sobre precio de venta y costo cargado en el sistema, sin incluir otros gastos del negocio (alquiler, sueldos, servicios).'
