# BamarDev — Landing comercial

Landing de venta de **bamardev.com**: software de gestión para
**restaurantes** (disponible), **farmacias** y **ferreterías** (en
desarrollo). React 19 + Vite + Tailwind 4, misma paleta de marca que el panel
de licencias (verde `#10b981`, logo robot, Plus Jakarta Sans).

## URLs

| Qué | URL |
|---|---|
| Producción | https://bamardev.com |
| Alias Pages | https://bamardev-landing.pages.dev |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
```

## Despliegue

**Automático**: cada push a `main` construye y despliega vía GitHub Actions
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)). Requiere el
secret `CLOUDFLARE_API_TOKEN` (token con permiso *Cloudflare Pages: Edit*
sobre la cuenta de Kevin). El proyecto de Pages se llama `bamardev-landing`
y el account id lo lee wrangler del [.env](.env) (no es secreto).

**Manual de emergencia** (requiere `npx wrangler login` una vez):

```bash
npm run deploy
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
