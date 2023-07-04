import test from "ava";
import { getRequestParameters } from "../../lib/utils.js";

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
