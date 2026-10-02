import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { mockRequest, mockResponse } from "mock-req-res";

import { webmentionsController } from "../../../lib/controllers/webmentions.js";

describe("endpoint-webmention-io/lib/controllers/webmentions", () => {
  it("Passes unauthorized error to next if no token", async () => {
    const request = mockRequest();
    const response = mockResponse();
    const next = mock.fn();

    await webmentionsController({})(request, response, next);

    assert.equal(next.mock.callCount(), 1);

    const [error] = next.mock.calls[0].arguments;
    assert.equal(error.name, "UnauthorizedError");
    assert.equal(error.status, 401);
    assert.equal(
      error.message,
      "No token. Set the `token` option or `WEBMENTION_IO_TOKEN`.",
    );
    assert.equal(response.render.called, false);
  });
});
