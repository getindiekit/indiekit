import markdownIt from "markdown-it";
import TurndownService from "turndown";

/**
 * Convert Markdown to HTML
 *
 * @param {string} string Markdown
 * @returns {string} HTML
 */
export const markdownToHtml = (string) => {
  const options = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  };

  const parser = markdownIt(options);

  const html = parser.render(string).trim();

  return html;
};

/**
 * Convert HTML to Markdown
 *
 * @param {string} string HTML
 * @returns {string} Markdown
 */
export const htmlToMarkdown = (string) => {
  const options = {
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    headingStyle: "atx",
  };

  const turndownService = new TurndownService(options);

  const markdown = turndownService.turndown(string);

  return markdown;
};
