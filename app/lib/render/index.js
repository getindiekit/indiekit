const {DateTime} = require('luxon');
const nunjucks = require('nunjucks');

const env = new nunjucks.Environment();

env.addFilter('date', (date, format) => {
  if (!date) {
    throw new Error('No date provided in context data');
  }

  return DateTime.fromISO(date).toFormat(format);
});

/**
 * Render a Nunjucks template string using context data
 * @see {@link https://mozilla.github.io/nunjucks/api.html#renderstring Nunjucks API: renderString}
 *
 * @module render
 * @param {String} string Template string
 * @param {String} context Context data
 * @return {String} Rendered string
 */
module.exports = (string, context) => {
  return env.renderString(string, context);
};
