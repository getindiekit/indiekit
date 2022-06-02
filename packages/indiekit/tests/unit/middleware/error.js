import httpError from "http-errors";
import test from "ava";
import sinon from "sinon";
import mockReqRes from "mock-req-res";
import * as error from "../../../lib/middleware/error.js";

const { mockRequest, mockResponse } = mockReqRes;

test("Passes error onto next middleware", (t) => {
  const request = mockRequest({ accepts: () => false });
  const response = mockResponse();
  const next = sinon.spy();

  error.notFound(request, response, next);

  t.true(next.calledOnce);
});

test("Returns 500 for unknown error", (t) => {
  const unknownError = new Error("Unknown");
  const request = mockRequest({ accepts: () => false });
  const response = mockResponse();
  const next = sinon.spy();

  error.internalServer(unknownError, request, response, next);

  t.true(response.status.calledWith(500));
});

test("Renders error as HTML", (t) => {
  const testError = httpError(400, "Error message", {
    scope: "test",
  });
  const request = mockRequest({
    accepts: (mimeType) => mimeType.includes("html"),
  });
  const response = mockResponse();
  const next = sinon.spy();

  error.internalServer(testError, request, response, next);

  t.true(response.render.calledWith());
});

test("Renders error as JSON", (t) => {
  const testError = httpError(400, "Error message", {
    scope: "test",
  });
  const request = mockRequest({
    accepts: (mimeType) => mimeType.includes("json"),
  });
  const response = mockResponse();
  const next = sinon.spy();

  error.internalServer(testError, request, response, next);

  t.true(response.json.calledWith());
});

test("Renders error as plain text", (t) => {
  const testError = httpError(400, "Error message");
  const request = mockRequest({ accepts: () => false });
  const response = mockResponse();
  const next = sinon.spy();

  error.internalServer(testError, request, response, next);

  t.true(response.send.calledWith("Error message"));
});
