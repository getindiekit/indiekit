import test from "ava";
import { markdown } from "../../../lib/filters/index.js";

test("Renders Markdown string as HTML", (t) => {
  t.is(markdown("**bold**"), "<p><strong>bold</strong></p>\n");
  t.is(markdown("**bold**", "inline"), "<strong>bold</strong>");
});
