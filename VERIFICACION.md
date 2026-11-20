# Verificación de la ampliación (`proyecto/`)

## 1. Herramientas comprobadas en el entorno
- **Disponibles**: terminal (`Node.js v24.22.2`, `npm 11.21.2`, `git 2.39.5`, `gh 2.103.3`), repositorio Git en rama `feat/portafolio-final` (PR #1 abierto hacia `codex/portafolio-base`, commit base preservado `b7f3183`), compilación Vite/TypeScript, navegador headless Chromium (`/usr/bin/chromium`), Playwright + `@axe-core/playwright`, archivos CV PDF ES/EN verificados (`proyecto/public/cv/cv-yoel-es.pdf` y `proyecto/public/cv/cv-yoel-en.pdf`) y entregables (`entregables/portafolio.txt`, `entregables/promo.png`).
- **No disponibles**: endpoint externo autorizado (`VITE_CONTACT_ENDPOINT`) para pruebas reales de envío/recepción de correos.

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
| Auditoría Git de archivos base en raíz | `git diff codex/portafolio-base -- index.html src public docs tests package.json package-lock.json playwright.config.ts tsconfig.json vite.config.ts README.md .gitignore` | **Aprobada** (salida vacía: ningún archivo original de la aplicación base modificado; únicamente `.github/workflows/deploy.yml` fue actualizado con autorización explícita de Yoel). |
| Integridad SHA-256 de marca | `sha256sum public/brand/* proyecto/public/brand/* docs/identidad/favicon-* proyecto/docs/identidad/favicon-* docs/identidad/logo-* proyecto/docs/identidad/logo-*` | **Aprobada** — coincidencia byte a byte en los 4 archivos (`favicon-yoel-32.png`: `85deac2b...`, `favicon-yoel.svg`: `d8aa4222...`, `logo-yoel-claro.svg`: `a9334abd...`, `logo-yoel-oscuro.svg`: `9be85e59...`). |
| Verificación de CV PDF ES/EN | `file`, `pdftotext`, inspección visual y `sha256sum public/cv/*.pdf dist/cv/*.pdf` | **Aprobada** — ambos son `PDF document, version 1.4, 1 pages` sin modificar, con coincidencia byte a byte entre `pdfcv.zip`, `public/cv/` y `dist/cv/`: `cv-yoel-es.pdf` (`04_CV_Imagen_ES.pdf`, 36 327 B, `21e602e3...`, texto en español) y `cv-yoel-en.pdf` (`05_CV_Imagen_EN.pdf`, 35 685 B, `c38a5fd9...`, texto en inglés). |
| Workflow de despliegue (`deploy.yml`) | `awk '/^\`\`\`diff$/{flag=1;next}/^\`\`\`$/{flag=0}flag' propuestas/PROPUESTAS_AUTORIZACION.md \| git apply --reverse --check -` + validación YAML | **Aprobada** (`exit 0`, `.github/workflows/deploy.yml` coincide exactamente con la Propuesta 1 autorizada, sintaxis YAML válida con jobs `build` y `deploy`, compilando `proyecto/` con `vars.VITE_CONTACT_ENDPOINT` y disparador limitado a `codex/portafolio-base` / `workflow_dispatch`). |
| Compilación TypeScript + Vite (`/yoel-portfolio/`) | `npm run build -- --base=/yoel-portfolio/` | **Aprobada** (`tsc --noEmit` sin errores; 129 módulos en 635 ms, bundle JS reducido a 390.89 kB / 120.32 kB gzip sin advertencias de tamaño e incluyendo `dist/cv/cv-yoel-es.pdf` y `dist/cv/cv-yoel-en.pdf`). |
| Auditoría de bundle publicado (`dist/`) | `grep -rni -e "__YOEL_TEST_CONTACT_ENDPOINT__" -e "contact-test\.invalid" -e "en construcción" -e "under construction" -e "en camino" -e "on the way" dist/` | **Aprobada** (0 coincidencias; ningún gancho de prueba ni texto temporal «en construcción» presente en el código publicado). |
| Pruebas Playwright + axe-core (`/yoel-portfolio/`) | `PLAYWRIGHT_BASE_PATH=/yoel-portfolio/ npm test` | **44 / 44 pruebas aprobadas** (`44 passed (1.5m)`) en proyectos `escritorio` (1440×1050) y `movil` (iPhone 13, 390×844). |

### Detalle de las 44 pruebas ejecutadas
- **Suite base (`tests/portfolio.spec.ts`, 12 pruebas — 6 escritorio + 6 móvil)**:
  - Encabezado `h1` actualizado (`Ingeniero de software full-stack`), Hero limpio con únicamente el botón `Descargar CV` debajo de «Código que impulsa ideas», contenido protegido exacto en español (Perfil profesional, Sobre mí y eslogan), logo claro/oscuro, enlaces correo/WhatsApp/LinkedIn, 4 pesos locales de fuente (`Montserrat 600/700`, `Roboto 400/500`), recursos relativos a `/yoel-portfolio/`, cero errores de consola/HTTP, cero violaciones `axe-core` WCAG 2 A/AA y 2.1 AA.
  - Selector de tema por teclado (`Space` / `Enter`), persistencia en `localStorage`, almacenamiento bloqueado, anclas reales, salto al contenido, `prefers-reduced-motion: reduce`, sin desbordamiento horizontal en 320 / 768 / 1024 / 1440 px ni con texto ampliado al 200 % en 390 px.
- **Suite de ampliación (`tests/extensions.spec.ts`, 32 pruebas — 16 escritorio + 16 móvil)**:
  - Presencia exacta de 5 `<section>` en `<main>` (sin sexta sección), Misión/Visión/Valores dentro de `#perfil`, enlace visible a GitHub (`https://github.com/yoel-portfolio/yoel-portfolio`) y ausencia de jerga técnica interna (`VITE_CONTACT_ENDPOINT`, «alojamiento estático», «métricas ni demos ficticias») en la interfaz.
  - Verificación del bundle publicado (`dist/` y scripts servidos en `4173`): ausencia total de `__YOEL_TEST_CONTACT_ENDPOINT__` y `contact-test.invalid`, y confirmación de que asignar esa propiedad global en el navegador no altera ni desvía el envío del formulario.
  - Selector de idioma `ES/EN`, metadatos y retirada del aviso «en construcción»: verifica `<html lang>`, `<title>`, `<meta name="description">`, `og:title`, `og:description`, insignia (`DISPONIBLE PARA OPORTUNIDADES` / `OPEN TO OPPORTUNITIES`), `h1` (`Ingeniero de software full-stack` / `Full-stack software engineer`), ausencia de «en construcción» / «under construction» / «en camino» / «on the way», persistencia en `yoel-lang` y restauración exacta del texto protegido en español.
  - Descarga real de CV por idioma (`ES → EN → ES`) en escritorio y móvil:
    - Confirma que `cvConfig.es.available` y `cvConfig.en.available` son `true` y coinciden con `proyecto/public/cv/cv-yoel-es.pdf` y `proyecto/public/cv/cv-yoel-en.pdf`, ambos con firma `%PDF-` y hashes SHA-256 distintos.
    - En español muestra «Descargar CV» (sin aviso «próximamente»), apunta a `/yoel-portfolio/cv/cv-yoel-es.pdf`, recibe HTTP 200 con `Content-Type: application/pdf` (nunca `text/html`), verifica firma `%PDF-`, SHA-256 idéntico y descarga real con nombre `cv-yoel-es.pdf`.
    - Al cambiar a inglés muestra «Download CV» (sin «coming soon»), apunta a `/yoel-portfolio/cv/cv-yoel-en.pdf`, recibe HTTP 200 `application/pdf`, verifica `%PDF-`, SHA-256 idéntico y descarga real `cv-yoel-en.pdf`; luego vuelve a español y repite la verificación.
  - Hero minimalista y `#habilidades` separadas verticalmente: confirma un único enlace (`Descargar CV`) bajo el eslogan en el Hero, 5 tarjetas de Habilidades técnicas arriba y 4 tarjetas de Habilidades personales debajo (verificado por posición vertical `boundingBox`), ausencia de filtros, `svg.arch-svg` y `.lottie-stage`, y activación del scroll-reveal (`data-revealed="true"`) al desplazarse.
  - `#proyectos` directo sin filtros: muestra las 3 tarjetas verificadas sin botones de categoría, confirma revelación al desplazarse (`data-revealed="true"`), apertura de modal (`role="dialog"`), fondo inactivo (`#root[inert]` + `aria-hidden="true"` + bloqueo de scroll), foco atrapado recorriendo el modal con `Tab` y `Shift+Tab` en ambas direcciones, cierre con `Escape` y devolución verificada del foco al botón origen.
  - Formulario bilingüe `ES → EN → ES` con un error visible y datos ingresados: traduce el error al instante en ambos sentidos sin borrar los valores escritos ni mostrar errores nuevos en campos no validados.
  - Formulario **sin endpoint** (servidor aislado en `--mode test`, puerto `4174`): validación de campos, aviso natural con alternativa de correo o WhatsApp sin mostrar éxito simulado, datos conservados y 0 peticiones `POST`.
  - Formulario **con endpoint simulado** (servidor aislado en `--mode test`, puerto `4175`, respuestas HTTP interceptadas con `page.route` sin contactar servicios externos):
    - El POST envía `name`, `email` y `message` como `FormData`, con `Accept: application/json`. Se verificó además con dos servidores locales de distinto origen que el POST llega sin una petición `OPTIONS` preliminar.
    - Fallo HTTP 500 conserva todos los datos escritos y muestra aviso de error para permitir reintentar.
    - Tras 12 segundos sin respuesta, el formulario avisa que el envío no pudo confirmarse, conserva los datos y permite continuar. No hay reenvío automático.
    - Reintento con respuesta diferida confirma que no muestra éxito antes de recibir HTTP 200 con `Content-Type: application/json` y `{ "ok": true }` (contrato de Formspree); al confirmarse, muestra éxito y limpia los campos.
    - Cuatro casos de **HTTP 200 inesperado** rechazados sin mostrar éxito y conservando todos los datos escritos: página HTML (`text/html`), JSON mal formado (`{ "ok": true`), JSON sin confirmación explícita (`{}`) y JSON con `{ "ok": false }`.
  - Visibilidad de Scrolltop al desplazarse, ausencia de solapamiento de cajas (`boundingBox`) con el botón flotante de WhatsApp, panel editable con enlace `wa.me/50683904194?text=...` y cero violaciones `axe-core`.

> **Distinción importante (simulado vs. real)**: las pruebas del formulario con endpoint validan el comportamiento del cliente frente a respuestas HTTP **interceptadas/simuladas** por Playwright (`page.route`) y bloquean explícitamente cualquier petición real hacia Internet. **No** sustituyen una prueba real de recepción de correo con un servicio autorizado.

## 4. Comprobaciones pendientes y cómo reproducirlas

- **Prueba real de recepción de correo en servicio externo (`NO CONFIRMADA`)**:
  - Estado: Yoel facilitó el endpoint y confirmó que guardó la variable en GitHub. El primer intento autorizado desde la vista previa no recibió una respuesta HTTP y la entrega sigue sin confirmarse. La versión ajustada usa `FormData` y no reenvía automáticamente. Las pruebas automáticas usan respuestas simuladas.
  - Reproducción: configurar `VITE_CONTACT_ENDPOINT=https://formspree.io/f/<id>` en una compilación manual y en GitHub Actions Variables (`vars.VITE_CONTACT_ENDPOINT`), enviar un mensaje de prueba desde `#contacto` cuando Yoel lo autorice y confirmar respuesta HTTP 2xx y recepción real en `yoerojas03@gmail.com`.
- **Publicación y validación de la ampliación en la URL pública de GitHub Pages (`NO EJECUTADA`)**:
  - Motivo: aunque `.github/workflows/deploy.yml` ya fue actualizado en el PR #1 con autorización de Yoel, el PR sigue abierto **sin fusionar ni publicar**.
  - Reproducción: tras la aprobación final y fusión en `codex/portafolio-base`, ejecutar `PLAYWRIGHT_BASE_URL=https://yoel-portfolio.github.io/yoel-portfolio/ PLAYWRIGHT_BASE_PATH=/yoel-portfolio/ npm test` y verificar descargas de CV y formulario en vivo.
