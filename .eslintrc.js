module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    "ecmaVersion": 8,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "space-before-function-paren": 0
  }
}
