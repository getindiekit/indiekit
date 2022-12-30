import test from "ava";
import {
  excerpt,
  includes,
  linkTo,
  markdown,
} from "../../../lib/filters/index.js";

test("Excerpts a string", (t) => {
  t.is(excerpt("Well, well, well!", 1), "Well…");
  t.is(excerpt("Well, indeed."), "Well, indeed.");
});

test("Check if string includes a value", (t) => {
  t.true(includes("foo,bar", "foo"));
  t.false(includes("foo,bar", "qux"));
});

test("Adds Markdown link to text", (t) => {
  t.is(linkTo("Not linked"), "Not linked");
  t.is(linkTo("Linked", "#"), "[Linked](#)");
});

test("Renders Markdown string as HTML", (t) => {
  t.is(markdown("**bold**"), "<p><strong>bold</strong></p>\n");
  t.is(markdown("**bold**", "inline"), "<strong>bold</strong>");
});
