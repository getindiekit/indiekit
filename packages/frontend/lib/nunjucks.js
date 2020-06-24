import nunjucks from 'nunjucks';
import path from 'path';
import languages from 'iso-639-1';
import {__dirname} from '../index.js';
import * as filters from './nunjucks/filters.js';
import * as globals from './nunjucks/globals.js';

/**
 * @param {Function} app Express
 * @returns {object} Nunjucks environment
 */
export const templates = app => {
  const appViews = app ? app.settings.views : '';
  const frontendViews = [
    path.join(__dirname, 'components'),
    path.join(__dirname, 'layouts')
  ];
  const views = frontendViews.concat(appViews);

  const options = {
    autoescape: true,
    express: app,
    watch: true
  };

  const parser = nunjucks.configure(views, options);
  parser.addFilter('darken', filters.darken);
  parser.addFilter('lighten', filters.lighten);
  parser.addFilter('date', filters.date);
  parser.addFilter('errorList', filters.errorList);
  parser.addFilter('language', string => languages.getNativeName(string));
  parser.addFilter('markdown', filters.markdown);
  parser.addGlobal('icon', nunjucks.runtime.markSafe(globals.icon));

  return parser;
};
