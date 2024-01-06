import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";
import { mockRequest, mockResponse } from "mock-req-res";
import { cacheControl } from "../../../lib/middleware/cache.js";

describe("endpoint-image/lib/adapter", () => {
  it("Sends cache control headers in response", () => {
    const request = mockRequest();
    const response = mockResponse({ headers: {} });
    const next = mock.fn();

    cacheControl(request, response, next);

    assert.equal(next.mock.calls.length, 1);
  });
});
