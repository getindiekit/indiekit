import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { markdownToHtml, htmlToMarkdown } from "../../lib/markdown.js";

describe("endpoint-micropub/lib/markdown", () => {
  it("Converts Markdown to HTML", () => {
    assert.equal(
      markdownToHtml("This is **strong**"),
      "<p>This is <strong>strong</strong></p>",
    );
    assert.equal(
      markdownToHtml("[Linked text](https://website.example)"),
      '<p><a href="https://website.example">Linked text</a></p>',
    );
    assert.equal(
      markdownToHtml("[https://website.example](https://website.example)"),
      '<p><a href="https://website.example">https://website.example</a></p>',
    );
    assert.equal(
      markdownToHtml("<https://website.example>"),
      '<p><a href="https://website.example">https://website.example</a></p>',
    );
    assert.equal(
      markdownToHtml("https://website.example"),
      "<p>https://website.example</p>",
    );
  });

  it("Converts HTML to Markdown", () => {
    assert.equal(
      htmlToMarkdown("<p>This is a <strong>strong</strong></p>"),
      "This is a **strong**",
    );
    assert.equal(
      htmlToMarkdown(
        '<p><a href="https://website.example">Linked text</a></p>',
      ),
      "[Linked text](https://website.example)",
    );
    assert.equal(
      htmlToMarkdown(
        '<p><a href="https://website.example">https://website.example</a></p>',
      ),
      "[https://website.example](https://website.example)",
    );
    assert.equal(
      htmlToMarkdown("<p>https://website.example</p>"),
      "https://website.example",
    );
  });
});
