module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-types': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
  overrides: [
    {
      files: [
        './src/index.ts',
        './src/cli-commands/generate/tasks/run-codemods.ts',
        './src/cli-commands/generate/run-tasks.ts',
        './src/cli-commands/export-testkits/index.ts',
        './src/cli-commands/make/index.ts',
        './src/**/__fixtures__/**/*',
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
  ],
};
