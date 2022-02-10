import markdownIt from "markdown-it";
import TurndownService from "turndown";

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

export const htmlToMarkdown = (string) => {
  const options = {
    codeBlockStyle: "fenced",
    emDelimiter: "*",
  };

  const turndownService = new TurndownService(options);

  const markdown = turndownService.turndown(string);

  return markdown;
};
