/**
 * Render a template or string using context data using Nunjucks.
 *
 * @module functions/render
 */

const appConfig = require(__basedir + '/app/config.js');
const {DateTime} = require('luxon');
const nunjucks = require('nunjucks');

// Configure Nunjucks environment
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(appConfig.cache.dir));

env.addFilter('date', (date, format) => {
  if (!date) {
    throw new Error('No date provided in context data');
  }

  return DateTime.fromISO(date).toFormat(format);
});

/**
 * Renders a template string using context data
 *
 * @param {String} string Template string
 * @param {String} context Context data
 * @return {String} Rendered string
 */
const string = (string, context) => {
  return env.renderString(string, context);
};

/**
 * Renders a template using context data
 *
 * @param {String} templatePath Path to template file
 * @param {String} context Context data
 * @return {String} Rendered string
 */
const template = (templatePath, context) => {
  return env.render(templatePath, context);
};

module.exports = {
  string,
  template
};
