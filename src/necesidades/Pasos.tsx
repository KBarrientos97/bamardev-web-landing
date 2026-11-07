import type { ReactNode } from 'react'
import { CampoPregunta } from './Campos'
import { ModuloCard } from './ModuloCard'
import {
  estadoCategoria,
  estadoGeneral,
  type Catalogo,
  type Categoria,
  type Cuestionario,
  type ModuloResp,
  type Respuestas,
} from './tipos'
import { Aviso, Boton, Icono, Marca } from './ui'

/** Título de cada paso: el foco cae acá al cambiar de paso (lectores de pantalla). */
export function TituloPaso({
  children,
  detalle,
  refTitulo,
}: {
  children: ReactNode
  detalle?: ReactNode
  refTitulo: React.RefObject<HTMLHeadingElement | null>
}) {
  return (
    <div>
      <h1
        ref={refTitulo}
        tabIndex={-1}
        className="text-2xl font-extrabold leading-tight text-slate-900 outline-none sm:text-[28px]"
      >
        {children}
      </h1>
      {detalle && <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{detalle}</p>}
    </div>
  )
}

// ── Bienvenida ───────────────────────────────────────────────────────────────

export function PasoInicio({
  datos,
  hayAvance,
  onComenzar,
  refTitulo,
}: {
  datos: Cuestionario
  hayAvance: boolean
  onComenzar: () => void
  refTitulo: React.RefObject<HTMLHeadingElement | null>
}) {
  const { catalogo } = datos
  const enviado = !datos.editable && !!datos.enviadoEn
  return (
    <div className="space-y-6">
      <div className="flex justify-center py-2 lg:hidden">
        <Marca />
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-700">
          Levantamiento de requerimientos tecnológicos
        </p>
        <h1
          ref={refTitulo}
          tabIndex={-1}
          className="mt-1 text-3xl font-extrabold leading-tight text-slate-900 outline-none sm:text-4xl"
        >
          {datos.nombre}
        </h1>
        <p className="mt-1 text-base font-semibold text-slate-500">Cuestionario de necesidades</p>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
          {datos.contacto ? `${datos.contacto}: ` : ''}ayúdenos a identificar qué procesos y herramientas
          necesita la clínica, para diseñar una solución acorde a su operación y a su crecimiento.
        </p>
        <p className="mt-2 text-sm text-slate-500">Preparado y administrado por BamarDev Technology.</p>
      </div>

      {enviado && (
        <Aviso tono="ok">
          <p className="font-semibold">Este cuestionario ya fue enviado. ¡Gracias!</p>
          <p className="mt-0.5">
            Puede revisar sus respuestas cuando quiera. Si necesita cambiar algo, avise a BamarDev y se lo
            reabrirán.
          </p>
        </Aviso>
      )}

      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="text-lg font-extrabold text-slate-900">Cómo responder</h2>
        <ol className="mt-3 space-y-3 text-[15px] leading-snug text-slate-700">
          <Paso n={1}>
            Recorra las secciones en el orden que prefiera: primero la <strong>información general</strong> y
            luego <strong>{catalogo.categorias.length} secciones</strong> de módulos ({catalogo.categorias[0]?.id} a{' '}
            {catalogo.categorias[catalogo.categorias.length - 1]?.id}).
          </Paso>
          <Paso n={2}>
            En cada módulo, <strong>toque una opción</strong>:{' '}
            <em>Lo necesitamos</em>, <em>No lo necesitamos</em>, <em>Más adelante</em> o{' '}
            <em>Quiero conversarlo</em>. Eso es todo lo que hace falta para dejarlo respondido.
          </Paso>
          <Paso n={3}>
            Si quiere dar más detalle, abra <strong>«Ver detalle»</strong> y marque qué funciones necesita. No
            tiene que saberlo todo: ante la duda, elija «Quiero conversarlo» y lo resolvemos juntos.
          </Paso>
          <Paso n={4}>
            <strong>Todo se guarda solo.</strong> Puede cerrar la página y volver con este mismo enlace cuando
            quiera, desde el celular o la computadora.
          </Paso>
          <Paso n={5}>
            Al terminar, entre a <strong>«Revisar y enviar»</strong> y envíe el cuestionario a BamarDev.
          </Paso>
        </ol>
      </section>

      <Aviso tono="alerta">
        <p className="font-semibold">No escriba datos de pacientes</p>
        <p className="mt-0.5">
          Este cuestionario solo recoge cómo trabaja la clínica y qué necesita. No escriba nombres,
          documentos, teléfonos ni información médica de pacientes.
        </p>
      </Aviso>

      <div className="flex flex-wrap items-center gap-3">
        <Boton onClick={onComenzar} className="px-8">
          {hayAvance ? 'Continuar donde quedé' : 'Comenzar'}
          <Icono n="derecha" className="h-4 w-4" />
        </Boton>
        <p className="text-sm text-slate-500">Tómese el tiempo que necesite; puede completarlo en varios días.</p>
      </div>
    </div>
  )
}

function Paso({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-800">
        {n}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  )
}

// ── Información general ──────────────────────────────────────────────────────

export function PasoGeneral({
  catalogo,
  resp,
  editable,
  onCambio,
  barra,
  refTitulo,
}: {
  catalogo: Catalogo
  resp: Respuestas
  editable: boolean
  onCambio: (id: string, valor: string) => void
  barra: ReactNode
  refTitulo: React.RefObject<HTMLHeadingElement | null>
}) {
  const e = estadoGeneral(catalogo, resp)
  return (
    <div className="space-y-6">
      <TituloPaso
        refTitulo={refTitulo}
        detalle="Algunos datos generales de la clínica nos ayudan a dimensionar el proyecto. Todo es opcional y un número aproximado es suficiente."
      >
        Información general de la clínica
      </TituloPaso>
      <p className="text-sm font-semibold text-slate-500">
        {e.respondidos} de {e.total} preguntas contestadas
      </p>

      {catalogo.general.map((g) => (
        <section key={g.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
          <h2 className="text-lg font-extrabold text-slate-900">{g.titulo}</h2>
          {g.descripcion && <p className="mt-1 text-[14px] text-slate-600">{g.descripcion}</p>}
          <div className="mt-4 space-y-5">
            {g.preguntas.map((p) => (
              <CampoPregunta
                key={p.id}
                pregunta={p}
                valor={resp.general?.[p.id] ?? ''}
                siNo={catalogo.opcionesSiNo}
                deshabilitado={!editable}
                onCambio={(t) => onCambio(p.id, t)}
                marcador={p.tipo === 'largo' ? 'Escriba su respuesta' : undefined}
              />
            ))}
          </div>
        </section>
      ))}
      {barra}
    </div>
  )
}

// ── Una sección de módulos ───────────────────────────────────────────────────

export function PasoCategoria({
  categoria,
  catalogo,
  resp,
  editable,
  onCambioModulo,
  barra,
  refTitulo,
}: {
  categoria: Categoria
  catalogo: Catalogo
  resp: Respuestas
  editable: boolean
  onCambioModulo: (id: string, cambio: (m: ModuloResp) => ModuloResp) => void
  barra: ReactNode
  refTitulo: React.RefObject<HTMLHeadingElement | null>
}) {
  const e = estadoCategoria(categoria, resp)
  return (
    <div className="space-y-5">
      <TituloPaso refTitulo={refTitulo} detalle={categoria.descripcion}>
        <span className="mr-2 inline-block rounded-lg bg-brand-700 px-2.5 py-0.5 align-middle text-xl text-white">
          {categoria.id}
        </span>
        {categoria.titulo}
      </TituloPaso>
      <p className="text-sm font-semibold text-slate-500">
        {e.respondidos} de {e.total} {e.total === 1 ? 'módulo respondido' : 'módulos respondidos'}
      </p>

      <div className="space-y-4">
        {categoria.modulos.map((m) => (
          <ModuloCard
            key={m.id}
            modulo={m}
            catalogo={catalogo}
            valor={resp.modulos?.[m.id]}
            editable={editable}
            onCambio={(fn) => onCambioModulo(m.id, fn)}
          />
        ))}
      </div>
      {barra}
    </div>
  )
}

/** Anterior / Siguiente al pie de cada paso. */
export function BarraPaso({
  onAnterior,
  onSiguiente,
  textoSiguiente,
  revisada,
}: {
  onAnterior: () => void
  onSiguiente: () => void
  textoSiguiente: string
  revisada?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 print:hidden">
      <Boton variante="secundario" onClick={onAnterior}>
        <Icono n="izquierda" className="h-4 w-4" />
        Anterior
      </Boton>
      <div className="flex items-center gap-3">
        {revisada && (
          <span className="hidden items-center gap-1 text-sm font-semibold text-brand-700 sm:inline-flex">
            <Icono n="check" className="h-4 w-4" />
            Sección revisada
          </span>
        )}
        <Boton onClick={onSiguiente}>
          {textoSiguiente}
          <Icono n="derecha" className="h-4 w-4" />
        </Boton>
      </div>
    </div>
  )
}
