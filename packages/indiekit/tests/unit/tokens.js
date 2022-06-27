import test from "ava";
import { setGlobalDispatcher } from "undici";
import { tokenEndpointAgent } from "@indiekit-test/mock-agent";
import {
  findBearerToken,
  requestAccessToken,
  verifyAccessToken,
} from "../../lib/tokens.js";

setGlobalDispatcher(tokenEndpointAgent());

test.beforeEach((t) => {
  t.context = {
    accessToken: {
      me: "https://website.example",
      scope: "create update delete media",
    },
    bearerToken: "JWT",
    me: "https://website.example",
    tokenEndpoint: "https://token-endpoint.example",
  };
});

test("Returns bearer token from session", (t) => {
  const request = { session: { token: t.context.bearerToken } };

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
  const result = await requestAccessToken(
    t.context.tokenEndpoint,
    t.context.bearerToken
  );

  t.is(result.me, "https://website.example");
  t.is(result.scope, "create");
});

test("Token endpoint refuses to grant an access token", async (t) => {
  await t.throwsAsync(requestAccessToken(t.context.tokenEndpoint, "foo"), {
    name: "InvalidRequestError",
    message: "The token provided was malformed",
  });
});

test("Throws error contacting token endpoint", async (t) => {
  await t.throwsAsync(
    requestAccessToken(
      `${t.context.tokenEndpoint}/token`,
      t.context.bearerToken
    ),
    {
      name: "NotFoundError",
      message: "Not Found",
    }
  );
});

test("Verifies an access token", (t) => {
  const result = verifyAccessToken(t.context.me, t.context.accessToken);

  t.is(result.me, "https://website.example");
});

test("Throws error verifying access token without permissions", (t) => {
  t.throws(
    () => {
      verifyAccessToken("https://another.example", t.context.accessToken);
    },
    {
      name: "ForbiddenError",
      message: "Publication URL does not match that provided by access token",
    }
  );
});

test("Throws error verifying incomplete access token", (t) => {
  t.throws(
    () => {
      verifyAccessToken(t.context.me, {});
    },
    {
      name: "UnauthorizedError",
      message: "There was a problem with this access token",
    }
  );
});
