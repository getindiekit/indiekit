import { createHash } from "node:crypto";
import process from "node:process";
import test from "ava";
import jwt from "jsonwebtoken";
import { findBearerToken, signToken, verifyToken } from "../../lib/token.js";

const sha256 = createHash("sha256").update("foo").digest("hex");
const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

test.beforeEach((t) => {
  process.env.SECRET = "secret";
  process.env.WEBHOOK_SECRET = "webhook-secret";
  t.context = {
    bearerToken: jwt.sign(
      { me: "https://website.example" },
      process.env.SECRET
    ),
    signature: jwt.sign({ iss: "netlify", sha256 }, process.env.WEBHOOK_SECRET),
  };
});

test("Returns bearer token from `X-Webhook-Signature` header", (t) => {
  const request = {
    body: { url: "https://website.example" },
    headers: { "x-webhook-signature": t.context.signature },
  };
  const result = findBearerToken(request);

  t.true(result.startsWith(jwtHeader));
});

test("Returns bearer token from `body.access_token`", (t) => {
  const request = { body: { access_token: t.context.bearerToken } };
  const result = findBearerToken(request);

  t.true(result.startsWith(jwtHeader));
});

test("Returns bearer token from query", (t) => {
  const request = { query: { token: t.context.bearerToken } };
  const result = findBearerToken(request);

  t.true(result.startsWith(jwtHeader));
});

test("Throws error if no bearer token provided by request", (t) => {
  t.throws(
    () => {
      findBearerToken({});
    },
    {
      name: "InvalidRequestError",
      message: "No bearer token provided by request",
    }
  );
});

test("Signs token", (t) => {
  const result = signToken({ foo: "bar" });

  t.true(result.startsWith(jwtHeader));
});

test("Verifies signed token", (t) => {
  const result = verifyToken(t.context.signature);

  t.truthy(result.iat);
  t.is(result.iss, "netlify");
  t.is(result.sha256, sha256);
});
