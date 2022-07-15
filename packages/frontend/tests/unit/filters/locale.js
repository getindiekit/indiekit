import test from "ava";
import {
  date,
  languageName,
  languageNativeName,
} from "../../../lib/filters/index.js";

test("Formats a date", (t) => {
  t.is(date("2019-11-30", "dd MMMM yyyy"), "30 November 2019");
});

test("Formats the date right now", (t) => {
  const now = Math.round(Date.now() / 1_000_000);
  const result = Math.round(date("now", "t") / 1000);

  t.is(result, now);
});

test("Gets a language name", (t) => {
  t.is(languageName("fr"), "French");
});

test("Gets a language’s native name", (t) => {
  t.is(languageNativeName("fr"), "Français");
});
