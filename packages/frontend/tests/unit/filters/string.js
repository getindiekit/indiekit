import test from "ava";
import { excerpt, markdown } from "../../../lib/filters/index.js";

test("Excerpts a string", (t) => {
  t.is(excerpt("Well, well, well!", 1), "Well…");
  t.is(excerpt("Well, indeed."), "Well, indeed.");
});

test("Renders Markdown string as HTML", (t) => {
  t.is(markdown("**bold**"), "<p><strong>bold</strong></p>\n");
  t.is(markdown("**bold**", "inline"), "<strong>bold</strong>");
});
