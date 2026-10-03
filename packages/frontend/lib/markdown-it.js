import markdownIt from "markdown-it";
import markdownItAbbr from "markdown-it-abbr";
import markdownItDeflist from "markdown-it-deflist";
import markdownItFootnote from "markdown-it-footnote";
import markdownItImageFigures from "markdown-it-image-figures";

/**
 * Creates a configured markdown-it parser
 * @returns {ReturnType<typeof markdownIt>} Configured markdown-it instance
 */
export function markdownParser() {
  return markdownIt({
    html: true,
    breaks: true,
    typographer: true,
  })
    .use(markdownItAbbr)
    .use(markdownItDeflist)
    .use(markdownItFootnote)
    .use(markdownItImageFigures, {
      async: true,
      lazy: true,
      figcaption: true,
    });
}
