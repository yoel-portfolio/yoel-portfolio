# Cumplimiento frente a la rúbrica de 30 puntos

Estado honesto de la ampliación implementada en `proyecto/` y entregables asociados dentro del PR #1 (`feat/portafolio-final` → `codex/portafolio-base`). No sustituye la revisión de Yoel ni la evaluación docente.

| # | Rubro | Pts. | Estado | Evidencia concreta |
| --- | --- | --- | --- | --- |
| 1 | Responsividad | 1 | Completo (en verificación local) | `proyecto/src/extensions.css`, pruebas en escritorio (1440 px), tableta (768 px), móvil (390 px y 320 px) y zoom al 200 %. |
| 2 | Paleta 60-30-10 | 1 | Completo | Conserva exactamente `#0F172A`, `#2563EB`/`#3B82F6`, `#10B981`, `#F8FAFC`, `#475569`/`#1E293B` y variables semánticas de `proyecto/src/styles.css`. |
| 3 | Cinco secciones | 2 | Completo | Inicio, Mi perfil (`#perfil` con Misión/Visión/Valores), Habilidades (`#habilidades`), Proyectos (`#proyectos`) y Contacto (`#contacto`). Sin sexta sección. |
| 4 | Dos espacios digitales | 2 | Completo | LinkedIn (`https://www.linkedin.com/in/yoel-rojas-97a07b413/`) conservado y enlace visible a GitHub (`https://github.com/yoel-portfolio/yoel-portfolio`) añadido en `#contacto`. |
| 5 | Ilustraciones SVG | 1 | Completo | Se conservan intactos los SVG de `public/brand/` y se añade `proyecto/src/components/ArchitectureIllustration.tsx` + diagramas conceptuales en proyectos. |
| 6 | Descarga de CV PDF | 2 | Completo | Integrados sin modificar `proyecto/public/cv/cv-yoel-es.pdf` (ES) y `proyecto/public/cv/cv-yoel-en.pdf` (EN), activados en `cvConfig` (`available: true`), con etiquetas `Descargar CV` / `Download CV`, rutas bajo `/yoel-portfolio/cv/...` y descargas reales verificadas en escritorio y móvil (HTTP 200 `application/pdf`, `%PDF-`, SHA-256 idéntico). |
| 7 | Chat WhatsApp | 2 | Completo | Se mantiene el enlace en `#contacto` y se agrega acceso flotante (`proyecto/src/components/FloatingActions.tsx`) con panel breve de mensaje editable hacia `https://wa.me/50683904194` sin simular chat. |
| 8 | Formulario programado | 2 | Parcial (validado con HTTP simulado; recepción real pendiente de confirmación) | Implementado con `react-hook-form` + `zod` (`ContactSection.tsx`). Envío vía `FormData` con `Accept: application/json`, límite de espera de 12 s sin reenvíos automáticos, validación bilingüe instantánea `ES ↔ EN`, aceptación exclusiva del contrato JSON de Formspree (`HTTP 2xx` + `application/json` + `{ ok: true }`) y conservación de datos ante fallos, timeout o HTTP 200 inesperados verificados con HTTP interceptado; `VITE_CONTACT_ENDPOINT` ya está guardado en GitHub Actions, pendiente confirmar recepción real tras una única prueba autorizada. |
| 9 | Español e inglés | 2 | Completo | Selector ES/EN superior (`App.tsx` + `i18n.ts`) que traduce secciones, menús, proyectos, formulario, errores visibles al instante, títulos y atributos `alt`/`aria-label`, actualiza `<html lang>` y persiste en `yoel-lang`. |
| 10 | Scrolltop | 1 | Completo | Botón accesible tras desplazarse > 320 px (`FloatingActions.tsx`), operable con teclado, sin solapamiento con WhatsApp y respetando `prefers-reduced-motion`. |
| 11 | Galería interactiva | 1 | Completo | `ProjectsSection.tsx` con los 3 repositorios reales inspeccionados (`order-payment-microservices`, `Velocity`, `Sistema-de-gestion-Academica`), filtros por categoría y modal con foco atrapado (`Tab`/`Shift+Tab`), fondo `inert`, cierre con `Escape` y devolución de foco. |
| 12 | Transición o animación | 1 | Completo | Transiciones sutiles en tarjetas y controles en `extensions.css` respetando `@media (prefers-reduced-motion: reduce)` de `styles.css`. |
| 13 | Elementos interactivos | 1 | Completo | Selector de tema claro/oscuro, selector ES/EN, filtros de habilidades/proyectos, modal accesible de ficha, panel WhatsApp, formulario y control de Lottie. |
| 14 | Animación web JSON | 1 | Completo | `proyecto/public/animations/fullstack-flow.json` (Lottie 5.7.4) reproducido con `lottie-web` (`lottie_light`) en `LottieWorkflow.tsx`, con botón Reproducir/Pausar y alternativa estática ante movimiento reducido. |
| 15 | Exposición | 2 | Pendiente | Responsabilidad exclusiva del estudiante en la fecha docente; guía breve incluida en `entregables/portafolio.txt`. |
| 16 | Enlace remoto | 1 | Parcial (workflow preparado en PR #1; pendiente de fusión y verificación pública) | `.github/workflows/deploy.yml` ya fue actualizado con autorización de Yoel para compilar `proyecto/` bajo `/yoel-portfolio/` con `vars.VITE_CONTACT_ENDPOINT` y subir `proyecto/dist`, y las 44 pruebas pasan localmente; falta fusionar el PR #1 para publicar en `https://yoel-portfolio.github.io/yoel-portfolio/` y validar la URL pública. |
| 17 | Imagen promocional | 2 | Completo | Generada con IA en `entregables/promo.png` (1376×768 PNG) con paleta de identidad y URL exacta legible `https://yoel-portfolio.github.io/yoel-portfolio/` sin alterar el logo SVG oficial. |
| 18 | Criterio del docente | 5 | Pendiente | Evaluación exclusiva del profesor; nunca acreditada automáticamente. |

## Condiciones adicionales (página 5 de la guía)
- Enfoque laboral full-stack mantenido; cero tarifas, paquetes freelance, métricas ficticias o niveles de dominio inventados.
- Código completo de la ampliación contenido en `proyecto/`, conservando intactos todos los archivos originales de la aplicación base en la raíz.
- Las dos propuestas de `propuestas/PROPUESTAS_AUTORIZACION.md` (`.github/workflows/deploy.yml` con `vars.VITE_CONTACT_ENDPOINT` y retirada del aviso «en construcción» con metadatos/pruebas ES/EN) ya fueron autorizadas por Yoel y aplicadas en el PR #1.
- El proyecto **no** se declara al 100 % ni publicado mientras falten la configuración y prueba real de recepción de `VITE_CONTACT_ENDPOINT`, la fusión del PR #1 para publicar y validar en GitHub Pages, la exposición y la evaluación docente.
