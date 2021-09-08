import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import snakeCase from 'lodash/snakeCase';

export const stringUtils = {
  toCamel: camelCase,
  toKebab: kebabCase,
  toSnake: snakeCase,
  toPascal: (s: string) => {
    const camel: string = camelCase(s);
    return camel[0].toUpperCase() + camel.substring(1);
  },
};
