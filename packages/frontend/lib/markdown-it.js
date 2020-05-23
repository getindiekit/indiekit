import markdownIt from 'markdown-it';
import markdownItPrism from 'markdown-it-prism';

export default (() => {
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
