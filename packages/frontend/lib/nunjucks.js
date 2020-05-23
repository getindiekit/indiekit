import nunjucks from 'nunjucks';
import path from 'path';
import * as filters from '../filters/index.js';

/**
 * @param {Function} app Express
 * @returns {object} Nunjucks environment
 */
export default function (app) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const views = [
    path.join(__dirname, '..', 'components'),
    path.join(__dirname, '..', 'layouts')
  ];

  const options = {
    autoescape: true,
    express: app,
    watch: true
  };

  const parser = nunjucks.configure(views, options);
  parser.addFilter('markdown', filters.markdown);

  return parser;
}
