import nunjucks from 'nunjucks';
import * as filters from './filters.js';

/**
 * @returns {object} Nunjucks environment
 */
export const templates = (() => {
  const views = [];

  const options = {
    autoescape: true
  };

  const parser = nunjucks.configure(views, options);
  parser.addFilter('date', filters.date);

  return parser;
})();
