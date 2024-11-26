import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import {
  findBearerToken,
  introspectToken,
  verifyTokenValues,
} from "../../lib/token.js";

await mockAgent("indiekit");
const token = "JWT";
const me = "https://website.example";
const introspectionEndpoint = "https://token-endpoint.example/introspect";

describe("indiekit/lib/tokens", () => {
  it("Returns bearer token from session", () => {
    const request = { session: { access_token: token } };
    const result = findBearerToken(request);

    assert.equal(result, "JWT");
  });

  it("Returns bearer token from `headers.authorization`", () => {
    const request = {
      headers: { authorization: `Bearer ${token}` },
    };
    const result = findBearerToken(request);

    assert.equal(result, "JWT");
  });

  it("Returns bearer token from `body.access_token`", () => {
    const request = { body: { access_token: token } };
    const result = findBearerToken(request);

    assert.equal(result, "JWT");
  });

  it("Returns bearer token from query", () => {
    const request = { query: { token } };
    const result = findBearerToken(request);

    assert.equal(result, "JWT");
  });

  it("Throws error if no bearer token provided by request", () => {
    assert.throws(
      () => {
        findBearerToken({});
      },
      {
        name: "InvalidRequestError",
        message: "No bearer token provided by request",
      },
    );
  });

  it("Requests an access token", async () => {
    const result = await introspectToken(introspectionEndpoint, token);

    assert.equal(result.active, true);
    assert.equal(result.me, "https://website.example");
    assert.equal(result.scope, "create");
  });

  it("Token endpoint refuses to grant an access token", async () => {
    const result = await introspectToken(introspectionEndpoint, "invalid");

    assert.equal(result.active, false);
  });

  it("Throws error contacting token endpoint", async () => {
    await assert.rejects(
      introspectToken(`${introspectionEndpoint}/token`, token),
      {
        name: "NotFoundError",
        message: "Not Found",
      },
    );
  });

  it("Verifies an access token", () => {
    const result = verifyTokenValues(me, {
      me: "https://website.example",
      scope: "create update delete media",
    });

    assert.equal(result.me, "https://website.example");
  });
});
