import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { describe, it } from "node:test";

import jwt from "jsonwebtoken";

import { findBearerToken, signToken, verifyToken } from "../../lib/token.js";

describe("endpoint-syndicate/lib/token", () => {
  process.env.SECRET = "secret";
  process.env.WEBHOOK_SECRET = "webhook-secret";

  const sha256 = createHash("sha256").update("foo").digest("hex");
  const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const token = jwt.sign({ me: "https://website.example" }, process.env.SECRET);
  const signature = jwt.sign(
    { iss: "netlify", sha256 },
    process.env.WEBHOOK_SECRET,
  );

  it("Returns bearer token from `X-Webhook-Signature` header", () => {
    const request = {
      body: { url: "https://website.example" },
      headers: { "x-webhook-signature": signature },
    };
    const result = findBearerToken(request);

    assert.equal(result.startsWith(jwtHeader), true);
  });

  it("Returns bearer token from `body.access_token`", () => {
    const request = { body: { access_token: token } };
    const result = findBearerToken(request);

    assert.equal(result.startsWith(jwtHeader), true);
  });

  it("Returns bearer token from query", () => {
    const request = { query: { token } };
    const result = findBearerToken(request);

    assert.equal(result.startsWith(jwtHeader), true);
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

  it("Signs token", () => {
    const result = signToken({ foo: "bar" }, "");

    assert.equal(result.startsWith(jwtHeader), true);
  });

  it("Verifies signed token", () => {
    const result = verifyToken(signature);

    assert.ok(result.iat);
    assert.equal(result.iss, "netlify");
    assert.equal(result.sha256, sha256);
  });
});
