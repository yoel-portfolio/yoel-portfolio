import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { cvConfig } from '../src/data/portfolioData'

const MOCK_CONTACT_ENDPOINT = 'https://contact-test.invalid/submit'
const basePath = process.env.PLAYWRIGHT_BASE_PATH || '/'
const isPublishedRun = Boolean(process.env.PLAYWRIGHT_BASE_URL)
const UNCONFIGURED_TEST_URL = `http://127.0.0.1:4174${basePath}`
const CONFIGURED_TEST_URL = `http://127.0.0.1:4175${basePath}`
const projectRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test.beforeEach(async ({ page, baseURL }) => {
  const allowedOrigins = new Set<string>([
    baseURL ? new URL(baseURL).origin : 'http://127.0.0.1:4173',
    'http://127.0.0.1:4174',
    'http://127.0.0.1:4175',
  ])

  // Bloquea cualquier envío o petición externa real aunque el entorno tenga VITE_CONTACT_ENDPOINT.
  await page.route('**/*', async (route) => {
    const request = route.request()
    const origin = new URL(request.url()).origin
    if (allowedOrigins.has(origin) && request.method() === 'GET') {
      await route.continue()
      return
    }
    await route.abort('blockedbyclient')
  })
})

test('cinco secciones, misión/visión/valores, GitHub y ausencia de 6ta sección', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('main section')).toHaveCount(5)
  await expect(page.locator('#perfil')).toContainText('Misión')
  await expect(page.locator('#perfil')).toContainText('Visión')
  await expect(page.locator('#perfil')).toContainText('Responsabilidad:')
  await expect(page.locator('#habilidades')).toContainText('Habilidades técnicas y personales')
  await expect(page.locator('#proyectos')).toContainText('OrderMS y PaymentMS')
  await expect(page.locator('#proyectos')).toContainText('Velocity')
  await expect(page.locator('#proyectos')).toContainText('Sistema de gestión académica')

  const bodyText = await page.locator('body').innerText()
  expect(bodyText).not.toContain('VITE_CONTACT_ENDPOINT')
  expect(bodyText).not.toMatch(/alojamiento estático/i)
  expect(bodyText).not.toMatch(/métricas ni demos ficticias/i)

  const github = page.locator('#contacto').getByRole('link', { name: /GitHub/ })
  await expect(github).toHaveAttribute('href', 'https://github.com/yoel-portfolio/yoel-portfolio')
  await expect(github).toHaveAttribute('target', '_blank')
})

test('compilación pública no expone ganchos de prueba para sustituir el destino del formulario', async ({ page }) => {
  const scriptBodies: string[] = []
  page.on('response', async (response) => {
    if (response.request().resourceType() === 'script' && response.ok()) {
      scriptBodies.push(await response.text())
    }
  })

  let hijackedRequests = 0
  await page.route('https://hijack-test.invalid/**', async (route) => {
    hijackedRequests += 1
    await route.abort('blockedbyclient')
  })

  await page.addInitScript(() => {
    ;(window as unknown as Record<string, unknown>).__YOEL_TEST_CONTACT_ENDPOINT__ =
      'https://hijack-test.invalid/steal'
  })

  await page.goto('./')
  expect(scriptBodies.length).toBeGreaterThan(0)
  for (const scriptText of scriptBodies) {
    expect(scriptText).not.toContain('__YOEL_TEST_CONTACT_ENDPOINT__')
  }

  if (!isPublishedRun) {
    const distAssetsDir = path.join(projectRootDir, 'dist', 'assets')
    const jsFiles = fs.readdirSync(distAssetsDir).filter((file) => file.endsWith('.js'))
    expect(jsFiles.length).toBeGreaterThan(0)
    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8')
      expect(content).not.toContain('__YOEL_TEST_CONTACT_ENDPOINT__')
      expect(content).not.toContain('contact-test.invalid')
    }
  }

  const form = page.locator('#contacto form')
  await form.getByLabel('Nombre completo').fill('Ana Pérez')
  await form.getByLabel('Correo electrónico').fill('ana@example.com')
  await form.getByLabel('Mensaje').fill('Mensaje de prueba para comprobar que el destino no es alterable.')
  await form.getByRole('button', { name: 'Enviar mensaje' }).click()

  expect(hijackedRequests).toBe(0)
})

test('selector de idioma ES/EN, persistencia y restauración exacta en español', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page).toHaveTitle('Yoel | Ingeniero de software full-stack')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Soy Yoel Alexander Rojas Arguedas, ingeniero de software full-stack. Conocé mi perfil, habilidades técnicas, proyectos y medios de contacto.',
  )
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Yoel | Portafolio profesional')
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    'Ingeniero de software con enfoque en desarrollo full-stack: Java, Spring Boot, React, TypeScript, PostgreSQL y Docker.',
  )
  await expect(page.locator('section.hero .status-badge')).toContainText('DISPONIBLE PARA OPORTUNIDADES')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ingeniero de software full-stack')
  await expect(page.locator('body')).not.toContainText(/en construcción|en camino/i)

  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('Yoel | Full-Stack Software Engineer')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'I am Yoel Alexander Rojas Arguedas, a full-stack software engineer. Explore my profile, technical skills, projects, and contact details.',
  )
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Yoel | Professional Portfolio')
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    'Software engineer focused on full-stack development: Java, Spring Boot, React, TypeScript, PostgreSQL, and Docker.',
  )
  await expect(page.locator('section.hero .status-badge')).toContainText('OPEN TO OPPORTUNITIES')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Full-stack software engineer')
  await expect(page.locator('body')).not.toContainText(/under construction|on the way/i)
  await expect(page.locator('#habilidades h2')).toHaveText('Technical and Personal Skills')
  expect(await page.evaluate(() => localStorage.getItem('yoel-lang'))).toBe('en')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('Yoel | Full-Stack Software Engineer')
  await page.getByRole('button', { name: 'ES', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page).toHaveTitle('Yoel | Ingeniero de software full-stack')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ingeniero de software full-stack')
  await expect(page.locator('.profile-copy')).toHaveText(
    'Ingeniero de software con enfoque en desarrollo full-stack. Desarrollo aplicaciones con C#, Java y JavaScript, utilizando React, Angular, Node.js y Spring Boot. Trabajo con HTML, CSS y bases de datos PostgreSQL y MySQL, e integro Docker y CI/CD para facilitar la entrega de software.',
  )
})

const cvExpectations = {
  es: { button: 'ES', readyLabel: 'Descargar CV', pendingLabel: 'CV en PDF (ES) — próximamente', file: 'cv-yoel-es.pdf' },
  en: { button: 'EN', readyLabel: 'Download CV', pendingLabel: 'Resume PDF (EN) — coming soon', file: 'cv-yoel-en.pdf' },
} as const

test('CV: la configuración coincide con los PDF presentes en public/cv (sin enlaces rotos)', () => {
  const hashes: string[] = []
  for (const lang of ['es', 'en'] as const) {
    const filePath = path.join(projectRootDir, 'public', cvConfig[lang].path)
    expect(cvConfig[lang].path).toBe(`cv/${cvExpectations[lang].file}`)
    // Solo se activa la descarga de un idioma si su PDF existe; si no, queda pendiente.
    expect(cvConfig[lang].available, `available (${lang}) debe reflejar si existe ${filePath}`).toBe(fs.existsSync(filePath))
    if (cvConfig[lang].available) {
      const bytes = fs.readFileSync(filePath)
      expect(bytes.subarray(0, 5).toString('latin1')).toBe('%PDF-')
      hashes.push(crypto.createHash('sha256').update(bytes).digest('hex'))
    }
  }
  if (hashes.length === 2) expect(hashes[0]).not.toBe(hashes[1])
})

test('CV: botón por idioma ES -> EN -> ES descarga el PDF correcto o muestra pendiente sin enlace', async ({
  page,
  baseURL,
}) => {
  await page.goto('./')
  const hero = page.locator('section.hero')

  for (const lang of ['es', 'en', 'es'] as const) {
    const expected = cvExpectations[lang]
    await page.getByRole('button', { name: expected.button, exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', lang)

    if (!cvConfig[lang].available) {
      await expect(hero.locator('a.cv-control-ready')).toHaveCount(0)
      await expect(hero.locator('.cv-control')).toHaveText(expected.pendingLabel)
      continue
    }

    const link = hero.getByRole('link', { name: expected.readyLabel, exact: true })
    await expect(link).toBeVisible()
    await expect(hero).not.toContainText(/próximamente|coming soon/i)
    await expect(link).toHaveAttribute('download', '')
    const expectedHref = `${basePath}cv/${expected.file}`
    await expect(link).toHaveAttribute('href', expectedHref)

    // El servidor debe entregar un PDF real, no la página HTML de respaldo con estado 200.
    const response = await page.request.get(new URL(expectedHref, baseURL).toString())
    expect(response.status()).toBe(200)
    const contentType = response.headers()['content-type'] || ''
    expect(contentType).toContain('application/pdf')
    expect(contentType).not.toContain('text/html')
    const body = await response.body()
    expect(body.subarray(0, 5).toString('latin1')).toBe('%PDF-')
    const localBytes = fs.readFileSync(path.join(projectRootDir, 'public', cvConfig[lang].path))
    expect(crypto.createHash('sha256').update(body).digest('hex')).toBe(
      crypto.createHash('sha256').update(localBytes).digest('hex'),
    )

    const [download] = await Promise.all([page.waitForEvent('download'), link.click()])
    expect(download.suggestedFilename()).toBe(expected.file)
    const downloadedPath = await download.path()
    const downloaded = fs.readFileSync(downloadedPath)
    expect(downloaded.subarray(0, 5).toString('latin1')).toBe('%PDF-')
    expect(downloaded.equals(localBytes)).toBe(true)
  }
})

test('habilidades técnicas arriba y personales abajo, sin ilustración conceptual ni animación de flujo', async ({ page }) => {
  await page.goto('./')
  const hero = page.locator('section.hero')
  await expect(hero.getByRole('link')).toHaveCount(1)
  await expect(hero.getByRole('link', { name: 'Descargar CV', exact: true })).toBeVisible()
  await expect(hero.locator('.hero-description')).toBeVisible()

  const skills = page.locator('#habilidades')
  await expect(skills.locator('.section-intro')).toHaveCount(0)
  await expect(skills.locator('.skill-card')).toHaveCount(5)
  await expect(skills.locator('.personal-skill-card')).toHaveCount(4)
  await expect(skills.locator('.personal-skill-title').first()).toHaveText('Trabajo en equipo')
  await expect(skills.locator('.filter-pill')).toHaveCount(0)
  await expect(skills.locator('svg.arch-svg')).toHaveCount(0)
  await expect(skills.locator('.lottie-stage')).toHaveCount(0)

  // Habilidades técnicas aparece primero y personales debajo al desplazar
  const technicalBox = await skills.locator('.skills-block-technical').boundingBox()
  const personalBox = await skills.locator('.skills-block-personal').boundingBox()
  expect(technicalBox && personalBox).toBeTruthy()
  if (technicalBox && personalBox) {
    expect(personalBox.y).toBeGreaterThanOrEqual(technicalBox.y + technicalBox.height)
  }

  // Verifica que el scroll-reveal marque los bloques como revelados al desplazarse
  await skills.locator('.skills-block-personal').scrollIntoViewIfNeeded()
  await expect(skills.locator('.personal-skill-card').first()).toHaveAttribute('data-revealed', 'true')
})

test('galería de proyectos: los 3 proyectos sin filtros, botones alineados, ficha con cierre visible al desplazar, Tab/Shift+Tab y Escape', async ({
  page,
}, testInfo) => {
  await page.goto('./')
  const projects = page.locator('#proyectos')
  await expect(projects.locator('.project-card')).toHaveCount(3)
  await expect(projects.locator('.filter-pill')).toHaveCount(0)
  await expect(projects.getByRole('button', { name: /^(Todos|Backend|Frontend|Full-Stack)$/i })).toHaveCount(0)
  await expect(projects).not.toContainText(/Ilustración conceptual|Conceptual illustration/i)

  await projects.locator('.project-card').first().scrollIntoViewIfNeeded()
  await expect(projects.locator('.project-card').first()).toHaveAttribute('data-revealed', 'true')

  // Cada tarjeta muestra tecnologías principales (<= 4); la lista completa va en la ficha
  const cardTechCount = await projects.locator('.project-card').first().locator('.project-tech-list li').count()
  expect(cardTechCount).toBeLessThanOrEqual(4)

  // En escritorio, una vez completada la animación de entrada, los botones de las 3 tarjetas quedan alineados
  if (testInfo.project.name === 'escritorio') {
    await expect
      .poll(async () => {
        const detailBoxes = await Promise.all(
          [0, 1, 2].map((i) => projects.locator('.project-detail-btn').nth(i).boundingBox()),
        )
        const repoBoxes = await Promise.all(
          [0, 1, 2].map((i) => projects.locator('.project-repo-link').nth(i).boundingBox()),
        )
        if (!detailBoxes.every(Boolean) || !repoBoxes.every(Boolean)) return 999
        return Math.max(
          Math.abs(detailBoxes[0]!.y - detailBoxes[1]!.y),
          Math.abs(detailBoxes[1]!.y - detailBoxes[2]!.y),
          Math.abs(repoBoxes[0]!.y - repoBoxes[1]!.y),
          Math.abs(repoBoxes[1]!.y - repoBoxes[2]!.y),
        )
      })
      .toBeLessThanOrEqual(2)
  }

  const detailBtn = projects.locator('.project-detail-btn').first()
  await detailBtn.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('OrderMS y PaymentMS')
  // La ficha conserva la lista completa de tecnologías y el aporte detallado
  await expect(dialog.locator('.project-tech-list li')).toHaveCount(6)
  await expect(dialog).toContainText('order-placed / payment-processed')

  // El fondo queda inactivo mientras el modal está abierto
  await expect(page.locator('#root')).toHaveAttribute('inert', '')
  await expect(page.locator('#root')).toHaveAttribute('aria-hidden', 'true')
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')

  const headerCloseBtn = dialog.getByRole('button', { name: 'Cerrar detalle del proyecto' })
  const scrollBody = dialog.locator('.project-modal-body-scroll')
  const repoLink = dialog.getByRole('link', { name: /Repositorio en GitHub/ })
  const footerCloseBtn = dialog.getByRole('button', { name: 'Cerrar ficha' })

  // Al abrir, el foco entra en el modal
  await expect(headerCloseBtn).toBeFocused()

  // Al desplazar el contenido de la ficha, el botón de cierre permanece visible en pantalla
  const scrolled = await scrollBody.evaluate((el) => {
    el.scrollTop = 260
    return { scrollTop: el.scrollTop, scrollable: el.scrollHeight > el.clientHeight }
  })
  if (scrolled.scrollable) {
    expect(scrolled.scrollTop).toBeGreaterThan(0)
  }
  const closeBox = await headerCloseBtn.boundingBox()
  const viewport = page.viewportSize()
  expect(closeBox && viewport).toBeTruthy()
  if (closeBox && viewport) {
    expect(closeBox.y).toBeGreaterThanOrEqual(0)
    expect(closeBox.y + closeBox.height).toBeLessThanOrEqual(viewport.height)
  }

  // Recorrido hacia adelante con Tab (atrapado dentro del modal, incluyendo el cuerpo desplazable)
  await page.keyboard.press('Tab')
  await expect(scrollBody).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(repoLink).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(footerCloseBtn).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(headerCloseBtn).toBeFocused()

  // Recorrido hacia atrás con Shift+Tab (atrapado dentro del modal)
  await page.keyboard.press('Shift+Tab')
  await expect(footerCloseBtn).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(repoLink).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(scrollBody).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(headerCloseBtn).toBeFocused()

  // Cierre con Escape restaura fondo activo y devuelve foco al botón origen
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.locator('#root')).not.toHaveAttribute('inert', '')
  await expect(page.locator('#root')).not.toHaveAttribute('aria-hidden', 'true')
  await expect(detailBtn).toBeFocused()
})

test('cabecera responsiva (320, 390, 768 y 1440 px en ES/EN), teclado, ambos logos y sin solapamiento en contacto', async ({
  page,
}) => {
  await page.goto('./')

  // Comprueba que ambos logos cargan correctamente al alternar el tema
  const logo = page.locator('img.brand-logo')
  await expect(logo).toHaveAttribute('src', /logo-yoel-claro\.svg$/)
  expect(await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  await page.getByRole('button', { name: 'Modo oscuro' }).click()
  await expect(logo).toHaveAttribute('src', /logo-yoel-oscuro\.svg$/)
  expect(await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  await page.getByRole('button', { name: 'Modo oscuro' }).click()

  for (const langBtn of ['ES', 'EN'] as const) {
    await page.getByRole('button', { name: langBtn, exact: true }).click()

    // 320 y 390 px: logo, idioma y tema en fila superior + enlaces en cuadrícula 2 × 2 sin desbordamiento
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

      const logoBox = await page.locator('.brand-link').boundingBox()
      const controlsBox = await page.locator('.header-controls').boundingBox()
      expect(logoBox && controlsBox).toBeTruthy()
      if (logoBox && controlsBox) {
        expect(Math.abs(logoBox.y - controlsBox.y)).toBeLessThanOrEqual(16)
      }

      const navBoxes = await Promise.all([0, 1, 2, 3].map((i) => page.locator('.main-nav a').nth(i).boundingBox()))
      expect(navBoxes.every(Boolean)).toBe(true)
      if (navBoxes[0] && navBoxes[1] && navBoxes[2] && navBoxes[3]) {
        // Fila 1: enlaces 0 y 1; Fila 2: enlaces 2 y 3 (cuadrícula 2 × 2)
        expect(Math.abs(navBoxes[0].y - navBoxes[1].y)).toBeLessThanOrEqual(2)
        expect(Math.abs(navBoxes[2].y - navBoxes[3].y)).toBeLessThanOrEqual(2)
        expect(navBoxes[2].y).toBeGreaterThan(navBoxes[0].y + 20)
        for (const box of navBoxes) {
          expect(box!.height).toBeGreaterThanOrEqual(42)
        }
      }
    }

    // 768 y 1440 px: los 4 enlaces en una sola fila sin desbordamiento
    for (const width of [768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      const navBoxes = await Promise.all([0, 1, 2, 3].map((i) => page.locator('.main-nav a').nth(i).boundingBox()))
      expect(navBoxes.every(Boolean)).toBe(true)
      if (navBoxes[0] && navBoxes[1] && navBoxes[2] && navBoxes[3]) {
        expect(Math.abs(navBoxes[0].y - navBoxes[3].y)).toBeLessThanOrEqual(2)
      }
    }
  }

  // Navegación real del menú por teclado en móvil (390 px) con foco visible
  await page.getByRole('button', { name: 'ES', exact: true }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.brand-link').focus()
  await page.keyboard.press('Tab')
  const firstNavLink = page.locator('.main-nav a').first()
  await expect(firstNavLink).toBeFocused()
  await expect(firstNavLink).toHaveCSS('outline-style', 'solid')

  // Al bajar hasta el final de la página, los botones flotantes no tapan el botón enviar ni los enlaces de contacto
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const dockBox = await page.locator('.floating-dock').boundingBox()
  const submitBox = await page.locator('#contacto .form-submit-btn').boundingBox()
  expect(dockBox && submitBox).toBeTruthy()
  if (dockBox && submitBox) {
    const overlapsSubmit =
      submitBox.x < dockBox.x + dockBox.width &&
      submitBox.x + submitBox.width > dockBox.x &&
      submitBox.y < dockBox.y + dockBox.height &&
      submitBox.y + submitBox.height > dockBox.y
    expect(overlapsSubmit).toBe(false)
  }
})

test('formulario bilingüe: traduce errores visibles ES -> EN -> ES sin borrar datos ni validar campos intactos', async ({
  page,
}) => {
  await page.goto('./')
  const form = page.locator('#contacto form')
  const nameInput = form.locator('#contact-name')
  const emailInput = form.locator('#contact-email')
  const messageInput = form.locator('#contact-message')

  await nameInput.fill('Ana Pérez')
  await emailInput.fill('correo-invalido')
  await emailInput.blur()

  // Solo el campo validado (correo) muestra error; mensaje intacto no muestra error
  await expect(form.locator('.form-error')).toHaveCount(1)
  await expect(form.locator('#contact-email-error')).toHaveText('Ingresá un correo electrónico válido.')
  await expect(form.locator('#contact-message-error')).toHaveCount(0)

  // Cambio ES -> EN: el error visible se traduce de inmediato y los datos permanecen
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(form.locator('.form-error')).toHaveCount(1)
  await expect(form.locator('#contact-email-error')).toHaveText('Please enter a valid email address.')
  await expect(form.locator('#contact-message-error')).toHaveCount(0)
  await expect(nameInput).toHaveValue('Ana Pérez')
  await expect(emailInput).toHaveValue('correo-invalido')
  await expect(messageInput).toHaveValue('')

  // Cambio EN -> ES: vuelve a español sin perder datos ni validar campos intactos
  await page.getByRole('button', { name: 'ES', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(form.locator('.form-error')).toHaveCount(1)
  await expect(form.locator('#contact-email-error')).toHaveText('Ingresá un correo electrónico válido.')
  await expect(form.locator('#contact-message-error')).toHaveCount(0)
  await expect(nameInput).toHaveValue('Ana Pérez')
  await expect(emailInput).toHaveValue('correo-invalido')
  await expect(messageInput).toHaveValue('')
})

test('formulario sin endpoint: validación y aviso natural sin simular éxito ni enviar peticiones', async ({ page }) => {
  test.skip(isPublishedRun, 'Solo aplica al servidor local de pruebas sin endpoint.')

  let postAttempts = 0
  page.on('request', (request) => {
    if (request.method() === 'POST') postAttempts += 1
  })

  await page.goto(UNCONFIGURED_TEST_URL)
  const form = page.locator('#contacto form')
  await form.getByRole('button', { name: 'Enviar mensaje' }).click()
  await expect(form.locator('.form-error')).toHaveCount(3)

  const typedMessage = 'Hola Yoel, nos interesa conversar sobre una vacante full-stack.'
  await form.getByLabel('Nombre completo').fill('Ana Pérez')
  await form.getByLabel('Correo electrónico').fill('ana@example.com')
  await form.getByLabel('Mensaje').fill(typedMessage)
  await form.getByRole('button', { name: 'Enviar mensaje' }).click()

  await expect(form).toContainText('El formulario estará disponible pronto')
  await expect(form).toContainText('Por ahora podés escribirme por correo o WhatsApp.')
  await expect(form).not.toContainText('VITE_CONTACT_ENDPOINT')
  await expect(form).not.toContainText('Mensaje enviado correctamente')
  await expect(form.getByLabel('Mensaje')).toHaveValue(typedMessage)
  expect(postAttempts).toBe(0)
})

test('formulario con endpoint: fallo HTTP conserva el mensaje y permite reintentar hasta confirmación válida', async ({
  page,
}) => {
  test.skip(isPublishedRun, 'Solo aplica al servidor local de pruebas con endpoint simulado.')

  let attempts = 0
  let lastPayload: Record<string, string> | null = null
  let releaseSecondAttempt!: () => void
  const secondAttemptGate = new Promise<void>((resolve) => {
    releaseSecondAttempt = resolve
  })

  await page.route(MOCK_CONTACT_ENDPOINT, async (route) => {
    attempts += 1
    const request = route.request()
    const contentType = request.headers()['content-type'] ?? ''
    const formData = await new Response(new Uint8Array(request.postDataBuffer() ?? []), {
      headers: { 'Content-Type': contentType },
    }).formData()
    lastPayload = Object.fromEntries([...formData].map(([key, value]) => [key, String(value)]))

    if (attempts === 1) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, error: 'temporary_error' }),
      })
      return
    }

    await secondAttemptGate
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto(CONFIGURED_TEST_URL)
  const form = page.locator('#contacto form')
  const typedMessage = 'Hola Yoel, nos interesa conversar sobre una vacante full-stack.'

  await form.getByLabel('Nombre completo').fill('Ana Pérez')
  await form.getByLabel('Correo electrónico').fill('ana@example.com')
  await form.getByLabel('Mensaje').fill(typedMessage)

  // Primer intento: error HTTP 500 -> muestra error y conserva todos los datos para reintentar
  await form.getByRole('button', { name: 'Enviar mensaje' }).click()
  await expect(form.locator('.form-feedback-error')).toBeVisible()
  await expect(form).toContainText('No se pudo enviar tu mensaje en este momento.')
  await expect(form).not.toContainText('Mensaje enviado correctamente')
  await expect(form.getByLabel('Nombre completo')).toHaveValue('Ana Pérez')
  await expect(form.getByLabel('Correo electrónico')).toHaveValue('ana@example.com')
  await expect(form.getByLabel('Mensaje')).toHaveValue(typedMessage)

  // Segundo intento (reintento sin volver a escribir): no muestra éxito mientras espera respuesta
  await form.getByRole('button', { name: 'Enviar mensaje' }).click()
  await expect(form.getByRole('button', { name: 'Enviando...' })).toBeDisabled()
  await expect(form.locator('.form-feedback-success')).toHaveCount(0)

  // Solo muestra éxito tras recibir HTTP 200 con { ok: true }
  releaseSecondAttempt()
  await expect(form.locator('.form-feedback-success')).toBeVisible()
  await expect(form).toContainText('Mensaje enviado correctamente.')
  await expect(form.getByLabel('Nombre completo')).toHaveValue('')
  await expect(form.getByLabel('Correo electrónico')).toHaveValue('')
  await expect(form.getByLabel('Mensaje')).toHaveValue('')

  expect(attempts).toBe(2)
  expect(lastPayload).toEqual({
    name: 'Ana Pérez',
    email: 'ana@example.com',
    message: typedMessage,
  })
})

test('formulario con endpoint: tiempo de espera conserva los datos y no reenvía automáticamente', async ({ page }) => {
  test.skip(isPublishedRun, 'Solo aplica al servidor local de pruebas con endpoint simulado.')

  await page.clock.install()
  let releaseResponse!: () => void
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve })
  let attempts = 0
  await page.route(MOCK_CONTACT_ENDPOINT, async (route) => {
    attempts += 1
    await responseGate
    await route.abort().catch(() => {})
  })

  try {
    await page.goto(CONFIGURED_TEST_URL)
    const form = page.locator('#contacto form')
    const typedMessage = 'Mensaje de prueba para comprobar el límite de espera.'
    await form.getByLabel('Nombre completo').fill('Ana Pérez')
    await form.getByLabel('Correo electrónico').fill('ana@example.com')
    await form.getByLabel('Mensaje').fill(typedMessage)
    await form.getByRole('button', { name: 'Enviar mensaje' }).click()
    await expect.poll(() => attempts).toBe(1)
    await expect(form.getByRole('button', { name: 'Enviando...' })).toBeDisabled()

    await page.clock.fastForward(13_000)
    await expect(form.getByRole('alert')).toContainText('No pudimos confirmar el envío.')
    await expect(form.getByLabel('Mensaje')).toHaveValue(typedMessage)
    await expect(form.getByRole('button', { name: 'Enviar mensaje' })).toBeEnabled()
    expect(attempts).toBe(1)
  } finally {
    releaseResponse()
  }
})

const unexpectedHttp200Cases = [
  {
    name: 'página HTML',
    contentType: 'text/html; charset=utf-8',
    body: '<!doctype html><html><body><h1>OK</h1></body></html>',
  },
  {
    name: 'JSON mal formado',
    contentType: 'application/json; charset=utf-8',
    body: '{ "ok": true',
  },
  {
    name: 'JSON sin confirmación explícita ({})',
    contentType: 'application/json; charset=utf-8',
    body: '{}',
  },
  {
    name: 'JSON sin confirmación válida ({ ok: false })',
    contentType: 'application/json; charset=utf-8',
    body: JSON.stringify({ ok: false }),
  },
] as const

for (const scenario of unexpectedHttp200Cases) {
  test(`formulario con endpoint: HTTP 200 inesperado (${scenario.name}) rechaza confirmación y conserva datos`, async ({
    page,
  }) => {
    test.skip(isPublishedRun, 'Solo aplica al servidor local de pruebas con endpoint simulado.')

    await page.route(MOCK_CONTACT_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: scenario.contentType,
        body: scenario.body,
      })
    })

    await page.goto(CONFIGURED_TEST_URL)
    const form = page.locator('#contacto form')
    const typedName = 'Carlos Soto'
    const typedEmail = 'carlos@example.com'
    const typedMessage = `Mensaje de prueba para respuesta inesperada (${scenario.name}).`

    await form.getByLabel('Nombre completo').fill(typedName)
    await form.getByLabel('Correo electrónico').fill(typedEmail)
    await form.getByLabel('Mensaje').fill(typedMessage)
    await form.getByRole('button', { name: 'Enviar mensaje' }).click()

    await expect(form.locator('.form-feedback-error')).toBeVisible()
    await expect(form.locator('.form-feedback-success')).toHaveCount(0)
    await expect(form).not.toContainText('Mensaje enviado correctamente')
    await expect(form.getByLabel('Nombre completo')).toHaveValue(typedName)
    await expect(form.getByLabel('Correo electrónico')).toHaveValue(typedEmail)
    await expect(form.getByLabel('Mensaje')).toHaveValue(typedMessage)
  })
}

test('WhatsApp flotante, scrolltop y accesibilidad sin solapamiento', async ({ page }) => {
  await page.goto('./')
  await page.evaluate(() => window.scrollTo(0, 700))
  const scrollBtn = page.getByRole('button', { name: 'Volver arriba' })
  const waBtn = page.getByRole('button', { name: 'Abrir acceso rápido a WhatsApp' })
  await expect(scrollBtn).toBeVisible()
  await expect(waBtn).toBeVisible()

  const scrollBox = await scrollBtn.boundingBox()
  const waBox = await waBtn.boundingBox()
  expect(scrollBox && waBox).toBeTruthy()
  if (scrollBox && waBox) {
    const overlap =
      scrollBox.x < waBox.x + waBox.width &&
      scrollBox.x + scrollBox.width > waBox.x &&
      scrollBox.y < waBox.y + waBox.height &&
      scrollBox.y + scrollBox.height > waBox.y
    expect(overlap).toBe(false)
  }

  await waBtn.click()
  const waDialog = page.getByRole('dialog', { name: 'Escribir por WhatsApp' })
  await expect(waDialog).toBeVisible()
  await waDialog.getByLabel('Mensaje inicial (editable)').fill('Consulta técnica de prueba')
  await expect(waDialog.getByRole('link', { name: /Continuar en WhatsApp/ })).toHaveAttribute(
    'href',
    'https://wa.me/50683904194?text=Consulta%20t%C3%A9cnica%20de%20prueba',
  )

  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(accessibility.violations).toEqual([])
})
