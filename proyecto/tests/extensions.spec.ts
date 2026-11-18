import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

  const github = page.locator('#contacto').getByRole('link', { name: /GitHub/ })
  await expect(github).toHaveAttribute('href', 'https://github.com/yoel-portfolio/yoel-portfolio')
  await expect(github).toHaveAttribute('target', '_blank')
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

test('galería de proyectos: filtros, modal accesible con Escape y devolución de foco', async ({ page }) => {
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
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(detailBtn).toBeFocused()
})

test('formulario programado: validación y estado honesto sin endpoint configurado', async ({ page }) => {
  await page.goto('./')
  const form = page.locator('#contacto form')
  await form.getByRole('button', { name: 'Enviar mensaje' }).click()
  await expect(form.locator('.form-error')).toHaveCount(3)

  await form.getByLabel('Nombre completo').fill('Ana Pérez')
  await form.getByLabel('Correo electrónico').fill('ana@example.com')
  await form.getByLabel('Mensaje').fill('Hola Yoel, nos interesa conversar sobre una vacante full-stack.')
  await form.getByRole('button', { name: 'Enviar mensaje' }).click()

  await expect(form).toContainText('Envío externo pendiente de configuración')
  await expect(form).not.toContainText('Mensaje enviado correctamente')
})

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
