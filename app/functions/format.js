const path = require('path');
const nunjucks = require('nunjucks');

const templatePath = path.join(__basedir, '/.cache/template.njk');

exports.string = function (data) {
  return nunjucks.renderString('{{ content }}', data);
};

exports.template = function (data) {
  return nunjucks.render(templatePath, data);
};
