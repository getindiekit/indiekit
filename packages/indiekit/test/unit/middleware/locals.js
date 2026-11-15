import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { testConfig } from "@indiekit-test/config";
import { mockRequest, mockResponse } from "mock-req-res";

import { Indiekit } from "../../../index.js";
import { locals } from "../../../lib/middleware/locals.js";

/**
 * Create a request from a given host
 * @param {string} host - Host
 * @returns {Request} Express request
 */
const requestFrom = (host) =>
  mockRequest({
    accepts: () => false,
    app: { locals: {} },
    headers: { host },
    protocol: "http",
  });

/**
 * Create an Indiekit instance from test configuration
 * @returns {Promise<IndiekitInstance>} Indiekit instance
 */
const testIndiekit = async () =>
  Indiekit.initialize({ config: await testConfig() });

describe("indiekit/lib/middleware/locals", () => {
  it("Exposes configuration to frontend templates", async () => {
    const indiekit = await testIndiekit();
    const request = requestFrom("server.example");
    const response = mockResponse({ locals: { getLocale: () => "en" } });
    const next = mock.fn();
    await locals(indiekit)(request, response, next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments.length, 0);
    assert.equal(request.app.locals.application.name, "Test configuration");
    assert.equal(request.app.locals.publication, indiekit.publication);
  });

  it("Displays MongoDB client connection error", async () => {
    const indiekit = await testIndiekit();
    indiekit.mongodbClientError = new Error("test");
    const request = mockRequest({ app: { locals: {} } });
    const response = mockResponse();
    const next = mock.fn();

    await locals(indiekit)(request, response, next);

    assert.equal(request.app.locals.error instanceof Error, true);
  });

  it("Derives application URL from each request", async () => {
    const indiekit = await testIndiekit();
    const response = mockResponse({ locals: { getLocale: () => "en" } });

    await locals(indiekit)(requestFrom("127.0.0.1:3000"), response, mock.fn());
    await locals(indiekit)(requestFrom("localhost:3000"), response, mock.fn());

    // A long-lived `application` object must not let the first request fix the
    // host used by every response after it.
    assert.equal(indiekit.config.application.url, "http://localhost:3000");
  });

  it("Prefers a configured application URL over the request", async () => {
    const indiekit = await testIndiekit();
    indiekit.applicationUrl = "https://server.example";
    const response = mockResponse({ locals: { getLocale: () => "en" } });

    await locals(indiekit)(requestFrom("127.0.0.1:3000"), response, mock.fn());

    assert.equal(indiekit.config.application.url, "https://server.example");
  });

  it("Throws error exposing configuration to frontend templates", async () => {
    const indiekit = await testIndiekit();
    const request = mockRequest();
    const response = mockResponse();
    const next = mock.fn();
    await locals(indiekit)(request, response, next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments[0] instanceof Error, true);
  });
});

/**
 * @import { Request } from "express"
 */
