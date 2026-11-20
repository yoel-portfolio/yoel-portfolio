# Pendientes y bloqueos reales del proyecto

Este archivo registra con transparencia todo lo que falta o depende de configuración, aprobación o entrega externa. No se omiten bloqueos ni se confunden pruebas simuladas con pruebas reales.

## 1. Configuración externa pendiente (Formulario de contacto)

- **Endpoint autorizado (`VITE_CONTACT_ENDPOINT`) y prueba real de recepción**:
  - El comportamiento del formulario (`react-hook-form` + `zod`, traducción inmediata `ES ↔ EN` de errores visibles, rechazo de respuestas inesperadas como HTTP 200 HTML, JSON mal formado o JSON sin confirmación conservando los datos para reintento, y confirmación exclusiva del contrato JSON de Formspree `{ "ok": true }`) fue verificado en Playwright con **respuestas HTTP interceptadas/simuladas** y bloqueo de peticiones externas.
  - Yoel facilitó el endpoint y confirmó que guardó `VITE_CONTACT_ENDPOINT` en GitHub Actions. La compilación local con ese endpoint funciona; el primer intento real no recibió una respuesta HTTP y la entrega sigue sin confirmarse.
  - Acción necesaria: revisar la lista de envíos de Formspree y la bandeja de destino. La integración React usa `FormData` con espera limitada y sin reenvíos automáticos. Confirmar la recepción de la versión ajustada mediante una única prueba nueva solo cuando Yoel la autorice.

## 2. Fusión del PR #1, publicación y verificación en la URL pública

- **Estado en GitHub**:
  - La rama `feat/portafolio-final` y el Pull Request #1 (`https://github.com/yoel-portfolio/yoel-portfolio/pull/1`) hacia `codex/portafolio-base` **ya están listos para publicación** (ambos CV PDF ES/EN integrados, `.github/workflows/deploy.yml` actualizado para compilar `proyecto/` con `vars.VITE_CONTACT_ENDPOINT`, y aviso «en construcción» retirado junto con metadatos y pruebas ES/EN). El PR permanece abierto **sin fusionar ni publicar**.
- **Pendiente de aprobación final de Yoel**:
  - Fusionar el PR #1 en `codex/portafolio-base` para disparar el workflow de GitHub Pages.
  - Verificar en la URL pública `https://yoel-portfolio.github.io/yoel-portfolio/` la carga general, ambas descargas de CV PDF (ES/EN) y el formulario (con `VITE_CONTACT_ENDPOINT` una vez configurado).

## 3. Entregables del estudiante y evaluación docente (no acreditables automáticamente)

- **Exposición (2 pts)**: requiere preparación oral/video por parte de Yoel y entrega de `entregables/portafolio.txt` en Moodle en la fecha docente.
- **Criterio del docente (5 pts)**: evaluación exclusiva del profesor; nunca se marca como completada por código.
- **Confirmación del eslogan**: «Código que impulsa ideas» se conservó intacto como en la base; sigue pendiente de confirmación final si Yoel desea modificarlo.
