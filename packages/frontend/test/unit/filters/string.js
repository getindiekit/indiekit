import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  excerpt,
  includes,
  linkTo,
  markdown,
} from "../../../lib/filters/index.js";

describe("frontend/lib/filters/string", () => {
  it("Excerpts a string", () => {
    assert.equal(excerpt("Well, well, well!", 1), "Well…");
    assert.equal(excerpt("Well, indeed."), "Well, indeed.");
  });

  it("Check if string includes a value", () => {
    assert.equal(includes("foo,bar", "foo"), true);
    assert.equal(includes("foo,bar", "qux"), false);
  });

  it("Adds Markdown link to text", () => {
    assert.equal(linkTo("Not linked", ""), "Not linked");
    assert.equal(linkTo("Linked", "#"), "[Linked](#)");
  });

  it("Renders Markdown string as HTML", () => {
    assert.equal(markdown("**bold**"), "<p><strong>bold</strong></p>\n");
    assert.equal(markdown("**bold**", "inline"), "<strong>bold</strong>");
  });
});
