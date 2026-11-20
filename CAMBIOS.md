# Registro de cambios en la rama de trabajo

## Estado de la base comprobada y del Pull Request
- **Repositorio de referencia**: `https://github.com/yoel-portfolio/yoel-portfolio`
- **Rama base vigente**: `codex/portafolio-base`
- **Commit base preservado**: `b7f3183952e7126a2895bd559423ddda3db19ea3`
- **Rama de trabajo**: `feat/portafolio-final`
- **Pull Request abierto (sin fusionar)**: `https://github.com/yoel-portfolio/yoel-portfolio/pull/1`
- **Verificación de recursos protegidos (SHA-256)**:
  - `public/brand/favicon-yoel-32.png` y `docs/identidad/favicon-yoel-32.png`: `85deac2b1a9e97b3ee666e341a328b40322d8ba0fa84529159d90e657fd5ba86` (idénticos en raíz y `proyecto/`)
  - `public/brand/favicon-yoel.svg` y `docs/identidad/favicon-yoel.svg`: `d8aa4222614a716e1f51cb2d73b0d9967412ab000ce9f34221932337b404316a` (idénticos en raíz y `proyecto/`)
  - `public/brand/logo-yoel-claro.svg` y `docs/identidad/logo-yoel-claro.svg`: `a9334abd1fcbc2f5de151ed392213d8d2a4ba50b96e43fb99816721d4c1a75a9` (idénticos en raíz y `proyecto/`)
  - `public/brand/logo-yoel-oscuro.svg` y `docs/identidad/logo-yoel-oscuro.svg`: `9be85e59b9421cd77ebf4a6b86d82ddcf6f6d104bce05879e9ff7954e788d82e` (idénticos en raíz y `proyecto/`)

## Archivos originales conservados intactos en la raíz
- Ningún archivo rastreado de `codex/portafolio-base` fue modificado ni eliminado (`index.html`, `src/*`, `public/brand/*`, `docs/*`, `tests/portfolio.spec.ts`, `package.json`, `package-lock.json`, `playwright.config.ts`, `tsconfig.json`, `vite.config.ts`, `README.md`, `.gitignore`, `.github/workflows/deploy.yml`).

## Ampliación implementada en `proyecto/`

### Configuración y activos
- `proyecto/package.json`: conserva React 19.3.0, TypeScript 7.0.2, Vite 8.3.2, Tailwind 4.3.3 y `@fontsource/*`; añade `lottie-web` (animación JSON), `react-hook-form`, `zod` y `@hookform/resolvers` (formulario programado), más `overrides.playwright-core: "1.63.0"` para evitar duplicidad de tipos con `@axe-core/playwright`.
- `proyecto/vite.config.ts`: mantiene `base: './'` (compatible con `/yoel-portfolio/` al compilar sin duplicar la carpeta `proyecto/`) y configura `server` para vista previa.
- `proyecto/index.html`: conserva metadatos y script de tema; añade lectura inicial de `yoel-lang` antes del render.
- `proyecto/.env.example`: documenta `VITE_CONTACT_ENDPOINT` y el contrato JSON de confirmación de Formspree (`HTTP 2xx`, `Content-Type: application/json`, `{ "ok": true }`, sin secretos).
- `proyecto/playwright.config.ts`: conserva la configuración de pruebas sobre la compilación pública (`dist/` en `4173`), añade soporte opcional de `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` y levanta dos servidores Vite aislados en `--mode test` (`4174` sin endpoint y `4175` con endpoint ficticio interceptado) para probar el formulario sin incluir ganchos de prueba en el bundle publicado.
- `proyecto/public/animations/fullstack-flow.json`: animación vectorial JSON original (Lottie 5.7.4) para el flujo UI -> API -> DB.
- `proyecto/public/brand/` y `proyecto/docs/identidad/`: copias idénticas byte a byte de los originales.

### Código fuente nuevo y ampliado en `proyecto/src/`
- `proyecto/src/content.ts`, `proyecto/src/styles.css`, `proyecto/src/useTheme.ts`, `proyecto/tests/portfolio.spec.ts`: conservados intactos respecto a la base.
- `proyecto/src/extensions.css`: hoja acotada exclusivamente a las nuevas secciones y controles sin alterar estilos base.
- `proyecto/src/main.tsx`: importa `./extensions.css` después de `./styles.css` manteniendo únicamente los 4 pesos de fuente base.
- `proyecto/src/i18n.ts`: diccionario ES/EN completo, persistencia en `localStorage` (`yoel-lang`) con manejo seguro si el almacenamiento está bloqueado y actualización de `document.documentElement.lang`, `<title>` y `<meta name="description">`. En español conserva exactamente todos los textos aprobados, usa redacción natural para visitantes en los textos nuevos (sin referencias a `VITE_CONTACT_ENDPOINT`, «alojamiento estático» ni «sin métricas ni demos ficticias») y define las etiquetas del botón de descarga de CV como `Descargar CV` (ES) y `Download CV` (EN) cuando el PDF de cada idioma esté disponible.
- `proyecto/src/data/portfolioData.ts`: Misión, Visión, 6 Valores, 5 categorías técnicas, 4 habilidades personales, configuración preparada para CV ES/EN (`available: false` en ambos idiomas hasta recibir los archivos `cv-yoel-es.pdf` y `cv-yoel-en.pdf`) y fichas de `order-payment-microservices`, `Velocity` y `Sistema-de-gestion-Academica`.
- `proyecto/src/components/Icon.tsx`: conserva los 7 íconos base y añade íconos de interfaz (`github`, `download`, `chevronUp`, `close`, `play`, `pause`, `check`, `alert`).
- `proyecto/src/components/ArchitectureIllustration.tsx`: ilustración SVG vectorial propia (conceptual) adaptable a tema claro/oscuro.
- `proyecto/src/components/LottieWorkflow.tsx`: reproductor Lottie JSON real con `lottie-web`, botón reproducir/pausar, soporte de `prefers-reduced-motion` y alternativa estática.
- `proyecto/src/components/SkillsSection.tsx`: Sección 3 (`#habilidades`) con presentación exacta, filtro accesible por categoría (`Todas` / `Técnicas` / `Personales`), tarjetas de habilidades e ilustraciones.
- `proyecto/src/components/ProjectsSection.tsx`: Sección 4 (`#proyectos`) con filtros (`Todos` / `Backend` / `Frontend` / `Full-Stack`), conteo accesible, diagramas conceptuales (`aria-label` bilingüe) y modal accesible renderizado mediante portal (`createPortal`) que mueve el foco al abrir, atrapa `Tab` y `Shift+Tab` dentro de sus controles, marca el fondo (`#root`) como `inert` y `aria-hidden="true"` con bloqueo de desplazamiento, cierra con `Escape` y devuelve el foco al botón origen.
- `proyecto/src/components/ContactSection.tsx`: Sección 5 (`#contacto`) que conserva Correo, WhatsApp y LinkedIn, añade enlace visible a GitHub (`yoel-portfolio/yoel-portfolio`) e integra formulario con `react-hook-form` (`mode: 'onTouched'`) + `zod` usando claves de validación estables para traducir de inmediato errores visibles en `ES ↔ EN` sin borrar lo escrito ni validar campos intactos. Acepta únicamente la confirmación estricta del contrato de Formspree (`HTTP 2xx`, `Content-Type: application/json`, objeto JSON válido sin `errors` y con `ok === true`), rechaza HTML, JSON mal formado o JSON sin confirmación conservando los datos escritos, y no expone ningún gancho global de pruebas en el código publicado.
- `proyecto/src/components/FloatingActions.tsx`: acceso flotante a WhatsApp con panel breve de mensaje editable (sin chat simulado) y botón Scrolltop sin solapamientos y respetando `prefers-reduced-motion`.
- `proyecto/src/App.tsx`: integra cabecera (4 enlaces + selector ES/EN + selector de tema), las 5 secciones y el pie de página sin crear una sexta sección independiente.
- `proyecto/tests/extensions.spec.ts`: suite Playwright + axe-core (30 pruebas en escritorio y móvil) con bloqueo automático de peticiones externas reales, auditoría del bundle publicado (`dist/`) sin ganchos de prueba, validación de consistencia y flujo bilingüe `ES → EN → ES` para el botón de CV (estado pendiente sin enlaces rotos o descarga real de PDF con cabecera `%PDF-`, `Content-Type: application/pdf` y rechazo de respuestas HTML 200), foco atrapado en el modal (`Tab` y `Shift+Tab`), prueba bilingüe `ES → EN → ES` de errores visibles y casos separados de formulario sin endpoint y con respuestas HTTP interceptadas (HTTP 500 + reintento exitoso `{ ok: true }`, HTTP 200 HTML, HTTP 200 JSON mal formado, HTTP 200 `{}` y `{ ok: false }`).

## Documentación y entregables en la raíz
- `CAMBIOS.md`, `VERIFICACION.md`, `CUMPLIMIENTO.md`, `PENDIENTES.md`.
- `entregables/portafolio.txt` y `entregables/promo.png`.
- `propuestas/PROPUESTAS_AUTORIZACION.md`: parches separados (sin activar) para `.github/workflows/deploy.yml` (verificado con `git apply --check`, incluyendo `VITE_CONTACT_ENDPOINT: ${{ vars.VITE_CONTACT_ENDPOINT }}` en la compilación bajo `/yoel-portfolio/`) y la retirada del aviso «en construcción».
