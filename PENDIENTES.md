# Pendientes y bloqueos reales del proyecto

Este archivo registra con transparencia todo lo que falta o depende de configuración/entrega externa. No se omiten bloqueos ni se simulan resultados.

## 1. Archivos faltantes que debe aportar Yoel

- **Currículum Vitae en PDF (ES y EN)**:
  - En el repositorio base y los adjuntos actuales no existen los CV aprobados en español e inglés.
  - Estado actual en `proyecto/`: la ruta preparada es `proyecto/public/cv/cv-yoel-es.pdf` y `proyecto/public/cv/cv-yoel-en.pdf`, con `available: false` en `proyecto/src/data/portfolioData.ts` para evitar enlaces rotos (`404`).
  - Acción necesaria: colocar ambos PDF aprobados en `proyecto/public/cv/` y cambiar `available: true` en `proyecto/src/data/portfolioData.ts` (o confirmar las URL públicas definitivas).

## 2. Configuración externa pendiente (Formulario de contacto)

- **Endpoint de envío estático (`VITE_CONTACT_ENDPOINT`)**:
  - El formulario programado con `react-hook-form` + `zod` valida correctamente en el cliente y está listo para enviar peticiones `POST` JSON (`Accept: application/json`) a un servicio compatible con alojamiento estático (por ejemplo Formspree o Web3Forms).
  - Bloqueo actual: no se proporcionó cuenta ni endpoint externo, y según las reglas está prohibido crear cuentas de terceros o enviar pruebas externas sin autorización.
  - Acción necesaria: crear o facilitar el endpoint público y configurarlo como variable `VITE_CONTACT_ENDPOINT` en el entorno de compilación / GitHub Actions Variables (`vars.VITE_CONTACT_ENDPOINT`) antes de activar envíos reales.

## 3. Repositorio Git, rama `feat/portafolio-final` y Pull Request

- **Acceso Git en el entorno actual**:
  - El entorno de ejecución de Google AI Studio proporcionó los archivos del proyecto sin directorio `.git` ni credenciales de GitHub para autenticar `push` o abrir un Pull Request.
  - Acción necesaria: desde una copia clonada de `https://github.com/yoel-portfolio/yoel-portfolio` en la rama base `codex/portafolio-base` (HEAD comprobado `b7f3183952e7126a2895bd559423ddda3db19ea3`), crear la rama `feat/portafolio-final`, copiar `proyecto/`, `CAMBIOS.md`, `VERIFICACION.md`, `CUMPLIMIENTO.md`, `PENDIENTES.md`, `entregables/` y `propuestas/`, verificar que `proyecto/node_modules/` y `proyecto/dist/` estén excluidos por `.gitignore`, hacer commit, push únicamente a `feat/portafolio-final` y abrir el PR hacia `codex/portafolio-base` sin fusionar.

## 4. Entregables del estudiante y evaluación docente (no acreditables automáticamente)

- **Exposición (2 pts)**: requiere preparación oral/video por parte de Yoel y entrega del archivo TXT en Moodle en la fecha docente.
- **Criterio del docente (5 pts)**: evaluación exclusiva del profesor; nunca se marca como completada por código.
- **Publicación final y retirada del aviso «en construcción»**: quedan pendientes hasta la revisión de ChatGPT, la aprobación de Yoel y la autorización para aplicar las propuestas en `propuestas/PROPUESTAS_AUTORIZACION.md`.
- **Confirmación del eslogan**: «Código que impulsa ideas» se conservó intacto como en la base; sigue marcado en `src/content.ts` y `README.md` como pendiente de confirmación final si Yoel desea cambiarlo.
