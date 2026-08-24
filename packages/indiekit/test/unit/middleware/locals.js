import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { mockRequest, mockResponse } from "mock-req-res";

import { defaultConfig } from "../../../config/defaults.js";
import { locals } from "../../../lib/middleware/locals.js";

const requestFrom = (host) =>
  mockRequest({
    accepts: () => false,
    app: { locals: {} },
    headers: { host },
    protocol: "http",
  });

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

  it("Derives application URL from each request", async () => {
    const Indiekit = {
      config: { application: {} },
      collections: new Map(),
      endpoints: new Set(),
      installedPlugins: new Set(),
      package: {},
    };
    const response = mockResponse({ locals: { getLocale: () => "en" } });

    await locals(Indiekit)(requestFrom("127.0.0.1:3000"), response, mock.fn());
    await locals(Indiekit)(requestFrom("localhost:3000"), response, mock.fn());

    // A long-lived `application` object must not let the first request fix the
    // host used by every response after it.
    assert.equal(Indiekit.config.application.url, "http://localhost:3000");
  });

  it("Prefers a configured application URL over the request", async () => {
    const Indiekit = {
      applicationUrl: "https://server.example",
      config: { application: {} },
      collections: new Map(),
      endpoints: new Set(),
      installedPlugins: new Set(),
      package: {},
    };
    const response = mockResponse({ locals: { getLocale: () => "en" } });

    await locals(Indiekit)(requestFrom("127.0.0.1:3000"), response, mock.fn());

    assert.equal(Indiekit.config.application.url, "https://server.example");
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
