# Registro de cambios en la rama de trabajo

## Estado de la base comprobada
- **Repositorio de referencia**: `https://github.com/yoel-portfolio/yoel-portfolio`
- **Rama base vigente**: `codex/portafolio-base`
- **Commit de referencia**: `b7f3183952e7126a2895bd559423ddda3db19ea3`
- **Verificación de recursos protegidos (SHA-256)**:
  - `public/brand/favicon-yoel-32.png` y `docs/identidad/favicon-yoel-32.png`: `85deac2b1a9e97b3ee666e341a328b40322d8ba0fa84529159d90e657fd5ba86` (idénticos en raíz y `proyecto/`)
  - `public/brand/favicon-yoel.svg` y `docs/identidad/favicon-yoel.svg`: `d8aa4222614a716e1f51cb2d73b0d9967412ab000ce9f34221932337b404316a` (idénticos en raíz y `proyecto/`)
  - `public/brand/logo-yoel-claro.svg` y `docs/identidad/logo-yoel-claro.svg`: `a9334abd1fcbc2f5de151ed392213d8d2a4ba50b96e43fb99816721d4c1a75a9` (idénticos en raíz y `proyecto/`)
  - `public/brand/logo-yoel-oscuro.svg` y `docs/identidad/logo-yoel-oscuro.svg`: `9be85e59b9421cd77ebf4a6b86d82ddcf6f6d104bce05879e9ff7954e788d82e` (idénticos en raíz y `proyecto/`)

## Archivos originales conservados intactos en la raíz
- `index.html`, `src/*`, `public/brand/*`, `docs/*`, `tests/portfolio.spec.ts`, `.github/workflows/deploy.yml`, `README.md`, `tsconfig.json`.
- Nota del entorno AI Studio (turno inicial de importación): en la raíz se eliminó `bun.lock` y se ajustó `package.json` (`dev` en `0.0.0.0:3000`) y `vite.config.ts` (`server: { host: '0.0.0.0', port: 3000, allowedHosts: true }`) únicamente para compatibilidad de ejecución en el contenedor de vista previa.

## Ampliación implementada en `proyecto/`

### Configuración y activos
- `proyecto/package.json`: conserva React 19.3.0, TypeScript 7.0.2, Vite 8.3.2, Tailwind 4.3.3 y `@fontsource/*`; añade `lottie-web` (animación JSON), `react-hook-form`, `zod` y `@hookform/resolvers` (formulario programado), más `overrides.playwright-core: "1.63.0"` para evitar duplicidad de tipos con `@axe-core/playwright`.
- `proyecto/vite.config.ts`: mantiene `base: './'` (compatible con `/yoel-portfolio/` al compilar sin duplicar la carpeta `proyecto/`) y configura `server` para vista previa.
- `proyecto/index.html`: conserva metadatos y script de tema; añade lectura inicial de `yoel-lang` antes del render.
- `proyecto/.env.example`: documenta `VITE_CONTACT_ENDPOINT` (sin secretos).
- `proyecto/playwright.config.ts`: conserva la configuración de pruebas y añade soporte opcional de `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` para contenedores sin modificar el comportamiento en CI.
- `proyecto/public/animations/fullstack-flow.json`: animación vectorial JSON original (Lottie 5.7.4) para el flujo UI -> API -> DB.
- `proyecto/public/brand/` y `proyecto/docs/identidad/`: copias idénticas byte a byte de los originales.

### Código fuente nuevo y ampliado en `proyecto/src/`
- `proyecto/src/content.ts`, `proyecto/src/styles.css`, `proyecto/src/useTheme.ts`, `proyecto/tests/portfolio.spec.ts`: conservados intactos respecto a la base.
- `proyecto/src/extensions.css`: hoja acotada exclusivamente a las nuevas secciones y controles sin alterar estilos base.
- `proyecto/src/main.tsx`: importa `./extensions.css` después de `./styles.css` manteniendo únicamente los 4 pesos de fuente base.
- `proyecto/src/i18n.ts`: diccionario ES/EN completo, persistencia en `localStorage` (`yoel-lang`) con manejo seguro si el almacenamiento está bloqueado y actualización de `document.documentElement.lang`, `<title>` y `<meta name="description">`. En español conserva exactamente todos los textos aprobados.
- `proyecto/src/data/portfolioData.ts`: Misión, Visión, 6 Valores, 5 categorías técnicas, 4 habilidades personales, configuración preparada para CV ES/EN (`available: false` hasta adjuntar PDF) y fichas verificadas de `order-payment-microservices`, `Velocity` y `Sistema-de-gestion-Academica`.
- `proyecto/src/components/Icon.tsx`: conserva los 7 íconos base y añade íconos de interfaz (`github`, `download`, `chevronUp`, `close`, `play`, `pause`, `check`, `alert`).
- `proyecto/src/components/ArchitectureIllustration.tsx`: ilustración SVG vectorial propia (conceptual) adaptable a tema claro/oscuro.
- `proyecto/src/components/LottieWorkflow.tsx`: reproductor Lottie JSON real con `lottie-web`, botón reproducir/pausar, soporte de `prefers-reduced-motion` y alternativa estática.
- `proyecto/src/components/SkillsSection.tsx`: Sección 3 (`#habilidades`) con presentación exacta, filtro accesible por categoría (`Todas` / `Técnicas` / `Personales`), tarjetas de habilidades e ilustraciones.
- `proyecto/src/components/ProjectsSection.tsx`: Sección 4 (`#proyectos`) con filtros (`Todos` / `Backend` / `Frontend` / `Full-Stack`), conteo accesible, diagramas conceptuales y modal accesible con cierre por `Escape` y devolución del foco al botón que abrió la ficha.
- `proyecto/src/components/ContactSection.tsx`: Sección 5 (`#contacto`) que conserva Correo, WhatsApp y LinkedIn, añade enlace visible a GitHub (`yoel-portfolio/yoel-portfolio`) e integra formulario con `react-hook-form` + `zod` (sin simular éxitos si falta `VITE_CONTACT_ENDPOINT`).
- `proyecto/src/components/FloatingActions.tsx`: acceso flotante a WhatsApp con panel breve de mensaje editable (sin chat simulado) y botón Scrolltop sin solapamientos y respetando `prefers-reduced-motion`.
- `proyecto/src/App.tsx`: integra cabecera (4 enlaces + selector ES/EN + selector de tema), las 5 secciones y el pie de página sin crear una sexta sección independiente.
- `proyecto/tests/extensions.spec.ts`: suite Playwright + axe-core para las nuevas funcionalidades.

## Documentación y entregables en la raíz
- `CAMBIOS.md`, `VERIFICACION.md`, `CUMPLIMIENTO.md`, `PENDIENTES.md`.
- `entregables/portafolio.txt` y `entregables/promo.png`.
- `propuestas/PROPUESTAS_AUTORIZACION.md`: parches separados (sin activar) para `.github/workflows/deploy.yml` y la retirada del aviso «en construcción».
