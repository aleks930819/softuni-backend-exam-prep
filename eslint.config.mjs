import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      indent: ['warn', 2],
      'no-unused-vars': 'warn',
      quotes: ['warn', 'single'],
      semi: ['warn', 'always'],
    },
  },

  pluginJs.configs.recommended,
];
