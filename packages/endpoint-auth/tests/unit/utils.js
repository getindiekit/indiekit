import test from "ava";
import { getCanonicalUrl, getRequestParameters } from "../../lib/utils.js";

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
