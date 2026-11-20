# Verificación de la ampliación (`proyecto/`)

## 1. Herramientas comprobadas en el entorno
- **Disponibles**: terminal (`Node.js v24.22.2`, `npm 11.21.2`, `git 2.39.5`, `gh 2.103.3`), repositorio Git en rama `feat/portafolio-final` (PR #1 abierto hacia `codex/portafolio-base`, commit base preservado `b7f3183`), compilación Vite/TypeScript, navegador headless Chromium (`/usr/bin/chromium`), Playwright + `@axe-core/playwright` y entregables (`entregables/portafolio.txt`, `entregables/promo.png`).
- **No disponibles**: archivos CV PDF ES/EN aprobados (`cv-yoel-es.pdf` y `cv-yoel-en.pdf` no adjuntados); endpoint externo autorizado (`VITE_CONTACT_ENDPOINT`) para pruebas reales de envío/recepción de correos.

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

Para ejecutar las pruebas automatizadas bajo la subruta `/yoel-portfolio/` (sin contactar servicios externos reales):

```sh
npx playwright install chromium
npm run build -- --base=/yoel-portfolio/
PLAYWRIGHT_BASE_PATH=/yoel-portfolio/ npm test
```

## 3. Comandos ejecutados y resultados reales

| Comprobación | Comando ejecutado | Resultado real |
| --- | --- | --- |
| Auditoría Git de archivos originales | `git diff codex/portafolio-base -- index.html src public docs tests package.json package-lock.json playwright.config.ts tsconfig.json vite.config.ts README.md .gitignore .github` | **Aprobada** (salida vacía: ningún archivo original de `codex/portafolio-base` modificado). |
| Integridad SHA-256 de marca | `sha256sum public/brand/* proyecto/public/brand/* docs/identidad/favicon-* proyecto/docs/identidad/favicon-* docs/identidad/logo-* proyecto/docs/identidad/logo-*` | **Aprobada** — coincidencia byte a byte en los 4 archivos (`favicon-yoel-32.png`: `85deac2b...`, `favicon-yoel.svg`: `d8aa4222...`, `logo-yoel-claro.svg`: `a9334abd...`, `logo-yoel-oscuro.svg`: `9be85e59...`). |
| Validez del parche de despliegue | `awk '/^\`\`\`diff$/{flag=1;next}/^\`\`\`$/{flag=0}flag' propuestas/PROPUESTAS_AUTORIZACION.md \| git apply --check -` | **Aprobada** (`exit 0`, aplica limpiamente sobre `.github/workflows/deploy.yml` sin activarlo ni modificarlo). |
| Compilación TypeScript + Vite (`/yoel-portfolio/`) | `npm run build -- --base=/yoel-portfolio/` | **Aprobada** (`tsc --noEmit` sin errores; `vite build` generó `dist/` en 822 ms). |
| Auditoría de bundle publicado (`dist/`) | `grep -rn "__YOEL_TEST_CONTACT_ENDPOINT__\|contact-test\.invalid" dist/` | **Aprobada** (0 coincidencias; ningún gancho de prueba presente en el código publicado; las etiquetas `Descargar CV` y `Download CV` figuran listas para activación). |
| Pruebas Playwright + axe-core (`/yoel-portfolio/`) | `PLAYWRIGHT_BASE_PATH=/yoel-portfolio/ npm test` | **42 / 42 pruebas aprobadas** (`42 passed (1.3m)`) en proyectos `escritorio` (1440×1050) y `movil` (iPhone 13, 390×844). |

### Detalle de las 42 pruebas ejecutadas
- **Suite base intacta (`tests/portfolio.spec.ts`, 12 pruebas — 6 escritorio + 6 móvil)**:
  - Contenido protegido exacto en español, logo claro/oscuro, enlaces correo/WhatsApp/LinkedIn, 4 pesos locales de fuente (`Montserrat 600/700`, `Roboto 400/500`), recursos relativos a `/yoel-portfolio/`, cero errores de consola/HTTP, cero violaciones `axe-core` WCAG 2 A/AA y 2.1 AA.
  - Selector de tema por teclado (`Space` / `Enter`), persistencia en `localStorage`, almacenamiento bloqueado, anclas reales, salto al contenido, `prefers-reduced-motion: reduce`, sin desbordamiento horizontal en 320 / 768 / 1024 / 1440 px ni con texto ampliado al 200 % en 390 px.
- **Suite de ampliación (`tests/extensions.spec.ts`, 30 pruebas — 15 escritorio + 15 móvil)**:
  - Presencia exacta de 5 `<section>` en `<main>` (sin sexta sección), Misión/Visión/Valores dentro de `#perfil`, enlace visible a GitHub (`https://github.com/yoel-portfolio/yoel-portfolio`) y ausencia de jerga técnica interna (`VITE_CONTACT_ENDPOINT`, «alojamiento estático», «métricas ni demos ficticias») en la interfaz.
  - Verificación del bundle publicado (`dist/` y scripts servidos en `4173`): ausencia total de `__YOEL_TEST_CONTACT_ENDPOINT__` y `contact-test.invalid`, y confirmación de que asignar esa propiedad global en el navegador no altera ni desvía el envío del formulario.
  - Selector de idioma `ES/EN`, actualización de `<html lang>`, persistencia en `yoel-lang` y restauración exacta del texto protegido en español.
  - Cobertura de CV por idioma (`ES → EN → ES`):
    - Verifica que `cvConfig.es.available` y `cvConfig.en.available` coincidan exactamente con la presencia real de `proyecto/public/cv/cv-yoel-es.pdf` y `proyecto/public/cv/cv-yoel-en.pdf` (actualmente ambos `false` porque los PDF no llegaron adjuntos en el entorno, evitando enlaces rotos o respuestas `200 text/html` de respaldo SPA).
    - En estado pendiente confirma la ausencia de `<a class="cv-control-ready">` y el aviso visible por idioma (`CV en PDF (ES) — próximamente` / `Resume PDF (EN) — coming soon`).
    - Cuando el archivo del idioma esté presente y `available: true`, valida automáticamente la etiqueta exacta (`Descargar CV` / `Download CV`), `href` bajo `/yoel-portfolio/cv/...`, respuesta HTTP 200 con `Content-Type: application/pdf` (rechazando `text/html`), firma `%PDF-`, igualdad SHA-256 contra el archivo en `public/cv/` y evento real de descarga en escritorio y móvil (rama validada temporalmente en local con archivos sintéticos descartados antes del commit).
  - Filtros de `#habilidades`, ilustración vectorial SVG (`svg.arch-svg`), reproducción real de Lottie JSON (`lottie-web` `lottie_light` renderizando SVG en `.lottie-stage`) y control Play/Pause.
  - Filtros de `#proyectos`, conteo accesible, apertura de modal (`role="dialog"`), fondo inactivo (`#root[inert]` + `aria-hidden="true"` + bloqueo de scroll), foco atrapado recorriendo el modal con `Tab` y `Shift+Tab` en ambas direcciones, cierre con `Escape` y devolución verificada del foco al botón origen.
  - Formulario bilingüe `ES → EN → ES` con un error visible y datos ingresados: traduce el error al instante en ambos sentidos sin borrar los valores escritos ni mostrar errores nuevos en campos no validados.
  - Formulario **sin endpoint** (servidor aislado en `--mode test`, puerto `4174`): validación de campos, aviso natural sin mostrar éxito simulado, datos conservados y 0 peticiones `POST`.
  - Formulario **con endpoint simulado** (servidor aislado en `--mode test`, puerto `4175`, respuestas HTTP interceptadas con `page.route` sin contactar servicios externos):
    - Fallo HTTP 500 conserva todos los datos escritos y muestra aviso de error para permitir reintentar.
    - Reintento con respuesta diferida confirma que no muestra éxito antes de recibir HTTP 200 con `Content-Type: application/json` y `{ "ok": true }` (contrato de Formspree); al confirmarse, muestra éxito y limpia los campos.
    - Cuatro casos de **HTTP 200 inesperado** rechazados sin mostrar éxito y conservando todos los datos escritos: página HTML (`text/html`), JSON mal formado (`{ "ok": true`), JSON sin confirmación explícita (`{}`) y JSON con `{ "ok": false }`.
  - Visibilidad de Scrolltop al desplazarse, ausencia de solapamiento de cajas (`boundingBox`) con el botón flotante de WhatsApp, panel editable con enlace `wa.me/50683904194?text=...` y cero violaciones `axe-core`.

> **Distinción importante (simulado vs. real)**: las pruebas del formulario con endpoint validan el comportamiento del cliente frente a respuestas HTTP **interceptadas/simuladas** por Playwright (`page.route`) y bloquean explícitamente cualquier petición real hacia Internet. **No** sustituyen una prueba real de recepción de correo con un servicio autorizado.

## 4. Pruebas NO EJECUTADAS y cómo reproducirlas

- **Descarga efectiva de los CV PDF reales ES/EN (`NO EJECUTADA`)**:
  - Motivo: los archivos `cv-yoel-es.pdf` y `cv-yoel-en.pdf` no aparecieron adjuntos en el entorno (`/home/antigravity/upload/` únicamente contenía `yoel-portafolio-feat-portafolio-final.zip`), por lo que ambos idiomas se mantuvieron con `available: false` en `proyecto/src/data/portfolioData.ts` (se comprobó además que sin el archivo el servidor preview devuelve `200 text/html` sobre `/yoel-portfolio/cv/cv-yoel-es.pdf`).
  - Reproducción: adjuntar ambos PDF reales en `proyecto/public/cv/cv-yoel-es.pdf` y `proyecto/public/cv/cv-yoel-en.pdf`, comprobar firma `%PDF-` e idioma, cambiar `available: true` en `proyecto/src/data/portfolioData.ts`, compilar con `--base=/yoel-portfolio/` y ejecutar `PLAYWRIGHT_BASE_PATH=/yoel-portfolio/ npm test`.
- **Prueba real de envío y recepción de correo en servicio externo (`NO EJECUTADA`)**:
  - Motivo: todavía no se facilitó un endpoint público de Formspree (`VITE_CONTACT_ENDPOINT`) ni autorización para una prueba real de recepción; las pruebas automáticas nunca contactan servicios reales.
  - Reproducción: configurar `VITE_CONTACT_ENDPOINT=https://formspree.io/f/<id>` en una compilación manual (o en GitHub Actions Variables `vars.VITE_CONTACT_ENDPOINT` tras aprobar la propuesta), enviar un mensaje de prueba desde `#contacto` cuando Yoel lo autorice y confirmar respuesta HTTP 2xx y recepción real en `yoerojas03@gmail.com`.
- **Publicación y validación de la ampliación en la URL pública de GitHub Pages (`NO EJECUTADA`)**:
  - Motivo: el PR #1 sigue abierto sin fusionar y `.github/workflows/deploy.yml` permanece intacto a la espera de autorización explícita de Yoel (`propuestas/PROPUESTAS_AUTORIZACION.md`).
  - Reproducción: tras aprobar las propuestas y fusionar en `codex/portafolio-base`, ejecutar `PLAYWRIGHT_BASE_URL=https://yoel-portfolio.github.io/yoel-portfolio/ npm test`.
