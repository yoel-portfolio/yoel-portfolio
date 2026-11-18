# Verificación de la ampliación (`proyecto/`)

## 1. Herramientas comprobadas en el entorno
- **Disponibles**: terminal (`Node.js v24.22.2`, `npm 11.21.2`, `git 2.39.5`, `gh 2.103.3`), repositorio Git clonado (`yoel-portfolio/yoel-portfolio` en rama `codex/portafolio-base`, `HEAD` `b7f3183`), compilación Vite/TypeScript, navegador headless Chromium (`/usr/bin/chromium`), Playwright + `@axe-core/playwright` y entregables (`entregables/portafolio.txt`, `entregables/promo.png`).
- **No disponibles**: archivos CV PDF ES/EN en el repositorio (`cv-yoel-es.pdf` y `cv-yoel-en.pdf` no adjuntados); endpoint externo (`VITE_CONTACT_ENDPOINT`) para envíos reales del formulario.

## 2. Pasos reproducibles de instalación, arranque y compilación

Desde la carpeta `proyecto/`:

```sh
npm install
npm run dev
```

Para compilar localmente (ruta relativa `./`) y para la subruta oficial de GitHub Pages (`/yoel-portfolio/`):

```sh
npm run build
npm run build -- --base=/yoel-portfolio/
```

Para ejecutar las pruebas automatizadas bajo la subruta `/yoel-portfolio/`:

```sh
npx playwright install chromium
npm run build -- --base=/yoel-portfolio/
PLAYWRIGHT_BASE_PATH=/yoel-portfolio/ npm test
```

## 3. Comandos ejecutados y resultados reales

| Comprobación | Comando ejecutado | Resultado real |
| --- | --- | --- |
| Auditoría Git de la rama base | `git status && git diff` | **Aprobada** (ningún archivo rastreado de `codex/portafolio-base` modificado; `git diff` vacío). |
| Integridad SHA-256 de marca | `sha256sum public/brand/* proyecto/public/brand/* docs/identidad/favicon-* proyecto/docs/identidad/favicon-* docs/identidad/logo-* proyecto/docs/identidad/logo-*` | **Aprobada** — coincidencia byte a byte en los 4 archivos (`favicon-yoel-32.png`: `85deac2b...`, `favicon-yoel.svg`: `d8aa4222...`, `logo-yoel-claro.svg`: `a9334abd...`, `logo-yoel-oscuro.svg`: `9be85e59...`). |
| Instalación de dependencias (`proyecto/`) | `npm install` | **Aprobada** (60 paquetes auditados en 4s). |
| Compilación TypeScript + Vite (`/yoel-portfolio/`) | `npm run build -- --base=/yoel-portfolio/` | **Aprobada** (`tsc --noEmit` sin errores; `vite build` generó `dist/` con 131 módulos transformados en 733 ms). |
| Pruebas Playwright + axe-core (`/yoel-portfolio/`) | `PLAYWRIGHT_BASE_PATH=/yoel-portfolio/ npm test` | **24 / 24 pruebas aprobadas** (`24 passed (40.5s)`) en proyectos `escritorio` (1440×1050) y `movil` (iPhone 13, 390×844). |

### Detalle de las 24 pruebas ejecutadas
- **Suite base intacta (`tests/portfolio.spec.ts`, 12 pruebas — 6 escritorio + 6 móvil)**:
  - Contenido protegido exacto en español, logo claro/oscuro, enlaces correo/WhatsApp/LinkedIn, 4 pesos locales de fuente (`Montserrat 600/700`, `Roboto 400/500`), recursos relativos a `/yoel-portfolio/`, cero errores de consola/HTTP, cero violaciones `axe-core` WCAG 2 A/AA y 2.1 AA.
  - Selector de tema por teclado (`Space` / `Enter`), persistencia en `localStorage`, almacenamiento bloqueado, anclas reales, salto al contenido, `prefers-reduced-motion: reduce`, sin desbordamiento horizontal en 320 / 768 / 1024 / 1440 px ni con texto ampliado al 200 % en 390 px.
- **Suite de ampliación (`tests/extensions.spec.ts`, 12 pruebas — 6 escritorio + 6 móvil)**:
  - Presencia exacta de 5 `<section>` en `<main>` (sin sexta sección), Misión/Visión/Valores dentro de `#perfil`, y enlace visible a GitHub (`https://github.com/yoel-portfolio/yoel-portfolio`).
  - Selector de idioma `ES/EN`, actualización de `<html lang>`, traducción de atributos `aria-label` (incluyendo diagramas de proyectos `project.diagramCaption[lang]`), persistencia en `yoel-lang` y restauración exacta del texto protegido en español.
  - Filtros de `#habilidades`, ilustración vectorial SVG (`svg.arch-svg`), reproducción real de Lottie JSON (`lottie-web` `lottie_light` renderizando SVG en `.lottie-stage`) y control Play/Pause.
  - Filtros de `#proyectos`, conteo accesible, apertura de modal (`role="dialog"`), cierre con `Escape` y devolución verificada del foco al botón origen.
  - Validación del formulario (`react-hook-form` + `zod`) y confirmación de que **no** muestra éxito simulado cuando falta `VITE_CONTACT_ENDPOINT`.
  - Visibilidad de Scrolltop al desplazarse, ausencia de solapamiento de cajas (`boundingBox`) con el botón flotante de WhatsApp, panel editable con enlace `wa.me/50683904194?text=...` y cero violaciones `axe-core`.

## 4. Pruebas NO EJECUTADAS y cómo reproducirlas

- **Envío HTTP real del formulario a servicio externo (`NO EJECUTADA`)**:
  - Motivo: falta configurar `VITE_CONTACT_ENDPOINT` con una cuenta autorizada por Yoel.
  - Reproducción: definir `VITE_CONTACT_ENDPOINT=https://formspree.io/f/<id>` antes de `npm run build` / `npm run dev`, enviar un mensaje real desde `#contacto` y verificar respuesta HTTP 2xx del servicio y recepción en el correo destino.
- **Descarga efectiva de archivos CV PDF ES/EN (`NO EJECUTADA`)**:
  - Motivo: los archivos `cv-yoel-es.pdf` y `cv-yoel-en.pdf` no fueron adjuntados al repositorio (`available: false` en `proyecto/src/data/portfolioData.ts`).
  - Reproducción: copiar ambos PDF en `proyecto/public/cv/`, cambiar `available: true` en `proyecto/src/data/portfolioData.ts`, compilar y comprobar respuesta HTTP 200 y descarga en ambos idiomas.
- **Publicación y validación de la ampliación en URL pública de GitHub Pages (`NO EJECUTADA`)**:
  - Motivo: por regla estricta no se fusiona el PR ni se modifica `.github/workflows/deploy.yml` sin autorización explícita de Yoel (`propuestas/PROPUESTAS_AUTORIZACION.md`).
  - Reproducción: tras autorizar la propuesta de `propuestas/PROPUESTAS_AUTORIZACION.md` y fusionar en `codex/portafolio-base`, ejecutar `PLAYWRIGHT_BASE_URL=https://yoel-portfolio.github.io/yoel-portfolio/ npm test`.
