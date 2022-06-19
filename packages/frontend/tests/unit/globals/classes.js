import test from "ava";
import { classes } from "../../../lib/globals/classes.js";

test("Generates space-separated list of class names", (t) => {
  const result1 = classes("foo");
  const result2 = classes("foo", "bar baz");

  t.is(result1, "foo");
  t.is(result2, "foo bar baz");
});
