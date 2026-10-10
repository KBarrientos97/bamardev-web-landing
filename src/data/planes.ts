/*
  Contenido de los planes, vigente desde oct-2026: tres planes (Emprendedor,
  Básico y Profesional), 15 % de descuento anual y la mitad (7,5 %) pagando 6
  meses. Si cambian precios, cupos, paquetes de créditos o features, actualizar
  acá, en el backend (src/licencia/catalogo.ts y su migración) y en el PDF
  comercial a la vez.

  Los precios, el cupo del Emprendedor y los paquetes se administran desde el
  panel y la landing los lee de la API (precios.ts y paquetes.ts). Los valores
  de este archivo son el respaldo: se ven cuando la API no responde o todavía
  no conoce el Emprendedor, así que tienen que coincidir con los del panel.
*/

export const WHATSAPP_NUMERO = '59170490686'
export const WHATSAPP_DISPLAY = '+591 70490686'

export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`
}

/** Código del plan en la API (`GET /licencia/planes`). Es lo que no cambia. */
export type CodigoPlan = 'EMPRENDEDOR' | 'BASICO' | 'PRO'

/**
 * Lo único que limita el Emprendedor: cuánto se vende y se agenda por día, y
 * cuántos créditos cuesta pasarse. Los demás planes no tienen cupo.
 */
export interface CupoPlan {
  ventasDia: number
  citasDia: number
  creditosPorVenta: number
  creditosPorCita: number
}

/** Respaldo de los campos que el backend publica en el plan EMPRENDEDOR. */
export const CUPO_EMPRENDEDOR: CupoPlan = {
  ventasDia: 50,
  citasDia: 50,
  creditosPorVenta: 1,
  creditosPorCita: 2,
}

export interface Plan {
  codigo: CodigoPlan
  nombre: string
  objetivo: string
  descripcion: string
  /** Precio mensual en Bs (facturación mes a mes). */
  precio: number
  destacado?: boolean
  /** Cinta chica sobre la tarjeta ("Nuevo"), menos llamativa que la del destacado. */
  etiqueta?: string
  notaPrevia?: string
  /**
   * Las del Emprendedor dependen del cupo vigente (que puede venir de la API),
   * por eso pueden ser una función. Usar `featuresDe` para leerlas.
   */
  features: string[] | ((cupo: CupoPlan, regaloAlta: number) => string[])
}

export function featuresDe(plan: Plan, cupo: CupoPlan, regaloAlta: number): string[] {
  return typeof plan.features === 'function' ? plan.features(cupo, regaloAlta) : plan.features
}

/** "1 crédito" / "2 créditos". */
export function creditos(n: number): string {
  return `${fmtBs(n)} ${n === 1 ? 'crédito' : 'créditos'}`
}

/**
 * Pagar el año por adelantado descuenta un 15 %. Mismo cálculo que el backend
 * (src/licencia/catalogo.ts): 12 meses × precio × 0,85, redondeado a Bs enteros.
 */
export const DESCUENTO_ANUAL = 0.15

export function precioAnual(precioMensual: number, descuento = DESCUENTO_ANUAL): number {
  return Math.round(precioMensual * 12 * (1 - descuento))
}

/**
 * Pagar 6 meses descuenta la MITAD del descuento anual (7,5 % con el 15 % de
 * hoy). Es la fórmula del backend (src/licencia/periodos-pago.ts): se redondea
 * el total, no la cuota, porque el total es lo que se cobra.
 */
export function precioSemestral(precioMensual: number, descuentoAnual = DESCUENTO_ANUAL): number {
  return Math.round(precioMensual * 6 * (1 - descuentoAnual / 2))
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

/** 0.075 → "7,5"; 0.15 → "15". */
export function fmtPct(fraccion: number): string {
  return (fraccion * 100).toLocaleString('es-BO', { maximumFractionDigits: 1 })
}

export const PLANES: Plan[] = [
  {
    codigo: 'EMPRENDEDOR',
    nombre: 'Emprendedor',
    objetivo: 'Empezar',
    descripcion:
      'El mismo sistema del Básico a precio de entrada: un cupo de ventas por día y créditos para los días de más movimiento.',
    precio: 75,
    etiqueta: 'Nuevo',
    notaPrevia: 'Todo lo de Básico, con un cupo diario',
    features: (c, regalo) => [
      `${fmtBs(c.ventasDia)} ventas por día incluidas`,
      `${fmtBs(c.citasDia)} citas por día en negocios con agenda`,
      `¿Un día vendés más? Seguís con créditos: 1 venta = ${creditos(c.creditosPorVenta)}, 1 cita = ${creditos(c.creditosPorCita)}`,
      // El regalo es un parámetro del panel y puede ser 0: entonces no se promete.
      regalo > 0 ? 'Los créditos no vencen y los primeros son de regalo' : 'Los créditos no vencen',
      'Punto de venta, caja, inventario, reportes y venta sin internet, igual que en Básico',
      'Paneles de Administrador y Cajero · hasta 4 usuarios',
      '1 sucursal incluida (adicionales, Bs 100/mes c/u)',
    ],
  },
  {
    codigo: 'BASICO',
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
    codigo: 'PRO',
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
 * Paquetes de créditos del Emprendedor (opción A del plan, oct-2026). Respaldo
 * de `GET /licencia/paquetes-creditos`; los valores reales los edita el panel.
 */
export const PAQUETES_CREDITOS: { creditos: number; precio: number }[] = [
  { creditos: 20, precio: 10 },
  { creditos: 50, precio: 20 },
  { creditos: 100, precio: 35 },
  { creditos: 300, precio: 90 },
]

/** Créditos que se regalan al dar de alta un Emprendedor. */
export const REGALO_ALTA = 10

/**
 * Hasta cuántas ventas por día conviene el Emprendedor frente al Básico.
 * Sale de §5 del plan: la diferencia de precio (hoy Bs 125) en el paquete más
 * barato por crédito alcanza para ~13 ventas extra por día (≈ 63, con meses
 * de 30 días). Se publica redondeado para abajo a múltiplos de 5 (hoy, 60)
 * porque es una recomendación, no un corte.
 *
 * Se calcula con los valores vigentes y no es un número fijo: los precios, el
 * cupo y los paquetes se cambian desde el panel (D12), y un "60" fijo quedaba
 * contradiciendo la tabla de al lado en cuanto cambiaba cualquiera de ellos.
 */
export function ventasDiaConvieneBasico(
  cupo: CupoPlan,
  precios: Record<CodigoPlan, number>,
  bsPorCredito: number[],
): number {
  const diferencia = precios.BASICO - precios.EMPRENDEDOR
  const masBarato = Math.min(...bsPorCredito.filter((x) => x > 0))
  if (!(diferencia > 0) || !Number.isFinite(masBarato)) return cupo.ventasDia
  const extrasPorDia = diferencia / (masBarato * cupo.creditosPorVenta) / 30
  return Math.max(cupo.ventasDia, Math.floor((cupo.ventasDia + extrasPorDia) / 5) * 5)
}

type Fila = [string, string, string, string]

/**
 * Filas de la tabla comparativa: [concepto, Emprendedor, Básico, Profesional]
 * (el orden de PLANES). Las de precio y cupo se arman con los valores vigentes
 * (API o fijos).
 */
export function comparativa(
  precios: Record<CodigoPlan, number>,
  descuento: number,
  cupo: CupoPlan,
): Fila[] {
  const p = PLANES.map((pl) => precios[pl.codigo] ?? pl.precio)
  const fila = (concepto: string, valor: (precio: number) => string): Fila => [
    concepto,
    valor(p[0]),
    valor(p[1]),
    valor(p[2]),
  ]
  // Espacio duro antes del "%": en el celular no queda solo en otra línea.
  const pct = (fraccion: number) => `${fmtPct(fraccion)}\u00a0%`
  return [
    fila('Precio mensual', (x) => `Bs ${fmtBs(x)}`),
    fila(`Pago por 6 meses (−${pct(descuento / 2)})`, (x) => `Bs ${fmtBs(precioSemestral(x, descuento))}`),
    fila(`Precio anual (−${pct(descuento)})`, (x) => `Bs ${fmtBs(precioAnual(x, descuento))}`),
    ['Ventas por día', `${fmtBs(cupo.ventasDia)} + créditos`, 'Ilimitadas', 'Ilimitadas'],
    ['Citas por día (negocios con agenda)', `${fmtBs(cupo.citasDia)} + créditos`, 'Ilimitadas', 'Ilimitadas'],
    ...COMPARATIVA_FIJA,
  ]
}

/** Filas que no dependen del precio. Emprendedor trae lo mismo que Básico. */
const COMPARATIVA_FIJA: Fila[] = [
  ['Objetivo', 'Empezar', 'Vender', 'Administrar'],
  ['Punto de venta (local y recoger)', 'Sí', 'Sí', 'Sí'],
  ['Delivery con app del repartidor', '—', '—', 'Sí'],
  ['Cobro: efectivo, QR, mixto y crédito', 'Sí', 'Sí', 'Sí'],
  ['Inventario: productos, insumos y movimientos', 'Sí', 'Sí', 'Sí'],
  ['Panel de mesero (mesas y comandas)', '—', '—', 'Sí'],
  ['Combos y platos compuestos', '—', '—', 'Sí'],
  ['Reportes de ventas, inventario, caja y gastos', 'Sí', 'Sí', 'Sí'],
  ['Reporte de meseros', '—', '—', 'Sí'],
  ['Recibo impreso y por WhatsApp', 'Sí', 'Sí', 'Sí'],
  ['Exportación de reportes (CSV)', '—', '—', 'Sí'],
  ['Sucursales incluidas', '1', '1', '2'],
  ['Usuarios incluidos', '4', '4', 'Ilimitados'],
]

export const NOTA_LEGAL =
  'Precios en bolivianos. Facturación mensual, por 6 meses con 7,5 % de descuento o anual por adelantado con 15 % de descuento. Incluye actualizaciones y respaldo en la nube. Instalación y capacitación se cotizan aparte. Emprendedor y Básico incluyen 1 sucursal y Profesional 2; adicionales, Bs 100/mes cada una. Emprendedor incluye 50 ventas y 50 citas por día; lo que pase de ahí se paga con créditos prepagos, que no vencen. Las ganancias mostradas son estimadas: se calculan sobre precio de venta y costo cargado en el sistema, sin incluir otros gastos del negocio (alquiler, sueldos, servicios).'
