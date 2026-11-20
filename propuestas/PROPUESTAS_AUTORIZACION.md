# Propuestas separadas pendientes de autorización de Yoel

Este documento contiene los cambios sobre archivos o textos **protegidos** de la base que **NO** fueron activados automáticamente. Requieren revisión y autorización explícita de Yoel antes de fusionar o publicar.

---

## Propuesta 1: Ajuste de `.github/workflows/deploy.yml` para compilar `proyecto/`

El workflow original en `.github/workflows/deploy.yml` permanece intacto y se dispara únicamente en `push` a `codex/portafolio-base` o mediante `workflow_dispatch`. No se ha modificado ni ejecutado.

Cuando Yoel autorice publicar la ampliación contenida en `proyecto/`, se propone actualizar `.github/workflows/deploy.yml` usando `working-directory: proyecto`, inyectando `VITE_CONTACT_ENDPOINT` desde las variables de GitHub Actions (`vars.VITE_CONTACT_ENDPOINT`) en el paso de compilación y manteniendo la URL pública `/yoel-portfolio/` sin incluir el nombre `proyecto/` en la ruta:

```diff
--- a/.github/workflows/deploy.yml
+++ b/.github/workflows/deploy.yml
@@ -27,19 +27,26 @@ jobs:
         with:
           node-version: '24'
           cache: npm
+          cache-dependency-path: proyecto/package-lock.json
       - name: Instalar dependencias
+        working-directory: proyecto
         run: npm ci
       - name: Compilar para la subruta de Pages
+        working-directory: proyecto
+        env:
+          VITE_CONTACT_ENDPOINT: ${{ vars.VITE_CONTACT_ENDPOINT }}
         run: npm run build -- --base=/yoel-portfolio/
       - name: Instalar Chromium para las verificaciones
+        working-directory: proyecto
         run: npx playwright install --with-deps chromium
       - name: Verificar escritorio, móvil y recursos bajo la subruta
+        working-directory: proyecto
         run: npm test
         env:
           PLAYWRIGHT_BASE_PATH: /yoel-portfolio/
       - name: Leer la configuración de Pages
         uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6
       - name: Subir el sitio compilado
         uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5
         with:
-          path: dist
+          path: proyecto/dist
```

> Nota: Si la variable de repositorio `VITE_CONTACT_ENDPOINT` aún no está definida en GitHub Actions, `${{ vars.VITE_CONTACT_ENDPOINT }}` se evalúa como cadena vacía y la compilación continúa sin fallar, manteniendo el formulario en estado pendiente (el envío real de mensajes queda pendiente hasta configurar un endpoint autorizado). Las pruebas automáticas (`npm test`) nunca contactan servicios externos aunque la variable esté definida.

---

## Propuesta 2: Retirada del aviso «en construcción» y actualización de metadatos

En `proyecto/index.html` y `proyecto/src/i18n.ts` se conservaron intactos los textos protegidos actuales (`Portafolio en construcción`, `UN NUEVO ESPACIO, EN CAMINO` y los metadatos originales).

Una vez que Yoel y ChatGPT aprueben el contenido completo (y se adjunten los CV PDF si aplica), se propone este reemplazo de salida a producción:

### 2.1 `proyecto/index.html`

- `<title>`: `Yoel | Ingeniero de software full-stack`
- `<meta name="description">`: `Soy Yoel Alexander Rojas Arguedas, ingeniero de software full-stack. Conocé mi perfil, habilidades técnicas, proyectos y medios de contacto.`
- `og:title`: `Yoel | Portafolio profesional`
- `og:description`: `Ingeniero de software con enfoque en desarrollo full-stack: Java, Spring Boot, React, TypeScript, PostgreSQL y Docker.`

### 2.2 `proyecto/src/i18n.ts` (Inicio)

- `hero.statusBadge` (ES): `DISPONIBLE PARA OPORTUNIDADES` (EN: `OPEN TO OPPORTUNITIES`)
- `hero.titleMain` / `hero.titleHighlight` (ES): `Ingeniero de software` / `full-stack` (EN: `Full-stack` / `software engineer`)
- `hero.announcement` (ES): `Diseño y construyo aplicaciones web mantenibles en frontend y backend, con bases de datos relacionales e integración continua.` (EN: `I design and build maintainable frontend and backend web applications with relational databases and continuous integration.`)

> Nota: Si se aprueba esta Propuesta 2, deberá actualizarse la aserción correspondiente en `proyecto/tests/portfolio.spec.ts` (`h1` igual al nuevo título aprobado) únicamente con autorización expresa de Yoel.
