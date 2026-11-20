# Propuestas autorizadas y aplicadas en el PR #1

> **Estado actual**: Yoel autorizó explícitamente ambas propuestas para preparar la publicación en el PR #1 (`feat/portafolio-final` → `codex/portafolio-base`). Ya fueron aplicadas en la rama de trabajo; el PR sigue abierto **sin fusionar ni publicar** hasta la aprobación final.

---

## Propuesta 1: Ajuste de `.github/workflows/deploy.yml` para compilar `proyecto/` (**Aplicada**)

El workflow `.github/workflows/deploy.yml` fue actualizado con el parche exacto indicado abajo (se dispara únicamente en `push` a `codex/portafolio-base` o mediante `workflow_dispatch`, por lo que subir commits a `feat/portafolio-final` no dispara despliegue automático).

Usa `working-directory: proyecto`, inyecta `VITE_CONTACT_ENDPOINT` desde las variables de GitHub Actions (`vars.VITE_CONTACT_ENDPOINT`) en el paso de compilación y mantiene la URL pública `/yoel-portfolio/` sin incluir el nombre `proyecto/` en la ruta:

```diff
--- a/.github/workflows/deploy.yml
+++ b/.github/workflows/deploy.yml
@@ -27,13 +27,20 @@
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
@@ -42,7 +49,7 @@
       - name: Subir el sitio compilado
         uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5
         with:
-          path: dist
+          path: proyecto/dist
 
   deploy:
     name: Publicar
```

> Nota: Si la variable de repositorio `VITE_CONTACT_ENDPOINT` aún no está definida en GitHub Actions, `${{ vars.VITE_CONTACT_ENDPOINT }}` se evalúa como cadena vacía y la compilación continúa sin fallar, manteniendo el formulario en estado pendiente (el envío real de mensajes queda pendiente hasta configurar un endpoint autorizado). Las pruebas automáticas (`npm test`) nunca contactan servicios externos aunque la variable esté definida.

---

## Propuesta 2: Retirada del aviso «en construcción» y actualización de metadatos (**Aplicada**)

Con autorización explícita de Yoel, se reemplazaron en `proyecto/index.html`, `proyecto/src/i18n.ts`, `proyecto/tests/portfolio.spec.ts` y `proyecto/tests/extensions.spec.ts` los textos temporales (`Portafolio en construcción`, `UN NUEVO ESPACIO, EN CAMINO` y equivalentes en inglés) por la versión de publicación:

### 2.1 `proyecto/index.html`

- `<title>`: `Yoel | Ingeniero de software full-stack`
- `<meta name="description">`: `Soy Yoel Alexander Rojas Arguedas, ingeniero de software full-stack. Conocé mi perfil, habilidades técnicas, proyectos y medios de contacto.`
- `og:title`: `Yoel | Portafolio profesional`
- `og:description`: `Ingeniero de software con enfoque en desarrollo full-stack: Java, Spring Boot, React, TypeScript, PostgreSQL y Docker.`

### 2.2 `proyecto/src/i18n.ts` (Inicio y metadatos dinámicos)

- `meta.title` (ES): `Yoel | Ingeniero de software full-stack` (EN: `Yoel | Full-Stack Software Engineer`)
- `meta.description` / `og:title` / `og:description`: actualizados dinámicamente en ES y EN al alternar idioma.
- `hero.statusBadge` (ES): `DISPONIBLE PARA OPORTUNIDADES` (EN: `OPEN TO OPPORTUNITIES`)
- `hero.titleMain` / `hero.titleHighlight` (ES): `Ingeniero de software` / `full-stack` (EN: `Full-stack` / `software engineer`)
- `hero.announcement` (ES): `Diseño y construyo aplicaciones web mantenibles en frontend y backend, con bases de datos relacionales e integración continua.` (EN: `I design and build maintainable frontend and backend web applications with relational databases and continuous integration.`)

> Nota: Las aserciones correspondientes en `proyecto/tests/portfolio.spec.ts` (`h1`) y `proyecto/tests/extensions.spec.ts` (título, metadatos, insignia y ausencia de textos «en construcción» en ES/EN) quedaron actualizadas y verificadas.
