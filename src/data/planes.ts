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

  Lo que se promete por plan sale de la PLANTILLA del backend
  (GET /api/licencia/planes → `modulos`, tablas Plan y PlanFeature): cada
  viñeta y cada fila de la comparativa nombra en un comentario el código de
  feature que la respalda. Una feature que no está en la plantilla (agenda,
  página pública, promociones, cupones, "el mesero cobra", aprobación de
  movimientos…) o que está inactiva en el catálogo (panel de cocina,
  descuentos, QR automatizado) no se promete en ningún plan. El Emprendedor
  tiene la misma plantilla que el Básico: sólo lo distingue el cupo diario.

  `lotes` y `encargos` están en la plantilla pero son de farmacia y comercio:
  el alta de un restaurante no los recibe (FeatureVertical), así que esta
  sección, que es de restaurantes, no los muestra.
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

/**
 * Lo que cuesta cada sucursal más allá de las incluidas. No lo publica la API
 * (no hay campo en el Plan): es el valor comercial del PDF y vive sólo acá.
 */
export const PRECIO_SUCURSAL_ADICIONAL = 100

const SUCURSAL_ADICIONAL = `adicionales, Bs ${fmtBs(PRECIO_SUCURSAL_ADICIONAL)}/mes c/u`

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
    // Misma plantilla que el Básico (migración plan_emprendedor, D14): las
    // viñetas de features son las del Básico resumidas; lo propio es el cupo.
    features: (c, regalo) => [
      // limiteVentasDia · limiteCitasDia
      `${fmtBs(c.ventasDia)} ventas por día incluidas`,
      `${fmtBs(c.citasDia)} citas por día en negocios con agenda`,
      // creditosPorVenta · creditosPorCita
      `¿Un día vendés más? Seguís con créditos: 1 venta = ${creditos(c.creditosPorVenta)}, 1 cita = ${creditos(c.creditosPorCita)}`,
      // El regalo es un parámetro del panel y puede ser 0: entonces no se promete.
      regalo > 0
        ? `Los créditos no vencen y los primeros ${fmtBs(regalo)} son de regalo`
        : 'Los créditos no vencen',
      // pos · mesa_llevar · recoger · pago_qr_mixto · fiado · caja · inventario · gastos · reportes* · offline
      'Punto de venta, cobro con QR y fiado, caja, inventario, gastos, reportes y venta sin internet, igual que en Básico',
      // usuarios · usuariosIncluidos = 4
      'Usuarios con roles (administrador, supervisor, cajero) · hasta 4',
      // sucursalesIncluidas = 1
      `1 sucursal incluida (${SUCURSAL_ADICIONAL})`,
    ],
  },
  {
    codigo: 'BASICO',
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
      `1 sucursal incluida (${SUCURSAL_ADICIONAL})`,
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
      `2 sucursales incluidas (${SUCURSAL_ADICIONAL})`,
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

/**
 * Filas que no dependen del precio. Completa a propósito: una fila por cada
 * feature de la plantilla que aplica a un restaurante (el código, al lado).
 * Emprendedor tiene la misma plantilla que Básico: su columna es la misma en
 * todas las filas; lo que los separa son las de cupo de comparativa().
 */
const COMPARATIVA_FIJA: Fila[] = [
  ['Objetivo', 'Empezar', 'Vender', 'Administrar'],
  ['Punto de venta con comanda Mesa / Llevar', 'Sí', 'Sí', 'Sí'], // pos · mesa_llevar
  ['Pedidos para recoger', 'Sí', 'Sí', 'Sí'], // recoger
  ['Cobro en efectivo, QR y mixto', 'Sí', 'Sí', 'Sí'], // pago_qr_mixto
  ['Fiado: ventas a crédito y abonos', 'Sí', 'Sí', 'Sí'], // fiado
  ['Caja: apertura, cierre con arqueo, ingresos y egresos', 'Sí', 'Sí', 'Sí'], // caja · movimientos_caja
  ['Anulaciones con PIN del encargado', 'Sí', 'Sí', 'Sí'], // autorizacion_pin
  ['Inventario: productos, insumos y movimientos', 'Sí', 'Sí', 'Sí'], // catalogo · inventario · insumos
  ['Gastos del negocio (alquiler, sueldos, servicios)', 'Sí', 'Sí', 'Sí'], // gastos
  ['Reportes de ventas y caja', 'Sí', 'Sí', 'Sí'], // reportes
  ['Reportes por producto, categoría, horario y forma de pago', 'Sí', 'Sí', 'Sí'], // reportes_operacion
  ['Reportes de rentabilidad: ganancia, compras e insumos', 'Sí', 'Sí', 'Sí'], // reportes_rentabilidad
  ['Recibo impreso y en PDF por WhatsApp', 'Sí', 'Sí', 'Sí'], // recibo_pdf
  ['Funciona sin internet', 'Sí', 'Sí', 'Sí'], // offline
  ['Delivery con app del repartidor', '—', '—', 'Sí'], // delivery
  ['Salón con meseros (mesas, comandas y reporte por mesero)', '—', '—', 'Sí'], // salon
  ['Combos y platos compuestos', '—', '—', 'Sí'], // combos
  ['Varios almacenes', '—', '—', 'Sí'], // multi_almacen
  ['Exportación de reportes (CSV)', '—', '—', 'Sí'], // exportacion
  ['Sucursales incluidas', '1', '1', '2'],
  ['Usuarios incluidos', '4', '4', 'Ilimitados'],
]

/**
 * Nota al pie de precios. Se arma con los valores vigentes (API o fijos): un
 * "15 %" o un "50 ventas" escrito a mano quedaba contradiciendo las tarjetas
 * en cuanto se cambiaba el descuento o el cupo desde el panel.
 */
export function notaLegal(descuento: number, cupo: CupoPlan): string {
  return (
    `Precios en bolivianos. Facturación mensual, por 6 meses con ${fmtPct(descuento / 2)} % de descuento ` +
    `o anual por adelantado con ${fmtPct(descuento)} % de descuento. Incluye actualizaciones y respaldo ` +
    'en la nube. Instalación y capacitación se cotizan aparte. Emprendedor y Básico incluyen 1 sucursal ' +
    `y Profesional 2; adicionales, Bs ${fmtBs(PRECIO_SUCURSAL_ADICIONAL)}/mes cada una. Emprendedor incluye ` +
    `${fmtBs(cupo.ventasDia)} ventas y ${fmtBs(cupo.citasDia)} citas por día; lo que pase de ahí se paga ` +
    'con créditos prepagos, que no vencen. Las ganancias mostradas son estimadas: se calculan sobre ' +
    'precio de venta y costo cargado en el sistema, sin incluir otros gastos del negocio (alquiler, ' +
    'sueldos, servicios).'
  )
}
