import { defineConfig, devices } from '@playwright/test'

const basePath = process.env.PLAYWRIGHT_BASE_PATH || '/'
// La misma suite sirve para la compilación local y la URL pública de Pages.
const publishedURL = process.env.PLAYWRIGHT_BASE_URL
const baseURL = publishedURL || `http://127.0.0.1:4173${basePath}`

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
const testContactEndpoint = 'https://contact-test.invalid/submit'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    { name: 'escritorio', use: { viewport: { width: 1440, height: 1050 } } },
    { name: 'movil', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: publishedURL
    ? undefined
    : [
        {
          // Compilación pública real (dist/) sin configuraciones ni ganchos de prueba.
          command: `npm run preview -- --port 4173 --strictPort --base ${basePath}`,
          url: baseURL,
          reuseExistingServer: false,
        },
        {
          // Entorno de pruebas aislado sin endpoint configurado (aunque exista VITE_CONTACT_ENDPOINT en el sistema).
          command: `npx vite --mode test --host 127.0.0.1 --port 4174 --strictPort --base ${basePath}`,
          url: `http://127.0.0.1:4174${basePath}`,
          reuseExistingServer: false,
          env: {
            ...process.env,
            VITE_CONTACT_ENDPOINT: '',
          },
        },
        {
          // Entorno de pruebas aislado con endpoint ficticio interceptado por Playwright (nunca contacta servicios reales).
          command: `npx vite --mode test --host 127.0.0.1 --port 4175 --strictPort --base ${basePath}`,
          url: `http://127.0.0.1:4175${basePath}`,
          reuseExistingServer: false,
          env: {
            ...process.env,
            VITE_CONTACT_ENDPOINT: testContactEndpoint,
          },
        },
      ],
})
