import test from "ava";
import {
  getCanonicalUrl,
  getRequestParameters,
  isUrl,
} from "../../lib/utils.js";

test("Canonicalises URL", (t) => {
  t.is(getCanonicalUrl("https://foo.bar"), "https://foo.bar/");
});

test("Gets request parameters from either query string or JSON body", (t) => {
  const resultBody = {
    body: { foo: "bar" },
    query: {},
  };
  const resultQuery = {
    body: {},
    query: { foo: "bar" },
  };

  t.deepEqual(getRequestParameters(resultBody), { foo: "bar" });
  t.deepEqual(getRequestParameters(resultQuery), { foo: "bar" });
});

test("Checks if given string is a valid URL", (t) => {
  t.true(isUrl("http://foo.bar"));
  t.false(isUrl("foo.bar"));
});

test("Throws error given URL is not a string", (t) => {
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
