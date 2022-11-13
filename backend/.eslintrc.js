module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'quotes': [2, 'single', {'avoidEscape': true}],
        'comma-dangle': [2, 'always-multiline'],
        'import/order': [
            'error',
            {
                'newlines-between': 'always',
                'groups': [
                    [
                        'external',
                        'internal',
                        'builtin'
                    ],
                    [
                        'parent',
                        'sibling',
                        'index'
                    ]
                ],
                'alphabetize': {
                    'order': 'asc',
                    'caseInsensitive': true
                }
            }
        ],
    },
    settings: {
        'import/internal-regex': '@nestjs',
        'import/external-module-folders': ['node_modules'],
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts']
        },
        'import/resolver': {
            alias: true,
            'typescript': {
                'alwaysTryTypes': true,
            }
        }
    }
};
