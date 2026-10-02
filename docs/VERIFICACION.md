# Verificación de la base del portafolio

Validación realizada sobre la compilación de producción, con Chromium mediante Playwright. Entorno: Windows, Node 24.19.0 y npm 11.17.0.

## Resultados

- `npm run build`: correcto; TypeScript sin errores y recursos generados en `dist/`.
- `npm test`: 12 pruebas aprobadas en la raíz `/`.
- `PLAYWRIGHT_BASE_PATH=/yoel-portfolio/` y `npm test`: comprobación de la subruta de GitHub Pages, incluyendo SVG, fuentes y favicons, con la compilación `npm run build -- --base=/yoel-portfolio/`.
- Escritorio de 1440 px y móvil de 390 px: capturas revisadas visualmente en modo claro y oscuro.
- Sin desbordamiento horizontal a 320, 390, 768, 1024 y 1440 px; texto ampliado al 200 % comprobado a 390 px.
- Tema inicial del sistema, cambios del sistema sin elección guardada, alternancia con Enter y Espacio y persistencia tras recarga: correctos.
- Almacenamiento bloqueado: el selector sigue funcionando durante la sesión.
- Navegación a perfil y contacto, salto al contenido, foco visible y movimiento reducido: correctos.
- Enlaces verificados: `mailto:yoerojas03@gmail.com` y `https://wa.me/50683904194`. No se enviaron mensajes.
- Montserrat 600/700 y Roboto 400/500: cargadas desde archivos locales. Título de 40/32 px e interlineado de párrafos de 24 px comprobados.
- Ningún error de aplicación, consola ni respuesta HTTP fallida en las comprobaciones de contenido.
- axe con reglas WCAG 2 A/AA y 2.1 AA: cero infracciones detectadas en ambos temas y tamaños. No constituye una certificación ni sustituye pruebas con usuarios y tecnologías de asistencia.
- Hashes de los dos logotipos y ambos favicons: las copias públicas coinciden con los originales conservados en `docs/identidad/`.

## Contraste medido

Relaciones calculadas a partir de los colores renderizados en el navegador. Las combinaciones de texto comprobadas superan 4.5:1, incluso donde el tamaño grande permitiría 3:1.

| Combinación | Claro | Oscuro |
| --- | --- | --- |
| Texto principal / fondo | 17.06:1 | 17.06:1 |
| Texto secundario / fondo | 7.24:1 | 9.90:1 |
| Título azul / fondo | 4.94:1 | 9.90:1 |
| Etiqueta de estado / superficie verde suave | 4.92:1 | 7.50:1 |
| Texto del botón / verde | 7.04:1 | 7.04:1 |
| Texto del botón / verde al pasar el cursor | 9.29:1 | 9.29:1 |
| Tecnologías / superficie | 7.58:1 | 9.01:1 |
| Etiquetas de contacto / fondo | 7.24:1 | 9.90:1 |

Las capturas reproducibles de las pruebas están en `test-results/`. Esa carpeta se regenera con cada ejecución y está excluida de Git. Los comandos de instalación y ejecución se documentan en el [README](../README.md).

## Límites de esta entrega

La emulación móvil se realiza en Chromium; no es una prueba en un dispositivo físico ni en Safari o Firefox. La prueba de la subruta local no confirma por sí sola la publicación: el workflow y la URL pública se verifican por separado. No se generó el PDF académico; el PDF de identidad procede del ZIP original.
