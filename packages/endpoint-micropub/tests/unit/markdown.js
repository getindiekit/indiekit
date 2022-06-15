import test from "ava";
import { markdownToHtml, htmlToMarkdown } from "../../lib/markdown.js";

test("Converts Markdown to HTML", (t) => {
  t.is(
    markdownToHtml("This is a **[link](#)**"),
    '<p>This is a <strong><a href="#">link</a></strong></p>'
  );
});

test("Converts HTML to Markdown", (t) => {
  t.is(
    htmlToMarkdown('<p>This is a <strong><a href="#">link</a></strong></p>'),
    "This is a **[link](#)**"
  );

  t.is(
    htmlToMarkdown("<h1><cite>Everything Everywhere All at Once</cite></h1>"),
    "# Everything Everywhere All at Once"
  );
});
