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
  | 'tickets'
  | 'plataformas'
  | 'toppings'
  | 'inventario'
  | 'lotes'
  | 'encargos'
  | 'peso'
  | 'sucursales'
  | 'catalogoweb'
  | 'agenda'
  | 'agendabarberia'
  | 'agendaspa'
  | 'agendaunas'
  | 'reserva'
  | 'comisiones'
  | 'tiempo'
  | 'supervisionbillar'
  | 'reservasbillar'
  | 'pantallasalon'
  | 'clases'
  | 'inscripcion'
  | 'cuotas'
  | 'grupos'
  | 'asistencia'
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
  /** Un párrafo que cuenta cómo trabaja el sistema en este negocio (/rubros). */
  descripcion: string
  /**
   * Lo que se manda como rubro en el alta de /empezar: el código del rubro o
   * el de su variante (`variantes-rubro.ts` del backend).
   */
  alta: string
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

export const RUBROS: RubroLanding[] = [
  // ── Comida y bebida ─────────────────────────────────────────────────────────
  {
    clave: 'restaurante',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🍗',
    nombre: 'Restaurantes',
    lema: 'De la mesa a la cocina y a la caja, sin papelitos.',
    descripcion:
      'Tomás el pedido en la caja o en la mesa y la comanda llega a la cocina marcada Mesa o Llevar. Tu carta pasa en las teles del local con foto y precio, y al cerrar el día sabés qué plato dejó más ganancia, cuánto gastaste en insumos y cuánto rindió cada mesero.',
    alta: 'RESTAURANTE',
    puntos: [
      'Comanda Mesa / Llevar y pedidos para recoger',
      'Insumos y recetas: sabés cuánto te cuesta cada plato',
      'Salón con meseros y delivery con app del repartidor (Profesional)',
    ],
    quienEscribe: 'tengo un restaurante',
    escena: 'pollo',
    enInicio: true,
    funciones: ['comandas', 'menutv', 'tickets', 'plataformas', 'delivery', 'inventario', 'catalogoweb', 'reportes', 'offline', 'roles'],
    extras: ['insumos', 'plataformas', 'pagina', 'combos', 'sucursales'],
  },
  {
    clave: 'postres',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🍓',
    nombre: 'Postres y carritos',
    lema: 'Cada vaso con su tamaño y sus toppings, en cada carrito.',
    descripcion:
      'Cada vaso se vende por tamaño y los toppings se suman solos al precio. Si tenés varios carritos, cada uno abre y cierra su caja con el conteo de vasos del día, y vos ves todo junto desde el celular. Los pedidos de Yango y PedidosYa entran al mismo reporte.',
    alta: 'POSTRES',
    puntos: [
      'Vasos por tamaño y toppings que se suman solos al precio',
      'Varios carritos o locales, cada uno con su caja y su conteo del día',
      'Pedidos de Yango y PedidosYa, y tu página para que te pidan con toppings',
    ],
    quienEscribe: 'tengo un carrito o negocio de postres',
    escena: 'postres',
    enInicio: true,
    funciones: ['toppings', 'menutv', 'plataformas', 'sucursales', 'catalogoweb', 'delivery', 'reportes'],
    extras: ['conteo', 'plataformas', 'pagina', 'sucursales'],
  },
  {
    clave: 'panaderia',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🥐',
    nombre: 'Panaderías y pastelerías',
    lema: 'El pan del día, las tortas y lo que te cuesta hacerlos.',
    descripcion:
      'Vendé el pan del día en segundos, por unidad o por docena, y cargá las tortas y masitas con su receta: el sistema descuenta la harina, el azúcar y los huevos con cada venta y te dice cuánto te cuesta cada producto. Tu página recibe los pedidos de tortas con delivery o para recoger.',
    alta: 'PANADERIA',
    puntos: [
      'Venta rápida del mostrador, por unidad o por docena',
      'Insumos y recetas: harina, azúcar y huevos descontados al vender',
      'Tu página para que te pidan tortas, con delivery o para recoger',
    ],
    quienEscribe: 'tengo una panadería o pastelería',
    escena: 'panaderia',
    funciones: ['menutv', 'catalogoweb', 'inventario', 'delivery', 'fiado', 'sucursales', 'reportes', 'offline', 'roles'],
    extras: ['insumos', 'pagina', 'combos', 'sucursales'],
  },
  {
    clave: 'heladeria',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🍦',
    nombre: 'Heladerías',
    lema: 'Copas, conos y toppings, sin olvidar cobrar ninguno.',
    descripcion:
      'Conos, copas y vasitos por tamaño, con los toppings que se suman solos al precio. Ves el stock de cada sabor, tu carta pasa en la tele del local y los pedidos de las apps de delivery quedan registrados con su liquidación.',
    alta: 'HELADERIA',
    puntos: [
      'Conos y copas por tamaño, con sus toppings',
      'Stock de cada sabor y de los insumos',
      'Pedidos de Yango y PedidosYa con su reporte',
    ],
    quienEscribe: 'tengo una heladería',
    escena: 'heladeria',
    funciones: ['toppings', 'menutv', 'plataformas', 'inventario', 'catalogoweb', 'reportes'],
    extras: ['insumos', 'plataformas', 'pagina', 'sucursales'],
  },
  {
    clave: 'jugueria',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🥤',
    nombre: 'Juguerías',
    lema: 'Jugos, licuados y ensaladas de fruta, con su costo real.',
    descripcion:
      'Cada jugo con su tamaño y sus extras, y la fruta que se descuenta con su receta. Sabés cuánto te cuesta cada vaso, qué se vende más por la mañana y cuánto entra por las apps de delivery.',
    alta: 'JUGUERIA',
    puntos: [
      'Vasos por tamaño y extras que se suman solos',
      'Recetas: la fruta se descuenta con cada jugo',
      'Pedidos de Yango y PedidosYa, y tu página',
    ],
    quienEscribe: 'tengo una juguería',
    escena: 'jugueria',
    funciones: ['toppings', 'menutv', 'plataformas', 'inventario', 'reportes', 'offline'],
    extras: ['insumos', 'plataformas', 'pagina'],
  },
  {
    clave: 'cafeteria',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '☕',
    nombre: 'Cafeterías',
    lema: 'La barra, las mesas y la vitrina, en una sola caja.',
    descripcion:
      'La barra, las mesas y la vitrina en una sola caja. Cada bebida con su receta (café, leche, vasos), combos de desayuno con un solo precio y tu carta en la tele del local.',
    alta: 'CAFETERIA',
    puntos: [
      'Pedidos a la mesa o para llevar, con su comanda',
      'Recetas de cada bebida: café, leche y vasos descontados',
      'Combos de desayuno y tu página para pedir',
    ],
    quienEscribe: 'tengo una cafetería',
    escena: 'cafeteria',
    funciones: ['comandas', 'menutv', 'tickets', 'inventario', 'catalogoweb', 'reportes'],
    extras: ['insumos', 'combos', 'pagina', 'plataformas'],
  },
  {
    clave: 'salteneria',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🥟',
    nombre: 'Salteñerías',
    lema: 'La mañana más rápida: salteñas, mesas y para llevar.',
    descripcion:
      'La mañana más rápida: vendés por docena o por unidad, a la mesa o para llevar, y sabés cuánto te cuesta cada salteña con su receta. Los pedidos por WhatsApp y delivery entran a la misma caja.',
    alta: 'SALTENERIA',
    puntos: [
      'Venta rápida por docena o por unidad, a la mesa o para llevar',
      'Recetas: sabés cuánto te cuesta cada salteña',
      'Pedidos por WhatsApp, delivery y tu página',
    ],
    quienEscribe: 'tengo una salteñería',
    escena: 'salteneria',
    funciones: ['menutv', 'comandas', 'tickets', 'plataformas', 'delivery', 'inventario', 'reportes', 'offline', 'roles'],
    extras: ['insumos', 'plataformas', 'pagina', 'sucursales'],
  },
  {
    clave: 'bares',
    modo: 'ventas',
    grupo: 'comida',
    emoji: '🍻',
    nombre: 'Bares, karaokes y discotecas',
    lema: 'Cada mesa con su cuenta y la barra con su stock.',
    descripcion:
      'Cada mesa con su cuenta abierta toda la noche, la barra con su stock de botellas y cervezas, y combos o promos de la noche. Anular algo pide el PIN del encargado, y al cerrar sabés qué vendió cada uno.',
    alta: 'BAR',
    puntos: [
      'La cuenta de cada mesa, abierta toda la noche',
      'Stock de botellas y cervezas al día',
      'Combos y promos de la noche, con el PIN del encargado para anular',
    ],
    quienEscribe: 'tengo un bar, karaoke o discoteca',
    escena: 'bar',
    funciones: ['comandas', 'menutv', 'inventario', 'reportes', 'roles', 'offline'],
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
    descripcion:
      'Cobrás rápido con buscador, categorías o escáner, en efectivo, QR o mixto. El stock se mueve solo con cada venta y te avisa lo que se está acabando; el fiado de tus clientes queda con sus abonos y lo que te debe cada uno.',
    alta: 'MINIMARKET',
    puntos: [
      'Venta rápida con buscador y categorías',
      'Stock real con aviso de lo que se está acabando',
      'Fiado por cliente, con sus abonos y lo que te debe',
    ],
    quienEscribe: 'tengo un minimarket o tienda',
    escena: 'minimarket',
    enInicio: true,
    funciones: ['venta', 'inventario', 'fiado', 'catalogoweb', 'peso', 'sucursales', 'delivery', 'reportes', 'offline', 'roles'],
    extras: ['kg', 'qr', 'pagina', 'combos', 'sucursales'],
  },
  {
    clave: 'libreria',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '📚',
    nombre: 'Librerías y papelerías',
    lema: 'Miles de útiles, encontrados en un segundo.',
    descripcion:
      'Miles de útiles encontrados en un segundo por nombre. En temporada escolar ves qué se acaba antes de quedarte sin stock, y armás las listas escolares como combos con un solo precio.',
    alta: 'LIBRERIA',
    puntos: [
      'Buscador que encuentra cualquier útil por nombre',
      'Stock real para la temporada escolar',
      'Listas escolares como combos, con un solo precio (Profesional)',
    ],
    quienEscribe: 'tengo una librería o papelería',
    escena: 'libreria',
    funciones: ['venta', 'inventario', 'catalogoweb', 'fiado', 'sucursales', 'reportes'],
    extras: ['combos', 'qr', 'pagina', 'sucursales'],
  },
  {
    clave: 'bazar',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🧸',
    nombre: 'Bazares e importadoras',
    lema: 'Mucha mercadería, por mayor y por menor, bajo control.',
    descripcion:
      'Mucha mercadería, ordenada por categoría y por depósito. Vendés por mayor y por menor, fiás a tus clientes de confianza con sus abonos y movés mercadería entre sucursales con su registro.',
    alta: 'BAZAR',
    puntos: [
      'Productos ordenados por categoría, con buscador',
      'Stock por depósito y por sucursal',
      'Fiado a tus clientes de confianza, con sus abonos',
    ],
    quienEscribe: 'tengo un bazar o importadora',
    escena: 'bazar',
    funciones: ['venta', 'inventario', 'sucursales', 'fiado', 'catalogoweb', 'reportes'],
    extras: ['sucursales', 'qr', 'pagina', 'combos'],
  },
  {
    clave: 'regalos',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🎁',
    nombre: 'Tiendas de regalos',
    lema: 'Lo que entra, lo que sale y lo que más se vende.',
    descripcion:
      'Lo que entra, lo que sale y lo que más se vende, con recibo por WhatsApp. Armás packs y arreglos como combos y los vendés también desde tu página, con delivery.',
    alta: 'REGALOS',
    puntos: [
      'Venta rápida con recibo por WhatsApp',
      'Arreglos y packs armados como combos (Profesional)',
      'Tu página para vender por internet, con delivery',
    ],
    quienEscribe: 'tengo una tienda de regalos',
    escena: 'regalos',
    funciones: ['venta', 'catalogoweb', 'delivery', 'inventario', 'reportes', 'roles'],
    extras: ['combos', 'pagina', 'qr'],
  },
  {
    clave: 'cosmeticos',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '💄',
    nombre: 'Cosméticos y perfumerías',
    lema: 'Cada tono y cada fragancia, con su stock.',
    descripcion:
      'Cada tono y cada fragancia con su stock, encontrados por marca o por nombre. Tu página muestra el catálogo y los pedidos te llegan por WhatsApp.',
    alta: 'COSMETICOS',
    puntos: [
      'Buscador por marca, tono o nombre',
      'Stock real y aviso de lo que se acaba',
      'Tu página con catálogo para pedir por WhatsApp',
    ],
    quienEscribe: 'tengo una tienda de cosméticos o perfumería',
    escena: 'cosmeticos',
    funciones: ['venta', 'catalogoweb', 'inventario', 'sucursales', 'reportes', 'offline'],
    extras: ['pagina', 'qr', 'combos', 'sucursales'],
  },
  {
    clave: 'floreria',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '💐',
    nombre: 'Florerías',
    lema: 'Ramos y arreglos, vendidos y entregados a tiempo.',
    descripcion:
      'Ramos y arreglos armados como combos, vendidos en el local o desde tu página para cada fecha especial, y entregados con la ubicación exacta del cliente.',
    alta: 'FLORERIA',
    puntos: [
      'Ramos y arreglos armados como combos (Profesional)',
      'Delivery con la ubicación del cliente',
      'Tu página para que te pidan para cada fecha',
    ],
    quienEscribe: 'tengo una florería',
    escena: 'floreria',
    funciones: ['venta', 'catalogoweb', 'delivery', 'inventario', 'reportes', 'roles'],
    extras: ['combos', 'pagina', 'qr'],
  },
  {
    clave: 'licoreria',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🍷',
    nombre: 'Licorerías',
    lema: 'Cada botella contada y la caja cuadrada cada noche.',
    descripcion:
      'Cada botella contada y la caja cuadrada cada noche. Vendés rápido por categoría (cervezas, vinos, destilados) y, cuando quieras, sumás delivery, tu página y los pedidos de las apps.',
    alta: 'LICORERIA',
    puntos: [
      'Venta rápida con buscador: cervezas, vinos y destilados por categoría',
      'Stock real de cada botella y cierre de caja con arqueo',
      'Delivery, tu página web y los pedidos de Yango o PedidosYa, cuando los quieras sumar',
    ],
    quienEscribe: 'tengo una licorería',
    escena: 'licoreria',
    enInicio: true,
    funciones: ['venta', 'inventario', 'catalogoweb', 'delivery', 'plataformas', 'sucursales', 'reportes', 'offline', 'roles'],
    extras: ['plataformas', 'pagina', 'combos', 'sucursales'],
  },
  {
    clave: 'ferreteria',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🔩',
    nombre: 'Ferreterías y repuestos',
    lema: 'Miles de piezas, ordenadas y fáciles de encontrar.',
    descripcion:
      'Miles de piezas ordenadas y fáciles de encontrar, venta por unidad, kilo o metro, y lo que el cliente pidió y no había queda anotado como encargo. Stock y precio por sucursal.',
    alta: 'FERRETERIA',
    puntos: [
      'Muchos productos, ordenados y fáciles de encontrar',
      'Encargos de lo que el cliente pidió y no había',
      'Stock y precio por sucursal',
    ],
    quienEscribe: 'tengo una ferretería o casa de repuestos',
    escena: 'ferreteria',
    // Fuera de la home desde el 20-nov (dueño): con 6 tarjetas la grilla de
    // escritorio queda pareja (2 filas de 3). Sigue en /rubros.
    funciones: ['venta', 'peso', 'encargos', 'inventario', 'fiado', 'sucursales', 'catalogoweb', 'reportes', 'roles'],
    extras: ['kg', 'sucursales', 'qr', 'pagina'],
  },
  {
    clave: 'materiales',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '🧱',
    nombre: 'Materiales de construcción',
    lema: 'Cemento, fierro y agregados, por bolsa, kilo o metro.',
    descripcion:
      'Cemento, fierro y agregados por bolsa, kilo o metro. El crédito a maestros y constructores queda con sus abonos, y ves el stock de cada depósito y lo que sale a cada obra.',
    alta: 'MATERIALES',
    puntos: [
      'Venta por unidad, kilo o metro',
      'Crédito a maestros y constructores, con sus abonos',
      'Stock por depósito y entrega a la obra',
    ],
    quienEscribe: 'tengo un negocio de materiales de construcción',
    escena: 'materiales',
    funciones: ['venta', 'peso', 'fiado', 'inventario', 'delivery', 'sucursales'],
    extras: ['kg', 'sucursales', 'qr'],
  },
  {
    clave: 'farmacia',
    modo: 'ventas',
    grupo: 'tiendas',
    emoji: '💊',
    nombre: 'Farmacias',
    lema: 'Nada vencido se vende y cada controlado queda anotado.',
    descripcion:
      'Cada lote con su fecha: el sistema avisa lo que vence y no deja vender nada vencido. Venta con receta, libro de controlados, encargos y proveedores, con el catálogo importado desde Excel.',
    alta: 'FARMACIA',
    puntos: [
      'Lotes y vencimientos: nada vencido se vende (Profesional)',
      'Venta con receta y libro de controlados',
      'Encargos, proveedores y catálogo importado desde Excel',
    ],
    quienEscribe: 'tengo una farmacia',
    escena: 'farmacia',
    enInicio: true,
    funciones: ['lotes', 'venta', 'encargos', 'inventario', 'sucursales', 'delivery', 'catalogoweb', 'reportes', 'offline', 'roles'],
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
    descripcion:
      'Cada mesa por tiempo libre o fijo, con pausa y extensión, y los consumos del restobar en la misma cuenta. La pantalla del salón muestra el tiempo de cada mesa y al cerrar el turno sabés cuánto rindió cada una.',
    alta: 'BILLAR',
    puntos: [
      'Mesas por tiempo: libre, por horas o por minutos, con pausa y extensión',
      'La cuenta de cada mesa suma los consumos del restobar y se cobra en la misma caja',
      'Tarifas por mesa, supervisión del turno y reporte del billar',
    ],
    quienEscribe: 'tengo un billar o restobar',
    escena: 'billar',
    enInicio: true,
    funciones: ['tiempo', 'supervisionbillar', 'reservasbillar', 'pantallasalon', 'inventario', 'reportes', 'sucursales', 'roles', 'offline'],
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
    descripcion:
      'La agenda del día y de la semana por estilista, sin turnos repetidos. La ficha de cada clienta guarda su historial, sus alergias y las fotos de cada trabajo, y la cita se cobra en la misma caja.',
    alta: 'PELUQUERIA',
    puntos: [
      'Agenda del día y de la semana por estilista',
      'Ficha del cliente con historial y alergias',
      'Ficha técnica con fotos de cada trabajo*',
    ],
    quienEscribe: 'tengo una peluquería',
    escena: 'peluqueria',
    enInicio: true,
    funciones: ['agenda', 'reserva', 'comisiones', 'fiado', 'reportes', 'roles'],
    extras: ['ficha', 'reservas', 'comisiones', 'paquetes'],
  },
  {
    clave: 'barberia',
    modo: 'agenda',
    grupo: 'agenda',
    emoji: '💈',
    nombre: 'Barberías',
    lema: 'Turnos y sin turno, cada uno con su barbero.',
    descripcion:
      'Turnos por barbero y una cola para los que llegan sin turno, en la misma pantalla. Las propinas y comisiones de cada barbero se calculan solas al cobrar.',
    alta: 'BARBERIA',
    puntos: [
      'Cola para los que llegan sin turno',
      'Agenda por barbero, sin turnos repetidos',
      'Propinas y comisiones por barbero*',
    ],
    quienEscribe: 'tengo una barbería',
    escena: 'barberia',
    enInicio: true,
    funciones: ['agendabarberia', 'reserva', 'comisiones', 'reportes', 'roles', 'offline'],
    extras: ['cola', 'comisiones', 'reservas', 'paquetes'],
  },
  {
    clave: 'spa',
    modo: 'agenda',
    grupo: 'agenda',
    emoji: '🧖',
    nombre: 'Spa',
    lema: 'Cabinas, terapeutas y paquetes, sin choques de horario.',
    descripcion:
      'Cada masaje ocupa la cabina y la terapeuta a la vez, sin choques de horario. Vendés paquetes de sesiones y gift cards, y tus clientas reservan online desde tu enlace.',
    alta: 'SPA',
    puntos: [
      'Cabinas y profesionales, cada uno con su agenda',
      'Paquetes de sesiones y gift cards*',
      'Reservas online desde tu enlace*',
    ],
    quienEscribe: 'tengo un spa',
    escena: 'spa',
    enInicio: true,
    funciones: ['agendaspa', 'reserva', 'comisiones', 'reportes', 'roles', 'offline'],
    extras: ['cabinas', 'paquetes', 'reservas', 'comisiones'],
  },
  {
    clave: 'unas',
    modo: 'agenda',
    grupo: 'agenda',
    emoji: '💅',
    nombre: 'Uñas y estética',
    lema: 'Tu cliente elige la hora y la cita se cobra en la caja.',
    descripcion:
      'Tu clienta elige el servicio, la profesional y la hora desde su celular; la cita cae en tu agenda y se cobra en la misma caja. Las comisiones de cada profesional, con sus adelantos, al día.',
    alta: 'UNAS',
    puntos: [
      'Tu cliente elige servicio, profesional y hora*',
      'La cita se cobra en la misma caja',
      'Comisiones por profesional, con adelantos*',
    ],
    quienEscribe: 'tengo un local de uñas o estética',
    escena: 'unas',
    enInicio: true,
    funciones: ['agendaunas', 'reserva', 'comisiones', 'reportes', 'roles', 'offline'],
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
    descripcion:
      'Abrís grupos en el calendario de cada sede, los alumnos se inscriben también desde tu página y las cuotas se cobran con QR por WhatsApp. La asistencia, las notas y la planilla de tus docentes, sin hojas de cálculo.',
    alta: 'ACADEMIA',
    puntos: [
      'Calendario de cursos y grupos, con inscripciones también online',
      'Cobranza de cuotas con QR por WhatsApp y estado de cuenta de cada estudiante',
      'Asistencia, notas y planilla de pago de tus docentes',
    ],
    quienEscribe: 'tengo una academia o instituto',
    escena: 'academia',
    enInicio: true,
    funciones: ['inscripcion', 'cuotas', 'grupos', 'asistencia', 'reportes', 'roles'],
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
