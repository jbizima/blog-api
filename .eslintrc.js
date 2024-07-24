module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,  // This line recognizes Node.js globals
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Add custom rules here
  },
};
  