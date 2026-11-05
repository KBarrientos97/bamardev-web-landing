# BamarDev — Landing comercial

Landing de venta de **bamardev.com**: software de gestión para
**restaurantes, farmacias, minimarkets, ferreterías y repuestos** (disponibles)
y **salones, barberías, spa y uñas** (en desarrollo). React 19 + Vite + Tailwind 4, misma paleta de marca que el panel
de licencias (verde `#10b981`, logo robot, Plus Jakarta Sans).

## URLs

| Qué | URL |
|---|---|
| Producción | https://bamardev.com |
| Encuesta Plan Emprendedor | https://bamardev.com/encuesta |
| Cuestionario de necesidades | https://bamardev.com/necesidades?k=<clave> (el link lo arma el panel) |
| QA | https://qa.bamardev-landing.pages.dev (y `/encuesta`, `/necesidades`) |
| Alias Pages | https://bamardev-landing.pages.dev |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173  (la encuesta en /encuesta)
```

La encuesta llama al backend. En desarrollo pega a `/api` y el proxy de Vite
lo reenvía a QA; con `API_PROXY=http://localhost:3000` en un `.env.local` va al
backend de esta máquina. Los builds usan `VITE_API_URL` de `.env.production`
(`npm run build`) o `.env.qa` (`npm run build:qa`).

## Encuesta del Plan Emprendedor

Página aparte (`encuesta.html` → `/encuesta`) y no una sección de la landing:
WhatsApp y Facebook arman la vista previa del link leyendo el HTML sin
ejecutar JavaScript, así que necesita su propio título e imagen.

- Preguntas y códigos: [src/encuesta/preguntas.ts](src/encuesta/preguntas.ts).
  Los códigos tienen que coincidir con `bamardev-backend/src/encuesta/encuesta.catalogo.ts`.
- Las respuestas se guardan en el backend (`POST /encuestas/plan-emprendedor`,
  público) y se leen en el panel de licencias → **Encuesta**.
- `?origen=facebook` (o `whatsapp`, `visita`…) en el link marca por dónde llegó
  cada respuesta.

## Cuestionario de necesidades (levantamiento de requerimientos)

Página aparte (`necesidades.html` → `/necesidades`), sin usuario ni contraseña,
para que un cliente (hoy, la Clínica Poli Central) marque qué módulos necesita
y BamarDev pueda cotizar. No se enlaza desde la landing y no se indexa.

- **El link lleva una clave larga**: `/necesidades?k=<clave>`. La clave abre UN
  cuestionario; sin ella la página avisa que falta. Se crea, copia, renueva o
  revoca en el panel de licencias → **Levantamientos**.
- **El cuestionario no está en esta página**: lo manda el backend
  (`bamardev-backend/src/levantamiento/levantamiento.catalogo.ts`) junto con lo
  ya respondido. Agregar o cambiar una pregunta es tocar ese archivo, no esta
  landing.
- **Se guarda solo** (`PATCH /levantamientos/publico/:token`, cada vez que se deja
  de escribir) y se puede seguir en otro momento con el mismo link. Si se corta
  internet, lo pendiente queda en el navegador (`localStorage`) y se reenvía solo
  al volver la conexión ([useAutoguardado.ts](src/necesidades/useAutoguardado.ts)).
- Al enviar (`POST …/enviar`) queda de sólo lectura hasta que BamarDev lo
  reabra desde el panel.
- No hay ningún campo para datos de pacientes, y la página lo advierte.

## Despliegue

**Automático** vía GitHub Actions
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)): push a `dev`
despliega QA (`qa.bamardev-landing.pages.dev`, contra `api-qa`), push a `main`
despliega producción (`bamardev.com`).

> El backend sólo acepta los dominios de `CORS_ORIGINS`. El de QA
> (`https://qa.bamardev-landing.pages.dev`) hay que agregarlo en el `.env` del
> VPS de QA, o la encuesta de QA no va a poder enviar.

Requiere el
secret `CLOUDFLARE_API_TOKEN` (token con permiso *Cloudflare Pages: Edit*
sobre la cuenta de Kevin). El proyecto de Pages se llama `bamardev-landing`
y el account id lo lee wrangler del [.env](.env) (no es secreto).

**Manual de emergencia** (requiere `npx wrangler login` una vez):

```bash
npm run deploy      # producción
npm run deploy:qa   # QA
```

## Dónde tocar el contenido

- **Planes y precios**: [src/data/planes.ts](src/data/planes.ts) — transcritos
  del PDF oficial "BamarDev - Planes Restaurante (v7)". Si cambian precios o
  features, actualizar el PDF y este archivo a la vez. Ahí también viven el
  número de WhatsApp y la letra chica legal.
- **Rubros**: [src/components/Rubros.tsx](src/components/Rubros.tsx) — el
  `disponible` de cada tarjeta sigue al estado del rubro en el backend
  (`GET /api/rubros`, DISPONIBLE / EN_DESARROLLO). Cuando un rubro cambia de
  estado, cambiarlo ahí, en el hero, en el `<title>`/descripción de
  `index.html` y en las opciones del formulario (`Contacto.tsx`, que deben
  existir en el DTO de leads del backend).
- **Términos y privacidad** — **OCULTOS hasta completar los textos (D1)**: el
  build no publica `terminos.html` ni `privacidad.html` (comentados en
  `vite.config.ts`), los links del pie están comentados en `Cierre.tsx` y
  `public/_redirects` manda `/terminos` y `/privacidad` al inicio con un 302.
  Para volver a publicarlos se deshacen esas tres cosas. El texto vive en [src/legal/](src/legal/) como copia de
  `bamar/legal/` (la fuente, fuera de los repos). Al cambiar la versión se
  copia el `.md` de nuevo; mientras tenga `[MARCADORES]` sin completar va con
  el aviso "Versión preliminar" (`preliminar` en `src/legal/terminos.tsx` y
  `privacidad.tsx`) y `noindex` en su HTML.
- **Secciones**: cada bloque de la página es un componente en
  [src/components/](src/components/) (Hero, Rubros, Funciones, Planes,
  Comparativa, Cierre/Footer).

## Infra

El detalle de dominios, DNS y Cloudflare está en el runbook `INFRA-BAMAR.md`
(fuera de este repo, junto a los demás proyectos de Bamar).
