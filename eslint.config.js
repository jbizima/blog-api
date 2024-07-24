import { defineConfig } from 'eslint';

export default defineConfig({
  env: {
    node: true,   // Indicates that the code runs in a Node.js environment
    es2021: true  // Enable ES2021 globals and syntax
  },
  extends: [
    'airbnb-base' // Extend Airbnb base rules
  ],
  parserOptions: {
    ecmaVersion: 2021, // Specify ECMAScript version
  },
  rules: {
    // Custom rules or overrides
  },
});