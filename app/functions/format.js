const {DateTime} = require('luxon');
const nunjucks = require('nunjucks');

// Configure Nunjucks environment
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('.cache'));
env.addFilter('date', (date, format) => {
  if (!date) {
    throw new Error('No date provided to filter');
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
exports.string = function (string, context) {
  return env.renderString(string, context);
};

/**
 * Renders a template using context data
 *
 * @param {String} templatePath Path to template file
 * @param {String} context Context data
 * @return {String} Rendered string
 */
exports.template = function (templatePath, context) {
  return env.render(templatePath, context);
};
