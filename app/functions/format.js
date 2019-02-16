const {DateTime} = require('luxon');
const nunjucks = require('nunjucks');

// Configure Nunjucks
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('.cache'));
env.addFilter('date', (date, format) => {
  return DateTime.fromISO(date).toFormat(format);
});

exports.string = function (string, data) {
  return env.renderString(string, data);
};

exports.template = function (templatePath, data) {
  return env.render(templatePath, data);
};
