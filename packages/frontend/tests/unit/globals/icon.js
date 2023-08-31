import test from "ava";
import { icon } from "../../../lib/globals/index.js";

test("Renders SVG icon", (t) => {
  const result = icon("note");

  t.true(result.includes(`<svg class="icon"`));
  t.true(
    result.includes(
      `M12 8h24c2 0 4 2 4 4v24c0 2-2 4-4 4H12c-2 0-4-2-4-4V12c0-2 2-4 4-4zm24-4H12c-4 0-8 4-8 8v24c0 5 4 8 8 8h24c5 0 8-3 8-8V12c0-4-3-8-8-8zM12 14h24v4H12v-4zm0 8h24v4H12v-4zm0 8h18v4H12v-4z`,
    ),
  );
});

test("Renders SVG icon with title", (t) => {
  const result = icon("note", "Note");

  t.true(result.includes(`<title id="note-title">Note</title>`));
});

test("Returns undefined if unknown SVG icon name", (t) => {
  t.is(icon("foo"), undefined);
});
