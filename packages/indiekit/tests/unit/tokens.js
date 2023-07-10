import test from "ava";
import { mockAgent } from "@indiekit-test/mock-agent";
import {
  findBearerToken,
  introspectToken,
  verifyTokenValues,
} from "../../lib/token.js";

await mockAgent("indiekit");

test.beforeEach((t) => {
  t.context = {
    bearerToken: "JWT",
    me: "https://website.example",
    introspectionEndpoint: "https://token-endpoint.example/introspect",
  };
});

test("Returns bearer token from session", (t) => {
  const request = { session: { access_token: t.context.bearerToken } };
  const result = findBearerToken(request);

  t.is(result, "JWT");
});

test("Returns bearer token from `headers.authorization`", (t) => {
  const request = {
    headers: { authorization: `Bearer ${t.context.bearerToken}` },
  };
  const result = findBearerToken(request);

  t.is(result, "JWT");
});

test("Returns bearer token from `body.access_token`", (t) => {
  const request = { body: { access_token: t.context.bearerToken } };
  const result = findBearerToken(request);

  t.is(result, "JWT");
});

test("Returns bearer token from query", (t) => {
  const request = { query: { token: t.context.bearerToken } };
  const result = findBearerToken(request);

  t.is(result, "JWT");
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

test("Requests an access token", async (t) => {
  const result = await introspectToken(
    t.context.introspectionEndpoint,
    t.context.bearerToken
  );

  t.true(result.active);
  t.is(result.me, "https://website.example");
  t.is(result.scope, "create");
});

test("Token endpoint refuses to grant an access token", async (t) => {
  const result = await introspectToken(
    t.context.introspectionEndpoint,
    "invalid"
  );

  t.false(result.active);
});

test("Throws error contacting token endpoint", async (t) => {
  await t.throwsAsync(
    introspectToken(
      `${t.context.introspectionEndpoint}/token`,
      t.context.bearerToken
    ),
    {
      name: "NotFoundError",
      message: "Not Found",
    }
  );
});

test("Verifies an access token", (t) => {
  const result = verifyTokenValues(t.context.me, {
    me: "https://website.example",
    scope: "create update delete media",
  });

  t.is(result.me, "https://website.example");
});
