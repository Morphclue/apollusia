import cypress from 'eslint-plugin-cypress';

import baseConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['**/dist'],
  },
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      globals: {
        Cypress: 'readonly',
        cy: 'readonly',
      },
    },
    plugins: {cypress},
    ...cypress.configs.recommended,
  },
];
