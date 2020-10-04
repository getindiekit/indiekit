const markdownIt = require('markdown-it');
const markdownItPrism = require('markdown-it-prism');

module.exports = (() => {
  const options = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  };

  const parser = markdownIt(options);
  parser.use(markdownItPrism);

  return parser;
})();
