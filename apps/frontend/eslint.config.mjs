import baseConfig from '../../eslint.config.mjs';
import angular from 'angular-eslint';


export default [
  {
    ignores: ['**/dist'],
  },
  ...baseConfig,
  ...angular.configs.tsRecommended
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
      processor: angular.processInlineTemplates,
      rules: {
        ...config.rules,
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'apollusiaNx',
            style: 'camelCase',
          },
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@angular-eslint/no-empty-lifecycle-method': 'off',
        '@angular-eslint/prefer-standalone': 'off',
        '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      },
    })),
  ...angular.configs.templateRecommended
    .map((config) => ({
      ...config,
      files: ['**/*.html'],
      rules: {
        ...config.rules,
      },
    })),
];
