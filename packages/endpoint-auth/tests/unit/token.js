import process from "node:process";
import test from "ava";
import { signToken, verifyToken } from "../../lib/token.js";

test.beforeEach(() => {
  process.env.SECRET = "test";
});

test("Signs token", (t) => {
  const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const result = signToken({ foo: "bar" });

  t.true(result.startsWith(jwtHeader));
});

test("Verifies signed token", (t) => {
  const signedToken = signToken({ foo: "bar" });
  const result = verifyToken(signedToken);

  t.is(result.foo, "bar");
  t.truthy(result.exp);
  t.truthy(result.iat);
});
