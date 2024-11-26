import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockRequest } from "mock-req-res";

import {
  createRequestUri,
  getRequestUriData,
} from "../../lib/pushed-authorization-request.js";

describe("endpoint-auth/lib/pushed-authorization-request", () => {
  it("Creates a PAR URI", () => {
    const request = mockRequest({
      app: { locals: {} },
      query: { foo: "bar" },
    });
    const result = createRequestUri(request);

    assert.match(result, /^urn:ietf:params:oauth:request_uri:[\w-]{36}$/);
  });

  it("Gets data from PAR URI", () => {
    const request = mockRequest({
      app: {
        locals: {
          qGaan5uh5l9yp2AM: { foo: "bar" },
        },
      },
      query: {
        request_uri: "urn:ietf:params:oauth:request_uri:qGaan5uh5l9yp2AM",
      },
    });
    const result = getRequestUriData(request);

    assert.equal(result.foo, "bar");
  });
});
