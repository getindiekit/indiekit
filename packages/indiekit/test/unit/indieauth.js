import { strict as assert } from "node:assert";
import { before, describe, it, mock } from "node:test";

import { IndiekitError } from "@indiekit/error";
import { mockAgent } from "@indiekit-test/mock-agent";
import { mockRequest, mockResponse } from "mock-req-res";

import { IndieAuth } from "../../lib/indieauth.js";

await mockAgent("indiekit");
const me = "https://website.example";
const indieauth = new IndieAuth({ me });

describe("indiekit/lib/indieauth", () => {
  before(async () => {
    process.env.PASSWORD_SECRET = "foo";
  });

  it("Exchanges authorization code for access token", async () => {
    const result = await indieauth.authorizationCodeGrant(
      "https://token-endpoint.example",
      "code",
    );

    assert.equal(result.access_token, "token");
  });

  it("Throws error exchanging invalid code for access token", async () => {
    await assert.rejects(
      indieauth.authorizationCodeGrant(
        "https://token-endpoint.example",
        "foobar",
      ),
      {
        message: "The code provided was not valid",
      },
    );
  });

  it("Throws error exchanging authorization code during request", async () => {
    await assert.rejects(
      indieauth.authorizationCodeGrant("https://token-endpoint.example", "404"),
      {
        message: "Not Found",
      },
    );
  });

  it("Checks if user is authenticated", async () => {
    const request = mockRequest({
      app: {
        locals: {
          application: {
            introspectionEndpoint: "https://token-endpoint.example/introspect",
          },
        },
      },
      headers: { authorization: `Bearer JWT` },
      session: {},
    });
    const response = mockResponse();
    const next = mock.fn();
    await indieauth.authenticate()(request, response, next);

    assert.equal(request.session.access_token, "JWT");
    assert.equal(request.session.scope, "create");
    assert.equal(next.mock.calls.length, 1);
  });

  it("Development mode bypasses authentication", async () => {
    process.env.NODE_ENV = "development";
    const indieauth = new IndieAuth({ devMode: true, me });
    const request = mockRequest({
      app: {
        locals: {
          application: {
            introspectionEndpoint: "https://token-endpoint.example/introspect",
          },
        },
      },
      session: {},
    });
    const response = mockResponse();
    const next = mock.fn();
    await indieauth.authenticate()(request, response, next);

    assert.equal(request.session.access_token, process.env.NODE_ENV);
    assert.equal(request.session.scope, "create update delete media");
    assert.equal(next.mock.calls.length, 1);
  });

  it("Throws error authenticating invalid token", async () => {
    const request = mockRequest({
      app: {
        locals: {
          application: {
            introspectionEndpoint: "https://token-endpoint.example/introspect",
          },
        },
      },
      headers: { authorization: "Bearer invalid" },
      method: "POST",
      session: {},
    });
    const response = mockResponse({
      locals: { __() {} },
    });
    const next = mock.fn();
    await indieauth.authenticate()(request, response, next);
    const result = next.mock.calls[0].arguments[0];

    assert.equal(result instanceof IndiekitError, true);
    assert.equal(result.code, "unauthorized");
    assert.equal(result.status, 401);
  });

  it("Throws error authenticating token with URL mismatch", async () => {
    const request = mockRequest({
      app: {
        locals: {
          application: {
            introspectionEndpoint: "https://token-endpoint.example/introspect",
          },
        },
      },
      headers: { authorization: "Bearer another" },
      method: "POST",
      session: {},
    });
    const response = mockResponse({
      locals: { __() {} },
    });
    const next = mock.fn();
    await indieauth.authenticate()(request, response, next);
    const result = next.mock.calls[0].arguments[0];

    assert.equal(result instanceof IndiekitError, true);
    assert.equal(result.code, "forbidden");
    assert.equal(result.status, 403);
  });

  it("Throws error checking if user is authenticated", async () => {
    const request = mockRequest({
      app: { locals: { publication: {} } },
      method: "post",
      session: {},
    });
    const response = mockResponse();
    const next = mock.fn();
    await indieauth.authenticate()(request, response, next);
    const result = next.mock.calls[0].arguments[0];

    assert.equal(result instanceof Error, true);
  });

  it("Throws error redirecting user to IndieAuth login", async () => {
    const request = mockRequest({
      query: { redirect: "/status" },
    });
    const response = mockResponse({
      locals: {
        __: () => ({ session: {} }),
        application: { url: "http://localhost" },
      },
    });
    await indieauth.login()(request, response);

    assert.equal(response.status.calledWith(401), true);
    assert.equal(response.render.calledWith("session/login"), true);
  });

  it("Throws error authorizing returned credentials", async () => {
    const request = mockRequest({
      app: { locals: { publication: {} } },
      query: { code: "", state: "" },
    });
    const response = mockResponse({
      locals: { __: () => ({ session: {} }) },
    });
    await indieauth.authorize()(request, response);

    assert.equal(response.status.calledWith(400), true);
    assert.equal(response.render.calledWith("session/login"), true);
  });
});
