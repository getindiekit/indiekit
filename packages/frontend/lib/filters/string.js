import markdownIt from "../markdown-it.js";

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
