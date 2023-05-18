import test from "ava";
import { icon } from "../../../lib/globals/index.js";

test("Renders SVG icon", (t) => {
  const result = icon("note");

  t.regex(result, /^<svg class="icon" xmlns="http:\/\/www.w3.org\/2000\/svg"/);
});

test("Returns undefined if unknown SVG icon name", (t) => {
  t.is(icon("foo"), undefined);
});
