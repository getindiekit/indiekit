import markdownIt from "markdown-it";
import markdownItPrism from "markdown-it-prism";

export default (() => {
  const options = {
    html: true,
    breaks: true,
    typographer: true,
  };

  const parser = markdownIt(options);
  parser.use(markdownItPrism.default);

  return parser;
})();
