module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
  },
  "ignorePatterns": ["dist/**/*"]
}
