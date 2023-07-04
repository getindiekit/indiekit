import test from "ava";
import { isUrl } from "../../lib/url.js";

test("Checks if given string is a valid URL", (t) => {
  t.true(isUrl("https%3A%2F%2Ffoo.bar"));
  t.true(isUrl("https://foo.bar"));
  t.false(isUrl("foo.bar"));
});

test("Throws error if URL is not a string", (t) => {
  t.throws(
    () => {
      isUrl({});
    },
    {
      instanceOf: TypeError,
      message: "Expected a string",
    }
  );
});
