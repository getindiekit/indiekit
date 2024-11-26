import markdownIt from "markdown-it";
import markdownItAbbr from "markdown-it-abbr";
import markdownItDeflist from "markdown-it-deflist";
import markdownItFootnote from "markdown-it-footnote";
import markdownItImageFigures from "markdown-it-image-figures";
import markdownItPrism from "markdown-it-prism";

export default (() => {
  const options = {
    html: true,
    breaks: true,
    typographer: true,
  };

  const parser = markdownIt(options);
  parser.use(markdownItPrism.default);
  parser.use(markdownItAbbr);
  parser.use(markdownItDeflist);
  parser.use(markdownItFootnote);
  parser.use(markdownItImageFigures, {
    async: true,
    lazy: true,
    figcaption: true,
  });

  return parser;
})();
