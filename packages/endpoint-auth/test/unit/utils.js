import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockRequest } from "mock-req-res";

import { getRequestParameters } from "../../lib/utils.js";

describe("endpoint-auth/lib/utils", () => {
  it("Gets request parameters from either query string or JSON body", () => {
    const resultBody = mockRequest({
      body: { foo: "bar" },
      query: {},
    });
    const resultQuery = mockRequest({
      body: {},
      query: { foo: "bar" },
    });

    assert.deepEqual(getRequestParameters(resultBody), { foo: "bar" });
    assert.deepEqual(getRequestParameters(resultQuery), { foo: "bar" });
  });
});
