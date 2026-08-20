import { strict as assert } from "node:assert";
import { afterEach, describe, it, mock } from "node:test";

import { IndiekitError } from "@indiekit/error";
import { mockRequest, mockResponse } from "mock-req-res";

import { notFound, internalServer } from "../../../lib/middleware/error.js";

const jsonRequest = () =>
  mockRequest({ accepts: (mimeType) => mimeType.includes("json") });
const htmlRequest = () =>
  mockRequest({ accepts: (mimeType) => mimeType.includes("html") });

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

  describe("stack traces", () => {
    const nodeEnvironment = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = nodeEnvironment;
    });

    it("Omits stack and cause from JSON outside development", () => {
      process.env.NODE_ENV = "production";
      const testError = new IndiekitError("Error message", {
        cause: new Error("Database connection string"),
      });
      const response = mockResponse();

      internalServer(testError, jsonRequest(), response, mock.fn());

      const body = response.json.firstCall.args[0];
      assert.equal("stack" in body, false);
      assert.equal("cause" in body, false);
      assert.equal(body.error_description, "Error message");
    });

    it("Includes stack and cause in JSON during development", () => {
      process.env.NODE_ENV = "development";
      const testError = new IndiekitError("Error message", {
        cause: new Error("Cause message"),
      });
      const response = mockResponse();

      internalServer(testError, jsonRequest(), response, mock.fn());

      const body = response.json.firstCall.args[0];
      assert.ok(body.stack);
      assert.ok(body.cause);
    });

    it("Omits stack from HTML outside development", () => {
      process.env.NODE_ENV = "production";
      const response = mockResponse({ locals: { __() {} } });

      internalServer(
        new IndiekitError("Error message"),
        htmlRequest(),
        response,
        mock.fn(),
      );

      const locals = response.render.firstCall.args[1];
      assert.equal("stack" in locals, false);
    });

    it("Includes stack in HTML during development", () => {
      process.env.NODE_ENV = "development";
      const response = mockResponse({ locals: { __() {} } });

      internalServer(
        new IndiekitError("Error message"),
        htmlRequest(),
        response,
        mock.fn(),
      );

      const locals = response.render.firstCall.args[1];
      assert.ok(locals.stack);
    });
  });
});
