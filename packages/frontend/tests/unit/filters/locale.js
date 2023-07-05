import test from "ava";
import {
  languageName,
  languageNativeName,
} from "../../../lib/filters/index.js";

test("Gets a language name", (t) => {
  t.is(languageName("fr"), "French");
});

test("Gets a language’s native name", (t) => {
  t.is(languageNativeName("fr"), "Français");
});
