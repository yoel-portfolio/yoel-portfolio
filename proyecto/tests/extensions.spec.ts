import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio under construction')
  await expect(page.locator('#habilidades h2')).toHaveText('Technical and Personal Skills')
  expect(await page.evaluate(() => localStorage.getItem('yoel-lang'))).toBe('en')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('button', { name: 'ES', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.locator('.profile-copy')).toHaveText(
    'Ingeniero de software con enfoque en desarrollo full-stack. Desarrollo aplicaciones con C#, Java y JavaScript, utilizando React, Angular, Node.js y Spring Boot. Trabajo con HTML, CSS y bases de datos PostgreSQL y MySQL, e integro Docker y CI/CD para facilitar la entrega de software.',
  )
})

test('filtros de habilidades, ilustración SVG y animación Lottie JSON real', async ({ page }) => {
  await page.goto('./')
  const skills = page.locator('#habilidades')
  await expect(skills.locator('.skill-card')).toHaveCount(5)
  await expect(skills.locator('.personal-skill-card')).toHaveCount(4)

  await skills.getByRole('button', { name: 'Personales' }).click()
  await expect(skills.locator('.skill-card')).toHaveCount(0)
  await expect(skills.locator('.personal-skill-card')).toHaveCount(4)

  await skills.getByRole('button', { name: 'Todas' }).click()
  await expect(skills.locator('.skill-card')).toHaveCount(5)

  // Verifica ilustración SVG conceptual y reproductor Lottie real en DOM
  await expect(skills.locator('svg.arch-svg')).toBeVisible()
  await expect(skills.locator('.lottie-stage svg')).toBeVisible({ timeout: 5000 })
  const lottieBtn = skills.locator('.lottie-control-btn')
  await lottieBtn.click()
  await expect(lottieBtn).toHaveAttribute('aria-pressed', 'false')
})

test('galería de proyectos: filtros, foco atrapado con Tab/Shift+Tab, fondo inactivo, Escape y devolución de foco', async ({
  page,
}) => {
  await page.goto('./')
  const projects = page.locator('#proyectos')
  await expect(projects.locator('.project-card')).toHaveCount(3)

  await projects.getByRole('button', { name: 'Backend', exact: true }).click()
  await expect(projects.locator('.project-card')).toHaveCount(1)
  await expect(projects).toContainText('Mostrando 1 de 3 proyectos')

  await projects.getByRole('button', { name: 'Todos', exact: true }).click()
  const detailBtn = projects.locator('.project-detail-btn').first()
  await detailBtn.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('OrderMS y PaymentMS')

  // El fondo queda inactivo mientras el modal está abierto
  await expect(page.locator('#root')).toHaveAttribute('inert', '')
  await expect(page.locator('#root')).toHaveAttribute('aria-hidden', 'true')
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')

  const headerCloseBtn = dialog.getByRole('button', { name: 'Cerrar detalle del proyecto' })
  const repoLink = dialog.getByRole('link', { name: /Repositorio en GitHub/ })
  const footerCloseBtn = dialog.getByRole('button', { name: 'Cerrar ficha' })

  // Al abrir, el foco entra en el modal
  await expect(headerCloseBtn).toBeFocused()

  // Recorrido hacia adelante con Tab (atrapado dentro del modal)
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
  await expect(headerCloseBtn).toBeFocused()

  // Cierre con Escape restaura fondo activo y devuelve foco al botón origen
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.locator('#root')).not.toHaveAttribute('inert', '')
  await expect(page.locator('#root')).not.toHaveAttribute('aria-hidden', 'true')
  await expect(detailBtn).toBeFocused()
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
    const bodyText = route.request().postData() || '{}'
    lastPayload = JSON.parse(bodyText) as Record<string, string>

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
