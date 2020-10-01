/* eslint-disable linebreak-style */
const { platform } = require('os');

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': ['error', platform() === 'linux' ? 'unix' : 'windows'],
    'no-param-reassign': 'off',
    'func-names': 'off',
    'no-underscore-dangle': 'off',
  },
};
