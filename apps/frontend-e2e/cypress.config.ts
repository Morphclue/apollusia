import {nxE2EPreset} from '@nx/cypress/plugins/cypress-preset';
import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {bundler: 'vite'}),
    baseUrl: 'http://localhost:4200',
    allowCypressEnv: false,
  },
  defaultBrowser: 'chrome'
});
