import nunjucks from 'nunjucks';
import path from 'path';
import languages from 'iso-639-1';
import {__dirname} from '../index.js';
import * as filters from '../filters/index.js';
import * as globals from '../globals/index.js';

/**
 * @param {Function} app Express
 * @returns {object} Nunjucks environment
 */
export default function (app) {
  const views = [
    path.join(__dirname, 'components'),
    path.join(__dirname, 'layouts'),
    app ? app.settings.views : ''
  ];

  const options = {
    autoescape: true,
    express: app,
    watch: true
  };

  const parser = nunjucks.configure(views, options);
  parser.addFilter('darken', filters.darken);
  parser.addFilter('lighten', filters.lighten);
  parser.addFilter('date', filters.date);
  parser.addFilter('language', string => languages.getNativeName(string));
  parser.addFilter('markdown', filters.markdown);
  parser.addGlobal('icon', nunjucks.runtime.markSafe(globals.icon));

  return parser;
}
