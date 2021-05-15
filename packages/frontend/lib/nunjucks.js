const path = require('path');
const languages = require('iso-639-1');
const nunjucks = require('nunjucks');
const filters = require('./nunjucks/filters.js');
const globals = require('./nunjucks/globals.js');

/**
 * @param {Function} app Express
 * @returns {object} Nunjucks environment
 */
module.exports = app => {
  const appViews = app ? app.settings.views : '';
  const frontendViews = [
    path.join(__dirname, '..', 'components'),
    path.join(__dirname, '..', 'layouts')
  ];
  const views = frontendViews.concat(appViews);

  const options = {
    autoescape: true,
    express: app
  };

  const parser = nunjucks.configure(views, options);
  parser.addFilter('darken', filters.darken);
  parser.addFilter('lighten', filters.lighten);
  parser.addFilter('date', filters.date);
  parser.addFilter('errorList', filters.errorList);
  parser.addFilter('language', string => languages.getNativeName(string));
  parser.addFilter('markdown', filters.markdown);
  parser.addFilter('summaryRows', filters.summaryRows);
  parser.addGlobal('icon', nunjucks.runtime.markSafe(globals.icon));

  return parser;
};
