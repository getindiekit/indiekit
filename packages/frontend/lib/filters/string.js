import markdownIt from "../markdown-it.js";

/**
 * Excerpt a string
 * @param {string} string - String to excerpt
 * @param {number} value - Maximum number of words
 * @param {string} locale - Locale
 * @returns {string} Excerpted string
 */
export const excerpt = (string, value = 100, locale = "en") => {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  const segments = segmenter.segment(string);

  let excerpt = "";
  let n = 0;
  let words;
  [...segments].map((segment) => {
    words = segment.isWordLike ? n++ : n;
    if (words < value) {
      excerpt += segment.segment;
    }

    return excerpt;
  });

  if (words > value) {
    excerpt += "…";
  }

  return excerpt;
};

/**
 * Check if string includes a value
 * @param {string} string - String to check
 * @param {string} value - Value to search for
 * @returns {boolean} Result
 */
export const includes = (string, value) => string.includes(value);

/**
 * Add Markdown link to text
 * @param {string} string - Text
 * @param {string} href - Hyperlink reference to link to
 * @returns {string} Markdown string
 */
export const linkTo = (string, href) => {
  if (href) {
    return `[${string}](${href})`;
  }

  return string;
};

/**
 * Render Markdown string as HTML
 * @param {string} string - Markdown
 * @param {string} [value] - If 'inline', HTML rendered without paragraph tags
 * @returns {string} HTML
 */
export const markdown = (string, value) => {
  if (value === "inline") {
    return markdownIt.renderInline(string);
  }

  return markdownIt.render(string);
};
