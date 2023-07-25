import test from "ava";
import { markdownToHtml, htmlToMarkdown } from "../../lib/markdown.js";

test("Converts Markdown to HTML", (t) => {
  t.is(
    markdownToHtml("This is **strong**"),
    "<p>This is <strong>strong</strong></p>",
  );
  t.is(
    markdownToHtml("[Linked text](https://website.example)"),
    '<p><a href="https://website.example">Linked text</a></p>',
  );
  t.is(
    markdownToHtml("[https://website.example](https://website.example)"),
    '<p><a href="https://website.example">https://website.example</a></p>',
  );
  t.is(
    markdownToHtml("<https://website.example>"),
    '<p><a href="https://website.example">https://website.example</a></p>',
  );
  t.is(
    markdownToHtml("https://website.example"),
    "<p>https://website.example</p>",
  );
});

test("Converts HTML to Markdown", (t) => {
  t.is(
    htmlToMarkdown("<p>This is a <strong>strong</strong></p>"),
    "This is a **strong**",
  );
  t.is(
    htmlToMarkdown('<p><a href="https://website.example">Linked text</a></p>'),
    "[Linked text](https://website.example)",
  );
  t.is(
    htmlToMarkdown(
      '<p><a href="https://website.example">https://website.example</a></p>',
    ),
    "[https://website.example](https://website.example)",
  );
  t.is(
    htmlToMarkdown("<p>https://website.example</p>"),
    "https://website.example",
  );
});
