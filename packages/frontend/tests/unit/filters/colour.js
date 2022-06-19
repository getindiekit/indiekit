import test from "ava";
import { darken, lighten } from "../../../lib/filters/index.js";

test("Darkens a color", (t) => {
  t.is(darken("#f00", "0.5"), "#800000");
});

test("Lightens a color", (t) => {
  t.is(lighten("#f00", "0.5"), "#FF8080");
});
