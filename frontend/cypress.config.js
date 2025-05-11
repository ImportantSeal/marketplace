import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost', 
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // ...
    },
  },
})
