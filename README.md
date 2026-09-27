# BamarDev — Landing comercial

Landing de venta de **bamardev.com**: software de gestión para
**restaurantes** (disponible), **farmacias** y **ferreterías** (en
desarrollo). React 19 + Vite + Tailwind 4, misma paleta de marca que el panel
de licencias (verde `#10b981`, logo robot, Plus Jakarta Sans).

## URLs

| Qué | URL |
|---|---|
| Producción | https://bamardev.com |
| Encuesta Plan Emprendedor | https://bamardev.com/encuesta |
| QA | https://qa.bamardev-landing.pages.dev (y `/encuesta`) |
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
- **Rubros** (activar farmacias/ferreterías cuando estén listos):
  [src/components/Rubros.tsx](src/components/Rubros.tsx) — cambiar
  `disponible: true` y ajustar los textos.
- **Secciones**: cada bloque de la página es un componente en
  [src/components/](src/components/) (Hero, Rubros, Funciones, Planes,
  Comparativa, Cierre/Footer).

## Infra

El detalle de dominios, DNS y Cloudflare está en el runbook `INFRA-BAMAR.md`
(fuera de este repo, junto a los demás proyectos de Bamar).
