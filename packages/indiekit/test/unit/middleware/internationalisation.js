import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { mockRequest, mockResponse } from "mock-req-res";

import { internationalisation } from "../../../lib/middleware/internationalisation.js";

describe("indiekit/lib/middleware/internationalisation", () => {
  it("Throws error setting locale", async () => {
    const request = mockRequest();
    const response = mockResponse();
    const next = mock.fn();
    await internationalisation(false)(request, response, next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments[0] instanceof Error, true);
  });
});
