import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import jwt from "jsonwebtoken";

import { signToken, verifyToken } from "../../lib/token.js";

describe("endpoint-auth/lib/token", () => {
  process.env.SECRET = "test";

  it("Signs token", () => {
    const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const result = signToken({ foo: "bar" });

    assert.equal(result.startsWith(jwtHeader), true);
  });

  it("Verifies signed token", () => {
    const signedToken = signToken({ foo: "bar" });
    const result = verifyToken(signedToken);

    assert.equal(result.foo, "bar");
    assert.ok(result.exp);
    assert.ok(result.iat);
  });

  it("Throws error verifying token with a string payload", () => {
    const signedToken = jwt.sign("foo", "test");

    assert.throws(() => verifyToken(signedToken), {
      name: "JsonWebTokenError",
      message: "Token payload is not an object",
    });
  });
});
