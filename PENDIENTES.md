# Pendientes y bloqueos reales del proyecto

Este archivo registra con transparencia todo lo que falta o depende de configuración, aprobación o entrega externa. No se omiten bloqueos ni se confunden pruebas simuladas con pruebas reales.

## 1. Configuración externa pendiente (Formulario de contacto)

- **Endpoint autorizado (`VITE_CONTACT_ENDPOINT`) y prueba real de recepción**:
  - El comportamiento del formulario (`react-hook-form` + `zod`, traducción inmediata `ES ↔ EN` de errores visibles, rechazo de respuestas inesperadas como HTTP 200 HTML, JSON mal formado o JSON sin confirmación conservando los datos para reintento, y confirmación exclusiva del contrato JSON de Formspree `{ "ok": true }`) fue verificado en Playwright con **respuestas HTTP interceptadas/simuladas** y bloqueo de peticiones externas.
  - Bloqueo actual: todavía no hay un endpoint externo autorizado configurado en `VITE_CONTACT_ENDPOINT` ni se ha ejecutado una prueba real de envío y recepción de correo.
  - Acción necesaria: facilitar el endpoint público de Formspree (`https://formspree.io/f/<id>`), comprobar la compilación con `VITE_CONTACT_ENDPOINT`, configurarlo en GitHub Actions Variables como `vars.VITE_CONTACT_ENDPOINT` (previsto en la Propuesta 1 de `propuestas/PROPUESTAS_AUTORIZACION.md`) y realizar una prueba real de recepción en `yoerojas03@gmail.com` únicamente cuando Yoel la autorice.

## 2. Revisión del PR #1, aprobación de propuestas y publicación

- **Estado en GitHub**:
  - La rama `feat/portafolio-final` y el Pull Request #1 (`https://github.com/yoel-portfolio/yoel-portfolio/pull/1`) hacia `codex/portafolio-base` **ya existen** y se mantienen abiertos sin fusionar (con ambos CV PDF ES/EN ya integrados y verificados).
- **Pendiente de aprobación explícita de Yoel**:
  - Revisar y aprobar el PR #1.
  - Decidir cuándo activar las propuestas de `propuestas/PROPUESTAS_AUTORIZACION.md`:
    1. Actualizar `.github/workflows/deploy.yml` para compilar `proyecto/` con `--base=/yoel-portfolio/` y `VITE_CONTACT_ENDPOINT: ${{ vars.VITE_CONTACT_ENDPOINT }}`.
    2. Retirar el aviso «Portafolio en construcción» y actualizar los metadatos para la salida a producción.
  - Fusionar en `codex/portafolio-base` para disparar la publicación en GitHub Pages y validar la URL pública `https://yoel-portfolio.github.io/yoel-portfolio/`.

## 3. Entregables del estudiante y evaluación docente (no acreditables automáticamente)

- **Exposición (2 pts)**: requiere preparación oral/video por parte de Yoel y entrega de `entregables/portafolio.txt` en Moodle en la fecha docente.
- **Criterio del docente (5 pts)**: evaluación exclusiva del profesor; nunca se marca como completada por código.
- **Confirmación del eslogan**: «Código que impulsa ideas» se conservó intacto como en la base; sigue pendiente de confirmación final si Yoel desea modificarlo.
