import { defineConfig, devices } from '@playwright/test'

const basePath = process.env.PLAYWRIGHT_BASE_PATH || '/'
// La misma suite sirve para la compilación local y la URL pública de Pages.
const publishedURL = process.env.PLAYWRIGHT_BASE_URL
const baseURL = publishedURL || `http://127.0.0.1:4173${basePath}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'escritorio', use: { viewport: { width: 1440, height: 1050 } } },
    { name: 'movil', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: publishedURL ? undefined : {
    command: `npm run preview -- --port 4173 --strictPort --base ${basePath}`,
    url: baseURL,
    reuseExistingServer: false,
  },
})
