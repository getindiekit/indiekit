import test from "ava";
import { classes } from "../../../lib/globals/index.js";

test("Generates space-separated list of class names", (t) => {
  const result = classes("foo");
  const resultWithClasses = classes("foo", {
    classes: "bar baz",
  });
  const resultWithError = classes("foo", {
    errorMessage: "Enter a qux",
  });
  const resultWithErrorAndClasses = classes("foo", {
    classes: "bar baz",
    errorMessage: "Enter a qux",
  });

  t.is(result, "foo");
  t.is(resultWithClasses, "foo bar baz");
  t.is(resultWithError, "foo foo--error");
  t.is(resultWithErrorAndClasses, "foo foo--error bar baz");
});
