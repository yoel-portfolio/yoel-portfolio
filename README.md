# Yoel — portafolio one-page

Homepage en construcción para la Tarea 2 de Identidad Visual Web. Aplicación estática con React, TypeScript, Vite y Tailwind CSS. Incluye la identidad original de Yoel, perfil profesional, contactos reales, navegación por anclas y selector de tema. No requiere backend, base de datos ni variables de entorno.

Repositorio de destino: [yoel-portfolio/portafolio-web](https://github.com/yoel-portfolio/portafolio-web). El repositorio `.github` de la organización se reserva para su presentación; el código del portafolio pertenece a `portafolio-web`.

## Ejecutar

Requisitos: Node.js 22.12 o posterior (verificado con Node 24) y npm.

Una vez que el código esté subido y tengas acceso al repositorio, podés obtenerlo con:

```sh
git clone --branch codex/portafolio-base https://github.com/yoel-portfolio/portafolio-web.git
cd portafolio-web
```

Desde la carpeta del proyecto:

```sh
npm ci
npm run dev
```

Abrí la dirección local que muestra Vite, normalmente `http://127.0.0.1:5173`. Para instalar por primera vez sin un archivo de bloqueo se puede usar `npm install`; el repositorio ya incluye `package-lock.json` para instalaciones reproducibles.

```sh
npm run build
npm run preview
```

`build` verifica TypeScript y genera `dist/`. `preview` sirve esa compilación, normalmente en `http://127.0.0.1:4173`. Estas direcciones son locales: la web todavía no está publicada.

## Archivos principales

| Archivo | Función |
| --- | --- |
| `src/App.tsx` | Cabecera, portada, perfil, contacto y pie; componentes sencillos y secciones existentes `#perfil` y `#contacto`. |
| `src/content.ts` | Perfil, tecnologías, contactos y **slogan pendiente de confirmación**. |
| `src/styles.css` | Tailwind, variables semánticas, tipografía, composición adaptable, foco y movimiento reducido. |
| `src/useTheme.ts` | Preferencia del sistema, selección persistente y sincronización entre pestañas. |
| `src/components/Icon.tsx` | Pequeños íconos de interfaz, independientes del logotipo. |
| `src/main.tsx` | Entrada de React y fuentes locales Montserrat 600/700 y Roboto 400/500. |
| `index.html` | Idioma, metadatos, favicon e inicialización del tema antes del render. |
| `public/brand/` | Los dos logotipos SVG y ambos favicons originales, sin modificación. |
| `docs/identidad/` | Contenido original completo de Recursos_Yoel.zip; conserva misión, visión, valores, tokens y fondos para siguientes etapas. |
| `vite.config.ts` | React, Tailwind y rutas relativas para despliegue estático. |
| `tests/portfolio.spec.ts` | Verificaciones de navegador en escritorio y móvil. |

## Identidad y accesibilidad

Los colores de marca son azul y verde; el blanco hielo es el fondo neutro del tema claro. Las variables separan fondo, superficies, texto, marca y acento. En oscuro, el azul de marca `#3B82F6` se usa en gráficos y `#93C5FD` en texto para mejorar su contraste. Los botones verdes llevan texto `#0F172A`. El SVG de la Y se conserva intacto; las diagonales y la cuadrícula son decoración CSS.

El título utiliza Montserrat 700 de 40 px en escritorio y 32 px en móvil; las secciones, Montserrat 600 de 28/24 px; el slogan, Montserrat 600 de 20 px. Los párrafos usan Roboto 400 de 16 px y 24 px de interlineado; navegación y botones, Roboto 500 de 16 px. Los tamaños están en rem. Las fuentes se sirven desde el propio sitio y no necesitan Google Fonts ni otras solicitudes externas.

El tema sigue al sistema hasta que se elige uno manualmente. El botón «Modo oscuro» expone `aria-pressed` y funciona con Enter o Espacio. La elección se guarda en `localStorage` bajo `yoel-theme`. Si el navegador bloquea el almacenamiento, el selector sigue funcionando durante la sesión. Para volver al comportamiento automático, se puede eliminar esa clave desde las herramientas del navegador. El logo y el color del navegador cambian con el tema.

Se incluyen salto al contenido, foco visible, HTML semántico, nombres accesibles y respeto por `prefers-reduced-motion`. WhatsApp abre una pestaña nueva e informa de ello a lectores de pantalla.

## Verificación

Resultados de esta entrega y contrastes medidos: [docs/VERIFICACION.md](docs/VERIFICACION.md).

```sh
npx playwright install chromium
npm run build
npm test
```

Las pruebas sirven la compilación de producción y revisan ambos temas en escritorio (1440 px) y móvil (390 px), fuentes, imágenes y favicons, errores de consola y HTTP, enlaces, anclas, teclado, persistencia, almacenamiento bloqueado, contraste y otras reglas WCAG A/AA con axe. También comprueban desbordamiento en 320/768/1024 px y texto al 200 %. Las capturas quedan en `test-results/`, que no se versiona. La comprobación automatizada complementa la revisión visual; no equivale a una certificación de accesibilidad.

Para comprobar una ruta de GitHub Pages en PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_PATH = '/portafolio-web/'
npm test
Remove-Item Env:PLAYWRIGHT_BASE_PATH
```

## Publicación posterior

La configuración `base: './'` permite servir `dist/` tanto en la raíz de un dominio como en una subcarpeta. Los recursos públicos usan `import.meta.env.BASE_URL` o `%BASE_URL%`; conservá ese patrón para nuevos archivos. Las futuras secciones se añaden a la misma página y solo entonces se incorporan sus anclas al menú.

**Vercel:** importar el repositorio, seleccionar Vite, usar `npm ci` como instalación, `npm run build` como compilación y `dist` como carpeta de salida. No se necesitan reescrituras porque no hay rutas adicionales.

**GitHub Pages:** después de subir el repositorio, seleccionar GitHub Actions en Settings → Pages. Preparar un flujo que haga checkout, configure Node 24, ejecute `npm ci` y `npm run build`, cargue `dist` con `actions/upload-pages-artifact` y publique con `actions/deploy-pages`. El trabajo de publicación necesita los permisos `pages: write` e `id-token: write` y el entorno `github-pages`. Confirmar los nombres del repositorio y de la rama al configurar el flujo. No es necesario versionar `dist`.

Referencia oficial: [despliegue estático de Vite](https://vite.dev/guide/static-deploy.html) y [integración de Tailwind con Vite](https://tailwindcss.com/docs/installation/using-vite).

## Pendientes

- Confirmar «Código que impulsa ideas»; se cambia en `src/content.ts`, sin etiquetas de estado en la interfaz.
- Incorporar proyectos reales y nuevas secciones dentro de esta misma página.
- Confirmar y añadir perfiles profesionales cuando existan sus URL.
- Completar la subida a `yoel-portfolio/portafolio-web` cuando esté disponible el acceso al repositorio configurado como `origin`.
- Publicar en GitHub Pages o Vercel y verificar la URL real; subir el código a GitHub no publica por sí solo el sitio web.
- Preparar el PDF académico en una etapa posterior. El PDF de `docs/identidad/` es el recurso de presentación original del ZIP, no una entrega generada.
