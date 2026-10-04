import {nxE2EPreset} from '@nx/cypress/plugins/cypress-preset';
import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname, {
      ciWebServerCommand: 'npx nx run frontend:serve-static',
      webServerCommands: {
        default: 'npx nx run frontend:serve:development',
        production: 'npx nx run frontend:serve:production',
        ci: 'npx nx run frontend:serve-static',
      },
    }),
    baseUrl: 'http://localhost:4200',
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
