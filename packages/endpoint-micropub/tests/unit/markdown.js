import test from "ava";
import { markdownToHtml, textToMarkdown } from "../../lib/markdown.js";

test("Converts Markdown to HTML", (t) => {
  t.is(
    markdownToHtml("This is a **[link](#)**"),
    '<p>This is a <strong><a href="#">link</a></strong></p>'
  );
});

test("Converts text to Markdown", (t) => {
  // HTML to Markdown
  t.is(
    textToMarkdown('<p>This is a <strong><a href="#">link</a></strong></p>'),
    "This is a **[link](#)**"
  );

  // Markdown to Markdown
  t.is(
    textToMarkdown("**First** paragraph\n\n**Second** paragraph"),
    `**First** paragraph

**Second** paragraph`
  );
});
