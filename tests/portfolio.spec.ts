import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const theme of ['light', 'dark'] as const) {
  test(`contenido, recursos, accesibilidad y captura: ${theme}`, async ({ page }, testInfo) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    await page.goto('./')
    await page.evaluate(() => document.fonts.ready)

    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portafolio en construcción')
    await expect(page.getByRole('img', { name: 'Yoel', exact: true })).toHaveAttribute('src', new RegExp(`logo-yoel-${theme === 'dark' ? 'oscuro' : 'claro'}\\.svg$`))
    await expect(page.getByRole('link', { name: /Correo electrónico/ })).toHaveAttribute('href', 'mailto:yoerojas03@gmail.com')
    await expect(page.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/50683904194')
    await expect(page.getByRole('link', { name: 'Conversemos' })).toHaveAttribute('href', 'mailto:yoerojas03@gmail.com')
    await expect(page.locator('.profile-copy')).toHaveText('Ingeniero de software con enfoque en desarrollo full-stack. Desarrollo aplicaciones con C#, Java y JavaScript, utilizando React, Angular, Node.js y Spring Boot. Trabajo con HTML, CSS y bases de datos PostgreSQL y MySQL, e integro Docker y CI/CD para facilitar la entrega de software.')
    await expect(page.getByRole('heading', { name: 'Sobre mí', exact: true })).toHaveCount(1)
    await expect(page.locator('.about-copy')).toHaveText('Valoro el trabajo en equipo, las ideas de los demás y el cumplimiento de mis compromisos. Organizo mi trabajo y mantengo la calma bajo presión para definir prioridades y resolver problemas. Me motiva aprender y mejorar lo que hago.')
    await expect(page.locator('.about-copy')).toHaveCSS('line-height', '24px')
    const linkedin = page.getByRole('link', { name: /LinkedIn.*Yoel Rojas/ })
    await expect(linkedin).toHaveCount(1)
    await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/yoel-rojas-97a07b413/')
    await expect(linkedin).toHaveAttribute('target', '_blank')
    await expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(page.locator('.hero-slogan')).toHaveText('Código que impulsa ideas')

    expect(await page.locator('img').evaluateAll((images) => images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true)
    for (const favicon of await page.locator('link[rel="icon"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href))) {
      expect((await page.request.get(favicon)).ok()).toBe(true)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    const fonts = await page.evaluate(() => ({
      heading: document.fonts.check('700 40px Montserrat'),
      section: document.fonts.check('600 28px Montserrat'),
      body: document.fonts.check('400 16px Roboto'),
      button: document.fonts.check('500 16px Roboto'),
      loaded: [...document.fonts].filter((font) => font.status === 'loaded').map((font) => `${font.family} ${font.weight}`),
    }))
    expect(fonts.heading && fonts.section && fonts.body && fonts.button).toBe(true)
    expect(fonts.loaded).toHaveLength(4)
    // Evita que una ruta absoluta a la raíz funcione localmente pero falle en Pages.
    const resources = await page.evaluate(() => ({
      base: new URL('.', location.href).href,
      urls: [
        ...[...document.images].map(image => image.src),
        ...[...document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="stylesheet"]')].map(link => link.href),
        ...performance.getEntriesByType('resource').map(entry => entry.name).filter(url => /\.(woff2?|js)(\?|$)/.test(url)),
      ],
    }))
    expect(resources.urls.every(url => url.startsWith(resources.base))).toBe(true)
    await expect(page.locator('h1')).toHaveCSS('font-size', testInfo.project.name === 'movil' ? '32px' : '40px')
    await expect(page.locator('.profile-copy')).toHaveCSS('line-height', '24px')
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(accessibility.violations).toEqual([])
    await page.screenshot({ path: testInfo.outputPath(`${theme}.png`), fullPage: true })
    expect(errors).toEqual([])
  })
}

test('selector por teclado, persistencia y preferencia del sistema', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('./')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const toggle = page.getByRole('button', { name: 'Modo oscuro' })
  await toggle.focus()
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveCSS('outline-style', 'solid')
  await page.keyboard.press('Space')
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => localStorage.getItem('yoel-theme'))).toBe('dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('almacenamiento bloqueado', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } })
  })
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('./')
  await page.getByRole('button', { name: 'Modo oscuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('anclas reales, salto al contenido y movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await page.getByRole('navigation').getByRole('link', { name: 'Mi perfil' }).click()
  await expect(page).toHaveURL(/#perfil$/)
  await expect(page.getByRole('heading', { name: 'Software con propósito.' })).toBeInViewport()
  await page.getByRole('navigation').getByRole('link', { name: 'Contacto' }).click()
  await expect(page).toHaveURL(/#contacto$/)
  await expect(page.getByRole('heading', { name: 'Hablemos.' })).toBeInViewport()
  await expect(page.locator('.hero-content')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
})

test('sin desbordamiento en 320 px, tableta ni texto ampliado', async ({ page }) => {
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})
