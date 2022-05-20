import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItDeflist from "markdown-it-deflist";
import markdownItPrism from "markdown-it-prism";

export default (() => {
  const options = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  };

  const parser = markdownIt(options);
  parser
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(),
    })
    .use(markdownItDeflist)
    .use(markdownItPrism);

  return parser;
})();
