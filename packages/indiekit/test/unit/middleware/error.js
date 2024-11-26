import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { IndiekitError } from "@indiekit/error";
import { mockRequest, mockResponse } from "mock-req-res";

import { notFound, internalServer } from "../../../lib/middleware/error.js";

describe("indiekit/lib/middleware/error", () => {
  it("Passes error onto next middleware", () => {
    const request = mockRequest({ accepts: () => false });
    const response = mockResponse({ locals: { __() {} } });
    const next = mock.fn();

    notFound(request, response, next);

    assert.equal(next.mock.calls.length, 1);
  });

  it("Returns 500 for unknown error", () => {
    const unknownError = new Error("Unknown");
    const request = mockRequest({ accepts: () => false });
    const response = mockResponse();
    const next = mock.fn();

    internalServer(unknownError, request, response, next);

    assert.equal(response.status.calledWith(500), true);
  });

  it("Renders error as HTML", () => {
    const testError = new IndiekitError("Error message");
    const request = mockRequest({
      accepts: (mimeType) => mimeType.includes("html"),
    });
    const response = mockResponse({
      locals: { __() {} },
    });
    const next = mock.fn();

    internalServer(testError, request, response, next);

    assert.equal(response.render.calledWith(), true);
  });

  it("Renders error as JSON", () => {
    const testError = new IndiekitError("Error message");
    const request = mockRequest({
      accepts: (mimeType) => mimeType.includes("json"),
    });
    const response = mockResponse();
    const next = mock.fn();

    internalServer(testError, request, response, next);

    assert.equal(response.json.calledWith(), true);
  });

  it("Renders error as plain text", () => {
    const testError = new IndiekitError("Error message");
    const request = mockRequest({ accepts: () => false });
    const response = mockResponse();
    const next = mock.fn();

    internalServer(testError, request, response, next);

    assert.equal(
      response.send.calledWith("IndiekitError: Error message"),
      true,
    );
  });
});
