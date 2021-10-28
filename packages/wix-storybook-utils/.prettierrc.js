const prettierBaseConfig = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
};

let prettierConfig = {};

try {
  prettierConfig = require('eslint-config-yoshi-base').rules[
    'prettier/prettier'
  ][1];
} catch (error) {}

module.exports = { ...prettierBaseConfig, ...prettierConfig };
