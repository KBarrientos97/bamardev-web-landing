import type { ClaveEscena } from '../components/Escenas'

/*
  Catálogo único de los rubros de la landing (20-nov-2026). Lo usan la sección
  Rubros de la home (sólo los `enInicio`) y la página /rubros (todos). Antes la
  lista vivía escrita a mano en Rubros.tsx.

  Los rubros son los de PerfilRubro (GET /api/rubros) y sus variantes
  (`variantes-rubro.ts` del backend: una panadería es un Restaurante con otro
  nombre). Los puntos y las funciones sólo nombran lo que ese rubro recibe de
  verdad (FeatureVertical); lo que es de Profesional lo dice, y lo que el
  operador prende aparte va como extra.
*/

/** Las pestañas de la home: cómo trabaja el negocio. */
export type Modo = 'ventas' | 'agenda' | 'clases'

/** Los grupos de la página /rubros: qué vende el negocio. */
export type Grupo = 'comida' | 'tiendas' | 'agenda' | 'entretenimiento' | 'clases'

export const GRUPOS: { clave: Grupo; nombre: string; emoji: string }[] = [
  { clave: 'comida', nombre: 'Comida y bebida', emoji: '🍽️' },
  { clave: 'tiendas', nombre: 'Tiendas', emoji: '🛍️' },
  { clave: 'agenda', nombre: 'Belleza y agenda', emoji: '📅' },
  { clave: 'entretenimiento', nombre: 'Entretenimiento', emoji: '🎱' },
  { clave: 'clases', nombre: 'Educación', emoji: '🎓' },
]

/** Funciones con animación propia (ver `src/rubros/funciones.tsx`). */
export type ClaveFuncion =
  | 'venta'
  | 'comandas'
  | 'menutv'
  | 'toppings'
  | 'inventario'
  | 'lotes'
  | 'agenda'
  | 'tiempo'
  | 'clases'
  | 'delivery'
  | 'fiado'
  | 'reportes'
  | 'offline'
  | 'roles'

/** Lo demás que trae el rubro, sin animación: va en la lista de «Y además». */
export type ClaveExtra =
  | 'insumos'
  | 'plataformas'
  | 'pagina'
  | 'sucursales'
  | 'combos'
  | 'conteo'
  | 'kg'
  | 'qr'
  | 'tv'
  | 'controlados'
  | 'proveedores'
  | 'reservas'
  | 'comisiones'
  | 'paquetes'
  | 'ficha'
  | 'cola'
  | 'cabinas'
  | 'inscripciones'
  | 'cobranza'
  | 'notas'
  | 'planilla'

export interface RubroLanding {
  /** Para el enlace: /rubros#panaderia. */
  clave: string
  modo: Modo
  grupo: Grupo
  emoji: string
  nombre: string
  /** Una línea debajo del nombre en la página del rubro. */
  lema: string
  /** Los tres puntos de la tarjeta (home y cabecera de /rubros). */
  puntos: string[]
  /** Cómo se presenta el interesado en el WhatsApp de la demo. */
  quienEscribe: string
  /** Ilustración animada propia (Escenas.tsx). Sin ella, se muestra el emoji. */
  escena?: ClaveEscena
  /** Sale en la sección Rubros de la home (el resto, sólo en /rubros). */
  enInicio?: boolean
  /** Las funciones con animación, en el orden en que se muestran. */
  funciones: ClaveFuncion[]
  extras: ClaveExtra[]
}

/** Lo que tiene todo comercio de mostrador. */
const MOSTRADOR: ClaveFuncion[] = ['venta', 'inventario', 'fiado', 'reportes', 'offline', 'roles']

export const RUBROS: RubroLanding[] = [
  // ── Comida y bebida ─────────────────────────────────────────────────────────
  {
    clave: 'restaurante',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🍗',
    nombre: 'Restaurantes',
    lema: 'De la mesa a la cocina y a la caja, sin papelitos.',
    puntos: [
      'Comanda Mesa / Llevar y pedidos para recoger',
      'Insumos y recetas: sabés cuánto te cuesta cada plato',
      'Salón con meseros y delivery con app del repartidor (Profesional)',
    ],
    quienEscribe: 'tengo un restaurante',
    escena: 'pollo',
    enInicio: true,
    funciones: ['comandas', 'menutv', 'venta', 'inventario', 'delivery', 'reportes', 'offline', 'roles'],
    extras: ['insumos', 'plataformas', 'pagina', 'combos', 'sucursales'],
  },
  {
    clave: 'postres',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🍓',
    nombre: 'Postres y carritos',
    lema: 'Cada vaso con su tamaño y sus toppings, en cada carrito.',
    puntos: [
      'Vasos por tamaño y toppings que se suman solos al precio',
      'Varios carritos o locales, cada uno con su caja y su conteo del día',
      'Pedidos de Yango y PedidosYa, y tu página para que te pidan con toppings',
    ],
    quienEscribe: 'tengo un carrito o negocio de postres',
    escena: 'postres',
    enInicio: true,
    funciones: ['toppings', 'menutv', 'venta', 'delivery', 'reportes', 'offline', 'roles'],
    extras: ['conteo', 'plataformas', 'pagina', 'sucursales'],
  },
  {
    clave: 'panaderia',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🥐',
    nombre: 'Panaderías y pastelerías',
    lema: 'El pan del día, las tortas y lo que te cuesta hacerlos.',
    puntos: [
      'Venta rápida del mostrador, por unidad o por docena',
      'Insumos y recetas: harina, azúcar y huevos descontados al vender',
      'Tu página para que te pidan tortas, con delivery o para recoger',
    ],
    quienEscribe: 'tengo una panadería o pastelería',
    funciones: ['venta', 'menutv', 'inventario', 'delivery', 'reportes', 'fiado', 'offline'],
    extras: ['insumos', 'pagina', 'combos', 'sucursales'],
  },
  {
    clave: 'heladeria',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🍦',
    nombre: 'Heladerías',
    lema: 'Copas, conos y toppings, sin olvidar cobrar ninguno.',
    puntos: [
      'Conos y copas por tamaño, con sus toppings',
      'Stock de cada sabor y de los insumos',
      'Pedidos de Yango y PedidosYa con su reporte',
    ],
    quienEscribe: 'tengo una heladería',
    funciones: ['toppings', 'menutv', 'venta', 'inventario', 'reportes', 'offline', 'roles'],
    extras: ['insumos', 'plataformas', 'pagina', 'sucursales'],
  },
  {
    clave: 'jugueria',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🥤',
    nombre: 'Juguerías',
    lema: 'Jugos, licuados y ensaladas de fruta, con su costo real.',
    puntos: [
      'Vasos por tamaño y extras que se suman solos',
      'Recetas: la fruta se descuenta con cada jugo',
      'Pedidos de Yango y PedidosYa, y tu página',
    ],
    quienEscribe: 'tengo una juguería',
    funciones: ['toppings', 'menutv', 'venta', 'inventario', 'reportes', 'offline', 'roles'],
    extras: ['insumos', 'plataformas', 'pagina'],
  },
  {
    clave: 'cafeteria',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '☕',
    nombre: 'Cafeterías',
    lema: 'La barra, las mesas y la vitrina, en una sola caja.',
    puntos: [
      'Pedidos a la mesa o para llevar, con su comanda',
      'Recetas de cada bebida: café, leche y vasos descontados',
      'Combos de desayuno y tu página para pedir',
    ],
    quienEscribe: 'tengo una cafetería',
    funciones: ['comandas', 'menutv', 'venta', 'inventario', 'reportes', 'offline', 'roles'],
    extras: ['insumos', 'combos', 'pagina', 'plataformas'],
  },
  {
    clave: 'salteneria',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🥟',
    nombre: 'Salteñerías',
    lema: 'La mañana más rápida: salteñas, mesas y para llevar.',
    puntos: [
      'Venta rápida por docena o por unidad, a la mesa o para llevar',
      'Recetas: sabés cuánto te cuesta cada salteña',
      'Pedidos por WhatsApp, delivery y tu página',
    ],
    quienEscribe: 'tengo una salteñería',
    funciones: ['venta', 'menutv', 'comandas', 'inventario', 'delivery', 'reportes', 'offline'],
    extras: ['insumos', 'plataformas', 'pagina', 'sucursales'],
  },
  {
    clave: 'bares',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🍻',
    nombre: 'Bares, karaokes y discotecas',
    lema: 'Cada mesa con su cuenta y la barra con su stock.',
    puntos: [
      'La cuenta de cada mesa, abierta toda la noche',
      'Stock de botellas y cervezas al día',
      'Combos y promos de la noche, con el PIN del encargado para anular',
    ],
    quienEscribe: 'tengo un bar, karaoke o discoteca',
    funciones: ['comandas', 'menutv', 'venta', 'inventario', 'reportes', 'roles', 'offline'],
    extras: ['combos', 'qr', 'sucursales'],
  },

  // ── Tiendas ─────────────────────────────────────────────────────────────────
  {
    clave: 'minimarket',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🛒',
    nombre: 'Minimarkets y tiendas',
    lema: 'Cobrá rápido y sabé qué se está acabando.',
    puntos: [
      'Venta rápida con buscador y categorías',
      'Stock real con aviso de lo que se está acabando',
      'Fiado por cliente, con sus abonos y lo que te debe',
    ],
    quienEscribe: 'tengo un minimarket o tienda',
    escena: 'minimarket',
    enInicio: true,
    funciones: [...MOSTRADOR, 'delivery'],
    extras: ['kg', 'qr', 'pagina', 'combos', 'sucursales'],
  },
  {
    clave: 'libreria',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '📚',
    nombre: 'Librerías y papelerías',
    lema: 'Miles de útiles, encontrados en un segundo.',
    puntos: [
      'Buscador que encuentra cualquier útil por nombre',
      'Stock real para la temporada escolar',
      'Listas escolares como combos, con un solo precio (Profesional)',
    ],
    quienEscribe: 'tengo una librería o papelería',
    funciones: MOSTRADOR,
    extras: ['combos', 'qr', 'pagina', 'sucursales'],
  },
  {
    clave: 'bazar',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🧸',
    nombre: 'Bazares e importadoras',
    lema: 'Mucha mercadería, por mayor y por menor, bajo control.',
    puntos: [
      'Productos ordenados por categoría, con buscador',
      'Stock por depósito y por sucursal',
      'Fiado a tus clientes de confianza, con sus abonos',
    ],
    quienEscribe: 'tengo un bazar o importadora',
    funciones: MOSTRADOR,
    extras: ['sucursales', 'qr', 'pagina', 'combos'],
  },
  {
    clave: 'regalos',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🎁',
    nombre: 'Tiendas de regalos',
    lema: 'Lo que entra, lo que sale y lo que más se vende.',
    puntos: [
      'Venta rápida con recibo por WhatsApp',
      'Arreglos y packs armados como combos (Profesional)',
      'Tu página para vender por internet, con delivery',
    ],
    quienEscribe: 'tengo una tienda de regalos',
    funciones: [...MOSTRADOR, 'delivery'],
    extras: ['combos', 'pagina', 'qr'],
  },
  {
    clave: 'cosmeticos',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '💄',
    nombre: 'Cosméticos y perfumerías',
    lema: 'Cada tono y cada fragancia, con su stock.',
    puntos: [
      'Buscador por marca, tono o nombre',
      'Stock real y aviso de lo que se acaba',
      'Tu página con catálogo para pedir por WhatsApp',
    ],
    quienEscribe: 'tengo una tienda de cosméticos o perfumería',
    funciones: MOSTRADOR,
    extras: ['pagina', 'qr', 'combos', 'sucursales'],
  },
  {
    clave: 'floreria',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '💐',
    nombre: 'Florerías',
    lema: 'Ramos y arreglos, vendidos y entregados a tiempo.',
    puntos: [
      'Ramos y arreglos armados como combos (Profesional)',
      'Delivery con la ubicación del cliente',
      'Tu página para que te pidan para cada fecha',
    ],
    quienEscribe: 'tengo una florería',
    funciones: ['venta', 'delivery', 'inventario', 'reportes', 'offline', 'roles'],
    extras: ['combos', 'pagina', 'qr'],
  },
  {
    clave: 'licoreria',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🍷',
    nombre: 'Licorerías',
    lema: 'Cada botella contada y la caja cuadrada cada noche.',
    puntos: [
      'Venta rápida con buscador: cervezas, vinos y destilados por categoría',
      'Stock real de cada botella y cierre de caja con arqueo',
      'Delivery, tu página web y los pedidos de Yango o PedidosYa, cuando los quieras sumar',
    ],
    quienEscribe: 'tengo una licorería',
    escena: 'licoreria',
    enInicio: true,
    funciones: ['venta', 'inventario', 'reportes', 'delivery', 'offline', 'roles'],
    extras: ['plataformas', 'pagina', 'combos', 'sucursales'],
  },
  {
    clave: 'ferreteria',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🔩',
    nombre: 'Ferreterías y repuestos',
    lema: 'Miles de piezas, ordenadas y fáciles de encontrar.',
    puntos: [
      'Muchos productos, ordenados y fáciles de encontrar',
      'Encargos de lo que el cliente pidió y no había',
      'Stock y precio por sucursal',
    ],
    quienEscribe: 'tengo una ferretería o casa de repuestos',
    escena: 'ferreteria',
    enInicio: true,
    funciones: MOSTRADOR,
    extras: ['kg', 'sucursales', 'qr', 'pagina'],
  },
  {
    clave: 'materiales',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🧱',
    nombre: 'Materiales de construcción',
    lema: 'Cemento, fierro y agregados, por bolsa, kilo o metro.',
    puntos: [
      'Venta por unidad, kilo o metro',
      'Crédito a maestros y constructores, con sus abonos',
      'Stock por depósito y entrega a la obra',
    ],
    quienEscribe: 'tengo un negocio de materiales de construcción',
    funciones: ['venta', 'fiado', 'inventario', 'delivery', 'reportes', 'roles'],
    extras: ['kg', 'sucursales', 'qr'],
  },
  {
    clave: 'farmacia',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '💊',
    nombre: 'Farmacias',
    lema: 'Nada vencido se vende y cada controlado queda anotado.',
    puntos: [
      'Lotes y vencimientos: nada vencido se vende (Profesional)',
      'Venta con receta y libro de controlados',
      'Encargos, proveedores y catálogo importado desde Excel',
    ],
    quienEscribe: 'tengo una farmacia',
    escena: 'farmacia',
    enInicio: true,
    funciones: ['lotes', 'venta', 'inventario', 'reportes', 'offline', 'roles'],
    extras: ['controlados', 'proveedores', 'sucursales', 'qr'],
  },

  // ── Entretenimiento ─────────────────────────────────────────────────────────
  {
    clave: 'billar',
    modo: 'ventas',
    grupo: 'entretenimiento',
    emoji: '🎱',
    nombre: 'Billar y Restobar',
    lema: 'El tiempo de cada mesa y sus consumos, en una sola cuenta.',
    puntos: [
      'Mesas por tiempo: libre, por horas o por minutos, con pausa y extensión',
      'La cuenta de cada mesa suma los consumos del restobar y se cobra en la misma caja',
      'Tarifas por mesa, supervisión del turno y reporte del billar',
    ],
    quienEscribe: 'tengo un billar o restobar',
    escena: 'billar',
    enInicio: true,
    funciones: ['tiempo', 'venta', 'inventario', 'reportes', 'roles', 'offline'],
    extras: ['tv', 'qr', 'sucursales'],
  },

  // ── Belleza y agenda ────────────────────────────────────────────────────────
  {
    clave: 'peluqueria',
    modo: 'agenda',
    grupo: 'agenda',
    emoji: '✂️',
    nombre: 'Peluquerías',
    lema: 'La agenda de cada estilista y la ficha de cada cliente.',
    puntos: [
      'Agenda del día y de la semana por estilista',
      'Ficha del cliente con historial y alergias',
      'Ficha técnica con fotos de cada trabajo*',
    ],
    quienEscribe: 'tengo una peluquería',
    escena: 'peluqueria',
    enInicio: true,
    funciones: ['agenda', 'venta', 'reportes', 'roles'],
    extras: ['ficha', 'reservas', 'comisiones', 'paquetes'],
  },
  {
    clave: 'barberia',
    modo: 'agenda',
    grupo: 'agenda',
    emoji: '💈',
    nombre: 'Barberías',
    lema: 'Turnos y sin turno, cada uno con su barbero.',
    puntos: [
      'Cola para los que llegan sin turno',
      'Agenda por barbero, sin turnos repetidos',
      'Propinas y comisiones por barbero*',
    ],
    quienEscribe: 'tengo una barbería',
    escena: 'barberia',
    enInicio: true,
    funciones: ['agenda', 'venta', 'reportes', 'roles'],
    extras: ['cola', 'comisiones', 'reservas', 'paquetes'],
  },
  {
    clave: 'spa',
    modo: 'agenda',
    grupo: 'agenda',
    emoji: '🧖',
    nombre: 'Spa',
    lema: 'Cabinas, terapeutas y paquetes, sin choques de horario.',
    puntos: [
      'Cabinas y profesionales, cada uno con su agenda',
      'Paquetes de sesiones y gift cards*',
      'Reservas online desde tu enlace*',
    ],
    quienEscribe: 'tengo un spa',
    escena: 'spa',
    enInicio: true,
    funciones: ['agenda', 'venta', 'reportes', 'roles'],
    extras: ['cabinas', 'paquetes', 'reservas', 'comisiones'],
  },
  {
    clave: 'unas',
    modo: 'agenda',
    grupo: 'agenda',
    emoji: '💅',
    nombre: 'Uñas y estética',
    lema: 'Tu cliente elige la hora y la cita se cobra en la caja.',
    puntos: [
      'Tu cliente elige servicio, profesional y hora*',
      'La cita se cobra en la misma caja',
      'Comisiones por profesional, con adelantos*',
    ],
    quienEscribe: 'tengo un local de uñas o estética',
    escena: 'unas',
    enInicio: true,
    funciones: ['agenda', 'venta', 'reportes', 'roles'],
    extras: ['reservas', 'comisiones', 'paquetes', 'ficha'],
  },

  // ── Educación ───────────────────────────────────────────────────────────────
  {
    clave: 'academia',
    modo: 'clases',
    grupo: 'clases',
    emoji: '🎓',
    nombre: 'Academias e institutos',
    lema: 'Grupos, cuotas y asistencia, sin planillas.',
    puntos: [
      'Calendario de cursos y grupos, con inscripciones también online',
      'Cobranza de cuotas con QR por WhatsApp y estado de cuenta de cada estudiante',
      'Asistencia, notas y planilla de pago de tus docentes',
    ],
    quienEscribe: 'tengo una academia o instituto',
    escena: 'academia',
    enInicio: true,
    funciones: ['clases', 'venta', 'reportes', 'roles'],
    extras: ['inscripciones', 'cobranza', 'notas', 'planilla'],
  },
]

/** Los de la home, en el orden de siempre por pestaña. */
export const RUBROS_INICIO: Record<Modo, RubroLanding[]> = {
  ventas: RUBROS.filter((r) => r.enInicio && r.modo === 'ventas'),
  agenda: RUBROS.filter((r) => r.enInicio && r.modo === 'agenda'),
  clases: RUBROS.filter((r) => r.enInicio && r.modo === 'clases'),
}

export const rubroPorClave = (clave: string) => RUBROS.find((r) => r.clave === clave)
