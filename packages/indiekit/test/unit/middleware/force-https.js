import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { mockRequest, mockResponse } from "mock-req-res";

import { forceHttps } from "../../../lib/middleware/force-https.js";

describe("indiekit/lib/middleware/error", () => {
  it("Redirect HTTP requests to HTTPS", async () => {
    mock.method(console, "info", () => {});

    const request = mockRequest({
      headers: {
        "x-forwarded-proto": "http",
        Host: "server.example",
      },
      originalUrl: "/foo?bar=qux",
    });
    const response = mockResponse();
    const next = mock.fn();
    await forceHttps(request, response, next);

    assert.equal(
      console.info.mock.calls[0].arguments[0],
      "Redirecting request to https",
    );
    assert.equal(response.redirect.calledWith(302), true);
  });

  it("Marks proxy as secure", async () => {
    const request = mockRequest({
      connection: {},
      headers: {
        "x-forwarded-proto": "https",
        Host: "server.example",
      },
      originalUrl: "/foo?bar=qux",
    });
    const response = mockResponse();
    const next = mock.fn();
    await forceHttps(request, response, next);

    assert.equal(next.mock.calls.length, 1);
  });
});
