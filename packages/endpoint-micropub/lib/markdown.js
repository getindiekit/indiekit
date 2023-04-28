import markdownIt from "markdown-it";
import TurndownService from "turndown";

/**
 * Convert Markdown to HTML
 * @param {string} string - Markdown
 * @returns {string} HTML
 */
export const markdownToHtml = (string) => {
  const options = {
    html: true,
    breaks: true,
    typographer: true,
  };

  const parser = markdownIt(options);

  const html = parser.render(string).trim();

  return html;
};

/**
 * Convert HTML to Markdown
 * @param {string} string - String (may be HTML or Markdown)
 * @returns {string} Markdown
 */
export const htmlToMarkdown = (string) => {
  // Normalise text as HTML before converting to Markdown
  string = markdownToHtml(string);

  const options = {
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    headingStyle: "atx",
  };

  const turndownService = new TurndownService(options);

  /**
   * Disable escaping of Markdown characters
   * @param {string} string - String
   * @returns {string} String
   * @see {@link https://github.com/mixmark-io/turndown#escaping-markdown-characters}
   */
  turndownService.escape = (string) => string;

  /**
   * List of inline elements to keep in Markdown
   */
  turndownService.keep(["cite", "del", "ins"]);

  const markdown = turndownService.turndown(string);

  return markdown;
};
