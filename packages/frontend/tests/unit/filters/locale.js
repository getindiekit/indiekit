import test from "ava";
import { date } from "../../../lib/filters/locale.js";

test("Formats a date", (t) => {
  t.is(date("2019-11-30", "dd MMMM yyyy"), "30 November 2019");
});

test("Formats the date right now", (t) => {
  const now = Math.round(Date.now() / 1_000_000);

  const result = Math.round(date("now", "t") / 1000);

  t.is(result, now);
});
