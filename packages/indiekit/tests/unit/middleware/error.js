import { IndiekitError } from "@indiekit/error";
import test from "ava";
import sinon from "sinon";
import mockReqRes from "mock-req-res";
import { notFound, internalServer } from "../../../lib/middleware/error.js";

const { mockRequest, mockResponse } = mockReqRes;

test("Passes error onto next middleware", (t) => {
  const request = mockRequest({ accepts: () => false });
  const response = mockResponse({ locals: { __() {} } });
  const next = sinon.spy();

  notFound(request, response, next);

  t.true(next.calledOnce);
});

test("Returns 500 for unknown error", (t) => {
  const unknownError = new Error("Unknown");
  const request = mockRequest({ accepts: () => false });
  const response = mockResponse();
  const next = sinon.spy();

  internalServer(unknownError, request, response, next);

  t.true(response.status.calledWith(500));
});

test("Renders error as HTML", (t) => {
  const testError = new IndiekitError("Error message");
  const request = mockRequest({
    accepts: (mimeType) => mimeType.includes("html"),
  });
  const response = mockResponse({
    locals: { __() {} },
  });
  const next = sinon.spy();

  internalServer(testError, request, response, next);

  t.true(response.render.calledWith());
});

test("Renders error as JSON", (t) => {
  const testError = new IndiekitError("Error message");
  const request = mockRequest({
    accepts: (mimeType) => mimeType.includes("json"),
  });
  const response = mockResponse();
  const next = sinon.spy();

  internalServer(testError, request, response, next);

  t.true(response.json.calledWith());
});

test("Renders error as plain text", (t) => {
  const testError = new IndiekitError("Error message");
  const request = mockRequest({ accepts: () => false });
  const response = mockResponse();
  const next = sinon.spy();

  internalServer(testError, request, response, next);

  t.true(response.send.calledWith("IndiekitError: Error message"));
});
