import process from "node:process";
import test from "ava";
import sinon from "sinon";
import mockReqRes from "mock-req-res";
import { setGlobalDispatcher } from "undici";
import { tokenEndpointAgent } from "@indiekit-test/mock-agent";
import { IndieAuth } from "../../lib/indieauth.js";

setGlobalDispatcher(tokenEndpointAgent());

const { mockRequest, mockResponse } = mockReqRes;
const indieauth = new IndieAuth({
  me: "https://website.example",
});

test.beforeEach((t) => {
  t.context = {
    accessToken: {
      me: "https://website.example",
      scope: "create",
    },
    bearerToken: "JWT",
    me: "https://website.example",
  };
});

test("Throws error getting authentication URL", async (t) => {
  await t.throwsAsync(
    indieauth.getAuthUrl("https://indieauth.com/auth", null, "state"),
    {
      message: "You need to provide some scopes",
    }
  );
});

test("Exchanges authorization code for access token", async (t) => {
  const result = await indieauth.authorizationCodeGrant(
    "https://token-endpoint.example",
    "code"
  );

  t.is(result, "token");
});

test("Throws error exchanging authorization code for invalid access token", async (t) => {
  await t.throwsAsync(
    indieauth.authorizationCodeGrant("https://token-endpoint.example", "code"),
    {
      message: "The token endpoint did not return the expected parameters",
    }
  );
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
    indieauth.authorizationCodeGrant("https://token-endpoint.example", "code"),
    {
      message: "Not Found",
    }
  );
});

test("Checks if user is authorized", async (t) => {
  const request = mockRequest({
    app: {
      locals: {
        application: {},
        publication: {
          tokenEndpoint: "https://token-endpoint.example",
        },
      },
    },
    headers: { authorization: `Bearer ${t.context.bearerToken}` },
    session: {},
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authorise()(request, response, next);

  t.is(request.session.scope, t.context.accessToken.scope);
  t.is(request.session.token, t.context.bearerToken);
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
        publication: {
          tokenEndpoint: "https://token-endpoint.example",
        },
      },
    },
    session: {},
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authorise()(request, response, next);

  t.is(request.session.scope, "create update delete media");
  t.is(request.session.token, process.env.NODE_ENV);
  t.true(next.calledOnce);
});

test("Throws error checking if user is authorized", async (t) => {
  const request = mockRequest({
    app: { locals: { publication: {} } },
    method: "post",
    session: {},
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authorise()(request, response, next);

  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof Error);
});

test("Throws error redirecting user to IndieAuth login", async (t) => {
  const request = mockRequest({
    query: { redirect: "/status" },
  });
  const response = mockResponse({
    __: () => ({ session: {} }),
    locals: { application: { url: "http://localhost" } },
  });

  await indieauth.login()(request, response);

  t.true(response.status.calledWith(401));
  t.true(response.render.calledWith("session/login"));
});

test("Throws error checking credentials returned by IndieAuth", async (t) => {
  const request = mockRequest({
    app: { locals: { publication: {} } },
    query: { code: "", state: "" },
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authenticate()(request, response, next);

  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof Error);
});
