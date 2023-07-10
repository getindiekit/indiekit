import process from "node:process";
import { IndiekitError } from "@indiekit/error";
import test from "ava";
import sinon from "sinon";
import mockReqRes from "mock-req-res";
import { mockAgent } from "@indiekit-test/mock-agent";
import { IndieAuth } from "../../lib/indieauth.js";

await mockAgent("indiekit");

const { mockRequest, mockResponse } = mockReqRes;
const indieauth = new IndieAuth({
  me: "https://website.example",
});

test.beforeEach((t) => {
  t.context = {
    access_token: "JWT",
    me: "https://website.example",
    scope: "create",
    token_type: "Bearer",
  };
});

test("Exchanges authorization code for access token", async (t) => {
  const result = await indieauth.authorizationCodeGrant(
    "https://token-endpoint.example",
    "code"
  );

  t.is(result.access_token, "token");
});

test("Throws error exchanging invalid code for access token", async (t) => {
  await t.throwsAsync(
    indieauth.authorizationCodeGrant(
      "https://token-endpoint.example",
      "foobar"
    ),
    {
      message: "The code provided was not valid",
    }
  );
});

test("Throws error exchanging authorization code during request", async (t) => {
  await t.throwsAsync(
    indieauth.authorizationCodeGrant("https://token-endpoint.example", "404"),
    {
      message: "Not Found",
    }
  );
});

test("Checks if user is authenticated", async (t) => {
  const request = mockRequest({
    app: {
      locals: {
        application: {
          introspectionEndpoint: "https://token-endpoint.example/introspect",
        },
      },
    },
    headers: { authorization: `Bearer ${t.context.access_token}` },
    session: {},
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authenticate()(request, response, next);

  t.is(request.session.access_token, t.context.access_token);
  t.is(request.session.scope, t.context.scope);
  t.true(next.calledOnce);
});

test("Development mode bypasses authentication", async (t) => {
  const indieauth = new IndieAuth({
    devMode: true,
    me: "https://website.example",
  });

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
  const next = sinon.spy();

  await indieauth.authenticate()(request, response, next);

  t.is(request.session.access_token, process.env.NODE_ENV);
  t.is(request.session.scope, "create update delete media");
  t.true(next.calledOnce);
});

test("Throws error authenticating invalid token", async (t) => {
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
  const next = sinon.spy();

  await indieauth.authenticate()(request, response, next);

  t.true(next.firstCall.args[0] instanceof IndiekitError);
  t.is(next.firstCall.args[0].code, "unauthorized");
  t.is(next.firstCall.args[0].status, 401);
});

test("Throws error authenticating token with URL mismatch", async (t) => {
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
  const next = sinon.spy();

  await indieauth.authenticate()(request, response, next);

  t.true(next.firstCall.args[0] instanceof IndiekitError);
  t.is(next.firstCall.args[0].code, "forbidden");
  t.is(next.firstCall.args[0].status, 403);
});

test("Throws error checking if user is authenticated", async (t) => {
  const request = mockRequest({
    app: { locals: { publication: {} } },
    method: "post",
    session: {},
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authenticate()(request, response, next);

  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof Error);
});

test("Throws error redirecting user to IndieAuth login", async (t) => {
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

  t.true(response.status.calledWith(401));
  t.true(response.render.calledWith("session/login"));
});

test("Throws error authorizing returned credentials", async (t) => {
  const request = mockRequest({
    app: { locals: { publication: {} } },
    query: { code: "", state: "" },
  });
  const response = mockResponse({
    locals: { __: () => ({ session: {} }) },
  });

  await indieauth.authorize()(request, response);

  t.true(response.status.calledWith(400));
  t.true(response.render.calledWith("session/login"));
});
