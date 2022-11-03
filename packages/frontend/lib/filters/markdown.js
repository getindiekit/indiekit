import markdownIt from "../markdown-it.js";

/**
 * Render Markdown string as HTML
 *
 * @param {string} string - Markdown
 * @param {string} value - If 'inline', HTML rendered without paragraph tags
 * @returns {string} HTML
 */
export const markdown = (string, value) => {
  if (value === "inline") {
    return markdownIt.renderInline(string);
  }

  return markdownIt.render(string);
};
