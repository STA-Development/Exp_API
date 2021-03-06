module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'prettier', 'filenames', 'import'],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'max-params': ['error', {max: 3}],
    'max-lines': ['error', {max: 550, skipBlankLines: true, skipComments: true}],
    'max-lines-per-function': ['error', {max: 120, skipBlankLines: true, skipComments: true}],
    complexity: ['error', 20],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {argsIgnorePattern: '^_', ignoreRestSiblings: true},
    ],
    'disable-next-line': [0, {extensions: ['.js', '.ts']}],
    'import/extensions': [1, {extensions: ['.js', '.ts']}], // There is no need for each import statement highlight the file's extension
    'consistent-return': 0, // In application it requires to put return at the end of the arrow function which in the majority places will cause an issue.
    'no-throw-literal': 0, // No Need for this kind of thing because you can easily throw and Error As object - For example we are getting that kind of responses from BE
    'no-shadow': 'off', // This One is disabled because rule have no support for ts, but at the bottom we have enabled @typescript-eslint/no-shadow instead of
    '@typescript-eslint/no-shadow': 'error',
    'filenames/match-regex': 1,
    'import/no-cycle': 0,
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'strictCamelCase', 'PascalCase'],
      },
    ],
    'import/no-unresolved': 'error', // turn on errors for missing imports
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['*.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: './tsconfig.json',
      },
    },
  },
}
