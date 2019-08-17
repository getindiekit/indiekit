const {DateTime} = require('luxon');
const nunjucks = require('nunjucks');

/**
 * Render a Nunjucks template string using context data.
 *
 * @exports render
 * @param {String} string Template string
 * @param {String} context Context data
 * @return {String} Rendered string
 */
module.exports = (string, context) => {
  const env = new nunjucks.Environment();

  env.addFilter('date', (date, format) => {
    return DateTime.fromISO(date).toFormat(format);
  });

  return env.renderString(string, context);
};
