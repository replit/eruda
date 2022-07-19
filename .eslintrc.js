module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
  },
  globals: {
    VERSION: true,
    ENV: true,
  },
  rules: {
    quotes: ['error', 'single'],
    'prefer-const': 2,
  },
}
