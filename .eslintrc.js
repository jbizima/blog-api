module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,  // Add this line to recognize Node.js globals
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
  