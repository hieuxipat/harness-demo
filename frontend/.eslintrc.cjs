module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'no-console': ['off', { allow: ['off', 'error'] }],
    'react/react-in-jsx-scope': 0,
    'no-param-reassign': [2, { props: false }],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'none',
        semi: true,
        singleQuote: true,
        printWidth: 80,
        endOfLine: 'auto'
      }
    ],
    'react/no-array-index-key': 0,
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: ['function-declaration', 'arrow-function'],
        unnamedComponents: 'arrow-function'
      }
    ],
    'react/require-default-props': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'react/display-name': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/default-param-last': 'off',
    'no-empty': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'react/jsx-no-useless-fragment': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-cycle': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['vite.config.ts']
};
