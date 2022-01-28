const path = require('path');
const nunjucks = require('nunjucks');
const filters = require('./nunjucks/filters.js');
const globals = require('./nunjucks/globals.js');

/**
 * @param {Function} app Express
 * @returns {object} Nunjucks environment
 */
module.exports = app => {
  const appViews = app ? app.settings.views : [];
  const frontendViews = [
    path.join(__dirname, '..', 'components'),
    path.join(__dirname, '..', 'layouts'),
  ];
  const views = [...frontendViews, ...appViews];

  const options = {
    autoescape: true,
    express: app,
  };

  const parser = nunjucks.configure(views, options);

  // Add filters
  for (const filter of Object.keys(filters)) {
    parser.addFilter(filter, filters[filter]);
  }

  // Add globals
  parser.addGlobal('icon', nunjucks.runtime.markSafe(globals.icon));

  return parser;
};
