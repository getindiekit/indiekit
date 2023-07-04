import test from "ava";
import { supplant } from "../../lib/string.js";

test("Substitutes variables enclosed in { } braces with data from object", (t) => {
  const string = "{array} {string} {number}";
  const object = {
    array: ["Array"],
    string: "string",
    number: 1,
  };
  const result = supplant(string, object);

  t.is(result, "{array} string 1");
});
