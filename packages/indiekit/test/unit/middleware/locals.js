import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";
import { mockRequest, mockResponse } from "mock-req-res";
import { defaultConfig } from "../../../config/defaults.js";
import { locals } from "../../../lib/middleware/locals.js";

describe("indiekit/lib/middleware/locals", () => {
  it("Exposes configuration to frontend templates", async () => {
    const request = mockRequest({ session: { token: "token" } });
    const response = mockResponse({ locals: {} });
    const next = mock.fn();
    await locals(defaultConfig)(request, response, next);

    assert.equal(next.mock.calls.length, 1);
  });

  it("Displays MongoDB client connection error", async () => {
    const request = mockRequest({ app: { locals: {} } });
    const response = mockResponse();
    const next = mock.fn();

    await locals({ mongodbClientError: new Error("test") })(
      request,
      response,
      next,
    );

    assert.equal(request.app.locals.error instanceof Error, true);
  });

  it("Throws error exposing configuration to frontend templates", async () => {
    const request = mockRequest();
    const response = mockResponse();
    const next = mock.fn();
    await locals(defaultConfig)(request, response, next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments[0] instanceof Error, true);
  });
});
